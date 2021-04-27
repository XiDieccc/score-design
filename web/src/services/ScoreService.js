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
  },
  crawlerBegin(data) {
    return request.post(`/scores/crawler`, data)
  },
  search(data) {
    return request.get(`/search/${data}`)
  },
  async recommend(userId) {
    return request.get(`/recommend/${userId}`)
  }

}