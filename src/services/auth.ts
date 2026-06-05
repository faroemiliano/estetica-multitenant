import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const googleLogin = async (credential: string) => {
  const response = await axios.post(`${api}/google-login`, {
    credential,
  });

  return response.data;
};
