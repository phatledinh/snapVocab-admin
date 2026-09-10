import { useState } from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { ContentStudioPage } from './features/content-studio/ContentStudioPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { TopicsDecksPage } from './features/topics/TopicsDecksPage';
import { TemplatesPage } from './features/templates/TemplatesPage';
import { AIScanMonitorPage } from './features/ai-scan/AIScanMonitorPage';
import { ArrowLeft, Sparkles, ShoppingBag, Users } from 'lucide-react';

export function App() {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [currentWordTitle, setCurrentWordTitle] = useState<string>('apple');

  const renderCurrentView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveNav} />;

      case 'analytics':
        return (
          <AnalyticsPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'content-studio':
        return <ContentStudioPage onWordChange={setCurrentWordTitle} />;

      case 'topics':
        return (
          <TopicsDecksPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'templates':
        return (
          <TemplatesPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'ai-queue':
      case 'ai-monitor':
        return (
          <AIScanMonitorPage
            activeNav={activeNav}
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'shop':
      case 'missions':
      case 'badges':
      case 'seasons':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-background select-none">
            <div className="w-14 h-14 rounded-2xl bg-reward-light text-[#9A7000] flex items-center justify-center mb-4 border border-reward/20 shadow-xs">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-lg font-bold text-text mb-1">
              LiveOps Console & Cửa Hàng (Shop)
            </h2>
            <p className="text-xs text-text-muted max-w-md mb-6 leading-relaxed">
              Quản lý vật phẩm Shop, tỷ giá Coins/Gems, kiểm soát Guardrails trần thưởng và cấu hình chuỗi nhiệm vụ (Lộ trình Sprint 4).
            </p>
            <button
              type="button"
              onClick={() => setActiveNav('dashboard')}
              className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-2 transition-all shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Quay lại Dashboard</span>
            </button>
          </div>
        );

      case 'learners':
      case 'reports':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-background select-none">
            <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4 border border-primary/20 shadow-xs">
              <Users size={28} />
            </div>
            <h2 className="text-lg font-bold text-text mb-1">
              Learners 360 & Khôi Phục Streak
            </h2>
            <p className="text-xs text-text-muted max-w-md mb-6 leading-relaxed">
              Hồ sơ người học 360 độ, kiểm tra tiến độ học SRS và công cụ khôi phục chuỗi Streak kèm bắt buộc đính kèm Ticket ID (Lộ trình Sprint 4).
            </p>
            <button
              type="button"
              onClick={() => setActiveNav('dashboard')}
              className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-xs font-semibold text-text flex items-center gap-2 transition-all shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Quay lại Dashboard</span>
            </button>
          </div>
        );

      default:
        return <DashboardPage onNavigate={setActiveNav} />;
    }
  };

  return (
    <AdminLayout
      currentWordTitle={currentWordTitle}
      activeNav={activeNav}
      onNavigate={setActiveNav}
    >
      {renderCurrentView()}
    </AdminLayout>
  );
}

export default App;
