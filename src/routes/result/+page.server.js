function parseLedenJson(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function load({ locals }) {
  const [personen, besturen, configs, studies] = await Promise.all([
    locals.pb.collection('personen').getFullList({
      sort: 'naam',
      expand: 'studie'
    }),
    locals.pb.collection('bestuur').getFullList({ sort: '-created', limit: 1 }),
    locals.pb.collection('config').getFullList({ limit: 1 }),
    locals.pb.collection('studies').getFullList({ sort: 'code' })
  ]);

  const config = configs[0] || {
    titel: 'Ledenlijst',
    jaargang: '',
    jaren: '',
    hoofdkleur: '#db1f0d'
  };
  const bestuur = besturen[0] || null;

  const getFileUrl = (record, filename) =>
    record && filename ? locals.pb.files.getURL(record, filename) : null;

  const personenById = new Map(personen.map((p) => [p.id, p]));
  const rawLeden = bestuur ? parseLedenJson(bestuur.leden_json) : [];

  return {
    config,
    bestuur: bestuur
      ? {
          ...bestuur,
          naam: bestuur.naam || 'Bestuur',
          foto: getFileUrl(bestuur, bestuur.foto),
          leden: rawLeden.map((lid) => ({
            rol: lid.rol || '',
            persoonId: lid.persoonId || null,
            naam: personenById.get(lid.persoonId)?.naam || lid.naam || 'Onbekend'
          }))
        }
      : {
          naam: '',
          foto: null,
          leden: []
        },
    personen: personen.map((p) => ({
      ...p,
      foto: getFileUrl(p, p.foto),
      studieCode: p.expand?.studie?.code || ''
    })),
    studiesList: studies
  };
}
