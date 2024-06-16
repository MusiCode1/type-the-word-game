import { getComponent } from "./get-component.js";

main()

async function main() {

    const Element = await getComponent("../src/components/index.html");

    setMainElement()

    router.component = "app-welcome";

}

function setMainElement() {
    const mainElement = document.createElement('app-main');
    document.querySelector(".spinner").remove();
    document.body.appendChild(mainElement);
}

const url = new URL("https://musicode1.github.io/type-the-word-game/src/scripts/main.js");
const pathBeforeLastSlash = url.href.substring(0, url.href.lastIndexOf('/'));
