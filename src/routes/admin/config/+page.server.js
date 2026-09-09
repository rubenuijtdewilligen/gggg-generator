import PocketBase from 'pocketbase';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

const pb = new PocketBase(publicEnv.PUBLIC_POCKETBASE_URL);

async function authenticate() {
  if (!pb.authStore.isValid) {
    await pb.admins.authWithPassword(privateEnv.POCKETBASE_EMAIL, privateEnv.POCKETBASE_PASSWORD);
  }
}

export async function load() {
  await authenticate();

  const configs = await pb.collection('config').getFullList();

  return {
    config: configs[0] ? JSON.parse(JSON.stringify(configs[0])) : null
  };
}

export const actions = {
  save: async ({ request }) => {
    await authenticate();
    const formData = await request.formData();
    const id = formData.get('id');

    try {
      if (id) {
        await pb.collection('config').update(id, formData);
      } else {
        await pb.collection('config').create(formData);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return { success: false, error: err.message };
    }
  }
};
