import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button, Skeleton } from "@codeui/kit";

const meta = {
	title: "DesignSystem/Skeleton",
	component: Skeleton,
	tags: ["autodocs"],
	args: { width: "12rem", height: "1rem" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SkeletonStory: Story = {
	name: "Skeleton",
};

export const LoadingCard: Story = {
	render: () => (
		<section
			aria-busy="true"
			aria-label="Loading project"
			style={{ display: "flex", gap: "12px", "align-items": "center", width: "320px" }}
		>
			<Skeleton circle height="40px" />
			<div style={{ display: "flex", "flex-direction": "column", gap: "8px", flex: 1 }}>
				<Skeleton width="60%" height="14px" />
				<Skeleton width="90%" height="12px" />
				<Skeleton width="40%" height="12px" radius="9999px" />
			</div>
		</section>
	),
};

export const WrappingContent: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "12px" }}>
			<Skeleton width="fit-content">
				<Button variant="secondary">Hidden while loading</Button>
			</Skeleton>
			<Skeleton width="fit-content" visible={false}>
				<Button variant="secondary">Loaded</Button>
			</Skeleton>
		</div>
	),
};

export const Static: Story = {
	args: { animate: false },
};
