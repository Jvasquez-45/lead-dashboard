/**
 * Firebase Cloud Firestore Controller for managing business analytics data
 * Strictly cloud-native persistence using Firebase Cloud Firestore SDK
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION_NAME = 'businesses';

/**
 * Subscribe to real-time updates strictly from Cloud Firestore
 */
export const subscribeToBusinesses = (onDataUpdate, onError) => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onDataUpdate([]);
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
  } catch (err) {
    console.error('Firestore subscription error:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Create a new business document in Cloud Firestore
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

  try {
    await setDoc(doc(db, COLLECTION_NAME, newId), newBusiness);
  } catch (err) {
    console.error('Error writing business to Cloud Firestore:', err);
  }

  return newBusiness;
};

/**
 * Add or update a record inside a business document in Cloud Firestore
 */
export const addRecordToBusiness = async (businessId, recordData) => {
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
      organicConversations: Number(recordData.leads?.organicConversations) || 0,
      noAnswer: Number(recordData.leads?.noAnswer) || 0,
      inConversation: Number(recordData.leads?.inConversation) || 0,
      reactivation: Number(recordData.leads?.reactivation) || 0,
      scheduled: Number(recordData.leads?.scheduled) || 0,
      noShow: Number(recordData.leads?.noShow) || 0,
      attended: Number(recordData.leads?.attended) || 0,
      handledBy: recordData.leads?.handledBy || 'bot',
      scheduledBy: recordData.leads?.scheduledBy || 'bot'
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

  try {
    const bizRef = doc(db, COLLECTION_NAME, businessId);
    const snap = await getDoc(bizRef);
    if (snap.exists()) {
      const bizData = snap.data();
      let records = bizData.records || [];
      const existingIndex = recordData.id ? records.findIndex((r) => r.id === recordData.id) : -1;
      if (existingIndex >= 0) {
        records[existingIndex] = newRecord;
      } else {
        records = [newRecord, ...records];
      }
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      await updateDoc(bizRef, { records });
    } else {
      const newBiz = {
        id: businessId,
        name: 'Nuevo Negocio',
        accountStatus: 'Óptima',
        businessAccountConfig: {
          problemSelector: 'Ninguno - Operación normal',
          executionLevel: 'Alta',
          strategyNotes: '',
          implementationNotes: ''
        },
        pricing: {
          revenuePerScheduledAppointment: 25,
          revenuePerAttendedAppointment: 150,
          operationalCosts: 0
        },
        records: [newRecord]
      };
      await setDoc(bizRef, newBiz);
    }
  } catch (err) {
    console.error('Error adding record to Cloud Firestore:', err);
  }
};

/**
 * Update business account config / pricing in Cloud Firestore
 */
export const updateBusinessAccount = async (businessId, updatedFields) => {
  try {
    const bizRef = doc(db, COLLECTION_NAME, businessId);
    const snap = await getDoc(bizRef);
    if (snap.exists()) {
      const bizData = snap.data();
      const mergedConfig = {
        ...bizData.businessAccountConfig,
        ...(updatedFields.businessAccountConfig || {})
      };
      const mergedPricing = {
        ...bizData.pricing,
        ...(updatedFields.pricing || {})
      };
      await updateDoc(bizRef, {
        ...updatedFields,
        businessAccountConfig: mergedConfig,
        pricing: mergedPricing
      });
    }
  } catch (err) {
    console.error('Error updating business account in Cloud Firestore:', err);
  }
};

/**
 * Delete a business document strictly from Cloud Firestore
 */
export const deleteBusiness = async (businessId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, businessId));
  } catch (err) {
    console.error('Error deleting business from Cloud Firestore:', err);
  }
};

/**
 * Delete a record from a business document strictly in Cloud Firestore
 */
export const deleteRecordFromBusiness = async (businessId, recordId) => {
  try {
    const bizRef = doc(db, COLLECTION_NAME, businessId);
    const snap = await getDoc(bizRef);
    if (snap.exists()) {
      const bizData = snap.data();
      const updatedRecords = (bizData.records || []).filter((r) => r.id !== recordId);
      await updateDoc(bizRef, { records: updatedRecords });
    }
  } catch (err) {
    console.error('Error deleting record from Cloud Firestore:', err);
  }
};
