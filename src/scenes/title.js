// TitleScene — coordinates the HTML cover-art overlay.
//
// Behavior:
//   - On enter, asks the cover-art <img> to fade in (and shows the PRESS Z prompt).
//   - The canvas itself stays dark so the cover dominates the frame.
//   - On Z: fade the cover out, then push IntroScene (narrative pages).
//   - X erases save when one is present.
//
// If the cover image is missing (404), the <img> stays invisible and we render
// a procedural fallback title on the canvas.

import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';
import { IntroScene } from './intro.js';

const COVER_FADE_OUT_MS = 600;

export class TitleScene extends Scene {
  enter() {
    this.t = 0;
    this.hasSave = false;
    try { this.hasSave = !!localStorage.getItem('carrot-keeper:save'); } catch {}

    // Phase: 'cover' (overlay shown) | 'fading' (overlay fading out) | 'fallback'
    this.phase = 'cover';
    this.fadeStart = 0;

    this.coverEl = document.getElementById('cover-art');
    this.promptEl = document.getElementById('cover-prompt');
    this.coverLoaded = false;

    if (this.coverEl) {
      // Listen for load/error
      const onLoad = () => {
        this.coverLoaded = true;
        if (this.phase === 'cover') {
          this.coverEl.classList.add('visible');
          if (this.promptEl) this.promptEl.classList.add('visible');
        }
      };
      const onErr = () => {
        // Image missing — switch to procedural fallback
        this.phase = 'fallback';
        this.coverEl.style.display = 'none';
        if (this.promptEl) this.promptEl.style.display = 'none';
      };
      if (this.coverEl.complete && this.coverEl.naturalWidth > 0) {
        onLoad();
      } else if (this.coverEl.complete) {
        onErr();
      } else {
        this.coverEl.addEventListener('load', onLoad, { once: true });
        this.coverEl.addEventListener('error', onErr, { once: true });
      }
    } else {
      this.phase = 'fallback';
    }
  }

  exit() {
    // Always clear the overlay state on exit so it doesn't hang around mid-game
    if (this.coverEl) {
      this.coverEl.classList.remove('visible', 'fading');
      this.coverEl.style.display = '';
    }
    if (this.promptEl) {
      this.promptEl.classList.remove('visible');
      this.promptEl.style.display = '';
    }
  }

  update(dt) {
    this.t += dt;
    const inp = this.game.input;

    if (this.phase === 'cover' || this.phase === 'fallback') {
      if (inp.pressed.a) {
        // First user gesture — unlock audio and start the theme
        this.game.audio.resume();
        this.game.playSong('lodi');
        this.game.audio.confirm();

        // Start the game state appropriately
        if (this.hasSave) this.game.load();
        else this.game.reset();

        if (this.phase === 'cover' && this.coverEl) {
          // Begin fade-out of the overlay
          this.coverEl.classList.add('fading');
          this.coverEl.classList.remove('visible');
          if (this.promptEl) this.promptEl.classList.remove('visible');
          this.phase = 'fading';
          this.fadeStart = performance.now();
        } else {
          // Fallback path: jump straight to intro
          this.game.scenes.replace(new IntroScene(this.game));
        }
      }
      if (inp.pressed.b && this.hasSave) {
        this.game.reset();
        this.hasSave = false;
      }
    } else if (this.phase === 'fading') {
      if (performance.now() - this.fadeStart >= COVER_FADE_OUT_MS) {
        if (this.coverEl) {
          this.coverEl.classList.remove('fading');
          this.coverEl.style.display = 'none';
        }
        this.game.scenes.replace(new IntroScene(this.game));
      }
    }
  }

  render(r) {
    if (this.phase === 'cover' || this.phase === 'fading') {
      // Canvas stays mostly dark; the HTML cover overlay is doing the work.
      r.clear('#0f0f0f');
      return;
    }
    // Fallback rendering — procedural title
    r.clear('#0f380f');
    const f = this.game.font;
    const title = 'CARROT KEEPER';
    const tw = f.measure(title);
    f.draw(r.ctx, title, ((SCREEN_W - tw) / 2 | 0) + 1, 33, '#306230');
    f.draw(r.ctx, title, ((SCREEN_W - tw) / 2 | 0),     32, '#f0f0e8');

    const sub = 'CHAPTER 1 - LODI';
    const sw = f.measure(sub);
    f.draw(r.ctx, sub, (SCREEN_W - sw) / 2 | 0, 48, '#9bbc0f');

    const tag = 'A NODDY ADVENTURE';
    const tgw = f.measure(tag);
    f.draw(r.ctx, tag, (SCREEN_W - tgw) / 2 | 0, 60, '#7a7a7a');

    r.drawSprite(this.game.sprites['noddy_down_0'], 60, 78);
    r.drawSprite(this.game.sprites['carrot'], 84, 78);

    const blink = (Math.floor(this.t * 2) % 2) === 0;
    if (blink) {
      const msg = 'PRESS Z TO PLAY';
      const mw = f.measure(msg);
      f.draw(r.ctx, msg, (SCREEN_W - mw) / 2 | 0, 110, '#f0f0e8');
    }

    if (this.hasSave) {
      const msg2 = 'X TO ERASE SAVE';
      const mw2 = f.measure(msg2);
      f.draw(r.ctx, msg2, (SCREEN_W - mw2) / 2 | 0, 126, '#7a7a7a');
    }
  }
}
