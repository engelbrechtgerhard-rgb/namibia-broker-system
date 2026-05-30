// src/config/authEnv.js

export const region = import.meta.env.VITE_REGION;
export const userPoolId = import.meta.env.VITE_USER_POOL_ID;

export const clientId = import.meta.env.VITE_CLIENT_ID;

export const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;

export const redirectUri = import.meta.env.VITE_REDIRECT_URI;
export const postLogoutRedirectUri = import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI;

export const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;

export const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

export const metadata = {
  authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
  token_endpoint: `${cognitoDomain}/oauth2/token`,
  end_session_endpoint: `${cognitoDomain}/logout`,
};
