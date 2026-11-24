import PocketBase from 'pocketbase';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

export async function createAdminPb() {
  const pb = new PocketBase(publicEnv.PUBLIC_POCKETBASE_URL);
  await pb
    .collection('_superusers')
    .authWithPassword(privateEnv.POCKETBASE_EMAIL, privateEnv.POCKETBASE_PASSWORD);
  return pb;
}

export function extractPbError(err, fallback = 'Er is een fout opgetreden.') {
  const fieldErrors = err?.response?.data;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const messages = Object.entries(fieldErrors)
      .map(([field, info]) => `${field}: ${info?.message || 'ongeldige waarde'}`)
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(' | ');
    }
  }
  return err?.message || fallback;
}
