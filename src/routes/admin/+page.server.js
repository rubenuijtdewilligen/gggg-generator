export async function load({ locals }) {
  const [personen, besturen, studies] = await Promise.all([
    locals.pb.collection('personen').getFullList(),
    locals.pb.collection('bestuur').getFullList({ sort: '-created', limit: 1 }),
    locals.pb.collection('studies').getFullList()
  ]);

  const stats = {
    totaal: personen.length,
    leden: personen.filter((p) => p.status === 'lid').length,
    aspiranten: personen.filter((p) => p.status === 'aspirant').length,
    reunisten: personen.filter((p) => p.status === 'reunist').length,
    studies: studies.length
  };

  return {
    stats,
    huidigBestuur: besturen[0] || null
  };
}
