// src/utils/api.ts
import axios from 'axios';
import keycloak from '../services/keycloak';

const API_URL = import.meta.env.API_URL as string;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor insert token
api.interceptors.request.use(async (config) => {
  if (keycloak && keycloak.authenticated) {
    await keycloak.updateToken(30).catch(() => keycloak.login());
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export default api;
