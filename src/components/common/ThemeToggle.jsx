import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useBusiness();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative inline-flex items-center justify-center p-2 text-sm font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-800/40 dark:bg-slate-800/60 light:bg-slate-200/70 border border-slate-700/50 dark:border-slate-700/60 light:border-slate-300 text-slate-300 dark:text-slate-200 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:scale-105 active:scale-95"
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 animate-spin-once" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </div>
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
};
