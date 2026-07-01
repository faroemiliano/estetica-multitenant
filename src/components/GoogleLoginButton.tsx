import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function GoogleLoginButton() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleLogin = async (credentialResponse: any) => {
    try {
      if (!credentialResponse?.credential) return;

      const data = await googleLogin(credentialResponse.credential);

      // 1. Primero actualizamos estado global
      login(data.access_token, data.user);

      // 2. Después del render, navegamos (evita freeze / race condition)
      setTimeout(() => {
        if (data.user.role === "cliente" && !data.user.perfil_completo) {
          navigate(`/${slug}/completar-perfil`);
          return;
        }

        if (data.user.role === "admin") {
          navigate(`/${slug}/admin`);
        } else {
          navigate(`/${slug}/dashboard`);
        }
      }, 0);
    } catch (error) {
      console.log("Google login error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => console.log("Google login failed")}
    />
  );
}

export default GoogleLoginButton;
