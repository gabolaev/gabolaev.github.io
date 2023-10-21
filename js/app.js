const summary = `george gabolaev

software engineer
at talon.one



links

george@gabolaev.com`
const summaryHrefed = `george gabolaev

software engineer
at talon.one



<a href="#summary" onclick="showLinks();">links</a>

<a href=mailto:george@gabolaev.com>george@gabolaev.com</a>`

const phrases = [
    "hello",
    "my name is george",
    "i'm a software engineer",
    "at talon.one",
    "previously i worked at:",
    "vk",
    "tinkoff",
    "and kuji podcast",
    "wanna reach out?",
    "it's @gabolaev everywhere",
    "or george@gabolaev.com",
];

const links = `linkedin
instagram
github
telegram
spotify
twitter
letterboxd


back`

const linksHrefed = `<a href='https://linkedin.com/in/gabolaev'>linkedin</a>
    <a href='https://instagram.com/gabolaev'>instagram</a>
    <a href='https://github.com/gabolaev'>github</a>
    <a href='https://t.me/gabolaev'>telegram</a>
    <a href='https://open.spotify.com/user/gabolaev'>spotify</a>
    <a href='https://x.com/rugbeehead'>twitter</a>
    <a href='https://letterboxd.com/gabolaev'>letterboxd</a>


    <a href="#links" onclick="showSummary();">back</a>
`

function paintHrefHovers() {
    document.querySelectorAll('a').forEach((a) => {
        a.style.setProperty('--hover-background', activeColor);
        a.style.setProperty('--hover-color', shadeColorToAlmostWhite(activeColor, 0.99));
    });
}

// reveal(".background")

const text = document.querySelector(".text");
text.style.color = shadeColorToAlmostWhite(activeColor, 0.75);
const fx = new TextScramble(text, activeColor);

let counter = 0;
const next = () => {
    if (counter == phrases.length) {
        fx.setText(summary).then(() => {
            setTimeout(() => { fx.hardReplace(summaryHrefed); paintHrefHovers(); }, 103);
        })
        return
    }
    fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 1000);
    });
    counter = (counter + 1);
};

const showLinks = () => {
    fx.hardReplace(summary);
    fx.setText(links).then(() => {
        setTimeout(() => { fx.hardReplace(linksHrefed); paintHrefHovers(); }, 103);
    })

}

const showSummary = () => {
    fx.hardReplace(links);
    fx.setText(summary).then(() => {
        setTimeout(() => { fx.hardReplace(summaryHrefed); paintHrefHovers(); }, 103);
    })
}

next();