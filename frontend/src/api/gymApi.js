import httpClient from './httpClient';

const unwrap = (promise) => promise.then((response) => response.data);

export const memberApi = {
  list: () => unwrap(httpClient.get('/members')),
  create: (payload) => unwrap(httpClient.post('/members', payload)),
  update: (id, payload) => unwrap(httpClient.put(`/members/${id}`, payload)),
  remove: (id) => unwrap(httpClient.delete(`/members/${id}`)),
  search: (term) => unwrap(httpClient.get('/members/search', { params: { term } })),
  findByEmail: async (email) => {
    try {
      const response = await httpClient.get('/members/by-email', { params: { email } });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  assignPackage: (memberId, packageId) =>
    unwrap(httpClient.post(`/members/${memberId}/assign-package/${packageId}`))
};

export const billApi = {
  list: () => unwrap(httpClient.get('/bills')),
  listByMember: (memberId) => unwrap(httpClient.get(`/bills/member/${memberId}`)),
  search: (term) => unwrap(httpClient.get('/bills/search', { params: { term } })),
  create: (payload) => unwrap(httpClient.post('/bills', payload))
};

export const feePackageApi = {
  list: () => unwrap(httpClient.get('/fee-packages')),
  create: (payload) => unwrap(httpClient.post('/fee-packages', payload))
};

export const notificationApi = {
  list: (audience) =>
    unwrap(
      httpClient.get('/notifications', {
        params: audience ? { audience } : undefined
      })
    ),
  create: (payload) => unwrap(httpClient.post('/notifications', payload)),
  markAsRead: (id) => unwrap(httpClient.patch(`/notifications/${id}/read`))
};

export const supplementApi = {
  list: (term) =>
    unwrap(
      httpClient.get('/supplements', {
        params: term ? { term } : undefined
      })
    ),
  create: (payload) => unwrap(httpClient.post('/supplements', payload)),
  update: (id, payload) => unwrap(httpClient.put(`/supplements/${id}`, payload)),
  remove: (id) => unwrap(httpClient.delete(`/supplements/${id}`))
};

export const dietPlanApi = {
  list: () => unwrap(httpClient.get('/diet-plans')),
  create: (payload) => unwrap(httpClient.post('/diet-plans', payload)),
  update: (id, payload) => unwrap(httpClient.put(`/diet-plans/${id}`, payload)),
  remove: (id) => unwrap(httpClient.delete(`/diet-plans/${id}`))
};

export const reportApi = {
  fetch: ({ type, startDate, endDate }) => {
    const params = { type };
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    return unwrap(httpClient.get('/reports', { params }));
  }
};

