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
	},
) {
	return (
		<h3
			class={"containerCustom"}
			style={{
				gap: props.gap ?? "1rem",
			}}
			{...props}
		/>
	);
}
