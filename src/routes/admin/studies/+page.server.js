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

  const studies = await pb.collection('studies').getFullList({ sort: 'code' });

  return {
    studies: JSON.parse(JSON.stringify(studies))
  };
}

export const actions = {
  save: async ({ request }) => {
    await authenticate();
    const formData = await request.formData();
    const id = formData.get('id');

    try {
      if (id) {
        await pb.collection('studies').update(id, formData);
      } else {
        await pb.collection('studies').create(formData);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  delete: async ({ request }) => {
    await authenticate();
    const id = (await request.formData()).get('id');
    await pb.collection('studies').delete(id);
    return { success: true };
  }
};
