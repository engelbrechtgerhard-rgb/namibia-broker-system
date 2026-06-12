import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

import {
  authority,
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  cognitoDomain
} from "@/config/authEnv";

console.log("AUTH ENV LOADED:", {
  redirectUri,
  authority,
  clientId,
  postLogoutRedirectUri
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      authority={authority}
      client_id={clientId}
      redirect_uri={redirectUri}
      post_logout_redirect_uri={postLogoutRedirectUri}
      response_type="code"
      scope="openid profile email"
      automaticSilentRenew={false}
      loadUserInfo={false}
      metadata={{
        issuer: authority,
        authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
        token_endpoint: `${cognitoDomain}/oauth2/token`,
        userinfo_endpoint: `${cognitoDomain}/oauth2/userInfo`,
        end_session_endpoint: `${cognitoDomain}/logout`,
      }}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);
