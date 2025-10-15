import React from 'react';
import { HomeIcon, UsersIcon, HistoryIcon, AlertTriangleIcon, VideoIcon, SettingsIcon, ShieldIcon } from '../Icons';
import type { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: Page;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      {label}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const navItems: { label: Page; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: <HomeIcon /> },
    { label: 'Face Gallery', icon: <UsersIcon /> },
    { label: 'Detection History', icon: <HistoryIcon /> },
    { label: 'Unknown Faces', icon: <AlertTriangleIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
          <ShieldIcon className="h-8 w-8 text-primary"/>
          <h1 className="text-xl font-bold ml-2">VigilAI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.label}
            onClick={() => setPage(item.label)}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">&copy; 2024 VigilAI Systems</p>
      </div>
    </aside>
  );
};

export default Sidebar;