import React from 'react';

export interface ChartTooltipProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  visible: boolean;
  x?: number;
  y?: number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  label,
  value,
  subValue,
  color = '#58CC02',
  visible,
  x,
  y,
}) => {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-2.5 transition-all duration-75 ease-out"
      style={{
        left: x !== undefined ? `${x}px` : undefined,
        top: y !== undefined ? `${y}px` : undefined,
      }}
    >
      <div className="bg-neutral-900/95 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-elevated border border-neutral-700/80 backdrop-blur-xs whitespace-nowrap min-w-[100px]">
        <div className="text-neutral-400 font-medium text-[10px] pb-0.5 mb-1 border-b border-neutral-800">
          {label}
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono">{value}</span>
        </div>
        {subValue && (
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};
