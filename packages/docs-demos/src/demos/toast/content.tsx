import { Button, createToaster, icons, Toaster } from "@codeui/kit";

export default function ToastContent() {
	const notifications = createToaster();
	return (
		<>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						title: "Snippet saved",
						description: "main.rs is in your workspace.",
					})
				}
			>
				Title and description
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						tone: "success",
						description: (
							<span>
								Copied <strong>1200 × 800</strong> PNG to the clipboard.
							</span>
						),
					})
				}
			>
				JSX description
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						description: toast => (
							<span>
								Export #{toast.id} finished.{" "}
								<a href="#downloads" onClick={() => toast.dismiss()}>
									Open downloads
								</a>
							</span>
						),
					})
				}
			>
				Callback description
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						icon: <icons.CheckIcon />,
						description: "Alt text copied.",
					})
				}
			>
				Custom icon
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						tone: "success",
						icon: null,
						description: "Preset applied.",
					})
				}
			>
				No icon
			</Button>
			<Button
				theme="secondary"
				onClick={() =>
					notifications.show({
						theme: "light",
						description: "This toast uses the light theme on any page.",
					})
				}
			>
				Light theme
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
