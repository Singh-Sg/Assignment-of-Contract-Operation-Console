const STORAGE_KEY = 'coc_selected_organization';

let currentOrganization = null;
const listeners = new Set();

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

currentOrganization = loadFromStorage();

export function getSelectedOrganization() {
  return currentOrganization;
}

export function getSelectedOrganizationId() {
  return currentOrganization?.id ?? null;
}

export function setSelectedOrganization(org) {
  currentOrganization = org;
  try {
    if (org) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(org));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {

  }
  listeners.forEach((listener) => listener(currentOrganization));
}

export function clearSelectedOrganization() {
  setSelectedOrganization(null);
}

export function subscribeToOrganizationChanges(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
