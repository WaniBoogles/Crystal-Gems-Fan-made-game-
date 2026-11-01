#!/usr/bin/env node
/**
 * Crystal Gems! — gem-typing unit tests
 *
 * Pulls the pure data/helper block out of src/game.js (everything between
 * "GEM COMBAT TYPES" and the combo-profile table) and checks the matchup maths
 * without needing a browser or a DOM.
 *
 *   node tools/test-types.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, '..', 'src', 'game.js');
const code = fs.readFileSync(SRC, 'utf8');
const start = code.indexOf('const TYPE_META = {');
const end = code.indexOf('const HERO_COMBO_PROFILES = {');
if (start < 0 || end < 0) {
  console.error('Could not locate the type-system block in src/game.js');
  process.exit(1);
}

const sandbox = {};
vm.createContext(sandbox);
// `const` bindings live in the script's lexical scope, so re-export them explicitly.
const block = code.slice(start, end) +
  '\nglobalThis.__typeSystem = { TYPE_META, TYPE_CHART, TYPE_STATUS, HERO_MOVE_TYPES, FUSION_MOVE_TYPES, ENEMY_TYPES, typeMultiplier, getTypeMeta, typeEffectLabel };';
vm.runInContext(block, sandbox);
const { TYPE_META, TYPE_CHART, TYPE_STATUS, HERO_MOVE_TYPES, FUSION_MOVE_TYPES, ENEMY_TYPES, typeMultiplier, getTypeMeta, typeEffectLabel } = sandbox.__typeSystem;

let pass = 0, fail = 0;
const eq = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
};

console.log('\nMatchup chart');
eq('FIGHT vs STEEL = 2x', typeMultiplier('fight', ['steel']), 2);
eq('FIGHT vs FIGHT = 1x', typeMultiplier('fight', ['fight']), 1);
eq('FIGHT vs FLYING = 0.5x', typeMultiplier('fight', ['flying']), 0.5);
eq('ELECTR vs WATER/FLYING = 4x (dual)', typeMultiplier('electr', ['water', 'flying']), 4);
eq('WATER vs FIRE = 2x', typeMultiplier('water', ['fire']), 2);
eq('FIRE vs STEEL = 2x', typeMultiplier('fire', ['steel']), 2);
eq('FAIRY vs DARK/DRAGON = 4x (dual)', typeMultiplier('fairy', ['dark', 'dragon']), 4);
eq('FAIRY vs STEEL = 0.5x', typeMultiplier('fairy', ['steel']), 0.5);
eq('PSYCHIC vs DARK = 0x (immune)', typeMultiplier('psychic', ['dark']), 0);
eq('DARK vs PSYCHIC = 2x', typeMultiplier('dark', ['psychic']), 2);
eq('DRAGON vs FAIRY = 0x (immune)', typeMultiplier('dragon', ['fairy']), 0);
eq('STEEL vs FAIRY = 2x', typeMultiplier('steel', ['fairy']), 2);
eq('NORMAL vs STEEL = 0.5x', typeMultiplier('normal', ['steel']), 0.5);
eq('unknown move type = 1x', typeMultiplier(null, ['dark']), 1);

console.log('\nRoster integrity');
const heroes = ['steven', 'garnet', 'amethyst', 'pearl', 'bismuth', 'peridot', 'lapis', 'rose', 'connie', 'jasper'];
heroes.forEach(h => {
  const set = HERO_MOVE_TYPES[h];
  eq(`${h} has j/k/l types`, !!(set && set.j && set.k && set.l), true);
  ['j', 'k', 'l'].forEach(slot => {
    eq(`  ${h}.${slot} has metadata`, !!getTypeMeta(set[slot]).label, true);
    eq(`  ${h}.${slot} has a status rider`, !!TYPE_STATUS[set[slot]], true);
  });
});

console.log('\nFusion integrity');
Object.entries(FUSION_MOVE_TYPES).forEach(([id, set]) => {
  eq(`${id} has j/k/l types`, !!(set.j && set.k && set.l), true);
});

console.log('\nEnemy typings');
Object.entries(ENEMY_TYPES).forEach(([enemy, types]) => {
  eq(`${enemy} typing is lowercase & valid`, types.every(t => TYPE_META[t] && t === t.toLowerCase()), true);
});

console.log('\nChart completeness');
Object.keys(TYPE_META).forEach(t => {
  const row = TYPE_CHART[t] || {};
  Object.keys(row).forEach(def => {
    if (!TYPE_META[def]) { fail++; console.log(`  ✗ ${t} references unknown defender ${def}`); }
  });
});

console.log('\nEffect labels');
eq('2x label', typeEffectLabel(2).text, 'SUPER EFFECTIVE!');
eq('0.5x label', typeEffectLabel(0.5).text, 'RESISTED…');
eq('0x label', typeEffectLabel(0).text, 'IMMUNE!');
eq('1x has no label', typeEffectLabel(1), null);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
