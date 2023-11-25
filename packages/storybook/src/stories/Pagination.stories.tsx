import type { Meta, StoryObj } from "storybook-solidjs";

import { Pagination } from "@codeui/kit";
import {
	DocsContainerFlex,
	DocsContainerTitle,
	DocsMultipleItemsContainer,
} from "./components/Section.jsx";
import { For } from "solid-js";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
	title: "DesignSystem/Pagination",
	component: Pagination,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PaginationStory: Story = {
	name: "Pagination",
	args: {
		size: "md",
		pages: 10,
	},
};

export const PaginationRoundedStory: Story = {
	name: "Pagination (Rounded)",
	args: {
		...PaginationStory.args,
		rounded: true,
	},
};

export const PaginationSizes: Story = {
	name: "Sizes",
	render: args => {
		return (
			<DocsMultipleItemsContainer>
				<For each={sizes}>
					{size => (
						<DocsContainerFlex>
							<DocsContainerTitle>Size {size}</DocsContainerTitle>
							<Pagination {...args} size={size} />
						</DocsContainerFlex>
					)}
				</For>
			</DocsMultipleItemsContainer>
		);
	},
	args: {
		...PaginationStory.args,
	},
};
