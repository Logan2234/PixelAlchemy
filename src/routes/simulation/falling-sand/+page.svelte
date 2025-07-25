<script lang="ts">
  import Canvas from '$lib/components/canvas.svelte';
  import type { IShortcut } from '$lib/types/shortcuts';
  import p5 from 'p5';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';

  const xSize = $derived(innerWidth.current!);
  const ySize = $derived(innerHeight.current!);

  let play = $state(true);
  let brushSize = $state(5);
  let cellSize = $state(7);
  let frameRate = $state(30);

  let color = 360;
  let showTooltip = true;
  let mouseHoversCanvas = false;

  const shortcuts: IShortcut[] = [
    {
      key: ' ',
      description: 'Toggle Play/Pause',
      action: (_) => {
        play = !play;
      }
    },
    {
      key: 'r',
      description: 'Reset Grid',
      action: (p5) => {
        p5.background(20);
        grid = buildNewGrid();
        nextGrid = buildNewGrid();
      }
    },
    {
      key: '+',
      description: 'Increase Cell Size',
      action: (p5) => {
        p5.background(20);
        cellSize = Math.min(cellSize + 1, 50);
      }
    },
    {
      key: '-',
      description: 'Decrease Cell Size',
      action: (p5) => {
        p5.background(20);
        cellSize = Math.max(cellSize - 1, 5);
      }
    }
  ];

  const buildNewGrid = () => Array.from({ length: rows }, () => Array(cols).fill(0));

  let cols = $derived(Math.floor(xSize / cellSize));
  let rows = $derived(Math.floor(ySize / cellSize));
  let grid = buildNewGrid();
  let nextGrid = buildNewGrid();

  $effect(() => {
    grid = buildNewGrid();
    nextGrid = buildNewGrid();
  });

  const moveSand = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const state = grid[i][j];
        if (state > 0) {
          if (grid[i + 1]?.[j] === 0) {
            nextGrid[i + 1][j] = state;
          } else {
            const dir = Math.random() <= 0.5 ? 1 : -1;
            if (grid[i + 1]?.[j + dir] === 0) {
              nextGrid[i + 1][j + dir] = state;
            } else if (grid[i + 1]?.[j - dir] === 0) {
              nextGrid[i + 1][j - dir] = state;
            } else {
              nextGrid[i][j] = state;
            }
          }
        }
      }
    }

    grid = nextGrid;
    nextGrid = buildNewGrid();
  };

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

      p.noSmooth().noStroke();
      p.background(0, 0, 20);
      p.colorMode('hsb', 360, 255, 255);
    };

    p.draw = () => {
      p.background(0, 0, 20);
      p.frameRate(frameRate);
      p.fill(0, 0, 255);

      if (showTooltip) {
        p.textSize(50);
        p.text('Drag mouse to draw', xSize / 2 - 225, 150);
      }

      if (p.mouseIsPressed && mouseHoversCanvas) {
        showTooltip = false;
        const y = Math.round(p.mouseY / cellSize);
        const x = Math.round(p.mouseX / cellSize);

        const spread = Math.round(brushSize / 2);

        for (let i = y - spread; i <= y + spread; i++) {
          for (let j = x - spread; j <= x + spread; j++) {
            if (Math.random() <= 0.1 && grid[i]?.[j] !== undefined) {
              grid[i][j] = color;
            }
          }
        }

        color = (color + 0.5) % 360;
      }

      for (let i = 0; i < rows; i++) {
        const row = grid[i];
        const y = i * cellSize;
        for (let j = 0; j < cols; j++) {
          const value = row[j];
          if (value > 0) {
            p.fill(value, 255, 255);
            p.square(j * cellSize, y, cellSize);
          }
        }
      }

      if (play) {
        moveSand();
      }
    };
  };
</script>

<Canvas {sketch} {shortcuts}>
  {#snippet options()}
    <div class="flex flex-col gap-1">
      <label for="brushSize" class="text-center text-sm">Brush size: {brushSize}</label>
      <input id="brushSize" type="range" min={1} max={50} bind:value={brushSize} />
    </div>
    <div class="flex flex-col gap-1">
      <label for="cellSize" class="text-center text-sm">Cell size: {cellSize}</label>
      <input id="cellSize" type="range" min={3} max={25} bind:value={cellSize} />
    </div>
    <div class="flex flex-col gap-1">
      <label for="frameRate" class="text-center text-sm">Frame rate: {frameRate}</label>
      <input id="frameRate" type="range" min={5} max={60} bind:value={frameRate} />
    </div>
  {/snippet}
</Canvas>
