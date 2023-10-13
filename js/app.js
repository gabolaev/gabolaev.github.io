const TYPING_SPEED = 63;
const DEFAULT_DELAY = 100;

function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start)
}

function createCursor(refElement) {
    const cursor = refElement.insertBefore(document.createElement('span'), null);
    cursor.id = 'cursor';
    cursor.className = 'cursor';
    cursor.style.fontSize = refElement.style.fontSize;
    cursor.innerHTML = '|';
}

function removeCursor() {
    const curs = document.getElementsByClassName('cursor');
    while (curs.length > 0) {
        curs[0].parentNode.removeChild(curs[0]);
    }
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

let parentsHistory = {
    'body': 'body',
    'prev': 'body',
    'exPrev': 'body',
}

let Base = {
    Body: 'body',
    Prev: 'prev',
    ExPrev: 'exPrev',
}

function prepareStageElement(baseControl, className, elementType) {
    let parentClassName = parentsHistory[baseControl];
    parentsHistory.exPrev = parentsHistory.prev;
    parentsHistory.prev = className;

    const element = document.createElement(elementType);
    element.className = className;

    let parents = document.querySelectorAll('.' + parentClassName.replace(' ', '.'));

    (
        parents[parents.length - 1] ||
        document.body
    ).appendChild(element)
    return element
}


function text(baseControl, className, elementType, text, delay = DEFAULT_DELAY) {
    return () => {
        return new Promise((resolve) => {
            renderText(prepareStageElement(baseControl, className, elementType), resolve, text, delay)
        })
    }
}

function enter() {
    return text(Base.Body, 'skip', 'br', '', 0);
}

function comma(baseControl) {
    return text(baseControl, 'comma', 'span', ', ', 200);
}

function period(baseControl) {
    return text(baseControl, 'period', 'span', '. ', 200);
}

function custom(baseControl, className, elementType, f) {
    return () => {
        return new Promise(f(prepareStageElement(baseControl, className, elementType)))
    }
}

run(
    text(Base.Body, 'hello', 'div', 'приве', 1000),
    custom(Base.Body, 'action', 'span', () => {
        return (resolve) => {
            document.querySelector('.hello').remove();
            resolve();
        }
    }),
    text(Base.Body, 'hello', 'div', 'hello', 1000),
    custom(Base.Prev, 'action', 'span', () => {
        return (resolve) => {
            setTimeout(resolve, 500);
        }
    }),
    text(Base.Body, 'plain', 'div', 'my name is george and i\'m a software engineer.', 100),
    text(Base.Body, 'plain', 'div', 'i work at ', 500),
    text(Base.Prev, 'talon', 'span', 'talon.one', 200),
    text(Base.ExPrev, 'plain', 'span', ' in berlin, germany', 100),
    period(Base.Prev),
    enter(),
    text(Base.Body, 'plain', 'div', 'in the past, i worked at ', 200),
    text(Base.Prev, 'vk', 'span', 'vk', 200),
    comma(Base.ExPrev),
    text(Base.Prev, 'tinkoff', 'span', 'tinkoff', 200),
    // comma(Base.ExPrev),
    // text(Base.Prev, 'talon', 'span', 'talon.one', 200),
    text(Base.Body, 'plain', 'div', 'and '),
    text(Base.Prev, 'kuji', 'span', 'kuji podcast', 200),
    period(Base.ExPrev),
    enter(),
    text(Base.Body, 'plain', 'div', 'you can find me on ', 1000),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://t.me/gabolaev';
                renderText(element, resolve, 'telegram', 100);
            }
        },
    ),
    comma(Base.ExPrev),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://www.linkedin.com/in/gabolaev';
                renderText(element, resolve, 'linkedin', 100);
            }
        },
    ),
    comma(Base.ExPrev),
    text(Base.Prev, 'plain', 'div', '', 100),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://github.com/gabolaev';
                renderText(element, resolve, 'github', 100);
            }
        },
    ),
    comma(Base.ExPrev),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://open.spotify.com/user/gabolaev';
                renderText(element, resolve, 'spotify', 100);
            }
        },
    ),
    comma(Base.ExPrev),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://www.instagram.com/gabolaev';
                renderText(element, resolve, 'instagram', 100);
            }
        },
    ),

    comma(Base.ExPrev),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://letterboxd.com/gabolaev';
                renderText(element, resolve, 'letterboxd', 100);
            }
        },
    ),
    text(Base.ExPrev, 'plain', 'span', ' and '),
    custom(Base.Prev, 'link twitter', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'https://x.com/rugbeehead';
                renderText(element, resolve, 'twitter', 100);
            }
        },
    ),
    period(Base.ExPrev),
    custom(Base.Body, 'action', 'span', () => {
        return (resolve) => {
            document.querySelector('.twitter').innerHTML = "𝕏";
            resolve();
        }
    }),
    enter(),
    text(Base.Body, 'plain', 'div', 'or hit me up with an '),
    custom(Base.Prev, 'link', 'a',
        (element) => {
            return (resolve) => {
                element.href = 'mailto:george@gabolaev.com';
                renderText(element, resolve, 'email', 100);
            }
        },
    ),
    period(Base.ExPrev),
    text(Base.Body, 'plain', 'br', '', 450),
    text(Base.Body, 'plain', 'p', '', 450),
    text(Base.Body, 'plain', 'br', '', 250),
    text(Base.Body, 'plain', 'p', '', 250),
    text(Base.Body, 'plain', 'br', '', 250),
    text(Base.Body, 'plain', 'p', '🧤', 10000),
)