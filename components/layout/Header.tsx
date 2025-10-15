
import React from 'react';
import type { Theme, User } from '../../types';
import { MoonIcon, SunIcon } from '../Icons';
import { Button } from '../ui/Button';

interface HeaderProps {
  user: User;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, theme, setTheme, onLogout }) => {
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold">Welcome, {user.username}!</h1>
                <p className="text-sm text-muted-foreground">Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </Button>
                <div className="flex items-center space-x-2">
                    <img src="https://picsum.photos/seed/user/40/40" alt="user avatar" className="h-10 w-10 rounded-full"/>
                    <div>
                         <Button variant="ghost" onClick={onLogout}>Logout</Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
