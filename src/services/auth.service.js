import api from './api'

const authService = {
  login: (username, password) =>
    api.post('/api/auth/login', { username, password }).then((r) => r.data.data),

  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }).then((r) => r.data),
}

export default authService
