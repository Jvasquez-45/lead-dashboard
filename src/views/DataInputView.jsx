import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Users,
  Bot,
  Building2,
  Plus,
  Trash2,
  History,
  Edit3,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Target,
  Calculator,
  Compass,
  Lightbulb
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const DataInputView = () => {
  const { activeBusiness, addRecord, deleteRecord, updateBusinessConfig } = useBusiness();
  const [activeTab, setActiveTab] = useState('metaAds'); // 'metaAds' | 'leads' | 'bot' | 'account' | 'strategy'
  const [notification, setNotification] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDeleteRecordItem = (recordId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro del historial?')) {
      deleteRecord(recordId);
      if (editingRecordId === recordId) {
        resetForm();
      }
      showToast('Registro eliminado con éxito', 'success');
    }
  };

  // Form states
  const [metaData, setMetaData] = useState({
    level: 'adSet', // 'adSet' | 'ad'
    campaignName: '',
    adSetName: '',
    adName: '',
    results: '',
    costPerResult: '',
    amountSpent: '',
    cpc: '',
    impressions: '',
    reach: '',
    ctr: '',
    thruplay: '',
    customFieldKey: '',
    customFieldValue: '',
    customFieldsList: []
  });

  const [leadsData, setLeadsData] = useState({
    generalMetaConversations: '',
    noAnswer: '',
    inConversation: '',
    scheduled: '',
    noShow: '',
    attended: ''
  });

  const [botData, setBotData] = useState({
    dailyMessages: '',
    technicalErrors: '0',
    botScheduledAppointments: '',
    patternLog: ''
  });

  const [accountData, setAccountData] = useState({
    adInvestment: '',
    metaChats: '',
    scheduledAppointments: '',
    attendedAppointments: '',
    costPerChat: '',
    revenuePerScheduledAppointment: activeBusiness?.pricing?.revenuePerScheduledAppointment || '25',
    revenuePerAttendedAppointment: activeBusiness?.pricing?.revenuePerAttendedAppointment || '150',
    operationalCosts: activeBusiness?.pricing?.operationalCosts || '0'
  });

  const [strategyData, setStrategyData] = useState({
    accountStatus: activeBusiness?.accountStatus || 'Óptima',
    problemSelector: activeBusiness?.businessAccountConfig?.problemSelector || '',
    executionLevel: activeBusiness?.businessAccountConfig?.executionLevel || 'Alta',
    strategyNotes: activeBusiness?.businessAccountConfig?.strategyNotes || '',
    implementationNotes: activeBusiness?.businessAccountConfig?.implementationNotes || '',
    customFieldKey: '',
    customFieldValue: '',
    customStrategyFields: []
  });

  if (!activeBusiness) return null;

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const resetForm = () => {
    setEditingRecordId(null);
    setMetaData({
      level: 'adSet',
      campaignName: '',
      adSetName: '',
      adName: '',
      results: '',
      costPerResult: '',
      amountSpent: '',
      cpc: '',
      impressions: '',
      reach: '',
      ctr: '',
      thruplay: '',
      customFieldKey: '',
      customFieldValue: '',
      customFieldsList: []
    });
    setLeadsData({
      generalMetaConversations: '',
      noAnswer: '',
      inConversation: '',
      scheduled: '',
      noShow: '',
      attended: ''
    });
    setBotData({
      dailyMessages: '',
      technicalErrors: '0',
      botScheduledAppointments: '',
      patternLog: ''
    });
    setAccountData((prev) => ({
      ...prev,
      adInvestment: '',
      metaChats: '',
      scheduledAppointments: '',
      attendedAppointments: '',
      costPerChat: ''
    }));
  };

  const handleEditRecord = (record) => {
    setEditingRecordId(record.id);
    if (record.date) setDate(record.date);

    const customList = record.metaAds?.customFields
      ? Object.entries(record.metaAds.customFields).map(([key, value]) => ({ key, value }))
      : [];

    const inferredLevel = record.metaAds?.level || (record.metaAds?.adName ? 'ad' : 'adSet');

    setMetaData({
      level: inferredLevel,
      campaignName: record.metaAds?.campaignName || '',
      adSetName: record.metaAds?.adSetName || '',
      adName: record.metaAds?.adName || '',
      results: record.metaAds?.results ?? '',
      costPerResult: record.metaAds?.costPerResult ?? '',
      amountSpent: record.metaAds?.amountSpent ?? record.metaAds?.spend ?? '',
      cpc: record.metaAds?.cpc ?? '',
      impressions: record.metaAds?.impressions ?? '',
      reach: record.metaAds?.reach ?? '',
      ctr: record.metaAds?.ctr ?? '',
      thruplay: record.metaAds?.thruplay ?? '',
      customFieldKey: '',
      customFieldValue: '',
      customFieldsList: customList
    });

    setLeadsData({
      generalMetaConversations: record.leads?.generalMetaConversations ?? record.account?.metaChats ?? '',
      noAnswer: record.leads?.noAnswer ?? '',
      inConversation: record.leads?.inConversation ?? '',
      scheduled: record.leads?.scheduled ?? '',
      noShow: record.leads?.noShow ?? '',
      attended: record.leads?.attended ?? ''
    });

    setBotData({
      dailyMessages: record.viviBot?.dailyMessages ?? '',
      technicalErrors: record.viviBot?.technicalErrors ?? '0',
      botScheduledAppointments: record.viviBot?.botScheduledAppointments ?? '',
      patternLog: record.viviBot?.patternLog || ''
    });

    setAccountData((prev) => ({
      ...prev,
      adInvestment: record.account?.adInvestment ?? record.metaAds?.amountSpent ?? '',
      metaChats: record.account?.metaChats ?? record.leads?.generalMetaConversations ?? '',
      scheduledAppointments: record.account?.scheduledAppointments ?? record.leads?.scheduled ?? '',
      attendedAppointments: record.account?.attendedAppointments ?? record.leads?.attended ?? '',
      costPerChat: record.account?.costPerChat ?? ''
    }));

    setActiveTab('metaAds');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCustomField = () => {
    if (!metaData.customFieldKey.trim()) return;
    setMetaData((prev) => ({
      ...prev,
      customFieldsList: [
        ...prev.customFieldsList,
        { key: prev.customFieldKey, value: prev.customFieldValue }
      ],
      customFieldKey: '',
      customFieldValue: ''
    }));
  };

  const handleRemoveCustomField = (index) => {
    setMetaData((prev) => ({
      ...prev,
      customFieldsList: prev.customFieldsList.filter((_, i) => i !== index)
    }));
  };

  const handleAddStrategyField = () => {
    if (!strategyData.customFieldKey.trim()) return;
    setStrategyData((prev) => ({
      ...prev,
      customStrategyFields: [
        ...prev.customStrategyFields,
        { key: prev.customFieldKey, value: prev.customFieldValue }
      ],
      customFieldKey: '',
      customFieldValue: ''
    }));
  };

  const handleRemoveStrategyField = (index) => {
    setStrategyData((prev) => ({
      ...prev,
      customStrategyFields: prev.customStrategyFields.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitRecord = (e) => {
    e.preventDefault();

    if (!date) {
      showToast('Por favor selecciona una fecha válida.', 'error');
      return;
    }

    const customFieldsObj = {};
    metaData.customFieldsList.forEach((item) => {
      if (item.key) customFieldsObj[item.key] = item.value;
    });

    const recordPayload = {
      ...(editingRecordId ? { id: editingRecordId } : {}),
      date,
      metaAds: {
        level: metaData.level || 'adSet',
        campaignName: metaData.campaignName,
        adSetName: metaData.adSetName,
        adName: metaData.level === 'ad' ? metaData.adName : '',
        results: Number(metaData.results) || 0,
        costPerResult: Number(metaData.costPerResult) || 0,
        amountSpent: Number(metaData.amountSpent) || 0,
        cpc: Number(metaData.cpc) || 0,
        spend: Number(metaData.amountSpent) || 0,
        impressions: Number(metaData.impressions) || 0,
        reach: Number(metaData.reach) || 0,
        ctr: Number(metaData.ctr) || 0,
        thruplay: metaData.level === 'ad' ? (Number(metaData.thruplay) || 0) : 0,
        customFields: customFieldsObj
      },
      leads: {
        generalMetaConversations: Number(leadsData.generalMetaConversations) || 0,
        noAnswer: Number(leadsData.noAnswer) || 0,
        inConversation: Number(leadsData.inConversation) || 0,
        scheduled: Number(leadsData.scheduled) || 0,
        noShow: Number(leadsData.noShow) || 0,
        attended: Number(leadsData.attended) || 0
      },
      account: {
        adInvestment: Number(accountData.adInvestment) || Number(metaData.amountSpent) || 0,
        metaChats: Number(accountData.metaChats) || Number(leadsData.generalMetaConversations) || 0,
        scheduledAppointments: Number(accountData.scheduledAppointments) || Number(leadsData.scheduled) || 0,
        attendedAppointments: Number(accountData.attendedAppointments) || Number(leadsData.attended) || 0,
        costPerChat: Number(accountData.costPerChat) || 0
      },
      viviBot: {
        dailyMessages: Number(botData.dailyMessages) || 0,
        technicalErrors: Number(botData.technicalErrors) || 0,
        botScheduledAppointments: Number(botData.botScheduledAppointments) || 0,
        patternLog: botData.patternLog
      }
    };

    addRecord(recordPayload);
    showToast(editingRecordId ? 'Registro actualizado con éxito' : 'Registro guardado con éxito');
    resetForm();
  };

  const handleSaveAccountConfig = (e) => {
    e.preventDefault();

    if (!date) {
      showToast('Por favor selecciona una fecha válida.', 'error');
      return;
    }

    // 1. Guardar parámetros financieros globales
    updateBusinessConfig({
      pricing: {
        revenuePerScheduledAppointment: Number(accountData.revenuePerScheduledAppointment) || 0,
        revenuePerAttendedAppointment: Number(accountData.revenuePerAttendedAppointment) || 0,
        operationalCosts: Number(accountData.operationalCosts) || 0
      }
    });

    // 2. Guardar registro diario del embudo y la cuenta
    const customFieldsObj = {};
    metaData.customFieldsList.forEach((item) => {
      if (item.key) customFieldsObj[item.key] = item.value;
    });

    const metaChatsVal = Number(leadsData.generalMetaConversations) || Number(accountData.metaChats) || 0;
    const scheduledVal = Number(leadsData.scheduled) || Number(accountData.scheduledAppointments) || 0;
    const attendedVal = Number(leadsData.attended) || Number(accountData.attendedAppointments) || 0;

    const recordPayload = {
      ...(editingRecordId ? { id: editingRecordId } : {}),
      date,
      metaAds: {
        level: metaData.level || 'adSet',
        campaignName: metaData.campaignName,
        adSetName: metaData.adSetName,
        adName: metaData.level === 'ad' ? metaData.adName : '',
        results: Number(metaData.results) || 0,
        costPerResult: Number(metaData.costPerResult) || 0,
        amountSpent: Number(metaData.amountSpent) || Number(accountData.adInvestment) || 0,
        cpc: Number(metaData.cpc) || 0,
        spend: Number(metaData.amountSpent) || Number(accountData.adInvestment) || 0,
        impressions: Number(metaData.impressions) || 0,
        reach: Number(metaData.reach) || 0,
        ctr: Number(metaData.ctr) || 0,
        thruplay: metaData.level === 'ad' ? (Number(metaData.thruplay) || 0) : 0,
        customFields: customFieldsObj
      },
      leads: {
        generalMetaConversations: metaChatsVal,
        noAnswer: Number(leadsData.noAnswer) || 0,
        inConversation: Number(leadsData.inConversation) || 0,
        scheduled: scheduledVal,
        noShow: Number(leadsData.noShow) || 0,
        attended: attendedVal
      },
      account: {
        adInvestment: Number(accountData.adInvestment) || Number(metaData.amountSpent) || 0,
        metaChats: metaChatsVal,
        scheduledAppointments: scheduledVal,
        attendedAppointments: attendedVal,
        costPerChat: Number(accountData.costPerChat) || 0
      },
      viviBot: {
        dailyMessages: Number(botData.dailyMessages) || 0,
        technicalErrors: Number(botData.technicalErrors) || 0,
        botScheduledAppointments: Number(botData.botScheduledAppointments) || 0,
        patternLog: botData.patternLog
      }
    };

    addRecord(recordPayload);
    showToast(editingRecordId ? 'Datos de Cuenta y registro actualizados con éxito' : 'Registro de Cuenta guardado con éxito');
    resetForm();
  };

  const handleSaveStrategyConfig = (e) => {
    e.preventDefault();
    updateBusinessConfig({
      accountStatus: strategyData.accountStatus,
      businessAccountConfig: {
        problemSelector: strategyData.problemSelector,
        executionLevel: strategyData.executionLevel,
        strategyNotes: strategyData.strategyNotes,
        implementationNotes: strategyData.implementationNotes,
        customStrategyFields: strategyData.customStrategyFields
      }
    });

    showToast('Estrategia y notas descriptivas de la cuenta actualizadas correctamente.');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
                Ingreso de Datos & Formularios
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                Alimenta la base de datos de <span className="text-indigo-400 font-bold">{activeBusiness.name}</span>. Los gráficos se actualizarán automáticamente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">Fecha de Registro:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Categorized Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('metaAds')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'metaAds'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30'
              : 'glass-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>1. Campañas Meta Ads</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'account' || activeTab === 'leads'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 border border-emerald-400/30'
              : 'glass-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Cuenta</span>
        </button>

        <button
          onClick={() => setActiveTab('bot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'bot'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30'
              : 'glass-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>3. Bot VIVI</span>
        </button>

        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'strategy'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 border border-purple-400/30'
              : 'glass-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>4. Estrategia</span>
        </button>
      </div>

      {/* TAB CONTENT FORMS */}

      {/* 1. Meta Ads Form */}
      {activeTab === 'metaAds' && (
        <form onSubmit={handleSubmitRecord} className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              <span>Métricas de Campañas Publicitarias Meta Ads</span>
            </h2>

            {/* Sub-Selector de Nivel: Conjunto vs Anuncio */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setMetaData((prev) => ({ ...prev, level: 'adSet' }))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  (metaData.level || 'adSet') === 'adSet'
                    ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" /> Nivel Conjunto de Anuncio
              </button>
              <button
                type="button"
                onClick={() => setMetaData((prev) => ({ ...prev, level: 'ad' }))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  metaData.level === 'ad'
                    ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" /> Nivel Anuncio Individual
              </button>
            </div>
          </div>

          {/* Jerarquía de Anuncios / Identificación */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estructura &amp; Identificación ({metaData.level === 'ad' ? 'Anuncio Individual' : 'Conjunto de Anuncio'})
            </h3>
            <div className={`grid grid-cols-1 ${metaData.level === 'ad' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de campaña
                </label>
                <input
                  type="text"
                  placeholder="Ej: Campaña Leads Q3"
                  value={metaData.campaignName}
                  onChange={(e) => setMetaData({ ...metaData, campaignName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del conjunto de anuncio
                </label>
                <input
                  type="text"
                  placeholder="Ej: Público Objetivo 25-45"
                  value={metaData.adSetName}
                  onChange={(e) => setMetaData({ ...metaData, adSetName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              {metaData.level === 'ad' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del anuncio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Video Promocional Sonrisas"
                    value={metaData.adName}
                    onChange={(e) => setMetaData({ ...metaData, adName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Métricas Principales de Rendimiento y Costes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Métricas de Rendimiento &amp; Costes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Importe gastado
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={metaData.amountSpent}
                  onChange={(e) => setMetaData({ ...metaData, amountSpent: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resultado
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={metaData.results}
                  onChange={(e) => setMetaData({ ...metaData, results: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Coste por resultado
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={metaData.costPerResult}
                  onChange={(e) => setMetaData({ ...metaData, costPerResult: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CPC
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={metaData.cpc}
                  onChange={(e) => setMetaData({ ...metaData, cpc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Impresiones Totales
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={metaData.impressions}
                  onChange={(e) => setMetaData({ ...metaData, impressions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alcance (Personas)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={metaData.reach}
                  onChange={(e) => setMetaData({ ...metaData, reach: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CTR (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 3.25"
                  value={metaData.ctr}
                  onChange={(e) => setMetaData({ ...metaData, ctr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thruplay (Reproducciones de video)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={metaData.thruplay}
                  onChange={(e) => setMetaData({ ...metaData, thruplay: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-indigo-400 block">Campos Personalizados Meta Ads</span>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nombre del campo (Ej: CPM)"
                value={metaData.customFieldKey}
                onChange={(e) => setMetaData({ ...metaData, customFieldKey: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="Valor (Ej: $14.50)"
                value={metaData.customFieldValue}
                onChange={(e) => setMetaData({ ...metaData, customFieldValue: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomField}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            {metaData.customFieldsList.length > 0 && (
              <div className="space-y-1 pt-2">
                {metaData.customFieldsList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-800">
                    <span><strong>{item.key}:</strong> {item.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(idx)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {editingRecordId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all border border-slate-700"
              >
                <XCircle className="w-4 h-4 text-rose-400" /> Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> {editingRecordId ? 'Actualizar Registro' : 'Guardar Registro Diario'}
            </button>
          </div>
        </form>
      )}

      {/* 2. Unified Account & Leads Form */}
      {(activeTab === 'account' || activeTab === 'leads') && (
        <form onSubmit={handleSaveAccountConfig} className="glass-panel p-6 rounded-3xl border border-emerald-900/30 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>2. Datos de Cuenta &amp; Embudo de Clientes Potenciales</span>
            </h2>
            <span className="text-xs text-slate-400">Ingresa los contadores de clientes, inversión publicitaria y tarifas financieras</span>
          </div>

          {/* Bloque 1: Contadores del Embudo de Clientes Potenciales */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>1) Contadores del Embudo de Prospectos del Día</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                <label className="block text-xs font-extrabold text-indigo-300 mb-1">
                  1) Conversaciones Generales en Meta del día
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={leadsData.generalMetaConversations || accountData.metaChats}
                  onChange={(e) => {
                    setLeadsData({ ...leadsData, generalMetaConversations: e.target.value });
                    setAccountData((prev) => ({ ...prev, metaChats: e.target.value }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-indigo-500/50 text-sm font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-indigo-400/80 block mt-1">Chats totales generados en Meta</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  No Contestaron
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={leadsData.noAnswer}
                  onChange={(e) => setLeadsData({ ...leadsData, noAnswer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  En Conversación
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={leadsData.inConversation}
                  onChange={(e) => setLeadsData({ ...leadsData, inConversation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agendados a Cita
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={leadsData.scheduled || accountData.scheduledAppointments}
                  onChange={(e) => {
                    setLeadsData({ ...leadsData, scheduled: e.target.value });
                    setAccountData((prev) => ({ ...prev, scheduledAppointments: e.target.value }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-purple-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  No Asistieron
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={leadsData.noShow}
                  onChange={(e) => setLeadsData({ ...leadsData, noShow: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1">
                  Asistieron (Citas Exitosas)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={leadsData.attended || accountData.attendedAppointments}
                  onChange={(e) => {
                    setLeadsData({ ...leadsData, attended: e.target.value });
                    setAccountData((prev) => ({ ...prev, attendedAppointments: e.target.value }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-sm font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Bloque 2: Inversión Publicitaria & Costo por Chat */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>2) Inversión Publicitaria y Costo por Chat</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inversión en Publicidad ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={accountData.adInvestment}
                  onChange={(e) => setAccountData({ ...accountData, adInvestment: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo por Chat ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={
                    Number(accountData.adInvestment) > 0 && (Number(leadsData.generalMetaConversations) || Number(accountData.metaChats)) > 0
                      ? (Number(accountData.adInvestment) / (Number(leadsData.generalMetaConversations) || Number(accountData.metaChats))).toFixed(2)
                      : "Auto o Manual"
                  }
                  value={accountData.costPerChat}
                  onChange={(e) => setAccountData({ ...accountData, costPerChat: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Tarifario & Parámetros Financieros */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              3) Tarifas de Ganancias &amp; Costos Operativos Generales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ganancia Estimada x Cita Agendada ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={accountData.revenuePerScheduledAppointment}
                  onChange={(e) => setAccountData({ ...accountData, revenuePerScheduledAppointment: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ganancia Real x Cita Asistida ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={accountData.revenuePerAttendedAppointment}
                  onChange={(e) => setAccountData({ ...accountData, revenuePerAttendedAppointment: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costos Operativos Generales ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={accountData.operationalCosts}
                  onChange={(e) => setAccountData({ ...accountData, operationalCosts: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-rose-300 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingRecordId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all border border-slate-700"
              >
                <XCircle className="w-4 h-4 text-rose-400" /> Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> {editingRecordId ? 'Actualizar Registro de Cuenta' : 'Guardar Registro de Cuenta'}
            </button>
          </div>
        </form>
      )}

      {/* 3. Bot VIVI Form */}
      {activeTab === 'bot' && (
        <form onSubmit={handleSubmitRecord} className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-5">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>Métricas y Registro de Patrones de Bot VIVI</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mensajes Diarios Intercambiados
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={botData.dailyMessages}
                onChange={(e) => setBotData({ ...botData, dailyMessages: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contador de Errores Técnicos
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={botData.technicalErrors}
                onChange={(e) => setBotData({ ...botData, technicalErrors: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Citas Agendadas Exclusivas x Bot
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={botData.botScheduledAppointments}
                onChange={(e) => setBotData({ ...botData, botScheduledAppointments: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Registro de Patrones Identificados
            </label>
            <textarea
              rows={3}
              placeholder="Ej: Los usuarios responden más rápido en horario nocturno. Alta objeción en precios."
              value={botData.patternLog}
              onChange={(e) => setBotData({ ...botData, patternLog: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            {editingRecordId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all border border-slate-700"
              >
                <XCircle className="w-4 h-4 text-rose-400" /> Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> {editingRecordId ? 'Actualizar Registro' : 'Guardar Registro Diario'}
            </button>
          </div>
        </form>
      )}

      {/* 5. Estrategia Form (Notas Descriptivas & Personalizadas) */}
      {activeTab === 'strategy' && (
        <form onSubmit={handleSaveStrategyConfig} className="glass-panel p-6 rounded-3xl border border-purple-900/30 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-purple-300 flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <span>5. Diagnóstico &amp; Estrategia de la Cuenta</span>
            </h2>
            <span className="text-xs text-slate-400">Rellena los campos descriptivos y observaciones personalizadas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estado del Cliente
              </label>
              <select
                value={strategyData.accountStatus}
                onChange={(e) => setStrategyData({ ...strategyData, accountStatus: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
              >
                <option value="Óptima">🟢 Óptima</option>
                <option value="Pendiente de revisión">🟡 Pendiente de revisión</option>
                <option value="Atorada">🔴 Atorada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selector de Problema Identificado
              </label>
              <input
                type="text"
                placeholder="Ej: Objeción de precio / Baja respuesta"
                value={strategyData.problemSelector}
                onChange={(e) => setStrategyData({ ...strategyData, problemSelector: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nivel de Ejecución
              </label>
              <select
                value={strategyData.executionLevel}
                onChange={(e) => setStrategyData({ ...strategyData, executionLevel: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
              >
                <option value="Alta">Alta (90-100%)</option>
                <option value="Media">Media (50-89%)</option>
                <option value="Baja">Baja (&lt;50%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estrategia Publicitaria Aplicada
              </label>
              <textarea
                rows={4}
                placeholder="Describe la estrategia de marketing, embudo de ventas y ofertas activas..."
                value={strategyData.strategyNotes}
                onChange={(e) => setStrategyData({ ...strategyData, strategyNotes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detalles de Implementación VIVI Bot &amp; Automatizaciones
              </label>
              <textarea
                rows={4}
                placeholder="Registra secuencias activas, integraciones con VIVI Bot, recordatorios..."
                value={strategyData.implementationNotes}
                onChange={(e) => setStrategyData({ ...strategyData, implementationNotes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Campos Descriptivos Personalizados */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-purple-300 block flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-purple-400" /> Campos Descriptivos Personalizados
            </span>
            <p className="text-[11px] text-slate-400">Añade cualquier nota u observación estratégica personalizada a la cuenta:</p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nombre del campo (Ej: Canal Principal)"
                value={strategyData.customFieldKey}
                onChange={(e) => setStrategyData({ ...strategyData, customFieldKey: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="Valor (Ej: WhatsApp Directo + Remarketing)"
                value={strategyData.customFieldValue}
                onChange={(e) => setStrategyData({ ...strategyData, customFieldValue: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleAddStrategyField}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            {strategyData.customStrategyFields?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {strategyData.customStrategyFields.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-800">
                    <span><strong>{item.key}:</strong> {item.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStrategyField(idx)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> Guardar Notas de Estrategia
            </button>
          </div>
        </form>
      )}

      {/* Historial de Registros Ingresados */}
      {(() => {
        const allRecords = activeBusiness?.records || [];
        const totalPages = Math.ceil(allRecords.length / ITEMS_PER_PAGE) || 1;
        const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
        const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
        const currentRecords = allRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span>Historial de Registros Ingresados</span>
              </h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {allRecords.length} registros totales
              </span>
            </div>

            {allRecords.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic">
                No hay registros guardados para {activeBusiness.name}. Los registros que guardes aparecerán aquí.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="py-2.5 px-3">Nivel</th>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Nombre / Identificación</th>
                        <th className="py-2.5 px-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {currentRecords.map((rec) => {
                        const isAdLevel = rec.metaAds?.level === 'ad' || Boolean(rec.metaAds?.adName);
                        return (
                          <tr
                            key={rec.id}
                            className={`hover:bg-slate-800/40 transition-colors ${
                              editingRecordId === rec.id ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''
                            }`}
                          >
                            <td className="py-3 px-3">
                              {isAdLevel ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                                  <Target className="w-3 h-3" /> Anuncio
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                                  <FolderTree className="w-3 h-3" /> Conjunto
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-200">{rec.date}</td>
                            <td className="py-3 px-3 text-slate-300">
                              {isAdLevel ? (
                                <div>
                                  <span className="font-bold text-slate-100">{rec.metaAds?.adName || 'Sin Nombre de Anuncio'}</span>
                                  <span className="text-slate-400 block text-[10px]">Conjunto: {rec.metaAds?.adSetName || 'N/A'}</span>
                                </div>
                              ) : (
                                <div>
                                  <span className="font-bold text-slate-100">{rec.metaAds?.adSetName || 'Sin Nombre de Conjunto'}</span>
                                  <span className="text-slate-400 block text-[10px]">Campaña: {rec.metaAds?.campaignName || 'N/A'}</span>
                                </div>
                              )}
                            </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditRecord(rec)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all text-xs font-bold"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRecordItem(rec.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-all text-xs font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-800/80 text-xs font-semibold text-slate-400">
                    <span>
                      Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, allRecords.length)} de {allRecords.length} registros
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={validCurrentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" /> Anterior
                      </button>
                      <span className="px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-800 text-slate-200">
                        Página {validCurrentPage} de {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={validCurrentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Siguiente <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

    </div>
  );
};
