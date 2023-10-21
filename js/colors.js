const colorSchemes = [
    '0x002c4f',
    '0x004B3D',
    '0xA51C30',
];

let activeColorScheme = Math.floor(Math.random() * colorSchemes.length);
let activeColor = `#${colorSchemes[activeColorScheme].substring(2)}`;


function shadeColorToAlmostWhite(hexColor, factor) {
    hexColor = hexColor.replace(/^#/, '');
  
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
  
    // Calculate the new RGB values by adding the factor to each channel
    const newR = r + (255 - r) * factor;
    const newG = g + (255 - g) * factor;
    const newB = b + (255 - b) * factor;
  
    // Convert the new RGB values back to hexadecimal
    let res = `#${Math.round(newR).toString(16)}${Math.round(newG).toString(16)}${Math.round(newB).toString(16)}`;
    return res
}
