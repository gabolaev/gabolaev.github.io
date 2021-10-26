const TYPING_SPEED = 50

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
        setTimeout(
            renderTypeWriterText,
            speed = 1000,
            text = "i am george!",
            selector = ".hello",
            speed = TYPING_SPEED,
            resolve,
        );
    });


    helloRender.then(() => {
        const ninja = document.createElement("div");
        ninja.className = "ninja"
        document.body.appendChild(ninja)

        let ninjaRender = new Promise((resolve, _) => {
            setTimeout(
                renderTypeWriterText,
                speed = 1000,
                text = "忍者 dev at ",
                selector = ".ninja",
                speed = TYPING_SPEED,
                resolve,
            );
        })

        ninjaRender.then(() => {
            const ninjaJob = document.createElement("span");
            ninjaJob.className = "kuji"
            ninja.appendChild(ninjaJob)

            let ninjaJobRender = new Promise((resolve, _) => {
                setTimeout(
                    renderTypeWriterText,
                    speed = 100,
                    text = "KUJI Podcast",
                    selector = ".kuji",
                    speed = TYPING_SPEED,
                    resolve,
                );
            });

            ninjaJobRender.then(() => {
                const engineer = document.createElement("div");
                engineer.className = "engineer";
                document.body.appendChild(engineer)

                let engineerRender = new Promise((resolve, _) => {
                    setTimeout(
                        renderTypeWriterText,
                        speed = 1000,
                        text = "software engineer at ",
                        selector = ".engineer",
                        speed = TYPING_SPEED,
                        resolve,
                    );
                });

                engineerRender.then(() => {
                    const jobSubtitle = document.createElement("span");
                    jobSubtitle.className = "job_title"
                    jobSubtitle.style = "color: #ffdd2d"
                    engineer.appendChild(jobSubtitle);

                    setTimeout(
                        renderTypeWriterText,
                        speed = 0,
                        text = "Tinkoff Investments",
                        selector = ".job_title",
                        speed = TYPING_SPEED,
                        () => {},
                    );

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
                            ["static/tg.png", "https://t.me/gabolaev"],
                            ["static/cv.png", "https://gitconnected.com/gabolaev/resume"],
                            ["static/bl.png", "https://t.me/verbosegeorge"],
                            ["static/gh.png", "https://github.com/gabolaev"],
                            ["static/ln.png", "https://www.linkedin.com/in/gabolaev"],
                            ["static/ig.png", "https://www.instagram.com/gabolaev"],
                            ["static/fb.png", "https://fb.com/gabolaev"],
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
                            writeMe.href = "mailto:george@gabolaev.com";
                            document.body.appendChild(writeMe);

                            setTimeout(
                                renderTypeWriterText,
                                speed = 300,
                                text = "want to tell me something?",
                                selector = ".write-me",
                                speed = TYPING_SPEED,
                                () => {},
                            );
                        });
                    });
                });
            });
        });
    });
}