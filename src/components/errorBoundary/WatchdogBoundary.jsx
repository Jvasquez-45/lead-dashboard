import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle, Bug } from 'lucide-react';

export class WatchdogBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[Watchdog ErrorBoundary Captured Exception]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-2xl mx-auto my-8 glass-panel rounded-3xl border border-rose-500/30 text-slate-100 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center gap-3 pb-4 border-b border-rose-500/20 mb-4">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-300">Watchdog - Error de Ejecución Capturado</h2>
              <p className="text-xs text-slate-400">
                Se detectó una excepción imprevista durante la renderización de datos. El sistema ha aislado el error para evitar el colapso de la app.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-rose-400 overflow-x-auto mb-6">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Bug className="w-4 h-4" />
              <span>{this.state.error?.toString()}</span>
            </div>
            <pre className="text-[10px] text-slate-500 mt-2 whitespace-pre-wrap">
              {this.state.errorInfo?.componentStack || 'No stacktrace available'}
            </pre>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Recargar Aplicación
            </button>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar Vista</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
