function reveal(selector) {
    const element = document.querySelector(selector);
    let currentOpacity = 0;
    const targetOpacity = 0.86;
    const duration = 5500;
    const interval = 10;
    const step = ((targetOpacity - currentOpacity) / duration) * interval;

    function increaseOpacity() {
        currentOpacity += step;
        element.style.opacity = currentOpacity;

        if (currentOpacity >= targetOpacity) {
            clearInterval(opacityInterval);
        }
    }

    const opacityInterval = setInterval(increaseOpacity, interval);
}


VANTA.FOG({
    el: ".background",
    mouseControls: true,
    touchControls: true,
    gyroControls: true,
    minHeight: 10.00,
    minWidth: 10.00,
    blurFactor: 1.32,
    zoom: 0.2,
    speed: 0.4,
    highlightColor: 0x000000,
    midtoneColor: 0x000000,
    lowlightColor: Number(colorSchemes[activeColorScheme]),
    baseColor: 0x000000,
})


let el = document.querySelector(".background-text");

const symbols = '⟋⟍___111000'
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const symbolSize = 2;

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function fillScreenWithSymbols() {
    const numSymbolsHorizontally = Math.ceil(screenWidth / symbolSize);
    const numSymbolsVertically = Math.ceil(screenHeight / symbolSize);

    let content = '';
    for (let i = 0; i < numSymbolsVertically; i++) {
        for (let j = 0; j < numSymbolsHorizontally; j++) {
            content += getRandomSymbol();
        }
        content += '<br>'; // Line break to move to the next row
    }

    el.innerHTML = content;
}

fillScreenWithSymbols();
