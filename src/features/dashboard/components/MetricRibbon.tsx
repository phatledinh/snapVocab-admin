import React from 'react';
import { MetricRibbonCard } from '../../../domains/dashboard/types';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface MetricRibbonProps {
  cards: MetricRibbonCard[];
  onNavigate?: (navId: string) => void;
}

export const MetricRibbon: React.FC<MetricRibbonProps> = ({ cards, onNavigate }) => {
  const getThemeStyles = (theme: MetricRibbonCard['statusTheme']) => {
    switch (theme) {
      case 'primary':
        return {
          badge: 'bg-primary-light text-primary border-primary/20',
          accent: 'border-l-primary',
          hover: 'hover:border-primary/40',
        };
      case 'snapy':
        return {
          badge: 'bg-snapy-light text-snapy border-snapy/20',
          accent: 'border-l-snapy',
          hover: 'hover:border-snapy/40',
        };
      case 'reward':
        return {
          badge: 'bg-reward-light text-[#9A7000] border-reward/30',
          accent: 'border-l-reward',
          hover: 'hover:border-reward/40',
        };
      case 'info':
        return {
          badge: 'bg-info-light text-info border-info/20',
          accent: 'border-l-info',
          hover: 'hover:border-info/40',
        };
      case 'danger':
        return {
          badge: 'bg-danger-light text-danger border-danger/20',
          accent: 'border-l-danger',
          hover: 'hover:border-danger/40',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 select-none">
      {cards.map((card) => {
        const theme = getThemeStyles(card.statusTheme);

        return (
          <div
            key={card.id}
            onClick={() => card.deepLinkNav && onNavigate?.(card.deepLinkNav)}
            className={`bg-surface border border-border border-l-[3.5px] ${theme.accent} rounded-xl p-3.5 shadow-card transition-all cursor-pointer group ${theme.hover} hover:shadow-elevated`}
            title={card.deepLinkTip}
          >
            {/* Header: Title & Deep Link Arrow */}
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {card.title}
              </span>
              {card.deepLinkNav && (
                <ArrowUpRight
                  size={13}
                  className="text-text-light opacity-0 group-hover:opacity-100 transition-opacity text-text-muted group-hover:text-primary"
                />
              )}
            </div>

            {/* Main Value & SubValue */}
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-xl font-extrabold text-text font-mono tracking-tight">
                {card.value}
              </div>
              {card.subValue && (
                <span className="text-[11px] font-medium text-text-muted font-mono truncate">
                  {card.subValue}
                </span>
              )}
            </div>

            {/* Footer: Trend badge & Sparkline */}
            <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 font-medium text-text-muted truncate">
                <TrendingUp size={12} className="text-primary shrink-0" />
                <span className="truncate">{card.changeText}</span>
              </div>

              {/* Micro Sparkline Preview */}
              <div className="w-12 h-4 shrink-0 flex items-end gap-[2px]">
                {card.sparkline.map((val, i) => {
                  const max = Math.max(...card.sparkline);
                  const min = Math.min(...card.sparkline);
                  const hPercent = Math.max(((val - min) / (max - min || 1)) * 100, 20);
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-neutral-300 group-hover:bg-primary/70 rounded-[1px] transition-colors"
                      style={{ height: `${hPercent}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
