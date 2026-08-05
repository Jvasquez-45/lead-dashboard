import React from 'react';
import {
  LineChart as LineChartIcon,
  Layers,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Target,
  Users,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatPercent, formatNumber } from '../utils/metrics';
import { MetaAdsCrossChart } from '../components/charts/MetaAdsCrossChart';


export const DetailedAnalysisView = () => {
  const { activeBusiness, metrics } = useBusiness();

  if (!activeBusiness) return null;

  const records = activeBusiness.records || [];

  // Calculate Meta Ads & Lead KPIs
  const costPerLead = metrics.totalLeads > 0 ? metrics.totalSpend / metrics.totalLeads : 0;
  const costPerScheduled = metrics.totalScheduled > 0 ? metrics.totalSpend / metrics.totalScheduled : 0;
  const costPerAttended = metrics.totalAttended > 0 ? metrics.totalSpend / metrics.totalAttended : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <LineChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              Análisis Completo & Diagnóstico Profundo
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              Auditoría vertical exhaustiva: Meta Ads, Embudo completo de Leads y Salud del Bot VIVI para <span className="text-indigo-400 font-bold">{activeBusiness.name}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Meta Ads Cross Metrics Chart */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Target className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">1. Métricas Cruzadas de Campañas Meta Ads</h2>
        </div>

        <MetaAdsCrossChart records={records} />

        {/* Ads KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Gasto Total Ads</span>
            <span className="text-base font-black text-indigo-400">{formatCurrency(metrics.totalSpend)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">CTR Promedio</span>
            <span className="text-base font-black text-amber-400">{metrics.avgCTR.toFixed(2)}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Alcance Total</span>
            <span className="text-base font-black text-sky-400">{formatNumber(metrics.totalReach)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Impresiones</span>
            <span className="text-base font-black text-purple-400">{formatNumber(metrics.totalImpressions)}</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Detailed Lead Funnel */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">
            2. Embudo de Conversión Detallado de Prospectos
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Traza completa desde la captura inicial hasta la asistencia presencial/virtual al servicio:
        </p>

        {/* Funnel Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          {/* Step 1: No Contestaron */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Etapa 1</span>
              <MessageSquare className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-xl font-black text-slate-300">{formatNumber(metrics.totalNoAnswer)}</div>
            <div className="text-[11px] font-bold text-slate-400 mt-1">No contestaron</div>
            <div className="text-[10px] text-slate-500 mt-1">Llamada/Msg sin respuesta</div>
          </div>

          {/* Step 2: En Conversación */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-950/60 relative">
            <div className="flex items-center justify-between text-indigo-400 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Etapa 2</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-indigo-300">{formatNumber(metrics.totalInConversation)}</div>
            <div className="text-[11px] font-bold text-indigo-200 mt-1">En conversación</div>
            <div className="text-[10px] text-indigo-400/80 mt-1">Interacción activa bot/humano</div>
          </div>

          {/* Step 3: Agendado */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-900/60 relative">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Etapa 3</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-purple-300">{formatNumber(metrics.totalScheduled)}</div>
            <div className="text-[11px] font-bold text-purple-200 mt-1">Agendado a cita</div>
            <div className="text-[10px] text-purple-400/80 mt-1">Citas agendadas confirmadas</div>
          </div>

          {/* Step 4: No Asistió */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-900/60 relative">
            <div className="flex items-center justify-between text-rose-400 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Etapa 4</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-black text-rose-400">{formatNumber(metrics.totalNoShow)}</div>
            <div className="text-[11px] font-bold text-rose-300 mt-1">No asistió</div>
            <div className="text-[10px] text-rose-400/80 mt-1">Cita cancelada/Falta</div>
          </div>

          {/* Step 5: Asistió */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 relative">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Etapa 5</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-300">{formatNumber(metrics.totalAttended)}</div>
            <div className="text-[11px] font-bold text-emerald-200 mt-1">Asistió (Cerrado)</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Citas concretadas exitosas</div>
          </div>

        </div>

        {/* Cost Unit KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Costo por Lead (CPL)</span>
            <div className="text-lg font-black text-slate-100 mt-1">{formatCurrency(costPerLead)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Costo por Cita Agendada</span>
            <div className="text-lg font-black text-purple-400 mt-1">{formatCurrency(costPerScheduled)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Costo por Cita Asistida</span>
            <div className="text-lg font-black text-emerald-400 mt-1">{formatCurrency(costPerAttended)}</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VIVI Bot Health & Pattern Logs */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">
            3. Salud y Registros de Patrones de Bot VIVI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Mensajes Intercambiados</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{formatNumber(metrics.viviBotMessages)}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Citas Agendadas x Bot</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{formatNumber(metrics.viviBotAppointments)}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Contador de Errores Técnicos</span>
            <div className={`text-2xl font-black mt-1 ${metrics.viviBotErrors > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {metrics.viviBotErrors}
            </div>
          </div>
        </div>

        {/* Recent Pattern Logs Feed */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            Bitácora de Patrones y Patrones Identificados por el Bot:
          </span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {records.filter(r => r.viviBot?.patternLog).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 italic">
                Sin observaciones de patrones registradas aún.
              </div>
            ) : (
              records.filter(r => r.viviBot?.patternLog).map((rec) => (
                <div key={rec.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{rec.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {rec.viviBot.dailyMessages} msgs
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1 italic">
                      "{rec.viviBot.patternLog}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
