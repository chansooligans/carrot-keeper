// Sprite = pixel grid pre-rendered onto an offscreen canvas.
// Definition is an array of strings; each char is a key into the palette.

import { PALETTE } from '../data/palette.js';

export class Sprite {
  constructor(name, rows, palette = PALETTE) {
    this.name = name;
    this.rows = rows;
    this.h = rows.length;
    this.w = rows[0].length;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    const ctx = this.canvas.getContext('2d');
    for (let y = 0; y < this.h; y++) {
      const row = rows[y];
      for (let x = 0; x < this.w; x++) {
        const ch = row[x];
        const color = palette[ch];
        if (!color) continue; // transparent
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

// Helper to bake a dictionary of name -> rows into Sprites.
export function bakeSprites(dict) {
  const out = {};
  for (const [name, rows] of Object.entries(dict)) {
    out[name] = new Sprite(name, rows);
  }
  return out;
}

// A Frame strip: multiple frames laid horizontally as one sprite definition,
// to support animated walking sprites without making a big canvas per frame.
export class AnimatedSprite {
  constructor(sprite, frameW) {
    this.sprite = sprite;
    this.frameW = frameW;
    this.frameH = sprite.h;
    this.frameCount = sprite.w / frameW;
  }
  draw(ctx, frame, x, y) {
    const sx = (frame % this.frameCount) * this.frameW;
    ctx.drawImage(
      this.sprite.canvas,
      sx, 0, this.frameW, this.frameH,
      x | 0, y | 0, this.frameW, this.frameH
    );
  }
}
