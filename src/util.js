
export async function getTemplate(templatePath) {
    const templateElement = document.createElement('template');

    const templateHTML = await fetch(templatePath, {
        cache: 'default'
    })
        .then(response => response.text());
    templateElement.innerHTML = templateHTML;

    return templateElement.content.cloneNode(true);
}