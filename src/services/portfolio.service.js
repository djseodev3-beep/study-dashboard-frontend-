import api from './api'

const portfolioService = {
  get: () => api.get('/api/portfolio').then((r) => r.data.data),
  addItem: (data) => api.post('/api/portfolio/items', data).then((r) => r.data.data),
  updateItem: (id, data) => api.put(`/api/portfolio/items/${id}`, data).then((r) => r.data.data),
  deleteItem: (id) => api.delete(`/api/portfolio/items/${id}`).then((r) => r.data),
}

export default portfolioService
