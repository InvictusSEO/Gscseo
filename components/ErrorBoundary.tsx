import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IconAlert, IconRefresh } from './Icons.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('UI_CRASH_REPORT:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <IconAlert size={36} />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">System Interruption</h1>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              The engine encountered an unexpected runtime exception. This usually happens due to a temporary network disruption or a module resolution timeout.
            </p>

            <div className="mb-10 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Error Diagnostic</span>
              <p className="font-mono text-xs text-rose-700 break-words leading-tight">
                {this.state.error?.name}: {this.state.error?.message || 'Unknown Exception'}
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full h-14 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <IconRefresh size={18} />
              Perform System Recovery
            </button>
            
            <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Visibility.ai Protocol Alpha
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}