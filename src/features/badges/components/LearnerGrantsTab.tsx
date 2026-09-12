import React, { useState } from 'react';
import { LearnerBadgeRecord, Badge } from '../../../domains/badges/types';
import {
  ShieldCheck,
  Search,
  Plus,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Award,
  Key,
} from 'lucide-react';

interface LearnerGrantsTabProps {
  records: LearnerBadgeRecord[];
  badges: Badge[];
  onOpenManualGrant: () => void;
  onRevokeRecord: (record: LearnerBadgeRecord) => void;
}

export const LearnerGrantsTab: React.FC<LearnerGrantsTabProps> = ({
  records,
  badges,
  onOpenManualGrant,
  onRevokeRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'valid' | 'revoked'>('ALL');

  const filteredRecords = records.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.learnerName.toLowerCase().includes(q);
      const matchBadge = r.badgeName.toLowerCase().includes(q);
      const matchKey = r.idempotencyKey.toLowerCase().includes(q);
      if (!matchName && !matchBadge && !matchKey) return false;
    }
    if (statusFilter !== 'ALL' && r.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner & Action */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">
              Nhật Ký Cấp Phát, Mở Khóa & Audit Trail
            </h3>
            <p className="text-xs text-text-muted">
              Tra cứu lịch sử mở khóa, mã chống trùng Idempotency và xử lý cấp phát/thu hồi ngoại lệ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo học viên, huy hiệu, event key..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-border bg-surface-subtle text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs p-1.5 rounded-lg border border-border bg-surface text-text font-medium"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="valid">Hợp lệ (Valid)</option>
            <option value="revoked">Đã thu hồi (Revoked)</option>
          </select>

          <button
            type="button"
            onClick={onOpenManualGrant}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Plus size={14} />
            <span>Cấp Phát Thủ Công</span>
          </button>
        </div>
      </div>

      {/* Anomaly Guardrail Banner */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <span>
            <strong>Anti-Abuse Velocity Guardrail:</strong> Hệ thống tự động chặn và gắn cờ cảnh báo đối với tài khoản mở khóa $\ge 5$ huy hiệu cao cấp trong vòng dưới 1 giờ.
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono">
          Guardrail Active
        </span>
      </div>

      {/* Records Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle/80 border-b border-border text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-3">Học Viên</th>
                <th className="p-3">Huy Hiệu Nhận Được</th>
                <th className="p-3">Thời Gian Đạt</th>
                <th className="p-3">Idempotency Event Key</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted text-xs">
                    Không tìm thấy bản ghi cấp phát nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-surface-subtle/70 transition-colors"
                  >
                    {/* Learner */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.avatar}
                          alt={r.learnerName}
                          className="w-8 h-8 rounded-full border border-border object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-text text-xs">
                            {r.learnerName}
                          </div>
                          <div className="text-[10px] text-text-muted font-mono">
                            {r.learnerId} · {r.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{r.badgeIcon}</span>
                        <div>
                          <span className="font-bold text-text block text-xs">
                            {r.badgeName}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            {r.badgeCode} ({r.badgeTier})
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Earned At */}
                    <td className="p-3">
                      <span className="text-text font-medium">{r.earnedAt}</span>
                    </td>

                    {/* Idempotency Key */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 font-mono text-[10px] text-text-muted bg-surface-subtle px-2 py-1 rounded border border-border/60 max-w-xs truncate">
                        <Key size={11} className="shrink-0 text-text-muted" />
                        <span className="truncate">{r.idempotencyKey}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {r.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} />
                          <span>Hợp Lệ</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
                          title={r.revokedReason}
                        >
                          <XCircle size={11} />
                          <span>Đã Thu Hồi</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-right">
                      {r.status === 'valid' && (
                        <button
                          type="button"
                          onClick={() => onRevokeRecord(r)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-danger/30 text-danger hover:bg-danger-light transition-colors"
                        >
                          Thu Hồi (Revoke)
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
