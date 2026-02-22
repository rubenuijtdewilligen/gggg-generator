<script>
  import { enhance } from '$app/forms';

  export let data;

  let config = data.config || {
    titel: 'Ledenlijst',
    jaargang: 'Jaargang 1',
    jaren: '2025-2026',
    hoofdkleur: '#ff0000'
  };

  let successMessage = false;
</script>

<main class="p-8 max-w-2xl mx-auto font-sans">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">Algemene Configuratie</h1>
    <p class="text-gray-500">Pas de teksten op de voorpagina en de huisstijl van de gids aan.</p>
  </div>

  {#if successMessage}
    <div
      class="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200 flex justify-between items-center"
    >
      <span>Instellingen succesvol opgeslagen!</span>
      <button on:click={() => (successMessage = false)} class="text-green-900 font-bold"
        >&times;</button
      >
    </div>
  {/if}

  <form
    method="POST"
    action="?/save"
    use:enhance={() => {
      return async ({ result, update }) => {
        await update({ reset: false });
        if (result.type === 'success') {
          successMessage = true;
          setTimeout(() => (successMessage = false), 3000);
        }
      };
    }}
    class="bg-white p-8 rounded-xl shadow-sm border space-y-6"
  >
    {#if config.id}<input type="hidden" name="id" value={config.id} />{/if}

    <div class="space-y-4">
      <label class="block">
        <span class="text-sm font-semibold text-gray-700">Titel op Voorpagina</span>
        <input
          name="titel"
          bind:value={config.titel}
          placeholder="bijv. LEDENLIJST"
          required
          class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </label>

      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-sm font-semibold text-gray-700">Jaargang</span>
          <input
            name="jaargang"
            bind:value={config.jaargang}
            placeholder="bijv. 95e Jaargang"
            required
            class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </label>
        <label class="block">
          <span class="text-sm font-semibold text-gray-700">Jaren</span>
          <input
            name="jaren"
            bind:value={config.jaren}
            placeholder="bijv. 2025 - 2026"
            required
            class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </label>
      </div>

      <hr class="my-6" />

      <div class="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <label class="flex flex-col gap-2 cursor-pointer">
          <span class="text-sm font-semibold text-gray-700">Hoofdkleur Gids</span>
          <input
            type="color"
            name="hoofdkleur"
            bind:value={config.hoofdkleur}
            class="h-12 w-24 cursor-pointer rounded border border-gray-300"
          />
        </label>
        <div class="flex-1">
          <p class="text-xs text-gray-500">
            Deze kleur wordt gebruikt voor de voor- en achterpagina.
          </p>
          <p class="font-mono text-sm mt-1 uppercase">{config.hoofdkleur}</p>
        </div>
      </div>
    </div>

    <div class="pt-4 border-t">
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md active:scale-[0.98]"
      >
        Configuratie opslaan
      </button>
    </div>
  </form>
</main>
