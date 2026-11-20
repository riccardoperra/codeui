import { Button, createToaster, DropdownMenuItem, IconButton, Kbd, SegmentedControl, SegmentedControlItem, Sheet, Text, Toaster } from "@codeui/kit";
import FileCheck from "@lucide/solid/icons/file-check";
import PanelLeft from "@lucide/solid/icons/panel-left";
import RotateCcw from "@lucide/solid/icons/rotate-ccw";
import ScanSearch from "@lucide/solid/icons/scan-search";
import { For, lazy, onSettled, Show } from "solid-js";
import { ExampleMenu } from "../shared/ExampleMenu";
import { modKey } from "../shared/hotkey";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { BenchContext, createBench } from "./bench";
import { resetDocument, setStatus } from "./invoice/commands";
import { readMeta } from "./invoice/document";
import { type InvoiceStatus, statuses, statusLabels } from "./invoice/model";
import { SidePanel, SidePanelTabs } from "./SidePanel";
import { Toolbar } from "./Toolbar";

// The inspector's panel is most of this page's script, so it loads when it is first opened.
const InspectorDock = lazy(() => import("./InspectorDock"));

export function App() {
	const notifications = createToaster();
	const bench = createBench(notifications);
	const isPhone = createIsPhone();
	const size = createControlSize();
	let inspectorButton: HTMLButtonElement | undefined;
	let main!: HTMLElement;

	const closeInspector = () => {
		const inside = main.querySelector(".pmi-dock")?.contains(document.activeElement);
		bench.closeInspector();
		if (inside) inspectorButton?.focus();
	};

	// ⌘⇧D or Ctrl+Shift+D, the shortcut the inspector's own playground uses.
	onSettled(() => {
		const listener = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() !== "d" || !event.shiftKey || !(event.metaKey || event.ctrlKey) || event.altKey) return;
			event.preventDefault();
			if (bench.inspectorOpen()) closeInspector();
			else bench.openInspector(false);
		};
		window.addEventListener("keydown", listener, true);
		return () => window.removeEventListener("keydown", listener, true);
	});

	const number = () => readMeta(bench.doc()).number;
	const inspectorLabel = () => (bench.inspectorOpen() ? "Close inspector" : "Open inspector");
	const toggleInspector = () => (bench.inspectorOpen() ? closeInspector() : bench.openInspector(true));

	return (
		<BenchContext value={bench}>
			<div class="ex-page">
				<header class="ex-header">
					<span class="ex-brand">
						<span class="ex-brand-mark">
							<ScanSearch size={16} />
						</span>
						<span class="ex-hide-phone">Inspector playground</span>
					</span>
					<Text size="sm" tone="muted" class="pmi-doc-name ex-truncate ex-tabular">
						{number()}
					</Text>
					<div class="ex-hide-phone">
						<SegmentedControl aria-label="Invoice status" size={size()} value={bench.status()} onChange={value => setStatus(bench.editor, value as InvoiceStatus)}>
							<For each={statuses}>{status => <SegmentedControlItem value={status}>{statusLabels[status]}</SegmentedControlItem>}</For>
						</SegmentedControl>
					</div>
					<span class="ex-header-spacer" />
					<Show
						when={!isPhone()}
						fallback={
							<>
								<IconButton variant="secondary" ghost size={size()} aria-label="Open workbench panel" onClick={() => bench.setSheetOpen(true)}>
									<PanelLeft size={16} />
								</IconButton>
								<IconButton ref={inspectorButton} variant="primary" size={size()} aria-label={inspectorLabel()} aria-expanded={bench.inspectorOpen() ? "true" : "false"} onClick={toggleInspector}>
									<ScanSearch size={16} />
								</IconButton>
							</>
						}
					>
						<Button ref={inspectorButton} variant="primary" size={size()} class="pmi-inspect" aria-expanded={bench.inspectorOpen() ? "true" : "false"} onClick={toggleInspector}>
							{inspectorLabel()}
							<Kbd>{modKey()}⇧D</Kbd>
						</Button>
					</Show>
					<ExampleMenu slug="inspector">
						<Show when={isPhone()}>
							<For each={statuses.filter(status => status !== bench.status())}>
								{status => (
									<DropdownMenuItem onSelect={() => setStatus(bench.editor, status)}>
										<span class="ex-menu-icon">
											<FileCheck size={16} />
										</span>
										Mark as {status}
									</DropdownMenuItem>
								)}
							</For>
						</Show>
						<DropdownMenuItem onSelect={() => resetDocument(bench.editor)}>
							<span class="ex-menu-icon">
								<RotateCcw size={16} />
							</span>
							Reset document
						</DropdownMenuItem>
					</ExampleMenu>
				</header>
				<div class="pmi-body">
					<Show when={!isPhone()}>
						<aside class="ex-island ex-scroll pmi-side" aria-label="Workbench">
							<SidePanel />
						</aside>
					</Show>
					<main ref={main} class="ex-island pmi-main" data-inspector={bench.inspectorOpen() ? "" : undefined}>
						<Toolbar />
						{/* Before the paper in the Tab order: a stress invoice has thousands of fields to cross. */}
						<Show when={bench.inspectorOpen()}>
							<InspectorDock onClose={closeInspector} />
						</Show>
						<div class="ex-scroll pmi-scroll">{bench.editor.view.dom}</div>
					</main>
				</div>
			</div>
			<Show when={isPhone()}>
				<Sheet open={bench.sheetOpen()} onOpenChange={bench.setSheetOpen} title="Workbench" closeLabel="Close workbench" draggable>
					<SidePanelTabs />
				</Sheet>
			</Show>
			<Toaster toaster={notifications} position={isPhone() ? "bottom-center" : "bottom-left"} closeLabel="Dismiss" />
		</BenchContext>
	);
}
