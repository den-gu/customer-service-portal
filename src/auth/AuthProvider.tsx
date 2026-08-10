import React from 'react';
import { AuthProvider as OidcProvider, type AuthProviderProps } from 'react-oidc-context';

const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY || '',
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID || '',
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI || window.location.origin,
  post_logout_redirect_uri:
    import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI || window.location.origin,
  response_type: 'code', // Utiliza PKCE por padrão
  scope: 'openid profile email',
  onSigninCallback: () => {
    // Limpa os parâmetros de URL após o redirecionamento do OIDC
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <OidcProvider {...oidcConfig}>{children}</OidcProvider>;
};