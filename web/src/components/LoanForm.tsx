import { useState, useMemo } from "react";
import type { Currency, LoanPreset } from "../lib/types";
import { CURRENCY_SYMBOLS } from "../lib/types";
import { calculateLoan } from "../lib/calculate";
import NumberInput from "./NumberInput";
import TermInput from "./TermInput";
import PresetSelector from "./PresetSelector";
import ResultsSummary from "./ResultsSummary";
import AmortizationTable from "./AmortizationTable";
import DonutChart from "./DonutChart";
import AreaChart from "./AreaChart";
import BalanceChart from "./BalanceChart";

interface LoanFormProps {
  currency: Currency;
}

export default function LoanForm({ currency }: LoanFormProps) {
  const [principal, setPrincipal] = useState(400000);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [termMonths, setTermMonths] = useState(360);
  const [extraPayment, setExtraPayment] = useState(0);
  const [isMortgage, setIsMortgage] = useState(true);
  const [propertyTax, setPropertyTax] = useState(4800);
  const [homeInsurance, setHomeInsurance] = useState(1800);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);

  const sym = CURRENCY_SYMBOLS[currency];

  const result = useMemo(
    () =>
      calculateLoan({
        principal,
        annualRate,
        termMonths,
        extraPayment,
        propertyTax: isMortgage ? propertyTax : 0,
        homeInsurance: isMortgage ? homeInsurance : 0,
        pmiRate: isMortgage ? pmiRate : 0,
        downPaymentPercent: isMortgage ? downPaymentPercent : 100,
        isMortgage,
      }),
    [principal, annualRate, termMonths, extraPayment, isMortgage, propertyTax, homeInsurance, pmiRate, downPaymentPercent],
  );

  const handlePreset = (preset: LoanPreset) => {
    setPrincipal(preset.principal);
    setAnnualRate(preset.annualRate);
    setTermMonths(preset.termMonths);
    setIsMortgage(preset.isMortgage);
    if (!preset.isMortgage) {
      setPropertyTax(0);
      setHomeInsurance(0);
    }
  };

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <div className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
          Quick Presets
        </div>
        <PresetSelector onSelect={handlePreset} />
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NumberInput
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          prefix={sym}
          min={0}
          step={1000}
        />
        <NumberInput
          label="Interest Rate (Annual)"
          value={annualRate}
          onChange={setAnnualRate}
          suffix="%"
          min={0}
          max={50}
          step={0.1}
        />
        <TermInput termMonths={termMonths} onChange={setTermMonths} />
        <NumberInput
          label="Extra Monthly Payment"
          value={extraPayment}
          onChange={setExtraPayment}
          prefix={sym}
          min={0}
          step={50}
        />
      </div>

      {/* Mortgage toggle */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsMortgage(!isMortgage)}
          className="relative w-10 h-5.5 rounded-full cursor-pointer transition-colors"
          style={{
            background: isMortgage ? "var(--accent)" : "var(--line-strong)",
            border: "none",
            padding: 0,
          }}
        >
          <span
            className="absolute top-0.5 w-4.5 h-4.5 rounded-full transition-transform"
            style={{
              background: "#fff",
              left: isMortgage ? "calc(100% - 20px)" : "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </button>
        <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
          Mortgage Mode
        </span>
      </div>

      {/* Mortgage fields */}
      {isMortgage && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <NumberInput
            label="Down Payment"
            value={downPaymentPercent}
            onChange={setDownPaymentPercent}
            suffix="%"
            min={0}
            max={100}
            step={1}
          />
          <NumberInput
            label="Annual Property Tax"
            value={propertyTax}
            onChange={setPropertyTax}
            prefix={sym}
            min={0}
            step={100}
          />
          <NumberInput
            label="Annual Home Insurance"
            value={homeInsurance}
            onChange={setHomeInsurance}
            prefix={sym}
            min={0}
            step={100}
          />
          {downPaymentPercent < 20 && (
            <NumberInput
              label="PMI Rate (Annual)"
              value={pmiRate}
              onChange={setPmiRate}
              suffix="%"
              min={0}
              max={5}
              step={0.1}
            />
          )}
        </div>
      )}

      {/* Results */}
      {principal > 0 && annualRate >= 0 && termMonths > 0 && (
        <>
          <ResultsSummary
            result={result}
            currency={currency}
            hasExtra={extraPayment > 0}
            isMortgage={isMortgage}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div
              className="rounded-xl p-3.5"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <div className="text-xs font-semibold mb-1 px-1" style={{ color: "var(--muted)" }}>
                Principal vs Interest
              </div>
              <DonutChart
                principal={principal}
                interest={extraPayment > 0 ? result.totalInterestWithExtra : result.totalInterest}
                currency={currency}
              />
            </div>
            <div
              className="rounded-xl p-3.5"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <AreaChart
                schedule={result.schedule}
                label="Cumulative Payments"
              />
            </div>
            <div
              className="rounded-xl p-3.5"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <BalanceChart
                schedule={result.schedule}
                principal={principal}
              />
            </div>
          </div>

          {/* Amortization Table */}
          <AmortizationTable schedule={result.schedule} currency={currency} />
        </>
      )}
    </div>
  );
}
