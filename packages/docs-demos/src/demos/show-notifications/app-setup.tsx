import { Button, createToaster, Toaster, type ToastController } from "@codeui/kit";
import { createContext, useContext } from "solid-js";
import { type JSX } from "@solidjs/web";

const NotificationsContext = createContext<ToastController>();

export function useNotifications() {
	const controller = useContext(NotificationsContext);
	if (!controller) throw new Error("useNotifications needs a NotificationsProvider.");
	return controller;
}

/** Creates one controller per render, so each server request gets its own. */
function NotificationsProvider(props: { children: JSX.Element }) {
	const notifications = createToaster();
	return (
		<NotificationsContext value={notifications}>
			{props.children}
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</NotificationsContext>
	);
}

function SaveButton() {
	const notifications = useNotifications();
	return (
		<Button
			variant="primary"
			onClick={() => notifications.show({ tone: "success", description: "Preset saved." })}
		>
			Save preset
		</Button>
	);
}

export default function AppSetup() {
	return (
		<NotificationsProvider>
			<SaveButton />
		</NotificationsProvider>
	);
}
