import React, { useState, useMemo, useEffect } from 'react';
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
  Activity,
  MessageSquare,
  Target,
  Percent,
  Award,
  Wallet,
  Calendar
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatPercent, formatNumber, calculateMetrics } from '../utils/metrics';
import { AppointmentsFunnelChart } from '../components/charts/AppointmentsFunnelChart';
import { ViviBotPerformanceChart } from '../components/charts/ViviBotPerformanceChart';

export const AccountSummaryView = () => {
  const { activeBusiness } = useBusiness();

  if (!activeBusiness) return null;

  const rawRecords = activeBusiness.records || [];

  // Order records by date descending
  const sortedRecords = useMemo(() => {
    return [...rawRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [rawRecords]);

  // Extract unique dates sorted descending
  const uniqueDates = useMemo(() => {
    const dates = sortedRecords.map((r) => r.date).filter(Boolean);
    return Array.from(new Set(dates));
  }, [sortedRecords]);

  const [timeFilter, setTimeFilter] = useState('day'); // 'day' (default) | 'week' | 'month' | 'all'
  const [selectedDay, setSelectedDay] = useState(uniqueDates[0] || '');

  // Keep selectedDay updated if dataset changes
  useEffect(() => {
    if (uniqueDates.length > 0 && (!selectedDay || !uniqueDates.includes(selectedDay))) {
      setSelectedDay(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDay]);

  // Filter records based on selected time granularity
  const filteredRecords = useMemo(() => {
    if (!sortedRecords || sortedRecords.length === 0) return [];

    const refDateStr = selectedDay || sortedRecords[0]?.date;
    if (!refDateStr && timeFilter !== 'all') return sortedRecords;

    const refDate = new Date(refDateStr);

    if (timeFilter === 'day') {
      return sortedRecords.filter((r) => r.date === refDateStr);
    }

    if (timeFilter === 'week') {
      const sevenDaysAgo = new Date(refDate);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      return sortedRecords.filter((r) => {
        const d = new Date(r.date);
        return d >= sevenDaysAgo && d <= refDate;
      });
    }

    if (timeFilter === 'month') {
      const thirtyDaysAgo = new Date(refDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      return sortedRecords.filter((r) => {
        const d = new Date(r.date);
        return d >= thirtyDaysAgo && d <= refDate;
      });
    }

    return sortedRecords; // 'all'
  }, [sortedRecords, timeFilter, selectedDay]);

  // Dynamically calculate metrics for the filtered view
  const metrics = useMemo(() => {
    return calculateMetrics(filteredRecords, activeBusiness.pricing || {});
  }, [filteredRecords, activeBusiness.pricing]);

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
              Visualización general de ROAS, CPAs, beneficios, fricción del embudo y salud del bot VIVI.
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

      {/* Time Granularity Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 px-1 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Filtro de Resumen:</span>
          </span>

          <button
            type="button"
            onClick={() => setTimeFilter('day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'day'
                ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/30'
                : 'glass-panel text-slate-400 hover:text-slate-200'
            }`}
          >
            📆 Por Día (Predeterminado)
          </button>

          <button
            type="button"
            onClick={() => setTimeFilter('week')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'week'
                ? 'bg-purple-600 text-white shadow-md border border-purple-400/30'
                : 'glass-panel text-slate-400 hover:text-slate-200'
            }`}
          >
            📅 Por Semana
          </button>

          <button
            type="button"
            onClick={() => setTimeFilter('month')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'month'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/30'
                : 'glass-panel text-slate-400 hover:text-slate-200'
            }`}
          >
            🗓️ Por Mes
          </button>

          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'all'
                ? 'bg-slate-700 text-white shadow-md border border-slate-600'
                : 'glass-panel text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Historial Completo
          </button>
        </div>

        {/* Date dropdown when timeFilter === 'day' */}
        {timeFilter === 'day' && uniqueDates.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Ver Día:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Dynamic Conclusion Highlight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/40 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                Conclusión Dinámica Automatizada
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {timeFilter === 'day' && `Día ${selectedDay}`}
                {timeFilter === 'week' && 'Últimos 7 Días'}
                {timeFilter === 'month' && 'Últimos 30 Días'}
                {timeFilter === 'all' && 'Historial Completo'}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 leading-relaxed">
              "{metrics.dynamicConclusion}"
            </p>
          </div>
        </div>
      </div>

      {/* BLOQUE 1: MÉTRICAS DE COSTO (TUS CPAs) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>1. Métricas de Costo (Tus CPAs)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Costo por Conversación</span>
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 mt-2">
              {formatCurrency(metrics.costPerConversation)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Inversión / Conversaciones Iniciadas</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">CPA Agendado</span>
              <CalendarCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 mt-2">
              {formatCurrency(metrics.cpaScheduled)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Inversión / Citas Agendadas</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">CPA Real (CAC)</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              {formatCurrency(metrics.cpaRealCAC)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Inversión / Citas Asistidas</span>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: MÉTRICAS DE RETORNO Y RENTABILIDAD */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>2. Métricas de Retorno y Rentabilidad</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">ROAS</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              {metrics.roasMultiplier.toFixed(2)}x
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Ingresos Brutos / Inversión</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Beneficio Bruto</span>
              <Wallet className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-300 mt-2">
              {formatCurrency(metrics.grossProfit)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Ingresos Brutos - Inversión</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Beneficio Neto</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-2">
              {formatCurrency(metrics.netProfit)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Ingresos - (Inversión + Costos Op.)</span>
          </div>
        </div>

        {/* Desglose de Conversiones y Prospectos (Bajo Retorno y Rentabilidad) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-indigo-300 font-extrabold uppercase block truncate">
              Conversaciones Meta
            </span>
            <div className="text-xl font-black text-indigo-300 mt-1">
              {formatNumber(metrics.totalMetaConversations)}
            </div>
            <span className="text-[9px] text-slate-500 block">Generadas del día</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-purple-300 font-extrabold uppercase block truncate">
              Agendados a Cita
            </span>
            <div className="text-xl font-black text-purple-300 mt-1">
              {formatNumber(metrics.totalScheduled)}
            </div>
            <span className="text-[9px] text-slate-500 block">Reservas logradas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-900/40">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase block truncate">
              Asistieron (Exitosas)
            </span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {formatNumber(metrics.totalAttended)}
            </div>
            <span className="text-[9px] text-slate-500 block">Citas concretadas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-rose-900/40">
            <span className="text-[10px] text-rose-400 font-extrabold uppercase block truncate">
              No Asistieron
            </span>
            <div className="text-xl font-black text-rose-400 mt-1">
              {formatNumber(metrics.totalNoShow)}
            </div>
            <span className="text-[9px] text-slate-500 block">Faltas / Cancelaciones</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-sky-300 font-extrabold uppercase block truncate">
              En Conversación
            </span>
            <div className="text-xl font-black text-sky-300 mt-1">
              {formatNumber(metrics.totalInConversation)}
            </div>
            <span className="text-[9px] text-slate-500 block">Interacción activa</span>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: MÉTRICAS DE FRICCIÓN (CONVERSIÓN Y AUSENTISMO) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Percent className="w-4 h-4 text-amber-400" />
          <span>3. Métricas de Fricción (Tasas del Embudo)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Cierre de Chat (%)</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2">
              {metrics.chatConversionRate.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">
              Efectividad de la atención por chat para lograr una reserva.
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase">Tasa de Asistencia (%)</span>
              <UserCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400 mt-2">
              {metrics.attendanceRate.toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-medium">
              Nivel de asistencia a citas (Ausentismo: {metrics.noShowRate.toFixed(1)}%).
            </span>
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
          <AppointmentsFunnelChart records={filteredRecords} />
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
          <ViviBotPerformanceChart records={filteredRecords} />
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
