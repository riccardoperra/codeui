import { generateHydrationScript, renderToString } from "@solidjs/web";
import App from "./App";
console.log(generateHydrationScript() + renderToString(() => <App />));
