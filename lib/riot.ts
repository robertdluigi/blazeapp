export const clientID = process.env.RIOT_CLIENT_ID; // Store in .env.local
export const clientSecret = process.env.RIOT_CLIENT_SECRET; // Store in .env.local
export const appBaseUrl = process.env.APP_BASE_URL || "https://local.example.com"; // Should be HTTPS
export const appCallbackUrl = `${appBaseUrl}/api/auth/riot/callback`;

export const provider = "https://auth.riotgames.com";
export const authorizeUrl = `${provider}/authorize`;
export const tokenUrl = `${provider}/token`;