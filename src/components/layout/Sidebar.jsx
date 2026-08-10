import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  FileSpreadsheet,
  GitCompare,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const Sidebar = () => {
  const { activeBusiness, activeView, setActiveView } = useBusiness();

  if (!activeBusiness) return null;

  const navItems = [
    {
      id: 'summary',
      label: 'Resumen de la cuenta',
      description: 'KPIs principales, ROI y Bot VIVI',
      icon: LayoutDashboard,
    },
    {
      id: 'analysis',
      label: 'Análisis Completo',
      description: 'Vista vertical profunda y métricas cruzadas',
      icon: LineChart,
    },
    {
      id: 'input',
      label: 'Ingreso de datos',
      description: 'Formularios categorizados y validados',
      icon: FileSpreadsheet,
    },
    {
      id: 'comparison',
      label: 'Comparación',
      description: 'Split screen con selectores de fecha',
      icon: GitCompare,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between transition-colors duration-300">
      <div className="space-y-6">
        
        {/* Selected Business Overview Header in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-[#11141d] border border-[#a970ff]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#a970ff]/20 text-[#a970ff] border border-[#a970ff]/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a970ff] block">
                Negocio Activo
              </span>
              <h2 className="text-sm font-black text-white truncate">
                {activeBusiness.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Paneles de Análisis
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#a970ff] text-slate-950 font-extrabold border border-[#a970ff] shadow-lg shadow-[#a970ff]/20'
                    : 'hover:bg-[#11141d] text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-slate-950 text-[#a970ff]'
                        : 'bg-[#11141d] text-slate-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className={`text-xs font-black ${isActive ? 'text-slate-950' : 'text-slate-200'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-slate-900 font-semibold opacity-90' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive
                      ? 'text-slate-950 translate-x-0.5'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-3 rounded-xl bg-slate-900/40 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800/60 dark:border-slate-800 light:border-slate-200 text-center">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 block">
          Spec-Driven Dashboard v1.0
        </span>
      </div>
    </aside>
  );
};
