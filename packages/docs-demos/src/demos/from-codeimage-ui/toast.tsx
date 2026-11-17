import { Button, createToaster, Toaster } from "@codeui/kit";

// Before, with @codeimage/ui:
//   toast.success("Snippet saved", { position: "bottom-center" });
//   <SnackbarHost containerClassName={snackbarHostAppStyleCss} />
export default function SaveToast() {
	const notifications = createToaster();
	return (
		<>
			<Button
				theme="primary"
				onClick={() => notifications.show({ tone: "success", description: "Snippet saved" })}
			>
				Save
			</Button>
			<Toaster toaster={notifications} position="bottom-center" closeLabel="Close" />
		</>
	);
}
