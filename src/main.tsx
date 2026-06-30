import "@/styles/global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";
import { Amplify } from "aws-amplify";
import amplifyOutputs from "../amplify_outputs.json";
import App from "./App";
import {
  authority,
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  cognitoDomain,
} from "@/config/authEnv";

Amplify.configure(amplifyOutputs);

const oidcConfig: AuthProviderProps = {
  authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: false,
  loadUserInfo: false,
  metadataUrl: undefined,
  metadata: {
    issuer: authority,
    authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
    token_endpoint:         `${cognitoDomain}/oauth2/token`,
    userinfo_endpoint:      `${cognitoDomain}/oauth2/userInfo`,
    end_session_endpoint:   `${cognitoDomain}/logout?client_id=${clientId}`,
  },
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
