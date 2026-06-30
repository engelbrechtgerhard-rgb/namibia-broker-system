export const region = "eu-west-1";

export const userPoolId = "eu-west-1_ERCFRs97T";
export const clientId = "7oafsk3el1eue3uqcphh16k3sc";

export const cognitoDomain =
  "https://namibia-broker-system.auth.eu-west-1.amazoncognito.com";

export const appBaseUrl = "https://main.d3ag1h0byiiz37.amplifyapp.com";

export const redirectUri = appBaseUrl;
export const postLogoutRedirectUri = `${appBaseUrl}/clear`;

export const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
