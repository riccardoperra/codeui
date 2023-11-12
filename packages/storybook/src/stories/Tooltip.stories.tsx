import type { Meta, StoryObj } from "storybook-solidjs";

import { Button, Tooltip } from "@codeui/kit";

const placements = [
	"top-start",
	"top-end",
	"right-start",
	"right-end",
	"bottom-start",
	"bottom-end",
	"left-start",
	"left-end",
] as const;

const meta = {
	title: "DesignSystem/Tooltip",
	component: props => {
		return <Tooltip {...props} />;
	},
	tags: ["autodocs"],
	argTypes: {
		placement: {
			options: placements,
			defaultValue: "top-start",
			control: { type: "select" },
		},
		theme: {
			options: ["primary", "secondary"],
			defaultValue: "primary",
			control: { type: "inline-radio" },
		},
		disabled: {
			defaultValue: false,
			type: "boolean",
		},
	},
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TooltipStory: Story = {
	name: "Primary (default)",
	args: {
		content: "My tooltip content.",
		theme: "primary",
	},
	render: props => (
		<Tooltip {...props}>
			<Button theme="primary" disabled={props.disabled}>
				Hover me
			</Button>
		</Tooltip>
	),
};

export const TooltipSecondary: Story = {
	name: "Secondary",
	args: {
		content: "My tooltip content.",
		theme: "secondary",
	},
	render: props => (
		<Tooltip {...props}>
			<Button theme="secondary">Hover me</Button>
		</Tooltip>
	),
};

export const TooltipDisabled: Story = {
	name: "Disabled",
	args: {
		content: "My tooltip content.",
		theme: "secondary",
		disabled: true,
	},
	render: () => (
		<Tooltip content={"My tooltip content."} theme={"secondary"} disabled>
			<Button theme="secondary" disabled>
				Hover me
			</Button>
		</Tooltip>
	),
};

export const CustomJsxComponent: Story = {
	name: "Custom component",
	args: {
		content: "My tooltip content.",
		theme: "secondary",
		disabled: true,
	},
	render: () => (
		<Tooltip
			content={
				<Button theme={"primary"} size="xs">
					Custom content
				</Button>
			}
			theme={"secondary"}
		>
			<Button theme="secondary">Hover me</Button>
		</Tooltip>
	),
};
