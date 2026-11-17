import { createSelectOptions, Select, Pagination, type PaginationProps } from "../src";

const options = createSelectOptions(() => [{ label: "One", value: "one" }], {
	key: "label",
	valueKey: "value",
});
export const choice = () => (
	<Select
		aria-label="Choice"
		disallowEmptySelection
		{...options.props()}
		{...options.controlled(
			(): string => "one",
			key => {
				if (key !== undefined) key.toUpperCase();
			},
		)}
		options={options.options()}
	/>
);
const binding = options.controlled(
	(): string => "one",
	() => {},
);
binding.onChange(null);
const pagination: PaginationProps = { pages: 4 };
export const pages = () => <Pagination {...pagination} />;
