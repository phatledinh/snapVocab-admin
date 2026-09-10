import React, { useState, useRef, useId } from 'react';
import { generateSmoothPath, generateAreaPath, formatChartNumber, Point } from './chart-utils';
import { ChartTooltip } from './ChartTooltip';

export interface AreaChartDataPoint {
  label: string;
  value: number;
  subValue?: string;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  height?: number;
  color?: string;
  fillOpacity?: number;
  showGrid?: boolean;
  showDots?: boolean;
  yAxisFormatter?: (val: number) => string;
  className?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 160,
  color = '#58CC02',
  fillOpacity = 0.15,
  showGrid = true,
  showDots = true,
  yAxisFormatter = formatChartNumber,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rawId = useId();
  const gradientId = `area-grad-${rawId.replace(/[:]/g, '')}`;

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-text-muted text-xs ${className}`}
        style={{ height }}
      >
        Không có dữ liệu biểu đồ
      </div>
    );
  }

  // Padding
  const paddingLeft = 40;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 26;

  const width = 500; // SVG internal viewBox coordinate system
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 10);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  // Calculate coordinates
  const points: Point[] = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minValue) / range) * chartHeight;
    return { x, y };
  });

  const baselineY = paddingTop + chartHeight;
  const linePath = generateSmoothPath(points);
  const areaPath = generateAreaPath(points, baselineY);

  // Y-axis grid lines (3 ticks)
  const yTicks = [
    { value: minValue, y: baselineY },
    { value: Math.round(minValue + range / 2), y: paddingTop + chartHeight / 2 },
    { value: maxValue, y: paddingTop },
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgRelativeX = (mouseX / rect.width) * width;

    // Find nearest data point
    let nearestIndex = 0;
    let minDistance = Infinity;

    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgRelativeX);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = idx;
      }
    });

    setHoveredIndex(nearestIndex);

    // Calculate actual pixel position for tooltip
    const actualPt = points[nearestIndex];
    const actualPixelX = (actualPt.x / width) * rect.width;
    const actualPixelY = (actualPt.y / height) * rect.height;

    setTooltipPos({ x: actualPixelX, y: actualPixelY });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div ref={containerRef} className={`relative w-full select-none ${className}`} style={{ height }}>
      {/* Interactive Tooltip */}
      {hoveredIndex !== null && (
        <ChartTooltip
          visible={true}
          label={data[hoveredIndex].label}
          value={yAxisFormatter(data[hoveredIndex].value)}
          subValue={data[hoveredIndex].subValue}
          color={color}
          x={tooltipPos.x}
          y={tooltipPos.y}
        />
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 2.5} />
            <stop offset="90%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>

        {/* Grid lines & Y-axis labels */}
        {showGrid &&
          yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="#E5E7EB"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                className="text-[9px] fill-text-muted font-mono"
              >
                {yAxisFormatter(tick.value)}
              </text>
            </g>
          ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Smooth line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels */}
        {data.map((d, index) => {
          // Show first, middle and last, or evenly spaced
          const showLabel =
            index === 0 ||
            index === data.length - 1 ||
            index === Math.floor(data.length / 2);

          if (!showLabel) return null;

          const pt = points[index];
          return (
            <text
              key={index}
              x={pt.x}
              y={height - 6}
              textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
              className="text-[9px] fill-text-muted font-mono"
            >
              {d.label}
            </text>
          );
        })}

        {/* Active hover crosshair & dot */}
        {hoveredIndex !== null && (
          <g>
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={baselineY}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r="4.5"
              fill="#FFFFFF"
              stroke={color}
              strokeWidth="2.5"
              className="drop-shadow-xs"
            />
          </g>
        )}

        {/* Regular dots if requested and not hovered */}
        {showDots &&
          hoveredIndex === null &&
          points.map((pt, index) => (
            <circle
              key={index}
              cx={pt.x}
              cy={pt.y}
              r="2.5"
              fill="#FFFFFF"
              stroke={color}
              strokeWidth="1.5"
            />
          ))}
      </svg>
    </div>
  );
};
