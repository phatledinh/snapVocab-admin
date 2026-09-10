import React, { useState } from 'react';
import { Search, Plus, Filter, Sparkles, BookOpen, Camera, Layers, CheckCircle2, Clock, FileText } from 'lucide-react';
import { CardViewModel, CEFRLevel, VocabStatus } from '../../domains/flashcard/types';

interface WordListProps {
  words: CardViewModel[];
  selectedId: string;
  onSelectWord: (id: string) => void;
  onAddNewWord: () => void;
}

const CEFR_BADGES: Record<CEFRLevel, string> = {
  A1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  A2: 'bg-teal-50 text-teal-700 border-teal-200',
  B1: 'bg-amber-50 text-amber-700 border-amber-200',
  B2: 'bg-orange-50 text-orange-700 border-orange-200',
  C1: 'bg-purple-50 text-purple-700 border-purple-200',
  C2: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_ICONS: Record<VocabStatus, { icon: React.ReactNode; color: string; tooltip: string }> = {
  published: {
    icon: <CheckCircle2 size={12} />,
    color: 'text-primary',
    tooltip: 'Đã xuất bản',
  },
  review: {
    icon: <Clock size={12} />,
    color: 'text-info',
    tooltip: 'Chờ kiểm duyệt',
  },
  draft: {
    icon: <FileText size={12} />,
    color: 'text-text-muted',
    tooltip: 'Bản nháp',
  },
  archived: {
    icon: <span className="w-2 h-2 rounded-full bg-danger inline-block" />,
    color: 'text-danger',
    tooltip: 'Đã lưu trữ',
  },
};

export const WordList: React.FC<WordListProps> = ({
  words,
  selectedId,
  onSelectWord,
  onAddNewWord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VocabStatus>('all');
  const [cefrFilter, setCefrFilter] = useState<'all' | CEFRLevel>('all');

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meanings.some((m) =>
        m.definitionVi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesCefr = cefrFilter === 'all' || w.cefr === cefrFilter;
    return matchesSearch && matchesStatus && matchesCefr;
  });

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border select-none">
      {/* Header & New Word CTA */}
      <div className="p-3.5 border-b border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-text uppercase tracking-wider">
              Vocabulary Bank
            </div>
            <div className="text-[11px] text-text-muted">
              {words.length} từ vựng ({words.filter((w) => w.status === 'review').length} chờ duyệt)
            </div>
          </div>
          <button
            type="button"
            onClick={onAddNewWord}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all"
          >
            <Plus size={14} />
            <span>Thêm từ</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-text-light" />
          <input
            type="text"
            placeholder="Tìm theo từ, nghĩa tiếng Việt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs border border-border bg-surface-subtle/50 text-text placeholder:text-text-light focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface"
          />
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-0.5">
          {(['all', 'review', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-text text-white shadow-xs'
                  : 'text-text-muted hover:bg-surface-subtle hover:text-text'
              }`}
            >
              {st === 'all'
                ? 'Tất cả'
                : st === 'review'
                ? 'Chờ duyệt'
                : st === 'published'
                ? 'Đã phát hành'
                : 'Bản nháp'}
            </button>
          ))}
        </div>
      </div>

      {/* CEFR Secondary Filter Bar */}
      <div className="px-3.5 py-1.5 border-b border-border/60 bg-surface-subtle/40 flex items-center justify-between text-[11px] text-text-muted">
        <span>Khung CEFR:</span>
        <div className="flex items-center gap-1">
          {(['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setCefrFilter(lvl)}
              className={`px-1 rounded text-[10px] font-mono font-medium ${
                cefrFilter === lvl
                  ? 'bg-primary-light text-primary font-bold border border-primary/20'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Word List Scrollable Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {filteredWords.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            Không tìm thấy từ vựng phù hợp
          </div>
        ) : (
          filteredWords.map((item) => {
            const isSelected = item.id === selectedId;
            const primaryMeaning = item.meanings[0]?.definitionVi || 'Chưa có định nghĩa';
            const cefrBadge = CEFR_BADGES[item.cefr];
            const statusInfo = STATUS_ICONS[item.status];

            return (
              <div
                key={item.id}
                onClick={() => onSelectWord(item.id)}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary-light/40 border-l-4 border-primary pl-2'
                    : 'hover:bg-surface-subtle/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-text tracking-tight">
                      {item.word}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${cefrBadge}`}
                    >
                      {item.cefr}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Source tag */}
                    {item.source === 'SCAN' && (
                      <span className="text-[9px] font-bold text-snapy bg-snapy-light px-1 rounded border border-snapy/20">
                        SCAN
                      </span>
                    )}
                    {item.source === 'AI' && (
                      <span className="text-[9px] font-bold text-info bg-info-light px-1 rounded border border-info/20">
                        AI
                      </span>
                    )}
                    {/* Status icon */}
                    <span className={statusInfo.color} title={statusInfo.tooltip}>
                      {statusInfo.icon}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-text-muted mb-1">
                  {item.phonetic} · <span className="italic">{item.partOfSpeech}</span>
                </div>

                <div className="text-xs text-text-muted line-clamp-1">
                  {primaryMeaning}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
