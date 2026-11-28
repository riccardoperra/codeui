import { linkStyleProps } from "@codeui/styles/link";
import "@codeui/styles/theme.css";
import "@codeui/styles/link.css";
import { Link as KLink, LinkRootProps as KLinkRootProps } from "@kobalte/core/link";
import { omit } from "solid-js";
import { ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Link.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

type LinkProps<T extends ValidComponent | HTMLElement = HTMLElement> = KLinkRootProps<T> &
	styles.LinkVariants;

export function Link<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, LinkProps<T>>,
) {
	const local = props as PolymorphicProps<"a", LinkProps>;
	const others = omit(local, "class", "variant");

	return (
		<KLink
			data-cui="link"
			data-variant={linkStyleProps({ variant: local.variant })["data-variant"]}
			{...others}
			class={mergeClasses(styles.link(), local.class)}
		/>
	);
}
