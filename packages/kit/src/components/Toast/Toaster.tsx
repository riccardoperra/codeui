import { toaster as engine, useToastContext } from "@kobalte/core/toast";
import {
	type Accessor,
	createContext,
	createMemo,
	createSignal,
	getOwner,
	type JSX,
	onCleanup,
	type Setter,
	Show,
	splitProps,
	useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
import { ToneIcon } from "../../icons/ToneIcon";
import * as T from "../../parts/toast";
import { mergeClasses } from "../../utils/css";
import { Spinner } from "../Spinner/Spinner";

/** Scoped to the controller that returned it. Two controllers can return the same id. */
export type ToastId = number;
export type ToastContext = { id: ToastId; dismiss: () => void };
export type ToastContent = JSX.Element | ((context: ToastContext) => JSX.Element);
export type ToastAction = {
	label: JSX.Element;
	/** The toast stays open. Call `context.dismiss()` to close it. */
	onClick: (context: ToastContext) => void;
};

export type ToastOptions = {
	title?: ToastContent;
	description: ToastContent;
	tone?: T.ToastTone;
	/** Replaces the tone icon. `null` hides it. Neutral has no tone icon. */
	icon?: ToastContent;
	action?: ToastAction;
	/** Shows the close button. Defaults to true. */
	closeable?: boolean;
	/** Milliseconds before the toast closes. `Infinity` keeps it open. */
	duration?: number;
	/** Renders the toast in this theme, whatever the page theme. */
	theme?: "light" | "dark";
	class?: string;
	classes?: T.ToastClasses;
	style?: JSX.CSSProperties;
};

export type ToastPromiseOptions<D> = {
	loading: ToastOptions;
	success: ToastOptions | ((data: D) => ToastOptions);
	error: ToastOptions | ((error: unknown) => ToastOptions);
};

export interface ToastController {
	/** Ties the controller to its `<Toaster />`. */
	readonly regionId: string;
	show(options: ToastOptions): ToastId;
	/** Merges into the open toast. A new duration restarts its timer. */
	update(id: ToastId, options: Partial<ToastOptions>): void;
	/** Closes with the exit animation. */
	dismiss(id: ToastId): void;
	/** Dismisses every toast of this controller. */
	clear(): void;
	/**
	 * Shows `loading` until the promise settles, then `success` or `error` in
	 * the same toast. Loading stays open and shows a spinner unless its options
	 * say otherwise.
	 */
	promise<D>(
		promise: Promise<D> | (() => Promise<D>),
		options: ToastPromiseOptions<D>,
	): ToastId;
}

export type CreateToasterOptions = {
	/** Default milliseconds before a toast closes. Defaults to 5000. */
	duration?: number;
};

type Entry = {
	options: Accessor<ToastOptions>;
	setOptions: Setter<ToastOptions>;
	/** Changes when the close timer must restart. Remounts the toast. */
	timer: Accessor<number>;
	setTimer: Setter<number>;
	engineId: number;
	close?: () => void;
};

let regionCount = 0;

/**
 * Creates a toast controller for one `<Toaster />`. Each controller has its own
 * toasts, so create one per app or per region. On the server it shows nothing.
 * Created inside a component, it clears its toasts when that owner is disposed.
 */
export function createToaster(options: CreateToasterOptions = {}): ToastController {
	const regionId = `cui-toaster-${++regionCount}`;
	const entries = new Map<ToastId, Entry>();
	let lastId = 0;

	const durationOf = (toast: ToastOptions) => toast.duration ?? options.duration ?? 5000;

	const dismiss = (id: ToastId) => {
		const entry = entries.get(id);
		if (!entry) return;
		if (entry.close) return entry.close();
		entries.delete(id);
		engine.dismiss(entry.engineId);
	};

	const show = (toast: ToastOptions): ToastId => {
		const id = ++lastId;
		if (isServer) return id;
		const [options, setOptions] = createSignal(toast);
		const [timer, setTimer] = createSignal(0);
		const entry = { options, setOptions, timer, setTimer } as Entry;
		const context: ToastContext = { id, dismiss: () => dismiss(id) };
		entries.set(id, entry);
		entry.engineId = engine.show(
			props => (
				<Show when={timer() + 1} keyed>
					{key => (
						<ReadyToast
							toastId={props.toastId}
							entry={entry}
							context={context}
							duration={durationOf(options())}
							replaced={key > 1}
							onClosed={() => entries.delete(id)}
						/>
					)}
				</Show>
			),
			{ region: regionId },
		);
		return id;
	};

	const replace = (id: ToastId, next: ToastOptions) => {
		const entry = entries.get(id);
		if (!entry) return;
		const restart = durationOf(next) !== durationOf(entry.options());
		entry.setOptions(next);
		if (restart) entry.setTimer(timer => timer + 1);
	};

	const controller: ToastController = {
		regionId,
		show,
		dismiss,
		update: (id, patch) => {
			const entry = entries.get(id);
			if (entry) replace(id, { ...entry.options(), ...patch });
		},
		clear: () => [...entries.keys()].forEach(dismiss),
		promise<D>(
			input: Promise<D> | (() => Promise<D>),
			{ loading, success, error }: ToastPromiseOptions<D>,
		) {
			const id = show({ duration: Infinity, icon: () => <Spinner />, ...loading });
			new Promise<D>(resolve =>
				resolve(typeof input === "function" ? input() : input),
			).then(
				data =>
					replace(id, {
						tone: "success",
						...(typeof success === "function" ? success(data) : success),
					}),
				reason =>
					replace(id, {
						tone: "danger",
						...(typeof error === "function" ? error(reason) : error),
					}),
			);
			return id;
		},
	};

	if (getOwner()) onCleanup(controller.clear);
	return controller;
}

const ToasterContext = createContext<{ closeLabel: () => string }>();

function ReadyToast(props: {
	toastId: number;
	entry: Entry;
	context: ToastContext;
	duration: number;
	replaced: boolean;
	onClosed: () => void;
}) {
	const toaster = useContext(ToasterContext);
	const options = props.entry.options;
	const classes = () => options().classes;
	const title = createMemo(() => options().title);
	const description = createMemo(() => options().description);
	const icon = createMemo(() => {
		const { icon, tone } = options();
		return icon === undefined ? () => <ToneIcon tone={tone} /> : icon;
	});
	const hasIcon = () =>
		options().icon === undefined
			? (options().tone ?? "neutral") !== "neutral"
			: icon() != null && icon() !== false;
	const render = (content: ToastContent) =>
		typeof content === "function" ? content(props.context) : content;

	let element: HTMLElement | undefined;
	onCleanup(() => {
		if (element?.hasAttribute("data-closed")) props.onClosed();
	});

	return (
		<T.Root
			ref={element}
			toastId={props.toastId}
			tone={options().tone}
			persistent={!Number.isFinite(props.duration)}
			duration={Number.isFinite(props.duration) ? props.duration : undefined}
			data-cui-theme={options().theme}
			data-cui-replaced={props.replaced ? "" : undefined}
			class={mergeClasses(classes()?.root, options().class)}
			style={options().style}
		>
			<CloseHandle entry={props.entry} />
			<Show when={hasIcon()}>
				<T.Icon class={classes()?.icon}>{render(icon())}</T.Icon>
			</Show>
			<Show when={title() != null}>
				<T.Title class={classes()?.title}>{render(title())}</T.Title>
			</Show>
			<T.Description class={classes()?.description}>
				{render(description())}
			</T.Description>
			<Show when={options().action}>
				{action => (
					<T.Action
						class={classes()?.action}
						onClick={() => action().onClick(props.context)}
					>
						{action().label}
					</T.Action>
				)}
			</Show>
			<Show when={options().closeable ?? true}>
				<T.CloseButton
					class={classes()?.closeButton}
					aria-label={toaster?.closeLabel()}
				/>
			</Show>
		</T.Root>
	);
}

/** Lets `dismiss` close the mounted toast through the engine, so it plays its exit. */
function CloseHandle(props: { entry: Entry }) {
	const close = useToastContext().close;
	props.entry.close = close;
	onCleanup(() => {
		if (props.entry.close === close) props.entry.close = undefined;
	});
	return null;
}

export type ToasterProps = Omit<
	T.RegionProps,
	"regionId" | "duration" | "children" | "position"
> & {
	toaster: ToastController;
	/** Defaults to bottom center. */
	position?: T.ToastPosition;
	/** The close button's accessible name, in the app's language. */
	closeLabel: string;
	/** Classes for the region and list. Per-toast classes go in the toast options. */
	classes?: Pick<T.ToastClasses, "region" | "list">;
};

/**
 * The region that shows one controller's toasts. Place it inside the app's
 * providers: toast content renders here and can read their context.
 */
export function Toaster(props: ToasterProps) {
	const [local, others] = splitProps(props, [
		"toaster",
		"closeLabel",
		"classes",
		"class",
	]);
	return (
		<ToasterContext.Provider value={{ closeLabel: () => local.closeLabel }}>
			<T.Region
				{...others}
				regionId={local.toaster.regionId}
				class={mergeClasses(local.classes?.region, local.class)}
			>
				<T.List class={local.classes?.list} />
			</T.Region>
		</ToasterContext.Provider>
	);
}
