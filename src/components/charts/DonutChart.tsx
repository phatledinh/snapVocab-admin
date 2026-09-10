import React, { useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  showLegend?: boolean;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 120,
  strokeWidth = 16,
  centerLabel,
  centerValue,
  showLegend = true,
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const segments = data.map((seg) => {
    const percent = seg.value / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += percent;

    return {
      ...seg,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSegment = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* SVG Donut Ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />

          {/* Segment rings */}
          {segments.map((seg, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs font-bold text-text font-mono leading-none">
            {activeSegment
              ? `${Math.round(activeSegment.percent * 100)}%`
              : centerValue || total.toLocaleString('vi-VN')}
          </span>
          <span className="text-[9px] text-text-muted mt-0.5 max-w-[60px] truncate">
            {activeSegment ? activeSegment.label : centerLabel || 'Tổng số'}
          </span>
        </div>
      </div>

      {/* Legend list */}
      {showLegend && (
        <div className="flex-1 space-y-1.5 text-xs">
          {segments.map((seg, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <div
                key={seg.label}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  isHovered ? 'bg-surface-subtle font-semibold' : 'text-text-muted hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[11px] text-text truncate">{seg.label}</span>
                </div>
                <span className="text-[11px] font-mono font-medium text-text">
                  {Math.round(seg.percent * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
