import { useState, useMemo, useCallback } from "react";
import type { AmortizationRow } from "../lib/types";
import type { Currency } from "../lib/types";
import { formatMoney, exportScheduleCSV } from "../lib/format";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  currency: Currency;
}

const PAGE_SIZE = 24;

export default function AmortizationTable({ schedule, currency }: AmortizationTableProps) {
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);

  const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
  const pageRows = useMemo(
    () => schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [schedule, page],
  );

  const handleCopyCSV = useCallback(() => {
    const csv = exportScheduleCSV(schedule);
    navigator.clipboard.writeText(csv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [schedule]);

  if (schedule.length === 0) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--line)" }}
    >
      <div
        className="flex items-center justify-between px-3.5 py-2.5"
        style={{ background: "var(--panel)", borderBottom: "1px solid var(--line)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
          Amortization Schedule
        </h3>
        <button
          type="button"
          onClick={handleCopyCSV}
          className="px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer"
          style={{
            background: copied ? "var(--success)" : "var(--panel)",
            color: copied ? "#fff" : "var(--accent)",
            border: copied ? "none" : "1px solid var(--line)",
          }}
        >
          {copied ? "Copied!" : "Copy CSV"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--panel)" }}>
              {["#", "Payment", "Principal", "Interest", "Extra", "Balance"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-right font-semibold whitespace-nowrap"
                    style={{
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--line)",
                      textAlign: h === "#" ? "center" : "right",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row.month}
                style={{ borderBottom: "1px solid var(--line)" }}
                className="hover:opacity-80"
              >
                <td
                  className="px-3 py-1.5 text-center font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {row.month}
                </td>
                <td className="px-3 py-1.5 text-right" style={{ color: "var(--ink)" }}>
                  {formatMoney(row.payment, currency)}
                </td>
                <td className="px-3 py-1.5 text-right" style={{ color: "var(--accent)" }}>
                  {formatMoney(row.principalPortion, currency)}
                </td>
                <td className="px-3 py-1.5 text-right" style={{ color: "var(--warning)" }}>
                  {formatMoney(row.interestPortion, currency)}
                </td>
                <td className="px-3 py-1.5 text-right" style={{ color: "var(--success)" }}>
                  {row.extraPortion > 0 ? formatMoney(row.extraPortion, currency) : "-"}
                </td>
                <td className="px-3 py-1.5 text-right font-medium" style={{ color: "var(--ink)" }}>
                  {formatMoney(row.remainingBalance, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-3.5 py-2"
          style={{ background: "var(--panel)", borderTop: "1px solid var(--line)" }}
        >
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {schedule.length} payments total
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded cursor-pointer disabled:opacity-30"
              style={{
                background: "var(--paper)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              Prev
            </button>
            <span
              className="px-2 py-1 text-xs"
              style={{ color: "var(--muted)" }}
            >
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded cursor-pointer disabled:opacity-30"
              style={{
                background: "var(--paper)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
