<script>
  import { enhance } from '$app/forms';
  import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
  import PocketBase from 'pocketbase';

  export let data;
  let bewerkLid = null;
  let lidOmTeVerwijderen = null;

  const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
</script>

<main class="p-8 max-w-6xl mx-auto font-sans">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Personenbeheer</h1>
    <button
      on:click={() => (bewerkLid = { status: 'lid' })}
      class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg"
    >
      + Nieuw Persoon
    </button>
  </div>

  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-gray-50 border-b text-sm text-gray-500 uppercase">
        <tr>
          <th class="p-4 w-16 text-center">Foto</th>
          <th class="p-4">Naam</th>
          <th class="p-4">Status</th>
          <th class="p-4">Studie</th>
          <th class="p-4 text-right">Acties</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        {#each data.personen as p}
          <tr class="hover:bg-gray-50 transition">
            <td class="p-4">
              <div class="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border">
                {#if p.foto}
                  <img
                    src={pb.files.getUrl(p, p.foto, { thumb: '100x100' })}
                    alt=""
                    class="w-full h-full object-cover"
                  />
                {/if}
              </div>
            </td>
            <td class="p-4 font-medium">{p.naam}</td>
            <td class="p-4"
              ><span class="px-2 py-1 text-xs font-semibold bg-gray-100 rounded">{p.status}</span
              ></td
            >
            <td class="p-4 text-gray-500">{p.expand?.studie?.code || '-'}</td>
            <td class="p-4 text-right space-x-3">
              <button on:click={() => (bewerkLid = p)} class="text-blue-600 hover:underline"
                >Bewerk</button
              >
              <button
                on:click={() => (lidOmTeVerwijderen = p)}
                class="text-red-400 hover:text-red-600"
              >
                Verwijder
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if lidOmTeVerwijderen}
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-[60]"
    >
      <div class="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl text-center">
        <div
          class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 class="text-xl font-bold mb-2">Weet je het zeker?</h2>
        <p class="text-gray-500 mb-6">
          Je staat op het punt om <strong>{lidOmTeVerwijderen.naam}</strong> permanent te verwijderen.
          Dit kan niet ongedaan worden gemaakt.
        </p>

        <div class="flex gap-3">
          <button
            type="button"
            on:click={() => (lidOmTeVerwijderen = null)}
            class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Annuleren
          </button>

          <form
            method="POST"
            action="?/delete"
            use:enhance={({ formData }) => {
              const id = formData.get('id');
              data.personen = data.personen.filter((p) => p.id !== id);
              lidOmTeVerwijderen = null;

              return async ({ result, update }) => {
                if (result.type !== 'success') {
                  await update();
                }
              };
            }}
            class="flex-1"
          >
            <input type="hidden" name="id" value={lidOmTeVerwijderen.id} />
            <button
              type="submit"
              class="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-md"
            >
              Verwijderen
            </button>
          </form>
        </div>
      </div>
    </div>
  {/if}

  {#if bewerkLid}
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
    >
      <form
        method="POST"
        action="?/save"
        use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === 'success') {
              bewerkLid = null;
              await update();
            }
          };
        }}
        enctype="multipart/form-data"
        class="bg-white p-8 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold">{bewerkLid.id ? 'Persoon Bewerken' : 'Nieuw Persoon'}</h2>
          <button
            type="button"
            on:click={() => (bewerkLid = null)}
            class="text-gray-400 hover:text-black text-2xl">&times;</button
          >
        </div>

        {#if bewerkLid.id}<input type="hidden" name="id" value={bewerkLid.id} />{/if}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Algemene Informatie
            </h3>

            <label class="block">
              <span class="text-sm font-medium">Naam</span>
              <input
                name="naam"
                value={bewerkLid.naam ?? ''}
                required
                class="w-full border rounded-lg p-2.5 mt-1"
              />
            </label>

            <div class="grid grid-cols-2 gap-4">
              <label class="block">
                <span class="text-sm font-medium">Status</span>
                <select
                  name="status"
                  value={bewerkLid.status ?? 'lid'}
                  class="w-full border rounded-lg p-2.5 mt-1"
                >
                  <option value="lid">Lid</option>
                  <option value="erelid">Ere-lid</option>
                  <option value="aspirant">Aspirant</option>
                  <option value="reunist">Reünist</option>
                </select>
              </label>
              <label class="block">
                <span class="text-sm font-medium">Studie</span>
                <select
                  name="studie"
                  value={bewerkLid.studie ?? ''}
                  class="w-full border rounded-lg p-2.5 mt-1"
                >
                  <option value="">Geen</option>
                  {#each data.studies as s}
                    <option value={s.id}>{s.code} - {s.naam}</option>
                  {/each}
                </select>
              </label>
            </div>

            <label class="block">
              <span class="text-sm font-medium">Geboortedatum</span>
              <input
                name="geboortedatum"
                value={bewerkLid.geboortedatum ?? ''}
                class="w-full border rounded-lg p-2.5 mt-1"
                placeholder="DD-MM-YYYY"
              />
            </label>

            <label class="block">
              <span class="text-sm font-medium">Foto</span>
              <div class="flex items-center gap-4 mt-2">
                {#if bewerkLid.foto}
                  <img
                    src={pb.files.getUrl(bewerkLid, bewerkLid.foto)}
                    alt=""
                    class="w-16 h-16 rounded border object-cover"
                  />
                {/if}
                <input type="file" name="foto" accept="image/*" class="text-sm" />
              </div>
            </label>
          </div>

          <div class="space-y-4">
            <h3 class="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Contact & Adres
            </h3>

            <label class="block">
              <span class="text-sm font-medium">E-mail</span>
              <input
                type="email"
                name="email"
                value={bewerkLid.email ?? ''}
                class="w-full border rounded-lg p-2.5 mt-1"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium">Telefoon</span>
              <input
                name="telefoon"
                value={bewerkLid.telefoon ?? ''}
                class="w-full border rounded-lg p-2.5 mt-1"
              />
            </label>

            <div class="p-4 bg-gray-50 rounded-lg space-y-3">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Studentenadres</span>
              <input
                name="adres_student"
                value={bewerkLid.adres_student ?? ''}
                placeholder="Adres"
                class="w-full border rounded p-2 text-sm"
              />
              <input
                name="postcode_student"
                value={bewerkLid.postcode_student ?? ''}
                placeholder="Postcode + Plaats"
                class="w-full border rounded p-2 text-sm"
              />
            </div>

            <div class="p-4 bg-gray-50 rounded-lg space-y-3">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Thuisthuis Adres</span>
              <input
                name="adres_thuisthuis"
                value={bewerkLid.adres_thuisthuis ?? ''}
                placeholder="Adres"
                class="w-full border rounded p-2 text-sm"
              />
              <input
                name="postcode_thuisthuis"
                value={bewerkLid.postcode_thuisthuis ?? ''}
                placeholder="Postcode + Plaats"
                class="w-full border rounded p-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            on:click={() => (bewerkLid = null)}
            class="px-6 py-2 text-gray-500 hover:text-black transition">Annuleren</button
          >
          <button
            type="submit"
            class="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Lid Opslaan
          </button>
        </div>
      </form>
    </div>
  {/if}
</main>
