import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { Button, Sheet, TextField } from "@codeui/kit";
import * as S from "@codeui/kit/sheet/parts";
import { createSignal, For, Show } from "solid-js";
import { DocsItemsContainer } from "./components/Section.jsx";

const meta = {
	title: "DesignSystem/Sheet",
	component: Sheet,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

const layers = ["Background", "Window", "Code", "Watermark"];

function LayerList() {
	return (
		<ul
			style={{ margin: 0, padding: 0, "list-style": "none", display: "grid", gap: "8px" }}
		>
			<For each={layers}>{layer => <li>{layer}</li>}</For>
		</ul>
	);
}

export const Sides: Story = {
	render: () => (
		<DocsItemsContainer>
			<For each={["bottom", "left", "right"] as const}>
				{side => {
					const [open, setOpen] = createSignal(false);
					return (
						<>
							<Button theme={"secondary"} onClick={() => setOpen(true)}>
								Open ({side})
							</Button>
							<Sheet
								open={open()}
								onOpenChange={setOpen}
								side={side}
								title={`Layers (${side})`}
								description="Reorder what the frame shows."
								footer={
									<Button theme={"primary"} size={"sm"} onClick={() => setOpen(false)}>
										Done
									</Button>
								}
							>
								<LayerList />
							</Sheet>
						</>
					);
				}}
			</For>
		</DocsItemsContainer>
	),
};

/** Opened on load. Hidden from the docs page, where an open modal would cover it. */
export const Bottom: Story = {
	tags: ["!autodocs"],
	render: () => (
		<Sheet
			defaultOpen
			title={
				<>
					Export <strong>image</strong>
				</>
			}
			description="The image keeps the frame's size."
			footer={
				<>
					<Button theme={"secondary"} size={"sm"}>
						Copy
					</Button>
					<Button theme={"primary"} size={"sm"}>
						Export
					</Button>
				</>
			}
		>
			<TextField label="File name" value="codeimage-snippet" />
		</Sheet>
	),
};

/** Opened on load. Hidden from the docs page, where an open modal would cover it. */
export const Right: Story = {
	tags: ["!autodocs"],
	render: () => (
		<Sheet defaultOpen side={"right"} title="Layers" closeLabel="Close layers">
			<LayerList />
		</Sheet>
	),
};

/** Opened on load. Drag the handle down to dismiss, or tap it to close. */
export const Draggable: Story = {
	tags: ["!autodocs"],
	render: () => (
		<Sheet defaultOpen draggable title="Layers" closeLabel="Close layers">
			<LayerList />
		</Sheet>
	),
};

/**
 * A nonmodal sheet built from parts and mounted in the layout, like the
 * CodeImage phone dock. There is no scrim, so the frame above stays usable.
 * Its handle drags the sheet down to dismiss it.
 */
export const DockedParts: Story = {
	tags: ["!autodocs"],
	render: () => {
		const [slot, setSlot] = createSignal<HTMLElement>();
		return (
			<div
				style={{
					display: "flex",
					"flex-direction": "column",
					height: "480px",
					width: "390px",
				}}
			>
				<div style={{ flex: 1, display: "grid", "place-items": "center" }}>
					<Button theme={"secondary"}>Frame</Button>
				</div>
				<div ref={setSlot} style={{ position: "relative", height: "40%" }} />
				<Show when={slot()}>
					{mount => (
						<S.Root defaultOpen modal={false}>
							<S.Portal mount={mount()}>
								<S.Content
									aria-label="Layers"
									style={{ position: "absolute", "max-height": "100%" }}
								>
									<S.Handle aria-label="Close layers" />
									<S.Body>
										<LayerList />
									</S.Body>
								</S.Content>
							</S.Portal>
						</S.Root>
					)}
				</Show>
			</div>
		);
	},
};
