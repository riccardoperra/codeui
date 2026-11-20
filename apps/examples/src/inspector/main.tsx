import "../shared/base.css";
import "prosemirror-view/style/prosemirror.css";
import { render } from "@solidjs/web";
import { App } from "./App";
import "./inspector.css";
import "./paper.css";

render(() => <App />, document.getElementById("root")!);
