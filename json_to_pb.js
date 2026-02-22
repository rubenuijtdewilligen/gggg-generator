import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
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

const data = JSON.parse(fs.readFileSync('./src/lib/data.json', 'utf8'));

async function importData() {
  try {
    await pb
      .collection('_superusers')
      .authWithPassword(process.env.POCKETBASE_EMAIL, process.env.POCKETBASE_PASSWORD);

    console.log('Start import...');
    console.log('');

    const studieMap = {};
    for (const [code, naam] of Object.entries(data.studies)) {
      const record = await pb.collection('studies').create({ code, naam });
      studieMap[code] = record.id;
    }

    await pb.collection('config').create(data.config);

    const bestuurData = new FormData();
    bestuurData.append('jaar', data.config.jaren);
    bestuurData.append('naam', data.bestuur.naam);
    bestuurData.append('leden_json', JSON.stringify(data.bestuur.leden));

    const bestuurFoto = getFile(data.bestuur.foto);
    if (bestuurFoto) {
      bestuurData.append('foto', bestuurFoto, path.basename(data.bestuur.foto));
    }
    await pb.collection('bestuur').create(bestuurData);

    const categorieen = [
      { lijst: data.leden, status: 'lid' },
      { lijst: data.ereleden, status: 'erelid' },
      { lijst: data.aspiranten, status: 'aspirant' },
      { lijst: data.reunisten, status: 'reunist' }
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

        await pb.collection('personen').create(formData);
        console.log(`Geïmporteerd: ${p.naam}`);
      }
    }

    console.log('');
    console.log('Klaar!');
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

importData();
