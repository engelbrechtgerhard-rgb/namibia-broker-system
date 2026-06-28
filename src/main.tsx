import "@/styles/global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import amplifyOutputs from "../amplify_outputs.json";
import App from "./App";
import {
  authority,
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  cognitoDomain,
} from "@/config/authEnv";

// Token store bridging react-oidc-context → Amplify
let _accessToken: string | null = null;
let _idToken: string | null = null;

export function setOidcTokens(accessToken: string, idToken: string) {
  _accessToken = accessToken;
  _idToken = idToken;
}

Amplify.configure(amplifyOutputs, {
  Auth: {
    tokenProvider: {
      getTokens: async () => {
        if (!_accessToken || !_idToken) return null;
        return {
          accessToken: { toString: () => _accessToken! } as any,
          idToken:     { toString: () => _idToken! }     as any,
        };
      },
    },
  },
});

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
  onSigninCallback: (user) => {
    if (user?.access_token && user?.id_token) {
      setOidcTokens(user.access_token, user.id_token);
    }
    // Remove OIDC params from URL after redirect
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
