const TYPE_META = {
  normal:  { label: 'NORMAL',  color: '#a8a878', icon: '⭐' },
  fight:   { label: 'FIGHT',   color: '#c03028', icon: '🥊' },
  flying:  { label: 'FLYING',  color: '#a890f0', icon: '🪶' },
  psychic: { label: 'PSYCHIC', color: '#f85888', icon: '🔮' },
  fairy:   { label: 'FAIRY',   color: '#ee99ac', icon: '💗' },
  steel:   { label: 'STEEL',   color: '#9fa8c7', icon: '⚙️' },
  electr:  { label: 'ELECTR',  color: '#d9a800', icon: '⚡' },
  water:   { label: 'WATER',   color: '#6890f0', icon: '💧' },
  fire:    { label: 'FIRE',    color: '#e8762c', icon: '🔥' },
  dark:    { label: 'DARK',    color: '#7c6250', icon: '🌑' },
  dragon:  { label: 'DRAGON',  color: '#7038f8', icon: '🐉' }
};

// attacker -> { defender: multiplier }. Anything unspecified is 1x.
const TYPE_CHART = {
  normal:  { steel: 0.5 },
  fight:   { normal: 2, steel: 2, dark: 2, flying: 0.5, psychic: 0.5, fairy: 0.5 },
  flying:  { fight: 2, steel: 0.5, electr: 0.5 },
  psychic: { fight: 2, steel: 0.5, psychic: 0.5, dark: 0 },
  fairy:   { fight: 2, dragon: 2, dark: 2, steel: 0.5 },
  steel:   { fairy: 2, steel: 0.5, water: 0.5, electr: 0.5, fire: 0.5 },
  electr:  { water: 2, flying: 2, dragon: 0.5, electr: 0.5 },
  water:   { fire: 2, water: 0.5, dragon: 0.5 },
  fire:    { steel: 2, water: 0.5, fire: 0.5, dragon: 0.5 },
  dark:    { psychic: 2, fight: 0.5, dark: 0.5, fairy: 0.5 },
  dragon:  { dragon: 2, fairy: 0, steel: 0.5 }
};

// Canon-flavoured rider effects, one per damage type.
const TYPE_STATUS = {
  fight:   { id: 'stagger',  label: 'STAGGERED',   color: '#c03028' },
  psychic: { id: 'dazed',    label: 'DAZED',       color: '#f85888' },
  fairy:   { id: 'charmed',  label: 'CHARMED',     color: '#ee99ac' },
  steel:   { id: 'cracked',  label: 'ARMOR CRACK', color: '#9fa8c7' },
  electr:  { id: 'shocked',  label: 'OVERLOADED',  color: '#f8d030' },
  water:   { id: 'soaked',   label: 'SOAKED',      color: '#6890f0' },
  fire:    { id: 'scorched', label: 'SCORCHED',    color: '#f08030' },
  dark:    { id: 'corrupted',label: 'CORRUPTED',   color: '#7c6250' },
  dragon:  { id: 'shattered',label: 'SHATTERED',   color: '#7038f8' },
  flying:  { id: 'launched', label: 'LAUNCHED',    color: '#a890f0' },
  normal:  { id: 'focused',  label: 'FOCUSED',     color: '#a8a878' }
};

// Which element each of a hero's three moves actually channels.
// J = primary weapon/combo, K = special, L = signature skill.
const HERO_MOVE_TYPES = {
  steven:   { j: 'fairy',   k: 'fairy',   l: 'psychic' }, // Rose's shield + empathic healing
  garnet:   { j: 'fight',   k: 'fight',   l: 'electr'  }, // gauntlets + electrokinesis
  amethyst: { j: 'fight',   k: 'fight',   l: 'dark'    }, // whips + Violet geysers
  pearl:    { j: 'fight',   k: 'steel',   l: 'psychic' }, // spear thrust + Holo-Pearl
  bismuth:  { j: 'steel',   k: 'steel',   l: 'fire'    }, // forge hammer + magma
  peridot:  { j: 'steel',   k: 'electr',  l: 'steel'   }, // ferrokinesis + robonoid
  lapis:    { j: 'water',   k: 'water',   l: 'flying'  }, // hydrokinesis + water wings
  rose:     { j: 'fight',   k: 'fairy',   l: 'fairy'   }, // sword + bubble/healing tears
  connie:   { j: 'normal',  k: 'fight',   l: 'normal'  }, // Rose's sword fencing
  jasper:   { j: 'fight',   k: 'dragon',  l: 'fight'   }  // crash helmet + quartz fury
};

const FUSION_MOVE_TYPES = {
  stevonnie:      { j: 'fight', k: 'fairy',   l: 'fairy'   },
  smoky:          { j: 'fight', k: 'fairy',   l: 'dark'    },
  rainbow2:       { j: 'fairy', k: 'psychic', l: 'psychic' },
  sunstone:       { j: 'fight', k: 'fairy',   l: 'fire'    },
  sugilite:       { j: 'fight', k: 'fight',   l: 'electr'  },
  sardonyx:       { j: 'fight', k: 'steel',   l: 'psychic' },
  opal:           { j: 'fight', k: 'psychic', l: 'fairy'   },
  malachite:      { j: 'water', k: 'water',   l: 'dragon'  },
  rainbowClassic: { j: 'fairy', k: 'fairy',   l: 'psychic' }
};

// Projectiles are tagged with the element of the move that spawned them.
const PROJECTILE_TYPE_ELEMENTS = {
  stevenShield: 'fairy', roseShield: 'fairy', roseShockwave: 'fairy',
  garnetGauntlet: 'fight', giantGauntletSlam: 'fight', seismicShockwave: 'fight',
  amethystSpinDashHit: 'fight', purpleGeyser: 'dark', magneticVortex: 'steel',
  pearlLaser: 'steel', holoPearl: 'psychic', bismuthAnvil: 'steel', moltenShockwave: 'fire',
  tidalWave: 'water', hydroFist: 'water', connieSwordBeam: 'fight', connieShadowSlash: 'normal',
  jasperCrashHelmet: 'dragon', jasperSpinDashHit: 'fight',
  comboRosePulse: 'fairy', comboGauntletQuake: 'fight', comboWhipCyclone: 'dark',
  comboSpearFlurry: 'steel', comboAnvilEcho: 'steel', comboMagneticBurst: 'steel',
  comboTidalLash: 'water', comboRoseThorn: 'fairy', comboCrescentSlash: 'fight',
  comboSeismicSlam: 'fight', flaskRobonoid: 'steel',
  fusionOpalArrow: 'psychic', fusionCelestialRain: 'fairy',
  comboSwordStarWave: 'fairy', comboYoYoStar: 'fight', comboPrismBeam: 'psychic',
  comboSolarWave: 'fire', comboFlailQuake: 'fight', comboShowtimeWave: 'psychic',
  comboGlacialClaw: 'water', comboRainbowVeil: 'fairy'
};

// Enemy defensive typings (corrupted gems skew DARK; forged/robotic units skew STEEL).
const ENEMY_TYPES = {
  centipeetle: ['dark'], acid_centipeetle: ['dark'], winged_centipeetle: ['dark', 'flying'],
  blade_quartz: ['fight'], cluster: ['dark'], ice_monster: ['water'], snow_monster: ['water'],
  ice_gargoyle: ['water', 'flying'], spire_harpy: ['flying', 'dark'],
  volcanic_firebird: ['fire', 'flying'], forge_automaton: ['steel'],
  destabilizer_soldier: ['steel'], robonoid_scout: ['steel', 'electr'],
  carnelian_enforcer: ['fight'], obsidian: ['dark'],
  boss_spitter: ['dark'], boss_centipeetle: ['dark'], boss_ice_guardian: ['water', 'flying'],
  boss_cluster_titan: ['dark'], boss_cluster_core: ['dark', 'steel'],
  boss_forge_guardian: ['steel', 'fire'], boss_jasper: ['fight', 'dragon'],
  boss_quartz_beast: ['fight'], boss_agate_warden: ['psychic', 'fight'],
  boss_topaz_fusion: ['fight', 'steel'], boss_robonoid_titan: ['steel', 'electr'],
  boss_white_diamond: ['psychic', 'fairy'], boss_giant_bird: ['flying', 'dark'],
  boss_jasper_dummy: ['fight']
};

function getTypeMeta(type) {
  return TYPE_META[(type || '').toLowerCase()] || TYPE_META.normal;
}

function typeMultiplier(attackType, defenderTypes) {
  if (!attackType || !defenderTypes || !defenderTypes.length) return 1;
  const row = TYPE_CHART[String(attackType).toLowerCase()] || {};
  let mult = 1;
  for (const def of defenderTypes) {
    const key = String(def).toLowerCase();
    mult *= (row[key] !== undefined ? row[key] : 1);
  }
  return mult;
}

function typeEffectLabel(mult) {
  if (mult <= 0) return { text: 'IMMUNE!', color: '#94a3b8' };
  if (mult >= 2) return { text: 'SUPER EFFECTIVE!', color: '#facc15' };
  if (mult <= 0.5) return { text: 'RESISTED…', color: '#94a3b8' };
  return null;
}

const HERO_PASSIVES = {
  steven: {
    name: 'Spiked Pink Bubble', icon: '🛡️', role: 'TANK / HEALER', hasHeal: true, kTag: 'RANGED SHIELD',
    desc: 'Holding [S] deploys a Spiked Rose Bubble that blocks hits, reflects 18 thorn DMG, & knocks attackers back!',
    howToUse: 'Hold [S] when enemies close in to spike-counter them; press [L] for Healing Saliva (+1 Heart).',
    bars: { offense: 2, defense: 5, support: 5, speed: 3 }
  },
  garnet: {
    name: 'Future Vision', icon: '👁️', role: 'POWER STRIKER', hasHeal: false, kTag: 'ROCKET FIST',
    desc: 'Every 7s automatically foresees & parries the next incoming hit, granting +35% Counter DMG for 3s!',
    howToUse: 'Stay aggressive — when Future Vision flashes gold, immediately counter-punch with [J] or [L]!',
    bars: { offense: 5, defense: 4, support: 1, speed: 3 }
  },
  amethyst: {
    name: 'Wild Momentum', icon: '⚡', role: 'COMBO BRAWLER', hasHeal: false, kTag: 'SPIN RUSH',
    desc: 'Consecutive hits stack up to 5x (+30% attack speed & +25% whip/spin damage) while staying on offense!',
    howToUse: 'Keep landing [J] whips & [K] Spin Dash within 4.5s to maintain max Wild Momentum speed!',
    bars: { offense: 4, defense: 3, support: 1, speed: 4 }
  },
  pearl: {
    name: 'Flawless Technique', icon: '💎', role: 'PRECISION DUELIST', hasHeal: false, kTag: 'SPEAR BEAM',
    desc: 'Every 3rd [J] strike is a guaranteed 1.6x Precision Crit that cuts [K]/[L] cooldowns by 0.6s!',
    howToUse: 'Weave fast 3-hit [J] spear pokes to trigger Precision Crits and reset your Holo-Pearl [L] faster.',
    bars: { offense: 4, defense: 2, support: 2, speed: 5 }
  },
  bismuth: {
    name: 'Forge Temper', icon: '🔥', role: 'ARMORED BREAKER', hasHeal: false, kTag: 'LEAP SLAM',
    desc: 'Permanent -20% incoming damage forge armor & every 3rd [J] strike triggers an explosive Molten Burn!',
    howToUse: 'Trade blows with your armored swings and crash into groups with [K] Molten Hammer Leap!',
    bars: { offense: 5, defense: 5, support: 1, speed: 2 }
  },
  peridot: {
    name: 'Ferrokinetic Orbit', icon: '🧲', role: 'TECH CONTROLLER', hasHeal: false, kTag: 'METAL SALVO',
    desc: '2 levitating steel shards constantly orbit Peridot and automatically zap any enemies that get close!',
    howToUse: 'Zone foes with [K] Homing Scrap & [L] Robonoid while orbiting shards shred rushers automatically.',
    bars: { offense: 3, defense: 4, support: 3, speed: 3 }
  },
  lapis: {
    name: 'Hydro-Wing Glide', icon: '🌊', role: 'AERIAL ZONER', hasHeal: false, kTag: 'HYDRO CHAIN',
    desc: 'Hold Jump midair to glide smoothly on water wings and deal +25% bonus airborne damage!',
    howToUse: 'Jump + hold [W]/[Space] to hover over ground attacks and rain boosted aerial slashes & [K] Hydro Chains.',
    bars: { offense: 4, defense: 2, support: 2, speed: 5 }
  },
  rose: {
    name: 'Maternal Sanctuary', icon: '🌹', role: 'PALADIN / HEALER', hasHeal: true, kTag: 'SHIELD & HEAL',
    desc: 'Periodically drifts healing petals to herself & 2P ally, plus finishing a 4-hit [J] combo heals +1 Heart!',
    howToUse: 'Complete full 3-hit [J] Paladin combos to heal, and press [L] Sacred Tears (+2 Hearts) in emergencies.',
    bars: { offense: 2, defense: 5, support: 5, speed: 3 }
  },
  connie: {
    name: "Knight's Riposte", icon: '⚔️', role: 'SPEED SWORDMASTER', hasHeal: false, kTag: 'IAI DASH CUT',
    desc: 'Dodging [Shift] or finishing a 5-hit [J] combo triggers +35% Riposte DMG & +25% movement speed for 2.8s.',
    howToUse: 'Dodge through enemy swings, then blitz back in with [K] Sword Iai-Lunge and 5-hit [J] Iaido chains.',
    bars: { offense: 4, defense: 2, support: 1, speed: 5 }
  },
  jasper: {
    name: 'Apex Quartz', icon: '☄️', role: 'APEX JUGGERNAUT', hasHeal: false, kTag: 'HELMET RUSH',
    desc: 'Unflinching Super Armor during attacks & up to +35% Berserker damage as her HP gets lower.',
    howToUse: 'Plow straight through attacks with 3-hit [J] Armored Ram combos and [K] Crash Helmet Bull-Rush.',
    bars: { offense: 5, defense: 4, support: 1, speed: 3 }
  }
};

// Truly differentiated per-Guardian fighting styles (3-hit, 4-hit, and 5-hit martial identities)
const HERO_COMBO_PROFILES = {
  steven: {
    label: 'Shield-Guard Brawler (3-Hit)',
    style: 'guardBrawler',
    cadence: [0.20, 0.21, 0.30],
    damage: [1.0, 1.24, 1.72],
    range: [4, 10, 18],
    knock: [0.95, 1.25, 1.68],
    lunge: [95, 140, 185],
    guard: [0.18, 0.24, 0.22],
    hop: [0, 0, -145],
    moves: ['Shield-Rim Jab', 'Guarded Bubble Bash', 'PINK BUBBLE POP!'],
    finisher: { label: 'PINK DIAMOND PULSE!', type: 'comboRosePulse', damage: 22, width: 155, height: 100, speed: 350, knockX: 340, knockY: -200, color: '#ff6097' }
  },
  garnet: {
    label: 'Orthodox Power Boxer (4-Hit)',
    style: 'boxer',
    cadence: [0.18, 0.17, 0.22, 0.35],
    damage: [1.08, 1.22, 1.48, 1.95],
    range: [0, 4, 8, 16],
    knock: [1.05, 1.18, 1.52, 1.90],
    lunge: [120, 155, 195, 260],
    hop: [0, 0, -210, 0],
    moves: ['Ruby Straight Jab', 'Sapphire Cross Hook', 'Shoryu Uppercut!', 'TWIN GAUNTLET METEOR!'],
    finisher: { label: 'GAUNTLET METEOR!', type: 'comboGauntletQuake', damage: 25, width: 190, height: 82, speed: 300, knockX: 430, knockY: -285, color: '#ef4444' }
  },
  amethyst: {
    label: 'Wild Whip-Acrobat (5-Hit)',
    style: 'whipAcrobat',
    cadence: [0.13, 0.12, 0.13, 0.16, 0.26],
    damage: [0.82, 0.92, 1.05, 1.26, 1.68],
    range: [18, 26, 30, 26, 34],
    knock: [0.65, 0.55, 0.55, 1.15, 1.55],
    lunge: [85, 105, 115, 175, 205],
    pull: [false, true, true, false, false],
    hop: [0, 0, 0, -185, 0],
    moves: ['Whip Snap', 'Lash Snare', 'Whip Yank-In', 'Cartwheel Heel Kick!', 'WHIP CYCLONE!'],
    finisher: { label: 'WHIP CYCLONE!', type: 'comboWhipCyclone', damage: 20, width: 185, height: 110, speed: 270, knockX: 310, knockY: -210, color: '#c084fc' }
  },
  pearl: {
    label: 'Ballet Spear Fencer (4-Hit)',
    style: 'fencer',
    cadence: [0.11, 0.10, 0.15, 0.24],
    damage: [0.88, 0.98, 1.26, 1.68],
    range: [18, 22, 26, 34],
    knock: [0.72, 0.78, 1.12, 1.48],
    lunge: [130, 155, 190, 230],
    hop: [0, 0, -230, 0],
    lift: [0, 0, -240, 0],
    moves: ['En-Garde Foil', 'Glissade Double Poke', 'Pirouette Vault!', 'RIBBON SPEAR FLURRY!'],
    finisher: { label: 'SPEAR FLURRY!', type: 'comboSpearFlurry', count: 3, spread: 24, radius: 14, damage: 13, speed: 460, knockX: 280, knockY: -155, color: '#22d3ee' }
  },
  bismuth: {
    label: 'Heavy Forge Shapeshifter (3-Hit)',
    style: 'heavyForge',
    cadence: [0.27, 0.29, 0.43],
    damage: [1.30, 1.58, 2.28],
    range: [6, 12, 20],
    knock: [1.28, 1.55, 2.15],
    lunge: [105, 155, 255],
    armorBreak: [false, true, true],
    moves: ['Forge Warhammer', 'Battle-Axe Armor Break!', 'MOLTEN ANVIL SHATTER!'],
    finisher: { label: 'MOLTEN ANVIL SHATTER!', type: 'comboAnvilEcho', damage: 30, width: 210, height: 95, speed: 280, knockX: 470, knockY: -310, color: '#f97316' }
  },
  peridot: {
    label: 'Ferrokinetic Scrapper (3-Hit)',
    style: 'ferroZoner',
    cadence: [0.17, 0.17, 0.27],
    damage: [1.0, 1.18, 1.62],
    range: [24, 30, 38],
    knock: [0.82, 1.0, 1.42],
    lunge: [55, 85, -145],
    hop: [0, 0, -155],
    moves: ['Hovering Steel Claw', 'I-Beam Magnet Sweep', 'BACKSTEP JAW BURST!'],
    finisher: { label: 'MAGNETIC BURST!', type: 'comboMagneticBurst', damage: 20, width: 175, height: 130, speed: 290, knockX: 260, knockY: -215, color: '#84cc16' }
  },
  lapis: {
    label: 'Aerial Hydro-Weaver (4-Hit)',
    style: 'hydroWeaver',
    cadence: [0.15, 0.15, 0.18, 0.27],
    damage: [1.0, 1.14, 1.36, 1.72],
    range: [18, 24, 28, 36],
    knock: [0.85, 0.95, 1.25, 1.55],
    lunge: [85, 110, 145, 195],
    hop: [0, 0, -195, 0],
    lift: [0, 0, -285, -240],
    moves: ['Hydro-Scythe Arc', 'Riptide Undercurrent', 'Rising Water Geyser!', 'OCEAN DRAGON LASH!'],
    finisher: { label: 'TIDAL LASH!', type: 'comboTidalLash', damage: 22, width: 195, height: 105, speed: 360, knockX: 360, knockY: -245, color: '#38bdf8' }
  },
  rose: {
    label: 'Noble Paladin (3-Hit)',
    style: 'paladin',
    cadence: [0.22, 0.23, 0.34],
    damage: [1.12, 1.32, 1.85],
    range: [8, 12, 24],
    knock: [1.08, 1.30, 1.75],
    lunge: [100, 150, 220],
    guard: [0, 0.25, 0.22],
    moves: ['Broadsword Cleave', 'Advancing Shield Bash', 'SANCTUARY PETAL SPIRAL!'],
    finisher: { label: 'ROSE SANCTUARY!', type: 'comboRoseThorn', damage: 24, width: 195, height: 105, speed: 320, knockX: 365, knockY: -225, color: '#f43f5e' }
  },
  connie: {
    label: 'Lightning Iaido Swordmaster (5-Hit)',
    style: 'iaido',
    cadence: [0.10, 0.10, 0.12, 0.14, 0.24],
    damage: [0.80, 0.90, 1.05, 1.28, 1.78],
    range: [12, 16, 20, 24, 34],
    knock: [0.68, 0.72, 0.85, 1.15, 1.58],
    lunge: [135, 155, 175, 210, 265],
    hop: [0, 0, 0, -190, 0],
    moves: ['Quick-Draw Cut', 'Reverse Flash', 'Step-In Cross', 'Vaulting Crescent!', 'HELM-SPLITTER!'],
    finisher: { label: 'HELM-SPLITTER!', type: 'comboCrescentSlash', damage: 22, width: 190, height: 88, speed: 480, knockX: 335, knockY: -200, color: '#ec4899' }
  },
  jasper: {
    label: 'Brutal Beta Juggernaut (3-Hit)',
    style: 'juggernaut',
    cadence: [0.25, 0.26, 0.42],
    damage: [1.34, 1.62, 2.34],
    range: [6, 12, 20],
    knock: [1.32, 1.65, 2.25],
    lunge: [145, 230, 295],
    superArmor: [true, true, true],
    moves: ['Crushing Haymaker', 'Armored Shoulder Tackle!', 'SEISMIC HELMET CRASH!'],
    finisher: { label: 'SEISMIC CRASH!', type: 'comboSeismicSlam', damage: 32, width: 220, height: 88, speed: 295, knockX: 510, knockY: -335, color: '#ea580c' }
  }
};

// Distinct signature 4-hit combos for all 9 Crystal Gem Fusions
const FUSION_COMBO_PROFILES = {
  stevonnie: {
    label: 'Sword-Shield Dance',
    cadence: [0.18, 0.17, 0.21, 0.30],
    damage: [1.0, 1.15, 1.38, 1.78],
    range: [8, 14, 20, 28],
    knock: [0.95, 1.1, 1.35, 1.7],
    lunge: [120, 155, 195, 250],
    moves: ['Shield Jab', 'Acrobatic Low Kick', 'Rose Blade Launcher', 'DUAL STARBURST SLASH!'],
    finisher: { label: 'STARBURST WAVE!', type: 'comboSwordStarWave', damage: 28, width: 190, height: 95, speed: 440, knockX: 380, knockY: -220, color: '#ec4899' }
  },
  smoky: {
    label: 'Triple Yo-Yo Cyclone',
    cadence: [0.18, 0.17, 0.20, 0.29],
    damage: [1.0, 1.14, 1.35, 1.75],
    range: [14, 20, 26, 34],
    knock: [0.95, 1.05, 1.3, 1.65],
    lunge: [95, 130, 155, 195],
    moves: ['Yo-Yo Snap', 'Cross-String Whip', 'Low Hurricane Spin', 'STAR YO-YO TEMPEST!'],
    finisher: { label: 'YO-YO TEMPEST!', type: 'comboYoYoStar', count: 2, spread: 26, radius: 22, damage: 20, speed: 560, knockX: 350, knockY: -200, color: '#a855f7' }
  },
  rainbow2: {
    label: 'Parasol Showtime',
    cadence: [0.16, 0.15, 0.19, 0.27],
    damage: [0.98, 1.12, 1.34, 1.72],
    range: [10, 16, 22, 30],
    knock: [0.9, 1.02, 1.28, 1.6],
    lunge: [110, 140, 175, 220],
    moves: ['Umbrella Tip Thrust', 'Dancing Boot Kick', 'Prism Baton Twirl', 'RAINBOW STAR BEAM!'],
    finisher: { label: 'PRISM STAR BEAM!', type: 'comboPrismBeam', count: 3, spread: 24, radius: 16, damage: 15, speed: 540, knockX: 310, knockY: -180, color: '#38bdf8' }
  },
  sunstone: {
    label: 'Solar Varsity Beatdown',
    cadence: [0.21, 0.19, 0.23, 0.34],
    damage: [1.06, 1.2, 1.44, 1.88],
    range: [4, 8, 14, 20],
    knock: [1.1, 1.22, 1.5, 1.9],
    lunge: [115, 155, 205, 270],
    moves: ['Double Palm Strike', 'Burning Low Sweep', 'Suplex Piston Upper!', 'SOLAR FLARE SLAM!'],
    finisher: { label: 'SOLAR FLARE!', type: 'comboSolarWave', damage: 32, width: 200, height: 105, speed: 360, knockX: 430, knockY: -260, color: '#ea580c' }
  },
  sugilite: {
    label: 'Flail Wrecking Rampage',
    cadence: [0.25, 0.24, 0.28, 0.40],
    damage: [1.15, 1.32, 1.58, 2.08],
    range: [12, 18, 24, 34],
    knock: [1.2, 1.38, 1.7, 2.15],
    lunge: [115, 160, 210, 275],
    moves: ['Heavy Plumb Jab', 'Quad-Arm Backhand', 'Overhead Crushing Drop', 'SEISMIC FLAIL BREAKER!'],
    finisher: { label: 'FLAIL BREAKER!', type: 'comboFlailQuake', damage: 38, width: 230, height: 110, speed: 310, knockX: 520, knockY: -330, color: '#9333ea' }
  },
  sardonyx: {
    label: 'Showtime Hammer Waltz',
    cadence: [0.22, 0.20, 0.24, 0.35],
    damage: [1.05, 1.22, 1.45, 1.9],
    range: [8, 14, 22, 30],
    knock: [1.05, 1.2, 1.45, 1.85],
    lunge: [105, 145, 185, 240],
    moves: ['Gentleman Cane Poke', 'Pirouette Hammer Spin', 'Tuxedo Uppercut', 'SHOWSTOPPER GRAND SLAM!'],
    finisher: { label: 'SHOWSTOPPER!', type: 'comboShowtimeWave', damage: 32, width: 210, height: 105, speed: 370, knockX: 440, knockY: -260, color: '#fb7185' }
  },
  opal: {
    label: 'Celestial Longbow Art',
    cadence: [0.16, 0.15, 0.19, 0.27],
    damage: [0.95, 1.1, 1.35, 1.85],
    range: [20, 24, 28, 36],
    knock: [0.85, 0.95, 1.2, 1.55],
    lunge: [60, 80, -110, 95],
    moves: ['Swift Star Arrow', 'Twin Spread Volley', 'Vaulting Backstep Snipe', 'STARLIGHT GREAT-ARROW!'],
    finisher: null
  },
  malachite: {
    label: 'Abyssal 6-Limb Maul',
    cadence: [0.22, 0.21, 0.25, 0.36],
    damage: [1.1, 1.26, 1.52, 1.98],
    range: [10, 16, 22, 30],
    knock: [1.1, 1.28, 1.55, 1.95],
    lunge: [120, 165, 210, 275],
    moves: ['Claw Rending Slash', 'Four-Hand Ground Sweep', 'Glacial Fang Uppercut', 'GLACIAL SPIRE CRUSH!'],
    finisher: { label: 'GLACIAL SPIRE!', type: 'comboGlacialClaw', damage: 36, width: 210, height: 120, speed: 340, knockX: 460, knockY: -290, color: '#2dd4bf' }
  },
  rainbowClassic: {
    label: '80s Prism Grace',
    cadence: [0.17, 0.16, 0.20, 0.28],
    damage: [1.0, 1.15, 1.38, 1.78],
    range: [8, 14, 20, 28],
    knock: [0.95, 1.1, 1.35, 1.72],
    lunge: [110, 145, 180, 230],
    moves: ['Ribbon Palm Thrust', 'Pirouette High Kick', 'Prism Veil Spin', 'PRISMATIC ROSE FINALE!'],
    finisher: { label: 'PRISM VEIL!', type: 'comboRainbowVeil', damage: 30, width: 195, height: 105, speed: 410, knockX: 390, knockY: -230, color: '#f43f5e' }
  }
};

// Default Fusion fallback chain
const FUSION_COMBO_PROFILE = {
  label: 'Fusion Resonance Chain',
  cadence: [0.20, 0.19, 0.23, 0.33],
  damage: [1.0, 1.15, 1.4, 1.8],
  knock: [1.0, 1.15, 1.4, 1.75],
  lunge: [105, 140, 180, 240],
  moves: ['Synergy Strike', 'Resonance Hook', 'Prism Launcher', 'HARMONY FINISHER!']
};

// Per-fusion power identity: Sugilite hits hardest but shortest, Sardonyx lasts
// longest, Malachite trades the heal for raw damage (canon: an unstable fusion).
const FUSION_POWER = {
  stevonnie: { nuke: 1.0, duration: 12.0, heal: 1, title: 'SWORD & SHIELD' },
  smoky: { nuke: 1.05, duration: 12.0, heal: 1, title: 'YO-YO TEMPEST' },
  rainbow2: { nuke: 0.95, duration: 12.5, heal: 1, title: 'PARASOL PRISM' },
  sunstone: { nuke: 1.05, duration: 12.0, heal: 1, title: 'SOLAR GAUNTLET' },
  sugilite: { nuke: 1.25, duration: 11.5, heal: 1, title: 'FLAIL CATACLYSM' },
  sardonyx: { nuke: 1.0, duration: 12.8, heal: 1, title: 'SHOWSTOPPER' },
  opal: { nuke: 0.95, duration: 12.2, heal: 1, title: 'ARROW RAIN' },
  malachite: { nuke: 1.3, duration: 11.5, heal: 0, title: 'GLACIAL TIDE' },
  rainbowClassic: { nuke: 1.0, duration: 12.2, heal: 1, title: 'ROSE MANDALA' }
};

