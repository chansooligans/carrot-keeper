import { Scene } from '../engine/scene.js';
import { SCREEN_W, SCREEN_H } from '../engine/renderer.js';

const BOX_PAD = 4;
const BOX_H = 44;
const CHAR_PER_FRAME = 0.5; // chars per frame (roughly 30/sec)

export class DialogScene extends Scene {
  visibleBeneath = true; // draws over the underlying scene

  // lines: array of strings ; onEnd: optional callback ; speakerName?: string
  constructor(game, lines, opts = {}) {
    super(game);
    this.allLines = lines.slice();
    this.opts = opts;
    this.speakerName = opts.speakerName || null;
    // Pre-wrap each line to the available pixel width.
    const innerW = SCREEN_W - BOX_PAD * 2 - 6;
    this.pages = [];
    for (const line of this.allLines) {
      const wrapped = this.game.font.wrap(line, innerW);
      // Group as 2 lines per page max
      for (let i = 0; i < wrapped.length; i += 2) {
        this.pages.push(wrapped.slice(i, i + 2));
      }
    }
    this.pageIdx = 0;
    this.charProgress = 0;
  }

  currentPage() {
    return this.pages[this.pageIdx] || [''];
  }

  pageChars() {
    return this.currentPage().reduce((a, l) => a + l.length + 1, 0);
  }

  isPageDone() {
    return this.charProgress >= this.pageChars();
  }

  finish() {
    if (this.opts.onEnd) this.opts.onEnd(this.game);
    this.game.scenes.pop();
  }

  update(dt) {
    const inp = this.game.input;
    if (!this.isPageDone()) {
      // advance text (instant if A held)
      this.charProgress += inp.held.a ? 4 : 1;
      if (inp.pressed.a) this.charProgress = this.pageChars();
      return;
    }
    if (inp.pressed.a) {
      this.pageIdx++;
      this.charProgress = 0;
      if (this.pageIdx >= this.pages.length) this.finish();
    }
  }

  render(r) {
    const f = this.game.font;
    const x = 4;
    const y = SCREEN_H - BOX_H - 4;
    const w = SCREEN_W - 8;
    const h = BOX_H;

    // Box: black bg, white border, inner shadow
    r.rect(x, y, w, h, '#0f0f0f');
    r.outlineRect(x, y, w, h, '#f0f0e8');
    r.outlineRect(x + 1, y + 1, w - 2, h - 2, '#306230');

    // Speaker tag
    let textY = y + BOX_PAD + 2;
    if (this.speakerName) {
      f.draw(r.ctx, this.speakerName.toUpperCase(), x + BOX_PAD + 2, textY, '#9bbc0f');
      textY += f.lineHeight();
    }

    // Render page text up to charProgress
    const page = this.currentPage();
    let used = 0;
    for (let i = 0; i < page.length; i++) {
      const line = page[i];
      const allowed = Math.max(0, Math.min(line.length, this.charProgress - used));
      const visible = line.slice(0, allowed);
      f.draw(r.ctx, visible, x + BOX_PAD + 2, textY + i * f.lineHeight(), '#f0f0e8');
      used += line.length + 1;
    }

    // Continue indicator
    if (this.isPageDone()) {
      const blink = (Math.floor(performance.now() / 250) % 2) === 0;
      if (blink) f.draw(r.ctx, '>', x + w - 10, y + h - 10, '#f0f0e8');
    }
  }
}

// Helper: queue a sequence of dialog branches (each from an NPC) as one DialogScene.
export function startNpcDialog(game, npc) {
  const branch = (npc.dialog || []).find(b => !b.when || b.when(game)) || null;
  if (!branch) return;
  game.scenes.push(new DialogScene(game, branch.lines, {
    speakerName: npc.name,
    onEnd: (g) => { if (branch.onEnd) branch.onEnd(g); g.save(); },
  }));
}
