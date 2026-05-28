// src/config/authEnv.js

export const region = "eu-west-1";
export const userPoolId = "eu-west-1_nGhTrh9ir";

export const clientId = "6mko14fuub14fp8bomeujek0r7";

export const appBaseUrl = "http://localhost:3000";

export const redirectUri = `${appBaseUrl}/`;
export const postLogoutRedirectUri = `${appBaseUrl}/clear`;

export const cognitoDomain = "https://namibia-broker-system.auth.eu-west-1.amazoncognito.com";

export const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

export const metadata = {
  authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
  token_endpoint: `${cognitoDomain}/oauth2/token`,
  end_session_endpoint: `${cognitoDomain}/logout`,
};
