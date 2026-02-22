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

  // We halen het nieuwste bestuur op (of een lege lijst als er nog geen is)
  const [besturen, personen] = await Promise.all([
    pb.collection('bestuur').getFullList({ sort: '-created' }),
    pb.collection('personen').getFullList({ sort: 'naam' })
  ]);

  return {
    bestuur: besturen[0] ? JSON.parse(JSON.stringify(besturen[0])) : null,
    personen: JSON.parse(JSON.stringify(personen))
  };
}

export const actions = {
  save: async ({ request }) => {
    await authenticate();
    const formData = await request.formData();
    const id = formData.get('id');

    // Check of er een nieuwe foto is geüpload
    const foto = formData.get('foto');
    if (foto instanceof File && foto.size === 0) {
      formData.delete('foto');
    }

    try {
      if (id) {
        await pb.collection('bestuur').update(id, formData);
      } else {
        await pb.collection('bestuur').create(formData);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return { success: false, error: err.message };
    }
  }
};
