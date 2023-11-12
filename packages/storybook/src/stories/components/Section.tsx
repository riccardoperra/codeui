import { JSX } from "solid-js";

export function DocsItemsContainer(props: JSX.IntrinsicElements["div"]) {
	return <div class={"itemsContainer"} {...props} />;
}

export function DocsMultipleItemsContainer(props: JSX.IntrinsicElements["div"]) {
	return <div class={"multipleItemsContainer"} {...props} />;
}
