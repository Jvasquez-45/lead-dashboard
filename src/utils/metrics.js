/**
 * Utility functions for Business Analytics calculations
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX').format(num || 0);
};

export const formatPercent = (val) => {
  return `${(val || 0).toFixed(2)}%`;
};

/**
 * Calculates summary metrics for a business based on its recorded data and pricing setup
 * @param {Array} records Array of daily/periodic record objects
 * @param {Object} pricing Pricing per scheduled and attended appointment
 * @returns {Object} Calculated metrics summary
 */
export const calculateMetrics = (records = [], pricing = {}) => {
  const revPerScheduled = Number(pricing.revenuePerScheduledAppointment) || 0;
  const revPerAttended = Number(pricing.revenuePerAttendedAppointment) || 0;

  if (!records || records.length === 0) {
    return {
      totalScheduled: 0,
      totalAttended: 0,
      totalNoShow: 0,
      totalNoAnswer: 0,
      totalInConversation: 0,
      totalLeads: 0,
      attendanceRate: 0,
      noShowRate: 0,
      totalSpend: 0,
      totalImpressions: 0,
      totalReach: 0,
      totalThruplay: 0,
      avgCTR: 0,
      revenueFromScheduled: 0,
      revenueFromAttended: 0,
      totalGrossRevenue: 0,
      netProfit: 0,
      roiPercentage: 0,
      roiMultiplier: 0,
      viviBotMessages: 0,
      viviBotErrors: 0,
      viviBotAppointments: 0,
      dynamicConclusion: "Aún no se han ingresado datos para esta cuenta. Utiliza el módulo 'Ingreso de datos' para comenzar.",
    };
  }

  let totalScheduled = 0;
  let totalAttended = 0;
  let totalNoShow = 0;
  let totalNoAnswer = 0;
  let totalInConversation = 0;

  let totalSpend = 0;
  let totalImpressions = 0;
  let totalReach = 0;
  let totalThruplay = 0;
  let sumCTR = 0;
  let ctrCount = 0;

  let viviBotMessages = 0;
  let viviBotErrors = 0;
  let viviBotAppointments = 0;

  records.forEach((rec) => {
    // Leads
    if (rec.leads) {
      totalScheduled += Number(rec.leads.scheduled) || 0;
      totalAttended += Number(rec.leads.attended) || 0;
      totalNoShow += Number(rec.leads.noShow) || 0;
      totalNoAnswer += Number(rec.leads.noAnswer) || 0;
      totalInConversation += Number(rec.leads.inConversation) || 0;
    }

    // Meta Ads
    if (rec.metaAds) {
      totalSpend += Number(rec.metaAds.amountSpent) || Number(rec.metaAds.spend) || 0;
      totalImpressions += Number(rec.metaAds.impressions) || 0;
      totalReach += Number(rec.metaAds.reach) || 0;
      totalThruplay += Number(rec.metaAds.thruplay) || 0;
      if (rec.metaAds.ctr !== undefined && rec.metaAds.ctr !== null) {
        sumCTR += Number(rec.metaAds.ctr) || 0;
        ctrCount++;
      }
    }

    // VIVI Bot
    if (rec.viviBot) {
      viviBotMessages += Number(rec.viviBot.dailyMessages) || 0;
      viviBotErrors += Number(rec.viviBot.technicalErrors) || 0;
      viviBotAppointments += Number(rec.viviBot.botScheduledAppointments) || 0;
    }
  });

  const totalLeads = totalNoAnswer + totalInConversation + totalScheduled;
  const attendanceRate = totalScheduled > 0 ? (totalAttended / totalScheduled) * 100 : 0;
  const noShowRate = totalScheduled > 0 ? (totalNoShow / totalScheduled) * 100 : 0;
  const avgCTR = ctrCount > 0 ? sumCTR / ctrCount : 0;

  // Gross Revenues
  const revenueFromScheduled = totalScheduled * revPerScheduled;
  const revenueFromAttended = totalAttended * revPerAttended;
  const totalGrossRevenue = revenueFromScheduled + revenueFromAttended;
  const netProfit = totalGrossRevenue - totalSpend;

  // ROI calculation
  const roiPercentage = totalSpend > 0 ? ((totalGrossRevenue - totalSpend) / totalSpend) * 100 : (totalGrossRevenue > 0 ? 100 : 0);
  const roiMultiplier = totalSpend > 0 ? totalGrossRevenue / totalSpend : (totalGrossRevenue > 0 ? 1 : 0);

  // Dynamic Conclusion as requested:
  // "Con esta cuenta hemos agendado [X] citas, [Y] no están presentes, y [Z] fueron a las citas. El retorno fue [W]"
  const formattedRoi = totalSpend > 0
    ? `${roiPercentage.toFixed(1)}% (${roiMultiplier.toFixed(2)}x ROI)`
    : (totalGrossRevenue > 0 ? `${formatCurrency(totalGrossRevenue)} generados (Sin gasto reg.)` : "0%");

  const dynamicConclusion = `Con esta cuenta hemos agendado ${totalScheduled} citas, ${totalNoShow} no están presentes, y ${totalAttended} fueron a las citas. El retorno fue ${formattedRoi}.`;

  return {
    totalScheduled,
    totalAttended,
    totalNoShow,
    totalNoAnswer,
    totalInConversation,
    totalLeads,
    attendanceRate,
    noShowRate,
    totalSpend,
    totalImpressions,
    totalReach,
    totalThruplay,
    avgCTR,
    revenueFromScheduled,
    revenueFromAttended,
    totalGrossRevenue,
    netProfit,
    roiPercentage,
    roiMultiplier,
    viviBotMessages,
    viviBotErrors,
    viviBotAppointments,
    dynamicConclusion,
  };
};

/**
 * Filters records by a date range (for comparison panel)
 */
export const filterRecordsByDate = (records = [], startDate, endDate) => {
  if (!startDate && !endDate) return records;

  return records.filter((rec) => {
    if (!rec.date) return false;
    const recDate = new Date(rec.date);
    if (startDate && recDate < new Date(startDate)) return false;
    if (endDate && recDate > new Date(endDate)) return false;
    return true;
  });
};
