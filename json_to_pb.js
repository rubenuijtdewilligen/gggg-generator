import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import 'dotenv/config.js';

const pb = new PocketBase(process.env.PUBLIC_POCKETBASE_URL);

function getFile(relativeUrl) {
  if (!relativeUrl) return null;

  const fileName = relativeUrl.replace(/^\//, '');
  const filePath = path.join(process.cwd(), 'static', fileName);

  if (fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    return new Blob([buffer]);
  }
  console.warn(`Bestand niet gevonden: ${filePath}`);
  return null;
}

async function confirmReset() {
  const rl = readline.createInterface({ input, output });
  try {
    const answer = await rl.question(
      '⚠️  Weet je zeker dat je ALLE bestaande records in personen, bestuur, config en studies wilt verwijderen? (ja/nee): '
    );
    return answer.trim().toLowerCase() === 'ja';
  } finally {
    rl.close();
  }
}

async function clearCollections() {
  // The order is important due to relationships (individuals refer to studies)
  const collections = ['personen', 'bestuur', 'config', 'studies'];
  for (const name of collections) {
    const records = await pb.collection(name).getFullList();
    for (const record of records) {
      await pb.collection(name).delete(record.id);
    }
    console.log(`Collectie '${name}' geleegd (${records.length} records verwijderd).`);
  }
}

const data = JSON.parse(fs.readFileSync('./src/lib/data.json', 'utf8'));

async function importData() {
  const shouldReset = process.argv.includes('--reset');

  try {
    await pb
      .collection('_superusers')
      .authWithPassword(process.env.POCKETBASE_EMAIL, process.env.POCKETBASE_PASSWORD);

    if (shouldReset) {
      const confirmed = await confirmReset();
      if (!confirmed) {
        console.log('Import geannuleerd.');
        return;
      }
      await clearCollections();
      console.log('');
    }

    console.log('Start import...\n');

    // 1. Upsert studies based on 'code'
    const existingStudies = await pb.collection('studies').getFullList();
    const existingStudiesByCode = new Map(existingStudies.map((s) => [s.code, s]));
    const studieMap = {};

    for (const [code, naam] of Object.entries(data.studies)) {
      const existing = existingStudiesByCode.get(code);
      if (existing) {
        const updated = await pb.collection('studies').update(existing.id, { code, naam });
        studieMap[code] = updated.id;
      } else {
        const created = await pb.collection('studies').create({ code, naam });
        studieMap[code] = created.id;
      }
    }
    console.log(`Studies verwerkt: ${Object.keys(data.studies).length}`);

    // 2. Upsert config (there should only be one config record)
    const existingConfigs = await pb.collection('config').getFullList({ limit: 1 });
    if (existingConfigs[0]) {
      await pb.collection('config').update(existingConfigs[0].id, data.config);
      console.log('Config bijgewerkt.');
    } else {
      await pb.collection('config').create(data.config);
      console.log('Config aangemaakt.');
    }

    // 3. Upsert persons based on 'naam'
    const existingPersonen = await pb.collection('personen').getFullList();
    const existingPersonenByName = new Map(
      existingPersonen.map((p) => [p.naam.trim().toLowerCase(), p])
    );
    const personenIdByName = new Map();

    const categorieen = [
      { lijst: data.leden || [], status: 'lid' },
      { lijst: data.ereleden || [], status: 'erelid' },
      { lijst: data.aspiranten || [], status: 'aspirant' },
      { lijst: data.reunisten || [], status: 'reunist' }
    ];

    for (const cat of categorieen) {
      for (const p of cat.lijst) {
        const formData = new FormData();
        formData.append('naam', p.naam);
        formData.append('status', cat.status);
        formData.append('geboortedatum', p.geboortedatum || '');
        formData.append('email', p.email || '');
        formData.append('telefoon', p.telefoon || '');
        formData.append('studie', studieMap[p.studie] || '');
        formData.append('adres_student', p.adres_student || '');
        formData.append('postcode_student', p.postcode_student || '');
        formData.append('adres_thuisthuis', p.adres_thuisthuis || '');
        formData.append('postcode_thuisthuis', p.postcode_thuisthuis || '');

        const fotoBlob = getFile(p.foto);
        if (fotoBlob) {
          formData.append('foto', fotoBlob, path.basename(p.foto));
        }

        const key = p.naam.trim().toLowerCase();
        const existing = existingPersonenByName.get(key);

        if (existing) {
          const updated = await pb.collection('personen').update(existing.id, formData);
          personenIdByName.set(key, updated.id);
          console.log(`Bijgewerkt: ${p.naam}`);
        } else {
          const created = await pb.collection('personen').create(formData);
          personenIdByName.set(key, created.id);
          console.log(`Aangemaakt: ${p.naam}`);
        }
      }
    }

    // 4. Perform an upsert based on 'name' + link to persoonId
    const existingBesturen = await pb.collection('bestuur').getFullList();
    const existingBestuur = existingBesturen.find((b) => b.naam === data.bestuur.naam);

    const gekoppeldeBestuursleden = (data.bestuur.leden || []).map((lid) => {
      const persoonId =
        lid.persoonId || personenIdByName.get((lid.naam || '').trim().toLowerCase()) || '';
      return persoonId ? { rol: lid.rol, persoonId } : { rol: lid.rol, naam: lid.naam };
    });

    const bestuurData = new FormData();
    bestuurData.append('naam', data.bestuur.naam);
    bestuurData.append('leden_json', JSON.stringify(gekoppeldeBestuursleden));

    const bestuurFoto = getFile(data.bestuur.foto);
    if (bestuurFoto) {
      bestuurData.append('foto', bestuurFoto, path.basename(data.bestuur.foto));
    }

    if (existingBestuur) {
      await pb.collection('bestuur').update(existingBestuur.id, bestuurData);
      console.log(`Bestuur bijgewerkt: ${data.bestuur.naam}`);
    } else {
      await pb.collection('bestuur').create(bestuurData);
      console.log(`Bestuur aangemaakt: ${data.bestuur.naam}`);
    }

    console.log('\nKlaar!');
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

importData();
