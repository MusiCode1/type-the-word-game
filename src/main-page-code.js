import { LetterCard } from "./card-latter-element.js";
import { getTemplate } from "./util.js";

document.addEventListener('DOMContentLoaded', main);


async function main() {

    const word = 'לחם';

    await setMainTemplate();

    setCards(word);

    
    setImage();
    const audio = setAudio();
    setInput(word, audio);

    onResize();
    window.onresize = onResize;

}



function setAudio() {

    const url = 'https://cdn.freesound.org/previews/352/352527_3428684-lq.mp3';

    const audio = new Audio(url);

    return audio;
}

function setImage() {

    const img = document.querySelector('img');
    img.src = 'https://www.smartcut.co.il/wp-content/uploads/2020/05/%D7%91%D7%A8-%D7%9E%D7%99%D7%9D-%D7%97%D7%9B%D7%9D.png';
}

async function setMainTemplate() {
    const templateContent = await getTemplate('./src/components/main.html');

    const app = document.getElementById('app');

    app.appendChild(templateContent);
}

function setCards(correctWord) {

    customElements.define('letter-card', LetterCard);

    const letters = correctWord.split('');
    const container = document.querySelector('.card-container');

    letters.forEach(letter => {
        const card = document.createElement('letter-card');
        card.setAttribute('letter', letter);
        container.appendChild(card);
    });

}

function setInput(correctWord, audio) {

    const input = document.getElementById('user-input');


    input.addEventListener('input', function () {
        const inputValue = this.value;

        if (inputValue === correctWord) {
            this.classList.remove('wrong');
            this.classList.add('correct');
            audio.play();
        } else if (correctWord.startsWith(inputValue)) {
            this.classList.remove('wrong');
            this.classList.remove('correct');
        } else {
            this.classList.remove('correct');
            this.classList.add('wrong');
        }
    });

}

function onResize() {
    resizeElement(document.querySelector('.main-container'));
}

/**
 * 
 * @param {HTMLElement} element 
 */
function resizeElement(element) {
    /**@type {HTMLElement}*/

    if (!element) {
        throw new Error("element is not exist!");
    }

    const
        viewHeight = visualViewport.height,
        viewWidth = visualViewport.width;

    const
        elementWidth = element.clientWidth,
        elementHeight = element.clientHeight,
        widthToHeightRatio = elementWidth / elementHeight;

    let idealHeight = (viewHeight - 20);
    let idealWidth = idealHeight * widthToHeightRatio;

    if (idealWidth > viewWidth) {
        idealWidth = viewWidth;
        idealHeight = idealWidth / widthToHeightRatio;
    }


    const newMargin = ((viewWidth - idealWidth) / 2) + 20;

    element.style.marginLeft =
        element.style.marginRight = `${Math.floor(newMargin)}px`;


}
