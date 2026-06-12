import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import {
  authority,
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  cognitoDomain
} from "@/config/authEnv";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      authority={authority}
      client_id={clientId}
      redirect_uri={redirectUri}
      post_logout_redirect_uri={postLogoutRedirectUri}
      response_type="code"
      scope="openid profile email"
      automaticSilentRenew={true}
      loadUserInfo={true}
      metadata={{
        issuer: `https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_Db3ryUNLM`,
        authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
        token_endpoint: `${cognitoDomain}/oauth2/token`,
        userinfo_endpoint: `${cognitoDomain}/oauth2/userInfo`,
        end_session_endpoint: `${cognitoDomain}/logout`,
      }}
  
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, "/");
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
