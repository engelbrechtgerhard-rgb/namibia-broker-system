import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import {
  authority,
  clientId,
  redirectUri,
  postLogoutRedirectUri,
  metadata
} from "@/config/authEnv";

import { AuthProvider } from "react-oidc-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      authority={authority}
      client_id={clientId}
      redirect_uri={redirectUri}
      post_logout_redirect_uri={postLogoutRedirectUri}
      response_type="code"
      scope="openid profile email"
      metadata={metadata}
      automaticSilentRenew={true}
      loadUserInfo={true}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);
