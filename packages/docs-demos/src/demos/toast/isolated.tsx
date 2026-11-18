import { Button, createToaster, Toaster } from "@codeui/kit";

export default function ToastIsolated() {
	const app = createToaster();
	const editor = createToaster({ duration: Infinity });
	return (
		<>
			<Button variant="secondary" onClick={() => app.show({ description: "Project renamed." })}>
				App toast
			</Button>
			<Button
				variant="secondary"
				onClick={() => editor.show({ tone: "info", description: "Line 42 has a lint warning." })}
			>
				Editor toast
			</Button>
			<Button variant="secondary" onClick={() => editor.clear()}>
				Clear editor toasts
			</Button>
			<Toaster toaster={app} closeLabel="Dismiss" aria-label="App notifications" />
			<Toaster
				toaster={editor}
				position="top-right"
				closeLabel="Dismiss"
				aria-label="Editor notifications"
			/>
		</>
	);
}
