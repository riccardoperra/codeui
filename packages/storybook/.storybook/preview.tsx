import { Preview } from "storybook-solidjs";
import { themes, ThemeVars } from "@storybook/theming";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import "./reset.css";
import "./global.css";
import "./global-ve.css";
import { DocsContainer, DocsContainerProps } from "@storybook/blocks";
import { createEffect, createRoot, createSignal, FlowProps } from "solid-js";
import { addons } from "@storybook/preview-api";
import { useEffect, useState } from "react";

const channel = addons.getChannel();

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
		return (
			<ThemeWrapper>
				<Story />
			</ThemeWrapper>
		);
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


const STORAGE_KEY = "sb-addon-themes-3";

const defaultParams: Required<Omit<DarkModeStore, "current">> = {
	classTarget: "body",
	dark: themes.dark,
	darkClass: ["dark"],
	light: themes.light,
	lightClass: ["light"],
	stylePreview: false,
	userHasExplicitlySetTheTheme: false,
};

export const updateStore = (newStore: DarkModeStore) => {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
};

export const store = (
	userTheme: Partial<DarkModeStore> = {},
): DarkModeStore => {
	const storedItem = window.localStorage.getItem(STORAGE_KEY);

	if (typeof storedItem === "string") {
		const stored = JSON.parse(storedItem) as DarkModeStore;

		if (userTheme) {
			if (userTheme.dark) {
				stored.dark = userTheme.dark;
				updateStore(stored);
			}

			if (userTheme.light) {
				stored.light = userTheme.light;
				updateStore(stored);
			}
		}

		return stored;
	}

	return { ...defaultParams, ...userTheme } as DarkModeStore;
};

export function useDarkMode(): boolean {
	const [isDark, setIsDark] = useState(store().current === "dark");

	useEffect(() => {
		const chan = addons.getChannel();
		chan.on(DARK_MODE_EVENT_NAME, setIsDark);
		return () => chan.off(DARK_MODE_EVENT_NAME, setIsDark);
	}, []);

	return isDark;
}

const modes = ["light", "dark"] as const;
type Mode = typeof modes[number];

interface DarkModeStore {
	/** The class target in the preview iframe */
	classTarget: string;
	/** The current mode the storybook is set to */
	current: Mode;
	/** The dark theme for storybook */
	dark: ThemeVars;
	/** The dark class name for the preview iframe */
	darkClass: string | string[];
	/** The light theme for storybook */
	light: ThemeVars;
	/** The light class name for the preview iframe */
	lightClass: string | string[];
	/** Apply mode to iframe */
	stylePreview: boolean;
	/** Persist if the user has set the theme */
	userHasExplicitlySetTheTheme: boolean;
}

const preview: Preview = {
	parameters: {
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
				return createRoot(
					() => {
						// @ts-expect-error Render react
						return <DocsContainer {...props} theme={dark ? darkTheme : lightTheme} />;
					});
			},
		},
	},
};

export default preview;
