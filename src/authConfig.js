import {
  authority,
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  metadata,
} from "./config/authEnv";

export const cognitoAuthConfig = {
  authority,
  client_id: clientId,

  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,

  response_type: "code",
  scope: "openid profile email",

  metadata,
  loadUserInfo: false,
};
