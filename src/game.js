// Game container — owns world state, input, rendering, scene stack, save.

import { Renderer, SCREEN_W, SCREEN_H } from './engine/renderer.js';
import { Input } from './engine/input.js';
import { SceneStack } from './engine/scene.js';
import { Sprite } from './engine/sprite.js';
import { Font } from './engine/font.js';
import { TILES, SPRITES } from './data/sprites.js';
import { MAPS } from './data/maps.js';
import { NPCS } from './data/npcs.js';
import { ITEMS } from './data/items.js';
import { saveGame, loadGame, clearSave } from './engine/save.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.r = new Renderer(canvas);
    this.input = new Input();
    this.font = new Font();
    this.scenes = new SceneStack(this);

    // Bake assets
    this.tiles = {};
    for (const [k, def] of Object.entries(TILES)) this.tiles[k] = new Sprite(k, def);
    this.sprites = {};
    for (const [k, def] of Object.entries(SPRITES)) this.sprites[k] = new Sprite(k, def);

    this.maps = MAPS;
    this.npcs = NPCS;
    this.items = ITEMS;

    // Default state — overwritten by load()
    this.flags = {};
    this.inv = { carrot: 0, invitations: 0, satchel: 0 };
    this.player = { map: 'hazels-burrow', x: 5, y: 5, dir: 'down', pixelX: 80, pixelY: 80 };
    this.chapter = 1;

    // Cutscene/event triggers consumed by scenes.
    this.pendingEvent = null;
  }

  give(itemId, n = 1) {
    this.inv[itemId] = (this.inv[itemId] || 0) + n;
  }

  take(itemId, n = 1) {
    this.inv[itemId] = Math.max(0, (this.inv[itemId] || 0) - n);
  }

  has(itemId) {
    return (this.inv[itemId] || 0) > 0;
  }

  setFlag(name, value = true) {
    this.flags[name] = value;
  }

  trigger(eventName) {
    this.pendingEvent = eventName;
  }

  save() {
    saveGame({
      flags: this.flags,
      inv: this.inv,
      player: this.player,
      chapter: this.chapter,
    });
  }

  load() {
    const saved = loadGame();
    if (!saved) return false;
    const s = saved.state;
    this.flags = s.flags || {};
    this.inv = s.inv || { carrot: 0, invitations: 0, satchel: 0 };
    this.player = s.player || this.player;
    this.chapter = s.chapter || 1;
    return true;
  }

  reset() {
    clearSave();
    this.flags = {};
    this.inv = { carrot: 0, invitations: 0, satchel: 0 };
    this.player = { map: 'hazels-burrow', x: 5, y: 5, dir: 'down', pixelX: 80, pixelY: 80 };
    this.chapter = 1;
  }

  // Convenience: list of NPCs visible on the given map (respecting hide/show flags).
  npcsOnMap(mapName) {
    const out = [];
    for (const [id, def] of Object.entries(this.npcs)) {
      if (def.map !== mapName) continue;
      if (def.hideWhen && def.hideWhen(this)) continue;
      if (def.showWhen && !def.showWhen(this)) continue;
      out.push({ id, ...def });
    }
    return out;
  }

  npcAt(mapName, x, y) {
    return this.npcsOnMap(mapName).find(n => n.x === x && n.y === y) || null;
  }
}
