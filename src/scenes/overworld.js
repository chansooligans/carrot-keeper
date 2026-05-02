import { Scene } from '../engine/scene.js';
import { TileMap } from '../engine/tilemap.js';
import { SCREEN_W, SCREEN_H, TILE } from '../engine/renderer.js';
import { startNpcDialog, DialogScene } from './dialog.js';
import { drawHud } from '../ui/hud.js';

const MOVE_FRAMES = 12; // frames per tile of movement (slower = cuter)

const DIR_DELTA = {
  up:    [0, -1],
  down:  [0,  1],
  left:  [-1, 0],
  right: [ 1, 0],
};

export class OverworldScene extends Scene {
  enter() {
    this.cam = { x: 0, y: 0 };
    this.moveT = 0;
    this.moving = false;
    this.fromX = this.game.player.x;
    this.fromY = this.game.player.y;
    this.toX = this.game.player.x;
    this.toY = this.game.player.y;
    this.frameTimer = 0;
    this.walkFrame = 0;
    this.justEntered = true;
    this.lockTimer = 0; // cooldown after dialog/cutscene to swallow held A
  }

  resume() {
    this.justEntered = true;
    this.lockTimer = 6;
  }

  currentMap() {
    const def = this.game.maps[this.game.player.map];
    return new TileMap(def, this.game.tiles);
  }

  update(dt) {
    const inp = this.game.input;
    const g = this.game;
    const map = this.currentMap();

    // Cooldown: ignore inputs briefly after a dialog/transition
    if (this.lockTimer > 0) { this.lockTimer--; }

    if (this.moving) {
      this.moveT++;
      this.frameTimer++;
      if (this.frameTimer >= 6) { this.frameTimer = 0; this.walkFrame ^= 1; }
      if (this.moveT >= MOVE_FRAMES) {
        // Snap
        this.moving = false;
        g.player.x = this.toX;
        g.player.y = this.toY;
        g.player.pixelX = this.toX * TILE;
        g.player.pixelY = this.toY * TILE;
        this.moveT = 0;
        this.walkFrame = 0;

        // Check tile triggers
        this._onArrive(map);
        // Re-check input to keep moving smoothly
        if (this.lockTimer === 0) this._tryMove(inp, map);
      } else {
        // Tween
        const t = this.moveT / MOVE_FRAMES;
        g.player.pixelX = (this.fromX + (this.toX - this.fromX) * t) * TILE;
        g.player.pixelY = (this.fromY + (this.toY - this.fromY) * t) * TILE;
      }
    } else {
      this.frameTimer = 0;
      // Check action button
      if (inp.pressed.a && this.lockTimer === 0) {
        this._tryInteract(map);
        return;
      }
      if (inp.pressed.debugBattle && this.lockTimer === 0) {
        // Lazy import to avoid circular deps; battle scene is a stub.
        import('./battle.js').then(({ BattleScene }) => {
          this.game.scenes.push(new BattleScene(this.game, { foe: 'wolf' }));
        });
        return;
      }
      if (this.lockTimer === 0) this._tryMove(inp, map);
    }

    this._updateCamera(map);

    // Festival trigger (when player enters Lodi after festival_ready)
    if (this.justEntered && g.player.map === 'lodi' && g.flags.festival_ready && !g.flags.festival_done) {
      this.justEntered = false;
      // Fire when they reach the festival square
      // We'll check via _onArrive but also right now if standing there.
      if (g.player.x === 12 && g.player.y === 8) {
        this._triggerFestival();
      }
    }
    this.justEntered = false;
  }

  _tryMove(inp, map) {
    const dirs = [];
    if (inp.held.up)    dirs.push('up');
    if (inp.held.down)  dirs.push('down');
    if (inp.held.left)  dirs.push('left');
    if (inp.held.right) dirs.push('right');
    if (dirs.length === 0) return;
    const dir = dirs[0]; // priority: first held wins
    const [dx, dy] = DIR_DELTA[dir];
    const nx = this.game.player.x + dx;
    const ny = this.game.player.y + dy;
    this.game.player.dir = dir;
    if (this._isBlocked(map, nx, ny)) return;
    // Begin move
    this.fromX = this.game.player.x;
    this.fromY = this.game.player.y;
    this.toX = nx;
    this.toY = ny;
    this.moving = true;
    this.moveT = 0;
  }

  _isBlocked(map, x, y) {
    if (map.isSolid(x, y)) return true;
    // NPCs block (except interactOnly tiles which are at pseudo-positions but still block tile)
    const npc = this.game.npcAt(this.game.player.map, x, y);
    if (npc) return true;
    return false;
  }

  _onArrive(map) {
    const g = this.game;
    const px = g.player.x, py = g.player.y;

    // Door tile triggers transition
    const door = map.doorAt(px, py);
    if (door) {
      g.player.map = door.toMap;
      g.player.x = door.toX;
      g.player.y = door.toY;
      g.player.dir = door.toDir || g.player.dir;
      g.player.pixelX = door.toX * TILE;
      g.player.pixelY = door.toY * TILE;
      this.fromX = this.toX = door.toX;
      this.fromY = this.toY = door.toY;
      this.justEntered = true;
      this.lockTimer = 6;
      g.save();
      return;
    }

    // Forest exit trigger (Lodi only, after festival)
    if (g.player.map === 'lodi' && px === 12 && py === 1) {
      if (g.flags.festival_done && !g.flags.handoff_done) {
        // Handoff cutscene
        import('./cutscene.js').then(({ HandoffCutscene }) => {
          g.scenes.push(new HandoffCutscene(g));
        });
        return;
      }
    }

    // Festival square trigger (Lodi only, when ready)
    if (g.player.map === 'lodi' && g.flags.festival_ready && !g.flags.festival_done) {
      if (px === 12 && py === 8) this._triggerFestival();
    }
  }

  _triggerFestival() {
    import('./cutscene.js').then(({ FestivalCutscene }) => {
      this.game.scenes.push(new FestivalCutscene(this.game));
    });
  }

  _tryInteract(map) {
    const g = this.game;
    const [dx, dy] = DIR_DELTA[g.player.dir];
    const tx = g.player.x + dx;
    const ty = g.player.y + dy;
    const npc = g.npcAt(g.player.map, tx, ty);
    if (npc) {
      // Face the player
      const opp = { up: 'down', down: 'up', left: 'right', right: 'left' };
      // (NPCs don't visually face yet — placeholder)
      startNpcDialog(g, npc);
      this.lockTimer = 6;
      return;
    }
    // Carrot patch: 'C' tile in front
    const tile = map.tileAt(tx, ty);
    if (tile === 'C' && !g.flags['picked_' + tx + '_' + ty + '_' + g.player.map]) {
      g.flags['picked_' + tx + '_' + ty + '_' + g.player.map] = true;
      g.give('carrot', 1);
      g.scenes.push(new DialogScene(g, [`(You pick a fresh carrot.)`], { onEnd: (gg) => gg.save() }));
      this.lockTimer = 6;
      return;
    }
  }

  _updateCamera(map) {
    const g = this.game;
    const mapPxW = map.width * TILE;
    const mapPxH = map.height * TILE;
    let cx = g.player.pixelX + TILE / 2 - SCREEN_W / 2;
    let cy = g.player.pixelY + TILE / 2 - SCREEN_H / 2;
    if (mapPxW <= SCREEN_W) cx = (mapPxW - SCREEN_W) / 2;
    else cx = Math.max(0, Math.min(cx, mapPxW - SCREEN_W));
    if (mapPxH <= SCREEN_H) cy = (mapPxH - SCREEN_H) / 2;
    else cy = Math.max(0, Math.min(cy, mapPxH - SCREEN_H));
    this.cam.x = Math.round(cx);
    this.cam.y = Math.round(cy);
  }

  render(r) {
    const g = this.game;
    const map = this.currentMap();

    r.clear('#0f380f');
    map.render(r, this.cam.x, this.cam.y);

    // Draw NPCs that have sprites
    for (const npc of g.npcsOnMap(g.player.map)) {
      if (!npc.sprite) continue;
      const sp = g.sprites[npc.sprite];
      if (!sp) continue;
      r.drawSprite(sp, npc.x * TILE - this.cam.x, npc.y * TILE - this.cam.y);
    }

    // Draw player
    const dir = g.player.dir;
    const frame = this.moving ? this.walkFrame : 0;
    const spriteName = `noddy_${dir}_${frame}`;
    const sp = g.sprites[spriteName] || g.sprites['noddy_down_0'];
    r.drawSprite(sp, Math.round(g.player.pixelX) - this.cam.x, Math.round(g.player.pixelY) - this.cam.y);

    // HUD
    drawHud(r, g);
  }
}
