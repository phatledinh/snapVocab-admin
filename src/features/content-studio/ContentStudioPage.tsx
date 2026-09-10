import React, { useState } from 'react';
import { WordList } from './WordList';
import { WordEditor } from './WordEditor';
import { MobileSimulator } from '../../components/preview/MobileSimulator';
import { INITIAL_VOCABULARY } from '../../domains/vocabulary/mock-data';
import { CardViewModel, VocabStatus } from '../../domains/flashcard/types';

interface ContentStudioPageProps {
  onWordChange?: (wordName: string) => void;
}

export const ContentStudioPage: React.FC<ContentStudioPageProps> = ({ onWordChange }) => {
  const [vocabulary, setVocabulary] = useState<CardViewModel[]>(INITIAL_VOCABULARY);
  const [selectedWordId, setSelectedWordId] = useState<string>(INITIAL_VOCABULARY[0]?.id || '');

  const currentCard = vocabulary.find((w) => w.id === selectedWordId) || vocabulary[0];

  const handleSelectWord = (id: string) => {
    setSelectedWordId(id);
    const card = vocabulary.find((w) => w.id === id);
    if (card && onWordChange) {
      onWordChange(card.word);
    }
  };

  const handleUpdateCard = (updated: CardViewModel) => {
    setVocabulary((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    if (onWordChange) {
      onWordChange(updated.word);
    }
  };

  const handleStatusTransition = (newStatus: VocabStatus, reason: string) => {
    if (!currentCard) return;

    const auditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: `TRANSITION_TO_${newStatus.toUpperCase()}`,
      changedBy: 'Admin Lead',
      reason,
      previousStatus: currentCard.status,
      nextStatus: newStatus,
    };

    const updatedCard: CardViewModel = {
      ...currentCard,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
      auditHistory: [auditEntry, ...(currentCard.auditHistory || [])],
    };

    handleUpdateCard(updatedCard);
  };

  const handleAddNewWord = () => {
    const newId = `vocab-${Date.now().toString().slice(-4)}`;
    const newCard: CardViewModel = {
      id: newId,
      word: 'new word',
      phonetic: '/.../',
      partOfSpeech: 'noun',
      cefr: 'A2',
      status: 'draft',
      source: 'DICT',
      topicName: 'General Vocabulary',
      lastUpdated: new Date().toISOString(),
      audio: {
        sourceType: 'tts',
        voice: 'en-US',
        speed: 1.0,
        pitch: 1.0,
      },
      meanings: [
        {
          id: `m-${Date.now()}`,
          partOfSpeech: 'noun',
          definitionVi: 'Nhập nghĩa tiếng Việt tại đây...',
          examples: [
            {
              id: `ex-${Date.now()}`,
              en: 'This is an example sentence.',
              vi: 'Đây là câu ví dụ.',
            },
          ],
        },
      ],
      tags: ['new-entry'],
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'CREATE_DRAFT',
          changedBy: 'Admin Lead',
          reason: 'Tạo bản nháp từ mới qua Split-Screen Content Studio',
          nextStatus: 'draft',
        },
      ],
    };

    setVocabulary([newCard, ...vocabulary]);
    setSelectedWordId(newId);
    if (onWordChange) {
      onWordChange(newCard.word);
    }
  };

  if (!currentCard) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm">
        Chưa có từ vựng nào trong kho dữ liệu.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Column 1: Word List (Search, CEFR & Status Filter) */}
      <div className="w-72 shrink-0 h-full overflow-hidden">
        <WordList
          words={vocabulary}
          selectedId={selectedWordId}
          onSelectWord={handleSelectWord}
          onAddNewWord={handleAddNewWord}
        />
      </div>

      {/* Column 2: Word Editor (Form, Audio Tester, State Transitions & Audit) */}
      <div className="flex-1 min-w-[460px] h-full overflow-hidden">
        <WordEditor
          card={currentCard}
          onUpdateCard={handleUpdateCard}
          onStatusTransition={handleStatusTransition}
        />
      </div>

      {/* Column 3: Live Mobile Simulator (Faithful Flashcard View Model) */}
      <div className="w-[380px] shrink-0 h-full overflow-hidden">
        <MobileSimulator card={currentCard} />
      </div>
    </div>
  );
};
