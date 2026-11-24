const EPISODE_WAVES = {
  1: {
    waves: [
      { enemies: ['centipeetle', 'centipeetle', 'centipeetle', 'centipeetle'] },
      { enemies: ['winged_centipeetle', 'acid_centipeetle', 'centipeetle', 'winged_centipeetle', 'centipeetle'] },
      { enemies: ['winged_centipeetle', 'acid_centipeetle', 'acid_centipeetle', 'centipeetle', 'centipeetle', 'winged_centipeetle'] },
      { isHugeWave: true, enemies: ['winged_centipeetle', 'winged_centipeetle', 'acid_centipeetle', 'acid_centipeetle', 'centipeetle', 'centipeetle', 'centipeetle', 'centipeetle'] }
    ],
    boss: 'boss_spitter',
    bossName: 'MOTHER CENTIPEETLE'
  },
  2: {
    waves: [
      { enemies: ['blade_quartz', 'blade_quartz', 'ice_monster', 'blade_quartz'] },
      { enemies: ['spire_harpy', 'blade_quartz', 'ice_monster', 'spire_harpy', 'blade_quartz'] },
      { enemies: ['spire_harpy', 'spire_harpy', 'blade_quartz', 'ice_monster', 'blade_quartz', 'spire_harpy'] },
      { isHugeWave: true, enemies: ['spire_harpy', 'spire_harpy', 'blade_quartz', 'blade_quartz', 'ice_monster', 'ice_monster', 'blade_quartz'] }
    ],
    boss: 'boss_ice_guardian',
    bossName: 'ANCIENT SPIRE GIANT BIRD'
  },
  3: {
    waves: [
      { enemies: ['cluster', 'cluster', 'blade_quartz', 'cluster'] },
      { enemies: ['cluster', 'blade_quartz', 'cluster', 'blade_quartz', 'cluster'] },
      { enemies: ['cluster', 'cluster', 'blade_quartz', 'blade_quartz', 'cluster', 'cluster'] },
      { isHugeWave: true, enemies: ['cluster', 'cluster', 'cluster', 'blade_quartz', 'blade_quartz', 'blade_quartz', 'cluster', 'cluster'] }
    ],
    boss: 'boss_cluster_titan',
    bossName: 'KINDERGARTEN AMALGAM TITAN'
  },
  4: {
    waves: [
      { enemies: ['cluster', 'cluster', 'acid_centipeetle', 'cluster'] },
      { enemies: ['volcanic_firebird', 'cluster', 'acid_centipeetle', 'volcanic_firebird', 'cluster'] },
      { enemies: ['volcanic_firebird', 'cluster', 'cluster', 'acid_centipeetle', 'cluster', 'volcanic_firebird'] },
      { isHugeWave: true, enemies: ['volcanic_firebird', 'volcanic_firebird', 'cluster', 'cluster', 'acid_centipeetle', 'cluster', 'cluster'] }
    ],
    boss: 'boss_cluster_core',
    bossName: 'GEO-WEAPON CLUSTER CORE'
  },
  5: {
    waves: [
      { enemies: ['forge_automaton', 'forge_automaton', 'blade_quartz', 'forge_automaton'] },
      { enemies: ['forge_automaton', 'blade_quartz', 'destabilizer_soldier', 'forge_automaton', 'blade_quartz'] },
      { enemies: ['destabilizer_soldier', 'forge_automaton', 'blade_quartz', 'destabilizer_soldier', 'forge_automaton'] },
      { isHugeWave: true, enemies: ['forge_automaton', 'forge_automaton', 'destabilizer_soldier', 'destabilizer_soldier', 'blade_quartz', 'blade_quartz', 'forge_automaton'] }
    ],
    boss: 'boss_forge_guardian',
    bossName: 'ANCIENT FORGE SENTINEL'
  },
  6: {
    waves: [
      { enemies: ['ice_monster', 'ice_monster', 'blade_quartz', 'ice_monster'] },
      { enemies: ['ice_gargoyle', 'ice_monster', 'blade_quartz', 'ice_gargoyle', 'ice_monster'] },
      { enemies: ['ice_gargoyle', 'ice_monster', 'blade_quartz', 'ice_gargoyle', 'blade_quartz', 'ice_monster'] },
      { isHugeWave: true, enemies: ['ice_gargoyle', 'ice_gargoyle', 'ice_monster', 'ice_monster', 'blade_quartz', 'blade_quartz', 'ice_monster'] }
    ],
    boss: 'boss_jasper',
    bossName: 'CORRUPTED JASPER & SNOW TITAN'
  },
  7: {
    waves: [
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'blade_quartz', 'robonoid_scout'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'blade_quartz'] },
      { isHugeWave: true, enemies: ['robonoid_scout', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'destabilizer_soldier', 'blade_quartz'] }
    ],
    boss: 'boss_agate_warden',
    bossName: 'HOLY BLUE AGATE WARDEN'
  },
  8: {
    waves: [
      { enemies: ['destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'robonoid_scout'] },
      { enemies: ['destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier'] },
      { isHugeWave: true, enemies: ['destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier'] }
    ],
    boss: 'boss_topaz_fusion',
    bossName: 'FUSED TOPAZ ENFORCER'
  },
  9: {
    waves: [
      { enemies: ['destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'robonoid_scout'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'blade_quartz'] },
      { isHugeWave: true, enemies: ['robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'robonoid_scout'] }
    ],
    boss: 'boss_robonoid_titan',
    bossName: 'ROBONOID HUNTER COLOSSUS'
  },
  10: {
    waves: [
      { enemies: ['destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'blade_quartz'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier'] },
      { isHugeWave: true, enemies: ['robonoid_scout', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'destabilizer_soldier', 'blade_quartz', 'blade_quartz'] }
    ],
    boss: 'boss_white_diamond',
    bossName: 'WHITE DIAMOND SUPREME MECHA'
  }
};

// ============================================================================
// 5. AUTHENTIC CORRUPTED GEMS & MONSTER MANAGER
// ============================================================================
// ============================================================================
// FREEBUFF ENEMY AI — readable telegraphs, spacing roles and attack slots
// ============================================================================
// Ranged = units that genuinely fight from beyond melee reach (ground spitters, aerial monsters).
// Brawlers (centipeetles, robonoids, destabilizer lancers) press in like in the original, keeping acid as a close-range bonus shot.
const ENEMY_RANGED_TYPES = new Set([
  'ice_monster',
  'winged_centipeetle', 'spire_harpy', 'volcanic_firebird', 'ice_gargoyle',
  'boss_spitter', 'boss_cluster_titan', 'boss_ice_guardian',
  'boss_cluster_core', 'boss_topaz_fusion'
]);

// Per-type preferred standoff distance (px). Brawlers sit inside the player's attack reach.
const ENEMY_PREFERRED_RANGE = {
  centipeetle: 48,
  acid_centipeetle: 48,
  robonoid_scout: 46,
  destabilizer_soldier: 48,
  blade_quartz: 50,
  cluster: 46,
  ice_monster: 105,
  winged_centipeetle: 130,
  spire_harpy: 140,
  volcanic_firebird: 140,
  ice_gargoyle: 120
};

const ENEMY_TELEGRAPH_BASE = {
  centipeetle: 0.46,
  acid_centipeetle: 0.44,
  blade_quartz: 0.52,
  cluster: 0.42,
  ice_monster: 0.48,
  robonoid_scout: 0.40,
  destabilizer_soldier: 0.44,
  winged_centipeetle: 0.42,
  spire_harpy: 0.40,
  volcanic_firebird: 0.44,
  ice_gargoyle: 0.46,
  forge_automaton: 0.58
};

class EnemyManager {
  constructor(groundY, stageWidth = 2600) {
    this.groundY = (typeof groundY === 'number' && !isNaN(groundY) && groundY > 0) ? groundY : 600;
    this.stageWidth = stageWidth;
    this.enemies = [];
    this.droppedGems = [];
    this.wave = 1;
    this.maxWaves = 4;
    this.waveState = 'active';
    this.spawnTimer = 0;
    this.isBossAlive = false;
    this.bossDefeated = false;
    this.pickupsRef = null;
    this.dropRate = 0.38;
    this.hpMult = 1.0;
    this.speedMult = 1.0;

    // Freebuff AI/difficulty knobs (populated by reset from DIFFICULTY_CONFIG)
    this.stageHpScale = 1.0;
    this.telegraphMult = 1.0;
    this.maxAttackers = 2;
    this.evasionChance = 0;
    this.aiUnpredictability = 0;
    this.eliteChance = 0;
    this.aggression = 1.0;

    // Plants vs Zombies Wave Progression Trackers
    this.stageIndex = 1;
    this.totalStageEnemies = 20;
    this.enemiesDefeatedInStage = 0;
    this.waveQueue = [];
    this.waveTimer = 0;

    // Offscreen scratch canvas for silhouette-masked hit flash & poofing
    this.flashCanvas = null;
    this.flashCtx = null;
    if (typeof document !== 'undefined') {
      try {
        this.flashCanvas = document.createElement('canvas');
        this.flashCanvas.width = 640;
        this.flashCanvas.height = 640;
        this.flashCtx = this.flashCanvas.getContext('2d');
      } catch (err) {
        this.flashCanvas = null;
        this.flashCtx = null;
      }
    }
  }

  reset(stageIndex, difficultyConfig = null, pickupsRef = null) {
    this.stageIndex = stageIndex;
    this.enemies = [];
    this.droppedGems = [];
    this.wave = 1;
    this.maxWaves = 4;
    this.waveState = 'active';
    this.spawnTimer = 0;
    this.isBossAlive = false;
    this.bossDefeated = false;
    this.pickupsRef = pickupsRef;
    this.enemiesDefeatedInStage = 0;

    if (difficultyConfig) {
      this.dropRate = difficultyConfig.cookieDropRate ?? difficultyConfig.dropRate ?? 0.38;
      this.hpMult = difficultyConfig.enemyHpMultiplier ?? difficultyConfig.enemyHpMult ?? 1.0;
      this.speedMult = difficultyConfig.enemySpeedMult || 1.0;

      // Freebuff difficulty dimensions beyond raw HP/speed
      this.telegraphMult = difficultyConfig.enemyTelegraphMult ?? 1.0;
      this.maxAttackers = difficultyConfig.maxConcurrentAttackers ?? 2;
      this.evasionChance = difficultyConfig.enemyEvasion ?? 0;
      this.aiUnpredictability = difficultyConfig.aiUnpredictability ?? 0;
      this.eliteChance = difficultyConfig.eliteChance ?? 0;
      this.aggression = difficultyConfig.enemyAggression ?? 1.0;

      // Escalation knobs added with the harder difficulty pass
      this.cooldownMult = difficultyConfig.attackCooldownMult ?? 1.0;
      this.waveBonus = difficultyConfig.waveSizeBonus ?? 0;
      this.bossHpMult = difficultyConfig.bossHpMult ?? 1.0;
      this.eliteHpMult = difficultyConfig.eliteHpMult ?? 1.6;
      this.stageHeal = difficultyConfig.stageHeal ?? -1;
      this.knockbackResist = difficultyConfig.knockbackResist ?? 0;
    }
    // Later episodes quietly raise enemy durability so the curve keeps climbing
    this.stageHpScale = 1 + Math.max(0, stageIndex - 1) * 0.035;

    if (stageIndex > 0 && EPISODE_WAVES[stageIndex]) {
      const epData = EPISODE_WAVES[stageIndex];
      let totalEnemies = 1; // plus boss
      epData.waves.forEach(w => { totalEnemies += w.enemies.length; });
      this.totalStageEnemies = totalEnemies;
    } else {
      this.totalStageEnemies = 1;
    }
  }

  getProgressPercent() {
    if (this.stageIndex === 0) return 100;
    if (this.totalStageEnemies <= 0) return 0;
    return Math.min(100, Math.round((this.enemiesDefeatedInStage / this.totalStageEnemies) * 100));
  }

  spawnDummy(x = 1300) {
    this.enemies = [{
      type: 'boss_jasper_dummy',
      name: 'HOLO-JASPER (TRAINING DUMMY)',
      x,
      y: this.groundY,
      vx: 0,
      vy: 0,
      facing: -1,
      width: 92,
      height: 112,
      visualScale: 1.28,
      hp: 99999,
      maxHp: 99999,
      speed: 0,
      attackCooldown: 9999,
      attackTimer: 0,
      hurtTimer: 0,
      isBoss: true,
      isImmortalDummy: true,
      gemColor: '#f97316',
      gemShape: 'jasper_nose',
      animTime: 0
    }];
    this.isBossAlive = true;
    this.bossDefeated = false;
  }

  spawnEnemy(type, x = 1200, customY = null) {
    const isBoss = type.startsWith('boss_');
    const isFlyer = (type.includes('wing') || type.includes('harpy') || type.includes('bird') || type.includes('gargoyle') || type.includes('scout') || type.includes('drone') || type === 'boss_giant_bird' || type === 'boss_cluster_core' || type === 'boss_white_diamond');
    const isJumper = (type === 'cluster' || type === 'blade_quartz' || type === 'acid_centipeetle' || type === 'snow_monster' || type === 'carnelian_enforcer' || type === 'boss_jasper' || type === 'boss_cluster_titan');

    const movementType = isFlyer ? 'fly' : (isJumper ? 'jump' : 'walk');
    const initialY = customY !== null ? customY : (isFlyer ? (210 + Math.random() * 80) : this.groundY);

    const enemy = {
      type,
      x,
      y: initialY,
      vx: 0,
      vy: 0,
      facing: -1,
      width: 72,
      height: 78,
      visualScale: 1.48,
      hp: 50,
      maxHp: 50,
      speed: 120,
      attackCooldown: 1.6,
      attackTimer: 0,
      hurtTimer: 0,
      movementType,
      isBoss,
      spawnAnimTimer: isBoss ? 0.92 : 0.52,
      maxSpawnAnim: isBoss ? 0.92 : 0.52,
      flyAltitude: isFlyer ? initialY : null,
      jumpCooldown: isJumper ? (1.5 + Math.random() * 1.5) : null,
      feintCooldown: 1.0 + Math.random() * 1.5,
      burstTimer: 0,
      diveTimer: 0,
      isFrenzied: false,
      name: 'Corrupted Gem',
      animTime: Math.random() * 10
    };

    if (type === 'centipeetle') {
      enemy.hp = Math.round(50 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(130 * this.speedMult);
      enemy.width = 76;
      enemy.height = 76;
      enemy.visualScale = 1.50;
      enemy.gemColor = '#22c55e';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Centipeetle Hatchling';
    } else if (type === 'acid_centipeetle') {
      enemy.hp = Math.round(45 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(140 * this.speedMult);
      enemy.width = 76;
      enemy.height = 78;
      enemy.visualScale = 1.52;
      enemy.gemColor = '#4ade80';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Acid Centipeetle';
    } else if (type === 'blade_quartz') {
      enemy.hp = Math.round(90 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(95 * this.speedMult);
      enemy.width = 88;
      enemy.height = 86;
      enemy.visualScale = 1.42;
      enemy.gemColor = '#f43f5e';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Blade Quartz Beast';
    } else if (type === 'cluster') {
      enemy.hp = Math.round(65 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(120 * this.speedMult);
      enemy.width = 74;
      enemy.height = 74;
      enemy.visualScale = 1.58;
      enemy.gemColor = '#c084fc';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'Cluster Fusion Mutant';
    } else if (type === 'ice_monster') {
      enemy.hp = Math.round(85 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 82;
      enemy.height = 86;
      enemy.visualScale = 1.42;
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Ice Spire Puffer';
    } else if (type === 'boss_spitter') {
      enemy.hp = Math.round(350 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(95 * this.speedMult);
      enemy.width = 135;
      enemy.height = 128;
      enemy.visualScale = 1.38;
      enemy.gemColor = '#15803d';
      enemy.gemShape = 'centipeetle_mother';
      enemy.name = 'Alpha Centipeetle Leader';
      this.isBossAlive = true;
    } else if (type === 'boss_quartz_beast') {
      enemy.hp = Math.round(550 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(105 * this.speedMult);
      enemy.width = 165;
      enemy.height = 148;
      enemy.visualScale = 1.36;
      enemy.gemColor = '#0284c7';
      enemy.gemShape = 'ocean_jasper';
      enemy.name = 'Corrupted Quartz Titan';
      this.isBossAlive = true;
    } else if (type === 'boss_cluster_titan') {
      enemy.hp = Math.round(650 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(115 * this.speedMult);
      enemy.width = 148;
      enemy.height = 152;
      enemy.visualScale = 1.36;
      enemy.gemColor = '#9333ea';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'Kindergarten Amalgam Titan';
      this.isBossAlive = true;
    } else if (type === 'boss_ice_guardian') {
      enemy.hp = Math.round(750 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(110 * this.speedMult);
      enemy.width = 158;
      enemy.height = 160;
      enemy.visualScale = 1.35;
      enemy.gemColor = '#0284c7';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Ancient Spire Colossus';
      this.isBossAlive = true;
    } else if (type === 'boss_jasper') {
      enemy.hp = Math.round(1200 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(140 * this.speedMult);
      enemy.width = 136;
      enemy.height = 142;
      enemy.visualScale = 1.35;
      enemy.gemColor = '#ea580c';
      enemy.gemShape = 'jasper_diamond';
      enemy.name = 'CORRUPTED JASPER & SNOW TITAN';
      this.isBossAlive = true;
    } else if (type === 'boss_cluster_core') {
      enemy.hp = Math.round(850 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(85 * this.speedMult);
      enemy.width = 148;
      enemy.height = 148;
      enemy.visualScale = 1.34;
      enemy.gemColor = '#c084fc';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'GEO-WEAPON CLUSTER CORE';
      this.isBossAlive = true;
    } else if (type === 'boss_forge_guardian') {
      enemy.hp = Math.round(950 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 150;
      enemy.height = 150;
      enemy.visualScale = 1.34;
      enemy.gemColor = '#ea580c';
      enemy.gemShape = 'teardrop';
      enemy.name = 'ANCIENT FORGE SENTINEL';
      this.isBossAlive = true;
    } else if (type === 'boss_agate_warden') {
      enemy.hp = Math.round(1050 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(115 * this.speedMult);
      enemy.width = 124;
      enemy.height = 138;
      enemy.visualScale = 1.32;
      enemy.gemColor = '#0284c7';
      enemy.gemShape = 'ocean_jasper';
      enemy.name = 'HOLY BLUE AGATE WARDEN';
      this.isBossAlive = true;
    } else if (type === 'boss_topaz_fusion') {
      enemy.hp = Math.round(1200 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(95 * this.speedMult);
      enemy.width = 145;
      enemy.height = 152;
      enemy.visualScale = 1.32;
      enemy.gemColor = '#fbbf24';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'FUSED TOPAZ ENFORCER';
      this.isBossAlive = true;
    } else if (type === 'boss_robonoid_titan') {
      enemy.hp = Math.round(1350 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 155;
      enemy.height = 152;
      enemy.visualScale = 1.34;
      enemy.gemColor = '#10b981';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'ROBONOID HUNTER COLOSSUS';
      this.isBossAlive = true;
    } else if (type === 'boss_white_diamond') {
      // Grand Climax Supreme Boss (Era 3 Healing & Peace)
      enemy.hp = Math.round(1800 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(85 * this.speedMult);
      enemy.width = 175;
      enemy.height = 195;
      enemy.visualScale = 1.40;
      enemy.gemColor = '#ffffff';
      enemy.gemShape = 'jasper_diamond';
      enemy.name = 'WHITE DIAMOND SUPREME MECHA';
      this.isBossAlive = true;
    } else if (type === 'robonoid_scout') {
      enemy.hp = Math.round(55 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(135 * this.speedMult);
      enemy.width = 68;
      enemy.height = 72;
      enemy.visualScale = 1.45;
      enemy.gemColor = '#84cc16';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Flask Robonoid Scout';
    } else if (type === 'forge_automaton') {
      enemy.hp = Math.round(75 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(110 * this.speedMult);
      enemy.width = 78;
      enemy.height = 84;
      enemy.visualScale = 1.42;
      enemy.gemColor = '#f97316';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Forge Automaton';
    } else if (type === 'destabilizer_soldier') {
      enemy.hp = Math.round(80 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(125 * this.speedMult);
      enemy.width = 74;
      enemy.height = 90;
      enemy.visualScale = 1.38;
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Destabilizer Guard';
    } else if (type === 'winged_centipeetle') {
      // Lore: Aerial winged spitters from Gem Glow
      enemy.hp = Math.round(45 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(145 * this.speedMult);
      enemy.width = 74;
      enemy.height = 70;
      enemy.visualScale = 1.48;
      enemy.gemColor = '#22c55e';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Winged Centipeetle';
    } else if (type === 'spire_harpy') {
      // Lore: Celestial Spire winged corrupted gem
      enemy.hp = Math.round(60 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(150 * this.speedMult);
      enemy.width = 80;
      enemy.height = 74;
      enemy.visualScale = 1.48;
      enemy.gemColor = '#06b6d4';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Spire Harpy';
    } else if (type === 'volcanic_firebird') {
      // Lore: Magma mantle flying corruption
      enemy.hp = Math.round(65 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(140 * this.speedMult);
      enemy.width = 78;
      enemy.height = 72;
      enemy.visualScale = 1.48;
      enemy.gemColor = '#f97316';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Volcanic Firebird';
    } else if (type === 'ice_gargoyle') {
      // Lore: Glacial northern tundra flying gargoyle
      enemy.hp = Math.round(70 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(135 * this.speedMult);
      enemy.width = 82;
      enemy.height = 78;
      enemy.visualScale = 1.48;
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Glacial Ice Gargoyle';
    }

    // --- Freebuff AI profile: combat role, telegraph length, elite & stage scaling ---
    const ranged = ENEMY_RANGED_TYPES.has(type);
    enemy.hasRanged = ranged;
    // Gem combat typing (drives the Pokémon-style damage chart)
    enemy.types = (ENEMY_TYPES[type] || ['dark']).slice();
    enemy.vulnMult = 1;
    enemy.vulnTimer = 0;

    // Standoff: per-type map first (brawler vs spitter/flyer), bosses command mid-arena & tower menacingly
    enemy.preferredRange = isBoss ? 110 : (ENEMY_PREFERRED_RANGE[type] ?? (ranged ? 95 : 48));
    enemy.attackRange = isBoss ? 640 : (ranged ? 300 : 150);
    enemy.attackCooldown = (isBoss ? 1.25 : (ranged ? 1.7 : 1.55)) * (this.cooldownMult || 1.0);
    enemy.windup = 0;
    enemy.windupMax = 0;
    enemy.aiState = 'approach';
    enemy.evasionCooldown = 0;
    enemy.isElite = false;
    enemy.phase2 = false;
    enemy.bossPatternLast = -1;
    enemy.bossDashCooldown = 0;

    // Towering Terrifying Boss Presence & Threat Multiplier
    if (isBoss && type !== 'boss_jasper_dummy') {
      enemy.visualScale = Math.max(1.72, (enemy.visualScale || 1.35) * 1.32);
      enemy.width = Math.round((enemy.width || 140) * 1.24);
      enemy.height = Math.round((enemy.height || 140) * 1.24);
      enemy.hp = Math.round(enemy.hp * 1.50);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round((enemy.speed || 100) * 1.18);
    }

    // Elite corrupted gems: rarer, gold-tinged, tougher versions at higher difficulty
    if (!isBoss && this.eliteChance > 0 && Math.random() < this.eliteChance * (1 + (this.wave - 1) * 0.12)) {
      enemy.isElite = true;
      const eliteMult = this.eliteHpMult || 1.6;
      enemy.hp = Math.round(enemy.hp * eliteMult);
      enemy.maxHp = Math.round(enemy.maxHp * eliteMult);
      enemy.speed = Math.round(enemy.speed * 1.08);
      enemy.name = `Elite ${enemy.name}`;
      enemy.gemColor = '#fbbf24';
    }

    // Difficulty tier boss durability
    if (isBoss && this.bossHpMult && this.bossHpMult !== 1) {
      enemy.hp = Math.round(enemy.hp * this.bossHpMult);
      enemy.maxHp = Math.round(enemy.maxHp * this.bossHpMult);
    }

    // Later episodes creep upward in durability (bosses scale at half rate)
    const hpScale = isBoss ? Math.min(1.22, this.stageHpScale || 1) : (this.stageHpScale || 1);
    if (hpScale !== 1) {
      enemy.hp = Math.round(enemy.hp * hpScale);
      enemy.maxHp = Math.round(enemy.maxHp * hpScale);
    }

    enemy.baseSpeed = enemy.speed;
    this.enemies.push(enemy);
    return enemy;
  }

  _computeCrowdTactics(idx, enemy, targetPlayer, pref) {
    let sepVx = 0;
    let crowdedSameSide = 0;
    for (let j = 0; j < this.enemies.length; j++) {
      if (j === idx) continue;
      const other = this.enemies[j];
      if (other.isPoofing || other.isPoofed) continue;
      const dOx = enemy.x - other.x;
      if (Math.abs(dOx) < 46 && Math.abs(enemy.y - other.y) < 52) {
        const sign = dOx !== 0 ? Math.sign(dOx) : (idx < j ? -1 : 1);
        sepVx += sign * (46 - Math.abs(dOx)) * 2.2;
      }
      if (!enemy.hasRanged && !enemy.isBoss && Math.sign(other.x - targetPlayer.x) === Math.sign(enemy.x - targetPlayer.x) && Math.abs(other.x - targetPlayer.x) < pref + 55) {
        crowdedSameSide++;
      }
    }
    return { sepVx, crowdedSameSide };
  }

  update(dt, player, audioEngine, particles, projectiles, onPoofed, platforms = [], player2 = null) {
    // Top-Center Boss Bar Synchronization (Cached DOM references for zero frame hitches)
    if (!this.domBoss && typeof document !== 'undefined') {
      this.domBoss = {
        hud: document.getElementById('bossHud'),
        name: document.getElementById('bossName'),
        digits: document.getElementById('bossHpDigits'),
        fill: document.getElementById('bossHpFill')
      };
    }
    const d = this.domBoss;
    const activeBoss = this.enemies.find(en => en.isBoss);

    if (activeBoss && d && d.hud) {
      if (d.hud.style.display !== 'flex') d.hud.style.display = 'flex';
      const curHp = activeBoss.hp;
      if (this._lastBossHp !== curHp || this._lastBossName !== activeBoss.name) {
        this._lastBossHp = curHp;
        this._lastBossName = activeBoss.name;
        if (d.name) d.name.textContent = activeBoss.name;
        if (d.digits) d.digits.textContent = activeBoss.isImmortalDummy ? 'INFINITE / INFINITE' : `${Math.max(0, Math.ceil(curHp))} / ${activeBoss.maxHp}`;
        if (d.fill) {
          const pct = activeBoss.isImmortalDummy ? 100 : Math.max(0, (curHp / activeBoss.maxHp) * 100);
          d.fill.style.width = `${pct}%`;
        }
      }
    } else if (d && d.hud && d.hud.style.display !== 'none') {
      d.hud.style.display = 'none';
      this._lastBossHp = null;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.isPoofed) {
        this.enemies.splice(i, 1);
        continue;
      }
      if (e.isPoofing) {
        e.poofTimer -= dt;
        e.vx *= 0.8;
        e.vy *= 0.8;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (e.poofTimer <= 0) {
          e.isPoofing = false;
          e.isPoofed = true;
          this.poofEnemy(e, i, particles, audioEngine, onPoofed);
          this.enemies.splice(i, 1);
        }
        continue;
      }
      // Failsafe: if any non-dummy enemy or Story/Arcade boss hits 0 HP via any path, ensure poof triggers cleanly
      if (!e.isImmortalDummy && !e.isPoofed && !e.isPoofing && e.hp <= 0) {
        e.hp = 0;
        e.invulnerableTimer = 0;
        e.breakoutBurstTimer = 0;
        e.isPoofing = true;
        e.poofTimer = 0.16;
        e.maxPoofTime = 0.16;
        continue;
      }
      e.animTime += dt;
      if (e.spawnAnimTimer && e.spawnAnimTimer > 0) {
        e.spawnAnimTimer = Math.max(0, e.spawnAnimTimer - dt);
        if (e.spawnAnimTimer <= 0 && particles) {
          particles.addSparkle(e.x, e.y - e.height * 0.45, e.gemColor || '#c084fc', e.isBoss ? 24 : 10, 5);
        }
        continue;
      }
      if (e.hurtTimer > 0) e.hurtTimer -= dt;

      // --- GEM COMBAT TYPE STATUSES ----------------------------------------
      if (e.vulnTimer > 0) { e.vulnTimer -= dt; if (e.vulnTimer <= 0) e.vulnMult = 1; }
      if (e.charmTimer > 0) e.charmTimer -= dt;
      if (e.dazeTimer > 0) { e.dazeTimer -= dt; e.windup = 0; }
      if (e.stunTimer > 0) {
        e.stunTimer -= dt;
        e.hurtTimer = Math.max(e.hurtTimer, 0.16);
        e.vx *= 0.85;
        if (e.stunTimer <= 0) e.attackTimer = 0;
      }
      // Lapis waterlogging: a soaked corruption moves at 72% speed while it dries
      if (e.soakTimer > 0) {
        e.soakTimer -= dt;
        e.speed = (e.baseSpeed ?? e.speed) * 0.72;
      } else if (e.baseSpeed !== undefined && e.speed !== e.baseSpeed) {
        e.speed = e.baseSpeed;
      }
      // Bismuth / Firebird scorch: burns for 3% max HP per second
      if (e.scorchTimer > 0 && !e.isImmortalDummy) {
        e.scorchTimer -= dt;
        e.hp -= e.maxHp * 0.03 * dt;
        if (Math.random() < dt * 6) {
          particles.addSparkle(e.x + (Math.random() * 18 - 9), e.y - e.height * (0.35 + Math.random() * 0.4), '#f97316', 2, 2);
        }
        if (e.hp <= 0 && !e.isPoofed) {
          e.isPoofed = true;
          this.poofEnemy(e, i, particles, audioEngine, onPoofed);
          continue;
        }
      }

      // Freebuff: clean hits interrupt a wind-up, rewarding aggressive play
      if (e.hurtTimer > 0 && e.windup > 0) {
        e.windup = 0;
        e.aiState = 'staggered';
      }

      // Low-HP Corruption Frenzy (Medium+ difficulties): desperate speed burst & erratic aggression
      const unpred = this.aiUnpredictability || 0;
      if (!e.isBoss && !e.isFrenzied && !e.isImmortalDummy && unpred >= 0.3 && e.hp > 0 && e.hp <= e.maxHp * 0.42) {
        e.isFrenzied = true;
        e.speed = Math.round(e.speed * (1.14 + unpred * 0.14));
        e.baseSpeed = e.speed;
        e.attackCooldown = Math.max(0.75, e.attackCooldown * 0.82);
        if (particles) particles.addSparkle(e.x, e.y - e.height * 0.6, '#ef4444', 10, 4);
      }

      // Boss phase 2 at 55% health: shorter telegraphs, faster cadence, aggressive surge
      if (e.isBoss && !e.isImmortalDummy && !e.phase2 && e.hp <= e.maxHp * 0.55) {
        e.phase2 = true;
        e.attackCooldown = Math.max(0.75, e.attackCooldown * 0.72);
        e.speed *= 1.22;
        e.windup = 0;
        audioEngine.playSfx('overdrive');
        for (const dir of [-1, 1]) {
          projectiles.push({
            x: e.x + dir * 60,
            y: this.groundY - 30,
            vx: dir * 460,
            width: 185,
            height: 46,
            radius: 44,
            damage: 1.25,
            type: 'enemyShockwave',
            color: '#ef4444',
            life: 0.55
          });
        }
      }

      // Target closest living player in 2-Player mode (ignore fallen heroes!)
      let targetPlayer = player;
      if (player2) {
        if (!player.isFallen && !player2.isFallen) {
          targetPlayer = (Math.abs(player.x - e.x) < Math.abs(player2.x - e.x)) ? player : player2;
        } else if (player.isFallen && !player2.isFallen) {
          targetPlayer = player2;
        } else if (!player.isFallen && player2.isFallen) {
          targetPlayer = player;
        }
      }
      const dx = targetPlayer.x - e.x;
      const dy = targetPlayer.y - e.y;
      e.facing = dx >= 0 ? 1 : -1;

      if (e.feintCooldown > 0) e.feintCooldown -= dt;
      if (e.burstTimer > 0) e.burstTimer -= dt;
      if (e.diveTimer > 0) e.diveTimer -= dt;
      if (e.bossDashCooldown > 0) e.bossDashCooldown -= dt;

      // Difficulty-driven erratic feint / ambush roll (bosses are ALWAYS highly unpredictable)
      const effUnpred = e.isBoss ? Math.max(unpred, e.phase2 ? 0.94 : 0.80) : unpred;
      if (effUnpred > 0.1 && !e.isImmortalDummy && e.hurtTimer <= 0 && e.windup <= 0 && (e.feintCooldown || 0) <= 0) {
        e.feintCooldown = e.isBoss
          ? Math.max(0.55, (1.65 - effUnpred * 0.9) + Math.random() * 0.85)
          : Math.max(0.85, (2.7 - effUnpred * 1.4) + Math.random() * 1.4);
        const gapToP = Math.abs(dx);
        if (Math.random() < effUnpred * (e.isBoss ? 0.86 : 0.72) && gapToP < (e.isBoss ? 560 : 420)) {
          if (e.movementType === 'fly') {
            e.diveTimer = 0.65;
            e.vx = e.facing * e.speed * 1.5;
          } else if (e.isBoss && (e.bossDashCooldown || 0) <= 0 && gapToP > 140 && gapToP < 480 && Math.random() < 0.45) {
            // Terrifying Boss Shadow-Lunge Ambush
            e.bossDashCooldown = 2.6;
            e.burstTimer = 0.55;
            e.vy = -340;
            e.vx = e.facing * Math.max(360, e.speed * 2.15);
            e.currentPlatform = null;
            if (particles) particles.addPoof(e.x, e.y - 35, e.gemColor || '#ef4444');
          } else if (gapToP < 130 && (e.y >= this.groundY - 2 || e.currentPlatform)) {
            // Sudden feint hop-back or aggressive vault
            const backstep = Math.random() < 0.52;
            e.vy = backstep ? -420 : -560;
            e.vx = (backstep ? -e.facing : e.facing) * Math.max(250, e.speed * 1.65);
            e.currentPlatform = null;
          } else {
            // Sudden adrenaline rush lunge
            e.burstTimer = 0.48 + effUnpred * 0.30;
            if (particles) particles.addSparkle(e.x, e.y - 25, e.gemColor || '#f43f5e', 6, 3);
          }
        }
      }

      const burstMult = e.burstTimer > 0 ? 1.62 : (e.isFrenzied ? 1.15 : 1.0);

      if (e.movementType === 'fly') {
        // --- 1. FLYING CORRUPTED GEM (2D Aerial Cruising & Divebombs) ---
        e.flyAltitude = e.flyAltitude || (210 + Math.random() * 80);
        const hoverWave = Math.sin(e.animTime * 2.8 + e.x * 0.01) * 35;
        let targetY = e.flyAltitude + hoverWave;

        // Swoop for pure melee flyers OR unpredictable dive-ambushes on Medium+!
        if ((!e.hasRanged && Math.abs(dx) < 180 && e.hurtTimer <= 0) || (e.diveTimer > 0 && Math.abs(dx) < 260)) {
          targetY = targetPlayer.y - 26;
        }

        e.y += (targetY - e.y) * dt * (e.diveTimer > 0 ? 4.8 : 2.2);

        if (e.hurtTimer <= 0) {
          const gap = Math.abs(dx);
          const pref = e.preferredRange || 180;
          const flySpeed = e.speed * burstMult * (e.windup > 0 ? 0.25 : 0.92);
          if (gap > pref + 24) e.vx = e.facing * flySpeed;
          else if (gap < pref - 34) e.vx = -e.facing * flySpeed;
          else e.vx *= 0.9;
        } else {
          e.vx *= 0.94;
        }
        e.x += e.vx * dt;

      } else if (e.movementType === 'jump') {
        // --- 2. JUMPING CORRUPTED GEM (Pounces, Flanking & Platform Leaping) ---
        if (e.hurtTimer <= 0) {
          const gap = Math.abs(dx);
          const pref = e.preferredRange || 70;
          const jumpSpeed = e.speed * burstMult * (e.windup > 0 ? 0.35 : 1);
          const { sepVx, crowdedSameSide } = this._computeCrowdTactics(i, e, targetPlayer, pref);
          if (crowdedSameSide >= 2 && gap < 110 && e.windup <= 0) e.vx = e.facing * jumpSpeed * 1.18;
          else if (gap > pref + 20) e.vx = e.facing * jumpSpeed + sepVx * 0.7;
          else if (gap < pref - 30) e.vx = -e.facing * jumpSpeed * 0.8 + sepVx * 0.7;
          else e.vx = sepVx * 0.6;
          if (e.windup > 0 && e.windup < 0.16 && gap > 42) {
            e.vx = e.facing * (e.speed * 1.55);
          }

          // Leap onto platforms if player is above, or erratic ambush leap
          if (e.jumpCooldown === undefined) e.jumpCooldown = 0.9;
          e.jumpCooldown -= dt;
          const isGrounded = (e.y >= this.groundY || e.currentPlatform);
          const shouldJump = isGrounded && e.jumpCooldown <= 0 && ((targetPlayer.y < e.y - 50) || (Math.abs(dx) > 120 && Math.abs(dx) < 340 && Math.random() < (0.55 + unpred * 0.35)));
          if (shouldJump) {
            e.vy = -640; // Agile leap to reach elevated platforms
            e.vx = e.facing * (e.speed * (1.45 + unpred * 0.25));
            e.isGrounded = false;
            e.currentPlatform = null;
            e.jumpCooldown = Math.max(0.95, 2.3 - unpred * 0.9 + Math.random() * 1.1);
            if (particles) particles.addSparkle(e.x, e.y - 15, e.gemColor || '#c084fc', 8, 3);
          }
        } else {
          e.vx *= 0.94;
        }
        e.x += e.vx * dt;

        // Gravity & Platform physics
        const prevEy = e.y;
        e.y += e.vy * dt;
        e.vy += 1200 * dt;

        // Land on platforms
        if (platforms && platforms.length > 0 && e.vy >= 0) {
          for (const plat of platforms) {
            if (e.x >= plat.x - 14 && e.x <= plat.x + plat.width + 14) {
              if (prevEy <= plat.y + 6 && e.y >= plat.y) {
                e.y = plat.y;
                e.vy = 0;
                e.currentPlatform = plat;
                break;
              }
            }
          }
        }

        if (e.y >= this.groundY) {
          e.y = this.groundY;
          e.vy = 0;
          e.currentPlatform = null;
        }

      } else {
        // --- 3. TACTICAL GROUND & PLATFORM WALKER (Flanking, Kiting & Platform Pursuit) ---
        if (e.evasionCooldown > 0) e.evasionCooldown -= dt;
        if (e.jumpCooldown > 0) e.jumpCooldown -= dt;
        if (e.hurtTimer <= 0) {
          const gap = Math.abs(dx);
          const pref = e.preferredRange || 60;
          const walkSpeed = e.speed * burstMult * (e.windup > 0 ? 0.35 : 1);
          const isGrounded = (e.y >= this.groundY - 1 || !!e.currentPlatform);

          // Soft ally separation + melee bracketing so mobs spread out instead of stacking
          const { sepVx, crowdedSameSide } = this._computeCrowdTactics(i, e, targetPlayer, pref);

          if (e.hasRanged) {
            // Ranged tactical kiting: back-hop away if player rushes close!
            if (gap < 68 && isGrounded && e.evasionCooldown <= 0 && e.windup <= 0) {
              e.vy = -440;
              e.vx = -e.facing * Math.max(210, e.speed * 1.45);
              e.currentPlatform = null;
              e.evasionCooldown = 2.6 + Math.random() * 0.9;
            } else if (gap > pref + 18) {
              e.vx = e.facing * walkSpeed + sepVx * 0.65;
            } else if (gap < pref - 22) {
              e.vx = -e.facing * walkSpeed * 0.92 + sepVx * 0.65;
            } else {
              e.vx = sepVx * 0.55;
            }
          } else {
            // Melee walkers: flank across if crowded on one side, or close distance & lunge!
            const flankPass = (crowdedSameSide >= 2 && gap < 110 && e.windup <= 0);
            if (flankPass) {
              e.vx = e.facing * (walkSpeed * 1.18);
            } else if (gap > pref + 14) {
              e.vx = e.facing * walkSpeed + sepVx * 0.7;
            } else if (gap < pref - 22) {
              e.vx = -e.facing * walkSpeed * 0.75 + sepVx * 0.7;
            } else {
              e.vx = sepVx * 0.6;
            }

            // Agile melee dash-step right before swinging (blade_quartz, carnelian_enforcer, robonoid_scout)
            if (e.windup > 0 && e.windup < 0.16 && gap > 42 && (e.type === 'blade_quartz' || e.type === 'carnelian_enforcer' || e.type === 'robonoid_scout')) {
              e.vx = e.facing * (e.speed * 1.55);
            }
          }

          // Platform-seeking jump when player camps on an upper ledge
          if (isGrounded && (e.jumpCooldown || 0) <= 0 && targetPlayer.y < e.y - 68 && Math.abs(dx) < 260 && e.windup <= 0) {
            e.vy = -610;
            e.vx = e.facing * Math.max(150, e.speed * 1.15);
            e.currentPlatform = null;
            e.jumpCooldown = 2.5 + Math.random() * 1.0;
          }
        } else {
          e.vx *= 0.94;
        }
        e.x += e.vx * dt;

        const prevEy = e.y;
        e.y += e.vy * dt;
        e.vy += 1200 * dt;

        if (platforms && platforms.length > 0 && e.vy >= 0) {
          for (const plat of platforms) {
            if (e.x >= plat.x - 14 && e.x <= plat.x + plat.width + 14) {
              if (prevEy <= plat.y + 6 && e.y >= plat.y) {
                e.y = plat.y;
                e.vy = 0;
                e.currentPlatform = plat;
                break;
              }
            }
          }
        }

        if (e.y >= this.groundY) {
          e.y = this.groundY;
          e.vy = 0;
          e.currentPlatform = null;
        }
      }

      // Keep enemies safely inside wide arena bounds (2600px)
      const maxX = this.stageWidth || 2600;
      if (e.x < 45) { e.x = 45; e.vx = Math.abs(e.vx) * 0.3; }
      if (e.x > maxX - 45) { e.x = maxX - 45; e.vx = -Math.abs(e.vx) * 0.3; }

      e.attackTimer += dt;

      const gapNow = Math.abs(dx);
      const inRange = gapNow < (e.attackRange || 280) && Math.abs(dy) < 280;
      const charmFactor = (e.charmTimer > 0) ? 1.45 : 1.0;
      const readyToFire = e.hurtTimer <= 0 && inRange && e.attackTimer >= ((e.attackCooldown * charmFactor) / (this.aggression || 1));

      if (e.windup > 0) {
        // Telegraph window: readable, dodgeable and interruptible
        e.windup -= dt;
        if (e.windup <= 0) {
          e.windup = 0;
          e.attackTimer = 0;
          e.aiState = 'recover';
          this.executeEnemyAttack(e, targetPlayer, projectiles, audioEngine, particles);
          if (particles) particles.addSparkle(e.x + e.facing * 24, e.y - 30, e.gemColor || '#ef4444', 10, 4);
        }
      } else if (readyToFire) {
        const committed = this.enemies.reduce((n, other) => n + (other.windup > 0 ? 1 : 0), 0);
        const hasSlot = e.isBoss || committed < (this.maxAttackers || 2);
        if (hasSlot) {
          e.windup = this.getEnemyTelegraph(e);
          e.windupMax = e.windup;
          e.aiState = 'windup';
          if (audioEngine) audioEngine.playSfx('windup');
          if (particles) {
            particles.addDamageText(e.x, e.y - e.height - 26, '!', true, '#ef4444');
            particles.addHitSpark(e.x, e.y - e.height - 10, '#fde047', 16, 0);
          }
        } else {
          // No attack slot: hold fire instead of forming a firing squad
          e.attackTimer = Math.max(0, e.attackCooldown / (this.aggression || 1) - 0.25);
        }
      }

      // Difficulty-scaled evasion: back-hop out of melee pressure
      e.evasionCooldown = Math.max(0, (e.evasionCooldown || 0) - dt);
      if (!e.isBoss && this.evasionChance > 0 && e.evasionCooldown <= 0 && e.windup <= 0 && e.hurtTimer <= 0 && player.isAttacking) {
        if (Math.abs(player.x - e.x) < 135 && Math.random() < this.evasionChance) {
          e.evasionCooldown = 2.2;
          e.vx = -e.facing * 300;
          e.vy = -380;
          e.isGrounded = false;

        }
      }

      // Loophole 2 Fix: Upper-Platform Anti-Camping Leap Pathfinding
      // If target player perches on an elevated platform for >1.0s, melee bosses and ground enemies wind up and leap upward!
      const playerIsHigh = targetPlayer && (targetPlayer.y < e.y - 70) && targetPlayer.isGrounded;
      if (playerIsHigh && (e.isBoss || e.type === 'holoJasper' || e.type === 'blade_quartz' || e.type === 'carnelian_enforcer' || e.type === 'boss_jasper' || e.type === 'boss_quartz_beast') && e.hurtTimer <= 0) {
        e.platformPerchTimer = (e.platformPerchTimer || 0) + dt;
        if (e.platformPerchTimer > 1.0 && !e.isLeapWindup && (e.y >= this.groundY - 5 || e.currentPlatform)) {
          e.isLeapWindup = true;
          e.leapWindupTimer = 0.45;
          e.vx = 0;
          if (particles) particles.addDamageText(e.x, e.y - e.height - 24, '⚠️ LEAP!', true, '#ef4444');
        }
      } else {
        e.platformPerchTimer = Math.max(0, (e.platformPerchTimer || 0) - dt * 2);
      }

      if (e.isLeapWindup) {
        e.leapWindupTimer -= dt;
        e.vx = 0;
        if (e.leapWindupTimer <= 0) {
          e.isLeapWindup = false;
          e.vy = -840;
          const dxToPlayer = (targetPlayer.x - e.x);
          e.vx = Math.min(480, Math.max(-480, dxToPlayer * 1.6));
          e.isGrounded = false;
          if (audioEngine) audioEngine.playSfx('whoosh');
          if (particles) {
            particles.addSparkle(e.x, e.y, '#f59e0b', 16, 5);
            particles.addPoof(e.x, e.y, '#94a3b8');
          }
        }
      }

      // Combo decay timer: reset continuous combo tracking after 0.65s of no hits
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (now - (e.lastComboHitTime || 0) > 650) {
        e.comboHitCount = 0;
        e.comboDamageTaken = 0;
      }
      if (e.breakoutBurstTimer > 0) {
        e.breakoutBurstTimer -= dt;
      }

      this.checkPlayerAttackCollisions(e, player, projectiles, particles, audioEngine, onPoofed, i);
      if (!e.isPoofed && player2) {
        this.checkPlayerAttackCollisions(e, player2, [], particles, audioEngine, onPoofed, i);
      }
    }

    // Dropped Gemstones
    for (let i = this.droppedGems.length - 1; i >= 0; i--) {
      const g = this.droppedGems[i];
      g.life -= dt;
      g.sparkleTimer += dt;
      if (g.sparkleTimer >= 0.25) {
        g.sparkleTimer = 0;
        particles.addSparkle(g.x, g.y, g.color, 3, 1);
      }
      if (g.life <= 0) {
        this.droppedGems.splice(i, 1);
      }
    }
  }

  getEnemyTelegraph(e) {
    const base = e.isBoss ? 0.46 : (ENEMY_TELEGRAPH_BASE[e.type] ?? 0.50);
    const phaseScale = e.phase2 ? 0.78 : 1.0;
    return Math.max(0.20, base * (this.telegraphMult || 1) * phaseScale);
  }

  executeEnemyAttack(e, player, projectiles, audioEngine, particles) {
    if (e.type === 'centipeetle' || e.type === 'acid_centipeetle') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 24,
        y: e.y - 28,
        vx: e.facing * 330,
        vy: 0,
        radius: 9,
        damage: 1,
        type: 'enemyAcid',
        color: '#22c55e',
        life: 1.5
      });
      particles.addSparkle(e.x + e.facing * 24, e.y - 28, '#4ade80', 6, 2);
    } else if (e.type === 'blade_quartz') {
      audioEngine.playSfx('hit');
      projectiles.push({
        x: e.x + e.facing * 30,
        y: e.y - 30,
        vx: e.facing * 380,
        vy: 0,
        radius: 12,
        damage: 1,
        type: 'enemyShard',
        color: '#f43f5e',
        life: 1.4
      });
    } else if (e.type === 'cluster') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 360;
    } else if (e.type === 'ice_monster') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 28,
        y: e.y - 32,
        vx: e.facing * 350,
        vy: 0,
        radius: 11,
        damage: 1,
        type: 'enemyIce',
        color: '#38bdf8',
        life: 1.5
      });
    } else if (e.type === 'winged_centipeetle') {
      // Aerial spitter: diving acid glob
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 20,
        y: e.y - 18,
        vx: e.facing * 330,
        vy: 40,
        radius: 8,
        damage: 1,
        type: 'enemyAcid',
        color: '#4ade80',
        life: 1.4
      });
      particles.addSparkle(e.x + e.facing * 20, e.y - 18, '#4ade80', 6, 2);
    } else if (e.type === 'spire_harpy') {
      // Spire Harpy: paired feather shards
      audioEngine.playSfx('whoosh');
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 22,
          y: e.y - 24 + k * 10,
          vx: e.facing * 360,
          vy: k * 40,
          radius: 9,
          damage: 1,
          type: 'enemyShard',
          color: '#06b6d4',
          life: 1.4
        });
      }
    } else if (e.type === 'volcanic_firebird') {
      // Volcanic Firebird: molten cinder lob
      audioEngine.playSfx('rocket');
      projectiles.push({
        x: e.x + e.facing * 22,
        y: e.y - 20,
        vx: e.facing * 320,
        vy: 120,
        radius: 11,
        damage: 1,
        type: 'enemyShard',
        color: '#f97316',
        life: 1.5
      });
      particles.addSparkle(e.x + e.facing * 22, e.y - 20, '#fb923c', 8, 3);
    } else if (e.type === 'ice_gargoyle') {
      // Glacial Gargoyle: frost lance
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 24,
        y: e.y - 26,
        vx: e.facing * 380,
        vy: 20,
        radius: 10,
        damage: 1,
        type: 'enemyIce',
        color: '#38bdf8',
        life: 1.4
      });
    } else if (e.type === 'boss_spitter') {
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k++) {
        projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 35,
          vx: e.facing * 340,
          vy: k * 50,
          radius: 12,
          damage: 1,
          type: 'enemyAcid',
          color: '#15803d',
          life: 1.6
        });
      }
    } else if (e.type === 'boss_quartz_beast') {
      audioEngine.playSfx('hit');
      particles.addSparkle(e.x, this.groundY, '#38bdf8', 20, 6);
      projectiles.push({
        x: e.x + e.facing * 50,
        y: this.groundY - 30,
        vx: e.facing * 380,
        width: 150,
        height: 40,
        damage: 1,
        type: 'enemyShockwave',
        life: 0.7
      });
    } else if (e.type === 'boss_cluster_titan') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 400;
      projectiles.push({
        x: e.x + e.facing * 60,
        y: this.groundY - 30,
        vx: e.facing * 400,
        width: 165,
        height: 40,
        damage: 1,
        type: 'enemyShockwave',
        color: '#9333ea',
        life: 0.7
      });
    } else if (e.type === 'boss_ice_guardian') {
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 40,
          y: e.y - 45,
          vx: e.facing * 380,
          vy: k * 60,
          radius: 14,
          damage: 1,
          type: 'enemyIce',
          color: '#38bdf8',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_jasper') {
      // Grand Climax Multi-Attack
      audioEngine.playSfx('hit');
      e.vx = e.facing * 450;
      projectiles.push({
        x: e.x + e.facing * 35,
        y: e.y - 35,
        vx: e.facing * 400,
        radius: 34,
        damage: 1,
        type: 'enemyShockwave',
        color: '#ea580c',
        life: 0.65
      });
      // Also spit dual acid bursts
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 45,
          vx: e.facing * 340,
          vy: k * 50,
          radius: 12,
          damage: 1,
          type: 'enemyAcid',
          color: '#15803d',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_cluster_core') {
      audioEngine.playSfx('laser');
      for (let k = -2; k <= 2; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 45,
          vx: e.facing * 360,
          vy: k * 45,
          radius: 12,
          damage: 1,
          type: 'enemyShard',
          color: '#c084fc',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_forge_guardian') {
      audioEngine.playSfx('hammer');
      particles.addSparkle(e.x, this.groundY, '#f97316', 24, 7);
      projectiles.push({
        x: e.x + e.facing * 60,
        y: this.groundY - 30,
        vx: e.facing * 390,
        width: 180,
        height: 40,
        damage: 1,
        type: 'enemyShockwave',
        color: '#f97316',
        life: 0.7
      });
    } else if (e.type === 'boss_agate_warden') {
      audioEngine.playSfx('whip');
      audioEngine.playSfx('lightning');
      projectiles.push({
        x: e.x + e.facing * 40,
        y: e.y - 40,
        vx: e.facing * 420,
        vy: 0,
        radius: 16,
        damage: 1,
        type: 'enemyShockwave',
        color: '#38bdf8',
        life: 0.6
      });
    } else if (e.type === 'boss_topaz_fusion') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 460;
      projectiles.push({
        x: e.x + e.facing * 65,
        y: this.groundY - 35,
        vx: e.facing * 410,
        width: 190,
        height: 42,
        damage: 1,
        type: 'enemyShockwave',
        color: '#fbbf24',
        life: 0.7
      });
    } else if (e.type === 'boss_robonoid_titan') {
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 40,
          y: e.y - 40 + k * 18,
          vx: e.facing * 420,
          vy: 0,
          radius: 14,
          damage: 1,
          type: 'enemyLaser',
          color: '#10b981',
          life: 1.4
        });
      }
    } else if (e.type === 'boss_white_diamond') {
      // Supreme Mecha Blinding Light & Radial Tri-Beam
      audioEngine.playSfx('laser');
      audioEngine.playSfx('lightning');
      particles.addSparkle(e.x, e.y - 60, '#ffffff', 30, 8);
      for (let angle = -0.3; angle <= 0.3; angle += 0.3) {
        projectiles.push({
          x: e.x + e.facing * 45,
          y: e.y - 60,
          vx: e.facing * Math.cos(angle) * 440,
          vy: Math.sin(angle) * 440,
          radius: 18,
          damage: 1,
          type: 'enemyLaser',
          color: '#ffffff',
          life: 1.6
        });
      }
    } else if (e.type === 'robonoid_scout') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 20,
        y: e.y - 25,
        vx: e.facing * 340,
        vy: 0,
        radius: 8,
        damage: 1,
        type: 'enemyLaser',
        color: '#84cc16',
        life: 1.4
      });
    } else if (e.type === 'forge_automaton') {
      audioEngine.playSfx('hammer');
      e.vx = e.facing * 320;
    } else if (e.type === 'destabilizer_soldier') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 25,
        y: e.y - 30,
        vx: e.facing * 360,
        vy: 0,
        radius: 10,
        damage: 1,
        type: 'enemyLaser',
        color: '#38bdf8',
        life: 1.4
      });
    }

    // Terrifying Unpredictable Boss Maneuver Selector (6 distinct rotating threats!)
    if (e.isBoss && !e.isImmortalDummy) {
      const numPats = e.phase2 ? 6 : 5;
      let pat = Math.floor(Math.random() * numPats);
      if (pat === e.bossPatternLast) pat = (pat + 1) % numPats;
      e.bossPatternLast = pat;
      const bossColor = e.gemColor || '#ef4444';
      const volleyCount = e.phase2 ? 5 : 3;

      if (pat === 0) {
        // Multi-angle Barrage Volley
        for (let vi = 0; vi < volleyCount; vi++) {
          const offset = vi - Math.floor(volleyCount / 2);
          const ang = offset * 0.22;
          projectiles.push({
            x: e.x + e.facing * 45,
            y: e.y - e.height * 0.55,
            vx: e.facing * Math.cos(ang) * 410,
            vy: Math.sin(ang) * 320 - 30,
            radius: 14,
            damage: 1.15,
            type: 'enemyShard',
            color: bossColor,
            life: 1.7
          });
        }
      } else if (pat === 1) {
        // Meteor Pounce Leap & Dual Shockwave Slam
        e.vy = -560;
        e.vx = e.facing * 430;
        e.currentPlatform = null;
        for (const dir of [-1, 1]) {
          projectiles.push({
            x: e.x + dir * 42,
            y: this.groundY - 26,
            vx: dir * 390,
            width: 140,
            height: 36,
            radius: 32,
            damage: 1.15,
            type: 'enemyShockwave',
            color: bossColor,
            life: 0.55
          });
        }
      } else if (pat === 2) {
        // Corruption Blink Ambush toward / across player
        if (particles) particles.addPoof(e.x, e.y - e.height * 0.5, bossColor);
        const targetX = player ? player.x : e.x;
        const stepX = (targetX > e.x ? 1 : -1) * Math.min(200, Math.abs(targetX - e.x) * 0.7 + 85);
        e.x = Math.max(90, Math.min(this.stageWidth - 90, e.x + stepX));
        e.vx = e.facing * 370;
        if (particles) particles.addSparkle(e.x, e.y - e.height * 0.5, '#ef4444', 14, 5);
      } else if (pat === 3) {
        // Tracking Corruption Orbs
        const orbCount = e.phase2 ? 3 : 2;
        for (let oi = 0; oi < orbCount; oi++) {
          projectiles.push({
            x: e.x + e.facing * 40,
            y: e.y - e.height * 0.65 - oi * 22,
            vx: e.facing * 260,
            vy: -90 - oi * 35,
            radius: 15,
            damage: 1.1,
            homing: 95,
            type: 'enemyLaser',
            color: '#a855f7',
            life: 2.2
          });
        }
      } else if (pat === 4) {
        // Corrupted Radial Shard Nova (360-degree burst)
        const spikes = e.phase2 ? 8 : 6;
        for (let si = 0; si < spikes; si++) {
          const ang = (Math.PI * 2 * si) / spikes;
          projectiles.push({
            x: e.x,
            y: e.y - e.height * 0.5,
            vx: Math.cos(ang) * 310,
            vy: Math.sin(ang) * 260,
            radius: 12,
            damage: 1.05,
            type: 'enemyShard',
            color: '#f43f5e',
            life: 1.35
          });
        }
        if (particles) particles.addShockwaveRing(e.x, e.y - e.height * 0.5, 130, '#ef4444', 4.5);
      } else {
        // Phase-2 Shadow-Feint Cross-Up + Sky Corruption Rain
        const targetX = player ? player.x : e.x;
        const flankX = Math.max(100, Math.min(this.stageWidth - 100, targetX + (e.x < targetX ? 140 : -140)));
        if (particles) particles.addPoof(e.x, e.y - e.height * 0.5, '#7e22ce');
        e.x = flankX;
        e.facing = targetX >= e.x ? 1 : -1;
        for (let mi = -1; mi <= 1; mi++) {
          projectiles.push({
            x: Math.max(80, Math.min(this.stageWidth - 80, targetX + mi * 115)),
            y: Math.max(60, this.groundY - 380 - Math.abs(mi) * 45),
            vx: mi * 25,
            vy: 340,
            radius: 16,
            damage: 1.2,
            type: 'enemyShard',
            color: '#ef4444',
            life: 1.8
          });
        }
        if (particles) particles.addSparkle(e.x, e.y - e.height * 0.5, '#ef4444', 18, 6);
      }
      return;
    }

    // Unpredictable Difficulty Attack Twist (Medium+ / Frenzied): bonus diagonal volley or lunge!
    const unpred = this.aiUnpredictability || 0;
    if (!e.isImmortalDummy && unpred > 0.1 && Math.random() < (unpred * 0.52 + (e.isFrenzied ? 0.25 : 0))) {
      const col = e.gemColor || '#ef4444';
      if (e.hasRanged) {
        // Surprise angled corruption shard / acid splatter
        const dyAim = Math.max(-140, Math.min(140, (player.y - e.y) * 0.9));
        projectiles.push({
          x: e.x + e.facing * 28,
          y: e.y - e.height * 0.48,
          vx: e.facing * (350 + unpred * 80),
          vy: dyAim + (Math.random() < 0.5 ? -55 : 55),
          radius: 10,
          damage: 1,
          type: e.type.includes('centipeetle') ? 'enemyAcid' : (e.type.includes('ice') ? 'enemyIce' : 'enemyShard'),
          color: col,
          life: 1.4
        });
      } else {
        // Sudden melee frenzy lunge + miniature corruption shockwave
        e.vx = e.facing * Math.max(380, e.speed * 2.1);
        projectiles.push({
          x: e.x + e.facing * 36,
          y: e.y - 26,
          vx: e.facing * 320,
          width: 70,
          height: 32,
          radius: 26,
          damage: 1,
          type: 'enemyShockwave',
          color: col,
          life: 0.35
        });
      }
    }
  }

  // Vertical & facing alignment check: prevents mid-air/platform attacks from hitting enemies far below or behind
  isPlayerMeleeAligned(e, player, hitRange, verticalPadTop = 26, verticalPadBottom = 16) {
    const dx = e.x - player.x;
    const isFacing = player.facing === 1 ? dx >= -10 : dx <= 10;
    if (!isFacing || Math.abs(dx) >= hitRange) return false;

    const pBottom = player.y + verticalPadBottom;
    const pTop = player.y - (player.height || 66) - verticalPadTop;
    const eBottom = e.y;
    const eTop = e.y - (e.height || 48);
    return eBottom >= pTop && eTop <= pBottom;
  }

  checkPlayerAttackCollisions(e, player, projectiles, particles, audioEngine, onPoofed, enemyIndex) {
    if (e.isPoofed) return;

    const pStats = (typeof player.getCombatStats === 'function')
      ? player.getCombatStats()
      : { attack: 34, magic: 36, critChance: 0.16, critDamage: 1.65 };
    const physMult = (pStats.attack || 34) / 34;
    const magicMult = (pStats.magic || 36) / 36;
    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    // Amethyst / Jasper Spin Dash Contact Collision (throttled to prevent continuous-hit lag)
    if (player.isSpinDashing) {
      if (this.isPlayerMeleeAligned(e, player, 68, 18, 14) && e.hurtTimer <= 0 && nowMs - (e._spinDashAt || 0) >= 260) {
        e._spinDashAt = nowMs;
        let dmg = (player.isPinkOverdrive ? 56 : 34) * (0.55 * physMult + 0.45 * magicMult) * (player.hasSynergyBuff ? 1.25 : 1.0);
        this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, player.getMoveType('k'), player.getStabMultiplier('k'), pStats);
        particles.addImpactSparks(e.x, e.y - 20, player.facing, '#c084fc', 8);
        e.vx = player.facing * 440;
        e.vy = -240;
        e.hurtTimer = 0.35;
        audioEngine.playSfx('hit');
        particles.addSparkle(e.x, e.y - 20, '#c084fc', 8, 4);
        if (e.isPoofed) return;
      }
    }

    // Melee Attack Check with Elevation Overlap & Strict Facing Direction
    if (player.isAttacking && (player.attackFrame >= 0.2 || player.actionTimer > 0)) {
      let hitRange = 85;
      if (player.isFusion) hitRange = 165;
      else if (player.activeChar === 'amethyst') hitRange = 120;
      else if (player.activeChar === 'lapis') hitRange = 115;
      else if (player.activeChar === 'jasper') hitRange = 110;
      else if (player.activeChar === 'connie') hitRange = 105;
      else if (player.activeChar === 'rose' || player.activeChar === 'pearl') hitRange = 100;
      else if (player.activeChar === 'bismuth') hitRange = 95;
      hitRange += (player.attackRangeBonus || 0);

      const alreadyHitThisSwing = !!(player._swingHitSet && player._swingHitSet.has(e));
      if (!alreadyHitThisSwing && this.isPlayerMeleeAligned(e, player, hitRange) && e.hurtTimer <= 0) {
        if (player._swingHitSet) player._swingHitSet.add(e);
        let baseDmg = player.isFusion ? 62 : 30;
        const isMagicMelee = (player.activeChar === 'lapis' || player.activeChar === 'peridot' || player.activeChar === 'pearl' || player.activeChar === 'rose');
        const meleeStatScale = isMagicMelee ? (0.45 * physMult + 0.55 * magicMult) : (0.85 * physMult + 0.15 * magicMult);
        let dmg = Math.round(baseDmg * meleeStatScale * (player.attackDamageMult || 1));

        if (player.isPinkOverdrive) {
          dmg = Math.round(dmg * 1.9);
        }
        if (player.hasSynergyBuff) {
          dmg = Math.round(dmg * 1.25);
        }

        this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, player.getMoveType(player.attackType), player.getStabMultiplier(player.attackType), pStats);
        const sparkColor = player.isPinkOverdrive ? '#f43f5e' : ((typeof OVERDRIVE_THEMES !== 'undefined' && OVERDRIVE_THEMES[player.activeChar]?.color) || '#fde047');
        particles.addImpactSparks(e.x, e.y - e.height / 2, player.facing, sparkColor, 12);
        if (player.comboStep >= 2 || player.attackType === 'L' || player.isFusion) {
          particles.addImpactFrame(e.x, e.y - e.height / 2, sparkColor, player.isFusion ? 200 : 155);
          if (['connie', 'rose', 'pearl'].includes(player.activeChar) || (player.isFusion && ['stevonnie', 'rainbow2', 'rainbowClassic'].includes(player.fusionData?.id))) {
            particles.addDoubleSlashX(e.x - player.facing * 12, e.y - e.height / 2, player.facing, sparkColor);
          }
        }
        if (this.gameRef && this.gameRef.triggerHitstop) {
          const isFinisherHit = (player.comboStep >= 2 || player.attackType === 'L' || player.isFusion);
          this.gameRef.triggerHitstop(isFinisherHit ? 0.062 : 0.036, isFinisherHit ? 5.0 : 2.6);
        }

        // ENEMY STAGGER & KNOCKBACK FOR CLOSE-RANGE / MELEE ATTACKS
        if (player.isFusion) {
          // Fusion Titanic Impact: Cataclysmic launch & juggle
          e.vx = player.facing * 580;
          e.vy = -300;
          e.hurtTimer = 0.50;
          particles.addExplosion(e.x, e.y - e.height / 2, '#e11d48', 20);
        } else if (player.activeChar === 'garnet') {
          // Garnet heavy twin gauntlet boxing impact: powerful uppercut knockback
          e.vx = player.facing * 500;
          e.vy = -240;
          e.hurtTimer = 0.44;
          particles.addExplosion(e.x, e.y - e.height / 2, '#ef4444', 14);
        } else if (player.activeChar === 'steven') {
          // Steven shield bash & punch combo knockback
          e.vx = player.facing * 420;
          e.vy = -200;
          e.hurtTimer = 0.38;
          particles.addHitSparks(e.x, e.y - e.height / 2, '#ec4899', 8);
        } else if (player.activeChar === 'amethyst') {
          // Amethyst whip slash & crack knockback
          e.vx = player.facing * 420;
          e.vy = -190;
          e.hurtTimer = 0.38;
          particles.addHitSparks(e.x, e.y - e.height / 2, '#a855f7', 8);
        } else if (player.activeChar === 'pearl') {
          // Pearl fencing thrust & spear impale knockback
          e.vx = player.facing * 390;
          e.vy = -180;
          e.hurtTimer = 0.36;
          particles.addHitSparks(e.x, e.y - e.height / 2, '#22d3ee', 8);
        } else if (player.activeChar === 'rose') {
          // Rose Quartz broadsword celestial sweep knockback
          e.vx = player.facing * 440;
          e.vy = -210;
          e.hurtTimer = 0.40;
          particles.addHitSparks(e.x, e.y - e.height / 2, '#f43f5e', 8);
        } else if (player.activeChar === 'bismuth') {
          // Bismuth heavy hammer knockback: launches back with vertical lift!
          e.vx = player.facing * 560;
          e.vy = -280;
          e.hurtTimer = 0.45;
          particles.addExplosion(e.x, e.y - e.height / 2, '#f97316', 14);
        } else if (player.activeChar === 'jasper') {
          // Jasper crushing Beta Quartz impact
          e.vx = player.facing * 520;
          e.vy = -240;
          e.hurtTimer = 0.42;
          particles.addExplosion(e.x, e.y - e.height / 2, '#ea580c', 14);
        } else if (player.activeChar === 'connie') {
          // Connie precision fencing thrust
          e.vx = player.facing * 380;
          e.vy = -180;
          e.hurtTimer = 0.38;
          particles.addHitSparks(e.x, e.y - e.height / 2, '#ec4899', 8);
        } else {
          // Long range ranged users (Peridot, Lapis) - travel across map without sudden close melee knockback
          e.vx = player.facing * 140;
          e.hurtTimer = 0.25;
        }
        // Heavier chain steps launch further; finishers add extra lift
        e.vx *= (player.attackKnockMult || 1);
        if (this.knockbackResist) e.vx *= Math.max(0.35, 1 - this.knockbackResist);
        if (player.comboStep >= 2 && e.vy) e.vy *= 1.15;
        e.attackTimer = 0;

        // Airborne Juggle State: Striking airborne enemies in mid-air suspends both aloft
        if (!player.isGrounded && !e.isGrounded) {
          player.vy = Math.min(player.vy, -50);
          player.airComboCount = (player.airComboCount || 0) + 1;
          particles.addHitSpark(e.x, e.y - e.height / 2, '#38bdf8', 22, -Math.PI / 4);
          particles.addDamageText(e.x, e.y - e.height - 12, `AIR COMBO x${player.airComboCount}!`, true, '#38bdf8');
        } else if (player.isGrounded) {
          player.airComboCount = 0;
        }

        // Loophole 1 Fix: Hitstun Decay (15% reduction per consecutive hit, min 0.08s)
        // Prevents perpetual infinite corner stun-locking without altering attack knockback values
        const decayMult = Math.max(0.35, Math.pow(0.85, (e.comboHitCount || 1) - 1));
        e.hurtTimer = Math.max(0.08, e.hurtTimer * decayMult);

        if (e.isPoofed) return;
      }
    }

    // Projectile Collisions
    for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
      const p = projectiles[pIdx];
      if (p.type.startsWith('enemy')) continue;

      // Show-Accurate Holo-Pearl Sparring Clone: Multi-Hit Piercing Fencing Lunges!
      if (p.type === 'holoPearl') {
        const dist = Math.hypot(p.x - e.x, p.y - (e.y - e.height / 2));
        if (dist < (p.radius || 32) + (e.width / 2)) {
          p.hitCooldowns = p.hitCooldowns || {};
          const eKey = e.id || `${Math.round(e.x)}_${Math.round(e.y)}_${enemyIndex}`;
          if (!p.hitCooldowns[eKey] || p.hitCooldowns[eKey] <= 0) {
            p.hitCooldowns[eKey] = 0.35; // allow re-hit after 0.35s
            this.damageEnemy(e, p.damage || 55, particles, audioEngine, onPoofed, enemyIndex, p.elementType || 'psychic', p.stabMult || 1);
            audioEngine.playSfx('laser');
            particles.addDamageText(e.x, e.y - e.height - 20, '🤺 PARRY! THRUST!', true, p.isOverdrive ? '#f472b6' : '#38bdf8');
            particles.addThrustPierce(e.x, e.y - 25, p.facing || (p.vx >= 0 ? 1 : -1), p.isOverdrive ? '#f472b6' : '#38bdf8');
            particles.addSparkle(e.x, e.y - 25, p.isOverdrive ? '#f472b6' : '#a5f3fc', 16, 5);
            e.vx = (p.facing || (p.vx >= 0 ? 1 : -1)) * 380;
            e.vy = -190;
            e.hurtTimer = 0.45;
            e.attackTimer = 0;
            if (e.isPoofed) break;
          }
        }
        continue; // Holo-Pearl continues lunging through enemies without vanishing!
      }

      // 1. Determine hit detection based on projectile geometry (AABB for waves/shockwaves, radial for projectiles)
      let isHit = false;
      const enemyCenterY = e.y - e.height / 2;

      if (p.width && p.height) {
        // Broad rectangular / wave / shockwave collision (AABB)
        const halfW = p.width / 2;
        const halfH = p.height / 2;
        const pLeft = p.x - halfW;
        const pRight = p.x + halfW;
        const pTop = p.y - halfH;
        const pBottom = p.y + halfH;

        const eLeft = e.x - e.width / 2;
        const eRight = e.x + e.width / 2;
        const eTop = e.y - e.height;
        const eBottom = e.y;

        // Generous tolerance margin of 20px
        isHit = (pRight >= eLeft - 20) && (pLeft <= eRight + 20) &&
                (pBottom >= eTop - 20) && (pTop <= eBottom + 20);
      } else {
        // Radial collision
        const effRadius = p.radius || 26;
        const dist = Math.hypot(p.x - e.x, p.y - enemyCenterY);
        isHit = dist < (effRadius + (e.width / 2));
      }

      if (isHit) {
        if (p.pierceLeft && p.pierceLeft > 0) {
          p.hitSet = p.hitSet || new Set();
          if (p.hitSet.has(e)) continue;
          p.hitSet.add(e);
        }

      // 2. Throttle persistent / multi-frame AoE projectiles so they NEVER hit every frame at 60Hz
      const isPersistentAoE = (
        p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' ||
        p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' ||
        p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash' ||
        p.type === 'amethystSpinDashHit' || p.type === 'jasperSpinDashHit' || p.type === 'flaskRobonoid' ||
        p.type === 'fusionRoseSwordWave' || p.type === 'fusionCyclone' || p.type === 'fusionPrismCannon' ||
        p.type === 'fusionSupernova' || p.type === 'fusionFlailCataclysm' || p.type === 'fusionShowstopper' ||
        p.type === 'fusionTsunamiCage' || p.type === 'fusionPrismRose'
      );
      if (isPersistentAoE) {
        p.hitMap = p.hitMap || new Map();
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (p.hitMap.has(e)) {
          const lastHit = p.hitMap.get(e);
          if (now - lastHit < 300) {
            continue; // Enemy was recently hit by this wave/shockwave; wait for next tick
          }
        }
        p.hitMap.set(e, now);
      }

      // 3. Confirmed Hit! Apply Attack/Magic lore stat scaling & Critical Chance/Damage
      const magicProjTypes = new Set([
        'hydroFist', 'tidalWave', 'spearBeam', 'holoPearl', 'scrapSalvo', 'flaskRobonoid',
        'magneticVortex', 'purpleGeyser', 'bubbleShockwave', 'roseShockwave', 'roseSwordWave',
        'fusionCyclone', 'fusionPrismCannon', 'fusionSupernova', 'fusionTsunamiCage',
        'fusionShowstopper', 'fusionPrismRose', 'fusionLightRain', 'fusionArrow', 'fusionRoseSwordWave'
      ]);
      const projStatScale = magicProjTypes.has(p.type)
        ? (0.20 * physMult + 0.80 * magicMult)
        : (0.75 * physMult + 0.25 * magicMult);
      const scaledProjDmg = Math.max(1, Math.round((p.damage || 25) * projStatScale));
      this.damageEnemy(e, scaledProjDmg, particles, audioEngine, onPoofed, enemyIndex, p.elementType || null, p.stabMult || 1, pStats);
      if (nowMs - (e._lastSparkAt || 0) >= 85) {
        e._lastSparkAt = nowMs;
        particles.addSparkle(p.x, p.y, p.color || '#fff', 8, 3);
        const projDir = (p.vx && p.vx > 0) ? 1 : ((p.vx && p.vx < 0) ? -1 : player.facing);
        particles.addImpactSparks(e.x, e.y - e.height / 2, projDir, p.color || '#fde047', 6);
      } else {
        const projDir = (p.vx && p.vx > 0) ? 1 : ((p.vx && p.vx < 0) ? -1 : player.facing);
        void projDir;
      }
      if (this.gameRef && this.gameRef.triggerHitstop && !isPersistentAoE) {
        this.gameRef.triggerHitstop(0.03, 1.8);
      }

      // Specific Knockbacks based on lore weapons
      if (p.type === 'tidalWave') {
        // Lapis Lazuli Towering Tidal Wave: Sweeps enemies into the air with hydro surge!
        e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 520;
        e.vy = -360;
        e.hurtTimer = 0.55;
        particles.addWaterStream(e.x, e.y - e.height / 2, projDir, '#38bdf8');
        particles.addDamageText(e.x, e.y - e.height - 25, '🌊 TIDAL WAVE!', true, '#0284c7');
        particles.addSparkle(e.x, e.y - 25, '#38bdf8', 22, 6);
        particles.addSparkle(e.x, e.y - 45, '#e0f2fe', 16, 5);
      } else if (p.type === 'jasperCrashHelmet') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 650;
          e.vy = -320;
          e.hurtTimer = 0.55;
          particles.addHammerQuake(e.x, e.y, '#ea580c');
          particles.addFireRing(e.x, e.y, '#ea580c');
          particles.addDamageText(e.x, e.y - e.height - 20, 'HELMET CRASH!', true, '#ea580c');
          particles.addSparkle(e.x, e.y - 20, '#fbbf24', 16, 5);
        } else if (p.type === 'jasperSpinDashHit') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 580;
          e.vy = -260;
          e.hurtTimer = 0.45;
          particles.addFireRing(e.x, e.y, '#ea580c');
          particles.addDamageText(e.x, e.y - e.height - 20, 'TORNADO SHRED!', true, '#f97316');
        } else if (p.type === 'shieldShockwave' || p.type === 'bubbleShockwave') {
          e.vx = player.facing * 440;
          e.vy = -220;
          e.hurtTimer = 0.42;
          particles.addHolyHeal(e.x, e.y - e.height / 2, '#ec4899');
          particles.addDamageText(e.x, e.y - e.height - 20, 'BUBBLE BURST!', true, '#ec4899');
        } else if (p.type === 'rocketGauntlet') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 520;
          e.vy = -240;
          e.hurtTimer = 0.45;
          particles.addFireRing(e.x, e.y - e.height / 2, '#ef4444');
          particles.addDamageText(e.x, e.y - e.height - 20, 'ROCKET IMPACT!', true, '#ef4444');
        } else if (p.type === 'roseSwordWave' || p.type === 'roseShockwave') {
          e.vx = player.facing * 460;
          e.vy = -220;
          e.hurtTimer = 0.42;
          particles.addHolyHeal(e.x, e.y - e.height / 2, '#f43f5e');
          particles.addDamageText(e.x, e.y - e.height - 20, 'ROSE BURST!', true, '#f43f5e');
        } else if (p.type === 'spearBeam') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 440;
          e.vy = -190;
          e.hurtTimer = 0.38;
          particles.addThrustPierce(e.x, e.y - e.height / 2, projDir, '#22d3ee');
          particles.addDamageText(e.x, e.y - e.height - 20, 'SPEAR PIERCE!', true, '#22d3ee');
        } else if (p.type === 'connieSwordBeam') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 420;
          e.vy = -180;
          e.hurtTimer = 0.40;
          particles.addThrustPierce(e.x, e.y - e.height / 2, projDir, '#ec4899');
          particles.addDamageText(e.x, e.y - e.height - 20, 'CRESCENT BEAM!', true, '#ec4899');
        } else if (p.type === 'connieShadowSlash') {
          e.vx = player.facing * 340;
          e.vy = -200;
          e.hurtTimer = 0.40;
          particles.addThrustPierce(e.x, e.y - e.height / 2, player.facing, '#f472b6');
          particles.addDamageText(e.x, e.y - e.height - 20, 'SHADOW CUT!', true, '#f472b6');
        } else if (p.type === 'bismuthAnvil') {
          // Bismuth Anvil Launch: heavy catapult knockback
          e.vx = (p.vx && p.vx > 0 ? 1 : (p.vx && p.vx < 0 ? -1 : player.facing)) * 620;
          e.vy = -300;
          e.hurtTimer = 0.50;
          particles.addHammerQuake(e.x, e.y, '#ea580c');
          particles.addDamageText(e.x, e.y - e.height - 20, 'HEAVY ANVIL!', true, '#ea580c');
        } else if (p.type === 'moltenShockwave') {
          // Bismuth Breaking Point Ultimate: catastrophic air pop & knockback!
          e.vx = player.facing * 850;
          e.vy = -480;
          e.hurtTimer = 0.65;
          particles.addHammerQuake(e.x, e.y, '#ef4444');
          particles.addDamageText(e.x, e.y - e.height - 30, 'BREAKING POINT!', true, '#ef4444');
        } else if (p.type === 'giantGauntletSlam' || p.type === 'seismicShockwave') {
          // Garnet Giant Gauntlets Seismic Slam: ground tremor pop
          e.vx = player.facing * 450;
          e.vy = -360;
          e.hurtTimer = 0.50;
          particles.addHammerQuake(e.x, e.y, '#fbbf24');
          particles.addLightningArc(e.x - 30, e.y, e.x + 30, e.y - 40, '#fbbf24');
          particles.addDamageText(e.x, e.y - e.height - 20, 'MEGA SLAM!', true, '#fbbf24');
        } else {
          // Standard Projectile Knockback (combo finishers carry their own tuning)
          const dir = (p.vx && p.vx > 0) ? 1 : ((p.vx && p.vx < 0) ? -1 : player.facing);
          e.vx = dir * (p.knockX || 180);
          if (p.knockY) e.vy = p.knockY;
          e.hurtTimer = p.hurtTime || 0.3;
          if (p.hitText) {
            particles.addDamageText(e.x, e.y - e.height - 22, p.hitText, true, p.color || '#fde047');
          }
        }
        e.attackTimer = 0;

        if (p.type === 'stevenShield' && p.bounces > 0) {
          p.bounces--;
          p.vx = -p.vx;
          p.x += p.vx * 0.05;
        } else if (p.type === 'roseShield' && p.bounces > 0) {
          p.bounces--;
          p.vx = -p.vx;
          p.x += p.vx * 0.05;
        } else if (p.type === 'purpleGeyser') {
          // Amethyst Violet Geyser Air Juggle! Launches targets straight up with electric crackles
          e.vx = player.facing * 120;
          e.vy = -360;
          e.hurtTimer = 0.50;
          particles.addLightningArc(e.x - 15, e.y, e.x + 15, e.y - e.height, '#c084fc');
          particles.addDamageText(e.x, e.y - e.height - 25, 'VIOLET GEYSER!', true, '#c084fc');
          particles.addSparkle(e.x, e.y - 30, '#fde047', 12, 4);
        } else if (p.pierceLeft && p.pierceLeft > 1) {
          p.pierceLeft -= 1;
        } else if (!isPersistentAoE && p.type !== 'amethystSpinDashHit' && p.type !== 'jasperSpinDashHit') {
          projectiles.splice(pIdx, 1);
        }
        if (e.isPoofed) break;
      }
    }
  }

  // Type-status rider applied on every damaging hit.
  applyTypeStatus(e, moveType, particles) {
    const status = TYPE_STATUS[moveType];
    if (!status || e.isImmortalDummy) return;
    const already = (id) => {
      if (id === 'soaked') return e.soakTimer > 0;
      if (id === 'shocked') return e.stunTimer > 0;
      if (id === 'dazed') return e.dazeTimer > 0;
      if (id === 'charmed') return e.charmTimer > 0;
      if (id === 'cracked' || id === 'corrupted' || id === 'shattered') return e.vulnTimer > 0;
      if (id === 'scorched') return e.scorchTimer > 0;
      return false;
    };
    const fresh = !already(status.id);

    switch (status.id) {
      case 'soaked':   e.soakTimer = 4.0; break;                                  // Lapis: waterlogged, slowed
      case 'shocked':  e.stunTimer = Math.max(e.stunTimer || 0, 0.9); e.windup = 0; break; // Garnet/Peridot
      case 'dazed':    e.dazeTimer = 3.0; e.windup = 0; break;                    // Future Vision scrambles aim
      case 'charmed':  e.charmTimer = 5.0; break;                                 // Steven: empathy disarms
      case 'cracked':  e.vulnTimer = 5.0; e.vulnMult = Math.max(e.vulnMult || 1, 1.18); break;
      case 'shattered':e.vulnTimer = 4.0; e.vulnMult = Math.max(e.vulnMult || 1, 1.25); break;
      case 'corrupted':e.vulnTimer = 5.0; e.vulnMult = Math.max(e.vulnMult || 1, 1.10); break;
      case 'scorched': e.scorchTimer = 3.0; break;                                // Bismuth / firebird heat
      case 'launched': e.launchBoost = 1.35; break;                               // water wings / pegasus
      case 'stagger':  e.windup = 0; e.aiState = 'staggered'; break;              // quartz fists
      default: break;
    }

    // Status effect applied silently without cluttering popup text
  }

  damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, attackType = null, stabMult = 1, combatOpts = null) {
    if (e.isPoofed) return;

    const moveType = attackType ? String(attackType).toLowerCase() : null;
    const typeMeta = getTypeMeta(moveType || 'normal');
    const typeMult = typeMultiplier(moveType, e.types);
    const vulnMult = (e.vulnTimer > 0 ? (e.vulnMult || 1) : 1);

    // Critical Chance & Critical Damage roll from active guardian's lore stats
    const fallbackStats = (this.gameRef && this.gameRef.player && typeof this.gameRef.player.getCombatStats === 'function')
      ? this.gameRef.player.getCombatStats()
      : null;
    const critChance = (combatOpts && typeof combatOpts.critChance === 'number')
      ? combatOpts.critChance
      : (fallbackStats ? fallbackStats.critChance : 0.12);
    const critDamage = (combatOpts && typeof combatOpts.critDamage === 'number')
      ? combatOpts.critDamage
      : (fallbackStats ? fallbackStats.critDamage : 1.6);
    const isCrit = (!combatOpts || combatOpts.allowCrit !== false) && (Math.random() < critChance);
    const critMult = isCrit ? critDamage : 1.0;

    const finalDmg = Math.max(1, Math.round(dmg * typeMult * (stabMult || 1) * vulnMult * critMult));

    if (this.onComboHit) {
      this.onComboHit(finalDmg);
    }

    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const canShowFeedback = nowMs - (e._lastFeedbackAt || 0) >= 85;
    if (canShowFeedback) {
      e._lastFeedbackAt = nowMs;
    }

    // Tekken Practice Dojo: Training dummy takes zero permanent damage!
    if (e.isImmortalDummy) {
      e.hp = e.maxHp;
      e.hurtTimer = 0.28;
      if (canShowFeedback) {
        if (particles) particles.addDamageText(e.x, e.y - e.height - 14, isCrit ? `${finalDmg}!` : `${finalDmg}`, isCrit || finalDmg >= 35, isCrit ? '#fde047' : typeMeta.color);
        if (audioEngine) audioEngine.playSfx('hitfeedback');
        if (particles) particles.addHitSparks(e.x, e.y - e.height / 2, isCrit ? '#fde047' : (typeMeta.color || '#ffd700'));
      }
      this.applyTypeStatus(e, moveType, particles);
      return;
    }

    e.hp -= finalDmg;
    e.hurtTimer = 0.35;
    this.applyTypeStatus(e, moveType, particles);
    if (canShowFeedback) {
      if (particles) {
        particles.addDamageText(e.x, e.y - e.height - 12, isCrit ? `${finalDmg}!` : `${finalDmg}`, isCrit || finalDmg >= 35 || typeMult >= 2, isCrit ? '#fde047' : typeMeta.color);
        particles.addHitSparks(e.x, e.y - e.height / 2, isCrit ? '#fde047' : (typeMeta.color || '#ffd700'));
      }
      if (audioEngine) audioEngine.playSfx('hitfeedback');
    }

    e.comboHitCount = (e.comboHitCount || 0) + 1;
    e.comboDamageTaken = (e.comboDamageTaken || 0) + finalDmg;
    e.lastComboHitTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Defeat check MUST run before Boss Super-Armor Breakout Burst so a fatal hit at 0 HP never skips poofing!
    if (e.hp <= 0) {
      e.hp = 0;
      e.invulnerableTimer = 0;
      e.breakoutBurstTimer = 0;
      if (!e.isPoofed && !e.isPoofing) {
        e.isPoofing = true;
        e.poofTimer = 0.16;
        e.maxPoofTime = 0.16;
        if (this.gameRef && this.gameRef.triggerHitstop) {
          this.gameRef.triggerHitstop(0.065, 5.0);
        }
      }
      return;
    }

    // Loophole 1 Fix: Boss Super-Armor Breakout Burst (only while boss still has HP > 0)
    // If boss takes >= 20% of maxHp in a continuous combo, burst out with invulnerability & shockwave to break the lock
    if (e.isBoss && e.comboDamageTaken >= (e.maxHp * 0.20) && !e.isPoofed && !e.isPoofing) {
      e.invulnerableTimer = 0.75;
      e.breakoutBurstTimer = 0.45;
      e.comboDamageTaken = 0;
      e.comboHitCount = 0;
      e.hurtTimer = 0;
      e.aiState = 'chase';
      audioEngine.playSfx('explosion');
      audioEngine.playSfx('overdrive');
      if (particles) {
        particles.addExplosion(e.x, e.y - e.height / 2, '#fbbf24', 28);
        particles.addHitSpark(e.x, e.y - e.height / 2, '#ef4444', 30, 0);
      }
      if (this.gameRef && this.gameRef.player) {
        const p = this.gameRef.player;
        const pDir = p.x < e.x ? -1 : 1;
        p.vx = pDir * 380;
        p.vy = -180;
      }
      return;
    }
  }

  poofEnemy(e, enemyIndex, particles, audioEngine, onPoofed) {
    audioEngine.playSfx('poof');
    particles.addPoof(e.x, e.y - e.height / 2, e.gemColor || '#22c55e');
    this.enemiesDefeatedInStage = (this.enemiesDefeatedInStage || 0) + 1;

    // Health Recovery Drop: 30-40% chance healing Heart drop
    if (this.pickupsRef) {
      const dropRoll = Math.random();
      if (dropRoll < this.dropRate) {
        this.pickupsRef.push({
          x: e.x,
          y: this.groundY - 14,
          type: 'heart',
          life: 20
        });
        particles.addSparkle(e.x, this.groundY - 15, '#ff4d79', 16, 5);
      }
    }

    // 15% - 30% Bubble Collection Charge based on enemy tier & difficulty
    let basePercent = 18;
    if (e.type === 'centipeetle' || e.type === 'acid_centipeetle' || e.type === 'robonoid_scout') {
      basePercent = 16;
    } else if (e.type === 'blade_quartz' || e.type === 'cluster' || e.type === 'ice_monster' || e.type === 'forge_automaton' || e.type === 'destabilizer_soldier') {
      basePercent = 23;
    } else if (e.isBoss) {
      basePercent = 30;
    }
    const diffMultiplier = this.diffMult || 1.0;
    const bubblePercent = Math.max(15, Math.min(30, Math.round(basePercent * diffMultiplier)));

    this.droppedGems.push({
      x: e.x,
      y: this.groundY - 10,
      color: e.gemColor || '#22c55e',
      shape: e.gemShape || 'centipeetle',
      type: e.type,
      bubblePercent: bubblePercent,
      life: 18.0,
      sparkleTimer: 0
    });

    if (e.isBoss) {
      this.isBossAlive = false;
      this.bossDefeated = true;
      if (this.gameRef && this.gameRef.triggerBossCinematicFinisher) {
        this.gameRef.triggerBossCinematicFinisher(e);
      }
    }

    const idx = this.enemies.indexOf(e);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
    }
    if (onPoofed) onPoofed(e);
  }

  drawEnemyModel(ctx, e) {
    if (e.type === 'winged_centipeetle') {
      this.drawWingedCentipeetle(ctx, e);
    } else if (e.type === 'spire_harpy') {
      this.drawSpireHarpy(ctx, e);
    } else if (e.type === 'volcanic_firebird') {
      this.drawVolcanicFirebird(ctx, e);
    } else if (e.type === 'ice_gargoyle') {
      this.drawIceGargoyle(ctx, e);
    } else if (e.type === 'centipeetle' || e.type === 'acid_centipeetle') {
      this.drawCentipeetleHatchling(ctx, e);
    } else if (e.type === 'blade_quartz') {
      this.drawBladeQuartz(ctx, e);
    } else if (e.type === 'cluster') {
      this.drawClusterMutant(ctx, e);
    } else if (e.type === 'ice_monster') {
      this.drawIceMonster(ctx, e);
    } else if (e.type === 'boss_spitter' || e.type === 'boss_centipeetle') {
      this.drawMotherCentipeetle(ctx, e);
    } else if (e.type === 'boss_quartz_beast') {
      this.drawCorruptedQuartzBeast(ctx, e);
    } else if (e.type === 'boss_cluster_titan') {
      this.drawClusterTitan(ctx, e);
    } else if (e.type === 'boss_ice_guardian') {
      this.drawIceGuardian(ctx, e);
    } else if (e.type === 'boss_jasper' || e.type === 'boss_jasper_dummy' || e.type.includes('dummy') || e.type.includes('jasper')) {
      this.drawCorruptedJasper(ctx, e);
    } else if (e.type === 'boss_cluster_core') {
      this.drawClusterCore(ctx, e);
    } else if (e.type === 'boss_forge_guardian') {
      this.drawForgeGuardian(ctx, e);
    } else if (e.type === 'boss_agate_warden') {
      this.drawAgateWarden(ctx, e);
    } else if (e.type === 'boss_topaz_fusion') {
      this.drawTopazFusion(ctx, e);
    } else if (e.type === 'boss_robonoid_titan') {
      this.drawRobonoidTitan(ctx, e);
    } else if (e.type === 'boss_white_diamond') {
      this.drawWhiteDiamond(ctx, e);
    } else if (e.type === 'robonoid_scout') {
      this.drawRobonoidScout(ctx, e);
    } else if (e.type === 'forge_automaton') {
      this.drawForgeAutomaton(ctx, e);
    } else if (e.type === 'destabilizer_soldier') {
      this.drawDestabilizerSoldier(ctx, e);
    } else {
      // Safe ultimate fallback: guarantees NO enemy or boss is ever invisible!
      this.drawCorruptedJasper(ctx, e);
    }
  }

  draw(ctx) {
    ctx.save();
    for (const g of this.droppedGems) {
      this.drawGemstone(ctx, g.x, g.y, g.color, g.shape);
    }

    for (const e of this.enemies) {
      // Dynamic Cast Shadow on Ground / Platform
      const eFloorY = e.currentPlatform ? e.currentPlatform.y : this.groundY;
      const eElev = Math.max(0, eFloorY - e.y);
      const eShadowScale = Math.max(0.25, 1 - (eElev / 360));
      ctx.save();
      ctx.translate(e.x, eFloorY);
      ctx.scale(eShadowScale, eShadowScale * 0.32);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
      ctx.beginPath();
      ctx.arc(0, 0, (e.width || 45) * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(e.x, e.y);

      // Dramatic Warp-In / Corruption Materialize Spawn Animation
      let spawnScaleY = 1;
      let spawnScaleX = 1;
      let spawnAlpha = 1;
      if (e.spawnAnimTimer && e.spawnAnimTimer > 0) {
        const sp = Math.max(0.05, Math.min(1, 1 - (e.spawnAnimTimer / (e.maxSpawnAnim || 0.55))));
        spawnScaleY = 0.25 + 0.75 * sp;
        spawnScaleX = 1.45 - 0.45 * sp;
        spawnAlpha = 0.35 + 0.65 * sp;
        const beamW = (e.isBoss ? 86 : 44) * (1.25 - sp * 0.8);
        ctx.save();
        ctx.globalAlpha = (1 - sp * 0.75) * 0.78;
        const col = e.gemColor || (e.isBoss ? '#f43f5e' : '#c084fc');
        const beamGrad = ctx.createLinearGradient(0, -e.height * 2.4, 0, 0);
        beamGrad.addColorStop(0, 'transparent');
        beamGrad.addColorStop(0.4, col);
        beamGrad.addColorStop(1, '#ffffff');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(-beamW * 0.5, -e.height * 2.4, beamW, e.height * 2.4);
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -4, beamW * 0.85, 11, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.scale(e.facing * spawnScaleX, spawnScaleY);
      ctx.globalAlpha *= spawnAlpha;

      if (e.isPoofing) {
        const poofProgress = Math.max(0, Math.min(1, 1 - (e.poofTimer / (e.maxPoofTime || 0.16))));
        const swell = 1.0 + Math.sin(poofProgress * Math.PI * 0.85) * 0.42;
        ctx.scale(swell, swell);
      }

      // Boss on its last legs: light bleeds out of the cracks before it breaks.
      if (e.isBoss && !e.isImmortalDummy && e.maxHp > 0 && e.hp / e.maxHp < 0.3) {
        const pulse = 0.5 + 0.5 * Math.sin(e.animTime * 10);
        const r = Math.max(e.width, e.height) * 1.0;
        ctx.save();
        ctx.globalAlpha = 0.26 + 0.30 * pulse;
        const glow = ctx.createRadialGradient(0, -e.height * 0.5, 4, 0, -e.height * 0.5, r);
        glow.addColorStop(0, 'rgba(255,255,255,0.95)');
        glow.addColorStop(0.45, `rgba(248,113,113,${0.5 + 0.3 * pulse})`);
        glow.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, -e.height * 0.5, r, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 6; i++) {
          const rise = ((e.animTime * 0.7 + i * 1.63) % 1);
          ctx.globalAlpha = (1 - rise) * 0.9;
          ctx.fillStyle = i % 2 ? '#fde68a' : '#ffffff';
          ctx.beginPath();
          ctx.arc(Math.sin(i * 2.3 + e.animTime * 1.4) * r * 0.55, -rise * e.height - 4, 1.8 + (1 - rise) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Menacing Boss Threat Aura (pulsing dark-crimson/gem corona + jagged corruption spikes + windup danger ring)
      if (e.isBoss && !e.isImmortalDummy) {
        const threatPulse = 0.5 + 0.5 * Math.sin((e.animTime || 0) * (e.phase2 ? 10 : 5.5));
        const auraR = Math.max(e.width || 150, e.height || 150) * (0.76 + threatPulse * 0.16);
        ctx.save();
        const bGlow = ctx.createRadialGradient(0, -e.height * 0.45, 8, 0, -e.height * 0.45, auraR);
        bGlow.addColorStop(0, e.phase2 ? 'rgba(239, 68, 68, 0.42)' : 'rgba(168, 85, 247, 0.28)');
        bGlow.addColorStop(0.6, e.gemColor ? `${e.gemColor}38` : 'rgba(127, 29, 29, 0.24)');
        bGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bGlow;
        ctx.beginPath();
        ctx.arc(0, -e.height * 0.45, auraR, 0, Math.PI * 2);
        ctx.fill();

        // Jagged oscillating corruption spikes radiating behind terrifying bosses
        const spikeCount = e.phase2 ? 12 : 8;
        ctx.strokeStyle = e.phase2 ? 'rgba(248, 113, 113, 0.65)' : 'rgba(192, 132, 252, 0.45)';
        ctx.lineWidth = e.phase2 ? 2.4 : 1.7;
        ctx.beginPath();
        for (let sp = 0; sp < spikeCount; sp++) {
          const ang = (Math.PI * 2 * sp) / spikeCount + (e.animTime || 0) * (e.phase2 ? 1.4 : 0.7);
          const innerR = auraR * 0.52;
          const outerR = auraR * (0.78 + 0.18 * Math.sin((e.animTime || 0) * 8 + sp * 1.9));
          ctx.moveTo(Math.cos(ang) * innerR, -e.height * 0.45 + Math.sin(ang) * innerR);
          ctx.lineTo(Math.cos(ang) * outerR, -e.height * 0.45 + Math.sin(ang) * outerR);
        }
        ctx.stroke();

        // Readable crimson danger ring during boss attack windup telegraph!
        if (e.windup && e.windup > 0) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.ellipse(0, -4, (e.width || 120) * 0.85, 16, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (!e.isImmortalDummy) {
        // Corrupted Gem Minion eerie miasma rim + subtle windup warning glint
        ctx.save();
        const mR = Math.max(e.width || 48, e.height || 48) * 0.68;
        const mG = ctx.createRadialGradient(0, -e.height * 0.45, 4, 0, -e.height * 0.45, mR);
        mG.addColorStop(0, e.gemColor ? `${e.gemColor}30` : 'rgba(168,85,247,0.22)');
        mG.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = mG;
        ctx.beginPath();
        ctx.arc(0, -e.height * 0.45, mR, 0, Math.PI * 2);
        ctx.fill();
        if (e.windup && e.windup > 0) {
          ctx.strokeStyle = 'rgba(248, 113, 113, 0.85)';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(0, -e.height * 0.5, mR * 0.72, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Sinister Corruption Miasma & Frenzy Veins under real-scale monster
      this.drawCorruptedAura(ctx, e);

      const vScale = e.visualScale || (e.isBoss ? 1.35 : 1.48);

      // Draw base enemy scaled to menacing real-enemy height next to players
      ctx.save();
      ctx.scale(vScale, vScale);
      this.drawEnemyModel(ctx, e);
      ctx.restore();

      // Terrifying Hard-Light Corruption Fractures, Ground Fissures & Orbiting Boss Shards
      if (!e.isImmortalDummy) {
        const hpRatio = e.maxHp > 0 ? (e.hp / e.maxHp) : 1;
        const animT = e.animTime || 0;
        if (e.isBoss) {
          ctx.save();
          // Ground fissure cracks radiating under towering bosses
          ctx.strokeStyle = e.phase2 ? 'rgba(239, 68, 68, 0.72)' : 'rgba(168, 85, 247, 0.55)';
          ctx.lineWidth = e.phase2 ? 2.4 : 1.7;
          ctx.beginPath();
          for (let f = -2; f <= 2; f++) {
            const fx = f * 24;
            ctx.moveTo(fx, 0);
            ctx.lineTo(fx + (f % 2 === 0 ? 10 : -10), 6);
            ctx.lineTo(fx + f * 7, 12);
          }
          ctx.stroke();

          // Orbiting jagged corrupted gem shards around boss
          const shardCount = e.phase2 ? 5 : 3;
          for (let si = 0; si < shardCount; si++) {
            const ang = animT * (e.phase2 ? 3.2 : 1.8) + (si * Math.PI * 2) / shardCount;
            const rx = Math.cos(ang) * ((e.width || 110) * 0.68);
            const ry = -e.height * 0.5 + Math.sin(ang) * ((e.height || 110) * 0.28);
            ctx.fillStyle = e.phase2 ? '#f43f5e' : (e.gemColor || '#a855f7');
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(rx, ry - 7); ctx.lineTo(rx + 5, ry); ctx.lineTo(rx, ry + 7); ctx.lineTo(rx - 5, ry);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Glitching hard-light corruption fractures across Phase-2 / damaged bosses
          if (e.phase2 || hpRatio < 0.65) {
            ctx.strokeStyle = e.phase2 ? 'rgba(254, 202, 202, 0.82)' : 'rgba(233, 213, 255, 0.62)';
            ctx.lineWidth = 1.8;
            const jitter = Math.sin(animT * 28) * 3;
            ctx.beginPath();
            ctx.moveTo(-18 + jitter, -e.height * 0.72);
            ctx.lineTo(-4, -e.height * 0.55);
            ctx.lineTo(-14 + jitter, -e.height * 0.36);
            ctx.moveTo(16 - jitter, -e.height * 0.64);
            ctx.lineTo(6, -e.height * 0.44);
            ctx.lineTo(20 - jitter, -e.height * 0.26);
            ctx.stroke();
          }
          ctx.restore();
        } else if (hpRatio < 0.65) {
          // Flickering neon corruption cracks on wounded corrupted minions
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-8, -e.height * 0.65);
          ctx.lineTo(2, -e.height * 0.48);
          ctx.lineTo(-4, -e.height * 0.30);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 1: IMPACT FLASH & BALLOON POP (Fighting Style Guide)
      // Flash ONLY the exact silhouette of the enemy using an isolated offscreen canvas mask (no square box!)
      if (e.isPoofing || e.hurtTimer > 0.16) {
        if (!this.flashCanvas && typeof document !== 'undefined') {
          try {
            this.flashCanvas = document.createElement('canvas');
            this.flashCanvas.width = 640;
            this.flashCanvas.height = 640;
            this.flashCtx = this.flashCanvas.getContext('2d');
          } catch (err) {
            this.flashCanvas = null;
            this.flashCtx = null;
          }
        }
        if (this.flashCanvas && this.flashCtx) {
          const fc = this.flashCanvas;
          const fctx = this.flashCtx;
          const cx = 320;
          const cy = 440;

          // Localized bounding box for zero-lag CPU/GPU processing
          const halfW = Math.min(300, Math.ceil(Math.max((e.width || 60) * 1.45, 95)));
          const topH = Math.min(410, Math.ceil(Math.max((e.height || 60) * 1.45, 115)));
          const botH = 35;
          const boxW = halfW * 2;
          const boxH = topH + botH;
          const sx = cx - halfW;
          const sy = cy - topH;

          // Clear and fill ONLY the localized sub-rect
          fctx.clearRect(sx, sy, boxW, boxH);
          fctx.save();
          fctx.translate(cx, cy);
          fctx.scale(vScale, vScale);
          this.drawEnemyModel(fctx, e);
          fctx.globalCompositeOperation = 'source-in';
          fctx.fillStyle = e.isPoofing ? '#ffffff' : 'rgba(255, 255, 255, 0.92)';
          fctx.fillRect(-halfW, -topH, boxW, boxH);
          fctx.restore();

          // Blit only the localized sub-rect cleanly onto main canvas
          ctx.drawImage(fc, sx, sy, boxW, boxH, -halfW, -topH, boxW, boxH);
        }
      }

      // Boss Breakout Burst visual shockwave
      if (e.breakoutBurstTimer > 0) {
        ctx.save();
        const p = 1 - (e.breakoutBurstTimer / 0.45);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 4 * (1 - p);
        ctx.beginPath();
        ctx.arc(0, -e.height / 2, (e.width || 60) * (0.8 + p * 2), 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2 * (1 - p);
        ctx.beginPath();
        ctx.arc(0, -e.height / 2, (e.width || 60) * (0.6 + p * 1.5), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Elevated Leap windup telegraph indicator
      if (e.isLeapWindup) {
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, (e.width || 50) * 0.7, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (!e.isPoofing) {
        this.drawHealthBar(ctx, e);
      }
      ctx.restore();

      // Freebuff readability layer: elite aura + wind-up warning
      this.drawAITelegraph(ctx, e);
    }
    ctx.restore();
  }

  drawAITelegraph(ctx, e) {
    if (e.isElite) {
      ctx.save();
      ctx.globalAlpha = 0.30 + 0.15 * Math.sin(e.animTime * 6);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y - e.height / 2, Math.max(28, e.width * 0.75), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (e.windup > 0 && e.windupMax > 0) {
      const progress = 1 - (e.windup / e.windupMax);
      ctx.save();
      ctx.globalAlpha = 0.55 + 0.4 * Math.sin(e.animTime * 20);
      ctx.strokeStyle = e.phase2 ? '#f97316' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y - e.height - 26, 12 + progress * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = e.phase2 ? '#f97316' : '#ef4444';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', e.x, e.y - e.height - 26);

      // Distinct enemy eye-gleam spark indicator
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(e.x + e.facing * 14, e.y - e.height * 0.72, 4 + progress * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- CEL-HORROR HELPERS FOR CORRUPTED GEMS & MONSTERS ---
  drawCorruptedAura(ctx, e) {
    if (e.isImmortalDummy) return;
    const t = e.animTime || 0;
    const h = e.height || 80;
    const w = e.width || 70;
    const danger = e.windup > 0 || e.isFrenzied || e.phase2 || e.burstTimer > 0;
    ctx.save();
    // Dark jagged corruption tendril spikes pulsing around enemy silhouette
    const col = e.isFrenzied ? '#ef4444' : (e.gemColor || '#a855f7');
    ctx.globalAlpha = danger ? 0.34 : 0.16;
    const auraG = ctx.createRadialGradient(0, -h * 0.45, 4, 0, -h * 0.45, Math.max(w, h) * 0.85);
    auraG.addColorStop(0, col);
    auraG.addColorStop(0.55, 'rgba(15, 23, 42, 0.5)');
    auraG.addColorStop(1, 'transparent');
    ctx.fillStyle = auraG;
    ctx.beginPath();
    ctx.arc(0, -h * 0.45, Math.max(w, h) * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Jagged flickering corruption lightning arcs when winding up, frenzied, or bursting
    if (danger) {
      ctx.globalAlpha = 0.72 + 0.25 * Math.sin(t * 20);
      ctx.strokeStyle = e.isFrenzied ? '#fca5a5' : col;
      ctx.lineWidth = 2;
      for (let k = 0; k < 4; k++) {
        const ang = t * 5 + k * (Math.PI / 2);
        const rx = Math.cos(ang) * (w * 0.45);
        const ry = -h * 0.48 + Math.sin(ang) * (h * 0.38);
        ctx.beginPath();
        ctx.moveTo(rx * 0.7, ry);
        ctx.lineTo(rx * 1.15, ry - 8);
        ctx.lineTo(rx * 1.32, ry + 5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawCrackedCorruptionGem(ctx, cx, cy, r, coreCol, rimCol) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = coreCol;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.85, -r * 0.2);
    ctx.lineTo(r * 0.55, r * 0.9);
    ctx.lineTo(-r * 0.65, r * 0.85);
    ctx.lineTo(-r * 0.9, -r * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner bright facet & jagged black corruption fracture seams
    ctx.fillStyle = rimCol || '#ffffff';
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.7);
    ctx.lineTo(r * 0.45, -r * 0.1);
    ctx.lineTo(0, r * 0.3);
    ctx.lineTo(-r * 0.4, -r * 0.15);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.5);
    ctx.lineTo(0, 0);
    ctx.lineTo(r * 0.5, r * 0.4);
    ctx.moveTo(0, 0);
    ctx.lineTo(-r * 0.3, r * 0.65);
    ctx.stroke();
    ctx.restore();
  }

  drawHorrorFangs(ctx, x, y, count, totalW, toothH, dirY = 1) {
    ctx.save();
    ctx.fillStyle = '#fef9c3';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    const step = totalW / count;
    for (let i = 0; i < count; i++) {
      const fx = x + i * step;
      const h = (i === 0 || i === count - 1) ? toothH * 1.3 : toothH;
      ctx.beginPath();
      ctx.moveTo(fx, y);
      ctx.lineTo(fx + step * 0.5, y + h * dirY);
      ctx.lineTo(fx + step, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- AERIAL & FLYING CORRUPTED GEMS DRAWINGS ---
  drawWingedCentipeetle(ctx, e) {
    const wingFlap = Math.sin(e.animTime * 24) * 14;

    // Two pairs of veined emerald insect wings, beating out of phase
    const drawWing = (rootX, rootY, dir, len, alpha) => {
      ctx.save();
      ctx.translate(rootX, rootY);
      ctx.rotate(dir * (0.35 + wingFlap * 0.012));
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
      ctx.strokeStyle = '#dcfce7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * len * 0.55, -len * 0.55, dir * len, -len * 0.12);
      ctx.quadraticCurveTo(dir * len * 0.62, len * 0.16, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Wing vein
      ctx.strokeStyle = 'rgba(240, 253, 244, 0.75)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * len * 0.5, -len * 0.3, dir * len * 0.95, -len * 0.1);
      ctx.stroke();
      ctx.restore();
    };
    drawWing(-2, -34, -1, 30, 0.60);
    drawWing(6, -36, 1, 28, 0.52);

    // Segmented Armored Chitin Thorax with Dorsal Spikes
    ctx.fillStyle = '#052e16';
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 1.6;
    for (const [sx, sy, sr] of [[-16, -16, 11], [0, -21, 13.5], [15, -24, 15.5]]) {
      ctx.beginPath();
      ctx.ellipse(sx, sy, sr, sr * 0.85, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.moveTo(sx - 3, sy - sr * 0.78);
      ctx.lineTo(sx - 6, sy - sr * 1.45);
      ctx.lineTo(sx + 4, sy - sr * 0.78);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#052e16';
    }

    // Serrated Acid Mandibles + Dripping Maw Fangs
    ctx.fillStyle = '#86efac';
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(22, -28);
    ctx.lineTo(36, -34);
    ctx.lineTo(29, -25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(22, -18);
    ctx.lineTo(36, -12);
    ctx.lineTo(28, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    this.drawHorrorFangs(ctx, 18, -22, 3, 12, 5, 1);

    // Cracked Glowing Cyclops Corruption Eye-Gem
    this.drawCrackedCorruptionGem(ctx, 19, -24, 7.5, '#22c55e', '#dcfce7');
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(21, -24, 1.4, 4.2, 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSpireHarpy(ctx, e) {
    const wingFlap = Math.sin(e.animTime * 20) * 16;

    // Celestial Iridescent Feathered Wings
    ctx.fillStyle = 'rgba(6, 182, 212, 0.75)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(-25, -55 + wingFlap, -45, -40 + wingFlap, -35, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(25, -55 - wingFlap, 45, -40 - wingFlap, 35, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Body, Raptor Claw Talons & Crooked Fanged Beak
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -19, 14, 16, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Sharp wingtip claws
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, -5); ctx.lineTo(-10, 3);
    ctx.moveTo(6, -5); ctx.lineTo(10, 3);
    ctx.stroke();

    // Hooked Screaming Beak + Jagged Fangs
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(8, -23);
    ctx.lineTo(27, -18);
    ctx.lineTo(22, -12);
    ctx.lineTo(8, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    this.drawHorrorFangs(ctx, 10, -16, 3, 12, 4.5, 1);

    // Predator Slit Eye + Cracked Cyan Forehead Corruption Gem
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(8, -22, 3.6, 2.2, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(8.8, -22, 0.9, 2.1, 0, 0, Math.PI * 2);
    ctx.fill();
    this.drawCrackedCorruptionGem(ctx, -1, -28, 6.2, '#06b6d4', '#cffafe');
  }

  drawVolcanicFirebird(ctx, e) {
    const flap = Math.sin(e.animTime * 12) * 0.45;
    const gy = -30 + Math.sin(e.animTime * 3) * 2;

    // Tail feathers (molten)
    ctx.fillStyle = '#c2410c';
    for (let i = -1; i <= 1; i++) {
      ctx.save();
      ctx.translate(-14, gy + 4);
      ctx.rotate(0.5 + i * 0.28);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, -3 + i * 2);
      ctx.lineTo(-2, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Wings
    ctx.save();
    ctx.translate(-4, gy - 2);
    ctx.rotate(-0.3 + flap);
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-16, -16);
    ctx.lineTo(-4, -4);
    ctx.lineTo(-12, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(4, gy - 4);
    ctx.rotate(0.25 - flap);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(18, -14);
    ctx.lineTo(6, -2);
    ctx.lineTo(16, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Charred Volcanic Body + Crowned Fiend Head
    ctx.fillStyle = '#450a0a';
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, gy + 6, 13.5, 10, 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(9, gy - 5, 7.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cracked Magma Heart Gem + Pulsing Fissures
    this.drawCrackedCorruptionGem(ctx, 1, gy + 6, 6.5, '#f97316', '#fef08a');

    // Screaming Hooked Beak + Predator Slit Eye + Ember Horn Crest
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(14, gy - 8);
    ctx.lineTo(24, gy - 3);
    ctx.lineTo(14, gy + 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    this.drawHorrorFangs(ctx, 14, gy - 3, 2, 7, 3.5, 1);

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(10.5, gy - 7, 2.8, 1.8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.ellipse(11, gy - 7, 0.8, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawIceGargoyle(ctx, e) {
    const wingFlap = Math.sin(e.animTime * 18) * 14;

    // Jagged Bat-Crystal Wings with Bone Spurs
    ctx.fillStyle = 'rgba(14, 165, 233, 0.78)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(-36, -54 + wingFlap);
    ctx.lineTo(-26, -28 + wingFlap * 0.4);
    ctx.lineTo(-16, -12);
    ctx.lineTo(16, -12);
    ctx.lineTo(26, -28 - wingFlap * 0.4);
    ctx.lineTo(36, -54 - wingFlap);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Obsidian Gargoyle Body + Jagged Ice Horns
    ctx.fillStyle = '#082f49';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-14, -12);
    ctx.lineTo(-17, -28);
    ctx.lineTo(0, -34);
    ctx.lineTo(17, -28);
    ctx.lineTo(14, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(-9, -30); ctx.lineTo(-19, -46); ctx.lineTo(-3, -32);
    ctx.moveTo(9, -30); ctx.lineTo(19, -46); ctx.lineTo(3, -32);
    ctx.fill();

    // Cracked Chest Corruption Gem, Predator Eyes & Snarling Fanged Maw
    this.drawCrackedCorruptionGem(ctx, 0, -21, 5.5, '#38bdf8', '#e0f2fe');
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(-5, -28, 2.6, 1.5, 0.4, 0, Math.PI * 2);
    ctx.ellipse(5, -28, 2.6, 1.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    this.drawHorrorFangs(ctx, -7, -15, 4, 14, 4.5, 1);
  }

  // --- SHOW-ACCURATE CORRUPTED GEMS DRAWINGS ---
  drawCentipeetleHatchling(ctx, e) {
    const legWiggle = Math.sin(e.animTime * 15) * 5;
    const bob = Math.sin(e.animTime * 7) * 2;
    const isFrenzied = e.isFrenzied || e.windup > 0;

    // Articulated Insectoid Scythe Legs (6 menacing chitin limbs)
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    for (let idx = 0; idx < 4; idx++) {
      const lx = -16 + idx * 10;
      const wg = (idx % 2 === 0 ? legWiggle : -legWiggle);
      ctx.beginPath();
      ctx.moveTo(lx, -18 + bob);
      ctx.lineTo(lx - 7, -8 + bob + wg * 0.4);
      ctx.lineTo(lx - 3, 0);
      ctx.stroke();
    }

    // Segmented Armored Chitin Thorax with Dorsal Spikes
    const segs = [{ x: -18, y: -19, r: 12 }, { x: -4, y: -24, r: 14.5 }, { x: 11, y: -28, r: 16 }];
    for (const s of segs) {
      ctx.fillStyle = '#052e16';
      ctx.beginPath();
      ctx.ellipse(s.x, s.y + bob, s.r, s.r * 0.85, -0.15, 0, Math.PI * 2);
      ctx.fill();
      // Acid-green chitin plate highlight + razor dorsal spine
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(s.x - 1, s.y - 3 + bob, s.r * 0.72, s.r * 0.45, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4ade80';
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x - 4, s.y - s.r * 0.7 + bob);
      ctx.lineTo(s.x - 10, s.y - s.r * 1.45 + bob);
      ctx.lineTo(s.x + 3, s.y - s.r * 0.75 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Twin Venom-Dripping Pincher Mandibles
    ctx.fillStyle = '#86efac';
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(22, -36 + bob); ctx.quadraticCurveTo(38, -42 + bob, 36, -29 + bob); ctx.lineTo(24, -30 + bob); ctx.closePath();
    ctx.moveTo(22, -20 + bob); ctx.quadraticCurveTo(38, -14 + bob, 36, -24 + bob); ctx.lineTo(24, -24 + bob); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Terrifying Cyclops Corrupted Gem-Eye w/ Dark Veins & Snake Slit!
    this.drawCrackedCorruptionGem(ctx, 21, -28 + bob, 11.5, isFrenzied ? '#ef4444' : '#22c55e', '#dcfce7');
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.ellipse(23.5, -28 + bob, 2.4, 7.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(24.5, -31 + bob, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMotherCentipeetle(ctx, e) {
    const breathe = Math.sin(e.animTime * 4) * 3.5;
    const legSkitter = Math.sin(e.animTime * 10) * 6;
    const isDanger = e.windup > 0 || e.phase2;

    // 6 Heavy Chitinous Scythe Legs
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const lx = -48 + i * 16;
      const wg = (i % 2 === 0 ? legSkitter : -legSkitter);
      ctx.beginPath();
      ctx.moveTo(lx, -34 + breathe * 0.5);
      ctx.lineTo(lx - 14, -14 + wg * 0.4);
      ctx.lineTo(lx - 6, 0);
      ctx.stroke();
    }

    // Towering 4-Segment Armored Centipeetle Brood Queen Body
    const humps = [
      { x: -52, y: -48, rx: 28, ry: 24 },
      { x: -20, y: -58, rx: 35, ry: 30 },
      { x: 16, y: -66, rx: 40, ry: 35 },
      { x: 50, y: -66, rx: 32, ry: 30 }
    ];
    for (const h of humps) {
      ctx.fillStyle = '#052e16';
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + breathe, h.rx, h.ry, -0.1, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // Bright acidic carapace ridge
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(h.x - 4, h.y - h.ry * 0.42 + breathe, h.rx * 0.65, h.ry * 0.36, -0.1, 0, Math.PI * 2);
      ctx.fill();
      // Jagged dorsal acid horns
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.moveTo(h.x - 6, h.y - h.ry * 0.85 + breathe);
      ctx.lineTo(h.x - 16, h.y - h.ry * 1.45 + breathe);
      ctx.lineTo(h.x + 8, h.y - h.ry * 0.9 + breathe);
      ctx.closePath();
      ctx.fill();
    }

    // Huge Crushing Acid-Dripping Mandible Jaws + Fangs
    ctx.fillStyle = '#022c22';
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(64, -84 + breathe); ctx.quadraticCurveTo(96, -98 + breathe, 102, -68 + breathe); ctx.lineTo(74, -68 + breathe); ctx.closePath();
    ctx.moveTo(64, -48 + breathe); ctx.quadraticCurveTo(96, -34 + breathe, 102, -62 + breathe); ctx.lineTo(74, -62 + breathe); ctx.closePath();
    ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, 62, -68 + breathe, 4, 24, 9, 1);

    // Massive Fractured Acid Cyclops Gem Eye!
    this.drawCrackedCorruptionGem(ctx, 60, -66 + breathe, 21, isDanger ? '#f43f5e' : '#22c55e', '#dcfce7');
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.ellipse(64, -66 + breathe, 4.5, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(66, -71 + breathe, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCorruptedQuartzBeast(ctx, e) {
    const bob = Math.sin(e.animTime * 6) * 4;
    const isDanger = e.windup > 0 || e.phase2 || e.isFrenzied;

    // Hulking Clawed Beast Legs
    ctx.fillStyle = '#0c4a6e';
    ctx.beginPath();
    ctx.roundRect(-42, -26, 18, 26, 5);
    ctx.roundRect(-14, -22, 16, 22, 5);
    ctx.roundRect(14, -26, 20, 26, 5);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    for (const cx of [-40, -12, 18]) {
      ctx.beginPath();
      ctx.moveTo(cx, -2); ctx.lineTo(cx + 5, 3); ctx.lineTo(cx + 10, -2);
      ctx.closePath(); ctx.fill();
    }

    // Massive Muscular Hunched Quartz Beast Torso w/ Darker Cel Under-Belly
    const grad = ctx.createLinearGradient(0, -82 + bob, 0, -14 + bob);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.55, '#0369a1');
    grad.addColorStop(1, '#082f49');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-48, -22 + bob);
    ctx.bezierCurveTo(-56, -54 + bob, -30, -84 + bob, 8, -82 + bob);
    ctx.lineTo(44, -66 + bob);
    ctx.bezierCurveTo(50, -38 + bob, 32, -16 + bob, -48, -22 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Jagged Quartz Tiger Stripes & Razor Dorsal Crystal Spines
    ctx.fillStyle = '#0f172a';
    for (let sx = -32; sx <= 16; sx += 16) {
      ctx.beginPath();
      ctx.moveTo(sx, -72 + bob);
      ctx.lineTo(sx + 6, -42 + bob);
      ctx.lineTo(sx - 4, -38 + bob);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.6;
    for (let x = -42; x <= 26; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, -72 + bob);
      ctx.lineTo(x - 6, -104 + bob);
      ctx.lineTo(x + 12, -70 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Ferocious Snarling Head, Giant Curved Horns & Jaws!
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(38, -62 + bob, 24, 21, -0.15, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Gaping maw + razor fangs
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.ellipse(46, -52 + bob, 14, 9, 0.1, 0, Math.PI * 2);
    ctx.fill();
    this.drawHorrorFangs(ctx, 34, -58 + bob, 5, 24, 8, 1);
    this.drawHorrorFangs(ctx, 36, -44 + bob, 4, 20, 7, -1);

    // Glowing Amber-Red Slit Predator Eye & Sweeping Curved Horn
    ctx.fillStyle = isDanger ? '#ef4444' : '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(40, -68 + bob, 6.5, 4.5, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.ellipse(41, -68 + bob, 1.8, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(28, -80 + bob);
    ctx.quadraticCurveTo(54, -118 + bob, 16, -122 + bob);
    ctx.stroke();

    // Fractured Ocean-Jasper Corruption Core
    this.drawCrackedCorruptionGem(ctx, 4, -50 + bob, 11, '#38bdf8', '#ffffff');
  }

  drawClusterMutant(ctx, e) {
    const wob = Math.sin(e.animTime * 9) * 3.5;
    const wob2 = Math.cos(e.animTime * 7) * 3;
    const reach = Math.sin(e.animTime * 6) * 5;

    // Ghostly Grasping Severed Shard-Arms clawing outward!
    ctx.strokeStyle = '#3b0764';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    const arms = [
      { sx: -16, sy: -26, ex: -32 - reach, ey: -40 + wob },
      { sx: 14, sy: -24, ex: 34 + reach, ey: -36 - wob2 },
      { sx: -6, sy: -32, ex: -14 + reach, ey: -52 + wob }
    ];
    for (const a of arms) {
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy + wob);
      ctx.quadraticCurveTo((a.sx + a.ex) * 0.5, a.ey - 6, a.ex, a.ey);
      ctx.stroke();
      // Wicked finger claws
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(a.ex, a.ey); ctx.lineTo(a.ex + 4, a.ey - 6); ctx.lineTo(a.ex + 6, a.ey + 1);
      ctx.closePath(); ctx.fill();
    }

    // Crawling Twisted Legs
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.moveTo(-16, -6); ctx.lineTo(-20, 0); ctx.lineTo(-9, 0); ctx.lineTo(-6, -6);
    ctx.moveTo(8, -6); ctx.lineTo(14, 0); ctx.lineTo(24, 0); ctx.lineTo(18, -6);
    ctx.fill();

    // Distorted Forced-Fusion Body-Horror Torso Mass
    const grad = ctx.createRadialGradient(0, -24, 4, 0, -22, 34);
    grad.addColorStop(0, '#7e22ce');
    grad.addColorStop(0.65, '#4c1d95');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-26, -3);
    ctx.bezierCurveTo(-34, -20 + wob, -24, -40 - wob2, -4, -42 + wob);
    ctx.bezierCurveTo(16, -44 - wob, 32, -28 + wob2, 28, -5);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Exposed Jagged Mismatched Gem Shards
    this.drawCrackedCorruptionGem(ctx, -14, -20 + wob, 8, '#f43f5e', '#fecdd3');
    this.drawCrackedCorruptionGem(ctx, 4, -27 + wob2, 9, '#38bdf8', '#e0f2fe');
    this.drawCrackedCorruptionGem(ctx, 16, -15 - wob, 7.5, '#fbbf24', '#fef9c3');

    // Multiple Uneven Staring Bloodshot Eyes + Jagged Grin
    const eyes = [{ x: -8, y: -33 + wob, r: 4.5 }, { x: 8, y: -34 - wob2, r: 3.4 }, { x: 0, y: -15 + wob, r: 2.8 }];
    for (const ey of eyes) {
      ctx.fillStyle = '#fef2f2';
      ctx.beginPath(); ctx.arc(ey.x, ey.y, ey.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = e.isFrenzied ? '#dc2626' : '#311042';
      ctx.beginPath(); ctx.arc(ey.x + 1, ey.y, ey.r * 0.48, 0, Math.PI * 2); ctx.fill();
    }
    this.drawHorrorFangs(ctx, -8, -11 + wob, 4, 18, 5, 1);
  }

  drawCorruptedJasper(ctx, e) {
    const bob = Math.sin(e.animTime * 6) * 3.5;
    const isDanger = e.windup > 0 || e.phase2 || e.isFrenzied;

    // Holographic Cyan Dojo Ring on Immortal Practice Dummy
    if (e.isImmortalDummy) {
      ctx.save();
      const scanY = -45 + Math.sin(Date.now() / 180) * 42;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, scanY, 50, 10, 0, 0, Math.PI * 2);
      else ctx.arc(0, scanY, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, -45 + bob, 48, 52, 0, 0, Math.PI * 2);
      else ctx.arc(0, -45 + bob, 48, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Clawed Beast Forelimbs & Haunches
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.roundRect(-36, -24, 18, 24, 5);
    ctx.roundRect(14, -26, 20, 26, 5);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    for (const cx of [-34, 18, 26]) {
      ctx.beginPath(); ctx.moveTo(cx, -2); ctx.lineTo(cx + 4, 4); ctx.lineTo(cx + 8, -2); ctx.closePath(); ctx.fill();
    }

    // Hulking Corrupted Orange & Teal-Striped Quartz Beast Mass
    const jGrad = ctx.createLinearGradient(0, -78 + bob, 0, -14 + bob);
    jGrad.addColorStop(0, '#ea580c');
    jGrad.addColorStop(0.55, '#c2410c');
    jGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = jGrad;
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-40, -18 + bob);
    ctx.bezierCurveTo(-48, -50 + bob, -26, -78 + bob, 12, -74 + bob);
    ctx.lineTo(40, -56 + bob);
    ctx.bezierCurveTo(44, -30 + bob, 26, -14 + bob, -40, -18 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Jagged Teal Corruption Tiger Stripes
    ctx.fillStyle = '#0f766e';
    for (let sx = -26; sx <= 16; sx += 14) {
      ctx.beginPath();
      ctx.moveTo(sx, -68 + bob); ctx.lineTo(sx + 8, -36 + bob); ctx.lineTo(sx - 2, -32 + bob);
      ctx.closePath(); ctx.fill();
    }

    // Giant Jagged White Bone Dorsal Spikes
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 1.4;
    for (let x = -34; x <= 18; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, -68 + bob);
      ctx.lineTo(x - 4, -98 + bob);
      ctx.lineTo(x + 10, -68 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Snarling Beast Head, Curved Ivory Horns & Cracked Nose Gem
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(34, -56 + bob, 22, 20, -0.1, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Fierce Maw & Fangs
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(42, -45 + bob, 12, 8, 0.1, 0, Math.PI * 2);
    ctx.fill();
    this.drawHorrorFangs(ctx, 31, -50 + bob, 4, 20, 7, 1);

    // Glowing Crimson/Gold Predator Eye
    ctx.fillStyle = isDanger ? '#ef4444' : '#fde047';
    ctx.beginPath();
    ctx.ellipse(34, -63 + bob, 5.5, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.ellipse(35, -63 + bob, 1.5, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose Cracked Jasper Diamond Gem
    this.drawCrackedCorruptionGem(ctx, 48, -54 + bob, 7.5, '#b91c1c', '#fca5a5');

    // Huge Sweeping Ram Horn
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(24, -73 + bob);
    ctx.quadraticCurveTo(50, -108 + bob, 16, -106 + bob);
    ctx.stroke();
  }

  drawBladeQuartz(ctx, e) {
    const bob = Math.sin(e.animTime * 5) * 2;
    const lean = Math.sin(e.animTime * 3) * 1.5;

    // 1. Sculpted Clawed Muscular Haunches
    ctx.fillStyle = '#4c0519';
    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 1.6;
    for (const hx of [-10, 10]) {
      ctx.beginPath();
      ctx.moveTo(hx - 6, -18 + bob);
      ctx.lineTo(hx + 6, -18 + bob);
      ctx.lineTo(hx + 7, 0);
      ctx.lineTo(hx - 7, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 2. Hunched, corrupted Quartz torso with stripes
    const bodyGrad = ctx.createLinearGradient(0, -48 + bob, 0, -18 + bob);
    bodyGrad.addColorStop(0, '#9f1239');
    bodyGrad.addColorStop(0.6, '#881337');
    bodyGrad.addColorStop(1, '#4c0519');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-18, -18 + bob);
    ctx.lineTo(-15, -42 + bob + lean);
    ctx.quadraticCurveTo(0, -50 + bob + lean, 16, -42 + bob + lean);
    ctx.lineTo(18, -18 + bob);
    ctx.closePath();
    ctx.fill();

    // Quartz tiger stripes across torso
    ctx.fillStyle = '#e11d48';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-12, -34 + bob + i * 6);
      ctx.lineTo(-4, -30 + bob + i * 6);
      ctx.lineTo(-8, -26 + bob + i * 6);
      ctx.closePath();
      ctx.fill();
    }

    // Corrupted Quartz spines along spine
    ctx.fillStyle = '#fb7185';
    ctx.strokeStyle = '#ffe4e6';
    ctx.lineWidth = 1;
    for (let s = -12; s <= 4; s += 8) {
      ctx.beginPath();
      ctx.moveTo(s, -44 + bob + lean);
      ctx.lineTo(s - 3, -56 + bob + lean);
      ctx.lineTo(s + 3, -44 + bob + lean);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // 3. Cracked Corrupted Quartz Gem on Shoulder
    this.drawCrackedCorruptionGem(ctx, -5, -32 + bob, 7.2, '#f43f5e', '#ffe4e6');

    // 4. Snarling Corrupted Quartz Skull-Mask & Slit Eye
    ctx.fillStyle = '#9f1239';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-9, -45 + bob + lean);
    ctx.lineTo(9, -56 + bob + lean);
    ctx.lineTo(19, -45 + bob + lean);
    ctx.lineTo(14, -34 + bob + lean);
    ctx.lineTo(-2, -35 + bob + lean);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jagged Beast Fangs in Open Jaw
    this.drawHorrorFangs(ctx, 4, -38 + bob + lean, 4, 13, 5, 1);

    // Glowing Corrupted Amber Predator Slit Eye
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(6.5, -45 + bob + lean, 4.2, 2.5, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(7.2, -45 + bob + lean, 1.1, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Massive Faceted Rose Quartz Blade Forearm (titular weapon)
    const bladeGrad = ctx.createLinearGradient(12, -40 + bob, 42, -56 + bob);
    bladeGrad.addColorStop(0, '#f43f5e');
    bladeGrad.addColorStop(0.5, '#fb7185');
    bladeGrad.addColorStop(1, '#fff1f2');
    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(14, -36 + bob);
    ctx.lineTo(26, -30 + bob);
    ctx.lineTo(44, -58 + bob);
    ctx.lineTo(28, -26 + bob);
    ctx.lineTo(16, -24 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crystalline central ridge on the greatsword blade
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(20, -32 + bob);
    ctx.lineTo(43, -57 + bob);
    ctx.stroke();
  }

  drawIceMonster(ctx, e) {
    const bob = Math.sin(e.animTime * 5) * 2.5;
    const breathe = Math.sin(e.animTime * 3) * 1.5;
    const pulse = 0.5 + 0.5 * Math.sin(e.animTime * 4);

    // 1. Sculpted Glacial Beast Paws with Jagged Ice Claws
    ctx.fillStyle = '#0369a1';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.5;
    for (const px of [-17, 19]) {
      ctx.beginPath();
      ctx.moveTo(px - 6, -13 + bob);
      ctx.lineTo(px + 6, -13 + bob);
      ctx.lineTo(px + 8, -1);
      ctx.lineTo(px - 7, -1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      this.drawHorrorFangs(ctx, px - 5, -2, 3, 12, 4.5, 1);
    }

    // 2. Glacial Faceted Torso
    const bodyGrad = ctx.createLinearGradient(0, -48 + bob, 0, -6 + bob);
    bodyGrad.addColorStop(0, '#e0f2fe');
    bodyGrad.addColorStop(0.35, '#7dd3fc');
    bodyGrad.addColorStop(0.7, '#0284c7');
    bodyGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-24, -14 + bob);
    ctx.lineTo(-28, -32 + bob);
    ctx.lineTo(-12, -44 + bob + breathe);
    ctx.lineTo(16, -42 + bob + breathe);
    ctx.lineTo(26, -24 + bob);
    ctx.lineTo(20, -10 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crystalline facet seams across flank
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-28, -32 + bob);
    ctx.lineTo(-4, -28 + bob);
    ctx.lineTo(16, -42 + bob + breathe);
    ctx.moveTo(-4, -28 + bob);
    ctx.lineTo(6, -14 + bob);
    ctx.stroke();

    // 3. Jagged Ice Spines on Back & Shoulders
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-20, -36 + bob);
    ctx.lineTo(-28, -54 + bob);
    ctx.lineTo(-14, -40 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-6, -44 + bob + breathe);
    ctx.lineTo(0, -62 + bob + breathe);
    ctx.lineTo(8, -42 + bob + breathe);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // 4. Cracked Corrupted Ice Gem Core on Chest
    this.drawCrackedCorruptionGem(ctx, -4, -26 + bob, 8.5, '#1d4ed8', '#bae6fd');

    // 5. Snarling Beast Head with Crystal Horns & Icicle Teeth
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(12, -40 + bob + breathe);
    ctx.lineTo(28, -46 + bob + breathe);
    ctx.lineTo(36, -34 + bob + breathe);
    ctx.lineTo(26, -26 + bob + breathe);
    ctx.lineTo(14, -30 + bob + breathe);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pointed Ice Ears
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(18, -45 + bob + breathe);
    ctx.lineTo(22, -58 + bob + breathe);
    ctx.lineTo(26, -45 + bob + breathe);
    ctx.closePath();
    ctx.fill();

    // Wicked Icicle Jaw Fangs
    this.drawHorrorFangs(ctx, 24, -33 + bob + breathe, 4, 13, 6.5, 1);

    // Glowing Predator Eye
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.arc(26, -38 + bob + breathe, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(26.5, -38 + bob + breathe, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawClusterTitan(ctx, e) {
    const bob = Math.sin(e.animTime * 5) * 4;
    const reach = Math.sin(e.animTime * 4) * 6;
    // Crawling twisted giant shard-arms with razor talons
    ctx.fillStyle = '#581c87';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 34, -52 + bob);
      ctx.quadraticCurveTo(sgn * 58, -42 + bob, sgn * 54, -8 + reach * sgn);
      ctx.lineTo(sgn * 40, -4 + reach * sgn);
      ctx.quadraticCurveTo(sgn * 38, -28 + bob, sgn * 24, -36 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Razor bone claws
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(sgn * 54, -4 + reach * sgn); ctx.lineTo(sgn * 60, 4); ctx.lineTo(sgn * 44, -2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#581c87';
    }

    // Gargantuan forced-fusion torso silhouette
    const tGrad = ctx.createRadialGradient(0, -52 + bob, 6, 0, -52 + bob, 60);
    tGrad.addColorStop(0, '#7e22ce');
    tGrad.addColorStop(0.6, '#4c1d95');
    tGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = tGrad;
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-42, -10 + bob);
    ctx.bezierCurveTo(-54, -46 + bob, -38, -86 + bob, 0, -86 + bob);
    ctx.bezierCurveTo(38, -86 + bob, 54, -46 + bob, 42, -10 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Jagged shattered fusion crystals erupting from shoulders & crown
    const shards = [
      { x: -30, y: -112, c: '#f43f5e' },
      { x: -8, y: -128, c: '#38bdf8' },
      { x: 16, y: -120, c: '#fbbf24' },
      { x: 35, y: -102, c: '#c084fc' }
    ];
    for (const s of shards) {
      ctx.fillStyle = s.c;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(s.x - 10, -76 + bob);
      ctx.lineTo(s.x, s.y + bob);
      ctx.lineTo(s.x + 10, -76 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Cracked fusion cores & mismatched screaming jaws
    this.drawCrackedCorruptionGem(ctx, -16, -54 + bob, 11, '#f43f5e', '#fecdd3');
    this.drawCrackedCorruptionGem(ctx, 18, -48 + bob, 10, '#38bdf8', '#e0f2fe');
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.ellipse(0, -34 + bob, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    this.drawHorrorFangs(ctx, -14, -39 + bob, 5, 28, 7, 1);
  }

  drawIceGuardian(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 3;
    const pulse = 0.5 + 0.5 * Math.sin(e.animTime * 6);

    // Towering glacial titan legs & frost armor
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.roundRect(-34, -26, 20, 26, 5);
    ctx.roundRect(14, -26, 20, 26, 5);
    ctx.fill();

    // Faceted Angular Ice Titan Torso
    const gGrad = ctx.createLinearGradient(0, -96 + bob, 0, -14 + bob);
    gGrad.addColorStop(0, '#7dd3fc');
    gGrad.addColorStop(0.5, '#0284c7');
    gGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = gGrad;
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-42, -16 + bob);
    ctx.lineTo(-56, -58 + bob);
    ctx.lineTo(-34, -92 + bob);
    ctx.lineTo(0, -98 + bob);
    ctx.lineTo(34, -92 + bob);
    ctx.lineTo(56, -58 + bob);
    ctx.lineTo(42, -16 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Wicked Towering Glacier Crown Horns
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.8;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 14, -88 + bob);
      ctx.lineTo(sgn * 48, -132 + bob);
      ctx.lineTo(sgn * 34, -84 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Cracked Sapphire Heart Core & Piercing Cryo Eyes
    this.drawCrackedCorruptionGem(ctx, 0, -52 + bob, 18, '#38bdf8', '#ffffff');
    ctx.fillStyle = e.windup > 0 ? '#ef4444' : `rgba(224, 242, 254, ${0.7 + 0.3 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(-16, -74 + bob); ctx.lineTo(-4, -71 + bob); ctx.lineTo(-14, -66 + bob); ctx.closePath();
    ctx.moveTo(16, -74 + bob); ctx.lineTo(4, -71 + bob); ctx.lineTo(14, -66 + bob); ctx.closePath();
    ctx.fill();
    this.drawHorrorFangs(ctx, -16, -64 + bob, 5, 32, 7, 1);
  }

  drawGemstone(ctx, x, y, color, shape) {
    ctx.save();
    const time = Date.now();
    const pulse = Math.sin(time / 180) * 3;

    // Show-Accurate Rose Bubble Encasing Gemstone
    ctx.fillStyle = 'rgba(255, 148, 186, 0.42)';
    ctx.beginPath();
    ctx.arc(x, y, 20 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 192, 203, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Bubble specular reflection arc
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(x, y, 16 + pulse * 0.8, -Math.PI * 0.68, -Math.PI * 0.28);
    ctx.stroke();

    if (shape === 'centipeetle' || shape === 'centipeetle_mother') {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#052e16';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = color || '#38bdf8';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 11);
      ctx.lineTo(x + 11, y);
      ctx.lineTo(x, y + 11);
      ctx.lineTo(x - 11, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x + 5, y);
      ctx.lineTo(x, y + 2);
      ctx.lineTo(x - 5, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawClusterCore(ctx, e) {
    const pulse = Math.sin(e.animTime * 6) * 5;
    // Writhing Spectral Horror Tendrils Reaching from the Core
    ctx.strokeStyle = '#581c87';
    ctx.lineWidth = 4;
    for (let t = 0; t < 6; t++) {
      const ang = (t * Math.PI * 2) / 6 + e.animTime * 0.7;
      const tipX = Math.cos(ang) * (66 + Math.sin(e.animTime * 4 + t) * 8);
      const tipY = -55 + Math.sin(ang) * (66 + Math.cos(e.animTime * 4 + t) * 8);
      ctx.beginPath();
      ctx.moveTo(0, -55);
      ctx.quadraticCurveTo(tipX * 0.55 + 10, tipY * 0.55 - 20, tipX, tipY);
      ctx.stroke();
    }

    // Cracked Pulsing Amalgamation Mass
    const massGrad = ctx.createRadialGradient(-10, -65, 8, 0, -55, 48 + pulse * 0.4);
    massGrad.addColorStop(0, '#c084fc');
    massGrad.addColorStop(0.55, '#6b21a8');
    massGrad.addColorStop(1, '#2e1065');
    ctx.fillStyle = massGrad;
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, -55, 45 + pulse * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Embedded Cracked Fusion Shard Eyes & Jagged Scream Fissure
    this.drawCrackedCorruptionGem(ctx, -16, -64, 10, '#f43f5e', '#ffe4e6');
    this.drawCrackedCorruptionGem(ctx, 16, -62, 10, '#38bdf8', '#e0f2fe');
    this.drawHorrorFangs(ctx, -16, -42, 5, 32, 8, 1);

    // Multicolored jagged crystal spikes protruding around perimeter
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#c084fc', '#4ade80'];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8 + e.animTime * 0.85;
      const sx = Math.cos(a) * (43 + pulse * 0.5);
      const sy = -55 + Math.sin(a) * (43 + pulse * 0.5);
      ctx.fillStyle = colors[i % colors.length];
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(a - 0.25) * 8, sy + Math.sin(a - 0.25) * 8);
      ctx.lineTo(sx + Math.cos(a) * 32, sy + Math.sin(a) * 32);
      ctx.lineTo(sx + Math.cos(a + 0.25) * 8, sy + Math.sin(a + 0.25) * 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  drawForgeGuardian(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 3;
    const glow = 0.65 + 0.35 * Math.sin(e.animTime * 8);
    // Heavy Piston Greaves
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(-28, -28, 20, 28, 4);
    ctx.roundRect(8, -28, 20, 28, 4);
    ctx.fill();

    // Monolithic Obsidian Forge Hull + Beveled Pauldrons
    const fGrad = ctx.createLinearGradient(0, -104 + bob, 0, -24 + bob);
    fGrad.addColorStop(0, '#44403c');
    fGrad.addColorStop(0.5, '#1c1917');
    fGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = fGrad;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-32, -26 + bob);
    ctx.lineTo(-44, -84 + bob);
    ctx.lineTo(-18, -104 + bob);
    ctx.lineTo(18, -104 + bob);
    ctx.lineTo(44, -84 + bob);
    ctx.lineTo(32, -26 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Molten Cracks & Furnace Core
    ctx.strokeStyle = `rgba(249, 115, 22, ${glow})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-24, -82 + bob); ctx.lineTo(-6, -62 + bob); ctx.lineTo(-20, -40 + bob);
    ctx.moveTo(22, -78 + bob); ctx.lineTo(6, -56 + bob); ctx.lineTo(18, -34 + bob);
    ctx.stroke();
    this.drawCrackedCorruptionGem(ctx, 0, -56 + bob, 13, '#ea580c', '#fde047');

    // Cyclops Molten Visor Slit
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-18, -90 + bob); ctx.lineTo(18, -90 + bob); ctx.lineTo(12, -82 + bob); ctx.lineTo(-12, -82 + bob);
    ctx.closePath(); ctx.fill();

    // Heavy Hydraulic Forge Hammer Fist!
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(28, -72 + bob, 26, 22, 4);
    ctx.roundRect(48, -86 + bob, 18, 50, 5);
    ctx.fill(); ctx.stroke();
  }

  drawAgateWarden(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 2.5;
    // Commanding Tapered Homeworld Officer Boots & Leggings
    ctx.fillStyle = '#0c4a6e';
    ctx.beginPath();
    ctx.roundRect(-16, -34, 12, 34, 4);
    ctx.roundRect(4, -34, 12, 34, 4);
    ctx.fill();

    // Angular Armored Holly Blue Cape & Officer Bodice
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(-22, -84 + bob); ctx.lineTo(22, -84 + bob); ctx.lineTo(28, -14 + bob); ctx.lineTo(-28, -14 + bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-22, -84 + bob); ctx.lineTo(22, -84 + bob); ctx.lineTo(14, -34 + bob); ctx.lineTo(-14, -34 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Dual Curved White Hair-Buns / Horns + Scowling Cel Face
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.6;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 10, -96 + bob);
      ctx.quadraticCurveTo(sgn * 38, -124 + bob, sgn * 36, -98 + bob);
      ctx.quadraticCurveTo(sgn * 24, -84 + bob, sgn * 14, -84 + bob);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, -92 + bob, 14, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Piercing furious eyes
    ctx.fillStyle = '#0c4a6e';
    ctx.beginPath();
    ctx.moveTo(-10, -96 + bob); ctx.lineTo(-2, -93 + bob); ctx.lineTo(-8, -90 + bob); ctx.closePath();
    ctx.moveTo(10, -96 + bob); ctx.lineTo(2, -93 + bob); ctx.lineTo(8, -90 + bob); ctx.closePath();
    ctx.fill();

    // Crackling Electric Shock-Whip in Lead Hand!
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(18, -62 + bob);
    ctx.quadraticCurveTo(42, -52 + bob, 56, -24 + bob);
    ctx.stroke();
  }

  drawTopazFusion(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 3;
    // Heavy Golden Juggernaut Boots
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-34, -32, 26, 32, 5);
    ctx.roundRect(8, -32, 26, 32, 5);
    ctx.fill();

    // Colossal Armored Topaz Shoulder/Chest Block
    const topGrad = ctx.createLinearGradient(0, -100 + bob, 0, -28 + bob);
    topGrad.addColorStop(0, '#fbbf24');
    topGrad.addColorStop(0.55, '#d97706');
    topGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = topGrad;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-40, -30 + bob);
    ctx.lineTo(-46, -92 + bob);
    ctx.lineTo(46, -92 + bob);
    ctx.lineTo(40, -30 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Yellow Diamond Chest Crest + Cracked Ear Gems
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, -82 + bob); ctx.lineTo(14, -68 + bob); ctx.lineTo(0, -54 + bob); ctx.lineTo(-14, -68 + bob);
    ctx.closePath(); ctx.fill();

    // Sculpted Squared Head + Amber Sun-Visor & Ear Gems
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(-22, -124 + bob, 44, 34, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.72)';
    ctx.beginPath();
    ctx.roundRect(-18, -114 + bob, 36, 10, 3);
    ctx.fill();
    this.drawCrackedCorruptionGem(ctx, -24, -108 + bob, 7.5, '#fef08a', '#ffffff');
    this.drawCrackedCorruptionGem(ctx, 24, -108 + bob, 7.5, '#fef08a', '#ffffff');
  }

  drawRobonoidTitan(ctx, e) {
    // Articulated Bio-Mechanical Tripod War Colossus
    const legWalk = Math.sin(e.animTime * 6) * 8;
    const hover = Math.sin(e.animTime * 3.5) * 3;
    // Heavy Piston Walker Legs with Claw Footpads
    for (const [rx, fx, wOff] of [[-26, -56, legWalk], [26, 56, -legWalk], [0, 0, 0]]) {
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(rx, -58 + hover);
      ctx.lineTo(fx * 0.78, -24);
      ctx.lineTo(fx, wOff);
      ctx.stroke();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Armored Ribbed Chassis & Side Armor Fins
    const hullGrad = ctx.createRadialGradient(-12, -88 + hover, 8, 0, -75 + hover, 46);
    hullGrad.addColorStop(0, '#4ade80');
    hullGrad.addColorStop(0.55, '#15803d');
    hullGrad.addColorStop(1, '#052e16');
    ctx.fillStyle = hullGrad;
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, -75 + hover, 43, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Jagged Armored Mandible Vents + Cracked Overloaded Sensor Core
    ctx.fillStyle = '#022c22';
    ctx.beginPath();
    ctx.arc(10, -75 + hover, 17, 0, Math.PI * 2);
    ctx.fill();
    this.drawCrackedCorruptionGem(ctx, 11, -75 + hover, 13, '#4ade80', '#fef08a');
    this.drawHorrorFangs(ctx, -18, -50 + hover, 5, 34, 6, 1);
  }

  drawWhiteDiamond(ctx, e) {
    // White Diamond Supreme Radiant Mecha Avatar (Cel-Shaded & Imposing)
    const floatBob = Math.sin(e.animTime * 3) * 6;
    // Prismatic Halo Nimbus behind crown
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -88 + floatBob, 62, Math.PI * 0.85, Math.PI * 2.15);
    ctx.stroke();

    // Sculpted Regal Cape Silhouette + Pearlescent Gown with Shading Panels
    const robeGrad = ctx.createLinearGradient(0, -68 + floatBob, 0, 0);
    robeGrad.addColorStop(0, '#ffffff');
    robeGrad.addColorStop(0.65, '#cbd5e1');
    robeGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = robeGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-34, -66 + floatBob);
    ctx.lineTo(-42, -52 + floatBob);
    ctx.lineTo(-60, 0);
    ctx.lineTo(60, 0);
    ctx.lineTo(42, -52 + floatBob);
    ctx.lineTo(34, -66 + floatBob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Towering 5-Point Star/Diamond Spire Crown
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-36, -98 + floatBob);
    ctx.lineTo(-48, -118 + floatBob);
    ctx.lineTo(-22, -112 + floatBob);
    ctx.lineTo(0, -152 + floatBob);
    ctx.lineTo(22, -112 + floatBob);
    ctx.lineTo(48, -118 + floatBob);
    ctx.lineTo(36, -98 + floatBob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sculpted Porcelain Head + Chin Jawline
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-26, -98 + floatBob);
    ctx.lineTo(26, -98 + floatBob);
    ctx.quadraticCurveTo(28, -74 + floatBob, 0, -56 + floatBob);
    ctx.quadraticCurveTo(-28, -74 + floatBob, -26, -98 + floatBob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Piercing Dramatic Eyelashes + Pale Cyan Diamond Irises
    for (const s of [-1, 1]) {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(s * 5, -88 + floatBob);
      ctx.lineTo(s * 18, -94 + floatBob);
      ctx.lineTo(s * 16, -86 + floatBob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.ellipse(s * 11, -88 + floatBob, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(s * 11, -90.5 + floatBob);
      ctx.lineTo(s * 13, -88 + floatBob);
      ctx.lineTo(s * 11, -85.5 + floatBob);
      ctx.lineTo(s * 9, -88 + floatBob);
      ctx.closePath();
      ctx.fill();
    }

    // Dramatic Black Lipstick Smirk
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(-7, -70 + floatBob);
    ctx.quadraticCurveTo(0, -65 + floatBob, 7, -70 + floatBob);
    ctx.quadraticCurveTo(0, -68 + floatBob, -7, -70 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Faceted White Diamond Gemstone on Forehead
    this.drawCrackedCorruptionGem(ctx, 0, -104 + floatBob, 8.5, '#e0f2fe', '#ffffff');
  }

  drawRobonoidScout(ctx, e) {
    const hover = Math.sin(e.animTime * 3.4) * 4;

    // 3 Serrated Manipulator Claw Legs
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 2.6;
    for (const dx of [-9, 0, 9]) {
      ctx.beginPath();
      ctx.moveTo(dx * 0.6, -20 + hover);
      ctx.quadraticCurveTo(dx * 1.1, -11 + hover, dx * 1.35, -3 + hover);
      ctx.stroke();
    }

    // Armored Lime Drone Shell with Cel Rim & Outline
    ctx.fillStyle = '#84cc16';
    ctx.strokeStyle = '#1a2e05';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, -30 + hover, 17, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#3f6212';
    ctx.beginPath();
    ctx.ellipse(0, -24 + hover, 15.5, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Red-Rimmed Threat Scanner Eye
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.arc(3.5, -32 + hover, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bef264';
    ctx.beginPath();
    ctx.arc(4, -32 + hover, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(5, -32 + hover, 1.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Antenna Blinker
    ctx.strokeStyle = '#a3e635';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-6, -44 + hover);
    ctx.lineTo(-10, -53 + hover);
    ctx.stroke();
    ctx.fillStyle = Math.sin(e.animTime * 8) > 0 ? '#f43f5e' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(-10, -54 + hover, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawForgeAutomaton(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 1.8;
    const piston = Math.sin(e.animTime * 8) * 3.5;

    // Armored Piston Struts (No flat rectangles)
    ctx.fillStyle = '#451a03';
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 1.4;
    for (const lx of [-9, 9]) {
      ctx.beginPath();
      ctx.moveTo(lx - 4, -15 + bob);
      ctx.lineTo(lx + 4, -15 + bob);
      ctx.lineTo(lx + 6, 0);
      ctx.lineTo(lx - 6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Beveled Forged-Iron Hull with Molten Seams
    const torsoGrad = ctx.createLinearGradient(0, -48 + bob, 0, -14 + bob);
    torsoGrad.addColorStop(0, '#92400e');
    torsoGrad.addColorStop(0.6, '#7c2d12');
    torsoGrad.addColorStop(1, '#290d05');
    ctx.fillStyle = torsoGrad;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-16, -48 + bob);
    ctx.lineTo(16, -48 + bob);
    ctx.lineTo(20, -28 + bob);
    ctx.lineTo(14, -14 + bob);
    ctx.lineTo(-14, -14 + bob);
    ctx.lineTo(-20, -28 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jagged Molten Furnace Maw with Grate Fangs
    const glow = 0.65 + 0.35 * Math.abs(Math.sin(e.animTime * 6));
    ctx.fillStyle = `rgba(249, 115, 22, ${glow})`;
    ctx.beginPath();
    ctx.moveTo(-11, -39 + bob);
    ctx.lineTo(11, -39 + bob);
    ctx.lineTo(9, -23 + bob);
    ctx.lineTo(-9, -23 + bob);
    ctx.closePath();
    ctx.fill();
    this.drawHorrorFangs(ctx, -9, -39 + bob, 4, 18, 5, 1);

    // Sculpted Hammer Piston Arms + Cracked Cyclops Heat-Gem
    for (const [ax, dir, pOff] of [[-24, -1, piston], [24, 1, -piston]]) {
      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(ax - 5, -46 + bob + pOff);
      ctx.lineTo(ax + 5, -46 + bob + pOff);
      ctx.lineTo(ax + dir * 2, -20 + bob + pOff);
      ctx.lineTo(ax - 5, -20 + bob + pOff);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    this.drawCrackedCorruptionGem(ctx, 0, -54 + bob, 6.2, '#f97316', '#fef08a');
  }

  drawDestabilizerSoldier(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 2;
    const sparkTime = e.animTime * 18;

    // 1. Armored Homeworld Combat Greaves (Contoured, no flat boxes)
    for (const bx of [-10, 10]) {
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(bx - 5, -18 + bob);
      ctx.lineTo(bx + 5, -18 + bob);
      ctx.lineTo(bx + 6, 0);
      ctx.lineTo(bx - 6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(bx - 5, -9 + bob);
      ctx.lineTo(bx + 5, -9 + bob);
      ctx.lineTo(bx + 5.5, -5 + bob);
      ctx.lineTo(bx - 5.5, -5 + bob);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Homeworld Uniform Torso & Cracked Diamond Power Core
    const torsoGrad = ctx.createLinearGradient(0, -50 + bob, 0, -18 + bob);
    torsoGrad.addColorStop(0, '#1e293b');
    torsoGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = torsoGrad;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-16, -18 + bob);
    ctx.lineTo(-19, -49 + bob);
    ctx.lineTo(19, -49 + bob);
    ctx.lineTo(16, -18 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Angular Diamond Shoulder Pauldrons
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-19, -49 + bob);
    ctx.lineTo(-28, -42 + bob);
    ctx.lineTo(-16, -33 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(19, -49 + bob);
    ctx.lineTo(28, -42 + bob);
    ctx.lineTo(16, -33 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Overloaded Diamond Chest Gem
    this.drawCrackedCorruptionGem(ctx, 0, -35 + bob, 6.2, '#38bdf8', '#e0f2fe');

    // 3. Menacing Crested Homeworld Helmet & Jagged Visor Grin
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-12, -52 + bob);
    ctx.lineTo(-10, -67 + bob);
    ctx.lineTo(0, -72 + bob);
    ctx.lineTo(10, -67 + bob);
    ctx.lineTo(12, -52 + bob);
    ctx.lineTo(0, -45 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Yellow Predator Visor Slit
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-9, -60 + bob);
    ctx.lineTo(9, -60 + bob);
    ctx.lineTo(6, -54 + bob);
    ctx.lineTo(0, -56 + bob);
    ctx.lineTo(-6, -54 + bob);
    ctx.closePath();
    ctx.fill();

    // 4. Gem Destabilizer Weapon & Crackling Electricity
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, -36 + bob);
    ctx.lineTo(26, -46 + bob);
    ctx.stroke();

    // Destabilizer Tuning Fork Prongs
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(26, -46 + bob);
    ctx.lineTo(34, -56 + bob);
    ctx.moveTo(26, -46 + bob);
    ctx.lineTo(36, -40 + bob);
    ctx.stroke();

    // Electric Arcs between prongs
    const arcY = -48 + bob + Math.sin(sparkTime) * 6;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(33, -54 + bob);
    ctx.lineTo(29 + Math.sin(sparkTime * 1.5) * 4, arcY);
    ctx.lineTo(35, -42 + bob);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(30 + Math.sin(sparkTime) * 3, arcY, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHealthBar(ctx, e) {
    // Only display floating health bar if damaged or if boss/elite
    if (!e.isBoss && !e.isElite && e.hp >= e.maxHp) return;

    ctx.save();
    // Un-flip so health bar always depletes left-to-right regardless of enemy facing direction
    if (e.facing < 0) {
      ctx.scale(-1, 1);
    }

    const barWidth = e.isBoss ? 76 : 36;
    const barHeight = e.isBoss ? 5 : 4;
    const yOff = e.isBoss ? -e.height - 16 : -e.height - 8;
    const pct = Math.max(0, Math.min(1, e.hp / e.maxHp));
    const radius = barHeight / 2;

    // Dark slate capsule background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-barWidth / 2, yOff, barWidth, barHeight, radius);
    } else {
      ctx.rect(-barWidth / 2, yOff, barWidth, barHeight);
    }
    ctx.fill();
    ctx.stroke();

    // Smooth health fill
    if (pct > 0) {
      if (e.isBoss) {
        ctx.fillStyle = '#f43f5e';
      } else if (pct > 0.5) {
        ctx.fillStyle = '#22c55e';
      } else if (pct > 0.25) {
        ctx.fillStyle = '#eab308';
      } else {
        ctx.fillStyle = '#ef4444';
      }
      ctx.beginPath();
      const fillW = Math.max(barHeight, barWidth * pct);
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-barWidth / 2, yOff, fillW, barHeight, radius);
      } else {
        ctx.rect(-barWidth / 2, yOff, barWidth * pct, barHeight);
      }
      ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================================
// 6. DIFFICULTY CONFIG & GUARDIAN ROSTER DATA (8 CANON GEMS)
// ============================================================================
