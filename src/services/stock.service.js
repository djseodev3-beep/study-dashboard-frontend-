import api from './api'

const stockService = {
  getAll: () => api.get('/api/stocks').then((r) => r.data.data),
  create: (data) => api.post('/api/stocks', data).then((r) => r.data.data),
  update: (id, data) => api.put(`/api/stocks/${id}`, data).then((r) => r.data.data),
  delete: (id) => api.delete(`/api/stocks/${id}`).then((r) => r.data),
}

export default stockService
