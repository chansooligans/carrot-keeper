// Tilemap: a 2D grid of tile IDs, rendered as pre-baked tile sprites.
// Each tile is 16x16. The map definition is a 2D array of single-char tile keys.

import { TILE } from './renderer.js';

export class TileMap {
  constructor(def, tileSet) {
    // def: { width, height, tiles: array of strings (rows), solids: string of solid tile keys, doors: [...], spawns: {...}, music?: string }
    // tileSet: dict of tileKey -> Sprite
    this.def = def;
    this.tileSet = tileSet;
    this.width = def.width;
    this.height = def.height;
    this.tiles = def.tiles; // array of strings
    this.solids = new Set(def.solids ? def.solids.split('') : []);
    this.doors = def.doors || []; // [{x, y, toMap, toX, toY, toDir}]
    this.spawns = def.spawns || {};
    this.npcs = def.npcs || []; // npc spawn ids on this map
  }

  tileAt(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.tiles[y][x];
  }

  isSolid(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
    return this.solids.has(this.tileAt(x, y));
  }

  doorAt(x, y) {
    return this.doors.find(d => d.x === x && d.y === y) || null;
  }

  // Render with camera offset (top-left corner of viewport in world pixels)
  render(r, cameraX, cameraY) {
    // Determine visible tile range
    const startCol = Math.max(0, Math.floor(cameraX / TILE));
    const endCol = Math.min(this.width, Math.ceil((cameraX + 160) / TILE));
    const startRow = Math.max(0, Math.floor(cameraY / TILE));
    const endRow = Math.min(this.height, Math.ceil((cameraY + 144) / TILE));

    for (let ty = startRow; ty < endRow; ty++) {
      const row = this.tiles[ty];
      for (let tx = startCol; tx < endCol; tx++) {
        const ch = row[tx];
        const tile = this.tileSet[ch];
        if (!tile) continue;
        r.drawSprite(tile, tx * TILE - cameraX, ty * TILE - cameraY);
      }
    }
  }
}
