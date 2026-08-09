import React, { useState } from 'react';
import { Building2, Plus, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { CreateBusinessModal } from './CreateBusinessModal';

export const MainLayout = ({ children }) => {
  const { activeBusiness, businesses, permissionError } = useBusiness();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Permission Error Notification Banner */}
      {permissionError && (
        <div className="max-w-7xl w-full mx-auto px-4 pt-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 flex-wrap shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Atención - Reglas de Firebase Bloqueadas:</strong> Las Reglas de Seguridad en tu consola de Firebase tienen permisos denegados (<em>Missing or insufficient permissions</em>). Actualiza las reglas a <code>allow read, write: if true;</code> para permitir que la app lea y guarde en la nube.
              </span>
            </div>
            <a
              href="https://console.firebase.google.com/project/lead-de614/firestore/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shrink-0"
            >
              Publicar Reglas en Firebase ↗
            </a>
          </div>
        </div>
      )}

      {/* App Body */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 lg:p-6 gap-6">
        
        {/* Left Sidebar (Only visible when business exists & is selected) */}
        {activeBusiness ? (
          <Sidebar />
        ) : null}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {!activeBusiness || businesses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center glass-panel rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 min-h-[500px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/10 border border-indigo-500/30">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900 mb-2">
                Bienvenido al Dashboard Analytics
              </h2>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-md mb-6">
                Para comenzar a analizar tus campañas y bot VIVI, crea tu primer negocio personalizado o selecciona uno existente en la barra superior.
              </p>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Mi Primer Negocio</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <CreateBusinessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          ) : (
            <div className="h-full animate-in fade-in duration-200">
              {children}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
