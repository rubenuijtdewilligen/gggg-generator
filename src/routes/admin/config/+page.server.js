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

    try {
      if (id) {
        await locals.pb.collection('config').update(id, formData);
      } else {
        await locals.pb.collection('config').create(formData);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return { success: false, error: err.message };
    }
  }
};
