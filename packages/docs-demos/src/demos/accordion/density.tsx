import * as A from "@codeui/kit/accordion";
import { For } from "solid-js";
export default function Demo() {
	return <A.Root defaultValue={["frame"]} aria-label="Snippet settings">
		<For each={["frame", "window"]}>{value => <A.Item value={value}>
			<A.Header><A.Trigger class={A.accordionStyles.trigger({ density: value === "frame" ? "compact" : "comfortable" })}>
				<A.Title>{value === "frame" ? "Frame" : "Window"}</A.Title>
				<A.Summary>{value === "frame" ? "64 px" : "macOS"}</A.Summary><A.Chevron />
			</A.Trigger></A.Header>
			<A.Content><p>{value === "frame" ? "Padding around the snippet." : "Window controls and title bar."}</p></A.Content>
		</A.Item>}</For>
	</A.Root>;
}
