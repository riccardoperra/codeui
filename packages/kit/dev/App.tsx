import type { Component } from "solid-js";
import { Button, theme } from "@codeui/kit";

const App: Component = () => {
	return (
		<div class={theme}>
			<Button theme={"primary"}>Button</Button>
			<Button theme={"secondary"}>Button</Button>
			<Button theme={"tertiary"}>Button</Button>
		</div>
	);
};

export default App;
