/**
 * Firebase Cloud Firestore Controller for managing business analytics data
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'businesses';

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
      revenuePerAttendedAppointment: 150.00,
      operationalCosts: 0
    },
    records: [
      {
        id: 'rec_2026-08-01',
        date: '2026-08-01',
        metaAds: {
          level: 'ad',
          campaignName: 'Campaña Dental Principal',
          adSetName: 'Conjunto Ortodoncia 25-45',
          adName: 'Anuncio Video Sonrisas',
          results: 15,
          costPerResult: 8.00,
          amountSpent: 120.00,
          spend: 120.00,
          cpc: 1.25,
          impressions: 8500,
          reach: 6200,
          ctr: 3.12,
          thruplay: 2400,
          customFields: { adTarget: 'Local 10km radius', campaignType: 'Lead Gen' }
        },
        leads: {
          generalMetaConversations: 30,
          noAnswer: 12,
          inConversation: 28,
          scheduled: 10,
          noShow: 2,
          attended: 8
        },
        account: {
          adInvestment: 120.00,
          metaChats: 30,
          scheduledAppointments: 10,
          attendedAppointments: 8,
          costPerChat: 4.00
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
          level: 'adSet',
          campaignName: 'Campaña Retargeting',
          adSetName: 'Conjunto Ortodoncia LAL',
          adName: '',
          results: 18,
          costPerResult: 7.78,
          amountSpent: 140.00,
          spend: 140.00,
          cpc: 1.40,
          impressions: 9800,
          reach: 7100,
          ctr: 2.89,
          thruplay: 0,
          customFields: { adTarget: 'Intereses Ortodoncia', campaignType: 'Retargeting' }
        },
        leads: {
          generalMetaConversations: 35,
          noAnswer: 15,
          inConversation: 32,
          scheduled: 12,
          noShow: 3,
          attended: 9
        },
        account: {
          adInvestment: 140.00,
          metaChats: 35,
          scheduledAppointments: 12,
          attendedAppointments: 9,
          costPerChat: 4.00
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
          level: 'ad',
          campaignName: 'Campaña Direct Message',
          adSetName: 'Conjunto Lookalike 2%',
          adName: 'Anuncio Oferta Blanqueamiento',
          results: 22,
          costPerResult: 7.27,
          amountSpent: 160.00,
          spend: 160.00,
          cpc: 1.15,
          impressions: 11200,
          reach: 8400,
          ctr: 3.45,
          thruplay: 3200,
          customFields: { adTarget: 'Lookalike 2%', campaignType: 'Direct Message' }
        },
        leads: {
          generalMetaConversations: 42,
          noAnswer: 10,
          inConversation: 35,
          scheduled: 15,
          noShow: 2,
          attended: 13
        },
        account: {
          adInvestment: 160.00,
          metaChats: 42,
          scheduledAppointments: 15,
          attendedAppointments: 13,
          costPerChat: 3.81
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

/**
 * Seed initial data to Firestore if the collection is empty
 */
const seedInitialDataIfNeeded = async (snapshot) => {
  if (snapshot.empty) {
    for (const biz of DEFAULT_INITIAL_DATA) {
      await setDoc(doc(db, COLLECTION_NAME, biz.id), biz);
    }
  }
};

/**
 * Subscribe to real-time updates from Firestore
 */
export const subscribeToBusinesses = (onDataUpdate, onError) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        await seedInitialDataIfNeeded(snapshot);
        onDataUpdate(DEFAULT_INITIAL_DATA);
        return;
      }
      const businesses = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      onDataUpdate(businesses);
    },
    (err) => {
      console.error('Firestore onSnapshot error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Create a new business document in Firestore
 */
export const createNewBusiness = async (businessData) => {
  const newId = `biz_${Date.now()}`;
  const newBusiness = {
    id: newId,
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
      revenuePerAttendedAppointment: Number(businessData.revenuePerAttendedAppointment) || 0,
      operationalCosts: Number(businessData.operationalCosts) || 0
    },
    records: []
  };

  await setDoc(doc(db, COLLECTION_NAME, newId), newBusiness);
  return newBusiness;
};

/**
 * Add or update a record inside a business document in Firestore
 */
export const addRecordToBusiness = async (businessId, recordData) => {
  const bizRef = doc(db, COLLECTION_NAME, businessId);
  const snap = await getDoc(bizRef);
  if (!snap.exists()) return;

  const bizData = snap.data();
  const targetId = recordData.id || `rec_${recordData.date}_${Date.now()}`;
  const newRecord = {
    id: targetId,
    date: recordData.date || new Date().toISOString().split('T')[0],
    metaAds: {
      level: recordData.metaAds?.level || (recordData.metaAds?.adName ? 'ad' : 'adSet'),
      campaignName: recordData.metaAds?.campaignName || '',
      adSetName: recordData.metaAds?.adSetName || '',
      adName: recordData.metaAds?.adName || '',
      results: Number(recordData.metaAds?.results) || 0,
      costPerResult: Number(recordData.metaAds?.costPerResult) || 0,
      amountSpent: Number(recordData.metaAds?.amountSpent) || Number(recordData.metaAds?.spend) || 0,
      spend: Number(recordData.metaAds?.amountSpent) || Number(recordData.metaAds?.spend) || 0,
      cpc: Number(recordData.metaAds?.cpc) || 0,
      impressions: Number(recordData.metaAds?.impressions) || 0,
      reach: Number(recordData.metaAds?.reach) || 0,
      ctr: Number(recordData.metaAds?.ctr) || 0,
      thruplay: Number(recordData.metaAds?.thruplay) || 0,
      customFields: recordData.metaAds?.customFields || {}
    },
    leads: {
      generalMetaConversations: Number(recordData.leads?.generalMetaConversations) || Number(recordData.account?.metaChats) || 0,
      noAnswer: Number(recordData.leads?.noAnswer) || 0,
      inConversation: Number(recordData.leads?.inConversation) || 0,
      scheduled: Number(recordData.leads?.scheduled) || 0,
      noShow: Number(recordData.leads?.noShow) || 0,
      attended: Number(recordData.leads?.attended) || 0
    },
    account: {
      adInvestment: Number(recordData.account?.adInvestment) || Number(recordData.metaAds?.amountSpent) || 0,
      metaChats: Number(recordData.account?.metaChats) || Number(recordData.leads?.generalMetaConversations) || 0,
      scheduledAppointments: Number(recordData.account?.scheduledAppointments) || Number(recordData.leads?.scheduled) || 0,
      attendedAppointments: Number(recordData.account?.attendedAppointments) || Number(recordData.leads?.attended) || 0,
      costPerChat: Number(recordData.account?.costPerChat) || 0
    },
    viviBot: {
      dailyMessages: Number(recordData.viviBot?.dailyMessages) || 0,
      technicalErrors: Number(recordData.viviBot?.technicalErrors) || 0,
      botScheduledAppointments: Number(recordData.viviBot?.botScheduledAppointments) || 0,
      patternLog: recordData.viviBot?.patternLog || ''
    }
  };

  let updatedRecords = bizData.records || [];
  const existingIndex = recordData.id ? updatedRecords.findIndex((r) => r.id === recordData.id) : -1;
  if (existingIndex >= 0) {
    newRecord.id = updatedRecords[existingIndex].id;
    updatedRecords[existingIndex] = newRecord;
  } else {
    updatedRecords = [newRecord, ...updatedRecords];
  }

  // Sort by date descending
  updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

  await updateDoc(bizRef, { records: updatedRecords });
};

/**
 * Update business account config / pricing in Firestore
 */
export const updateBusinessAccount = async (businessId, updatedFields) => {
  const bizRef = doc(db, COLLECTION_NAME, businessId);
  const snap = await getDoc(bizRef);
  if (!snap.exists()) return;

  const bizData = snap.data();
  const mergedConfig = {
    ...bizData.businessAccountConfig,
    ...(updatedFields.businessAccountConfig || {})
  };
  const mergedPricing = {
    ...bizData.pricing,
    ...(updatedFields.pricing || {})
  };

  const payload = {
    ...updatedFields,
    businessAccountConfig: mergedConfig,
    pricing: mergedPricing
  };

  await updateDoc(bizRef, payload);
};

/**
 * Delete a business document from Firestore
 */
export const deleteBusiness = async (businessId) => {
  await deleteDoc(doc(db, COLLECTION_NAME, businessId));
};

/**
 * Delete a record from a business document in Firestore
 */
export const deleteRecordFromBusiness = async (businessId, recordId) => {
  const bizRef = doc(db, COLLECTION_NAME, businessId);
  const snap = await getDoc(bizRef);
  if (!snap.exists()) return;

  const bizData = snap.data();
  const updatedRecords = (bizData.records || []).filter((r) => r.id !== recordId);
  await updateDoc(bizRef, { records: updatedRecords });
};
