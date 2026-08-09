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

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [activeBusinessId, setActiveBusinessId] = useState(null);
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

        // Active business persistence
        const savedActiveId = localStorage.getItem('active_business_id');
        if (savedActiveId && data.some((b) => b.id === savedActiveId)) {
          setActiveBusinessId(savedActiveId);
        } else if (data.length > 0) {
          setActiveBusinessId((prevId) => {
            if (prevId && data.some((b) => b.id === prevId)) return prevId;
            localStorage.setItem('active_business_id', data[0].id);
            return data[0].id;
          });
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
    localStorage.setItem('active_business_id', id);
  };

  const handleCreateBusiness = async (businessData) => {
    try {
      const newBusiness = await createNewBusiness(businessData);
      setActiveBusinessId(newBusiness.id);
      localStorage.setItem('active_business_id', newBusiness.id);
      return newBusiness;
    } catch (error) {
      console.error('Error al guardar nuevo negocio en Cloud Firestore:', error);
      throw error;
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
      if (nextId) localStorage.setItem('active_business_id', nextId);
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
