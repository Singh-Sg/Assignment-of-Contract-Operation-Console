import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getSelectedOrganization,
  setSelectedOrganization as persistSelectedOrganization,
  clearSelectedOrganization as persistClearSelectedOrganization,
  subscribeToOrganizationChanges,
} from './organizationStore';

const OrganizationContext = createContext(undefined);

export function OrganizationProvider({ children }) {
  const [organization, setOrganization] = useState(() => getSelectedOrganization());

  useEffect(() => {
    const unsubscribe = subscribeToOrganizationChanges((next) => setOrganization(next));

    const handleStorage = (event) => {
      if (event.key === 'coc_selected_organization') {
        setOrganization(getSelectedOrganization());
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const selectOrganization = useCallback((org) => {
    persistSelectedOrganization(org);
    setOrganization(org);
  }, []);

  const clearOrganization = useCallback(() => {
    persistClearSelectedOrganization();
    setOrganization(null);
  }, []);

  const value = useMemo(
    () => ({
      organization,
      organizationId: organization?.id ?? null,
      isOrganizationSelected: Boolean(organization),
      selectOrganization,
      clearOrganization,
    }),
    [organization, selectOrganization, clearOrganization]
  );

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
