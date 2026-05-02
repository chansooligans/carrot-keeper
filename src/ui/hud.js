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

  // Quest hint along the top right
  const hint = currentQuestHint(game);
  if (hint) {
    const maxW = SCREEN_W - 50; // leave room for the carrot count
    let txt = hint;
    if (f.measure(txt) > maxW) {
      while (f.measure(txt + '..') > maxW && txt.length > 1) txt = txt.slice(0, -1);
      txt = txt + '..';
    }
    const w = f.measure(txt);
    const x = SCREEN_W - w - 8;
    r.rect(x, 2, w + 6, 11, '#0f0f0f');
    r.outlineRect(x, 2, w + 6, 11, '#306230');
    f.draw(r.ctx, txt, x + 3, 4, '#f0f0e8');
  }
}
