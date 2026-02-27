import api from "./api";
const API_URL = "http://localhost:8080/api/payment";

export const createPayment = (request) => api.post(`${API_URL}/momo`, request);
