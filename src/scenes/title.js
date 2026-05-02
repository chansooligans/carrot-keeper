import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';
import { OverworldScene } from './overworld.js';

export class TitleScene extends Scene {
  enter() {
    this.t = 0;
    this.hasSave = false;
    try { this.hasSave = !!localStorage.getItem('carrot-keeper:save'); } catch {}
  }

  update(dt) {
    this.t += dt;
    const inp = this.game.input;
    if (inp.pressed.a) {
      // start
      if (this.hasSave) this.game.load();
      else this.game.reset();
      this.game.scenes.replace(new OverworldScene(this.game));
    }
    if (inp.pressed.b && this.hasSave) {
      // erase save (B held on title)
      this.game.reset();
      this.hasSave = false;
    }
  }

  render(r) {
    r.clear('#0f380f');
    const f = this.game.font;
    // Title with shadow
    const title = 'CARROT KEEPER';
    const tw = f.measure(title);
    f.draw(r.ctx, title, ((SCREEN_W - tw) / 2 | 0) + 1, 33, '#306230');
    f.draw(r.ctx, title, ((SCREEN_W - tw) / 2 | 0),     32, '#f0f0e8');

    // Subtitle
    const sub = 'CHAPTER 1 - LODI';
    const sw = f.measure(sub);
    f.draw(r.ctx, sub, (SCREEN_W - sw) / 2 | 0, 48, '#9bbc0f');

    // Story tag
    const tag = 'A NODDY ADVENTURE';
    const tgw = f.measure(tag);
    f.draw(r.ctx, tag, (SCREEN_W - tgw) / 2 | 0, 60, '#7a7a7a');

    // Pixel art hint: Noddy + carrot side by side
    const noddy = this.game.sprites['noddy_down_0'];
    const carrot = this.game.sprites['carrot'];
    r.drawSprite(noddy,  60, 78);
    r.drawSprite(carrot, 84, 78);

    // Press A (blinking)
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
