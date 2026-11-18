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
					<Button size="sm" variant="primary">Primary</Button>
					<Button size="sm" variant="secondary">Secondary</Button>
					<Button size="sm" variant="tertiary">Tertiary</Button>
					<Button size="sm" variant="secondary" ghost>Ghost</Button>
					<Button size="sm" variant="negative">Danger</Button>
				</div>
			</div>
			<div class="showcase-group">
				<p class="showcase-group-label">Sizes</p>
				<div class="showcase-row">
					<Button size="xs" variant="secondary">Extra small</Button>
					<Button size="sm" variant="secondary">Small</Button>
					<Button size="md" variant="secondary">Medium</Button>
				</div>
			</div>
			<div class="showcase-group">
				<p class="showcase-group-label">States</p>
				<div class="showcase-row">
					<Button size="sm" variant="secondary" leftIcon={<PlusIcon />}>New project</Button>
					<Button size="sm" variant="secondary" loading={saving()} onClick={save}>Save changes</Button>
					<Button size="sm" variant="secondary" disabled>Disabled</Button>
				</div>
			</div>
		</div>
	);
}
