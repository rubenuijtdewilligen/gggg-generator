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

    try {
      if (id) {
        await locals.pb.collection('studies').update(id, formData);
      } else {
        await locals.pb.collection('studies').create(formData);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  delete: async ({ request, locals }) => {
    const id = (await request.formData()).get('id');
    await locals.pb.collection('studies').delete(id);
    return { success: true };
  }
};
