<script>
  import { enhance } from '$app/forms';

  export let data;
  let bewerkStudie = null;
  let studieOmTeVerwijderen = null;
</script>

<main class="p-8 max-w-4xl mx-auto font-sans">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Studiebeheer</h1>
      <p class="text-gray-500">
        Beheer de bachelor- en masterstudies die aan leden gekoppeld kunnen worden.
      </p>
    </div>
    <button
      on:click={() => (bewerkStudie = { code: '', naam: '' })}
      class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg"
    >
      + Nieuwe Studie
    </button>
  </div>

  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-gray-50 border-b text-sm text-gray-500 uppercase">
        <tr>
          <th class="p-4 w-32">Code</th>
          <th class="p-4">Naam</th>
          <th class="p-4 text-right">Acties</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        {#each data.studies as s}
          <tr class="hover:bg-gray-50 transition">
            <td class="p-4 font-mono font-bold text-blue-600">{s.code}</td>
            <td class="p-4">{s.naam}</td>
            <td class="p-4 text-right space-x-3">
              <button on:click={() => (bewerkStudie = s)} class="text-blue-600 hover:underline"
                >Bewerk</button
              >
              <button
                on:click={() => (studieOmTeVerwijderen = s)}
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

  {#if studieOmTeVerwijderen}
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
    >
      <div class="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl text-center">
        <h2 class="text-xl font-bold mb-2">Studie verwijderen?</h2>
        <p class="text-gray-500 mb-6">
          Weet je zeker dat je <strong>{studieOmTeVerwijderen.code}</strong> wilt verwijderen? Leden die
          deze studie hebben, verliezen deze koppeling.
        </p>
        <div class="flex gap-3">
          <button
            on:click={() => (studieOmTeVerwijderen = null)}
            class="flex-1 px-4 py-2 border rounded-lg">Annuleren</button
          >
          <form
            method="POST"
            action="?/delete"
            use:enhance={() => {
              return async ({ update }) => {
                studieOmTeVerwijderen = null;
                await update();
              };
            }}
            class="flex-1"
          >
            <input type="hidden" name="id" value={studieOmTeVerwijderen.id} />
            <button
              type="submit"
              class="w-full px-4 py-2 bg-red-600 text-white font-bold rounded-lg"
              >Verwijderen</button
            >
          </form>
        </div>
      </div>
    </div>
  {/if}

  {#if bewerkStudie}
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
    >
      <form
        method="POST"
        action="?/save"
        use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === 'success') {
              bewerkStudie = null;
              await update();
            }
          };
        }}
        class="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h2 class="text-2xl font-bold mb-6">
          {bewerkStudie.id ? 'Studie Bewerken' : 'Nieuwe Studie'}
        </h2>

        {#if bewerkStudie.id}<input type="hidden" name="id" value={bewerkStudie.id} />{/if}

        <div class="space-y-4">
          <label class="block">
            <span class="text-sm font-medium">Code</span>
            <input
              name="code"
              bind:value={bewerkStudie.code}
              placeholder="bijv. BIN of MDW"
              required
              class="w-full border rounded-lg p-2.5 mt-1 font-mono uppercase"
            />
            <p class="text-[10px] text-gray-400 mt-1">
              Codes beginnend met 'B' zijn Bachelor, 'M' zijn Master.
            </p>
          </label>

          <label class="block">
            <span class="text-sm font-medium">Volledige Naam</span>
            <input
              name="naam"
              bind:value={bewerkStudie.naam}
              placeholder="bijv. Informatica"
              required
              class="w-full border rounded-lg p-2.5 mt-1"
            />
          </label>
        </div>

        <div class="mt-8 flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            on:click={() => (bewerkStudie = null)}
            class="px-6 py-2 text-gray-500">Annuleren</button
          >
          <button
            type="submit"
            class="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md">Opslaan</button
          >
        </div>
      </form>
    </div>
  {/if}
</main>
