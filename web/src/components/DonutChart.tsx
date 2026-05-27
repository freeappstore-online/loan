import { useRef, useEffect } from "react";
import type { Currency } from "../lib/types";
import { formatMoney } from "../lib/format";

interface DonutChartProps {
  principal: number;
  interest: number;
  currency: Currency;
}

export default function DonutChart({ principal, interest, currency }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const total = principal + interest;
    if (total <= 0) return;

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 8;
    const innerRadius = radius * 0.6;
    const lineWidth = radius - innerRadius;

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const principalColor = "#2563eb";
    const interestColor = isDark ? "#fbbf24" : "#d97706";

    const principalAngle = (principal / total) * Math.PI * 2;
    const startAngle = -Math.PI / 2;

    // Principal arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius - lineWidth / 2, startAngle, startAngle + principalAngle, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = principalColor;
    ctx.lineCap = "butt";
    ctx.stroke();

    // Interest arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius - lineWidth / 2, startAngle + principalAngle, startAngle + Math.PI * 2, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = interestColor;
    ctx.lineCap = "butt";
    ctx.stroke();

    // Center text
    ctx.fillStyle = isDark ? "#f5f5f5" : "#1a1a1a";
    ctx.font = `700 ${Math.round(radius * 0.18)}px Manrope, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatMoney(total, currency), cx, cy - 6);

    ctx.fillStyle = isDark ? "#9ca3af" : "#6b7280";
    ctx.font = `500 ${Math.round(radius * 0.11)}px Manrope, system-ui, sans-serif`;
    ctx.fillText("Total", cx, cy + 12);
  }, [principal, interest, currency]);

  const total = principal + interest;
  const principalPct = total > 0 ? ((principal / total) * 100).toFixed(1) : "0.0";
  const interestPct = total > 0 ? ((interest / total) * 100).toFixed(1) : "0.0";

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 180 }}
      />
      <div className="flex justify-center gap-5 mt-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#2563eb" }} />
          <span style={{ color: "var(--muted)" }}>Principal ({principalPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--warning)" }} />
          <span style={{ color: "var(--muted)" }}>Interest ({interestPct}%)</span>
        </div>
      </div>
    </div>
  );
}
