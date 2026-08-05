import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../../utils/metrics';

export const MetaAdsCrossChart = ({ records = [] }) => {
  const [activeMetric, setActiveMetric] = useState('spend_ctr');

  if (!records || records.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        Sin datos de Meta Ads para mostrar. Registra información en 'Ingreso de datos'.
      </div>
    );
  }

  const chartData = [...records]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((rec) => ({
      fecha: rec.date ? rec.date.slice(5) : 'S/F',
      spend: Number(rec.metaAds?.spend) || 0,
      ctr: Number(rec.metaAds?.ctr) || 0,
      impressions: Number(rec.metaAds?.impressions) || 0,
      reach: Number(rec.metaAds?.reach) || 0,
      thruplay: Number(rec.metaAds?.thruplay) || 0,
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1">
            Fecha: {label}
          </div>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.color }} className="font-semibold">
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {entry.name.includes('Gasto') ? formatCurrency(entry.value) : entry.name.includes('CTR') ? `${entry.value}%` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-300">
          Métricas Cruzadas de Campañas Publicitarias Meta
        </span>
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMetric('spend_ctr')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeMetric === 'spend_ctr'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gasto vs CTR
          </button>
          <button
            onClick={() => setActiveMetric('reach_thruplay')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeMetric === 'reach_thruplay'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alcance vs Thruplay
          </button>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="fecha" stroke="#94a3b8" fontSize={11} />
            
            {activeMetric === 'spend_ctr' ? (
              <>
                <YAxis yAxisId="left" stroke="#6366f1" fontSize={11} unit="$" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="spend"
                  name="Gasto Ads ($)"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ctr"
                  name="CTR (%)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b' }}
                />
              </>
            ) : (
              <>
                <YAxis yAxisId="left" stroke="#38bdf8" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="reach"
                  name="Alcance de Personas"
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="thruplay"
                  name="Thruplay (Reproducciones)"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ec4899' }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
