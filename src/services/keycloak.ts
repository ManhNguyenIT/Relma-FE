// src/services/keycloak.ts
import Keycloak, { KeycloakConfig } from 'keycloak-js';

const KC_URL = import.meta.env.VITE_KEYCLOAK_URL as string;
const KC_REALM = import.meta.env.VITE_KEYCLOAK_REALM as string;
const KC_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

// Báo lỗi sớm nếu thiếu env
if (!KC_URL || !KC_REALM || !KC_CLIENT_ID) {
  // eslint-disable-next-line no-console
  console.error('[Keycloak] Missing env:', {
    VITE_KEYCLOAK_URL: KC_URL,
    VITE_KEYCLOAK_REALM: KC_REALM,
    VITE_KEYCLOAK_CLIENT_ID: KC_CLIENT_ID,
  });
  throw new Error('Keycloak ENV is missing. Check your .env file.');
}

const config: KeycloakConfig = {
  url: KC_URL.replace(/\/+$/, ''), // bỏ dấu '/' cuối nếu có
  realm: KC_REALM,
  clientId: KC_CLIENT_ID,
};

const keycloak = new Keycloak(config);

export default keycloak;
