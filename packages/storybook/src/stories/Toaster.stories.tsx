import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
	Button,
	createToaster,
	Toaster,
	type ToastController,
	type ToastOptions,
} from "@codeui/kit";
import type { ToastPosition } from "@codeui/kit/toast/parts";
import { type JSX, onMount } from "solid-js";

/**
 * Each story owns a controller and a Toaster. The transformed frame contains
 * the fixed region, so the toasts stay inside the story on the docs page.
 */
function Frame(props: {
	label: string;
	height: string;
	position?: ToastPosition;
	toasts?: ToastOptions[];
	children?: (toaster: ToastController) => JSX.Element;
}) {
	const toaster = createToaster({ duration: Infinity });
	onMount(() => props.toasts?.forEach(toast => toaster.show(toast)));
	return (
		<div
			style={{ position: "relative", height: props.height, transform: "translateZ(0)" }}
		>
			{props.children?.(toaster)}
			<Toaster
				toaster={toaster}
				position={props.position}
				limit={5}
				closeLabel="Dismiss"
				aria-label={`${props.label} notifications`}
			/>
		</div>
	);
}

const meta = {
	title: "DesignSystem/Toaster",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
	render: () => (
		<Frame
			label="Tones"
			height="420px"
			toasts={(["neutral", "info", "success", "warning", "danger"] as const).map(
				tone => ({
					tone,
					title: `${tone[0].toUpperCase()}${tone.slice(1)}`,
					description: "Snippet exported to your downloads.",
				}),
			)}
		/>
	),
};

export const WithAction: Story = {
	render: () => (
		<Frame
			label="Action"
			height="204px"
			toasts={[
				{
					description: "Code pasted. Format it?",
					action: { label: "Format", onClick: toast => toast.dismiss() },
				},
				{
					tone: "danger",
					description: "Export failed.",
					action: { label: "Retry", onClick: () => {} },
					closeable: false,
				},
			]}
		/>
	),
};

export const RichContent: Story = {
	render: () => (
		<Frame
			label="Rich content"
			height="184px"
			toasts={[
				{
					tone: "success",
					theme: "light",
					description: toast => (
						<span>
							Image copied. <strong>Toast #{toast.id}</strong> uses the light theme.
						</span>
					),
				},
			]}
		/>
	),
};

export const Loading: Story = {
	render: () => (
		<Frame label="Loading" height="184px">
			{toaster => {
				onMount(() =>
					toaster.promise(new Promise(() => {}), {
						loading: { description: "Exporting snippet…" },
						success: { description: "Exported" },
						error: { description: "Failed" },
					}),
				);
				return null;
			}}
		</Frame>
	),
};

export const Interactive: Story = {
	render: () => (
		<Frame label="Interactive" height="320px" position="top-right">
			{toaster => {
				let count = 0;
				const save = () =>
					toaster.promise(new Promise(resolve => setTimeout(resolve, 1200)), {
						loading: { description: "Saving…" },
						success: { description: "Saved", duration: 3000 },
						error: { description: "Could not save" },
					});
				return (
					<div style={{ display: "flex", gap: "8px", padding: "16px" }}>
						<Button
							variant="secondary"
							onClick={() =>
								toaster.show({ description: `Message ${++count}`, duration: 4000 })
							}
						>
							Show
						</Button>
						<Button variant="secondary" onClick={save}>
							Save
						</Button>
						<Button variant="secondary" onClick={() => toaster.clear()}>
							Clear
						</Button>
					</div>
				);
			}}
		</Frame>
	),
};
