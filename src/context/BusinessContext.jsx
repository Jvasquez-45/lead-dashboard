import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  getStoredBusinesses,
  saveStoredBusinesses,
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

  // Initialize data on mount
  useEffect(() => {
    const data = getStoredBusinesses();
    setBusinesses(data);
    const savedActiveId = localStorage.getItem('active_business_id');
    if (savedActiveId && data.some((b) => b.id === savedActiveId)) {
      setActiveBusinessId(savedActiveId);
    } else if (data.length > 0) {
      setActiveBusinessId(data[0].id);
      localStorage.setItem('active_business_id', data[0].id);
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
    localStorage.setItem('active_business_id', id);
  };

  const handleCreateBusiness = (businessData) => {
    const { updatedList, newBusiness } = createNewBusiness(businessData);
    setBusinesses(updatedList);
    setActiveBusinessId(newBusiness.id);
    localStorage.setItem('active_business_id', newBusiness.id);
    return newBusiness;
  };

  const handleAddRecord = (recordData) => {
    if (!activeBusinessId) return;
    const updatedList = addRecordToBusiness(activeBusinessId, recordData);
    setBusinesses(updatedList);
  };

  const handleDeleteRecord = (recordId) => {
    if (!activeBusinessId) return;
    const updatedList = deleteRecordFromBusiness(activeBusinessId, recordId);
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
