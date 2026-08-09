/**
 * Fault-Tolerant Dual Persistence Controller (Cloud Firestore + LocalStorage)
 * Handles cases where Firestore database is not created yet or unreachable.
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
const LOCAL_STORAGE_KEY = 'business_analytics_dashboard_v1';

/**
 * LocalStorage Resilience Helpers
 */
export const getStoredBusinesses = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveStoredBusinesses = (businesses) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(businesses));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Subscribe to real-time updates from Firestore with LocalStorage fallback
 */
export const subscribeToBusinesses = (onDataUpdate, onError) => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          const localData = getStoredBusinesses();
          onDataUpdate(localData);
          return;
        }
        const businesses = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        saveStoredBusinesses(businesses);
        onDataUpdate(businesses);
      },
      (err) => {
        console.warn('Firestore onSnapshot warning/error (using LocalStorage fallback):', err?.message || err);
        const localData = getStoredBusinesses();
        onDataUpdate(localData);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Firestore subscription failed initialization, using local fallback:', err?.message || err);
    const localData = getStoredBusinesses();
    onDataUpdate(localData);
    return () => {};
  }
};

/**
 * Create a new business document in Firestore and LocalStorage
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

  // 1. Guaranteed local save
  const currentLocal = getStoredBusinesses();
  const updatedLocal = [...currentLocal.filter((b) => b.id !== newId), newBusiness];
  saveStoredBusinesses(updatedLocal);

  // 2. Cloud Firestore save (safe catch if database not found yet)
  try {
    await setDoc(doc(db, COLLECTION_NAME, newId), newBusiness);
  } catch (err) {
    console.warn('Could not save to Cloud Firestore (database not found or offline). Saved locally:', err?.message || err);
  }

  return newBusiness;
};

/**
 * Add or update a record inside a business document in Firestore and LocalStorage
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
      noAnswer: Number(recordData.leads?.noAnswer) || 0,
      inConversation: Number(recordData.leads?.inConversation) || 0,
      reactivation: Number(recordData.leads?.reactivation) || 0,
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

  // 1. Save to LocalStorage immediately
  const localList = getStoredBusinesses();
  const updatedLocal = localList.map((biz) => {
    if (biz.id === businessId) {
      let records = [...(biz.records || [])];
      const existingIdx = recordData.id ? records.findIndex((r) => r.id === recordData.id) : -1;
      if (existingIdx >= 0) {
        records[existingIdx] = newRecord;
      } else {
        records = [newRecord, ...records];
      }
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      return { ...biz, records };
    }
    return biz;
  });
  saveStoredBusinesses(updatedLocal);

  // 2. Try Firestore save
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
      const targetBiz = updatedLocal.find((b) => b.id === businessId);
      if (targetBiz) {
        await setDoc(bizRef, targetBiz);
      }
    }
  } catch (err) {
    console.warn('Could not update record in Cloud Firestore:', err?.message || err);
  }
};

/**
 * Update business account config / pricing in Firestore and LocalStorage
 */
export const updateBusinessAccount = async (businessId, updatedFields) => {
  // 1. Save to LocalStorage
  const localList = getStoredBusinesses();
  const updatedLocal = localList.map((biz) => {
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
  saveStoredBusinesses(updatedLocal);

  // 2. Try Firestore
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
    console.warn('Could not update account config in Cloud Firestore:', err?.message || err);
  }
};

/**
 * Delete a business document from Firestore and LocalStorage
 */
export const deleteBusiness = async (businessId) => {
  const localList = getStoredBusinesses();
  saveStoredBusinesses(localList.filter((b) => b.id !== businessId));

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, businessId));
  } catch (err) {
    console.warn('Could not delete business from Cloud Firestore:', err?.message || err);
  }
};

/**
 * Delete a record from a business document in Firestore and LocalStorage
 */
export const deleteRecordFromBusiness = async (businessId, recordId) => {
  const localList = getStoredBusinesses();
  const updatedLocal = localList.map((biz) => {
    if (biz.id === businessId) {
      return {
        ...biz,
        records: (biz.records || []).filter((r) => r.id !== recordId)
      };
    }
    return biz;
  });
  saveStoredBusinesses(updatedLocal);

  try {
    const bizRef = doc(db, COLLECTION_NAME, businessId);
    const snap = await getDoc(bizRef);
    if (snap.exists()) {
      const bizData = snap.data();
      const updatedRecords = (bizData.records || []).filter((r) => r.id !== recordId);
      await updateDoc(bizRef, { records: updatedRecords });
    }
  } catch (err) {
    console.warn('Could not delete record from Cloud Firestore:', err?.message || err);
  }
};
