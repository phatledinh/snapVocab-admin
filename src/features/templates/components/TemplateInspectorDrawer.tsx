import React, { useState } from 'react';
import { CardTemplate } from '../../../domains/templates/types';
import {
  X,
  Copy,
  Check,
  Code2,
  Bookmark,
  Users,
  TrendingUp,
  RotateCw,
  Keyboard,
  Eye,
  Download,
  History,
  Sparkles,
} from 'lucide-react';

interface TemplateInspectorDrawerProps {
  template: CardTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignToDeck?: (template: CardTemplate) => void;
}

export const TemplateInspectorDrawer: React.FC<TemplateInspectorDrawerProps> = ({
  template,
  isOpen,
  onClose,
  onAssignToDeck,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'decks'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !template) return null;

  const jsonString = JSON.stringify(template, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${template.code.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-surface border-l border-border shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary border border-primary/20 flex items-center justify-center font-extrabold text-sm shadow-2xs">
              {template.code[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold text-text tracking-tight">
                  {template.name}
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-surface-subtle text-text-muted border border-border">
                  {template.code}
                </span>
                {template.isDefault && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-reward-light text-[#9A7000] border border-reward/20">
                    Default
                  </span>
                )}
              </div>
              <div className="text-xs text-text-muted">{template.nameVi}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Sub-nav Tabs */}
        <div className="px-4 border-b border-border bg-background flex gap-2 text-xs">
          {[
            { id: 'overview', label: 'Tổng Quan & Fields' },
            { id: 'schema', label: 'JSON Schema (API)' },
            { id: 'decks', label: `Decks Đang Dùng (${template.deckCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-2 font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <div className="p-3 bg-surface-subtle rounded-xl border border-border">
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block mb-1">
                  Mô tả nghiệp vụ
                </span>
                <p className="text-text leading-relaxed">{template.description}</p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-[10px] text-text-muted block mb-0.5 font-bold uppercase">Bố Cục (Layout)</span>
                  <span className="font-bold text-text">{template.baseLayout}</span>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-[10px] text-text-muted block mb-0.5 font-bold uppercase">Tương Tác</span>
                  <span className="font-bold text-primary">{template.interactionType}</span>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-[10px] text-text-muted block mb-0.5 font-bold uppercase">Tỷ Lệ Nhớ FSRS</span>
                  <span className="font-bold text-emerald-600">{template.retentionRate}%</span>
                </div>
                <div className="p-3 bg-background rounded-xl border border-border">
                  <span className="text-[10px] text-text-muted block mb-0.5 font-bold uppercase">Học Viên Active</span>
                  <span className="font-bold text-text">{template.activeLearners.toLocaleString()}</span>
                </div>
              </div>

              {/* Fields Table */}
              <div>
                <h4 className="text-xs font-bold text-text uppercase tracking-wide mb-2">
                  Cấu Hình Chi Tiết Các Trường (Fields)
                </h4>
                <div className="border border-border rounded-xl overflow-hidden bg-surface">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-background text-text-muted font-bold text-[10px] uppercase border-b border-border">
                      <tr>
                        <th className="py-2 px-3">Mặt</th>
                        <th className="py-2 px-3">Thứ Tự</th>
                        <th className="py-2 px-3">Trường Dữ Liệu</th>
                        <th className="py-2 px-3">Đặc Tính</th>
                        <th className="py-2 px-3">Cấu Hình JSON</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {template.fields.map((field) => (
                        <tr key={field.id} className="hover:bg-surface-subtle">
                          <td className="py-2 px-3 font-bold">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] ${
                                field.side === 'FRONT'
                                  ? 'bg-primary-light text-primary'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {field.side}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-text-muted">#{field.displayOrder}</td>
                          <td className="py-2 px-3 font-semibold text-text">{field.fieldType}</td>
                          <td className="py-2 px-3">
                            {field.isPrimary && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-reward-light text-[#9A7000] border border-reward/20">
                                PRIMARY
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-[10px] text-text-muted truncate max-w-[140px]">
                            {field.fieldConfig ? JSON.stringify(field.fieldConfig) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  Bản hợp đồng dữ liệu chuẩn hóa phục vụ đồng bộ với Mobile App:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2.5 py-1 rounded bg-surface hover:bg-surface-subtle border border-border text-[11px] font-bold text-text flex items-center gap-1 shadow-2xs"
                  >
                    {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                    <span>{copied ? 'Đã chép' : 'Sao chép JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="p-1 rounded bg-surface hover:bg-surface-subtle border border-border text-text-muted hover:text-text shadow-2xs"
                    title="Tải file .json"
                  >
                    <Download size={13} />
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-[460px] border border-slate-800 leading-relaxed">
                {jsonString}
              </pre>
            </div>
          )}

          {activeTab === 'decks' && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">
                Các bộ bài (Decks) hiện đang sử dụng mẫu này để render flashcard:
              </p>
              <div className="space-y-2">
                {[
                  { name: 'Oxford 3000 Core Vocabulary', count: 3000, cefr: 'B1', learners: 4520 },
                  { name: 'Advanced Tech, AI & Data Science', count: 520, cefr: 'C1', learners: 1670 },
                  { name: 'Everyday Travel & Airport English', count: 240, cefr: 'A2', learners: 1200 },
                ].map((d, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📚</span>
                      <div>
                        <div className="font-bold text-text">{d.name}</div>
                        <div className="text-[11px] text-text-muted">
                          {d.count} từ · {d.cefr} · {d.learners.toLocaleString()} người học
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border bg-background flex items-center justify-between">
          <span className="text-[11px] text-text-muted">
            Cập nhật lần cuối: {new Date(template.updatedAt).toLocaleDateString('vi-VN')}
          </span>
          {onAssignToDeck && (
            <button
              type="button"
              onClick={() => onAssignToDeck(template)}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs"
            >
              Gán Cho Bộ Bài (Deck)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
