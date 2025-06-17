<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';
  let sketchInstance: p5;

  const xSize = innerWidth.current!;
  const ySize = innerHeight.current!;
  const cellSize = 7;
  const brushSize = 5;

  let color = 360;
  let showTooltip = true;

  const cols = Math.floor(xSize / cellSize);
  const rows = Math.floor(ySize / cellSize);
  let grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  const moveSand = () => {
    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const state = grid[i][j];
        if (state > 0) {
          if (grid[i + 1]?.[j] === 0) {
            newGrid[i + 1][j] = state;
          } else {
            const dir = Math.random() <= 0.5 ? 1 : -1;
            if (grid[i + 1]?.[j + dir] === 0) {
              newGrid[i + 1][j + dir] = state;
            } else if (grid[i + 1]?.[j - dir] === 0) {
              newGrid[i + 1][j - dir] = state;
            } else {
              newGrid[i][j] = state;
            }
          }
        }
      }
    }

    grid = newGrid;
  };

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(xSize, ySize);
      p.background(0, 0, 20);
      p.colorMode('hsb', 360, 255, 255);
    };

    p.draw = () => {
      p.clear();
      p.background(0, 0, 20);
      p.fill(0, 0, 255);
      p.noStroke();

      if (showTooltip) {
        p.textSize(50);
        p.text('Drag mouse to draw', xSize / 2 - 225, 150);
      }

      if (p.mouseIsPressed) {
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
        for (let j = 0; j < cols; j++) {
          if (grid[i][j] > 0) {
            p.fill(grid[i][j], 255, 255);
            p.square(j * cellSize, i * cellSize, cellSize);
          }
        }
      }

      moveSand();
    };
  };

  onMount(() => {
    sketchInstance = new p5(sketch, document.getElementById('p5-container')!);
  });

  onDestroy(() => {
    sketchInstance.remove();
  });
</script>

<svelte:window
  onresize={() => {
    sketchInstance && sketchInstance.resizeCanvas(innerWidth.current!, innerHeight.current!);
  }} />

<div id="p5-container" class="h-full w-full overflow-hidden"></div>
