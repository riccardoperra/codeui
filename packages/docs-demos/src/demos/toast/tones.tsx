import { Button, createToaster, Toaster, type ToastOptions } from "@codeui/kit";
import { For } from "solid-js";

const messages: ToastOptions[] = [
	{ tone: "neutral", description: "Snippet duplicated." },
	{ tone: "info", description: "A new theme pack is available in Settings." },
	{ tone: "success", description: "Snippet exported as PNG." },
	{ tone: "warning", description: "JetBrains Mono failed to load. Using the fallback font." },
	{ tone: "danger", title: "Export failed", description: "The image is larger than 16 MB." },
];

export default function ToastTones() {
	const notifications = createToaster();
	return (
		<>
			<For each={messages}>
				{message => (
					<Button theme="secondary" onClick={() => notifications.show(message)}>
						{message.tone}
					</Button>
				)}
			</For>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
