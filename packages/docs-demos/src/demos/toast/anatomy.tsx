import { icons } from "@codeui/kit";
import * as T from "@codeui/kit/toast/parts";
import { toaster } from "@kobalte/core/toast";
import { createUniqueId, onCleanup, onMount } from "solid-js";

/** One toast that stays, in a region drawn inside the figure instead of at a viewport edge. */
export default function ToastAnatomy() {
	const region = `toast-anatomy-${createUniqueId()}`;
	onMount(() => {
		const id = toaster.show(
			props => (
				<T.Root toastId={props.toastId} tone="success" duration={60_000} persistent>
					<T.Icon>
						<icons.CheckIcon />
					</T.Icon>
					<T.Title>Snippet exported</T.Title>
					<T.Description>hello-world.png is in your downloads.</T.Description>
					<T.Action>Open folder</T.Action>
					<T.CloseButton aria-label="Dismiss" />
					<T.ProgressTrack>
						<T.ProgressFill />
					</T.ProgressTrack>
				</T.Root>
			),
			{ region },
		);
		onCleanup(() => toaster.dismiss(id));
	});
	return (
		<div style={{ position: "relative", width: "100%", "max-width": "420px", "min-height": "132px" }}>
			<T.Region
				regionId={region}
				aria-label="Export notifications"
				style={{ position: "absolute", inset: 0, transform: "none", width: "100%" }}
			>
				<T.List />
			</T.Region>
		</div>
	);
}
