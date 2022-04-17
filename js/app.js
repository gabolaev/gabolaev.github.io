const TYPING_SPEED = 70
const DEFAULT_DELAY = 100

function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start)
}

function createCursor(refElement) {
    const cursor = refElement.insertBefore(document.createElement("span"), null);
    cursor.id = "cursor";
    cursor.className = "cursor";
    cursor.style.fontSize = refElement.style.fontSize;
    cursor.innerHTML = "|";
}

function removeCursor() {
    const curs = document.getElementsByClassName("cursor");
    while (curs.length > 0) {
        curs[0].parentNode.removeChild(curs[0]);
    }
}

function renderTypeWriterText(text, element, resolve, index = 0) {
    removeCursor()
    if (index !== text.length) {
        element.innerHTML += text.charAt(index);
        createCursor(element);
        setTimeout(
            renderTypeWriterText, TYPING_SPEED + randomInRange(-5, 3),
            text, element, resolve, ++index,
        )
    } else {
        resolve()
    }
}

function renderText(element, resolve, text, delay) {
    setTimeout(
        renderTypeWriterText, delay,
        text, element, resolve,
    )
}

function run(...stages) {
    let wait = stages[0]();
    if (stages.length !== 1) {
        wait.then(() => {
            run(...stages.slice(1))
        })
    }
}

function prepareStageElement(parentClassName, className, elementType, withCursor = true) {
    const element = document.createElement(elementType);
    element.className = className;
    if (withCursor) {
        createCursor(element);
    }
    (
        document.querySelector("." + parentClassName) ||
        document.body
    ).appendChild(element)
    return element
}

function text(parentClassName, className, elementType, text, delay = DEFAULT_DELAY) {
    return () => {
        let element = prepareStageElement(parentClassName, className, elementType)
        return new Promise((resolve, _) => {
            renderText(element, resolve, text, delay)
        })
    }
}

function custom(parentClassName, className, elementType, f, withCursor = true) {
    return () => {
        return new Promise(f(prepareStageElement(parentClassName, className, elementType, withCursor)))
    }
}

run(
    text("body", "hello", "div", "hello,", 2000),
    text("body", "engineer", "div", "i am a software engineer at ", 700),
    text("engineer", "tinkoff", "span", "Tinkoff Investments", 250),
    text("body", "ninja", "div", "also i am 忍者 dev at ", 1000),
    text("ninja", "kuji", "span", "KUJI Podcast", 250),
    text("body", "about-me", "div", "i left my digital footprints here", 700),
    custom("body", "links", "div",
        (element) => {
            return (resolve, _) => {
                const linksMapping = [
                    ["static/tg.png", "https://t.me/gabolaev"],
                    ["static/ln.png", "https://www.linkedin.com/in/gabolaev"],
                    ["static/gh.png", "https://github.com/gabolaev"],
                    ["static/sp.png", "https://open.spotify.com/user/gabolaev"],
                    ["static/lb.png", "https://letterboxd.com/gabolaev"],
                    ["static/ig.png", "https://www.instagram.com/gabolaev"],
                    ["static/fb.png", "https://fb.com/gabolaev"],
                ]

                function renderLink(index = 0) {
                    if (index === linksMapping.length) {
                        resolve()
                        return
                    }
                    element.innerHTML += `<a href="${linksMapping[index][1]}"><img src="${linksMapping[index][0]}"></a>`
                    setTimeout(renderLink, 0, ++index)
                }

                renderLink()
            }
        },
        false // No caret needed here
    ),
    custom("body", "email-me", "a",
        (element) => {
            return (resolve, _) => {
                element.href = "mailto:george@gabolaev.com";
                renderText(element, resolve, "email me", 2000)
            }
        },
    ),
    text("body", "btw", "div", "btw, my name is george", 10000),
    text("body", "btw", "div", "so, what are you waiting for?", 10000),
    text("body", "btw", "div", "there is nothing more to see here...", 20000),
    text("body", "btw", "div", "i swear :)", 1000),
    text("body", "btw", "div", "i hope you have a great day!", 1000),
)