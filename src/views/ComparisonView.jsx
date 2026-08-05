import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  Calendar,
  ArrowRightLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useBusiness } from '../context/BusinessContext';
import { calculateMetrics, filterRecordsByDate, formatCurrency } from '../utils/metrics';


export const ComparisonView = () => {
  const { activeBusiness } = useBusiness();

  const [leftPreset, setLeftPreset] = useState('all'); // 'all' | 'last7' | 'last30' | 'custom'
  const [rightPreset, setRightPreset] = useState('last7');

  const [leftStart, setLeftStart] = useState('');
  const [leftEnd, setLeftEnd] = useState('');
  const [rightStart, setRightStart] = useState('');
  const [rightEnd, setRightEnd] = useState('');

  if (!activeBusiness) return null;

  const records = activeBusiness.records || [];

  // Helper to filter records by preset or custom range
  const getFilteredRecords = (preset, startDate, endDate) => {
    if (preset === 'all') return records;

    const now = new Date();
    if (preset === 'last7') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      return records.filter((r) => new Date(r.date) >= past);
    }
    if (preset === 'last30') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      return records.filter((r) => new Date(r.date) >= past);
    }

    return filterRecordsByDate(records, startDate, endDate);
  };

  const leftRecords = useMemo(
    () => getFilteredRecords(leftPreset, leftStart, leftEnd),
    [records, leftPreset, leftStart, leftEnd]
  );

  const rightRecords = useMemo(
    () => getFilteredRecords(rightPreset, rightStart, rightEnd),
    [records, rightPreset, rightStart, rightEnd]
  );

  const leftMetrics = useMemo(
    () => calculateMetrics(leftRecords, activeBusiness.pricing),
    [leftRecords, activeBusiness.pricing]
  );

  const rightMetrics = useMemo(
    () => calculateMetrics(rightRecords, activeBusiness.pricing),
    [rightRecords, activeBusiness.pricing]
  );

  // Dynamic summary text widget comparing Panel Left vs Panel Right
  const summaryComparisonText = useMemo(() => {
    if (leftRecords.length === 0 || rightRecords.length === 0) {
      return "Selecciona períodos con datos guardados en ambos paneles para generar el informe comparativo.";
    }

    const diffAttendedPct = leftMetrics.attendanceRate > 0
      ? (((rightMetrics.attendanceRate - leftMetrics.attendanceRate) / leftMetrics.attendanceRate) * 100).toFixed(1)
      : 0;

    const diffScheduled = rightMetrics.totalScheduled - leftMetrics.totalScheduled;
    const diffRoi = (rightMetrics.roiPercentage - leftMetrics.roiPercentage).toFixed(1);

    let attendancePhrase = "";
    if (Number(diffAttendedPct) > 0) {
      attendancePhrase = `El Período Derecho tuvo un ${diffAttendedPct}% más de tasa de asistencia`;
    } else if (Number(diffAttendedPct) < 0) {
      attendancePhrase = `El Período Izquierdo tuvo un ${Math.abs(diffAttendedPct)}% más de tasa de asistencia`;
    } else {
      attendancePhrase = "Ambos períodos mantuvieron la misma tasa de asistencia";
    }

    let scheduledPhrase = diffScheduled >= 0
      ? `se agendaron +${diffScheduled} citas adicionales en el Período Derecho`
      : `se agendaron +${Math.abs(diffScheduled)} citas adicionales en el Período Izquierdo`;

    return `${attendancePhrase}. Comparativamente, ${scheduledPhrase} (Variación ROI: ${diffRoi}%).`;
  }, [leftMetrics, rightMetrics, leftRecords, rightRecords]);

  // Overlay chart data comparing metrics
  const comparisonChartData = [
    {
      métrica: 'Citas Agendadas',
      'Período Izquierdo': leftMetrics.totalScheduled,
      'Período Derecho': rightMetrics.totalScheduled,
    },
    {
      métrica: 'Citas Asistidas',
      'Período Izquierdo': leftMetrics.totalAttended,
      'Período Derecho': rightMetrics.totalAttended,
    },
    {
      métrica: 'No Asistieron',
      'Período Izquierdo': leftMetrics.totalNoShow,
      'Período Derecho': rightMetrics.totalNoShow,
    },
    {
      métrica: 'Citas x Bot VIVI',
      'Período Izquierdo': leftMetrics.viviBotAppointments,
      'Período Derecho': rightMetrics.viviBotAppointments,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              Panel Comparativo Dual (Split Screen)
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              Compara dos rangos de fecha independientes (Día / Semana / Mes) para medir la evolución de rendimiento.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Comparison Widget (REQUERIMIENTO OBLIGATORIO) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/50 border border-purple-500/40 shadow-xl flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 block mb-1">
            Resumen Ejecutivo Comparativo
          </span>
          <p className="text-xs font-bold text-slate-100 leading-relaxed">
            "{summaryComparisonText}"
          </p>
        </div>
      </div>

      {/* SPLIT SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT PANEL */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <h2 className="text-sm font-extrabold text-indigo-300">Panel A (Período Izquierdo)</h2>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
              {leftRecords.length} registros
            </span>
          </div>

          {/* Left Date Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 block">Selector de Rango A:</label>
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'last7', 'last30', 'custom'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLeftPreset(preset)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    leftPreset === preset
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset === 'all' && 'Todo el histórico'}
                  {preset === 'last7' && 'Últimos 7 días'}
                  {preset === 'last30' && 'Últimos 30 días'}
                  {preset === 'custom' && 'Personalizado'}
                </button>
              ))}
            </div>

            {leftPreset === 'custom' && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="date"
                  value={leftStart}
                  onChange={(e) => setLeftStart(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                />
                <span className="text-xs text-slate-500">a</span>
                <input
                  type="date"
                  value={leftEnd}
                  onChange={(e) => setLeftEnd(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                />
              </div>
            )}
          </div>

          {/* Left Panel Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Citas Agendadas</span>
              <div className="text-xl font-black text-indigo-400">{leftMetrics.totalScheduled}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tasa de Asistencia</span>
              <div className="text-xl font-black text-emerald-400">{leftMetrics.attendanceRate.toFixed(1)}%</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Gasto Ads</span>
              <div className="text-base font-extrabold text-slate-200">{formatCurrency(leftMetrics.totalSpend)}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">ROI</span>
              <div className="text-base font-extrabold text-purple-400">{leftMetrics.roiPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <h2 className="text-sm font-extrabold text-purple-300">Panel B (Período Derecho)</h2>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
              {rightRecords.length} registros
            </span>
          </div>

          {/* Right Date Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 block">Selector de Rango B:</label>
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'last7', 'last30', 'custom'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setRightPreset(preset)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    rightPreset === preset
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset === 'all' && 'Todo el histórico'}
                  {preset === 'last7' && 'Últimos 7 días'}
                  {preset === 'last30' && 'Últimos 30 días'}
                  {preset === 'custom' && 'Personalizado'}
                </button>
              ))}
            </div>

            {rightPreset === 'custom' && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="date"
                  value={rightStart}
                  onChange={(e) => setRightStart(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                />
                <span className="text-xs text-slate-500">a</span>
                <input
                  type="date"
                  value={rightEnd}
                  onChange={(e) => setRightEnd(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                />
              </div>
            )}
          </div>

          {/* Right Panel Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Citas Agendadas</span>
              <div className="text-xl font-black text-purple-400">{rightMetrics.totalScheduled}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tasa de Asistencia</span>
              <div className="text-xl font-black text-emerald-400">{rightMetrics.attendanceRate.toFixed(1)}%</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Gasto Ads</span>
              <div className="text-base font-extrabold text-slate-200">{formatCurrency(rightMetrics.totalSpend)}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">ROI</span>
              <div className="text-base font-extrabold text-purple-400">{rightMetrics.roiPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

      </div>

      {/* OVERLAY COMPARISON CHART */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
          <span>Gráfico Comparativo Superpuesto: Período Izquierdo (Indigo) vs Período Derecho (Purple)</span>
        </h3>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="métrica" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Período Izquierdo" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Período Derecho" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
