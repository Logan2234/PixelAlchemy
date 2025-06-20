import type p5 from 'p5';

export interface IShortcut {
  key: string;
  description: string;
  action: (p5: p5) => void;
}
