function adjustColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}

function cleanHex(hex) {
    return hex.replace(`0x`, `#`);
}

const colorSchemes = [
    '0xFFFFFF',
];

let activeColorScheme = Math.floor(Math.random() * colorSchemes.length);
let activeColor = cleanHex(colorSchemes[activeColorScheme]);
let activeColorLight = adjustColor(activeColor, 220);


const lightningSchemes = [
    ['#ff0000', '#00e5ff'],
    ['#0083bf', '#ff0000'],
    ['#0083bf', '#ff4df2'],
]

const activeLightningSchemeId = Math.floor(Math.random() * lightningSchemes.length);

document.querySelector(':root').style.setProperty('--text-shadow', lightningSchemes[activeLightningSchemeId][0]);
document.querySelector(':root').style.setProperty('--dud-shadow', lightningSchemes[activeLightningSchemeId][1]);