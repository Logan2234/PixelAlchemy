<script lang="ts">
  import Canvas from '$lib/components/canvas.svelte';
  import type { IShortcut } from '$lib/types/shortcuts';
  import p5 from 'p5';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';

  let mouseHoversCanvas = false;
  let p5Canvas: p5 | null = null;

  const xSize = $derived(innerWidth.current!);
  const ySize = $derived(innerHeight.current!);

  let cellSize = $state(15);
  let frameRate = $state(10);
  let spawnProbability = $state(0.1);
  let play = $state(false);

  let cols = $derived(Math.floor(xSize / cellSize));
  let rows = $derived(Math.floor(ySize / cellSize));
  let grid: number[][] = [];
  let nextGrid: number[][] = [];

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
        grid = buildNewGrid(true);
        nextGrid = buildNewGrid();
        moveCells();
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

  const buildNewGrid = (withRandomValues: boolean = false) =>
    Array.from({ length: rows }, () =>
      Array(cols)
        .fill(0)
        .map(() => (withRandomValues ? (Math.random() <= spawnProbability ? 1 : 0) : 0))
    );

  $effect(() => {
    if (cellSize) {
      p5Canvas?.background(20);
      grid = buildNewGrid(true);
      nextGrid = buildNewGrid();
      moveCells();
    }
  });

  const countSurroundingLivingCells = (i: number, j: number): number => {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        const ni = i + x;
        const nj = j + y;
        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grid[ni][nj] === 1) {
          count++;
        }
      }
    }

    return count;
  };

  const moveCells = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const state = grid[i][j];
        const surroundingLivingCells = countSurroundingLivingCells(i, j);
        if (state === 0 && surroundingLivingCells === 3) {
          nextGrid[i][j] = 1;
        } else if (state === 1 && surroundingLivingCells >= 2 && surroundingLivingCells <= 3) {
          nextGrid[i][j] = 1;
        }
      }
    }

    grid = nextGrid;
    nextGrid = buildNewGrid();
  };

  const sketch = (p: p5) => {
    p.setup = () => {
      p5Canvas = p;

      const canvas = p.createCanvas(xSize, ySize);
      canvas.mouseOver(() => {
        mouseHoversCanvas = true;
      });

      canvas.mouseOut(() => {
        mouseHoversCanvas = false;
      });

      p.mouseClicked = (_: MouseEvent) => {
        if (mouseHoversCanvas) {
          const x = Math.floor(p.mouseX / cellSize);
          const y = Math.floor(p.mouseY / cellSize);
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[y][x] = (grid[y][x] + 1) % 2;
          }
        }
      };

      p.keyPressed = (event: KeyboardEvent) => {
        const shortcut = shortcuts.find((s) => s.key === event.key);
        if (shortcut) {
          event.preventDefault();
          shortcut.action(p);
        }
      };

      p.noSmooth();
      p.background(20);
    };

    p.draw = () => {
      p.frameRate(frameRate);

      if (play) {
        moveCells();
      }

      p.fill(0);
      p.stroke(40);

      for (let i = 0; i < rows; i++) {
        const y = i * cellSize;
        for (let j = 0; j < cols; j++) {
          p.fill(grid[i][j] ? 255 : 20);
          p.square(j * cellSize, y, cellSize);
        }
      }
    };
  };
</script>

<Canvas {sketch} {shortcuts}>
  {#snippet options()}
    <div class="flex flex-col gap-1">
      <label for="cellSize" class="text-center text-sm">Cell Size: {cellSize}</label>
      <input type="range" id="cellSize" min="5" max="50" bind:value={cellSize} class="slider" />
    </div>
    <div class="flex flex-col gap-1">
      <label for="frameRate" class="text-center text-sm">Framerate: {frameRate}</label>
      <input type="range" id="frameRate" min="5" max="50" bind:value={frameRate} class="slider" />
    </div>
    <div class="flex flex-col gap-1">
      <label for="spawnProbability" class="text-center text-sm"
        >Spawn Probability: {spawnProbability}</label>
      <input
        type="range"
        id="spawnProbability"
        min="0.05"
        max="0.5"
        step="0.01"
        bind:value={spawnProbability}
        class="slider" />
    </div>
  {/snippet}
</Canvas>
