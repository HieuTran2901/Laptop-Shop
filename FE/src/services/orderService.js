import api from "./api";
const API_URL = "http://localhost:8080/api/orders";

export const createOrder = (request) => api.post(`${API_URL}`, request);

export const getUserOrders = ({ page = "", size = "" } = {}) =>
  api.get(`${API_URL}/my-orders`, {
    params: { page, size },
  });

export const getOrderDetails = (orderCode) =>
  api.get(`${API_URL}/${orderCode}`);

export const getAllOrders = ({ page = "", size = "" } = {}) =>
  api.get(`${API_URL}`, {
    params: { page, size },
  });

export const confirmOrder = (orderCode) =>
  api.put(`${API_URL}/${orderCode}/confirm`);

export const cancelOrder = (orderCode) =>
  api.put(`${API_URL}/${orderCode}/cancel`);
