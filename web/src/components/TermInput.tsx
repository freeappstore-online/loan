import { useState } from "react";

interface TermInputProps {
  termMonths: number;
  onChange: (months: number) => void;
}

export default function TermInput({ termMonths, onChange }: TermInputProps) {
  const [unit, setUnit] = useState<"years" | "months">("years");
  const displayValue = unit === "years" ? termMonths / 12 : termMonths;

  return (
    <label className="block">
      <span
        className="block text-xs font-medium mb-1"
        style={{ color: "var(--muted)" }}
      >
        Loan Term
      </span>
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)", background: "var(--paper)" }}
      >
        <input
          type="number"
          value={displayValue || ""}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            const raw = isNaN(v) ? 0 : v;
            onChange(unit === "years" ? Math.round(raw * 12) : Math.round(raw));
          }}
          min={0}
          step={unit === "years" ? 1 : 1}
          className="flex-1 px-2.5 py-2 text-sm outline-none min-w-0"
          style={{ background: "transparent", color: "var(--ink)", border: "none" }}
        />
        <div className="flex shrink-0" style={{ borderLeft: "1px solid var(--line)" }}>
          <button
            type="button"
            onClick={() => setUnit("years")}
            className="px-2.5 py-2 text-xs font-medium cursor-pointer"
            style={{
              background: unit === "years" ? "var(--accent)" : "var(--panel)",
              color: unit === "years" ? "#fff" : "var(--muted)",
              border: "none",
            }}
          >
            Years
          </button>
          <button
            type="button"
            onClick={() => setUnit("months")}
            className="px-2.5 py-2 text-xs font-medium cursor-pointer"
            style={{
              background: unit === "months" ? "var(--accent)" : "var(--panel)",
              color: unit === "months" ? "#fff" : "var(--muted)",
              border: "none",
            }}
          >
            Months
          </button>
        </div>
      </div>
    </label>
  );
}
