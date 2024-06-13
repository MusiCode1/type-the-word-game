import { getTemplate } from "./util.js";

export class LetterCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['correct'];
    }

    set correct(value) {
        this.setAttribute('correct', value);
    }

    get correct() {
        return this.getAttribute('correct');
    }

    async connectedCallback() {

        const template = await getTemplate('./src/components/card.html');

        this.style.flex = 1;
        this.shadowRoot.appendChild(template);

        const letter = this.getAttribute('letter');
        this.shadowRoot.querySelector('.card').textContent = letter;

        this.dispatchEvent(new CustomEvent('card-loaded', {}))
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === 'correct') {
            const card = this.shadowRoot.querySelector('.card');

            if (newValue === 'true') {
                card.classList.add('correct');
            } else {
                card?.classList.remove('correct');
            }
        }
    }

}
