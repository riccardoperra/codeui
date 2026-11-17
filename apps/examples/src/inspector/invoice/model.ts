/**
 * The invoice domain, with no editor imports. Money is integer cents, totals are always derived
 * and a paid invoice is locked.
 */
export type Cents = number;

export const cents = (value: number): Cents => Math.round(value);

const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
export const formatCents = (amount: Cents) => money.format(amount / 100);

export const vatRates = [0, 4, 10, 22] as const;
export type VatRate = (typeof vatRates)[number];

export const statuses = ["draft", "sent", "paid"] as const;
export type InvoiceStatus = (typeof statuses)[number];
export const statusLabels: Record<InvoiceStatus, string> = { draft: "Draft", sent: "Sent", paid: "Paid" };

/** A status only moves to its neighbour, so draft reaches paid through sent. */
export function statusPath(from: InvoiceStatus, to: InvoiceStatus): InvoiceStatus[] {
	const start = statuses.indexOf(from);
	const end = statuses.indexOf(to);
	const step = Math.sign(end - start);
	const path: InvoiceStatus[] = [];
	for (let index = start + step; step !== 0 && index !== end + step; index += step) path.push(statuses[index]);
	return path;
}

export const isLocked = (status: InvoiceStatus) => status === "paid";

export interface InvoiceMeta {
	readonly number: string;
	readonly issueDate: string;
	readonly dueDate: string;
	readonly status: InvoiceStatus;
}

export interface LineItem {
	readonly id: string;
	readonly description: string;
	readonly quantity: number;
	readonly unitPrice: Cents;
	readonly vatRate: VatRate;
	readonly discountPercent: number;
}

export const lineNet = (item: LineItem): Cents => cents(item.quantity * item.unitPrice * (1 - item.discountPercent / 100));

export const reprice = (item: LineItem, percent: number): Cents => cents(item.unitPrice * (1 + percent / 100));

export interface VatBucket {
	readonly rate: VatRate;
	readonly tax: Cents;
}

export interface InvoiceTotals {
	readonly net: Cents;
	readonly vatByRate: readonly VatBucket[];
	readonly gross: Cents;
}

export function computeTotals(items: readonly LineItem[]): InvoiceTotals {
	const bases = new Map<VatRate, number>();
	let net = 0;
	for (const item of items) {
		const amount = lineNet(item);
		net += amount;
		bases.set(item.vatRate, (bases.get(item.vatRate) ?? 0) + amount);
	}
	const vatByRate = [...bases].sort(([a], [b]) => a - b).map(([rate, base]) => ({ rate, tax: cents((base * rate) / 100) }));
	const vat = vatByRate.reduce((sum, bucket) => sum + bucket.tax, 0);
	return { net: cents(net), vatByRate, gross: cents(net + vat) };
}

export interface Issue {
	readonly code: string;
	readonly message: string;
}

const lineItemRules: readonly (Issue & { test(item: LineItem): boolean })[] = [
	{ code: "description-required", message: "Describe what is being billed.", test: item => item.description.trim().length > 0 },
	{ code: "quantity-positive", message: "Quantity must be greater than zero.", test: item => item.quantity > 0 },
	{ code: "price-non-negative", message: "Unit price cannot be negative.", test: item => item.unitPrice >= 0 },
	{ code: "discount-range", message: "Discount must be between 0% and 100%.", test: item => item.discountPercent >= 0 && item.discountPercent <= 100 },
];

export const validateLineItem = (item: LineItem): Issue[] =>
	lineItemRules.filter(rule => !rule.test(item)).map(({ code, message }) => ({ code, message }));

const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });
export const formatDate = (isoDate: string) => date.format(new Date(`${isoDate}T00:00:00Z`));

export const pageTitles = {
	cover: "Cover",
	lineItems: "Line items",
	terms: "Terms and notes",
	continued: "Continued",
} as const;
export type PageKind = keyof typeof pageTitles;
