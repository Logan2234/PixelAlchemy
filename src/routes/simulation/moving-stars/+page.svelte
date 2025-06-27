<script lang="ts">
  import Canvas from '$lib/components/canvas.svelte';
  import type { IShortcut } from '$lib/types/shortcuts';
  import p5 from 'p5';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';

  interface Vector3D {
    x: number;
    y: number;
    z: number;
  }

  type Star = Vector3D & { hasRespawned?: boolean };

  const xSize = $derived(innerWidth.current!);
  const ySize = $derived(innerHeight.current!);
  const middleX = $derived(xSize / 2);
  const middleY = $derived(ySize / 2);

  let frameRate = $state(30);

  let speed = $state(5);
  let numberOfStars = $state(1000);
  let withPerspective = $state(true);

  let mouseHoversCanvas = false;

  const shortcuts: IShortcut[] = [];
  //   {
  //     key: ' ',
  //     description: 'Toggle Play/Pause',
  //     action: (_) => {
  //       play = !play;
  //     }
  //   },
  //   {
  //     key: 'r',
  //     description: 'Reset Grid',
  //     action: (p5) => {
  //       p5.background(20);
  //       grid = buildNewGrid();
  //       nextGrid = buildNewGrid();
  //     }
  //   },
  //   {
  //     key: '+',
  //     description: 'Increase Cell Size',
  //     action: (p5) => {
  //       p5.background(20);
  //       cellSize = Math.min(cellSize + 1, 50);
  //     }
  //   },
  //   {
  //     key: '-',
  //     description: 'Decrease Cell Size',
  //     action: (p5) => {
  //       p5.background(20);
  //       cellSize = Math.max(cellSize - 1, 5);
  //     }
  //   }
  // ];

  let previousStars = $state<Star[][]>([]);
  let stars = $state<Star[]>([]);

  $effect(() => {
    stars = Array.from({ length: numberOfStars }, () => ({
      x: Math.random() * xSize,
      y: Math.random() * ySize,
      z: Math.random() * 2500 + 500
    }));
    previousStars = [];
  });

  const sketch = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(xSize, ySize);

      canvas.mouseOver(() => {
        mouseHoversCanvas = true;
      });

      canvas.mouseOut(() => {
        mouseHoversCanvas = false;
      });

      p.keyPressed = () => {
        const shortcut = shortcuts.find((s) => s.key.toLowerCase() === p.key.toLowerCase());
        if (shortcut) {
          shortcut.action(p);
        }
      };

      Array.from({ length: numberOfStars }).forEach(() => {
        stars.push({ x: p.random(0, xSize), y: p.random(0, ySize), z: p.random(500, 3000) });
      });

      p.noSmooth();
      p.background(20);

      p.fill(255);
      p.stroke(255);
      p.frameRate(frameRate);
    };

    p.draw = () => {
      p.background(20);
      const nowStars: Star[] = [];

      stars.forEach((star, i) => {
        const perspective = 3000 / star.z;

        const x = star.x + (middleX - star.x) * perspective;
        const y = star.y + (middleY - star.y) * perspective;
        const spanBeforeRespawn = 500;

        if (
          x < -spanBeforeRespawn ||
          x > xSize + spanBeforeRespawn ||
          y < -spanBeforeRespawn ||
          y > ySize + spanBeforeRespawn ||
          star.z < 0
        ) {
          nowStars.push({ x, y, z: star.z, hasRespawned: true });
          star.z = 2000;
          star.x = Math.random() * xSize;
          star.y = Math.random() * ySize;
        } else {
          const size = withPerspective ? perspective / 1.5 : 1;
          p.ellipse(x, y, size, size);
          nowStars.push({ x, y, z: star.z, hasRespawned: false });
        }

        const respawnedStarIndex = previousStars?.findLastIndex((s) => s[i].hasRespawned);
        const previousStar =
          respawnedStarIndex !== -1
            ? previousStars?.[respawnedStarIndex + 1]?.[i]
            : previousStars?.[0]?.[i];

        if (previousStar) {
          p.line(previousStar.x, previousStar.y, x, y);
        }

        star.z -= speed;
      });

      if (previousStars.length === 15) {
        previousStars = previousStars.slice(1);
      }

      previousStars.push(nowStars);
    };
  };
</script>

<Canvas {sketch} {shortcuts}>
  {#snippet options()}
    <div class="flex flex-col gap-1">
      <label for="speed" class="text-center text-sm">Stars speed: {speed}</label>
      <input id="speed" type="range" min={1} max={20} bind:value={speed} />
    </div>
    <div class="flex flex-col gap-1">
      <label for="numberOfStars" class="text-center text-sm"
        >Number of stars: {numberOfStars}</label>
      <input
        id="numberOfStars"
        type="range"
        min={50}
        max={2000}
        step={25}
        bind:value={numberOfStars} />
    </div>
    <div class="flex gap-2 justify-center">
      <label for="perspective" class="text-center text-sm">With perspective:</label>
      <input id="perspective" class="mt-1" type="checkbox" bind:checked={withPerspective} />
    </div>
  {/snippet}
</Canvas>
