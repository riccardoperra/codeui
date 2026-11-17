import { Button } from "@codeui/kit";
import { createSignal } from "solid-js";
import { PlusIcon } from "./icons";
import "./showcase.css";

// A specimen: the primary theme appears once, beside the others it is chosen against.
export default function Buttons() {
	const [saving, setSaving] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	const save = () => {
		setSaving(true);
		clearTimeout(timer);
		timer = setTimeout(() => setSaving(false), 1500);
	};
	return (
		<div class="showcase-stack">
			<div class="showcase-group">
				<p class="showcase-group-label">Themes</p>
				<div class="showcase-row">
					<Button size="sm" theme="primary">Primary</Button>
					<Button size="sm" theme="secondary">Secondary</Button>
					<Button size="sm" theme="tertiary">Tertiary</Button>
					<Button size="sm" theme="secondary" variant="ghost">Ghost</Button>
					<Button size="sm" theme="negative">Danger</Button>
				</div>
			</div>
			<div class="showcase-group">
				<p class="showcase-group-label">Sizes</p>
				<div class="showcase-row">
					<Button size="xs" theme="secondary">Extra small</Button>
					<Button size="sm" theme="secondary">Small</Button>
					<Button size="md" theme="secondary">Medium</Button>
				</div>
			</div>
			<div class="showcase-group">
				<p class="showcase-group-label">States</p>
				<div class="showcase-row">
					<Button size="sm" theme="secondary" leftIcon={<PlusIcon />}>New project</Button>
					<Button size="sm" theme="secondary" loading={saving()} onClick={save}>Save changes</Button>
					<Button size="sm" theme="secondary" disabled>Disabled</Button>
				</div>
			</div>
		</div>
	);
}
