import { Button } from "@codeui/kit";
import * as S from "@codeui/kit/sheet";

/** Open and non-modal, with the overlay and panel drawn inside the figure instead of over the page. */
export default function SheetAnatomy() {
	return (
		<S.Root modal={false} open>
			<div style={{ display: "grid", gap: "var(--cui-space-3)", "justify-items": "center", width: "100%" }}>
				<S.Trigger as={Button} theme="secondary">
					Open layers
				</S.Trigger>
				<div style={{ position: "relative", width: "100%", "max-width": "420px", padding: "24px 12px 0", "border-radius": "16px", overflow: "hidden" }}>
					<S.Overlay style={{ position: "absolute", inset: 0 }} />
					<S.Content side="bottom" style={{ position: "relative", inset: "auto", transform: "none", width: "100%" }}>
						<S.Handle aria-label="Close layers" />
						<S.Header>
							<S.Title>Layers</S.Title>
							<S.CloseButton aria-label="Close layers" />
						</S.Header>
						<S.Description>Layers visible in the exported image.</S.Description>
						<S.Body>
							<p>Background, window, code, and watermark.</p>
						</S.Body>
						<S.Footer>
							<Button theme="primary">Done</Button>
						</S.Footer>
					</S.Content>
				</div>
			</div>
		</S.Root>
	);
}
