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

    const foto = formData.get('foto');
    if (foto instanceof File && foto.size === 0) {
      formData.delete('foto');
    }

    try {
      if (id) {
        await locals.pb.collection('bestuur').update(id, formData);
      } else {
        await locals.pb.collection('bestuur').create(formData);
      }
      return { success: true };
    } catch (err) {
      console.error('PB Error:', err.data);
      return { success: false, error: err.message };
    }
  }
};
