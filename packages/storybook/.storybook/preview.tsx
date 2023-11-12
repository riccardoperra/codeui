import { Preview } from "storybook-solidjs";
import { themes } from "@storybook/theming";
import { DARK_MODE_EVENT_NAME, useDarkMode } from "storybook-dark-mode";
import { addons } from "@storybook/addons";
import { Component, createEffect, createSignal, FlowProps } from "solid-js";
import "./reset.css";
import "./global.css";
import "./global-ve.css";
import { DocsContainer, DocsContainerProps } from "@storybook/blocks";

function ThemeWrapper(props: FlowProps) {
	const [darkMode, setDarkMode] = createSignal<boolean>(true);
	const channel = addons.getChannel();
	channel.on(DARK_MODE_EVENT_NAME, setDarkMode);

	createEffect(() => {
		document.documentElement.setAttribute(
			"data-cui-theme",
			darkMode() ? "dark" : "light",
		);
	});
	return <div>{props.children}</div>;
}

export const decorators = [
	(Story: Component) => {
		return (
			<ThemeWrapper>
				<Story />
			</ThemeWrapper>
		);
	},
];

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		decorators: decorators,
		darkMode: {
			dark: { ...themes.dark, appBg: "#1c1c1c", appContentBg: "#151718" },
			light: { ...themes.normal, appBg: "#f9fafb", appContentBg: "#ffffff" },
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			container: (props: DocsContainerProps) => {
				const dark = useDarkMode();
				return <DocsContainer {...props} theme={dark ? themes.dark : themes.light} />;
			},
		},
	},
};

export default preview;
