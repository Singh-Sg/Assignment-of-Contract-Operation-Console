import apiClient from './axios';

export const organizationApi = {
  
  list: async () => {
    const response = await apiClient.get('/organizations');
    return response.data;
  },

  getById: async (organizationId) => {
    const response = await apiClient.get(`/organizations/${organizationId}`);
    return response.data;
  },
};
