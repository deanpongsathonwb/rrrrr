import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/src/stores/auth.store';
import { ROUTES } from '@/src/constants/routes';

export const AuthGuard = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
