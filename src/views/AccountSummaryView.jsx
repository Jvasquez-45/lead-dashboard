import React from 'react';
import {
  TrendingUp,
  DollarSign,
  CalendarCheck,
  UserCheck,
  UserX,
  Bot,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatPercent, formatNumber } from '../utils/metrics';
import { AppointmentsFunnelChart } from '../components/charts/AppointmentsFunnelChart';
import { ViviBotPerformanceChart } from '../components/charts/ViviBotPerformanceChart';


export const AccountSummaryView = () => {
  const { activeBusiness, metrics } = useBusiness();

  if (!activeBusiness) return null;

  const records = activeBusiness.records || [];

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 dark:text-indigo-400 light:text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Resumen Ejecutivo de la Cuenta</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              {activeBusiness.name}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
              Visualización general de ROI, embudo de citas y rendimiento del bot VIVI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/60 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-700/60 text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                Estado Actual
              </span>
              <span className="text-xs font-extrabold text-indigo-400">
                {activeBusiness.accountStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Conclusion Highlight Card (REQUERIMIENTO OBLIGATORIO #5) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/40 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 block mb-1">
              Conclusión Dinámica Automatizada
            </span>
            <p className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 leading-relaxed">
              "{metrics.dynamicConclusion}"
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ROI Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Retorno de Inversión (ROI)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-400">
              {metrics.roiPercentage.toFixed(1)}%
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multiplicador: {metrics.roiMultiplier.toFixed(2)}x ROI</span>
            </div>
          </div>
        </div>

        {/* Total Gross Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ingresos Brutos Generados</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900">
              {formatCurrency(metrics.totalGrossRevenue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Gasto Ads: <span className="font-semibold text-rose-400">{formatCurrency(metrics.totalSpend)}</span>
            </div>
          </div>
        </div>

        {/* Scheduled Appointments */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Citas Agendadas</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-400">
              {formatNumber(metrics.totalScheduled)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Asistencia: <strong className="text-emerald-400">{formatNumber(metrics.totalAttended)}</strong></span>
              <span>No Asistió: <strong className="text-rose-400">{formatNumber(metrics.totalNoShow)}</strong></span>
            </div>
          </div>
        </div>

        {/* VIVI Bot Appointments */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Citas Exclusivas Bot VIVI</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-cyan-400">
              {formatNumber(metrics.viviBotAppointments)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Mensajes: <strong className="text-slate-300">{formatNumber(metrics.viviBotMessages)}</strong></span>
              <span>Errores: <strong className={metrics.viviBotErrors > 0 ? "text-rose-400" : "text-emerald-400"}>{metrics.viviBotErrors}</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments Funnel Chart */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Embudo de Citas (Agendadas vs Asistidas vs No Asistidas)
              </h3>
              <p className="text-[11px] text-slate-400">
                Desglose interactivo del volumen de agenda y retención de pacientes/clientes.
              </p>
            </div>
          </div>
          <AppointmentsFunnelChart records={records} />
        </div>

        {/* VIVI Bot Performance Chart */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Rendimiento Bot VIVI Día a Día
              </h3>
              <p className="text-[11px] text-slate-400">
                Volumen diario de mensajes procesados y agenda automatizada.
              </p>
            </div>
          </div>
          <ViviBotPerformanceChart records={records} />
        </div>

      </div>

      {/* Account Config & Strategy Diagnostics */}
      {activeBusiness.businessAccountConfig && (
        <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Diagnóstico & Configuración de Cuenta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">
                Problema Identificado
              </span>
              <span className="font-bold text-slate-200">
                {activeBusiness.businessAccountConfig.problemSelector || 'Ninguno'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">
                Nivel de Ejecución
              </span>
              <span className="font-bold text-indigo-400">
                {activeBusiness.businessAccountConfig.executionLevel || 'No especificado'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">
                Tarifas Configuradas
              </span>
              <span className="font-bold text-emerald-400">
                Agendada: ${activeBusiness.pricing?.revenuePerScheduledAppointment} | Asistida: ${activeBusiness.pricing?.revenuePerAttendedAppointment}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
