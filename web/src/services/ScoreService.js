import request from './index'

export default {
  create(data) {
    return request.post('/scores', data)
  },
  update(id, data) {
    return request.put(`/scores/${id}`, data)
  },
  getById(id) {
    return request.get(`/scores/${id}`)
  },
  getAll(query = '') {
    return request.get(`/scores?${query}`)
  }
}