import { Badge, Text } from "@codeui/kit";
import TriangleAlert from "lucide-solid/icons/triangle-exclamation-point";
import { createMemo, For, Show } from "solid-js";
import { useBench } from "./bench";
import { revealOutlineEntry } from "./invoice/commands";
import { findOutlineEntry, type OutlineEntry, outlineEntryById, outlineSignature, readOutline } from "./invoice/outline";

/** Pages, with the sections and headings inside each. A row selects, spotlights and scrolls to its node. */
export function Outline(props: { onJump?: () => void }) {
	const bench = useBench();
	// Positions move on every keystroke. The list only changes when a label or a count does.
	const outline = createMemo(() => readOutline(bench.doc()), undefined, { equals: (a, b) => outlineSignature(a) === outlineSignature(b) });
	const current = createMemo(() => findOutlineEntry(readOutline(bench.doc()), bench.editor.state().selection.from)?.id);

	const jump = (id: string) => {
		const entry = outlineEntryById(readOutline(bench.editor.view.state.doc), id);
		if (!entry) return;
		// On a phone the sheet closes first, or it would take the focus back from the editor.
		props.onJump?.();
		queueMicrotask(() => revealOutlineEntry(bench.editor, entry));
	};

	const Row = (row: { entry: OutlineEntry; child?: boolean }) => {
		const issues = () => (row.child ? row.entry.issues : 0);
		return (
			<li>
				<button
					type="button"
					class="pmi-nav-row"
					classList={{ "pmi-nav-child": row.child }}
					aria-current={current() === row.entry.id ? "location" : undefined}
					onClick={() => jump(row.entry.id)}
				>
					<span class="ex-truncate" title={row.entry.label}>
						{row.entry.label}
					</span>
					<Show when={issues()}>
						<Badge tone="danger" icon={<TriangleAlert size={12} />} class="ex-tabular">
							{issues()}
							<span class="ex-sr-only">{issues() === 1 ? " invalid row" : " invalid rows"}</span>
						</Badge>
					</Show>
				</button>
			</li>
		);
	};

	return (
		<nav aria-label="Outline" class="pmi-section">
			<Text as="p" size="xs" tone="muted">
				Select a section to jump to it.
			</Text>
			<ul class="pmi-nav">
				<For each={outline()}>
					{page => (
						<>
							<Row entry={page} />
							<For each={page.children}>{child => <Row entry={child} child />}</For>
						</>
					)}
				</For>
			</ul>
		</nav>
	);
}
