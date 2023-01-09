import { Accessor, Component, createComputed, createSignal } from "solid-js";

export function createHello(): [Accessor<string>, (to: string) => void] {
	const [hello, setHello] = createSignal("Hello World!");

	return [hello, (to: string) => setHello(`Hello ${to}!`)];
}

export const Hello: Component<{ to?: string }> = props => {
	const [hello, setHello] = createHello();

	createComputed(() => {
		if (typeof props.to === "string") setHello(props.to);
	});

	return <div>{hello()}</div>;
};

export { Button, type ButtonProps } from "./components/Button/Button";
export { tokens } from "./foundation/tokens";
export { theme, themeTokens } from "./foundation/themes.css";
