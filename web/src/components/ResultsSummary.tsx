import type { LoanResult, Currency } from "../lib/types";
import { formatMoney, formatMonths } from "../lib/format";

interface ResultsSummaryProps {
  result: LoanResult;
  currency: Currency;
  hasExtra: boolean;
  isMortgage: boolean;
}

function StatCard({
  label,
  value,
  subtext,
  accent,
}: {
  label: string;
  value: string;
  subtext?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: accent ? "var(--accent)" : "var(--panel)",
        border: accent ? "none" : "1px solid var(--line)",
      }}
    >
      <div
        className="text-xs font-medium mb-1"
        style={{ color: accent ? "rgba(255,255,255,0.7)" : "var(--muted)" }}
      >
        {label}
      </div>
      <div
        className="text-lg font-bold"
        style={{ color: accent ? "#fff" : "var(--ink)" }}
      >
        {value}
      </div>
      {subtext && (
        <div
          className="text-xs mt-0.5"
          style={{ color: accent ? "rgba(255,255,255,0.6)" : "var(--muted)" }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}

export default function ResultsSummary({
  result,
  currency,
  hasExtra,
  isMortgage,
}: ResultsSummaryProps) {
  const ratio =
    result.totalInterest > 0 && result.monthlyPayment > 0
      ? ((result.totalInterest / result.totalPaid) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          label="Monthly Payment"
          value={formatMoney(result.monthlyPayment, currency)}
          accent
        />
        <StatCard
          label="Total Interest"
          value={formatMoney(result.totalInterest, currency)}
          subtext={`${ratio}% of total`}
        />
        <StatCard
          label="Total Amount Paid"
          value={formatMoney(result.totalPaid, currency)}
        />
        <StatCard
          label="Loan-to-Interest"
          value={`1 : ${result.totalInterest > 0 ? (result.totalInterest / (result.totalPaid - result.totalInterest)).toFixed(2) : "0.00"}`}
        />
      </div>

      {isMortgage && (result.monthlyPropertyTax > 0 || result.monthlyInsurance > 0 || result.monthlyPMI > 0) && (
        <div
          className="rounded-xl p-3.5 space-y-2"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
            Monthly PITI Breakdown
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span style={{ color: "var(--muted)" }}>Principal & Interest</span>
            <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
              {formatMoney(result.monthlyPayment, currency)}
            </span>
            {result.monthlyPropertyTax > 0 && (
              <>
                <span style={{ color: "var(--muted)" }}>Property Tax</span>
                <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                  {formatMoney(result.monthlyPropertyTax, currency)}
                </span>
              </>
            )}
            {result.monthlyInsurance > 0 && (
              <>
                <span style={{ color: "var(--muted)" }}>Insurance</span>
                <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                  {formatMoney(result.monthlyInsurance, currency)}
                </span>
              </>
            )}
            {result.monthlyPMI > 0 && (
              <>
                <span style={{ color: "var(--muted)" }}>PMI</span>
                <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                  {formatMoney(result.monthlyPMI, currency)}
                </span>
              </>
            )}
            <span className="font-semibold pt-1" style={{ color: "var(--ink)", borderTop: "1px solid var(--line)" }}>
              Total PITI
            </span>
            <span className="text-right font-bold pt-1" style={{ color: "var(--accent)", borderTop: "1px solid var(--line)" }}>
              {formatMoney(result.totalMonthlyPITI, currency)}
            </span>
          </div>
        </div>
      )}

      {hasExtra && result.monthsSavedWithExtra > 0 && (
        <div
          className="rounded-xl p-3.5"
          style={{ background: "var(--panel)", border: "1px solid var(--success)" }}
        >
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--success)" }}>
            Extra Payment Savings
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span style={{ color: "var(--muted)" }}>Interest Saved</span>
            <span className="text-right font-medium" style={{ color: "var(--success)" }}>
              {formatMoney(result.interestSavedWithExtra, currency)}
            </span>
            <span style={{ color: "var(--muted)" }}>Time Saved</span>
            <span className="text-right font-medium" style={{ color: "var(--success)" }}>
              {formatMonths(result.monthsSavedWithExtra)}
            </span>
            <span style={{ color: "var(--muted)" }}>New Total Interest</span>
            <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
              {formatMoney(result.totalInterestWithExtra, currency)}
            </span>
            <span style={{ color: "var(--muted)" }}>Payoff in</span>
            <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
              {formatMonths(result.schedule.length)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
