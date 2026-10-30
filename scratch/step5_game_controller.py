import re

game_js_path = '/home/wanibur/Documents/Wani Works/Antigravity Tests/Steven Universe/game.js'

with open(game_js_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update EnemyManager.update signature to support platforms and player2
old_enemy_mgr_update_head = """  update(dt, player, audioEngine, particles, projectiles, onPoofed) {
    // Top-Center Boss Bar Synchronization
    const bossHud = document.getElementById('bossHud');
    const activeBoss = this.enemies.find(en => en.isBoss);

    if (activeBoss && bossHud) {
      bossHud.style.display = 'flex';
      const nameEl = document.getElementById('bossName');
      const digitsEl = document.getElementById('bossHpDigits');
      const fillEl = document.getElementById('bossHpFill');
      if (nameEl) nameEl.textContent = activeBoss.name;
      if (digitsEl) digitsEl.textContent = `${Math.max(0, Math.ceil(activeBoss.hp))} / ${activeBoss.maxHp}`;
      if (fillEl) {
        const pct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
        fillEl.style.width = `${pct}%`;
      }
    } else if (bossHud) {
      bossHud.style.display = 'none';
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.animTime += dt;
      if (e.hurtTimer > 0) e.hurtTimer -= dt;

      const dx = player.x - e.x;"""

new_enemy_mgr_update_head = """  update(dt, player, audioEngine, particles, projectiles, onPoofed, platforms = [], player2 = null) {
    // Top-Center Boss Bar Synchronization
    const bossHud = document.getElementById('bossHud');
    const activeBoss = this.enemies.find(en => en.isBoss);

    if (activeBoss && bossHud) {
      bossHud.style.display = 'flex';
      const nameEl = document.getElementById('bossName');
      const digitsEl = document.getElementById('bossHpDigits');
      const fillEl = document.getElementById('bossHpFill');
      if (nameEl) nameEl.textContent = activeBoss.name;
      if (digitsEl) digitsEl.textContent = activeBoss.isImmortalDummy ? 'INFINITE / INFINITE' : `${Math.max(0, Math.ceil(activeBoss.hp))} / ${activeBoss.maxHp}`;
      if (fillEl) {
        const pct = activeBoss.isImmortalDummy ? 100 : Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
        fillEl.style.width = `${pct}%`;
      }
    } else if (bossHud) {
      bossHud.style.display = 'none';
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.animTime += dt;
      if (e.hurtTimer > 0) e.hurtTimer -= dt;

      // Target closest player in 2-Player mode
      let targetPlayer = player;
      if (player2) {
        targetPlayer = (Math.abs(player.x - e.x) < Math.abs(player2.x - e.x)) ? player : player2;
      }
      const dx = targetPlayer.x - e.x;"""

if old_enemy_mgr_update_head in code:
    code = code.replace(old_enemy_mgr_update_head, new_enemy_mgr_update_head)
    print("EnemyManager.update header updated.")

# In EnemyManager.update, check attacks for player2 as well
old_check_attacks = """      // Check attacks against enemies
      this.checkPlayerAttackCollisions(e, player, projectiles, particles, audioEngine, onPoofed, i);"""

new_check_attacks = """      // Check attacks against enemies (Player 1 and Player 2)
      this.checkPlayerAttackCollisions(e, player, projectiles, particles, audioEngine, onPoofed, i);
      if (player2 && !e.isPoofed) {
        this.checkPlayerAttackCollisions(e, player2, projectiles, particles, audioEngine, onPoofed, i);
      }"""

if old_check_attacks in code:
    code = code.replace(old_check_attacks, new_check_attacks)
    print("EnemyManager collision checks for player2 updated.")

# 2. Update StevenUniverseGame class constructor and methods
# Replace StevenUniverseGame class from constructor to startNewGame
old_game_ctor = """class StevenUniverseGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.audio = new GemAudioEngine();
    this.particles = new ParticleSystem();
    const cw = this.canvas ? this.canvas.width : 960;
    const ch = this.canvas ? this.canvas.height : 540;
    this.environment = new EnvironmentRenderer(cw, ch);

    this.player = new PlayerHero(ch - 110);
    this.enemyManager = new EnemyManager(ch - 110);

    this.projectiles = [];
    this.pickups = [];

    this.state = 'title';
    this.gameMode = 'story';
    this.stageIndex = 1;
    this.maxStages = 10;
    this.isTransitioning = false;

    this.difficulty = SafeStorage.getItem('su_difficulty') || 'medium';
    this.tempDifficulty = this.difficulty;

    this.selectedChar = SafeStorage.getItem('su_selectedChar') || 'steven';
    this.tempSelectedChar = this.selectedChar;

    const diffCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.maxHearts = diffCfg.hearts;
    this.currentHearts = this.maxHearts;
    this.score = 0;
    this.bubbledGemsCount = 0;
    this.starPowerMeter = 0;
    this.isOverdriveActive = false;
    this.overdriveTimer = 0;
    this.overdriveDuration = 12.0;
    this.highScore = parseInt(SafeStorage.getItem('su_highScore') || '0', 10) || 0;
    this.savedBubbles = safeJsonParse(SafeStorage.getItem('su_bubbledGems'), []);

    this.keys = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, bubble: false
    };

    this.lastTime = performance.now();
    this.initEventListeners();
    this.updateLobbyGuardian();
    this.updateLobbyDifficulty();
    this.updateHUD();
    this.updateActionBar();"""

new_game_ctor = """class StevenUniverseGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.audio = new GemAudioEngine();
    this.particles = new ParticleSystem();
    const cw = this.canvas ? this.canvas.width : 1280;
    const ch = this.canvas ? this.canvas.height : 720;
    this.groundY = ch - 120;
    this.environment = new EnvironmentRenderer(cw, ch);

    this.playerMode = SafeStorage.getItem('su_playerMode') || '1p';
    this.selectedCharP1 = SafeStorage.getItem('su_selectedChar') || 'steven';
    this.selectedCharP2 = SafeStorage.getItem('su_selectedCharP2') || 'garnet';
    this.selectedChar = this.selectedCharP1;
    this.tempSelectedChar = this.selectedChar;
    this.charSelectActiveTab = 'p1';

    this.player = new PlayerHero(this.groundY, 'p1');
    this.player2 = null;
    this.enemyManager = new EnemyManager(this.groundY);
    this.enemyManager.diffMult = 1.0;
    this.enemyManager.onComboHit = (dmg) => this.registerComboHit(dmg);

    this.projectiles = [];
    this.pickups = [];

    this.state = 'title';
    this.gameMode = 'story';
    this.stageIndex = 1;
    this.maxStages = 10;
    this.isTransitioning = false;

    this.difficulty = SafeStorage.getItem('su_difficulty') || 'medium';
    this.tempDifficulty = this.difficulty;

    const diffCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.diffMult = diffCfg.enemyHpMult || 1.0;
    this.maxHearts = diffCfg.hearts;
    this.currentHearts = this.maxHearts;
    this.currentHeartsP2 = this.maxHearts;
    this.score = 0;
    this.bubbledGemsCount = 0;

    this.starPowerMeter = 0;
    this.isOverdriveActive = false;
    this.overdriveTimer = 0;

    this.starPowerMeterP2 = 0;
    this.isOverdriveActiveP2 = false;
    this.overdriveTimerP2 = 0;

    this.overdriveDuration = 12.0;

    // Tekken-Style Combo Tracker
    this.comboHits = 0;
    this.comboDamage = 0;
    this.comboTimer = 0;

    this.highScore = parseInt(SafeStorage.getItem('su_highScore') || '0', 10) || 0;
    this.savedBubbles = safeJsonParse(SafeStorage.getItem('su_bubbledGems'), []);

    this.keysP1 = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, bubble: false
    };
    this.keysP2 = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, bubble: false
    };
    this.keys = this.keysP1;

    this.lastTime = performance.now();
    this.initEventListeners();
    this.updateLobbyGuardian();
    this.updateLobbyDifficulty();
    this.updateHUD();
    this.updateActionBar();"""

if old_game_ctor in code:
    code = code.replace(old_game_ctor, new_game_ctor)
    print("StevenUniverseGame constructor updated for widescreen, 2P mode & combos.")

with open(game_js_path, 'w', encoding='utf-8') as f:
    f.write(code)
