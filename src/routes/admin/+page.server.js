import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { POCKETBASE_EMAIL, POCKETBASE_PASSWORD } from '$env/static/private';

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

async function authenticate() {
  if (!pb.authStore.isValid) {
    await pb.admins.authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD);
  }
}

export async function load() {
  await authenticate();

  const [personen, besturen, studies] = await Promise.all([
    pb.collection('personen').getFullList(),
    pb.collection('bestuur').getFullList({ sort: '-created', limit: 1 }),
    pb.collection('studies').getFullList()
  ]);

  // Statistieken berekenen
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
