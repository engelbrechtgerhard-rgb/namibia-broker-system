export const region = "eu-west-1";

export const userPoolId = "eu-west-1_nGhTrh9ir";
export const clientId = "7ig9eho4gseqo2b74mngk7e09p";

export const cognitoDomain = "https://namibia-broker-system.auth.eu-west-1.amazoncognito.com";

export const appBaseUrl = "https://main.d3ag1h0byiiz37.amplifyapp.com";

export const redirectUri = `${appBaseUrl}/callback`;
export const postLogoutRedirectUri = `${appBaseUrl}/clear`;

export const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

export const metadata = {
  authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
  token_endpoint: `${cognitoDomain}/oauth2/token`,
  end_session_endpoint: `${cognitoDomain}/logout`,
};
