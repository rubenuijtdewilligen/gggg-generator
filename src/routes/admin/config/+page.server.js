import { fail } from '@sveltejs/kit';
import { validateConfigForm } from '$lib/server/validation';

export async function load({ locals }) {
  const configs = await locals.pb.collection('config').getFullList();

  return {
    config: configs[0] ? JSON.parse(JSON.stringify(configs[0])) : null
  };
}

export const actions = {
  save: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    const { payload, error } = validateConfigForm(formData);
    if (error) return fail(400, { success: false, error });

    try {
      if (id) {
        await locals.pb.collection('config').update(id, payload);
      } else {
        await locals.pb.collection('config').create(payload);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return fail(400, { success: false, error: err.message });
    }
  }
};
