import { isValidDutchDate } from '$lib/date';

const ALLOWED_STATUSES = ['lid', 'erelid', 'aspirant', 'reunist'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

function cleanStr(val, maxLen = 255) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

export function validatePersoonForm(formData) {
  const naam = cleanStr(formData.get('naam'), 120);
  if (!naam) return { error: 'Naam is verplicht.' };

  const status = cleanStr(formData.get('status'), 20);
  if (!ALLOWED_STATUSES.includes(status)) {
    return { error: 'Ongeldige status gekozen.' };
  }

  const geboortedatum = cleanStr(formData.get('geboortedatum'), 10);
  if (geboortedatum && !isValidDutchDate(geboortedatum)) {
    return { error: 'Geboortedatum moet een geldige datum zijn in formaat DD-MM-YYYY.' };
  }

  const email = cleanStr(formData.get('email'), 150);
  if (email && !EMAIL_REGEX.test(email)) {
    return { error: 'Ongeldig e-mailadres.' };
  }

  const payload = new FormData();
  payload.append('naam', naam);
  payload.append('status', status);
  payload.append('geboortedatum', geboortedatum);
  payload.append('email', email);
  payload.append('telefoon', cleanStr(formData.get('telefoon'), 30));
  payload.append('studie', cleanStr(formData.get('studie'), 30));
  payload.append('adres_student', cleanStr(formData.get('adres_student'), 150));
  payload.append('postcode_student', cleanStr(formData.get('postcode_student'), 100));
  payload.append('adres_thuisthuis', cleanStr(formData.get('adres_thuisthuis'), 150));
  payload.append('postcode_thuisthuis', cleanStr(formData.get('postcode_thuisthuis'), 100));

  const foto = formData.get('foto');
  if (foto instanceof File && foto.size > 0) {
    payload.append('foto', foto);
  }

  return { payload };
}

export function validateStudieForm(formData) {
  const code = cleanStr(formData.get('code'), 15).toUpperCase();
  const naam = cleanStr(formData.get('naam'), 120);

  if (!code) return { error: 'Studiecode is verplicht.' };
  if (!naam) return { error: 'Studienaam is verplicht.' };

  return { payload: { code, naam } };
}

export function validateBestuurForm(formData) {
  const naam = cleanStr(formData.get('naam'), 120);
  if (!naam) return { error: 'Bestuursnaam is verplicht.' };

  let leden = [];
  try {
    const raw = JSON.parse(String(formData.get('leden_json') || '[]'));
    if (!Array.isArray(raw)) return { error: 'Ongeldige ledenlijst.' };
    leden = raw
      .map((l) => ({
        rol: cleanStr(l.rol, 80),
        persoonId: cleanStr(l.persoonId, 30)
      }))
      .filter((l) => l.rol && l.persoonId);
  } catch {
    return { error: 'Ongeldige JSON in ledenlijst.' };
  }

  const payload = new FormData();
  payload.append('naam', naam);
  payload.append('leden_json', JSON.stringify(leden));

  const foto = formData.get('foto');
  if (foto instanceof File && foto.size > 0) {
    payload.append('foto', foto);
  }

  return { payload };
}

export function validateConfigForm(formData) {
  const titel = cleanStr(formData.get('titel'), 100);
  const jaargang = cleanStr(formData.get('jaargang'), 60);
  const jaren = cleanStr(formData.get('jaren'), 40);
  const hoofdkleur = cleanStr(formData.get('hoofdkleur'), 7);

  if (!titel || !jaargang || !jaren) {
    return { error: 'Titel, jaargang en jaren zijn verplicht.' };
  }
  if (!HEX_COLOR_REGEX.test(hoofdkleur)) {
    return { error: 'Hoofdkleur moet een geldige hex-kleur zijn (#RRGGBB).' };
  }

  return { payload: { titel, jaargang, jaren, hoofdkleur } };
}
