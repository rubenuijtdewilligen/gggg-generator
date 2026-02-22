import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { POCKETBASE_EMAIL, POCKETBASE_PASSWORD } from '$env/static/private';

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

async function authenticate() {
  if (!pb.authStore.isValid) {
    await pb.admins.authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD);
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
