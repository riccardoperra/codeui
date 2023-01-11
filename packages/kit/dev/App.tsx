import type { Component } from "solid-js";
import { For } from "solid-js";
import { Button, ButtonProps, theme } from "@codeui/kit";

const App: Component = () => {
	return (
		<div class={theme}>
			<div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
				<For
					each={
						["primary", "secondary", "tertiary", "negative"] as ButtonProps["theme"][]
					}
				>
					{variant => (
						<Button size={"md"} theme={variant}>
							Button
						</Button>
					)}
				</For>
			</div>

			<div
				style={{
					display: "flex",
					gap: "2rem",
					padding: "1rem",
					"align-items": "center",
				}}
			>
				<For each={["xs", "sm", "md", "lg", "xl"] as ButtonProps["size"][]}>
					{size => (
						<Button size={size} theme={"secondary"}>
							Button
						</Button>
					)}
				</For>
			</div>
		</div>
	);
};

export default App;
