<script lang="ts">
  const links = [
    { href: '/simulation/falling-sand', label: 'Falling Sand' },
    { href: '/simulation/game-of-life', label: 'Game of Life' },
    { href: '/simulation/stars', label: 'Moving stars', notImplemented: true }
  ];
</script>

<h1 class="pt-6 text-center text-3xl font-bold">Welcome to PixelAlchemy</h1>

<div class="flex flex-col flex-wrap gap-8 p-8 sm:flex-row">
  {#each links as { href, label, notImplemented = false }}
    <a href={notImplemented ? '/' : href} class="flex-1 rounded-xl bg-red-50 sm:flex-initial">
      <div
        class="{notImplemented
          ? 'bg-opacity-20 cursor-not-allowed bg-[repeating-linear-gradient(30deg,_#FFFF0044_0_10px,_#00000044_10px_20px)] opacity-75'
          : 'hover:scale-105 hover:bg-gray-800 hover:text-gray-200'} relative flex h-32 w-full min-w-52 flex-col items-center justify-center rounded-xl border-4 border-gray-800 text-2xl duration-150 sm:w-52">
        {label}
        {#if notImplemented}
          <span class="absolute bottom-2 text-sm italic">Not implemented yet</span>
        {/if}
      </div>
    </a>
  {/each}
</div>
