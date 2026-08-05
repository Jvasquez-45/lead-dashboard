import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

export const AppointmentsFunnelChart = ({ records = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!records || records.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">
        Sin datos de citas para mostrar. Registra información en 'Ingreso de datos'.
      </div>
    );
  }

  // Aggregate total appointments funnel
  let totalScheduled = 0;
  let totalNoShow = 0;
  let totalAttended = 0;

  records.forEach((rec) => {
    if (rec.leads) {
      totalScheduled += Number(rec.leads.scheduled) || 0;
      totalNoShow += Number(rec.leads.noShow) || 0;
      totalAttended += Number(rec.leads.attended) || 0;
    }
  });

  const chartData = [
    { name: 'Citas Agendadas', cantidad: totalScheduled, color: '#6366f1' }, // Indigo
    { name: 'No Asistieron (Ausentes)', cantidad: totalNoShow, color: '#f43f5e' }, // Rose
    { name: 'Asistieron (Exitosas)', cantidad: totalAttended, color: '#10b981' }, // Emerald
  ];

  const handleClick = (data, index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = totalScheduled || 1;
      const pct = ((data.cantidad / total) * 100).toFixed(1);

      return (
        <div className="glass-panel p-3 rounded-xl shadow-2xl border border-slate-700/80 text-xs">
          <div className="font-bold text-slate-200">{data.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-extrabold text-white text-base">{data.cantidad} citas</span>
            <span className="text-[11px] font-semibold text-indigo-400">({pct}% del total)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Haz clic en la barra para destacar esta métrica.
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          barSize={48}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cantidad"
            radius={[10, 10, 0, 0]}
            onClick={handleClick}
            className="cursor-pointer transition-all duration-300"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
