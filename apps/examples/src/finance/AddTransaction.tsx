import { Button, Dialog, DialogPanelContent, DialogPanelFooter, NumberField, OptionCardGroup, SegmentedControl, SegmentedControlItem, Stack, TextField } from "@codeui/kit";
import { createSignal, Show } from "solid-js";
import { type AccountId, accounts, categories, type Category } from "./data";
import { useLedger } from "./ledger";

type Kind = "expense" | "income";

/** A blocking form, so its choices are segments and cards, not selects (DESIGN.md §9.1). */
export function AddTransaction() {
	const ledger = useLedger();
	const [kind, setKind] = createSignal<Kind>("expense");
	const [merchant, setMerchant] = createSignal("");
	const [amount, setAmount] = createSignal<number | null>(null);
	const [category, setCategory] = createSignal<Category>("Groceries");
	const [account, setAccount] = createSignal<AccountId>("checking");
	const [submitted, setSubmitted] = createSignal(false);

	const merchantError = () => submitted() && !merchant().trim();
	const amountError = () => submitted() && !(amount() && amount()! > 0);

	const close = () => {
		ledger.setAdding(false);
		setSubmitted(false);
		setMerchant("");
		setAmount(null);
	};

	const submit = (event: SubmitEvent) => {
		event.preventDefault();
		setSubmitted(true);
		if (merchantError() || amountError()) return;
		const income = kind() === "income";
		ledger.add({
			merchant: merchant().trim(),
			amount: income ? amount()! : -amount()!,
			category: income ? "Income" : category(),
			account: account(),
		});
		close();
	};

	return (
		<Dialog open={ledger.adding()} onOpenChange={open => (open ? ledger.setAdding(true) : close())} title="Add transaction" size="md" closeLabel="Close">
			<form onSubmit={submit} novalidate>
				<DialogPanelContent>
					<Stack gap="4">
						<SegmentedControl aria-label="Type" value={kind()} onChange={value => setKind(value as Kind)}>
							<SegmentedControlItem value="expense">Expense</SegmentedControlItem>
							<SegmentedControlItem value="income">Income</SegmentedControlItem>
						</SegmentedControl>
						<div class="fin-form-row">
							<TextField
								label={kind() === "income" ? "From" : "Merchant"}
								placeholder={kind() === "income" ? "Acme Corp payroll" : "Corner Market"}
								value={merchant()}
								onChange={setMerchant}
								validationState={merchantError() ? "invalid" : "valid"}
								errorMessage="Enter a name."
							/>
							<NumberField
								label="Amount"
								placeholder="0.00"
								prefix="$"
								min={0}
								precision={2}
								value={amount()}
								onChange={value => setAmount(value ?? null)}
								validationState={amountError() ? "invalid" : "valid"}
								errorMessage="Enter an amount above zero."
							/>
						</div>
						<Show when={kind() === "expense"}>
							<OptionCardGroup
								label="Category"
								variant="tile"
								class="fin-tiles"
								value={category()}
								onChange={setCategory}
								items={categories.map(value => ({ value, label: value }))}
							/>
						</Show>
						<OptionCardGroup
							label="Account"
							variant="tile"
							class="fin-tiles fin-tiles-3"
							value={account()}
							onChange={setAccount}
							items={accounts.filter(a => a.id !== "all").map(a => ({ value: a.id as AccountId, label: a.name }))}
						/>
					</Stack>
				</DialogPanelContent>
				<DialogPanelFooter>
					<Stack direction="row" gap="2" justify="end">
						<Button type="button" theme="secondary" onClick={close}>
							Cancel
						</Button>
						<Button type="submit" theme="primary">
							Add transaction
						</Button>
					</Stack>
				</DialogPanelFooter>
			</form>
		</Dialog>
	);
}
