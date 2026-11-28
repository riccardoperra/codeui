import "../shared/base.css";
import { render } from "@solidjs/web";
import { App } from "./App";
import "./dashboard.css";

render(() => <App />, document.getElementById("root")!);
