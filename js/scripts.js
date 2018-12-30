// !!! DISCLAIMER !!!
// I AM NOT FUCKING JS PROGRAMMER AND PLEASE DON'T 
// SEND ME DICKS ONLY BECAUSE I DIDN'T USED SOME JS
// SYNTAX SUGAR OR ANY ANOTHER SHIT
// ALSO I KNOW ABOUT WEBPACK AND BABEL, BUT FUCK...
// THIS IS JUST SINGLE-MOTHERFUCKER-PAGE SITE
// THANK YOU

const TYPING_SPEED = 75

function randomInRange(start, end){
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function renderTypeWriterText(text, selector, speed, resolve, index=0) {
    if (index != text.length) {
        document.querySelector(selector).innerHTML += text.charAt(index);
        setTimeout(
            renderTypeWriterText, 
            speed=speed+randomInRange(-5, 3), 
            text, 
            selector, 
            speed, 
            resolve,
            ++index,
        );
    } else {
        resolve();
    }
}

const hello = document.createElement("div");
hello.className="hello";
document.body.appendChild(hello);

let p1 = new Promise((resolve, _) => {
    renderTypeWriterText(
        text="hello, i am george!", 
        selector=".hello", 
        speed=TYPING_SPEED,
        resolve,
    );
})


p1.then(() => {
    const learnMe = document.createElement("div");
    learnMe.className="learn-me";
    document.body.appendChild(learnMe);

    let p2 = new Promise((resolve, _) => {
        setTimeout(
            renderTypeWriterText,
            speed=500,
            text="about me:", 
            selector=".learn-me", 
            speed=TYPING_SPEED,
            resolve,
        );
    });

    p2.then(() => {

        const linksMapping = [
            ["static/tg.png", "https://t.me/gabolaev"],
            ["static/ln.png", "https://www.linkedin.com/in/gabolaev"],
            ["static/cv.png", "https://visualcv.com/gabolaev"],
            ["static/gh.png", "https://github.com/gabolaev"],
            ["static/ig.png", "https://www.instagram.com/gabolaev"],
            ["static/tw.png", "https://twitter.com/georgegabolaev"],
            ["static/vk.png", "https://vk.com/gabolaev"],
        ];

        const links = document.createElement("div");
        links.className="links";
        document.body.appendChild(links);
        
        let p3 = new Promise((resolve, _) => {
            function recursive(index=0) {
                if (index != linksMapping.length) {
                    links.innerHTML += `<a href="${linksMapping[index][1]}"><img src="${linksMapping[index][0]}"></a>`;
                    setTimeout(recursive, 120, ++index);
                } else {
                    resolve();
                }
            };
            recursive();
        });

        p3.then(() => {
            const writeMe = document.createElement("div");
            writeMe.className="write-me";
            document.body.appendChild(writeMe);
            
            setTimeout(
                renderTypeWriterText,
                speed=300,
                text="should we talk about something?", 
                selector=".write-me", 
                speed=TYPING_SPEED,
                () => {},
            );
        });
    });
})