// ====================================================
// SNAPVOCAB ISSUE REPORTS DOMAIN TYPES
// Source of Truth: docs/design/design.md & docs/spec/
// ====================================================

import { CEFRLevel } from '../flashcard/types';

export type IssueCategory =
  | 'AI_SCAN'
  | 'VOCABULARY'
  | 'LIVEOPS_ACCOUNT'
  | 'TECHNICAL_APP';

export type IssueSubCategory =
  // AI Scan
  | 'MISIDENTIFIED_OBJECT'
  | 'LOW_CONFIDENCE_ERROR'
  | 'MISSING_DICTIONARY_WORD'
  | 'BACKGROUND_CLUTTER'
  // Vocabulary
  | 'WRONG_MEANING'
  | 'WRONG_IPA'
  | 'AUDIO_PRONUNCIATION_GLITCH'
  | 'INCORRECT_EXAMPLE'
  | 'SPELLING_TYPO'
  | 'MISSING_WORD_ENTRY'
  // LiveOps & Account
  | 'STREAK_UNJUSTLY_LOST'
  | 'REWARD_NOT_CREDITED'
  | 'PURCHASE_DOUBLE_CHARGED'
  | 'QUEST_DESYNC'
  // Technical
  | 'APP_CRASH_SRS'
  | 'CAMERA_PERMISSION_DENIED'
  | 'OFFLINE_SYNC_FAIL';

export type IssuePriority = 'P1' | 'P2' | 'P3';

export type IssueStatus =
  | 'PENDING'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'DISMISSED';

export type IssueResolutionAction =
  | 'LABEL_CORRECTED_AND_DATASET_SAVED'
  | 'VOCABULARY_UPDATED_INLINE'
  | 'OPENED_IN_CONTENT_STUDIO'
  | 'STREAK_RESTORED'
  | 'COMPENSATION_GRANTED'
  | 'DISMISSED_INVALID';

export type IssueTabNavId =
  | 'master-queue'
  | 'ai-scan'
  | 'dictionary'
  | 'resolution-ledger';

export interface ReporterLearnerInfo {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  cefrLevel: CEFRLevel;
  streakDays: number;
  league?: string;
  coins?: number;
}

export interface ReporterDeviceInfo {
  platform: 'ios' | 'android';
  deviceModel: string;
  appVersion: string;
  osVersion: string;
  locale: string;
}

export interface ScanEvidenceData {
  scanId: string;
  requestId?: string;
  thumbnailUrl: string;
  originalImageUrl: string;
  cropUrl?: string;
  predictedLabel: string;
  suggestedLabel: string;
  confidence: number;
  clipScore?: number;
  boundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  pushedToFineTuning?: boolean;
}

export interface VocabEvidenceData {
  wordId?: string;
  targetWord: string;
  currentMeaningVi: string;
  suggestedMeaningVi?: string;
  currentIpa: string;
  suggestedIpa?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  currentExampleEn?: string;
  currentExampleVi?: string;
  suggestedExampleVi?: string;
}

export interface IssueResolutionRecord {
  resolvedAt: string;
  resolvedBy: string;
  actionTaken: IssueResolutionAction;
  resolutionNotes: string;
  compensationCoins?: number;
  compensationGems?: number;
  pushNotificationSent: boolean;
  notificationTitle?: string;
  notificationBody?: string;
}

export interface IssueReportItem {
  id: string;
  ticketId: string;
  category: IssueCategory;
  subCategory: IssueSubCategory;
  priority: IssuePriority;
  status: IssueStatus;
  reportedAt: string;
  slaDeadline: string; // ISO String deadline
  slaRemainingMinutes: number; // dynamically computed or base
  title: string;
  description: string;
  learner: ReporterLearnerInfo;
  deviceInfo: ReporterDeviceInfo;
  targetWord?: string;
  suggestedWord?: string;
  targetCefr?: CEFRLevel;
  scanData?: ScanEvidenceData;
  vocabData?: VocabEvidenceData;
  resolution?: IssueResolutionRecord;
}

export interface IssueFilterState {
  searchQuery: string;
  category: IssueCategory | 'ALL';
  priority: IssuePriority | 'ALL';
  status: IssueStatus | 'ALL';
  platform: 'ios' | 'android' | 'ALL';
  sortBy: 'reportedAt' | 'priority' | 'slaDeadline';
  sortDirection: 'asc' | 'desc';
}

export interface IssueRibbonMetrics {
  totalPendingIssues: number;
  urgentP1Count: number;
  resolvedTodayCount: number;
  avgResolutionTimeMinutes: number;
  activeLearningFineTunedCount: number;
  dictionaryFixesCount: number;
  slaComplianceRate: number; // e.g. 96.2%
}
