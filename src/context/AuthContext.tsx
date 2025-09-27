import React, { createContext, useEffect, useMemo, useState } from 'react';
import Keycloak, {
  KeycloakProfile,
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
} from 'keycloak-js';
import keycloak from '../services/keycloak';
import api from '../utils/api';

type AuthContextType = {
  initialized: boolean;
  isAuthenticated: boolean;
  profile: KeycloakProfile | null;
  keycloak: Keycloak | null;
  token?: string;
  login: (opts?: KeycloakLoginOptions) => void;
  logout: (opts?: KeycloakLogoutOptions) => void;
  hasRole: (role: string) => boolean;
  customLogin: (username: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<KeycloakProfile | null>(null);
  const [kc, setKc] = useState<Keycloak | null>(null);

  useEffect(() => {
    keycloak
      .init({
        // ❗ Dùng check-sso để không auto-redirect, cho phép dùng trang SignIn
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        // Nếu cần silent SSO, mở dòng dưới và tạo file /public/silent-check-sso.html
        // silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      })
      .then(async (auth) => {
        setKc(keycloak);
        setIsAuthenticated(!!auth);
        if (auth) {
          try {
            const p = await keycloak.loadUserProfile();
            setProfile(p);

            const res = await api.get('/api/v1/assets');
            console.log(res.data);
          } catch (e) {
            console.warn('Load profile failed:', e);
          }
        }
      })
      .catch((e) => console.error('Keycloak init error:', e))
      .finally(() => setInitialized(true));
  }, []);

  // refresh token định kỳ (giữ đơn giản)
  useEffect(() => {
    if (!kc) return;
    const id = setInterval(() => {
      kc.updateToken(60).catch(() => kc.login());
    }, 10000);
    return () => clearInterval(id);
  }, [kc]);

  const hasRole = React.useCallback(
    (role: string) => {
      const realmRoles = kc?.tokenParsed?.realm_access?.roles ?? [];
      const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;
      const appRoles = kc?.tokenParsed?.resource_access?.[clientId]?.roles ?? [];
      return realmRoles.includes(role) || appRoles.includes(role);
    },
    [kc],
  );

  const customLogin = React.useCallback(
    async (username: string, password: string) => {
      if (!kc || !kc.clientId) {
        throw new Error('Keycloak not fully initialized');
      }

      try {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('client_id', kc.clientId);
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(
          `${kc.authServerUrl}/realms/${kc.realm}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const tokenData = await response.json();
        kc.token = tokenData.access_token;
        kc.refreshToken = tokenData.refresh_token;
        kc.idToken = tokenData.id_token;
        kc.timeSkew = Date.now();

        // Update tokenParsed (Keycloak JS doesn't auto-parse, so manual update or reload)
        // For simplicity, reload user info
        const p = await kc.loadUserProfile();
        setProfile(p);
        setIsAuthenticated(true);

        // Update tokenParsed if needed, but loadUserProfile should suffice for profile
        console.log('Custom login successful');
      } catch (error) {
        console.error('Custom login error:', error);
        throw error;
      }
    },
    [kc],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      initialized,
      isAuthenticated,
      profile,
      keycloak: kc,
      token: kc?.token,
      login: (opts) => kc?.login(opts),
      logout: (opts) => kc?.logout(opts),
      hasRole,
      customLogin,
    }),
    [initialized, isAuthenticated, profile, kc, hasRole, customLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
