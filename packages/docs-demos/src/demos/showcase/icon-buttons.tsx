import { IconButton, Tooltip } from "@codeui/kit";
import { For, type JSX } from "solid-js";
import { ArchiveIcon, CopyIcon, DownloadIcon, MoreIcon, PinIcon, ShareIcon, TrashIcon } from "./icons";
import "./showcase.css";

type Action = [label: string, icon: () => JSX.Element];

function Toolbar(props: { actions: Action[]; ghost?: boolean }) {
	return (
		<div class="showcase-row">
			<For each={props.actions}>
				{([label, Icon]) => (
					<Tooltip content={label}>
						<IconButton size="sm" theme="secondary" variant={props.ghost ? "ghost" : undefined} aria-label={label}>
							<Icon />
						</IconButton>
					</Tooltip>
				)}
			</For>
		</div>
	);
}

export default function IconButtons() {
	return (
		<div class="showcase-stack">
			<Toolbar actions={[["Copy link", CopyIcon], ["Download", DownloadIcon], ["Share", ShareIcon], ["More actions", MoreIcon]]} />
			<Toolbar ghost actions={[["Pin", PinIcon], ["Archive", ArchiveIcon], ["Delete", TrashIcon]]} />
			<p class="showcase-meta">Point at a button, or focus it, to read its name.</p>
		</div>
	);
}
