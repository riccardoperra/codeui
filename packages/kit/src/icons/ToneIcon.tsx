import { Match, Switch } from "solid-js";
import { CheckIcon } from "./CheckIcon";
import { SvgIcon } from "./SvgIcon";

/** The status icon for a tone. Neutral has none. */
export function ToneIcon(props: {
	tone?: "neutral" | "info" | "success" | "warning" | "danger";
}) {
	return (
		<Switch>
			<Match when={props.tone === "success"}>
				<CheckIcon />
			</Match>
			<Match when={props.tone === "info"}>
				<SvgIcon viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</SvgIcon>
			</Match>
			<Match when={props.tone === "warning" || props.tone === "danger"}>
				<SvgIcon viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a1 1 0 01.993.883L11 6v4a1 1 0 01-1.993.117L9 10V6a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z"
						clip-rule="evenodd"
					/>
				</SvgIcon>
			</Match>
		</Switch>
	);
}
