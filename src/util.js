
export async function getTemplate(templatePath) {
    const templateElement = document.createElement('template');

    const templateHTML = await fetch(templatePath)
        .then(response => response.text());
    templateElement.innerHTML = templateHTML;

    return templateElement.content.cloneNode(true);
}