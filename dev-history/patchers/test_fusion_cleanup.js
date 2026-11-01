/**
 * test_fusion_cleanup.js
 * Reproduces and verifies the fix for the lingering fusion bug:
 * 1. Amethyst + Steven fuse into Smoky Quartz in Practice
 * 2. Quit to title screen
 * 3. Select Pearl + Steven
 * 4. Start Practice again
 * 5. Verify gems start completely fresh as Pearl and Steven (NOT Smoky Quartz)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function createMockElement(id = '') {
  const elem = {
    id,
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); elem._className = Array.from(this._classes).join(' '); },
      remove(c) { this._classes.delete(c); elem._className = Array.from(this._classes).join(' '); },
      contains(c) { return this._classes.has(c); }
    },
    _className: '',
    get className() { return this._className; },
    set className(val) {
      this._className = val;
      this.classList._classes = new Set((val || '').split(/\s+/).filter(Boolean));
    },
    textContent: '',
    innerHTML: '',
    dataset: {},
    width: 1280,
    height: 720,
    getContext: () => ({
      save: () => {}, restore: () => {}, translate: () => {}, scale: () => {}, rotate: () => {},
      beginPath: () => {}, closePath: () => {}, moveTo: () => {}, lineTo: () => {},
      arc: () => {}, rect: () => {}, fillRect: () => {}, strokeRect: () => {},
      stroke: () => {}, fill: () => {}, fillText: () => {}, strokeText: () => {},
      measureText: () => ({ width: 50 }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      clearRect: () => {},
      ellipse: () => {},
      bezierCurveTo: () => {},
      quadraticCurveTo: () => {},
      roundRect: () => {}
    }),
    appendChild: () => {},
    addEventListener: () => {}
  };
  return elem;
}

const elements = new Map();
function getOrCreateElem(id) {
  if (!elements.has(id)) {
    elements.set(id, createMockElement(id));
  }
  return elements.get(id);
}

global.document = {
  getElementById: (id) => getOrCreateElem(id),
  createElement: () => createMockElement(),
  querySelectorAll: () => [],
  querySelector: (sel) => createMockElement(sel),
  addEventListener: () => {},
  body: createMockElement('body')
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 1280,
  innerHeight: 720,
  location: { protocol: 'file:' },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id)
};
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;
global.navigator = { userAgent: 'test-node' };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.AudioContext = class {
  createOscillator() { return { type: 'sine', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
};
global.performance = { now: () => Date.now() };

const code = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
vm.runInThisContext(code);

console.log('--- TEST: REPRODUCE USER SEQUENCE ---');
const game = new StevenUniverseGame();
game.playerMode = '2p';
game.selectedCharP1 = 'amethyst';
game.selectedCharP2 = 'steven';

// Step 1: Start practice
game.startNewGame('practice');
assert.strictEqual(game.player.activeChar, 'amethyst');
assert.strictEqual(game.player2.activeChar, 'steven');

// Step 2: Fuse into Smoky Quartz
game.fusionEnergy = 100;
game.triggerFusion();
assert(game.isFused, 'Must be fused');
assert.strictEqual(game.player.fusionKey, 'smoky', 'Must be Smoky Quartz');
assert(game.player2.isMergedInFusion, 'P2 must be merged');
console.log('✓ Successfully fused Amethyst + Steven into Smoky Quartz in Practice');

// Step 3: User quits practice to main menu
game.showTitleScreen();
assert(!game.isFused, 'showTitleScreen must clear isFused');
assert(!game.player.isFusion, 'showTitleScreen must clear player.isFusion');
assert.strictEqual(game.player.fusionKey, null, 'showTitleScreen must clear player.fusionKey');
assert(!game.player2.isMergedInFusion, 'showTitleScreen must clear player2.isMergedInFusion');
console.log('✓ showTitleScreen properly reset fusion attributes');

// Step 4: User selects Pearl for P1 and Steven for P2
game.selectedCharP1 = 'pearl';
game.selectedCharP2 = 'steven';

// Step 5: User starts Practice again
game.startNewGame('practice');
assert(!game.isFused, 'New game must NOT be fused');
assert(!game.player.isFusion, 'Player must NOT be fusion');
assert.strictEqual(game.player.fusionKey, null, 'fusionKey must be null');
assert.strictEqual(game.player.activeChar, 'pearl', 'P1 must be Pearl');
assert.strictEqual(game.player2.activeChar, 'steven', 'P2 must be Steven');
assert(!game.player2.isMergedInFusion, 'P2 must be visible and not merged');

const barNameP1 = getOrCreateElem('barNameP1');
const barNameP2 = getOrCreateElem('barNameP2');
assert.strictEqual(barNameP1.textContent, 'PEARL', 'P1 bar must display PEARL');
assert(barNameP2.textContent.includes('STEVEN'), 'P2 bar must display STEVEN');
console.log('✓ New match correctly started as PEARL and STEVEN without any Smoky Quartz remnant!');

console.log('\n=========================================');
console.log('FUSION CLEANUP VERIFICATION 100% PASSED!');
console.log('=========================================');
process.exit(0);
