import React, { useState } from 'react';
import { Volume2, Play, Square, Upload, Sparkles, Sliders } from 'lucide-react';
import { CardAudioConfig } from '../../domains/flashcard/types';

interface AudioPreviewTesterProps {
  word: string;
  config: CardAudioConfig;
  onChange: (config: CardAudioConfig) => void;
}

export const AudioPreviewTester: React.FC<AudioPreviewTesterProps> = ({
  word,
  config,
  onChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePlayTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech API.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = config.voice;
    utterance.rate = config.speed;
    utterance.pitch = config.pitch;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-info-light text-info">
            <Volume2 size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-text">Audio Pronunciation</div>
            <div className="text-[11px] text-text-muted">
              {config.sourceType === 'tts' ? 'Web Speech Synthesis (AI Engine)' : 'Custom Audio File'}
            </div>
          </div>
        </div>

        {/* Source Switcher */}
        <div className="flex items-center bg-surface-subtle p-0.5 rounded-md text-xs">
          <button
            type="button"
            onClick={() => onChange({ ...config, sourceType: 'tts' })}
            className={`px-2.5 py-1 rounded transition-all font-medium ${
              config.sourceType === 'tts'
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            TTS Engine
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, sourceType: 'custom' })}
            className={`px-2.5 py-1 rounded transition-all font-medium ${
              config.sourceType === 'custom'
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Custom File
          </button>
        </div>
      </div>

      {config.sourceType === 'tts' ? (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2">
            {/* Play Button */}
            <button
              type="button"
              onClick={handlePlayTTS}
              disabled={!word.trim()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isPlaying
                  ? 'bg-danger text-white'
                  : 'bg-primary text-white hover:bg-primary-hover shadow-sm'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPlaying ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
              <span>{isPlaying ? 'Dừng phát' : 'Nghe thử TTS'}</span>
            </button>

            {/* Voice select */}
            <select
              value={config.voice}
              onChange={(e) => onChange({ ...config, voice: e.target.value as 'en-US' | 'en-GB' })}
              className="text-xs px-2.5 py-1.5 rounded-md border border-border bg-surface text-text font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="en-US">English (US - Chuẩn Mỹ)</option>
              <option value="en-GB">English (UK - Chuẩn Anh)</option>
            </select>

            {/* Speed select */}
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-[11px] text-text-muted">Tốc độ:</span>
              {[0.8, 1.0, 1.2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ ...config, speed: s })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                    config.speed === s
                      ? 'bg-primary-light text-primary font-bold border border-primary/20'
                      : 'text-text-muted hover:bg-surface-subtle'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-1.5 text-text-muted hover:text-text rounded hover:bg-surface-subtle"
              title="Tùy chỉnh cao độ"
            >
              <Sliders size={13} />
            </button>
          </div>

          {showAdvanced && (
            <div className="p-2 bg-surface-subtle rounded-md flex items-center gap-3 text-xs">
              <span className="text-text-muted text-[11px]">Cao độ (Pitch):</span>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={config.pitch}
                onChange={(e) => onChange({ ...config, pitch: parseFloat(e.target.value) })}
                className="w-32 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="font-mono text-[11px] text-text font-medium">{config.pitch}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-3 text-center bg-surface-subtle/50">
          <Upload size={18} className="mx-auto text-text-muted mb-1" />
          <p className="text-xs text-text font-medium">Tải lên file phát âm định dạng .mp3 / .wav</p>
          <p className="text-[11px] text-text-muted">Dung lượng tối đa 1MB, khuyến nghị audio rõ chuẩn phòng thu</p>
        </div>
      )}
    </div>
  );
};
