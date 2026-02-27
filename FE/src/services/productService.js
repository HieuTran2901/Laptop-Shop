import api from "./api.js";

const API_URL = "http://localhost:8080/api/products";

export const getProducts = ({
  page = 1,
  size = 8,
  filters = {},
  sort = "",
} = {}) =>
  api.get(API_URL, {
    params: { page, size, ...filters, sort },
  });

export const createProduct = (product) => api.post(API_URL, product);
export const getProductById = (id) => api.get(`${API_URL}/${id}`);
export const updateProduct = (id, product) =>
  api.put(`${API_URL}/${id}`, product);
export const deleteProduct = (id) => api.delete(`${API_URL}/${id}`);
