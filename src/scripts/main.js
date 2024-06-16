import { getComponent } from "./get-component.js";

const url = location.href.substring(0, location.href.lastIndexOf('/'));


main()

async function main() {

    const scriptPath = `${url}/src/components/index.html`;

    const Element = await getComponent(scriptPath);

    setMainElement()

    router.component = "app-welcome";

}

function setMainElement() {
    const mainElement = document.createElement('app-main');
    document.querySelector(".spinner").remove();
    document.body.appendChild(mainElement);
}
