"use client";

import {
	toastParts,
	toastStyleProps,
	toastStyles,
	type ToastClasses,
	type ToastPosition,
	type ToastTone,
} from "@codeui/styles/toast";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type CSSProperties,
	type ReactNode,
	type RefObject,
} from "react";
import {
	Button,
	Text,
	UNSTABLE_Toast as RACToast,
	UNSTABLE_ToastContent as RACToastContent,
	UNSTABLE_ToastList as RACToastList,
	UNSTABLE_ToastQueue as RACToastQueue,
	UNSTABLE_ToastRegion as RACToastRegion,
	type QueuedToast,
	type ToastRegionProps,
} from "react-aria-components";
import { classes } from "../classes";
import { ToneIcon } from "../controls/icons";
import { Spinner } from "../controls/spinner";
import { CloseIcon } from "./shared";

export type { ToastClasses, ToastPosition, ToastTone };

/** Scoped to the controller that returned it. */
export type ToastId = string;
export type ToastContext = { id: ToastId; dismiss: () => void };
export type ToastContent = ReactNode | ((context: ToastContext) => ReactNode);
export type ToastAction = {
	label: ReactNode;
	/** The toast stays open. Call `context.dismiss()` to close it. */
	onPress: (context: ToastContext) => void;
};

export type ToastOptions = {
	title?: ToastContent;
	description: ToastContent;
	tone?: ToastTone;
	/** Replaces the tone icon. `null` hides it. Neutral has no tone icon. */
	icon?: ToastContent | null;
	/** An inline text action (Inkstone §9.7). */
	action?: ToastAction;
	/** Shows the close button. Defaults to true. */
	closeable?: boolean;
	/** Milliseconds before the toast closes. `Infinity` keeps it open. */
	duration?: number;
	/**
	 * `inverted`, the default, uses the opposite of the page theme: a light card
	 * on a dark page. `page` follows the page. `light` and `dark` force one.
	 */
	theme?: "light" | "dark" | "inverted" | "page";
	className?: string;
	classes?: ToastClasses;
	style?: CSSProperties;
};

export type ToastPromiseOptions<D> = {
	loading: ToastOptions;
	success: ToastOptions | ((data: D) => ToastOptions);
	error: ToastOptions | ((error: unknown) => ToastOptions);
};

type Entry = {
	context: ToastContext;
	options: ToastOptions;
	replaced: boolean;
	listeners: Set<() => void>;
};

/**
 * React Aria's queue, with one change: a close first plays the toast's exit,
 * then removes it. The timer, the close button and `dismiss` all close here.
 */
class ToastQueue extends RACToastQueue<Entry> {
	exits = new Map<string, () => void>();
	close(key: string) {
		const exit = this.exits.get(key);
		if (exit) exit();
		else super.close(key);
	}
	remove(key: string) {
		super.close(key);
	}
}

export interface ToastController {
	/** The queue the `Toaster` renders. */
	readonly queue: RACToastQueue<unknown>;
	show(options: ToastOptions): ToastId;
	/** Merges into the open toast. A new duration restarts its timer. */
	update(id: ToastId, options: Partial<ToastOptions>): void;
	/** Closes with the exit animation. */
	dismiss(id: ToastId): void;
	/** Dismisses every toast of this controller. */
	clear(): void;
	/** Shows `loading` until the promise settles, then `success` or `error` in the same toast. */
	promise<D>(
		promise: Promise<D> | (() => Promise<D>),
		options: ToastPromiseOptions<D>,
	): ToastId;
}

export type CreateToasterOptions = {
	/** Default milliseconds before a toast closes. Defaults to 5000. */
	duration?: number;
	/** Toasts shown at once; the rest wait. Defaults to 5. */
	maxVisibleToasts?: number;
};

let toasters = 0;

/** Creates the toasts of one `<Toaster />`. Create it once, outside render. */
export function createToaster({
	duration = 5000,
	maxVisibleToasts = 5,
}: CreateToasterOptions = {}): ToastController {
	const queue = new ToastQueue({ maxVisibleToasts });
	const scope = ++toasters;
	let lastId = 0;
	const keys = new Map<ToastId, string>();
	const entries = new Map<ToastId, Entry>();
	const durationOf = (options: ToastOptions) => options.duration ?? duration;

	const enqueue = (entry: Entry) => {
		const time = durationOf(entry.options);
		const key = queue.add(entry, {
			timeout: Number.isFinite(time) ? time : undefined,
			onClose: () => {
				if (keys.get(entry.context.id) !== key) return;
				keys.delete(entry.context.id);
				entries.delete(entry.context.id);
			},
		});
		keys.set(entry.context.id, key);
	};

	const dismiss = (id: ToastId) => {
		const key = keys.get(id);
		if (key) queue.close(key);
	};

	const show = (options: ToastOptions): ToastId => {
		const id = `cui-toast-${scope}-${++lastId}`;
		const entry: Entry = {
			context: { id, dismiss: () => dismiss(id) },
			options,
			replaced: false,
			listeners: new Set(),
		};
		entries.set(id, entry);
		enqueue(entry);
		return id;
	};

	const replaceOptions = (id: ToastId, next: ToastOptions) => {
		const entry = entries.get(id);
		const key = keys.get(id);
		if (!entry || !key) return;
		const restart = durationOf(next) !== durationOf(entry.options);
		entry.options = next;
		if (!restart) {
			entry.listeners.forEach(listener => listener());
			return;
		}
		// React Aria sets a toast's timer once, so a new duration shows it again in place.
		entry.replaced = true;
		keys.delete(id);
		queue.remove(key);
		enqueue(entry);
	};

	return {
		queue: queue as RACToastQueue<unknown>,
		show,
		update(id, patch) {
			const entry = entries.get(id);
			if (entry) replaceOptions(id, { ...entry.options, ...patch });
		},
		dismiss,
		clear: () => [...keys.keys()].forEach(dismiss),
		promise<D>(
			input: Promise<D> | (() => Promise<D>),
			{ loading, success, error }: ToastPromiseOptions<D>,
		) {
			const id = show({ duration: Infinity, icon: <Spinner size="sm" />, ...loading });
			new Promise<D>(resolve =>
				resolve(typeof input === "function" ? input() : input),
			).then(
				data =>
					replaceOptions(id, {
						tone: "success",
						...(typeof success === "function" ? success(data) : success),
					}),
				reason =>
					replaceOptions(id, {
						tone: "danger",
						...(typeof error === "function" ? error(reason) : error),
					}),
			);
			return id;
		},
	};
}

function usePageScheme(ref: RefObject<HTMLElement | null>) {
	const [scheme, setScheme] = useState<"light" | "dark">();
	useEffect(() => {
		const read = () => {
			const parent = ref.current?.parentElement;
			if (!parent) return;
			const value = [
				getComputedStyle(parent).colorScheme,
				parent.closest("[data-cui-theme]")?.getAttribute("data-cui-theme"),
			].find(value => value === "light" || value === "dark");
			setScheme(value as "light" | "dark" | undefined);
		};
		read();
		const observer = new MutationObserver(read);
		for (const scope of [document.documentElement, document.body])
			observer.observe(scope, {
				attributes: true,
				attributeFilter: ["data-cui-theme", "class", "style"],
			});
		const media = window.matchMedia?.("(prefers-color-scheme: dark)");
		media?.addEventListener?.("change", read);
		return () => {
			observer.disconnect();
			media?.removeEventListener?.("change", read);
		};
	}, [ref]);
	return scheme;
}

function ToastItem({
	toast,
	queue,
	closeLabel,
}: {
	toast: QueuedToast<Entry>;
	queue: ToastQueue;
	closeLabel: string;
}) {
	const entry = toast.content;
	const options = useSyncExternalStore(
		listener => {
			entry.listeners.add(listener);
			return () => entry.listeners.delete(listener);
		},
		() => entry.options,
		() => entry.options,
	);
	const ref = useRef<HTMLDivElement>(null);
	const [closing, setClosing] = useState(false);
	const page = usePageScheme(ref);

	useLayoutEffect(() => {
		queue.exits.set(toast.key, () => setClosing(true));
		return () => {
			queue.exits.delete(toast.key);
		};
	}, [queue, toast.key]);

	useEffect(() => {
		if (!closing) return;
		const done = () => queue.remove(toast.key);
		const animations = ref.current?.getAnimations?.() ?? [];
		Promise.all(animations.map(animation => animation.finished)).then(done, done);
	}, [closing, queue, toast.key]);

	const render = (content: ToastContent) =>
		typeof content === "function" ? content(entry.context) : content;
	const icon =
		options.icon === undefined ? (
			<ToneIcon tone={options.tone} />
		) : options.icon === null ? null : (
			render(options.icon)
		);
	const hasIcon =
		options.icon === undefined
			? (options.tone ?? "neutral") !== "neutral"
			: options.icon !== null;
	const theme = options.theme ?? "inverted";
	const scheme =
		theme === "page"
			? undefined
			: theme !== "inverted"
				? theme
				: page && (page === "dark" ? "light" : "dark");
	const slots = options.classes;
	const { class: base, ...appearance } = toastStyleProps({ tone: options.tone });

	return (
		<RACToast
			toast={toast}
			ref={ref}
			{...appearance}
			data-opened={closing ? undefined : ""}
			data-closed={closing ? "" : undefined}
			data-cui-replaced={entry.replaced ? "" : undefined}
			data-cui-theme={scheme}
			style={options.style}
			className={classes(base, slots?.root, options.className)}
		>
			{hasIcon && (
				<span
					aria-hidden="true"
					data-cui={toastParts.icon}
					className={classes(toastStyles.icon(), slots?.icon)}
				>
					{icon}
				</span>
			)}
			<RACToastContent className="cui-react-toast-content">
				{options.title != null && (
					<Text
						slot="title"
						data-cui={toastParts.title}
						className={classes(toastStyles.title(), slots?.title)}
					>
						{render(options.title)}
					</Text>
				)}
				<Text
					slot="description"
					data-cui={toastParts.description}
					className={classes(toastStyles.description(), slots?.description)}
				>
					{render(options.description)}
				</Text>
			</RACToastContent>
			{options.action && (
				<Button
					data-cui={toastParts.action}
					onPress={() => options.action?.onPress(entry.context)}
					className={classes(toastStyles.action(), slots?.action)}
				>
					{options.action.label}
				</Button>
			)}
			{(options.closeable ?? true) && (
				<Button
					slot="close"
					aria-label={closeLabel}
					data-cui={toastParts.closeButton}
					className={classes(toastStyles.closeButton(), slots?.closeButton)}
				>
					<CloseIcon />
				</Button>
			)}
		</RACToast>
	);
}

export type ToasterProps = Omit<
	ToastRegionProps<unknown>,
	"queue" | "children" | "className"
> & {
	toaster: ToastController;
	/** Defaults to bottom center. */
	position?: ToastPosition;
	/** The close button's accessible name, in the app's language. */
	closeLabel: string;
	className?: string;
	/** Classes for the region and list. Per-toast classes go in the toast options. */
	classes?: Pick<ToastClasses, "region" | "list">;
};

/**
 * The landmark region that shows one controller's toasts. They rise from the
 * edge (Inkstone §7.3), pause while hovered or focused, and F6 reaches them.
 */
export function Toaster({
	toaster,
	position,
	closeLabel,
	className,
	classes: slots,
	...props
}: ToasterProps) {
	const queue = toaster.queue as ToastQueue;
	const { class: base, ...appearance } = toastStyleProps.region({ position });
	return (
		<RACToastRegion<Entry>
			{...props}
			queue={queue}
			{...appearance}
			className={classes(base, slots?.region, className)}
		>
			<RACToastList<Entry>
				data-cui={toastParts.list}
				className={classes(toastStyles.list(), slots?.list)}
			>
				{({ toast }) => <ToastItem toast={toast} queue={queue} closeLabel={closeLabel} />}
			</RACToastList>
		</RACToastRegion>
	);
}
