import { useState, useMemo } from "react";
import type { Currency } from "../lib/types";
import { CURRENCY_SYMBOLS } from "../lib/types";
import { calculateMaxLoan, calculateMonthlyPayment } from "../lib/calculate";
import { formatMoney, formatMonths } from "../lib/format";
import NumberInput from "./NumberInput";
import TermInput from "./TermInput";

interface AffordabilityPanelProps {
  currency: Currency;
}

export default function AffordabilityPanel({ currency }: AffordabilityPanelProps) {
  const sym = CURRENCY_SYMBOLS[currency];
  const [monthlyBudget, setMonthlyBudget] = useState(2500);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [termMonths, setTermMonths] = useState(360);

  const maxLoan = useMemo(
    () => calculateMaxLoan(monthlyBudget, annualRate, termMonths),
    [monthlyBudget, annualRate, termMonths],
  );

  const verifyPayment = useMemo(
    () => calculateMonthlyPayment(maxLoan, annualRate, termMonths),
    [maxLoan, annualRate, termMonths],
  );

  const totalPaid = verifyPayment * termMonths;
  const totalInterest = totalPaid - maxLoan;

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Enter your monthly budget, interest rate, and loan term to find out how much you can borrow.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NumberInput
          label="Monthly Budget"
          value={monthlyBudget}
          onChange={setMonthlyBudget}
          prefix={sym}
          min={0}
          step={100}
        />
        <NumberInput
          label="Interest Rate"
          value={annualRate}
          onChange={setAnnualRate}
          suffix="%"
          min={0}
          max={50}
          step={0.1}
        />
        <TermInput termMonths={termMonths} onChange={setTermMonths} />
      </div>

      {monthlyBudget > 0 && annualRate >= 0 && termMonths > 0 && (
        <div className="space-y-3">
          {/* Main result */}
          <div
            className="rounded-xl p-5 text-center"
            style={{ background: "var(--accent)" }}
          >
            <div className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
              Maximum Loan Amount
            </div>
            <div className="text-3xl font-bold" style={{ color: "#fff" }}>
              {formatMoney(Math.round(maxLoan), currency)}
            </div>
          </div>

          {/* Details */}
          <div
            className="rounded-xl p-3.5"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--ink)" }}>
              Breakdown
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <span style={{ color: "var(--muted)" }}>Monthly Payment</span>
              <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                {formatMoney(verifyPayment, currency)}
              </span>
              <span style={{ color: "var(--muted)" }}>Loan Term</span>
              <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                {formatMonths(termMonths)}
              </span>
              <span style={{ color: "var(--muted)" }}>Total Interest</span>
              <span className="text-right font-medium" style={{ color: "var(--warning)" }}>
                {formatMoney(Math.round(totalInterest), currency)}
              </span>
              <span style={{ color: "var(--muted)" }}>Total Paid</span>
              <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                {formatMoney(Math.round(totalPaid), currency)}
              </span>
              <span style={{ color: "var(--muted)" }}>Interest-to-Principal</span>
              <span className="text-right font-medium" style={{ color: "var(--ink)" }}>
                {maxLoan > 0 ? ((totalInterest / maxLoan) * 100).toFixed(1) : "0.0"}%
              </span>
            </div>
          </div>

          {/* Visual bar */}
          <div
            className="rounded-xl p-3.5"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--ink)" }}>
              Payment Composition
            </div>
            <div className="flex rounded-full overflow-hidden h-4">
              <div
                style={{
                  width: `${totalPaid > 0 ? (maxLoan / totalPaid) * 100 : 0}%`,
                  background: "var(--accent)",
                }}
              />
              <div
                style={{
                  width: `${totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0}%`,
                  background: "var(--warning)",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
              <span>Principal: {formatMoney(Math.round(maxLoan), currency)}</span>
              <span>Interest: {formatMoney(Math.round(totalInterest), currency)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
