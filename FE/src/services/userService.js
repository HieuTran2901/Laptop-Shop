import api from "./api";

export const loginUser = (credentials) => api.post("/auth/login", credentials);
//  credentials là object chứa { username, password }

export const registerUser = (userData) => api.post("/auth/login", userData);
// userData là object chứa { username, password, email, ... }

// Get user by id
export const getUserById = (id) => api.get(`/api/users/${id}`);
