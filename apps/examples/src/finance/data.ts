// Sample data. A seeded generator, so every visit and every screenshot shows the same ledger.

export const today = new Date(2026, 10, 17);

export type AccountId = "checking" | "savings" | "card";
export type Account = { id: AccountId | "all"; name: string };

export const accounts: Account[] = [
	{ id: "all", name: "All accounts" },
	{ id: "checking", name: "Everyday checking" },
	{ id: "savings", name: "Savings" },
	{ id: "card", name: "Travel card" },
];

const openingBalance: Record<AccountId, number> = { checking: 3200, savings: 18400, card: 0 };

export const categories = ["Housing", "Groceries", "Dining", "Transport", "Subscriptions", "Shopping", "Health", "Travel"] as const;
export type Category = (typeof categories)[number] | "Income";

export type Transaction = {
	id: string;
	date: Date;
	merchant: string;
	category: Category;
	/** Negative for money out. */
	amount: number;
	account: AccountId;
	pending: boolean;
};

export type PeriodId = "30d" | "90d" | "12m";
export const periods: { id: PeriodId; label: string; days: number; buckets: number }[] = [
	{ id: "30d", label: "30 days", days: 30, buckets: 30 },
	{ id: "90d", label: "90 days", days: 91, buckets: 13 },
	{ id: "12m", label: "12 months", days: 364, buckets: 12 },
];

const merchants: [name: string, category: Category, min: number, max: number, account: AccountId][] = [
	["Whole Harvest", "Groceries", 24, 140, "checking"],
	["Corner Market", "Groceries", 8, 46, "checking"],
	["Lantern Ramen", "Dining", 14, 58, "card"],
	["Blue Bottle", "Dining", 4, 12, "card"],
	["Tartine", "Dining", 9, 34, "card"],
	["Metro Transit", "Transport", 3, 24, "checking"],
	["Lyft", "Transport", 9, 42, "card"],
	["Shell", "Transport", 32, 71, "checking"],
	["Uniqlo", "Shopping", 19, 160, "card"],
	["Field Notes", "Shopping", 12, 48, "card"],
	["Bay Pharmacy", "Health", 7, 64, "checking"],
	["Alaska Airlines", "Travel", 180, 520, "card"],
];

const recurring: [day: number, name: string, category: Category, amount: number, account: AccountId][] = [
	[1, "Northside Rentals", "Housing", -2150, "checking"],
	[1, "Acme Corp payroll", "Income", 3840, "checking"],
	[15, "Acme Corp payroll", "Income", 3840, "checking"],
	[3, "City Power & Water", "Housing", -124, "checking"],
	[5, "Fiber Internet", "Subscriptions", -70, "checking"],
	[8, "Spotify", "Subscriptions", -11.99, "card"],
	[12, "iCloud+", "Subscriptions", -9.99, "card"],
	[19, "Climb Gym", "Health", -89, "card"],
	[22, "Figma", "Subscriptions", -15, "card"],
	[28, "Savings interest", "Income", 61.4, "savings"],
];

function mulberry32(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const dayMs = 86_400_000;
export const daysAgo = (days: number) => new Date(today.getTime() - days * dayMs);

export function createTransactions(): Transaction[] {
	const random = mulberry32(7);
	const list: Transaction[] = [];
	let id = 0;
	// Two years, so the longest period still has a period before it to compare with.
	for (let age = 729; age >= 0; age--) {
		const date = daysAgo(age);
		for (const [day, merchant, category, amount, account] of recurring) {
			if (date.getDate() === day) list.push({ id: `t${id++}`, date, merchant, category, amount, account, pending: false });
		}
		const count = Math.floor(random() * 3.4);
		for (let n = 0; n < count; n++) {
			const [merchant, category, min, max, account] = merchants[Math.floor(random() * merchants.length)];
			// Flights are rare: most draws of the travel merchant are skipped.
			if (category === "Travel" && random() > 0.12) continue;
			const amount = -Math.round((min + random() * (max - min)) * 100) / 100;
			list.push({ id: `t${id++}`, date, merchant, category, amount, account, pending: age < 2 && random() > 0.4 });
		}
	}
	return list.reverse();
}

export type Scope = { account: Account["id"]; period: PeriodId };

const inAccount = (scope: Scope) => (t: Transaction) => scope.account === "all" || t.account === scope.account;

/** The transactions of the period (`offset` 0) or of the one before it (`offset` 1). */
export function periodTransactions(all: readonly Transaction[], scope: Scope, offset = 0) {
	const { days } = periods.find(p => p.id === scope.period)!;
	const end = today.getTime() - offset * days * dayMs;
	const start = end - days * dayMs;
	return all.filter(inAccount(scope)).filter(t => t.date.getTime() > start && t.date.getTime() <= end);
}

const sum = (list: readonly Transaction[], sign: 1 | -1) =>
	list.reduce((total, t) => (Math.sign(t.amount) === sign ? total + Math.abs(t.amount) : total), 0);

export function summarize(list: readonly Transaction[]) {
	const income = sum(list, 1);
	const spending = sum(list, -1);
	return { income, spending, savingsRate: income ? (income - spending) / income : 0 };
}

export function balance(all: readonly Transaction[], scope: Scope, before = today) {
	const opening = scope.account === "all" ? Object.values(openingBalance).reduce((a, b) => a + b) : openingBalance[scope.account];
	return all.filter(inAccount(scope)).reduce((total, t) => (t.date <= before ? total + t.amount : total), opening);
}

const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const month = new Intl.DateTimeFormat("en-US", { month: "short" });

/** Cumulative spending per bucket: the period, and the one before it on the same axis. */
export function spendingSeries(all: readonly Transaction[], scope: Scope) {
	const period = periods.find(p => p.id === scope.period)!;
	const bucketDays = period.days / period.buckets;
	const cumulative = (offset: number) => {
		const totals = Array<number>(period.buckets).fill(0);
		const end = today.getTime() - offset * period.days * dayMs;
		for (const t of periodTransactions(all, scope, offset)) {
			if (t.amount >= 0) continue;
			const age = (end - t.date.getTime()) / dayMs;
			totals[period.buckets - 1 - Math.min(period.buckets - 1, Math.floor(age / bucketDays))] -= t.amount;
		}
		let running = 0;
		return totals.map(v => Math.round((running += v)));
	};
	const labels = Array.from({ length: period.buckets }, (_, i) => {
		const date = daysAgo((period.buckets - 1 - i) * bucketDays);
		return scope.period === "12m" ? month.format(date) : monthDay.format(date);
	});
	return { labels, current: cumulative(0), previous: cumulative(1) };
}

export function spendingByCategory(list: readonly Transaction[]) {
	const totals = new Map<string, number>();
	for (const t of list) if (t.amount < 0) totals.set(t.category, (totals.get(t.category) ?? 0) - t.amount);
	return [...totals].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

/** Monthly limits. The side panel reads the current calendar month against them. */
export const budgets: { category: Category; limit: number }[] = [
	{ category: "Groceries", limit: 620 },
	{ category: "Dining", limit: 340 },
	{ category: "Transport", limit: 260 },
	{ category: "Shopping", limit: 300 },
	{ category: "Subscriptions", limit: 120 },
];

export function monthSpending(all: readonly Transaction[], category: Category) {
	return all.reduce(
		(total, t) =>
			t.category === category && t.amount < 0 && t.date.getMonth() === today.getMonth() && t.date.getFullYear() === today.getFullYear()
				? total - t.amount
				: total,
		0,
	);
}

export const bills = [
	{ id: "gym", name: "Climb Gym", due: new Date(2026, 10, 19), amount: 89 },
	{ id: "figma", name: "Figma", due: new Date(2026, 10, 22), amount: 15 },
	{ id: "rent", name: "Northside Rentals", due: new Date(2026, 11, 1), amount: 2150 },
	{ id: "power", name: "City Power & Water", due: new Date(2026, 11, 3), amount: 124 },
];

export const goals = [
	{ id: "emergency", name: "Emergency fund", saved: 14200, target: 20000 },
	{ id: "japan", name: "Japan trip", saved: 2350, target: 6000 },
];
