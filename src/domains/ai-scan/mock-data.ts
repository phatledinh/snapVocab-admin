import { AIScanQueueItem, AIScanEngineHealth } from './types';

export const MOCK_AI_SCAN_HEALTH: AIScanEngineHealth = {
  todayScansCount: 12450,
  avgLatencyMs: 420,
  confidenceRate: 94.2,
  highConfidenceCount: 11728,
  mediumConfidenceCount: 542,
  lowConfidenceCount: 180,
  pendingQueueCount: 18,
  urgentReportCount: 3,
};

export const MOCK_AI_SCAN_QUEUE: AIScanQueueItem[] = [
  {
    id: 'scan-q-01',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=60',
    capturedAt: '2026-09-10T09:12:00Z',
    predictedLabel: 'coffee cup',
    confidence: 0.58,
    confidenceLevel: 'low',
    status: 'pending',
    priority: 'P1',
    suggestedCefr: 'A1',
    learnerNote: 'Người học báo cáo: Tôi chụp cốc giữ nhiệt (thermos) nhưng AI lại nhận diện là coffee cup thông thường.',
  },
  {
    id: 'scan-q-02',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=60',
    capturedAt: '2026-09-10T08:50:00Z',
    predictedLabel: 'textbook',
    confidence: 0.62,
    confidenceLevel: 'low',
    status: 'pending',
    priority: 'P1',
    suggestedCefr: 'B1',
    learnerNote: 'Người học báo cáo: Sách bài tập ngữ pháp (notebook / workbook), AI nhận diện nhầm thành textbook.',
  },
  {
    id: 'scan-q-03',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=200&auto=format&fit=crop&q=60',
    capturedAt: '2026-09-10T08:35:00Z',
    predictedLabel: 'sunglasses',
    confidence: 0.54,
    confidenceLevel: 'low',
    status: 'pending',
    priority: 'P1',
    suggestedCefr: 'A2',
    learnerNote: 'Người học báo cáo: Kính cận thường (reading glasses), không phải kính râm (sunglasses).',
  },
  // 15 remaining P2 items in queue to make total 18
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `scan-q-${i + 4}`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=60',
    capturedAt: `2026-09-10T0${8 - Math.floor(i / 3)}:${(50 - (i % 3) * 15).toString().padStart(2, '0')}:00Z`,
    predictedLabel: `object_${i + 1}`,
    confidence: +(0.65 + (i % 5) * 0.04).toFixed(2),
    confidenceLevel: (0.65 + (i % 5) * 0.04 < 0.70 ? 'low' : 'medium') as 'low' | 'medium',
    status: 'pending' as const,
    priority: 'P2' as const,
    suggestedCefr: (['A1', 'A2', 'B1', 'B2'][i % 4] as 'A1' | 'A2' | 'B1' | 'B2'),
    learnerNote: 'Tự động đưa vào hàng đợi do độ tin cậy AI < 75%',
  })),
];
