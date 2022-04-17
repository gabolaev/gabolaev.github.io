const TYPING_SPEED = 86
const DEFAULT_DELAY = 100

function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start)
}

function renderTypeWriterText(text, element, resolve, index = 0) {
    if (index !== text.length) {
        element.innerHTML += text.charAt(index)
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
    let wait = stages[0]()
    if (stages.length !== 1) {
        wait.then(() => {
            run(...stages.slice(1))
        })
    }
}

function prepareStageElement(parentClassName, className, elementType) {
    var element = document.createElement(elementType)
    element.className = className;

    (
        document.querySelector("." + parentClassName) ||
        document.body
    ).appendChild(element)
    return element
}

function text(parentClassName, className, elementType, text, delay = DEFAULT_DELAY) {
    return () => {
        element = prepareStageElement(parentClassName, className, elementType)
        return new Promise((resolve, _) => {
            renderText(element, resolve, text, delay)
        })
    }
}

function custom(parentClassName, className, elementType, f) {
    return () => {
        element = prepareStageElement(parentClassName, className, elementType)
        return new Promise(f(element))
    }
}

run(
    text("body", "hello", "div", "hello"),
    text("body", "engineer", "div", "i am a software engineer at ", 1000),
    text("engineer", "tinkoff", "span", "Tinkoff Investments", 10),
    text("body", "ninja", "div", "also i am 忍者 dev at "),
    text("ninja", "kuji", "span", "KUJI Podcast", 100),
    text("body", "about-me", "div", "my digital footprints can be found here"),
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
                renderText(element, resolve, "email me")
            }
        },
    ),
    text("body", "btw", "div", "btw, my name is george"),
)