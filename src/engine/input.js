// Tracks held + just-pressed for a small set of game actions.

const KEY_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up', W: 'up',
  s: 'down', S: 'down',
  a: 'left', A: 'left',
  d: 'right', D: 'right',
  z: 'a', Z: 'a',
  ' ': 'a', Enter: 'a',
  x: 'b', X: 'b',
  Escape: 'b',
  b: 'debugBattle', B: 'debugBattle',
};

const ACTIONS = ['up', 'down', 'left', 'right', 'a', 'b', 'debugBattle'];

export class Input {
  constructor() {
    this.held = Object.fromEntries(ACTIONS.map(a => [a, false]));
    this.pressed = Object.fromEntries(ACTIONS.map(a => [a, false]));
    this._pressedThisFrame = new Set();

    window.addEventListener('keydown', (e) => {
      const action = KEY_MAP[e.key];
      if (!action) return;
      if (!this.held[action]) this._pressedThisFrame.add(action);
      this.held[action] = true;
      if (action !== 'debugBattle') e.preventDefault();
    }, { passive: false });

    window.addEventListener('keyup', (e) => {
      const action = KEY_MAP[e.key];
      if (!action) return;
      this.held[action] = false;
    });

    // Touch dpad
    document.querySelectorAll('[data-key]').forEach(btn => {
      const action = KEY_MAP[btn.dataset.key];
      if (!action) return;
      const press = (e) => {
        e.preventDefault();
        if (!this.held[action]) this._pressedThisFrame.add(action);
        this.held[action] = true;
      };
      const release = (e) => {
        e.preventDefault();
        this.held[action] = false;
      };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    });
  }

  // Call once per frame, after scene update, to clear edge-triggered state.
  endFrame() {
    for (const a of ACTIONS) this.pressed[a] = false;
    for (const a of this._pressedThisFrame) this.pressed[a] = true;
    this._pressedThisFrame.clear();
  }

  // Call at the start of a frame to roll just-pressed in.
  beginFrame() {
    for (const a of ACTIONS) this.pressed[a] = false;
    for (const a of this._pressedThisFrame) this.pressed[a] = true;
    this._pressedThisFrame.clear();
  }
}
