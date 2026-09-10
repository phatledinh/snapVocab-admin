import React, { useState, useRef } from 'react';
import { generateSmoothPath, formatChartNumber, Point } from './chart-utils';
import { ChartTooltip } from './ChartTooltip';

export interface LineChartSeries {
  name: string;
  color: string;
  data: number[];
}

export interface LineChartProps {
  labels: string[];
  series: LineChartSeries[];
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  labels,
  series,
  height = 160,
  showLegend = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  if (!labels.length || !series.length) {
    return (
      <div
        className={`flex items-center justify-center text-text-muted text-xs ${className}`}
        style={{ height }}
      >
        Không có dữ liệu
      </div>
    );
  }

  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 26;

  const width = 500;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const allValues = series.flatMap((s) => s.data);
  const maxValue = Math.max(...allValues, 10);
  const minValue = Math.min(...allValues, 0);
  const range = maxValue - minValue || 1;

  const computedSeries = series.map((s) => {
    const points: Point[] = s.data.map((val, idx) => {
      const x = paddingLeft + (idx / (labels.length - 1 || 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((val - minValue) / range) * chartHeight;
      return { x, y };
    });
    return {
      ...s,
      points,
      path: generateSmoothPath(points),
    };
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgRelativeX = (mouseX / rect.width) * width;

    let nearestIdx = 0;
    let minDistance = Infinity;

    labels.forEach((_, idx) => {
      const targetX = paddingLeft + (idx / (labels.length - 1 || 1)) * chartWidth;
      const dist = Math.abs(targetX - svgRelativeX);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = idx;
      }
    });

    setHoveredIndex(nearestIdx);
    const actualX =
      ((paddingLeft + (nearestIdx / (labels.length - 1 || 1)) * chartWidth) / width) *
      rect.width;
    setTooltipPos({ x: actualX, y: rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div ref={containerRef} className={`relative w-full select-none ${className}`} style={{ height }}>
      {hoveredIndex !== null && (
        <ChartTooltip
          visible={true}
          label={labels[hoveredIndex]}
          value={series.map((s) => `${s.name}: ${s.data[hoveredIndex]}`).join(' | ')}
          color={series[0]?.color}
          x={tooltipPos.x}
          y={tooltipPos.y}
        />
      )}

      {showLegend && (
        <div className="flex items-center gap-3 mb-1 text-[11px] text-text-muted justify-end">
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((ratio) => {
          const y = paddingTop + chartHeight * ratio;
          const val = Math.round(maxValue - ratio * range);
          return (
            <g key={ratio}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 6}
                y={y + 3.5}
                textAnchor="end"
                className="text-[9px] fill-text-muted font-mono"
              >
                {formatChartNumber(val)}
              </text>
            </g>
          );
        })}

        {/* Lines */}
        {computedSeries.map((s) => (
          <path
            key={s.name}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* X labels */}
        {labels.map((lbl, idx) => {
          if (idx === 0 || idx === labels.length - 1 || idx === Math.floor(labels.length / 2)) {
            const x = paddingLeft + (idx / (labels.length - 1 || 1)) * chartWidth;
            return (
              <text
                key={idx}
                x={x}
                y={height - 6}
                textAnchor={idx === 0 ? 'start' : idx === labels.length - 1 ? 'end' : 'middle'}
                className="text-[9px] fill-text-muted font-mono"
              >
                {lbl}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};
