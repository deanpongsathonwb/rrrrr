import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { PortalLayout } from '@/src/components/layout/PortalLayout';
import { RoleGuard } from '@/src/routes/guards/RoleGuard';
import { ROUTES } from '@/src/constants/routes';

import { HomePage } from '@/src/pages/HomePage';
import { SubmitComplaintPage } from '@/src/pages/SubmitComplaintPage';
import { TrackComplaintPage } from '@/src/pages/TrackComplaintPage';
import { StatisticsPage } from '@/src/pages/StatisticsPage';
import { FaqPage } from '@/src/pages/FaqPage';
import { LoginPage } from '@/src/pages/LoginPage';
import { OfficerComplaintsPage } from '@/src/pages/OfficerComplaintsPage';
import { OfficerSettingsPage } from '@/src/pages/OfficerSettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Production Login - Standalone, Isolated Security Interface */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* 2. Public Citizen Portal - Open Access, No Login Required */}
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SUBMIT} element={<SubmitComplaintPage />} />
        <Route path={ROUTES.TRACK} element={<TrackComplaintPage />} />
        <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
        <Route path={ROUTES.FAQ} element={<FaqPage />} />
      </Route>

      {/* 3. Authenticated Officer Portal - Operational Portal for Field & Department Officers */}
      <Route element={<RoleGuard allowedRoles={['officer', 'admin']} />}>
        <Route element={<PortalLayout />}>
          <Route path={ROUTES.OFFICER_ROOT} element={<Navigate to={ROUTES.OFFICER_COMPLAINTS} replace />} />
          <Route path={ROUTES.OFFICER_COMPLAINTS} element={<OfficerComplaintsPage />} />
          <Route path={ROUTES.OFFICER_DASHBOARD} element={<Navigate to={ROUTES.OFFICER_COMPLAINTS} replace />} />
        </Route>
      </Route>

      {/* 4. Authenticated Administrator Portal - Central Management & Configuration */}
      <Route element={<RoleGuard allowedRoles={['admin']} />}>
        <Route element={<PortalLayout />}>
          <Route path={ROUTES.ADMIN_ROOT} element={<Navigate to={ROUTES.ADMIN_COMPLAINTS} replace />} />
          <Route path={ROUTES.ADMIN_COMPLAINTS} element={<OfficerComplaintsPage />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<OfficerSettingsPage />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<Navigate to={ROUTES.ADMIN_COMPLAINTS} replace />} />
          {/* Legacy route compatibility */}
          <Route path={ROUTES.OFFICER_SETTINGS} element={<OfficerSettingsPage />} />
        </Route>
      </Route>

      {/* Fallback to Citizen Portal */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
