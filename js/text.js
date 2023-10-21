class TextScramble {
    constructor(el, color) {
        this.el = el;
        this.color = color;
        this.shadedColor = shadeColorToAlmostWhite(color, 0.4);
        this.chars = `!"#$%&'()*+,-./:;<=>?@[\]^_{|}~ÆæøØ`;
        this.update = this.update.bind(this);
    }

    clear() {
        return this.setText("");
    }

    hardReplace(html) {
        this.el.innerHTML = html.replace(/\n/g, "<br>");
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => (this.resolve = resolve));
        this.queue = Array.from({ length }, (_, i) => {
            const from = oldText[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 50);
            const end = start + Math.floor(Math.random() * 80);
            return { from, to, start, end, char: null };
        });

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = "";
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            const { from, to, start, end, char } = this.queue[i];
            const randomValue = Math.random();

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                let displayChar = char;

                if (!displayChar || randomValue < 0.1) {
                    displayChar = this.randomChar();
                    this.queue[i].char = displayChar;
                }

                output += `<span class="dud" style="color:${this.shadedColor};">${displayChar}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output.replace(/\n/g, "<br>");

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}
