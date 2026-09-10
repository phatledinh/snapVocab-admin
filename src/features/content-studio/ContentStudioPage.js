import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { WordList } from './WordList';
import { WordEditor } from './WordEditor';
import { MobileSimulator } from '../../components/preview/MobileSimulator';
import { INITIAL_VOCABULARY } from '../../domains/vocabulary/mock-data';
export const ContentStudioPage = ({ onWordChange }) => {
    const [vocabulary, setVocabulary] = useState(INITIAL_VOCABULARY);
    const [selectedWordId, setSelectedWordId] = useState(INITIAL_VOCABULARY[0]?.id || '');
    const currentCard = vocabulary.find((w) => w.id === selectedWordId) || vocabulary[0];
    const handleSelectWord = (id) => {
        setSelectedWordId(id);
        const card = vocabulary.find((w) => w.id === id);
        if (card && onWordChange) {
            onWordChange(card.word);
        }
    };
    const handleUpdateCard = (updated) => {
        setVocabulary((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        if (onWordChange) {
            onWordChange(updated.word);
        }
    };
    const handleStatusTransition = (newStatus, reason) => {
        if (!currentCard)
            return;
        const auditEntry = {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: `TRANSITION_TO_${newStatus.toUpperCase()}`,
            changedBy: 'Admin Lead',
            reason,
            previousStatus: currentCard.status,
            nextStatus: newStatus,
        };
        const updatedCard = {
            ...currentCard,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
            auditHistory: [auditEntry, ...(currentCard.auditHistory || [])],
        };
        handleUpdateCard(updatedCard);
    };
    const handleAddNewWord = () => {
        const newId = `vocab-${Date.now().toString().slice(-4)}`;
        const newCard = {
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
        return (_jsx("div", { className: "h-full flex items-center justify-center text-text-muted text-sm", children: "Ch\u01B0a c\u00F3 t\u1EEB v\u1EF1ng n\u00E0o trong kho d\u1EEF li\u1EC7u." }));
    }
    return (_jsxs("div", { className: "h-full w-full flex overflow-hidden", children: [_jsx("div", { className: "w-72 shrink-0 h-full overflow-hidden", children: _jsx(WordList, { words: vocabulary, selectedId: selectedWordId, onSelectWord: handleSelectWord, onAddNewWord: handleAddNewWord }) }), _jsx("div", { className: "flex-1 min-w-[460px] h-full overflow-hidden", children: _jsx(WordEditor, { card: currentCard, onUpdateCard: handleUpdateCard, onStatusTransition: handleStatusTransition }) }), _jsx("div", { className: "w-[380px] shrink-0 h-full overflow-hidden", children: _jsx(MobileSimulator, { card: currentCard }) })] }));
};
