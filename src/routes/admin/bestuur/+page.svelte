<script>
  import { enhance } from '$app/forms';
  import { env as publicEnv } from '$env/dynamic/public';
  import PocketBase from 'pocketbase';

  export let data;
  const pb = new PocketBase(publicEnv.PUBLIC_POCKETBASE_URL);

  let bestuur = data.bestuur || { naam: '', jaar: '', leden_json: [] };

  let ledenLijst = (() => {
    const raw = bestuur?.leden_json;
    let parsed = [];
    if (Array.isArray(raw)) {
      parsed = raw;
    } else if (typeof raw === 'string' && raw.trim() !== '') {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = [];
      }
    }

    return parsed.map((lid) => {
      if (lid.persoonId) {
        return { rol: lid.rol || '', persoonId: lid.persoonId };
      }
      // Fallback for old { rol, naam } data
      const match = data.personen.find(
        (p) => p.naam.trim().toLowerCase() === (lid.naam || '').trim().toLowerCase()
      );
      return {
        rol: lid.rol || '',
        persoonId: match ? match.id : '',
        legacyNaam: match ? '' : lid.naam || ''
      };
    });
  })();

  function voegLidToe() {
    ledenLijst = [...ledenLijst, { rol: '', persoonId: '' }];
  }

  function verwijderLid(index) {
    ledenLijst = ledenLijst.filter((_, i) => i !== index);
  }
</script>

<main class="p-8 max-w-4xl mx-auto font-sans">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">Bestuursinstellingen</h1>
  </div>

  <form
    method="POST"
    action="?/save"
    use:enhance={({ formData }) => {
      const schoneLijst = ledenLijst
        .filter((l) => l.rol.trim() || l.persoonId)
        .map(({ rol, persoonId }) => ({ rol, persoonId }));
      formData.set('leden_json', JSON.stringify(schoneLijst));

      return async ({ update }) => {
        await update({ reset: false });
      };
    }}
    enctype="multipart/form-data"
    class="space-y-8"
  >
    {#if bestuur.id}<input type="hidden" name="id" value={bestuur.id} />{/if}

    <div class="bg-white p-6 rounded-xl shadow-sm border gap-6">
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider">
          Naam van het bestuur
        </h3>
        <input
          name="naam"
          bind:value={bestuur.naam}
          placeholder="bijv. Bestuur Valent 2025-2026"
          required
          class="w-full border rounded-lg p-2.5 -mt-4"
        />
      </div>

      <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider mt-4 mb-2">
        Bestuursfoto
      </h3>
      <div class="flex flex-col items-left gap-4">
        {#if bestuur.foto}
          <img
            src={pb.files.getURL(bestuur, bestuur.foto)}
            alt="Huidig"
            class="w-64 h-40 object-cover rounded border shadow-sm"
          />
        {/if}
        <div class="flex-1">
          <input type="file" name="foto" accept="image/*" class="text-sm" />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider">
          Bestuursleden & Rollen
        </h3>
        <button
          type="button"
          on:click={voegLidToe}
          class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition"
        >
          + Lid toevoegen
        </button>
      </div>

      <div class="space-y-3">
        {#each ledenLijst as lid, i (i)}
          <div class="flex gap-3 items-center group">
            <div class="bg-gray-50 p-1 rounded-lg text-gray-400 text-xs w-8 text-center">
              {i + 1}
            </div>
            <input
              bind:value={lid.rol}
              placeholder="Rol"
              required
              class="flex-1 border rounded-lg p-2 text-sm"
            />
            <select
              bind:value={lid.persoonId}
              required
              class="flex-[2] border rounded-lg p-2 text-sm bg-white"
            >
              <option value="" disabled>
                {lid.legacyNaam
                  ? `Kies persoon (was: ${lid.legacyNaam})`
                  : 'Selecteer een persoon...'}
              </option>
              {#each data.personen as p (p.id)}
                <option value={p.id}>{p.naam}</option>
              {/each}
            </select>
            <button
              type="button"
              on:click={() => verwijderLid(i)}
              class="text-red-400 hover:text-red-600 p-2"
            >
              &times;
            </button>
          </div>
        {/each}

        {#if ledenLijst.length === 0}
          <p
            class="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed rounded-xl"
          >
            Nog geen bestuursleden toegevoegd.
          </p>
        {/if}
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
      >
        Bestuur opslaan
      </button>
    </div>
  </form>
</main>
