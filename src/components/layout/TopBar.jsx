import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ChevronDown,
  Plus,
  Check,
  Activity,
  AlertTriangle,
  XCircle,
  BarChart3,
  Trash2
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { CreateBusinessModal } from './CreateBusinessModal';

export const TopBar = () => {
  const {
    businesses,
    activeBusinessId,
    activeBusiness,
    selectBusiness,
    deleteBusiness
  } = useBusiness();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Óptima':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Óptima
          </span>
        );
      case 'Pendiente de revisión':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pendiente de revisión
          </span>
        );
      case 'Atorada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Atorada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status || 'Sin estado'}
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0c0e14] border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors duration-300 shadow-xl">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#a970ff]/20 text-[#a970ff] border border-[#a970ff]/30 shadow-lg shadow-[#a970ff]/10">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white">
                LEAD DASHBOARD
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#a970ff]">
                Business Analytics Engine
              </p>
            </div>
          </div>

          {/* Business Selector & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Business Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 bg-[#11141d] hover:bg-[#181b24] text-white border border-[#a970ff]/40 hover:border-[#a970ff] shadow-lg shadow-black/40 active:scale-95"
              >
                <Building2 className="w-4 h-4 text-[#a970ff]" />
                <span className="max-w-[160px] sm:max-w-[200px] truncate">
                  {activeBusiness ? activeBusiness.name : 'Seleccionar Negocio'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl p-2 shadow-2xl border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-700/50 dark:border-slate-700/50 light:border-slate-200 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
                      Mis Negocios ({businesses.length})
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {businesses.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        No hay negocios registrados.
                      </div>
                    ) : (
                      businesses.map((biz) => {
                        const isSelected = biz.id === activeBusinessId;
                        return (
                          <div
                            key={biz.id}
                            className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-600/20 text-indigo-300 dark:text-indigo-300 light:text-indigo-900 border border-indigo-500/30'
                                : 'hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700'
                            }`}
                            onClick={() => {
                              selectBusiness(biz.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                              <span className="truncate">{biz.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                              {businesses.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBusiness(biz.id);
                                  }}
                                  className="p-1 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-all"
                                  title="Eliminar negocio"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add New Business Action inside Dropdown */}
                  <div className="mt-2 pt-2 border-t border-slate-700/50 dark:border-slate-700/50 light:border-slate-200">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 light:text-indigo-600 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Crear Nuevo Negocio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active Business Status Badge */}
            {activeBusiness && (
              <div className="hidden md:block">
                {getStatusBadge(activeBusiness.accountStatus)}
              </div>
            )}

            {/* Theme Toggle Button */}
            <ThemeToggle />

          </div>
        </div>
      </header>

      {/* Modal for creating custom business */}
      <CreateBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
