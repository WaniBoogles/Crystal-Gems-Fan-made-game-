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
      animTime: Math.random() * 10,
      hitRecoilX: 0,
      shieldActive: (type === 'destabilizer_soldier' || type === 'boss_agate_warden'),
      shieldMaxHp: (type === 'boss_agate_warden') ? 140 : (type === 'destabilizer_soldier' ? 45 : 0),
      shieldHp: (type === 'boss_agate_warden') ? 140 : (type === 'destabilizer_soldier' ? 45 : 0),
      shieldCooldown: 0,
      shieldFlashTimer: 0,
      hyperArmorTimer: 0
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
    } else if (type === 'snow_monster') {
      enemy.hp = Math.round(92 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(115 * this.speedMult);
      enemy.width = 86;
      enemy.height = 88;
      enemy.visualScale = 1.44;
      enemy.gemColor = '#bae6fd';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Tundra Snow Beast';
    } else if (type === 'carnelian_enforcer') {
      enemy.hp = Math.round(98 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(125 * this.speedMult);
      enemy.width = 86;
      enemy.height = 88;
      enemy.visualScale = 1.44;
      enemy.gemColor = '#fb923c';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Carnelian Enforcer';
    } else if (type === 'obsidian') {
      enemy.hp = Math.round(110 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 88;
      enemy.height = 92;
      enemy.visualScale = 1.45;
      enemy.gemColor = '#f43f5e';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Obsidian Forge Brute';
    } else if (type === 'boss_centipeetle') {
      enemy.hp = Math.round(420 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 140;
      enemy.height = 132;
      enemy.visualScale = 1.38;
      enemy.gemColor = '#22c55e';
      enemy.gemShape = 'centipeetle_mother';
      enemy.name = 'Mother Centipeetle Queen';
      this.isBossAlive = true;
    } else if (type === 'boss_giant_bird') {
      enemy.hp = Math.round(620 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(125 * this.speedMult);
      enemy.width = 165;
      enemy.height = 148;
      enemy.visualScale = 1.38;
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Ancient Spire Giant Bird';
      this.isBossAlive = true;
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
      if (e.hitRecoilX) {
        e.hitRecoilX *= Math.pow(0.0015, dt);
        if (Math.abs(e.hitRecoilX) < 0.25) e.hitRecoilX = 0;
      }
      if (e.shieldFlashTimer > 0) e.shieldFlashTimer = Math.max(0, e.shieldFlashTimer - dt);
      if (e.hyperArmorTimer > 0) e.hyperArmorTimer = Math.max(0, e.hyperArmorTimer - dt);
      if (e.shieldMaxHp > 0 && !e.shieldActive) {
        e.shieldCooldown = Math.max(0, (e.shieldCooldown || 0) - dt);
        if (e.shieldCooldown <= 0 && e.stunTimer <= 0 && e.hurtTimer <= 0) {
          e.shieldActive = true;
          e.shieldHp = e.shieldMaxHp;
          if (particles) particles.addShockwaveRing(e.x, e.y - e.height * 0.5, 48, '#38bdf8', 2.4);
        }
      }

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

      // Freebuff: clean hits interrupt a wind-up, rewarding aggressive play (unless Hyper-Armor is active)
      if (e.hurtTimer > 0 && e.windup > 0 && !(e.hyperArmorTimer > 0)) {
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
          // Heavy brute enemies gain brief Hyper-Armor during windup charge (broken by Armor Break, [L], Fusion, or 2x weakness)
          if (e.type === 'cluster' || e.type === 'obsidian' || e.type === 'forge_automaton') {
            e.hyperArmorTimer = Math.min(0.55, e.windup + 0.08);
          }
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
      if (e.attackVisualTimer > 0) {
        e.attackVisualTimer = Math.max(0, e.attackVisualTimer - dt);
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
    // Trigger dynamic attack lunge & elemental skill VFX on the monster/boss itself
    e.attackVisualMax = e.isBoss ? 0.42 : 0.30;
    e.attackVisualTimer = e.attackVisualMax;

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
      particles.addSparkle(e.x + e.facing * 24, e.y - 28, '#4ade80', 8, 3);
    } else if (e.type === 'blade_quartz' || e.type === 'carnelian_enforcer') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 260;
      projectiles.push({
        x: e.x + e.facing * 30,
        y: e.y - 30,
        vx: e.facing * 380,
        vy: 0,
        radius: 12,
        damage: 1,
        type: 'enemyShard',
        color: e.type === 'carnelian_enforcer' ? '#fb923c' : '#f43f5e',
        life: 1.4
      });
      particles.addSparkle(e.x + e.facing * 30, e.y - 30, e.type === 'carnelian_enforcer' ? '#fb923c' : '#f43f5e', 8, 3);
    } else if (e.type === 'cluster') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 360;
      particles.addSparkle(e.x + e.facing * 22, e.y - 32, '#c084fc', 10, 4);
    } else if (e.type === 'ice_monster' || e.type === 'snow_monster') {
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
      particles.addSparkle(e.x + e.facing * 28, e.y - 32, '#bae6fd', 8, 3);
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
      particles.addSparkle(e.x + e.facing * 20, e.y - 18, '#4ade80', 8, 3);
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
      particles.addSparkle(e.x + e.facing * 22, e.y - 24, '#67e8f9', 8, 3);
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
      particles.addSparkle(e.x + e.facing * 22, e.y - 20, '#fb923c', 10, 4);
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
      particles.addSparkle(e.x + e.facing * 24, e.y - 26, '#e0f2fe', 8, 3);
    } else if (e.type === 'boss_giant_bird') {
      // Giant Bird: Sweeping Gale Dive + Triple Razor Sky-Feather Barrage!
      audioEngine.playSfx('whoosh');
      particles.addSparkle(e.x + e.facing * 40, e.y - 60, '#bae6fd', 18, 5);
      for (let k = -1; k <= 1; k++) {
        projectiles.push({
          x: e.x + e.facing * 42,
          y: e.y - 52 + k * 14,
          vx: e.facing * 390,
          vy: k * 65 + 45,
          radius: 13,
          damage: 1,
          type: 'enemyShard',
          color: '#38bdf8',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_spitter' || e.type === 'boss_centipeetle') {
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
          color: '#22c55e',
          life: 1.6
        });
      }
      particles.addSparkle(e.x + e.facing * 35, e.y - 35, '#4ade80', 14, 4);
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
    } else if (e.type === 'forge_automaton' || e.type === 'obsidian') {
      audioEngine.playSfx('hammer');
      e.vx = e.facing * 340;
      projectiles.push({
        x: e.x + e.facing * 30,
        y: this.groundY - 22,
        vx: e.facing * 320,
        width: 85,
        height: 28,
        damage: 1,
        type: 'enemyShockwave',
        color: '#f97316',
        life: 0.55
      });
      particles.addSparkle(e.x + e.facing * 24, e.y - 20, '#fb923c', 10, 4);
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

        const isFinisherHit = !!(player.isFinisherSwing || player.comboStep >= 2 || player.attackType === 'L' || player.isFusion);
        const isHeavyHit = !!(isFinisherHit || player.attackType === 'K' || player.attackArmorBreak || player.isPinkOverdrive);
        const meleeOpts = {
          ...pStats,
          isHeavy: isHeavyHit,
          isFinisher: isFinisherHit,
          armorBreak: !!player.attackArmorBreak,
          attackerX: player.x,
          attackerFacing: player.facing,
          attackSlot: player.attackType || 'J',
          isFusion: !!player.isFusion,
          player
        };
        const hitRes = this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, player.getMoveType(player.attackType), player.getStabMultiplier(player.attackType), meleeOpts);
        if (hitRes && (hitRes.blocked || hitRes.hyperArmored)) {
          return;
        }
        if (typeof player.markHitConfirm === 'function') {
          player.markHitConfirm(isHeavyHit || !!(hitRes && hitRes.isCrit));
        }
        const sparkColor = player.isPinkOverdrive ? '#f43f5e' : ((typeof OVERDRIVE_THEMES !== 'undefined' && OVERDRIVE_THEMES[player.activeChar]?.color) || '#fde047');
        particles.addImpactSparks(e.x, e.y - e.height / 2, player.facing, sparkColor, 12);
        if (isFinisherHit) {
          particles.addImpactFrame(e.x, e.y - e.height / 2, sparkColor, player.isFusion ? 200 : 155);
          if (['connie', 'rose', 'pearl'].includes(player.activeChar) || (player.isFusion && ['stevonnie', 'rainbow2', 'rainbowClassic'].includes(player.fusionData?.id))) {
            particles.addDoubleSlashX(e.x - player.facing * 12, e.y - e.height / 2, player.facing, sparkColor);
          }
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
        // Heavier chain steps launch further; style traits apply pull-in, hydro/vault lift, and armor-break!
        if (player.attackPullIn) {
          // Amethyst whip snare pulls enemy slightly inward into sweet-spot range
          const pullDir = (e.x > player.x) ? -1 : 1;
          e.vx = pullDir * 240;
          e.vy = -125;
        } else {
          e.vx *= (player.attackKnockMult || 1);
          if (this.knockbackResist && !player.attackArmorBreak) e.vx *= Math.max(0.35, 1 - this.knockbackResist);
          if (player.attackLiftY && player.attackLiftY < 0) {
            e.vy = Math.min(e.vy || 0, player.attackLiftY);
          } else if (player.comboStep >= 2 && e.vy) {
            e.vy *= 1.15;
          }
        }
        if (player.attackArmorBreak) {
          e.hurtTimer = Math.max(e.hurtTimer, 0.56);
          if (particles) particles.addDamageText(e.x, e.y - e.height - 16, 'ARMOR BREAK!', true, '#fb923c');
        }
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
    if (e.isPoofed) return { ignored: true };

    const moveType = attackType ? String(attackType).toLowerCase() : null;
    const typeMeta = getTypeMeta(moveType || 'normal');
    const typeMult = typeMultiplier(moveType, e.types);
    const vulnMult = (e.vulnTimer > 0 ? (e.vulnMult || 1) : 1);
    const opts = combatOpts || {};
    const attackerX = (typeof opts.attackerX === 'number') ? opts.attackerX : (this.gameRef && this.gameRef.player ? this.gameRef.player.x : e.x - (e.facing || 1) * 60);
    const hitDirX = (typeof opts.attackerFacing === 'number' && opts.attackerFacing !== 0) ? opts.attackerFacing : (e.x >= attackerX ? 1 : -1);
    const attackSlot = String(opts.attackSlot || '').toUpperCase();
    const isHeavyMove = !!(opts.isHeavy || opts.isFinisher || opts.isFusion || attackSlot === 'K' || attackSlot === 'L');
    const isShieldBreaker = !!(opts.armorBreak || opts.isFinisher || opts.isFusion || attackSlot === 'K' || attackSlot === 'L');

    // Critical Chance & Critical Damage roll from active guardian's lore stats
    const fallbackStats = (this.gameRef && this.gameRef.player && typeof this.gameRef.player.getCombatStats === 'function')
      ? this.gameRef.player.getCombatStats()
      : null;
    const critChance = (typeof opts.critChance === 'number')
      ? opts.critChance
      : (fallbackStats ? fallbackStats.critChance : 0.12);
    const critDamage = (typeof opts.critDamage === 'number')
      ? opts.critDamage
      : (fallbackStats ? fallbackStats.critDamage : 1.6);
    const isCrit = (opts.allowCrit !== false) && (Math.random() < critChance);
    const critMult = isCrit ? critDamage : 1.0;

    let finalDmg = Math.max(1, Math.round(dmg * typeMult * (stabMult || 1) * vulnMult * critMult));
    const impactY = e.y - e.height * 0.5;

    // --- DEFENSIVE COUNTERPLAY 1: FRONT-GUARD ENERGY SHIELD (Destabilizer Guard & Agate Warden) ---
    const attackerInFront = ((attackerX - e.x) * (e.facing || -1)) > 0;
    if (e.shieldActive && attackerInFront && (e.windup || 0) <= 0 && (e.hurtTimer || 0) <= 0 && (e.stunTimer || 0) <= 0) {
      e.shieldHp = Math.max(0, (e.shieldHp || 0) - finalDmg);
      if (isShieldBreaker || e.shieldHp <= 0) {
        // GUARD SHATTER! Opens enemy to full stun & combo punish!
        e.shieldActive = false;
        e.shieldHp = 0;
        e.shieldCooldown = 6.5;
        e.stunTimer = Math.max(e.stunTimer || 0, 1.15);
        e.hitRecoilX = hitDirX * 14;
        if (particles && particles.addGuardShatterVFX) particles.addGuardShatterVFX(e.x + e.facing * 26, impactY, '#38bdf8');
        if (audioEngine) audioEngine.playSfx('shieldBreak');
        if (this.gameRef && this.gameRef.triggerHitstop) this.gameRef.triggerHitstop(0.072, 6.8, hitDirX * 10, -2);
        if (this.gameRef && this.gameRef.triggerCameraZoom) this.gameRef.triggerCameraZoom(0.068, 0.28, e.x, impactY);
        if (this.gameRef && this.gameRef.showCombatBadge) this.gameRef.showCombatBadge('GUARD SHATTER!', '#38bdf8');
      } else {
        // FRONTAL LIGHT HIT BLOCKED: 25% chip damage, metallic cyan ripple, encourages flanking or heavy break
        const chipDmg = Math.max(1, Math.round(finalDmg * 0.25));
        e.shieldFlashTimer = 0.18;
        e.hitRecoilX = hitDirX * 4;
        if (!e.isImmortalDummy) e.hp = Math.max(1, e.hp - chipDmg);
        if (particles) {
          if (particles.addShieldBlockRipple) particles.addShieldBlockRipple(e.x + e.facing * 24, impactY, e.facing, '#38bdf8', 36);
          particles.addDamageText(e.x, e.y - e.height - 10, `${chipDmg}`, false, '#67e8f9');
        }
        if (audioEngine) audioEngine.playSfx('shieldBlock');
        if (this.gameRef && this.gameRef.triggerHitstop) this.gameRef.triggerHitstop(0.018, 1.6, hitDirX * 2.5, 0);
        if (this.gameRef && this.gameRef.showCombatBadge) this.gameRef.showCombatBadge('GUARDED — FLANK OR BREAK!', '#67e8f9');
        return { blocked: true, isCrit: false, isHeavy: false };
      }
    }

    // --- DEFENSIVE COUNTERPLAY 2: BRUTE HYPER-ARMOR CHARGE (Cluster, Obsidian, Forge Automaton) ---
    let absorbedByHyperArmor = false;
    if ((e.hyperArmorTimer || 0) > 0) {
      const breaksArmor = !!(opts.armorBreak || attackSlot === 'L' || opts.isFusion || typeMult >= 2);
      if (breaksArmor) {
        e.hyperArmorTimer = 0;
        if (particles && particles.addArmorClangVFX) particles.addArmorClangVFX(e.x, impactY, '#fde047');
        if (audioEngine) audioEngine.playSfx('shieldBreak');
        if (this.gameRef && this.gameRef.showCombatBadge) this.gameRef.showCombatBadge('ARMOR BREAK!', '#fbbf24');
      } else {
        absorbedByHyperArmor = true;
        finalDmg = Math.max(1, Math.round(finalDmg * 0.75));
        e.hitRecoilX = hitDirX * 3.5;
        if (particles && particles.addArmorClangVFX) particles.addArmorClangVFX(e.x, impactY, '#fbbf24');
        if (audioEngine) audioEngine.playSfx('armorClang');
        if (this.gameRef && this.gameRef.triggerHitstop) this.gameRef.triggerHitstop(0.022, 2.2, hitDirX * 3, 0);
      }
    }

    if (this.onComboHit) {
      this.onComboHit(finalDmg);
    }

    const nowMs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const canShowFeedback = nowMs - (e._lastFeedbackAt || 0) >= 70;
    if (canShowFeedback) {
      e._lastFeedbackAt = nowMs;
    }

    const isBigImpact = !!(isCrit || isHeavyMove || typeMult >= 2 || finalDmg >= 42);
    const impactTier = (isCrit || opts.isFinisher || opts.isFusion) ? 'crit' : (isBigImpact ? 'heavy' : 'light');
    const burstColor = isCrit ? '#fde047' : (typeMeta.color || '#ffd700');

    // Tekken Practice Dojo: Training dummy takes zero permanent damage!
    if (e.isImmortalDummy) {
      e.hp = e.maxHp;
      if (!absorbedByHyperArmor) e.hurtTimer = 0.28;
      e.hitRecoilX = hitDirX * (isBigImpact ? 12 : 6);
      if (canShowFeedback) {
        if (particles) {
          particles.addDamageText(e.x, e.y - e.height - 14, isCrit ? `${finalDmg}!` : `${finalDmg}`, isBigImpact, burstColor);
          if (particles.addTekkenHitBurst) particles.addTekkenHitBurst(e.x, impactY, hitDirX, burstColor, impactTier);
        }
        if (audioEngine) audioEngine.playSfx(impactTier === 'crit' ? 'hitCrit' : (impactTier === 'heavy' ? 'hitHeavy' : 'hitLight'));
      }
      if (this.gameRef && this.gameRef.triggerHitstop) {
        this.gameRef.triggerHitstop(impactTier === 'crit' ? 0.064 : (impactTier === 'heavy' ? 0.044 : 0.022), impactTier === 'crit' ? 6.2 : (impactTier === 'heavy' ? 4.2 : 2.0), hitDirX * (isBigImpact ? 8 : 3.5), isBigImpact ? -2 : -0.8);
      }
      if (isBigImpact && this.gameRef && this.gameRef.triggerCameraZoom) {
        this.gameRef.triggerCameraZoom(impactTier === 'crit' ? 0.06 : 0.038, 0.22, e.x, impactY);
      }
      this.applyTypeStatus(e, moveType, particles);
      return { blocked: false, hyperArmored: absorbedByHyperArmor, isCrit, isHeavy: isBigImpact };
    }

    e.hp -= finalDmg;
    if (!absorbedByHyperArmor) {
      e.hurtTimer = 0.35;
      e.hitRecoilX = hitDirX * (isBigImpact ? 13 : 6);
    }
    this.applyTypeStatus(e, moveType, particles);
    if (canShowFeedback) {
      if (particles) {
        particles.addDamageText(e.x, e.y - e.height - 12, isCrit ? `${finalDmg}!` : `${finalDmg}`, isBigImpact, burstColor);
        if (particles.addTekkenHitBurst) particles.addTekkenHitBurst(e.x, impactY, hitDirX, burstColor, impactTier);
        else particles.addHitSparks(e.x, impactY, burstColor);
      }
      if (audioEngine && !absorbedByHyperArmor) {
        audioEngine.playSfx(impactTier === 'crit' ? 'hitCrit' : (impactTier === 'heavy' ? 'hitHeavy' : 'hitLight'));
      }
    }
    if (!absorbedByHyperArmor && this.gameRef && this.gameRef.triggerHitstop) {
      this.gameRef.triggerHitstop(
        impactTier === 'crit' ? 0.068 : (impactTier === 'heavy' ? 0.046 : 0.022),
        impactTier === 'crit' ? 6.5 : (impactTier === 'heavy' ? 4.5 : 2.0),
        hitDirX * (isBigImpact ? 9 : 3.5),
        isBigImpact ? -2.2 : -0.8
      );
    }
    if (!absorbedByHyperArmor && isBigImpact && this.gameRef && this.gameRef.triggerCameraZoom) {
      this.gameRef.triggerCameraZoom(impactTier === 'crit' ? 0.062 : 0.038, 0.22, e.x, impactY);
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
          this.gameRef.triggerHitstop(e.isBoss ? 0.088 : 0.062, e.isBoss ? 8.2 : 5.2, hitDirX * 10, -2.5);
        }
        if (e.isBoss && this.gameRef && this.gameRef.triggerCameraZoom) {
          this.gameRef.triggerCameraZoom(0.11, 0.45, e.x, impactY);
        }
      }
      return { blocked: false, hyperArmored: false, isCrit, isHeavy: isBigImpact, defeated: true };
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
      if (this.gameRef && this.gameRef.triggerCameraZoom) {
        this.gameRef.triggerCameraZoom(0.075, 0.30, e.x, impactY);
      }
      if (this.gameRef && this.gameRef.player) {
        const p = this.gameRef.player;
        const pDir = p.x < e.x ? -1 : 1;
        p.vx = pDir * 380;
        p.vy = -180;
      }
      return { blocked: false, hyperArmored: false, isCrit, isHeavy: isBigImpact, breakout: true };
    }
    return { blocked: false, hyperArmored: absorbedByHyperArmor, isCrit, isHeavy: isBigImpact };
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

  // --- UPGRADED ELEMENTAL SKILL WINDUP TELEGRAPHS & ACTIVE ATTACK VFX (ALL MONSTERS & BOSSES) ---
  drawEnemySkillVFX(ctx, e) {
    const t = e.type || '';
    const animT = e.animTime || ((typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000);
    const h = e.height || (e.isBoss ? 120 : 54);
    const w = e.width || (e.isBoss ? 105 : 46);
    const muzzleX = w * 0.56 + (e.isBoss ? 14 : 6);
    const muzzleY = -h * 0.52;

    // Classify elemental skill theme for each monster & boss
    const isWhite = (t === 'boss_white_diamond');
    const isAcid = (t.includes('centipeetle') || t === 'boss_spitter');
    const isIce = (t.includes('ice') || t.includes('snow'));
    const isFire = (t.includes('firebird') || t.includes('forge') || t === 'obsidian' || t === 'boss_jasper' || t === 'carnelian_enforcer');
    const isCluster = (t.includes('cluster'));
    const isTech = (t.includes('robonoid') || t.includes('destabilizer') || t === 'boss_agate_warden' || t === 'boss_topaz_fusion');
    const isWind = (t === 'spire_harpy' || t === 'boss_giant_bird');

    const primary = isWhite ? '#ffffff'
      : isAcid ? '#4ade80'
      : isIce ? '#38bdf8'
      : isFire ? '#f97316'
      : isCluster ? '#c084fc'
      : isTech ? (t === 'boss_topaz_fusion' ? '#fbbf24' : '#22d3ee')
      : isWind ? '#67e8f9'
      : '#f43f5e';
    const core = isWhite ? '#e2e8f0'
      : isAcid ? '#dcfce7'
      : isIce ? '#e0f2fe'
      : isFire ? '#fde047'
      : isCluster ? '#f5d0fe'
      : '#ffffff';

    ctx.save();

    // 1. WINDUP TELEGRAPH ANIMATION (Elemental Charging Energy before strike!)
    if (e.windup && e.windup > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(animT * 26);
      const chargeR = (e.isBoss ? 22 : 13) + pulse * (e.isBoss ? 9 : 5);

      if (isWhite) {
        // White Diamond: Iconic blinding monochrome lock-on eye-beams & rotating 4-point Diamond mandala!
        ctx.save();
        ctx.translate(0, -h * 0.68);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.65 + pulse * 0.35})`;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(0, 0, 48 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
        // Rotating 4-point Diamond Judgement Cross
        ctx.rotate(animT * 2.8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          const r = (i % 2 === 0) ? (56 + pulse * 14) : 12;
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // Targeting beam previews
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(muzzleX, muzzleY - 12); ctx.lineTo(muzzleX + 120, muzzleY - 40);
        ctx.moveTo(muzzleX, muzzleY - 12); ctx.lineTo(muzzleX + 130, muzzleY - 12);
        ctx.moveTo(muzzleX, muzzleY - 12); ctx.lineTo(muzzleX + 120, muzzleY + 16);
        ctx.stroke();
      } else {
        // Converging elemental charge orb + rotating danger glyph at weapon/mouth
        const orbG = ctx.createRadialGradient(muzzleX, muzzleY, 2, muzzleX, muzzleY, chargeR * 1.4);
        orbG.addColorStop(0, '#ffffff');
        orbG.addColorStop(0.45, primary);
        orbG.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = orbG;
        ctx.beginPath();
        ctx.arc(muzzleX, muzzleY, chargeR * 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Spinning elemental charge ring
        ctx.save();
        ctx.translate(muzzleX, muzzleY);
        ctx.rotate(animT * 7);
        ctx.strokeStyle = core;
        ctx.lineWidth = e.isBoss ? 3.0 : 2.0;
        ctx.beginPath();
        ctx.arc(0, 0, chargeR, 0, Math.PI * 1.35);
        ctx.stroke();
        // Converging energy sparks drawn inward
        ctx.fillStyle = primary;
        for (let s = 0; s < 4; s++) {
          const sa = (s * Math.PI) / 2 + animT * 4;
          const sr = chargeR * (1.5 - pulse * 0.6);
          ctx.beginPath();
          ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, e.isBoss ? 3.5 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 2. ACTIVE ATTACK BURST VFX (Right as the monster/boss strikes or fires!)
    if (e.attackVisualTimer && e.attackVisualTimer > 0) {
      const p = Math.max(0, Math.min(1, e.attackVisualTimer / (e.attackVisualMax || 0.34)));
      const burst = Math.sin(p * Math.PI);
      ctx.globalAlpha = Math.min(1, p * 1.35);

      if (isWhite) {
        // White Diamond: Blinding Prismatic Judgement Flare & Concentric Radiance Rings
        const flareR = 54 + (1 - p) * 58;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5 * p;
        ctx.beginPath();
        ctx.arc(muzzleX, muzzleY, flareR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 + p * 0.8;
          const r = (i % 2 === 0) ? (flareR * 1.15) : (flareR * 0.28);
          if (i === 0) ctx.moveTo(muzzleX + Math.cos(a) * r, muzzleY + Math.sin(a) * r);
          else ctx.lineTo(muzzleX + Math.cos(a) * r, muzzleY + Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else if (isAcid) {
        // Toxic Acid Splash Cone + Bubbling Droplets
        ctx.fillStyle = 'rgba(74, 222, 128, 0.55)';
        ctx.beginPath();
        ctx.moveTo(muzzleX - 6, muzzleY);
        ctx.lineTo(muzzleX + (e.isBoss ? 72 : 44) * burst, muzzleY - (e.isBoss ? 26 : 15));
        ctx.lineTo(muzzleX + (e.isBoss ? 72 : 44) * burst, muzzleY + (e.isBoss ? 26 : 15));
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#dcfce7';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(muzzleX + 14 * burst, muzzleY, 7, (e.isBoss ? 24 : 14) * burst, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (isIce) {
        // Crystalline Frost Nova & Shattering Icicle Fan
        const rad = (e.isBoss ? 52 : 30) * burst;
        ctx.fillStyle = 'rgba(186, 230, 253, 0.72)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        for (let k = -1; k <= 1; k++) {
          const ang = k * 0.35;
          ctx.beginPath();
          ctx.moveTo(muzzleX, muzzleY - 5);
          ctx.lineTo(muzzleX + Math.cos(ang) * rad * 1.4, muzzleY + Math.sin(ang) * rad * 1.4);
          ctx.lineTo(muzzleX, muzzleY + 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else if (isFire || t === 'boss_quartz_beast' || t === 'boss_topaz_fusion' || t === 'blade_quartz') {
        // Blazing / Kinetic Sweeping Crescent Slash + Impact Shock-Ring!
        const slashR = (e.isBoss ? 68 : 38) + (1 - p) * 18;
        ctx.strokeStyle = primary;
        ctx.lineWidth = (e.isBoss ? 12 : 7) * p;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(muzzleX - 10, muzzleY, slashR, -Math.PI * 0.48, Math.PI * 0.48);
        ctx.stroke();
        ctx.strokeStyle = core;
        ctx.lineWidth = (e.isBoss ? 5 : 3) * p;
        ctx.beginPath();
        ctx.arc(muzzleX - 10, muzzleY, slashR, -Math.PI * 0.42, Math.PI * 0.42);
        ctx.stroke();
      } else {
        // High-Tech / Wind / Psychic Muzzle Shockwave & Star Flash!
        const rx = (e.isBoss ? 14 : 9) * burst;
        const ry = (e.isBoss ? 36 : 22) * burst;
        ctx.strokeStyle = primary;
        ctx.lineWidth = (e.isBoss ? 4.5 : 3.0) * p;
        ctx.beginPath();
        ctx.ellipse(muzzleX + 10 * burst, muzzleY, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0 * p;
        ctx.beginPath();
        ctx.ellipse(muzzleX + 24 * burst, muzzleY, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
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
    } else if (e.type === 'ice_monster' || e.type === 'snow_monster') {
      this.drawIceMonster(ctx, e);
    } else if (e.type === 'carnelian_enforcer') {
      this.drawBladeQuartz(ctx, e);
    } else if (e.type === 'obsidian') {
      this.drawForgeAutomaton(ctx, e);
    } else if (e.type === 'boss_giant_bird') {
      this.drawGiantBird(ctx, e);
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
      ctx.translate(e.x + (e.hitRecoilX || 0), e.y);

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

      // Visual Telegraph: Brute Hyper-Armor Aura (golden-amber armored glint during unstoppable windup)
      if ((e.hyperArmorTimer || 0) > 0) {
        const haPulse = 0.55 + 0.45 * Math.sin((e.animTime || 0) * 18);
        const haR = Math.max(e.width, e.height) * 0.68;
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.fillStyle = `rgba(251, 191, 36, ${0.14 + haPulse * 0.14})`;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(0, -e.height * 0.48, haR * 0.82, haR, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Visual Telegraph: Front-Guard Energy Shield (blocks frontal light hits; flank or shatter!)
      if (e.shieldActive && (e.windup || 0) <= 0 && (e.stunTimer || 0) <= 0) {
        const shFlash = (e.shieldFlashTimer || 0) > 0;
        const shR = e.height * 0.56;
        const shX = (e.width * 0.38) + 8;
        const shY = -e.height * 0.48;
        ctx.save();
        ctx.fillStyle = shFlash ? 'rgba(255, 255, 255, 0.48)' : 'rgba(56, 189, 248, 0.22)';
        ctx.strokeStyle = shFlash ? '#ffffff' : '#38bdf8';
        ctx.lineWidth = shFlash ? 4.2 : 3.0;
        ctx.beginPath();
        ctx.arc(shX, shY, shR, -Math.PI * 0.42, Math.PI * 0.42);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(shX, shY, shR, -Math.PI * 0.42, Math.PI * 0.42);
        ctx.lineTo(shX - 8, shY + shR * 0.72);
        ctx.lineTo(shX - 8, shY - shR * 0.72);
        ctx.closePath();
        ctx.fill();
        // Shield durability bar tick
        const shPct = Math.max(0, Math.min(1, (e.shieldHp || 0) / Math.max(1, e.shieldMaxHp || 1)));
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(shX - 3, shY, shR * 0.86, -Math.PI * 0.36 * shPct, Math.PI * 0.36 * shPct);
        ctx.stroke();
        ctx.restore();
      }

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

      // Dynamic Attack Anticipation (coil back during windup) & Snappy Strike Lunge during active attack!
      let atkShiftX = 0;
      let atkScaleX = 1;
      let atkScaleY = 1;
      if (e.windup && e.windup > 0) {
        const wPulse = 0.5 + 0.5 * Math.sin((e.animTime || 0) * 32);
        atkShiftX = -5 - wPulse * 3;
        atkScaleX = 0.94;
        atkScaleY = 1.05;
      } else if (e.attackVisualTimer && e.attackVisualTimer > 0) {
        const atkP = Math.max(0, Math.min(1, e.attackVisualTimer / (e.attackVisualMax || 0.34)));
        const snap = Math.sin(atkP * Math.PI);
        atkShiftX = snap * (e.isBoss ? 16 : 11);
        atkScaleX = 1 + snap * 0.14;
        atkScaleY = 1 - snap * 0.08;
      }

      // Draw base enemy scaled to menacing real-enemy height next to players
      ctx.save();
      ctx.translate(atkShiftX, 0);
      ctx.scale(vScale * atkScaleX, vScale * atkScaleY);
      this.drawEnemyModel(ctx, e);
      ctx.restore();

      // Upgraded Elemental Skill Windup Telegraphs & Active Attack Bursts for ALL Monsters & Bosses!
      if (!e.isImmortalDummy && ((e.windup && e.windup > 0) || (e.attackVisualTimer && e.attackVisualTimer > 0))) {
        this.drawEnemySkillVFX(ctx, e);
      }

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
    const wingFlap = Math.sin(e.animTime * 18) * 14;
    const hover = Math.sin(e.animTime * 5) * 3;

    // Layered Celestial Feathered Raptor Wings with Individual Pinions
    for (const sgn of [-1, 1]) {
      ctx.save();
      ctx.translate(sgn * 6, -26 + hover);
      ctx.rotate(sgn * (-0.18 + wingFlap * 0.024));
      const wGrad = ctx.createLinearGradient(0, -28, sgn * 42, 8);
      wGrad.addColorStop(0, '#0e7490');
      wGrad.addColorStop(0.55, '#06b6d4');
      wGrad.addColorStop(1, '#cffafe');
      ctx.fillStyle = wGrad;
      ctx.strokeStyle = '#083344';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(sgn * 22, -32, sgn * 44, -18);
      ctx.lineTo(sgn * 34, -8);
      ctx.lineTo(sgn * 40, -1);
      ctx.lineTo(sgn * 26, 4);
      ctx.lineTo(sgn * 30, 10);
      ctx.quadraticCurveTo(sgn * 14, 10, 0, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Sleek Swept Tail Plumes
    ctx.fillStyle = '#164e63';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, -12 + hover); ctx.lineTo(-18, 4 + hover); ctx.lineTo(-4, -2 + hover); ctx.lineTo(-8, 7 + hover); ctx.lineTo(4, -8 + hover);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Armored Raptor Torso & Razor Talons
    const bGrad = ctx.createRadialGradient(-2, -24 + hover, 2, 0, -20 + hover, 18);
    bGrad.addColorStop(0, '#1e3a5f');
    bGrad.addColorStop(1, '#090d1a');
    ctx.fillStyle = bGrad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.ellipse(0, -21 + hover, 13.5, 16, 0.14, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Swept Head Crest Feathers
    ctx.fillStyle = '#67e8f9';
    ctx.strokeStyle = '#083344';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-4, -34 + hover); ctx.lineTo(-22, -46 + hover); ctx.lineTo(-10, -32 + hover);
    ctx.lineTo(-24, -36 + hover); ctx.lineTo(-8, -26 + hover);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Curved Raptor Talons
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    for (const tx of [-5, 5]) {
      ctx.beginPath();
      ctx.moveTo(tx, -6 + hover); ctx.lineTo(tx - 3, 2 + hover); ctx.lineTo(tx + 3, 5 + hover);
      ctx.stroke();
    }

    // Hooked Razor Screaming Beak + Jagged Fangs
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, -28 + hover);
    ctx.quadraticCurveTo(26, -28 + hover, 30, -16 + hover);
    ctx.lineTo(22, -14 + hover);
    ctx.lineTo(9, -17 + hover);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, 11, -18 + hover, 3, 12, 4.5, 1);

    // Fierce Crimson Predator Eye + Cracked Cyan Forehead Corruption Gem
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#090d1a';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.ellipse(7.5, -26 + hover, 4.0, 2.4, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.ellipse(8.5, -26 + hover, 1.0, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    this.drawCrackedCorruptionGem(ctx, -1, -31 + hover, 6.2, '#06b6d4', '#cffafe');
  }

  drawVolcanicFirebird(ctx, e) {
    const flap = Math.sin(e.animTime * 15) * 0.48;
    const gy = -28 + Math.sin(e.animTime * 4) * 3;

    // Blazing Phoenix Tail Plumes
    for (let i = -1; i <= 1; i++) {
      ctx.save();
      ctx.translate(-14, gy + 5);
      ctx.rotate(0.35 + i * 0.32);
      const tGrad = ctx.createLinearGradient(0, 0, -24, 0);
      tGrad.addColorStop(0, '#dc2626');
      tGrad.addColorStop(0.6, '#f97316');
      tGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = tGrad;
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -2); ctx.quadraticCurveTo(-14, -7, -26, i * 2); ctx.quadraticCurveTo(-12, 6, 0, 3);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // Layered Flame-Feathered Wings
    for (const [wx, dir, fMul] of [[-5, -1, 1], [6, 1, -1]]) {
      ctx.save();
      ctx.translate(wx, gy - 4);
      ctx.rotate(dir * (0.28 + flap * fMul));
      const fwGrad = ctx.createLinearGradient(0, 0, dir * 32, -26);
      fwGrad.addColorStop(0, '#991b1b');
      fwGrad.addColorStop(0.55, '#f97316');
      fwGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = fwGrad;
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * 16, -28, dir * 34, -20);
      ctx.lineTo(dir * 24, -8);
      ctx.lineTo(dir * 30, -2);
      ctx.lineTo(dir * 14, 5);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // Obsidian Volcanic Body + Molten Veins + Horned Fiend Head
    const bGrad = ctx.createRadialGradient(2, gy + 4, 2, 0, gy + 4, 18);
    bGrad.addColorStop(0, '#991b1b');
    bGrad.addColorStop(1, '#290707');
    ctx.fillStyle = bGrad;
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.ellipse(0, gy + 6, 14.5, 11, 0.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(10, gy - 6, 8.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Swept Flaming Crown Plume
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(6, gy - 13); ctx.lineTo(-4, gy - 26); ctx.lineTo(10, gy - 16); ctx.lineTo(4, gy - 22); ctx.lineTo(14, gy - 12);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Cracked Magma Heart Gem
    this.drawCrackedCorruptionGem(ctx, 1, gy + 6, 6.8, '#f97316', '#fef08a');

    // Hooked Blazing Beak + Predator Eye
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(15, gy - 10); ctx.quadraticCurveTo(26, gy - 8, 28, gy - 1); ctx.lineTo(15, gy + 1);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, 15, gy - 3, 2, 8, 3.5, 1);

    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.ellipse(11.5, gy - 8, 3.2, 2.0, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.beginPath(); ctx.ellipse(12.2, gy - 8, 0.9, 1.9, 0, 0, Math.PI * 2); ctx.fill();
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
    const isAcid = (e.type === 'acid_centipeetle');
    const shellDark = isAcid ? '#14532d' : '#052e16';
    const shellMid = isAcid ? '#65a30d' : '#15803d';
    const spikeCol = isAcid ? '#bef264' : '#4ade80';
    const rimCol = isAcid ? '#ecfccb' : '#86efac';

    // Articulated Multi-Jointed Insectoid Scythe Legs
    ctx.strokeStyle = '#021c0e';
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let idx = 0; idx < 4; idx++) {
      const lx = -17 + idx * 10.5;
      const wg = (idx % 2 === 0 ? legWiggle : -legWiggle);
      ctx.beginPath();
      ctx.moveTo(lx, -16 + bob);
      ctx.lineTo(lx - 8, -8 + bob + wg * 0.45);
      ctx.lineTo(lx - 3, 0);
      ctx.stroke();
      ctx.strokeStyle = spikeCol;
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.strokeStyle = '#021c0e';
      ctx.lineWidth = 3.4;
    }

    // Whip-like Swept Back Antennae
    ctx.strokeStyle = rimCol;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(16, -39 + bob);
    ctx.quadraticCurveTo(6, -54 + bob + Math.sin(e.animTime * 9) * 3, -8, -49 + bob);
    ctx.stroke();

    // Segmented Armored Chitin Thorax with Cel-Shaded Plates, Dorsal Spikes & Acid Pustules
    const segs = [{ x: -19, y: -18, r: 12 }, { x: -5, y: -23, r: 14.5 }, { x: 11, y: -27, r: 16.5 }];
    for (let si = 0; si < segs.length; si++) {
      const s = segs[si];
      ctx.fillStyle = shellDark;
      ctx.strokeStyle = '#02140a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y + bob, s.r, s.r * 0.86, -0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Glossy dorsal cel plate
      ctx.fillStyle = shellMid;
      ctx.beginPath();
      ctx.ellipse(s.x - 1, s.y - 3.5 + bob, s.r * 0.72, s.r * 0.44, -0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.ellipse(s.x - 2, s.y - 6.5 + bob, s.r * 0.45, s.r * 0.16, -0.14, 0, Math.PI * 2);
      ctx.fill();
      // Razor dorsal spine
      ctx.fillStyle = spikeCol;
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(s.x - 4, s.y - s.r * 0.72 + bob);
      ctx.lineTo(s.x - 11, s.y - s.r * 1.52 + bob);
      ctx.lineTo(s.x + 3.5, s.y - s.r * 0.76 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Acid Centipeetle glowing chartreuse venom sacs along flank!
      if (isAcid) {
        const sacPulse = 3.2 + Math.sin(e.animTime * 9 + si) * 0.8;
        ctx.fillStyle = '#a3e635';
        ctx.strokeStyle = '#ecfccb';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(s.x, s.y + 3 + bob, sacPulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }

    // Twin Serrated Venom-Dripping Pincher Mandibles + Fangs
    ctx.fillStyle = rimCol;
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(22, -37 + bob); ctx.quadraticCurveTo(40, -44 + bob, 37, -29 + bob); ctx.lineTo(24, -30 + bob); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(22, -19 + bob); ctx.quadraticCurveTo(40, -12 + bob, 37, -23 + bob); ctx.lineTo(24, -23 + bob); ctx.closePath();
    ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, 22, -29 + bob, 3, 12, 4.5, 1);

    if (isAcid) {
      // Dripping neon-lime acid globs!
      ctx.fillStyle = '#bef264';
      const drip = (e.animTime * 14) % 10;
      ctx.beginPath(); ctx.arc(34, -14 + bob + drip, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(28, -11 + bob + ((drip + 5) % 10), 2.0, 0, Math.PI * 2); ctx.fill();
    }

    // Terrifying Cyclops Corrupted Gem-Eye w/ Glossy Iris & Snake Slit!
    this.drawCrackedCorruptionGem(ctx, 21, -27 + bob, 11.5, isFrenzied ? '#ef4444' : (isAcid ? '#84cc16' : '#22c55e'), '#dcfce7');
    ctx.fillStyle = '#021c0e';
    ctx.beginPath();
    ctx.ellipse(23.5, -27 + bob, 2.5, 7.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(24.5, -30.5 + bob, 2.0, 0, Math.PI * 2);
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

    // Show-Accurate Mother Centipeetle Wild Spiky White Hair Mane & Glowing Acid Sacs!
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(42, -92 + breathe);
    ctx.lineTo(18, -124 + breathe);
    ctx.lineTo(30, -96 + breathe);
    ctx.lineTo(-4, -118 + breathe);
    ctx.lineTo(14, -88 + breathe);
    ctx.lineTo(-18, -102 + breathe);
    ctx.lineTo(18, -74 + breathe);
    ctx.lineTo(54, -90 + breathe);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Huge Crushing Acid-Dripping Mandible Jaws + Fangs
    ctx.fillStyle = '#022c22';
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(64, -84 + breathe); ctx.quadraticCurveTo(96, -98 + breathe, 102, -68 + breathe); ctx.lineTo(74, -68 + breathe); ctx.closePath();
    ctx.moveTo(64, -48 + breathe); ctx.quadraticCurveTo(96, -34 + breathe, 102, -62 + breathe); ctx.lineTo(74, -62 + breathe); ctx.closePath();
    ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, 62, -68 + breathe, 4, 24, 9, 1);

    // Dripping neon-green acid droplets from jaws
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(88, -42 + breathe + Math.sin(e.animTime * 8) * 3, 3.5, 0, Math.PI * 2);
    ctx.arc(98, -52 + breathe + Math.cos(e.animTime * 9) * 3, 2.8, 0, Math.PI * 2);
    ctx.fill();

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
    const wob = Math.sin(e.animTime * 9) * 3.2;
    const wob2 = Math.cos(e.animTime * 7) * 2.8;
    const reach = Math.sin(e.animTime * 6) * 5;

    // Show-Accurate Forced-Fusion Horror: Clutching Pale Severed Gem-Hands Reaching Outward!
    const drawClutchingHand = (sx, sy, ex, ey, handCol, shadeCol) => {
      ctx.strokeStyle = shadeCol;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ex) * 0.5, ey - 7, ex, ey); ctx.stroke();
      ctx.strokeStyle = handCol;
      ctx.lineWidth = 3.8;
      ctx.stroke();
      // Palm & 4 eerie splayed fingers
      ctx.fillStyle = handCol;
      ctx.strokeStyle = '#1e102d';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(ex, ey, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const ang = Math.atan2(ey - sy, ex - sx);
      for (const df of [-0.55, -0.18, 0.18, 0.55]) {
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(ang + df) * 9.5, ey + Math.sin(ang + df) * 9.5);
        ctx.stroke();
      }
    };
    drawClutchingHand(-18, -24 + wob, -36 - reach, -42 + wob, '#fbcfe8', '#831843');
    drawClutchingHand(16, -24 - wob2, 36 + reach, -38 - wob2, '#bae6fd', '#0369a1');
    drawClutchingHand(-4, -36 + wob, -10 + reach * 0.6, -56 + wob, '#e9d5ff', '#4c1d95');

    // Crawling Twisted Foot-Hands
    ctx.fillStyle = '#3b0764';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.3;
    for (const [fx, dir] of [[-15, -1], [15, 1]]) {
      ctx.beginPath();
      ctx.moveTo(fx - 6, -8); ctx.lineTo(fx + dir * 10, 0); ctx.lineTo(fx + dir * 2, 0); ctx.lineTo(fx + 5, -8);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Distorted Forced-Fusion Body-Horror Torso Mass with Fissure Veins
    const grad = ctx.createRadialGradient(-4, -28, 4, 0, -22, 34);
    grad.addColorStop(0, '#9333ea');
    grad.addColorStop(0.6, '#4c1d95');
    grad.addColorStop(1, '#1e102d');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(-27, -3);
    ctx.bezierCurveTo(-36, -20 + wob, -25, -42 - wob2, -4, -44 + wob);
    ctx.bezierCurveTo(18, -46 - wob, 34, -28 + wob2, 29, -4);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Jagged Mismatched Gem Shards Fused Into Flesh
    this.drawCrackedCorruptionGem(ctx, -15, -20 + wob, 8, '#f43f5e', '#fecdd3');
    this.drawCrackedCorruptionGem(ctx, 4, -28 + wob2, 9.2, '#38bdf8', '#e0f2fe');
    this.drawCrackedCorruptionGem(ctx, 17, -15 - wob, 7.5, '#fbbf24', '#fef9c3');

    // Multiple Uneven Wide Staring Eyes + Screaming Jagged Maw
    const eyes = [{ x: -9, y: -34 + wob, r: 4.8 }, { x: 10, y: -35 - wob2, r: 3.6 }, { x: -1, y: -15 + wob, r: 3.0 }];
    for (const ey of eyes) {
      ctx.fillStyle = '#fef2f2';
      ctx.strokeStyle = '#1e102d';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(ey.x, ey.y, ey.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = e.isFrenzied ? '#dc2626' : '#09090b';
      ctx.beginPath(); ctx.arc(ey.x + 1, ey.y, ey.r * 0.44, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#09090b';
    ctx.beginPath(); ctx.ellipse(2, -9 + wob, 11, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    this.drawHorrorFangs(ctx, -8, -13 + wob, 4, 20, 5.5, 1);
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

    // Show-Accurate Corrupted Jasper Wild Cream-White Mane & Glowing Turquoise Crystal Horns!
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(28, -72 + bob);
    ctx.lineTo(6, -106 + bob);
    ctx.lineTo(14, -76 + bob);
    ctx.lineTo(-14, -104 + bob);
    ctx.lineTo(-4, -74 + bob);
    ctx.lineTo(-32, -96 + bob);
    ctx.lineTo(-20, -66 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jagged Glowing Turquoise Corruption Horns along Spine
    ctx.fillStyle = '#14b8a6';
    ctx.strokeStyle = '#99f6e4';
    ctx.lineWidth = 1.5;
    for (let x = -34; x <= 18; x += 13) {
      ctx.beginPath();
      ctx.moveTo(x, -68 + bob);
      ctx.lineTo(x - 5, -100 + bob);
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
    const reach = Math.sin(e.animTime * 4) * 7;

    // Towering Forced-Fusion Arms Ending in Giant Clutching Pale Gem-Hands!
    for (const [sgn, col, rim] of [[-1, '#fbcfe8', '#be185d'], [1, '#bae6fd', '#0369a1']]) {
      ctx.fillStyle = '#3b0764';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(sgn * 34, -58 + bob);
      ctx.quadraticCurveTo(sgn * 66, -48 + bob, sgn * 62, -10 + reach * sgn);
      ctx.lineTo(sgn * 44, -6 + reach * sgn);
      ctx.quadraticCurveTo(sgn * 42, -32 + bob, sgn * 24, -40 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Giant skeletal clutching palm & 4 talons
      ctx.fillStyle = col;
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1.6;
      const hx = sgn * 56, hy = -4 + reach * sgn;
      ctx.beginPath(); ctx.ellipse(hx, hy, 12, 9, sgn * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      for (const df of [-10, -3, 4, 11]) {
        ctx.beginPath();
        ctx.moveTo(hx + df * 0.5, hy + 4);
        ctx.lineTo(hx + df * 0.9 + sgn * 4, hy + 18);
        ctx.lineTo(hx + df * 0.5 + 4, hy + 6);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    }

    // Gargantuan Forced-Fusion Torso Silhouette with Glowing Shatter Seams
    const tGrad = ctx.createRadialGradient(-8, -60 + bob, 8, 0, -52 + bob, 64);
    tGrad.addColorStop(0, '#9333ea');
    tGrad.addColorStop(0.55, '#4c1d95');
    tGrad.addColorStop(1, '#120826');
    ctx.fillStyle = tGrad;
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-46, -6 + bob);
    ctx.bezierCurveTo(-58, -48 + bob, -42, -94 + bob, 0, -96 + bob);
    ctx.bezierCurveTo(42, -94 + bob, 58, -48 + bob, 46, -6 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Jagged Prismatic Shattered Fusion Crystals Erupting From Crown
    const shards = [
      { x: -34, y: -120, c: '#f43f5e', s: '#ffe4e6' },
      { x: -10, y: -140, c: '#38bdf8', s: '#e0f2fe' },
      { x: 16, y: -132, c: '#fbbf24', s: '#fef9c3' },
      { x: 38, y: -112, c: '#c084fc', s: '#f3e8ff' }
    ];
    for (const s of shards) {
      ctx.fillStyle = s.c;
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(s.x - 11, -78 + bob);
      ctx.lineTo(s.x, s.y + bob);
      ctx.lineTo(s.x + 11, -78 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = s.s;
      ctx.beginPath();
      ctx.moveTo(s.x - 3, -82 + bob); ctx.lineTo(s.x, s.y + 8 + bob); ctx.lineTo(s.x + 2, -82 + bob); ctx.closePath(); ctx.fill();
    }

    // Multiple Unblinking Mismatched Eyes, Cracked Fusion Cores & Screaming Fissure Maw
    this.drawCrackedCorruptionGem(ctx, -20, -58 + bob, 12, '#f43f5e', '#fecdd3');
    this.drawCrackedCorruptionGem(ctx, 20, -52 + bob, 11, '#38bdf8', '#e0f2fe');
    this.drawCrackedCorruptionGem(ctx, 2, -74 + bob, 8, '#fbbf24', '#fef9c3');
    ctx.fillStyle = '#05020a';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -32 + bob, 22, 11, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, -19, -39 + bob, 6, 38, 8.5, 1);
    this.drawHorrorFangs(ctx, -17, -23 + bob, 5, 34, 7, -1);
  }

  drawIceGuardian(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 3.5;
    const pulse = 0.5 + 0.5 * Math.sin(e.animTime * 6);

    // Floating Orbiting Cryo-Crystal Shards flanking the Guardian!
    for (let i = 0; i < 4; i++) {
      const ang = e.animTime * 1.6 + i * (Math.PI / 2);
      const sx = Math.cos(ang) * 68;
      const sy = -68 + Math.sin(ang) * 20 + bob;
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sx, sy - 11); ctx.lineTo(sx + 6, sy); ctx.lineTo(sx, sy + 11); ctx.lineTo(sx - 6, sy);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Towering Armored Glacial Pillar Legs & Spiked Frost Knees
    ctx.fillStyle = '#082f49';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    for (const lx of [-34, 14]) {
      ctx.beginPath(); ctx.roundRect(lx, -30, 20, 30, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath(); ctx.moveTo(lx + 4, -20); ctx.lineTo(lx + 10, -28); ctx.lineTo(lx + 16, -20); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#082f49';
    }

    // Colossal Faceted Ice-Armor Shoulders & Sculpted Crystal Chest
    const gGrad = ctx.createLinearGradient(0, -110 + bob, 0, -14 + bob);
    gGrad.addColorStop(0, '#e0f2fe');
    gGrad.addColorStop(0.35, '#38bdf8');
    gGrad.addColorStop(0.75, '#0369a1');
    gGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = gGrad;
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-40, -18 + bob);
    ctx.lineTo(-62, -62 + bob);
    ctx.lineTo(-42, -98 + bob);
    ctx.lineTo(0, -108 + bob);
    ctx.lineTo(42, -98 + bob);
    ctx.lineTo(62, -62 + bob);
    ctx.lineTo(40, -18 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Faceted Geometric Glacial Light Planes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -108 + bob); ctx.lineTo(0, -18 + bob);
    ctx.moveTo(-62, -62 + bob); ctx.lineTo(0, -52 + bob); ctx.lineTo(62, -62 + bob);
    ctx.stroke();

    // Towering Branching Glacier Crown Antlers!
    ctx.fillStyle = '#f0f9ff';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 14, -96 + bob);
      ctx.lineTo(sgn * 54, -146 + bob);
      ctx.lineTo(sgn * 40, -112 + bob);
      ctx.lineTo(sgn * 62, -122 + bob);
      ctx.lineTo(sgn * 38, -88 + bob);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Fractured Deep-Sapphire Cryo Core + Blazing Predator Slit Eyes & Frost Fangs
    this.drawCrackedCorruptionGem(ctx, 0, -50 + bob, 19, '#0ea5e9', '#ffffff');
    ctx.fillStyle = '#041b2d';
    ctx.beginPath(); ctx.roundRect(-24, -84 + bob, 48, 22, 6); ctx.fill();
    ctx.fillStyle = e.windup > 0 ? '#f43f5e' : `rgba(125, 211, 252, ${0.75 + 0.25 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(-18, -79 + bob); ctx.lineTo(-4, -74 + bob); ctx.lineTo(-15, -70 + bob); ctx.closePath();
    ctx.moveTo(18, -79 + bob); ctx.lineTo(4, -74 + bob); ctx.lineTo(15, -70 + bob); ctx.closePath();
    ctx.fill();
    this.drawHorrorFangs(ctx, -18, -68 + bob, 5, 36, 7.5, 1);
  }

  // NEW DEDICATED BOSS: GIANT CORRUPTED SKY-SPIRE BIRD (Episode 2 — Giant Woman!)
  drawGiantBird(ctx, e) {
    const flap = Math.sin(e.animTime * 9) * 26;
    const hover = Math.sin(e.animTime * 3.5) * 6;
    const isDanger = e.windup > 0 || e.phase2;

    // Colossal Multi-Layered Corrupted Lavender-Cyan Feathered Wingspan!
    for (const sgn of [-1, 1]) {
      ctx.save();
      ctx.translate(sgn * 18, -64 + hover);
      ctx.rotate(sgn * (-0.12 + flap * 0.014));
      const wGrad = ctx.createLinearGradient(0, -45, sgn * 105, 15);
      wGrad.addColorStop(0, '#312e81');
      wGrad.addColorStop(0.5, '#0891b2');
      wGrad.addColorStop(1, '#a5f3fc');
      ctx.fillStyle = wGrad;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(sgn * 42, -62, sgn * 84, -52, sgn * 108, -24);
      ctx.lineTo(sgn * 84, -10);
      ctx.lineTo(sgn * 96, 4);
      ctx.lineTo(sgn * 68, 12);
      ctx.lineTo(sgn * 74, 24);
      ctx.quadraticCurveTo(sgn * 34, 26, 0, 12);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Feather vane accents
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sgn * 16, -8); ctx.lineTo(sgn * 86, -20);
      ctx.moveTo(sgn * 16, 2); ctx.lineTo(sgn * 72, 2);
      ctx.stroke();
      ctx.restore();
    }

    // Sweeping Tail Plumes + Giant Razor Raptor Talons
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-20, -34 + hover); ctx.lineTo(-34, 4 + hover); ctx.lineTo(-10, -10 + hover);
    ctx.lineTo(0, 10 + hover); ctx.lineTo(10, -10 + hover); ctx.lineTo(34, 4 + hover); ctx.lineTo(20, -34 + hover);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Towering Plumed Avian Torso
    const bGrad = ctx.createRadialGradient(0, -64 + hover, 8, 0, -56 + hover, 48);
    bGrad.addColorStop(0, '#4338ca');
    bGrad.addColorStop(0.6, '#1e1b4b');
    bGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = bGrad;
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(0, -58 + hover, 34, 40, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Jagged Spiky Head Crest + Menacing Corrupted Avian Head
    ctx.fillStyle = '#312e81';
    ctx.strokeStyle = '#a5f3fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -92 + hover); ctx.lineTo(-36, -132 + hover); ctx.lineTo(-6, -108 + hover);
    ctx.lineTo(4, -142 + hover); ctx.lineTo(18, -106 + hover); ctx.lineTo(36, -124 + hover);
    ctx.lineTo(20, -88 + hover);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Huge Hooked Ivory-Gold Beak + Gaping Fanged Maw
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(14, -94 + hover);
    ctx.quadraticCurveTo(56, -98 + hover, 64, -68 + hover);
    ctx.lineTo(46, -64 + hover);
    ctx.lineTo(14, -72 + hover);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    this.drawHorrorFangs(ctx, 18, -74 + hover, 5, 28, 8, 1);

    // Four Eerie Glowing Multi-Eyes (Canon Giant Bird Horror!)
    for (const [ex, ey, er] of [[6, -96, 5.2], [18, -94, 4.4], [-4, -88, 3.8], [14, -85, 3.5]]) {
      ctx.fillStyle = isDanger ? '#f43f5e' : '#fef08a';
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(ex, ey + hover, er, er * 0.72, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#09090b';
      ctx.beginPath(); ctx.ellipse(ex + 0.8, ey + hover, er * 0.28, er * 0.65, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Cracked Opal-Cyan Corrupted Heart Gem
    this.drawCrackedCorruptionGem(ctx, 0, -52 + hover, 15, '#22d3ee', '#ffffff');
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

    // Exhaust Smokestacks on Shoulders with Rising Magma Embers
    ctx.fillStyle = '#292524';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.6;
    for (const sx of [-32, 22]) {
      ctx.beginPath(); ctx.roundRect(sx, -124 + bob, 10, 26, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = `rgba(251, 146, 60, ${glow})`;
      ctx.beginPath(); ctx.arc(sx + 5, -130 + bob - ((e.animTime * 22) % 14), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#292524';
    }

    // Heavy Armored Piston Greaves & Spiked Footplates
    ctx.fillStyle = '#1c1917';
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 1.8;
    for (const lx of [-30, 8]) {
      ctx.beginPath(); ctx.roundRect(lx, -30, 22, 30, 4); ctx.fill(); ctx.stroke();
    }

    // Colossal Obsidian Furnace Hull + Layered Pauldrons
    const fGrad = ctx.createLinearGradient(0, -110 + bob, 0, -24 + bob);
    fGrad.addColorStop(0, '#57534e');
    fGrad.addColorStop(0.5, '#1c1917');
    fGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = fGrad;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-36, -26 + bob);
    ctx.lineTo(-52, -88 + bob);
    ctx.lineTo(-22, -110 + bob);
    ctx.lineTo(22, -110 + bob);
    ctx.lineTo(52, -88 + bob);
    ctx.lineTo(36, -26 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Molten Ribcage Furnace Grate + Cracked Core
    ctx.fillStyle = `rgba(234, 88, 12, ${0.45 + glow * 0.45})`;
    ctx.beginPath(); ctx.roundRect(-22, -74 + bob, 44, 34, 6); ctx.fill();
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 3.5;
    for (let gy = -66; gy <= -46; gy += 10) {
      ctx.beginPath(); ctx.moveTo(-22, gy + bob); ctx.lineTo(22, gy + bob); ctx.stroke();
    }
    this.drawCrackedCorruptionGem(ctx, 0, -56 + bob, 14, '#ea580c', '#fef08a');

    // Armored Visor Helmet + Fierce Blazing Molten Slit Eye
    ctx.fillStyle = '#0c0a09';
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.roundRect(-24, -102 + bob, 48, 20, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-18, -94 + bob); ctx.lineTo(18, -94 + bob); ctx.lineTo(12, -88 + bob); ctx.lineTo(-12, -88 + bob);
    ctx.closePath(); ctx.fill();

    // Heavy Pneumatic Forge Anvil-Fist & Left Shield Claw!
    ctx.fillStyle = '#451a03';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(36, -78 + bob, 24, 24, 4);
    ctx.roundRect(54, -96 + bob, 24, 60, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = `rgba(251, 146, 60, ${glow})`;
    ctx.fillRect(62, -88 + bob, 8, 44);
  }

  drawAgateWarden(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 2.5;
    const spark = Math.sin(e.animTime * 16) * 4;

    // Commanding Tall Homeworld Officer Boots & Tapered Leggings
    ctx.fillStyle = '#082f49';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.4;
    for (const lx of [-15, 4]) {
      ctx.beginPath(); ctx.roundRect(lx, -38, 11, 38, 4); ctx.fill(); ctx.stroke();
    }

    // Dramatic Sweeping Holly Blue Officer Cape + Tailored Uniform Tunic + Blue Diamond Crest
    ctx.fillStyle = '#0c4a6e';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-26, -92 + bob); ctx.lineTo(26, -92 + bob); ctx.lineTo(38, -10 + bob); ctx.lineTo(-38, -10 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    const uGrad = ctx.createLinearGradient(0, -92 + bob, 0, -34 + bob);
    uGrad.addColorStop(0, '#38bdf8');
    uGrad.addColorStop(0.5, '#0284c7');
    uGrad.addColorStop(1, '#075985');
    ctx.fillStyle = uGrad;
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-24, -92 + bob); ctx.lineTo(24, -92 + bob); ctx.lineTo(15, -36 + bob); ctx.lineTo(-15, -36 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Glowing Blue Diamond Officer Insignia
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(0, -78 + bob); ctx.lineTo(8, -66 + bob); ctx.lineTo(0, -54 + bob); ctx.lineTo(-8, -66 + bob);
    ctx.closePath(); ctx.fill();

    // Iconic Twin Swept Sculpted Holly Blue White Hair Cones!
    ctx.fillStyle = '#f0f9ff';
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 1.8;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 9, -106 + bob);
      ctx.quadraticCurveTo(sgn * 44, -142 + bob, sgn * 42, -106 + bob);
      ctx.quadraticCurveTo(sgn * 28, -90 + bob, sgn * 13, -92 + bob);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Chiseled Stern Agate Face + Piercing Glaring Eyes + Furious Scowl
    ctx.fillStyle = '#7dd3fc';
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(0, -102 + bob, 14.5, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.moveTo(-11, -106 + bob); ctx.lineTo(-2, -102 + bob); ctx.lineTo(-9, -99 + bob); ctx.closePath();
    ctx.moveTo(11, -106 + bob); ctx.lineTo(2, -102 + bob); ctx.lineTo(9, -99 + bob); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-6, -103 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -103 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-5, -93 + bob); ctx.quadraticCurveTo(0, -96 + bob, 5, -93 + bob); ctx.stroke();

    // Crackling Electric Shock-Whip in Lead Hand!
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(20, -68 + bob);
    ctx.quadraticCurveTo(48, -58 + bob + spark, 68, -22 + bob - spark);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawTopazFusion(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 3;
    // Heavy Squared Golden Juggernaut Boots
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    for (const lx of [-36, 10]) {
      ctx.beginPath(); ctx.roundRect(lx, -34, 26, 34, 5); ctx.fill(); ctx.stroke();
    }

    // Colossal Armored Double-Topaz Torso & Massive Blocky Pauldrons
    const topGrad = ctx.createLinearGradient(0, -108 + bob, 0, -30 + bob);
    topGrad.addColorStop(0, '#fde047');
    topGrad.addColorStop(0.45, '#d97706');
    topGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = topGrad;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-42, -30 + bob);
    ctx.lineTo(-54, -98 + bob);
    ctx.lineTo(54, -98 + bob);
    ctx.lineTo(42, -30 + bob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Yellow Diamond Uniform Band & Glowing Chest Diamond
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, -86 + bob); ctx.lineTo(15, -70 + bob); ctx.lineTo(0, -54 + bob); ctx.lineTo(-15, -70 + bob);
    ctx.closePath(); ctx.fill();

    // Sculpted Squared Topaz Head + Stoic Eyes + Twin Ear Gems!
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-24, -134 + bob, 48, 38, 7); ctx.fill(); ctx.stroke();
    // Flat-top golden hair cap
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.roundRect(-24, -138 + bob, 48, 12, 4); ctx.fill(); ctx.stroke();
    // Stoic glowing eyes & stern mouth
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-14, -118 + bob, 9, 4);
    ctx.fillRect(5, -118 + bob, 9, 4);
    ctx.fillRect(-7, -105 + bob, 14, 2.5);
    // Twin Topaz Ear-Gems
    this.drawCrackedCorruptionGem(ctx, -26, -116 + bob, 8, '#fde047', '#ffffff');
    this.drawCrackedCorruptionGem(ctx, 26, -116 + bob, 8, '#fde047', '#ffffff');

    // Giant Double-Headed Golden Energy War-Club!
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(44, -84 + bob); ctx.lineTo(66, -24 + bob); ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(52, -36 + bob, 26, 20, 6); ctx.fill(); ctx.stroke();
  }

  drawRobonoidTitan(ctx, e) {
    const legWalk = Math.sin(e.animTime * 6) * 8;
    const hover = Math.sin(e.animTime * 3.5) * 3.5;

    // Articulated Multi-Jointed Hydraulic Dreadnought Spider Legs!
    for (const [rx, fx, wOff] of [[-30, -64, legWalk], [30, 64, -legWalk], [-14, -34, -legWalk * 0.6], [14, 34, legWalk * 0.6]]) {
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(rx, -64 + hover);
      ctx.lineTo(fx * 0.85, -30 + hover * 0.5);
      ctx.lineTo(fx, wOff);
      ctx.stroke();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    // Rotating Homeworld EMP Ring Around Chassis
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -78 + hover, 58, 16, Math.sin(e.animTime * 2) * 0.15, 0, Math.PI * 2); ctx.stroke();

    // Armored Ribbed Flask-Robonoid War Dome
    const hullGrad = ctx.createRadialGradient(-14, -96 + hover, 8, 0, -78 + hover, 48);
    hullGrad.addColorStop(0, '#86efac');
    hullGrad.addColorStop(0.5, '#15803d');
    hullGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = hullGrad;
    ctx.strokeStyle = '#021c0e';
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, -78 + hover, 46, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Metallic Panel Seams & Threat Scanner Lens
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -78 + hover, 46, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = '#022c22';
    ctx.beginPath(); ctx.arc(10, -78 + hover, 19, 0, Math.PI * 2); ctx.fill();
    this.drawCrackedCorruptionGem(ctx, 11, -78 + hover, 14, '#4ade80', '#fef08a');
    this.drawHorrorFangs(ctx, -18, -50 + hover, 5, 36, 7, 1);
  }

  drawWhiteDiamond(ctx, e) {
    // =========================================================================
    // WHITE DIAMOND — TERRIFYING, IMPOSING, UNCANNY COSMIC MATRIARCH
    // Stark Chiaroscuro Black-and-White Contrast • Supernova Hair Halo •
    // Starry Nebula Cape • Eerie Puppeteer T-Pose Hands • Unblinking Piercing Gaze
    // =========================================================================
    const t = e.animTime || 0;
    const floatBob = Math.sin(t * 2.2) * 5.5;
    const isAttacking = e.windup > 0 || e.phase2;
    const eeriePulse = 0.65 + 0.35 * Math.sin(t * 5.5);

    ctx.save();

    // 1. BLINDING CHILL-INDUCING GOD-RAY STARBURST & HOMEWORLD DIAMOND HALO
    ctx.save();
    ctx.translate(0, -118 + floatBob);
    // Stark void-black eclipse ring behind her so her blinding white silhouette pops terrifyingly
    const voidGrad = ctx.createRadialGradient(0, 0, 22, 0, 0, 118);
    voidGrad.addColorStop(0, isAttacking ? 'rgba(255, 255, 255, 0.55)' : 'rgba(226, 232, 240, 0.30)');
    voidGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.45)');
    voidGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = voidGrad;
    ctx.beginPath(); ctx.arc(0, 0, 118, 0, Math.PI * 2); ctx.fill();

    // Slow ominous rotating razor god-rays
    ctx.fillStyle = isAttacking ? 'rgba(255, 255, 255, 0.34)' : 'rgba(241, 245, 249, 0.16)';
    for (let r = 0; r < 12; r++) {
      const a = (r * Math.PI) / 6 + t * 0.22;
      const len = (r % 2 === 0 ? 112 : 84) + Math.sin(t * 4 + r) * 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a - 0.06) * len, Math.sin(a - 0.06) * len);
      ctx.lineTo(Math.cos(a + 0.06) * len, Math.sin(a + 0.06) * len);
      ctx.closePath();
      ctx.fill();
    }

    // Concentric Geometric Homeworld Diamond Halo Rings
    ctx.strokeStyle = isAttacking ? 'rgba(255, 255, 255, 0.92)' : 'rgba(226, 232, 240, 0.62)';
    ctx.lineWidth = isAttacking ? 2.6 : 1.8;
    ctx.beginPath(); ctx.arc(0, 0, 74, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -86); ctx.lineTo(66, 0); ctx.lineTo(0, 86); ctx.lineTo(-66, 0); ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 2. FLOWING TRANSLUCENT STARRY NEBULA CAPE (Floor-Length Cosmic Shroud!)
    const capeGrad = ctx.createLinearGradient(0, -104 + floatBob, 0, 4);
    capeGrad.addColorStop(0, 'rgba(248, 250, 252, 0.92)');
    capeGrad.addColorStop(0.35, 'rgba(148, 163, 184, 0.72)');
    capeGrad.addColorStop(0.75, 'rgba(30, 41, 59, 0.85)');
    capeGrad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
    ctx.fillStyle = capeGrad;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-46, -98 + floatBob);
    ctx.quadraticCurveTo(-76, -54 + floatBob, -84, 2);
    ctx.quadraticCurveTo(0, 10, 84, 2);
    ctx.quadraticCurveTo(76, -54 + floatBob, 46, -98 + floatBob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Twinkling White Cosmic Stars Floating Inside Her Sheer Cape
    ctx.fillStyle = '#ffffff';
    for (let st = 0; st < 16; st++) {
      const sx = Math.sin(st * 2.7 + 0.4) * (28 + (st % 4) * 12);
      const sy = -14 - (st * 5.2) + floatBob * 0.5;
      const sr = (st % 3 === 0 ? 1.8 : 1.1) * (0.55 + 0.45 * Math.sin(t * 5 + st * 1.9));
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    }

    // 3. EERIE IMPERIOUS T-POSE / PUPPETEER ARMS & ELONGATED CLAWED FINGERS!
    const armLift = Math.sin(t * 2.5) * 5;
    for (const sgn of [-1, 1]) {
      // Long ghostly slender porcelain arm reaching imperiously outward
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sgn * 28, -94 + floatBob);
      ctx.quadraticCurveTo(sgn * 58, -90 + floatBob + armLift, sgn * 84, -76 + floatBob - armLift);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5.5;
      ctx.stroke();

      // Elongated Puppeteer Hand & 5 Razor-Manicured Fingers (reaching down like strings!)
      const hx = sgn * 86, hy = -75 + floatBob - armLift;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(hx, hy, 5.5, 4.2, sgn * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      for (let f = -2; f <= 2; f++) {
        const fa = (sgn > 0 ? 0.35 : Math.PI - 0.35) + f * 0.26;
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.cos(fa) * 16, hy + Math.sin(fa) * 16); ctx.stroke();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        // Puppeteer white mind-control string glowing from fingertips during attack/Phase 2!
        if (isAttacking && Math.abs(f) <= 1) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + 0.45 * eeriePulse})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(hx + Math.cos(fa) * 16, hy + Math.sin(fa) * 16);
          ctx.lineTo(hx + Math.cos(fa) * 28, 6);
          ctx.stroke();
        }
      }
    }

    // 4. MONUMENTAL HOURGLASS IVORY-PEARL GOWN WITH STARK CHIAROSCURO SHADOWS!
    const gownGrad = ctx.createLinearGradient(-34, -98 + floatBob, 34, 0);
    gownGrad.addColorStop(0, '#ffffff');
    gownGrad.addColorStop(0.52, '#f8fafc');
    gownGrad.addColorStop(0.75, '#94a3b8');
    gownGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = gownGrad;
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-34, -100 + floatBob);
    ctx.lineTo(34, -100 + floatBob);
    ctx.quadraticCurveTo(18, -74 + floatBob, 15, -58 + floatBob);
    ctx.quadraticCurveTo(32, -32 + floatBob, 42, 0);
    ctx.lineTo(-42, 0);
    ctx.quadraticCurveTo(-32, -32 + floatBob, -15, -58 + floatBob);
    ctx.quadraticCurveTo(-18, -74 + floatBob, -34, -100 + floatBob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Sharp Dramatic Sculpted Diamond Shoulder-Mantle Pads
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-48, -104 + floatBob); ctx.lineTo(-22, -100 + floatBob); ctx.lineTo(-28, -86 + floatBob); ctx.closePath();
    ctx.moveTo(48, -104 + floatBob); ctx.lineTo(22, -100 + floatBob); ctx.lineTo(28, -86 + floatBob); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Stark Black Chiaroscuro Gown Fold + White Diamond Authority Chest Emblem
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.beginPath();
    ctx.moveTo(6, -56 + floatBob); ctx.lineTo(28, 0); ctx.lineTo(42, 0); ctx.lineTo(15, -58 + floatBob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -90 + floatBob); ctx.lineTo(10, -76 + floatBob); ctx.lineTo(0, -62 + floatBob); ctx.lineTo(-10, -76 + floatBob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Slender Alabaster Neck
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.roundRect(-6.5, -114 + floatBob, 13, 18, 3); ctx.fill(); ctx.stroke();

    // 5. TOWERING RAZOR-SHARP 5-POINT SUPERNOVA HAIR HALO (Canon Massive White Diamond Hair!)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-34, -124 + floatBob);
    ctx.lineTo(-76, -138 + floatBob); // far-left spike
    ctx.lineTo(-42, -146 + floatBob);
    ctx.lineTo(-56, -182 + floatBob); // upper-left spike
    ctx.lineTo(-20, -158 + floatBob);
    ctx.lineTo(0, -206 + floatBob);   // towering central spire!
    ctx.lineTo(20, -158 + floatBob);
    ctx.lineTo(56, -182 + floatBob);  // upper-right spike
    ctx.lineTo(42, -146 + floatBob);
    ctx.lineTo(76, -138 + floatBob);  // far-right spike
    ctx.lineTo(34, -124 + floatBob);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Crisp Silver-Grey Architectural Hair Facets
    ctx.fillStyle = 'rgba(148, 163, 184, 0.42)';
    ctx.beginPath();
    ctx.moveTo(0, -206 + floatBob); ctx.lineTo(20, -158 + floatBob); ctx.lineTo(0, -148 + floatBob); ctx.closePath();
    ctx.moveTo(56, -182 + floatBob); ctx.lineTo(42, -146 + floatBob); ctx.lineTo(22, -146 + floatBob); ctx.closePath();
    ctx.moveTo(-76, -138 + floatBob); ctx.lineTo(-34, -124 + floatBob); ctx.lineTo(-42, -146 + floatBob); ctx.closePath();
    ctx.fill();

    // 6. UNCANNY CHISELED PORCELAIN FACE WITH STARK BLACK-AND-WHITE SHADOWS!
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-22, -148 + floatBob);
    ctx.lineTo(22, -148 + floatBob);
    ctx.quadraticCurveTo(25, -122 + floatBob, 0, -104 + floatBob);
    ctx.quadraticCurveTo(-25, -122 + floatBob, -22, -148 + floatBob);
    ctx.closePath();
    ctx.fill();
    // Stark chiaroscuro shadow across right jaw & under cheekbones (creepy anime horror lighting!)
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.moveTo(8, -148 + floatBob); ctx.lineTo(26, -148 + floatBob); ctx.lineTo(26, -102 + floatBob); ctx.lineTo(-2, -102 + floatBob);
    ctx.quadraticCurveTo(14, -120 + floatBob, 8, -148 + floatBob);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(-22, -148 + floatBob);
    ctx.lineTo(22, -148 + floatBob);
    ctx.quadraticCurveTo(25, -122 + floatBob, 0, -104 + floatBob);
    ctx.quadraticCurveTo(-25, -122 + floatBob, -22, -148 + floatBob);
    ctx.closePath();
    ctx.stroke();

    // 7. TERRIFYING UNBLINKING MONOCHROME EYES WITH RAZOR-LONG BLACK LASHES & PINPOINT DIAMOND PUPILS!
    for (const s of [-1, 1]) {
      // Dramatic sweeping razor-sharp upper black eyelid & 3 spidery eyelashes
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.moveTo(s * 4, -131 + floatBob);
      ctx.quadraticCurveTo(s * 12, -139 + floatBob, s * 22, -135 + floatBob);
      ctx.lineTo(s * 17, -129 + floatBob);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(s * 16, -135 + floatBob); ctx.lineTo(s * 24, -140 + floatBob);
      ctx.moveTo(s * 18, -133 + floatBob); ctx.lineTo(s * 25, -134 + floatBob);
      ctx.stroke();

      // Eerie eye sclera (turns hollow pitch-black during Phase 2 / Attack windup with blinding white pinpoints!)
      ctx.fillStyle = isAttacking ? '#020617' : '#f1f5f9';
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(s * 11, -130.5 + floatBob, 5.8, 3.6, s * -0.1, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Cold silver-grey iris ring + tiny uncanny diamond pinpoint pupil!
      if (!isAttacking) {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(s * 11, -130.5 + floatBob, 2.7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = isAttacking ? '#ffffff' : '#020617';
      ctx.beginPath();
      ctx.moveTo(s * 11, -133.2 + floatBob);
      ctx.lineTo(s * 12.6, -130.5 + floatBob);
      ctx.lineTo(s * 11, -127.8 + floatBob);
      ctx.lineTo(s * 9.4, -130.5 + floatBob);
      ctx.closePath();
      ctx.fill();

      // High arched cold perfectionist brow
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(s * 5, -139 + floatBob);
      ctx.quadraticCurveTo(s * 12, -143 + floatBob, s * 19, -138 + floatBob);
      ctx.stroke();
    }

    // Sharp sculpted nose shadow
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, -130 + floatBob); ctx.lineTo(2, -121 + floatBob); ctx.lineTo(-1, -120 + floatBob); ctx.stroke();

    // 8. CHILLING GLOSSY JET-BLACK LIPSTICK SMILE (Widens into uncanny menacing grin when attacking!)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    if (isAttacking) {
      // Uncanny wide sinister grin showing stark blinding white teeth
      ctx.moveTo(-10, -116 + floatBob);
      ctx.quadraticCurveTo(0, -110 + floatBob, 10, -116 + floatBob);
      ctx.quadraticCurveTo(0, -106 + floatBob, -10, -116 + floatBob);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-7, -114.5 + floatBob); ctx.quadraticCurveTo(0, -112 + floatBob, 7, -114.5 + floatBob);
      ctx.quadraticCurveTo(0, -110 + floatBob, -7, -114.5 + floatBob);
      ctx.fill();
    } else {
      // Cold, overly-perfect glossy black lips
      ctx.moveTo(-9, -115.5 + floatBob);
      ctx.quadraticCurveTo(-3, -118.5 + floatBob, 0, -116.8 + floatBob);
      ctx.quadraticCurveTo(3, -118.5 + floatBob, 9, -115.5 + floatBob);
      ctx.quadraticCurveTo(0, -109.5 + floatBob, -9, -115.5 + floatBob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath(); ctx.ellipse(2, -114 + floatBob, 2.2, 0.7, 0, 0, Math.PI * 2); ctx.fill();
    }

    // 9. BLINDING FACETED INVERTED-TRIANGLE WHITE DIAMOND FOREHEAD GEM + CROSS-FLARE!
    const gx = 0, gy = -152 + floatBob;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(gx, gy + 12);
    ctx.lineTo(gx + 10, gy - 4);
    ctx.lineTo(gx, gy - 12);
    ctx.lineTo(gx - 10, gy - 4);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Inner gem diamond facet lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(gx - 10, gy - 4); ctx.lineTo(gx + 10, gy - 4);
    ctx.moveTo(gx, gy - 12); ctx.lineTo(gx, gy + 12);
    ctx.stroke();
    // Blinding 4-point star flare glinting off her forehead gem!
    const flR = 14 + eeriePulse * 9;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.moveTo(gx, gy - flR); ctx.lineTo(gx + 2.2, gy - 2.2); ctx.lineTo(gx + flR, gy);
    ctx.lineTo(gx + 2.2, gy + 2.2); ctx.lineTo(gx, gy + flR); ctx.lineTo(gx - 2.2, gy + 2.2);
    ctx.lineTo(gx - flR, gy); ctx.lineTo(gx - 2.2, gy - 2.2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
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
