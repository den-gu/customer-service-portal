import axios from 'axios';
import { User } from 'oidc-client-ts';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // Aponta para a raiz (interceptado pelo MSW)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Access Token OIDC do sessionStorage
apiClient.interceptors.request.use((config) => {
  const oidcAuthority = import.meta.env.VITE_OIDC_AUTHORITY;
  const oidcClientId = import.meta.env.VITE_OIDC_CLIENT_ID;

  if (oidcAuthority && oidcClientId) {
    const oidcStorageKey = `oidc.user:${oidcAuthority}:${oidcClientId}`;
    const oidcUserData = sessionStorage.getItem(oidcStorageKey);

    if (oidcUserData) {
      try {
        const user = User.fromStorageString(oidcUserData);
        if (user && user.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
        }
      } catch (err) {
        console.error('Erro ao carregar o token do OIDC:', err);
      }
    }
  }

  return config;
});