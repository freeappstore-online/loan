interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export default function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  placeholder,
}: NumberInputProps) {
  return (
    <label className="block">
      <span
        className="block text-xs font-medium mb-1"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--line)", background: "var(--paper)" }}
      >
        {prefix && (
          <span
            className="px-2.5 py-2 text-sm font-medium shrink-0"
            style={{ color: "var(--muted)", background: "var(--panel)" }}
          >
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onChange(isNaN(v) ? 0 : v);
          }}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="flex-1 px-2.5 py-2 text-sm outline-none min-w-0"
          style={{ background: "transparent", color: "var(--ink)", border: "none" }}
        />
        {suffix && (
          <span
            className="px-2.5 py-2 text-sm font-medium shrink-0"
            style={{ color: "var(--muted)", background: "var(--panel)" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}
