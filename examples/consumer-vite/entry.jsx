import { hydrate, render } from "solid-js/web";
import App from "./App";
const container = document.getElementById("app");
if (container.hasChildNodes()) {
	hydrate(() => <App />, container);
	window.__KIT_HYDRATED__ = true;
} else render(() => <App />, container);
