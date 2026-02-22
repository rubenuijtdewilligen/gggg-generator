<script>
  import data from '$lib/data.json';

  const formatDate = (str) => str || '';

  const getDay = (str) => (str ? parseInt(str.split('-')[0]) : 0);
  const getMonth = (str) => (str ? parseInt(str.split('-')[1]) : 0);

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const maanden = [
    '',
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December'
  ];

  let verjaardagen = {};
  for (let i = 1; i <= 12; i++) verjaardagen[i] = [];

  const alleMensen = [
    ...(data.leden || []),
    ...(data.ereleden || []),
    ...(data.aspiranten || []),
    ...(data.reunisten || []),
    ...(data.bestuur.leden || [])
  ];

  alleMensen.forEach((p) => {
    if (p.geboortedatum) {
      const m = getMonth(p.geboortedatum);
      if (verjaardagen[m]) {
        verjaardagen[m].push({ dag: getDay(p.geboortedatum), naam: p.naam });
      }
    }
  });

  for (let i = 1; i <= 12; i++) {
    verjaardagen[i].sort((a, b) => a.dag - b.dag);
  }

  const rawReunisten = data.reunisten || [];
  const reunistenMetFoto = rawReunisten.filter((l) => l.foto && l.foto.trim() !== '');
  const reunistenZonderFoto = rawReunisten.filter((l) => !l.foto || l.foto.trim() === '');

  const categorieen = [
    { naam: 'Leden', data: data.leden || [] },
    { naam: 'Ere-leden', data: data.ereleden || [] },
    { naam: 'Aspiranten', data: data.aspiranten || [] },
    { naam: 'Reünisten', data: reunistenMetFoto }
  ];

  const alleStudies = Object.entries(data.studies || {}).sort((a, b) => a[0].localeCompare(b[0]));
  const bachelors = alleStudies.filter(([code]) => code.toUpperCase().startsWith('B'));
  const masters = alleStudies.filter(([code]) => code.toUpperCase().startsWith('M'));
</script>

<div class="w-[210mm] mx-auto bg-white font-sans text-xs">
  <section
    class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page flex flex-col justify-center items-center text-center bg-primary"
  >
    <h1
      class="century-gothic-italic text-white text-7xl leading-loose"
      style="word-spacing: 100vw;"
    >
      {data.config.titel}
      {data.config.jaren}
    </h1>
    <h3 class="century-gothic-italic text-white text-4xl mt-16">
      {data.config.jaargang}
    </h3>
  </section>

  <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page"></section>

  <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page text-2xl">
    <img src="/logo.svg" alt="Logo" class="mt-16 opacity-40 h-160" />
    <p class="mt-24">
      Brabants Studenten Gilde<br />
      Hollandseweg 1<br />
      6706 KN Wageningen
    </p>
    <p class="my-10">bsg@wur.nl</p>
    <p>www.hetbsg.nl</p>
  </section>

  <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page">
    <h2 class="text-5xl century-gothic-italic-bold text-center mt-16">
      {data.bestuur.naam}
    </h2>
    <img
      src={data.bestuur.foto}
      alt="Bestuur"
      class="max-w-xl w-full mx-auto my-16 object-contain"
    />
    <div class="text-lg text-center">
      <i>van links naar rechts</i>
      {#each data.bestuur.leden as lid}
        <div>{lid.rol}: {lid.naam}</div>
      {/each}
    </div>
  </section>

  <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page">
    <h2 class="text-5xl century-gothic-italic-bold text-center my-8">Het Hertog Jan</h2>
    <img src="/hertogjan.png" alt="Het Hertog Jan" class="h-auto max-h-[80%] mx-auto" />
  </section>

  <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page">
    <h2 class="text-4xl century-gothic-italic-bold text-center mb-4">Verjaardagen</h2>

    <div class="grid grid-cols-2 gap-x-10 gap-y-1 text-sm">
      {#each [1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6, 12] as m}
        <div class="mb-1 break-inside-avoid">
          <div
            class="font-bold mb-0.5 border-b border-gray-200 uppercase text-[10px] tracking-wider"
          >
            {maanden[m]}
          </div>
          {#each verjaardagen[m] as jarige}
            <div class="flex leading-none py-[1px]">
              <span class="w-[20px] shrink-0 font-medium text-gray-500">{jarige.dag}</span>
              <span class="truncate">{jarige.naam}</span>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </section>

  <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page">
    <h2 class="text-5xl century-gothic-italic-bold text-center my-8">Studies</h2>
    <div class="flex gap-[20mm] mt-[10mm] text-[10pt]">
      <div class="flex-1 flex flex-col gap-1">
        <h3 class="font-bold text-lg mb-4 border-b border-gray-300 pb-1">Bachelor</h3>
        {#each bachelors as [code, naam]}
          <div class="flex items-baseline leading-snug">
            <span class="font-bold w-[60px] shrink-0">{code}</span>
            <span>{naam}</span>
          </div>
        {/each}
      </div>

      <div class="flex-1 flex flex-col gap-1">
        <h3 class="font-bold text-lg mb-4 border-b border-gray-300 pb-1">Master</h3>
        {#each masters as [code, naam]}
          <div class="flex items-baseline leading-snug">
            <span class="font-bold w-[60px] shrink-0">{code}</span>
            <span>{naam}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  {#each categorieen as categorie}
    {#if categorie.data.length > 0}
      {#each chunkArray(categorie.data, 8) as paginaLeden}
        {@const rijen = chunkArray(paginaLeden, 2)}

        <section class="h-[297mm] w-full p-[10mm_15mm] overflow-hidden break-after-page">
          <h2 class="text-5xl century-gothic-italic-bold text-center my-8">
            {categorie.naam}
          </h2>

          <div class="flex flex-col gap-[5mm] mt-[5mm]">
            {#each rijen as rijLeden, rijIndex}
              <div class="grid grid-cols-2 gap-[15mm]">
                {#each rijLeden as lid}
                  <div class="flex break-inside-avoid">
                    <div class="w-[35mm] h-[45mm] bg-gray-200 mr-2.5 shrink-0 overflow-hidden">
                      {#if lid.foto}
                        <img src={lid.foto} alt={lid.naam} class="w-full h-full object-cover" />
                      {/if}
                    </div>

                    <div class="text-[10px] leading-[1.3] overflow-hidden">
                      <b class="text-xs mb-0.5 block">{lid.naam}</b>
                      <p>{formatDate(lid.geboortedatum)}</p>
                      <p class="break-all">{lid.email}</p>

                      <br />

                      {#if lid.adres_student}
                        <p>{lid.adres_student}</p>
                        <p>{lid.postcode_student}</p>
                      {/if}
                      <p>{lid.telefoon}</p>

                      <br />

                      {#if lid.studie}<p>{lid.studie}</p>{/if}

                      <br />

                      {#if lid.adres_thuisthuis}
                        <p>{lid.adres_thuisthuis}</p>
                        <p>{lid.postcode_thuisthuis}</p>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>

              {#if rijIndex < rijen.length - 1}
                <div class="h-[15px] w-full bg-[#999]"></div>
              {/if}
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  {/each}

  {#if reunistenZonderFoto.length > 0}
    <section class="min-h-[297mm] w-full p-[10mm_15mm] break-after-page">
      <h2 class="text-5xl century-gothic-italic-bold text-center my-8">Reünisten</h2>
      <div class="columns-2 gap-[10mm]">
        {#each reunistenZonderFoto as lid}
          <div class="mb-4 break-inside-avoid">
            <div class="font-bold">
              {lid.naam}
            </div>
            <div>{formatDate(lid.geboortedatum)}</div>
            <div>{lid.adres_student || lid.adres_thuisthuis || ''}</div>
            <div>{lid.postcode_student || lid.postcode_thuisthuis || ''}</div>
            <div>{lid.telefoon}</div>
            <div class="break-all">{lid.email}</div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <section class="h-[297mm] w-full break-after-page bg-primary"></section>
</div>

<style>
  @media print {
    @page {
      size: A4;
      margin: 0; /* Verwijder de browser marges */
    }

    :global(body) {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      margin: 0;
      padding: 0;
    }

    /* Zorg dat de container de volledige breedte pakt en niet centreert */
    .w-\[210mm\] {
      width: 210mm !important;
      margin: 0 !important;
    }

    /* Voorkom page break na het allerlaatste element */
    section:last-child {
      break-after: auto !important;
      page-break-after: auto !important;
    }

    /* Forceer de container om precies te passen */
    .w-\[210mm\] {
      height: auto !important;
      overflow: visible !important;
    }
  }
</style>
