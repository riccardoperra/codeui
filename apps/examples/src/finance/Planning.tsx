import { Accordion, type AccordionEntry, Badge, Button, Progress, Slider, Text } from "@codeui/kit";
import CalendarClock from "lucide-solid/icons/calendar-clock";
import PiggyBank from "lucide-solid/icons/piggy-bank";
import Target from "lucide-solid/icons/target";
import { createSignal, For, type JSX, Show } from "solid-js";
import { MadeWith } from "../shared/ExampleMenu";
import { formatDay, formatMoneyWhole } from "../shared/format";
import { bills, budgets, goals, monthSpending, today } from "./data";
import { useLedger } from "./ledger";

const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

function Budgets() {
	const ledger = useLedger();
	return (
		<ul class="fin-plan-list">
			<For each={budgets}>
				{budget => {
					const spent = () => monthSpending(ledger.transactions(), budget.category);
					const over = () => spent() > budget.limit;
					return (
						<li class="fin-plan-item">
							<div class="fin-plan-line">
								<Text size="sm" weight="medium">
									{budget.category}
								</Text>
								<Show when={over()}>
									<Badge tone="danger">Over</Badge>
								</Show>
								<Text size="xs" tone="muted" class="fin-plan-value ex-tabular">
									{formatMoneyWhole(spent())} of {formatMoneyWhole(budget.limit)}
								</Text>
							</div>
							<Progress aria-label={`${budget.category} budget`} size="sm" value={Math.min(100, (spent() / budget.limit) * 100)} />
						</li>
					);
				}}
			</For>
		</ul>
	);
}

function Bills() {
	const ledger = useLedger();
	const [paid, setPaid] = createSignal<string[]>([]);
	const open = () => bills.filter(bill => !paid().includes(bill.id));
	const pay = (bill: (typeof bills)[number]) => {
		setPaid(list => [...list, bill.id]);
		ledger.notifications.show({
			tone: "success",
			description: `${bill.name} marked as paid.`,
			action: { label: "Undo", onClick: toast => (setPaid(list => list.filter(id => id !== bill.id)), toast.dismiss()) },
		});
	};
	return (
		<ul class="fin-plan-list">
			<For
				each={open()}
				fallback={
					<li>
						<Text as="p" size="sm" weight="medium">
							Nothing due
						</Text>
						<Text as="p" size="xs" tone="muted">
							Every bill for the next 30 days is paid.
						</Text>
					</li>
				}
			>
				{bill => (
					<li class="fin-plan-line">
						<div class="fin-merchant-text">
							<Text as="div" size="sm" weight="medium" class="ex-truncate">
								{bill.name}
							</Text>
							<Text as="div" size="xs" tone="muted" class="ex-tabular">
								{formatMoneyWhole(bill.amount)} · due {formatDay(bill.due)}
							</Text>
						</div>
						<Button theme="secondary" size="xs" class="fin-plan-value" aria-label={`Mark ${bill.name} as paid`} onClick={() => pay(bill)}>
							Mark paid
						</Button>
					</li>
				)}
			</For>
		</ul>
	);
}

function Goals() {
	const [monthly, setMonthly] = createSignal(600);
	// The contribution is split evenly, and each goal shows the month it would be reached.
	const reached = (goal: (typeof goals)[number]) => {
		const months = Math.ceil((goal.target - goal.saved) / (monthly() / goals.length));
		return monthYear.format(new Date(today.getFullYear(), today.getMonth() + months, 1));
	};
	return (
		<div class="fin-plan-list">
			<Slider label="Monthly contribution" minValue={100} maxValue={2000} step={50} value={monthly()} onChange={setMonthly} showValue getValueLabel={({ values }) => formatMoneyWhole(values[0])} />
			<For each={goals}>
				{goal => (
					<div class="fin-plan-item">
						<div class="fin-plan-line">
							<Text size="sm" weight="medium">
								{goal.name}
							</Text>
							<Text size="xs" tone="muted" class="fin-plan-value ex-tabular">
								{formatMoneyWhole(goal.saved)} of {formatMoneyWhole(goal.target)}
							</Text>
						</div>
						<Progress aria-label={goal.name} size="sm" value={(goal.saved / goal.target) * 100} />
						{/* The longest month reserves the width, so dragging the slider does not shift the line. */}
						<Text size="xs" tone="muted" class="ex-tabular">
							Reached in {reached(goal)}
						</Text>
					</div>
				)}
			</For>
		</div>
	);
}

const rovingKeys = ["ArrowUp", "ArrowDown", "Home", "End"];

/**
 * The kit's Accordion moves between its headers on the arrow keys, Home and End, and it also hears
 * them from inside an open section. Stopping them here leaves them to the slider.
 */
const Section = (props: { children: JSX.Element }) => <div onKeyDown={event => rovingKeys.includes(event.key) && event.stopPropagation()}>{props.children}</div>;

/** The side panel: one section open at a time, each with a summary on its header. */
export function Planning() {
	const ledger = useLedger();
	const onTrack = () => budgets.filter(b => monthSpending(ledger.transactions(), b.category) <= b.limit).length;
	// Built once. The Accordion keys its sections by entry object, so a new array would remount the
	// open section and drop its state. The live summary is a text node instead.
	const items: AccordionEntry[] = [
		{ value: "budgets", title: "Budgets", icon: <PiggyBank size={16} />, summary: <>{onTrack()} of {budgets.length} on track</>, get content() { return <Section><Budgets /></Section>; } },
		{ value: "bills", title: "Upcoming", icon: <CalendarClock size={16} />, summary: "Next 30 days", get content() { return <Section><Bills /></Section>; } },
		{ value: "goals", title: "Goals", icon: <Target size={16} />, summary: `${goals.length} active`, get content() { return <Section><Goals /></Section>; } },
	];
	return (
		<div class="fin-plan">
			<Accordion aria-label="Planning" defaultValue="budgets" items={items} />
			<footer class="fin-plan-footer">
				<Text size="xs" tone="muted">
					Budgets cover {monthName}.
				</Text>
				<MadeWith />
			</footer>
		</div>
	);
}
