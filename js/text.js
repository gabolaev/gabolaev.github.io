class TextScramble {
    constructor(el, color) {
        this.el = el;
        this.color = color;
        this.shadedColor = shadeColorToAlmostWhite(color, 0.2);
        this.chars = `!"#$%&'()*+,-./:;<=>?@[\]^_{|}~ÆæøØ`;
        this.update = this.update.bind(this);
    }
    clear() {
        return this.setText("");
    }
    hardReplace(html) {
        this.el.innerHTML = html.replaceAll("\n", "<br>");
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 50);
            const end = start + Math.floor(Math.random() * 130);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = "";
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.2) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud" style="color:${this.shadedColor};">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output.replaceAll("\n", "<br>");
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