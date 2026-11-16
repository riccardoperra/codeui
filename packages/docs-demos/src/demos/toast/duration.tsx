import { Button, createToaster, Toaster } from "@codeui/kit";

export default function ToastDuration() {
	// Every toast of this controller closes after 3 seconds unless it sets its own duration.
	const notifications = createToaster({ duration: 3000 });
	return (
		<>
			<Button
				theme="secondary"
				onClick={() => notifications.show({ description: "Theme switched to Dracula." })}
			>
				3 seconds
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						description: "Rendering a 60-frame video. Hover to keep this open.",
						duration: 10000,
					})
				}
			>
				10 seconds
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						tone: "warning",
						description: "You are offline. Changes are saved on this device.",
						duration: Infinity,
					})
				}
			>
				Until dismissed
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
