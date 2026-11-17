const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const currencyWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-US");
const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });
const signedPercent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1, signDisplay: "exceptZero" });
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export const formatMoney = (value: number) => currency.format(value);
export const formatMoneyWhole = (value: number) => currencyWhole.format(value);
export const formatCompact = (value: number) => compact.format(value);
export const formatNumber = (value: number) => whole.format(value);
export const formatPercent = (value: number) => percent.format(value);
/** `+4.2%`, `−1.8%`: the sign carries the direction, so colour never has to. */
export const formatChange = (value: number) => signedPercent.format(value).replace("-", "−");
export const formatDay = (date: Date) => day.format(date);
