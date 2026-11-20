import { For, merge } from "solid-js";
import * as P from "../../parts/pagination";

type PaginationItemSize = NonNullable<P.ItemProps["size"]>;

export interface PaginationProps extends P.PaginationOptions {
	rounded?: boolean;
	size?: PaginationItemSize;
}

export function Pagination(props: PaginationProps) {
	const options = merge({ size: "sm" as const, rounded: false }, props);
	const { items, page } = P.createPaginationState(options);

	return (
		<P.Root>
			<For each={items()}>
				{itemProps => (
					<P.Item
						page={itemProps.page}
						active={itemProps.page === page()}
						rounded={options.rounded}
						size={options.size}
						{...itemProps}
					/>
				)}
			</For>
		</P.Root>
	);
}
