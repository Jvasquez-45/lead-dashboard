import React from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { WatchdogBoundary } from './components/errorBoundary/WatchdogBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { AccountSummaryView } from './views/AccountSummaryView';
import { DetailedAnalysisView } from './views/DetailedAnalysisView';
import { DataInputView } from './views/DataInputView';
import { ComparisonView } from './views/ComparisonView';

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
    <div className="relative flex items-center justify-center mb-6">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="absolute w-8 h-8 bg-indigo-500/20 rounded-full blur-md animate-pulse"></div>
    </div>
    <h2 className="text-xl font-black text-slate-100 tracking-tight mb-2">
      Conectando a Cloud Firestore...
    </h2>
    <p className="text-xs text-slate-400 max-w-sm">
      Sincronizando métricas e historial global desde la nube en tiempo real.
    </p>
  </div>
);

const ViewRenderer = () => {
  const { activeView, isLoading } = useBusiness();

  if (isLoading) {
    return <LoadingScreen />;
  }

  switch (activeView) {
    case 'summary':
      return <AccountSummaryView />;
    case 'analysis':
      return <DetailedAnalysisView />;
    case 'input':
      return <DataInputView />;
    case 'comparison':
      return <ComparisonView />;
    default:
      return <AccountSummaryView />;
  }
};

export function App() {
  return (
    <BusinessProvider>
      <WatchdogBoundary>
        <MainLayout>
          <ViewRenderer />
        </MainLayout>
      </WatchdogBoundary>
    </BusinessProvider>
  );
}

export default App;
