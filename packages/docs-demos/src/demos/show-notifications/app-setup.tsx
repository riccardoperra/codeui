import { Button, createToaster, Toaster, type ToastController } from "@codeui/kit";
import { createContext, type JSX, useContext } from "solid-js";

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
		<NotificationsContext.Provider value={notifications}>
			{props.children}
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</NotificationsContext.Provider>
	);
}

function SaveButton() {
	const notifications = useNotifications();
	return (
		<Button
			theme="primary"
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
