import { createSignal } from "solid-js";
import { type JSX } from "@solidjs/web";
import { isServer } from "@solidjs/web";
import * as D from "../../src/parts/dialog";
import * as P from "../../src/parts/popover";
import * as S from "../../src/parts/sheet";
import * as C from "../../src/parts/command-menu";

function Fixture(props: {
	kind: "dialog" | "popover";
	customMount?: boolean;
	autofocus?: boolean;
}) {
	const [open, setOpen] = createSignal(true);
	const [moved, setMoved] = createSignal(false);
	const [count, setCount] = createSignal(0);
	const [bubbled, setBubbled] = createSignal(0);
	let input!: HTMLInputElement;
	const mount = () =>
		props.customMount && !isServer
			? (document.getElementById(moved() ? "portal-second-host" : "portal-test-host") ??
				undefined)
			: undefined;
	const autofocus = (event: Event) => {
		event.preventDefault();
		input.focus();
	};
	const body = () => (
		<>
			<input
				ref={input}
				data-portal-node="input"
				aria-label="Portal input"
				value="Server value"
			/>
			<button data-portal-node="action" onClick={() => setCount(value => value + 1)}>
				Count {count()}
			</button>
		</>
	);
	return (
		<section onClick={() => setBubbled(value => value + 1)}>
			<output data-portal-bubbled>{bubbled()}</output>
			{props.customMount && (
				<button data-portal-move onClick={() => setMoved(true)}>
					Move portal
				</button>
			)}
			{props.kind === "dialog" ? (
				<D.Root open={open()} onOpenChange={setOpen}>
					<D.Trigger data-portal-trigger>Open dialog</D.Trigger>
					<D.Portal mount={mount()}>
						<D.Content onOpenAutoFocus={props.autofocus ? autofocus : undefined}>
							<D.Title>Dialog title</D.Title>
							{body()}
							<D.CloseButton data-portal-close />
						</D.Content>
					</D.Portal>
				</D.Root>
			) : (
				<P.Root open={open()} onOpenChange={setOpen}>
					<P.Trigger data-portal-trigger>Open popover</P.Trigger>
					<P.Portal mount={mount()}>
						<P.Content onOpenAutoFocus={props.autofocus ? autofocus : undefined}>
							<P.Title>Popover title</P.Title>
							{body()}
							<P.CloseButton data-portal-close />
						</P.Content>
					</P.Portal>
				</P.Root>
			)}
		</section>
	);
}

function NestedPortal(props: { openOnServer?: boolean }) {
	return (
		<D.Root defaultOpen modal={!props.openOnServer}>
			<D.Portal>
				<D.Content>
					<D.Title>Outer dialog</D.Title>
					<div data-portal-node="outer">Outer content</div>
					<P.Root defaultOpen={props.openOnServer}>
						<P.Trigger>Open inner</P.Trigger>
						<P.Portal>
							<P.Content>
								<P.Title>Inner popover</P.Title>
								<button data-portal-node="inner">Inner content</button>
							</P.Content>
						</P.Portal>
					</P.Root>
				</D.Content>
			</D.Portal>
		</D.Root>
	);
}

export const portalFixtures: Record<string, () => JSX.Element> = {
	Dialog: () => <Fixture kind="dialog" />,
	Popover: () => <Fixture kind="popover" />,
	"Dialog custom mount": () => <Fixture kind="dialog" customMount />,
	"Popover custom mount": () => <Fixture kind="popover" customMount />,
	"Dialog autofocus": () => <Fixture kind="dialog" autofocus />,
	"Popover autofocus": () => <Fixture kind="popover" autofocus />,
	Sheet: () => (
		<S.Root defaultOpen>
			<S.Portal>
				<S.Content>
					<S.Title>Sheet title</S.Title>
					<div data-portal-node="sheet">Sheet body</div>
				</S.Content>
			</S.Portal>
		</S.Root>
	),
	CommandMenu: () => (
		<C.Root defaultOpen>
			<C.Portal>
				<C.Content options={["Export"]}>
					<C.Search>
						<C.SearchInput aria-label="Search commands" />
					</C.Search>
					<C.Listbox />
					<div data-portal-node="command">Command body</div>
				</C.Content>
			</C.Portal>
		</C.Root>
	),
	Nested: () => <NestedPortal openOnServer />,
	"Nested opens after hydration": () => <NestedPortal />,
};
