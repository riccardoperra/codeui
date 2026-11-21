import { Badge, Button, SegmentedControl, SegmentedControlItem, Sheet, type SheetProps, Text } from "@codeui/kit";
import { createMemo, For, Show } from "solid-js";
import { formatMoneyWhole, formatNumber } from "../shared/format";
import { createIsPhone } from "../shared/media";
import { createControlSize } from "../shared/size";
import { type Customer, formatDate, formatLastSeen, mrrOf, type PlanId, planOf, plans, statusLabels, statusOf } from "./data";
import { usePulse } from "./pulse";

/** One customer, beside the table on a desktop and as a bottom sheet on a phone. */
export function CustomerSheet() {
	const pulse = usePulse();
	const isPhone = createIsPhone();
	const size = createControlSize();
	// The last customer stays on screen while the sheet slides out.
	const customer = createMemo<Customer | undefined>(previous =>
		pulse.customers().find(c => c.id === pulse.openCustomer()) ?? previous,
	);
	const placement = (): Pick<SheetProps, "side" | "draggable"> => (isPhone() ? { side: "bottom", draggable: true } : { side: "right" });

	return (
		<Sheet
			{...(placement() as { side: "right" })}
			open={pulse.openCustomer() !== undefined}
			onOpenChange={open => !open && pulse.setOpenCustomer(undefined)}
			title={customer()?.company}
			description={customer()?.owner}
			closeLabel="Close customer"
			contentProps={{
				onCloseAutoFocus: event => {
					const opener = document.querySelector<HTMLElement>(pulse.customerOpener());
					if (!opener) return;
					event.preventDefault();
					opener.focus();
				},
			}}
			footer={
				<Button variant="secondary" size={size()} onClick={() => pulse.archive([customer()!.id])}>
					Archive customer
				</Button>
			}
		>
			<Show when={customer()}>{current => <Details customer={current()} />}</Show>
		</Sheet>
	);
}

function Details(props: { customer: Customer }) {
	const pulse = usePulse();
	const c = () => props.customer;
	const status = () => statusOf(c());
	const facts = () => [
		{ name: "MRR", value: mrrOf(c()) ? formatMoneyWhole(mrrOf(c())) : "—" },
		{ name: "Seats", value: formatNumber(c().seats) },
		{ name: "Active on a working day", value: status() === "churned" ? "—" : formatNumber(Math.round(c().seats * c().engagement)) },
		{ name: "Last seen", value: formatLastSeen(c().lastSeen) },
	];
	const history = () =>
		[
			{ label: "Cancelled", age: c().churned },
			{ label: "First payment", age: c().converted },
			{ label: "Trial started", age: c().joined },
		].filter(event => event.age !== undefined);

	return (
		<div class="dash-detail">
			<div class="dash-detail-line">
				<Badge tone={status() === "past-due" ? "danger" : "neutral"}>{statusLabels[status()]}</Badge>
				<Text size="xs" tone="muted">
					From {c().source.toLowerCase()}
				</Text>
			</div>
			<Show when={status() === "past-due"}>
				<div class="dash-detail-notice">
					<div>
						<Text as="p" size="sm" weight="medium">
							The last payment failed
						</Text>
						<Text as="p" size="xs" tone="muted">
							The card on file was declined.
						</Text>
					</div>
					<Button variant="secondary" size="sm" onClick={() => pulse.retryPayment(c().id)}>
						Retry payment
					</Button>
				</div>
			</Show>
			<dl class="dash-facts">
				<For each={facts()}>
					{fact => (
						<div class="dash-fact">
							<Text as="dt" size="xs" tone="muted">
								{fact.name}
							</Text>
							<Text as="dd" size="md" weight="semibold" class="ex-tabular">
								{fact.value}
							</Text>
						</div>
					)}
				</For>
			</dl>
			<Show when={status() !== "churned"}>
				<section class="dash-detail-group" aria-labelledby="detail-plan">
					<Text as="h3" id="detail-plan" size="xs" weight="semibold" tone="muted">
						Plan
					</Text>
					{/* Three short options in a modal surface: a segmented control, not a select (DESIGN.md §9.1). */}
					<SegmentedControl aria-labelledby="detail-plan" fluid value={c().plan} onChange={value => pulse.setPlan(c().id, value as PlanId)}>
						{plans.map(plan => (
							<SegmentedControlItem value={plan.id}>{plan.name}</SegmentedControlItem>
						))}
					</SegmentedControl>
					<Text as="p" size="xs" tone="muted" class="ex-tabular">
						{formatMoneyWhole(planOf(c().plan).price)} per seat, each month.
					</Text>
				</section>
			</Show>
			<section class="dash-detail-group" aria-labelledby="detail-history">
				<Text as="h3" id="detail-history" size="xs" weight="semibold" tone="muted">
					History
				</Text>
				<ul>
					<For each={history()}>
						{event => (
							<li class="dash-detail-line dash-history-row">
								<Text size="caption">{event.label}</Text>
								<Text size="caption" tone="muted" class="ex-tabular">
									{formatDate(event.age!)}
								</Text>
							</li>
						)}
					</For>
				</ul>
			</section>
		</div>
	);
}
