<script lang="ts">
  import '../app.css';

  let { children } = $props();
  let attempt = $state<number>(0);
  let error = $state<any>(null);

  const resetError = () => {
    error = null;
    attempt++;
  };

  const onError = (e: unknown, reset: () => void) => {
    error = e;
  };
</script>

<svelte:boundary onerror={onError}>
  {#if !error}
    {@render children()}
  {/if}
</svelte:boundary>

{#if error}
  <div class="flex h-full w-full items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold">An error occurred</h1>
      <p class="mt-2 text-gray-400">{error.message || error}</p>
      {#if attempt > 0}
        <p class="mt-2 text-gray-400">Attempt n°{attempt}</p>
      {/if}
      {#if attempt < 3}
        <button
          class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onclick={resetError}>
          Try Again
        </button>
      {:else}
        <p class="mt-2 text-red-500">
          You attempted to recover 3 times. Please contact support if the issue persists.
        </p>
      {/if}
    </div>
  </div>
{/if}
