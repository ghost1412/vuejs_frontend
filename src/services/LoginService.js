import http from "../http-common";

class LoginService {
  getLogin() {
    return http.get("/auth/");
  }
}

export default new LoginService();

