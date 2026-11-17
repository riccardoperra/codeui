import { createContext, createMemo, createSignal, useContext } from "solid-js";
import type { ToastController } from "@codeui/kit";
import {
	type Account,
	balance,
	type Category,
	createTransactions,
	daysAgo,
	type PeriodId,
	periods,
	periodTransactions,
	spendingByCategory,
	spendingSeries,
	summarize,
	today,
	type Transaction,
} from "./data";

/** The app's state. Every figure on the page derives from `transactions`, `account` and `period`, so they always agree. */
export function createLedger(notifications: ToastController) {
	const [transactions, setTransactions] = createSignal(createTransactions());
	const [account, setAccount] = createSignal<Account["id"]>("all");
	const [period, setPeriod] = createSignal<PeriodId>("30d");
	const [adding, setAdding] = createSignal(false);

	const scope = () => ({ account: account(), period: period() });
	const current = createMemo(() => periodTransactions(transactions(), scope()));
	const previous = createMemo(() => periodTransactions(transactions(), scope(), 1));
	const summary = createMemo(() => summarize(current()));
	const previousSummary = createMemo(() => summarize(previous()));
	const days = () => periods.find(p => p.id === period())!.days;

	const add = (transaction: Omit<Transaction, "id" | "date" | "pending">) => {
		const created: Transaction = { ...transaction, id: `new-${Date.now()}`, date: today, pending: true };
		setTransactions(list => [created, ...list]);
		notifications.show({
			tone: "success",
			description: `${created.merchant} added.`,
			action: { label: "Undo", onClick: toast => (remove(created.id, false), toast.dismiss()) },
		});
	};

	const remove = (id: string, announce = true) => {
		const index = transactions().findIndex(t => t.id === id);
		const removed = transactions()[index];
		if (!removed) return;
		setTransactions(list => list.filter(t => t.id !== id));
		if (!announce) return;
		notifications.show({
			description: `${removed.merchant} deleted.`,
			action: {
				label: "Undo",
				onClick: toast => {
					setTransactions(list => [...list.slice(0, index), removed, ...list.slice(index)]);
					toast.dismiss();
				},
			},
		});
	};

	const setCategory = (id: string, category: Category) =>
		setTransactions(list => list.map(t => (t.id === id ? { ...t, category } : t)));

	return {
		notifications,
		transactions,
		account,
		setAccount,
		period,
		setPeriod,
		adding,
		setAdding,
		current,
		summary,
		previousSummary,
		balance: createMemo(() => balance(transactions(), scope())),
		balanceBefore: createMemo(() => balance(transactions(), scope(), daysAgo(days()))),
		series: createMemo(() => spendingSeries(transactions(), scope())),
		byCategory: createMemo(() => spendingByCategory(current())),
		add,
		remove,
		setCategory,
	};
}

export type Ledger = ReturnType<typeof createLedger>;

export const LedgerContext = createContext<Ledger>();

export function useLedger() {
	const ledger = useContext(LedgerContext);
	if (!ledger) throw new Error("useLedger needs the LedgerContext provider.");
	return ledger;
}
