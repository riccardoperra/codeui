import { omit, Show } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as A from "../../parts/avatar";
import { Tooltip } from "../Tooltip/Tooltip";
import { mergeClasses } from "../../utils/css";

export type AvatarProps = Omit<A.RootProps, "hue" | "children"> & {
	/** The person's name. It is the accessible name and the tooltip. Defaults to "Unassigned" when `unassigned`. */
	name?: string;
	/** A stable id, such as a user id. The fill hue comes from it, never from the name. Without it the fill is neutral. */
	identifier?: string;
	/** URL of the picture. The initials show while it is missing or when it fails to load. */
	src?: string;
	/** Override the initials. Defaults to the first letter of the first and last words of `name`. */
	initials?: string;
	/** Show the name in the kit Tooltip on hover. Defaults to `true`. */
	tooltip?: boolean;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: A.AvatarClasses;
};

/**
 * A person: their picture, or one or two initials on a hue derived from their id.
 * An unassigned avatar is an empty dashed circle.
 */
export function Avatar(props: AvatarProps) {
	const others = omit(
		props,
		"name",
		"identifier",
		"src",
		"initials",
		"tooltip",
		"classes",
		"class",
	);
	const label = () => props.name ?? (props.unassigned ? "Unassigned" : undefined);
	const avatar = (): JSX.Element => (
		<A.Root
			role="img"
			aria-label={label()}
			{...others}
			hue={props.identifier === undefined ? undefined : A.avatarHue(props.identifier)}
			class={mergeClasses(props.classes?.root, props.class)}
		>
			<Show when={!props.unassigned}>
				<A.Fallback class={props.classes?.fallback}>
					{props.initials ?? A.avatarInitials(props.name ?? "")}
				</A.Fallback>
				<A.Image src={props.src} class={props.classes?.image} />
			</Show>
		</A.Root>
	);
	return (
		<Show when={props.tooltip !== false && label()} fallback={avatar()}>
			{name => <Tooltip content={name()}>{avatar()}</Tooltip>}
		</Show>
	);
}
