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
import { TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/metrics';

export const RoiPerformanceChart = ({ records = [], pricing = {} }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!records || records.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
        <TrendingUp className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
        <span className="text-xs text-slate-400 font-medium">
          Sin datos de inversión o ingresos para calcular el ROI.
        </span>
      </div>
    );
  }

  // Aggregate totals
  let totalSpend = 0;
  let totalScheduled = 0;
  let totalAttended = 0;

  const revPerScheduled = Number(pricing.revenuePerScheduledAppointment) || 0;
  const revPerAttended = Number(pricing.revenuePerAttendedAppointment) || 0;
  const operationalCosts = Number(pricing.operationalCosts) || 0;

  records.forEach((rec) => {
    if (rec.leads) {
      totalScheduled += Number(rec.leads.scheduled) || 0;
      totalAttended += Number(rec.leads.attended) || 0;
    }
    if (rec.metaAds) {
      totalSpend += Number(rec.metaAds.amountSpent) || Number(rec.metaAds.spend) || 0;
    } else if (rec.account?.adInvestment) {
      totalSpend += Number(rec.account.adInvestment) || 0;
    }
  });

  const totalGrossRevenue = (totalScheduled * revPerScheduled) + (totalAttended * revPerAttended);
  const grossProfit = totalGrossRevenue - totalSpend;
  const netProfit = totalGrossRevenue - (totalSpend + operationalCosts);

  const roasMultiplier = totalSpend > 0 ? totalGrossRevenue / totalSpend : (totalGrossRevenue > 0 ? 1 : 0);
  const roiPercentage = totalSpend > 0 ? ((totalGrossRevenue - totalSpend) / totalSpend) * 100 : (totalGrossRevenue > 0 ? 100 : 0);

  const chartData = [
    {
      name: 'Inversión Publicitaria',
      monto: Math.round(totalSpend),
      color: '#a970ff',
      description: 'Presupuesto total invertido en Meta Ads'
    },
    {
      name: 'Ingresos Brutos',
      monto: Math.round(totalGrossRevenue),
      color: '#34d399',
      description: 'Ventas brutas generadas por citas agendadas y asistidas'
    },
    {
      name: 'Beneficio Neto',
      monto: Math.round(netProfit),
      color: '#fbbf24',
      description: 'Ganancia neta descontando publicidad y costos operacionales'
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
            <span className="font-black text-white text-xl">{formatCurrency(data.monto)}</span>
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
          <div className="p-2 rounded-xl bg-[#34d399]/20 text-[#34d399]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              ROI (Retorno de la Inversión) & Rentabilidad
            </h3>
            <p className="text-[11px] text-slate-400">
              Comparativa de dinero invertido vs ingresos generados y ganancias.
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-[#34d399]/10 border border-[#34d399]/30 text-right">
          <span className="text-[9px] text-[#34d399] font-extrabold uppercase block">ROI %</span>
          <span className="text-xs font-black text-white">{roiPercentage.toFixed(1)}%</span>
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
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="monto"
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

      {/* ROI & ROAS KPI Summary Bar */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-[#11141d] border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-bold block uppercase">ROAS Multiplicador</span>
          <span className="text-sm font-black text-white">{roasMultiplier.toFixed(2)}x</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11141d] border border-slate-800 text-center">
          <span className="text-[9px] text-[#34d399] font-bold block uppercase">ROI Porcentual</span>
          <span className="text-sm font-black text-[#34d399]">{roiPercentage.toFixed(1)}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11141d] border border-slate-800 text-center">
          <span className="text-[9px] text-[#fbbf24] font-bold block uppercase">Beneficio Neto</span>
          <span className="text-sm font-black text-[#fbbf24]">{formatCurrency(netProfit)}</span>
        </div>
      </div>
    </div>
  );
};
