import React, { useState } from 'react';
import { Wifi, Battery, Signal, Sparkles, Smartphone, Layers } from 'lucide-react';
import { FlashcardPreview } from './FlashcardPreview';
import { CardViewModel } from '../../domains/flashcard/types';

interface MobileSimulatorProps {
  card: CardViewModel;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({ card }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'study'>('card');

  return (
    <div className="h-full flex flex-col items-center justify-between p-4 bg-surface-subtle/60 border-l border-border select-none">
      {/* Simulator Toolbar */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-border/80 text-xs">
        <div className="flex items-center gap-2 text-text font-semibold">
          <Smartphone size={15} className="text-primary" />
          <span>Mobile Simulator</span>
        </div>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              activeTab === 'card'
                ? 'bg-primary-light text-primary font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Thẻ học (SRS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('study')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              activeTab === 'study'
                ? 'bg-primary-light text-primary font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Từ điển
          </button>
        </div>
      </div>

      {/* Phone Chassis */}
      <div className="my-auto py-2">
        <div className="w-[340px] h-[640px] bg-slate-900 rounded-[44px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border-4 border-slate-700/60 relative flex flex-col">
          {/* Inner Screen */}
          <div className="w-full h-full bg-[#F8F9F7] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800">
            {/* Phone Status Bar */}
            <div className="w-full h-9 pt-2 px-6 flex items-center justify-between text-slate-800 text-[11px] font-semibold select-none z-20">
              <span>09:41</span>
              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-800">
                <Signal size={11} />
                <Wifi size={11} />
                <Battery size={13} />
              </div>
            </div>

            {/* App Header inside Simulator */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-border/40 bg-surface/80 backdrop-blur-sm z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🦊</span>
                <span className="font-extrabold text-xs text-text tracking-tight">SnapVocab</span>
              </div>
              <div className="flex items-center gap-1 bg-reward-light text-reward-hover px-2 py-0.5 rounded-full text-[10px] font-bold border border-reward/30">
                <span>🔥 7 days</span>
              </div>
            </div>

            {/* Main Screen Content */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-center items-center">
              <FlashcardPreview card={card} />
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-full h-5 flex items-center justify-center pb-1">
              <div className="w-28 h-1 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Simulator Footnote */}
      <div className="w-full text-center text-[11px] text-text-muted pt-2 border-t border-border/80">
        Đồng bộ trực tiếp theo <span className="font-mono text-primary font-bold">CardViewModel</span>
      </div>
    </div>
  );
};
