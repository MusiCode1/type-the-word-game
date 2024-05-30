
class CustomCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const template = document.getElementById('card-template').content.cloneNode(true);
        this.shadowRoot.appendChild(template);

        const letter = this.getAttribute('letter');
        console.log('Letter:', letter); // Debugging
        this.shadowRoot.querySelector('.card').textContent = letter;
    }

    setWidth(width) {
        this.shadowRoot.querySelector('.card').style.width = `${width}px`;
    }
}

const audio = new Audio('https://cdn.freesound.org/previews/352/352527_3428684-lq.mp3');


document.addEventListener('DOMContentLoaded',async function () {

    var templates = document.createElement('template')
    templates.innerHTML = await (await fetch('./card.html')).text()
    document.body.appendChild(templates.content.cloneNode(true))

    customElements.define('custom-card', CustomCard);

    const correctWord = 'מים';

    const letters = correctWord.split('');
    const container = document.getElementById('cards-container');
    const img = document.querySelector('img');

    letters.forEach(letter => {
        const card = document.createElement('custom-card');
        card.setAttribute('letter', letter);
        container.appendChild(card);
    });

    function adjustCardWidth() {

        const imgWidth = img.clientWidth;
        const cardMargin = 10; // Adjust this value as needed
        const totalCardMargin = cardMargin * (letters.length - 1);
        const cardWidth = (imgWidth - totalCardMargin) / letters.length;

        const cards = document.querySelectorAll('custom-card');
        cards.forEach(card => {
            card.setWidth(cardWidth);
        });
    }

    img.src = 'https://www.smartcut.co.il/wp-content/uploads/2020/05/%D7%91%D7%A8-%D7%9E%D7%99%D7%9D-%D7%97%D7%9B%D7%9D.png';

    window.addEventListener('load', adjustCardWidth);
    window.addEventListener('resize', adjustCardWidth);

    document.getElementById('user-input').addEventListener('input', function () {
        const input = this.value;
        const inputLength = input.length;

        if (input === correctWord) {
            this.classList.remove('incorrect');
            this.classList.add('correct');
            // Play sound
            audio.play();


        } else if (correctWord.startsWith(input)) {
            this.classList.remove('incorrect');
            this.classList.remove('correct');
        } else {
            this.classList.remove('correct');
            this.classList.add('incorrect');
        }
    });
})


    (async function () {
        //get the imported document in templates:

    })()