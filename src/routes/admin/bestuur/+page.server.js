import { fail } from '@sveltejs/kit';
import { validateBestuurForm } from '$lib/server/validation';

export async function load({ locals }) {
  const [besturen, personen] = await Promise.all([
    locals.pb.collection('bestuur').getFullList({ sort: '-created' }),
    locals.pb.collection('personen').getFullList({ sort: 'naam' })
  ]);

  return {
    bestuur: besturen[0] ? JSON.parse(JSON.stringify(besturen[0])) : null,
    personen: JSON.parse(JSON.stringify(personen))
  };
}

export const actions = {
  save: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    const { payload, error } = validateBestuurForm(formData);
    if (error) return fail(400, { success: false, error });

    try {
      if (id) {
        await locals.pb.collection('bestuur').update(id, payload);
      } else {
        await locals.pb.collection('bestuur').create(payload);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return fail(400, { success: false, error: err.message });
    }
  }
};
