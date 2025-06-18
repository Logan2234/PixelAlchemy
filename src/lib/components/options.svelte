<script lang="ts">
  import { ChevronLeft } from '@lucide/svelte';

  const { options } = $props();
  let showOptions = $state(false);
</script>

{#if options}
  <div
    class="fixed top-1/2 right-0 min-w-2xs {showOptions
      ? ''
      : 'translate-x-64'} flex -translate-y-1/2 items-center transition duration-300">
    <button
      type="button"
      onclick={() => (showOptions = !showOptions)}
      class="flex cursor-pointer gap-4 rounded-l-xl border-2 border-gray-200 bg-[#1E1E1E] px-2 py-1 duration-200 [writing-mode:vertical-lr]">
      <ChevronLeft class="{showOptions ? '-scale-x-100' : ''} duration-150 " />
      <span>Settings</span>
      <ChevronLeft class="{showOptions ? '-scale-x-100' : ''} duration-150" />
    </button>
    <div
      class="flex min-h-39 flex-1 flex-col gap-4 border-2 border-gray-200 bg-[#1E1E1E] p-4 text-gray-200">
      {@render options()}
    </div>
  </div>
{/if}
