const TYPING_SPEED = 86
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

function cursorIsOn() {
    return document.querySelector(".cursor") !== null
}

function renderTypeWriterText(text, element, resolve, index = 0) {
    if (index !== text.length) {
        removeCursor()
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
    removeCursor()
    createCursor(element)

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

function prepareStageElement(parentClassName, className, elementType) {
    const element = document.createElement(elementType);
    element.className = className;

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

function custom(parentClassName, className, elementType, f) {
    return () => {
        let element = prepareStageElement(parentClassName, className, elementType)
        return new Promise(f(element))
    }
}

run(
    text("body", "hello", "div", "hello", 3000),
    custom("hello", "waiting", "span", (_) => {
        return (resolve, _) => {
            setTimeout(resolve, 1500)
        }
    }),
    text("body", "engineer", "div", "i am a software engineer at ", 500),
    text("engineer", "tinkoff", "span", "Tinkoff Investments", 200),
    text("body", "ninja", "div", "also i am 忍者 dev at "),
    text("ninja", "kuji", "span", "KUJI Podcast", 200),
    text("body", "about-me", "div", "my digital footprints can be found here", 1000),
    custom("body", "links", "div",
        (element) => {
            return (resolve, _) => {
                removeCursor()
                const linksMapping = [
                    ["static/tg.png", "https://t.me/gabolaev"],
                    ["static/ln.png", "https://www.linkedin.com/in/gabolaev"],
                    ["static/gh.png", "https://github.com/gabolaev"],
                    ["static/sp.png", "https://open.spotify.com/user/gabolaev"],
                    ["static/lb.png", "https://letterboxd.com/gabolaev"],
                    ["static/ig.png", "https://www.instagram.com/gabolaev"],
                    ["static/fb.png", "https://fb.com/gabolaev"],
                ]

                for (i in linksMapping) {
                    element.innerHTML += `<a style="display: none" href="${linksMapping[i][1]}"><img src="${linksMapping[i][0]}"></a>`
                }

                function renderLink(index = 0) {
                    if (index === linksMapping.length) {
                        resolve()
                        return
                    }
                    element.childNodes[index].style.display = "unset"
                    setTimeout(renderLink, 200, ++index)
                }

                renderLink()
            }
        },
    ),
    custom("body", "email-me", "a",
        (element) => {
            return (resolve, _) => {
                element.href = "mailto:george@gabolaev.com";
                renderText(element, resolve, "email me", 1000)
            }
        },
    ),
    text("body", "btw", "div", "btw, my name is george", 2000)
)