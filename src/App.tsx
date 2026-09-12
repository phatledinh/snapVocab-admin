import { useState } from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { ContentStudioPage } from './features/content-studio/ContentStudioPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { TopicsDecksPage } from './features/topics/TopicsDecksPage';
import { TemplatesPage } from './features/templates/TemplatesPage';
import { AIScanMonitorPage } from './features/ai-scan/AIScanMonitorPage';
import { ShopEconomyPage } from './features/shop/ShopEconomyPage';
import { MissionsPage } from './features/missions/MissionsPage';
import { BadgesPage } from './features/badges/BadgesPage';
import { LeaderboardSeasonsPage } from './features/seasons/LeaderboardSeasonsPage';
import { LearnersPage } from './features/people/LearnersPage';
import { IssueReportsPage } from './features/reports/IssueReportsPage';
import { AuditActivityLogPage } from './features/audit/AuditActivityLogPage';
import { SettingsPage } from './features/settings/SettingsPage';
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
        return (
          <ShopEconomyPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'missions':
        return (
          <MissionsPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'badges':
        return (
          <BadgesPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'seasons':
        return (
          <LeaderboardSeasonsPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'learners':
        return (
          <LearnersPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'reports':
        return (
          <IssueReportsPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'activity-log':
        return (
          <AuditActivityLogPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            onNavigate={setActiveNav}
            onWordChange={setCurrentWordTitle}
          />
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
