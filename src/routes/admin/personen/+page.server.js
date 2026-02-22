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

  const [personen, studies] = await Promise.all([
    pb.collection('personen').getFullList({ sort: 'naam', expand: 'studie' }),
    pb.collection('studies').getFullList({ sort: 'code' })
  ]);

  return {
    personen: JSON.parse(JSON.stringify(personen)),
    studies: JSON.parse(JSON.stringify(studies))
  };
}

export const actions = {
  save: async ({ request }) => {
    await authenticate();
    const formData = await request.formData();
    const id = formData.get('id');

    const foto = formData.get('foto');
    if (foto instanceof File && foto.size === 0) {
      formData.delete('foto');
    }

    try {
      if (id) {
        await pb.collection('personen').update(id, formData);
      } else {
        await pb.collection('personen').create(formData);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return { success: false, error: err.message };
    }
  },
  delete: async ({ request }) => {
    await authenticate();
    const id = (await request.formData()).get('id');
    await pb.collection('personen').delete(id);
    return { success: true };
  }
};
