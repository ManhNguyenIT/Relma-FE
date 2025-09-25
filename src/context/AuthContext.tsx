import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
        onLoad: 'login-required',
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

  const hasRole = (role: string) => {
    const realmRoles = kc?.tokenParsed?.realm_access?.roles ?? [];
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;
    const appRoles = kc?.tokenParsed?.resource_access?.[clientId]?.roles ?? [];
    return realmRoles.includes(role) || appRoles.includes(role);
  };

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
    }),
    [initialized, isAuthenticated, profile, kc],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
