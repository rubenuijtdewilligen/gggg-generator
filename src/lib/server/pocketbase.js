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
