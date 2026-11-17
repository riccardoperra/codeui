import { For, Show, createMemo, type Accessor, type JSX } from "solid-js";
import * as A from "../../parts/accordion";
export type AccordionEntry = {
	value: string;
	title: JSX.Element;
	icon?: JSX.Element;
	summary?: JSX.Element;
	content: JSX.Element;
	disabled?: boolean;
};
export type AccordionProps = {
	items: readonly AccordionEntry[];
	value?: string | null;
	defaultValue?: string | null;
	onChange?: (value: string | null) => void;
	collapsible?: boolean;
	keepMounted?: boolean;
	motion?: "auto" | "none";
	class?: string;
	classes?: A.AccordionClasses;
	"aria-label"?: string;
};
export function createAccordionItems(accessor: Accessor<readonly AccordionEntry[]>) {
	return createMemo(() => accessor().map(({ content, ...metadata }) => metadata));
}
export function Accordion(props: AccordionProps) {
	return (
		<A.Root
			multiple={false}
			collapsible={props.collapsible ?? true}
			value={
				props.value === undefined ? undefined : props.value === null ? [] : [props.value]
			}
			defaultValue={props.defaultValue == null ? [] : [props.defaultValue]}
			onChange={values => props.onChange?.(values[0] ?? null)}
			motion={props.motion}
			aria-label={props["aria-label"]}
			class={[props.classes?.root, props.class].filter(Boolean).join(" ")}
		>
			<For each={props.items}>
				{entry => (
					<A.Item
						value={entry.value}
						disabled={entry.disabled}
						forceMount={props.keepMounted}
						class={props.classes?.item}
					>
						<A.Header class={props.classes?.header}>
							<A.Trigger class={props.classes?.trigger}>
								<Show when={entry.icon}>
									<A.Icon class={props.classes?.icon}>{entry.icon}</A.Icon>
								</Show>
								<A.Title class={props.classes?.title}>{entry.title}</A.Title>
								<Show when={entry.summary}>
									<A.Summary class={props.classes?.summary}>{entry.summary}</A.Summary>
								</Show>
								<A.Chevron class={props.classes?.chevron} />
							</A.Trigger>
						</A.Header>
						<A.Content class={props.classes?.content}>{entry.content}</A.Content>
					</A.Item>
				)}
			</For>
		</A.Root>
	);
}
