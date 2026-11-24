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
    hoofdkleur: '#000000'
  };
  const bestuur = besturen[0];

  const getFileUrl = (record, filename) =>
    filename ? locals.pb.files.getURL(record, filename) : null;

  return {
    config,
    bestuur: {
      ...bestuur,
      foto: getFileUrl(bestuur, bestuur?.foto),
      leden:
        typeof bestuur?.leden_json === 'string'
          ? JSON.parse(bestuur.leden_json)
          : bestuur?.leden_json || []
    },
    personen: personen.map((p) => ({
      ...p,
      foto: getFileUrl(p, p.foto),
      studieCode: p.expand?.studie?.code || ''
    })),
    studiesList: studies
  };
}
