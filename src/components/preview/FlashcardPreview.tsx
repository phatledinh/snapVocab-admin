import React, { useState } from 'react';
import { Volume2, Sparkles, RotateCw, Bookmark, CheckCircle2, Eye } from 'lucide-react';
import { CardViewModel, CEFRLevel } from '../../domains/flashcard/types';

interface FlashcardPreviewProps {
  card: CardViewModel;
}

const CEFR_COLORS: Record<CEFRLevel, { bg: string; text: string; border: string }> = {
  A1: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  A2: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  B1: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  B2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  C1: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  C2: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const cefrStyle = CEFR_COLORS[card.cefr] || CEFR_COLORS.B1;
  const primaryMeaning = card.meanings[0];

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && card.word) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.word);
      utterance.lang = card.audio?.voice || 'en-US';
      utterance.rate = card.audio?.speed || 1.0;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto flex flex-col items-center select-none">
      {/* View Mode Switcher */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-text-muted">
        <span className="font-semibold tracking-wide uppercase text-[10px]">
          {isFlipped ? 'Back side (Meaning)' : 'Front side (Prompt)'}
        </span>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 text-primary hover:text-primary-hover font-medium px-2 py-0.5 rounded-full hover:bg-primary-light transition-all"
        >
          <RotateCw size={12} />
          <span>Lật thẻ</span>
        </button>
      </div>

      {/* Realistic Flashcard Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[440px] bg-surface rounded-2xl border-2 border-border/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${cefrStyle.bg} ${cefrStyle.text} ${cefrStyle.border}`}
            >
              {card.cefr}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-subtle text-text-muted border border-border">
              {card.partOfSpeech || 'word'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {card.source === 'SCAN' && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-snapy-light text-snapy border border-snapy/20">
                AI SCAN
              </span>
            )}
            <Bookmark size={15} className="text-text-muted hover:text-text" />
          </div>
        </div>

        {/* Center Content */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
            {card.media?.imageUrl && (
              <div className="w-full h-36 mb-4 rounded-xl overflow-hidden border border-border bg-surface-subtle relative group shadow-sm">
                <img
                  src={card.media.imageUrl}
                  alt={card.word}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {card.media.aiConfidence && (
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {(card.media.aiConfidence * 100).toFixed(0)}% AI match
                  </span>
                )}
              </div>
            )}

            <h3 className="text-3xl font-extrabold text-text tracking-tight mb-1 font-sans">
              {card.word || <span className="text-text-muted italic">Word Name</span>}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-text-muted">
                {card.phonetic || '/.../'}
              </span>
              <button
                type="button"
                onClick={handlePronounce}
                className={`p-1.5 rounded-full border transition-all ${
                  isPlayingAudio
                    ? 'bg-primary text-white border-primary shadow'
                    : 'bg-primary-light text-primary border-primary/20 hover:scale-110'
                }`}
                title="Nghe phát âm"
              >
                <Volume2 size={15} />
              </button>
            </div>

            <p className="text-[11px] text-text-muted mt-5 flex items-center gap-1">
              <Eye size={12} />
              <span>Chạm để xem định nghĩa & câu ví dụ</span>
            </p>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="flex-1 flex flex-col justify-start py-3 text-left space-y-3.5">
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                Định nghĩa tiếng Việt
              </div>
              <p className="text-sm font-semibold text-text leading-relaxed">
                {primaryMeaning?.definitionVi || (
                  <span className="text-text-muted italic">Chưa có định nghĩa</span>
                )}
              </p>
            </div>

            {primaryMeaning?.definitionEn && (
              <div className="bg-surface-subtle p-2.5 rounded-lg border border-border/60">
                <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                  English Definition
                </div>
                <p className="text-xs text-text leading-relaxed">
                  {primaryMeaning.definitionEn}
                </p>
              </div>
            )}

            {primaryMeaning?.examples && primaryMeaning.examples.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-border/70">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Câu ví dụ (Example)
                </div>
                <div className="space-y-2">
                  {primaryMeaning.examples.map((ex, idx) => (
                    <div key={ex.id || idx} className="text-xs space-y-0.5">
                      <p className="font-medium text-text text-xs italic">
                        "{ex.en}"
                      </p>
                      <p className="text-text-muted text-[11px]">
                        👉 {ex.vi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card Footer */}
        <div className="w-full pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span className="font-medium">
            {card.topicName || 'General Topic'}
          </span>
          <div className="flex items-center gap-1 text-primary font-medium">
            <CheckCircle2 size={13} />
            <span>SRS Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
