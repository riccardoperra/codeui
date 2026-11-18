import { generateHydrationScript, renderToString } from "solid-js/web";
import App from "./App";
console.log(generateHydrationScript() + renderToString(() => <App />));
