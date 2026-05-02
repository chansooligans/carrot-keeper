// Carrot Keeper — entry point.
// Boots the game, owns the main loop, and pushes the title scene.

import { Game } from './game.js';
import { TitleScene } from './scenes/title.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);
game.scenes.push(new TitleScene(game));

// Main loop. Fixed dt; canvas is 60fps via requestAnimationFrame.
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  game.input.beginFrame();
  game.scenes.update(dt);
  game.scenes.render(game.r);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Expose for debugging in the console.
window.__game = game;
