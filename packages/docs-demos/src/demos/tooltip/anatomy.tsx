import { createSignal } from "solid-js";
import { Button, Tooltip } from "@codeui/kit";

/** Open, with the content rendered under the trigger instead of on document.body. */
export default function TooltipAnatomy() {
	const [content, setContent] = createSignal<HTMLElement>();
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-1)", "justify-items": "center" }}>
			<Tooltip content="Copy snippet" open mount={content()}>
				<Button theme="secondary">Copy</Button>
			</Tooltip>
			<div ref={setContent} />
		</div>
	);
}
