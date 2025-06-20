<script>
  import { ChevronLeft } from '@lucide/svelte';

  const { children } = $props();
</script>

<a
  href="/"
  class="group absolute top-6 left-6 flex cursor-pointer items-center justify-end gap-1 text-sm text-gray-200">
  <ChevronLeft class="w-5 transition-all duration-150 group-hover:-translate-x-1" />
  <span class="pb-0.5">Retour</span>
</a>

<div class="h-full w-full text-gray-200">
  {@render children()}
</div>
