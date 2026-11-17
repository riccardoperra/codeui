import { Accordion, type AccordionEntry, SegmentedControl, SegmentedControlItem, Switch } from "@codeui/kit";
import { createSignal } from "solid-js";
import { BellIcon, CardIcon, LockIcon } from "./icons";
import "./showcase.css";

export default function Workspace() {
	const [billing, setBilling] = createSignal("monthly");
	const [mentions, setMentions] = createSignal(true);
	const [publicProfile, setPublicProfile] = createSignal(false);
	// One stable array: a new one would rebuild every section, and the control in use, on each change.
	// Summaries are getters so they follow the values; content is a getter so it is built when its section opens.
	// Sections share one height and one always stays open, so the tile never changes height and the grid never reflows.
	const items: AccordionEntry[] = [
		{
			value: "billing",
			title: "Billing",
			icon: <CardIcon />,
			get summary() {
				return billing() === "monthly" ? "Monthly" : "Yearly";
			},
			get content() {
				return (
					<div class="showcase-accordion-body">
						<SegmentedControl aria-label="Billing period" value={billing()} onChange={setBilling} size="sm" fluid>
							<SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
							<SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
						</SegmentedControl>
					</div>
				);
			},
		},
		{
			value: "notifications",
			title: "Notifications",
			icon: <BellIcon />,
			get summary() {
				return mentions() ? "On" : "Off";
			},
			get content() {
				return (
					<div class="showcase-accordion-body">
						<Switch label="Email me about mentions" checked={mentions()} onChange={setMentions} />
					</div>
				);
			},
		},
		{
			value: "privacy",
			title: "Privacy",
			icon: <LockIcon />,
			get summary() {
				return publicProfile() ? "Public" : "Private";
			},
			get content() {
				return (
					<div class="showcase-accordion-body">
						<Switch label="Public profile" checked={publicProfile()} onChange={setPublicProfile} />
					</div>
				);
			},
		},
	];
	return <Accordion aria-label="Workspace settings" defaultValue="billing" collapsible={false} items={items} />;
}
