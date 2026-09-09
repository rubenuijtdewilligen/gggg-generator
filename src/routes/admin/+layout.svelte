<script>
  import { resolve } from '$app/paths';
</script>

<nav class="bg-gray-800 text-white p-4 flex gap-4">
  <b class="mr-4">GGGG maker</b>
  <a href={resolve('/admin')} class="hover:underline">Home</a>
  <a href={resolve('/admin/personen')} class="hover:underline">Personen</a>
  <a href={resolve('/admin/studies')} class="hover:underline">Studies</a>
  <a href={resolve('/admin/bestuur')} class="hover:underline">Bestuur</a>
  <a href={resolve('/admin/config')} class="hover:underline">Instellingen</a>
  <a href={resolve('/result')} class="ml-auto text-yellow-400 hover:underline" target="_blank">
    Bekijk GGGG →
  </a>
</nav>

<slot />
