import { Button, createToaster, Toaster } from "@codeui/kit";
import type { ToastPosition } from "@codeui/kit/toast/parts";
import { For } from "solid-js";

const positions: ToastPosition[] = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];

export default function ToastPositions() {
	// A Toaster has one position. Each position needs its own controller.
	const toasters = positions.map(position => ({ position, toaster: createToaster() }));
	return (
		<For each={toasters}>
			{({ position, toaster }) => (
				<>
					<Button
						variant="secondary"
						onClick={() => toaster.show({ description: `Shown at ${position}.` })}
					>
						{position}
					</Button>
					<Toaster
						toaster={toaster}
						position={position}
						closeLabel="Dismiss"
						aria-label={`Notifications, ${position}`}
					/>
				</>
			)}
		</For>
	);
}
