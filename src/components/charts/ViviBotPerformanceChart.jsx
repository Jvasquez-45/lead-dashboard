import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const ViviBotPerformanceChart = ({ records = [] }) => {
  const [filterMetric, setFilterMetric] = useState('all'); // 'all' | 'messages' | 'appointments'

  if (!records || records.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        Sin actividad de Bot VIVI registrada.
      </div>
    );
  }

  // Prepare chronological chart data
  const chartData = [...records]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((rec) => ({
      fecha: rec.date ? rec.date.slice(5) : 'S/F',
      fullDate: rec.date,
      mensajes: Number(rec.viviBot?.dailyMessages) || 0,
      errores: Number(rec.viviBot?.technicalErrors) || 0,
      citasBot: Number(rec.viviBot?.botScheduledAppointments) || 0,
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl shadow-2xl border border-slate-700/80 text-xs space-y-1.5">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1">
            Fecha: {label}
          </div>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">
          Tendencia Diaria de Interacciones
        </span>
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterMetric('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              filterMetric === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterMetric('messages')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              filterMetric === 'messages'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solo Mensajes
          </button>
          <button
            onClick={() => setFilterMetric('appointments')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              filterMetric === 'appointments'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solo Citas Bot
          </button>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMensajes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="fecha" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            
            {(filterMetric === 'all' || filterMetric === 'messages') && (
              <Area
                type="monotone"
                dataKey="mensajes"
                name="Mensajes Intercambiados"
                stroke="#a855f7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMensajes)"
              />
            )}

            {(filterMetric === 'all' || filterMetric === 'appointments') && (
              <Area
                type="monotone"
                dataKey="citasBot"
                name="Citas Agendadas x Bot"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCitas)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
