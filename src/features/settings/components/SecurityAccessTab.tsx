import React, { useState } from 'react';
import {
  Lock,
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Smartphone,
  Eye,
} from 'lucide-react';
import {
  SecurityAccessConfig,
  AdminOperatorUser,
  AdminRole,
} from '../../../domains/settings/types';

interface SecurityAccessTabProps {
  config: SecurityAccessConfig;
  onChange: (updated: Partial<SecurityAccessConfig>) => void;
  showToast: (msg: string) => void;
}

export const SecurityAccessTab: React.FC<SecurityAccessTabProps> = ({
  config,
  onChange,
  showToast,
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  const filteredOperators = config.operators.filter((op) => {
    if (selectedRoleFilter === 'ALL') return true;
    return op.role === selectedRoleFilter;
  });

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CONTENT_LEAD':
        return 'bg-primary-light text-primary border-primary/30';
      case 'AI_OPERATOR':
        return 'bg-snapy-light text-snapy border-snapy/30';
      case 'LIVEOPS_MANAGER':
        return 'bg-reward-light text-neutral-800 border-reward/30';
      case 'SUPPORT_MODERATOR':
        return 'bg-info-light text-info border-info/30';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const handleToggle2FA = (operatorId: string) => {
    const updated = config.operators.map((op) =>
      op.id === operatorId ? { ...op, twoFactorEnabled: !op.twoFactorEnabled } : op
    );
    onChange({ operators: updated });
    showToast('Đã cập nhật trạng thái xác thực 2FA của Operator!');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 shrink-0">
            <Lock size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-text tracking-tight">
                Kiểm Soát Truy Cập & Ma Trận Phân Quyền (RBAC & Operators)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                ROLE_ADMIN Security
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Quản lý danh sách nhân sự vận hành console, bắt buộc xác thực hai bước (2FA), và bảo vệ các tác vụ can thiệp dữ liệu nhạy cảm.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-surface/90 px-3.5 py-2 rounded-xl border border-purple-200 shadow-xs text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Tổng Operators</span>
            <span className="font-bold text-text">{config.operators.length} Nhân sự</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">Tuân thủ 2FA</span>
            <span className="font-bold text-emerald-600">
              {config.operators.filter((o) => o.twoFactorEnabled).length}/{config.operators.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Security Policies */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-purple-600" />
              <h3 className="font-bold text-sm text-text">Chính Sách Bảo Mật Phiên Làm Việc</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Security Guardrails</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-text mb-1">
                  Thời Gian Chờ Tự Đăng Xuất (Idle Timeout)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={config.sessionIdleTimeoutMinutes}
                    onChange={(e) => onChange({ sessionIdleTimeoutMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-purple-600 font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">phút</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Tự động khóa màn hình console khi operator không thao tác.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">
                  Thời Gian Lưu Trữ Audit Log
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={90}
                    max={730}
                    step={30}
                    value={config.auditRetentionDays}
                    onChange={(e) => onChange({ auditRetentionDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus:outline-hidden focus:border-purple-600 font-bold"
                  />
                  <span className="text-neutral-500 text-xs shrink-0">ngày</span>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Tuân thủ quy định kiểm toán bảo mật SOC2.
                </span>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-border">
              <div>
                <div className="font-semibold text-text flex items-center gap-1.5">
                  <Smartphone size={13} className="text-purple-600" />
                  Bắt Buộc Xác Thực 2FA Cho Toàn Bộ Admin
                </div>
                <div className="text-[11px] text-neutral-400">
                  Yêu cầu ứng dụng Google Authenticator / Duo Mobile khi đăng nhập.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.require2FAForAdmin}
                onChange={(e) => onChange({ require2FAForAdmin: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-border">
              <div>
                <div className="font-semibold text-text">Bắt Buộc Lý Do Cho Mọi Thao Tác FSM</div>
                <div className="text-[11px] text-neutral-400">
                  Bắt buộc nhập lý do khi chuyển trạng thái thẻ từ vựng (Approve, Revise, Archive).
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.requireAuditReasonForFsmChanges}
                onChange={(e) => onChange({ requireAuditReasonForFsmChanges: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: RBAC Matrix */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-purple-600" />
              <h3 className="font-bold text-sm text-text">Ma Trận Quyền Hạn Vai Trò (RBAC)</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">5 System Roles</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] text-neutral-400 font-semibold uppercase">
                  <th className="py-2 px-2">Vai trò</th>
                  <th className="py-2 px-2 text-center">Xuất bản thẻ</th>
                  <th className="py-2 px-2 text-center">Duyệt AI</th>
                  <th className="py-2 px-2 text-center">Kinh tế</th>
                  <th className="py-2 px-2 text-center">Khóa User</th>
                  <th className="py-2 px-2 text-center">Cấu hình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {config.rolePermissions.map((rp) => (
                  <tr key={rp.role} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-2">
                      <div className="font-bold text-text">{rp.roleNameVi}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{rp.role}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {rp.canPublishVocab ? (
                        <CheckCircle2 size={13} className="text-primary inline-block" />
                      ) : (
                        <XCircle size={13} className="text-neutral-300 inline-block" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {rp.canReviewAiLabels ? (
                        <CheckCircle2 size={13} className="text-snapy inline-block" />
                      ) : (
                        <XCircle size={13} className="text-neutral-300 inline-block" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {rp.canModifyEconomy ? (
                        <CheckCircle2 size={13} className="text-reward-hover inline-block" />
                      ) : (
                        <XCircle size={13} className="text-neutral-300 inline-block" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {rp.canBanLearners ? (
                        <CheckCircle2 size={13} className="text-danger inline-block" />
                      ) : (
                        <XCircle size={13} className="text-neutral-300 inline-block" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {rp.canChangeSystemConfig ? (
                        <CheckCircle2 size={13} className="text-purple-600 inline-block" />
                      ) : (
                        <XCircle size={13} className="text-neutral-300 inline-block" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Active Operators Table (Full width) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-purple-600" />
              <h3 className="font-bold text-sm text-text">
                Danh Sách Quản Trị Viên Vận Hành (Console Operators)
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['ALL', 'SUPER_ADMIN', 'CONTENT_LEAD', 'AI_OPERATOR', 'LIVEOPS_MANAGER', 'SUPPORT_MODERATOR'].map(
                (roleKey) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setSelectedRoleFilter(roleKey)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedRoleFilter === roleKey
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {roleKey === 'ALL' ? 'Tất cả' : roleKey}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 border-b border-border text-[11px] font-semibold">
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3">Vai trò phân bổ</th>
                  <th className="py-2.5 px-3">Trạng thái 2FA</th>
                  <th className="py-2.5 px-3">Địa chỉ IP gần nhất</th>
                  <th className="py-2.5 px-3">Hoạt động lần cuối</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOperators.map((op) => (
                  <tr key={op.id} className="hover:bg-neutral-50/70">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={op.avatar}
                          alt={op.name}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                        <div>
                          <div className="font-bold text-text">{op.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">{op.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(op.role)}`}>
                        {op.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggle2FA(op.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          op.twoFactorEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Bấm để bật/tắt 2FA giả lập"
                      >
                        {op.twoFactorEnabled ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {op.twoFactorEnabled ? 'Đã bật 2FA' : 'Chưa kích hoạt'}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-neutral-600">
                      {op.ipAddress}
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {op.lastActive}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => showToast(`Đã thu hồi phiên làm việc (Revoke) của ${op.name}`)}
                        className="px-2.5 py-1 rounded-lg border border-border text-neutral-600 hover:text-danger hover:border-danger/30 text-[11px] font-semibold transition-colors"
                      >
                        Thu hồi phiên
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
