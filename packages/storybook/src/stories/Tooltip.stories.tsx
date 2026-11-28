import type { Meta, StoryObj } from "storybook-solidjs-vite";

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
		variant: {
			options: ["primary", "secondary"],
			defaultValue: "secondary",
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
	name: "Primary",
	args: {
		content: "My tooltip content.",
		variant: "primary",
	},
	render: props => (
		<Tooltip {...props}>
			<Button variant="primary" disabled={props.disabled}>
				Hover me
			</Button>
		</Tooltip>
	),
};

export const TooltipSecondary: Story = {
	name: "Secondary (default)",
	args: {
		content: "My tooltip content.",
		variant: "secondary",
	},
	render: props => (
		<Tooltip {...props}>
			<Button variant="secondary">Hover me</Button>
		</Tooltip>
	),
};

export const TooltipDisabled: Story = {
	name: "Disabled",
	args: {
		content: "My tooltip content.",
		variant: "secondary",
		disabled: true,
	},
	render: () => (
		<Tooltip content={"My tooltip content."} variant={"secondary"} disabled>
			<Button variant="secondary" disabled>
				Hover me
			</Button>
		</Tooltip>
	),
};

export const CustomJsxComponent: Story = {
	name: "Custom component",
	args: {
		content: "My tooltip content.",
		variant: "secondary",
		disabled: true,
	},
	render: () => (
		<Tooltip
			content={
				<Button variant={"primary"} size="xs">
					Custom content
				</Button>
			}
			variant={"secondary"}
		>
			<Button variant="secondary">Hover me</Button>
		</Tooltip>
	),
};
