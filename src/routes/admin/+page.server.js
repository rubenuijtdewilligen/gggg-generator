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

  const rawBestuur = besturen[0] || null;
  let huidigBestuur = null;

  if (rawBestuur) {
    const rawLeden =
      typeof rawBestuur.leden_json === 'string' && rawBestuur.leden_json.trim() !== ''
        ? JSON.parse(rawBestuur.leden_json)
        : Array.isArray(rawBestuur.leden_json)
          ? rawBestuur.leden_json
          : [];

    const personenById = new Map(personen.map((p) => [p.id, p]));

    huidigBestuur = {
      ...rawBestuur,
      leden: rawLeden.map((lid) => ({
        rol: lid.rol || '',
        naam: personenById.get(lid.persoonId)?.naam || lid.naam || 'Onbekend'
      }))
    };
  }

  return {
    stats,
    huidigBestuur
  };
}
