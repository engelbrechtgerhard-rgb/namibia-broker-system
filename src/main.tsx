import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_Db3ryUNLM",
  client_id: "4d4bujg2atrj6mrqq310620bq9",
  redirect_uri: "https://main.d3ag1h0byiiz37.amplifyapp.com",
  response_type: "code",
  scope: "email openid profile",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
