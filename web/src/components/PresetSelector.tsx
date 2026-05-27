import { PRESETS } from "../lib/types";
import type { LoanPreset } from "../lib/types";

interface PresetSelectorProps {
  onSelect: (preset: LoanPreset) => void;
}

export default function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map((p) => (
        <button
          key={p.name}
          type="button"
          onClick={() => onSelect(p)}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors"
          style={{
            background: "var(--panel)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--line)";
            e.currentTarget.style.color = "var(--ink)";
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
