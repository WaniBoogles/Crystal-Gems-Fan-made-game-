/**
 * test_fusion_system.js
 * Comprehensive automated verification for the Steven Universe Canonical Gem Fusion System
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeMockElem() {
  return {
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    textContent: '',
    innerHTML: '',
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
}

global.document = {
  getElementById: () => makeMockElem(),
  createElement: () => makeMockElem(),
  querySelectorAll: () => [],
  querySelector: () => makeMockElem(),
  addEventListener: () => {},
  body: makeMockElem()
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
global.navigator = { userAgent: 'test' };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.AudioContext = class {
  createOscillator() { return { type: 'sine', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {} }; }
  get currentTime() { return 0; }
  get state() { return 'running'; }
  resume() { return Promise.resolve(); }
};
global.HTMLCanvasElement = class {};

const gameCode = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
vm.runInThisContext(gameCode);

console.log('--- TEST 1: CANONICAL FUSION PAIRS MATRIX ---');
const canonPairs = [
  ['steven', 'connie', 'stevonnie', 'Stevonnie'],
  ['connie', 'steven', 'stevonnie', 'Stevonnie'],
  ['steven', 'amethyst', 'smoky', 'Smoky Quartz'],
  ['amethyst', 'steven', 'smoky', 'Smoky Quartz'],
  ['steven', 'pearl', 'rainbow2', 'Rainbow Quartz 2.0'],
  ['pearl', 'steven', 'rainbow2', 'Rainbow Quartz 2.0'],
  ['steven', 'garnet', 'sunstone', 'Sunstone'],
  ['garnet', 'steven', 'sunstone', 'Sunstone'],
  ['amethyst', 'garnet', 'sugilite', 'Sugilite'],
  ['garnet', 'amethyst', 'sugilite', 'Sugilite'],
  ['garnet', 'pearl', 'sardonyx', 'Sardonyx'],
  ['pearl', 'garnet', 'sardonyx', 'Sardonyx'],
  ['amethyst', 'pearl', 'opal', 'Opal'],
  ['pearl', 'amethyst', 'opal', 'Opal'],
  ['jasper', 'lapis', 'malachite', 'Malachite'],
  ['lapis', 'jasper', 'malachite', 'Malachite'],
  ['pearl', 'rose', 'rainbowClassic', 'Rainbow Quartz'],
  ['rose', 'pearl', 'rainbowClassic', 'Rainbow Quartz']
];

for (const [c1, c2, expectedId, expectedName] of canonPairs) {
  const f = getCanonFusion(c1, c2);
  if (!f || f.id !== expectedId) {
    throw new Error(`FAIL: Fusion between ${c1} and ${c2} expected ${expectedId}, got ${f?.id}`);
  }
  console.log(`✓ Canon pair ${c1} + ${c2} => ${f.name} (${f.weapon})`);
}

console.log('\n--- TEST 2: CANONICAL EXCLUSIONS (NON-CANON GEMS) ---');
const nonCanonPairs = [
  ['peridot', 'steven'],
  ['peridot', 'lapis'],
  ['bismuth', 'garnet'],
  ['bismuth', 'pearl'],
  ['steven', 'jasper']
];

for (const [c1, c2] of nonCanonPairs) {
  const f = getCanonFusion(c1, c2);
  if (f !== null) {
    throw new Error(`FAIL: Expected null fusion for non-canon pair ${c1} + ${c2}, got ${f?.id}`);
  }
  console.log(`✓ Non-canon pair ${c1} + ${c2} correctly returned null (Independent gems)`);
}

const periPartners = getCompatibleFusionPartners('peridot');
if (periPartners.length !== 0) throw new Error('Peridot must have 0 canon partners');
console.log('✓ Peridot has 0 canon fusion partners (100% lore accurate)');

const bisPartners = getCompatibleFusionPartners('bismuth');
if (bisPartners.length !== 0) throw new Error('Bismuth must have 0 canon partners');
console.log('✓ Bismuth has 0 canon fusion partners (100% lore accurate)');

console.log('\n--- TEST 3: ALL 9 CANON FUSION COMBAT MOVES & PROJECTILES ---');
const dummyAudio = new GemAudioEngine();
const dummyParticles = new ParticleSystem();

const allFusions = ['stevonnie', 'smoky', 'rainbow2', 'sunstone', 'sugilite', 'sardonyx', 'opal', 'malachite', 'rainbowClassic'];

for (const fid of allFusions) {
  const hero = new PlayerHero(600, 'p1', 2600);
  hero.isFusion = true;
  let fData = null;
  for (const k in CANON_FUSIONS) {
    if (CANON_FUSIONS[k].id === fid) {
      fData = CANON_FUSIONS[k];
      break;
    }
  }
  if (!fData) throw new Error(`Fusion data not found for ${fid}`);
  hero.fusionKey = fid;
  hero.fusionData = fData;

  // 1. Attack J
  hero.executeAttackJ(dummyAudio, dummyParticles, []);
  if (!hero.isAttacking) throw new Error(`${fid} executeAttackJ did not set isAttacking`);

  // 2. Special K
  const kProjectiles = [];
  hero.executeSpecialK(dummyAudio, dummyParticles, kProjectiles);
  if (kProjectiles.length === 0) throw new Error(`${fid} executeSpecialK did not spawn projectiles`);

  // 3. Skill L
  const lProjectiles = [];
  const lPickups = [];
  hero.executeSkillL(dummyAudio, dummyParticles, lPickups, lProjectiles);
  if (lProjectiles.length === 0 && lPickups.length === 0) throw new Error(`${fid} executeSkillL did not spawn projectiles/pickups`);

  console.log(`✓ Fusion [${fData.name}]: J hit registered, K spawned ${kProjectiles.length} proj, L spawned ${lProjectiles.length} proj / ${lPickups.length} pickups`);
}

console.log('\n--- TEST 4: CANVAS RENDERING FOR ALL 9 CANON FUSIONS ---');
const mockCanvas = makeMockElem();
const mockCtx = mockCanvas.getContext();
for (const fid of allFusions) {
  const hero = new PlayerHero(600, 'p1', 2600);
  hero.isFusion = true;
  for (const k in CANON_FUSIONS) {
    if (CANON_FUSIONS[k].id === fid) {
      hero.fusionData = CANON_FUSIONS[k];
      break;
    }
  }

  // Draw idle
  hero.draw(mockCtx);
  // Draw while punching
  hero.isAttacking = true;
  hero.actionType = 'punch';
  hero.actionDuration = 0.25;
  hero.actionTimer = 0.12;
  hero.draw(mockCtx);
  // Draw while skill
  hero.actionType = 'skill';
  hero.draw(mockCtx);

  console.log(`✓ Fusion [${hero.fusionData.name}] rendered across idle, punch, and skill states without errors.`);
}

console.log('\n--- TEST 5: STEVEN UNIVERSE GAME FUSION CONTROLLER ---');
const game = new StevenUniverseGame();
if (game.fusionEnergy !== 0) throw new Error('Initial fusionEnergy must be 0');
if (game.isFused !== false) throw new Error('Initial isFused must be false');

// Add sync energy
game.addFusionSync(45);
if (game.fusionEnergy !== 45) throw new Error('addFusionSync failed to accumulate');
game.addFusionSync(60);
if (game.fusionEnergy !== 100) throw new Error('fusionEnergy should cap at 100%');

// Test 2P Fusion Compatibility: Steven + Connie
game.playerMode = '2p';
game.player = new PlayerHero(600, 'p1', 2600);
game.player.activeChar = 'steven';
game.player2 = new PlayerHero(600, 'p2', 2600);
game.player2.activeChar = 'connie';

game.triggerFusion();
if (!game.isFused) throw new Error('triggerFusion failed to fuse Steven + Connie');
if (game.player.fusionKey !== 'stevonnie') throw new Error('Fusion key should be stevonnie');
if (!game.player2.isMergedInFusion) throw new Error('P2 should be marked isMergedInFusion');
console.log('✓ 2P Fusion Activation: Steven + Connie merged successfully into STEVONNIE!');

// Test Unfuse
game.unfuseGems();
if (game.isFused) throw new Error('unfuseGems failed to unfuse');
if (game.player.isFusion) throw new Error('player.isFusion should be false after unfuse');
if (game.player2.isMergedInFusion) throw new Error('player2.isMergedInFusion should be false after unfuse');
console.log('✓ Unfuse Gems: Both gems successfully split back into individual forms!');

// Test Non-Canon Pairing in 2P: Steven + Bismuth
game.player.activeChar = 'steven';
game.player2.activeChar = 'bismuth';
game.fusionEnergy = 100;
game.triggerFusion();
if (game.isFused) throw new Error('Steven + Bismuth must not fuse (Non-canon)');
console.log('✓ Non-canon pair (Steven + Bismuth) correctly blocked from fusing.');

console.log('\n=========================================');
console.log('ALL CANONICAL FUSION TESTS PASSED! (100%)');
console.log('=========================================');
process.exit(0);
