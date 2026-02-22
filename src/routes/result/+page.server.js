import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { POCKETBASE_EMAIL, POCKETBASE_PASSWORD } from '$env/static/private';

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export async function load() {
  await pb.collection('_superusers').authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD);
  const [personen, besturen, configs, studies] = await Promise.all([
    pb.collection('personen').getFullList({
      sort: 'naam',
      expand: 'studie'
    }),
    pb.collection('bestuur').getFullList({ sort: '-created', limit: 1 }),
    pb.collection('config').getFullList({ limit: 1 }),
    pb.collection('studies').getFullList({ sort: 'code' })
  ]);

  const config = configs[0] || {
    titel: 'Ledenlijst',
    jaargang: '',
    jaren: '',
    hoofdkleur: '#000000'
  };
  const bestuur = besturen[0];

  const getFileUrl = (record, filename) => (filename ? pb.files.getUrl(record, filename) : null);

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
