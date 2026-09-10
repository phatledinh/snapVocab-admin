import { CEFRLevel, VocabStatus, CardSource } from '../flashcard/types';

export type CardTemplateType = 
  | 'CLASSIC' 
  | 'MINIMAL' 
  | 'LISTENING' 
  | 'VISUAL_IMAGE' 
  | 'CLOZE_TYPING';

export interface Collection {
  id: string;
  name: string;
  nameVi: string;
  slug: string;
  description: string;
  icon: string;
  topicCount: number;
  totalWords: number;
  status: 'draft' | 'published' | 'archived';
  orderIndex: number;
  updatedAt: string;
}

export interface Topic {
  id: string;
  collectionId: string;
  collectionName: string;
  parentId?: string; // For hierarchical parent/child topics
  name: string;
  nameVi: string;
  slug: string;
  description: string;
  targetCefr: CEFRLevel;
  icon: string;
  wordCount: number;
  activeLearnersCount: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  orderIndex: number;
  children?: Topic[];
}

export interface TopicItem {
  id: string;
  topicId: string;
  topicName?: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  cefr: CEFRLevel;
  definitionVi: string;
  definitionEn?: string;
  exampleEn: string;
  exampleVi: string;
  audioUrl?: string;
  imageUrl?: string;
  status: VocabStatus;
  source: CardSource;
  tags: string[];
  addedAt: string;
  orderIndex: number;
}

export interface SystemDeck {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  icon: string;
  templateId: CardTemplateType;
  templateName: string;
  targetCefr: CEFRLevel;
  sourceCollectionId?: string;
  sourceCollectionName?: string;
  sourceTopicId?: string;
  sourceTopicName?: string;
  noteCount: number;
  activeLearners: number;
  completionRate: number; // percentage, e.g. 78.4
  isRecommended: boolean;
  isSystemDefault: boolean;
  status: 'published' | 'draft' | 'archived';
  lastUpdated: string;
}

export interface DeckNote {
  id: string;
  deckId: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  cefr: CEFRLevel;
  definitionVi: string;
  exampleEn: string;
  srsState: 'new' | 'learning' | 'review' | 'mastered';
  stability: number; // in days
  dueInDays: number;
}

export type TopicsTab = 'collections-topics' | 'system-decks' | 'batch-operations';

export interface TopicFilterState {
  collectionId: string; // 'all' or specific collection id
  searchQuery: string;
  cefrLevel: 'all' | CEFRLevel;
  status: 'all' | VocabStatus;
  partOfSpeech: 'all' | string;
}

export interface DeckFilterState {
  searchQuery: string;
  templateId: 'all' | CardTemplateType;
  targetCefr: 'all' | CEFRLevel;
  status: 'all' | 'published' | 'draft' | 'archived';
}

export interface BatchImportRow {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  cefr: CEFRLevel;
  definitionVi: string;
  exampleEn: string;
  exampleVi: string;
  status: 'valid' | 'duplicate' | 'invalid';
  validationMessage?: string;
}

export interface TopicMetricsSummary {
  totalCollections: number;
  activeCollections: number;
  totalTopics: number;
  totalSubtopics: number;
  totalCuratedWords: number;
  publishedWords: number;
  totalSystemDecks: number;
  activeLearnersOnDecks: number;
  audioVisualCoveragePercent: number;
}
