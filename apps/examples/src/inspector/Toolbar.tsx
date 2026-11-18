import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger, IconButton, Text, TextField, Tooltip } from "@codeui/kit";
import Bold from "lucide-solid/icons/letter-b";
import Check from "lucide-solid/icons/check";
import ChevronDown from "lucide-solid/icons/chevron-down";
import ChevronUp from "lucide-solid/icons/chevron-up";
import Italic from "lucide-solid/icons/italic";
import Lock from "lucide-solid/icons/lock";
import Pilcrow from "lucide-solid/icons/pilcrow";
import Plus from "lucide-solid/icons/plus";
import Redo2 from "lucide-solid/icons/redo-2";
import Search from "lucide-solid/icons/search";
import Undo2 from "lucide-solid/icons/undo-2";
import X from "lucide-solid/icons/x";
import { redoDepth, undoDepth } from "prosemirror-history";
import { createEffect, createSignal, For, type JSX, on, Show } from "solid-js";
import { modKey } from "../shared/hotkey";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { useBench } from "./bench";
import { addLineItem, type BlockKind, blockKinds, currentBlock, findQuery, findStep, markActive, redo, setBlock, toggleMark, undo } from "./invoice/commands";
import { getFindState } from "./invoice/plugins";
import { marks } from "./invoice/schema";

/** An icon-only command. "On" is the soft accent wash (DESIGN.md §2.3), and the tooltip names it. */
function Tool(props: { label: string; hint?: string; on?: boolean; disabled?: boolean; onClick: () => void; ref?: (el: HTMLButtonElement) => void; children: JSX.Element }) {
	const size = createControlSize();
	return (
		<Tooltip content={props.hint ? `${props.label} · ${props.hint}` : props.label} placement="bottom">
			<IconButton
				ref={props.ref}
				variant="secondary"
				ghost
				size={size()}
				class={props.on ? "pmi-on" : undefined}
				aria-label={props.label}
				aria-pressed={props.on === undefined ? undefined : props.on}
				disabled={props.disabled}
				// The caret stays in the document, so a command applies to the selection it was aimed at.
				onMouseDown={(event: MouseEvent) => event.preventDefault()}
				onClick={props.onClick}
			>
				{props.children}
			</IconButton>
		</Tooltip>
	);
}

/** The floating bar over the paper. It takes no layout space, and Find opens in its place. */
export function Toolbar() {
	const bench = useBench();
	const size = createControlSize();
	const isPhone = createIsPhone();
	const state = bench.editor.state;
	const mod = modKey();
	const block = () => currentBlock(state());
	let findButton: HTMLButtonElement | undefined;

	return (
		<div class="pmi-bar" role="toolbar" aria-label="Editor">
			<Show when={!bench.findOpen()} fallback={<FindBar onClose={() => queueMicrotask(() => findButton?.focus())} />}>
				<Show
					when={!bench.locked()}
					fallback={
						<span class="pmi-bar-note">
							<Lock size={16} />
							<Text size="sm" weight="medium">
								Paid · read-only
							</Text>
						</span>
					}
				>
					<Tool label="Undo" hint={`${mod}Z`} disabled={undoDepth(state()) === 0} onClick={() => undo(bench.editor)}>
						<Undo2 size={16} />
					</Tool>
					<Tool label="Redo" hint={`${mod}⇧Z`} disabled={redoDepth(state()) === 0} onClick={() => redo(bench.editor)}>
						<Redo2 size={16} />
					</Tool>
					<span class="pmi-bar-gap" />
					<Tool label="Bold" hint={`${mod}B`} on={markActive(state(), marks.strong)} onClick={() => toggleMark(bench.editor, marks.strong)}>
						<Bold size={16} />
					</Tool>
					<Tool label="Italic" hint={`${mod}I`} on={markActive(state(), marks.em)} onClick={() => toggleMark(bench.editor, marks.em)}>
						<Italic size={16} />
					</Tool>
					<DropdownMenu placement="bottom-start">
						<Show
							when={!isPhone()}
							fallback={
								<DropdownMenuTrigger as={IconButton} variant="secondary" ghost size={size()} aria-label="Block type" disabled={!block()}>
									<Pilcrow size={16} />
								</DropdownMenuTrigger>
							}
						>
							<DropdownMenuTrigger as={Button} variant="secondary" ghost size={size()} class="pmi-block" aria-label="Block type" disabled={!block()}>
								<span class="pmi-block-label">{block() ? blockKinds[block()!] : "Text"}</span>
								<ChevronDown size={16} />
							</DropdownMenuTrigger>
						</Show>
						<DropdownMenuPortal>
							<DropdownMenuContent>
								<For each={Object.keys(blockKinds) as BlockKind[]}>
									{kind => (
										<DropdownMenuItem onSelect={() => setBlock(bench.editor, kind)}>
											<span class="ex-menu-icon">
												<Show when={block() === kind}>
													<Check size={16} />
												</Show>
											</span>
											{blockKinds[kind]}
										</DropdownMenuItem>
									)}
								</For>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>
					<span class="pmi-bar-gap" />
					<Show
						when={!isPhone()}
						fallback={
							<Tool label="Add row" onClick={() => addLineItem(bench.editor)}>
								<Plus size={16} />
							</Tool>
						}
					>
						<Button variant="secondary" ghost size={size()} leftIcon={<Plus size={16} />} onClick={() => addLineItem(bench.editor)}>
							Add row
						</Button>
					</Show>
				</Show>
				<Tool label="Find" hint={`${mod}F`} ref={el => (findButton = el)} onClick={() => bench.setFindOpen(true)}>
					<Search size={16} />
				</Tool>
			</Show>
		</div>
	);
}

function FindBar(props: { onClose: () => void }) {
	const bench = useBench();
	const size = createControlSize();
	const [query, setQuery] = createSignal(getFindState(bench.editor.view.state).query);
	let input: HTMLInputElement | undefined;

	createEffect(on(query, value => findQuery(bench.editor, value), { defer: true }));
	// Opened by its button or by Mod+F in the document: either way the next key belongs to the field.
	queueMicrotask(() => input?.select());

	const matches = () => getFindState(bench.editor.state()).matches;
	const position = () => matches().findIndex(match => match.from === bench.editor.state().selection.from) + 1;
	const count = () => (!query() ? "" : matches().length === 0 ? "No matches" : position() ? `${position()} of ${matches().length}` : `${matches().length} found`);
	const close = () => {
		findQuery(bench.editor, "");
		bench.setFindOpen(false);
		props.onClose();
	};

	return (
		<div
			class="pmi-find"
			onKeyDown={event => {
				if (event.key === "Enter") findStep(bench.editor, event.shiftKey ? -1 : 1);
				// Escape closes this layer only, and never reaches the inspector under it.
				if (event.key === "Escape") (event.stopPropagation(), close());
			}}
		>
			<div class="pmi-find-field">
				<TextField ref={el => (input = el)} aria-label="Find in invoice" placeholder="Find in invoice" size={size()} value={query()} onChange={setQuery} />
			</div>
			<Text as="output" size="xs" tone="muted" class="pmi-find-count ex-tabular" aria-live="polite">
				{count()}
			</Text>
			<Tool label="Previous match" hint="⇧↵" disabled={matches().length === 0} onClick={() => findStep(bench.editor, -1)}>
				<ChevronUp size={16} />
			</Tool>
			<Tool label="Next match" hint="↵" disabled={matches().length === 0} onClick={() => findStep(bench.editor, 1)}>
				<ChevronDown size={16} />
			</Tool>
			<Tool label="Close find" hint="esc" onClick={close}>
				<X size={16} />
			</Tool>
		</div>
	);
}
