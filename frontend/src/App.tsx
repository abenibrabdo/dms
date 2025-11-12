import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@layouts/AppLayout';
import { DashboardPage } from '@pages/DashboardPage';
import { DocumentsPage } from '@pages/DocumentsPage';
import { WorkflowsPage } from '@pages/WorkflowsPage';
import { NotificationsPage } from '@pages/NotificationsPage';
import { SettingsPage } from '@pages/SettingsPage';
import { AuthPage } from '@pages/AuthPage';

const App = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <AppLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardPage />
            </Suspense>
          </AppLayout>
        }
      />
      <Route
        path="/documents"
        element={
          <AppLayout>
            <DocumentsPage />
          </AppLayout>
        }
      />
      <Route
        path="/workflows"
        element={
          <AppLayout>
            <WorkflowsPage />
          </AppLayout>
        }
      />
      <Route
        path="/notifications"
        element={
          <AppLayout>
            <NotificationsPage />
          </AppLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

