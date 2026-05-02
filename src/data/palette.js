// Gameboy Color-ish palette. Sprites reference colors by single-character keys.
// '.' is always transparent.

export const PALETTE = {
  '.': null,                  // transparent
  // greens (gameboy classic-ish)
  '0': '#0f380f',             // darkest green
  '1': '#306230',             // dark green
  '2': '#8bac0f',             // light green
  '3': '#9bbc0f',             // lightest green
  // greys / monochrome
  'k': '#1a1a1a',             // near black
  'K': '#3a3a3a',             // dark grey
  'g': '#7a7a7a',             // mid grey
  'G': '#bfbfbf',             // light grey
  'w': '#f0f0e8',             // off white
  // warm
  'r': '#a83232',             // dark red (bandana)
  'R': '#d65b5b',             // light red
  'o': '#d96a2a',             // orange (carrot body)
  'O': '#f0a058',             // light orange
  'y': '#e8c14a',             // yellow
  'Y': '#f4dd80',             // light yellow
  // earth
  'n': '#3a2515',             // darkest brown
  'N': '#5c3a1f',             // dark brown
  'm': '#8a5d35',             // mid brown (wood)
  'M': '#b08555',             // light brown
  // cool
  'b': '#3a5f8a',             // blue
  'B': '#6e9bbf',             // light blue
  'c': '#88c0d0',             // cyan-ish (water highlight)
  // pink/purple
  'p': '#c878b8',             // pink
  'P': '#e0a4d4',             // light pink
};
