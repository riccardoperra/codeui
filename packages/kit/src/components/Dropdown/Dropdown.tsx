import { GetKobalteParams } from "../../utils/types";
import { DropdownMenu as KDropdownMenu } from "@kobalte/core";
import * as styles from "./Dropdown.css";
import {
	Accessor,
	createContext,
	createEffect,
	createSignal,
	on,
	useContext,
} from "solid-js";
import { animate } from "motion";

const DropdownInternalContext = createContext<{
	open: Accessor<boolean>;
	triggerAnimationEnd: (value: boolean) => void;
}>();

export function DropdownMenuContent(
	props: GetKobalteParams<typeof KDropdownMenu.Content>,
) {
	const [internalRef, setInternalRef] = createSignal<HTMLElement>();
	const { open, triggerAnimationEnd } = useContext(DropdownInternalContext)!;

	createEffect(
		on(internalRef, ref => {
			if (ref) {
				animate(ref, {
					opacity: [0, 1],
					transform: ["translateY(-10px)", "translateY(0px)"],
				});
				createEffect(
					on(open, open => {
						if (!open) {
							animate(ref, {
								opacity: 0,
								transform: "translateY(-10px)",
							}).finished.then(() => {
								triggerAnimationEnd(true);
							});
						}
					}),
				);
			}
		}),
	);

	return (
		<KDropdownMenu.Content
			{...props}
			class={styles.content}
			ref={ref => {
				setInternalRef(ref);
			}}
		/>
	);
}

export function DropdownMenuPortal(props: GetKobalteParams<typeof KDropdownMenu.Portal>) {
	return <KDropdownMenu.Portal {...props} />;
}

export function DropdownMenuItem(props: GetKobalteParams<typeof KDropdownMenu.Item>) {
	return <KDropdownMenu.Item {...props} class={styles.item} />;
}

export function DropdownMenuTrigger(
	props: GetKobalteParams<typeof KDropdownMenu.Trigger>,
) {
	return <KDropdownMenu.Trigger {...props} />;
}

export function DropdownMenu(props: GetKobalteParams<typeof KDropdownMenu>) {
	const [open, setOpen] = createSignal(false);
	const [internalOpen, setInternalOpen] = createSignal(false);
	const [exitAnimationEnd, triggerAnimationEnd] = createSignal(false, { equals: false });

	createEffect(on(exitAnimationEnd, () => setOpen(false)));

	return (
		<DropdownInternalContext.Provider
			value={{
				open: internalOpen,
				triggerAnimationEnd,
			}}
		>
			<KDropdownMenu
				{...props}
				isOpen={props.isOpen ?? open()}
				onOpenChange={change => {
					setInternalOpen(change);
					if (change) {
						setOpen(true);
					}
				}}
			/>
		</DropdownInternalContext.Provider>
	);
}
