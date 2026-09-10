import React, { useState } from 'react';
import { CohortRow } from '../../../domains/analytics/types';

interface CohortHeatmapTableProps {
  cohortRows: CohortRow[];
}

export const CohortHeatmapTable: React.FC<CohortHeatmapTableProps> = ({ cohortRows }) => {
  const [hoveredCell, setHoveredCell] = useState<{ rowId: string; weekIdx: number } | null>(null);

  const weekHeaders = ['Tuần 0', 'Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7'];

  // Helper to determine cell background and text styling based on retention rate
  const getCellStyles = (rate: number) => {
    if (rate >= 90) {
      return 'bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 font-bold';
    }
    if (rate >= 70) {
      return 'bg-emerald-500/18 text-emerald-700 dark:text-emerald-300 font-bold';
    }
    if (rate >= 50) {
      return 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 font-semibold';
    }
    if (rate >= 40) {
      return 'bg-blue-500/12 text-blue-700 dark:text-blue-300 font-medium';
    }
    if (rate >= 30) {
      return 'bg-amber-500/14 text-amber-800 dark:text-amber-300 font-medium';
    }
    if (rate >= 20) {
      return 'bg-orange-500/12 text-orange-700 dark:text-orange-300 font-normal';
    }
    return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 font-normal';
  };

  return (
    <div className="w-full overflow-x-auto border border-border rounded-xl bg-surface select-none shadow-xs">
      <table className="w-full text-xs text-left border-collapse min-w-[760px]">
        <thead>
          <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
            <th className="py-2.5 px-3 border-r border-border min-w-[170px]">Cohort Tuần</th>
            <th className="py-2.5 px-2.5 text-center border-r border-border min-w-[90px]">Quy Mô (Base)</th>
            {weekHeaders.map((header) => (
              <th key={header} className="py-2.5 px-2 text-center border-r border-border last:border-r-0 min-w-[65px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {cohortRows.map((row) => (
            <tr key={row.id} className="hover:bg-surface-subtle/40 transition-colors">
              {/* Cohort Name */}
              <td className="py-2 px-3 border-r border-border font-semibold text-text">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{row.cohortWeek}</span>
                </div>
              </td>

              {/* Base User Count */}
              <td className="py-2 px-2.5 text-center border-r border-border font-mono font-medium text-text-muted bg-surface-subtle/20">
                {row.newUsersCount.toLocaleString('vi-VN')}
              </td>

              {/* Retention Weeks (W0 to W7) */}
              {weekHeaders.map((_, weekIdx) => {
                const rate = row.retentionRates[weekIdx];
                const hasRate = rate !== undefined;
                const isHovered = hoveredCell?.rowId === row.id && hoveredCell?.weekIdx === weekIdx;

                if (!hasRate) {
                  return (
                    <td
                      key={`empty-${weekIdx}`}
                      className="py-2 px-1 text-center border-r border-border last:border-r-0 text-text-light/50 font-mono text-[11px] bg-surface-subtle/10"
                    >
                      —
                    </td>
                  );
                }

                const absoluteUsers = Math.round((row.newUsersCount * rate) / 100);

                return (
                  <td
                    key={`rate-${weekIdx}`}
                    onMouseEnter={() => setHoveredCell({ rowId: row.id, weekIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`py-2 px-1 text-center border-r border-border last:border-r-0 font-mono text-[11px] transition-all relative cursor-default ${getCellStyles(
                      rate
                    )} ${isHovered ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
                  >
                    <span>{rate.toFixed(1)}%</span>

                    {/* Popover on hover */}
                    {isHovered && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-sans px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                        <span>{absoluteUsers.toLocaleString('vi-VN')} học viên hoạt động</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
