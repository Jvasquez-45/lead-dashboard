import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Percent } from 'lucide-react';

export const ConversionRateChart = ({ records = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!records || records.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
        <Percent className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
        <span className="text-xs text-slate-400 font-medium">
          Sin datos suficientes para calcular las Tasas de Conversión.
        </span>
      </div>
    );
  }

  // Calculate conversion rates
  let totalMetaConversations = 0;
  let totalScheduled = 0;
  let totalAttended = 0;

  records.forEach((rec) => {
    if (rec.leads) {
      totalScheduled += Number(rec.leads.scheduled) || 0;
      totalAttended += Number(rec.leads.attended) || 0;
      const metaConvs = Number(rec.leads.generalMetaConversations) || Number(rec.account?.metaChats) || Number(rec.leads.inConversation) || 0;
      totalMetaConversations += metaConvs;
    }
  });

  const chatConversionRate = totalMetaConversations > 0 ? (totalScheduled / totalMetaConversations) * 100 : 0;
  const attendanceRate = totalScheduled > 0 ? (totalAttended / totalScheduled) * 100 : 0;
  const overallConversionRate = totalMetaConversations > 0 ? (totalAttended / totalMetaConversations) * 100 : 0;

  const chartData = [
    {
      name: 'Cierre de Chat (Meta -> Cita)',
      porcentaje: Number(chatConversionRate.toFixed(1)),
      color: '#a970ff',
      description: 'Conversaciones en Meta que reservaron cita'
    },
    {
      name: 'Asistencia (Citas -> Asistieron)',
      porcentaje: Number(attendanceRate.toFixed(1)),
      color: '#34d399',
      description: 'Citas agendadas que asistieron exitosamente'
    },
    {
      name: 'Conversión Global (Meta -> Cita Real)',
      porcentaje: Number(overallConversionRate.toFixed(1)),
      color: '#fbbf24',
      description: 'Efectividad directa desde el chat hasta el cliente en local'
    }
  ];

  const handleClick = (data, index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-2xl shadow-2xl border border-slate-700 text-xs">
          <div className="font-extrabold text-white text-sm">{data.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-black text-white text-xl">{data.porcentaje}%</span>
          </div>
          <div className="text-[11px] text-slate-300 opacity-80 mt-1">
            {data.description}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#a970ff]/20 text-[#a970ff]">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              Análisis de Tasas de Conversión (%)
            </h3>
            <p className="text-[11px] text-slate-400">
              Rendimiento porcentual en cada etapa del proceso de ventas.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            barSize={48}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="porcentaje"
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

      {/* Conversion KPI Pills */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-[#11141d] border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Cierre Chat</span>
          <span className="text-sm font-black text-white">{chatConversionRate.toFixed(1)}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11141d] border border-slate-800 text-center">
          <span className="text-[9px] text-[#34d399] font-bold block uppercase">Asistencia</span>
          <span className="text-sm font-black text-[#34d399]">{attendanceRate.toFixed(1)}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11141d] border border-slate-800 text-center">
          <span className="text-[9px] text-[#fbbf24] font-bold block uppercase">Conv. Global</span>
          <span className="text-sm font-black text-[#fbbf24]">{overallConversionRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
