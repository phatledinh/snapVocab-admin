import React, { useState } from 'react';
import {
  Brain,
  Volume2,
  Bell,
  Clock,
  Sliders,
  CheckCircle2,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SRSLearningConfig } from '../../../domains/settings/types';

interface SrsLearningTabProps {
  config: SRSLearningConfig;
  onChange: (updated: Partial<SRSLearningConfig>) => void;
}

export const SrsLearningTab: React.FC<SrsLearningTabProps> = ({ config, onChange }) => {
  const [testText, setTestText] = useState('resilient');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Thử nghiệm Web Speech API trực tiếp
  const handleTestSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt hiện tại không hỗ trợ Web Speech Synthesis API.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.lang = config.ttsDefaultVoice;
    utterance.rate = config.ttsDefaultSpeed;
    utterance.pitch = config.ttsDefaultPitch;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const isMatureTooShort = config.matureIntervalDays < 14;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-info/10 via-info/5 to-transparent border border-info/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-info text-white flex items-center justify-center shadow-md shadow-info/25 shrink-0">
            <Brain size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-text tracking-tight">
                Mô Hình Học Lặp Lại Ngắt Quãng (Spaced Repetition System) & Giọng Đọc TTS
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-info-light text-info border border-info/30">
                FSRS v4.5 Active
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Kiểm soát quy luật ghi nhớ não bộ, ngưỡng thẻ trưởng thành (Mature Cards), giới hạn học hằng ngày và thông báo đẩy nhắc nhở.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-surface/90 px-3.5 py-2 rounded-xl border border-info/20 shadow-xs text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Mục tiêu ghi nhớ</span>
            <span className="font-bold text-text">{(config.requestedRetention * 100).toFixed(0)}% Retention</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Ngưỡng Mature</span>
            <span className="font-bold text-info">{config.matureIntervalDays} ngày</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: FSRS Algorithm Parameters */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-info" />
              <h3 className="font-bold text-sm text-text">Thuật Toán FSRS & Chu Kỳ Lặp</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">specs.md FR-05</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-text mb-1">
                Thuật Toán Ôn Tập Chủ Đạo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['FSRS-4.5', 'SM-2'] as const).map((algo) => (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => onChange({ algorithm: algo })}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      config.algorithm === algo
                        ? 'bg-info-light text-info border-info/40 shadow-xs'
                        : 'bg-neutral-50 text-neutral-600 border-border hover:bg-neutral-100'
                    }`}
                  >
                    <span>{algo}</span>
                    {config.algorithm === algo && <CheckCircle2 size={13} />}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                FSRS (Free Spaced Repetition Scheduler) tối ưu hóa khoảng cách tốt hơn 30% so với Anki SM-2 cổ điển.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Ngưỡng Thẻ Trưởng Thành (Mature)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={7}
                    max={90}
                    value={config.matureIntervalDays}
                    onChange={(e) => onChange({ matureIntervalDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-info font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">ngày</span>
                </div>
                {isMatureTooShort ? (
                  <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                    Khuyến nghị &ge; 21 ngày theo quy ước chuẩn (specs.md L329).
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Thẻ có interval &ge; {config.matureIntervalDays} ngày được tính là Mastered.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Khoảng Cách Ôn Tập Tối Đa
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={60}
                    max={1000}
                    value={config.maxIntervalDays}
                    onChange={(e) => onChange({ maxIntervalDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-info font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">ngày</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Trần khoảng cách tối đa để tránh quên từ lâu ngày.
                </span>
              </div>
            </div>

            {/* Requested Retention Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-text">
                  Tỷ Lệ Ghi Nhớ Mục Tiêu (Requested Retention)
                </label>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-info-light text-info border border-info/20">
                  {(config.requestedRetention * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.75}
                max={0.97}
                step={0.01}
                value={config.requestedRetention}
                onChange={(e) => onChange({ requestedRetention: parseFloat(e.target.value) })}
                className="w-full accent-info cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>75% (Ôn ít lần hơn)</span>
                <span className="font-bold text-neutral-600">90% (Tiêu chuẩn tối ưu)</span>
                <span>97% (Ôn rất dày)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Daily Study Caps & Push Reminder */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-primary" />
              <h3 className="font-bold text-sm text-text">Giới Hạn Học Tập & Thông Báo Đẩy (FCM)</h3>
            </div>
            <span className="text-[11px] font-mono text-primary font-bold">F-NOTIF-01</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Thẻ Mới Tối Đa / Ngày
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={config.maxNewCardsPerDay}
                    onChange={(e) => onChange({ maxNewCardsPerDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">thẻ/ngày</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Tránh quá tải nhận thức cho học viên mới.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Lượt Ôn Tập Tối Đa / Ngày
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={config.maxReviewsPerDay}
                    onChange={(e) => onChange({ maxReviewsPerDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-primary font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">thẻ/ngày</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Giới hạn hàng đợi ôn SRS mỗi ngày.
                </span>
              </div>
            </div>

            {/* Khung giờ Push Notification */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text flex items-center gap-1.5">
                  <Clock size={13} className="text-primary" />
                  Khung Giờ Push Nhắc Nhở SRS Tự Động
                </span>
                <span className="font-mono font-bold text-primary">
                  {config.pushReminderStartHour}:00 - {config.pushReminderEndHour}:00
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Bắt đầu từ (Giờ server)</label>
                  <select
                    value={config.pushReminderStartHour}
                    onChange={(e) => onChange({ pushReminderStartHour: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold"
                  >
                    {[17, 18, 19, 20].map((h) => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Kết thúc lúc (Giờ server)</label>
                  <select
                    value={config.pushReminderEndHour}
                    onChange={(e) => onChange({ pushReminderEndHour: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold"
                  >
                    {[20, 21, 22, 23].map((h) => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-[10px] text-neutral-400">
                Tối đa 1 push nhắc SRS/ngày khung 19–21h, tuân thủ cấu hình giờ nhận của Learner (specs.md L434).
              </p>
            </div>

            {/* Toggle Custom Templates */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
              <div>
                <div className="font-semibold text-text">Cho Phép Học Viên Tự Tạo Card Template</div>
                <div className="text-[11px] text-neutral-400">
                  Learner tự cấu hình layout, field mapping và kiểu tương tác (Flip, Type-in) (FR-05.03).
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.allowLearnerCustomTemplates}
                onChange={(e) => onChange({ allowLearnerCustomTemplates: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 3: TTS & Voice Engine Tester (Full width) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-snapy" />
              <h3 className="font-bold text-sm text-text">Trình Phát Âm Thanh & Thử Nghiệm Web Speech API</h3>
            </div>
            <span className="text-[11px] text-neutral-400">design.md mục 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Voice Select */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-text mb-1">Giọng Đọc Mặc Định</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChange({ ttsDefaultVoice: 'en-US' })}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      config.ttsDefaultVoice === 'en-US'
                        ? 'bg-snapy-light text-snapy border-snapy/40 shadow-xs'
                        : 'bg-neutral-50 text-neutral-600 border-border hover:bg-neutral-100'
                    }`}
                  >
                    <span>English (US) 🇺🇸</span>
                    {config.ttsDefaultVoice === 'en-US' && <CheckCircle2 size={13} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange({ ttsDefaultVoice: 'en-GB' })}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                      config.ttsDefaultVoice === 'en-GB'
                        ? 'bg-snapy-light text-snapy border-snapy/40 shadow-xs'
                        : 'bg-neutral-50 text-neutral-600 border-border hover:bg-neutral-100'
                    }`}
                  >
                    <span>English (UK) 🇬🇧</span>
                    {config.ttsDefaultVoice === 'en-GB' && <CheckCircle2 size={13} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Cloud TTS Fallback Endpoint
                </label>
                <input
                  type="text"
                  value={config.ttsCloudFallbackUrl}
                  onChange={(e) => onChange({ ttsCloudFallbackUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-neutral-50 font-mono text-[11px]"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Dùng khi thiết bị Android cũ không có engine TTS cục bộ chất lượng cao.
                </span>
              </div>
            </div>

            {/* Speed & Pitch Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-text">Tốc Độ Đọc (Speech Rate)</label>
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {config.ttsDefaultSpeed.toFixed(1)}x
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0.8, 1.0, 1.2].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => onChange({ ttsDefaultSpeed: spd })}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        config.ttsDefaultSpeed === spd
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 text-neutral-600 border-border hover:bg-neutral-100'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-text">Cao Độ Giọng (Pitch)</label>
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {config.ttsDefaultPitch.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.6}
                  max={1.4}
                  step={0.1}
                  value={config.ttsDefaultPitch}
                  onChange={(e) => onChange({ ttsDefaultPitch: parseFloat(e.target.value) })}
                  className="w-full accent-snapy cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                />
              </div>
            </div>

            {/* Live Audio Test Box */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-border flex flex-col justify-between">
              <div>
                <span className="font-bold text-text text-xs flex items-center gap-1.5 mb-2">
                  <Sparkles size={14} className="text-snapy" />
                  Bộ Thử Nghiệm Phát Âm Trực Tiếp
                </span>
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Nhập từ cần nghe thử..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-bold text-text focus:outline-hidden focus:border-snapy mb-2"
                />
              </div>

              <button
                type="button"
                onClick={handleTestSpeech}
                disabled={isPlayingAudio}
                className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
              >
                <Play size={13} className={isPlayingAudio ? 'animate-spin' : ''} />
                {isPlayingAudio ? 'Đang đọc thử...' : `Nghe phát âm chuẩn (${config.ttsDefaultVoice})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
