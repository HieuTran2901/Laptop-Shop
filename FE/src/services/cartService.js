import api from "./api";
const API_URL = "http://localhost:8080/api/cart";

export const getCartItems = () => api.get(API_URL);
// data null because no body is needed
// post(url, data, config)
export const addToCart = (productId, quantity) =>
  api.post(`${API_URL}/add`, null, { params: { productId, quantity } });

// data null because no body is needed
// put(url, data, config)
export const updateCartItem = (productId, quantity) =>
  api.put(`${API_URL}/update`, null, { params: { productId, quantity } });

// no need null here because DELETE only has url and config
// delete(url, config)
export const removeCartItem = (productId) =>
  api.delete(`${API_URL}/remove`, { params: { productId } });

export const clearCart = () => api.delete(API_URL);
