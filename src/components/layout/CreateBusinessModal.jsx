import React, { useState } from 'react';
import { X, Building2, DollarSign, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const CreateBusinessModal = ({ isOpen, onClose }) => {
  const { createBusiness } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    accountStatus: 'Óptima',
    revenuePerScheduledAppointment: '25',
    revenuePerAttendedAppointment: '150',
    problemSelector: 'Ninguno - Operación normal',
    executionLevel: 'Alta',
    strategyNotes: '',
    implementationNotes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createBusiness(formData);
    setFormData({
      name: '',
      accountStatus: 'Óptima',
      revenuePerScheduledAppointment: '25',
      revenuePerAttendedAppointment: '150',
      problemSelector: 'Ninguno - Operación normal',
      executionLevel: 'Alta',
      strategyNotes: '',
      implementationNotes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 shadow-2xl border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 dark:border-slate-700/50 light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Crear Nuevo Negocio</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                Registra una cuenta personalizada para gestionar sus análisis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
              Nombre del Negocio <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Clínica Odontológica VIP"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/80 light:bg-white border border-slate-700/70 dark:border-slate-700 light:border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                Estado de la Cuenta
              </label>
              <select
                name="accountStatus"
                value={formData.accountStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 dark:bg-slate-900/80 light:bg-white border border-slate-700/70 dark:border-slate-700 light:border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Óptima">🟢 Óptima</option>
                <option value="Pendiente de revisión">🟡 Pendiente de revisión</option>
                <option value="Atorada">🔴 Atorada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
                Nivel de Ejecución
              </label>
              <select
                name="executionLevel"
                value={formData.executionLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 dark:bg-slate-900/80 light:bg-white border border-slate-700/70 dark:border-slate-700 light:border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/40 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800 light:border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 dark:text-indigo-400 light:text-indigo-600">
              <DollarSign className="w-4 h-4" />
              <span>Configuración de Tarifas de Ingreso ($)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">
                  Ganancia x Cita Agendada ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="revenuePerScheduledAppointment"
                  value={formData.revenuePerScheduledAppointment}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/80 dark:bg-slate-950 light:bg-white border border-slate-700/60 dark:border-slate-700 light:border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-400 light:text-slate-600 mb-1">
                  Ganancia x Cita Asistida ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="revenuePerAttendedAppointment"
                  value={formData.revenuePerAttendedAppointment}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/80 dark:bg-slate-950 light:bg-white border border-slate-700/60 dark:border-slate-700 light:border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/50 dark:border-slate-700/50 light:border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 hover:bg-slate-800/40 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Guardar Negocio
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
