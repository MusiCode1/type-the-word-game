import { getTemplate } from "./util.js";
export class LetterCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {

        const template = await getTemplate('./src/components/card.html');

        this.style.flex = 1;
        this.shadowRoot.appendChild(template);

        const letter = this.getAttribute('letter');
        this.shadowRoot.querySelector('.card').textContent = letter;
    }

}
