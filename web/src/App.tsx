import { useState } from "react";
import type { Tab, Currency } from "./lib/types";
import CurrencySelector from "./components/CurrencySelector";
import LoanForm from "./components/LoanForm";
import ComparisonPanel from "./components/ComparisonPanel";
import AffordabilityPanel from "./components/AffordabilityPanel";

const TABS: { id: Tab; label: string }[] = [
  { id: "calculator", label: "Calculator" },
  { id: "comparison", label: "Compare" },
  { id: "affordability", label: "Affordability" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("calculator");
  const [currency, setCurrency] = useState<Currency>("USD");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 lg:px-6"
        style={{
          borderBottom: "1px solid var(--line)",
          background: "var(--glass)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              LC
            </div>
            <h1
              className="text-lg font-bold display-font hidden sm:block"
              style={{ color: "var(--ink)" }}
            >
              Loan Calculator
            </h1>
          </div>
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>
      </header>

      {/* Tab bar */}
      <nav
        className="shrink-0 px-4 lg:px-6"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div className="max-w-5xl mx-auto flex gap-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-sm font-medium cursor-pointer relative"
              style={{
                background: "transparent",
                color: tab === t.id ? "var(--accent)" : "var(--muted)",
                border: "none",
              }}
            >
              {t.label}
              {tab === t.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
        <div className="max-w-5xl mx-auto">
          {tab === "calculator" && <LoanForm currency={currency} />}
          {tab === "comparison" && <ComparisonPanel currency={currency} />}
          {tab === "affordability" && <AffordabilityPanel currency={currency} />}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="shrink-0 flex items-center justify-center px-4 py-2 text-xs"
        style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
      >
        Loan Calculator — Free on FreeAppStore
      </footer>
    </div>
  );
}
