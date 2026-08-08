import React, { useState, useMemo } from 'react';
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
  MessageSquare,
  Trophy,
  Sparkles,
  FolderTree,
  TrendingUp,
  Award
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatPercent, formatNumber } from '../utils/metrics';
import { MetaAdsCrossChart } from '../components/charts/MetaAdsCrossChart';

export const DetailedAnalysisView = () => {
  const { activeBusiness, metrics } = useBusiness();
  const [metaViewTab, setMetaViewTab] = useState('all'); // 'all' | 'adSets' | 'ads'

  if (!activeBusiness) return null;

  const records = activeBusiness.records || [];

  // Separate AdSet and Ad level records
  const adSetRecords = useMemo(
    () => records.filter((r) => r.metaAds?.level === 'adSet' || (!r.metaAds?.level && !r.metaAds?.adName)),
    [records]
  );

  const adRecords = useMemo(
    () => records.filter((r) => r.metaAds?.level === 'ad' || Boolean(r.metaAds?.adName)),
    [records]
  );

  // Identify the Winning Ad (Anuncio Ganador)
  const winningAd = useMemo(() => {
    if (adRecords.length === 0) return null;
    return [...adRecords].sort((a, b) => {
      const resA = Number(a.metaAds?.results) || 0;
      const resB = Number(b.metaAds?.results) || 0;
      if (resB !== resA) return resB - resA;
      const cpcA = Number(a.metaAds?.costPerResult) || Number(a.metaAds?.cpc) || 999999;
      const cpcB = Number(b.metaAds?.costPerResult) || Number(b.metaAds?.cpc) || 999999;
      return cpcA - cpcB;
    })[0];
  }, [adRecords]);

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
              Análisis Completo &amp; Diagnóstico Profundo
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              Auditoría vertical exhaustiva: Meta Ads (Conjuntos vs. Anuncios), Embudo completo de Leads y Salud del Bot VIVI para <span className="text-indigo-400 font-bold">{activeBusiness.name}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* TARJETA DE ANUNCIO GANADOR (WINNING AD) */}
      {winningAd && (
        <section className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-indigo-950/40 border border-amber-500/40 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10 animate-pulse">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> ANUNCIO GANADOR DETECTADO
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">
                  {winningAd.metaAds?.adName || 'Anuncio Destacado'}
                </h2>
                <p className="text-xs text-amber-200/80">
                  Conjunto: <span className="font-semibold text-white">{winningAd.metaAds?.adSetName || 'N/A'}</span> • Campaña: <span className="font-semibold text-white">{winningAd.metaAds?.campaignName || 'N/A'}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-amber-300/80 uppercase font-semibold block">Eficiencia Máxima</span>
              <span className="text-2xl font-black text-amber-300">{winningAd.metaAds?.results || 0} Resultados</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Coste por Resultado</span>
              <span className="text-base font-black text-emerald-400">
                {formatCurrency(winningAd.metaAds?.costPerResult || 0)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Importe Gastado</span>
              <span className="text-base font-black text-indigo-300">
                {formatCurrency(winningAd.metaAds?.amountSpent || winningAd.metaAds?.spend || 0)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">CTR (%)</span>
              <span className="text-base font-black text-amber-300">
                {winningAd.metaAds?.ctr || 0}%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">CPC ($)</span>
              <span className="text-base font-black text-purple-300">
                {formatCurrency(winningAd.metaAds?.cpc || 0)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 1: Meta Ads Analysis (Desglose Conjuntos vs. Anuncios) */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">1. Auditoría &amp; Métricas Cruzadas de Meta Ads</h2>
          </div>

          {/* Sub-selector de vista */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setMetaViewTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metaViewTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Visión General
            </button>
            <button
              onClick={() => setMetaViewTab('adSets')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                metaViewTab === 'adSets'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" /> Conjuntos ({adSetRecords.length})
            </button>
            <button
              onClick={() => setMetaViewTab('ads')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                metaViewTab === 'ads'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Anuncios ({adRecords.length})
            </button>
          </div>
        </div>

        {/* Dynamic Content based on metaViewTab */}
        {metaViewTab === 'all' && (
          <div className="space-y-4">
            <MetaAdsCrossChart records={records} />

            {/* Ads KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
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
          </div>
        )}

        {metaViewTab === 'adSets' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-purple-400" /> Desglose a Nivel Conjuntos de Anuncio
            </h3>

            {adSetRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic rounded-2xl bg-slate-900/40 border border-slate-800">
                Sin datos específicos registrados a nivel Conjunto de Anuncio.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Conjunto de Anuncio</th>
                      <th className="py-2.5 px-3">Campaña</th>
                      <th className="py-2.5 px-3 text-right">Resultados</th>
                      <th className="py-2.5 px-3 text-right">Coste / Res</th>
                      <th className="py-2.5 px-3 text-right">Gasto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adSetRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-200">{r.date}</td>
                        <td className="py-3 px-3 font-semibold text-purple-300">{r.metaAds?.adSetName || 'Sin Nombre'}</td>
                        <td className="py-3 px-3 text-slate-400">{r.metaAds?.campaignName || 'N/A'}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400">{r.metaAds?.results || 0}</td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-200">{formatCurrency(r.metaAds?.costPerResult || 0)}</td>
                        <td className="py-3 px-3 text-right font-bold text-indigo-300">{formatCurrency(r.metaAds?.amountSpent || r.metaAds?.spend || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {metaViewTab === 'ads' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" /> Desglose Anuncio por Anuncio (Creativos)
            </h3>

            {adRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic rounded-2xl bg-slate-900/40 border border-slate-800">
                Sin datos específicos registrados a nivel Anuncio Individual.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Anuncio (Creativo)</th>
                      <th className="py-2.5 px-3">Conjunto</th>
                      <th className="py-2.5 px-3 text-right">Resultados</th>
                      <th className="py-2.5 px-3 text-right">Coste / Res</th>
                      <th className="py-2.5 px-3 text-right">CTR</th>
                      <th className="py-2.5 px-3 text-right">Gasto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adRecords.map((r) => {
                      const isWinner = winningAd?.id === r.id;
                      return (
                        <tr
                          key={r.id}
                          className={`transition-colors ${
                            isWinner ? 'bg-amber-500/10 border-l-2 border-amber-500 font-bold' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 px-3 font-bold text-slate-200">{r.date}</td>
                          <td className="py-3 px-3 text-slate-100 flex items-center gap-1.5">
                            {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            <span>{r.metaAds?.adName || 'Sin Nombre'}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">{r.metaAds?.adSetName || 'N/A'}</td>
                          <td className="py-3 px-3 text-right font-bold text-amber-300">{r.metaAds?.results || 0}</td>
                          <td className="py-3 px-3 text-right font-semibold text-slate-200">{formatCurrency(r.metaAds?.costPerResult || 0)}</td>
                          <td className="py-3 px-3 text-right font-bold text-sky-400">{r.metaAds?.ctr || 0}%</td>
                          <td className="py-3 px-3 text-right font-bold text-indigo-300">{formatCurrency(r.metaAds?.amountSpent || r.metaAds?.spend || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
