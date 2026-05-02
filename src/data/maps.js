// Map definitions. Each map is a grid of single-char tile keys.
// Solids string lists tile keys that block movement.
// Doors warp to another map at a target tile.
// Spawns are named tile coordinates the story can reference.

// LODI — outdoor village. 25 tiles wide × 18 tall.
// Layout (rough):
//   row 0-2  : forest edge (trees), top fence, "FOREST →" sign
//   row 3-9  : main village square, paths, houses
//   row 10-14: gardens, carrot patches, windmill
//   row 15-17: bottom edge (path leaving village)
//
// Houses (16x16 tiles drawn as 3w×2h: 'hhh' on top, 'HHH' below, with 'D' door):
//   Hazel's burrow (left): cols 2-4, rows 5-6, door at col 3 row 6 → enters 'hazels-burrow'
//   Pip's shop:           cols 8-10, rows 4-5, door at col 9 row 5 → enters 'pips-shop'
//   Mayor's hall:         cols 14-16, rows 4-5, door at col 15 row 5 (locked / festival)
//   Old Thump's farm:     cols 18-20, rows 5-6, door at col 19 row 6 (not enterable in ch1)
//   Mossfoot's cottage:   cols 4-6, rows 9-10, door at col 5 row 10 (not enterable)
//   Windmill:             cols 14-16, rows 11-13, door at col 15 row 13 → enters 'windmill'
//
// Carrot patches (single tiles): scattered around (5,11) (6,11) (12,12) (12,13)
// Shrine: (11,7)
// Pawprints: appear after 'old_thump_quest_started': (19,8) (20,9) (18,10)
// Forest edge sign: (12,1) — this is where Ch.1 ends.

export const MAPS = {
  // LODI — outdoor village. 25 cols × 18 rows.
  //
  // Layout map:
  //   col:    0         1         2
  //           0123456789012345678901234
  //   row 0:  TTTTTTTTTTTTTTTTTTTTTTTTT     forest border
  //   row 1:  TTTTTTTTTTTTsTTTTTTTTTTTT     forest opening (col 12 grass)
  //   row 2:  T...........=............T    path entrance
  //   row 3:  T...,.F.....=......F..,..T
  //   row 4:  T...hhhh....=.....hhhh...T    Hazel roof + Mayor roof
  //   row 5:  T...HDHH....=.....HDHH...T    doors (Hazel @5,5 ; Mayor @18,5)
  //   row 6:  T...........=............T
  //   row 7:  T..,........=............T
  //   row 8:  T===========+===========.T    main horizontal path (intersection at col 12)
  //   row 9:  T...........=............T
  //   row 10: T..,........=............T
  //   row 11: T...hhhh....=.....hhhh...T    Pip + Old Thump roof
  //   row 12: T...HDHH....=.....HDHH...T    doors (Pip @5,12 ; OldThump @18,12)
  //   row 13: T...........=............T
  //   row 14: T......hhhh.=...mmmm.....T    Mossfoot roof + windmill blades
  //   row 15: T......HDHH.=...MDMM.....T    Mossfoot door @8,15 ; windmill door @17,15
  //   row 16: T...........=............T
  //   row 17: TTTTTTTTTTTTTTTTTTTTTTTTT     border
  //
  // Vertical main "path" uses '=' (path edge tile) so it's distinct from the
  // horizontal path '=' that meets it; they look the same visually.
  // Forest exit trigger is at (12, 1) — entering this tile after festival_done
  // pushes the handoff cutscene.
  'lodi': {
    name: 'Lodi Village',
    width: 25,
    height: 18,
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTTTTT", // 0
      "TTTTTTTTTTTT.sTTTTTTTTTTT", // 1   forest opening (12,1) ; sign (13,1)
      "T...........=...........T", // 2
      "T...,.F.....=......F..,.T", // 3
      "T...hhhh....=.....hhhh..T", // 4   Hazel roof | Mayor roof
      "T...HDHH....=.....HDHH..T", // 5   Hazel door @5,5 ; Mayor door @19,5
      "T...........=...........T", // 6
      "T..,........=........S..T", // 7   shrine @21,7
      "T========================", // 8   horizontal path (no edge T at col 24 to keep it open visually)
      "T...........=...........T", // 9
      "T..,........=...........T", // 10
      "T...hhhh....=.....hhhh..T", // 11  Pip roof | Old Thump roof
      "T...HDHH....=.....HDHH..T", // 12  Pip door @5,12 ; OldThump door @19,12
      "T...........=......CC...T", // 13  carrot patches @19-20,13
      "T......hhhh.=...mmmm....T", // 14  Mossfoot roof | windmill blades
      "T......HDHH.=...MDMM....T", // 15  Mossfoot door @8,15 ; windmill door @17,15
      "T...........=...........T", // 16
      "TTTTTTTTTTTTTTTTTTTTTTTTT", // 17
    ],
    solids: 'T#HhWBVMmkbtSwsf',
    doors: [
      { x: 5,  y: 5,  toMap: 'hazels-burrow',  toX: 5, toY: 7, toDir: 'up' },
      { x: 19, y: 5,  toMap: 'mayors-hall',    toX: 5, toY: 7, toDir: 'up' },
      { x: 5,  y: 12, toMap: 'pips-shop',      toX: 5, toY: 7, toDir: 'up' },
      { x: 19, y: 12, toMap: 'old-thump-farm', toX: 5, toY: 7, toDir: 'up' },
      { x: 8,  y: 15, toMap: 'mossfoot-house', toX: 5, toY: 7, toDir: 'up' },
      { x: 17, y: 15, toMap: 'windmill',       toX: 4, toY: 7, toDir: 'up' },
    ],
    spawns: {
      start:           { x: 5,  y: 6, dir: 'down' },
      forestEdge:      { x: 12, y: 1, dir: 'up' },
      shrine:          { x: 21, y: 7, dir: 'left' },
      thumpsPatch:     { x: 19, y: 13, dir: 'up' },
      festivalCenter:  { x: 12, y: 8, dir: 'down' },
    },
  },

  // Hazel's burrow — small interior 11x9
  'hazels-burrow': {
    name: "Hazel's Burrow",
    width: 11,
    height: 9,
    tiles: [
      "wwwwwwwwwww",
      "wkkkbbttwww",
      "wfffffffffw",
      "wfffRRRfffw",
      "wfffRRRfffw",
      "wfffRRRfffw",
      "wfffffffffw",
      "wwwwwdwwwww",
      "wwwww.wwwww",
    ],
    solids: 'wkbt',
    doors: [
      { x: 5, y: 7, toMap: 'lodi', toX: 5, toY: 6, toDir: 'down' },
    ],
    spawns: { start: { x: 5, y: 6, dir: 'down' } },
  },

  'pips-shop': {
    name: "Pip's Shop",
    width: 11,
    height: 9,
    tiles: [
      "wwwwwwwwwww",
      "wkkkkkttwww",
      "wfffffffffw",
      "wffttttfffw",
      "wfffffffRRw",
      "wfffffffRRw",
      "wfffffffffw",
      "wwwwwdwwwww",
      "wwwww.wwwww",
    ],
    solids: 'wkt',
    doors: [
      { x: 5, y: 7, toMap: 'lodi', toX: 5, toY: 13, toDir: 'down' },
    ],
    spawns: { start: { x: 5, y: 6, dir: 'down' } },
  },

  'mayors-hall': {
    name: "Mayor's Hall",
    width: 11,
    height: 9,
    tiles: [
      "wwwwwwwwwww",
      "wkkbbtttkkw",
      "wfffffffffw",
      "wffRRRRRffw",
      "wffRRRRRffw",
      "wffRRRRRffw",
      "wfffffffffw",
      "wwwwwdwwwww",
      "wwwww.wwwww",
    ],
    solids: 'wkbt',
    doors: [
      { x: 5, y: 7, toMap: 'lodi', toX: 19, toY: 6, toDir: 'down' },
    ],
    spawns: { start: { x: 5, y: 6, dir: 'down' } },
  },

  'old-thump-farm': {
    name: "Old Thump's Farm",
    width: 11,
    height: 9,
    tiles: [
      "wwwwwwwwwww",
      "wkkbbttkkkw",
      "wfffffffffw",
      "wfffttttffw",
      "wfffffffffw",
      "wfffRRRfffw",
      "wfffffffffw",
      "wwwwwdwwwww",
      "wwwww.wwwww",
    ],
    solids: 'wkbt',
    doors: [
      { x: 5, y: 7, toMap: 'lodi', toX: 19, toY: 13, toDir: 'down' },
    ],
    spawns: { start: { x: 5, y: 6, dir: 'down' } },
  },

  'mossfoot-house': {
    name: "Mossfoot Cottage",
    width: 11,
    height: 9,
    tiles: [
      "wwwwwwwwwww",
      "wkkbbttbbkw",
      "wfffffffffw",
      "wffRRRfffff",
      "wfffffffffw",
      "wfffttttffw",
      "wfffffffffw",
      "wwwwwdwwwww",
      "wwwww.wwwww",
    ],
    solids: 'wkbt',
    doors: [
      { x: 5, y: 7, toMap: 'lodi', toX: 8, toY: 16, toDir: 'down' },
    ],
    spawns: { start: { x: 5, y: 6, dir: 'down' } },
  },

  'windmill': {
    name: 'Windmill',
    width: 9,
    height: 9,
    tiles: [
      "wwwwwwwww",
      "wkkkkkkkw",
      "wfffffffw",
      "wfftttffw",
      "wfffffffw",
      "wfffffffw",
      "wfffffffw",
      "wwwwdwwww",
      "wwww.wwww",
    ],
    solids: 'wkt',
    doors: [
      { x: 4, y: 7, toMap: 'lodi', toX: 17, toY: 16, toDir: 'down' },
    ],
    spawns: {
      start: { x: 4, y: 6, dir: 'down' },
      baby:  { x: 6, y: 5, dir: 'down' },
    },
  },
};
