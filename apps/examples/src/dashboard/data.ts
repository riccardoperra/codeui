// Sample data. A seeded generator, so every visit and every screenshot shows the same workspace.

export const today = new Date(2026, 10, 17);

const dayMs = 86_400_000;
export const daysAgo = (days: number) => new Date(today.getTime() - days * dayMs);

export type PlanId = "starter" | "team" | "business";
/** `price` is per seat, per month. */
export const plans: { id: PlanId; name: string; price: number }[] = [
	{ id: "starter", name: "Starter", price: 12 },
	{ id: "team", name: "Team", price: 24 },
	{ id: "business", name: "Business", price: 48 },
];
export const planOf = (id: PlanId) => plans.find(plan => plan.id === id)!;

export const sources = ["Organic search", "Referral", "Docs", "Product Hunt", "Newsletter", "Partners"] as const;
export type Source = (typeof sources)[number];

export type Status = "active" | "past-due" | "trial" | "churned";
export const statusLabels: Record<Status, string> = { active: "Active", "past-due": "Past due", trial: "Trial", churned: "Churned" };

/** Ages are whole days before `today`, so every figure can ask "what was true N days ago". */
export type Customer = {
	id: string;
	company: string;
	owner: string;
	plan: PlanId;
	seats: number;
	source: Source;
	/** The day the trial started. */
	joined: number;
	/** The day of the first payment. Missing while on trial. */
	converted?: number;
	/** The day the subscription was cancelled. */
	churned?: number;
	pastDue: boolean;
	/** Minutes since someone in the account opened the product. */
	lastSeen: number;
	/** The share of seats that are active on a working day. */
	engagement: number;
};

export type RangeId = "7d" | "30d" | "90d";
export const ranges: { id: RangeId; label: string; days: number }[] = [
	{ id: "7d", label: "7 days", days: 7 },
	{ id: "30d", label: "30 days", days: 30 },
	// Thirteen whole weeks, so the range before starts on the same weekday.
	{ id: "90d", label: "90 days", days: 91 },
];
export const rangeOf = (id: RangeId) => ranges.find(range => range.id === id)!;

export type WeekStart = "monday" | "sunday";

function mulberry32(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const prefixes = ["Lumen", "Northwind", "Copper", "Bright", "Halcyon", "Juniper", "Atlas", "Meridian", "Quill", "Ember", "Tidal", "Vesper", "Orchard", "Granite", "Fathom", "Kestrel", "Marlow", "Sable", "Thistle", "Wren"];
const suffixes = ["Labs", "Systems", "Works", "Health", "Logistics", "Studio", "Robotics", "Foods"];
const people = ["ada", "noor", "mateo", "ines", "kenji", "lena", "omar", "priya", "theo", "yara", "sam", "zoe"];
const seatRange: Record<PlanId, [min: number, max: number]> = { starter: [2, 12], team: [6, 40], business: [20, 90] };

const pick = <T>(random: () => number, items: readonly T[], weights: readonly number[]) => {
	let roll = random() * weights.reduce((a, b) => a + b);
	return items[Math.max(0, weights.findIndex(weight => (roll -= weight) < 0))];
};

export function createCustomers(): Customer[] {
	const random = mulberry32(252);
	// Its own sequence, so the order of the table does not follow the plan.
	const seen = mulberry32(101);
	return Array.from({ length: 148 }, (_, i) => {
		const company = `${prefixes[i % prefixes.length]} ${suffixes[Math.floor(i / prefixes.length)]}`;
		const plan = pick(random, ["starter", "team", "business"] as const, [45, 38, 17]);
		const [min, max] = seatRange[plan];
		// Sign-ups lean recent: the workspace is growing.
		const joined = Math.floor(random() ** 1.7 * 620);
		const customer: Customer = {
			id: `c${i}`,
			company,
			owner: `${people[(i * 5) % people.length]}@${company.toLowerCase().replace(" ", "")}.com`,
			plan,
			seats: Math.round(min + random() ** 2 * (max - min)),
			source: pick(random, sources, [34, 22, 16, 12, 9, 7]),
			joined,
			pastDue: false,
			lastSeen: 2 + Math.floor(seen() ** 2 * 4000),
			engagement: 0.45 + random() * 0.4,
		};
		// A trial lasts 14 days. Most accounts pay before it ends, and a few of those cancel later.
		if (joined >= 14) {
			customer.converted = joined - 4 - Math.floor(random() * 10);
			if (random() < 0.14) {
				customer.churned = Math.floor(random() ** 0.7 * customer.converted);
				customer.lastSeen = (customer.churned + random()) * 1440;
			} else {
				customer.pastDue = random() < 0.07;
			}
		}
		return customer;
	});
}

export const statusOf = (customer: Customer): Status =>
	customer.churned !== undefined ? "churned" : customer.converted === undefined ? "trial" : customer.pastDue ? "past-due" : "active";

const liveAt = (c: Customer, age: number) => c.joined >= age && (c.churned === undefined || c.churned < age);
const payingAt = (c: Customer, age: number) => c.converted !== undefined && c.converted >= age && liveAt(c, age);

/** What the account pays each month today. Nothing on trial or after a cancellation. */
export const mrrOf = (customer: Customer) => (payingAt(customer, 0) ? customer.seats * planOf(customer.plan).price : 0);

/** The longest range and the one before it. */
const history = 182;
// People use the product less at weekends. Index 0 is Sunday.
const weekdayUse = [0.42, 1, 1.04, 1.05, 1.02, 0.93, 0.48];
const noise = (() => {
	const random = mulberry32(5);
	return Array.from({ length: history }, () => 0.95 + random() * 0.1);
})();

export type Day = { mrr: number; paying: number; active: number; signups: number; conversions: number; churns: number };

/** One entry per age. Every chart and tile reads these, so they agree with the customer table. */
export function dailyMetrics(customers: readonly Customer[]): Day[] {
	return Array.from({ length: history }, (_, age) => {
		const day: Day = { mrr: 0, paying: 0, active: 0, signups: 0, conversions: 0, churns: 0 };
		const use = weekdayUse[daysAgo(age).getDay()] * noise[age];
		for (const c of customers) {
			if (c.joined === age) day.signups++;
			if (c.converted === age) day.conversions++;
			if (c.churned === age && c.converted !== undefined) day.churns++;
			if (liveAt(c, age)) day.active += c.seats * c.engagement * use;
			if (payingAt(c, age)) {
				day.paying++;
				day.mrr += c.seats * planOf(c.plan).price;
			}
		}
		day.active = Math.round(day.active);
		return day;
	});
}

const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);

/** The figures of a range (`offset` 0) or of the range before it (`offset` 1). */
export function summarize(daily: readonly Day[], days: number, offset = 0) {
	const window = daily.slice(offset * days, (offset + 1) * days);
	const start = daily[(offset + 1) * days - 1];
	return {
		mrr: window[0].mrr,
		mrrAtStart: start.mrr,
		activeUsers: Math.round(sum(window.map(day => day.active)) / days),
		conversions: sum(window.map(day => day.conversions)),
		signups: sum(window.map(day => day.signups)),
		churnRate: start.paying ? sum(window.map(day => day.churns)) / start.paying : 0,
	};
}

const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export type Bucket = { label: string; ages: number[] };

/** Oldest first. A day per bucket, or a calendar week in the 90-day range. */
export function createBuckets(range: RangeId, weekStart: WeekStart): Bucket[] {
	const { days } = rangeOf(range);
	const ages = Array.from({ length: days }, (_, i) => days - 1 - i);
	if (range !== "90d") return ages.map(age => ({ label: monthDay.format(daysAgo(age)), ages: [age] }));
	// Days since the current week started. The first and the last week can be partial.
	const into = (today.getDay() - (weekStart === "monday" ? 1 : 0) + 7) % 7;
	const weeks = new Map<number, number[]>();
	for (const age of ages) {
		const week = Math.floor((age + 6 - into) / 7);
		weeks.set(week, [...(weeks.get(week) ?? []), age]);
	}
	return [...weeks.values()].map(list => ({ label: monthDay.format(daysAgo(list[0])), ages: list }));
}

export function bucketSeries(daily: readonly Day[], buckets: readonly Bucket[], days: number) {
	const read = (pick: (day: Day) => number, offset = 0) => buckets.map(bucket => bucket.ages.map(age => pick(daily[age + offset * days])));
	return {
		labels: buckets.map(bucket => bucket.label),
		mrr: read(day => day.mrr).map(values => values.at(-1)!),
		active: read(day => day.active).map(values => Math.round(sum(values) / values.length)),
		activeBefore: read(day => day.active, 1).map(values => Math.round(sum(values) / values.length)),
		signups: read(day => day.signups).map(sum),
		conversions: read(day => day.conversions).map(sum),
		churns: read(day => day.churns).map(sum),
	};
}

export function signupsBySource(customers: readonly Customer[], days: number) {
	const totals = new Map<string, number>();
	for (const c of customers) if (c.joined < days) totals.set(c.source, (totals.get(c.source) ?? 0) + 1);
	return [...totals].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export type Activity = { id: string; customer: Customer; age: number; text: string };

/** What happened in the range, newest first. */
export function recentActivity(customers: readonly Customer[], days: number): Activity[] {
	const events: Activity[] = [];
	const add = (customer: Customer, kind: string, age: number | undefined, text: string) =>
		age !== undefined && age < days && events.push({ id: `${customer.id}-${kind}`, customer, age, text });
	for (const c of customers) {
		const plan = planOf(c.plan).name;
		add(c, "signup", c.joined, `started a ${plan} trial`);
		add(c, "paid", c.converted, `subscribed to ${plan}`);
		add(c, "churn", c.churned, `cancelled ${plan}`);
	}
	return events.sort((a, b) => a.age - b.age);
}

export const formatAge = (age: number) => (age === 0 ? "Today" : age === 1 ? "Yesterday" : monthDay.format(daysAgo(age)));

const monthDayYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
export const formatDate = (age: number) => monthDayYear.format(daysAgo(age));

export function formatLastSeen(minutes: number) {
	if (minutes < 60) return `${Math.floor(minutes)}m ago`;
	if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
	const days = Math.floor(minutes / 1440);
	return days < 30 ? `${days}d ago` : monthDay.format(daysAgo(days));
}

export type Role = "Owner" | "Admin" | "Member";
export type Member = { id: string; name: string; email: string; role: Role; invited?: boolean };

export const initialMembers: Member[] = [
	{ id: "m1", name: "Riley Okafor", email: "riley@acme.dev", role: "Owner" },
	{ id: "m2", name: "Dana Whitfield", email: "dana@acme.dev", role: "Admin" },
	{ id: "m3", name: "Tomás Herrera", email: "tomas@acme.dev", role: "Member" },
	{ id: "m4", name: "Mei Tanaka", email: "mei@acme.dev", role: "Member" },
	{ id: "m5", name: "Jonas Lindqvist", email: "jonas@acme.dev", role: "Member" },
];
