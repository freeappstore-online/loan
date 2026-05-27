import type { Currency } from "../lib/types";

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "AUD"];

interface CurrencySelectorProps {
  value: Currency;
  onChange: (c: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex gap-1">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="px-2 py-1 text-xs font-medium rounded cursor-pointer"
          style={{
            background: value === c ? "var(--accent)" : "var(--panel)",
            color: value === c ? "#fff" : "var(--muted)",
            border: value === c ? "none" : "1px solid var(--line)",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
