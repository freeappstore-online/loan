import type { Currency } from "./types";
import { CURRENCY_SYMBOLS } from "./types";

export function formatMoney(value: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${remaining}mo`;
  if (remaining === 0) return `${years}yr`;
  return `${years}yr ${remaining}mo`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function exportScheduleCSV(
  schedule: Array<{
    month: number;
    payment: number;
    principalPortion: number;
    interestPortion: number;
    extraPortion: number;
    remainingBalance: number;
  }>,
): string {
  const header = "Month,Payment,Principal,Interest,Extra,Remaining Balance";
  const rows = schedule.map(
    (r) =>
      `${r.month},${r.payment.toFixed(2)},${r.principalPortion.toFixed(2)},${r.interestPortion.toFixed(2)},${r.extraPortion.toFixed(2)},${r.remainingBalance.toFixed(2)}`,
  );
  return [header, ...rows].join("\n");
}
