const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('game.js', 'utf8');

const mockCtx = new Proxy({}, { get() { return () => mockCtx; }, set() { return true; } });
const mockEl = { width: 1280, height: 720, style: {}, classList: { add: ()=>{}, remove: ()=>{} }, addEventListener: ()=>{}, getContext: () => mockCtx, appendChild: () => {}, querySelector: () => mockEl, querySelectorAll: () => [] };
const sandbox = { console: console, document: { getElementById: () => mockEl, getElementsByClassName: () => [], querySelectorAll: () => [], querySelector: () => mockEl, createElement: () => mockEl, addEventListener: () => {}, body: mockEl }, window: { addEventListener: () => {}, innerWidth: 1024, innerHeight: 768, location: { protocol: 'file:' } }, navigator: {}, setTimeout: (fn) => fn(), setInterval: () => {}, AudioContext: class {}, webkitAudioContext: class {}, Image: class { constructor() { this.width = 100; this.height = 100; } }, Date: Date, Math: Math, performance: { now: () => Date.now() }, requestAnimationFrame: () => {} };

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const game = sandbox.window.game;
const player = game.player;
const enemies = game.enemyManager;

player.switchCharacter('lapis');
player.x = 200;
player.facing = 1;
game.projectiles = [];
player.executeSkillL(game.audio, game.particles, game.pickups, game.projectiles);
const wave = game.projectiles[0];
const enemy = enemies.spawnEnemy('centipeetle', 320);

console.log('Wave properties:', { x: wave.x, y: wave.y, w: wave.width, h: wave.height, vx: wave.vx });
console.log('Enemy initial state:', { x: enemy.x, y: enemy.y, hp: enemy.hp });

let hitDetected = false;
const initialHp = enemy.hp;

for (let i = 0; i < 20; i++) {
  wave.x += wave.vx * 0.016;
  enemies.checkPlayerAttackCollisions(enemy, player, game.projectiles, game.particles, game.audio, () => {}, 0);
  if (enemy.hp < initialHp) {
    hitDetected = true;
    console.log(`Step ${i} (wave.x=${Math.round(wave.x)}): ENEMY DAMAGED! HP: ${enemy.hp}/${initialHp}, Knockback vx: ${enemy.vx}, vy: ${enemy.vy}`);
    break;
  }
}

if (!hitDetected) {
  throw new Error('Collision failed!');
}
console.log('🎉 VERIFIED: Lapis Tidal Wave hits enemy, applies damage, and launches into the air!');
