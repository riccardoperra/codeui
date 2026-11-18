import { Button, createToaster, Toaster } from "@codeui/kit";

const snippet = `fn main() {\n    println!("Hello, CodeImage");\n}`;

/** Draws the snippet on a canvas and encodes it as a PNG. */
async function renderPng(code: string, scale: number): Promise<Blob> {
	const canvas = document.createElement("canvas");
	canvas.width = 640 * scale;
	canvas.height = 240 * scale;
	const context = canvas.getContext("2d");
	if (!context) throw new Error("This browser cannot draw the image.");
	context.scale(scale, scale);
	context.fillStyle = "#1e1e2e";
	context.fillRect(0, 0, 640, 240);
	context.fillStyle = "#cdd6f4";
	context.font = "16px ui-monospace, monospace";
	code.split("\n").forEach((line, index) => context.fillText(line, 32, 64 + index * 24));
	const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
	if (!blob) throw new Error("The image is too large to encode. Lower the scale.");
	return blob;
}

function download(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ExportFlow() {
	const notifications = createToaster();

	const exportPng = (scale: number) =>
		notifications.promise(() => renderPng(snippet, scale), {
			loading: { description: `Exporting main.rs at ${scale}×…` },
			success: blob => {
				download(blob, `main-rs@${scale}x.png`);
				return { description: `main-rs@${scale}x.png saved (${Math.round(blob.size / 1024)} KB).` };
			},
			error: reason => ({
				title: "Export failed",
				description: reason instanceof Error ? reason.message : "Try again.",
				duration: Infinity,
				action: {
					label: "Retry at 1×",
					onClick: toast => {
						toast.dismiss();
						exportPng(1);
					},
				},
			}),
		});

	return (
		<>
			<Button variant="primary" onClick={() => exportPng(2)}>
				Export PNG
			</Button>
			<Button variant="secondary" onClick={() => exportPng(64)}>
				Export at 64×
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
