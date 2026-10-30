/**
 * test_hud_and_dual_bars.js
 * Comprehensive automated verification for:
 * 1. Top HUD 5-zone layout (P1 far left, Score mid-left, Boss/PvZ center, Actions mid-right, P2 far right)
 * 2. Bottom Dual Action Bars (P1 bottom-left [F,G,H,E], P2 bottom-right [J,K,L,I])
 * 3. 2-Player Friendly Co-Op Fusion Mechanics (Dual Strike & Perfect Harmony Finisher)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('--- TEST 1: VERIFY GAME.HTML FOR HUD & ACTION BAR IDS ---');
const html = fs.readFileSync(path.join(__dirname, '../game.html'), 'utf8');

const requiredHtmlIds = [
  'hudP1Panel', 'hudP2Panel', 'hudCenterPanel', 'hudScorePill', 'hudActionsPill',
  'hudScore', 'hudBubbledGems', 'hudHearts', 'hudHeartsP2',
  'btnOverdrive', 'btnFuseHud', 'btnOverdriveP2',
  'bossHud', 'pvzWaveContainer',
  'actionBarsContainer', 'actionBarP1', 'actionBarP2',
  'barNameP1', 'barNameP2',
  'slotJ', 'slotK', 'slotL', 'slotI',
  'slotP2_J', 'slotP2_K', 'slotP2_L', 'slotP2_I',
  'badgeJ', 'badgeK', 'badgeL', 'badgeI',
  'badgeP2_J', 'badgeP2_K', 'badgeP2_L', 'badgeP2_I'
];

for (const id of requiredHtmlIds) {
  assert(html.includes(`id="${id}"`), `Missing required HTML element id="${id}" in game.html`);
}
console.log(`✓ All ${requiredHtmlIds.length} HUD and Action Bar element IDs verified in game.html!`);

console.log('\n--- TEST 2: VERIFY GAME.CSS FOR LAYOUT CLASSES ---');
const css = fs.readFileSync(path.join(__dirname, '../game.css'), 'utf8');

const requiredCssClasses = [
  '.hud-score-pill',
  '.hud-actions-pill',
  '.hud-btn-row',
  '.hud-action-bars-wrapper',
  '.hud-action-bar-p1',
  '.hud-action-bar-p2',
  '.action-bar-pill.p1-pill',
  '.action-bar-pill.p2-pill',
  '.action-slots-row'
];

for (const cls of requiredCssClasses) {
  assert(css.includes(cls), `Missing required CSS class "${cls}" in game.css`);
}
console.log(`✓ All ${requiredCssClasses.length} required CSS classes verified in game.css!`);

console.log('\n--- TEST 3: INITIALIZE GAME INSTANCE AND VERIFY 1P & 2P ACTION BARS ---');

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

const game = new StevenUniverseGame();
assert(game, 'Failed to instantiate StevenUniverseGame');

// 3.1. Verify 1P mode action bar
game.playerMode = '1p';
game.player.activeChar = 'amethyst';
game.isFused = false;
game.updateActionBar();

const barP1 = getOrCreateElem('actionBarP1');
const barP2 = getOrCreateElem('actionBarP2');
const badgeJ = getOrCreateElem('badgeJ');
const badgeK = getOrCreateElem('badgeK');
const badgeL = getOrCreateElem('badgeL');
const badgeI = getOrCreateElem('badgeI');

assert.strictEqual(barP1.style.display, 'flex', '1P mode must show actionBarP1');
assert.strictEqual(barP2.style.display, 'none', '1P mode must hide actionBarP2');
assert.strictEqual(badgeJ.textContent, 'J', '1P mode slot J badge must be [J]');
assert.strictEqual(badgeK.textContent, 'K', '1P mode slot K badge must be [K]');
assert.strictEqual(badgeL.textContent, 'L', '1P mode slot L badge must be [L]');
assert.strictEqual(badgeI.textContent, 'I', '1P mode slot I badge must be [I]');
console.log('✓ 1-Player Mode: actionBarP1 visible, actionBarP2 hidden, keys [J, K, L, I] verified!');

// 3.2. Verify 2P mode action bar (Unfused: P1 Amethyst, P2 Steven)
game.playerMode = '2p';
game.player2 = new PlayerHero(600, 'p2');
game.player.activeChar = 'amethyst';
game.player2.activeChar = 'steven';
game.isFused = false;
game.updateActionBar();

assert.strictEqual(barP1.style.display, 'flex', '2P mode must show actionBarP1');
assert.strictEqual(barP2.style.display, 'flex', '2P mode must show actionBarP2');

assert.strictEqual(badgeJ.textContent, 'F', '2P mode P1 slot J badge must be [F]');
assert.strictEqual(badgeK.textContent, 'G', '2P mode P1 slot K badge must be [G]');
assert.strictEqual(badgeL.textContent, 'H', '2P mode P1 slot L badge must be [H]');
assert.strictEqual(badgeI.textContent, 'E', '2P mode P1 slot I badge must be [E]');

const badgeP2_J = getOrCreateElem('badgeP2_J');
const badgeP2_K = getOrCreateElem('badgeP2_K');
const badgeP2_L = getOrCreateElem('badgeP2_L');
const badgeP2_I = getOrCreateElem('badgeP2_I');
assert.strictEqual(badgeP2_J.textContent, 'J', '2P mode P2 slot J badge must be [J]');
assert.strictEqual(badgeP2_K.textContent, 'K', '2P mode P2 slot K badge must be [K]');
assert.strictEqual(badgeP2_L.textContent, 'L', '2P mode P2 slot L badge must be [L]');
assert.strictEqual(badgeP2_I.textContent, 'I', '2P mode P2 slot I badge must be [I]');

const barNameP1 = getOrCreateElem('barNameP1');
const barNameP2 = getOrCreateElem('barNameP2');
assert(barNameP1.textContent.includes('AMETHYST'), 'P1 bar name must include AMETHYST');
assert(barNameP2.textContent.includes('STEVEN'), 'P2 bar name must include STEVEN');
console.log('✓ 2-Player Mode (Unfused): P1 [F, G, H, E] (Amethyst) & P2 [J, K, L, I] (Steven) verified!');

console.log('\n--- TEST 4: VERIFY 2P FUSION CO-OP ACTION BARS & MOVES ---');
game.fusionEnergy = 100;
game.triggerFusion();
assert(game.isFused, 'Game must enter fused state');
assert.strictEqual(game.player.fusionKey, 'smoky', 'Amethyst + Steven must fuse into Smoky Quartz');

game.updateActionBar();
assert.strictEqual(barP1.style.display, 'flex', 'Fused 2P mode must keep P1 action bar active');
assert.strictEqual(barP2.style.display, 'flex', 'Fused 2P mode must keep P2 action bar active');
assert(barNameP1.textContent.includes('SMOKY QUARTZ'), 'P1 bar title must show SMOKY QUARTZ');
assert(barNameP2.textContent.includes('SMOKY QUARTZ'), 'P2 bar title must show SMOKY QUARTZ');

const nameJ = getOrCreateElem('nameJ');
const nameP2_J = getOrCreateElem('nameP2_J');
assert(nameJ.textContent.includes('Yo-Yo') || nameJ.textContent.includes('Primary') || nameJ.textContent.includes('Blast'), 'P1 slot J must show Smoky Quartz move');
assert(nameP2_J.textContent.includes('Yo-Yo') || nameP2_J.textContent.includes('Shield') || nameP2_J.textContent.includes('Synergy') || nameP2_J.textContent.includes('Blast'), 'P2 slot J must show partner synergy move');
console.log(`✓ 2-Player Fusion Mode: P1 move "${nameJ.textContent}" & P2 move "${nameP2_J.textContent}" active!`);

console.log('\n--- TEST 5: VERIFY 2P TAG-TEAM HYPER ATTACK (4s BLAST, +1 HEAL & 8s SYNERGY BUFF) ---');
game.currentHearts = 2;
game.currentHeartsP2 = 2;
game.maxHearts = 5;
game.hyperAttackTimer = 3.3;
game.hyperAttackFired = false;
const preBlastProjCount = game.projectiles.length;

// Step into Phase 2 (T <= 3.2s)
game.updateHyperAttack(0.2, []);

assert(game.hyperAttackFired, 'Hyper Attack blast must fire at T <= 3.2s');
assert(game.projectiles.length > preBlastProjCount, 'Hyper Attack must spawn signature screen nuke projectiles');
const blast = game.projectiles.find(p => p.type === 'hyperYoYoCyclone');
assert(blast, 'Projectile type must match Smoky Quartz hyperYoYoCyclone');
assert(blast.damage >= 300, `Hyper Attack must deal massive damage (got ${blast.damage})`);
assert.strictEqual(game.currentHearts, 3, 'Tag Hyper Attack must heal P1 (+1 Heart)');
assert.strictEqual(game.currentHeartsP2, 3, 'Tag Hyper Attack must heal P2 (+1 Heart)');
console.log(`✓ Phase 2 Screen Nuke verified! Spawned ${blast.type} (${blast.damage} DMG) & healed +1 Heart!`);

// Fast forward to end of 4.0s cinematic
game.updateHyperAttack(3.5, []);
assert(!game.isFused, 'Game must no longer be fused after hyper attack ends');
assert(!game.isHyperAttack, 'isHyperAttack must be false');
assert.strictEqual(game.synergyBuffTimer, 8.0, 'Must grant 8.0s Harmony Synergy Buff');
assert(game.player.hasSynergyBuff, 'P1 must have active synergy buff');
assert(game.player2.hasSynergyBuff, 'P2 must have active synergy buff');
assert(!game.player2.isMergedInFusion, 'P2 must unmerge and stand side-by-side');
console.log('✓ Tag-Team Hyper Attack finish verified: 8.0s Harmony Synergy Buff applied, side-by-side landing!');

console.log('\n--- TEST 6: VERIFY TOP HUD STATUS & BUTTONS SYNC ---');
game.isFused = true;
game.isHyperAttack = true;
game.hyperAttackTimer = 3.5;
game.player.fusionData = { name: 'Smoky Quartz', icon: '🌪️' };
game.updateHUD();
game.updateFusionHUD();
const hudScore = getOrCreateElem('hudScore');
const hudBubbledGems = getOrCreateElem('hudBubbledGems');
const btnFuseHud = getOrCreateElem('btnFuseHud');

assert.strictEqual(hudScore.textContent, `${game.score}`, 'hudScore must match game.score');
assert.strictEqual(hudBubbledGems.textContent, `💎 ${game.bubbledGemsCount}`, 'hudBubbledGems must display count');
assert(btnFuseHud.classList.contains('fused'), 'btnFuseHud must have .fused class while fused');
console.log('✓ Top HUD sync verified: Score, Bubbled Gems, and Tag Fuse button synced!');

// Test Unfuse
game.finishTagTeamHyperAttack();
assert(!game.isFused, 'finishTagTeamHyperAttack must clear fused state');
game.updateHUD();
game.updateFusionHUD();
assert(!btnFuseHud.classList.contains('fused'), 'btnFuseHud must no longer have .fused class');
console.log('✓ Unfuse verified: Tag Fuse button returns to ready/sync status cleanly!');

console.log('\n=========================================');
console.log('ALL HUD, DUAL BARS & CO-OP TESTS PASSED! (100%)');
console.log('=========================================');
process.exit(0);
