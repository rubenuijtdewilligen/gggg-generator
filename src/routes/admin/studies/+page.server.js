import { fail } from '@sveltejs/kit';
import { validateStudieForm } from '$lib/server/validation';
import { extractPbError } from '$lib/server/pocketbase.js';

export async function load({ locals }) {
  const studies = await locals.pb.collection('studies').getFullList({ sort: 'code' });

  return {
    studies: JSON.parse(JSON.stringify(studies))
  };
}

export const actions = {
  save: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    const { payload, error } = validateStudieForm(formData);
    if (error) return fail(400, { success: false, error });

    try {
      if (id) {
        await locals.pb.collection('studies').update(id, payload);
      } else {
        await locals.pb.collection('studies').create(payload);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return fail(400, { success: false, error: extractPbError(err) });
    }
  },

  delete: async ({ request, locals }) => {
    const id = (await request.formData()).get('id');

    try {
      await locals.pb.collection('studies').delete(id);
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return fail(400, { success: false, error: 'Verwijderen mislukt.' });
    }
  }
};
