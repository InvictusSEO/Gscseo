import React from 'react';
import { 
  IconClose, 
  IconLightbulb, 
  IconEye, 
  IconRefresh, 
  IconChart, 
  IconCheck, 
  IconSearch, 
  IconExternalLink 
} from './Icons';
import { AnalyzedPage } from '../lib/types';

interface DetailDrawerProps {
  page: AnalyzedPage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({ page, isOpen, onClose }) => {
  if (!isOpen || !page) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full sm:max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">URL Audit</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Performance Data</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12">
          {/* Diagnostic Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-5 group-hover:opacity-10 transition duration-1000"></div>
            <div className="relative bg-white border border-blue-100 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <IconLightbulb size={18} />
                </div>
                <h4 className="font-extrabold text-slate-900">Diagnosis</h4>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {page.explanation}
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard 
              icon={<IconEye size={18} />} 
              label="Views" 
              value={page.impressions >= 1000 ? (page.impressions / 1000).toFixed(1) + 'k' : page.impressions.toString()} 
              color="text-indigo-600" 
              bg="bg-indigo-50"
            />
            <MetricCard 
              icon={<IconChart size={18} />} 
              label="Clicks" 
              value={page.clicks.toString()} 
              color="text-blue-600" 
              bg="bg-blue-50"
            />
            <MetricCard 
              icon={<IconRefresh size={18} />} 
              label="Avg. Pos" 
              value={page.position > 0 ? page.position.toFixed(1) : '-'} 
              color="text-emerald-600" 
              bg="bg-emerald-50"
            />
          </div>

          {/* Actions List */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Plan</h3>
            <div className="space-y-2">
              {page.actions.length > 0 ? page.actions.map((action, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <IconCheck size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-semibold text-sm leading-snug">{action}</span>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl">
                  Optimized URL.
                </div>
              )}
            </div>
          </div>

          {/* Top Keywords */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Keywords</h3>
            <div className="space-y-2">
              {page.topQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3">
                    <IconSearch size={16} className="text-slate-300" />
                    <span className="font-bold text-slate-800 text-sm">{q.query}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 text-xs">#{q.position.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          <a 
            href={page.url} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-slate-900 text-white hover:bg-black rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-[0.98]"
          >
            <span>Preview URL</span>
            <IconExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, color, bg }: { icon: React.ReactNode, label: string, value: string, color: string, bg: string }) => (
  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center text-center">
    <div className={`w-8 h-8 ${bg} ${color} rounded-lg flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <div className="text-lg font-black text-slate-900 leading-none mb-1">{value}</div>
    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);