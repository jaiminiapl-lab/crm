import React from 'react';
import { AppProviders } from './providers/AppProviders';
import { MainLayout } from './layouts/MainLayout';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </AppProviders>
  );
};

export default App;
