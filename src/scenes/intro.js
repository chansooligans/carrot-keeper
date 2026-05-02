// IntroScene — narrative pages shown after the cover art and before gameplay.
// Each page is a paragraph that fades in over a darkened canvas.

import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';
import { OverworldScene } from './overworld.js';
import { DialogScene } from './dialog.js';

const PAGES = [
  'In the rolling hills there is a village called LODI.',
  'The carrots are bright. The days are slow.',
  'Beneath the soil run the WHISPERING ROOTS — old magic that has kept the wolves from our doorsteps for generations.',
  'But the Roots are weakening. And tonight is the Harvest Festival.',
  'Wake up, Noddy. Today, your quiet days end.',
];

export class IntroScene extends Scene {
  enter() {
    this.page = 0;
    this.charProgress = 0;
    this.t = 0;
    this.fadeIn = 0;        // 0..1, opacity of the dim overlay
    this.exiting = false;
    this.exitFade = 0;
  }

  _pageText() {
    return PAGES[this.page] || '';
  }

  _pageLines() {
    return this.game.font.wrap(this._pageText(), SCREEN_W - 16);
  }

  _pageChars() {
    return this._pageText().length;
  }

  update(dt) {
    this.t += dt;
    this.fadeIn = Math.min(0.7, this.fadeIn + dt * 1.4);
    const inp = this.game.input;

    if (this.exiting) {
      this.exitFade = Math.min(1, this.exitFade + dt * 1.2);
      if (this.exitFade >= 1) {
        this.game.scenes.replace(new OverworldScene(this.game));
        // After replacing, push the very first dialog from Hazel automatically.
        // We'll rely on the player walking up to her — keep the intro clean.
      }
      return;
    }

    // Type out the current page char-by-char
    if (this.charProgress < this._pageChars()) {
      this.charProgress += inp.held.a ? 4 : 1.2;
      if (inp.pressed.a) this.charProgress = this._pageChars();
      return;
    }

    // Page is done — wait for confirm to advance
    if (inp.pressed.a) {
      this.page++;
      this.charProgress = 0;
      if (this.page >= PAGES.length) {
        this.exiting = true;
      }
    }
  }

  render(r) {
    // While the cover overlay is still visible, the canvas can stay mostly transparent.
    // For the narrative phase we draw a solid dark background under the text so it reads
    // even if the cover image is dimmed behind it.
    r.clear('#0f0f0f');
    // Faint vignette (so text reads on top)
    r.fade(this.fadeIn, '#000');

    const f = this.game.font;
    const lines = f.wrap(this._pageText(), SCREEN_W - 16);
    const lh = f.lineHeight();

    // Compute how many chars are visible
    const visibleChars = Math.floor(this.charProgress);
    let used = 0;

    const totalH = lines.length * lh;
    let y = (SCREEN_H - totalH) / 2 | 0;

    for (const line of lines) {
      const allowed = Math.max(0, Math.min(line.length, visibleChars - used));
      const visible = line.slice(0, allowed);
      const w = f.measure(line);
      f.draw(r.ctx, visible, (SCREEN_W - w) / 2 | 0, y, '#f0f0e8');
      used += line.length + 1;
      y += lh;
    }

    // Continue indicator
    if (this.charProgress >= this._pageChars()) {
      const blink = (Math.floor(this.t * 2) % 2) === 0;
      if (blink) {
        const msg = this.page === PAGES.length - 1 ? 'PRESS Z' : '>';
        const mw = f.measure(msg);
        f.draw(r.ctx, msg, SCREEN_W - mw - 6, SCREEN_H - 12, '#9bbc0f');
      }
    }

    if (this.exiting) {
      r.fade(this.exitFade, '#000');
    }
  }
}
