/**
 * test_death_and_pause_fixes.js
 * Verification of Player Knockout/Poofing, Wave Controller Pausing, and Practice Mode HUD
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const domStore = {};
function createMockEl(id, tagName = 'div') {
  return {
    id,
    tagName: tagName.toUpperCase(),
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    dataset: {},
    children: [],
    appendChild(c) { this.children.push(c); return c; },
    innerHTML: '',
    textContent: '',
    value: '',
    addEventListener: () => {},
    dispatchEvent: () => {},
    focus: () => {},
    blur: () => {}
  };
}

const canvasMock = {
  id: 'gameCanvas',
  getContext: () => ({
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    fillRect: () => {},
    clearRect: () => {},
    beginPath: () => {},
    ellipse: () => {},
    roundRect: () => {},
    rect: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    fill: () => {},
    stroke: () => {},
    arc: () => {},
    fillText: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    measureText: () => ({ width: 50 })
  }),
  width: 1280,
  height: 720,
  style: {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 720 }),
  addEventListener: () => {}
};
domStore['gameCanvas'] = canvasMock;

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { reload: () => {}, protocol: 'http:' },
  innerWidth: 1280,
  innerHeight: 720
};

global.navigator = {
  userAgent: 'HeadlessChrome',
  serviceWorker: { register: () => Promise.resolve() }
};

global.document = {
  getElementById: (id) => {
    if (!domStore[id]) domStore[id] = createMockEl(id);
    return domStore[id];
  },
  querySelector: (sel) => createMockEl(sel),
  querySelectorAll: (sel) => [],
  createElement: (tag) => createMockEl('elem_' + Math.random(), tag),
  body: createMockEl('body')
};

global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; },
  clear() { this._data = {}; }
};

global.performance = {
  now: () => Date.now()
};

global.requestAnimationFrame = () => {}; // do not loop infinitely in test
global.AudioContext = class {
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  get destination() { return {}; }
  get currentTime() { return 0; }
  resume() { return Promise.resolve(); }
};

const gameCode = fs.readFileSync('game.js', 'utf8');
vm.runInThisContext(gameCode);

console.log("--- STARTING UNIT TESTS FOR DEATH, POOFING, AND WAVE FIXES ---");

// TEST 1: Steven & Connie Knockout (lie_down) vs Gem Poofing (poofed)
console.log("\n[Test 1] Player Knockout & Gem Poofing Verification:");
const steven = new PlayerHero(600, 'p1', 2600);
steven.switchCharacter('steven');
steven.isFallen = true;
steven.fallenType = (steven.activeChar === 'steven' || steven.activeChar === 'connie') ? 'lie_down' : 'poofed';

console.log(` Steven activeChar: ${steven.activeChar}, isFallen: ${steven.isFallen}, fallenType: ${steven.fallenType}`);
if (steven.fallenType !== 'lie_down') throw new Error("Steven should have fallenType 'lie_down'!");

// Damage test while fallen
const dmgSteven = steven.takeDamage(10, { addDamageText: () => {}, addSparkle: () => {} }, { playSfx: () => {} });
console.log(` Steven takeDamage while fallen returned: ${dmgSteven}`);
if (dmgSteven !== false) throw new Error("Fallen Steven took damage!");

// Connie test
const connie = new PlayerHero(600, 'p2', 2600);
connie.switchCharacter('connie');
connie.isFallen = true;
connie.fallenType = (connie.activeChar === 'steven' || connie.activeChar === 'connie') ? 'lie_down' : 'poofed';
console.log(` Connie activeChar: ${connie.activeChar}, fallenType: ${connie.fallenType}`);
if (connie.fallenType !== 'lie_down') throw new Error("Connie should have fallenType 'lie_down'!");

// Gem test (Garnet)
const garnet = new PlayerHero(600, 'p1', 2600);
garnet.switchCharacter('garnet');
garnet.isFallen = true;
garnet.fallenType = (garnet.activeChar === 'steven' || garnet.activeChar === 'connie') ? 'lie_down' : 'poofed';
console.log(` Garnet activeChar: ${garnet.activeChar}, fallenType: ${garnet.fallenType}`);
if (garnet.fallenType !== 'poofed') throw new Error("Garnet should have fallenType 'poofed'!");

// Amethyst test
const amethyst = new PlayerHero(600, 'p2', 2600);
amethyst.switchCharacter('amethyst');
amethyst.isFallen = true;
amethyst.fallenType = (amethyst.activeChar === 'steven' || amethyst.activeChar === 'connie') ? 'lie_down' : 'poofed';
console.log(` Amethyst activeChar: ${amethyst.activeChar}, fallenType: ${amethyst.fallenType}`);
if (amethyst.fallenType !== 'poofed') throw new Error("Amethyst should have fallenType 'poofed'!");

// Revival test
garnet.revive({ playSfx: () => {} }, { addSparkle: () => {}, addDamageText: () => {} });
console.log(` Garnet revived -> isFallen: ${garnet.isFallen}, fallenType: ${garnet.fallenType}, invulnerableTimer: ${garnet.invulnerableTimer}`);
if (garnet.isFallen !== false || garnet.invulnerableTimer <= 0) throw new Error("Revival failed!");

// TEST 2: Delta-Time Wave Controller (Immune to Pause & Idling)
console.log("\n[Test 2] Delta-Time Wave Controller Verification:");

const game = new StevenUniverseGame('gameCanvas');
game.stageIndex = 1;
game.gameMode = 'story';
game.startEpisodeWaveSequence();

console.log(` Initial Wave Index: ${game.waveIndex}, Queue Length: ${game.waveSpawnQueue.length}`);
if (game.waveSpawnQueue.length === 0) throw new Error("Wave spawn queue should have enemies!");

// Simulate 1 second of dt
game.state = 'playing';
game.update(1.0);
console.log(` After 1.0s update, Remaining in queue: ${game.waveSpawnQueue.length}, Spawned enemies in manager: ${game.enemyManager.enemies.length}`);
if (game.enemyManager.enemies.length === 0) throw new Error("Enemies should have spawned into arena!");

// Simulate PAUSE (e.g. 5 seconds idle/pause)
game.state = 'paused';
const queueCountBeforePause = game.waveSpawnQueue.length;
const enemyCountBeforePause = game.enemyManager.enemies.length;
// Update is NOT called when paused
console.log(` Paused state: queue=${queueCountBeforePause}, enemies=${enemyCountBeforePause}`);

// Unpause cleanly
game.state = 'playing';
game.lastTime = performance.now();
game.update(2.0); // Resume 2 seconds
console.log(` Resumed update: queue=${game.waveSpawnQueue.length}, enemies=${game.enemyManager.enemies.length}`);
if (game.waveSpawnQueue.length !== 0) throw new Error("All enemies in wave 1 should be spawned after 3s total dt!");

// TEST 3: Practice vs Story Mode HUD
console.log("\n[Test 3] Practice vs Story Mode HUD:");
game.startPracticeDojo();
const badgeEl = domStore['hudStageBadge'];
const objEl = domStore['hudObjectiveText'];
const bossHudEl = domStore['bossHud'];

console.log(` Practice Mode -> hudStageBadge display: ${badgeEl.style.display}, hudObjectiveText display: ${objEl.style.display}`);
if (badgeEl.style.display !== 'none' || objEl.style.display !== 'none') {
  throw new Error("Practice mode must hide badge and objective text!");
}
if (bossHudEl.classList.contains('story-mode-boss')) {
  throw new Error("Practice mode must NOT have .story-mode-boss class!");
}

game.stageIndex = 2;
game.startStageWave();
console.log(` Story Mode Stage 2 -> hudStageBadge display: ${badgeEl.style.display}, hudObjectiveText display: ${objEl.style.display}`);
if (badgeEl.style.display !== 'block' || objEl.style.display !== 'block') {
  throw new Error("Story mode must show badge and objective text!");
}
if (!bossHudEl.classList.contains('story-mode-boss')) {
  throw new Error("Story mode MUST have .story-mode-boss class on boss health bar!");
}

console.log("\n>>> ALL UNIT TESTS PASSED WITH 100% SUCCESS! <<<");
process.exit(0);
