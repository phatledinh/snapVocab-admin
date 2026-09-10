export type AIConfidenceLevel = 'high' | 'medium' | 'low';

export type AIScanQueueStatus = 'pending' | 'reviewed' | 'corrected' | 'rejected';

export type AIScanPriority = 'P1' | 'P2'; // P1: User reported issue, P2: Low confidence auto-flag

export interface AIScanQueueItem {
  id: string;
  thumbnailUrl: string;
  capturedAt: string;
  predictedLabel: string;
  confidence: number; // 0.0 to 1.0
  confidenceLevel: AIConfidenceLevel;
  status: AIScanQueueStatus;
  priority: AIScanPriority;
  suggestedCefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  learnerNote?: string;
  assignedOperator?: string;
  reviewedAt?: string;
  correctedWord?: string;
}

export interface AIScanEngineHealth {
  todayScansCount: number;
  avgLatencyMs: number;
  confidenceRate: number; // e.g. 94.2%
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
  pendingQueueCount: number; // 18 items
  urgentReportCount: number; // 3 items
}
