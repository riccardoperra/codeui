import { Button, createToaster, Toaster } from "@codeui/kit";

export default function ToastBasic() {
	const notifications = createToaster();
	return (
		<>
			<Button
				theme="primary"
				onClick={() =>
					notifications.show({ tone: "success", description: "Snippet exported as PNG." })
				}
			>
				Export
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
