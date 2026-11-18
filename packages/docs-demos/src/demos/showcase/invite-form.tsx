import { Button, Select, TextArea, TextField } from "@codeui/kit";
import { createSignal } from "solid-js";
import "./showcase.css";

const roles = ["Viewer", "Editor", "Admin"];

export default function InviteMember() {
	const [role, setRole] = createSignal("Editor");
	const [email, setEmail] = createSignal("");
	const [sent, setSent] = createSignal("");
	return (
		<form
			class="showcase-stack"
			onSubmit={event => {
				event.preventDefault();
				setSent(email() ? `Invite sent to ${email()}.` : "Enter an email first.");
			}}
		>
			<TextField size="sm" label="Email" type="email" placeholder="name@example.com" value={email()} onChange={setEmail} />
			<Select size="sm" label="Role" options={roles} value={role()} onChange={value => value && setRole(value)} />
			<TextArea size="sm" label="Message" placeholder="Optional" />
			<div class="showcase-row" style={{ "justify-content": "space-between" }}>
				<p class="showcase-meta" role="status">
					{sent()}
				</p>
				<Button type="submit" variant="primary" size="sm">
					Send invite
				</Button>
			</div>
		</form>
	);
}
