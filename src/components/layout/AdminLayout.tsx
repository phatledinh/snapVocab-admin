import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentWordTitle?: string;
  activeNav?: string;
  onNavigate?: (navId: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentWordTitle,
  activeNav: controlledActiveNav,
  onNavigate: controlledOnNavigate,
}) => {
  const [internalActiveNav, setInternalActiveNav] = useState('dashboard');

  const currentNav = controlledActiveNav !== undefined ? controlledActiveNav : internalActiveNav;
  const handleNavigate = controlledOnNavigate || setInternalActiveNav;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeNav={currentNav} onNavigate={handleNavigate} />

      {/* Main Workspace View */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header currentWordTitle={currentWordTitle} activeNav={currentNav} />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};
