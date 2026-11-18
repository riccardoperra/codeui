import { Button, createToaster, Toaster, type ToastId } from "@codeui/kit";

export default function ToastController() {
	const notifications = createToaster();
	let syncId: ToastId | undefined;

	const start = () => {
		syncId = notifications.show({
			description: "Syncing 3 snippets…",
			duration: Infinity,
			closeable: false,
		});
	};
	const finish = () => {
		if (syncId === undefined) return;
		// A new duration restarts the close timer.
		notifications.update(syncId, {
			tone: "success",
			description: "3 snippets synced.",
			duration: 4000,
			closeable: true,
		});
	};
	const cancel = () => {
		if (syncId !== undefined) notifications.dismiss(syncId);
	};

	return (
		<>
			<Button variant="secondary" onClick={start}>
				Start sync
			</Button>
			<Button variant="secondary" onClick={finish}>
				Finish
			</Button>
			<Button variant="secondary" onClick={cancel}>
				Dismiss
			</Button>
			<Button variant="secondary" onClick={() => notifications.clear()}>
				Clear all
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
