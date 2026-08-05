import React from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { WatchdogBoundary } from './components/errorBoundary/WatchdogBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { AccountSummaryView } from './views/AccountSummaryView';
import { DetailedAnalysisView } from './views/DetailedAnalysisView';
import { DataInputView } from './views/DataInputView';
import { ComparisonView } from './views/ComparisonView';

const ViewRenderer = () => {
  const { activeView } = useBusiness();

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
