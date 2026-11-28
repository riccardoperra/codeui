import { createRenderEffect, isHydrating } from "solid-js";
import {
	getDelegatedRoot,
	isServer,
	Portal,
	registerDelegatedContainer,
	unregisterDelegatedContainer,
	type ComponentProps,
} from "@solidjs/web";

export function HydratablePortal(props: ComponentProps<typeof Portal>) {
	if (!isServer && !isHydrating()) return <Portal {...props} />;

	let anchor!: HTMLSpanElement;
	let content!: HTMLDivElement;
	createRenderEffect(
		() => props.mount,
		mount => {
			if (isServer) return;
			const target = mount ?? document.body;
			const root = getDelegatedRoot(anchor);
			const delegatedRoot = root && !root.contains(target) ? root : undefined;
			if (delegatedRoot) registerDelegatedContainer(target, delegatedRoot);
			// Match Solid's Portal host link so delegated events can bubble to
			// the source tree after we move the server-rendered nodes.
			Object.defineProperty(content, "_$host", {
				configurable: true,
				get: () => anchor,
			});
			target.appendChild(content);
			return () => {
				anchor.appendChild(content);
				if (delegatedRoot) unregisterDelegatedContainer(target, delegatedRoot);
			};
		},
		{ schedule: true, ssrSource: "client" },
	);

	return (
		<span ref={anchor} style={{ display: "contents" }}>
			<div ref={content} style={{ display: "contents" }}>
				{props.children}
			</div>
		</span>
	);
}
