import axios from "axios";
let cachedAccessToken: any = null;
let tokenExpiryTime = 0;

export async function refreshAccessToken() {
  try {
    if (cachedAccessToken && Date.now() < tokenExpiryTime) {
      return cachedAccessToken;
    }
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: process.env.EXPO_PUBLIC_ZOHO_REFRESH_TOKEN,
          client_id: process.env.EXPO_PUBLIC_ZOHO_CLIENT_ID,
          client_secret: process.env.EXPO_PUBLIC_ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );

    const { access_token, expires_in } = response.data;
    cachedAccessToken = access_token;
    tokenExpiryTime = Date.now() + expires_in * 1000;
    return access_token;
  } catch (error: any) {
    console.error("Failed to refresh Zoho access token", error);
    throw error;
  }
}
