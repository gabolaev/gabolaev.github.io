#!/usr/bin/env python3
"""Build the site's image assets from the originals in gallery/.

    python3 tools/build.py

Does three things:
  1. resizes gallery/* into web-sized copies in img/gallery/
  2. rewrites the photo manifest in index.html, palettes included
  3. regenerates img/og.jpg (the social card) from the newest photo

Originals stay untouched. Re-run after adding or removing photos.
macOS only: uses the built-in sips and qlmanage.
"""

import base64
import pathlib
import re
import struct
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "gallery"
DST = ROOT / "img" / "gallery"
INDEX = ROOT / "index.html"
OG = ROOT / "img" / "og.jpg"
TMP = ROOT / "tools" / ".build"

LONG_EDGE = 2400          # covers the ~1000 css px frame at 2x DPR
QUALITY = 85
THUMB_EDGE = 480          # contact-sheet cells are ~190 css px at most
THUMB_QUALITY = 70
SWATCHES = 6              # colours in the strip under the photo
EXTS = {".jpg", ".jpeg", ".png", ".heic"}

PAPER, INK, QUIET = "#ffffff", "#111110", "#8c8c88"
SANS = "Helvetica Neue, Helvetica, Arial, sans-serif"


def sips(*args):
    return subprocess.run(["sips", *map(str, args)], check=True, capture_output=True, text=True)


def dimensions(path):
    out = sips("-g", "pixelWidth", "-g", "pixelHeight", path).stdout
    return (int(re.search(r"pixelWidth:\s*(\d+)", out).group(1)),
            int(re.search(r"pixelHeight:\s*(\d+)", out).group(1)))


# ── Palette ──────────────────────────────────────────────────────────────
# sips can emit an uncompressed BMP, which is simple enough to decode by
# hand — so the palette comes from the real pixels with no image library.

def pixels(path, edge=56):
    TMP.mkdir(parents=True, exist_ok=True)
    bmp = TMP / "swatch.bmp"
    sips("-Z", edge, "-s", "format", "bmp", path, "--out", bmp)
    d = bmp.read_bytes()

    offset, = struct.unpack_from("<I", d, 10)
    width, = struct.unpack_from("<i", d, 18)
    height, = struct.unpack_from("<i", d, 22)
    depth, = struct.unpack_from("<H", d, 28)
    step = depth // 8
    stride = (width * step + 3) // 4 * 4

    out = []
    for row in range(abs(height)):
        base = offset + row * stride
        for col in range(width):
            i = base + col * step
            out.append((d[i + 2], d[i + 1], d[i]))     # BMP stores BGR
    return out


def luma(c):
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]


def palette(path, k=SWATCHES, iterations=16):
    """k-means over the pixels, seeded deterministically so a photo always
    yields the same strip."""
    px = pixels(path)
    step = max(1, len(px) // 1500)
    px = px[::step]

    ordered = sorted(px, key=luma)
    centres = [ordered[int((i + .5) * len(ordered) / k)] for i in range(k)]

    for _ in range(iterations):
        buckets = [[] for _ in range(k)]
        for p in px:
            best, best_d = 0, None
            for c, q in enumerate(centres):
                d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2
                if best_d is None or d < best_d:
                    best, best_d = c, d
            buckets[best].append(p)

        moved = [tuple(sum(ch) // len(b) for ch in zip(*b)) if b else centres[i]
                 for i, b in enumerate(buckets)]
        if moved == centres:
            break
        centres = moved

    centres.sort(key=luma)
    return ["#%02x%02x%02x" % c for c in centres]


# ── Steps ────────────────────────────────────────────────────────────────

def derive():
    """Resize each original into img/gallery/. Returns [(stem, w, h, palette)]."""
    DST.mkdir(parents=True, exist_ok=True)

    originals = sorted(
        p for p in SRC.iterdir()
        if p.is_file() and not p.name.startswith(".") and p.suffix.lower() in EXTS
    )
    if not originals:
        sys.exit(f"no photos found in {SRC}")

    # two originals sharing a stem (foo.jpg / foo.jpeg) would collide on output
    seen, chosen = set(), []
    for p in originals:
        if p.stem.lower() in seen:
            print(f"  skip {p.name} (duplicate stem of an earlier file)")
            continue
        seen.add(p.stem.lower())
        chosen.append(p)

    photos, keep = [], set()
    for p in chosen:
        full = DST / f"{p.stem}.jpg"
        thumb = DST / f"{p.stem}-t.jpg"
        keep.update({full.name, thumb.name})

        for out, edge, q in ((full, LONG_EDGE, QUALITY), (thumb, THUMB_EDGE, THUMB_QUALITY)):
            if not out.exists() or out.stat().st_mtime < p.stat().st_mtime:
                sips("-Z", edge, "-s", "format", "jpeg",
                     "-s", "formatOptions", q, p, "--out", out)
                print(f"  {p.name} -> {out.name} ({out.stat().st_size // 1024} KB)")

        photos.append((p.stem, *dimensions(full), palette(full)))

    # match on full filename, not stem — "<stem>-t" is not a stale photo
    for stale in DST.glob("*.jpg"):
        if stale.name not in keep:
            stale.unlink()
            print(f"  removed stale {stale.name}")

    return photos


def write_manifest(photos):
    entries = ",".join(
        '["%s",%d,%d,[%s]]' % (s, w, h, ",".join(f'"{c}"' for c in pal))
        for s, w, h, pal in photos
    )
    html = INDEX.read_text()
    # tolerate whitespace: an editor's formatter may reflow "const G = [ ... ]"
    new, hits = re.subn(r"(/\*photos\*/)\s*const\s+G\s*=\s*\[.*?\]\s*;(/\*/photos\*/)",
                        lambda m: f"{m.group(1)}const G=[{entries}];{m.group(2)}",
                        html, flags=re.S)
    if not hits:
        sys.exit("could not find the /*photos*/ markers in index.html")

    # keep the no-JS fallback and the default aspect pointing at a real photo
    first, fw, fh, _ = photos[0]
    new = re.sub(r'(<noscript><img class="work__img" src="img/gallery/)[^"]+(")',
                 rf"\g<1>{first}.jpg\g<2>", new)
    new = re.sub(r"(\.work\{--ar:)[0-9.]+(\})", rf"\g<1>{fw / fh:.4f}\g<2>", new)

    INDEX.write_text(new)
    print(f"  manifest: {len(photos)} photos, fallback {first}.jpg")


def build_og(photos):
    """Social card: the newest photo, laid out exactly like the page."""
    stem, w, h, pal = max(photos, key=lambda p: (DST / f"{p[0]}.jpg").stat().st_mtime)
    ar = w / h

    ph_h = 352
    ph_w = round(ph_h * ar)
    if ph_w > 620:
        ph_w, ph_h = 620, round(620 / ar)

    # mirrors the page: photo, gap, chipped strip, gap, label
    strip_gap, strip_h, label_gap = 13, 16, 26
    block = ph_h + strip_gap + strip_h + label_gap + 62
    px = (1200 - ph_w) // 2
    py = 285 + (630 - block) // 2
    sy = py + ph_h + strip_gap
    ly = sy + strip_h + label_gap + 13
    lead, right = 19, px + ph_w
    b64 = base64.b64encode((DST / f"{stem}.jpg").read_bytes()).decode()

    def txt(x, y, s, size=11, weight=400, fill=QUIET, anchor="start", track=1.56):
        return (f'<text x="{x}" y="{y}" font-family="{SANS}" font-size="{size}" '
                f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" '
                f'letter-spacing="{track}">{s}</text>')

    svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
        ' width="1200" height="1200" viewBox="0 0 1200 1200">',
        f'<rect width="1200" height="1200" fill="{PAPER}"/>',
        f'<image x="{px}" y="{py}" width="{ph_w}" height="{ph_h}"'
        f' preserveAspectRatio="xMidYMid slice" xlink:href="data:image/jpeg;base64,{b64}"/>',
    ]
    chip = ph_w / len(pal)
    for i, colour in enumerate(pal):
        svg.append(f'<rect x="{px + i * chip:.2f}" y="{sy}" '
                   f'width="{chip + .5:.2f}" height="{strip_h}" fill="{colour}"/>')

    svg += [
        txt(px, ly, "George Gabolaev", size=17, weight=500, fill=INK, track=-.19),
        txt(px, ly + 22, "SENIOR SOFTWARE ENGINEER"),
        txt(px, ly + 22 + lead, "DOCKER, INC"),
    ]
    for i, label in enumerate(["LINKEDIN", "GITHUB", "TELEGRAM", "EMAIL"]):
        svg.append(txt(right, ly + i * lead, label, anchor="end"))
    svg.append("</svg>")

    TMP.mkdir(parents=True, exist_ok=True)
    for f in TMP.glob("*.png"):
        f.unlink()
    src = TMP / "og.svg"
    src.write_text("\n".join(svg))

    subprocess.run(["qlmanage", "-t", "-s", "1200", "-o", str(TMP), str(src)],
                   check=True, capture_output=True)
    if not (TMP / "og.svg.png").exists():
        sys.exit("qlmanage produced no output")
    sips("-c", 630, 1200, "--cropOffset", 285, 0, "-s", "format", "jpeg",
         "-s", "formatOptions", 78, TMP / "og.svg.png", "--out", OG)
    print(f"  og.jpg from {stem}.jpg ({OG.stat().st_size // 1024} KB)")


def main():
    print("photos:")
    photos = derive()
    print("index:")
    write_manifest(photos)
    # The OG card is the one step that needs qlmanage, a QuickLook tool that
    # wants a window server. It is the least reliable thing here and the least
    # important, so a failure warns rather than taking the deploy down.
    print("social card:")
    try:
        build_og(photos)
    except Exception as err:
        print(f"  SKIPPED: {type(err).__name__}: {err}", file=sys.stderr)
        print("  (the previous img/og.jpg is kept)", file=sys.stderr)

    sizes = [(DST / f"{s}.jpg").stat().st_size for s, _, _, _ in photos]
    thumbs = [(DST / f"{s}-t.jpg").stat().st_size for s, _, _, _ in photos]
    print(f"\n{len(photos)} photos, "
          f"{(sum(sizes) + sum(thumbs)) // 1024 // 1024} MB in img/gallery/")
    print(f"  first paint  ~{sum(sizes) // len(sizes) // 1024} KB "
          f"(one photo, largest {max(sizes) // 1024} KB)")
    print(f"  contact sheet ~{sum(thumbs) // 1024} KB total "
          f"({sum(thumbs) // len(thumbs) // 1024} KB average, lazy-loaded)")


if __name__ == "__main__":
    main()
