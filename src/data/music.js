// Song definitions. Each song has a tempo and one or more tracks.
// Each track is an array of { p: pitch, d: beats } events.
// '-' or '.' = rest. Pitches use scientific notation: C4, F#5, etc.

// ─── LODI THEME ────────────────────────────────────────────────────────
// Pastoral, wandering. G major. Used on title screen + Lodi overworld.
// Chord progression: G - D - Em - C, repeated with melodic variation.
const lodi = {
  bpm: 110,
  tracks: [
    // Lead melody (square)
    {
      type: 'square', vol: 0.14,
      notes: [
        // Phrase A — G D Em C
        { p: 'G4',  d: 1 }, { p: 'B4', d: 1 }, { p: 'D5',  d: 1 }, { p: 'B4', d: 1 },
        { p: 'A4',  d: 1 }, { p: 'D5', d: 1 }, { p: 'F#5', d: 1 }, { p: 'D5', d: 1 },
        { p: 'E5',  d: 1 }, { p: 'G5', d: 1 }, { p: 'B5',  d: 1 }, { p: 'G5', d: 1 },
        { p: 'C5',  d: 1 }, { p: 'E5', d: 1 }, { p: 'G5',  d: 1 }, { p: 'E5', d: 1 },
        // Phrase B — descending
        { p: 'D5',  d: 2 }, { p: 'B4', d: 1 }, { p: 'G4',  d: 1 },
        { p: 'F#5', d: 2 }, { p: 'D5', d: 1 }, { p: 'A4',  d: 1 },
        { p: 'G5',  d: 2 }, { p: 'E5', d: 1 }, { p: 'B4',  d: 1 },
        { p: 'D5',  d: 1 }, { p: 'C5', d: 1 }, { p: 'B4',  d: 1 }, { p: 'A4', d: 1 },
        // Phrase C — held resolution
        { p: 'G4',  d: 4 },
      ],
    },
    // Bass (triangle)
    {
      type: 'triangle', vol: 0.16,
      notes: [
        { p: 'G2', d: 4 }, { p: 'D2', d: 4 }, { p: 'E2', d: 4 }, { p: 'C2', d: 4 },
        { p: 'G2', d: 4 }, { p: 'D2', d: 4 }, { p: 'E2', d: 4 }, { p: 'C2', d: 2 }, { p: 'D3', d: 2 },
        { p: 'G2', d: 4 },
      ],
    },
    // Inner harmony (softer square, third above lead)
    {
      type: 'square', vol: 0.06,
      notes: [
        { p: 'B3', d: 4 }, { p: 'A3', d: 4 }, { p: 'B3', d: 4 }, { p: 'C4', d: 4 },
        { p: 'B3', d: 4 }, { p: 'A3', d: 4 }, { p: 'B3', d: 4 }, { p: 'C4', d: 4 },
        { p: 'B3', d: 4 },
      ],
    },
  ],
};

// ─── BATTLE THEME ──────────────────────────────────────────────────────
// Urgent, driving. E minor. Faster.
const battle = {
  bpm: 144,
  tracks: [
    {
      type: 'square', vol: 0.16,
      notes: [
        // Bar 1 (Em)
        { p: 'E5', d: 0.5 }, { p: 'G5', d: 0.5 }, { p: 'B5', d: 0.5 }, { p: 'G5', d: 0.5 },
        { p: 'E5', d: 0.5 }, { p: 'G5', d: 0.5 }, { p: 'B5', d: 1 },
        // Bar 2 (D)
        { p: 'D5', d: 0.5 }, { p: 'F#5', d: 0.5 }, { p: 'A5', d: 0.5 }, { p: 'F#5', d: 0.5 },
        { p: 'D5', d: 0.5 }, { p: 'F#5', d: 0.5 }, { p: 'A5', d: 1 },
        // Bar 3 (C)
        { p: 'C5', d: 0.5 }, { p: 'E5', d: 0.5 }, { p: 'G5', d: 0.5 }, { p: 'E5', d: 0.5 },
        { p: 'C5', d: 0.5 }, { p: 'E5', d: 0.5 }, { p: 'G5', d: 1 },
        // Bar 4 (B - turnaround)
        { p: 'B4', d: 1 }, { p: 'D5', d: 1 }, { p: 'F#5', d: 1 }, { p: 'B5', d: 1 },
      ],
    },
    {
      type: 'triangle', vol: 0.18,
      notes: [
        { p: 'E2', d: 0.5 }, { p: 'E2', d: 0.5 }, { p: 'E2', d: 0.5 }, { p: 'E2', d: 0.5 },
        { p: 'E2', d: 0.5 }, { p: 'E2', d: 0.5 }, { p: 'E2', d: 1 },

        { p: 'D2', d: 0.5 }, { p: 'D2', d: 0.5 }, { p: 'D2', d: 0.5 }, { p: 'D2', d: 0.5 },
        { p: 'D2', d: 0.5 }, { p: 'D2', d: 0.5 }, { p: 'D2', d: 1 },

        { p: 'C2', d: 0.5 }, { p: 'C2', d: 0.5 }, { p: 'C2', d: 0.5 }, { p: 'C2', d: 0.5 },
        { p: 'C2', d: 0.5 }, { p: 'C2', d: 0.5 }, { p: 'C2', d: 1 },

        { p: 'B1', d: 1 }, { p: 'B1', d: 1 }, { p: 'B1', d: 1 }, { p: 'B1', d: 1 },
      ],
    },
  ],
};

// ─── CUTSCENE / FOREBODING ─────────────────────────────────────────────
// Slow, mysterious. A minor. Used for festival blackout + handoff.
const foreboding = {
  bpm: 78,
  tracks: [
    {
      type: 'square', vol: 0.12,
      notes: [
        { p: 'A4', d: 2 }, { p: 'C5',  d: 2 },
        { p: 'E5', d: 2 }, { p: 'D5',  d: 2 },
        { p: 'F5', d: 2 }, { p: 'E5',  d: 1 }, { p: 'C5', d: 1 },
        { p: 'A4', d: 2 }, { p: 'G#4', d: 2 },

        { p: 'A4', d: 2 }, { p: 'E5',  d: 2 },
        { p: 'F5', d: 4 },
        { p: 'E5', d: 4 },
        { p: 'A4', d: 4 },
      ],
    },
    {
      type: 'triangle', vol: 0.16,
      notes: [
        { p: 'A1', d: 8 }, { p: 'F1', d: 8 },
        { p: 'A1', d: 8 }, { p: 'E1', d: 8 },
      ],
    },
  ],
};

export const SONGS = { lodi, battle, foreboding };
