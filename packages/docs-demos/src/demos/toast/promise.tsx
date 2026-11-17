import { Button, createToaster, Toaster } from "@codeui/kit";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function uploadGist(fail: boolean) {
	await wait(1500);
	if (fail) throw new Error("GitHub returned 503.");
	return { url: "https://gist.github.com/codeimage/4f2a" };
}

export default function ToastPromise() {
	const notifications = createToaster();
	const share = (fail: boolean) =>
		notifications.promise(() => uploadGist(fail), {
			loading: { description: "Uploading to GitHub Gist…" },
			success: gist => ({ title: "Gist created", description: gist.url }),
			error: reason => ({
				title: "Upload failed",
				description: reason instanceof Error ? reason.message : "Try again.",
			}),
		});
	return (
		<>
			<Button theme="secondary" onClick={() => share(false)}>
				Share as Gist
			</Button>
			<Button theme="secondary" onClick={() => share(true)}>
				Share, then fail
			</Button>
			<Toaster toaster={notifications} closeLabel="Dismiss" />
		</>
	);
}
