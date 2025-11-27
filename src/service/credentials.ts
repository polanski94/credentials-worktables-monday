import axios from 'axios';

interface Credential {
  name: string;
  token: string;
  refreshToken?: string;
}
export async function saveCredentials(credentials: Credential, redirectUrl: string) {
  // Remove undefined refreshToken from the payload
  const payload: Credential = {
    name: credentials.name,
    token: credentials.token,
  };
  
  if (credentials.refreshToken) {
    payload.refreshToken = credentials.refreshToken;
  }

 
  const result = await axios.post(`https://advanced-automations-eug9h.ondigitalocean.app/credentials/saveCredential`, payload, {
    params: {
      token: redirectUrl,
    },
  });

  return result;
}
