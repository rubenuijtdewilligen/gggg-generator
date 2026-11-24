export async function load({ locals }) {
  const [personen, studies] = await Promise.all([
    locals.pb.collection('personen').getFullList({ sort: 'naam', expand: 'studie' }),
    locals.pb.collection('studies').getFullList({ sort: 'code' })
  ]);

  return {
    personen: JSON.parse(JSON.stringify(personen)),
    studies: JSON.parse(JSON.stringify(studies))
  };
}

export const actions = {
  save: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    const foto = formData.get('foto');
    if (foto instanceof File && foto.size === 0) {
      formData.delete('foto');
    }

    try {
      if (id) {
        await locals.pb.collection('personen').update(id, formData);
      } else {
        await locals.pb.collection('personen').create(formData);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return { success: false, error: err.message };
    }
  },
  delete: async ({ request, locals }) => {
    const id = (await request.formData()).get('id');
    await locals.pb.collection('personen').delete(id);
    return { success: true };
  }
};
