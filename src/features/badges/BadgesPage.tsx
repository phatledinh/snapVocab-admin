import React, { useState, useMemo } from 'react';
import {
  Badge,
  HonoraryTitle,
  LearnerBadgeRecord,
  BadgesTabNavId,
} from '../../domains/badges/types';
import {
  INITIAL_BADGES,
  INITIAL_TITLES,
  INITIAL_LEARNER_RECORDS,
} from '../../domains/badges/mock-data';
import { computeBadgesRibbonMetrics } from '../../domains/badges/selectors';
import { BadgesMetricsRibbon } from './components/BadgesMetricsRibbon';
import { BadgesTabNav } from './components/BadgesTabNav';
import { BadgeCatalogTab } from './components/BadgeCatalogTab';
import { TitlesFlairTab } from './components/TitlesFlairTab';
import { TriggerRulesTab } from './components/TriggerRulesTab';
import { LearnerGrantsTab } from './components/LearnerGrantsTab';
import { BadgeFormModal } from './components/BadgeFormModal';
import { TitleFormModal } from './components/TitleFormModal';
import { BadgeInspectorDrawer } from './components/BadgeInspectorDrawer';
import { ManualGrantModal } from './components/ManualGrantModal';
import { AuditReasonModal } from './components/AuditReasonModal';
import {
  Award,
  RotateCw,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react';

interface BadgesPageProps {
  onNavigate?: (navId: string) => void;
  onWordChange?: (wordName: string) => void;
}

export const BadgesPage: React.FC<BadgesPageProps> = ({
  onNavigate,
  onWordChange,
}) => {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<BadgesTabNavId>('badge-catalog');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Vừa cập nhật (thời gian thực)');

  // Domain Data States
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [titles, setTitles] = useState<HonoraryTitle[]>(INITIAL_TITLES);
  const [records, setRecords] = useState<LearnerBadgeRecord[]>(INITIAL_LEARNER_RECORDS);

  // Modals & Drawer state
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState<HonoraryTitle | null>(null);

  const [isManualGrantOpen, setIsManualGrantOpen] = useState(false);

  const [inspectingBadge, setInspectingBadge] = useState<Badge | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Audit Reason Modal state
  const [auditConfig, setAuditConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isDangerous: boolean;
    actionLabel: string;
    onConfirmCallback?: (reason: string) => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    isDangerous: false,
    actionLabel: 'Xác Nhận',
  });

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute Ribbon Metrics
  const ribbonMetrics = useMemo(() => {
    return computeBadgesRibbonMetrics(badges, titles, records);
  }, [badges, titles, records]);

  // Sync / Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
      showToast('Đã đồng bộ dữ liệu Gamification & Achievements mới nhất!');
    }, 450);
  };

  // Save / Update Badge
  const handleSaveBadge = (badgeData: Partial<Badge>) => {
    if (editingBadge) {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === editingBadge.id
            ? ({
                ...b,
                ...badgeData,
                lastUpdated: 'Vừa xong',
                updatedBy: 'Lead Admin Hoà',
              } as Badge)
            : b
        )
      );
      showToast(`Đã cập nhật huy hiệu ${editingBadge.code}!`);
    } else {
      const newBadge: Badge = {
        id: `bdg-${Date.now()}`,
        code: badgeData.code || `BDG-${Math.floor(10 + Math.random() * 90)}`,
        name: badgeData.name || 'Huy hiệu mới',
        description: badgeData.description || '',
        category: badgeData.category || 'streak',
        tier: badgeData.tier || 'bronze',
        icon: badgeData.icon || '🔥',
        unlockMetric: badgeData.unlockMetric || 'STREAK_DAYS',
        targetValue: badgeData.targetValue || 7,
        targetUnit: badgeData.targetUnit || 'ngày liên tục',
        reward: badgeData.reward || { xp: 100, coins: 150 },
        status: badgeData.status || 'active',
        isSecret: badgeData.isSecret || false,
        secretHint: badgeData.secretHint,
        totalEarners: 0,
        unlockRate: 0,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: 'Vừa tạo',
        updatedBy: 'Lead Admin Hoà',
      };
      setBadges((prev) => [newBadge, ...prev]);
      showToast(`Đã thêm huy hiệu ${newBadge.code} vào hệ thống!`);
    }

    setIsBadgeModalOpen(false);
    setEditingBadge(null);
  };

  // Save / Update Title
  const handleSaveTitle = (titleData: Partial<HonoraryTitle>) => {
    if (editingTitle) {
      setTitles((prev) =>
        prev.map((t) =>
          t.id === editingTitle.id ? ({ ...t, ...titleData } as HonoraryTitle) : t
        )
      );
      showToast(`Đã cập nhật danh hiệu ${editingTitle.name}!`);
    } else {
      const newTitle: HonoraryTitle = {
        id: `ttl-${Date.now()}`,
        code: titleData.code || `TTL-${Math.floor(10 + Math.random() * 90)}`,
        name: titleData.name || '[Tân Binh]',
        description: titleData.description || '',
        rarity: titleData.rarity || 'gold',
        flairTheme: titleData.flairTheme || 'fire',
        requiredBadgeId: titleData.requiredBadgeId,
        requiredBadgeName: titleData.requiredBadgeName,
        totalEquipped: 0,
        equipRate: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setTitles((prev) => [newTitle, ...prev]);
      showToast(`Đã thêm danh hiệu ${newTitle.name} thành công!`);
    }

    setIsTitleModalOpen(false);
    setEditingTitle(null);
  };

  // Toggle Active / Draft for Badge
  const handleToggleBadgeStatus = (b: Badge) => {
    const nextStatus = b.status === 'active' ? 'draft' : 'active';
    setBadges((prev) =>
      prev.map((item) => (item.id === b.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`Huy hiệu ${b.code} đã chuyển sang trạng thái "${nextStatus}".`);
  };

  // Duplicate Badge
  const handleDuplicateBadge = (b: Badge) => {
    const duplicated: Badge = {
      ...b,
      id: `bdg-copy-${Date.now()}`,
      code: `${b.code}-COPY`,
      name: `${b.name} (Bản sao)`,
      status: 'draft',
      totalEarners: 0,
      unlockRate: 0,
      lastUpdated: 'Vừa xong',
      updatedBy: 'Lead Admin Hoà',
    };
    setBadges((prev) => [duplicated, ...prev]);
    showToast(`Đã nhân bản huy hiệu ${b.code} thành bản nháp!`);
  };

  // Archive Badge with mandatory Audit reason if currently active
  const handleArchiveBadge = (b: Badge) => {
    if (b.status === 'active') {
      setAuditConfig({
        isOpen: true,
        title: `Lưu Trữ Huy Hiệu Đang Phát Động: ${b.code}`,
        description: `Huy hiệu "${b.name}" hiện đang phát động cho người học. Việc lưu trữ sẽ ẩn huy hiệu khỏi danh mục của ứng dụng di động.`,
        actionLabel: 'Xác Nhận Lưu Trữ',
        isDangerous: true,
        onConfirmCallback: (reason) => {
          setBadges((prev) =>
            prev.map((item) =>
              item.id === b.id
                ? {
                    ...item,
                    status: 'archived',
                    auditNotes: `Lưu trữ: ${reason}`,
                    lastUpdated: 'Vừa xong',
                  }
                : item
            )
          );
          setAuditConfig((prev) => ({ ...prev, isOpen: false }));
          showToast(`Đã lưu trữ huy hiệu ${b.code}.`);
        },
      });
    } else {
      setBadges((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, status: 'archived' } : item))
      );
      showToast(`Đã lưu trữ huy hiệu ${b.code}.`);
    }
  };

  // Archive Title
  const handleArchiveTitle = (t: HonoraryTitle) => {
    setTitles((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, status: 'archived' } : item))
    );
    showToast(`Đã lưu trữ danh hiệu ${t.name}.`);
  };

  // Manual Grant
  const handleManualGrantConfirm = (record: LearnerBadgeRecord, reason: string) => {
    setRecords((prev) => [record, ...prev]);
    // increment badge earners
    setBadges((prev) =>
      prev.map((b) =>
        b.id === record.badgeId
          ? {
              ...b,
              totalEarners: b.totalEarners + 1,
              auditNotes: `Cấp phát thủ công cho ${record.learnerName}: ${reason}`,
            }
          : b
      )
    );
    showToast(`Đã cấp phát huy hiệu ${record.badgeName} cho học viên ${record.learnerName}!`);
  };

  // Revoke Record with mandatory audit reason
  const handleRevokeRecord = (record: LearnerBadgeRecord) => {
    setAuditConfig({
      isOpen: true,
      title: `Thu Hồi Huy Hiệu: ${record.badgeName}`,
      description: `Bạn đang tiến hành thu hồi huy hiệu của học viên "${record.learnerName}" (${record.email}). Hành động này sẽ được ghi nhận vào nhật ký kiểm toán Anti-Cheat.`,
      actionLabel: 'Xác Nhận Thu Hồi',
      isDangerous: true,
      onConfirmCallback: (reason) => {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === record.id
              ? {
                  ...r,
                  status: 'revoked',
                  revokedReason: reason,
                }
              : r
          )
        );
        setAuditConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Đã thu hồi huy hiệu từ học viên ${record.learnerName}!`);
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-4 sm:p-6 space-y-4 select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-text text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <span>LiveOps Console</span>
            <span>/</span>
            <span className="text-text font-medium">Badges & Titles Engine</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-text tracking-tight">
              Quản Lý Huy Hiệu & Danh Hiệu Hồ Sơ
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-snapy-light text-snapy border border-snapy/20 font-mono">
              v2.4 LiveOps
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-[11px] text-text-muted hidden md:block">
            {lastUpdated}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-muted hover:text-text transition-colors shadow-xs"
            title="Đồng bộ dữ liệu"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingBadge(null);
              setIsBadgeModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus size={14} />
            <span>Tạo Huy Hiệu Mới</span>
          </button>
        </div>
      </div>

      {/* Top Ribbon Metrics */}
      <BadgesMetricsRibbon metrics={ribbonMetrics} />

      {/* Tab Navigation */}
      <BadgesTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badgeCount={badges.length}
        titlesCount={titles.length}
        recordsCount={records.length}
      />

      {/* Main Tab Content */}
      <div className="flex-1 min-h-[480px]">
        {activeTab === 'badge-catalog' && (
          <BadgeCatalogTab
            badges={badges}
            titles={titles}
            onAddBadge={() => {
              setEditingBadge(null);
              setIsBadgeModalOpen(true);
            }}
            onEditBadge={(b) => {
              setEditingBadge(b);
              setIsBadgeModalOpen(true);
            }}
            onInspectBadge={(b) => {
              setInspectingBadge(b);
              setIsInspectorOpen(true);
            }}
            onDuplicateBadge={handleDuplicateBadge}
            onToggleStatus={handleToggleBadgeStatus}
            onArchiveBadge={handleArchiveBadge}
          />
        )}

        {activeTab === 'titles-flair' && (
          <TitlesFlairTab
            titles={titles}
            badges={badges}
            onAddTitle={() => {
              setEditingTitle(null);
              setIsTitleModalOpen(true);
            }}
            onEditTitle={(t) => {
              setEditingTitle(t);
              setIsTitleModalOpen(true);
            }}
            onArchiveTitle={handleArchiveTitle}
          />
        )}

        {activeTab === 'trigger-rules' && (
          <TriggerRulesTab badges={badges} titles={titles} />
        )}

        {activeTab === 'learner-grants' && (
          <LearnerGrantsTab
            records={records}
            badges={badges}
            onOpenManualGrant={() => setIsManualGrantOpen(true)}
            onRevokeRecord={handleRevokeRecord}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <BadgeFormModal
        isOpen={isBadgeModalOpen}
        editingBadge={editingBadge}
        titles={titles}
        onClose={() => {
          setIsBadgeModalOpen(false);
          setEditingBadge(null);
        }}
        onSave={handleSaveBadge}
      />

      <TitleFormModal
        isOpen={isTitleModalOpen}
        editingTitle={editingTitle}
        badges={badges}
        onClose={() => {
          setIsTitleModalOpen(false);
          setEditingTitle(null);
        }}
        onSave={handleSaveTitle}
      />

      <ManualGrantModal
        isOpen={isManualGrantOpen}
        badges={badges}
        onClose={() => setIsManualGrantOpen(false)}
        onGrant={handleManualGrantConfirm}
      />

      <BadgeInspectorDrawer
        badge={inspectingBadge}
        isOpen={isInspectorOpen}
        onClose={() => {
          setIsInspectorOpen(false);
          setInspectingBadge(null);
        }}
        onEdit={(b) => {
          setIsInspectorOpen(false);
          setEditingBadge(b);
          setIsBadgeModalOpen(true);
        }}
        onDuplicate={(b) => {
          setIsInspectorOpen(false);
          handleDuplicateBadge(b);
        }}
        onToggleStatus={(b) => {
          handleToggleBadgeStatus(b);
          setInspectingBadge((prev) =>
            prev ? { ...prev, status: prev.status === 'active' ? 'draft' : 'active' } : null
          );
        }}
        onArchive={(b) => {
          setIsInspectorOpen(false);
          handleArchiveBadge(b);
        }}
      />

      <AuditReasonModal
        isOpen={auditConfig.isOpen}
        title={auditConfig.title}
        description={auditConfig.description}
        actionLabel={auditConfig.actionLabel}
        isDangerous={auditConfig.isDangerous}
        onClose={() => setAuditConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={(reason) => {
          if (auditConfig.onConfirmCallback) {
            auditConfig.onConfirmCallback(reason);
          }
        }}
      />
    </div>
  );
};
