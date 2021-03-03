import http from "../http-common";

class DataService {
  constructor(){
    const user = localStorage.getItem('user');
    const token = JSON.parse((user))
    this.headers = {
      'Content-Type': 'application/json;charset=utf-8'
    };
    this.headers['Authorization'] = ''
    if(token != ''){
      this.headers['Authorization'] = 'Token ' + token
    }  
  }

  getAll(req_type) {
    return http.get(`/${req_type}/`, {headers: this.headers});
  }

  get(req_type, id) {
    return http.get(`/${req_type}/${id}/`, {headers: this.headers});
  }

  create(req_type, data) {
    return http.post(`/${req_type}/`, data, {headers: this.headers});
  }

  update(req_type, id, data) {
    return http.put(`/${req_type}/${id}/`, data, {headers: this.headers});
  }

  delete(req_type, id) {
    return http.delete(`/${req_type}/${id}/`, {headers: this.headers});
  }

  deleteAll(req_type) {
    return http.delete(`/${req_type}`, {headers: this.headers});
  }

  findByName(req_type, name) {
    return http.get(`/${req_type}?search=${name}`, {headers: this.headers});
  }
}

export default new DataService();

