// src/config/authEnv.ts
export const region = "eu-west-1";

export const userPoolId = "eu-west-1_Db3ryUNLM";
export const clientId = "4d4bujg2atrj6mrqq310620bq9";

export const cognitoDomain =
  "https://namibia-broker-system.auth.eu-west-1.amazoncognito.com";

export const appBaseUrl = "https://main.d3ag1h0byiiz37.amplifyapp.com";

export const redirectUri = appBaseUrl;
export const postLogoutRedirectUri = `${appBaseUrl}/clear`;

export const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

console.log("AUTH ENV LOADED:", {
  redirectUri,
  authority,
  clientId,
  postLogoutRedirectUri
});
