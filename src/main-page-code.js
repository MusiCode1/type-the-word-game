import { LetterCard } from "./card-latter-element.js";
import { getTemplate } from "./util.js";

document.addEventListener('DOMContentLoaded', main);


async function main() {

    const word = 'מים';

    await setMainTemplate();

    const cards = await setCards(word);

    setImage();

    const audio = setAudio();
    setInput(word, audio);
    setCurrentCard(word, cards);

    onResize();
    window.onresize = onResize;

    setDisplay();

    let timeout;

    const observer = new MutationObserver((mutations) => {

        mutations.forEach((mutation) => {

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            timeout = setTimeout(onResize, 0);

            //console.log(mutation);
        });
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });
}

function setDisplay() {

    const mainContent = document.querySelector('#main-content');
    mainContent.classList.add('display');
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

    const body = document.querySelector('body');

    body.appendChild(templateContent);
}

/**
 * Sets the cards for the correct word.
 *
 * @param {string} correctWord - The correct word to generate cards for
 * @return {Promise<Record<string, HTMLElement>>} An object containing the generated cards
 */
function setCards(correctWord) {

    customElements.define('letter-card', LetterCard);

    /** @type {Record<string, HTMLElement>} */
    const lettersCardsObject = {};

    /**@type {Promise<void>[]} */
    const waitForCardsLoad = [];

    const letters = correctWord.split('');
    const container = document.querySelector('.card-container');

    letters.forEach(letter => {
        const card = document.createElement('letter-card');
        card.setAttribute('letter', letter);
        card.setAttribute('correct', 'false');
        container.appendChild(card);

        lettersCardsObject[letter] = card;

        waitForCardsLoad.push(new Promise(resolve => {
            card.addEventListener('card-loaded', resolve);
        }));
    });

    return Promise.all(waitForCardsLoad)
        .then(
            () => lettersCardsObject
        );

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

/**
 * Sets the current card based on user input.
 *
 * @param {string} correctWord - The correct word for the game
 * @param {HTMLElement[]} cards - Array of card elements
 * @return {void}
 */
function setCurrentCard(correctWord, cards) {
    const input = document.getElementById('user-input');

    const correctWordArr = correctWord.split('');

    const letter = correctWordArr[0];

    setCorrectAttributes(letter);

    input.addEventListener('input', () => {
        const correctLetter =
            getCorrectLetter(correctWord, input);

        if (correctLetter == false) {
            const letter = correctWordArr[0];

            setCorrectAttributes(letter);

        } else if (correctLetter !== true) {

            const correctLetterIndex =
                correctWordArr.indexOf(correctLetter);

            const nextLetter = correctWordArr[correctLetterIndex + 1];

            setCorrectAttributes(nextLetter);

        } else {

            setCorrectAttributes("");
        }

        console.log(correctLetter);

    });

    function setCorrectAttributes(correctLetter) {
        Object.entries(cards).forEach(
            ([letter, card]) => {
                if (letter === correctLetter) {
                    card.setAttribute('correct', 'true');
                } else {
                    card.setAttribute('correct', 'false');
                }
            }
        );
    }
}
/**
 * 
 * @param {string} correctWord 
 * @returns 
 */
function getCorrectLetter(correctWord, input) {

    const inputValue = input.value.trim();

    if (!inputValue) {
        return false;
    }
    else if (correctWord.startsWith(inputValue)) {
        return inputValue.split('').pop();

    } else if (inputValue === correctWord) {
        return true;

    } else {
        return correctWord.split('')[0];
    }
}

function onResize() {

    const element = document.querySelector('.main-container');
    const { margin, viewHeight, viewWidth } = resizeElement(element);

    const vp1 = Math.min(viewHeight, viewWidth) * 0.01;

    element.style.marginLeft =
        element.style.marginRight = `${(margin + (vp1 * 5))}px`;

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

    //console.log('[View Width]', viewWidth, '[View Height]', viewHeight);

    let idealHeight = (viewHeight - 20);
    let idealWidth = idealHeight * widthToHeightRatio;

    if (idealWidth > viewWidth) {
        idealWidth = viewWidth;
        idealHeight = idealWidth / widthToHeightRatio;
    }

    const newMargin = ((viewWidth - idealWidth) / 2);

    /*     console.log('idealWidth', idealWidth, 'idealHeight', idealHeight);
    
        console.log('newMargin', newMargin); */

    return {
        margin: Math.floor(newMargin),

        viewHeight,
        viewWidth,
        elementWidth,
        elementHeight,
        widthToHeightRatio,
        idealHeight,
        idealWidth
    };
}
