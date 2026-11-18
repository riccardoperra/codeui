import {
	Button,
	createToaster,
	Dialog,
	DialogPanelContent,
	DialogPanelFooter,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Toaster,
} from "@codeui/kit";
import { createSignal } from "solid-js";
import "./showcase.css";

export default function Overlays() {
	const [confirm, setConfirm] = createSignal(false);
	const notifications = createToaster();
	const archive = () =>
		notifications.show({
			description: "Project archived.",
			action: { label: "Undo", onClick: context => context.dismiss() },
		});
	return (
		<div class="showcase-stack">
			<div class="showcase-row">
				<Popover placement="bottom-start">
					<PopoverTrigger as={Button} variant="secondary" size="sm">
						Share
					</PopoverTrigger>
					<PopoverContent title="Share project" description="Anyone with the link can view it.">
						Editors you invite can change it.
					</PopoverContent>
				</Popover>
				<Button variant="secondary" size="sm" onClick={archive}>
					Archive
				</Button>
				<Button variant="secondary" size="sm" onClick={() => setConfirm(true)}>
					Delete project
				</Button>
			</div>
			<p class="showcase-meta">A popover, a toast and a dialog. Each opens over the page.</p>
			<Dialog open={confirm()} onOpenChange={setConfirm} title="Delete project?" size="sm">
				<DialogPanelContent>Its files and history are removed for everyone. This cannot be undone.</DialogPanelContent>
				<DialogPanelFooter>
					<div class="showcase-row" style={{ "justify-content": "flex-end" }}>
						<Button variant="secondary" size="sm" onClick={() => setConfirm(false)}>
							Cancel
						</Button>
						<Button variant="negative" size="sm" onClick={() => setConfirm(false)}>
							Delete
						</Button>
					</div>
				</DialogPanelFooter>
			</Dialog>
			<Toaster toaster={notifications} position="bottom-center" closeLabel="Dismiss" />
		</div>
	);
}
