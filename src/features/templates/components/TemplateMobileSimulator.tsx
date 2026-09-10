import React, { useState, useEffect } from 'react';
import { CardTemplate, CardTemplateField } from '../../../domains/templates/types';
import { CardViewModel } from '../../../domains/flashcard/types';
import { SAMPLE_TEST_WORDS } from '../../../domains/templates/mock-data';
import {
  Smartphone,
  RotateCw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Signal,
  Wifi,
  Battery,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface TemplateMobileSimulatorProps {
  template: CardTemplate;
  onSelectWord?: (word: string) => void;
}

export const TemplateMobileSimulator: React.FC<TemplateMobileSimulatorProps> = ({
  template,
  onSelectWord,
}) => {
  // Test words state
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const currentCard = SAMPLE_TEST_WORDS[selectedWordIndex] || SAMPLE_TEST_WORDS[0];

  // Simulator Interactive States
  const [isFlipped, setIsFlipped] = useState(false);
  const [userTypedInput, setUserTypedInput] = useState('');
  const [typeInResult, setTypeInResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [revealedFields, setRevealedFields] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Reset interactive state when template or word changes
  useEffect(() => {
    setIsFlipped(false);
    setUserTypedInput('');
    setTypeInResult('idle');
    setRevealedFields({});
  }, [template.id, selectedWordIndex]);

  // Audio Pronunciation using Web Speech API
  const handlePronounce = (textToSpeak?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = textToSpeak || currentCard.word;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentCard.audio?.voice || 'en-US';
      utterance.rate = currentCard.audio?.speed || 1.0;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Check user typed answer for TYPE_IN mode
  const handleCheckTypeIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userTypedInput.trim()) return;

    const backWordField = template.fields.find(
      (f) => f.side === 'BACK' && f.fieldType === 'WORD'
    );
    const isStrict = backWordField?.fieldConfig?.strictMode ?? false;

    const cleanInput = userTypedInput.trim();
    const cleanWord = currentCard.word.trim();

    const isMatch = isStrict
      ? cleanInput === cleanWord
      : cleanInput.toLowerCase() === cleanWord.toLowerCase();

    if (isMatch) {
      setTypeInResult('correct');
      handlePronounce();
    } else {
      setTypeInResult('incorrect');
    }
  };

  // Toggle reveal for TAP_TO_REVEAL mode
  const toggleReveal = (fieldId: string) => {
    setRevealedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // Mask sentence helper for CONTEXT mode
  const renderMaskedExample = (sentence: string, maskPattern: string = '___') => {
    if (!sentence) return '';
    const regex = new RegExp(`\\b${currentCard.word}\\b`, 'gi');
    return sentence.replace(regex, maskPattern);
  };

  // Current side fields
  const currentSide = isFlipped ? 'BACK' : 'FRONT';
  const activeFields = template.fields
    .filter((f) => f.side === currentSide)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Auto-play audio on side change if enabled
  useEffect(() => {
    const audioField = activeFields.find((f) => f.fieldType === 'AUDIO');
    if (audioField?.fieldConfig?.autoPlay) {
      const timer = setTimeout(() => handlePronounce(), 350);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, activeFields]);

  // Render individual field according to template config
  const renderField = (field: CardTemplateField) => {
    const isPrimary = field.isPrimary;
    const isTapRevealed = revealedFields[field.id];

    // TAP_TO_REVEAL: Ẩn các trường phụ cho đến khi người học chạm để mở
    if (template.interactionType === 'TAP_TO_REVEAL' && !isFlipped && !isPrimary && !isTapRevealed) {
      return (
        <button
          key={field.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleReveal(field.id);
          }}
          className="w-full my-1.5 p-2.5 rounded-xl bg-surface-subtle border border-dashed border-border hover:border-info text-text-muted hover:text-info text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
        >
          <EyeOff size={13} />
          <span>Chạm để mở manh mối {field.fieldType}</span>
        </button>
      );
    }

    switch (field.fieldType) {
      case 'WORD':
        return (
          <div key={field.id} className="text-center my-1.5 w-full">
            <h3
              className={`${
                isPrimary ? 'text-3xl font-black text-text tracking-tight' : 'text-xl font-bold text-text'
              }`}
            >
              {currentCard.word}
            </h3>
          </div>
        );

      case 'IPA':
        return (
          <div key={field.id} className="text-center my-1 flex items-center justify-center gap-1.5 w-full">
            <span className="text-sm font-mono text-text-muted bg-surface-subtle px-2 py-0.5 rounded border border-border/70">
              {currentCard.phonetic}
            </span>
          </div>
        );

      case 'AUDIO':
        return (
          <div key={field.id} className="flex justify-center my-2 w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePronounce();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isPlayingAudio
                  ? 'bg-primary text-white border-primary shadow-md scale-105'
                  : 'bg-primary-light text-primary border-primary/30 hover:scale-105'
              }`}
            >
              <Volume2 size={15} className={isPlayingAudio ? 'animate-pulse' : ''} />
              <span>{isPlayingAudio ? 'Đang phát...' : 'Phát âm (US)'}</span>
            </button>
          </div>
        );

      case 'PART_OF_SPEECH':
        return (
          <div key={field.id} className="flex justify-center my-1 w-full">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-surface-subtle text-text-muted border border-border">
              {currentCard.partOfSpeech}
            </span>
          </div>
        );

      case 'IMAGE':
        if (!currentCard.media?.imageUrl) {
          // Graceful fallback: Ẩn khi không có ảnh theo rule spec
          return null;
        }
        return (
          <div key={field.id} className="w-full my-2">
            <div className="w-full h-36 rounded-xl overflow-hidden border border-border bg-surface-subtle relative group shadow-2xs">
              <img
                src={currentCard.media.imageUrl}
                alt={currentCard.word}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {currentCard.media.aiConfidence && (
                <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {(currentCard.media.aiConfidence * 100).toFixed(0)}% AI match
                </span>
              )}
            </div>
          </div>
        );

      case 'MEANING': {
        const primaryMeaning = currentCard.meanings[0];
        return (
          <div key={field.id} className="w-full my-2 bg-surface p-3 rounded-xl border border-border/80 text-left">
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
              Định nghĩa tiếng Việt
            </div>
            <p className={`${isPrimary ? 'text-base font-bold text-text' : 'text-xs font-semibold text-text'} leading-relaxed`}>
              {primaryMeaning?.definitionVi || 'Chưa có định nghĩa'}
            </p>
            {field.fieldConfig?.showAll && primaryMeaning?.definitionEn && (
              <p className="text-[11px] text-text-muted mt-1.5 pt-1.5 border-t border-border/50 italic">
                {primaryMeaning.definitionEn}
              </p>
            )}
          </div>
        );
      }

      case 'EXAMPLE': {
        const example = currentCard.meanings[0]?.examples[0];
        if (!example) return null;

        const maskPattern = field.fieldConfig?.maskPattern;
        const displayEn = maskPattern
          ? renderMaskedExample(example.en, maskPattern)
          : example.en;

        return (
          <div key={field.id} className="w-full my-2 bg-surface-subtle p-2.5 rounded-xl border border-border/60 text-left">
            <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Ví dụ thực tế</span>
              {maskPattern && (
                <span className="text-[9px] text-snapy font-bold bg-snapy-light px-1.5 py-0.2 rounded border border-snapy/20">
                  Cloze {maskPattern}
                </span>
              )}
            </div>
            <p className="text-xs text-text font-medium leading-relaxed italic">
              "{displayEn}"
            </p>
            <p className="text-[11px] text-text-muted mt-1 leading-normal">
              {example.vi}
            </p>
          </div>
        );
      }

      case 'PERSONAL_NOTE':
        return (
          <div key={field.id} className="w-full my-1.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 text-left">
            <span className="text-[9px] font-bold uppercase text-amber-800 tracking-wider">
              Ghi chú cá nhân
            </span>
            <p className="text-xs text-amber-900 mt-0.5">
              Từ này hay xuất hiện trong phần IELTS Reading & Listening Part 3.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-surface-subtle/50 border-l border-border select-none">
      {/* Top Simulator Controls */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-border text-xs">
        <div className="flex items-center gap-1.5 text-text font-bold">
          <Smartphone size={15} className="text-primary" />
          <span>Mobile Simulator</span>
        </div>

        {/* Word Switcher (to test missing fields & fallback) */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-1 shadow-2xs">
          <span className="text-[10px] text-text-muted font-medium">Từ mẫu:</span>
          <select
            value={selectedWordIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedWordIndex(idx);
              if (onSelectWord) {
                onSelectWord(SAMPLE_TEST_WORDS[idx].word);
              }
            }}
            className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer"
          >
            {SAMPLE_TEST_WORDS.map((w, index) => (
              <option key={w.id} value={index}>
                {w.word} ({w.cefr})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="my-auto py-2">
        <div className="w-[330px] h-[610px] bg-slate-900 rounded-[44px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-slate-700 relative flex flex-col">
          {/* Inner Screen */}
          <div className="w-full h-full bg-[#F8F9F7] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800">
            {/* Phone Status Bar */}
            <div className="w-full h-8 pt-2 px-5 flex items-center justify-between text-slate-800 text-[10px] font-semibold select-none z-20">
              <span>09:41</span>
              {/* Dynamic Island Notch */}
              <div className="w-18 h-3.5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1 text-slate-800">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={12} />
              </div>
            </div>

            {/* App Header inside Simulator */}
            <div className="px-3.5 py-2 flex items-center justify-between border-b border-border/50 bg-surface/90 backdrop-blur-xs z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🦊</span>
                <span className="font-extrabold text-xs text-text tracking-tight">SnapVocab</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary-light text-primary border border-primary/20">
                  {template.code}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-reward-light text-reward-hover px-1.5 py-0.2 rounded-full text-[9px] font-bold border border-reward/30">
                <span>🔥 7 days</span>
              </div>
            </div>

            {/* Sub-bar: Side & Mode Switcher */}
            <div className="px-3 py-1.5 bg-surface/70 border-b border-border/40 flex items-center justify-between text-[10px]">
              <span className="font-bold text-text-muted">
                {isFlipped ? 'MẶT SAU (BACK)' : 'MẶT TRƯỚC (FRONT)'}
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1 text-primary hover:text-primary-hover font-bold px-2 py-0.5 rounded-full hover:bg-primary-light transition-all"
              >
                <RotateCw size={11} className={isFlipped ? 'rotate-180 transition-transform' : ''} />
                <span>{isFlipped ? 'Xem mặt trước' : 'Lật mặt sau'}</span>
              </button>
            </div>

            {/* Card Content Viewport */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-center items-center">
              <div
                onClick={() => {
                  if (template.interactionType === 'FLIP') {
                    setIsFlipped(!isFlipped);
                  }
                }}
                className={`w-full bg-surface rounded-2xl border-2 p-4 flex flex-col justify-between transition-all duration-300 relative shadow-card ${
                  template.interactionType === 'FLIP' ? 'cursor-pointer hover:border-primary/60' : 'cursor-default'
                } border-border`}
              >
                {/* Top Badge Info */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary-light text-primary border border-primary/20">
                      {currentCard.cefr}
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      {template.nameVi}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface-subtle text-text-muted border border-border">
                    {template.interactionType}
                  </span>
                </div>

                {/* Main Dynamic Fields */}
                <div className="flex-1 flex flex-col justify-center items-center py-2 w-full">
                  {activeFields.length > 0 ? (
                    activeFields.map((field) => renderField(field))
                  ) : (
                    <div className="text-center py-6 text-text-muted text-xs italic">
                      Mặt này chưa được cấu hình trường nào.
                    </div>
                  )}

                  {/* SPECIAL INTERACTION: TYPE_IN */}
                  {template.interactionType === 'TYPE_IN' && !isFlipped && (
                    <form onSubmit={handleCheckTypeIn} className="w-full mt-3 pt-2 border-t border-border/80">
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                        Gõ từ tiếng Anh để kiểm tra:
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={userTypedInput}
                          onChange={(e) => {
                            setUserTypedInput(e.target.value);
                            setTypeInResult('idle');
                          }}
                          placeholder={
                            template.fields.find((f) => f.side === 'BACK' && f.fieldType === 'WORD')?.fieldConfig
                              ?.customPlaceholder || 'Nhập từ vựng...'
                          }
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-border text-xs text-text bg-surface focus:outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Check
                        </button>
                      </div>

                      {/* Feedback Banner */}
                      {typeInResult === 'correct' && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>Chính xác 100%! Bấm lật thẻ xem chi tiết.</span>
                        </div>
                      )}
                      {typeInResult === 'incorrect' && (
                        <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                          <AlertCircle size={14} className="text-rose-600 shrink-0" />
                          <span>Chưa chính xác. Đáp án gợi ý: {currentCard.word[0]}***</span>
                        </div>
                      )}
                    </form>
                  )}

                  {/* SPECIAL INTERACTION: TAP_TO_REVEAL */}
                  {template.interactionType === 'TAP_TO_REVEAL' && !isFlipped && (
                    <div className="w-full mt-3 pt-2 border-t border-border/80 text-center">
                      <button
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        className="w-full py-2 rounded-xl bg-snapy-light text-snapy hover:bg-snapy hover:text-white border border-snapy/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Eye size={13} />
                        <span>Chạm để mở toàn bộ đáp án</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Micro Hint */}
                <div className="text-[10px] text-text-muted text-center pt-1 border-t border-border/40 flex items-center justify-center gap-1">
                  {template.interactionType === 'FLIP' && (
                    <span>💡 Chạm vào thẻ hoặc nút trên để lật xem đáp án</span>
                  )}
                  {template.interactionType === 'TYPE_IN' && (
                    <span>⌨️ Gõ từ và bấm Check để nhận diện đúng sai</span>
                  )}
                  {template.interactionType === 'TAP_TO_REVEAL' && (
                    <span>👁️ Chạm để hé lộ dần từng manh mối</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-full h-4 flex items-center justify-center pb-1">
              <div className="w-24 h-1 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Footer Note */}
      <div className="w-full text-center text-[10px] text-text-muted pt-2 border-t border-border">
        Render theo chuẩn <span className="font-mono text-primary font-bold">CardTemplateField[]</span>
      </div>
    </div>
  );
};
