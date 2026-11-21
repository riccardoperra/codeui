import "../shared/base.css";
import { render } from "@solidjs/web";
import { App } from "./App";
import "./theme-studio.css";

render(() => <App />, document.getElementById("root")!);
