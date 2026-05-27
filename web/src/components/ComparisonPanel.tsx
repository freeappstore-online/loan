import { useState, useMemo } from "react";
import type { Currency } from "../lib/types";
import { CURRENCY_SYMBOLS } from "../lib/types";
import { calculateLoan } from "../lib/calculate";
import { formatMoney, formatMonths } from "../lib/format";
import NumberInput from "./NumberInput";
import TermInput from "./TermInput";
import DonutChart from "./DonutChart";

interface ScenarioInputs {
  principal: number;
  annualRate: number;
  termMonths: number;
  label: string;
}

interface ComparisonPanelProps {
  currency: Currency;
}

function ScenarioForm({
  scenario,
  onChange,
  sym,
  color,
}: {
  scenario: ScenarioInputs;
  onChange: (s: ScenarioInputs) => void;
  sym: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-3.5 space-y-3"
      style={{ border: `2px solid ${color}`, background: "var(--panel)" }}
    >
      <input
        type="text"
        value={scenario.label}
        onChange={(e) => onChange({ ...scenario, label: e.target.value })}
        className="text-sm font-semibold w-full outline-none"
        style={{ background: "transparent", color, border: "none" }}
      />
      <div className="space-y-2.5">
        <NumberInput
          label="Loan Amount"
          value={scenario.principal}
          onChange={(v) => onChange({ ...scenario, principal: v })}
          prefix={sym}
          min={0}
          step={1000}
        />
        <NumberInput
          label="Interest Rate"
          value={scenario.annualRate}
          onChange={(v) => onChange({ ...scenario, annualRate: v })}
          suffix="%"
          min={0}
          max={50}
          step={0.1}
        />
        <TermInput
          termMonths={scenario.termMonths}
          onChange={(v) => onChange({ ...scenario, termMonths: v })}
        />
      </div>
    </div>
  );
}

export default function ComparisonPanel({ currency }: ComparisonPanelProps) {
  const sym = CURRENCY_SYMBOLS[currency];

  const [scenarioA, setScenarioA] = useState<ScenarioInputs>({
    label: "Scenario A — 30yr",
    principal: 400000,
    annualRate: 6.5,
    termMonths: 360,
  });

  const [scenarioB, setScenarioB] = useState<ScenarioInputs>({
    label: "Scenario B — 15yr",
    principal: 400000,
    annualRate: 5.9,
    termMonths: 180,
  });

  const resultA = useMemo(
    () =>
      calculateLoan({
        principal: scenarioA.principal,
        annualRate: scenarioA.annualRate,
        termMonths: scenarioA.termMonths,
        extraPayment: 0,
        propertyTax: 0,
        homeInsurance: 0,
        pmiRate: 0,
        downPaymentPercent: 100,
        isMortgage: false,
      }),
    [scenarioA],
  );

  const resultB = useMemo(
    () =>
      calculateLoan({
        principal: scenarioB.principal,
        annualRate: scenarioB.annualRate,
        termMonths: scenarioB.termMonths,
        extraPayment: 0,
        propertyTax: 0,
        homeInsurance: 0,
        pmiRate: 0,
        downPaymentPercent: 100,
        isMortgage: false,
      }),
    [scenarioB],
  );

  const diff = {
    monthlyPayment: resultA.monthlyPayment - resultB.monthlyPayment,
    totalInterest: resultA.totalInterest - resultB.totalInterest,
    totalPaid: resultA.totalPaid - resultB.totalPaid,
  };

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Compare two loan scenarios side by side to find the better deal.
      </p>

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScenarioForm
          scenario={scenarioA}
          onChange={setScenarioA}
          sym={sym}
          color="#2563eb"
        />
        <ScenarioForm
          scenario={scenarioB}
          onChange={setScenarioB}
          sym={sym}
          color="var(--success)"
        />
      </div>

      {/* Results comparison table */}
      {scenarioA.principal > 0 && scenarioB.principal > 0 && (
        <>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
          >
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--panel)" }}>
                  <th
                    className="px-3.5 py-2.5 text-left font-semibold"
                    style={{ color: "var(--muted)", borderBottom: "1px solid var(--line)" }}
                  >
                    Metric
                  </th>
                  <th
                    className="px-3.5 py-2.5 text-right font-semibold"
                    style={{ color: "#2563eb", borderBottom: "1px solid var(--line)" }}
                  >
                    {scenarioA.label}
                  </th>
                  <th
                    className="px-3.5 py-2.5 text-right font-semibold"
                    style={{ color: "var(--success)", borderBottom: "1px solid var(--line)" }}
                  >
                    {scenarioB.label}
                  </th>
                  <th
                    className="px-3.5 py-2.5 text-right font-semibold"
                    style={{ color: "var(--muted)", borderBottom: "1px solid var(--line)" }}
                  >
                    Difference
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Monthly Payment",
                    a: formatMoney(resultA.monthlyPayment, currency),
                    b: formatMoney(resultB.monthlyPayment, currency),
                    d: formatMoney(diff.monthlyPayment, currency),
                  },
                  {
                    label: "Total Interest",
                    a: formatMoney(resultA.totalInterest, currency),
                    b: formatMoney(resultB.totalInterest, currency),
                    d: formatMoney(diff.totalInterest, currency),
                  },
                  {
                    label: "Total Paid",
                    a: formatMoney(resultA.totalPaid, currency),
                    b: formatMoney(resultB.totalPaid, currency),
                    d: formatMoney(diff.totalPaid, currency),
                  },
                  {
                    label: "Loan Term",
                    a: formatMonths(scenarioA.termMonths),
                    b: formatMonths(scenarioB.termMonths),
                    d: formatMonths(Math.abs(scenarioA.termMonths - scenarioB.termMonths)),
                  },
                ].map((row) => (
                  <tr key={row.label} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td
                      className="px-3.5 py-2 font-medium"
                      style={{ color: "var(--ink)" }}
                    >
                      {row.label}
                    </td>
                    <td className="px-3.5 py-2 text-right" style={{ color: "var(--ink)" }}>
                      {row.a}
                    </td>
                    <td className="px-3.5 py-2 text-right" style={{ color: "var(--ink)" }}>
                      {row.b}
                    </td>
                    <td className="px-3.5 py-2 text-right font-medium" style={{ color: "var(--warning)" }}>
                      {row.d}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side-by-side donut charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-3.5"
              style={{ background: "var(--panel)", border: "2px solid #2563eb" }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: "#2563eb" }}>
                {scenarioA.label}
              </div>
              <DonutChart
                principal={scenarioA.principal}
                interest={resultA.totalInterest}
                currency={currency}
              />
            </div>
            <div
              className="rounded-xl p-3.5"
              style={{ background: "var(--panel)", border: "2px solid var(--success)" }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: "var(--success)" }}>
                {scenarioB.label}
              </div>
              <DonutChart
                principal={scenarioB.principal}
                interest={resultB.totalInterest}
                currency={currency}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
