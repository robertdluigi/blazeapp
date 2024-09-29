import { Issuer } from 'openid-client';

const realm = 'https://blazeapp-beta.vercel.app'; // Update this to match your production URL when deploying
const redirectUri = `${realm}/api/auth/steam/callback`;

const steamIssuer = new Issuer({
  issuer: 'https://steamcommunity.com/openid',
  authorization_endpoint: 'https://steamcommunity.com/openid/login',
});

export const steamClient = new steamIssuer.Client({
  client_id: realm,
  redirect_uris: [redirectUri],
});

export function generateSteamLinkUrl() {
  return steamClient.authorizationUrl({
    redirect_uri: redirectUri,
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.return_to': redirectUri,
    'openid.realm': realm,
  });
}

export async function validateSteamResponse(params: any) {
  const verifyParams = new URLSearchParams(params);
  verifyParams.set('openid.mode', 'check_authentication');

  const verifyResponse = await fetch('https://steamcommunity.com/openid/login', {
    method: 'POST',
    body: verifyParams,
  });

  const verifyText = await verifyResponse.text();
  return verifyText.includes('is_valid:true');
}

export function extractSteamId(params: any) {
  const match = params['openid.claimed_id']?.match(/(\d+)$/);
  return match ? match[1] : null;
}