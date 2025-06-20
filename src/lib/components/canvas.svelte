<script lang="ts">
  import type { IShortcut } from '$lib/types/shortcuts';
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';
  import Options from './options.svelte';
  import ShortcutsInfo from './shortcutsInfo.svelte';

  const {
    options,
    sketch,
    shortcuts
  }: { options?: () => any; sketch: (p: p5) => any; shortcuts?: IShortcut[] } = $props();

  let sketchInstance: p5;

  onMount(() => {
    sketchInstance = new p5(sketch, document.getElementById('p5-container')!);

    sketchInstance.windowResized = () => {
      sketchInstance.resizeCanvas(innerWidth.current!, innerHeight.current!);
    };
  });

  onDestroy(() => {
    sketchInstance.remove();
  });
</script>

<div id="p5-container" class="h-full w-full overflow-hidden"></div>

<Options {options} />
<ShortcutsInfo {shortcuts} />
