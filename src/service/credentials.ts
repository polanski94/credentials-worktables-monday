import axios from 'axios';

interface Credential {
  name: string;
  token: string;
  refreshToken?: string;
}
const baseURL = import.meta.env.VITE_API_URL;
export async function saveCredentials(credentials: Credential, redirectUrl: string) {
  const result = await axios.post(`${baseURL}/credentials/saveCredential`, credentials, {
    params: {
      token: redirectUrl,
    },
  });
  return result;
}
