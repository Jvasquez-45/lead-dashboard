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
  Calendar,
  Layers,
  Globe
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatPercent, formatNumber, calculateMetrics } from '../utils/metrics';
import { ConversionRateChart } from '../components/charts/ConversionRateChart';
import { RoiPerformanceChart } from '../components/charts/RoiPerformanceChart';

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
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a970ff]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#a970ff] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Resumen Ejecutivo de la Cuenta</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {activeBusiness.name}
            </h1>
            <p className="text-xs text-slate-300 opacity-70 mt-1">
              Visualización inmediata de CPAs, ROAS, ROI, desgloses de conversaciones y salud del bot VIVI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#0c0e14] border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                Estado Actual
              </span>
              <span className="text-xs font-extrabold text-[#a970ff]">
                {activeBusiness.accountStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Granularity Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-2xl bg-[#0c0e14] border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-300 opacity-70 px-1 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-[#a970ff]" />
            <span>Filtro de Resumen:</span>
          </span>

          <button
            type="button"
            onClick={() => setTimeFilter('day')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'day'
                ? 'bg-[#a970ff] text-slate-950 font-black shadow-md shadow-[#a970ff]/20'
                : 'bg-[#11141d] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            📆 Por Día (Predeterminado)
          </button>

          <button
            type="button"
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'week'
                ? 'bg-[#a970ff] text-slate-950 font-black shadow-md shadow-[#a970ff]/20'
                : 'bg-[#11141d] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            📅 Por Semana
          </button>

          <button
            type="button"
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'month'
                ? 'bg-[#a970ff] text-slate-950 font-black shadow-md shadow-[#a970ff]/20'
                : 'bg-[#11141d] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            🗓️ Por Mes
          </button>

          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              timeFilter === 'all'
                ? 'bg-[#a970ff] text-slate-950 font-black shadow-md shadow-[#a970ff]/20'
                : 'bg-[#11141d] text-slate-300 hover:text-white border border-slate-800'
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
              className="px-3 py-1 rounded-xl bg-[#11141d] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#a970ff]"
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
      <div className="p-5 rounded-2xl bg-[#0c0e14] border border-[#a970ff]/30 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#a970ff]/20 text-[#a970ff] border border-[#a970ff]/30 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a970ff]">
                Conclusión Dinámica Automatizada
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a970ff]/10 text-white font-bold border border-[#a970ff]/30">
                {timeFilter === 'day' && `Día ${selectedDay}`}
                {timeFilter === 'week' && 'Últimos 7 Días'}
                {timeFilter === 'month' && 'Últimos 30 Días'}
                {timeFilter === 'all' && 'Historial Completo'}
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              "{metrics.dynamicConclusion}"
            </p>
          </div>
        </div>
      </div>

      {/* 1. SECCIÓN PRINCIPAL: MÉTRICAS DE COSTO (TUS CPAs) - LO PRIMERO A MOSTRAR */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-[#a970ff]" />
          <span>1. Métricas de Costo (Tus CPAs)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-[#a970ff]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-300 opacity-70">Costo por Conversación</span>
              <MessageSquare className="w-4 h-4 text-[#a970ff]" />
            </div>
            <div className="text-3xl font-black text-white tracking-tight mt-2">
              {formatCurrency(metrics.costPerConversation)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Inversión / Conversaciones Iniciadas</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-[#a970ff]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-300 opacity-70">CPA Agendado</span>
              <CalendarCheck className="w-4 h-4 text-[#a970ff]" />
            </div>
            <div className="text-3xl font-black text-white tracking-tight mt-2">
              {formatCurrency(metrics.cpaScheduled)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Inversión / Citas Agendadas</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-[#34d399]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-300 opacity-70">CPA Real (CAC)</span>
              <UserCheck className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="text-3xl font-black text-[#34d399] tracking-tight mt-2">
              {formatCurrency(metrics.cpaRealCAC)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Inversión / Citas Asistidas</span>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN DEL MEDIO: VISTA RÁPIDA KPI & GRÁFICOS VISUALES */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#a970ff]" />
            <span>2. Vista Rápida KPI</span>
          </h3>
        </div>

        {/* Fast KPI Grid: 2 rows of 4 cards (Top: ROAS, ROI, Meta, Organic / Bottom: In Conv, No Answer, Scheduled, Attended) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Row 1 - Block 1: ROAS */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-[#34d399]/40 hover:border-[#34d399] transition-all">
            <span className="text-[10px] text-[#34d399] font-extrabold uppercase block truncate">ROAS</span>
            <div className="text-2xl font-black text-[#34d399] mt-1">{metrics.roasMultiplier.toFixed(2)}x</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Retorno Publicitario</span>
          </div>

          {/* Row 1 - Block 2: ROI % */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-[#34d399]/40 hover:border-[#34d399] transition-all">
            <span className="text-[10px] text-[#34d399] font-extrabold uppercase block truncate">ROI %</span>
            <div className="text-2xl font-black text-white mt-1">{metrics.roiPercentage.toFixed(1)}%</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Ganancia Porcentual</span>
          </div>

          {/* Row 1 - Block 3: Chats Meta */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-[#a970ff]/40 hover:border-[#a970ff] transition-all">
            <span className="text-[10px] text-[#a970ff] font-extrabold uppercase block truncate">Chats Meta Ads</span>
            <div className="text-2xl font-black text-white mt-1">{formatNumber(metrics.totalMetaConversations)}</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Iniciados en Meta</span>
          </div>

          {/* Row 1 - Block 4: Chats Orgánicos */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-[#34d399]/40 hover:border-[#34d399] transition-all">
            <span className="text-[10px] text-[#34d399] font-extrabold uppercase block truncate">Chats Orgánicos</span>
            <div className="text-2xl font-black text-white mt-1">{formatNumber(metrics.totalOrganicConversations || 0)}</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Tráfico Orgánico</span>
          </div>

          {/* Row 2 - Block 5: En Conversación */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-slate-800 hover:border-slate-700 transition-all">
            <span className="text-[10px] text-slate-300 font-extrabold uppercase block truncate">En Conversación</span>
            <div className="text-2xl font-black text-white mt-1">{formatNumber(metrics.totalInConversation)}</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Interacción Activa</span>
          </div>

          {/* Row 2 - Block 6: No Contestaron */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-slate-800 hover:border-slate-700 transition-all">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block truncate">No Contestaron</span>
            <div className="text-2xl font-black text-slate-300 mt-1">{formatNumber(metrics.totalNoAnswer)}</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Sin Respuesta</span>
          </div>

          {/* Row 2 - Block 7: Citas Agendadas */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-[#a970ff]/40 hover:border-[#a970ff] transition-all">
            <span className="text-[10px] text-[#a970ff] font-extrabold uppercase block truncate">Citas Agendadas</span>
            <div className="text-2xl font-black text-white mt-1">{formatNumber(metrics.totalScheduled)}</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Reservadas</span>
          </div>

          {/* Row 2 - Block 8: Citas Asistidas */}
          <div className="p-3.5 rounded-2xl bg-[#0c0e14] border border-[#34d399]/50 hover:border-[#34d399] transition-all">
            <span className="text-[10px] text-[#34d399] font-extrabold uppercase block truncate">Citas Asistidas</span>
            <div className="text-2xl font-black text-[#34d399] mt-1">{formatNumber(metrics.totalAttended)}</div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Concretadas (Exitosas)</span>
          </div>
        </div>

        {/* Charts in the middle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConversionRateChart records={filteredRecords} />
          <RoiPerformanceChart records={filteredRecords} pricing={activeBusiness.pricing || {}} />
        </div>
      </div>

      {/* 3. SECCIÓN INFERIOR: MÉTRICAS DE RETORNO Y RENTABILIDAD & SALUD DEL BOT VIVI */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#34d399]" />
          <span>3. Métricas de Retorno y Rentabilidad Detallada</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-[#34d399]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-300 opacity-70">ROAS</span>
              <TrendingUp className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="text-3xl font-black text-[#34d399] tracking-tight mt-2">
              {metrics.roasMultiplier.toFixed(2)}x
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Ingresos Brutos / Inversión</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-[#34d399]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-300 opacity-70">Beneficio Bruto</span>
              <Wallet className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="text-3xl font-black text-white tracking-tight mt-2">
              {formatCurrency(metrics.grossProfit)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Ingresos Brutos - Inversión</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-[#34d399]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-300 opacity-70">Beneficio Neto</span>
              <Award className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="text-3xl font-black text-[#34d399] tracking-tight mt-2">
              {formatCurrency(metrics.netProfit)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Ingresos - (Inversión + Costos Op.)</span>
          </div>
        </div>
      </div>

      {/* BLOQUE 4: SALUD Y DESEMPEÑO DEL BOT VIVI */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#a970ff]" />
          <span>4. Salud y Desempeño del Bot VIVI</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Mensajes Procesados</span>
            <div className="text-2xl font-black text-white mt-1">
              {formatNumber(metrics.totalBotMessages)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Volumen total atendido por la IA</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Citas Agendadas por Bot</span>
            <div className="text-2xl font-black text-[#a970ff] mt-1">
              {formatNumber(metrics.totalBotScheduled)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Reservas cerradas autónomamente</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Errores Técnicos</span>
            <div className="text-2xl font-black text-white mt-1">
              {formatNumber(metrics.totalBotErrors)}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Fallos de API / Patrones desconocidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
