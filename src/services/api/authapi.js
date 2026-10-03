import { apiRequest } from "./httpClient.js";

export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

const authApi = {
  register: registerUser,
  login: loginUser,
};

export default authApi;
