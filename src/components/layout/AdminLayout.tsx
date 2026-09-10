import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentWordTitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentWordTitle,
}) => {
  const [activeNav, setActiveNav] = useState('content-studio');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeNav={activeNav} onNavigate={setActiveNav} />

      {/* Main Workspace View */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header currentWordTitle={currentWordTitle} />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};
