import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	OptionCardGroup,
	SegmentedControl,
	SegmentedControlItem,
	SettingsGroup,
	SettingsRow,
	Switch,
	Text,
	TextField,
} from "@codeui/kit";
import * as D from "@codeui/kit/dialog/parts";
import Bell from "lucide-solid/icons/bell";
import ChevronDown from "lucide-solid/icons/chevron-down";
import Palette from "lucide-solid/icons/palette";
import SlidersHorizontal from "lucide-solid/icons/sliders-horizontal";
import Users from "lucide-solid/icons/users";
import { createEffect, createSignal, For, type JSX, Match, Show, Switch as SwitchMatch } from "solid-js";
import { createIsPhone } from "../shared/media";
import { setTheme, theme, type Theme } from "../shared/theme";
import type { Role, WeekStart } from "./data";
import { type SectionId, usePulse } from "./pulse";

/** The command menu lists the same sections. `terms` is what the search field matches. */
export const sections: { id: SectionId; name: string; icon: () => JSX.Element; terms: string }[] = [
	{ id: "general", name: "General", icon: () => <SlidersHorizontal size={16} />, terms: "workspace name week starts on compare previous range" },
	{ id: "appearance", name: "Appearance", icon: () => <Palette size={16} />, terms: "theme dark light" },
	{ id: "notifications", name: "Notifications", icon: () => <Bell size={16} />, terms: "email weekly digest alerts signup trial payment cancellation" },
	{ id: "members", name: "Members", icon: () => <Users size={16} />, terms: "invite people role admin owner remove" },
];

const alerts = [
	{ key: "signups", label: "New signup", description: "When an account starts a trial." },
	{ key: "trialEnding", label: "Trial ending", description: "Three days before a trial ends without a card." },
	{ key: "paymentFailed", label: "Payment failed", description: "When a renewal is declined." },
	{ key: "cancellations", label: "Cancellation", description: "When a customer cancels a subscription." },
] as const;

export function Settings() {
	const pulse = usePulse();
	const isPhone = createIsPhone();
	const [query, setQuery] = createSignal("");
	// The last section stays on screen while the dialog closes.
	const [shown, setShown] = createSignal<SectionId>("general");
	createEffect(() => pulse.section() && setShown(pulse.section()!));

	const matches = () => {
		const text = query().trim().toLowerCase();
		return sections.filter(item => !text || `${item.name} ${item.terms}`.toLowerCase().includes(text));
	};
	// While searching, the first match is on screen unless the current section matches too.
	const current = () => matches().find(item => item.id === shown()) ?? matches()[0];
	let content: HTMLDivElement | undefined;

	return (
		<D.Root open={pulse.section() !== undefined} onOpenChange={open => !open && (pulse.setSection(undefined), setQuery(""))}>
			<D.Portal>
				<D.Overlay />
				<D.Positioner size="settings">
					<D.Content
						ref={content}
						size="settings"
						chrome="inset"
						// "Invite" lands in its field. A phone gets the section instead, so its keyboard stays closed.
						onOpenAutoFocus={event => {
							event.preventDefault();
							const invite = !isPhone() && shown() === "members" && content?.querySelector<HTMLElement>(".dash-invite input");
							(invite || content?.querySelector<HTMLElement>("[aria-current=page]"))?.focus();
						}}
					>
						<D.Sidebar search={<TextField size="sm" aria-label="Search settings" placeholder="Search settings" value={query()} onChange={setQuery} />}>
							<D.Nav aria-label="Settings sections">
								<For each={matches()}>
									{item => (
										<D.NavItem icon={item.icon()} current={current() === item} onClick={() => pulse.setSection(item.id)}>
											{item.name}
										</D.NavItem>
									)}
								</For>
							</D.Nav>
						</D.Sidebar>
						<D.Main>
							<D.Header>
								<D.Title class="dash-crumbs">
									<span>Settings</span>
									<span aria-hidden="true">/</span>
									<span>{current()?.name ?? "Search"}</span>
								</D.Title>
								<D.CloseButton aria-label="Close settings" />
							</D.Header>
							<D.Body>
								<SwitchMatch
									fallback={
										<div class="dash-empty" role="status">
											<Text as="p" size="sm" weight="medium">
												No settings match
											</Text>
											<Text as="p" size="xs" tone="muted">
												Nothing in settings is called “{query().trim()}”.
											</Text>
											<Button variant="secondary" size="sm" onClick={() => setQuery("")}>
												Clear search
											</Button>
										</div>
									}
								>
									<Match when={current()?.id === "general"}>
										<General />
									</Match>
									<Match when={current()?.id === "appearance"}>
										<Appearance />
									</Match>
									<Match when={current()?.id === "notifications"}>
										<Notifications />
									</Match>
									<Match when={current()?.id === "members"}>
										<Members />
									</Match>
								</SwitchMatch>
							</D.Body>
						</D.Main>
					</D.Content>
				</D.Positioner>
			</D.Portal>
		</D.Root>
	);
}

function General() {
	const pulse = usePulse();
	return (
		<>
			<SettingsGroup title="Workspace">
				<SettingsRow label="Name" description="Shown in the navigation and in invites.">
					{control => (
						<div class="dash-settings-field">
							<TextField {...control} size="sm" value={pulse.workspace()} onChange={pulse.setWorkspace} />
						</div>
					)}
				</SettingsRow>
			</SettingsGroup>
			<SettingsGroup title="Reports">
				<SettingsRow label="Week starts on" description="The 90-day range groups its days into weeks from this day.">
					{control => (
						// A segmented control is 84px per option in settings (DESIGN.md §6).
						<div class="dash-settings-segments">
							<SegmentedControl {...control} size="sm" fluid value={pulse.weekStart()} onChange={value => pulse.setWeekStart(value as WeekStart)}>
								<SegmentedControlItem value="monday">Monday</SegmentedControlItem>
								<SegmentedControlItem value="sunday">Sunday</SegmentedControlItem>
							</SegmentedControl>
						</div>
					)}
				</SettingsRow>
				<SettingsRow label="Compare with the previous range" description="Draw the range before as a second line on Active users." compactControl>
					{control => <Switch {...control} checked={pulse.compare()} onChange={pulse.setCompare} />}
				</SettingsRow>
			</SettingsGroup>
		</>
	);
}

/**
 * A schematic of the layout in the theme's own surfaces (DESIGN.md §9.4). The hex values are the
 * page, island and field of that theme: tokens would draw both cards in the theme that is on.
 */
function ThemePreview(props: { page: string; island: string; field: string }) {
	return (
		<svg width="96" height="52" viewBox="0 0 96 52" aria-hidden="true">
			{/* A light page on a light well would vanish without a ring (DESIGN.md §2.5). */}
			<rect x="0.5" y="0.5" width="95" height="51" rx="6" fill={props.page} stroke="currentColor" stroke-opacity="0.2" />
			<rect x="5" y="10" width="22" height="37" rx="4" fill={props.island} />
			<rect x="31" y="10" width="60" height="37" rx="4" fill={props.island} />
			<rect x="9" y="15" width="14" height="4" rx="2" fill={props.field} />
			<rect x="36" y="15" width="23" height="12" rx="3" fill={props.field} />
			<rect x="63" y="15" width="23" height="12" rx="3" fill={props.field} />
			<rect x="36" y="31" width="50" height="11" rx="3" fill={props.field} />
		</svg>
	);
}

function Appearance() {
	return (
		<SettingsGroup title="Theme">
			<SettingsRow label="Colour mode" description="Applies to this browser. The command menu can preview it." layout="wide">
				{control => (
					<OptionCardGroup
						{...control}
						value={theme()}
						onChange={(value: Theme) => setTheme(value)}
						items={[
							{ value: "dark", label: "Dark", description: "Dark surfaces, easy on the eyes", preview: <ThemePreview page="#151516" island="#0f0f10" field="#232323" /> },
							{ value: "light", label: "Light", description: "Bright surfaces for daylight", preview: <ThemePreview page="#ffffff" island="#f7f9fb" field="#eceff1" /> },
						]}
					/>
				)}
			</SettingsRow>
		</SettingsGroup>
	);
}

function Notifications() {
	const pulse = usePulse();
	return (
		<>
			<SettingsGroup title="Reports">
				<SettingsRow label="Weekly digest" description="A summary of MRR, signups and churn every Monday." compactControl>
					{control => <Switch {...control} checked={pulse.alerts.digest} onChange={checked => pulse.setAlerts("digest", checked)} />}
				</SettingsRow>
			</SettingsGroup>
			<SettingsGroup title="Email alerts">
				<For each={alerts}>
					{alert => (
						<SettingsRow label={alert.label} description={alert.description} compactControl>
							{control => <Switch {...control} checked={pulse.alerts[alert.key]} onChange={checked => pulse.setAlerts(alert.key, checked)} />}
						</SettingsRow>
					)}
				</For>
			</SettingsGroup>
		</>
	);
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Members() {
	const pulse = usePulse();
	const [email, setEmail] = createSignal("");
	const [error, setError] = createSignal<string>();

	const submit = (event: SubmitEvent) => {
		event.preventDefault();
		const value = email().trim().toLowerCase();
		if (!emailPattern.test(value)) return setError("Enter an email address, such as name@company.com.");
		if (pulse.members().some(member => member.email === value)) return setError("This person is already in the workspace.");
		pulse.invite(value);
		setEmail("");
	};

	return (
		<>
			<SettingsGroup title="Invite" description={`New people join ${pulse.workspace().trim() || "the workspace"} as members.`}>
				<form class="dash-invite" onSubmit={submit} novalidate>
					<TextField
						aria-label="Email address"
						type="email"
						size="sm"
						placeholder="name@company.com"
						value={email()}
						onChange={value => (setEmail(value), setError(undefined))}
						validationState={error() ? "invalid" : "valid"}
						errorMessage={error()}
					/>
					<Button type="submit" variant="primary" size="sm">
						Send invite
					</Button>
				</form>
			</SettingsGroup>
			<SettingsGroup title="Members" description={`${pulse.members().length} people`}>
				<For each={pulse.members()}>
					{member => (
						<SettingsRow
							label={member.name}
							description={member.email}
							picture={
								<span class="dash-avatar" aria-hidden="true">
									{member.name[0].toUpperCase()}
								</span>
							}
							marker={member.invited ? <Badge>Invited</Badge> : undefined}
						>
							<Show
								when={member.role !== "Owner"}
								fallback={
									<Text size="sm" tone="muted" class="dash-role">
										Owner
									</Text>
								}
							>
								<DropdownMenu placement="bottom-end">
									<DropdownMenuTrigger as={Button} variant="secondary" size="sm" class="dash-role" aria-label={`Role of ${member.name}: ${member.role}`}>
										{member.role}
										<ChevronDown size={16} />
									</DropdownMenuTrigger>
									<DropdownMenuPortal>
										<DropdownMenuContent>
											<For each={["Admin", "Member"] satisfies Role[]}>
												{role => (
													<DropdownMenuItem disabled={member.role === role} onSelect={() => pulse.setRole(member.id, role)}>
														{role}
													</DropdownMenuItem>
												)}
											</For>
											<DropdownMenuSeparator />
											<DropdownMenuItem onSelect={() => pulse.removeMember(member.id)}>{member.invited ? "Cancel invite" : "Remove from workspace"}</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenuPortal>
								</DropdownMenu>
							</Show>
						</SettingsRow>
					)}
				</For>
			</SettingsGroup>
		</>
	);
}
