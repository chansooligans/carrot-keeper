import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H, TILE } from '../engine/renderer.js';
import { DialogScene } from './dialog.js';
import { EndingScene } from './ending.js';

// Festival blackout cutscene. Sequence:
//   1. Fade in dark, lights flicker
//   2. Mayor: "Witness the Elder Carrot!"
//   3. Loud sound (visual: screen shake)
//   4. Total blackout
//   5. Lights up: Elder Carrot is gone
//   6. Hazel: "Noddy. Come with me. Now."
//   7. Set festival_done flag. Pop cutscene; player back on overworld.
export class FestivalCutscene extends Scene {
  visibleBeneath = false;

  enter() {
    this.t = 0;
    this.step = 0;
    this.shake = 0;
    this.fade = 0;
    this.dialogQueued = false;
    this.thunderPlayed = false;
    this.game.playSong('foreboding');
  }

  update(dt) {
    this.t += dt;
    if (this.shake > 0) this.shake -= dt * 60;

    const inp = this.game.input;

    // Steps:
    //   0: dark fade-in (1s) → push first dialog
    //   1: waiting for first dialog to finish (handled by stack)
    //   2: shake + flash (~0.5s)
    //   3: blackout (0.5s)
    //   4: push second dialog (Hazel)
    //   5: set flag, pop scene
    if (this.step === 0) {
      this.fade = Math.min(0.7, this.fade + dt);
      if (this.t > 1.0) {
        this.step = 1;
        this.game.scenes.push(new DialogScene(this.game, [
          'Mayor Burrows: Friends of Lodi!',
          'Behold — the Elder Carrot!',
        ], { onEnd: () => { this.step = 2; this.t = 0; } }));
      }
    } else if (this.step === 2) {
      if (!this.thunderPlayed) { this.game.audio.thunder(); this.thunderPlayed = true; }
      this.shake = 4;
      if (this.t > 0.6) {
        this.step = 3;
        this.t = 0;
        this.fade = 1;
      }
    } else if (this.step === 3) {
      if (this.t > 0.6) {
        this.step = 4;
        this.fade = 0.6;
        this.game.scenes.push(new DialogScene(this.game, [
          '(The lanterns flicker back on.)',
          '(The Elder Carrot is gone.)',
          '(Tracks lead north.)',
          'Hazel: Noddy. Come with me. Now.',
        ], { onEnd: () => { this.step = 5; this.t = 0; } }));
      }
    } else if (this.step === 5) {
      this.game.flags.festival_done = true;
      this.game.save();
      this.game.scenes.pop();
    }
  }

  render(r) {
    // Render the underlying overworld first (it's beneath us via visibleBeneath = false; we override)
    // Actually we want to render over the overworld's last frame; but since visibleBeneath = false here,
    // the stack won't draw it. Easy fix: draw a black screen + carrot symbol manually.
    r.clear('#0f0f0f');
    // Tint
    if (this.fade > 0) r.fade(this.fade, '#000');
    // Draw a stylized "Festival" with the Elder Carrot in the middle
    const f = this.game.font;
    const dx = (this.shake > 0 ? (Math.random() * 4 - 2) : 0) | 0;
    const dy = (this.shake > 0 ? (Math.random() * 4 - 2) : 0) | 0;
    const title = (this.step >= 3) ? 'BLACKOUT' : 'HARVEST FESTIVAL';
    const tw = f.measure(title);
    f.draw(r.ctx, title, ((SCREEN_W - tw) / 2 | 0) + dx, 24 + dy, '#9bbc0f');
    // The Elder Carrot — until step 3, then disappears
    if (this.step < 3) {
      r.drawSprite(this.game.sprites['carrot'], (SCREEN_W / 2 - 8) | 0, (SCREEN_H / 2 - 8) | 0);
    }
  }
}

// Handoff cutscene at forest edge.
export class HandoffCutscene extends Scene {
  enter() {
    this.step = 0;
    this.t = 0;
    this.fade = 0;
    this.game.playSong('foreboding');
    this.game.scenes.push(new DialogScene(this.game, [
      "Hazel: Noddy, take this. It was mine.",
      "(She presses an old satchel into your paws.)",
      "Hazel: It is starting again.",
      "Hazel: I cannot follow you into the trees.",
      "Hazel: But the Roots will hear you.",
      "Hazel: Listen to them.",
    ], { onEnd: (g) => {
      g.give('satchel', 1);
      g.flags.handoff_done = true;
      g.save();
      this.step = 1;
    }}));
  }

  update(dt) {
    if (this.step !== 1) return;
    // Fade out and push ending
    this.fade = Math.min(1, this.fade + dt);
    if (this.fade >= 1) {
      this.game.scenes.replace(new EndingScene(this.game));
    }
  }

  render(r) {
    if (this.fade > 0) r.fade(this.fade, '#000');
  }
}
