/**
 * LocalStorage Controller for managing business analytics data
 */

const STORAGE_KEY = 'business_analytics_dashboard_v1';

const DEFAULT_INITIAL_DATA = [
  {
    id: 'biz_demo_01',
    name: 'Clínica Odontológica Sonrisas',
    accountStatus: 'Óptima',
    businessAccountConfig: {
      problemSelector: 'Ninguno - Operando normalmente',
      executionLevel: 'Excelente (95%)',
      strategyNotes: 'Campañas de Remarketing en Meta Ads y embudo automatizado con VIVI Bot',
      implementationNotes: 'Mensajes personalizados pre-cita y confirmación automática'
    },
    pricing: {
      revenuePerScheduledAppointment: 25.00,
      revenuePerAttendedAppointment: 150.00
    },
    records: [
      {
        id: 'rec_2026-08-01',
        date: '2026-08-01',
        metaAds: {
          spend: 120.00,
          impressions: 8500,
          reach: 6200,
          ctr: 3.12,
          thruplay: 2400,
          customFields: { adTarget: 'Local 10km radius', campaignType: 'Lead Gen' }
        },
        leads: {
          noAnswer: 12,
          inConversation: 28,
          scheduled: 10,
          noShow: 2,
          attended: 8
        },
        viviBot: {
          dailyMessages: 210,
          technicalErrors: 0,
          botScheduledAppointments: 9,
          patternLog: 'Respuestas óptimas en horario vespertino'
        }
      },
      {
        id: 'rec_2026-08-02',
        date: '2026-08-02',
        metaAds: {
          spend: 140.00,
          impressions: 9800,
          reach: 7100,
          ctr: 2.89,
          thruplay: 2900,
          customFields: { adTarget: 'Intereses Ortodoncia', campaignType: 'Retargeting' }
        },
        leads: {
          noAnswer: 15,
          inConversation: 32,
          scheduled: 12,
          noShow: 3,
          attended: 9
        },
        viviBot: {
          dailyMessages: 280,
          technicalErrors: 1,
          botScheduledAppointments: 11,
          patternLog: 'Preguntas frecuentes sobre precios respondidas con éxito'
        }
      },
      {
        id: 'rec_2026-08-03',
        date: '2026-08-03',
        metaAds: {
          spend: 160.00,
          impressions: 11200,
          reach: 8400,
          ctr: 3.45,
          thruplay: 3200,
          customFields: { adTarget: 'Lookalike 2%', campaignType: 'Direct Message' }
        },
        leads: {
          noAnswer: 10,
          inConversation: 35,
          scheduled: 15,
          noShow: 2,
          attended: 13
        },
        viviBot: {
          dailyMessages: 340,
          technicalErrors: 0,
          botScheduledAppointments: 14,
          patternLog: 'Alta conversión con plantilla de bienvenida interactiva'
        }
      }
    ]
  }
];

export const getStoredBusinesses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_DATA));
      return DEFAULT_INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_INITIAL_DATA;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return DEFAULT_INITIAL_DATA;
  }
};

export const saveStoredBusinesses = (businesses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const createNewBusiness = (businessData) => {
  const businesses = getStoredBusinesses();
  const newBusiness = {
    id: `biz_${Date.now()}`,
    name: businessData.name || 'Nuevo Negocio',
    accountStatus: businessData.accountStatus || 'Pendiente de revisión',
    businessAccountConfig: {
      problemSelector: businessData.problemSelector || 'Por evaluar',
      executionLevel: businessData.executionLevel || 'Media',
      strategyNotes: businessData.strategyNotes || '',
      implementationNotes: businessData.implementationNotes || ''
    },
    pricing: {
      revenuePerScheduledAppointment: Number(businessData.revenuePerScheduledAppointment) || 0,
      revenuePerAttendedAppointment: Number(businessData.revenuePerAttendedAppointment) || 0
    },
    records: []
  };

  const updatedList = [...businesses, newBusiness];
  saveStoredBusinesses(updatedList);
  return { updatedList, newBusiness };
};

export const addRecordToBusiness = (businessId, recordData) => {
  const businesses = getStoredBusinesses();
  const updatedList = businesses.map((biz) => {
    if (biz.id === businessId) {
      const newRecord = {
        id: `rec_${recordData.date}_${Date.now()}`,
        date: recordData.date || new Date().toISOString().split('T')[0],
        metaAds: {
          spend: Number(recordData.metaAds?.spend) || 0,
          impressions: Number(recordData.metaAds?.impressions) || 0,
          reach: Number(recordData.metaAds?.reach) || 0,
          ctr: Number(recordData.metaAds?.ctr) || 0,
          thruplay: Number(recordData.metaAds?.thruplay) || 0,
          customFields: recordData.metaAds?.customFields || {}
        },
        leads: {
          noAnswer: Number(recordData.leads?.noAnswer) || 0,
          inConversation: Number(recordData.leads?.inConversation) || 0,
          scheduled: Number(recordData.leads?.scheduled) || 0,
          noShow: Number(recordData.leads?.noShow) || 0,
          attended: Number(recordData.leads?.attended) || 0
        },
        viviBot: {
          dailyMessages: Number(recordData.viviBot?.dailyMessages) || 0,
          technicalErrors: Number(recordData.viviBot?.technicalErrors) || 0,
          botScheduledAppointments: Number(recordData.viviBot?.botScheduledAppointments) || 0,
          patternLog: recordData.viviBot?.patternLog || ''
        }
      };

      // If record for the same date already exists, update it, otherwise prepend
      const existingIndex = biz.records.findIndex(r => r.date === newRecord.date);
      let updatedRecords = [...biz.records];
      if (existingIndex >= 0) {
        updatedRecords[existingIndex] = newRecord;
      } else {
        updatedRecords = [newRecord, ...updatedRecords];
      }

      // Sort by date descending
      updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

      return { ...biz, records: updatedRecords };
    }
    return biz;
  });

  saveStoredBusinesses(updatedList);
  return updatedList;
};

export const updateBusinessAccount = (businessId, updatedFields) => {
  const businesses = getStoredBusinesses();
  const updatedList = businesses.map((biz) => {
    if (biz.id === businessId) {
      return {
        ...biz,
        ...updatedFields,
        businessAccountConfig: {
          ...biz.businessAccountConfig,
          ...(updatedFields.businessAccountConfig || {})
        },
        pricing: {
          ...biz.pricing,
          ...(updatedFields.pricing || {})
        }
      };
    }
    return biz;
  });

  saveStoredBusinesses(updatedList);
  return updatedList;
};

export const deleteBusiness = (businessId) => {
  const businesses = getStoredBusinesses();
  const updatedList = businesses.filter(b => b.id !== businessId);
  saveStoredBusinesses(updatedList);
  return updatedList;
};
