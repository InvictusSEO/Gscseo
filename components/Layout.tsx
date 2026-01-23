import React from 'react';
import { IconSquares, IconLogout, IconSparkles } from './Icons';
import { User } from '../lib/types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => (
  <div className="min-h-screen flex flex-col">
    <nav className="fixed top-0 inset-x-0 z-50 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => window.location.href='/'}
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <IconSquares size={22} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Visibility<span className="text-indigo-600">.ai</span>
          </span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 leading-none">{user.name}</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Growth Tier</span>
            </div>
            <div className="relative group">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-1 ring-slate-100 group-hover:ring-indigo-200 transition-all cursor-pointer"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            >
              <IconLogout size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-soft"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Ready</span>
          </div>
        )}
      </div>
    </nav>
    
    <main className="flex-1 pt-32 pb-24 max-w-7xl mx-auto w-full px-6">
      {children}
    </main>

    <footer className="py-12 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <IconSparkles size={20} className="text-indigo-500" />
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">SEO Engine Protocol</span>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} Visibility.ai
        </p>
      </div>
    </footer>
  </div>
);