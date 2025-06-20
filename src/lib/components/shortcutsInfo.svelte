<script lang="ts">
  import type { IShortcut } from '$lib/types/shortcuts';
  import { fade } from 'svelte/transition';

  const { shortcuts } = $props<{ shortcuts?: IShortcut[] }>();

  let showShortcuts = $state(false);

  const keyMapping = { ' ': 'Space' } as Record<string, string>;
</script>

{#if shortcuts?.length}
  <button
    class="fixed top-6 right-6 h-8 w-8 cursor-pointer rounded-md border border-gray-400 bg-black/40 transition duration-200 hover:bg-black/80"
    onclick={() => (showShortcuts = !showShortcuts)}>
    ?
  </button>
{/if}

{#if showShortcuts}
  <div class="fixed top-0 left-0 flex h-full w-full items-center justify-center backdrop-blur-sm">
    <div
      transition:fade={{ duration: 250 }}
      class="absolute w-sm rounded-2xl bg-black/90 p-6 shadow-md">
      <h3 class="mb-4 text-center text-xl font-bold">Shortcuts</h3>
      <ul>
        {#each shortcuts as shortcut}
          <li class="mb-2">
            <code class="rounded-md border border-gray-600 p-1 font-mono"
              >{keyMapping[shortcut.key] || shortcut.key.toUpperCase()}</code>
            : {shortcut.description}
          </li>
        {/each}
      </ul>
    </div>
    <div class="absolute bottom-4 w-full text-center text-sm italic">
      Press <code class="not-italic">Escape</code> to close
    </div>
  </div>
{/if}

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape') {
      showShortcuts = false;
    }
  }} />
