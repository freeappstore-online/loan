import { useRef, useEffect } from "react";
import type { AmortizationRow } from "../lib/types";

interface BalanceChartProps {
  schedule: AmortizationRow[];
  principal: number;
}

export default function BalanceChart({ schedule, principal }: BalanceChartProps) {
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
    const lineColor = "#2563eb";
    const gridColor = isDark ? "#2d2d2d" : "#e5e7eb";
    const textColor = isDark ? "#9ca3af" : "#6b7280";
    const fillColor = lineColor + "20";

    const pad = { top: 10, right: 12, bottom: 28, left: 48 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const maxY = principal;
    if (maxY <= 0) return;
    const n = schedule.length;

    const xOf = (i: number) => pad.left + (i / n) * plotW;
    const yOf = (v: number) => pad.top + plotH - (v / maxY) * plotH;

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // Fill
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(principal));
    for (let i = 0; i < n; i++) {
      ctx.lineTo(xOf(i + 1), yOf(schedule[i]!.remainingBalance));
    }
    ctx.lineTo(xOf(n), yOf(0));
    ctx.lineTo(xOf(0), yOf(0));
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(principal));
    for (let i = 0; i < n; i++) {
      ctx.lineTo(xOf(i + 1), yOf(schedule[i]!.remainingBalance));
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // X labels
    ctx.fillStyle = textColor;
    ctx.font = `500 9px Manrope, system-ui, sans-serif`;
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(n / 5));
    for (let i = 0; i <= n; i += step) {
      ctx.fillText(`${i}`, xOf(i), h - 6);
    }
    if (n % step !== 0) {
      ctx.fillText(`${n}`, xOf(n), h - 6);
    }

    // Y labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const val = ((4 - i) / 4) * maxY;
      const formatted = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0);
      ctx.fillText(formatted, pad.left - 6, pad.top + (i / 4) * plotH + 3);
    }
  }, [schedule, principal]);

  return (
    <div>
      <div className="text-xs font-semibold mb-1 px-1" style={{ color: "var(--muted)" }}>
        Remaining Balance Over Time
      </div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 180 }}
      />
    </div>
  );
}
