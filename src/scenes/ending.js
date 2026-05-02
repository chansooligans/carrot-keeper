import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';
import { TitleScene } from './title.js';

export class EndingScene extends Scene {
  enter() {
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    const inp = this.game.input;
    if (this.t > 1.5 && inp.pressed.a) {
      this.game.scenes.replace(new TitleScene(this.game));
    }
  }
  render(r) {
    r.clear('#0f0f0f');
    const f = this.game.font;
    const lines = [
      'END OF CHAPTER 1',
      '',
      'A QUIET DAY IN LODI',
      '',
      'The forest is waiting.',
      'The Roots are listening.',
      '',
      'TO BE CONTINUED...',
    ];
    const lh = f.lineHeight();
    const totalH = lines.length * lh;
    let y = (SCREEN_H - totalH) / 2 | 0;
    for (const line of lines) {
      const w = f.measure(line);
      const color = (line === 'END OF CHAPTER 1' || line === 'TO BE CONTINUED...') ? '#9bbc0f' : '#f0f0e8';
      f.draw(r.ctx, line, (SCREEN_W - w) / 2 | 0, y, color);
      y += lh;
    }
    if (this.t > 1.5 && (Math.floor(this.t * 2) % 2) === 0) {
      const msg = 'PRESS Z';
      const w = f.measure(msg);
      f.draw(r.ctx, msg, (SCREEN_W - w) / 2 | 0, SCREEN_H - 14, '#7a7a7a');
    }
  }
}
