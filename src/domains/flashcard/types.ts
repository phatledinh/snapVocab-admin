export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type VocabStatus = 'draft' | 'review' | 'published' | 'archived';

export type CardSource = 'DICT' | 'SCAN' | 'TOPIC' | 'AI';

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: string;
  changedBy: string;
  reason: string;
  previousStatus?: VocabStatus;
  nextStatus?: VocabStatus;
}

export interface CardExample {
  id: string;
  en: string;
  vi: string;
}

export interface CardMeaning {
  id: string;
  partOfSpeech: string; // noun, verb, adjective, adverb, etc.
  definitionVi: string;
  definitionEn?: string;
  examples: CardExample[];
}

export interface CardAudioConfig {
  sourceType: 'tts' | 'custom';
  url?: string;
  voice: 'en-US' | 'en-GB';
  speed: number;
  pitch: number;
}

export interface CardMediaConfig {
  imageUrl?: string;
  thumbnailUrl?: string;
  objectBoundingBox?: [number, number, number, number];
  aiConfidence?: number;
}

export interface CardViewModel {
  id: string;
  word: string;
  phonetic: string; // e.g. /ˈæp.əl/
  partOfSpeech: string; // primary part of speech
  meanings: CardMeaning[];
  audio: CardAudioConfig;
  media?: CardMediaConfig;
  cefr: CEFRLevel;
  tags: string[];
  status: VocabStatus;
  source: CardSource;
  topicId?: string;
  topicName?: string;
  lastUpdated: string;
  auditHistory: AuditRecord[];
}
