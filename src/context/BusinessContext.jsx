import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  getStoredBusinesses,
  saveStoredBusinesses,
  createNewBusiness,
  addRecordToBusiness,
  updateBusinessAccount,
  deleteBusiness as removeBusinessFromStorage
} from '../services/storageService';
import { calculateMetrics } from '../utils/metrics';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [activeBusinessId, setActiveBusinessId] = useState(null);
  const [activeView, setActiveView] = useState('summary'); // 'summary' | 'analysis' | 'input' | 'comparison'
  const [theme, setTheme] = useState('dark');

  // Initialize data on mount
  useEffect(() => {
    const data = getStoredBusinesses();
    setBusinesses(data);
    if (data.length > 0) {
      setActiveBusinessId(data[0].id);
    }
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
  };

  const handleCreateBusiness = (businessData) => {
    const { updatedList, newBusiness } = createNewBusiness(businessData);
    setBusinesses(updatedList);
    setActiveBusinessId(newBusiness.id);
    return newBusiness;
  };

  const handleAddRecord = (recordData) => {
    if (!activeBusinessId) return;
    const updatedList = addRecordToBusiness(activeBusinessId, recordData);
    setBusinesses(updatedList);
  };

  const handleUpdateBusinessConfig = (updatedFields) => {
    if (!activeBusinessId) return;
    const updatedList = updateBusinessAccount(activeBusinessId, updatedFields);
    setBusinesses(updatedList);
  };

  const handleDeleteBusiness = (id) => {
    const updatedList = removeBusinessFromStorage(id);
    setBusinesses(updatedList);
    if (activeBusinessId === id) {
      setActiveBusinessId(updatedList.length > 0 ? updatedList[0].id : null);
    }
  };

  const value = {
    businesses,
    activeBusinessId,
    activeBusiness,
    activeView,
    theme,
    metrics,
    setActiveView,
    toggleTheme,
    selectBusiness: handleSelectBusiness,
    createBusiness: handleCreateBusiness,
    addRecord: handleAddRecord,
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
