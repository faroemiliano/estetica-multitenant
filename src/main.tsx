import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>,
);
