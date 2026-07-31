import apiClient from './axios';

export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  FINALIZED: 'FINALIZED',
  ARCHIVED: 'ARCHIVED',
};

export const contractApi = {
  list: async ({ page = 1, pageSize = 25, search = '', status = '' } = {}) => {
    const response = await apiClient.get('/contracts', {
      params: {
        page,
        page_size: pageSize,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      },
    });
    return response.data;
  },

  getSummary: async () => {
    const response = await apiClient.get('/contracts');
    return response.data;
  },

  getRecentActivity: async (limit = 8) => {
    const response = await apiClient.get('/contracts/', {
      params: { limit },
    });
    return response.data;
  },

  getById: async (contractId) => {
    const response = await apiClient.get(`/contracts/${contractId}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await apiClient.post('/contracts', payload);
    return response.data;
  },

 
  update: async (contractId, organizationId, payload) => {

    const response = await apiClient.put(
      `/contracts/${contractId}`,
      payload,
      {
        params: {
          organization_id: organizationId,
        },
      }
    );

    return response.data;
  },

  remove: async (contractId) => {
    const response = await apiClient.delete(`/contracts/${contractId}`);
    return response.data;
  },

  updateStatus: async (contractId, organizationId, status) => {
    const response = await apiClient.patch(
      `/contracts/${contractId}/status`,
      { status },
      {
        params: {
          organization_id: organizationId,
        },
      }
    );

    return response.data;
  },

  getAuditHistory: async (contractId) => {


    const response = await apiClient.get(`/contracts/${contractId}/events/`);
    return response.data;
  },
};
