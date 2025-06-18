<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';
  import Options from './options.svelte';

  const { options, sketch }: { options?: () => any; sketch: (p: p5) => any } = $props();

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
