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
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 1.00,
    minWidth: 4.00,
    blurFactor: 0.6,
    zoom: window.screen.availHeight * 0.0005,
    highlightColor: 0x000000,
    midtoneColor: Number(colorSchemes[activeColorScheme]),
    lowlightColor: 0x000000,
    baseColor: 0x000000,
})