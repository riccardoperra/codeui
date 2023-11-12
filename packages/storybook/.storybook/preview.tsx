import { Preview } from "storybook-solidjs";
import { themes, ThemeVars } from "@storybook/theming";
import { DARK_MODE_EVENT_NAME, useDarkMode } from "storybook-dark-mode";
import { addons } from "@storybook/addons";
import { Component, createEffect, createSignal, FlowProps } from "solid-js";
import "./reset.css";
import "./global.css";
import "./global-ve.css";
import { DocsContainer, DocsContainerProps } from "@storybook/blocks";
import { themeVars } from "@codeui/kit";

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
	(Story: () => any) => {
		return <ThemeWrapper>{Story()}</ThemeWrapper>;
	},
];

const darkTheme: ThemeVars = {
	...themes.dark,
	appBg: "#111",
	barBg: "#111",
	appContentBg: "#050505",
};

const lightTheme: ThemeVars = {
	...themes.normal,
};

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		decorators: decorators,
		darkMode: {
			current: "dark",
			dark: darkTheme,
			light: lightTheme,
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
				return <DocsContainer {...props} theme={dark ? darkTheme : lightTheme} />;
			},
		},
	},
};

export default preview;
