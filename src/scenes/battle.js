// Stub turn-based battle scene. Reachable via the debug 'B' hotkey on
// overworld. Proves the architecture for Chapter 2 — Pokémon-style menus,
// HP, basic damage. Not balanced, not used in Ch.1.

import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';
import { DialogScene } from './dialog.js';

const MOVES = [
  { name: 'CARROT TOSS', dmg: [3, 6] },
  { name: 'BURROW HOP',  dmg: [1, 3], heal: 1 },
  { name: 'LUCKY HOP',   dmg: [0, 8] },
  { name: 'RUN',         flee: true },
];

export class BattleScene extends Scene {
  enter() {
    this.foe = { name: 'WOLF', sprite: 'wolf', hp: 16, maxHp: 16, atk: [2, 4] };
    this.you = { hp: this.game.flags.player_hp || 12, maxHp: 12 };
    this.menuIdx = 0;
    this.phase = 'pick';        // pick | resolve | end
    this.message = 'A wolf blocks the path!';
    this.shake = 0;
    this.flash = 0;
    this.t = 0;
    this.game.playSong('battle');
  }
  exit() {
    // Battle scene popped — return music will be set by whoever resumes.
  }

  update(dt) {
    this.t += dt;
    if (this.shake > 0) this.shake -= dt * 60;
    if (this.flash > 0) this.flash -= dt * 4;

    const inp = this.game.input;

    if (this.phase === 'pick') {
      if (inp.pressed.up)    this.menuIdx = (this.menuIdx + MOVES.length - 1) % MOVES.length;
      if (inp.pressed.down)  this.menuIdx = (this.menuIdx + 1) % MOVES.length;
      if (inp.pressed.left || inp.pressed.right) {
        // 2-col grid would be nicer; left/right also navigate
        if (inp.pressed.left) this.menuIdx = (this.menuIdx + MOVES.length - 1) % MOVES.length;
        if (inp.pressed.right) this.menuIdx = (this.menuIdx + 1) % MOVES.length;
      }
      if (inp.pressed.a) this._resolve(MOVES[this.menuIdx]);
    } else if (this.phase === 'end') {
      if (inp.pressed.a || inp.pressed.b) {
        this.game.scenes.pop();
      }
    }
  }

  _resolve(move) {
    if (move.flee) {
      this.message = 'You hopped away!';
      this.phase = 'end';
      return;
    }
    const dmg = randInt(move.dmg[0], move.dmg[1]);
    this.foe.hp = Math.max(0, this.foe.hp - dmg);
    if (move.heal) this.you.hp = Math.min(this.you.maxHp, this.you.hp + move.heal);
    this.message = `Noddy used ${move.name}! (-${dmg})`;
    this.flash = 1;
    this.game.audio.hit();
    if (this.foe.hp === 0) {
      this.message = 'The wolf yields and slips into the trees.';
      this.phase = 'end';
      return;
    }
    // Foe attacks
    setTimeout(() => {
      const fd = randInt(this.foe.atk[0], this.foe.atk[1]);
      this.you.hp = Math.max(0, this.you.hp - fd);
      this.shake = 4;
      this.message = `Wolf snapped! (-${fd})`;
      this.game.audio.hit();
      this.game.flags.player_hp = this.you.hp;
      if (this.you.hp === 0) {
        this.message = 'You are knocked back...';
        this.phase = 'end';
      }
    }, 700);
  }

  render(r) {
    r.clear('#0f380f');
    // Battle backdrop
    r.rect(0, 70, SCREEN_W, 30, '#306230');
    r.rect(0, 100, SCREEN_W, 44, '#0f380f');

    // Foe (top-right)
    const dx = (this.shake > 0 ? (Math.random() * 4 - 2) : 0) | 0;
    r.drawSprite(this.game.sprites['wolf'], 96 + dx, 30 + (this.flash > 0 ? -2 : 0));
    // You (bottom-left, above the message box)
    r.drawSprite(this.game.sprites['noddy_up_0'], 16, 70);

    // HP bars + names
    const f = this.game.font;
    f.draw(r.ctx, 'WOLF', 96, 18, '#f0f0e8');
    drawHpBar(r, 96, 26, 56, this.foe.hp, this.foe.maxHp);
    f.draw(r.ctx, 'NODDY', 40, 76, '#f0f0e8');
    drawHpBar(r, 40, 84, 56, this.you.hp, this.you.maxHp);
    f.draw(r.ctx, `HP ${this.you.hp}/${this.you.maxHp}`, 40, 90, '#9bbc0f');

    // Bottom message + menu
    r.rect(0, SCREEN_H - 38, SCREEN_W, 38, '#0f0f0f');
    r.outlineRect(0, SCREEN_H - 38, SCREEN_W, 38, '#f0f0e8');
    f.draw(r.ctx, this.message, 4, SCREEN_H - 32, '#f0f0e8');

    if (this.phase === 'pick') {
      for (let i = 0; i < MOVES.length; i++) {
        const x = 4 + (i % 2) * 80;
        const y = SCREEN_H - 18 + Math.floor(i / 2) * 8;
        const sel = i === this.menuIdx;
        if (sel) f.draw(r.ctx, '>', x - 4, y, '#9bbc0f');
        f.draw(r.ctx, MOVES[i].name, x, y, sel ? '#9bbc0f' : '#f0f0e8');
      }
    } else if (this.phase === 'end') {
      f.draw(r.ctx, 'Z = continue', 4, SCREEN_H - 14, '#7a7a7a');
    }
  }
}

function drawHpBar(r, x, y, w, hp, maxHp) {
  r.rect(x, y, w, 4, '#0f0f0f');
  const pct = maxHp > 0 ? hp / maxHp : 0;
  r.rect(x + 1, y + 1, Math.max(0, Math.floor((w - 2) * pct)), 2,
    pct > 0.5 ? '#9bbc0f' : pct > 0.2 ? '#f4dd80' : '#d65b5b');
}

function randInt(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}
