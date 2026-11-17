import "@codeui/styles/theme.css";
import "@codeui/styles/link.css";
import { Link as KLink, LinkRootProps as KLinkRootProps } from "@kobalte/core/link";
import { splitProps, ValidComponent } from "solid-js";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Link.css";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

type LinkProps<T extends ValidComponent | HTMLElement = HTMLElement> = KLinkRootProps<T> & styles.LinkVariants;

export function Link<T extends ValidComponent = "a">(props: PolymorphicProps<T, LinkProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"a", LinkProps>, ["class", "variant"]);

	return (
		<KLink
			data-cui="link"
			data-variant={local.variant}
			{...others}
			class={mergeClasses(styles.link(), local.class)}
		/>
	);
}
