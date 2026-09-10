import React, { useState } from 'react';

export interface BarChartItem {
  label: string;
  value: number;
  subLabel?: string;
  color?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  defaultColor?: string;
  showValues?: boolean;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 130,
  defaultColor = '#58CC02',
  showValues = true,
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`w-full flex items-end gap-2 select-none ${className}`} style={{ height }}>
      {data.map((item, index) => {
        const heightPercent = Math.max((item.value / maxValue) * 100, 6);
        const isHovered = hoveredIndex === index;
        const barColor = item.color || defaultColor;

        return (
          <div
            key={item.label}
            className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Value on top of bar */}
            {showValues && (
              <span
                className={`text-[10px] font-mono mb-1 transition-all ${
                  isHovered ? 'font-bold text-text scale-105' : 'text-text-muted opacity-80'
                }`}
              >
                {item.value}
              </span>
            )}

            {/* Bar Body */}
            <div className="w-full bg-surface-subtle rounded-t-md overflow-hidden flex items-end h-[calc(100%-35px)]">
              <div
                className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-95"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1,
                }}
              />
            </div>

            {/* Label below bar */}
            <div className="mt-1 text-center">
              <div
                className={`text-[11px] font-medium leading-none ${
                  isHovered ? 'text-text font-bold' : 'text-text-muted'
                }`}
              >
                {item.label}
              </div>
              {item.subLabel && (
                <div className="text-[9px] text-text-light mt-0.5">{item.subLabel}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
