import { Navigate, Outlet } from 'react-router-dom';
import { useOrganization } from '../context/OrganizationContext';

export default function RequireOrganization() {
  const { isOrganizationSelected } = useOrganization();

  if (!isOrganizationSelected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
