// Scene base class + simple stack for the game.

export class Scene {
  constructor(game) {
    this.game = game;
  }
  enter() {}      // pushed onto stack
  exit() {}       // popped off
  pause() {}      // another scene pushed on top
  resume() {}     // top scene popped, this one is now top again
  update(dt) {}   // called every frame for the top scene
  render(r) {}    // called every frame; lower scenes also render if visible
  visibleBeneath = false; // if true, renders even when not on top
}

export class SceneStack {
  constructor(game) {
    this.game = game;
    this.stack = [];
  }

  push(scene) {
    if (this.stack.length > 0) this.top().pause();
    this.stack.push(scene);
    scene.enter();
  }

  pop() {
    if (this.stack.length === 0) return;
    const top = this.stack.pop();
    top.exit();
    if (this.stack.length > 0) this.top().resume();
  }

  // Replace the entire stack with a single scene.
  replace(scene) {
    while (this.stack.length > 0) {
      const s = this.stack.pop();
      s.exit();
    }
    this.push(scene);
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  update(dt) {
    if (this.stack.length === 0) return;
    this.top().update(dt);
  }

  render(r) {
    // Render bottom-up: draw scenes that are visibleBeneath the top, then top.
    let firstVisibleIdx = this.stack.length - 1;
    while (firstVisibleIdx > 0 && this.stack[firstVisibleIdx].visibleBeneath) {
      firstVisibleIdx--;
    }
    for (let i = firstVisibleIdx; i < this.stack.length; i++) {
      this.stack[i].render(r);
    }
  }
}
