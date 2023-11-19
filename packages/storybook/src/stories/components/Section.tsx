import { JSX } from "solid-js";

export function DocsItemsContainer(props: JSX.IntrinsicElements["div"]) {
	return <div class={"itemsContainer"} {...props} />;
}

export function DocsMultipleItemsContainer(props: JSX.IntrinsicElements["div"]) {
	return <div class={"multipleItemsContainer"} {...props} />;
}

export function DocsContainerTitle(props: JSX.IntrinsicElements["h3"]) {
	return <h3 class={"itemsContainerTitle"} {...props} />;
}

export function DocsContainerFlex(
	props: JSX.IntrinsicElements["div"] & {
		gap?: string;
		direction?: "row" | "column";
		wrap?: boolean;
	},
) {
	return (
		<h3
			class={"containerCustom"}
			style={{
				"--custom-gap": props.gap ?? "1rem",
				"--custom-direction": props.direction ?? "column",
				"--custom-wrap": props.wrap ? "wrap" : "nowrap",
			}}
			{...props}
		/>
	);
}
