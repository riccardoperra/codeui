import {
	Badge,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	IconButton,
} from "@codeui/kit";
import { createSignal, For } from "solid-js";
import { MoreIcon } from "./icons";
import "./showcase.css";

type Member = { name: string; email: string; role: string };

export default function Members() {
	const [members, setMembers] = createSignal<Member[]>([
		{ name: "Ada Lovelace", email: "ada@example.com", role: "Owner" },
		{ name: "Grace Hopper", email: "grace@example.com", role: "Admin" },
		{ name: "Alan Turing", email: "alan@example.com", role: "Member" },
	]);
	const setRole = (email: string, role: string) => setMembers(list => list.map(m => (m.email === email ? { ...m, role } : m)));
	return (
		<ul class="showcase-list" aria-label="Team members">
			<For each={members()}>
				{member => (
					<li class="showcase-member">
						<span class="showcase-avatar" aria-hidden="true">
							{member.name.split(" ").map(part => part[0]).join("")}
						</span>
						<span class="showcase-member-text">
							<span class="showcase-member-name">{member.name}</span>
							<span class="showcase-meta">{member.email}</span>
						</span>
						<Badge>{member.role}</Badge>
						<DropdownMenu>
							<DropdownMenuTrigger as={IconButton} size="sm" variant="secondary" ghost aria-label={`Actions for ${member.name}`}>
								<MoreIcon />
							</DropdownMenuTrigger>
							<DropdownMenuPortal>
								<DropdownMenuContent>
									<DropdownMenuItem onSelect={() => setRole(member.email, "Admin")}>Make admin</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setRole(member.email, "Member")}>Make member</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Resend invite</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenuPortal>
						</DropdownMenu>
					</li>
				)}
			</For>
		</ul>
	);
}
