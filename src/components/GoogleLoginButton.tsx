import { GoogleLogin } from "@react-oauth/google";

import { googleLogin } from "../services/auth";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

function GoogleLoginButton() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const { slug } = useParams();
  const handleLogin = async (credentialResponse: any) => {
    try {
      const data = await googleLogin(credentialResponse.credential);

      login(data.access_token, data.user);

      // CLIENTE SIN PERFIL
      if (data.user.role === "cliente" && !data.user.perfil_completo) {
        navigate(`/${slug}/completar-perfil`);

        return;
      }

      // ADMIN
      if (data.user.role === "admin") {
        navigate(`/${slug}/admin`);
      } else {
        // CLIENTE NORMAL
        navigate(`/${slug}/dashboard`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <GoogleLogin onSuccess={handleLogin} onError={() => {}} />;
}

export default GoogleLoginButton;
