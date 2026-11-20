import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { icons } from "@codeui/kit";
import * as T from "@codeui/kit/toast/parts";
import { toaster } from "@kobalte/core/toast";
import { createUniqueId, For, onSettled } from "solid-js";

const tones = ["neutral", "info", "success", "warning", "danger"] as const;

type ToastSpec = {
	tone?: T.ToastTone;
	title?: string;
	description: string;
	action?: string;
	icon?: boolean;
	progress?: boolean;
	focusAction?: boolean;
};

/**
 * Persistent toasts in their own region. The transformed frame contains the
 * fixed region, so each story keeps its toasts in place on the docs page.
 */
function ToastFrame(props: {
	label: string;
	toasts: ToastSpec[];
	position?: T.ToastPosition;
	height: string;
}) {
	const regionId = createUniqueId();
	onSettled(() => {
		const ids = props.toasts.map(spec =>
			toaster.show(
				toast => (
					<T.Root toastId={toast.toastId} tone={spec.tone} persistent>
						{spec.icon && (
							<T.Icon>
								<icons.CheckIcon />
							</T.Icon>
						)}
						{spec.title && <T.Title>{spec.title}</T.Title>}
						<T.Description>{spec.description}</T.Description>
						{spec.action && (
							<T.Action
								ref={element => spec.focusAction && queueMicrotask(() => element.focus())}
							>
								{spec.action}
							</T.Action>
						)}
						<T.CloseButton aria-label="Dismiss" />
						{spec.progress && (
							<T.ProgressTrack>
								<T.ProgressFill />
							</T.ProgressTrack>
						)}
					</T.Root>
				),
				{ region: regionId },
			),
		);
		return () => ids.forEach(id => toaster.dismiss(id));
	});
	return (
		<div
			style={{ position: "relative", height: props.height, transform: "translateZ(0)" }}
		>
			<T.Region
				regionId={regionId}
				position={props.position}
				limit={5}
				aria-label={`${props.label} notifications ${regionId}`}
			>
				<T.List />
			</T.Region>
		</div>
	);
}

const meta = {
	title: "DesignSystem/Toast",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
	render: () => (
		<ToastFrame
			label="Tones"
			height="420px"
			toasts={tones.map(tone => ({
				tone,
				icon: true,
				title: `${tone[0].toUpperCase()}${tone.slice(1)}`,
				description: "Snippet exported to your downloads.",
				action: "Undo",
			}))}
		/>
	),
};

export const MessageOnly: Story = {
	render: () => (
		<ToastFrame
			label="Message only"
			height="184px"
			toasts={[{ description: "Link copied" }]}
		/>
	),
};

export const WithProgress: Story = {
	render: () => (
		<ToastFrame
			label="Progress"
			height="140px"
			position="top-right"
			toasts={[
				{
					tone: "success",
					icon: true,
					description: "Image exported. It stays until you close it.",
					progress: true,
				},
			]}
		/>
	),
};

export const FocusedAction: Story = {
	render: () => (
		<ToastFrame
			label="Focused action"
			height="184px"
			position="bottom-left"
			toasts={[
				{
					tone: "danger",
					description: "Export failed.",
					action: "Retry",
					focusAction: true,
				},
			]}
		/>
	),
};

export const AllPositions: Story = {
	render: () => (
		<For
			each={
				[
					"top-left",
					"top-center",
					"top-right",
					"bottom-left",
					"bottom-center",
					"bottom-right",
				] as const
			}
		>
			{position => (
				<ToastFrame
					label={position}
					height="164px"
					position={position}
					toasts={[{ description: position }]}
				/>
			)}
		</For>
	),
};
