// Tiny canvas renderer for a 160x144 internal resolution game.

export const SCREEN_W = 160;
export const SCREEN_H = 144;
export const TILE = 16;

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(color = '#0f380f') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  }

  rect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  }

  // Outline rect
  outlineRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, 1);
    this.ctx.fillRect(x, y + h - 1, w, 1);
    this.ctx.fillRect(x, y, 1, h);
    this.ctx.fillRect(x + w - 1, y, 1, h);
  }

  // Draw a Sprite (pre-rendered canvas)
  drawSprite(sprite, x, y) {
    if (!sprite) return;
    this.ctx.drawImage(sprite.canvas, x | 0, y | 0);
  }

  // Draw a slice of a sprite (for animation strips)
  drawSlice(sprite, sx, sy, sw, sh, dx, dy) {
    this.ctx.drawImage(sprite.canvas, sx, sy, sw, sh, dx | 0, dy | 0, sw, sh);
  }

  // Tiny pixel font — see font.js. Falls back to canvas text if missing.
  text(str, x, y, color = '#f0f0e8', font = null) {
    if (!font) {
      this.ctx.fillStyle = color;
      this.ctx.font = '8px ui-monospace, monospace';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(str, x | 0, y | 0);
      return;
    }
    font.draw(this.ctx, str, x | 0, y | 0, color);
  }

  // Apply a fade overlay
  fade(alpha, color = '#0f380f') {
    this.ctx.save();
    this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    this.ctx.restore();
  }
}
