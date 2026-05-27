import { useRef, useEffect } from "react";
import type { AmortizationRow } from "../lib/types";

interface AreaChartProps {
  schedule: AmortizationRow[];
  label: string;
}

export default function AreaChart({ schedule, label }: AreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || schedule.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const principalColor = "#2563eb";
    const interestColor = isDark ? "#fbbf24" : "#d97706";
    const gridColor = isDark ? "#2d2d2d" : "#e5e7eb";
    const textColor = isDark ? "#9ca3af" : "#6b7280";

    const pad = { top: 10, right: 12, bottom: 28, left: 48 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const last = schedule[schedule.length - 1];
    if (!last) return;
    const maxY = last.totalPrincipalPaid + last.totalInterestPaid;
    if (maxY <= 0) return;

    const n = schedule.length;

    // Helper
    const xOf = (i: number) => pad.left + (i / (n - 1)) * plotW;
    const yOf = (v: number) => pad.top + plotH - (v / maxY) * plotH;

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // Stacked area: interest on bottom, principal on top
    // Interest area (bottom layer)
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(0));
    for (let i = 0; i < n; i++) {
      const row = schedule[i]!;
      ctx.lineTo(xOf(i), yOf(row.totalInterestPaid));
    }
    ctx.lineTo(xOf(n - 1), yOf(0));
    ctx.closePath();
    ctx.fillStyle = interestColor + "40";
    ctx.fill();

    // Total area (principal + interest)
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(0));
    for (let i = 0; i < n; i++) {
      const row = schedule[i]!;
      ctx.lineTo(xOf(i), yOf(row.totalPrincipalPaid + row.totalInterestPaid));
    }
    ctx.lineTo(xOf(n - 1), yOf(0));
    ctx.closePath();
    ctx.fillStyle = principalColor + "30";
    ctx.fill();

    // Lines
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = interestColor;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const row = schedule[i]!;
      const x = xOf(i);
      const y = yOf(row.totalInterestPaid);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = principalColor;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const row = schedule[i]!;
      const x = xOf(i);
      const y = yOf(row.totalPrincipalPaid + row.totalInterestPaid);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = `500 9px Manrope, system-ui, sans-serif`;
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(n / 5));
    for (let i = 0; i < n; i += step) {
      const row = schedule[i]!;
      ctx.fillText(`${row.month}`, xOf(i), h - 6);
    }
    // Last label
    ctx.fillText(`${n}`, xOf(n - 1), h - 6);

    // Y-axis labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const val = ((4 - i) / 4) * maxY;
      const formatted = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0);
      ctx.fillText(formatted, pad.left - 6, pad.top + (i / 4) * plotH + 3);
    }

    // Title
    ctx.fillStyle = textColor;
    ctx.font = `600 10px Manrope, system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(label, pad.left, h - 6);
  }, [schedule, label]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 180 }}
      />
      <div className="flex justify-center gap-5 mt-1">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#2563eb" }} />
          <span style={{ color: "var(--muted)" }}>Cumulative Principal</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--warning)" }} />
          <span style={{ color: "var(--muted)" }}>Cumulative Interest</span>
        </div>
      </div>
    </div>
  );
}
