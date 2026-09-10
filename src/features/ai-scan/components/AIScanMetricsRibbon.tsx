import React from 'react';
import { AIScanRibbonMetric } from '../../../domains/ai-scan/selectors';
import {
  Camera,
  Clock,
  Sparkles,
  Cpu,
  HardDrive,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

interface AIScanMetricsRibbonProps {
  metrics: AIScanRibbonMetric[];
  onSelectMetricCard?: (metricId: string) => void;
}

export const AIScanMetricsRibbon: React.FC<AIScanMetricsRibbonProps> = ({
  metrics,
  onSelectMetricCard,
}) => {
  const renderIcon = (type: AIScanRibbonMetric['iconType'], color: string) => {
    const size = 15;
    switch (type) {
      case 'scan':
        return <Camera size={size} className={color} />;
      case 'latency':
        return <Clock size={size} className={color} />;
      case 'accuracy':
        return <Sparkles size={size} className={color} />;
      case 'gpu':
        return <Cpu size={size} className={color} />;
      case 'storage':
        return <HardDrive size={size} className={color} />;
      case 'queue':
        return <AlertTriangle size={size} className={color} />;
      default:
        return <Sparkles size={size} className={color} />;
    }
  };

  const getBorderTheme = (color: AIScanRibbonMetric['statusColor']) => {
    switch (color) {
      case 'emerald':
        return {
          bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
          textVal: 'text-emerald-700',
        };
      case 'amber':
        return {
          bgIcon: 'bg-amber-50 text-amber-600 border-amber-200/80',
          textVal: 'text-amber-700',
        };
      case 'rose':
        return {
          bgIcon: 'bg-rose-50 text-rose-600 border-rose-200/80',
          textVal: 'text-rose-700',
        };
      case 'orange':
        return {
          bgIcon: 'bg-snapy-light text-snapy border-snapy/20',
          textVal: 'text-snapy',
        };
      case 'blue':
      default:
        return {
          bgIcon: 'bg-blue-50 text-blue-600 border-blue-200/80',
          textVal: 'text-blue-700',
        };
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 select-none">
      {metrics.map((card) => {
        const theme = getBorderTheme(card.statusColor);
        return (
          <div
            key={card.id}
            onClick={() => onSelectMetricCard?.(card.id)}
            className="p-3 rounded-xl bg-surface border border-border hover:border-border-strong hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
          >
            {/* Header: Title + Icon */}
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[11px] font-semibold text-text-muted leading-tight truncate">
                {card.label}
              </span>
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${theme.bgIcon}`}
              >
                {renderIcon(card.iconType, '')}
              </div>
            </div>

            {/* Value (Font Mono / Display) */}
            <div className="my-0.5">
              <div className="text-lg font-black font-mono text-text tracking-tight flex items-baseline gap-1">
                <span>{card.value}</span>
              </div>
              {card.subValue && (
                <div className="text-[10px] text-text-muted truncate font-medium">
                  {card.subValue}
                </div>
              )}
            </div>

            {/* Footer change badge */}
            <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px]">
              <span
                className={`font-semibold flex items-center gap-0.5 ${
                  card.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {card.changeText}
              </span>
              <ArrowUpRight
                size={11}
                className="text-text-light group-hover:text-text group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
