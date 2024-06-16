
export async function getTemplate(templatePath) {
    const templateElement = document.createElement('template');

    const templateHTML = await fetch(templatePath, {
        cache: 'default'
    })
        .then(response => response.text());
    templateElement.innerHTML = templateHTML;

    return templateElement.content.cloneNode(true);
}

const a = `
<style></

`;

function html(strings, ...values) {
    let str = '';
    strings.forEach((string, i) => {
      str += string + (values[i] || '');
    });
    return str;
  }

  html`
  fff`