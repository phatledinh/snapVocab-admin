export type AIConfidenceLevel = 'high' | 'medium' | 'low';

export type AIScanQueueStatus = 'pending' | 'reviewed' | 'corrected' | 'rejected';

export type AIScanPriority = 'P1' | 'P2'; // P1: User reported issue, P2: Low confidence auto-flag

export type DetectionSource = 'OD' | 'DenseRegion' | 'TiledOD' | 'SelfGrounding';

export type ScanRequestStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED' | 'TIMEOUT' | 'QUOTA_EXCEEDED';

export type BoundingBox = [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000 or pixels

export type AIScanTab = 'live-monitor' | 'review-queue' | 'requests-history' | 'dataset-tuning';

export interface AIScanQueueItem {
  id: string;
  requestId?: string;
  thumbnailUrl: string;
  originalImageUrl?: string;
  samMaskUrl?: string;
  cropUrl?: string;
  capturedAt: string;
  predictedLabel: string;
  confidence: number; // 0.0 to 1.0
  confidenceLevel: AIConfidenceLevel;
  status: AIScanQueueStatus;
  priority: AIScanPriority;
  suggestedCefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  learnerNote?: string;
  learnerId?: string;
  detectionSource?: DetectionSource;
  clipScore?: number; // e.g. 0.26 vs 0.23 floor
  boundingBox?: BoundingBox;
  assignedOperator?: string;
  reviewedAt?: string;
  correctedWord?: string;
  correctedCefr?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  correctedMeaningVi?: string;
  correctionReason?: string;
}

export interface AIScanEngineHealth {
  todayScansCount: number;
  yesterdayScansCount: number;
  avgLatencyMs: number;
  p95WaitTimeMs: number;
  p95ProcessingTimeMs: number;
  confidenceRate: number; // e.g. 94.2%
  highConfidenceCount: number;
  mediumConfidenceCount: number;
  lowConfidenceCount: number;
  pendingQueueCount: number; // 18 items
  urgentReportCount: number; // 3 items (P1)
  failedJobsCount: number;
  timeoutJobsCount: number;
  r2StorageUsedGb: number;
  r2StorageTotalGb: number;
  activeWorkers: number;
  totalWorkers: number;
}

export interface GPUWorkerNode {
  id: string;
  name: string;
  gpuModel: string;
  status: 'online' | 'busy' | 'idle' | 'degraded';
  vramUsedMb: number;
  vramTotalMb: number;
  temperatureC: number;
  powerUsageWatts: number;
  activeJobId?: string;
  activeJobElapsedMs?: number;
  processedJobsToday: number;
  driverVersion: string;
  cudaVersion: string;
}

export interface OperationalConfig {
  fastModeEnabled: boolean; // Bypass Tiled OD and SAM, latency < 10s
  dailyQuotaPerLearner: number; // Default 20
  maxQueueDepthPerWorker: number; // Default 10
  clipScoreFloor: number; // Default 0.23
  workerTimeoutSeconds: number; // Default 60s
  autoArchiveTrashScans: boolean;
}

export interface AIScanRequest {
  id: string;
  learnerId: string;
  learnerName: string;
  imageUrl: string;
  cropUrl?: string;
  status: ScanRequestStatus;
  predictedLabel: string;
  confidence: number;
  clipScore: number;
  detectionSource: DetectionSource;
  boundingBox: BoundingBox;
  processingTimeMs: number;
  queueWaitTimeMs: number;
  r2StorageKey: string;
  createdAt: string;
  errorReason?: string;
  correctedLabel?: string;
  priority: 'normal' | 'P1' | 'P2';
}

export interface FineTuneSample {
  id: string;
  scanRequestId: string;
  imageUrl: string;
  originalLabel: string;
  verifiedLabel: string;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  boundingBox: BoundingBox;
  operator: string;
  verifiedAt: string;
  status: 'ready' | 'exported' | 'training';
}

export interface ConfusionPair {
  aiLabel: string;
  actualLabel: string;
  occurrences: number;
  sampleThumbnail: string;
  resolution: string;
}

export interface ReviewQueueFilter {
  priority: 'all' | 'P1' | 'P2';
  status: 'all' | 'pending' | 'corrected' | 'rejected';
  search: string;
}

export interface ScanHistoryFilter {
  status: 'all' | ScanRequestStatus;
  confidenceLevel: 'all' | AIConfidenceLevel;
  search: string;
  dateRange: 'today' | '7d' | '30d';
}
