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
  Trash2
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export const DataInputView = () => {
  const { activeBusiness, addRecord, updateBusinessConfig } = useBusiness();
  const [activeTab, setActiveTab] = useState('metaAds'); // 'metaAds' | 'leads' | 'bot' | 'account'
  const [notification, setNotification] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Form states
  const [metaData, setMetaData] = useState({
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
    accountStatus: activeBusiness?.accountStatus || 'Óptima',
    problemSelector: activeBusiness?.businessAccountConfig?.problemSelector || '',
    executionLevel: activeBusiness?.businessAccountConfig?.executionLevel || 'Alta',
    strategyNotes: activeBusiness?.businessAccountConfig?.strategyNotes || '',
    implementationNotes: activeBusiness?.businessAccountConfig?.implementationNotes || '',
    revenuePerScheduledAppointment: activeBusiness?.pricing?.revenuePerScheduledAppointment || '25',
    revenuePerAttendedAppointment: activeBusiness?.pricing?.revenuePerAttendedAppointment || '150'
  });

  if (!activeBusiness) return null;

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
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
      date,
      metaAds: {
        campaignName: metaData.campaignName,
        adSetName: metaData.adSetName,
        adName: metaData.adName,
        results: Number(metaData.results) || 0,
        costPerResult: Number(metaData.costPerResult) || 0,
        amountSpent: Number(metaData.amountSpent) || 0,
        cpc: Number(metaData.cpc) || 0,
        spend: Number(metaData.amountSpent) || 0,
        impressions: Number(metaData.impressions) || 0,
        reach: Number(metaData.reach) || 0,
        ctr: Number(metaData.ctr) || 0,
        thruplay: Number(metaData.thruplay) || 0,
        customFields: customFieldsObj
      },
      leads: {
        noAnswer: Number(leadsData.noAnswer) || 0,
        inConversation: Number(leadsData.inConversation) || 0,
        scheduled: Number(leadsData.scheduled) || 0,
        noShow: Number(leadsData.noShow) || 0,
        attended: Number(leadsData.attended) || 0
      },
      viviBot: {
        dailyMessages: Number(botData.dailyMessages) || 0,
        technicalErrors: Number(botData.technicalErrors) || 0,
        botScheduledAppointments: Number(botData.botScheduledAppointments) || 0,
        patternLog: botData.patternLog
      }
    };

    addRecord(recordPayload);
    showToast(`¡Registro para la fecha ${date} guardado exitosamente!`);
  };

  const handleSaveAccountConfig = (e) => {
    e.preventDefault();
    updateBusinessConfig({
      accountStatus: accountData.accountStatus,
      businessAccountConfig: {
        problemSelector: accountData.problemSelector,
        executionLevel: accountData.executionLevel,
        strategyNotes: accountData.strategyNotes,
        implementationNotes: accountData.implementationNotes
      },
      pricing: {
        revenuePerScheduledAppointment: Number(accountData.revenuePerScheduledAppointment) || 0,
        revenuePerAttendedAppointment: Number(accountData.revenuePerAttendedAppointment) || 0
      }
    });

    showToast('Configuración y parámetros del negocio actualizados correctamente.');
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
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'leads'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30'
              : 'glass-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Clientes Potenciales</span>
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
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'account'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 border border-purple-400/30'
              : 'glass-panel text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>4. Cuenta & Estrategia</span>
        </button>
      </div>

      {/* TAB CONTENT FORMS */}

      {/* 1. Meta Ads Form */}
      {activeTab === 'metaAds' && (
        <form onSubmit={handleSubmitRecord} className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <span>Métricas de Campañas Publicitarias Meta Ads</span>
          </h2>

          {/* Jerarquía de Anuncios / Identificación */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estructura &amp; Identificación de Campaña
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> Guardar Registro Diario
            </button>
          </div>
        </form>
      )}

      {/* 2. Leads Funnel Form */}
      {activeTab === 'leads' && (
        <form onSubmit={handleSubmitRecord} className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-5">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Contadores del Embudo de Clientes Potenciales</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                value={leadsData.scheduled}
                onChange={(e) => setLeadsData({ ...leadsData, scheduled: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                value={leadsData.attended}
                onChange={(e) => setLeadsData({ ...leadsData, attended: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> Guardar Registro Diario
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

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> Guardar Registro Diario
            </button>
          </div>
        </form>
      )}

      {/* 4. Business Account & Strategy Form */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccountConfig} className="glass-panel p-6 rounded-3xl border border-purple-900/30 space-y-5">
          <h2 className="text-base font-bold text-purple-300 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Configuración General de la Cuenta del Negocio</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estado del Cliente
              </label>
              <select
                value={accountData.accountStatus}
                onChange={(e) => setAccountData({ ...accountData, accountStatus: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
              >
                <option value="Óptima">🟢 Óptima</option>
                <option value="Pendiente de revisión">🟡 Pendiente de revisión</option>
                <option value="Atorada">🔴 Atorada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selector de Problemas Identificados
              </label>
              <input
                type="text"
                placeholder="Ej: Baja tasa de respuesta en WhatsApp"
                value={accountData.problemSelector}
                onChange={(e) => setAccountData({ ...accountData, problemSelector: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nivel de Ejecución
              </label>
              <select
                value={accountData.executionLevel}
                onChange={(e) => setAccountData({ ...accountData, executionLevel: e.target.value })}
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
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estrategia Aplicada
              </label>
              <textarea
                rows={3}
                placeholder="Descripción de la estrategia de marketing y embudo..."
                value={accountData.strategyNotes}
                onChange={(e) => setAccountData({ ...accountData, strategyNotes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detalles de Implementación
              </label>
              <textarea
                rows={3}
                placeholder="Herramientas activas, integraciones VIVI Bot, secuencias de correo..."
                value={accountData.implementationNotes}
                onChange={(e) => setAccountData({ ...accountData, implementationNotes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> Actualizar Configuración de Cuenta
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
