# 🥕 Carrot Keeper

A Gameboy Color-style RPG. Play as **Noddy**, a small grey rabbit in the village of **Lodi**. Run errands for the Harvest Festival, find a missing baby bunny, investigate a midnight raid on Old Thump's carrot patch — and learn that the village isn't as safe as it seems.

**Play it:** [chansooligans.github.io/carrot-keeper](https://chansooligans.github.io/carrot-keeper/)

## Controls

| Action | Keys |
|---|---|
| Move | Arrow keys / WASD |
| Confirm / Talk / Pick up | `Z` or `Space` |
| Cancel / Menu | `X` or `Esc` |
| (Debug) Test battle | `B` |

On mobile, an on-screen dpad appears.

## Story

This is **Chapter 1: A Quiet Day in Lodi**. The story arc is *The Whispering Roots* — a network of magical roots that has kept rabbit lands safe from wolves is weakening. Noddy will inherit the role of *Carrot Keeper* from her grandmother Hazel and set out to restore them. Future chapters venture into the forest, marsh, and beyond.

See [docs/ARC.md](docs/ARC.md) for the long-arc plan.

## Run locally

No build step. Just serve the directory:

```sh
cd carrot-keeper
python3 -m http.server 8000
# open http://localhost:8000
```

## Tech

- HTML5 Canvas + vanilla JS (ES modules) — zero dependencies
- 160×144 internal resolution (Gameboy native), CSS-scaled 4×, `image-rendering: pixelated`
- 16×16 tiles, 4-direction tile-based movement
- Sprites are pixel grids defined inline in JS (no external art assets — fully self-contained)
- Saves to `localStorage` automatically

## Repo layout

```
src/
├── main.js              # Boot, scene stack, main loop
├── engine/              # Renderer, input, tilemap, sprite, save, scene base
├── scenes/              # Title, overworld, dialog, menu, battle, cutscene, ending
├── data/
│   ├── palette.js       # Pixel color palette
│   ├── sprites.js       # Sprite + tile pixel art
│   ├── maps.js          # Tile maps (Lodi, interiors)
│   ├── npcs.js          # NPC definitions + dialog trees
│   ├── items.js         # Items
│   └── story/ch1.js     # Chapter 1 quest scripts and flags
└── ui/hud.js            # Carrot count, quest hint
```

## License

MIT — see [LICENSE](LICENSE).
