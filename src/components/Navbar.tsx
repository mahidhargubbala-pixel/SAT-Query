import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  Layers,
  History,
  Bookmark,
  FileText,
  Cpu,
  Settings,
  MousePointer2
} from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from './Logo';
import { CursorStyle, CURSOR_THEMES } from './SpaceCursor';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCursor, setActiveCursor] = useState<CursorStyle>('azure-fluid');
  const [cursorTooltip, setCursorTooltip] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('satquery_cursor_style') as CursorStyle;
    if (saved && CURSOR_THEMES[saved]) setActiveCursor(saved);

    const handleCursorChange = () => {
      const updated = localStorage.getItem('satquery_cursor_style') as CursorStyle;
      if (updated && CURSOR_THEMES[updated]) setActiveCursor(updated);
    };

    window.addEventListener('satquery_cursor_changed', handleCursorChange);
    return () => window.removeEventListener('satquery_cursor_changed', handleCursorChange);
  }, []);

  const cycleCursor = () => {
    const styles: CursorStyle[] = ['azure-fluid', 'solar-gold', 'aurora-emerald', 'quantum-violet'];
    const nextIdx = (styles.indexOf(activeCursor) + 1) % styles.length;
    const next = styles[nextIdx];
    setActiveCursor(next);
    localStorage.setItem('satquery_cursor_style', next);
    window.dispatchEvent(new Event('satquery_cursor_changed'));

    setCursorTooltip(true);
    setTimeout(() => setCursorTooltip(false), 2000);
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'History' },
    { id: 'reports', label: 'Reports' },
    { id: 'models', label: 'Models' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('landing')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('landing');
            }
          }}
          role="button"
          tabIndex={0}
          className="hover:opacity-90 transition-opacity focus:outline-none cursor-pointer flex items-center"
        >
          <Logo size="sm" showTagline={false} darkText={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === item.id
                  ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Quick 3D Cursor Theme Switcher */}
          <div className="relative">
            <button
              onClick={cycleCursor}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all shadow-xs"
              title="Click to cycle 4 custom 3D cursor themes"
            >
              <MousePointer2 size={13} className="text-slate-500" />
              <span
                className="w-2.5 h-2.5 rounded-full shadow-xs ring-1 ring-white"
                style={{ backgroundColor: CURSOR_THEMES[activeCursor]?.primary || '#0284c7' }}
              />
              <span className="text-[11px] hidden lg:inline font-medium text-slate-600">
                {CURSOR_THEMES[activeCursor]?.name.split(' ')[0]} Cursor
              </span>
            </button>

            {cursorTooltip && (
              <div className="absolute top-full right-0 mt-2 z-50 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md shadow-lg border border-sky-500/40 whitespace-nowrap animate-bounce">
                Cursor: {CURSOR_THEMES[activeCursor]?.name}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('workspace')}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles size={13} />
            <span>Launch Analysis</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => onNavigate('settings')}
                className="flex items-center gap-1.5 text-xs text-slate-800 hover:text-sky-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition-all shadow-xs"
                title="Account Settings"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[120px]">{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg">
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold text-left ${
                  activeView === item.id
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-800">{user.name}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-sky-600 text-white rounded-lg text-xs font-bold"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
