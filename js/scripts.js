const TYPING_SPEED = 65

function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function renderTypeWriterText(text, selector, speed, resolve, index = 0) {
    if (index !== text.length) {
        document.querySelector(selector).innerHTML += text.charAt(index);
        setTimeout(
            renderTypeWriterText,
            speed += randomInRange(-5, 3),
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

window.onload = () => {
    const hello = document.createElement("div");
    hello.className = "hello";
    document.body.appendChild(hello);

    let helloRender = new Promise((resolve, _) => {
        renderTypeWriterText(
            text = "i am george!",
            selector = ".hello",
            speed = TYPING_SPEED,
            resolve,
        );
    });


    helloRender.then(() => {
        const developer = document.createElement("div");
        developer.className = "developer";
        document.body.appendChild(developer)

        let developerRender = new Promise((resolve, _) => {
            setTimeout(
                renderTypeWriterText,
                speed = 1000,
                text = "backend developer",
                selector = ".developer",
                speed = -20,
                resolve,
            );
        });

        developerRender.then(() => {
            const mail_logo = document.createElement("img");
            mail_logo.src="static/mrg_red.png";
            mail_logo.className = "mail_logo";
            developer.appendChild(mail_logo);

            const aboutMe = document.createElement("div");
            aboutMe.className = "about-me";
            document.body.appendChild(aboutMe);


            let aboutRender = new Promise((resolve, _) => {
                setTimeout(
                    renderTypeWriterText,
                    speed = 500,
                    text = "showing signs of life at",
                    selector = ".about-me",
                    speed = TYPING_SPEED,
                    resolve,
                );
            });

            aboutRender.then(() => {

                const linksMapping = [
                    ["static/tg.png", "tg://resolve?domain=gabolaev"],
                    ["static/ln.png", "https://www.linkedin.com/in/gabolaev"],
                    ["static/cv.png", "https://gitconnected.com/gabolaev/resume"],
                    ["static/gh.png", "https://github.com/gabolaev"],
                    ["static/ig.png", "https://www.instagram.com/gabolaev"],
                    ["static/tw.png", "https://twitter.com/georgegabolaev"],
                    ["static/vk.png", "https://vk.com/gabolaev"],
                ];

                const links = document.createElement("div");
                links.className = "links";
                document.body.appendChild(links);

                let linksRender = new Promise((resolve, _) => {
                    function recursive(index = 0) {
                        if (index !== linksMapping.length) {
                            links.innerHTML +=
                                `<a href="${linksMapping[index][1]}"><img src="${linksMapping[index][0]}"></a>`;
                            setTimeout(recursive, 120, ++index);
                        } else {
                            resolve();
                        }
                    };
                    recursive();
                });

                linksRender.then(() => {
                    const writeMe = document.createElement("a");
                    writeMe.className = "write-me";
                    writeMe.href = "mailto:gabolaev98@gmail.com";
                    document.body.appendChild(writeMe);

                    setTimeout(
                        renderTypeWriterText,
                        speed = 300,
                        text = "want to tell me something?",
                        selector = ".write-me",
                        speed = TYPING_SPEED,
                        () => { },
                    );
                });
            });
        });
    });
}