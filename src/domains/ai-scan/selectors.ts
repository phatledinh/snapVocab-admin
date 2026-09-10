import {
  AIScanQueueItem,
  AIScanEngineHealth,
  AIScanRequest,
  ReviewQueueFilter,
  ScanHistoryFilter,
  AIConfidenceLevel,
} from './types';

export interface AIScanRibbonMetric {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  changeText: string;
  isPositive: boolean;
  statusColor: 'emerald' | 'amber' | 'rose' | 'orange' | 'blue';
  iconType: 'scan' | 'latency' | 'accuracy' | 'gpu' | 'storage' | 'queue';
}

export function computeAIScanRibbonMetrics(
  health: AIScanEngineHealth,
  queueItems: AIScanQueueItem[]
): AIScanRibbonMetric[] {
  const pendingP1 = queueItems.filter((q) => q.status === 'pending' && q.priority === 'P1').length;
  const pendingP2 = queueItems.filter((q) => q.status === 'pending' && q.priority === 'P2').length;
  const growth = Math.round(
    ((health.todayScansCount - health.yesterdayScansCount) / health.yesterdayScansCount) * 100
  );

  return [
    {
      id: 'scans-today',
      label: 'Lượt Scan Hôm Nay',
      value: health.todayScansCount.toLocaleString('vi-VN'),
      subValue: `Hôm qua: ${health.yesterdayScansCount.toLocaleString('vi-VN')}`,
      changeText: `+${growth}% so với hôm qua`,
      isPositive: true,
      statusColor: 'emerald',
      iconType: 'scan',
    },
    {
      id: 'latency-p95',
      label: 'Độ Trễ TB & P95',
      value: `${health.avgLatencyMs}ms`,
      subValue: `P95: ${(health.p95ProcessingTimeMs / 1000).toFixed(1)}s (Model GPU)`,
      changeText: health.avgLatencyMs < 500 ? 'Ổn định trong SLA' : 'Cần chú ý',
      isPositive: health.avgLatencyMs < 500,
      statusColor: health.avgLatencyMs < 500 ? 'emerald' : 'amber',
      iconType: 'latency',
    },
    {
      id: 'accuracy-rate',
      label: 'Tỷ Lệ Tin Cậy AI',
      value: `${health.confidenceRate}%`,
      subValue: `${health.highConfidenceCount.toLocaleString('vi-VN')} lượt >= 90%`,
      changeText: 'Florence-2 zero-shot',
      isPositive: health.confidenceRate >= 90,
      statusColor: health.confidenceRate >= 90 ? 'emerald' : 'amber',
      iconType: 'accuracy',
    },
    {
      id: 'gpu-cluster',
      label: 'Cụm GPU Worker',
      value: `${health.activeWorkers} / ${health.totalWorkers} Nodes`,
      subValue: 'NVIDIA T4 16GB VRAM',
      changeText: '1 Worker / 1 GPU SLA',
      isPositive: true,
      statusColor: 'blue',
      iconType: 'gpu',
    },
    {
      id: 'r2-storage',
      label: 'Cloudflare R2 Storage',
      value: `${health.r2StorageUsedGb.toFixed(1)} GB`,
      subValue: `Hạn mức: ${health.r2StorageTotalGb} GB (${Math.round((health.r2StorageUsedGb / health.r2StorageTotalGb) * 100)}%)`,
      changeText: 'Ảnh binary & CROP URL',
      isPositive: health.r2StorageUsedGb < health.r2StorageTotalGb * 0.8,
      statusColor: 'blue',
      iconType: 'storage',
    },
    {
      id: 'pending-review',
      label: 'Hàng Đợi Cần Duyệt',
      value: `${pendingP1 + pendingP2} Ảnh`,
      subValue: `${pendingP1} P1 Báo lỗi · ${pendingP2} P2 Low-Conf`,
      changeText: pendingP1 > 0 ? `${pendingP1} sự cố khẩn cấp` : 'Không có sự cố P1',
      isPositive: pendingP1 === 0,
      statusColor: pendingP1 > 0 ? 'rose' : 'orange',
      iconType: 'queue',
    },
  ];
}

export function filterQueueItems(
  items: AIScanQueueItem[],
  filter: ReviewQueueFilter
): AIScanQueueItem[] {
  return items.filter((item) => {
    // Priority filter
    if (filter.priority !== 'all' && item.priority !== filter.priority) {
      return false;
    }

    // Status filter
    if (filter.status !== 'all' && item.status !== filter.status) {
      return false;
    }

    // Search query
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      const matchLabel = item.predictedLabel.toLowerCase().includes(q);
      const matchWord = item.correctedWord?.toLowerCase().includes(q);
      const matchNote = item.learnerNote?.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchReq = item.requestId?.toLowerCase().includes(q);
      if (!matchLabel && !matchWord && !matchNote && !matchId && !matchReq) {
        return false;
      }
    }

    return true;
  });
}

export function filterScanRequests(
  requests: AIScanRequest[],
  filter: ScanHistoryFilter
): AIScanRequest[] {
  return requests.filter((req) => {
    // Status filter
    if (filter.status !== 'all' && req.status !== filter.status) {
      return false;
    }

    // Confidence Level filter
    if (filter.confidenceLevel !== 'all') {
      const level: AIConfidenceLevel =
        req.confidence >= 0.9 ? 'high' : req.confidence >= 0.7 ? 'medium' : 'low';
      if (level !== filter.confidenceLevel) {
        return false;
      }
    }

    // Search query
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      const matchId = req.id.toLowerCase().includes(q);
      const matchLearner = req.learnerName.toLowerCase().includes(q) || req.learnerId.toLowerCase().includes(q);
      const matchLabel = req.predictedLabel.toLowerCase().includes(q) || (req.correctedLabel?.toLowerCase().includes(q) ?? false);
      const matchReason = req.errorReason?.toLowerCase().includes(q);
      if (!matchId && !matchLearner && !matchLabel && !matchReason) {
        return false;
      }
    }

    return true;
  });
}

export function getConfidenceBadge(confidence: number): {
  level: AIConfidenceLevel;
  text: string;
  badgeClass: string;
  dotClass: string;
} {
  if (confidence >= 0.9) {
    return {
      level: 'high',
      text: `${Math.round(confidence * 100)}% (Cao)`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500',
    };
  }
  if (confidence >= 0.7) {
    return {
      level: 'medium',
      text: `${Math.round(confidence * 100)}% (Vừa)`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
    };
  }
  return {
    level: 'low',
    text: `${Math.round(confidence * 100)}% (Thấp)`,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
  };
}
