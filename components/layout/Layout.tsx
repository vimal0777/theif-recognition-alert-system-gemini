
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { Page, Theme, User } from '../../types';

interface LayoutProps {
  user: User;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onLogout: () => void;
  currentPage: Page;
  setPage: (page: Page) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, theme, setTheme, onLogout, currentPage, setPage, children }) => {
  return (
    <div className={`flex h-screen bg-background ${theme}`}>
      <Sidebar currentPage={currentPage} setPage={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} theme={theme} setTheme={setTheme} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary/40 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
