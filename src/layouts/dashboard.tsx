import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import { useSession } from '../hooks/useSession';
import { NavBar } from '@components/NavBar';

export default function Layout() {
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <DashboardLayout hideNavigation slots={{ toolbarActions: NavBar }}>
      <Outlet />
    </DashboardLayout>
  );
}
