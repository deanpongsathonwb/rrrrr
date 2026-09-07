import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/src/stores/auth.store';
import { useUiStore } from '@/src/stores/ui.store';
import { ROUTES, UI } from '@/src/constants';
import { OfficerRoleType } from '@/src/types/common.types';
import { useEffect } from 'react';

interface RoleGuardProps {
  allowedRoles: OfficerRoleType[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { isAuthenticated, currentOfficer } = useAuthStore();
  const { showToast } = useUiStore();

  const isAllowed =
    isAuthenticated && currentOfficer && allowedRoles.includes(currentOfficer.roleType);

  useEffect(() => {
    if (isAuthenticated && currentOfficer && !allowedRoles.includes(currentOfficer.roleType)) {
      showToast(UI.portals.unauthorized, 'error');
    }
  }, [isAuthenticated, currentOfficer, allowedRoles, showToast]);

  if (!isAuthenticated || !currentOfficer) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAllowed) {
    // Route automatically to their authorized portal
    if (currentOfficer.roleType === 'admin') {
      return <Navigate to={ROUTES.ADMIN_COMPLAINTS} replace />;
    }
    return <Navigate to={ROUTES.OFFICER_COMPLAINTS} replace />;
  }

  return <Outlet />;
};
