import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Volume2, Play, Square, Upload, Sliders } from 'lucide-react';
export const AudioPreviewTester = ({ word, config, onChange, }) => {
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
    return (_jsxs("div", { className: "rounded-lg border border-border bg-surface p-3.5 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-1.5 rounded-md bg-info-light text-info", children: _jsx(Volume2, { size: 16 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-text", children: "Audio Pronunciation" }), _jsx("div", { className: "text-[11px] text-text-muted", children: config.sourceType === 'tts' ? 'Web Speech Synthesis (AI Engine)' : 'Custom Audio File' })] })] }), _jsxs("div", { className: "flex items-center bg-surface-subtle p-0.5 rounded-md text-xs", children: [_jsx("button", { type: "button", onClick: () => onChange({ ...config, sourceType: 'tts' }), className: `px-2.5 py-1 rounded transition-all font-medium ${config.sourceType === 'tts'
                                    ? 'bg-surface text-text shadow-sm'
                                    : 'text-text-muted hover:text-text'}`, children: "TTS Engine" }), _jsx("button", { type: "button", onClick: () => onChange({ ...config, sourceType: 'custom' }), className: `px-2.5 py-1 rounded transition-all font-medium ${config.sourceType === 'custom'
                                    ? 'bg-surface text-text shadow-sm'
                                    : 'text-text-muted hover:text-text'}`, children: "Custom File" })] })] }), config.sourceType === 'tts' ? (_jsxs("div", { className: "space-y-2.5 pt-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { type: "button", onClick: handlePlayTTS, disabled: !word.trim(), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isPlaying
                                    ? 'bg-danger text-white'
                                    : 'bg-primary text-white hover:bg-primary-hover shadow-sm'} disabled:opacity-50 disabled:cursor-not-allowed`, children: [isPlaying ? _jsx(Square, { size: 13, fill: "currentColor" }) : _jsx(Play, { size: 13, fill: "currentColor" }), _jsx("span", { children: isPlaying ? 'Dừng phát' : 'Nghe thử TTS' })] }), _jsxs("select", { value: config.voice, onChange: (e) => onChange({ ...config, voice: e.target.value }), className: "text-xs px-2.5 py-1.5 rounded-md border border-border bg-surface text-text font-medium focus:outline-none focus:ring-1 focus:ring-primary", children: [_jsx("option", { value: "en-US", children: "English (US - Chu\u1EA9n M\u1EF9)" }), _jsx("option", { value: "en-GB", children: "English (UK - Chu\u1EA9n Anh)" })] }), _jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [_jsx("span", { className: "text-[11px] text-text-muted", children: "T\u1ED1c \u0111\u1ED9:" }), [0.8, 1.0, 1.2].map((s) => (_jsxs("button", { type: "button", onClick: () => onChange({ ...config, speed: s }), className: `px-1.5 py-0.5 rounded text-[11px] font-mono ${config.speed === s
                                            ? 'bg-primary-light text-primary font-bold border border-primary/20'
                                            : 'text-text-muted hover:bg-surface-subtle'}`, children: [s, "x"] }, s)))] }), _jsx("button", { type: "button", onClick: () => setShowAdvanced(!showAdvanced), className: "p-1.5 text-text-muted hover:text-text rounded hover:bg-surface-subtle", title: "T\u00F9y ch\u1EC9nh cao \u0111\u1ED9", children: _jsx(Sliders, { size: 13 }) })] }), showAdvanced && (_jsxs("div", { className: "p-2 bg-surface-subtle rounded-md flex items-center gap-3 text-xs", children: [_jsx("span", { className: "text-text-muted text-[11px]", children: "Cao \u0111\u1ED9 (Pitch):" }), _jsx("input", { type: "range", min: "0.5", max: "1.5", step: "0.1", value: config.pitch, onChange: (e) => onChange({ ...config, pitch: parseFloat(e.target.value) }), className: "w-32 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary" }), _jsx("span", { className: "font-mono text-[11px] text-text font-medium", children: config.pitch })] }))] })) : (_jsxs("div", { className: "border-2 border-dashed border-border rounded-lg p-3 text-center bg-surface-subtle/50", children: [_jsx(Upload, { size: 18, className: "mx-auto text-text-muted mb-1" }), _jsx("p", { className: "text-xs text-text font-medium", children: "T\u1EA3i l\u00EAn file ph\u00E1t \u00E2m \u0111\u1ECBnh d\u1EA1ng .mp3 / .wav" }), _jsx("p", { className: "text-[11px] text-text-muted", children: "Dung l\u01B0\u1EE3ng t\u1ED1i \u0111a 1MB, khuy\u1EBFn ngh\u1ECB audio r\u00F5 chu\u1EA9n ph\u00F2ng thu" })] }))] }));
};
