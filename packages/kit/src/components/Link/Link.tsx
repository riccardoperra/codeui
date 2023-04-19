import { Link as KLink } from "@kobalte/core";
import { splitProps } from "solid-js";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Link.css";

type LinkProps = KLink.LinkRootProps & styles.LinkVariants;

export function Link(props: LinkProps) {
	const [local, others] = splitProps(props, ["class", "variant"]);

	const classes = () =>
		mergeClasses(
			styles.link({
				variant: local.variant,
			}),
			local.class,
		);

	return <KLink.Root data-cui={"link"} class={classes()} {...others} />;
}
