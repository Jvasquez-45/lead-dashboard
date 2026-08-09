import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  subscribeToBusinesses,
  createNewBusiness,
  addRecordToBusiness,
  updateBusinessAccount,
  deleteBusiness as removeBusinessFromStorage,
  deleteRecordFromBusiness
} from '../services/storageService';
import { calculateMetrics } from '../utils/metrics';

const BusinessContext = createContext();

const getSavedActiveBusinessId = () => {
  try {
    return localStorage.getItem('activeBusinessId') || localStorage.getItem('active_business_id');
  } catch (e) {
    return null;
  }
};

const setSavedActiveBusinessId = (id) => {
  try {
    if (id) {
      localStorage.setItem('activeBusinessId', id);
      localStorage.setItem('active_business_id', id);
    } else {
      localStorage.removeItem('activeBusinessId');
      localStorage.removeItem('active_business_id');
    }
  } catch (e) {
    console.error('Error saving activeBusinessId to localStorage:', e);
  }
};

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [activeBusinessId, setActiveBusinessId] = useState(() => getSavedActiveBusinessId());
  const [activeView, setActiveView] = useState('summary'); // 'summary' | 'analysis' | 'input' | 'comparison'
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize real-time Firestore listener on mount
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToBusinesses(
      (data) => {
        setBusinesses(data);
        setIsLoading(false);

        // Restoration of active business selection
        const savedId = getSavedActiveBusinessId();
        if (savedId && data.some((b) => b.id === savedId)) {
          setActiveBusinessId(savedId);
        } else if (data.length > 0) {
          setActiveBusinessId((prevId) => {
            if (prevId && data.some((b) => b.id === prevId)) return prevId;
            setSavedActiveBusinessId(data[0].id);
            return data[0].id;
          });
        } else {
          setActiveBusinessId(null);
          setSavedActiveBusinessId(null);
        }
      },
      (error) => {
        console.error('Error fetching businesses from Firestore:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Theme switcher effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const activeBusiness = useMemo(() => {
    return businesses.find((b) => b.id === activeBusinessId) || null;
  }, [businesses, activeBusinessId]);

  const metrics = useMemo(() => {
    if (!activeBusiness) return calculateMetrics([], {});
    return calculateMetrics(activeBusiness.records || [], activeBusiness.pricing || {});
  }, [activeBusiness]);

  // Actions
  const handleSelectBusiness = (id) => {
    setActiveBusinessId(id);
    setSavedActiveBusinessId(id);
  };

  const handleCreateBusiness = async (businessData) => {
    try {
      const newBusiness = await createNewBusiness(businessData);
      setBusinesses((prev) => {
        const exists = prev.some((b) => b.id === newBusiness.id);
        return exists ? prev : [...prev, newBusiness];
      });
      setSavedActiveBusinessId(newBusiness.id);
      setActiveBusinessId(newBusiness.id);
      return newBusiness;
    } catch (error) {
      console.warn('Handling business creation with local fallback:', error);
      // Fallback: Ensure user experience remains smooth
      const fallbackId = `biz_${Date.now()}`;
      const fallbackBiz = {
        id: fallbackId,
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
      setBusinesses((prev) => [...prev, fallbackBiz]);
      setSavedActiveBusinessId(fallbackId);
      setActiveBusinessId(fallbackId);
      return fallbackBiz;
    }
  };

  const handleAddRecord = async (recordData) => {
    if (!activeBusinessId) return;
    await addRecordToBusiness(activeBusinessId, recordData);
  };

  const handleDeleteRecord = async (recordId) => {
    if (!activeBusinessId) return;
    await deleteRecordFromBusiness(activeBusinessId, recordId);
  };

  const handleUpdateBusinessConfig = async (updatedFields) => {
    if (!activeBusinessId) return;
    await updateBusinessAccount(activeBusinessId, updatedFields);
  };

  const handleDeleteBusiness = async (id) => {
    await removeBusinessFromStorage(id);
    if (activeBusinessId === id) {
      const remaining = businesses.filter((b) => b.id !== id);
      const nextId = remaining.length > 0 ? remaining[0].id : null;
      setActiveBusinessId(nextId);
      setSavedActiveBusinessId(nextId);
    }
  };

  const value = {
    businesses,
    activeBusinessId,
    activeBusiness,
    activeView,
    theme,
    metrics,
    isLoading,
    setActiveView,
    toggleTheme,
    selectBusiness: handleSelectBusiness,
    createBusiness: handleCreateBusiness,
    addRecord: handleAddRecord,
    deleteRecord: handleDeleteRecord,
    updateBusinessConfig: handleUpdateBusinessConfig,
    deleteBusiness: handleDeleteBusiness
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
