import React from 'react';
import {
  LayoutDashboard,
  Compass,
  History,
  Bookmark,
  FileText,
  Cpu,
  Settings,
  ChevronRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  savedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, savedCount = 0 }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'Analysis Workspace', icon: Compass },
    { id: 'history', label: 'History Archive', icon: History },
    { id: 'saved', label: 'Saved Investigations', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'reports', label: 'Dossiers & Reports', icon: FileText },
    { id: 'models', label: 'Model Registry', icon: Cpu },
    { id: 'settings', label: 'Analyst Settings', icon: Settings }
  ];

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-3.5 select-none hidden md:flex shadow-xs">
      <div className="space-y-4">
        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
            Platform Menu
          </span>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Node Health Status */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Radio size={12} className="text-emerald-500 animate-pulse" />
            ISRO / ESA Pipeline
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
            ONLINE
          </span>
        </div>
        <p className="text-[11px] font-bold text-slate-800">
          BigEarthNet PEFT Engine
        </p>
        <p className="text-[10px] text-slate-500">
          Fast multimodal inference
        </p>
      </div>
    </aside>
  );
};
