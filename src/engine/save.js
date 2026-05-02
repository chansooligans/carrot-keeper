// localStorage save/load. One save slot.

const KEY = 'carrot-keeper:save';
const VERSION = 1;

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION) return null;
    return parsed;
  } catch (e) {
    console.warn('save load failed', e);
    return null;
  }
}

export function saveGame(state) {
  try {
    const payload = { version: VERSION, savedAt: Date.now(), state };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('save failed', e);
  }
}

export function clearSave() {
  localStorage.removeItem(KEY);
}
