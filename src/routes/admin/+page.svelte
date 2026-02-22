<script>
  export let data;
  const { stats, huidigBestuur } = data;

  const menus = [
    {
      titel: 'Personen',
      beschrijving: 'Beheer leden, ere-leden, aspiranten en reünisten.',
      href: '/admin/personen',
      icon: '👥',
      kleur: 'bg-blue-500'
    },
    {
      titel: 'Studies',
      beschrijving: 'Beheer de bachelor- en masterstudies.',
      href: '/admin/studies',
      icon: '📚',
      kleur: 'bg-red-500'
    },
    {
      titel: 'Bestuur',
      beschrijving: 'Pas de bestuursnaam, foto en rollen aan.',
      href: '/admin/bestuur',
      icon: '🏛️',
      kleur: 'bg-purple-500'
    },
    {
      titel: 'Configuratie',
      beschrijving: 'Wijzig titel, jaargang en de kleur.',
      href: '/admin/config',
      icon: '⚙️',
      kleur: 'bg-gray-600'
    },
    {
      titel: 'Gids genereren',
      beschrijving: 'Bekijk en print de GGGG.',
      href: '/gids',
      icon: '📖',
      kleur: 'bg-green-600',
      target: '_blank'
    }
  ];

  let leden =
    typeof huidigBestuur.leden_json === 'string'
      ? JSON.parse(huidigBestuur.leden_json || '[]')
      : huidigBestuur.leden_json || [];
</script>

<main class="p-8 max-w-6xl mx-auto font-sans">
  <header class="mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900">GGGG maker</h1>
    <p class="text-lg text-gray-500 mt-2">
      Welkom! Via hier genereer je makkelijk een GGGG voor Het BSG. Custom web software door Ruben
      Uijtdewilligen.
    </p>
  </header>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <span class="text-gray-400 text-sm font-bold uppercase">Leden</span>
      <p class="text-3xl font-black text-blue-600">{stats.leden}</p>
    </div>
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <span class="text-gray-400 text-sm font-bold uppercase">Aspiranten</span>
      <p class="text-3xl font-black text-orange-500">{stats.aspiranten}</p>
    </div>
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <span class="text-gray-400 text-sm font-bold uppercase">Reünisten</span>
      <p class="text-3xl font-black text-gray-700">{stats.reunisten}</p>
    </div>
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <span class="text-gray-400 text-sm font-bold uppercase">Totaal in GGGG</span>
      <p class="text-3xl font-black text-green-600">{stats.totaal}</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="grid grid-cols-1 gap-4">
      {#each menus as item}
        <a
          href={item.href}
          target={item.target || '_self'}
          class="group flex items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div
            class="{item.kleur} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform"
          >
            {item.icon}
          </div>
          <div class="ml-6">
            <h3 class="text-xl font-bold text-gray-900">{item.titel}</h3>
            <p class="text-sm text-gray-500">{item.beschrijving}</p>
          </div>
          <span class="ml-auto text-gray-300 group-hover:text-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </a>
      {/each}
    </div>

    <div
      class="bg-gray-900 text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative"
    >
      <div class="relative z-10">
        <h3 class="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">
          Huidig Bestuur
        </h3>
        {#if huidigBestuur}
          <h2 class="text-3xl font-serif italic mb-2">{huidigBestuur.naam}</h2>

          <div class="mt-8 space-y-2 opacity-80">
            {#each leden as lid}
              <div class="text-sm border-l border-blue-500 pl-4 py-1">
                <span class="font-bold">{lid.rol}:</span>
                {lid.naam}
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 italic">Geen bestuur geconfigureerd.</p>
        {/if}
      </div>

      <div
        class="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"
      ></div>
    </div>
  </div>
</main>
