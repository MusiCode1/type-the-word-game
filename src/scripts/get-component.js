export async function getComponent(url) {
    try {
        const templateElement = document.createElement('template');

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'text/html'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlText = await response.text();

        templateElement.innerHTML = htmlText;

        const componentContent = templateElement.content.firstChild.content;

        const scripts = componentContent.querySelectorAll('script');

        for (const script of scripts) {
            const module = await importModuleFromScriptTag(script, url);
            script.remove();

            if (module.Component) {
                return module.Component(componentContent);

            }
        }
    } catch (error) {
        console.error('Error in getComponent:', error);

    }
}

export async function importModuleFromScriptTag(script, url) {
    try {
        const blob = new Blob([script.textContent], {
            type: "application/javascript"
        });

        const urlObj = URL.createObjectURL(blob);

        const module = await import(urlObj);

        URL.revokeObjectURL(urlObj);

        return module;
    } catch (error) {
        console.error('Error in importModuleFromScriptTag:', error);
        throw error; // Re-throw the error so it can be caught by the calling function
    }
}

export function setComponent(elementName, element) {
    let elementRoot;
    class Element extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(element.cloneNode(true));
            elementRoot = this.shadowRoot;
        }
    }

    customElements.define(elementName, Element);


    return elementRoot;
}

export class ComponentElement extends HTMLElement {
    constructor(element) {
        super()
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(element.cloneNode(true));
    }
}

export class Router {
    lastComponent;
    rootElement;
    #isRunning = false;

    set component(name) {
        if (this.#isRunning)
            this.#setComponent(name)
    }

    subscribe(element) {
        this.rootElement = element;
        this.#isRunning = true;
    }

    #setComponent(componentName) {

        if (this.lastComponent) {
            this.lastComponent.remove();
        }
        const newComponent = document.createElement(componentName);
        this.rootElement.appendChild(newComponent);
        this.lastComponent = newComponent;
    }
}
