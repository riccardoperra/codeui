import { Button, icons } from "@codeui/kit";
import * as T from "@codeui/kit/toast/parts";
import { toaster } from "@kobalte/core/toast";
import { createUniqueId } from "solid-js";

export default function ToastParts() {
	// Each region gets its own id. Kobalte's toaster routes a toast to the
	// region named in `toaster.show`.
	const region = `export-progress-${createUniqueId()}`;

	const showExport = () =>
		toaster.show(
			props => (
				<T.Root toastId={props.toastId} tone="success" duration={8000}>
					<T.Icon>
						<icons.CheckIcon />
					</T.Icon>
					<T.Title>Snippet exported</T.Title>
					<T.Description>hello-world.png is in your downloads.</T.Description>
					<T.Action onClick={() => toaster.dismiss(props.toastId)}>Open folder</T.Action>
					<T.CloseButton aria-label="Dismiss" />
					<T.ProgressTrack>
						<T.ProgressFill />
					</T.ProgressTrack>
				</T.Root>
			),
			{ region },
		);

	return (
		<>
			<Button theme="primary" onClick={showExport}>
				Export with a time bar
			</Button>
			<T.Region regionId={region} position="bottom-right" aria-label="Export notifications">
				<T.List />
			</T.Region>
		</>
	);
}
