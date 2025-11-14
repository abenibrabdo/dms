import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@layouts/AppLayout';
import { DashboardPage } from '@pages/DashboardPage';
import { DocumentsPage } from '@pages/DocumentsPage';
import { DocumentDetailsPage } from '@pages/DocumentDetailsPage';
import { WorkflowsPage } from '@pages/WorkflowsPage';
import { NotificationsPage } from '@pages/NotificationsPage';
import { SettingsPage } from '@pages/SettingsPage';
import { AuthPage } from '@pages/AuthPage';
import { AnalyticsPage } from '@pages/AnalyticsPage';
import { LocalizationPage } from '@pages/LocalizationPage';
import { AuditPage } from '@pages/AuditPage';
import { SyncPage } from '@pages/SyncPage';

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
        path="/documents/:documentId"
        element={
          <AppLayout>
            <DocumentDetailsPage />
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
      <Route
        path="/analytics"
        element={
          <AppLayout>
            <AnalyticsPage />
          </AppLayout>
        }
      />
      <Route
        path="/localization"
        element={
          <AppLayout>
            <LocalizationPage />
          </AppLayout>
        }
      />
      <Route
        path="/audit"
        element={
          <AppLayout>
            <AuditPage />
          </AppLayout>
        }
      />
      <Route
        path="/sync"
        element={
          <AppLayout>
            <SyncPage />
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

