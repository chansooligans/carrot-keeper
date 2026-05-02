// Tiny chiptune engine on Web Audio API.
// - Plays looping songs scheduled note-by-note.
// - Uses square waves for melody, triangle for bass, sawtooth for accent.
// - One-shot SFX for dialog/UI/pickups.
// - Mute is persistent in localStorage; AudioContext is lazily created on
//   the first user gesture (browser autoplay policy).

const NOTE_BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const MUTE_KEY = 'carrot-keeper:mute';
const MASTER_VOL = 0.18;

function noteToFreq(note) {
  if (typeof note === 'number') return note;
  if (!note || note === '-' || note === '.') return 0;
  const m = /^([A-G])([#b]?)(-?\d+)$/.exec(note);
  if (!m) return 0;
  const semis = NOTE_BASE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const midi = 12 * (parseInt(m[3], 10) + 1) + semis;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    try { this.muted = localStorage.getItem(MUTE_KEY) === '1'; } catch {}
    this.currentSong = null;
    this._stopFn = null;
  }

  ensureCtx() {
    if (this.ctx) return;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    this.ctx = new C();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : MASTER_VOL;
    this.master.connect(this.ctx.destination);
  }

  // Resume context after user gesture (call from any user-initiated handler)
  resume() {
    this.ensureCtx();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : MASTER_VOL;
    try { localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0'); } catch {}
  }

  // Play a song by name. `song` is the SongDef; pass through to keep this
  // module decoupled from the song registry.
  playSong(name, song) {
    this.ensureCtx();
    if (!this.ctx) return;
    if (this.currentSong === name) return;
    this.stopSong();
    this.currentSong = name;
    this._scheduleLoop(song);
  }

  stopSong() {
    if (this._stopFn) { this._stopFn(); this._stopFn = null; }
    this.currentSong = null;
  }

  _scheduleLoop(song) {
    const beat = 60 / song.bpm;
    let stopped = false;
    const handles = new Set();

    const playOnce = (startTime) => {
      if (stopped) return startTime;
      // Schedule each track
      let songLen = 0;
      for (const track of song.tracks) {
        let t = startTime;
        const type = track.type || 'square';
        const vol = track.vol ?? 0.16;
        for (const evt of track.notes) {
          const dur = evt.d * beat;
          if (evt.p && evt.p !== '-' && evt.p !== '.') {
            this._note(noteToFreq(evt.p), t, dur * 0.94, type, vol);
          }
          t += dur;
        }
        songLen = Math.max(songLen, t - startTime);
      }
      return startTime + songLen;
    };

    const tick = () => {
      if (stopped) return;
      const start = this.ctx.currentTime + 0.05;
      const end = playOnce(start);
      // Schedule next loop slightly before this loop ends to avoid gaps
      const lookahead = Math.max(50, (end - this.ctx.currentTime - 0.15) * 1000);
      const id = setTimeout(tick, lookahead);
      handles.add(id);
    };

    tick();

    this._stopFn = () => {
      stopped = true;
      for (const id of handles) clearTimeout(id);
      handles.clear();
    };
  }

  _note(freq, time, duration, type = 'square', vol = 0.16) {
    if (!this.ctx || !freq) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(vol, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(vol * 0.55, time + 0.06);
    const fadeStart = Math.max(time + 0.06, time + duration - 0.04);
    gain.gain.setValueAtTime(vol * 0.55, fadeStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain).connect(this.master);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  // ── SFX ───────────────────────────────────────────────────────────────
  blip() {
    this.ensureCtx(); if (!this.ctx) return;
    this._note(660, this.ctx.currentTime, 0.06, 'square', 0.13);
  }

  confirm() {
    this.ensureCtx(); if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this._note(523.25, t,        0.05, 'square', 0.16);
    this._note(783.99, t + 0.05, 0.08, 'square', 0.16);
  }

  pickup() {
    this.ensureCtx(); if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this._note(659.25, t,        0.05, 'square', 0.18);
    this._note(880.00, t + 0.05, 0.06, 'square', 0.18);
    this._note(1174.66, t + 0.10, 0.08, 'square', 0.18);
  }

  hit() {
    this.ensureCtx(); if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this._note(146.83, t, 0.18, 'sawtooth', 0.22);
    this._note(110.00, t + 0.05, 0.12, 'square', 0.10);
  }

  thunder() {
    // Used for the festival blackout — low rumble
    this.ensureCtx(); if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this._note(82.41, t, 0.6, 'sawtooth', 0.22);
    this._note(55.00, t + 0.05, 0.5, 'sawtooth', 0.18);
  }
}
