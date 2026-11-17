import {
	type ComponentProps,
	type JSX,
	mergeProps,
	sharedConfig,
	splitProps,
} from "solid-js";
import { Dynamic, isServer, Portal } from "solid-js/web";

export function HydratablePortal(props: ComponentProps<typeof Portal>) {
	if (!isServer && !sharedConfig.context) return <Portal {...props} />;
	const [local, others] = splitProps(props, ["children"]);
	let content: JSX.Element;
	// Queue relocation before child autofocus effects, without consuming a hydration key.
	const marker = isServer
		? undefined
		: Portal(
				mergeProps(others, {
					get children() {
						return content;
					},
				}),
			);
	content = (
		<Dynamic component={props.isSVG ? "g" : "div"} style={{ display: "contents" }}>
			{local.children}
		</Dynamic>
	);
	return (
		<Dynamic
			component={props.isSVG ? "g" : "span"}
			style={{ display: "contents" }}
			ref={(element: Element) => {
				if (marker) element.appendChild(marker);
			}}
		>
			{content}
		</Dynamic>
	);
}
