import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';
import { currentQuestHint } from '../data/story/ch1.js';

export function drawHud(r, game) {
  const f = game.font;
  // Top-left: carrot count
  const carrots = game.inv.carrot || 0;
  // Mini icon: just a tinted square + count, to keep it compact
  r.rect(2, 2, 38, 11, '#0f0f0f');
  r.outlineRect(2, 2, 38, 11, '#9bbc0f');
  r.drawSprite(game.sprites['carrot'], -3, -2); // tiny corner — actually we'll just use text
  // Overlay: "C: NN"
  const txt = `C ${String(carrots).padStart(2, '0')}`;
  f.draw(r.ctx, txt, 6, 4, '#f0f0e8');

  // Quest hint along the top right (leaving room for mute indicator)
  const muteW = 11; // small square at far right
  const hint = currentQuestHint(game);
  if (hint) {
    const maxW = SCREEN_W - 50 - muteW - 4;
    let txt = hint;
    if (f.measure(txt) > maxW) {
      while (f.measure(txt + '..') > maxW && txt.length > 1) txt = txt.slice(0, -1);
      txt = txt + '..';
    }
    const w = f.measure(txt);
    const x = SCREEN_W - w - 8 - muteW - 4;
    r.rect(x, 2, w + 6, 11, '#0f0f0f');
    r.outlineRect(x, 2, w + 6, 11, '#306230');
    f.draw(r.ctx, txt, x + 3, 4, '#f0f0e8');
  }

  // Mute indicator (top-right corner). Box with note glyph or X.
  const mx = SCREEN_W - muteW - 2;
  r.rect(mx, 2, muteW, 11, '#0f0f0f');
  r.outlineRect(mx, 2, muteW, 11, game.audio.muted ? '#a83232' : '#306230');
  // Tiny note icon: stem + flag, drawn as rects
  const noteColor = game.audio.muted ? '#7a7a7a' : '#f0f0e8';
  r.rect(mx + 3, 5, 2, 4, noteColor);          // stem
  r.rect(mx + 3, 9, 4, 2, noteColor);          // note head
  if (game.audio.muted) {
    // Slash through it
    r.rect(mx + 1, 7, muteW - 2, 1, '#a83232');
  }
}
