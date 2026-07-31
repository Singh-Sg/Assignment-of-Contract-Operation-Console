import axios from 'axios';
import { getSelectedOrganizationId } from '../context/organizationStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const organizationId = getSelectedOrganizationId();

  if (organizationId) {
    const method = (config.method || 'get').toLowerCase();

    if (method === 'get' || method === 'delete') {
      config.params = { organization_id: organizationId, ...config.params };
    } else if (['post', 'put', 'patch'].includes(method)) {
      if (config.data instanceof FormData) {
        if (!config.data.has('organization_id')) {
          config.data.append('organization_id', organizationId);
        }
      } else {
        config.data = { organization_id: organizationId, ...(config.data || {}) };
      }
    }
  }

  return config;
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null;
    const data = error.response?.data;

    let message = 'Something went wrong. Please try again.';
    let fieldErrors = null;

    if (!error.response) {
      message = 'Unable to reach the server. Check your connection and try again.';
    } else if (typeof data === 'string') {
      message = data;
    } else if (data?.detail) {
      if (Array.isArray(data.detail)) {
        fieldErrors = data.detail.reduce((acc, item) => {
          const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : 'form';
          acc[field] = item.msg;
          return acc;
        }, {});
        message = 'Please correct the highlighted fields.';
      } else {
        message = data.detail;
      }
    } else if (data?.message) {
      message = data.message;
    }

    return Promise.reject({
      status,
      message,
      fieldErrors,
      raw: error,
    });
  }
);

export default apiClient;
export { API_BASE_URL };
