import { Button, createToaster, Toaster } from "@codeui/kit";

export default function ToastAction() {
	const notifications = createToaster();
	const paste = () =>
		notifications.show({
			description: "Code pasted. Format it?",
			action: {
				label: "Format",
				onClick: toast => {
					// The toast stays open after the click. Close it yourself.
					toast.dismiss();
					notifications.show({ tone: "success", description: "Formatted with Prettier." });
				},
			},
		});
	return (
		<>
			<Button theme="secondary" onClick={paste}>
				Paste code
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
