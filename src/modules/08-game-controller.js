class StevenUniverseGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false }) : null;
    this.audio = new GemAudioEngine();
    this.particles = new ParticleSystem();
    const cw = (this.canvas && typeof this.canvas.width === 'number' && !isNaN(this.canvas.width) && this.canvas.width > 0) ? this.canvas.width : 1280;
    const ch = (this.canvas && typeof this.canvas.height === 'number' && !isNaN(this.canvas.height) && this.canvas.height > 0) ? this.canvas.height : 720;
    this.groundY = ch - 120;
    this.stageWidth = 2600; // Wide stage arena!
    this.cameraX = 0;
    this.cameraZoom = 1.0;
    this.zoomImpulse = 0;
    this.zoomImpulseTimer = 0;
    this.camFocusX = cw / 2;
    this.camFocusY = this.groundY - 70;
    this.zoomFocusX = null;
    this.zoomFocusY = null;
    this.shakeDirX = 0;
    this.shakeDirY = 0;
    this.combatBadgeText = '';
    this.combatBadgeColor = '#fde047';
    this.combatBadgeTimer = 0;
    this.environment = new EnvironmentRenderer(cw, ch, this.stageWidth);

    this.playerMode = SafeStorage.getItem('su_playerMode') || '1p';
    this.selectedCharP1 = SafeStorage.getItem('su_selectedChar') || 'steven';
    this.selectedCharP2 = SafeStorage.getItem('su_selectedCharP2') || 'garnet';
    this.selectedChar = this.selectedCharP1;
    this.tempSelectedChar = this.selectedChar;
    this.charSelectActiveTab = 'p1';

    this.player = new PlayerHero(this.groundY, 'p1', this.stageWidth);
    this.player.gameRef = this;
    this.player2 = null;
    this.enemyManager = new EnemyManager(this.groundY, this.stageWidth);
    this.enemyManager.diffMult = 1.0;
    this.enemyManager.onComboHit = (dmg) => this.registerComboHit(dmg);
    this.enemyManager.gameRef = this;
    this.hitstopTimer = 0;
    this.hitShake = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    this.projectiles = [];
    this.pickups = [];

    this.state = 'title';
    this.gameMode = 'story';
    this.stageIndex = 1;
    this.maxStages = 10;
    this.isTransitioning = false;

    this.difficulty = SafeStorage.getItem('su_difficulty') || 'medium';
    // Story cutscenes (dialogue between waves). OFF = pure arcade run.
    this.storyMode = (SafeStorage.getItem('su_storyMode') || 'true') !== 'false';
    this.tempDifficulty = this.difficulty;

    const diffCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.diffMult = diffCfg.enemyHpMult || 1.0;
    this.maxHearts = diffCfg.hearts;
    this.initPlayerHeartPools();
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

    // Canonical Gem Fusion Attributes (Tag-Team Hyper Attack)
    this.fusionEnergy = 0;
    this.isFused = false;
    this.fusionTimer = 0;
    this.fusionMaxDuration = 12.0;
    this.isHyperAttack = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    // Freebuff fusion tuning: overcharge, pair power and variable duration (matched with 12s Overdrive)
    this.hyperAttackDuration = 12.0;
    this.activeFusionNukeMult = 1.0;
    this.activeFusionHeal = 1;
    this.synergyBuffTimer = 0;

    // 2-Player Co-Op Fusion Synergy Attributes
    this.lastAttackTimeP1 = 0;
    this.lastAttackTimeP2 = 0;
    this.lastDualStrikeTime = 0;
    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    // Robust Delta-Time Wave Controller Attributes (Immune to Pause & Idling)
    this.waveIndex = 0;
    this.waveSpawnQueue = [];
    this.waveClearTimer = 0;
    this.isWaitingForWaveClear = false;
    this.isBossSpawning = false;
    this.bossSpawnTimer = 0;
    this.gameOverTimerActive = false;

    // Concept UI, Arcade Endless Rush, Story Cutscenes, Lore Puzzles & Resolution
    this.selectedEntryMode = 'story';
    this.arcadeMapStage = parseInt(SafeStorage.getItem('su_arcadeMapStage'), 10) || 1;
    this.arcadeWave = 1;
    this.arcadeWavePending = false;
    this.arcadeBossEvery = 3;
    this.cutsceneActive = false;
    this.cutsceneData = null;
    this.cutsceneIndex = 0;
    this.cutsceneOnDone = null;
    this.puzzleActive = false;
    this.puzzleState = null;
    this.creditsActive = false;
    this.creditsSpeed = 1;
    this.resolutionPreset = SafeStorage.getItem('su_resolutionPreset') || 'auto';
    const savedGfx = SafeStorage.getItem('su_graphicsQuality');
    this.graphicsQuality = ['low', 'medium', 'high'].includes(savedGfx) ? savedGfx : 'high';
    const savedFps = parseInt(SafeStorage.getItem('su_targetFps') || '0', 10);
    this.targetFps = [0, 30, 60, 120].includes(savedFps) ? savedFps : 0;
    this.fastPerfMode = this.graphicsQuality === 'low';
    this.gfxShadowMult = this.graphicsQuality === 'low' ? 0 : (this.graphicsQuality === 'medium' ? 0.5 : 1.0);
    this._lastRenderedFrameTime = 0;

    this.keysP1 = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, dodge: false, bubble: false
    };
    this.keysP2 = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, dodge: false, bubble: false
    };
    this.keys = this.keysP1;

    this.lastTime = performance.now();
    this.initEventListeners();
    this.initInteractiveHoverPhysics();
    this.applyGraphicsPreset(this.graphicsQuality, { persist: false });
    this.setTargetFps(this.targetFps, { persist: false });
    this.applyResolution(this.resolutionPreset);
    this.updateLobbyGuardian();
    this.updateLobbyDifficulty();
    this.updateHUD();
    this.updateActionBar();
    this.updateFusionHUD();
    this.initLobbySlideshow();
    this.syncCharGridIcons();

    // Automatic Main Menu Music Autoplay & Front-Page Jukebox
    const updateLobbyMusicButton = (isPlaying) => {
      const btn = document.getElementById('btnLobbyPlayMusic');
      const icon = document.getElementById('lobbyMusicPlayIcon');
      const txt = document.getElementById('lobbyMusicPlayText');
      if (btn) {
        if (isPlaying) {
          btn.classList.add('playing');
          if (icon) icon.textContent = '⏸';
          if (txt) txt.textContent = 'PAUSE';
        } else {
          btn.classList.remove('playing');
          if (icon) icon.textContent = '▶';
          if (txt) txt.textContent = 'PLAY';
        }
      }
    };
    this.updateLobbyMusicButton = updateLobbyMusicButton;

    const getLobbyTrack = () => (
      this.audio.bgmOverrideManual && this.audio.selectedBgm && this.audio.selectedBgm !== 'auto'
        ? this.audio.selectedBgm
        : 'intro_launch'
    );

    // Arm the intro launch theme right away (even while suspended, scheduler awaits 'running')
    this.audio.playMusic('menu');

    let hasAudioUnlocked = false;
    const unlockEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];
    let lastHoverResumeMs = 0;
    this._lobbyPlayDownArmed = null;

    const cleanupUnlockListeners = () => {
      if (!hasAudioUnlocked) {
        hasAudioUnlocked = true;
        unlockEvents.forEach(evt => {
          window.removeEventListener(evt, unlockMenuAudio, true);
          if (typeof document !== 'undefined') document.removeEventListener(evt, unlockMenuAudio, true);
        });
        window.removeEventListener('mousemove', onHoverResume, true);
        window.removeEventListener('wheel', unlockMenuAudio, true);
      }
      const promptEl = document.getElementById('audioUnlockPrompt');
      if (promptEl) promptEl.style.display = 'none';
    };

    const syncRunningLobbyAudio = () => {
      if (!this.audio.isManuallyPaused) {
        if (this.state === 'title' && !this.audio.musicInterval) {
          this.audio.playTrackById(getLobbyTrack(), false);
        }
        updateLobbyMusicButton(true);
      }
      cleanupUnlockListeners();
    };
    this.audio.onRunningHook = syncRunningLobbyAudio;

    const onContextUnlocked = () => {
      this.audio.onAudioRunning();
      syncRunningLobbyAudio();
    };

    // Snapshot intent before capture-phase unlock wakes up AudioContext on Play/Pause clicks
    const armPlayButtonIntent = (evt) => {
      const tgt = evt && evt.target;
      const playBtn = tgt && (tgt.id === 'btnLobbyPlayMusic' ? tgt : (typeof tgt.closest === 'function' ? tgt.closest('#btnLobbyPlayMusic') : null));
      if (playBtn) {
        this._lobbyPlayDownArmed = this.audio.isActivelyPlaying() ? 'pause' : 'play';
      }
    };
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pointerdown', armPlayButtonIntent, { capture: true, passive: true });
      window.addEventListener('mousedown', armPlayButtonIntent, { capture: true, passive: true });
      window.addEventListener('touchstart', armPlayButtonIntent, { capture: true, passive: true });
    }

    const unlockMenuAudio = (evt) => {
      armPlayButtonIntent(evt);
      // Must unlock & trigger silent buffer synchronously inside user-gesture stack
      const runningNow = this.audio.unlockFromGesture();
      if (runningNow) {
        onContextUnlocked();
      } else if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
        this.audio.ctx.resume().then(() => {
          if (this.audio.ctx && this.audio.ctx.state === 'running') onContextUnlocked();
        }).catch(() => {});
      }
    };

    const onHoverResume = () => {
      if (!this.audio.ctx || this.audio.ctx.state === 'running' || this.audio.isManuallyPaused) return;
      const now = Date.now();
      if (now - lastHoverResumeMs < 250) return;
      lastHoverResumeMs = now;
      this.audio.ctx.resume().then(() => {
        if (this.audio.ctx && this.audio.ctx.state === 'running') onContextUnlocked();
      }).catch(() => {});
    };

    const tryAutoPlay = () => {
      this.audio.init();
      const promptEl = document.getElementById('audioUnlockPrompt');
      if (promptEl) promptEl.style.display = 'none';
      if (this.audio.ctx && this.audio.ctx.state === 'running') {
        onContextUnlocked();
      } else if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
        updateLobbyMusicButton(false);
        this.audio.ctx.resume().then(() => {
          if (this.audio.ctx && this.audio.ctx.state === 'running') onContextUnlocked();
        }).catch(() => {});
      }
    };

    // Immediate boot attempt + capture-phase first-gesture unlock across the whole page
    tryAutoPlay();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('DOMContentLoaded', tryAutoPlay, { once: true });
      window.addEventListener('load', tryAutoPlay, { once: true });
      window.addEventListener('pageshow', tryAutoPlay);
      unlockEvents.forEach(evt => {
        window.addEventListener(evt, unlockMenuAudio, { capture: true, passive: true });
        if (typeof document !== 'undefined') {
          document.addEventListener(evt, unlockMenuAudio, { capture: true, passive: true });
        }
      });
      window.addEventListener('mousemove', onHoverResume, { capture: true, passive: true });
      window.addEventListener('wheel', unlockMenuAudio, { capture: true, passive: true });
    }

    const ensureLobbyMusic = () => {
      if (this.state !== 'title' || this.audio.isManuallyPaused) return;
      if (!this.audio.ctx || this.audio.ctx.state !== 'running') return;
      if (!this.audio.musicInterval) {
        this.audio.playTrackById(getLobbyTrack(), false);
      }
      updateLobbyMusicButton(true);
    };
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('focus', tryAutoPlay, { passive: true });
    }
    setTimeout(tryAutoPlay, 50);
    setTimeout(tryAutoPlay, 300);
    setTimeout(ensureLobbyMusic, 800);
    setTimeout(ensureLobbyMusic, 2400);

    // Polling auto-resume interval during first 10 seconds of boot
    let autoAttempts = 0;
    const autoResumeTimer = setInterval(() => {
      autoAttempts++;
      if (this.audio.ctx && this.audio.ctx.state === 'running') {
        onContextUnlocked();
        clearInterval(autoResumeTimer);
      } else {
        tryAutoPlay();
      }
      if (autoAttempts > 40) clearInterval(autoResumeTimer);
    }, 250);

    // Strict mobile detection: Only enable touch controls on actual phones/tablets (Android / Xiaomi / iOS)
    this.isRealMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (window.innerWidth <= 950 && 'ontouchstart' in window);
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.style.display = 'none'; // Keep hidden on title screen until game starts
      if (this.isRealMobile) {
        document.body.classList.add('mobile-device');
        const mobileFooter = document.querySelector('.title-footer-mobile');
        const pcFooter = document.querySelector('.title-footer-pc');
        if (mobileFooter) mobileFooter.style.display = 'block';
        if (pcFooter) pcFooter.style.display = 'none';
        const pcBar = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
        if (pcBar) pcBar.style.display = 'none';
      } else {
        document.body.classList.remove('mobile-device');
      }
    }

    this.initStartupSplash();
  }

  initStartupSplash() {
    const splash = document.getElementById('startupSplash');
    const titleScreen = document.getElementById('titleScreen');
    if (!splash) {
      this.splashActive = false;
      this._splashGuardUntil = 0;
      return;
    }

    this.splashActive = true;
    this._splashFadingOut = false;
    this._splashTimers = [];
    this._splashGuardUntil = 0;
    if (titleScreen) {
      titleScreen.classList.remove('splash-reveal');
      titleScreen.classList.add('splash-pending');
    }

    const cleanupSkipListeners = () => {
      if (this._onSplashSkipKey && typeof window !== 'undefined') {
        window.removeEventListener('keydown', this._onSplashSkipKey, true);
      }
      if (this._onSplashSkipPointer && typeof window !== 'undefined') {
        window.removeEventListener('pointerdown', this._onSplashSkipPointer, true);
      }
      if (this._onSplashSwallowClick && typeof window !== 'undefined') {
        window.removeEventListener('click', this._onSplashSwallowClick, true);
        window.removeEventListener('mousedown', this._onSplashSwallowClick, true);
      }
      this._onSplashSkipKey = null;
      this._onSplashSkipPointer = null;
      this._onSplashSwallowClick = null;
    };

    const finishSplash = () => {
      this.splashActive = false;
      cleanupSkipListeners();
      splash.classList.add('splash-done');
      splash.style.display = 'none';
      if (titleScreen) {
        titleScreen.classList.remove('splash-pending');
      }
      if (typeof fitGameToViewport === 'function') fitGameToViewport();
    };

    const beginFadeOut = () => {
      if (this._splashFadingOut) return;
      this._splashFadingOut = true;
      this._splashGuardUntil = Date.now() + 180;
      this._splashTimers.forEach(t => clearTimeout(t));
      this._splashTimers = [];

      splash.classList.remove('phase-in');
      splash.classList.add('phase-text-out');
      splash.classList.add('phase-fade-out');
      if (titleScreen) {
        titleScreen.classList.remove('splash-pending');
      }
      if (typeof fitGameToViewport === 'function') fitGameToViewport();

      const tDone = setTimeout(() => {
        finishSplash();
      }, 520);
      this._splashTimers.push(tDone);
    };

    this.skipStartupSplash = () => {
      if (!this.splashActive) return;
      beginFadeOut();
    };
    this.finishStartupSplashImmediate = () => {
      this._splashFadingOut = true;
      this._splashGuardUntil = 0;
      this._splashTimers.forEach(t => clearTimeout(t));
      this._splashTimers = [];
      finishSplash();
      if (titleScreen) titleScreen.classList.remove('splash-reveal');
    };

    this._onSplashSkipKey = (e) => {
      if (!this.splashActive) return;
      try { this.audio.unlockFromGesture(); } catch (err) {}
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
      beginFadeOut();
    };
    this._onSplashSkipPointer = (e) => {
      if (!this.splashActive) return;
      try { this.audio.unlockFromGesture(); } catch (err) {}
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
      beginFadeOut();
    };
    this._onSplashSwallowClick = (e) => {
      if (this.splashActive || Date.now() < (this._splashGuardUntil || 0)) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
    };

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('keydown', this._onSplashSkipKey, true);
      window.addEventListener('pointerdown', this._onSplashSkipPointer, true);
      window.addEventListener('click', this._onSplashSwallowClick, true);
      window.addEventListener('mousedown', this._onSplashSwallowClick, true);
    }

    // Pre-fit viewport before fade so Main Menu never resizes/jumps during startup
    if (typeof fitGameToViewport === 'function') fitGameToViewport();
    // Smooth startup splash: fades in immediately -> holds 1.7s -> fades seamlessly into ready Main Menu
    splash.classList.add('phase-in');
    const tHold = setTimeout(() => {
      beginFadeOut();
    }, 1700);
    this._splashTimers.push(tHold);
  }

  getHeartPoolSpec(hero) {
    const stats = (hero && typeof hero.getCombatStats === 'function')
      ? hero.getCombatStats()
      : getHeroCombatStats('steven');
    // Combine lore HP & Defense so tankier gems (e.g. Peridot, Bismuth, Rose, Jasper, Fusions)
    // hold substantially more life per Spinel Heart and drain slowly before blacking out.
    const perHeartHp = Math.max(100, Math.round((stats.hp || 130) * (1 + (stats.defense || 30) / 90)));
    return {
      perHeartHp,
      maxHp: Math.max(1, (this.maxHearts || 5) * perHeartHp),
      defense: stats.defense || 30
    };
  }

  initPlayerHeartPools() {
    const p1Spec = this.getHeartPoolSpec(this.player);
    this.perHeartHpP1 = p1Spec.perHeartHp;
    this.maxHeartHpP1 = p1Spec.maxHp;
    this.heartHpP1 = p1Spec.maxHp;
    this.currentHearts = this.maxHearts;

    const p2Spec = this.getHeartPoolSpec(this.player2 || this.player);
    this.perHeartHpP2 = p2Spec.perHeartHp;
    this.maxHeartHpP2 = p2Spec.maxHp;
    this.heartHpP2 = p2Spec.maxHp;
    this.currentHeartsP2 = this.maxHearts;
  }

  syncHeartPoolCounts() {
    const p1Spec = this.getHeartPoolSpec(this.player);
    this.perHeartHpP1 = p1Spec.perHeartHp;
    this.maxHeartHpP1 = p1Spec.maxHp;
    if (typeof this.heartHpP1 !== 'number' || Number.isNaN(this.heartHpP1)) {
      this.heartHpP1 = (this.currentHearts ?? this.maxHearts) * p1Spec.perHeartHp;
    }
    this.heartHpP1 = Math.max(0, Math.min(this.maxHeartHpP1, this.heartHpP1));
    this.currentHearts = this.heartHpP1 <= 0 ? 0 : Math.min(this.maxHearts, Math.ceil(this.heartHpP1 / p1Spec.perHeartHp));

    if (this.player2) {
      const p2Spec = this.getHeartPoolSpec(this.player2);
      this.perHeartHpP2 = p2Spec.perHeartHp;
      this.maxHeartHpP2 = p2Spec.maxHp;
      if (typeof this.heartHpP2 !== 'number' || Number.isNaN(this.heartHpP2)) {
        this.heartHpP2 = (this.currentHeartsP2 ?? this.maxHearts) * p2Spec.perHeartHp;
      }
      this.heartHpP2 = Math.max(0, Math.min(this.maxHeartHpP2, this.heartHpP2));
      this.currentHeartsP2 = this.heartHpP2 <= 0 ? 0 : Math.min(this.maxHearts, Math.ceil(this.heartHpP2 / p2Spec.perHeartHp));
    }
  }

  healPlayerHearts(isP2, heartAmount = 1) {
    const hero = isP2 ? this.player2 : this.player;
    const spec = this.getHeartPoolSpec(hero);
    if (isP2) {
      this.perHeartHpP2 = spec.perHeartHp;
      this.maxHeartHpP2 = spec.maxHp;
      let cur = (typeof this.heartHpP2 === 'number') ? this.heartHpP2 : (this.currentHeartsP2 * spec.perHeartHp);
      const extCount = this.currentHeartsP2 ?? this.maxHearts;
      if (Math.ceil(cur / spec.perHeartHp) !== extCount) cur = extCount * spec.perHeartHp;
      this.heartHpP2 = Math.min(spec.maxHp, cur + Math.round(heartAmount * spec.perHeartHp));
      this.currentHeartsP2 = this.heartHpP2 <= 0 ? 0 : Math.min(this.maxHearts, Math.ceil(this.heartHpP2 / spec.perHeartHp));
    } else {
      this.perHeartHpP1 = spec.perHeartHp;
      this.maxHeartHpP1 = spec.maxHp;
      let cur = (typeof this.heartHpP1 === 'number') ? this.heartHpP1 : (this.currentHearts * spec.perHeartHp);
      const extCount = this.currentHearts ?? this.maxHearts;
      if (Math.ceil(cur / spec.perHeartHp) !== extCount) cur = extCount * spec.perHeartHp;
      this.heartHpP1 = Math.min(spec.maxHp, cur + Math.round(heartAmount * spec.perHeartHp));
      this.currentHearts = this.heartHpP1 <= 0 ? 0 : Math.min(this.maxHearts, Math.ceil(this.heartHpP1 / spec.perHeartHp));
    }
  }

  damagePlayerHearts(hero, rawHeartUnits = 1, explicitHpLoss = null) {
    const isP2 = !!(hero && hero.playerId === 'p2');
    const spec = this.getHeartPoolSpec(hero);
    const hpLoss = (typeof explicitHpLoss === 'number' && explicitHpLoss > 0)
      ? explicitHpLoss
      : Math.max(14, Math.round((rawHeartUnits * 95) * (100 / (100 + spec.defense))));
    if (isP2) {
      this.perHeartHpP2 = spec.perHeartHp;
      this.maxHeartHpP2 = spec.maxHp;
      let cur = (typeof this.heartHpP2 === 'number') ? this.heartHpP2 : (this.currentHeartsP2 * spec.perHeartHp);
      const extCount = this.currentHeartsP2 ?? this.maxHearts;
      if (Math.ceil(cur / spec.perHeartHp) !== extCount) cur = extCount * spec.perHeartHp;
      this.heartHpP2 = Math.max(0, cur - hpLoss);
      this.currentHeartsP2 = this.heartHpP2 <= 0 ? 0 : Math.min(this.maxHearts, Math.ceil(this.heartHpP2 / spec.perHeartHp));
      return this.currentHeartsP2;
    } else {
      this.perHeartHpP1 = spec.perHeartHp;
      this.maxHeartHpP1 = spec.maxHp;
      let cur = (typeof this.heartHpP1 === 'number') ? this.heartHpP1 : (this.currentHearts * spec.perHeartHp);
      const extCount = this.currentHearts ?? this.maxHearts;
      if (Math.ceil(cur / spec.perHeartHp) !== extCount) cur = extCount * spec.perHeartHp;
      this.heartHpP1 = Math.max(0, cur - hpLoss);
      this.currentHearts = this.heartHpP1 <= 0 ? 0 : Math.min(this.maxHearts, Math.ceil(this.heartHpP1 / spec.perHeartHp));
      return this.currentHearts;
    }
  }

  renderSpinelHearts(container, isP2) {
    if (!container) return;
    const count = isP2 ? this.currentHeartsP2 : this.currentHearts;
    const hpPool = isP2 ? this.heartHpP2 : this.heartHpP1;
    const perHeart = (isP2 ? this.perHeartHpP2 : this.perHeartHpP1) || 150;
    const activeIdx = count - 1;
    const partialLife = (count > 0 && typeof hpPool === 'number')
      ? Math.max(0.08, Math.min(1, (hpPool - activeIdx * perHeart) / perHeart))
      : 1;

    if (container.children.length !== this.maxHearts) {
      container.innerHTML = '';
      for (let i = 0; i < this.maxHearts; i++) {
        const heart = document.createElement('span');
        heart.className = 'hud-heart empty';
        container.appendChild(heart);
      }
    }

    for (let i = 0; i < this.maxHearts; i++) {
      const child = container.children[i];
      let targetClass = 'hud-heart empty';
      let lifeVar = '';
      if (i < count) {
        if (i === activeIdx && partialLife < 0.96) {
          targetClass = 'hud-heart filled draining';
          lifeVar = partialLife.toFixed(2);
        } else {
          targetClass = 'hud-heart filled';
        }
      }
      if (child.className !== targetClass) {
        child.className = targetClass;
      }
      if (child._heartLife !== lifeVar) {
        child._heartLife = lifeVar;
        if (child.style) {
          if (typeof child.style.setProperty === 'function') {
            if (lifeVar) child.style.setProperty('--heart-life', lifeVar);
            else if (typeof child.style.removeProperty === 'function') child.style.removeProperty('--heart-life');
          } else {
            child.style['--heart-life'] = lifeVar;
          }
        }
      }
      if (child.textContent !== '') child.textContent = '';
    }
  }

  updateLobbyGuardian() {
    const dataP1 = GUARDIAN_DATA[this.selectedCharP1] || GUARDIAN_DATA.steven;
    const avatarEl = document.getElementById('lobbyGuardianAvatar');
    const nameEl = document.getElementById('lobbyGuardianName');
    const descEl = document.getElementById('lobbyGuardianDesc');
    const badgeEl = document.querySelector('.lobby-guardian-badge');
    const modeBtnText = document.getElementById('btnPlayerModeText');
    const typesContainer = document.getElementById('lobbyGuardianTypes');

    if (modeBtnText) {
      modeBtnText.textContent = this.playerMode === '2p' ? 'Mode: Co-Op (2P)' : 'Mode: Solo (1P)';
    }

    if (this.playerMode === '2p') {
      const dataP2 = GUARDIAN_DATA[this.selectedCharP2] || GUARDIAN_DATA.garnet;
      if (avatarEl) avatarEl.innerHTML = `${getGuardianSvg(this.selectedCharP1, 32)}${getGuardianSvg(this.selectedCharP2, 32)}`;
      if (nameEl) nameEl.textContent = `P1: ${dataP1.name} • P2: ${dataP2.name}`;
      if (descEl) descEl.textContent = `P1 (${dataP1.name}): WASD + F/G/H/R • P2 (${dataP2.name}): Arrows + J/K/L/O`;
      if (badgeEl) badgeEl.textContent = 'ACTIVE GUARDIANS (P1 & P2) · CLICK TO SWITCH';

      if (typesContainer) {
        const p1Badges = (dataP1.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
        const p2Badges = (dataP2.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
        typesContainer.innerHTML = `<span style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-right: 4px;">P1:</span>${p1Badges}<span style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-left: 8px; margin-right: 4px;">P2:</span>${p2Badges}`;
      }
    } else {
      if (avatarEl) avatarEl.innerHTML = getGuardianSvg(this.selectedCharP1, 46);
      if (nameEl) nameEl.textContent = dataP1.name;
      if (descEl) descEl.textContent = dataP1.desc;
      if (badgeEl) badgeEl.textContent = 'ACTIVE GUARDIAN · CLICK TO SWITCH';

      if (typesContainer) {
        typesContainer.innerHTML = (dataP1.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
      }
    }

    const fusionEl = document.getElementById('lobbyGuardianFusion');
    const fusionText = document.getElementById('lobbyGuardianFusionText');
    if (fusionEl && fusionText) {
      if (this.playerMode === '2p') {
        fusionEl.style.display = 'flex';
        const f = getCanonFusion(this.selectedCharP1, this.selectedCharP2);
        if (f) {
          fusionEl.className = 'lobby-guardian-fusion compatible';
          fusionText.innerHTML = `<b>Fusion:</b> ${f.name} (Ready in battle)`;
        } else {
          fusionEl.className = 'lobby-guardian-fusion incompatible';
          fusionText.innerHTML = `<b>Independent Duo</b> (No canon fusion)`;
        }
      } else {
        fusionEl.style.display = 'none';
      }
    }
  }

  updateLobbyDifficulty() {
    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    const cleanDiffName = (diff.name || 'Medium').replace(/^[^\w\s]+\s*/, '');
    const pill = document.getElementById('lobbyDifficultyPill');
    if (pill) {
      pill.textContent = cleanDiffName;
      pill.style.background = diff.pillColor;
    }
    const btnText = document.getElementById('btnDiffLevelText');
    if (btnText) {
      btnText.textContent = `Difficulty: ${cleanDiffName}`;
    }
  }

  openDifficultyScreen() {
    const screen = document.getElementById('difficultyScreen');
    if (!screen) return;
    this.syncDifficultyPanel();
    screen.style.display = 'flex';
    this.audio.playSfx('menuTap');
  }

  closeDifficultyScreen() {
    const screen = document.getElementById('difficultyScreen');
    if (screen) screen.style.display = 'none';
  }

  setDifficulty(key) {
    if (!DIFFICULTY_CONFIG[key]) return;
    this.difficulty = key;
    SafeStorage.setItem('su_difficulty', key);
    const cfg = DIFFICULTY_CONFIG[key];
    this.enemyManager.diffMult = cfg.enemyHpMultiplier || 1.0;
    this.updateLobbyDifficulty();
    this.syncDifficultyPanel();
    this.audio.playSfx('menuTap');
  }

  syncDifficultyPanel() {
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === this.difficulty);
    });
  }

  cycleDifficulty() {
    const diffs = DIFFICULTY_ORDER;
    const idx = diffs.indexOf(this.difficulty);
    this.difficulty = diffs[(idx + 1) % diffs.length];
    SafeStorage.setItem('su_difficulty', this.difficulty);
    const diffCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.diffMult = diffCfg.enemyHpMult || 1.0;
    this.maxHearts = diffCfg.hearts;
    this.initPlayerHeartPools();
    this.updateLobbyDifficulty();
    this.audio.playSfx('cookie');
  }

  togglePlayerMode() {
    this.playerMode = this.playerMode === '1p' ? '2p' : '1p';
    SafeStorage.setItem('su_playerMode', this.playerMode);

    // Strict 1-Player Fusion Reset: If toggled to 1P, immediately defuse and revert player hero!
    if (this.playerMode === '1p') {
      this.isFused = false;
      this.isHyperAttack = false;
      this.hyperAttackTimer = 0;
      this.hyperAttackFired = false;
      this.fusionTimer = 0;
      this.fusionEnergy = 0;
      if (this.player) {
        this.player.isFusion = false;
        this.player.fusionKey = null;
        this.player.fusionData = null;
        this.player.isMergedInFusion = false;
        this.player.hasSynergyBuff = false;
        this.player.switchCharacter(this.selectedCharP1);
      }
      this.player2 = null;
      this.updateFusionHUD();
    }

    this.updateLobbyGuardian();
    this.audio.playSfx('switch');
  }

  updateCharPreview(charId) {
    const data = GUARDIAN_DATA[charId] || GUARDIAN_DATA.steven;
    const iconEl = document.getElementById('paneIcon');
    const nameEl = document.getElementById('paneName');
    const titleEl = document.getElementById('paneTitle');
    const loreEl = document.getElementById('paneLore');
    const jEl = document.getElementById('paneJ');
    const kEl = document.getElementById('paneK');
    const lEl = document.getElementById('paneL');
    const paneTypes = document.getElementById('paneTypes');

    if (iconEl) iconEl.innerHTML = getGuardianSvg(charId, 72);
    if (nameEl) nameEl.textContent = data.name;
    if (titleEl) titleEl.textContent = data.title;
    if (loreEl) loreEl.textContent = data.lore;
    if (jEl) jEl.textContent = data.j.desc;
    if (kEl) kEl.textContent = data.k.desc;
    if (lEl) lEl.textContent = data.l.desc;

    const passive = (typeof HERO_PASSIVES !== 'undefined' && HERO_PASSIVES[charId]) || null;
    const comboProf = (typeof HERO_COMBO_PROFILES !== 'undefined' && HERO_COMBO_PROFILES[charId]) || null;
    const roleEl = document.getElementById('paneRoleBadge');
    const healEl = document.getElementById('paneHealBadge');
    const pTitle = document.getElementById('panePassiveTitle');
    const pStyle = document.getElementById('paneStylePill');
    const pDesc = document.getElementById('panePassiveDesc');
    const pTip = document.getElementById('panePassiveTip');
    const kLbl = document.getElementById('paneKLabel');
    const jLbl = document.getElementById('paneJLabel');
    const lLbl = document.getElementById('paneLLabel');

    if (jLbl) jLbl.textContent = `[J] ${data.j.name}:`;
    if (kLbl) kLbl.textContent = `[K] ${data.k.name}${passive && passive.kTag ? ` (${passive.kTag})` : ''}:`;
    if (lLbl) lLbl.textContent = `[L] ${data.l.name}:`;

    if (passive) {
      if (roleEl) roleEl.textContent = passive.role || 'Guardian';
      if (healEl) {
        healEl.className = `char-heal-text ${passive.hasHeal ? 'has-heal' : 'no-heal'}`;
        healEl.textContent = passive.hasHeal ? 'Healing' : 'No Heal';
      }
      if (pTitle) pTitle.textContent = `PASSIVE — ${passive.name}`;
      if (pStyle) pStyle.textContent = comboProf ? comboProf.label : 'Combo Chain';
      if (pDesc) pDesc.textContent = passive.desc;
      if (pTip) pTip.textContent = `How to use: ${passive.howToUse || passive.desc}`;
    }

    if (paneTypes) {
      paneTypes.innerHTML = (data.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
    }

    // Single unified stat readout (clean bar + exact value, zero duplicate stat rows!)
    const statsEl = document.getElementById('paneStats');
    if (statsEl && typeof getHeroCombatStats === 'function') {
      const s = getHeroCombatStats(charId, null, false);
      const statCell = (lbl, val, max, col) => {
        const pct = Math.max(10, Math.min(100, Math.round((val / max) * 100)));
        return `<div class="clean-stat"><div class="clean-stat-head"><span>${lbl}</span><strong>${val}</strong></div>` +
          `<div class="clean-stat-track"><div class="clean-stat-fill" style="width:${pct}%;background:${col};"></div></div></div>`;
      };
      statsEl.innerHTML =
        statCell('HP', s.hp, 185, '#4ade80') +
        statCell('ATK', s.attack, 60, '#fb7185') +
        statCell('DEF', s.defense, 60, '#38bdf8') +
        statCell('MAG', s.magic, 62, '#c084fc');
    }

    const fList = document.getElementById('fusionPreviewList');
    if (fList) {
      fList.innerHTML = '';
      const partners = getCompatibleFusionPartners(charId);
      if (partners.length > 0) {
        for (const p of partners) {
          const chip = document.createElement('span');
          chip.className = 'fusion-chip';
          const partnerName = GUARDIAN_DATA[p.partnerId]?.name || p.partnerId;
          chip.innerHTML = `<b>${p.fusion.name}</b> (+${partnerName}) • ${p.fusion.weapon}`;
          fList.appendChild(chip);
        }
      } else {
        const chip = document.createElement('span');
        chip.className = 'fusion-chip none';
        chip.textContent = 'Independent Gem — No canon show fusion';
        fList.appendChild(chip);
      }
    }
  }

  // ==========================================================
  // LEFT 4 DEAD 2-STYLE CINEMATIC LIVING LOBBY SLIDESHOW
  // ==========================================================
  initLobbySlideshow() {
    this.lobbySlideIndex = 0;
    this.lobbySlideshowTimer = null;
    this.initLobbyMotes();
    this.startLobbySlideshow();
  }

  initLobbyMotes() {
    try {
      const container = document.getElementById('lobbyAmbientMotes');
      if (!container || (container.children && container.children.length > 0)) return;
      const colors = ['#ffd700', '#ff6097', '#38bdf8', '#c084fc', '#fef08a', '#a7f3d0'];
      for (let i = 0; i < 22; i++) {
        const mote = document.createElement('div');
        mote.className = 'lobby-mote';
        const size = Math.floor(3 + Math.random() * 4);
        mote.style.width = `${size}px`;
        mote.style.height = `${size}px`;
        mote.style.left = `${Math.random() * 100}%`;
        const dur = (7 + Math.random() * 8).toFixed(1);
        const delay = (Math.random() * 7).toFixed(1);
        mote.style.animationDuration = `${dur}s`;
        mote.style.animationDelay = `${delay}s`;
        const col = colors[i % colors.length];
        mote.style.background = col;
        mote.style.boxShadow = `0 0 10px ${col}, 0 0 18px ${col}`;
        mote.style.opacity = (0.4 + Math.random() * 0.4).toFixed(2);
        container.appendChild(mote);
      }
    } catch (e) {}
  }

  startLobbySlideshow() {
    this.stopLobbySlideshow();
    try {
      const slides = document.querySelectorAll('.lobby-slide');
      if (!slides || slides.length === 0) return;

      slides.forEach((s, idx) => {
        if (idx === this.lobbySlideIndex) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      this.lobbySlideshowTimer = setInterval(() => {
        const allSlides = document.querySelectorAll('.lobby-slide');
        if (!allSlides || allSlides.length === 0) return;
        this.lobbySlideIndex = (this.lobbySlideIndex + 1) % allSlides.length;

        allSlides.forEach((slide, idx) => {
          if (idx === this.lobbySlideIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });
      }, 7500);
    } catch (e) {}
  }

  stopLobbySlideshow() {
    if (this.lobbySlideshowTimer) {
      clearInterval(this.lobbySlideshowTimer);
      this.lobbySlideshowTimer = null;
    }
  }

  start() {
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // Stamp every freshly-spawned player projectile with the element of the move that
  // fired it, plus that move's same-type attack bonus. Runs the frame the shot appears.
  tagPlayerProjectiles(owner) {
    if (!owner || !owner.getMoveType) return;
    const ownerTypes = owner.getTypeList();
    const slotElement = owner.getMoveType(owner.attackType);
    for (const p of this.projectiles) {
      if (!p || p.elementType) continue;
      if (typeof p.type === 'string' && p.type.startsWith('enemy')) continue;
      const el = PROJECTILE_TYPE_ELEMENTS[p.type] || slotElement;
      p.elementType = el;
      p.stabMult = ownerTypes.includes(el) ? 1.2 : 1.0;
    }
  }

  registerComboHit(dmg) {
    this.comboHits++;
    this.comboDamage += dmg;
    this.comboTimer = 1.8;
    this.addFusionSync(2 + Math.min(8, this.comboHits * 0.5));

    const cDisp = document.getElementById('comboDisplay');
    const cHits = document.getElementById('comboHits');
    const cDmg = document.getElementById('comboDmg');
    if (cDisp && cHits && cDmg) {
      cHits.textContent = `${this.comboHits} HIT${this.comboHits > 1 ? 'S' : ''}!`;
      cDmg.textContent = `${this.comboDamage} DAMAGE`;
      cDisp.style.display = 'flex';
      cDisp.classList.remove('active');
      void cDisp.offsetWidth;
      cDisp.classList.add('active');
    }
  }

  triggerHitstop(duration = 0.045, shake = 3.5, dirX = 0, dirY = 0) {
    // Allow heavier finishers/crits to upgrade a shorter active hitstop without chain-locking
    const clampedDur = Math.min(0.095, Math.max(0.012, duration));
    if (clampedDur > this.hitstopTimer) {
      this.hitstopTimer = clampedDur;
    }
    this.hitShake = Math.max(this.hitShake, Math.min(8.5, shake));
    if (dirX || dirY) {
      this.shakeDirX = Math.max(-14, Math.min(14, (this.shakeDirX || 0) * 0.4 + dirX));
      this.shakeDirY = Math.max(-10, Math.min(10, (this.shakeDirY || 0) * 0.4 + dirY));
    }
  }

  triggerCameraZoom(delta = 0.06, duration = 0.26, focusX = null, focusY = null) {
    const clamped = Math.max(-0.08, Math.min(0.14, delta));
    if (Math.abs(clamped) >= Math.abs(this.zoomImpulse || 0) || (this.zoomImpulseTimer || 0) <= 0.05) {
      this.zoomImpulse = clamped;
      this.zoomImpulseTimer = Math.max(this.zoomImpulseTimer || 0, Math.min(0.85, duration));
      if (typeof focusX === 'number' && !isNaN(focusX)) this.zoomFocusX = focusX;
      if (typeof focusY === 'number' && !isNaN(focusY)) this.zoomFocusY = focusY;
    }
  }

  showCombatBadge(text, color = '#fde047', duration = 1.05) {
    if (!text) return;
    this.combatBadgeText = String(text);
    this.combatBadgeColor = color || '#fde047';
    this.combatBadgeTimer = duration;
  }

  // Freebuff: finishing a 3-hit chain feeds the fusion meter — teamwork pays off
  registerComboFinisher(charId, perfect, source) {
    const bonus = perfect ? 16 : 10;
    this.addFusionSync(bonus);
    this.score += perfect ? 120 : 80;
    if (perfect && source) {
      this.particles.addDamageText(source.x, source.y - 108, '⭐ PERFECT FINISHER — SYNC CHARGED!', false, '#fde047');
    }
    this.updateHUD();
  }

  startNewGame(mode = 'story', opts = {}) {
    this.stopLobbySlideshow();
    this.gameMode = mode;
    this.score = 0;
    this.bubbledGemsCount = 0;
    this.starPowerMeter = 0;
    this.isOverdriveActive = false;
    this.overdriveTimer = 0;
    this.player.deactivatePinkOverdrive();

    this.starPowerMeterP2 = 0;
    this.isOverdriveActiveP2 = false;
    this.overdriveTimerP2 = 0;

    this.comboHits = 0;
    this.comboDamage = 0;
    this.comboTimer = 0;
    const comboEl = document.getElementById('comboDisplay');
    if (comboEl) comboEl.style.display = 'none';

    // Completely reset Fusion state on every game start / restart
    this.isFused = false;
    this.isHyperAttack = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    this.synergyBuffTimer = 0;
    this.fusionEnergy = (mode === 'practice') ? 100 : 0;
    this.fusionTimer = 0;
    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    this.player.isFusion = false;
    this.player.fusionKey = null;
    this.player.fusionData = null;
    this.player.isMergedInFusion = false;
    this.player.hasSynergyBuff = false;
    if (this.player2) {
      this.player2.hasSynergyBuff = false;
    }

    this.isTransitioning = false;
    this.transitionTimer = 0;
    this.lastStoryBeat = null;
    this.arcadeWave = 1;
    this.arcadeWavePending = false;
    this.cutsceneActive = false;
    this.cutsceneData = null;
    this.cutsceneOnDone = null;
    this.puzzleActive = false;
    this.puzzleState = null;
    this.creditsActive = false;
    this.releaseAllInputs();
    this.dialogueActive = false;
    this.dialogueOnDone = null;
    this.screenTransition = null;
    this.cutinActive = false;
    this.cutinFreeze = 0;
    this._lastWaveStage = null;
    if (document.getElementById('dialogueBox')) document.getElementById('dialogueBox').style.display = 'none';
    if (document.getElementById('portraitCutin')) document.getElementById('portraitCutin').style.display = 'none';
    this.setVeil(false);

    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.maxHearts = diff.hearts;
    this.initPlayerHeartPools();

    this.player.x = 220;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.switchCharacter(this.selectedCharP1, this.audio, this.particles);
    this.player.isShielding = false;
    this.player.isSpinDashing = false;
    this.player.onTeamHeal = (src, amt) => this.handleTeamHealing(src, amt);
    this.player.onComboFinisher = (charId, perfect, source) => this.registerComboFinisher(charId, perfect, source);

    const hudP2 = document.getElementById('hudP2Panel');
    if (this.playerMode === '2p') {
      const hudEl = document.getElementById('hud');
      if (hudEl) hudEl.classList.add('two-player');
      this.player2 = new PlayerHero(this.groundY, 'p2', this.stageWidth);
      this.player2.gameRef = this;
      this.player2.x = 340;
      this.player2.y = this.groundY;
      this.player2.switchCharacter(this.selectedCharP2, this.audio, this.particles);
      this.player2.isPinkRevived = false;
      this.player2.onTeamHeal = (src, amt) => this.handleTeamHealing(src, amt);
      this.player2.onComboFinisher = (charId, perfect, source) => this.registerComboFinisher(charId, perfect, source);
      if (hudP2) hudP2.style.display = 'flex';
    } else {
      this.player2 = null;
      if (hudP2) hudP2.style.display = 'none';
      const hudEl = document.getElementById('hud');
      if (hudEl) hudEl.classList.remove('two-player');
    }
    this.player.isPinkRevived = false;
    this.initPlayerHeartPools();
    this.updateFusionHUD();

    this.projectiles = [];
    this.pickups = [];

    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';

    this.hideAllScreens();
    document.getElementById('hud').style.display = 'grid';
    const actionBars = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    if (actionBars) actionBars.style.display = this.isRealMobile ? 'none' : 'flex';

    if (document.body) document.body.classList.add('in-game');
    const touchBox = document.getElementById('touchControls');
    if (touchBox && this.isRealMobile) {
      touchBox.classList.add('active');
      touchBox.style.display = 'flex';
    }

    this.state = 'playing';
    this.updateHUD();
    this.updateActionBar();
    this.updateFusionHUD();

    if (mode === 'practice') {
      this.stageIndex = 0;
      this.audio.lastStageIndex = 0;
      this.audio.playMusic('practice');
      this.startPracticeDojo();
    } else if (mode === 'arcade') {
      this.stageIndex = Math.max(1, Math.min(10, parseInt(opts.stage || this.arcadeMapStage || 1, 10) || 1));
      this.arcadeMapStage = this.stageIndex;
      this.audio.lastStageIndex = this.stageIndex;
      this.audio.playStageMusic(this.stageIndex, false);
      this.startArcadeWave(1);
    } else {
      this.stageIndex = Math.max(1, Math.min(10, parseInt(opts.stage || 1, 10) || 1));
      this.audio.lastStageIndex = this.stageIndex;
      this.audio.playStageMusic(this.stageIndex, false);
      if (opts.skipIntroFlow) {
        this.startStageWave();
      } else {
        this.startStoryEpisodeFlow(this.stageIndex);
      }
    }
  }

  startPracticeDojo() {
    this.audio.playMusic('practice');
    this.player.revive(this.audio, this.particles);
    if (this.player2) this.player2.revive(this.audio, this.particles);

    // Remove "Practice" on top so health bar of enemy is clean and unobstructed
    const badge = document.getElementById('hudStageBadge');
    if (badge) badge.style.display = 'none';
    const objText = document.getElementById('hudObjectiveText');
    if (objText) objText.style.display = 'none';

    const bossHud = document.getElementById('bossHud');
    if (bossHud) {
      bossHud.classList.remove('story-mode-boss');
      bossHud.style.display = 'flex';
      const bName = document.getElementById('bossName');
      if (bName) bName.textContent = 'HOLO-JASPER (TRAINING DUMMY)';
      const bDigits = document.getElementById('bossHpDigits');
      if (bDigits) bDigits.textContent = 'INFINITE / INFINITE';
      const bFill = document.getElementById('bossHpFill');
      if (bFill) bFill.style.width = '100%';
    }

    this.enemyManager.reset(0, DIFFICULTY_CONFIG[this.difficulty], this.pickups);
    this.enemyManager.spawnDummy(760);
  }

  // --- CLEAN FLAT-GEM WAVE PROGRESSION ---
  buildRandomWaveGemSVG(variantIdx = -1, isBoss = false) {
    // Simple flat geometric gems with zero lighting/glow facets for a clean HUD
    const cuts = [
      (c1) => `<svg viewBox="0 0 24 24"><polygon points="12,3 21,20 3,20" fill="${c1}" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
      (c1) => `<svg viewBox="0 0 24 24"><polygon points="12,2 21,9 18,21 6,21 3,9" fill="${c1}" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
      (c1) => `<svg viewBox="0 0 24 24"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="${c1}" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
      (c1) => `<svg viewBox="0 0 24 24"><polygon points="12,2 21,12 12,22 3,12" fill="${c1}" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
      (c1) => `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="${c1}" stroke="#0f172a" stroke-width="1.8"/></svg>`,
      (c1) => `<svg viewBox="0 0 24 24"><path d="M12,2 C17,9 20,13 20,16.5 A8,8 0 0,1 4,16.5 C4,13 7,9 12,2 Z" fill="${c1}" stroke="#0f172a" stroke-width="1.8" stroke-linejoin="round"/></svg>`
    ];
    const palettes = isBoss
      ? ['#f43f5e', '#e11d48', '#f59e0b', '#38bdf8']
      : ['#22c55e', '#a855f7', '#f472b6', '#38bdf8', '#f97316', '#facc15'];
    const ci = variantIdx >= 0 ? (variantIdx % cuts.length) : Math.floor(Math.random() * cuts.length);
    const col = palettes[Math.floor(Math.random() * palettes.length)];
    return cuts[ci](col);
  }

  updateWaveLine() {
    if (!this._waveDom && typeof document !== 'undefined') {
      this._waveDom = {
        container: document.getElementById('pvzWaveContainer'),
        trackEl: document.getElementById('pvzWaveTrack'),
        fillEl: document.getElementById('pvzWaveFill'),
        markerEl: document.getElementById('pvzWaveMarker'),
        labelEl: document.getElementById('pvzWaveLabel'),
        statusEl: document.getElementById('pvzWaveStatus'),
        flags: [
          { el: document.getElementById('waveFlag1'), threshold: 25, isBoss: false },
          { el: document.getElementById('waveFlag2'), threshold: 50, isBoss: false },
          { el: document.getElementById('waveFlag3'), threshold: 75, isBoss: false },
          { el: document.getElementById('waveFlagBoss'), threshold: 96, isBoss: true }
        ]
      };
    }
    const d = this._waveDom;
    if (!d || !d.container) return;

    if (this.gameMode === 'practice' || this.stageIndex === 0) {
      if (d.container.style.display !== 'none') d.container.style.display = 'none';
      if (d.labelEl && d.labelEl.textContent !== 'PRACTICE') d.labelEl.textContent = 'PRACTICE';
      return;
    }
    if (d.container.style.display !== 'flex') d.container.style.display = 'flex';

    // Sync wave track color hint to stage platform & populate simple unlit gems
    const stIdx = this.stageIndex || 1;
    const platTheme = (stIdx === 1) ? 'wood'
                    : (stIdx === 3 || stIdx === 5 || stIdx === 8 || stIdx === 9) ? 'metal'
                    : (stIdx === 4) ? 'obsidian' : 'stone';
    if (d.trackEl && d.trackEl.dataset && d.trackEl.dataset.platform !== platTheme) {
      d.trackEl.dataset.platform = platTheme;
    }
    if (this._lastWaveStage !== stIdx) {
      this._lastWaveStage = stIdx;
      if (d.flags) {
        const order = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        d.flags.forEach((f, idx) => {
          if (f.el) f.el.innerHTML = this.buildRandomWaveGemSVG(f.isBoss ? 3 : order[idx], f.isBoss);
        });
      }
      if (d.markerEl) {
        d.markerEl.innerHTML = this.buildRandomWaveGemSVG(Math.floor(Math.random() * 6), false);
      }
    }

    const pct = this.enemyManager.getProgressPercent();
    if (this._lastWavePct !== pct) {
      this._lastWavePct = pct;
      if (d.fillEl) d.fillEl.style.width = `${pct}%`;
      if (d.markerEl) d.markerEl.style.left = `${pct}%`;
      if (d.flags) {
        d.flags.forEach(f => {
          if (f.el && f.el.classList) f.el.classList.toggle('passed', pct >= f.threshold);
        });
      }
    }

    const curWave = this.enemyManager.wave || 1;
    const maxW = this.enemyManager.maxWaves || 4;
    const isBoss = this.enemyManager.isBossAlive;
    const waveKey = `${this.gameMode}_${curWave}_${maxW}_${isBoss}`;

    if (this._lastWaveKey !== waveKey) {
      this._lastWaveKey = waveKey;
      if (d.labelEl) {
        if (this.gameMode === 'arcade') {
          d.labelEl.textContent = isBoss ? `WAVE ${this.arcadeWave} · BOSS` : `WAVE ${this.arcadeWave}`;
        } else {
          d.labelEl.textContent = isBoss ? 'BOSS' : `WAVE ${curWave} / ${maxW}`;
        }
        d.labelEl.style.color = isBoss ? '#fda4af' : '#e2e8f0';
      }
    }
  }

  triggerWaveWarning(text, isBoss = false) {
    if (this.audio) {
      this.audio.playSfx(isBoss ? 'bossIntro' : 'waveWarning');
    }

    const banner = document.getElementById('waveWarningBanner');
    const textEl = document.getElementById('waveWarningText');
    if (banner && textEl) {
      textEl.textContent = text;
      if (isBoss) {
        banner.classList.add('boss-wave');
      } else {
        banner.classList.remove('boss-wave');
      }
      banner.style.display = 'flex';

      setTimeout(() => {
        if (banner) banner.style.display = 'none';
      }, 2600);
    }
  }

  // ======================================================================
  // STORY DIALOGUE (Stardew-style box with a portrait)
  // ======================================================================
  resolveStorySpeaker(line) {
    let who = line.w;
    // Story dialogue is always spoken by the canonical character for that scene —
    // whoever the player picked is irrelevant (the box must never put Steven's line
    // in, say, Lapis' mouth).
    if (who === 'party') who = 'steven';
    if (who === 'partner') who = (this.player2 && this.player2.activeChar) ? this.player2.activeChar : 'garnet';
    if (who === 'villain') {
      const nUpper = String(line.n || '').toUpperCase();
      const stageBossIds = {
        1: 'boss_centipeetle',
        2: 'boss_giant_bird',
        3: 'boss_cluster_titan',
        4: 'boss_cluster_core',
        5: 'boss_forge_guardian',
        6: 'boss_jasper',
        7: 'boss_agate_warden',
        8: 'boss_topaz_fusion',
        9: 'boss_robonoid_titan',
        10: 'boss_white_diamond'
      };
      let vId = line.vId || '';
      if (!vId) {
        if (nUpper.includes('CENTIPEETLE')) vId = 'boss_centipeetle';
        else if (nUpper.includes('BIRD') || nUpper.includes('SPIRE')) vId = 'boss_giant_bird';
        else if (nUpper.includes('AMALGAM') || nUpper.includes('KINDERGARTEN')) vId = 'boss_cluster_titan';
        else if (nUpper.includes('CLUSTER') || nUpper.includes('GEO-WEAPON')) vId = 'boss_cluster_core';
        else if (nUpper.includes('FORGE') || nUpper.includes('SENTINEL')) vId = 'boss_forge_guardian';
        else if (nUpper.includes('JASPER')) vId = 'boss_jasper';
        else if (nUpper.includes('AGATE')) vId = 'boss_agate_warden';
        else if (nUpper.includes('TOPAZ')) vId = 'boss_topaz_fusion';
        else if (nUpper.includes('ROBONOID')) vId = 'boss_robonoid_titan';
        else if (nUpper.includes('WHITE DIAMOND')) vId = 'boss_white_diamond';
        else vId = stageBossIds[this.stageIndex] || 'corrupted_gem';
      }
      return {
        id: vId,
        villain: true,
        name: line.n || 'CORRUPTED GEM',
        icon: line.i || '💎',
        color: STORY_VILLAIN_COLORS[this.stageIndex] || '#ef4444'
      };
    }
    const data = GUARDIAN_DATA[who] || GUARDIAN_DATA.steven;
    return {
      id: who,
      name: data.name,
      color: (OVERDRIVE_THEMES[who] || OVERDRIVE_THEMES.steven).color
    };
  }

  // Dialogue and cut-in are in-game overlays only: they vanish while the pause
  // menu, title screen or any modal is up, and come back on resume.
  setOverlaysVisible(visible) {
    if (!visible) {
      const gate = document.getElementById('bossGateHint');
      if (gate) gate.style.display = 'none';
    } else if (this.isWaitingForBoss) {
      const gate = document.getElementById('bossGateHint');
      if (gate) gate.style.display = 'flex';
    }
    const box = document.getElementById('dialogueBox');
    if (box) {
      if (!visible) {
        box.style.display = 'none';
      } else if (this.dialogueActive) {
        box.style.display = 'flex';
        box.classList.add('dialogue-in');
      }
    }
    if (!visible) {
      const cutin = document.getElementById('portraitCutin');
      if (cutin) cutin.style.display = 'none';
    } else if (this.cutinActive) {
      const cutin = document.getElementById('portraitCutin');
      if (cutin) cutin.style.display = 'flex';
    }
  }

  // Zero every held input. Called on blur, tab hide, pause and menu changes so a
  // missed keyup can never leave the hero sliding on their own.
  releaseAllInputs() {
    const blank = { left: false, right: false, jump: false, down: false, shield: false, dodge: false, attack: false, special: false, skill: false, overdrive: false, sprint: false };
    this.keysP1 = Object.assign(this.keysP1 || {}, blank);
    this.keysP2 = Object.assign(this.keysP2 || {}, blank);
    for (const hero of [this.player, this.player2]) {
      if (!hero) continue;
      hero.vx = 0;
      hero.isShielding = false;
      hero.isDodging = false;
      hero.isSprinting = false;
    }
    // Release any on-screen touch buttons stuck in the pressed state
    document.querySelectorAll('.touch-btn.pressed, .touch-btn.active').forEach(el => el.classList.remove('pressed', 'active'));
  }

  releaseStuckTouchKeys() {
    // Only clears when no pointer is still down (multi-touch friendly)
    for (const hero of [this.player, this.player2]) {
      if (hero && hero.isDodging) hero.isDodging = false;
    }
  }

  releaseKeysOnModifierChange(e) {
    // Alt-Tab / Cmd-Tab / focus switches can swallow the keyup for a held key.
    if (e.key === 'Alt' || e.key === 'Meta' || e.key === 'OS') this.releaseAllInputs();
  }

  bindDialogueInput() {
    if (this._dialogueBound) return;
    this._dialogueBound = true;
    document.addEventListener('keydown', (e) => {
      if (!this.dialogueActive) return;
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'KeyE') {
        e.preventDefault();
        e.stopPropagation(); // keep the game's own key handling out of it
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        this.advanceDialogue();
      }
    }, true);
    const box = document.getElementById('dialogueBox');
    if (box) box.addEventListener('click', () => this.advanceDialogue());
  }

  showDialogue(lines, onDone) {
    if (!lines || !lines.length) { if (onDone) onDone(); return; }
    this.bindDialogueInput();
    this.dialogueLines = lines.slice();
    this.dialogueIndex = 0;
    this.dialogueOnDone = onDone || null;
    this.dialogueActive = true;
    this.dialogueTimer = 0;
    this.dialogueAutoTimer = 0;
    const box = document.getElementById('dialogueBox');
    if (box) {
      box.style.display = 'flex';
      box.classList.remove('dialogue-in');
      void box.offsetWidth;
      box.classList.add('dialogue-in');
    }
    this.renderDialogueLine();
    this.audio.playSfx('menuTap');
  }

  renderDialogueLine() {
    const line = this.dialogueLines[this.dialogueIndex];
    if (!line) { this.closeDialogue(); return; }
    const speaker = this.resolveStorySpeaker(line);
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const portraitEl = document.getElementById('dialoguePortrait');
    if (nameEl) {
      nameEl.textContent = speaker.name;
      nameEl.parentElement.style.background = `linear-gradient(135deg, ${speaker.color}, #7c1533)`;
    }
    if (textEl) textEl.textContent = line.t;
    const hintEl = document.getElementById('dialogueHint');
    if (hintEl) {
      hintEl.textContent = 'CLICK or SPACE ▶';
      // Inline style so no cascade quirk can ever hide the "how to continue" hint.
      hintEl.style.display = 'block';
      hintEl.style.visibility = 'visible';
      hintEl.style.opacity = '0.9';
      hintEl.style.color = '#ffd700';
      hintEl.style.fontSize = '10px';
      hintEl.style.fontWeight = '900';
      hintEl.style.letterSpacing = '1.2px';
      hintEl.style.textAlign = 'right';
    }
    if (portraitEl) {
      portraitEl.innerHTML = (typeof getGuardianAvatarHtml === 'function')
        ? getGuardianAvatarHtml(speaker.id, 88)
        : '';
    }
  }

  advanceDialogue() {
    if (!this.dialogueActive) return;
    this.dialogueIndex++;
    this.dialogueAutoTimer = 0;
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.closeDialogue();
    } else {
      this.renderDialogueLine();
      this.audio.playSfx('menuTap');
    }
  }

  closeDialogue() {
    this.dialogueActive = false;
    const box = document.getElementById('dialogueBox');
    if (box) {
      box.classList.remove('dialogue-in');
      setTimeout(() => { if (!this.dialogueActive) box.style.display = 'none'; }, 200);
    }
    const cb = this.dialogueOnDone;
    this.dialogueOnDone = null;
    if (cb) cb();
  }

  // ======================================================================
  // PORTRAIT CUT-IN (hitstop super-move intro)
  // ======================================================================
  startCutin(opts) {
    if (this.cutinActive) return;
    const o = opts || {};
    this.cutinActive = true;
    this.cutinTimer = o.duration || 1.9;
    this.cutinFreeze = o.freeze != null ? o.freeze : this.cutinTimer;
    this.cutinOnDone = o.onDone || null;

    const root = document.getElementById('portraitCutin');
    const kicker = document.getElementById('cutinKicker');
    const nameEl = document.getElementById('cutinName');
    const quoteEl = document.getElementById('cutinQuote');
    const flash = document.getElementById('cutinFlash');
    const leftWrap = document.getElementById('cutinLeftWrap');
    const rightWrap = document.getElementById('cutinRightWrap');
    const leftPortrait = document.getElementById('cutinPortraitLeft');
    const rightPortrait = document.getElementById('cutinPortraitRight');

    // Overdrive: one portrait on that player's side.
    // Fusion: the fused gem takes the centre, both partners flank it as medallions.
    const primaryId = o.portraitId || o.charId;
    const partnerId = o.secondPortraitId || null;
    const centerId = o.centerPortraitId || null;
    const isFusionCard = !!centerId;
    const showCenter = isFusionCard;
    const showLeft = isFusionCard ? true : (o.side !== 'right');
    const showRight = isFusionCard ? true : (o.side === 'right');

    // Painted straight into a <canvas>: a data-URL <img> can paint a frame late (and
    // showed up blank), while canvas output is synchronous.
    const portraitMarkup = (id) => id
      ? `<canvas class="cutin-portrait-canvas" data-portrait="${id}" width="512" height="512"></canvas>`
      : `<div style="font-size:170px;line-height:1">${o.icon || '💎'}</div>`;

    const centerWrap = document.getElementById('cutinCenterWrap');
    const centerPortrait = document.getElementById('cutinPortraitCenter');

    if (centerWrap) centerWrap.classList.toggle('hidden', !showCenter);
    if (leftWrap) {
      leftWrap.classList.toggle('hidden', !showLeft);
      leftWrap.classList.toggle('is-partner', isFusionCard);
    }
    if (rightWrap) {
      rightWrap.classList.toggle('hidden', !showRight);
      rightWrap.classList.toggle('is-partner', isFusionCard);
    }
    if (centerPortrait) centerPortrait.innerHTML = showCenter ? portraitMarkup(centerId) : '';
    if (leftPortrait) leftPortrait.innerHTML = showLeft ? portraitMarkup(primaryId) : '';
    if (rightPortrait) rightPortrait.innerHTML = showRight ? portraitMarkup(partnerId || primaryId) : '';

    [centerPortrait, leftPortrait, rightPortrait].forEach(el => {
      if (!el) return;
      const cv = el.querySelector('canvas[data-portrait]');
      if (!cv) return;
      try { drawPortraitCard(cv.getContext('2d'), cv.dataset.portrait, cv.width, !!o.useOverdriveArt); } catch (e) {}
    });

    // Restart the entrance animation on every activation
    [centerWrap, leftWrap, rightWrap].forEach(w => {
      if (!w) return;
      w.style.animation = 'none';
      void w.offsetWidth;
      w.style.animation = '';
    });
    if (kicker) { kicker.textContent = o.kicker || 'PINK OVERDRIVE'; kicker.style.color = o.kickerColor || '#ffd700'; }
    if (nameEl) nameEl.textContent = o.name || '';
    if (quoteEl) quoteEl.textContent = o.quote || '';
    if (flash) { flash.classList.remove('flash'); void flash.offsetWidth; }
    if (root) root.style.display = 'flex';

    setTimeout(() => { if (flash) flash.classList.add('flash'); }, 260);
    this.audio.playSfx('overdrive');
  }

  endCutin() {
    this.cutinActive = false;
    this.cutinFreeze = 0;
    this._lastWaveStage = null;
    const root = document.getElementById('portraitCutin');
    if (root) root.style.display = 'none';
    const cb = this.cutinOnDone;
    this.cutinOnDone = null;
    if (cb) cb();
    if (this._pendingOverdrive && !this.cutinActive && this.state === 'playing') {
      const nextOd = this._pendingOverdrive;
      this._pendingOverdrive = null;
      this.activatePinkOverdrive(nextOd);
    }
  }

  // ======================================================================
  // SCREEN TRANSITIONS (walk out right -> black veil -> next wave/level)
  // ======================================================================
  setVeil(on) {
    const veil = document.getElementById('stageVeil');
    if (!veil) return;
    if (this._veilHideTimer) { clearTimeout(this._veilHideTimer); this._veilHideTimer = null; }
    if (this._veilFailSafeTimer) { clearTimeout(this._veilFailSafeTimer); this._veilFailSafeTimer = null; }
    if (on) {
      veil.style.display = 'block';
      void veil.offsetWidth;
      veil.classList.add('veil-in');
      // Failsafe: never allow the transition veil to remain opaque over the game or menus
      this._veilFailSafeTimer = setTimeout(() => {
        this._veilFailSafeTimer = null;
        if (this.state !== 'playing' || !this.screenTransition || this.screenTransition.phase !== 'veil') {
          this.setVeil(false);
        }
      }, 1200);
    } else {
      veil.classList.remove('veil-in');
      this._veilHideTimer = setTimeout(() => {
        this._veilHideTimer = null;
        if (!veil.classList.contains('veil-in')) veil.style.display = 'none';
      }, 300);
    }
  }

  // The last wave is cleared: the boss waits at the right edge. The player walks
  // there themselves so they can farm bubbles/pickups for Overdrive first.
  updateStoryModeUI() {
    const btn = document.getElementById('btnStoryMode');
    const label = document.getElementById('btnStoryModeText');
    if (btn) btn.classList.toggle('off', this.storyMode === false);
    if (label) label.textContent = this.storyMode === false ? 'Story: Off' : 'Story: On';
  }

  toggleStoryMode() {
    this.storyMode = !this.storyMode;
    SafeStorage.setItem('su_storyMode', this.storyMode ? 'true' : 'false');
    this.updateStoryModeUI();
    this.audio.playSfx('menuTap');
  }

  // Jump straight into any episode from the menu (no restarting from episode 1).
  startEpisode(stageNumber, opts = {}) {
    const n = Math.max(1, Math.min(10, parseInt(stageNumber, 10) || 1));
    if (this.dialogueActive) {
      this.dialogueActive = false;
      this.dialogueOnDone = null;
      const box = document.getElementById('dialogueBox');
      if (box) box.style.display = 'none';
    }
    this.startNewGame('story', { stage: n, skipIntroFlow: !!opts.skipIntroFlow });
  }

  openEpisodeScreen() {
    const screen = document.getElementById('episodeSelectScreen');
    if (screen) screen.style.display = 'flex';
    this.audio.playSfx('menuTap');
  }

  closeEpisodeScreen() {
    const screen = document.getElementById('episodeSelectScreen');
    if (screen) screen.style.display = 'none';
  }

  openBossGate() {
    if (this.isWaitingForBoss) return;
    this.isWaitingForBoss = true;
    this.bossGatePulse = 0;
    this.bossGateAutoTimer = (this.storyMode === false) ? 2.4 : 0;
    this.audio.playSfx('waveWarning');
    this.triggerWaveWarning('BOSS ENCOUNTER AHEAD', true);
    const hint = document.getElementById('bossGateHint');
    if (hint) hint.style.display = 'flex';
  }

  enterBossArena() {
    if (!this.isWaitingForBoss) return;
    this.isWaitingForBoss = false;
    const hint = document.getElementById('bossGateHint');
    if (hint) hint.style.display = 'none';
    this.audio.playSfx('warpPad');
    this.setVeil(true);
    this.screenTransition = { kind: 'boss', phase: 'veil', timer: 0.34 };
  }

  drawBossGateArrow(ctx) {
    const x = this.stageWidth - 78;
    const y = this.groundY - 96;
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 220);
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * pulse;

    const glow = ctx.createRadialGradient(x, y, 6, x, y, 82);
    glow.addColorStop(0, 'rgba(255, 207, 51, 0.55)');
    glow.addColorStop(1, 'rgba(255, 207, 51, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 82, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffcf33';
    ctx.strokeStyle = '#7c1533';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const off = ((Date.now() / 300 + i * 0.5) % 1.5) * 16;
      ctx.beginPath();
      ctx.moveTo(x - 30 + off, y - 17);
      ctx.lineTo(x + 2 + off, y);
      ctx.lineTo(x - 30 + off, y + 17);
      ctx.lineTo(x - 17 + off, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = "900 13px 'Fredoka One', 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.strokeText('BOSS AHEAD', x - 8, y - 36);
    ctx.fillStyle = '#fff7ed';
    ctx.fillText('BOSS AHEAD', x - 8, y - 36);
    ctx.restore();
  }

  beginWaveExit(nextWaveIdx) {
    if (this.screenTransition) return;
    this.isWaitingForWaveClear = false;
    this.screenTransition = { kind: 'wave', phase: 'walk', timer: 0, nextWaveIdx };
  }

  beginStageExit() {
    if (this.screenTransition) return;
    this.isTransitioning = false;
    this.screenTransition = { kind: 'stage', phase: 'walk', timer: 0 };
  }

  performStageAdvance() {
    const banner = document.getElementById('stageClearBanner');
    if (banner) banner.style.display = 'none';
    this.stageIndex++;
    const stageHeal = (this.enemyManager.stageHeal ?? -1);
    if (stageHeal < 0) {
      this.initPlayerHeartPools();
    } else {
      this.healPlayerHearts(false, stageHeal);
      if (this.player2) this.healPlayerHearts(true, stageHeal);
    }
    this.player.revive(this.audio, this.particles);
    if (this.player2) this.player2.revive(this.audio, this.particles);
    this.isTransitioning = false;
    this.updateHUD();
    if (this.gameMode === 'story') {
      this.startStoryEpisodeFlow(this.stageIndex);
    } else {
      this.startStageWave();
    }
  }

  updateScreenTransition(dt) {
    const t = this.screenTransition;
    if (!t) return;
    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    if (t.phase === 'walk') {
      t.timer = (t.timer || 0) + dt;
      let allGone = true;
      for (const p of players) {
        p.facing = 1;
        p.vx = 460;
        p.x += 460 * dt;
        p.walkAnim = (p.walkAnim || 0) + dt * 15;
        p.isAttacking = false;
        p.isShielding = false;
        p.actionTimer = 0;
        if (p.x < this.stageWidth + 40) allGone = false;
      }
      if (allGone || t.timer >= 1.6) {
        this.setVeil(true);
        t.phase = 'veil';
        t.timer = 0.34;
      }
    } else if (t.phase === 'veil') {
      t.timer -= dt;
      if (t.timer <= 0) {
        for (const p of players) { p.x = -40; p.vx = 0; p.vy = 0; p.walkAnim = 0; }
        this.cameraX = 0;
        this.setVeil(false);
        t.phase = 'enter';
      }
    } else if (t.phase === 'enter') {
      let settled = true;
      for (const p of players) {
        if (p.x < 220) {
          p.x += 360 * dt;
          p.walkAnim += dt * 13;
          p.facing = 1;
          settled = false;
        } else {
          p.vx = 0;
        }
      }
      if (settled) {
        this.setVeil(false);
        this.screenTransition = null;
        if (t.kind === 'wave') {
          this.prepareWave(t.nextWaveIdx);
        } else if (t.kind === 'boss') {
          this.prepareBossWave();
        } else {
          this.performStageAdvance();
        }
      }
    }
  }

  startStageWave() {
    this.isWaitingForBoss = false;
    const gateHint = document.getElementById('bossGateHint');
    if (gateHint) gateHint.style.display = 'none';
    const titles = [
      'EPISODE 1: BEACH CITY BOARDWALK',
      'EPISODE 2: GALAXY WARP & SPIRE',
      'EPISODE 3: THE PRIME KINDERGARTEN',
      'EPISODE 4: SUBTERRANEAN MANTLE DRILL',
      "EPISODE 5: BISMUTH'S BURNING FORGE",
      'EPISODE 6: THE FROZEN NORTH & JASPER',
      "EPISODE 7: PINK DIAMOND'S SPACE ZOO",
      'EPISODE 8: HOMEWORLD ABDUCTION SHORE',
      'EPISODE 9: HOMEWORLD TRIAL & OFF-COLORS',
      'EPISODE 10: CHANGE YOUR MIND - ERA 3'
    ];
    const objectives = [
      'Defend Beach City from Centipeetle Hatchlings & Alpha Mother!',
      'Battle Corrupted Blade Quartzes and repel ancient Spire Colossus!',
      'Neutralize artificial fusion mutants and Kindergarten Amalgam Titan!',
      "Drill into Earth's core and bubble the planetary Geo-Weapon Cluster!",
      'Enter the molten forge and defeat the Ancient Forge Sentinel!',
      'Subdue snow corruptions and conquer the corrupted warrior Jasper!',
      'Infiltrate deep space zoo and defeat Holy Blue Agate Warden!',
      'Withstand crushing Topaz fusions and protect Beach City!',
      'Escape Homeworld courtroom and defeat the Robonoid Hunter Titan!',
      "Confront White Diamond's Supreme Mecha and heal all gems!"
    ];

    const stageTitle = titles[this.stageIndex - 1] || `EPISODE ${this.stageIndex}`;
    const stageObj = objectives[this.stageIndex - 1] || 'Defeat all corrupted gem monsters!';

    const badge = document.getElementById('hudStageBadge');
    if (badge) {
      badge.textContent = stageTitle;
      badge.style.display = 'block';
    }
    const objText = document.getElementById('hudObjectiveText');
    if (objText) {
      objText.textContent = stageObj;
      objText.style.display = 'block';
    }

    const bossHud = document.getElementById('bossHud');
    if (bossHud) {
      bossHud.classList.add('story-mode-boss');
    }

    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.reset(this.stageIndex, diff, this.pickups);

    // Multi-Wave Progression State Reset
    this.waveIndex = 0;
    this.isBossSpawning = false;
    this.bossSpawnTimer = 0;
    this.waveSpawnQueue = [];
    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;

    // Start Multi-Wave Progression (4 Waves + Final Boss Wave)
    this.audio.lastStageIndex = this.stageIndex;
    this.audio.playStageMusic(this.stageIndex, false);
    this.startEpisodeWaveSequence();
  }

  startEpisodeWaveSequence() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    this.enemyManager.wave = 1;
    this.enemyManager.maxWaves = epData.waves.length;
    this.prepareWave(0);
  }

  prepareWave(waveIdx) {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData || waveIdx >= epData.waves.length) {
      // All preliminary waves cleared: Summon Final Boss!
      this.prepareBossWave();
      return;
    }

    // Story beat for this wave (plays once, before the enemies arrive)
    const story = (this.storyMode !== false) ? STORY_SCRIPT[this.stageIndex] : null;
    const beatKey = `${this.stageIndex}:w${waveIdx}`;
    if (story && story.waves && story.waves[waveIdx] && this.lastStoryBeat !== beatKey) {
      this.lastStoryBeat = beatKey;
      this.waveIndex = waveIdx;
      this.showDialogue(story.waves[waveIdx], () => this.prepareWave(waveIdx));
      return;
    }

    this.waveIndex = waveIdx;
    const currentWaveData = epData.waves[waveIdx];
    this.enemyManager.wave = waveIdx + 1;
    this.updateWaveLine();

    // Trigger PvZ-Style "Huge Wave is Approaching" on huge waves!
    if (currentWaveData.isHugeWave) {
      this.triggerWaveWarning("HUGE WAVE OF CORRUPTIONS INCOMING", false);
    }

    // Build spawn queue driven by dt inside update()
    this.waveSpawnQueue = [];
    const enemies = currentWaveData.enemies;
    enemies.forEach((enemyType, idx) => {
      const spawnX = (idx % 2 === 0)
        ? 320 + Math.random() * 500
        : 1800 + Math.random() * 550;
      this.waveSpawnQueue.push({
        type: enemyType,
        timer: idx * 0.65,
        spawnX: spawnX
      });
    });

    // Harder tiers flood the arena with reinforcements from the far edge
    const bonus = this.enemyManager.waveBonus || 0;
    for (let b = 0; b < bonus; b++) {
      const pool = enemies && enemies.length ? enemies : ['centipeetle'];
      const extraType = pool[Math.floor(Math.random() * pool.length)];
      this.waveSpawnQueue.push({
        type: extraType,
        timer: enemies.length * 0.65 + b * 0.9,
        spawnX: 2200 + Math.random() * 320
      });
    }

    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;
  }

  prepareBossWave() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    const story = (this.storyMode !== false) ? STORY_SCRIPT[this.stageIndex] : null;
    const beatKey = `${this.stageIndex}:boss`;
    if (story && story.boss && this.lastStoryBeat !== beatKey) {
      this.lastStoryBeat = beatKey;
      this.showDialogue(story.boss, () => this.prepareBossWave());
      return;
    }

    this.waveIndex = epData.waves.length;
    this.waveSpawnQueue = [];
    this.enemyManager.wave = epData.waves.length + 1;
    this.updateWaveLine();

    // Dramatic Boss Intro Warning Banner & Intense Boss Track
    this.triggerWaveWarning(`FINAL BOSS: ${epData.bossName}`, true);
    this.audio.playStageMusic(this.stageIndex, true);
    this.isBossSpawning = true;
    this.bossSpawnTimer = 1.2;
  }

  handleTeamHealing(sourceHero, amount = 1) {
    // Also restore fractional Spinel Heart life for Steven/Rose themselves!
    if (sourceHero && !sourceHero.isFallen) {
      const isSelfP2 = (sourceHero.playerId === 'p2');
      this.healPlayerHearts(isSelfP2, amount * 0.65);
    }
    if (this.playerMode !== '2p' || !this.player2) {
      this.updateHUD();
      return;
    }
    const targetHero = (sourceHero === this.player) ? this.player2 : this.player;
    if (!targetHero || targetHero.isFallen) {
      this.updateHUD();
      return;
    }

    const isTargetP2 = (targetHero === this.player2);
    const spec = this.getHeartPoolSpec(targetHero);
    const curHp = isTargetP2 ? (this.heartHpP2 ?? 0) : (this.heartHpP1 ?? 0);

    if (curHp < spec.maxHp) {
      this.healPlayerHearts(isTargetP2, amount);
      this.audio.playSfx('cookie');
      this.particles.addSparkle(targetHero.x, targetHero.y - 35, '#ff4d79', 18, 6);
      this.particles.addSparkle(targetHero.x, targetHero.y - 35, '#ffffff', 12, 4);
      this.particles.addRosePetals(targetHero.x, targetHero.y - 35, 12);
      this.updateHUD();
    } else {
      this.particles.addSparkle(targetHero.x, targetHero.y - 35, '#ffd700', 12, 4);
      this.updateHUD();
    }
  }

  knockoutOrPoofPlayer(hero) {
    if (!hero || hero.isFallen) return;

    // Cleanly defuse if merged in fusion
    if (this.isFused) {
      this.finishTagTeamHyperAttack();
    }

    hero.isFallen = true;
    hero.fallenTimer = 0;
    hero.isReforming = false;
    hero.reformProgress = 0;
    hero.vx = 0;
    hero.isAttacking = false;
    hero.isShielding = false;
    hero.isSpinDashing = false;
    hero.isDodging = false;
    hero.invulnerableTimer = 999;

    // 2-Player Arcade Mode: start an 18-second gem float + 3s reformation countdown
    if (this.gameMode === 'arcade' && this.playerMode === '2p' && this.player2) {
      hero.reviveTotal = 18.0;
      hero.reviveTimer = 18.0;
      hero.reformDuration = 3.0;
    } else {
      hero.reviveTotal = 0;
      hero.reviveTimer = 0;
      hero.reformDuration = 0;
    }

    const isHumanoid = (hero.activeChar === 'steven' || hero.activeChar === 'connie');
    hero.fallenType = isHumanoid ? 'lie_down' : 'poofed';

    if (isHumanoid) {
      this.audio.playSfx('hit');
      this.particles.addSparkle(hero.x, hero.y - 25, '#fbbf24', 14, 4);
    } else {
      this.audio.playSfx('poof');
      const gemColors = {
        garnet: '#ef4444',
        amethyst: '#a855f7',
        pearl: '#38bdf8',
        bismuth: '#f97316',
        peridot: '#22c55e',
        lapis: '#0ea5e9',
        rose: '#f43f5e',
        jasper: '#ea580c'
      };
      const col = gemColors[hero.activeChar] || '#c084fc';
      this.particles.addPoof(hero.x, hero.y - 30, '#ffffff');
      this.particles.addPoof(hero.x, hero.y - 30, col);
      this.particles.addSparkle(hero.x, hero.y - 25, col, 20, 6);
    }

    this.checkTeamWipe();
  }

  updateArcadeCoopRevival(dt) {
    if (this.gameMode !== 'arcade' || this.playerMode !== '2p' || !this.player2) return;
    if (this.player.isFallen && this.player2.isFallen) return;

    const pair = [this.player, this.player2];
    for (const hero of pair) {
      if (!hero || !hero.isFallen || !(hero.reviveTimer > 0)) continue;
      hero.reviveTimer = Math.max(0, hero.reviveTimer - dt);
      const reformWin = hero.reformDuration || 3.0;
      if (hero.reviveTimer > 0 && hero.reviveTimer <= reformWin) {
        if (!hero.isReforming) {
          hero.isReforming = true;
          if (this.audio) this.audio.playSfx('weaponSummon');
        }
        hero.reformProgress = Math.max(0, Math.min(1, (reformWin - hero.reviveTimer) / reformWin));
        if (this.particles && Math.random() < 0.35) {
          const glowCol = (hero.activeChar === 'connie') ? '#f472b6' : '#ffffff';
          this.particles.addSparkle(hero.x + (Math.random() - 0.5) * 34, hero.y - 22 - Math.random() * 44, glowCol, 2, 2.2);
        }
      } else if (hero.reviveTimer <= 0) {
        this.completeArcadeCoopRevival(hero);
      }
    }
  }

  completeArcadeCoopRevival(hero) {
    if (!hero || !hero.isFallen) return;
    const isP2 = (hero.playerId === 'p2');
    const wasConnie = (hero.activeChar === 'connie');
    hero.revive(this.audio, this.particles);
    if (wasConnie) {
      // Steven Lion/Lars lore: reviving human Connie infuses her with cotton-candy pink energy!
      hero.isPinkRevived = true;
      if (this.particles) {
        this.particles.addHolyHeal(hero.x, hero.y, '#f472b6');
        this.particles.addSparkle(hero.x, hero.y - 35, '#fbcfe8', 28, 7);
        this.particles.addRosePetals(hero.x, hero.y - 30, 18);
      }
    }
    this.healPlayerHearts(isP2, this.maxHearts);
    this.updateHUD();
  }

  checkTeamWipe() {
    if (this.playerMode === '2p' && this.player2) {
      if (this.currentHearts <= 0 && this.currentHeartsP2 <= 0) {
        if (!this.gameOverTimerActive) {
          this.gameOverTimerActive = true;
          setTimeout(() => {
            if (this.state === 'playing') {
              this.gameOverTimerActive = false;
              this.handleGameOver();
            }
          }, 2000);
        }
      }
    } else {
      if (this.currentHearts <= 0) {
        if (!this.gameOverTimerActive) {
          this.gameOverTimerActive = true;
          setTimeout(() => {
            if (this.state === 'playing') {
              this.gameOverTimerActive = false;
              this.handleGameOver();
            }
          }, 2000);
        }
      }
    }
  }

  gameLoop(currentTime) {
    try {
      // Frame Rate Limit enforcement (30 / 60 / 120 FPS, or 0 = UNLIMITED)
      if (this.targetFps > 0 && this.state === 'playing') {
        const minFrameMs = 1000 / this.targetFps;
        if (!this._lastRenderedFrameTime) this._lastRenderedFrameTime = currentTime;
        const elapsedMs = currentTime - this._lastRenderedFrameTime;
        if (elapsedMs < minFrameMs * 0.92) {
          requestAnimationFrame((t) => this.gameLoop(t));
          return;
        }
        this._lastRenderedFrameTime = currentTime - (elapsedMs % minFrameMs);
      } else {
        this._lastRenderedFrameTime = currentTime;
      }

      if (!this.lastTime) this.lastTime = currentTime;
      const rawDt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

      // Coordinate and Camera Sanity Guards (Prevent NaN physics explosion)
      if (isNaN(this.cameraX)) this.cameraX = 0;
      if (this.player) {
        if (isNaN(this.player.x)) this.player.x = 220;
        if (isNaN(this.player.y)) this.player.y = this.groundY;
        if (isNaN(this.player.vx)) this.player.vx = 0;
        if (isNaN(this.player.vy)) this.player.vy = 0;
      }
      if (this.player2) {
        if (isNaN(this.player2.x)) this.player2.x = 340;
        if (isNaN(this.player2.y)) this.player2.y = this.groundY;
        if (isNaN(this.player2.vx)) this.player2.vx = 0;
        if (isNaN(this.player2.vy)) this.player2.vy = 0;
      }

      if (this.hitstopTimer > 0) {
        this.hitstopTimer -= dt;
        if (this.hitShake > 0) this.hitShake = Math.max(0, this.hitShake - dt * 26);
        this.shakeDirX *= Math.pow(0.001, dt);
        this.shakeDirY *= Math.pow(0.001, dt);
        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
        return;
      }
      if (this.hitShake > 0) {
        this.hitShake = Math.max(0, this.hitShake - dt * 26);
      }
      if (Math.abs(this.shakeDirX) > 0.1 || Math.abs(this.shakeDirY) > 0.1) {
        this.shakeDirX *= Math.pow(0.0008, dt);
        this.shakeDirY *= Math.pow(0.0008, dt);
      } else {
        this.shakeDirX = 0;
        this.shakeDirY = 0;
      }
      if (this.combatBadgeTimer > 0) {
        this.combatBadgeTimer = Math.max(0, this.combatBadgeTimer - dt);
      }

      if (this.state === 'playing') {
        this.update(dt);
      }

      if (this.state !== 'title' && this.state !== 'credits') {
        this.render();
      }
    } catch (err) {
      console.error("Game loop error caught:", err);
      this.screenTransition = null;
      this.setVeil(false);
    }
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    // Portrait cut-in: the world keeps flowing, just in slow motion, so the run
    // never stalls. The timer itself runs on real time.
    if (this.cutinActive) {
      this.cutinTimer -= dt;
      if (this.cutinTimer <= 0) {
        this.endCutin();
      } else {
        dt *= (this.cutinSlowFactor || 0.22);
      }
    }

    this.environment.update();
    this.particles.update();
    this.pollGamepads();
    this.updateHazards(dt);

    if (this.dialogueActive) {
      this.dialogueAutoTimer = (this.dialogueAutoTimer || 0) + dt;
      if (this.dialogueAutoTimer > 7) this.advanceDialogue();
      return;
    }
    if (this.screenTransition) {
      this.updateScreenTransition(dt);
      return;
    }

    // Boss gate: walk to the right edge when you are ready (or auto in arcade mode).
    if (this.isWaitingForBoss) {
      this.bossGatePulse = (this.bossGatePulse || 0) + dt;
      if (this.bossGateAutoTimer > 0) {
        this.bossGateAutoTimer -= dt;
        if (this.bossGateAutoTimer <= 0) this.enterBossArena();
      } else if (this.player && this.player.x > this.stageWidth - 140) {
        this.enterBossArena();
      }
    }

    if (this.isTransitioning) {
      // Delta-time driven stage transition: Immune to browser background throttling & inactivity!
      if (this.transitionTimer > 0) {
        this.transitionTimer -= dt;
        if (this.transitionTimer <= 0) {
          const banner = document.getElementById('stageClearBanner');
          if (banner) banner.style.display = 'none';
          this.stageIndex++;
          const stageHeal = (this.enemyManager.stageHeal ?? -1);
          if (stageHeal < 0) {
            this.initPlayerHeartPools();
          } else {
            this.healPlayerHearts(false, stageHeal);
            if (this.player2) this.healPlayerHearts(true, stageHeal);
          }
          this.player.revive(this.audio, this.particles);
          if (this.player2) this.player2.revive(this.audio, this.particles);
          this.isTransitioning = false;
          this.updateHUD();
          if (this.gameMode === 'story') {
            this.startStoryEpisodeFlow(this.stageIndex);
          } else {
            this.startStageWave();
          }
        }
      }
      return;
    }

    const platforms = this.environment.getPlatformsForStage(this.stageIndex, this.gameMode === 'practice');

    // Combo Timer Decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboTimer = 0;
        this.comboHits = 0;
        this.comboDamage = 0;
        const cDisp = document.getElementById('comboDisplay');
        if (cDisp) cDisp.style.display = 'none';
      }
    }

    // In Practice Mode: Rapid Overdrive charging so moves can be tested continuously
    if (this.gameMode === 'practice') {
      if (!this.isOverdriveActive) {
        this.starPowerMeter = Math.min(100, this.starPowerMeter + dt * 45);
      }
      if (this.playerMode === '2p' && !this.isOverdriveActiveP2) {
        this.starPowerMeterP2 = Math.min(100, (this.starPowerMeterP2 || 0) + dt * 45);
      }
      if (!this.isFused && !this.isHyperAttack) {
        this.fusionEnergy = Math.min(100, (this.fusionEnergy || 0) + dt * 50);
      }
    }

    // Update Smooth Dynamic Camera tracking player & dynamic zoom (Reference: samplemap.mp4)
    const targetCamX = (this.playerMode === '2p' && this.player2)
      ? ((this.player.x + this.player2.x) / 2) - (this.canvas.width / 2)
      : this.player.x - (this.canvas.width / 2);

    this.cameraX += (targetCamX - this.cameraX) * Math.min(1, dt * 6.5);
    this.cameraX = Math.max(0, Math.min(this.stageWidth - this.canvas.width, this.cameraX));

    // Dynamic Camera Zooming (Genshin / Tekken spicy zoom-in & smooth zoom-out)
    if (this.zoomImpulseTimer > 0) {
      this.zoomImpulseTimer = Math.max(0, this.zoomImpulseTimer - dt);
      if (this.zoomImpulseTimer <= 0) {
        this.zoomImpulse = 0;
        this.zoomFocusX = null;
        this.zoomFocusY = null;
      }
    }

    let targetZoom = 1.0;
    const anyOverdrive = !!(this.isOverdriveActive || this.isOverdriveActiveP2 || (this.player && this.player.isPinkOverdrive));
    if (this.playerMode === '2p' && this.player2) {
      const pDist = Math.abs(this.player.x - this.player2.x);
      if (pDist > 450) {
        targetZoom = Math.max(0.85, 1.0 - (pDist - 450) * 0.00035);
      } else if (anyOverdrive || this.isFused) {
        targetZoom = 1.07;
      }
    } else {
      if (!this.player.isGrounded && this.player.y < 340) {
        targetZoom = 0.93; // Leaping / high aerial view
      } else if (anyOverdrive || this.isFused || (this.player.isAttacking && this.player.actionType === 'skill')) {
        targetZoom = 1.11; // Visceral close-up during intense combat & ultimate skills!
      } else {
        const boss = this.enemyManager.enemies.find(e => e.isBoss && !e.isPoofed && !e.isImmortalDummy);
        if (boss && Math.hypot(boss.x - this.player.x, boss.y - this.player.y) < 250) {
          targetZoom = 1.07; // Boss close quarters duel
        } else if ((this.comboHits || 0) >= 6) {
          targetZoom = 1.04; // Subtle focus pulse during high combo flow
        }
      }
    }
    const desiredZoom = targetZoom + (this.zoomImpulseTimer > 0 ? (this.zoomImpulse || 0) : 0);
    const minZoom = (this.playerMode === '2p' && this.player2) ? 0.85 : 0.92;
    const zoomRate = desiredZoom > (this.cameraZoom || 1.0) ? 7.8 : 4.4;
    this.cameraZoom = (this.cameraZoom || 1.0) + (desiredZoom - (this.cameraZoom || 1.0)) * Math.min(1, dt * zoomRate);
    this.cameraZoom = Math.max(minZoom, Math.min(1.18, this.cameraZoom));

    // Smooth camera focus point (shifts toward impact/boss/hero during zoom-in)
    const defaultFocusX = (this.playerMode === '2p' && this.player2)
      ? ((this.player.x + this.player2.x) / 2)
      : this.player.x;
    const defaultFocusY = (this.playerMode === '2p' && this.player2)
      ? ((this.player.y + this.player2.y) / 2) - 65
      : this.player.y - 68;
    const targetFocusX = (this.zoomImpulseTimer > 0 && typeof this.zoomFocusX === 'number')
      ? (defaultFocusX * 0.45 + this.zoomFocusX * 0.55)
      : defaultFocusX;
    const targetFocusY = (this.zoomImpulseTimer > 0 && typeof this.zoomFocusY === 'number')
      ? (defaultFocusY * 0.45 + this.zoomFocusY * 0.55)
      : defaultFocusY;
    this.camFocusX += (targetFocusX - this.camFocusX) * Math.min(1, dt * 7.5);
    this.camFocusY += (targetFocusY - this.camFocusY) * Math.min(1, dt * 6.5);

    // Update Plants vs Zombies style wave progression bar
    this.updateWaveLine();

    // Update Canonical Gem Fusion Timer
    if (this.isFused) {
      this.fusionTimer = Math.max(0, this.fusionTimer - dt);
      this.hyperAttackTimer = this.isHyperAttack ? Math.max(0, this.hyperAttackTimer) : 0;
      this.updateFusionHUD();
      if (this.fusionTimer <= 0) {
        this.unfuseGems();
      }
    }

    // 0. Update Overdrive States
    if (this.isOverdriveActive) {
      this.overdriveTimer -= dt;
      if (this.overdriveTimer <= 0) {
        this.isOverdriveActive = false;
        this.overdriveTimer = 0;
        if (!this.isFused || !this.isOverdriveActiveP2) {
          this.player.deactivatePinkOverdrive();
        }
      }
    }

    if (this.isOverdriveActiveP2 && this.player2) {
      this.overdriveTimerP2 -= dt;
      if (this.overdriveTimerP2 <= 0) {
        this.isOverdriveActiveP2 = false;
        this.overdriveTimerP2 = 0;
        this.player2.deactivatePinkOverdrive();
        if (this.isFused && !this.isOverdriveActive) {
          this.player.deactivatePinkOverdrive();
        }
      }
    }

    if (this.isFused && this.player) {
      const fusedOdMax = Math.max(
        this.isOverdriveActive ? (this.overdriveTimer || 0) : 0,
        this.isOverdriveActiveP2 ? (this.overdriveTimerP2 || 0) : 0
      );
      if (fusedOdMax > 0) {
        this.player.isPinkOverdrive = true;
        this.player.pinkOverdriveTimer = Math.max(this.player.pinkOverdriveTimer || 0, fusedOdMax);
        this.player.dualOverdrive = !!(this.isOverdriveActive && this.isOverdriveActiveP2);
      } else {
        this.player.dualOverdrive = false;
      }
    }
    this.updateHUD();

    // Synergy Buff Timer (Post-Fusion Tag Team Power Surge)
    if (this.synergyBuffTimer > 0) {
      this.synergyBuffTimer -= dt;
      this.player.hasSynergyBuff = true;
      if (this.player2) this.player2.hasSynergyBuff = true;
      if (Math.random() < 0.3) {
        this.particles.addSparkle(this.player.x, this.player.y - 30, '#ffd700', 4, 2);
        if (this.player2) this.particles.addSparkle(this.player2.x, this.player2.y - 30, '#38bdf8', 4, 2);
      }
    } else {
      this.player.hasSynergyBuff = false;
      if (this.player2) this.player2.hasSynergyBuff = false;
    }

    // --- WAVE CONTROLLER (Delta-Time Driven, Immune to Pauses & Idling) ---
    if (!this.isTransitioning && this.gameMode === 'arcade' && this.stageIndex > 0) {
      if (this.waveSpawnQueue && this.waveSpawnQueue.length > 0) {
        for (let q = this.waveSpawnQueue.length - 1; q >= 0; q--) {
          const item = this.waveSpawnQueue[q];
          item.timer -= dt;
          if (item.timer <= 0) {
            this.enemyManager.spawnEnemy(item.type, item.spawnX);
            this.waveSpawnQueue.splice(q, 1);
          }
        }
      }
      if ((!this.waveSpawnQueue || this.waveSpawnQueue.length === 0) && this.enemyManager.enemies.length === 0 && !this.arcadeWavePending) {
        if (!this.isWaitingForWaveClear) {
          this.isWaitingForWaveClear = true;
          this.waveClearTimer = 0.65;
        } else {
          this.waveClearTimer -= dt;
          if (this.waveClearTimer <= 0) {
            this.isWaitingForWaveClear = false;
            this.onArcadeWaveCleared();
          }
        }
      } else {
        this.isWaitingForWaveClear = false;
      }
    } else if (!this.isTransitioning && this.gameMode === 'story' && this.stageIndex > 0) {
      // 1. Process wave spawn queue
      if (this.waveSpawnQueue && this.waveSpawnQueue.length > 0) {
        for (let q = this.waveSpawnQueue.length - 1; q >= 0; q--) {
          const item = this.waveSpawnQueue[q];
          item.timer -= dt;
          if (item.timer <= 0) {
            this.enemyManager.spawnEnemy(item.type, item.spawnX);
            this.waveSpawnQueue.splice(q, 1);
          }
        }
      }

      // 2. Boss spawning timer
      if (this.isBossSpawning) {
        this.bossSpawnTimer -= dt;
        if (this.bossSpawnTimer <= 0) {
          this.isBossSpawning = false;
          const epData = EPISODE_WAVES[this.stageIndex];
          if (epData) {
            this.enemyManager.spawnEnemy(epData.boss, 1350);
            const bossHud = document.getElementById('bossHud');
            if (bossHud) {
              bossHud.style.display = 'flex';
              bossHud.classList.add('story-mode-boss');
              const nameEl = document.getElementById('bossName');
              if (nameEl) nameEl.textContent = epData.bossName;
            }
          }
        }
      }

      // 3. Wave clearance check & progression
      const epData = EPISODE_WAVES[this.stageIndex];
      if (epData && !this.isBossSpawning && (!this.waveSpawnQueue || this.waveSpawnQueue.length === 0)) {
        if (this.waveIndex < epData.waves.length) {
          if (this.enemyManager.enemies.length === 0) {
            if (!this.isWaitingForWaveClear) {
              this.isWaitingForWaveClear = true;
              this.waveClearTimer = 1.2;
            } else {
              this.waveClearTimer -= dt;
              if (this.waveClearTimer <= 0) {
                this.isWaitingForWaveClear = false;
                // Waves flow straight into each other — no walking off screen.
                // Only the run up to a boss asks the player to walk right, manually.
                if (this.waveIndex >= epData.waves.length - 1) {
                  this.openBossGate();
                } else {
                  this.prepareWave(this.waveIndex + 1);
                }
              }
            }
          } else {
            this.isWaitingForWaveClear = false;
          }
        }
      }
    }

    // 1. Update Players (or Tag-Team Hyper Fusion Attack)
    if (this.isHyperAttack) {
      this.updateHyperAttack(dt, platforms);
    } else if (this.isFused && this.playerMode === '2p' && this.player2) {
      // 2-Player Co-Op Fusion: Shared movement and divided skills!
      const sharedKeys = {
        left: this.keysP1.left || this.keysP2.left,
        right: this.keysP1.right || this.keysP2.right,
        sprint: this.keysP1.sprint || this.keysP2.sprint,
        jump: this.keysP1.jump || this.keysP2.jump,
        down: this.keysP1.down || this.keysP2.down,
        shield: this.keysP1.shield || this.keysP2.shield,
        dodge: this.keysP1.dodge || this.keysP2.dodge,
        attack: this.keysP1.attack,
        special: this.keysP1.special,
        skill: this.keysP1.skill,
        overdrive: this.keysP1.overdrive
      };

      this.player.update(dt, sharedKeys, this.audio, this.particles, this.projectiles, this.pickups, platforms);
      this.tagPlayerProjectiles(this.player);

      // Keep Player 2 synced with Fusion
      this.player2.x = this.player.x;
      this.player2.y = this.player.y;
      this.player2.vx = this.player.vx;
      this.player2.vy = this.player.vy;
      this.player2.facing = this.player.facing;
      this.player2.isMergedInFusion = true;

      // Tick P2 Fusion Cooldowns
      if (this.player2AttackCooldown > 0) this.player2AttackCooldown -= dt;
      if (this.player2SpecialCooldown > 0) this.player2SpecialCooldown -= dt;
      if (this.player2SkillCooldown > 0) this.player2SkillCooldown -= dt;

      // Process Player 2 Fusion Actions
      if (this.keysP2.attack && (this.player2AttackCooldown || 0) <= 0) {
        this.executePlayer2FusionAction('j');
      }
      if (this.keysP2.special && (this.player2SpecialCooldown || 0) <= 0) {
        this.executePlayer2FusionAction('k');
      }
      if (this.keysP2.skill && (this.player2SkillCooldown || 0) <= 0) {
        this.executePlayer2FusionAction('l');
      }
    } else {
      this.player.update(dt, this.keysP1, this.audio, this.particles, this.projectiles, this.pickups, platforms);
      this.tagPlayerProjectiles(this.player);

      if (this.playerMode === '2p' && this.player2) {
        this.player2.update(dt, this.keysP2, this.audio, this.particles, this.projectiles, this.pickups, platforms);
        this.tagPlayerProjectiles(this.player2);
      }
    }

    // 1b. 2P Arcade Co-Op Automatic 18s Revival + 3s Reformation
    this.updateArcadeCoopRevival(dt);

    // 2. Update Pickups
    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.life -= dt;

      // Magnetic Suction toward nearest player (Reference: coinpickup.mp4)
      let closestPl = null;
      let closestDist = 220;
      for (const pl of players) {
        const d = Math.hypot(p.x - pl.x, (p.y - 12) - (pl.y - 30));
        if (d < closestDist) {
          closestDist = d;
          closestPl = pl;
        }
      }

      if (closestPl) {
        p.isMagnetized = true;
        const dx = closestPl.x - p.x;
        const dy = (closestPl.y - 25) - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pullSpeed = Math.min(850, 320 + (220 - dist) * 3.5);
        p.vx = (p.vx || 0) * 0.88 + (dx / dist) * pullSpeed * dt * 4;
        p.vy = (p.vy || 0) * 0.88 + (dy / dist) * pullSpeed * dt * 4;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (Math.random() < 0.35) {
          this.particles.addSparkle(p.x, p.y, '#ffd700', 1, 0.4);
        }
      }

      let nearPlayer = null;
      for (const pl of players) {
        if (Math.hypot(p.x - pl.x, p.y - pl.y) < 38) {
          nearPlayer = pl;
          break;
        }
      }

      if (nearPlayer) {
        if (p.type === 'cookie' || p.type === 'heart') {
          if (!nearPlayer.isFallen) {
            this.healPlayerHearts(nearPlayer.playerId === 'p2', 1);
            this.particles.addCollectBurst(nearPlayer.x, nearPlayer.y - 26, '#ff86e6');
            this.particles.addDamageText(nearPlayer.x, nearPlayer.y - 50, '+1 HEART', false, '#ff2a6d');
            this.audio.playSfx('cookie');
            this.score += 150;
            this.addFusionSync(15);
            this.pickups.splice(i, 1);
            this.updateHUD();
          }
        } else {
          this.audio.playSfx('coin');
          this.score += 150;
          this.addFusionSync(15);
          this.pickups.splice(i, 1);
          this.updateHUD();
        }
      } else if (p.life <= 0) {
        this.pickups.splice(i, 1);
      }
    }

    // 3. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.homing && p.type.startsWith('enemy')) {
        const livingTarget = players.find(pl => !pl.isFallen);
        if (livingTarget) {
          const tx = livingTarget.x - p.x;
          const ty = (livingTarget.y - 36) - p.y;
          const d = Math.hypot(tx, ty) || 1;
          const spd = Math.hypot(p.vx || 0, p.vy || 0) || 280;
          const steer = Math.min(1, dt * (p.homing / 110));
          p.vx = (p.vx || 0) + ((tx / d) * spd - (p.vx || 0)) * steer;
          p.vy = (p.vy || 0) + ((ty / d) * spd - (p.vy || 0)) * steer;
        }
      }
      if (p.homing && this.enemyManager && this.enemyManager.enemies && this.enemyManager.enemies.length > 0 && !p.type.startsWith('enemy')) {
        let bestE = null;
        let bestDist = 860;
        for (const e of this.enemyManager.enemies) {
          if (e.isPoofed) continue;
          const ey = e.y - (e.height || 50) * 0.5;
          const dist = Math.hypot(e.x - p.x, ey - p.y);
          if (dist < bestDist) {
            bestDist = dist;
            bestE = e;
          }
        }
        if (bestE) {
          const tx = bestE.x - p.x;
          const ty = (bestE.y - (bestE.height || 50) * 0.5) - p.y;
          const d = Math.hypot(tx, ty) || 1;
          const spd = Math.hypot(p.vx || 0, p.vy || 0) || 880;
          const steer = Math.min(1, dt * (p.homing / 110));
          p.vx = (p.vx || 0) + ((tx / d) * spd - (p.vx || 0)) * steer;
          p.vy = (p.vy || 0) + ((ty / d) * spd - (p.vy || 0)) * steer;
        }
      }
      if (p.followOwner && !p.followOwner.isFallen) {
        p.x = p.followOwner.x + (p.followOwner.facing || 1) * (p.offsetX || 32);
        p.y = p.followOwner.y + (p.offsetY || -36);
        if (p.deflectEnemyShots) {
          for (const ep of this.projectiles) {
            if (ep !== p && ep.type && ep.type.startsWith('enemy') && Math.hypot(ep.x - p.x, ep.y - p.y) < 86) {
              ep.life = 0;
              if (this.particles) {
                this.particles.addHitSpark(ep.x, ep.y, '#f472b6', 18, 0);
                this.particles.addDamageText(ep.x, ep.y - 24, '⚔️ DEFLECT!', false, '#fbcfe8');
              }
            }
          }
        }
      } else {
        if (p.gravity) {
          p.vy = (p.vy || 0) + p.gravity * dt;
        }
        p.x += (p.vx || 0) * dt;
        p.y += (p.vy || 0) * dt;
      }
      // Arcing Molten Hammer ground slam shockwave (Bismuth [K])
      if (p.gravity && p.y >= this.groundY - 12 && p.type === 'bismuthAnvil') {
        p.y = this.groundY - 12;
        p.life = 0;
        if (this.particles) {
          this.particles.addHammerQuake(p.x, this.groundY, '#f97316');
          this.particles.addExplosion(p.x, this.groundY - 10, '#fbbf24', 18);
        }
        if (this.enemyManager && this.enemyManager.enemies) {
          for (const e of this.enemyManager.enemies) {
            if (!e.isPoofed && Math.abs(e.x - p.x) < 125 && Math.abs(e.y - this.groundY) < 95) {
              e.hp = Math.max(0, e.hp - Math.round((p.damage || 45) * 0.75));
              e.hurtTimer = 0.45;
              e.vy = -190;
              if (this.particles) this.particles.addDamageText(e.x, e.y - 52, '🔥 LAVA QUAKE!', true, '#fb923c');
            }
          }
        }
      }
      p.life -= dt;

      if (p.hitCooldowns) {
        for (const k in p.hitCooldowns) {
          if (p.hitCooldowns[k] > 0) p.hitCooldowns[k] -= dt;
        }
      }

      if (p.type === 'holoPearl') {
        p.sparkleTimer = (p.sparkleTimer || 0) + dt;
        if (p.sparkleTimer >= 0.08) {
          p.sparkleTimer = 0;
          this.particles.addSparkle(p.x - (p.facing || 1) * 18, p.y + 12, p.isOverdrive ? '#f472b6' : '#67e8f9', 4, 3);
        }
      }

      if (p.type.startsWith('enemy')) {
        for (const pl of players) {
          if (pl.isFallen) continue;
          const hitRad = p.radius || (p.width ? p.width / 2 : 15);
          const dist = Math.hypot(p.x - pl.x, p.y - (pl.y - 35));
          if (dist < hitRad + 20) {
            const damaged = pl.takeDamage(p.damage || 1, this.particles, this.audio);
            if (damaged) {
              const heartsLeft = this.damagePlayerHearts(pl, p.damage || 1, pl._lastMitigatedHpLoss);
              if (heartsLeft <= 0) {
                this.knockoutOrPoofPlayer(pl);
              }
              this.updateHUD();
              this.checkTeamWipe();
            }
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }

      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Update Enemies
    this.enemyManager.update(dt, this.player, this.audio, this.particles, this.projectiles, (poofedEnemy) => {
      this.score += poofedEnemy.isBoss ? 1500 : 300;
      this.addFusionSync(poofedEnemy.isBoss ? 25 : 15);
      this.updateHUD();
    }, platforms, this.player2);

    // Player Defeat Verification (Steven/Connie Down, Gems Poofed)
    if (this.currentHearts <= 0 && !this.player.isFallen) {
      this.knockoutOrPoofPlayer(this.player);
    }
    if (this.player2 && this.currentHeartsP2 <= 0 && !this.player2.isFallen) {
      this.knockoutOrPoofPlayer(this.player2);
    }

    // 5. Gem Bubbling: Auto-collect poofed gems on proximity / touch
    this.autoCollectBubbledGems(dt);

    // 6. Action Bar Cooldown Sweeps
    this.updateCooldowns();

    // 7. Victory Check (Story mode only)
    const epData = EPISODE_WAVES[this.stageIndex];
    const wavesFinished = epData ? (this.waveIndex >= epData.waves.length) : true;
    const queueEmpty = !this.waveSpawnQueue || this.waveSpawnQueue.length === 0;

    if (
      !this.isTransitioning &&
      this.gameMode === 'story' &&
      wavesFinished &&
      !this.isBossSpawning &&
      queueEmpty &&
      this.enemyManager.bossDefeated &&
      this.enemyManager.enemies.length === 0
    ) {
      if (this.stageIndex < this.maxStages) {
        this.advanceToNextStage();
      } else {
        this.handleFinalVictory();
      }
    }
  }

  // Native HTML5 Gamepad API Support (Console-Grade 1P & 2P Controller Navigation)
  pollGamepads() {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads) return;

    const pads = [];
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i] && gamepads[i].connected) pads.push(gamepads[i]);
    }
    if (pads.length === 0) return;

    const applyPadToKeys = (pad, keys, playerId) => {
      if (!pad || !keys) return;
      const stickX = pad.axes[0] || 0;
      const stickY = pad.axes[1] || 0;
      const dpadLeft = pad.buttons[14]?.pressed;
      const dpadRight = pad.buttons[15]?.pressed;
      const dpadUp = pad.buttons[12]?.pressed;
      const dpadDown = pad.buttons[13]?.pressed;

      if (stickX < -0.3 || dpadLeft) keys.left = true;
      if (stickX > 0.3 || dpadRight) keys.right = true;
      if (stickY < -0.4 || dpadUp) keys.jump = true;
      if (stickY > 0.4 || dpadDown) { keys.down = true; keys.shield = true; }

      // Face Buttons: A(Jump), X(Attack), B(Special), Y(Skill)
      if (pad.buttons[0]?.pressed) keys.jump = true;
      if (pad.buttons[2]?.pressed) {
        keys.attack = true;
        this.triggerSlotAnimation(playerId === 'p2' ? 'slotP2_J' : 'slotJ');
      }
      if (pad.buttons[1]?.pressed) {
        keys.special = true;
        this.triggerSlotAnimation(playerId === 'p2' ? 'slotP2_K' : 'slotK');
      }
      if (pad.buttons[3]?.pressed) {
        keys.skill = true;
        this.triggerSlotAnimation(playerId === 'p2' ? 'slotP2_L' : 'slotL');
      }

      // Shoulders & Triggers: LB/LT (Shield), RB/RT (Dodge)
      if (pad.buttons[4]?.pressed || pad.buttons[6]?.pressed) { keys.shield = true; }
      if (pad.buttons[5]?.pressed || pad.buttons[7]?.pressed) {
        keys.dodge = true;
        this.triggerSlotAnimation(playerId === 'p2' ? 'slotP2_I' : 'slotI');
      }

      // Start (Fusion in 2P / Overdrive in 1P), Select (Overdrive in 1P & 2P)
      if (pad.buttons[8]?.pressed) {
        this.activatePinkOverdrive(playerId);
      }
      if (pad.buttons[9]?.pressed) {
        if (this.playerMode === '2p') {
          this.triggerFusion();
        } else {
          this.activatePinkOverdrive('p1');
        }
      }
    };

    if (this.playerMode === '2p' && pads.length >= 2) {
      applyPadToKeys(pads[0], this.keysP1, 'p1');
      applyPadToKeys(pads[1], this.keysP2, 'p2');
    } else if (this.playerMode === '2p' && pads.length === 1) {
      applyPadToKeys(pads[0], this.keysP2, 'p2');
    } else {
      applyPadToKeys(pads[0], this.keysP1, 'p1');
    }
  }

  // Interactive Stage Hazards & Level Gimmicks Update
  updateHazards(dt) {
    const hazards = this.environment.getHazardsForStage(this.stageIndex, this.gameMode === 'practice');
    if (!hazards || hazards.length === 0) return;

    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    for (const h of hazards) {
      if (h.type === 'bounce_pad') {
        for (const pl of players) {
          if (pl.isFallen) continue;
          if (pl.x >= h.x - 10 && pl.x <= h.x + h.width + 10 && Math.abs(pl.y - h.y) < 22 && pl.vy >= 0) {
            pl.vy = -1050;
            pl.isGrounded = false;
            pl.canDoubleJump = true;
            if (this.audio) this.audio.playSfx('bounce');
            if (this.particles) {
              this.particles.addSparkle(pl.x, pl.y, h.color || '#f472b6', 16, 5);
              this.particles.addDamageText(pl.x, pl.y - 45, '★ SUPER BOUNCE!', true, '#f472b6');
            }
          }
        }
      } else if (h.type === 'pillar' && h.hp > 0) {
        if (h._hitCooldown > 0) h._hitCooldown -= dt;
        if ((h._hitCooldown || 0) <= 0) {
          for (const pl of players) {
            if (pl.isAttacking && Math.abs(pl.x - (h.x + h.width / 2)) < 65 && Math.abs(pl.y - (h.y + h.height / 2)) < 75) {
              h.hp -= 20;
              h._hitCooldown = 0.28;
              if (this.particles) this.particles.addDebris(h.x + h.width / 2, h.y + 35, '#94a3b8', 5);
              if (h.hp <= 0 && !h.crumbled) {
                h.crumbled = true;
                if (this.audio) {
                  this.audio.playSfx('explosion');
                  this.audio.playSfx('subBass');
                }
                if (this.particles) {
                  this.particles.addExplosion(h.x + h.width / 2, h.y + h.height / 2, '#cbd5e1', 22);
                  this.particles.addShockwaveRing(h.x + h.width / 2, this.groundY, 160, '#cbd5e1', 4.0);
                }
                if (this.enemyManager && this.enemyManager.enemies) {
                  for (let ei = 0; ei < this.enemyManager.enemies.length; ei++) {
                    const e = this.enemyManager.enemies[ei];
                    if (Math.hypot(e.x - (h.x + h.width / 2), e.y - this.groundY) < 180) {
                      e.stunTimer = 1.0;
                      this.enemyManager.damageEnemy(e, 45, this.particles, this.audio, null, ei, 'rock', 1, { allowCrit: false });
                    }
                  }
                }
              }
              break;
            }
          }
        }
      } else if (h.type === 'low_gravity') {
        for (const pl of players) {
          if (pl.isFallen) continue;
          if (pl.x >= h.x && pl.x <= h.x + h.width && pl.y >= h.y && pl.y <= h.y + h.height) {
            if (pl.vy > 0) pl.vy *= 0.94;
            if (Math.random() < 0.16 && this.particles) {
              this.particles.addSparkle(pl.x, pl.y - 20, '#38bdf8', 2, 1);
            }
          }
        }
      } else if (h.type === 'destabilizer' && h.active) {
        if (this.enemyManager && this.enemyManager.enemies) {
          const nowHaz = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
          h._enemyCooldowns = h._enemyCooldowns || new WeakMap();
          for (let ei = 0; ei < this.enemyManager.enemies.length; ei++) {
            const e = this.enemyManager.enemies[ei];
            if (e.isPoofed || e.isPoofing) continue;
            if (e.x >= h.x - 15 && e.x <= h.x + h.width + 15 && e.y >= h.y && e.y <= h.y + h.height) {
              const lastHit = h._enemyCooldowns.get(e) || 0;
              if (nowHaz - lastHit < 450) continue;
              h._enemyCooldowns.set(e, nowHaz);
              e.stunTimer = 0.85;
              e.vx = e.facing * -280;
              this.enemyManager.damageEnemy(e, 20, this.particles, this.audio, null, ei, 'electr', 1, { allowCrit: false });
              if (this.audio) this.audio.playSfx('lightning');
            }
          }
        }
      } else if (h.type === 'geyser' && h.active) {
        if (this.enemyManager && this.enemyManager.enemies) {
          const nowHaz = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
          h._enemyCooldowns = h._enemyCooldowns || new WeakMap();
          for (let ei = 0; ei < this.enemyManager.enemies.length; ei++) {
            const e = this.enemyManager.enemies[ei];
            if (e.isPoofed || e.isPoofing) continue;
            if (Math.abs(e.x - (h.x + h.width / 2)) < h.width / 2 + 10 && e.y >= h.y - h.height && e.y <= h.y + 20) {
              const lastHit = h._enemyCooldowns.get(e) || 0;
              if (nowHaz - lastHit < 450) continue;
              h._enemyCooldowns.set(e, nowHaz);
              e.vy = -580;
              this.enemyManager.damageEnemy(e, 15, this.particles, this.audio, null, ei, 'fire', 1, { allowCrit: false });
              if (this.audio) this.audio.playSfx('explosion');
            }
          }
        }
      }
    }
  }

  // Cinematic Boss Defeat Finisher
  triggerBossCinematicFinisher(boss) {
    if (this.cinematicFinisherActive) return;
    this.cinematicFinisherActive = true;
    this.triggerHitstop(0.08, 4.5);
    if (this.audio) {
      this.audio.playSfx('subBass');
      this.audio.playSfx('victory');
      this.audio.duckMusic(0.65, 2.5);
    }
    if (this.particles) {
      const bc = boss.gemColor || '#ffd700';
      this.particles.addImpactFrame(boss.x, boss.y - boss.height / 2, bc, 210);
      this.particles.addCollectBurst(boss.x, boss.y - boss.height / 2, '#fde047');
      this.particles.addVictoryLightRays(boss.x, boss.y - boss.height / 2, bc, 16);
    }
    setTimeout(() => { this.cinematicFinisherActive = false; }, 2500);
  }

  activatePinkOverdrive(playerId = 'p1') {
    if (this.state !== 'playing') return;
    const hero = playerId === 'p2' ? this.player2 : this.player;
    if (!hero) return;

    const alreadyActive = playerId === 'p2' ? this.isOverdriveActiveP2 : this.isOverdriveActive;
    const meter = playerId === 'p2' ? (this.starPowerMeterP2 || 0) : this.starPowerMeter;
    if (alreadyActive) return;
    if (this.gameMode !== 'practice' && meter < 100) return;
    if (this.dialogueActive || this.screenTransition) return;
    if (this.cutinActive) {
      // Queue overdrive so pressing [R]/[O] during the fusion entrance cutin doesn't drop the input
      this._pendingOverdrive = playerId;
      return;
    }

    const isFusedOd = !!(this.isFused && this.player && this.player.isFusion && this.player.fusionData);
    const otherActive = playerId === 'p2' ? this.isOverdriveActive : this.isOverdriveActiveP2;
    const theme = OVERDRIVE_THEMES[hero.activeChar] || OVERDRIVE_THEMES.steven;

    // Zero-lag optimization: apply Gem Surge stat buff immediately while the portrait flash plays
    this.applyOverdrive(playerId);

    if (isFusedOd) {
      const f = this.player.fusionData;
      this.startCutin({
        kicker: otherActive ? 'DUAL FUSION GEM SURGE' : 'FUSION GEM SURGE',
        kickerColor: f.color || theme.color,
        charId: hero.activeChar,
        centerPortraitId: f.id,
        portraitId: (f.gems && f.gems[0]) || hero.activeChar,
        secondPortraitId: (f.gems && f.gems[1]) || null,
        useOverdriveArt: true,
        name: `${(f.name || theme.name).toUpperCase()} SURGE`,
        quote: otherActive ? 'DUAL GEM SURGE · 2.5× POWER · OVERCLOCKED FUSION' : 'FUSION GEM SURGE · 2× POWER · 12 SECONDS',
        side: playerId === 'p2' ? 'right' : 'left',
        duration: 0.72,
        freeze: 0,
        onDone: () => {}
      });
    } else {
      this.startCutin({
        kicker: 'GEM SURGE',
        kickerColor: theme.color,
        charId: hero.activeChar,
        useOverdriveArt: true,
        name: theme.name,
        quote: 'GEM SURGE · 2× POWER · +85% SPEED · 12 SECONDS',
        side: playerId === 'p2' ? 'right' : 'left',
        duration: 0.75,
        freeze: 0,
        onDone: () => {}
      });
    }
  }

  // Apply the Gem Surge power-up immediately upon activation.
  applyOverdrive(playerId = 'p1') {
    if (this.state !== 'playing') return;
    if (this.audio) this.audio.duckMusic(0.75, 1.2);
    const isFusedBody = !!(this.isFused && this.player && this.player.isFusion);
    if (playerId === 'p1') {
      if (this.isOverdriveActive) return;
      if (this.gameMode !== 'practice' && this.starPowerMeter < 100) return;

      this.starPowerMeter = 0;
      this.isOverdriveActive = true;
      this.overdriveTimer = this.overdriveDuration;
      this.player.activatePinkOverdrive(this.overdriveDuration);

      this.audio.playSfx('overdrive');
      this.triggerCameraZoom(0.10, 0.50, this.player.x, this.player.y - 64);
      const theme = OVERDRIVE_THEMES[this.player.activeChar] || OVERDRIVE_THEMES.steven;
      const dualNow = isFusedBody && this.isOverdriveActiveP2;
      if (isFusedBody) {
        this.player.dualOverdrive = dualNow;
        this.fusionTimer = Math.min(20, (this.fusionTimer || this.hyperAttackTimer || 8) + 1.5);
        if (this.isHyperAttack) this.hyperAttackTimer = this.fusionTimer;
        if (dualNow) {
          this.healPlayerHearts(false, 1);
          if (this.player2) this.healPlayerHearts(true, 1);
        }
      }
      const fCol = (isFusedBody && this.player.fusionData?.color) || theme.color;
      this.particles.addPoof(this.player.x, this.player.y - 30, fCol);
      this.particles.addSparkle(this.player.x, this.player.y - 30, '#ffffff', isFusedBody ? 36 : 26, 8);
      const label = dualNow
        ? '🌟 DUAL FUSION GEM SURGE! (2.5X POWER) 🌟'
        : (isFusedBody ? `💎 ${(this.player.fusionData?.name || 'FUSION').toUpperCase()} GEM SURGE! (2X POWER)` : `${theme.msg} (2X POWER)`);
      this.particles.addDamageText(this.player.x, this.player.y - (isFusedBody ? 95 : 65), label, true, fCol);
    } else if (playerId === 'p2' && this.player2) {
      if (this.isOverdriveActiveP2) return;
      if (this.gameMode !== 'practice' && (this.starPowerMeterP2 || 0) < 100) return;

      this.starPowerMeterP2 = 0;
      this.isOverdriveActiveP2 = true;
      this.overdriveTimerP2 = this.overdriveDuration;
      this.player2.activatePinkOverdrive(this.overdriveDuration);

      this.audio.playSfx('overdrive');
      const odTarget = isFusedBody ? this.player : this.player2;
      if (odTarget) this.triggerCameraZoom(0.10, 0.50, odTarget.x, odTarget.y - 64);
      const theme = OVERDRIVE_THEMES[this.player2.activeChar] || OVERDRIVE_THEMES.garnet;
      const dualNow = isFusedBody && this.isOverdriveActive;
      if (isFusedBody && this.player) {
        // Apply Gem Surge directly onto the fused hero body controlled by both players
        this.player.activatePinkOverdrive(this.overdriveDuration);
        this.player.dualOverdrive = dualNow;
        this.fusionTimer = Math.min(20, (this.fusionTimer || this.hyperAttackTimer || 8) + 1.5);
        if (this.isHyperAttack) this.hyperAttackTimer = this.fusionTimer;
        if (dualNow) {
          this.healPlayerHearts(false, 1);
          this.healPlayerHearts(true, 1);
        }
      }
      const targetPl = isFusedBody ? this.player : this.player2;
      const fCol = (isFusedBody && this.player.fusionData?.color) || theme.color;
      this.particles.addPoof(targetPl.x, targetPl.y - 30, fCol);
      this.particles.addSparkle(targetPl.x, targetPl.y - 30, '#ffffff', isFusedBody ? 36 : 26, 8);
      const label = dualNow
        ? '🌟 DUAL FUSION GEM SURGE! (2.5X POWER) 🌟'
        : (isFusedBody ? `💎 ${(this.player.fusionData?.name || 'FUSION').toUpperCase()} GEM SURGE! (2X POWER)` : `${theme.msg} (2X POWER)`);
      this.particles.addDamageText(targetPl.x, targetPl.y - (isFusedBody ? 95 : 65), label, true, fCol);
    }

    this.updateHUD();
  }

  autoCollectBubbledGems(dt = 0.016) {
    const gems = this.enemyManager.droppedGems;
    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    for (let i = gems.length - 1; i >= 0; i--) {
      const g = gems[i];

      // Magnetic Attraction Animation (Reference: coinpickup.mp4)
      let closestPl = null;
      let closestDist = 240;
      for (const pl of players) {
        const d = Math.hypot(g.x - pl.x, (g.y - 12) - (pl.y - 30));
        if (d < closestDist) {
          closestDist = d;
          closestPl = pl;
        }
      }

      if (closestPl) {
        g.isMagnetized = true;
        const dx = closestPl.x - g.x;
        const dy = (closestPl.y - 25) - g.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pullSpeed = Math.min(850, 320 + (240 - dist) * 3.5);
        g.vx = (g.vx || 0) * 0.88 + (dx / dist) * pullSpeed * dt * 4;
        g.vy = (g.vy || 0) * 0.88 + (dy / dist) * pullSpeed * dt * 4;
        g.x += g.vx * dt;
        g.y += g.vy * dt;
        if (Math.random() < 0.35) {
          this.particles.addSparkle(g.x, g.y, g.color || '#38bdf8', 1, 0.4);
        }
      }

      let collector = null;
      for (const pl of players) {
        if (Math.hypot(g.x - pl.x, g.y - pl.y) < 38) {
          collector = pl;
          break;
        }
      }

      if (collector) {
        this.audio.playSfx('coin');
        this.particles.addCollectBurst(g.x, g.y - 12, g.color || '#ff86e6');
        const awardPct = g.bubblePercent || 20;

        this.bubbledGemsCount++;
        this.score += 500;

        // Overdrive meter continues charging even while fused
        if (collector.playerId === 'p2') {
          if (!this.isOverdriveActiveP2) {
            this.starPowerMeterP2 = Math.min(100, (this.starPowerMeterP2 || 0) + awardPct);
          }
        } else {
          if (!this.isOverdriveActive) {
            this.starPowerMeter = Math.min(100, this.starPowerMeter + awardPct);
          }
        }

        this.savedBubbles.push({
          color: g.color,
          shape: g.shape,
          type: g.type,
          timestamp: Date.now()
        });
        SafeStorage.setItem('su_bubbledGems', JSON.stringify(this.savedBubbles));

        gems.splice(i, 1);
        this.updateHUD();
      }
    }
  }

  advanceToNextStage() {
    if (this.isTransitioning || this.screenTransition) return;
    this.isTransitioning = false;
    this.beginStageExit();
    this.isBossSpawning = false;
    this.bossSpawnTimer = 0;
    this.waveSpawnQueue = [];
    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;
    this.enemyManager.bossDefeated = false;
    this.enemyManager.isBossAlive = false;
    this.enemyManager.enemies = [];
    this.audio.playSfx('stageClear');

    // Cleanly defuse if fused upon finishing a stage so fusion doesn't glitch across stages
    if (this.isFused) {
      this.finishTagTeamHyperAttack();
    }

    const nextNames = [
      'Episode 2: Galaxy Warp & Ancient Spire',
      'Episode 3: The Prime Kindergarten',
      'Episode 4: Subterranean Mantle Drill - The Cluster',
      'Episode 5: Bismuth\'s Burning Forge',
      'Episode 6: The Frozen North & Jasper',
      'Episode 7: Pink Diamond\'s Space Zoo',
      'Episode 8: Homeworld Abduction Shore',
      'Episode 9: The Homeworld Trial & Off-Colors',
      'Episode 10: Change Your Mind - White Diamond Mecha'
    ];

    const banner = document.getElementById('stageClearBanner');
    const titleEl = document.getElementById('stageClearTitle');
    const descEl = document.getElementById('stageClearDesc');

    this.audio.playSfx('victory');
    if (this.particles && this.player) {
      this.particles.addVictoryLightRays(this.player.x, this.player.y - 45, '#ffd700', 14);
      this.particles.addCollectBurst(this.player.x, this.player.y - 45, '#fde047');
    }
    if (banner && titleEl && descEl) {
      titleEl.textContent = `EPISODE ${this.stageIndex} CLEAR`;
      descEl.textContent = `NEXT: ${nextNames[this.stageIndex - 1] || 'Next Stage'}`;
      banner.style.display = 'block';
    }
  }

  handleFinalVictory() {
    this.screenTransition = null;
    this.setVeil(false);
    this.state = 'victory';
    this.audio.playSfx('victory');
    if (this.particles && this.player) {
      this.particles.addVictoryLightRays(this.player.x, this.player.y - 45, '#ffd700', 14);
      this.particles.addCollectBurst(this.player.x, this.player.y - 45, '#fde047');
    }
    this.audio.stopMusic();

    if (document.body) document.body.classList.remove('in-game');
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.classList.remove('active');
      touchBox.style.display = 'none';
    }

    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';

    if (this.score > this.highScore) {
      this.highScore = this.score;
      SafeStorage.setItem('su_highScore', this.highScore.toString());
    }

    const title = document.getElementById('victoryTitle');
    if (title) title.textContent = 'GRAND VICTORY! EARTH IS SAVED!';
    const subtitle = document.getElementById('victorySubtitle');
    if (subtitle) subtitle.textContent = 'All 10 Campaign Episodes conquered! The Great Diamond Authority is reconciled, corruption is healed, and Era 3 galactic peace is achieved!';

    document.getElementById('vStatPoofed').textContent = 'ALL CLEARED';
    document.getElementById('vStatBubbled').textContent = `${this.bubbledGemsCount}`;
    document.getElementById('vStatScore').textContent = `${this.score}`;
    document.getElementById('vStatRank').textContent = this.currentHearts >= 4 ? 'STAR ⭐ (S+)' : 'GEM 💎 (A)';

    if (this.gameMode === 'story' && typeof STORY_FINALE_CUTSCENE !== 'undefined') {
      this.audio.playTrackById('distant_shore', false);
      this.playStoryCutscene(STORY_FINALE_CUTSCENE, () => this.openCreditsScreen());
      return;
    }

    document.getElementById('victoryScreen').style.display = 'flex';
  }

  handleGameOver() {
    this.screenTransition = null;
    this.setVeil(false);
    this.state = 'gameover';
    this.audio.stopMusic();
    this.audio.playSfx('hit');

    if (document.body) document.body.classList.remove('in-game');
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.classList.remove('active');
      touchBox.style.display = 'none';
    }

    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';

    if (this.score > this.highScore) {
      this.highScore = this.score;
      SafeStorage.setItem('su_highScore', this.highScore.toString());
    }

    if (this.gameMode === 'arcade') {
      this.showArcadeResultScreen('DEFEATED IN THE ARENA');
      return;
    }

    document.getElementById('goFinalScore').textContent = `${this.score}`;
    document.getElementById('goBubbled').textContent = `${this.bubbledGemsCount}`;
    document.getElementById('gameOverScreen').style.display = 'flex';
  }

  nextStage() {
    this.stageIndex++;
    if (this.stageIndex > this.maxStages) {
      this.showTitleScreen();
    } else {
      this.hideAllScreens();
      this.state = 'playing';
      this.initPlayerHeartPools();
      const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
      this.enemyManager.reset(this.stageIndex, diff, this.pickups);
      this.audio.playStageMusic(this.stageIndex, false);
      this.updateHUD();
      this.updateActionBar();
      this.startStageWave();
    }
  }

  render() {
    // Low-health boss: the whole arena trembles while it is about to break.
    const boss = this.enemyManager.enemies.find(en => en.isBoss && !en.isPoofed && !en.isImmortalDummy);
    let shakeX = 0;
    let shakeY = 0;
    const shakeAllowed = (this.screenShakeEnabled !== false);
    if (shakeAllowed) {
      if (this.hitShake && this.hitShake > 0) {
        shakeX += (Math.random() - 0.5) * this.hitShake * 2.1;
        shakeY += (Math.random() - 0.5) * this.hitShake * 2.1;
      }
      if (this.shakeDirX || this.shakeDirY) {
        shakeX += (this.shakeDirX || 0);
        shakeY += (this.shakeDirY || 0);
      }
      if (boss && boss.maxHp > 0 && boss.hp / boss.maxHp < 0.3) {
        const frac = Math.min(1, (1 - (boss.hp / boss.maxHp) / 0.3));
        const amp = 1.4 + 4.2 * frac;
        const t = Date.now() / 42;
        shakeX += Math.sin(t) * amp;
        shakeY += Math.cos(t * 1.7) * amp * 0.7;
      }
    }
    this.ctx.save();
    this.ctx.translate(shakeX, shakeY);

    // 1. Far Parallax Background (Screen Space)
    this.environment.drawBackground(this.ctx, this.stageIndex, this.cameraX, this.gameMode === 'practice');

    // 2. World Space Elements (Safe Clamped Zoom-In / Zoom-Out without edge bleed or ground drift)
    this.ctx.save();
    const z = Math.max(0.84, Math.min(1.18, this.cameraZoom || 1.0));
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const visW = cw / z;
    const visH = ch / z;
    const focusX = (typeof this.camFocusX === 'number' && !isNaN(this.camFocusX)) ? this.camFocusX : (this.cameraX + cw / 2);
    const focusY = (typeof this.camFocusY === 'number' && !isNaN(this.camFocusY)) ? this.camFocusY : (this.groundY - 68);
    const camLeft = Math.max(0, Math.min(Math.max(0, this.stageWidth - visW), focusX - visW / 2));
    const camTop = z < 1 ? (ch - visH) : Math.max(0, Math.min(ch - visH, focusY - visH * 0.58));
    this.ctx.scale(z, z);
    this.ctx.translate(-Math.round(camLeft), -Math.round(camTop));

    // Foreground Terrain & Platforms across full 2600px
    this.environment.drawForeground(this.ctx, this.stageIndex, this.gameMode === 'practice');

    // Boss gate arrow: tells the player where to walk, and never moves them there.
    if (this.isWaitingForBoss) this.drawBossGateArrow(this.ctx);

    // Pickups (Cookie Cats, Hearts)
    for (const p of this.pickups) {
      this.drawPickup(p);
    }

    // Enemies (Walkers, Jumpers, Flyers) & Bosses
    this.enemyManager.draw(this.ctx);

    // Projectiles
    for (const p of this.projectiles) {
      this.drawProjectile(p);
    }

    // Players
    this.player.draw(this.ctx);
    if (this.playerMode === '2p' && this.player2) {
      this.player2.draw(this.ctx);
    }

    // Particle System & Hit Numbers (culled to zoomed camera viewport for smooth FPS)
    this.particles.draw(this.ctx, camLeft - 240, camLeft + visW + 240);

    this.ctx.restore();
    this.ctx.restore(); // screen-shake transform

    // 3. Screen-Space Combat Clarity HUD (Boss Breakout Meter, Combat Badges, Practice Dojo Guide)
    if (this.state === 'playing') {
      this.drawCombatClarityOverlay(boss);
    }
  }

  drawCombatClarityOverlay(boss) {
    const ctx = this.ctx;
    const cw = this.canvas.width;
    ctx.save();

    // A. Boss 20% Combo-Breakout Warning Meter (surfaces hidden anti-stunlock mechanic clearly)
    if (boss && boss.maxHp > 0 && (boss.comboDamageTaken || 0) > 0) {
      const pct = Math.min(1, (boss.comboDamageTaken || 0) / (boss.maxHp * 0.20));
      const bw = 220;
      const bh = 8;
      const bx = Math.round((cw - bw) / 2);
      const by = 82;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
      ctx.fillStyle = pct >= 0.75 ? '#ef4444' : (pct >= 0.45 ? '#f59e0b' : '#38bdf8');
      ctx.fillRect(bx, by, Math.round(bw * pct), bh);
      ctx.font = "800 10px 'Nunito', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = pct >= 0.75 ? '#fecaca' : '#e2e8f0';
      ctx.fillText(pct >= 0.75 ? 'BOSS BREAKOUT IMMINENT!' : 'BOSS BREAKOUT GAUGE', cw / 2, by - 5);
    }

    // B. Crisp Tactical Combat Badge (GUARD SHATTER, ARMOR BREAK, DASH CANCEL, JUMP CANCEL)
    const activeBadge = (this.combatBadgeTimer > 0 && this.combatBadgeText)
      ? { text: this.combatBadgeText, color: this.combatBadgeColor, alpha: Math.min(1, this.combatBadgeTimer * 2.5) }
      : (this.player && this.player.lastCancelTimer > 0 && this.player.lastCancelTag)
        ? { text: this.player.lastCancelTag, color: '#38bdf8', alpha: Math.min(1, this.player.lastCancelTimer * 2.5) }
        : null;
    if (activeBadge) {
      ctx.globalAlpha = activeBadge.alpha;
      ctx.font = "900 13px 'Fredoka One', 'Nunito', sans-serif";
      const tw = ctx.measureText(activeBadge.text).width + 26;
      const bx = Math.round((cw - tw) / 2);
      const by = 104;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
      ctx.strokeStyle = activeBadge.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, by, tw, 24, 12);
      else ctx.rect(bx, by, tw, 24);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = activeBadge.color;
      ctx.fillText(activeBadge.text, cw / 2, by + 16);
      ctx.globalAlpha = 1;
    }

    // C. Practice Dojo Hidden-Mechanics Clarity Strip (live indicators when training)
    if (this.gameMode === 'practice' && this.player) {
      const p = this.player;
      const pills = [
        { label: 'PERFECT LINK +12%', active: !!p.lastPerfectLink && p.comboStepTimer > 0, color: '#fde047' },
        { label: 'CANCEL WINDOW', active: (p.hitConfirmTimer || 0) > 0, color: '#38bdf8' },
        { label: 'PARRY 140ms [I]', active: (p.parryWindow || 0) > 0, color: '#4ade80' },
        { label: 'GUARD BREAK: FINISHER / [K] / [L]', active: !!p.isFinisherSwing && p.isAttacking, color: '#f472b6' }
      ];
      ctx.font = "800 11px 'Nunito', sans-serif";
      let totalW = 0;
      const widths = pills.map(pl => {
        const w = ctx.measureText(pl.label).width + 18;
        totalW += w + 8;
        return w;
      });
      let px = Math.round((cw - totalW) / 2);
      const py = 136;
      pills.forEach((pl, idx) => {
        const w = widths[idx];
        ctx.fillStyle = pl.active ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.58)';
        ctx.strokeStyle = pl.active ? pl.color : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = pl.active ? 2 : 1;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px, py, w, 22, 11);
        else ctx.rect(px, py, w, 22);
        ctx.fill();
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillStyle = pl.active ? pl.color : '#cbd5e1';
        ctx.fillText(pl.label, px + w / 2, py + 15);
        px += w + 8;
      });
    }

    ctx.restore();
  }

  drawPickup(p) {
    const ctx = this.ctx;
    this.ctx.save();
    try {
      const bob = Math.sin(Date.now() / 150) * 4;
    if (p.type === 'cookie') {
      // Cookie Cat
      this.ctx.fillStyle = '#451a03';
      this.ctx.beginPath();
      this.ctx.arc(p.x - 4, p.y + bob, 12, Math.PI * 0.5, Math.PI * 1.5);
      this.ctx.fill();

      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.arc(p.x + 4, p.y + bob, 12, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.fill();

      this.ctx.fillStyle = '#451a03';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x - 12, p.y - 6 + bob);
      this.ctx.lineTo(p.x - 6, p.y - 18 + bob);
      this.ctx.lineTo(p.x, p.y - 8 + bob);
      this.ctx.fill();

      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y - 8 + bob);
      this.ctx.lineTo(p.x + 6, p.y - 18 + bob);
      this.ctx.lineTo(p.x + 12, p.y - 6 + bob);
      this.ctx.fill();
    } else if (p.type === 'heart') {
      // Spinel's Exact Heart Gemstone (Reference: Fighting Style/9c44aca4132b44c3a53f44b2fe6d15a9.jpeg)
      const hx = p.x, hy = p.y + bob;
      const s = 1.05;

      this.ctx.save();
      this.ctx.translate(hx, hy);
      this.ctx.scale(s, s);

      // 1. Dark Magenta Outer Bezel
      this.ctx.fillStyle = '#7a1340';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5);
      this.ctx.bezierCurveTo(-16, -10, -20, 8, 0, 22);
      this.ctx.bezierCurveTo(20, 8, 16, -10, 0, 5);
      this.ctx.fill();

      // 2. Individual Gemstone Facets Matching Canon Geometry
      // Center Triangular Shield Facet (#ff6eb6)
      this.ctx.fillStyle = '#ff6eb6';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5);
      this.ctx.lineTo(9, 7);
      this.ctx.lineTo(0, 19);
      this.ctx.lineTo(-9, 7);
      this.ctx.closePath();
      this.ctx.fill();

      // Upper Left Bright Specular Highlight Facet (#ffffff)
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5);
      this.ctx.lineTo(-9, 7);
      this.ctx.lineTo(-14, 0);
      this.ctx.lineTo(-6, -4);
      this.ctx.closePath();
      this.ctx.fill();

      // Upper Right Rose Facet (#ff52aa)
      this.ctx.fillStyle = '#ff52aa';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5);
      this.ctx.lineTo(6, -4);
      this.ctx.lineTo(14, 0);
      this.ctx.lineTo(9, 7);
      this.ctx.closePath();
      this.ctx.fill();

      // Top Left Cleft Facet (#ff80bf)
      this.ctx.fillStyle = '#ff80bf';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5);
      this.ctx.lineTo(-6, -4);
      this.ctx.lineTo(-1, -7);
      this.ctx.closePath();
      this.ctx.fill();

      // Top Right Cleft Facet (#e62b87)
      this.ctx.fillStyle = '#e62b87';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5);
      this.ctx.lineTo(1, -7);
      this.ctx.lineTo(6, -4);
      this.ctx.closePath();
      this.ctx.fill();

      // Lower Left Darker Facet (#d81e77)
      this.ctx.fillStyle = '#d81e77';
      this.ctx.beginPath();
      this.ctx.moveTo(-9, 7);
      this.ctx.lineTo(0, 19);
      this.ctx.lineTo(-11, 14);
      this.ctx.closePath();
      this.ctx.fill();

      // Lower Right Darker Facet (#b3135c)
      this.ctx.fillStyle = '#b3135c';
      this.ctx.beginPath();
      this.ctx.moveTo(9, 7);
      this.ctx.lineTo(11, 14);
      this.ctx.lineTo(0, 19);
      this.ctx.closePath();
      this.ctx.fill();

      // Crisp Facet Contour Stroke
      this.ctx.strokeStyle = '#7a1340';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 5); this.ctx.lineTo(9, 7); this.ctx.lineTo(0, 19); this.ctx.lineTo(-9, 7); this.ctx.closePath();
      this.ctx.stroke();

      // Ambient Shimmer Stars
      const sparkleRot = Date.now() / 300;
      this.ctx.fillStyle = '#ffffff';
      for (let sp = 0; sp < 3; sp++) {
        const sa = sparkleRot + sp * (Math.PI * 2 / 3);
        const sx = Math.cos(sa) * 18;
        const sy = 6 + Math.sin(sa) * 14;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
    } finally {
      this.ctx.restore();
    }
  }

  drawProjectile(p) {
    this.ctx.save();
    if (p.type === 'fusionRoseSwordWave') {
      // Stevonnie: Colossal 260px Crescent Sonic Sword Wave!
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      this.ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 90, -Math.PI * 0.45, Math.PI * 0.45);
      this.ctx.lineTo(20, 0);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'fusionHoverDropkick') {
      // Stevonnie: Shield Hover Dropkick Disc!
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = 'rgba(244, 114, 182, 0.9)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 32, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.strokeStyle = '#ec4899';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, (p.radius || 32) * 0.55, 0, Math.PI * 1.5);
      this.ctx.stroke();
    } else if (p.type === 'fusionYoYo') {
      // Smoky Quartz: String-Tethered Spinning Star Yo-Yos!
      if (typeof p.originX === 'number' && typeof p.originY === 'number') {
        this.ctx.strokeStyle = 'rgba(233, 213, 255, 0.85)';
        this.ctx.lineWidth = 2.4;
        this.ctx.beginPath();
        this.ctx.moveTo(p.originX, p.originY);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
      }
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 40 : Date.now() / 40);
      this.ctx.rotate(rot);
      this.ctx.fillStyle = '#a855f7';
      this.ctx.strokeStyle = '#f3e8ff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 30, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#fde047';
      const yr = (p.radius || 30) * 0.55;
      this.ctx.beginPath();
      for (let s = 0; s < 10; s++) {
        const a = (s * Math.PI) / 5 - Math.PI / 2;
        const rad = (s % 2 === 0) ? yr : yr * 0.44;
        if (s === 0) this.ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else this.ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'fusionCyclone') {
      // Smoky Quartz: Colossal Vacuum Cyclone!
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 35 : Date.now() / 35);
      this.ctx.rotate(rot);
      this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
      this.ctx.lineWidth = 4;
      for (let r = 20; r <= 80; r += 20) {
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r, r * 0.45, 0, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    } else if (p.type === 'fusionParasolRocket') {
      // Rainbow Quartz 2.0: Rocket Umbrella Float!
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.strokeStyle = '#f472b6';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 28, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'fusionPrismCannon') {
      // Rainbow Quartz 2.0: Titanic Prismatic Star-Laser / Umbrella Star Bolts (Character style.mp4!)
      this.ctx.translate(p.x, p.y);
      if (p.width && p.height) {
        const w = p.width || 330, h = p.height || 100;
        const beamGrad = this.ctx.createLinearGradient(0, -h/2, 0, h/2);
        beamGrad.addColorStop(0, '#f43f5e');
        beamGrad.addColorStop(0.25, '#fb923c');
        beamGrad.addColorStop(0.5, '#ffffff');
        beamGrad.addColorStop(0.75, '#38bdf8');
        beamGrad.addColorStop(1, '#a855f7');
        this.ctx.fillStyle = beamGrad;
        this.ctx.beginPath();
        if (this.ctx.roundRect) this.ctx.roundRect(-w/2, -h/2, w, h, h/2);
        else this.ctx.fillRect(-w/2, -h/2, w, h);
        this.ctx.fill();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        if (this.ctx.roundRect) this.ctx.roundRect(-w/2 + 8, -h*0.18, w - 16, h*0.36, h*0.18);
        this.ctx.fill();
      } else {
        // Spinning 5-point pastel rainbow star bolt!
        const r = p.radius || 18;
        const rot = (typeof performance !== 'undefined' ? performance.now() / 65 : Date.now() / 65);
        this.ctx.rotate(rot);
        this.ctx.fillStyle = p.color || '#f472b6';
        this.ctx.beginPath();
        for (let s = 0; s < 10; s++) {
          const a = (s * Math.PI) / 5 - Math.PI / 2;
          const rad = (s % 2 === 0) ? r * 1.1 : r * 0.48;
          if (s === 0) this.ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
          else this.ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (p.type === 'fusionSunGauntlet') {
      // Sunstone: Solar Rocket Punch!
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      this.ctx.fillStyle = '#ea580c';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 32, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#fde047';
      this.ctx.beginPath();
      this.ctx.arc(-5, -5, (p.radius || 32) * 0.55, 0, Math.PI * 2);
      this.ctx.fill();
      // Suction cup rim
      this.ctx.fillStyle = '#f97316';
      this.ctx.beginPath();
      if (this.ctx.roundRect) this.ctx.roundRect(8, -14, 12, 28, 4);
      else this.ctx.fillRect(8, -14, 12, 28);
      this.ctx.fill();
    } else if (p.type === 'fusionSupernova') {
      // Sunstone: Supernova Jagged Cel Fire Crown Crater Burst (Character style.mp4!)
      this.ctx.translate(p.x, p.y);
      const w = p.width || 340, h = p.height || 180;
      const sunGrad = this.ctx.createRadialGradient(0, 0, 12, 0, 0, w / 2);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.32, '#fde047');
      sunGrad.addColorStop(0.72, '#ea580c');
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, w / 2.2, 0, Math.PI * 2);
      this.ctx.fill();
      // Jagged cel comic fire-crown ring at base of crater
      this.ctx.fillStyle = '#ea580c';
      this.ctx.beginPath();
      for (let i = 0; i <= 14; i++) {
        const fx = -w * 0.44 + (i / 14) * w * 0.88;
        const fy = (i % 2 === 0) ? (h * 0.14) : (h * 0.36);
        if (i === 0) this.ctx.moveTo(fx, fy);
        else this.ctx.lineTo(fx, fy);
      }
      this.ctx.lineTo(w * 0.44, h * 0.44);
      this.ctx.lineTo(-w * 0.44, h * 0.44);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, h * 0.25, w * 0.44, 24, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, w * 0.35, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      for (let s = 0; s < 16; s++) {
        const a = (s * Math.PI) / 8;
        const r = (s % 2 === 0) ? w * 0.36 : w * 0.12;
        if (s === 0) this.ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else this.ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'fusionHammerDrill') {
      // Sardonyx: High-Speed Rotating Showbiz Hammer Drill + Golden Starburst Aura!
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 32 : Date.now() / 32);
      this.ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, (p.radius || 28) * 1.15, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.rotate(rot);
      this.ctx.fillStyle = '#e11d48';
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      if (this.ctx.roundRect) this.ctx.roundRect(-24, -15, 48, 30, 6);
      else this.ctx.rect(-24, -15, 48, 30);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#fde047';
      this.ctx.fillRect(-4, -15, 8, 30);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath(); this.ctx.arc(0, 0, 5, 0, Math.PI * 2); this.ctx.fill();
    } else if (p.type === 'fusionShowstopper') {
      // Sardonyx: Grand Theatrical Showstopper Dual Spotlights + Golden Starbursts!
      this.ctx.translate(p.x, p.y);
      const grad = this.ctx.createLinearGradient(0, -110, 0, 80);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.5, 'rgba(253, 224, 71, 0.52)');
      grad.addColorStop(1, 'rgba(251, 113, 133, 0.12)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(-14, -110); this.ctx.lineTo(-92, 76); this.ctx.lineTo(92, 76); this.ctx.lineTo(14, -110);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 72, 92, 16, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      // Twinkling stage stars
      this.ctx.fillStyle = '#ffffff';
      for (const [sx, sy, sr] of [[-46, -10, 7], [48, -22, 8], [0, 32, 10]]) {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy - sr); this.ctx.lineTo(sx + sr * 0.35, sy - sr * 0.35);
        this.ctx.lineTo(sx + sr, sy); this.ctx.lineTo(sx + sr * 0.35, sy + sr * 0.35);
        this.ctx.lineTo(sx, sy + sr); this.ctx.lineTo(sx - sr * 0.35, sy + sr * 0.35);
        this.ctx.lineTo(sx - sr, sy); this.ctx.lineTo(sx - sr * 0.35, sy - sr * 0.35);
        this.ctx.closePath();
        this.ctx.fill();
      }
    } else if (p.type === 'fusionOpalArrow' || p.type === 'fusionCelestialRain') {
      // Opal: Luminous Crystal Arrow with Fletching & Spear Tip
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1));
      const len = p.radius || 20;
      this.ctx.strokeStyle = '#67e8f9';
      this.ctx.lineWidth = 3.2;
      this.ctx.beginPath();
      this.ctx.moveTo(-len, 0);
      this.ctx.lineTo(len, 0);
      this.ctx.stroke();
      this.ctx.fillStyle = '#fde047';
      this.ctx.beginPath();
      this.ctx.moveTo(len + 6, 0);
      this.ctx.lineTo(len - 5, -5.5);
      this.ctx.lineTo(len - 5, 5.5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillStyle = '#c084fc';
      this.ctx.beginPath();
      this.ctx.moveTo(-len, 0);
      this.ctx.lineTo(-len - 6, -5);
      this.ctx.lineTo(-len + 2, 0);
      this.ctx.lineTo(-len - 6, 5);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'fusionGlacialFist') {
      // Malachite: Glacial Ice Spire Cataclysm (Reference: githubrepoanimation.mp4)
      this.ctx.translate(p.x, p.y);
      const spires = [-36, -18, 0, 20, 38];
      const hts = [85, 115, 130, 110, 80];
      for (let s = 0; s < spires.length; s++) {
        const sx = spires[s];
        const sh = hts[s];
        const iceGrad = this.ctx.createLinearGradient(sx, 0, sx, -sh);
        iceGrad.addColorStop(0, '#0f766e');
        iceGrad.addColorStop(0.35, '#2dd4bf');
        iceGrad.addColorStop(0.85, '#ccfbf1');
        iceGrad.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = iceGrad;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.4;
        this.ctx.beginPath();
        this.ctx.moveTo(sx - 12, 10);
        this.ctx.lineTo(sx - 3, -sh * 0.5);
        this.ctx.lineTo(sx, -sh);
        this.ctx.lineTo(sx + 3, -sh * 0.5);
        this.ctx.lineTo(sx + 12, 10);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
      // Shimmer sparkles
      this.ctx.fillStyle = '#ffffff';
      for (let k = 0; k < 5; k++) {
        const kx = spires[k];
        const ky = -hts[k] - 4;
        this.ctx.beginPath();
        this.ctx.arc(kx, ky, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (p.type === 'fusionTsunamiCage') {
      // Malachite: Abyssal Surging Tsunami Cage (Reference: githubrepoanimation.mp4)
      this.ctx.translate(p.x, p.y);
      const w = p.width || 320, h = p.height || 170;
      const t = Date.now() / 60;
      [-w/2 + 25, w/2 - 25].forEach((wx, idx) => {
        const dir = idx === 0 ? 1 : -1;
        const waveGrad = this.ctx.createLinearGradient(wx, h/2, wx, -h/2);
        waveGrad.addColorStop(0, '#0f766e');
        waveGrad.addColorStop(0.4, '#0284c7');
        waveGrad.addColorStop(0.85, '#38bdf8');
        waveGrad.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = waveGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(wx - 28 * dir, h/2);
        this.ctx.quadraticCurveTo(wx + 20 * dir, 0, wx + 12 * dir + Math.sin(t) * 8, -h/2);
        this.ctx.quadraticCurveTo(wx - 8 * dir, -h/2 + 30, wx - 18 * dir, h/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(wx + 12 * dir + Math.sin(t) * 8, -h/2 + 8, 14, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, h/2 - 12, w/2, 22, 0, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (p.type === 'fusionFlailCataclysm') {
      // Sugilite: Flail Cataclysm Tectonic Fissure Crater (Reference: githubrepoanimation.mp4)
      this.ctx.translate(p.x, p.y);
      const w = p.width || 300, h = p.height || 170;
      this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      if (this.ctx.ellipse) {
        this.ctx.ellipse(0, 0, w/2, h/2.4, 0, 0, Math.PI * 2);
        this.ctx.ellipse(0, 0, w/3, h/3.5, 0, 0, Math.PI * 2);
      }
      this.ctx.stroke();
      this.ctx.fillStyle = 'rgba(126, 34, 206, 0.45)';
      this.ctx.fill();
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 2.4;
      for (let a = 0; a < 6; a++) {
        const ang = (Math.PI * 2 / 6) * a;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(ang) * (w * 0.45), Math.sin(ang) * (h * 0.35));
        this.ctx.stroke();
      }
    } else if (p.type === 'fusionPrismRose') {
      // Rainbow Quartz Classic: Swirling 80s Neon-Prism Rose Vortex!
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 45 : Date.now() / 45);
      this.ctx.rotate(rot);
      const vGrad = this.ctx.createRadialGradient(0, 0, 8, 0, 0, 82);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      vGrad.addColorStop(0.35, 'rgba(244, 114, 182, 0.68)');
      vGrad.addColorStop(0.7, 'rgba(103, 232, 249, 0.48)');
      vGrad.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
      this.ctx.fillStyle = vGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 82, 0, Math.PI * 2);
      this.ctx.fill();
      const ringCols = ['#f472b6', '#fde047', '#38bdf8', '#c084fc'];
      for (let i = 0; i < 4; i++) {
        this.ctx.strokeStyle = ringCols[i];
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 26 + i * 14, i * 1.1, i * 1.1 + Math.PI * 1.35);
        this.ctx.stroke();
      }
    } else if (p.type === 'connieSwordBeam') {
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      this.ctx.fillStyle = 'rgba(244, 114, 182, 0.85)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 24, -Math.PI * 0.4, Math.PI * 0.4);
      this.ctx.lineTo(4, 0);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#fdf2f8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, (p.radius || 24) * 0.6, -Math.PI * 0.35, Math.PI * 0.35);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'connieShadowSlash') {
      this.ctx.translate(p.x, p.y);
      this.ctx.strokeStyle = '#f472b6';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(-35, -25);
      this.ctx.lineTo(35, 25);
      this.ctx.moveTo(-35, 25);
      this.ctx.lineTo(35, -25);
      this.ctx.stroke();
    } else if (p.type === 'jasperCrashHelmet') {
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      // Flame trail
      this.ctx.fillStyle = 'rgba(234, 88, 12, 0.65)';
      this.ctx.beginPath();
      this.ctx.moveTo(-p.radius, -12);
      this.ctx.lineTo(-p.radius - 24, 0);
      this.ctx.lineTo(-p.radius, 12);
      this.ctx.closePath();
      this.ctx.fill();
      // Bronze/Amber Helmet Dome
      this.ctx.fillStyle = '#b45309';
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 26, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Heavy Horn Spikes
      this.ctx.fillStyle = '#ea580c';
      this.ctx.beginPath();
      this.ctx.moveTo(p.radius * 0.5, -p.radius * 0.7);
      this.ctx.lineTo(p.radius * 1.3, -p.radius * 0.4);
      this.ctx.lineTo(p.radius * 0.7, 0);
      this.ctx.lineTo(p.radius * 1.3, p.radius * 0.4);
      this.ctx.lineTo(p.radius * 0.5, p.radius * 0.7);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'jasperSpinDashHit') {
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = 'rgba(234, 88, 12, 0.55)';
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 32, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'stevenShield') {
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 40);
      this.ctx.fillStyle = 'rgba(255, 96, 151, 0.9)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.strokeStyle = '#f43f5e';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 8, 0, Math.PI * 1.5);
      this.ctx.stroke();
    } else if (p.type === 'roseShield') {
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 35);
      this.ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 20, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#fbcfe8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 9, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (p.type === 'garnetGauntlet') {
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.moveTo(-p.radius, -8);
      this.ctx.lineTo(-p.radius - 16, 0);
      this.ctx.lineTo(-p.radius, 8);
      this.ctx.fill();

      this.ctx.fillStyle = '#e11d48';
      this.ctx.fillRect(-p.radius + 4, -p.radius / 2, p.radius * 1.2, p.radius);

      this.ctx.fillStyle = '#fbbf24';
      this.ctx.beginPath();
      this.ctx.moveTo(p.radius * 0.8, -6);
      this.ctx.lineTo(p.radius * 1.4, 0);
      this.ctx.lineTo(p.radius * 0.8, 6);
      this.ctx.fill();
    } else if (p.type === 'bismuthAnvil') {
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 80);
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(-18, -10, 36, 20);
      this.ctx.fillStyle = '#f97316';
      this.ctx.fillRect(-12, -6, 24, 12);
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(-18, -10, 36, 20);
    } else if (p.type === 'metalGirder') {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 90);
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillRect(-18, -8, 36, 16);
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(-18, -8, 36, 16);
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.fillRect(-14, -4, 28, 8);
      this.ctx.restore();
    } else if (p.type === 'scrapGear') {
      // Peridot Levitated Iron Cog / Gear
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 60);
      this.ctx.fillStyle = '#475569';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Gear teeth
      const ctx = this.ctx;
      ctx.fillStyle = '#64748b';
      for (let t = 0; t < 6; t++) {
        const ga = (Math.PI / 3) * t;
        ctx.fillRect(Math.cos(ga) * 16 - 3, Math.sin(ga) * 16 - 3, 6, 6);
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'trashLid') {
      // Peridot Corrugated Metal Trash Can Lid (Show-Accurate!)
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 50);
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 20, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#cbd5e1';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // Center Handle
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(-6, -3, 12, 6);
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(-6, -3, 12, 6);
      this.ctx.restore();
    } else if (p.type === 'flaskRobonoid') {
      this.ctx.fillStyle = '#84cc16';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y - 12, p.radius || 18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.beginPath();
      this.ctx.arc(p.x + 4, p.y - 14, 5, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (p.type === 'hydroFist') {
      const dir = (p.vx >= 0 ? 1 : -1);
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(dir, 1);
      // Giant Translucent Surging Hydro Fist
      this.ctx.fillStyle = 'rgba(14, 165, 233, 0.88)';
      this.ctx.strokeStyle = '#e0f2fe';
      this.ctx.lineWidth = 2.5;
      // Palm / Wrist
      this.ctx.beginPath();
      if (this.ctx.roundRect) this.ctx.roundRect(-24, -16, 26, 32, 6);
      else this.ctx.rect(-24, -16, 26, 32);
      this.ctx.fill();
      this.ctx.stroke();
      // Clenched Knuckles
      this.ctx.beginPath();
      this.ctx.arc(10, -10, 10, 0, Math.PI * 2);
      this.ctx.arc(14, 0, 11, 0, Math.PI * 2);
      this.ctx.arc(10, 10, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      // Swirling Water Trail
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
      this.ctx.beginPath();
      this.ctx.moveTo(-24, -12);
      this.ctx.lineTo(-48, 0);
      this.ctx.lineTo(-24, 12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'tidalWave') {
      const dir = (p.facing || (p.vx >= 0 ? 1 : -1));
      const time = Date.now();
      const waveHeight = p.height || 145;
      const waveWidth = p.width || 95;
      const groundLevel = (typeof p.y === 'number') ? (p.y + 65) : (this.groundY || 520);

      this.ctx.save();
      this.ctx.translate(p.x, groundLevel);
      this.ctx.scale(dir, 1);

      // 1. Deep Ocean Base Surge (Layer 1)
      const curl = Math.sin(time / 70) * 8;
      this.ctx.fillStyle = 'rgba(2, 132, 199, 0.9)';
      this.ctx.beginPath();
      this.ctx.moveTo(-waveWidth * 0.5, 0);
      this.ctx.quadraticCurveTo(-waveWidth * 0.2, -waveHeight * 0.55, waveWidth * 0.3 + curl, -waveHeight);
      this.ctx.quadraticCurveTo(waveWidth * 0.6 + curl, -waveHeight * 0.8, waveWidth * 0.5, 0);
      this.ctx.closePath();
      this.ctx.fill();

      // 2. Luminous Cerulean Inner Wave (Layer 2)
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.78)';
      this.ctx.beginPath();
      this.ctx.moveTo(-waveWidth * 0.4, 0);
      this.ctx.quadraticCurveTo(-waveWidth * 0.1, -waveHeight * 0.5, waveWidth * 0.22 + curl, -waveHeight * 0.92);
      this.ctx.quadraticCurveTo(waveWidth * 0.45 + curl, -waveHeight * 0.75, waveWidth * 0.35, 0);
      this.ctx.closePath();
      this.ctx.fill();

      // 3. Frothing White Wave Lip & Curling Crest
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#e0f2fe';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(waveWidth * 0.32 + curl, -waveHeight + 8, 16, 0, Math.PI * 2);
      this.ctx.arc(waveWidth * 0.18 + curl, -waveHeight + 14, 13, 0, Math.PI * 2);
      this.ctx.arc(waveWidth * 0.46 + curl, -waveHeight + 20, 14, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // 4. Flying Sea Spray & Water Beads
      this.ctx.fillStyle = '#bae6fd';
      for (let s = 0; s < 6; s++) {
        const sa = (time / 90) + s * 1.1;
        const sx = waveWidth * 0.35 + Math.cos(sa) * (20 + s * 3);
        const sy = -waveHeight + 12 + Math.sin(sa) * (14 + s * 2);
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 5. Surging Foam Tide on Ground
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      this.ctx.fillRect(-waveWidth * 0.6, -8, waveWidth * 1.2, 8);
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.fillRect(-waveWidth * 0.4, -14, waveWidth * 0.9, 5);

      this.ctx.restore();
    } else if (p.type === 'pearlLaser') {
      const dir = (p.vx >= 0 ? 1 : -1);
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(dir, 1);
      // Blazing Cyan Spear Laser Beam with Energy Rings
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.fillRect(-28, -5, 56, 10);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(-20, -2.5, 46, 5);
      // Front piercing needle tip
      this.ctx.fillStyle = '#67e8f9';
      this.ctx.beginPath();
      this.ctx.moveTo(28, -7);
      this.ctx.lineTo(40, 0);
      this.ctx.lineTo(28, 7);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'holoPearl') {
      const dir = (p.facing || (p.vx >= 0 ? 1 : -1));
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(dir, 1);
      // --- SHOW-ACCURATE HOLO-PEARL TRAINING CLONE ("Steven the Sword Fighter") ---
      // Full-sized sky-blue translucent sparring clone of Pearl in a classic fencing lunge!
      const holoAlpha = 0.78 + Math.sin(Date.now() / 45) * 0.12;
      const holoBody = p.isOverdrive ? `rgba(244, 114, 182, ${holoAlpha})` : `rgba(56, 189, 248, ${holoAlpha})`;
      const holoOutline = p.isOverdrive ? '#f472b6' : '#67e8f9';
      const holoStar = p.isOverdrive ? '#ffffff' : '#e0f2fe';

      this.ctx.fillStyle = holoBody;
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 1.8;

      // 1. Deep Fencing Lunge Stance: Legs & Ballet Flats
      // Back leg extended straight behind (-X)
      this.ctx.beginPath();
      this.ctx.moveTo(-4, -12);
      this.ctx.lineTo(-24, 24);
      this.ctx.lineTo(-20, 24);
      this.ctx.lineTo(-1, -12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Back ballet slipper
      this.ctx.fillRect(-28, 22, 9, 4);

      // Front leg bent forward in dynamic lunge (+X)
      this.ctx.beginPath();
      this.ctx.moveTo(4, -12);
      this.ctx.lineTo(14, 8);
      this.ctx.lineTo(12, 24);
      this.ctx.lineTo(7, 24);
      this.ctx.lineTo(9, 8);
      this.ctx.lineTo(0, -12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Front ballet slipper
      this.ctx.fillRect(7, 22, 11, 4);

      // 2. Slender Fencing Tunic & Sash
      this.ctx.beginPath();
      this.ctx.moveTo(-8, -44);
      this.ctx.lineTo(10, -44);
      this.ctx.lineTo(12, -14);
      this.ctx.lineTo(-10, -14);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Bold 5-Pointed Star on tunic
      this.ctx.fillStyle = holoStar;
      this.ctx.beginPath();
      const stX = 1, stY = -30, stR = 5.5;
      for (let s = 0; s < 5; s++) {
        const a = (Math.PI * 2 / 5) * s - Math.PI / 2;
        const x1 = stX + Math.cos(a) * stR;
        const y1 = stY + Math.sin(a) * stR;
        if (s === 0) this.ctx.moveTo(x1, y1); else this.ctx.lineTo(x1, y1);
        const aMid = a + Math.PI / 5;
        this.ctx.lineTo(stX + Math.cos(aMid) * (stR * 0.45), stY + Math.sin(aMid) * (stR * 0.45));
      }
      this.ctx.closePath();
      this.ctx.fill();

      // Floating Chiffon Sash trailing behind (-X)
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 2.2;
      this.ctx.beginPath();
      this.ctx.moveTo(-10, -18);
      this.ctx.quadraticCurveTo(-22, -12, -26, 0);
      this.ctx.stroke();

      // 3. Slender Neck & Head with Conical Hair Point pointing BACK (-X)
      this.ctx.fillStyle = holoBody;
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 1.8;
      // Neck
      this.ctx.fillRect(-2, -52, 5, 8);
      // Head
      this.ctx.beginPath();
      this.ctx.ellipse(0, -60, 11, 12, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Conical Pixie Hair Point sweeping cleanly BACKWARD (-X)
      this.ctx.beginPath();
      this.ctx.moveTo(2, -70);
      this.ctx.quadraticCurveTo(-8, -72, -22, -62);
      this.ctx.quadraticCurveTo(-11, -54, -4, -53);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Sharp Pointed Nose pointing cleanly FORWARD (+X)
      this.ctx.beginPath();
      this.ctx.moveTo(6, -60);
      this.ctx.lineTo(15, -57);
      this.ctx.lineTo(6, -55);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Forehead Luminous Pearl Gem with glowing lens flare!
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#e0f2fe';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.ellipse(2, -67, 3.5, 5.5, 0.15, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Robotic / Fencing Hologram Anime Eye
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.ellipse(4, -59, 3.2, 4.2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = holoOutline;
      this.ctx.beginPath();
      this.ctx.arc(4.5, -59, 1.8, 0, Math.PI * 2);
      this.ctx.fill();

      // 4. Horizontal Holographic Scanline Interference Stripes
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.lineWidth = 1.2;
      for (let y = -68; y <= 22; y += 6) {
        this.ctx.beginPath();
        this.ctx.moveTo(-22, y);
        this.ctx.lineTo(24, y);
        this.ctx.stroke();
      }

      // 5. GLOWING SILVER-CYAN FENCING RAPIER (Real weapon size: Bell Guard + Long Blade!)
      this.ctx.save();
      this.ctx.translate(12, -26); // Extended fencing hand

      // Cup / Bell Guard
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 6.5, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Long, piercing rapier blade thrusting straight forward (+X)
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.4;
      this.ctx.beginPath();
      this.ctx.moveTo(6, 0);
      this.ctx.lineTo(52, 0); // 46px long rapier blade!
      this.ctx.stroke();

      // Piercing needle tip & energy sparks
      this.ctx.fillStyle = '#67e8f9';
      this.ctx.beginPath();
      this.ctx.moveTo(52, 0);
      this.ctx.lineTo(46, -2);
      this.ctx.lineTo(46, 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();

      this.ctx.restore();
    } else if (p.type === 'purpleGeyser') {
      // Amethyst Violet Crystalline Energy Geyser (Spectacular Rising Volcanic Pillar!)
      const progress = 1 - Math.max(0, p.life / (p.maxLife || 0.60));
      // Rapid upward explosion (0-0.3), peak vibration (0.3-0.7), dissipating fade (0.7-1.0)
      let surgeH;
      if (progress < 0.28) {
        surgeH = (progress / 0.28) * 135;
      } else if (progress < 0.72) {
        surgeH = 135 + Math.sin(Date.now() / 30) * 8;
      } else {
        surgeH = Math.max(0, ((1 - progress) / 0.28) * 135);
      }

      const surgeW = 60;
      const gx = p.x;
      const gy = (typeof p.y === 'number' ? p.y : (this.groundY - 60)) + (p.height || 120) * 0.5; // Bottom flush with slam elevation

      this.ctx.save();
      // 1. Violet Ground Rupture Glow & Fissure Cracks
      this.ctx.fillStyle = 'rgba(168, 85, 247, 0.55)';
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(gx, gy, 46, 14, 0, 0, Math.PI * 2);
      else this.ctx.arc(gx, gy, 36, 0, Math.PI * 2);
      this.ctx.fill();

      // Ground crack lines
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(gx - 32, gy);
      this.ctx.lineTo(gx - 12, gy + 4);
      this.ctx.lineTo(gx + 14, gy - 2);
      this.ctx.lineTo(gx + 34, gy + 3);
      this.ctx.stroke();

      // 2. Exploding Crystalline Energy Column
      const grad = this.ctx.createLinearGradient(gx, gy, gx, gy - surgeH);
      grad.addColorStop(0, '#3b0764');
      grad.addColorStop(0.3, '#7e22ce');
      grad.addColorStop(0.7, '#c084fc');
      grad.addColorStop(1, '#f5d0fe');
      this.ctx.fillStyle = grad;

      this.ctx.beginPath();
      this.ctx.moveTo(gx - surgeW * 0.5, gy);
      this.ctx.lineTo(gx - surgeW * 0.38, gy - surgeH * 0.5);
      this.ctx.lineTo(gx - surgeW * 0.48, gy - surgeH * 0.72);
      this.ctx.lineTo(gx, gy - surgeH); // Sharp crystal peak
      this.ctx.lineTo(gx + surgeW * 0.48, gy - surgeH * 0.72);
      this.ctx.lineTo(gx + surgeW * 0.38, gy - surgeH * 0.5);
      this.ctx.lineTo(gx + surgeW * 0.5, gy);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // Inner Core Glow
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.beginPath();
      this.ctx.moveTo(gx - 10, gy);
      this.ctx.lineTo(gx, gy - surgeH * 0.85);
      this.ctx.lineTo(gx + 10, gy);
      this.ctx.closePath();
      this.ctx.fill();

      // 3. Twin Crackling Lightning Zig-Zags
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(gx - 8, gy - 12);
      this.ctx.lineTo(gx + 14, gy - surgeH * 0.35);
      this.ctx.lineTo(gx - 12, gy - surgeH * 0.65);
      this.ctx.lineTo(gx + 6, gy - surgeH * 0.95);
      this.ctx.stroke();

      this.ctx.strokeStyle = '#e9d5ff';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(gx + 8, gy - 8);
      this.ctx.lineTo(gx - 10, gy - surgeH * 0.4);
      this.ctx.lineTo(gx + 12, gy - surgeH * 0.7);
      this.ctx.stroke();

      // 4. Glowing Quartz Star at peak
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(gx, gy - surgeH, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#fde047';
      this.ctx.beginPath();
      this.ctx.arc(gx, gy - surgeH, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'moltenShockwave') {
      const fissureW = p.width || 220;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = 'rgba(234, 88, 12, 0.55)';
      this.ctx.fillRect(-fissureW / 2, -10, fissureW, 20);
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.fillRect(-fissureW / 2 + 10, -5, fissureW - 20, 10);
      this.ctx.fillStyle = '#f97316';
      for (let s = -fissureW / 2 + 15; s <= fissureW / 2 - 15; s += 25) {
        const spikeHeight = 18 + Math.sin(s * 0.2 + Date.now() * 0.015) * 12;
        this.ctx.beginPath();
        this.ctx.moveTo(s - 10, 5);
        this.ctx.lineTo(s, -spikeHeight);
        this.ctx.lineTo(s + 10, 5);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();
    } else if (p.type === 'roseShockwave') {
      const mandalaR = (p.width || 190) / 2;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 200);
      this.ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, mandalaR * 0.9, 0, Math.PI * 2);
      this.ctx.stroke();

      const petals = 8;
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        this.ctx.save();
        this.ctx.rotate(angle);
        this.ctx.fillStyle = 'rgba(251, 207, 232, 0.65)';
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        if (this.ctx.ellipse) this.ctx.ellipse(mandalaR * 0.5, 0, mandalaR * 0.38, mandalaR * 0.18, 0, 0, Math.PI * 2);
        else this.ctx.arc(mandalaR * 0.5, 0, mandalaR * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      }
      this.ctx.restore();
    } else if (p.type === 'magneticVortex') {
      const radius = (p.width || 220) / 2;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      const rot = Date.now() / 95;
      const g = this.ctx.createRadialGradient(0, 0, 6, 0, 0, radius);
      g.addColorStop(0, 'rgba(217, 249, 157, 0.55)');
      g.addColorStop(0.55, 'rgba(132, 204, 22, 0.28)');
      g.addColorStop(1, 'rgba(132, 204, 22, 0)');
      this.ctx.fillStyle = g;
      this.ctx.beginPath(); this.ctx.arc(0, 0, radius, 0, Math.PI * 2); this.ctx.fill();
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath(); this.ctx.arc(0, 0, radius * 0.85, rot, rot + Math.PI * 1.65); this.ctx.stroke();
      this.ctx.strokeStyle = '#ecfccb';
      this.ctx.lineWidth = 2.4;
      this.ctx.beginPath(); this.ctx.arc(0, 0, radius * 0.52, -rot * 1.4, -rot * 1.4 + Math.PI * 1.45); this.ctx.stroke();
      this.ctx.restore();
    } else if (p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam') {
      const w = p.width || 220;
      this.ctx.save();
      this.ctx.translate(p.x, p.y + 8);
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w / 2, 22, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, 45, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.strokeStyle = '#ef4444';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w / 3, 14, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.fillStyle = '#fde047';
      for (let s = -w / 2.5; s <= w / 2.5; s += 24) {
        const sh = 16 + Math.abs(Math.sin(s * 0.1)) * 14;
        this.ctx.beginPath();
        this.ctx.moveTo(s - 5, 0);
        this.ctx.lineTo(s, -sh);
        this.ctx.lineTo(s + 5, 0);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();
    } else if (p.type === 'bubbleShockwave') {
      const w = p.width || 140;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      const bg = this.ctx.createRadialGradient(0, 0, 6, 0, 0, w * 0.55);
      bg.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      bg.addColorStop(0.55, 'rgba(255, 96, 151, 0.34)');
      bg.addColorStop(1, 'rgba(244, 63, 94, 0.05)');
      this.ctx.fillStyle = bg;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w / 2, 34, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, 42, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ff94ba';
      this.ctx.lineWidth = 3.4;
      this.ctx.stroke();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.6;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w * 0.34, 22, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    } else if (p.type === 'enemyAcid') {
      // Upgraded Corrupted Acid Glob: Glowing Toxic Comet + Bubbling Neon Core!
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1));
      const r = p.radius || 10;
      this.ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, -r * 0.85);
      this.ctx.lineTo(-r * 2.8, 0);
      this.ctx.lineTo(0, r * 0.85);
      this.ctx.closePath();
      this.ctx.fill();
      const ag = this.ctx.createRadialGradient(r * 0.2, -r * 0.2, 1, 0, 0, r * 1.15);
      ag.addColorStop(0, '#dcfce7');
      ag.addColorStop(0.5, '#4ade80');
      ag.addColorStop(1, p.color || '#15803d');
      this.ctx.fillStyle = ag;
      this.ctx.strokeStyle = '#bbf7d0';
      this.ctx.lineWidth = 1.6;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, r * 1.15, r * 0.9, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#dcfce7';
      this.ctx.beginPath();
      this.ctx.arc(-r * 1.4, -r * 0.4, r * 0.25, 0, Math.PI * 2);
      this.ctx.arc(-r * 1.9, r * 0.35, r * 0.2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'enemyIce') {
      // Upgraded Glacial Lance: Faceted Crystalline Icicle Spear + Frost Mist Trail!
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1));
      const r = p.radius || 11;
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      this.ctx.beginPath();
      this.ctx.moveTo(r * 1.6, 0);
      this.ctx.lineTo(-r * 2.2, -r * 0.75);
      this.ctx.lineTo(-r * 1.6, 0);
      this.ctx.lineTo(-r * 2.2, r * 0.75);
      this.ctx.closePath();
      this.ctx.fill();
      const ig = this.ctx.createLinearGradient(-r * 1.4, 0, r * 1.8, 0);
      ig.addColorStop(0, '#0284c7');
      ig.addColorStop(0.55, '#7dd3fc');
      ig.addColorStop(1, '#ffffff');
      this.ctx.fillStyle = ig;
      this.ctx.strokeStyle = '#e0f2fe';
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(r * 1.9, 0);
      this.ctx.lineTo(0, -r * 0.72);
      this.ctx.lineTo(-r * 1.4, 0);
      this.ctx.lineTo(0, r * 0.72);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    } else if (p.type === 'enemyShard') {
      // Upgraded Razor Crystal / Feather / Molten Cinder Shard with Spinning Facets & Motion Trail!
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1));
      const r = p.radius || 11;
      const col = p.color || '#f43f5e';
      this.ctx.fillStyle = col;
      this.ctx.globalAlpha = 0.38;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -r * 0.7);
      this.ctx.lineTo(-r * 2.8, 0);
      this.ctx.lineTo(0, r * 0.7);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = col;
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(r * 1.65, 0);
      this.ctx.lineTo(r * 0.15, -r * 0.8);
      this.ctx.lineTo(-r * 1.1, 0);
      this.ctx.lineTo(r * 0.15, r * 0.8);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.moveTo(r * 1.2, 0);
      this.ctx.lineTo(0, -r * 0.3);
      this.ctx.lineTo(-r * 0.4, 0);
      this.ctx.lineTo(0, r * 0.3);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'enemyLaser') {
      // Upgraded Homeworld / White Diamond High-Intensity Plasma Judgement Beam!
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Math.atan2(p.vy || 0, p.vx || 1));
      const r = p.radius || 12;
      const col = p.color || '#38bdf8';
      const isWhite = (col === '#ffffff' || col === '#f8fafc');
      const len = r * 3.4;
      this.ctx.fillStyle = isWhite ? 'rgba(226, 232, 240, 0.55)' : col;
      this.ctx.globalAlpha = isWhite ? 0.8 : 0.45;
      this.ctx.beginPath();
      if (this.ctx.roundRect) this.ctx.roundRect(-len * 0.6, -r * 0.9, len * 1.2, r * 1.8, r * 0.9);
      else this.ctx.rect(-len * 0.6, -r * 0.9, len * 1.2, r * 1.8);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      if (this.ctx.roundRect) this.ctx.roundRect(-len * 0.48, -r * 0.42, len * 1.04, r * 0.84, r * 0.42);
      else this.ctx.rect(-len * 0.48, -r * 0.42, len * 1.04, r * 0.84);
      this.ctx.fill();
      this.ctx.strokeStyle = isWhite ? '#ffffff' : col;
      this.ctx.lineWidth = 2.2;
      this.ctx.beginPath();
      this.ctx.ellipse(len * 0.25, 0, r * 0.38, r * 1.15, 0, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    } else if (p.type === 'enemyShockwave') {
      // Upgraded Boss Seismic / Elemental Ground Shockwave Surge!
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      const dir = (p.vx < 0 ? -1 : 1);
      this.ctx.scale(dir, 1);
      const col = p.color || '#f97316';
      const w = p.width || ((p.radius || 28) * 2.8);
      const h = p.height || ((p.radius || 28) * 1.4);
      this.ctx.fillStyle = col;
      this.ctx.globalAlpha = 0.42;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, h * 0.25, w * 0.52, h * 0.32, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, w * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = col;
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.4;
      this.ctx.beginPath();
      this.ctx.moveTo(-w * 0.48, h * 0.35);
      this.ctx.lineTo(-w * 0.22, -h * 0.35);
      this.ctx.lineTo(-w * 0.04, h * 0.02);
      this.ctx.lineTo(w * 0.16, -h * 0.65);
      this.ctx.lineTo(w * 0.32, -h * 0.18);
      this.ctx.lineTo(w * 0.48, h * 0.35);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    } else {
      const r = p.radius || 12;
      const g = this.ctx.createRadialGradient(p.x - r * 0.25, p.y - r * 0.25, 1, p.x, p.y, r * 1.2);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.45, p.color || '#ffcf33');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.fillStyle = g;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r * 1.2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.6;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r * 0.72, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  updateHUD() {
    if (!this._domHud && typeof document !== 'undefined') {
      this._domHud = {
        heartsContainer: document.getElementById('hudHearts'),
        nameEl: document.getElementById('hudCharacterName'),
        avatarEl: document.getElementById('hudAvatarIcon'),
        odLabel: document.getElementById('overdriveLabel'),
        fill: document.getElementById('harmonyBarFill'),
        pct: document.getElementById('harmonyPercent'),
        btnOverdrive: document.getElementById('btnOverdrive'),
        btnText: document.getElementById('btnOverdriveText'),
        touchOd: document.getElementById('touchOverdrive'),
        nameP2: document.getElementById('hudCharacterNameP2'),
        avatarP2: document.getElementById('hudAvatarIconP2'),
        heartsContainerP2: document.getElementById('hudHeartsP2'),
        odLabelP2: document.getElementById('overdriveLabelP2'),
        fillP2: document.getElementById('harmonyBarFillP2'),
        pctP2: document.getElementById('harmonyPercentP2'),
        btnOverdriveP2: document.getElementById('btnOverdriveP2'),
        btnTextP2: document.getElementById('btnOverdriveTextP2'),
        p2Panel: document.getElementById('hudP2Panel'),
        scoreEl: document.getElementById('hudScore'),
        bubbledEl: document.getElementById('hudBubbledGems')
      };
    }
    const d = this._domHud || {};

    // 1. Player 1 Hearts (HP & Defense scaled Spinel Gems)
    this.renderSpinelHearts(d.heartsContainer, false);

    // Player 1 Character Info & Character-Specific Overdrive
    const charData = GUARDIAN_DATA[this.player.activeChar] || GUARDIAN_DATA.steven;
    const nameEl = d.nameEl;
    if (nameEl && nameEl.textContent !== charData.name) nameEl.textContent = charData.name;
    const avatarEl = d.avatarEl;
    if (avatarEl && avatarEl.dataset.char !== this.player.activeChar) {
      avatarEl.dataset.char = this.player.activeChar;
      avatarEl.innerHTML = (typeof getGuardianSvg === 'function')
        ? getGuardianSvg(this.player.activeChar, 44)
        : charData.icon;
    }

    const baseOdTheme = OVERDRIVE_THEMES[this.player.activeChar] || OVERDRIVE_THEMES.steven;
    const isFusedHud = !!(this.isFused && this.player.isFusion && this.player.fusionData);
    const odTheme = isFusedHud
      ? {
          name: `${(this.player.fusionData.name || 'FUSION').toUpperCase()} SURGE`,
          short: 'FUSION SURGE',
          color: this.player.fusionData.color || baseOdTheme.color
        }
      : baseOdTheme;
    const odLabel = d.odLabel;
    if (odLabel && odLabel.textContent !== odTheme.name) odLabel.textContent = odTheme.name;

    const fill = d.fill;
    const pct = d.pct;
    const btnOverdrive = d.btnOverdrive;
    const btnText = d.btnText;
    const touchOd = d.touchOd;

    const hc = this._hudCache || (this._hudCache = {});

    if (this.isOverdriveActive) {
      const remainingPct = Math.max(0, (this.overdriveTimer / this.overdriveDuration) * 100);
      const fillW = `${remainingPct.toFixed(1)}%`;
      const secLeft = Math.ceil(this.overdriveTimer);
      const pctTxt = `${secLeft}s ACTIVE!`;
      const btnCls = 'btn-overdrive-hud active';
      const btnTxt = `${odTheme.short} ACTIVE (${secLeft}s)`;
      if (fill && hc.p1W !== fillW) { fill.style.width = fillW; hc.p1W = fillW; }
      if (pct && hc.p1Pct !== pctTxt) { pct.textContent = pctTxt; hc.p1Pct = pctTxt; }
      if (btnOverdrive) {
        if (hc.p1Cls !== btnCls) { btnOverdrive.className = btnCls; hc.p1Cls = btnCls; }
        if (btnText && hc.p1Txt !== btnTxt) { btnText.textContent = btnTxt; hc.p1Txt = btnTxt; }
      }
      if (touchOd && hc.p1Touch !== true) { touchOd.classList.add('ready'); hc.p1Touch = true; }
    } else {
      const fillW = `${this.starPowerMeter.toFixed(1)}%`;
      const pctTxt = `${Math.floor(this.starPowerMeter)}%`;
      const isReady = this.starPowerMeter >= 100 || this.gameMode === 'practice';
      const btnCls = `btn-overdrive-hud ${isReady ? 'ready' : 'disabled'}`;
      const btnTxt = isReady ? `${odTheme.short} READY! [${this.playerMode === '2p' ? 'R' : 'U'}]` : odTheme.name;
      if (fill && hc.p1W !== fillW) { fill.style.width = fillW; hc.p1W = fillW; }
      if (pct && hc.p1Pct !== pctTxt) { pct.textContent = pctTxt; hc.p1Pct = pctTxt; }
      if (btnOverdrive) {
        if (hc.p1Cls !== btnCls) { btnOverdrive.className = btnCls; hc.p1Cls = btnCls; }
        if (btnText && hc.p1Txt !== btnTxt) { btnText.textContent = btnTxt; hc.p1Txt = btnTxt; }
      }
      if (touchOd && hc.p1Touch !== isReady) {
        if (isReady) touchOd.classList.add('ready');
        else touchOd.classList.remove('ready');
        hc.p1Touch = isReady;
      }
    }

    // 2. Player 2 HUD Panel (Active in 2P Co-Op Mode)
    if (this.playerMode === '2p' && this.player2) {
      const charDataP2 = GUARDIAN_DATA[this.player2.activeChar] || GUARDIAN_DATA.garnet;
      const nameP2 = d.nameP2;
      if (nameP2 && nameP2.textContent !== `${charDataP2.name} (P2)`) nameP2.textContent = `${charDataP2.name} (P2)`;
      const avatarP2 = d.avatarP2;
      if (avatarP2 && avatarP2.dataset.char !== this.player2.activeChar) {
        avatarP2.dataset.char = this.player2.activeChar;
        avatarP2.innerHTML = (typeof getGuardianSvg === 'function')
          ? getGuardianSvg(this.player2.activeChar, 44)
          : charDataP2.icon;
      }

      this.renderSpinelHearts(d.heartsContainerP2, true);

      const odThemeP2 = OVERDRIVE_THEMES[this.player2.activeChar] || OVERDRIVE_THEMES.garnet;
      const odLabelP2 = d.odLabelP2;
      if (odLabelP2 && odLabelP2.textContent !== odThemeP2.name) odLabelP2.textContent = odThemeP2.name;

      const fillP2 = d.fillP2;
      const pctP2 = d.pctP2;
      const btnOverdriveP2 = d.btnOverdriveP2;
      const btnTextP2 = d.btnTextP2;

      if (this.isOverdriveActiveP2) {
        const remainingPct = Math.max(0, (this.overdriveTimerP2 / this.overdriveDuration) * 100);
        const fillW = `${remainingPct.toFixed(1)}%`;
        const secLeft = Math.ceil(this.overdriveTimerP2);
        const pctTxt = `${secLeft}s ACTIVE!`;
        const btnCls = 'btn-overdrive-hud active';
        const btnTxt = `${odThemeP2.short} ACTIVE (${secLeft}s)`;
        if (fillP2 && hc.p2W !== fillW) { fillP2.style.width = fillW; hc.p2W = fillW; }
        if (pctP2 && hc.p2Pct !== pctTxt) { pctP2.textContent = pctTxt; hc.p2Pct = pctTxt; }
        if (btnOverdriveP2) {
          if (hc.p2Cls !== btnCls) { btnOverdriveP2.className = btnCls; hc.p2Cls = btnCls; }
          if (btnTextP2 && hc.p2Txt !== btnTxt) { btnTextP2.textContent = btnTxt; hc.p2Txt = btnTxt; }
        }
      } else {
        const curP2 = this.starPowerMeterP2 || 0;
        const fillW = `${curP2.toFixed(1)}%`;
        const pctTxt = `${Math.floor(curP2)}%`;
        const isReadyP2 = curP2 >= 100 || this.gameMode === 'practice';
        const btnCls = `btn-overdrive-hud ${isReadyP2 ? 'ready' : 'disabled'}`;
        const btnTxt = isReadyP2 ? `${odThemeP2.short} READY! [O]` : odThemeP2.name;
        if (fillP2 && hc.p2W !== fillW) { fillP2.style.width = fillW; hc.p2W = fillW; }
        if (pctP2 && hc.p2Pct !== pctTxt) { pctP2.textContent = pctTxt; hc.p2Pct = pctTxt; }
        if (btnOverdriveP2) {
          if (hc.p2Cls !== btnCls) { btnOverdriveP2.className = btnCls; hc.p2Cls = btnCls; }
          if (btnTextP2 && hc.p2Txt !== btnTxt) { btnTextP2.textContent = btnTxt; hc.p2Txt = btnTxt; }
        }
      }
    }

    const p2Panel = d.p2Panel;
    if (p2Panel) {
      p2Panel.style.display = (this.playerMode === '2p' && this.player2) ? 'flex' : 'none';
    }

    const scoreEl = d.scoreEl;
    const curScore = `${this.score}`;
    if (scoreEl && scoreEl.textContent !== curScore) scoreEl.textContent = curScore;
    const bubbledEl = d.bubbledEl;
    const curBubbled = `${this.bubbledGemsCount}`;
    if (bubbledEl && bubbledEl.textContent !== curBubbled) bubbledEl.textContent = curBubbled;

    this.updateFusionHUD();
  }

  // ==========================================================
  // CANONICAL GEM FUSION CONTROLLER
  // ==========================================================
  addFusionSync(amount) {
    if (this.isFused || this.isHyperAttack) return;
    // Cap cleanly at 100% to prevent overdrive runaway
    this.fusionEnergy = Math.min(100, (this.fusionEnergy || 0) + amount);
    this.updateFusionHUD();
  }

  triggerFusion() {
    if (this.playerMode !== '2p' || !this.player2) {
      return;
    }

    if (this.isHyperAttack || this.isFused) {
      return;
    }

    if (this.player.isFallen || this.player2.isFallen) {
      this.audio.playSfx('hit');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚠️ CANNOT FUSE: PARTNER IS DOWN!', true, '#ef4444');
      return;
    }

    const fusion = getCanonFusion(this.player.activeChar, this.player2.activeChar);

    if (!fusion) {
      this.audio.playSfx('hit');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚠️ NO CANON FUSION FOR THIS PAIR!', true, '#ef4444');
      return;
    }

    if (this.fusionEnergy < 100 && this.gameMode !== 'practice') {
      this.audio.playSfx('hit');
      this.particles.addDamageText(this.player.x, this.player.y - 70, `NEED 100% SYNC (${Math.floor(this.fusionEnergy)}%)`, true, '#f59e0b');
      return;
    }

    // Pair-specific fusion identity (Extended to match 12s Overdrive duration!)
    const power = FUSION_POWER[fusion.id] || { nuke: 1.0, duration: 12.0, heal: 1, title: 'GEM FUSION' };

    this.startCutin({
      kicker: 'GEM FUSION',
      kickerColor: fusion.color || '#f472b6',
      portraitId: (fusion.gems && fusion.gems[0]) || fusion.id,
      secondPortraitId: (fusion.gems && fusion.gems[1]) || null,
      centerPortraitId: fusion.id,
      icon: fusion.icon || '💎',
      name: fusion.name.toUpperCase(),
      quote: `${fusion.weapon} · ${power.title} · ${Math.round(power.duration)} SECONDS`,
      side: 'left',
      duration: 1.0,
      freeze: 0
    });
    const overcharge = Math.max(0, (this.fusionEnergy || 0) - 100);
    const duration = power.duration + Math.min(2.5, overcharge * 0.08);
    this.activeFusionNukeMult = power.nuke * (1 + Math.min(0.3, overcharge * 0.008));
    this.activeFusionHeal = power.heal;
    this.hyperAttackDuration = duration;

    // ACTIVATE TAG-TEAM HYPER FUSION ATTACK (pair-tuned cinematic screen nuke!)
    if (this.audio) this.audio.duckMusic(0.70, 2.0);
    this.isFused = true;
    this.isHyperAttack = true;
    this.fusionPlayable = false;
    this.hyperAttackTimer = duration;
    this.hyperAttackFired = false;
    this.fusionTimer = duration;
    this.fusionEnergy = (this.gameMode === 'practice') ? 100 : 0;

    this.player.isFusion = true;
    this.player.fusionKey = fusion.id;
    this.player.fusionData = fusion;
    const fusedOdRemaining = Math.max(
      this.isOverdriveActive ? (this.overdriveTimer || 0) : 0,
      this.isOverdriveActiveP2 ? (this.overdriveTimerP2 || 0) : 0
    );
    if (fusedOdRemaining > 0) {
      this.player.activatePinkOverdrive(fusedOdRemaining);
      this.player.dualOverdrive = !!(this.isOverdriveActive && this.isOverdriveActiveP2);
    } else {
      this.player.dualOverdrive = false;
    }
    this.player.invulnerableTimer = duration + 0.5;
    this.player.actionType = 'skill';
    this.player.actionDuration = 1.3;
    this.player.actionTimer = 1.3;

    const targetX = (this.playerMode === '2p' && this.player2) ? (this.player.x + this.player2.x) / 2 : this.player.x;
    this.triggerCameraZoom(0.12, 0.60, targetX, this.groundY - 75);
    this.player.x = targetX;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.vy = 0;

    if (this.playerMode === '2p' && this.player2) {
      this.player2.x = targetX;
      this.player2.y = this.groundY;
      this.player2.vx = 0;
      this.player2.vy = 0;
      this.player2.invulnerableTimer = duration + 0.5;
      this.player2.isMergedInFusion = true;
    }

    this.audio.playSfx('fusion');
    this.audio.playSfx('overdrive');
    this.audio.playSfx('stageClear');
    this.particles.addPoof(targetX, this.groundY - 45, fusion.color || '#ec4899');
    this.particles.addSparkle(targetX, this.groundY - 45, '#ffffff', 40, 10);
    this.particles.addSparkle(targetX, this.groundY - 45, fusion.glowColor || '#ffd700', 40, 10);
    this.particles.addDamageText(targetX, this.groundY - 100, `✨ TAG FUSION: ${fusion.name.toUpperCase()}! ✨`, true, fusion.color || '#ec4899');
    this.particles.addDamageText(targetX, this.groundY - 75, fusion.quote || 'WE ARE AN EXPERIENCE!', false, '#fde047');
    if (overcharge >= 5) {
      this.particles.addDamageText(targetX, this.groundY - 125, `⚡ PERFECT SYNC! +${Math.min(30, Math.round(overcharge * 0.8))}% POWER ⚡`, true, '#fde047');
    }

    this.updateFusionHUD();
    this.updateActionBar();
  }

  unfuseGems() {
    this.finishTagTeamHyperAttack();
  }

  executePlayer2FusionAction(slot) {
    if (!this.isFused || !this.player || !this.player.isFusion || !this.player.fusionData) return;
    const fid = this.player.fusionData.id;
    const coop = COOP_FUSION_MOVES[fid];
    const odP1 = !!this.isOverdriveActive;
    const odP2 = !!this.isOverdriveActiveP2;
    const dmgMult = (odP1 && odP2) ? 2.5 : ((odP2 || odP1 || this.player.isPinkOverdrive) ? 2.0 : 1.0);
    const cdScale = (odP2 || (odP1 && odP2)) ? 0.5 : 1.0;

    if (slot === 'j') {
      this.player2AttackCooldown = 0.22 * cdScale;
      this.triggerSlotAnimation('slotP2_J');
      this.player.facing = this.player.facing || 1;
      if (typeof this.player.executeAttackJ === 'function') {
        this.player.executeAttackJ(this.audio, this.particles, this.projectiles);
      }
      const moveName = coop?.p2?.j?.name || this.player.comboMoveName || 'Synergy Strike';
      this.particles.addDamageText(this.player.x, this.player.y - 82, `${moveName}!`, false, this.player.fusionData.color || '#ec4899');
    } else if (slot === 'k') {
      this.player2SpecialCooldown = 0.85 * cdScale;
      this.triggerSlotAnimation('slotP2_K');
      if (typeof this.player.executeFusionSkillL === 'function') {
        this.player.executeFusionSkillL(this.audio, this.particles, this.pickups, this.projectiles, dmgMult);
      }
    } else if (slot === 'l') {
      this.player2SkillCooldown = 3.5 * cdScale;
      this.triggerSlotAnimation('slotP2_L');
      this.audio.playSfx('overdrive');
      this.executeHyperAttackBlast(this.player.fusionData);
      const moveName = coop?.p2?.l?.name || 'Harmony Surge';
      this.particles.addDamageText(this.player.x, this.player.y - 110, `🌟 ${moveName}! 🌟`, true, '#fde047');
    }
  }

  updateHyperAttack(dt, platforms) {
    this.hyperAttackTimer -= dt;
    this.fusionTimer = Math.max(0, this.hyperAttackTimer);

    if (this.player2) {
      this.player2.x = this.player.x;
      this.player2.y = this.player.y;
      this.player2.isMergedInFusion = true;
    }

    // Phase 2: Unleash Colossal Screen Nuke early in the fusion intro
    if (this.hyperAttackTimer <= (this.hyperAttackDuration - 0.6) && !this.hyperAttackFired) {
      this.hyperAttackFired = true;
      this.executeHyperAttackBlast(this.player.fusionData);

      // Pair-based heal: Malachite is a forced fusion and grants none
      const fusionHeal = this.activeFusionHeal || 0;
      if (fusionHeal > 0) {
        this.healPlayerHearts(false, fusionHeal);
        if (this.player2) {
          this.healPlayerHearts(true, fusionHeal);
        }
        this.updateHUD();
        this.particles.addDamageText(this.player.x, this.player.y - 120, `💖 +${fusionHeal} HEART HEALED TO BOTH GEMS! 💖`, false, '#ff4081');
      } else {
        this.particles.addDamageText(this.player.x, this.player.y - 120, '🌊 UNSTABLE FUSION: NO HEAL, PURE POWER!', false, '#2dd4bf');
      }
    }

    // Once the cinematic has had its moment, hand control back to the players while
    // the fusion is still standing: from here the pair drives ONE body with the fused
    // shared kit (J/K/L blend both partners' skills).
    // Now with extended 12s fusion, players get ~10.7+ seconds of active playable fusion!
    if (!this.fusionPlayable && this.hyperAttackTimer <= (this.hyperAttackDuration - 1.3)) {
      this.fusionPlayable = true;
      this.isHyperAttack = false;
      this.fusionTimer = Math.max(10.0, this.hyperAttackTimer);
      this.hyperAttackTimer = 0;
      this.player.actionType = null;
      this.player.actionTimer = 0;
      this.particles.addDamageText(this.player.x, this.player.y - 150, '💎 SHARED KIT UNLOCKED — PLAY AS THE FUSION!', true, '#f472b6');
      this.audio.playSfx('powerup');
      this.updateFusionHUD();
      return;
    }

    // At T <= 0: Complete Tag-Team Hyper Attack and cleanly return to heroes!
    if (this.hyperAttackTimer <= 0) {
      this.finishTagTeamHyperAttack();
      return;
    }

    this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer, 0.5);
    if (this.player2) this.player2.invulnerableTimer = Math.max(this.player2.invulnerableTimer, 0.5);

    this.updateFusionHUD();
  }

  executeHyperAttackBlast(fusion) {
    if (!fusion) return;
    const fid = fusion.id;
    const odP1 = !!this.isOverdriveActive;
    const odP2 = !!this.isOverdriveActiveP2;
    const dmgMult = (odP1 && odP2) ? 2.5 : ((odP1 || odP2 || this.player.isPinkOverdrive) ? 2.0 : 1.0);
    const blastStartIndex = this.projectiles.length;

    this.audio.playSfx('overdrive');
    this.audio.playSfx('stageClear');

    if (fid === 'stevonnie') {
      this.audio.playSfx('sword');
      this.audio.playSfx('shield');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 45,
          vx: dir * 680,
          vy: 0,
          width: 260,
          height: 160,
          damage: Math.round(300 * dmgMult),
          type: 'hyperRoseSwordWave',
          color: '#ec4899',
          life: 1.2
        });
      }
      this.particles.addRosePetals(this.player.x, this.player.y - 45, 30);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '⚔️ SHIELD HOVER & ROSE SWORD WAVE! (300 DMG)', true, '#ec4899');
    } else if (fid === 'smoky') {
      this.audio.playSfx('whip');
      this.audio.playSfx('spindash');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 50,
          vx: dir * 640,
          vy: 0,
          width: 280,
          height: 180,
          damage: Math.round(320 * dmgMult),
          type: 'hyperYoYoCyclone',
          color: '#a855f7',
          life: 1.2
        });
      }
      this.particles.addSparkle(this.player.x, this.player.y - 45, '#c084fc', 35, 10);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🌪️ SUPERSONIC YO-YO CYCLONE! (320 DMG)', true, '#a855f7');
    } else if (fid === 'rainbow2') {
      this.audio.playSfx('laser');
      this.audio.playSfx('whoosh');
      for (let i = -6; i <= 6; i++) {
        this.projectiles.push({
          x: this.player.x + i * 30,
          y: this.player.y - 50,
          vx: i * 80 + Math.sign(i || 1) * 450,
          vy: -80 + Math.abs(i) * 15,
          radius: 20,
          damage: Math.round(75 * dmgMult),
          type: 'hyperPrismaticLaser',
          color: '#38bdf8',
          life: 1.3
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '☂️ PRISMATIC PARASOL BARRAGE! (300 DMG)', true, '#38bdf8');
    } else if (fid === 'sunstone') {
      this.audio.playSfx('rocket');
      this.audio.playSfx('punch');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 45,
          y: this.player.y - 45,
          vx: dir * 660,
          vy: 0,
          radius: 40,
          damage: Math.round(340 * dmgMult),
          type: 'hyperSunGauntlet',
          color: '#f97316',
          life: 1.2
        });
      }
      this.particles.addSparkle(this.player.x, this.player.y - 45, '#fde047', 40, 10);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '☀️ SOLAR CATACLYSM PUNCH! (340 DMG)', true, '#f97316');
    } else if (fid === 'sugilite') {
      this.audio.playSfx('hammer');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.groundY - 30,
          vx: dir * 600,
          vy: 0,
          width: 300,
          height: 140,
          damage: Math.round(360 * dmgMult),
          type: 'hyperSeismicFlail',
          color: '#7e22ce',
          life: 1.2
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🟣 TITANIC WRECKING FLAIL SLAM! (360 DMG)', true, '#7e22ce');
    } else if (fid === 'sardonyx') {
      this.audio.playSfx('hammer');
      this.audio.playSfx('whoosh');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 45,
          vx: dir * 640,
          vy: 0,
          radius: 42,
          damage: Math.round(340 * dmgMult),
          type: 'hyperWarHammerDrill',
          color: '#fb7185',
          life: 1.2
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🔨 COLOSSAL WAR HAMMER DRILL! (340 DMG)', true, '#fb7185');
    } else if (fid === 'opal') {
      this.audio.playSfx('laser');
      for (let k = 0; k < 18; k++) {
        setTimeout(() => {
          this.projectiles.push({
            x: 80 + Math.random() * (this.stageWidth - 160),
            y: 40,
            vx: (Math.random() - 0.5) * 60,
            vy: 680,
            radius: 16,
            damage: Math.round(75 * dmgMult),
            type: 'hyperOpalLightArrow',
            color: '#818cf8',
            life: 1.1
          });
        }, k * 45);
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🏹 CELESTIAL LIGHT ARROW RAIN! (330 DMG)', true, '#818cf8');
    } else if (fid === 'malachite') {
      this.audio.playSfx('water');
      this.audio.playSfx('hammer');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 80,
          y: this.groundY - 60,
          vx: dir * 540,
          vy: 0,
          width: 280,
          height: 180,
          damage: Math.round(350 * dmgMult),
          type: 'hyperGlacialFist',
          color: '#2dd4bf',
          life: 1.2
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🧊 GLACIAL ICE CATACLYSM! (350 DMG)', true, '#0d9488');
    } else if (fid === 'rainbowClassic') {
      this.audio.playSfx('sword');
      this.audio.playSfx('shield');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 45,
          vx: dir * 650,
          vy: 0,
          width: 250,
          height: 150,
          damage: Math.round(320 * dmgMult),
          type: 'hyperRoseMandala',
          color: '#f43f5e',
          life: 1.2
        });
      }
      this.particles.addRosePetals(this.player.x, this.player.y - 45, 30);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🌹 CELESTIAL ROSE MANDALA! (320 DMG)', true, '#f43f5e');
    }

    // Apply the pair's nuke multiplier to every wave spawned by this fusion
    const nukeMult = this.activeFusionNukeMult || 1.0;
    if (nukeMult !== 1.0) {
      for (let i = blastStartIndex; i < this.projectiles.length; i++) {
        const proj = this.projectiles[i];
        if (proj && typeof proj.damage === 'number') {
          proj.damage = Math.round(proj.damage * nukeMult);
        }
      }
    }
  }

  finishTagTeamHyperAttack() {
    this.isFused = false;
    this.isHyperAttack = false;
    this.fusionPlayable = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    this.fusionTimer = 0;

    this.player.isFusion = false;
    this.player.fusionKey = null;
    this.player.fusionData = null;
    this.player.dualOverdrive = false;
    this.player.actionType = null;
    this.player.actionTimer = 0;
    if (this.isOverdriveActive && this.overdriveTimer > 0) {
      this.player.isPinkOverdrive = true;
      this.player.pinkOverdriveTimer = this.overdriveTimer;
    } else {
      this.player.deactivatePinkOverdrive();
    }

    if (this.playerMode === '2p' && this.player2) {
      this.player2.isFusion = false;
      this.player2.fusionKey = null;
      this.player2.fusionData = null;
      this.player2.isMergedInFusion = false;
      this.player2.actionType = null;
      this.player2.actionTimer = 0;
      if (this.isOverdriveActiveP2 && this.overdriveTimerP2 > 0) {
        this.player2.isPinkOverdrive = true;
        this.player2.pinkOverdriveTimer = this.overdriveTimerP2;
      } else {
        this.player2.deactivatePinkOverdrive();
      }

      // Graceful side-by-side landing
      this.player.x = Math.max(60, this.player.x - 70);
      this.player.y = this.groundY;
      this.player.vx = 0;
      this.player2.x = Math.min(this.stageWidth - 60, this.player.x + 140);
      this.player2.y = this.groundY;
      this.player2.vx = 0;

      // Grant 8s Harmony Synergy Buff (+25% power & speed!)
      this.synergyBuffTimer = 8.0;
      this.player.hasSynergyBuff = true;
      this.player2.hasSynergyBuff = true;
      this.audio.playSfx('cookie');
      this.particles.addPoof(this.player.x, this.player.y - 30, '#ff94ba');
      this.particles.addPoof(this.player2.x, this.player2.y - 30, '#c084fc');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚡ GEM HARMONY SYNERGY BUFF! ⚡', true, '#ffd700');
      this.particles.addDamageText(this.player2.x, this.player2.y - 70, '⚡ +25% SPEED & ATTACK! ⚡', false, '#38bdf8');
    } else {
      this.synergyBuffTimer = 8.0;
      this.player.hasSynergyBuff = true;
      this.audio.playSfx('cookie');
      this.particles.addPoof(this.player.x, this.player.y - 30, '#ff94ba');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚡ FUSION POWER UNLEASHED! ⚡', true, '#ffd700');
    }

    this.updateHUD();
    this.updateActionBar();
    this.updateFusionHUD();
  }

  updateFusionHUD() {
    if (!this._domFusion && typeof document !== 'undefined') {
      this._domFusion = {
        container: document.getElementById('hudFusionContainer'),
        iconEl: document.getElementById('hudFusionIcon'),
        labelEl: document.getElementById('hudFusionLabel'),
        pctEl: document.getElementById('hudFusionPct'),
        fillEl: document.getElementById('hudFusionFill'),
        btnEl: document.getElementById('btnFuseHud'),
        btnText: document.getElementById('btnFuseText'),
        btnElP2: document.getElementById('btnFuseHudP2'),
        btnTextP2: document.getElementById('btnFuseTextP2'),
        touchFuse: document.getElementById('touchFuse'),
        touchLbl: document.getElementById('touchLblFuse')
      };
    }
    const d = this._domFusion || {};
    const container = d.container;
    const iconEl = d.iconEl;
    const labelEl = d.labelEl;
    const pctEl = d.pctEl;
    const fillEl = d.fillEl;
    const btnEl = d.btnEl;
    const btnText = d.btnText;
    const btnElP2 = d.btnElP2;
    const btnTextP2 = d.btnTextP2;
    const touchFuse = d.touchFuse;
    const touchLbl = d.touchLbl;

    // Strict Rule: Fusion is exclusively a 2-Player feature and must be hidden in 1-Player mode!
    if (this.playerMode !== '2p') {
      if (container) container.style.display = 'none';
      if (btnEl) btnEl.style.display = 'none';
      if (btnElP2) btnElP2.style.display = 'none';
      if (touchFuse) touchFuse.style.display = 'none';
      this.isFused = false;
      this.isHyperAttack = false;
      if (this.player && this.player.isFusion) {
        this.player.isFusion = false;
        this.player.fusionKey = null;
        this.player.fusionData = null;
        this.player.isMergedInFusion = false;
        this.player.switchCharacter(this.selectedCharP1);
      }
      return;
    }

    if (btnEl) btnEl.style.display = 'inline-flex';
    if (btnElP2) btnElP2.style.display = 'inline-flex';
    if (touchFuse) touchFuse.style.display = this.isRealMobile ? 'flex' : 'none';

    let fusion = null;
    let canFuse = false;
    let isIndependent = false;

    if (this.player2) {
      fusion = getCanonFusion(this.player.activeChar, this.player2.activeChar);
      canFuse = !!fusion;
      isIndependent = !canFuse;
    }

    if (this.isHyperAttack || this.isFused) {
      if (container) container.style.display = 'flex';
      const timerVal = this.isHyperAttack
        ? Math.max(0, this.hyperAttackTimer || 0)
        : Math.max(0, this.fusionTimer || 0);
      const remainingPct = Math.max(0, (timerVal / (this.hyperAttackDuration || 12.0)) * 100);
      if (fillEl) {
        fillEl.style.width = `${remainingPct}%`;
        fillEl.style.background = 'linear-gradient(90deg, #ec4899, #a855f7, #38bdf8, #fbbf24)';
      }
      if (iconEl) iconEl.textContent = this.player.fusionData?.icon || '💎';
      if (labelEl) labelEl.textContent = `HYPER: ${this.player.fusionData?.name || 'FUSION'}`.toUpperCase();
      if (pctEl) pctEl.textContent = `${Math.ceil(timerVal)}s`;

      if (btnEl) {
        btnEl.className = 'btn-fuse-hud fused';
        if (btnText) btnText.textContent = `HYPER FUSION! (${Math.ceil(timerVal)}s)`;
      }
      if (btnElP2) {
        btnElP2.className = 'btn-fuse-hud fused';
        if (btnTextP2) btnTextP2.textContent = `HYPER FUSION! (${Math.ceil(timerVal)}s)`;
      }
      if (touchFuse) {
        touchFuse.classList.add('ready');
        if (touchLbl) touchLbl.textContent = 'HYPER!';
      }
    } else if (isIndependent) {
      if (fillEl) {
        fillEl.style.width = '0%';
        fillEl.style.background = '#64748b';
      }
      if (iconEl) iconEl.textContent = '⚠️';
      if (labelEl) labelEl.textContent = 'NO CANON FUSION';
      if (pctEl) pctEl.textContent = '—';
      if (btnEl) {
        btnEl.className = 'btn-fuse-hud disabled';
        if (btnText) btnText.textContent = 'INDEPENDENT GEMS';
        btnEl.title = 'No canonical Steven Universe show fusion exists for this gem pair.';
      }
      if (btnElP2) {
        btnElP2.className = 'btn-fuse-hud disabled';
        if (btnTextP2) btnTextP2.textContent = 'INDEPENDENT GEMS';
        btnElP2.title = 'No canonical Steven Universe show fusion exists for this gem pair.';
      }
      if (touchFuse) {
        touchFuse.classList.remove('ready');
        if (touchLbl) touchLbl.textContent = 'NO FUSION';
      }
    } else {
      const isReady = this.fusionEnergy >= 100 || this.gameMode === 'practice';
      const displayPct = Math.min(100, Math.floor(this.fusionEnergy));

      if (fillEl) {
        fillEl.style.width = `${isReady ? 100 : displayPct}%`;
        fillEl.style.background = isReady
          ? 'linear-gradient(90deg, #ff1493, #a855f7, #06b6d4, #f59e0b)'
          : 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)';
      }
      if (iconEl) iconEl.textContent = fusion.icon || '💎';
      if (labelEl) labelEl.textContent = `SYNC: ${fusion.name.toUpperCase()}`;
      if (pctEl) pctEl.textContent = isReady ? '100% READY!' : `${displayPct}%`;

      if (btnEl) {
        btnEl.className = `btn-fuse-hud ${isReady ? 'ready' : 'disabled'}`;
        if (btnText) {
          btnText.textContent = isReady
            ? `TAG FUSE! [${this.playerMode === '2p' ? 'V' : 'F'}]`
            : `TAG FUSE (${displayPct}%)`;
        }
        btnEl.title = isReady
          ? `Unleash Tag-Team Hyper Fusion Attack with ${fusion.name}!`
          : `Gather sync energy by landing combos, poofing gems, and collecting bubbles.`;
      }
      if (btnElP2) {
        btnElP2.className = `btn-fuse-hud ${isReady ? 'ready' : 'disabled'}`;
        if (btnTextP2) {
          btnTextP2.textContent = isReady
            ? `TAG FUSE! [V]`
            : `TAG FUSE (${displayPct}%)`;
        }
        btnElP2.title = isReady
          ? `Unleash Tag-Team Hyper Fusion Attack with ${fusion.name}!`
          : `Gather sync energy by landing combos, poofing gems, and collecting bubbles.`;
      }
      if (touchFuse) {
        if (isReady) touchFuse.classList.add('ready');
        else touchFuse.classList.remove('ready');
        const touchLbl = document.getElementById('touchLblFuse');
        if (touchLbl) touchLbl.textContent = isReady ? 'TAG FUSE!' : `${displayPct}%`;
      }
    }
  }

  // Paint the gem-type of each hotbar move (J / K / L) with its matchup colour.
  syncMoveTypeChips() {
    const paint = (owner, ids) => {
      ['j', 'k', 'l'].forEach((slot, idx) => {
        const el = document.getElementById(ids[idx]);
        if (!el) return;
        const typeEl = el.querySelector('.action-type');
        if (!owner) {
          if (typeEl) { typeEl.textContent = ['ATTACK', 'SPECIAL', 'SKILL'][idx]; typeEl.style.color = ''; }
          return;
        }
        const type = owner.getMoveType(slot);
        const meta = getTypeMeta(type);
        if (typeEl) {
          typeEl.textContent = `${meta.icon} ${meta.label}`;
          typeEl.style.color = meta.color;
        }
        const stab = owner.getStabMultiplier(slot) > 1 ? ' (STAB +20%)' : '';
        el.title = `${meta.label} move${stab}`;
      });
    };
    paint(this.player, ['slotJ', 'slotK', 'slotL']);
    paint(this.playerMode === '2p' ? this.player2 : null, ['slotP2_J', 'slotP2_K', 'slotP2_L']);
  }

  updateActionBar() {
    this.syncMoveTypeChips();
    const active = this.player.activeChar;
    const isHyper = (this.isHyperAttack || this.isFused) && this.player.fusionData;
    const current = isHyper ? this.player.fusionData : (GUARDIAN_DATA[active] || GUARDIAN_DATA.steven);

    const actionBars = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    const barP1 = document.getElementById('actionBarP1');
    const barP2 = document.getElementById('actionBarP2');
    const barNameP1 = document.getElementById('barNameP1');
    const barNameP2 = document.getElementById('barNameP2');

    if (actionBars) {
      const inCombatState = (this.state === 'playing' || this.state === 'paused' || this.state === 'arcade_wait');
      actionBars.style.display = (this.isRealMobile || !inCombatState) ? 'none' : 'flex';
    }

    if (this.playerMode === '2p' && this.player2) {
      if (actionBars) actionBars.classList.remove('mode-1p');
      if (barP1) barP1.style.display = 'flex';
      if (barP2) barP2.style.display = 'flex';

      // Badges: P1 has F, G, H, E
      const badgeJ = document.getElementById('badgeJ');
      const badgeK = document.getElementById('badgeK');
      const badgeL = document.getElementById('badgeL');
      const badgeI = document.getElementById('badgeI');
      if (badgeJ) badgeJ.textContent = 'F';
      if (badgeK) badgeK.textContent = 'G';
      if (badgeL) badgeL.textContent = 'H';
      if (badgeI) badgeI.textContent = 'E';

      // Badges: P2 has J, K, L, I
      const badgeP2_J = document.getElementById('badgeP2_J');
      const badgeP2_K = document.getElementById('badgeP2_K');
      const badgeP2_L = document.getElementById('badgeP2_L');
      const badgeP2_I = document.getElementById('badgeP2_I');
      if (badgeP2_J) badgeP2_J.textContent = 'J';
      if (badgeP2_K) badgeP2_K.textContent = 'K';
      if (badgeP2_L) badgeP2_L.textContent = 'L';
      if (badgeP2_I) badgeP2_I.textContent = 'I';

      if (isHyper) {
        const fid = this.player.fusionData.id;
        const coop = COOP_FUSION_MOVES[fid] || {
          p1: { j: { icon: '💥', name: 'Primary Strike' }, k: { icon: '✨', name: 'Fusion Special' }, l: { icon: '🌟', name: 'Screen Nuke' }, i: { icon: '🛡️', name: 'Invulnerable' } },
          p2: { j: { icon: '🥊', name: 'Synergy Strike' }, k: { icon: '💫', name: 'Fusion Burst' }, l: { icon: '🌟', name: 'Screen Nuke' }, i: { icon: '🛡️', name: 'Invulnerable' } }
        };

        if (barNameP1) barNameP1.textContent = `TAG HYPER: ${this.player.fusionData.name}`.toUpperCase();
        if (barNameP2) barNameP2.textContent = `TAG HYPER: ${this.player.fusionData.name}`.toUpperCase();

        // P1 Slots
        const iconJ = document.getElementById('iconJ');
        const nameJ = document.getElementById('nameJ');
        const iconK = document.getElementById('iconK');
        const nameK = document.getElementById('nameK');
        const iconL = document.getElementById('iconL');
        const nameL = document.getElementById('nameL');
        const iconI = document.getElementById('iconI');
        const nameI = document.getElementById('nameI');
        if (iconJ) iconJ.textContent = coop.p1.j.icon;
        if (nameJ) nameJ.textContent = coop.p1.j.name;
        if (iconK) iconK.textContent = coop.p1.k.icon;
        if (nameK) nameK.textContent = coop.p1.k.name;
        if (iconL) iconL.textContent = coop.p1.l.icon;
        if (nameL) nameL.textContent = coop.p1.l.name;
        if (iconI) iconI.textContent = coop.p1.i?.icon || '💨';
        if (nameI) nameI.textContent = coop.p1.i?.name || 'Flash Step';

        // P2 Slots
        const iconP2_J = document.getElementById('iconP2_J');
        const nameP2_J = document.getElementById('nameP2_J');
        const iconP2_K = document.getElementById('iconP2_K');
        const nameP2_K = document.getElementById('nameP2_K');
        const iconP2_L = document.getElementById('iconP2_L');
        const nameP2_L = document.getElementById('nameP2_L');
        const iconP2_I = document.getElementById('iconP2_I');
        const nameP2_I = document.getElementById('nameP2_I');
        if (iconP2_J) iconP2_J.textContent = coop.p2.j.icon;
        if (nameP2_J) nameP2_J.textContent = coop.p2.j.name;
        if (iconP2_K) iconP2_K.textContent = coop.p2.k.icon;
        if (nameP2_K) nameP2_K.textContent = coop.p2.k.name;
        if (iconP2_L) iconP2_L.textContent = coop.p2.l.icon;
        if (nameP2_L) nameP2_L.textContent = coop.p2.l.name;
        if (iconP2_I) iconP2_I.textContent = coop.p2.i?.icon || '💨';
        if (nameP2_I) nameP2_I.textContent = coop.p2.i?.name || 'Flash Step';
      } else {
        // Unfused 2-Player Mode: P1 on left bar, P2 on right bar
        const d1 = GUARDIAN_DATA[this.player.activeChar] || GUARDIAN_DATA.steven;
        const d2 = GUARDIAN_DATA[this.player2.activeChar] || GUARDIAN_DATA.garnet;

        if (barNameP1) barNameP1.textContent = d1.name.toUpperCase();
        if (barNameP2) barNameP2.textContent = d2.name.toUpperCase();

        // P1 Slots
        const iconJ = document.getElementById('iconJ');
        const nameJ = document.getElementById('nameJ');
        const iconK = document.getElementById('iconK');
        const nameK = document.getElementById('nameK');
        const iconL = document.getElementById('iconL');
        const nameL = document.getElementById('nameL');
        const iconI = document.getElementById('iconI');
        const nameI = document.getElementById('nameI');
        if (iconJ) iconJ.textContent = d1.j.icon;
        if (nameJ) nameJ.textContent = d1.j.name;
        if (iconK) iconK.textContent = d1.k.icon;
        if (nameK) nameK.textContent = d1.k.name;
        if (iconL) iconL.textContent = d1.l.icon;
        if (nameL) nameL.textContent = d1.l.name;
        if (iconI) iconI.textContent = '💨';
        if (nameI) nameI.textContent = 'Dodge';

        // P2 Slots
        const iconP2_J = document.getElementById('iconP2_J');
        const nameP2_J = document.getElementById('nameP2_J');
        const iconP2_K = document.getElementById('iconP2_K');
        const nameP2_K = document.getElementById('nameP2_K');
        const iconP2_L = document.getElementById('iconP2_L');
        const nameP2_L = document.getElementById('nameP2_L');
        const iconP2_I = document.getElementById('iconP2_I');
        const nameP2_I = document.getElementById('nameP2_I');
        if (iconP2_J) iconP2_J.textContent = d2.j.icon;
        if (nameP2_J) nameP2_J.textContent = d2.j.name;
        if (iconP2_K) iconP2_K.textContent = d2.k.icon;
        if (nameP2_K) nameP2_K.textContent = d2.k.name;
        if (iconP2_L) iconP2_L.textContent = d2.l.icon;
        if (nameP2_L) nameP2_L.textContent = d2.l.name;
        if (iconP2_I) iconP2_I.textContent = '💨';
        if (nameP2_I) nameP2_I.textContent = 'Dodge';
      }
    } else {
      // 1-Player Mode (Centered Bottom Bar)
      if (actionBars) actionBars.classList.add('mode-1p');
      if (barP1) barP1.style.display = 'flex';
      if (barP2) barP2.style.display = 'none';

      if (barNameP1) barNameP1.textContent = (isHyper ? `TAG HYPER: ${this.player.fusionData.name}` : current.name).toUpperCase();

      const badgeJ = document.getElementById('badgeJ');
      const badgeK = document.getElementById('badgeK');
      const badgeL = document.getElementById('badgeL');
      const badgeI = document.getElementById('badgeI');
      if (badgeJ) badgeJ.textContent = 'J';
      if (badgeK) badgeK.textContent = 'K';
      if (badgeL) badgeL.textContent = 'L';
      if (badgeI) badgeI.textContent = 'I';

      const iconJ = document.getElementById('iconJ');
      const nameJ = document.getElementById('nameJ');
      const iconK = document.getElementById('iconK');
      const nameK = document.getElementById('nameK');
      const iconL = document.getElementById('iconL');
      const nameL = document.getElementById('nameL');
      const iconI = document.getElementById('iconI');
      const nameI = document.getElementById('nameI');

      if (iconJ) iconJ.textContent = isHyper ? '💥' : current.j.icon;
      if (nameJ) nameJ.textContent = isHyper ? (current.attack || 'Primary Blast') : current.j.name;
      if (iconK) iconK.textContent = isHyper ? '✨' : current.k.icon;
      if (nameK) nameK.textContent = isHyper ? (current.special || 'Special Wave') : current.k.name;
      if (iconL) iconL.textContent = isHyper ? '🌟' : current.l.icon;
      if (nameL) nameL.textContent = isHyper ? 'Screen Nuke' : current.l.name;
      if (iconI) iconI.textContent = isHyper ? '🛡️' : '💨';
      if (nameI) nameI.textContent = isHyper ? 'Invulnerable' : 'Dodge';
    }

    // 2. Sync Mobile Touch Controls
    const touchIconAtk = document.getElementById('touchIconAttack');
    const touchLblAtk = document.getElementById('touchLblAttack');
    const touchIconSp = document.getElementById('touchIconSpecial');
    const touchLblSp = document.getElementById('touchLblSpecial');
    const touchIconSk = document.getElementById('touchIconSkill');
    const touchLblSk = document.getElementById('touchLblSkill');

    if (touchIconAtk) touchIconAtk.textContent = isHyper ? '💥' : current.j.icon;
    if (touchLblAtk) touchLblAtk.textContent = (isHyper ? (current.attack || 'BLAST') : current.j.name).toUpperCase();
    if (touchIconSp) touchIconSp.textContent = isHyper ? '✨' : current.k.icon;
    if (touchLblSp) touchLblSp.textContent = (isHyper ? (current.special || 'SPECIAL') : current.k.name).toUpperCase();
    if (touchIconSk) touchIconSk.textContent = isHyper ? '🌟' : current.l.icon;
    if (touchLblSk) touchLblSk.textContent = (isHyper ? 'NUKE' : current.l.name).toUpperCase();
  }

  quitGame() {
    try {
      window.close();
    } catch (e) {}
    const qs = document.getElementById('quitScreen');
    if (qs) qs.style.display = 'flex';
  }

    takeScreenshot() {
    try {
      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const now = new Date();
      const timeStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
      link.download = `Crystal-Gems-${timeStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Play camera shutter sound
      if (this.audio) this.audio.playSfx('cookie');

      // Visual flash indicator
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.65);pointer-events:none;z-index:99999;transition:opacity 0.35s ease-out;';
      document.body.appendChild(flash);
      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 380);
      });

      console.log('📸 Clean screenshot captured and saved as:', link.download);
    } catch (err) {
      console.warn('Screenshot capture error:', err);
    }
  }

  syncCharGridIcons() {
    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
      const cId = item.dataset.char;
      const b = item.querySelector('.char-item-bubble');
      if (b && typeof getGuardianSvg === 'function') {
        b.innerHTML = getGuardianSvg(cId, 52);
      }
    });
  }

  showTitleScreen() {
    if (typeof this.finishStartupSplashImmediate === 'function' && this.splashActive) {
      this.finishStartupSplashImmediate();
    } else {
      const ts = document.getElementById('titleScreen');
      if (ts) ts.classList.remove('splash-pending');
    }
    this.screenTransition = null;
    this.setVeil(false);
    this.arcadeWavePending = false;
    this.cutsceneActive = false;
    this.puzzleActive = false;
    this.creditsActive = false;
    this.hideAllScreens();
    this.state = 'title';
    this.releaseAllInputs();
    this.audio.isManuallyPaused = false;
    this.audio.init();
    if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
      this.audio.ctx.resume().catch(() => {});
    }
    const lobbyTrack = (this.audio.bgmOverrideManual && this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'intro_launch';
    this.audio.playTrackById(lobbyTrack, false);
    const ctxRunning = !!(this.audio.ctx && this.audio.ctx.state === 'running');
    if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(ctxRunning && !this.audio.isManuallyPaused);

    // Reset Fusion state cleanly without spawning in-game unfuse poofs/particles
    this.isFused = false;
    this.isHyperAttack = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    this.synergyBuffTimer = 0;
    this.fusionEnergy = 0;
    this.fusionTimer = 0;
    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    if (this.player) {
      this.player.isFusion = false;
      this.player.fusionKey = null;
      this.player.fusionData = null;
      this.player.isMergedInFusion = false;
      this.player.hasSynergyBuff = false;
      this.player.switchCharacter(this.selectedCharP1);
    }
    if (this.playerMode !== '2p') {
      this.player2 = null;
    } else if (this.player2) {
      this.player2.isFusion = false;
      this.player2.fusionKey = null;
      this.player2.fusionData = null;
      this.player2.isMergedInFusion = false;
      this.player2.hasSynergyBuff = false;
      this.player2.switchCharacter(this.selectedCharP2);
    }

    if (document.body) document.body.classList.remove('in-game');
    document.getElementById('hud').style.display = 'none';
    const actionBars = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    if (actionBars) actionBars.style.display = 'none';
    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.classList.remove('active');
      touchBox.style.display = 'none';
    }
    const comboEl = document.getElementById('comboDisplay');
    if (comboEl) comboEl.style.display = 'none';

    this.updateLobbyGuardian();
    this.updateLobbyDifficulty();
    document.getElementById('titleScreen').style.display = 'flex';
    this.startLobbySlideshow();
  }

  hideAllScreens() {
    document.querySelectorAll('.overlay-screen').forEach(el => el.style.display = 'none');
  }

  initEventListeners() {
    const resetAllKeys = () => {
      this.keysP1.left = false;
      this.keysP1.right = false;
      this.keysP1.jump = false;
      this.keysP1.down = false;
      this.keysP1.shield = false;
      this.keysP1.dodge = false;
      this.keysP1.attack = false;
      this.keysP1.special = false;
      this.keysP1.skill = false;
      this.keysP1.overdrive = false;
      this.keysP1.sprint = false;

      this.keysP2.left = false;
      this.keysP2.right = false;
      this.keysP2.jump = false;
      this.keysP2.down = false;
      this.keysP2.shield = false;
      this.keysP2.dodge = false;
      this.keysP2.attack = false;
      this.keysP2.special = false;
      this.keysP2.skill = false;
      this.keysP2.overdrive = false;
      this.keysP2.sprint = false;

      if (this.player) {
        this.player.vx = 0;
        this.player.isGuarding = false;
        this.player.isSpinDashing = false;
        this.player.isSprinting = false;
        if (this.player.state === 'running' || this.player.state === 'walk') this.player.state = 'idle';
      }
      if (this.player2) {
        this.player2.vx = 0;
        this.player2.isGuarding = false;
        this.player2.isSpinDashing = false;
        this.player2.isSprinting = false;
        if (this.player2.state === 'running' || this.player2.state === 'walk') this.player2.state = 'idle';
      }

      document.querySelectorAll('.touch-btn').forEach(btn => btn.classList.remove('active-touch'));
    };

    // Screenshot & OS Focus Fix: Do NOT auto-pause on window blur!
    // Pressing PrintScreen, Windows Snipping Tool, or OS screenshot shortcut blurs window;
    // resetting keys prevents stuck controls without popping up the pause menu.
    window.addEventListener('blur', () => {
      resetAllKeys();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        resetAllKeys();
        if (this.state === 'playing') {
          this.state = 'paused';
          if (this.syncVolumeUI) this.syncVolumeUI();
          if (syncBgmUI) syncBgmUI();
          const ps = document.getElementById('pauseScreen');
          if (ps) ps.style.display = 'flex';
          const touchBox = document.getElementById('touchControls');
          if (touchBox) touchBox.style.display = 'none';
        }
      } else {
        this.lastTime = performance.now();
      }
    });

    // Auto-lock landscape on mobile
    const lockLandscape = () => {
      try {
        if (this.isRealMobile) {
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
          }
        }
      } catch (err) {}
    };
    window.addEventListener('touchstart', lockLandscape, { passive: true });
    window.addEventListener('pointerdown', lockLandscape, { passive: true });

    // Keyboard Handling for 1P and 2P modes (Strict Separation of Controls!)
    window.addEventListener('keydown', (e) => {
      // Only touch the audio graph when it actually needs unlocking.
      if (!this.audio.ctx || this.audio.ctx.state !== 'running') this.audio.init();
      this.releaseKeysOnModifierChange(e);

      // Modal Navigation Hotkeys (Arcade Intermission, Story Cutscene, Story Puzzle, Credits)
      if (this.arcadeWavePending || this.state === 'arcade_wait') {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
          e.preventDefault();
          this.continueArcadeWave();
          return;
        }
        if (e.code === 'Escape' || e.code === 'Backspace') {
          e.preventDefault();
          this.gemOutArcade();
          return;
        }
        return;
      }
      if (this.cutsceneActive || this.state === 'cutscene') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'ArrowRight') {
          e.preventDefault();
          this.advanceCutscene();
          return;
        }
        if (e.code === 'Escape' || e.code === 'Backspace') {
          e.preventDefault();
          this.cutsceneActive = false;
          this.cutsceneData = null;
          this.cutsceneOnDone = null;
          this.showTitleScreen();
          return;
        }
        return;
      }
      if (this.puzzleActive || this.state === 'puzzle') {
        if (e.code === 'Escape' || e.code === 'Backspace') {
          e.preventDefault();
          this.puzzleActive = false;
          this.puzzleState = null;
          this.showTitleScreen();
          return;
        }
      }
      if (this.creditsActive || this.state === 'credits') {
        if (e.code === 'Escape' || e.code === 'Backspace' || e.code === 'Enter') {
          e.preventDefault();
          this.closeCreditsScreen();
          return;
        }
        return;
      }

      // Pause-Only Restart Shortcut [R] (Strictly disabled during active gameplay!)
      if (e.code === 'KeyR' && this.state === 'paused') {
        e.preventDefault();
        this.audio.playSfx('warpPad');
        if (this.gameMode === 'arcade') {
          this.startArcadeRun(this.arcadeMapStage || 1);
        } else if (this.gameMode === 'practice') {
          this.startNewGame('practice');
        } else {
          this.startNewGame('story', { stage: this.stageIndex || 1 });
        }
        return;
      }

      // Main Menu Shortcut [Esc / Return (Backspace)] for End Screens & Non-Pause Overlays
      if (e.code === 'Escape' || e.code === 'Backspace') {
        // In-game FIRST: Escape toggles Pause <-> Playing ONLY (never quits to Main Menu from Pause; Backspace ignored)
        if (this.state === 'playing' || this.state === 'paused') {
          if (e.code === 'Escape') {
            if (this.state === 'playing') {
              this.state = 'paused';
              this.releaseAllInputs();
              this.setOverlaysVisible(false);
              if (this.syncVolumeUI) this.syncVolumeUI();
              document.getElementById('pauseScreen').style.display = 'flex';
              const touchBox = document.getElementById('touchControls');
              if (touchBox) touchBox.style.display = 'none';
            } else {
              this.state = 'playing';
              this.releaseAllInputs();
              this.setOverlaysVisible(true);
              this.lastTime = performance.now();
              document.getElementById('pauseScreen').style.display = 'none';
              const touchBox = document.getElementById('touchControls');
              if (touchBox && this.isRealMobile) {
                touchBox.classList.add('active');
                touchBox.style.display = 'flex';
              }
            }
          }
          return;
        }

        const isShown = (id) => {
          const el = document.getElementById(id);
          return !!(el && el.style && el.style.display && el.style.display !== 'none');
        };

        if (isShown('quitScreen') || this.state === 'gameover' || this.state === 'victory' || isShown('gameOverScreen') || isShown('victoryScreen') || isShown('arcadeResultScreen')) {
          e.preventDefault();
          this.audio.playSfx('menuTap');
          this.showTitleScreen();
          return;
        }
        const blurActive = () => {
          try { if (typeof document !== 'undefined' && document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (err) {}
        };
        if (isShown('characterSelectScreen')) {
          e.preventDefault();
          if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
            this.selectedCharP2 = this.tempSelectedChar || this.selectedCharP2;
            SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
          } else {
            this.selectedCharP1 = this.tempSelectedChar || this.selectedCharP1;
            this.selectedChar = this.selectedCharP1;
            SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
          }
          this.updateLobbyGuardian();
          document.getElementById('characterSelectScreen').style.display = 'none';
          blurActive();
          this.audio.playSfx('cookie');
          return;
        }
        if (isShown('settingsScreen')) {
          e.preventDefault();
          SafeStorage.setItem('su_graphicsQuality', this.graphicsQuality || 'high');
          SafeStorage.setItem('su_targetFps', String(this.targetFps || 0));
          SafeStorage.setItem('su_fastPerf', this.fastPerfMode ? '1' : '0');
          SafeStorage.setItem('su_screenShake', this.screenShakeEnabled ? '1' : '0');
          SafeStorage.setItem('su_mobileTouch', this.isRealMobile ? '1' : '0');
          document.getElementById('settingsScreen').style.display = 'none';
          blurActive();
          this.audio.playSfx('cookie');
          return;
        }
        const closeableModals = ['episodeSelectScreen', 'mapSelectScreen', 'difficultyScreen', 'howToPlayScreen', 'bubbleRoomScreen', 'controlsScreen', 'creditsScreen', 'fusionGuideScreen', 'installAppModal'];
        for (const modalId of closeableModals) {
          if (isShown(modalId)) {
            e.preventDefault();
            document.getElementById(modalId).style.display = 'none';
            blurActive();
            this.audio.playSfx('menuTap');
            return;
          }
        }
        return;
      }

      // Screenshot hotkey: PrintScreen (or [P] in Solo Mode)
      if (e.code === 'PrintScreen' || (e.code === 'KeyP' && this.playerMode !== '2p')) {
        e.preventDefault();
        this.takeScreenshot();
        return;
      }

      if (['KeyA', 'ArrowLeft', 'KeyD', 'ArrowRight', 'KeyW', 'ArrowUp', 'Space', 'KeyJ', 'KeyK', 'KeyL', 'KeyI', 'KeyU', 'KeyO', 'KeyS', 'ArrowDown', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyR', 'KeyV', 'KeyB'].includes(e.code)) {
        e.preventDefault();
      }

      // Fusion Trigger Keybinds: [V] or [B] or [Enter] - Strictly active ONLY in 2-Player mode!
      if (this.playerMode === '2p' && ['KeyV', 'KeyB', 'Enter'].includes(e.code)) {
        this.triggerFusion();
      }

      // Double-tap A / D (and ArrowLeft / ArrowRight for 2P) Sprint / Speed-Run detection!
      const nowTap = performance.now();
      const handleSprintTap = (keysObj, dirKey, codeStr) => {
        if (e.repeat) return;
        const alreadyHeld = !!keysObj[dirKey];
        if (!alreadyHeld) {
          if (keysObj._lastTapCode === codeStr && (nowTap - (keysObj._lastTapTime || 0)) < 290) {
            keysObj.sprint = true;
          } else {
            keysObj.sprint = false;
          }
          keysObj._lastTapCode = codeStr;
          keysObj._lastTapTime = nowTap;
        }
      };

      const bufP1 = (act) => { if (!e.repeat && this.player && typeof this.player.bufferInput === 'function') this.player.bufferInput(act, 0.11); };
      const bufP2 = (act) => { if (!e.repeat && this.player2 && typeof this.player2.bufferInput === 'function') this.player2.bufferInput(act, 0.11); };

      if (this.playerMode === '2p') {
        // Player 1 Controls (Left Hand side of keyboard)
        if (e.code === 'KeyA') { handleSprintTap(this.keysP1, 'left', 'KeyA'); this.keysP1.left = true; }
        if (e.code === 'KeyD') { handleSprintTap(this.keysP1, 'right', 'KeyD'); this.keysP1.right = true; }
        if (e.code === 'KeyW') { this.keysP1.jump = true; bufP1('jump'); }
        if (e.code === 'KeyS') { this.keysP1.down = true; this.keysP1.shield = true; }
        if (e.code === 'KeyE') { this.keysP1.dodge = true; bufP1('dodge'); this.triggerSlotAnimation('slotI'); }
        if (e.code === 'KeyF') { this.keysP1.attack = true; bufP1('attack'); this.triggerSlotAnimation('slotJ'); }
        if (e.code === 'KeyG') { this.keysP1.special = true; bufP1('special'); this.triggerSlotAnimation('slotK'); }
        if (e.code === 'KeyH') { this.keysP1.skill = true; bufP1('skill'); this.triggerSlotAnimation('slotL'); }
        if (e.code === 'KeyR') { this.activatePinkOverdrive('p1'); }

        // Player 2 Controls (Right Hand side / Arrow keys)
        if (e.code === 'ArrowLeft') { handleSprintTap(this.keysP2, 'left', 'ArrowLeft'); this.keysP2.left = true; }
        if (e.code === 'ArrowRight') { handleSprintTap(this.keysP2, 'right', 'ArrowRight'); this.keysP2.right = true; }
        if (e.code === 'ArrowUp') { this.keysP2.jump = true; bufP2('jump'); }
        if (e.code === 'ArrowDown') { this.keysP2.down = true; this.keysP2.shield = true; }
        if (e.code === 'KeyI') { this.keysP2.dodge = true; bufP2('dodge'); this.triggerSlotAnimation('slotP2_I'); }
        if (e.code === 'KeyJ') { this.keysP2.attack = true; bufP2('attack'); this.triggerSlotAnimation('slotP2_J'); }
        if (e.code === 'KeyK') { this.keysP2.special = true; bufP2('special'); this.triggerSlotAnimation('slotP2_K'); }
        if (e.code === 'KeyL') { this.keysP2.skill = true; bufP2('skill'); this.triggerSlotAnimation('slotP2_L'); }
        if (e.code === 'KeyO' || e.code === 'KeyP') { this.activatePinkOverdrive('p2'); }
      } else {
        // Solo 1-Player Mode: STRICTLY A, D, W/Space, S, J, K, L, I (Dodge), U/O (Overdrive)
        if (e.code === 'KeyA') { handleSprintTap(this.keysP1, 'left', 'KeyA'); this.keysP1.left = true; }
        if (e.code === 'KeyD') { handleSprintTap(this.keysP1, 'right', 'KeyD'); this.keysP1.right = true; }
        if (e.code === 'KeyW' || e.code === 'Space') { this.keysP1.jump = true; bufP1('jump'); }
        if (e.code === 'KeyS') {
          this.keysP1.down = true;
          this.keysP1.shield = true;
        }

        if (e.code === 'KeyJ') {
          this.keysP1.attack = true;
          bufP1('attack');
          this.triggerSlotAnimation('slotJ');
        }
        if (e.code === 'KeyK') {
          this.keysP1.special = true;
          bufP1('special');
          this.triggerSlotAnimation('slotK');
        }
        if (e.code === 'KeyL') {
          this.keysP1.skill = true;
          bufP1('skill');
          this.triggerSlotAnimation('slotL');
        }
        if (e.code === 'KeyI') {
          this.keysP1.dodge = true;
          bufP1('dodge');
          this.triggerSlotAnimation('slotI');
        }
        if (e.code === 'KeyU' || e.code === 'KeyO') {
          this.activatePinkOverdrive('p1');
        }
      }

      // Combat key handling (Escape / Backspace / Pause-R already handled above)
    });

    // If the window loses focus, the keyup never arrives and the hero would keep
    // walking forever ("it moves by itself"). Release everything on blur/hide.
    window.addEventListener('blur', () => this.releaseAllInputs());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.releaseAllInputs();
    });
    window.addEventListener('pointerup', () => this.releaseStuckTouchKeys());
    window.addEventListener('pointercancel', () => this.releaseAllInputs());

    window.addEventListener('keyup', (e) => {
      if (this.playerMode === '2p') {
        if (e.code === 'KeyA') { this.keysP1.left = false; if (!this.keysP1.right) this.keysP1.sprint = false; }
        if (e.code === 'KeyD') { this.keysP1.right = false; if (!this.keysP1.left) this.keysP1.sprint = false; }
        if (e.code === 'KeyW') this.keysP1.jump = false;
        if (e.code === 'KeyS') {
          this.keysP1.down = false;
          this.keysP1.shield = false;
        }
        if (e.code === 'KeyE') this.keysP1.dodge = false;
        if (e.code === 'KeyF') this.keysP1.attack = false;
        if (e.code === 'KeyG') this.keysP1.special = false;
        if (e.code === 'KeyH') this.keysP1.skill = false;

        if (e.code === 'ArrowLeft') { this.keysP2.left = false; if (!this.keysP2.right) this.keysP2.sprint = false; }
        if (e.code === 'ArrowRight') { this.keysP2.right = false; if (!this.keysP2.left) this.keysP2.sprint = false; }
        if (e.code === 'ArrowUp') this.keysP2.jump = false;
        if (e.code === 'ArrowDown') {
          this.keysP2.down = false;
          this.keysP2.shield = false;
        }
        if (e.code === 'KeyI') this.keysP2.dodge = false;
        if (e.code === 'KeyJ') this.keysP2.attack = false;
        if (e.code === 'KeyK') this.keysP2.special = false;
        if (e.code === 'KeyL') this.keysP2.skill = false;
      } else {
        if (e.code === 'KeyA') { this.keysP1.left = false; if (!this.keysP1.right) this.keysP1.sprint = false; }
        if (e.code === 'KeyD') { this.keysP1.right = false; if (!this.keysP1.left) this.keysP1.sprint = false; }
        if (e.code === 'KeyW' || e.code === 'Space') this.keysP1.jump = false;
        if (e.code === 'KeyS') {
          this.keysP1.down = false;
          this.keysP1.shield = false;
        }
        if (e.code === 'KeyJ') this.keysP1.attack = false;
        if (e.code === 'KeyK') this.keysP1.special = false;
        if (e.code === 'KeyL') this.keysP1.skill = false;
        if (e.code === 'KeyI') this.keysP1.dodge = false;
      }
    });

    // Helper for safe click bindings
    const clearMenuButtonFocus = (el) => {
      try {
        if (el && typeof el.blur === 'function') el.blur();
        if (typeof document !== 'undefined' && document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      } catch (e) {}
    };

    const menuNavIds = new Set(['btnArcadeMode', 'btnStoryModeEntry', 'btnPracticeModeEntry', 'btnOpenSettings', 'btnOpenCredits', 'btnQuitGame']);
    const safeClick = (id, fn) => {
      const el = document.getElementById(id);
      if (el) {
        let lastTime = 0;
        const trigger = (e) => {
          if (menuNavIds.has(id) && (this.splashActive || Date.now() < (this._splashGuardUntil || 0))) {
            return;
          }
          const now = Date.now();
          if (now - lastTime < 250) return;
          lastTime = now;
          clearMenuButtonFocus(el);
          try {
            this.audio.init();
            if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
              this.audio.ctx.resume().catch(() => {});
            }
            fn(e);
          } catch (err) {
            console.error(`Click handler error on #${id}:`, err);
          }
        };
        el.addEventListener('click', trigger);
        el.addEventListener('touchend', (e) => {
          if (!e.defaultPrevented) trigger(e);
        }, { passive: true });
      }
    };

    // Main Menu Buttons (Frameless Concept UI Entry Points)
    safeClick('btnArcadeMode', () => {
      this.audio.playSfx('warpPad');
      this.openCharacterSelect('arcade');
    });
    safeClick('btnStoryModeEntry', () => {
      this.audio.playSfx('warpPad');
      this.openCharacterSelect('story');
    });
    safeClick('btnPracticeModeEntry', () => {
      this.audio.playSfx('warpPad');
      this.openCharacterSelect('practice');
    });
    safeClick('btnOpenCredits', () => {
      this.audio.playSfx('warpPad');
      this.openCreditsScreen();
    });
    safeClick('btnPlayStory', () => {
      this.audio.playSfx('warpPad');
      this.openCharacterSelect('story');
    });
    safeClick('btnPractice', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame('practice');
    });
    safeClick('btnPlayerMode', () => {
      this.audio.playSfx('menuTap');
      this.togglePlayerMode();
    });
    safeClick('btnCharDiff', () => {
      this.audio.playSfx('menuTap');
      this.cycleDifficulty();
      this.syncCharModalMeta();
    });
    safeClick('btnCharPlayerMode', () => {
      this.audio.playSfx('menuTap');
      this.togglePlayerMode();
      this.syncCharModalMeta();
      const pTabs = document.getElementById('charPlayerTabs');
      if (pTabs) pTabs.style.display = this.playerMode === '2p' ? 'flex' : 'none';
    });
    safeClick('btnCharEpisodes', () => {
      this.audio.playSfx('menuTap');
      if (charModal) charModal.style.display = 'none';
      this.openEpisodeScreen();
    });
    safeClick('btnCharBackMenu', () => {
      this.audio.playSfx('menuTap');
      if (charModal) charModal.style.display = 'none';
    });
    // Map Selection Buttons
    safeClick('btnCloseMapSelect', () => {
      this.audio.playSfx('menuTap');
      const mScreen = document.getElementById('mapSelectScreen');
      if (mScreen) mScreen.style.display = 'none';
    });
    safeClick('btnMapBack', () => {
      this.audio.playSfx('menuTap');
      const mScreen = document.getElementById('mapSelectScreen');
      if (mScreen) mScreen.style.display = 'none';
      this.openCharacterSelect('arcade');
    });
    safeClick('btnMapMainMenu', () => {
      this.audio.playSfx('menuTap');
      const mScreen = document.getElementById('mapSelectScreen');
      if (mScreen) mScreen.style.display = 'none';
      this.showTitleScreen();
    });
    safeClick('btnPlayArcadeMap', () => {
      this.audio.playSfx('warpPad');
      const mScreen = document.getElementById('mapSelectScreen');
      if (mScreen) mScreen.style.display = 'none';
      this.startArcadeRun(this.arcadeMapStage || 1);
    });
    // Arcade Wave Intermission & Result Buttons
    safeClick('btnArcadeContinue', () => this.continueArcadeWave());
    safeClick('btnArcadeGemOut', () => this.gemOutArcade());
    safeClick('btnArcadeMainMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });
    safeClick('btnArcadeRetry', () => {
      this.audio.playSfx('warpPad');
      this.startArcadeRun(this.arcadeMapStage || 1);
    });
    // Story Cutscene & Puzzle Buttons
    safeClick('btnCutsceneNext', () => this.advanceCutscene());
    safeClick('btnCutsceneSkip', () => this.finishCutscene());
    safeClick('btnPuzzleHint', () => this.showPuzzleHint());
    safeClick('btnPuzzleReset', () => this.resetCurrentPuzzle());
    safeClick('btnPuzzleSkip', () => this.skipCurrentPuzzle());
    // Credits Buttons (Hold-to-Speedup + Main Menu)
    this.bindCreditsHoldControls();
    safeClick('btnCreditsMenu', () => {
      this.audio.playSfx('menuTap');
      this.closeCreditsScreen();
    });
    safeClick('btnOpenDifficulty', () => this.openDifficultyScreen());
    safeClick('btnCloseDifficulty', () => this.closeDifficultyScreen());
    safeClick('btnConfirmDifficulty', () => {
      this.audio.playSfx('warpPad');
      this.closeDifficultyScreen();
      this.updateLobbyDifficulty();
    });
    // Quick-cycle from the difficulty pill in the lobby
    safeClick('lobbyDifficultyPill', () => this.cycleDifficulty());
    // The five tier cards
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setDifficulty(btn.dataset.diff));
    });
    safeClick('btnQuitGame', () => this.quitGame());
    safeClick('btnStoryMode', () => this.toggleStoryMode());
    safeClick('btnEpisodes', () => this.openEpisodeScreen());
    safeClick('btnCloseEpisodes', () => this.closeEpisodeScreen());
    safeClick('btnCloseEpisodesBtn', () => this.closeEpisodeScreen());
    document.querySelectorAll('.episode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ep = parseInt(btn.dataset.episode, 10);
        this.closeEpisodeScreen();
        this.startEpisode(ep);
      });
    });
    this.updateStoryModeUI();
    safeClick('btnCancelQuit', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });

    safeClick('btnNextStage', () => {
      this.audio.playSfx('warpPad');
      this.nextStage();
    });
    safeClick('btnVictoryCredits', () => {
      this.audio.playSfx('warpPad');
      this.openCreditsScreen();
    });
    safeClick('btnVictoryMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });
    safeClick('btnRetry', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame(this.gameMode);
    });
    safeClick('btnGameOverMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });

    safeClick('btnResume', () => {
      this.audio.playSfx('menuTap');
      this.state = 'playing';
      this.lastTime = performance.now();
      const ps = document.getElementById('pauseScreen');
      if (ps) ps.style.display = 'none';
      const touchBox = document.getElementById('touchControls');
      if (touchBox && this.isRealMobile) {
        touchBox.classList.add('active');
        touchBox.style.display = 'flex';
      }
    });
    safeClick('btnRestartStage', () => {
      this.audio.playSfx('warpPad');
      if (this.gameMode === 'arcade') {
        this.startArcadeRun(this.arcadeMapStage || 1);
      } else if (this.gameMode === 'practice') {
        this.startNewGame('practice');
      } else {
        this.startNewGame('story', { stage: this.stageIndex || 1 });
      }
    });
    safeClick('btnQuitToMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });

    // Chosen Guardian Card Button -> Opens Character Select Modal!
    const charModal = document.getElementById('characterSelectScreen');
    const syncCharGridIcons = () => {
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        const cId = item.dataset.char;
        const b = item.querySelector('.char-item-bubble');
        if (b) {
          b.innerHTML = getGuardianAvatarHtml(cId, 52);
        }
      });
    };
    syncCharGridIcons();
    this.updateCharPreview(this.selectedCharP1 || 'steven');

    const openCharModal = () => {
      this.charSelectActiveTab = 'p1';
      this.tempSelectedChar = (this.charSelectActiveTab === 'p2') ? this.selectedCharP2 : this.selectedCharP1;

      const pTabs = document.getElementById('charPlayerTabs');
      if (pTabs) {
        pTabs.style.display = this.playerMode === '2p' ? 'flex' : 'none';
      }

      syncCharGridIcons();
    this.updateCharPreview(this.selectedCharP1 || 'steven');

      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
      if (charModal) charModal.style.display = 'flex';
    };
    this._openCharModalInternal = openCharModal;

    safeClick('lobbyGuardianCard', () => {
      this.audio.playSfx('weaponSummon');
      this.openCharacterSelect(this.selectedEntryMode || 'story');
    });
    safeClick('btnCloseCharSelect', () => {
      this.audio.playSfx('menuTap');
      if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
        this.selectedCharP2 = this.tempSelectedChar || this.selectedCharP2;
        SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
      } else {
        this.selectedCharP1 = this.tempSelectedChar || this.selectedCharP1;
        this.selectedChar = this.selectedCharP1;
        SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
      }
      this.updateLobbyGuardian();
      if (charModal) charModal.style.display = 'none';
    });

    // 2-Player Guardian Tabs inside selection modal
    safeClick('tabSelectP1', () => {
      this.audio.playSfx('menuTap');
      this.charSelectActiveTab = 'p1';
      document.getElementById('tabSelectP1')?.classList.add('active');
      document.getElementById('tabSelectP2')?.classList.remove('active');
      this.tempSelectedChar = this.selectedCharP1;
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
    });

    safeClick('tabSelectP2', () => {
      this.audio.playSfx('menuTap');
      this.charSelectActiveTab = 'p2';
      document.getElementById('tabSelectP2')?.classList.add('active');
      document.getElementById('tabSelectP1')?.classList.remove('active');
      this.tempSelectedChar = this.selectedCharP2;
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
    });

    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
      item.addEventListener('click', () => {
        this.audio.init();
        document.querySelectorAll('.char-grid-item[data-char]').forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        this.tempSelectedChar = item.dataset.char;
        this.updateCharPreview(this.tempSelectedChar);

        // Auto-save and lock in guardian immediately upon click!
        if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
          this.selectedCharP2 = this.tempSelectedChar;
          SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
        } else {
          this.selectedCharP1 = this.tempSelectedChar;
          this.selectedChar = this.selectedCharP1;
          SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
        }
        this.updateLobbyGuardian();

        // Shimmering weapon summon audio feedback!
        this.audio.playSfx('weaponSummon');
      });
    });

    safeClick('btnFuseHud', () => this.triggerFusion());
    safeClick('btnFuseHudP2', () => this.triggerFusion());
    safeClick('touchFuse', () => this.triggerFusion());

    safeClick('btnConfirmChar', () => {
      if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
        this.selectedCharP2 = this.tempSelectedChar;
        SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
      } else {
        this.selectedCharP1 = this.tempSelectedChar;
        this.selectedChar = this.selectedCharP1;
        SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
      }
      this.updateLobbyGuardian();
      if (charModal) charModal.style.display = 'none';
      this.audio.playSfx('warpPad');
      if (this.selectedEntryMode === 'arcade') {
        this.openMapSelectScreen();
      } else if (this.selectedEntryMode === 'practice') {
        this.startNewGame('practice');
      } else {
        this.startNewGame('story', { stage: 1 });
      }
    });

    // Settings & Audio Controls
    const settingsModal = document.getElementById('settingsScreen');
    const btnSettingSound = document.getElementById('btnSettingSound');
    const btnSettingMusic = document.getElementById('btnSettingMusic');
    const btnSettingShake = document.getElementById('btnSettingShake');
    const btnSettingTouch = document.getElementById('btnSettingTouch');

    const sliderSfx = document.getElementById('sliderSfxVol');
    const sliderMusic = document.getElementById('sliderMusicVol');
    const labelSfx = document.getElementById('sliderSfxVal');
    const labelMusic = document.getElementById('sliderMusicVal');

    const pauseSliderSfx = document.getElementById('pauseSliderSfxVol');
    const pauseSliderMusic = document.getElementById('pauseSliderMusicVol');
    const pauseLabelSfx = document.getElementById('pauseSliderSfxVal');
    const pauseLabelMusic = document.getElementById('pauseSliderMusicVal');

    const syncVolumeUI = () => {
      const sfxPct = Math.round(this.audio.sfxVolume * 100);
      const musicPct = Math.round(this.audio.musicVolume * 100);

      if (sliderSfx) sliderSfx.value = sfxPct;
      if (pauseSliderSfx) pauseSliderSfx.value = sfxPct;
      if (labelSfx) labelSfx.textContent = `${sfxPct}%`;
      if (pauseLabelSfx) pauseLabelSfx.textContent = `${sfxPct}%`;

      if (sliderMusic) sliderMusic.value = musicPct;
      if (pauseSliderMusic) pauseSliderMusic.value = musicPct;
      if (labelMusic) labelMusic.textContent = `${musicPct}%`;
      if (pauseLabelMusic) pauseLabelMusic.textContent = `${musicPct}%`;
    };

    this.syncVolumeUI = syncVolumeUI;
    syncVolumeUI();

    const onSfxInput = (val) => {
      const pct = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
      this.audio.setSfxVolume(pct / 100);
      syncVolumeUI();
    };

    const onMusicInput = (val) => {
      const pct = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
      this.audio.setMusicVolume(pct / 100);
      syncVolumeUI();
    };

    if (sliderSfx) {
      sliderSfx.addEventListener('input', (e) => onSfxInput(e.target.value));
      sliderSfx.addEventListener('change', () => this.audio.playSfx('menuTap'));
    }
    if (pauseSliderSfx) {
      pauseSliderSfx.addEventListener('input', (e) => onSfxInput(e.target.value));
      pauseSliderSfx.addEventListener('change', () => this.audio.playSfx('menuTap'));
    }

    if (sliderMusic) {
      sliderMusic.addEventListener('input', (e) => onMusicInput(e.target.value));
    }
    if (pauseSliderMusic) {
      pauseSliderMusic.addEventListener('input', (e) => onMusicInput(e.target.value));
    }

    this.screenShakeEnabled = SafeStorage.getItem('su_screenShake') !== '0';

    // Jukebox Background Music (BGM) Track Selector Listeners (Lobby, Settings & Pause)
    const selectBgm = document.getElementById('selectBgmTrack');
    const pauseSelectBgm = document.getElementById('pauseSelectBgmTrack');
    const lobbySelectBgm = document.getElementById('lobbySelectBgm');

    const syncBgmUI = () => {
      let cur = this.audio.bgmOverrideManual ? (this.audio.selectedBgm || 'intro_launch') : (this.audio.currentTrack || 'intro_launch');
      if (cur === 'auto' || cur === 'menu') cur = 'intro_launch';
      if (selectBgm) selectBgm.value = cur;
      if (pauseSelectBgm) pauseSelectBgm.value = cur;
      if (lobbySelectBgm) lobbySelectBgm.value = cur;
      [selectBgm, pauseSelectBgm, lobbySelectBgm].forEach(el => {
        if (el && typeof el.syncDropdownLabel === 'function') el.syncDropdownLabel();
      });
      if (this.updateLobbyMusicButton) {
        const ctxRunning = !!(this.audio.ctx && this.audio.ctx.state === 'running');
        this.updateLobbyMusicButton(ctxRunning && !!this.audio.musicInterval && !this.audio.isManuallyPaused);
      }
    };
    syncBgmUI();

    const onBgmChange = (val) => {
      this.audio.init();
      this.audio.isManuallyPaused = false;
      this.audio.setBgmOverride(val);
      syncBgmUI();
      if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(true);
      this.audio.playSfx('menuTap');
    };

    if (lobbySelectBgm) {
      lobbySelectBgm.addEventListener('change', (e) => onBgmChange(e.target.value));
    }
    if (selectBgm) {
      selectBgm.addEventListener('change', (e) => onBgmChange(e.target.value));
    }
    if (pauseSelectBgm) {
      pauseSelectBgm.addEventListener('change', (e) => onBgmChange(e.target.value));
    }

    safeClick('btnLobbyPlayMusic', (e) => {
      if (e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
      const armed = this._lobbyPlayDownArmed;
      this._lobbyPlayDownArmed = null;
      const shouldPause = armed ? (armed === 'pause') : this.audio.isActivelyPlaying();
      if (shouldPause) {
        this.audio.pauseMusic();
        if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(false);
      } else {
        const cur = (this.audio.bgmOverrideManual && this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'intro_launch';
        this.audio.resumeMusic(cur);
        const btnSettingMusic = document.getElementById('btnSettingMusic');
        if (btnSettingMusic) btnSettingMusic.textContent = 'Synth Music (BGM): ON';
        if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(true);
      }
    });

    safeClick('btnOpenSettings', () => {
      this.audio.playSfx('menuTap');
      syncVolumeUI();
      syncBgmUI();
      if (btnSettingSound) btnSettingSound.textContent = this.audio.soundEnabled ? 'Sound Effects: ON' : 'Sound Effects: OFF';
      if (btnSettingMusic) btnSettingMusic.textContent = this.audio.musicEnabled ? 'Synth Music (BGM): ON' : 'Synth Music (BGM): OFF';
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? 'Screen Shake: ON' : 'Screen Shake: OFF';
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? 'Mobile Controls: FORCED ON' : 'Mobile Controls: AUTO';
      this.switchSettingsTab('audio');
      this.syncGraphicsUI();
      this.syncResolutionUI();
      if (settingsModal) settingsModal.style.display = 'flex';
    });

    document.querySelectorAll('.settings-tab-btn[data-stab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        this.audio.playSfx('menuTap');
        this.switchSettingsTab(tabBtn.dataset.stab || 'audio');
      });
    });

    document.querySelectorAll('.gfx-btn[data-gfx]').forEach(gfxBtn => {
      gfxBtn.addEventListener('click', () => {
        this.audio.playSfx('menuTap');
        this.applyGraphicsPreset(gfxBtn.dataset.gfx || 'high');
      });
    });

    document.querySelectorAll('.fps-btn[data-fps]').forEach(fpsBtn => {
      fpsBtn.addEventListener('click', () => {
        this.audio.playSfx('menuTap');
        this.setTargetFps(parseInt(fpsBtn.dataset.fps || '0', 10));
      });
    });

    document.querySelectorAll('.res-btn[data-res]').forEach(resBtn => {
      resBtn.addEventListener('click', () => {
        this.audio.playSfx('menuTap');
        this.applyResolution(resBtn.dataset.res || 'auto');
      });
    });

    safeClick('btnSettingFullscreen', () => {
      this.audio.playSfx('menuTap');
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch (e) {}
    });

    safeClick('btnCloseSettings', () => {
      this.audio.playSfx('menuTap');
      if (settingsModal) settingsModal.style.display = 'none';
    });

    safeClick('btnSettingSound', () => {
      this.audio.playSfx('menuTap');
      const enabled = this.audio.toggleSound();
      if (btnSettingSound) btnSettingSound.textContent = enabled ? 'Sound Effects: ON' : 'Sound Effects: OFF';
      const soundBtn = document.getElementById('btnSoundToggle');
      if (soundBtn) soundBtn.textContent = enabled ? 'Sound: ON' : 'Sound: OFF';
    });

    safeClick('btnSettingMusic', () => {
      this.audio.playSfx('menuTap');
      const enabled = this.audio.toggleMusic();
      if (btnSettingMusic) btnSettingMusic.textContent = enabled ? 'Synth Music (BGM): ON' : 'Synth Music (BGM): OFF';
    });

    safeClick('btnSettingShake', () => {
      this.audio.playSfx('menuTap');
      this.screenShakeEnabled = !this.screenShakeEnabled;
      SafeStorage.setItem('su_screenShake', this.screenShakeEnabled ? '1' : '0');
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? 'Screen Shake: ON' : 'Screen Shake: OFF';
    });

    safeClick('btnSettingTouch', () => {
      this.audio.playSfx('menuTap');
      this.isRealMobile = !this.isRealMobile;
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? 'Mobile Controls: FORCED ON' : 'Mobile Controls: FORCED OFF';
      const touchBox = document.getElementById('touchControls');
      if (touchBox && this.state === 'playing') {
        touchBox.style.display = this.isRealMobile ? 'flex' : 'none';
      }
    });

    safeClick('btnSaveSettings', () => {
      this.audio.playSfx('menuTap');
      if (settingsModal) settingsModal.style.display = 'none';
    });

    // Sound toggle
    safeClick('btnSoundToggle', () => {
      this.audio.playSfx('menuTap');
      const enabled = this.audio.toggleSound();
      const soundBtn = document.getElementById('btnSoundToggle');
      if (soundBtn) soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    // Mobile UI Toggle
    safeClick('btnMobileToggle', () => {
      const touchBox = document.getElementById('touchControls');
      if (touchBox) {
        const isShown = touchBox.style.display === 'flex';
        touchBox.style.display = isShown ? 'none' : 'flex';
      }
    });

    safeClick('btnScreenshot', () => this.takeScreenshot());

    safeClick('btnPause', () => {
      if (this.state === 'playing') {
        this.state = 'paused';
        this.releaseAllInputs();
        this.setOverlaysVisible(false);
        syncVolumeUI();
        const ps = document.getElementById('pauseScreen');
        if (ps) ps.style.display = 'flex';
      }
    });

    // Touch controls binding
    const bindTouch = (id, keyName) => {
      const el = document.getElementById(id);
      if (!el) return;
      let activeTouchId = null;

      const press = (e) => {
        if (e.cancelable) e.preventDefault();
        this.audio.init();
        this.keysP1[keyName] = true;
        el.classList.add('active-touch');
        if (navigator.vibrate) {
          try { navigator.vibrate(12); } catch (vErr) {}
        }
        if (keyName === 'attack') this.triggerSlotAnimation('slotJ');
        if (keyName === 'special') this.triggerSlotAnimation('slotK');
        if (keyName === 'skill') this.triggerSlotAnimation('slotL');
      };

      const release = (e) => {
        if (e && e.cancelable) e.preventDefault();
        this.keysP1[keyName] = false;
        el.classList.remove('active-touch');
        activeTouchId = null;
      };

      el.addEventListener('touchstart', (e) => {
        if (activeTouchId === null && e.changedTouches.length > 0) {
          activeTouchId = e.changedTouches[0].identifier;
          press(e);
        }
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === activeTouchId) {
            release(e);
            break;
          }
        }
      }, { passive: false });

      el.addEventListener('touchcancel', (e) => {
        release(e);
      }, { passive: false });

      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' || activeTouchId === null) {
          press(e);
          try { el.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });

      el.addEventListener('pointerup', (e) => {
        release(e);
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      });

      el.addEventListener('pointercancel', (e) => {
        release(e);
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      });
    };

    bindTouch('touchLeft', 'left');
    bindTouch('touchRight', 'right');
    bindTouch('touchJump', 'jump');
    bindTouch('touchAttack', 'attack');
    bindTouch('touchSpecial', 'special');
    bindTouch('touchSkill', 'skill');
    bindTouch('touchDodge', 'dodge');

    // Clickable Action Bar Slots for Desktop
    safeClick('slotJ', () => {
      this.keysP1.attack = true;
      this.triggerSlotAnimation('slotJ');
      setTimeout(() => { this.keysP1.attack = false; }, 80);
    });
    safeClick('slotK', () => {
      this.keysP1.special = true;
      this.triggerSlotAnimation('slotK');
      setTimeout(() => { this.keysP1.special = false; }, 80);
    });
    safeClick('slotL', () => {
      this.keysP1.skill = true;
      this.triggerSlotAnimation('slotL');
      setTimeout(() => { this.keysP1.skill = false; }, 80);
    });
    safeClick('slotI', () => {
      this.keysP1.dodge = true;
      this.triggerSlotAnimation('slotI');
      setTimeout(() => { this.keysP1.dodge = false; }, 80);
    });

    // P2 Clickable Action Bar Slots (Desktop)
    safeClick('slotP2_J', () => {
      this.keysP2.attack = true;
      this.triggerSlotAnimation('slotP2_J');
      setTimeout(() => { this.keysP2.attack = false; }, 80);
    });
    safeClick('slotP2_K', () => {
      this.keysP2.special = true;
      this.triggerSlotAnimation('slotP2_K');
      setTimeout(() => { this.keysP2.special = false; }, 80);
    });
    safeClick('slotP2_L', () => {
      this.keysP2.skill = true;
      this.triggerSlotAnimation('slotP2_L');
      setTimeout(() => { this.keysP2.skill = false; }, 80);
    });
    safeClick('slotP2_I', () => {
      this.keysP2.dodge = true;
      this.triggerSlotAnimation('slotP2_I');
      setTimeout(() => { this.keysP2.dodge = false; }, 80);
    });

    // Overdrive Button Listeners
    safeClick('btnOverdrive', () => this.activatePinkOverdrive('p1'));
    safeClick('btnOverdriveP2', () => this.activatePinkOverdrive('p2'));

    const touchOverdrive = document.getElementById('touchOverdrive');
    if (touchOverdrive) {
      touchOverdrive.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        this.audio.init();
        this.activatePinkOverdrive('p1');
        touchOverdrive.classList.add('active-touch');
      }, { passive: false });

      touchOverdrive.addEventListener('touchend', (e) => {
        if (e && e.cancelable) e.preventDefault();
        touchOverdrive.classList.remove('active-touch');
      }, { passive: false });
    }
  }

  triggerSlotAnimation(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    slot.classList.remove('active-trigger');
    void slot.offsetWidth;
    slot.classList.add('active-trigger');
  }

  updateCooldowns() {
    const cdJ = document.getElementById('cdJ');
    const cdK = document.getElementById('cdK');
    const cdL = document.getElementById('cdL');
    const cdI = document.getElementById('cdI');
    if (cdJ) cdJ.style.height = `${Math.min(100, Math.max(0, (this.player.attackCooldown / 0.22) * 100))}%`;
    if (cdK) cdK.style.height = `${Math.min(100, Math.max(0, (this.player.specialCooldown / 0.85) * 100))}%`;
    if (cdL) cdL.style.height = `${Math.min(100, Math.max(0, (this.player.skillCooldown / 3.2) * 100))}%`;
    if (cdI) cdI.style.height = `${Math.min(100, Math.max(0, (this.player.dodgeCooldown / 0.55) * 100))}%`;

    if (this.playerMode === '2p' && this.player2) {
      const cdP2_J = document.getElementById('cdP2_J');
      const cdP2_K = document.getElementById('cdP2_K');
      const cdP2_L = document.getElementById('cdP2_L');
      const cdP2_I = document.getElementById('cdP2_I');
      const p2AtkCd = (this.isFused && this.player2.isMergedInFusion) ? (this.player2AttackCooldown || 0) : this.player2.attackCooldown;
      const p2SpCd = (this.isFused && this.player2.isMergedInFusion) ? (this.player2SpecialCooldown || 0) : this.player2.specialCooldown;
      const p2SkCd = (this.isFused && this.player2.isMergedInFusion) ? (this.player2SkillCooldown || 0) : this.player2.skillCooldown;
      const p2DodgeCd = (this.isFused && this.player2.isMergedInFusion) ? this.player.dodgeCooldown : this.player2.dodgeCooldown;

      if (cdP2_J) cdP2_J.style.height = `${Math.min(100, Math.max(0, (p2AtkCd / 0.22) * 100))}%`;
      if (cdP2_K) cdP2_K.style.height = `${Math.min(100, Math.max(0, (p2SpCd / 0.85) * 100))}%`;
      if (cdP2_L) cdP2_L.style.height = `${Math.min(100, Math.max(0, (p2SkCd / 3.2) * 100))}%`;
      if (cdP2_I) cdP2_I.style.height = `${Math.min(100, Math.max(0, (p2DodgeCd / 0.55) * 100))}%`;
    }

    const touchCdDodge = document.getElementById('touchCdDodge');
    if (touchCdDodge) touchCdDodge.style.height = `${Math.min(100, Math.max(0, (this.player.dodgeCooldown / 0.55) * 100))}%`;
  }

  // ============================================================================
  // CONCEPT UI: HOVER PHYSICS, RESOLUTION, ARCADE MODE, CUTSCENES, PUZZLES, CREDITS
  // ============================================================================
  initInteractiveHoverPhysics() {
    if (this._hoverPhysicsBound || typeof document === 'undefined') return;
    this._hoverPhysicsBound = true;
    const selector = '.menu-link-btn, .hover-float, .modal-card, .map-card-item, .char-grid-item, .diff-btn, .episode-btn, .puzzle-tile';
    document.addEventListener('pointermove', (e) => {
      const target = e.target && e.target.closest ? e.target.closest(selector) : null;
      if (this._activeHoverEl && this._activeHoverEl !== target) {
        this._activeHoverEl.style.setProperty('--mx', '0px');
        this._activeHoverEl.style.setProperty('--my', '0px');
      }
      // Clear lingering focus from clicked main menu buttons when navigating by mouse
      if (target && target.classList && target.classList.contains('menu-link-btn') &&
          document.activeElement && document.activeElement !== target &&
          document.activeElement.classList && document.activeElement.classList.contains('menu-link-btn')) {
        try { document.activeElement.blur(); } catch (err) {}
      }
      this._activeHoverEl = target;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
      const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
      target.style.setProperty('--mx', `${(nx * 6).toFixed(2)}px`);
      target.style.setProperty('--my', `${(ny * 4).toFixed(2)}px`);
    }, { passive: true });
    document.addEventListener('pointerleave', () => {
      if (this._activeHoverEl) {
        this._activeHoverEl.style.setProperty('--mx', '0px');
        this._activeHoverEl.style.setProperty('--my', '0px');
        this._activeHoverEl = null;
      }
    }, true);
  }

  switchSettingsTab(tab = 'audio') {
    const panels = {
      audio: document.getElementById('settingsPanelAudio'),
      graphics: document.getElementById('settingsPanelGraphics'),
      resolution: document.getElementById('settingsPanelResolution')
    };
    Object.entries(panels).forEach(([k, el]) => {
      if (el) el.style.display = (k === tab) ? 'block' : 'none';
    });
    document.querySelectorAll('.settings-tab-btn[data-stab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.stab === tab);
    });
  }

  syncGraphicsUI() {
    document.querySelectorAll('.gfx-btn[data-gfx]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gfx === (this.graphicsQuality || 'high'));
    });
    document.querySelectorAll('.fps-btn[data-fps]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.fps || '0', 10) === (this.targetFps || 0));
    });
    const statusEl = document.getElementById('gfxPresetStatus');
    if (statusEl) {
      const qLabel = (this.graphicsQuality || 'high').toUpperCase();
      const fpsLabel = this.targetFps > 0 ? `${this.targetFps} FPS cap` : 'uncapped frame rate';
      const detailDesc = this.graphicsQuality === 'low'
        ? 'lightweight particles, reduced stars/clouds, no shadow glow'
        : this.graphicsQuality === 'medium'
          ? 'balanced particle density and moderate glow effects'
          : 'full particle density and gem glow effects';
      statusEl.textContent = `${qLabel} graphics (${detailDesc}) · ${fpsLabel}.`;
    }
  }

  applyGraphicsPreset(tier = 'high', opts = {}) {
    const valid = ['low', 'medium', 'high'].includes(tier) ? tier : 'high';
    this.graphicsQuality = valid;
    this.fastPerfMode = valid === 'low';
    this.gfxShadowMult = valid === 'low' ? 0 : (valid === 'medium' ? 0.5 : 1.0);
    if (this.particles && typeof this.particles.setQualityPreset === 'function') {
      this.particles.setQualityPreset(valid);
    }
    if (this.environment) {
      this.environment.quality = valid;
    }
    if (opts.persist !== false) {
      SafeStorage.setItem('su_graphicsQuality', valid);
      SafeStorage.setItem('su_fastPerf', this.fastPerfMode ? '1' : '0');
    }
    this.syncGraphicsUI();
  }

  setTargetFps(fps = 0, opts = {}) {
    const parsed = parseInt(fps, 10);
    const valid = [0, 30, 60, 120].includes(parsed) ? parsed : 0;
    this.targetFps = valid;
    this._lastRenderedFrameTime = 0;
    if (opts.persist !== false) {
      SafeStorage.setItem('su_targetFps', String(valid));
    }
    this.syncGraphicsUI();
  }

  syncResolutionUI() {
    document.querySelectorAll('.res-btn[data-res]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.res === (this.resolutionPreset || 'auto'));
    });
  }

  applyResolution(preset = 'auto') {
    const valid = ['auto', '1280x720', '1600x900', '1920x1080'].includes(preset) ? preset : 'auto';
    this.resolutionPreset = valid;
    SafeStorage.setItem('su_resolutionPreset', valid);
    if (typeof window !== 'undefined') window.__suResolutionPreset = valid;
    if (typeof fitGameToViewport === 'function') fitGameToViewport();
    this.syncResolutionUI();
  }

  syncCharModalMeta() {
    const mode = this.selectedEntryMode || 'story';
    const badge = document.getElementById('modeDiffBadge');
    const popup = document.getElementById('modeDiffPopup');
    const epBtn = document.getElementById('btnCharEpisodes');
    const playBtn = document.getElementById('btnConfirmChar');
    const diffLabel = document.getElementById('charDiffLabel');
    const pModeLabel = document.getElementById('charPlayerModeLabel');
    const dCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    if (diffLabel) diffLabel.textContent = (dCfg.label || this.difficulty || 'medium').toUpperCase();
    if (pModeLabel) pModeLabel.textContent = this.playerMode === '2p' ? '2P CO-OP' : '1P SOLO';

    if (mode === 'arcade') {
      if (popup) popup.classList.add('arcade-mode');
      if (badge) badge.textContent = 'ARCADE MODE';
      if (epBtn) epBtn.style.display = 'none';
      if (playBtn) playBtn.textContent = 'NEXT: MAP SELECTION ➔';
    } else if (mode === 'practice') {
      if (popup) popup.classList.remove('arcade-mode');
      if (badge) badge.textContent = 'PRACTICE MODE';
      if (epBtn) epBtn.style.display = 'none';
      if (playBtn) playBtn.textContent = 'ENTER PRACTICE DOJO ➔';
    } else {
      if (popup) popup.classList.remove('arcade-mode');
      if (badge) badge.textContent = 'STORY MODE';
      if (epBtn) epBtn.style.display = 'inline-flex';
      if (playBtn) playBtn.textContent = 'PLAY STORY (EP 1–10) ➔';
    }
  }

  openCharacterSelect(flowMode = 'story') {
    this.selectedEntryMode = (flowMode === 'arcade' || flowMode === 'practice') ? flowMode : 'story';
    this.syncCharModalMeta();
    if (this._openCharModalInternal) {
      this._openCharModalInternal();
    } else {
      const m = document.getElementById('characterSelectScreen');
      if (m) m.style.display = 'flex';
    }
  }

  openMapSelectScreen() {
    this.renderMapSelectCards();
    const screen = document.getElementById('mapSelectScreen');
    if (screen) screen.style.display = 'flex';
  }

  renderMapSelectCards() {
    const grid = document.getElementById('mapSelectGrid');
    if (!grid || typeof ARCADE_MAPS === 'undefined') return;
    grid.innerHTML = '';
    const selected = this.arcadeMapStage || 1;
    ARCADE_MAPS.forEach((m) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'map-card-item' + (m.stage === selected ? ' selected' : '');
      card.dataset.stage = String(m.stage);

      const cvs = document.createElement('canvas');
      cvs.className = 'map-thumb-canvas';
      cvs.width = 320;
      cvs.height = 180;
      const pctx = cvs.getContext('2d');
      if (pctx && typeof EnvironmentRenderer === 'function') {
        try {
          if (!this._previewRenderer) this._previewRenderer = new EnvironmentRenderer(1280, 720, 1280);
          pctx.save();
          pctx.scale(0.25, 0.25);
          this._previewRenderer.drawBackground(pctx, m.stage, 160, false);
          this._previewRenderer.drawForeground(pctx, m.stage, false);
          pctx.restore();
        } catch (err) {
          pctx.fillStyle = '#0f172a';
          pctx.fillRect(0, 0, 320, 180);
        }
      }

      const cap = document.createElement('div');
      cap.className = 'map-card-caption';
      cap.innerHTML = `<span class="map-card-title">${m.name}</span><span class="map-card-tag">${m.tag}</span>`;

      card.appendChild(cvs);
      card.appendChild(cap);
      card.addEventListener('click', () => {
        this.arcadeMapStage = m.stage;
        SafeStorage.setItem('su_arcadeMapStage', String(m.stage));
        grid.querySelectorAll('.map-card-item').forEach(el => el.classList.remove('selected'));
        card.classList.add('selected');
        if (this.audio) this.audio.playSfx('menuTap');
      });
      grid.appendChild(card);
    });
  }

  startArcadeRun(mapStage = 1) {
    const st = Math.max(1, Math.min(10, parseInt(mapStage, 10) || 1));
    this.arcadeMapStage = st;
    SafeStorage.setItem('su_arcadeMapStage', String(st));
    this.startNewGame('arcade', { stage: st });
  }

  startArcadeWave(waveNum = 1) {
    this.arcadeWave = Math.max(1, waveNum);
    this.arcadeWavePending = false;
    this.isWaitingForWaveClear = false;
    this.isWaitingForBoss = false;
    this.waveSpawnQueue = [];
    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.reset(this.stageIndex, diff, this.pickups);
    this.enemyManager.wave = this.arcadeWave;
    this.enemyManager.maxWaves = this.arcadeWave + 1;

    const mapInfo = (typeof ARCADE_MAPS !== 'undefined' && ARCADE_MAPS[this.stageIndex - 1])
      ? ARCADE_MAPS[this.stageIndex - 1]
      : { name: `ARENA ${this.stageIndex}`, mobs: ['centipeetle', 'acid_centipeetle', 'blade_quartz'], boss: 'boss_spitter', bossName: 'CORRUPTED BOSS' };

    const badge = document.getElementById('hudStageBadge');
    if (badge) {
      badge.textContent = `ARCADE · ${mapInfo.name.toUpperCase()}`;
      badge.style.display = 'block';
    }
    const objText = document.getElementById('hudObjectiveText');
    if (objText) {
      objText.style.display = 'none';
    }
    this.arcadeDefeatedBossThisWave = false;

    const count = Math.min(12, 3 + Math.floor(this.arcadeWave * 1.4));
    const allMixPool = ['centipeetle', 'acid_centipeetle', 'winged_centipeetle', 'blade_quartz', 'spire_harpy', 'cluster', 'obsidian', 'volcanic_firebird', 'ice_monster', 'snow_monster', 'carnelian_enforcer', 'destabilizer_soldier', 'robonoid_scout'];
    const pool = this.arcadeWave >= 4 ? mapInfo.mobs.concat(allMixPool) : mapInfo.mobs;

    for (let i = 0; i < count; i++) {
      const mType = pool[Math.floor(Math.random() * pool.length)];
      const spawnX = (i % 2 === 0 ? 1120 + (i * 85) : 140 + (i * 55)) % 2200 + 180;
      this.waveSpawnQueue.push({
        type: mType,
        spawnX: Math.max(160, Math.min(this.stageWidth - 180, spawnX)),
        timer: i * 0.22
      });
    }

    // Spawn a roaring Boss or Cross-Map Boss every 3rd wave (or Wave 2+)!
    const isBossWave = (this.arcadeWave % (this.arcadeBossEvery || 3) === 0);
    if (isBossWave) {
      const altBosses = (typeof ARCADE_MAPS !== 'undefined') ? ARCADE_MAPS : [mapInfo];
      const chosenBossInfo = this.arcadeWave === 3 ? mapInfo : altBosses[(this.stageIndex + this.arcadeWave - 1) % altBosses.length];
      this.waveSpawnQueue.push({
        type: chosenBossInfo.boss,
        spawnX: Math.min(this.stageWidth - 260, (this.player ? this.player.x : 400) + 520),
        timer: 0.75
      });
      const bossHud = document.getElementById('bossHud');
      if (bossHud) {
        bossHud.classList.add('story-mode-boss');
        bossHud.style.display = 'flex';
        const bName = document.getElementById('bossName');
        if (bName) bName.textContent = chosenBossInfo.bossName || 'ARCADE BOSS';
      }
      this.triggerWaveWarning(`WAVE ${this.arcadeWave} · BOSS INCOMING!`, true);
    } else {
      const bossHud = document.getElementById('bossHud');
      if (bossHud) bossHud.style.display = 'none';
      this.triggerWaveWarning(`ARCADE WAVE ${this.arcadeWave}`, false);
    }
    this.updateWaveLine();
  }

  onArcadeWaveCleared() {
    if (this.gameMode !== 'arcade' || this.arcadeWavePending) return;
    const bossEvery = this.arcadeBossEvery || 3;
    const isCheckpointWave = (this.arcadeWave % bossEvery === 0) || !!this.arcadeDefeatedBossThisWave;
    this.arcadeDefeatedBossThisWave = false;

    if (!isCheckpointWave) {
      this.score += 150;
      if (this.audio) this.audio.playSfx('cookie');
      this.updateHUD();
      this.startArcadeWave(this.arcadeWave + 1);
      return;
    }

    this.arcadeWavePending = true;
    this.state = 'arcade_wait';
    this.releaseAllInputs();
    if (this.audio) this.audio.playSfx('stageClear');

    const modal = document.getElementById('arcadeWaveModal');
    const title = document.getElementById('arcadeWaveTitle');
    const sub = document.getElementById('arcadeWaveSubtitle');
    const sc = document.getElementById('arcadeWaveScore');
    const bub = document.getElementById('arcadeWaveBubbled');
    if (title) title.textContent = `WAVE ${this.arcadeWave} CLEARED`;
    if (sub) sub.textContent = `Boss checkpoint cleared. Wave ${this.arcadeWave + 1} awaits — Continue (+1 Heart) or Gem Out to bank your score.`;
    if (sc) sc.textContent = String(this.score);
    if (bub) bub.textContent = String(this.bubbledGemsCount);
    if (modal) modal.style.display = 'flex';
  }

  continueArcadeWave() {
    if (this.gameMode !== 'arcade') return;
    this.arcadeWavePending = false;
    const modal = document.getElementById('arcadeWaveModal');
    if (modal) modal.style.display = 'none';
    this.healPlayerHearts(false, 1);
    if (this.playerMode === '2p' && this.player2) {
      this.healPlayerHearts(true, 1);
    }
    this.state = 'playing';
    this.lastTime = performance.now();
    this.updateHUD();
    if (this.audio) this.audio.playSfx('warpPad');
    this.startArcadeWave(this.arcadeWave + 1);
  }

  gemOutArcade() {
    this.arcadeWavePending = false;
    const modal = document.getElementById('arcadeWaveModal');
    if (modal) modal.style.display = 'none';
    if (this.score > this.highScore) {
      this.highScore = this.score;
      SafeStorage.setItem('su_highScore', this.highScore.toString());
    }
    this.showArcadeResultScreen('GEMMED OUT WITH TREASURE!');
  }

  showArcadeResultScreen(headline = 'ARCADE COMPLETE') {
    this.state = 'gameover';
    this.arcadeWavePending = false;
    this.releaseAllInputs();
    if (this.audio) this.audio.stopMusic();
    if (document.body) document.body.classList.remove('in-game');
    const hudEl = document.getElementById('hud');
    if (hudEl) hudEl.style.display = 'none';
    const abEl = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    if (abEl) abEl.style.display = 'none';
    const bhEl = document.getElementById('bossHud');
    if (bhEl) bhEl.style.display = 'none';
    const mapInfo = (typeof ARCADE_MAPS !== 'undefined' && ARCADE_MAPS[this.stageIndex - 1])
      ? ARCADE_MAPS[this.stageIndex - 1]
      : { name: `Arena ${this.stageIndex}` };
    const scr = document.getElementById('arcadeResultScreen');
    const tEl = document.getElementById('arcadeResultTitle');
    const mEl = document.getElementById('arcadeResultMapLabel');
    const sEl = document.getElementById('arcadeResultScore');
    const bEl = document.getElementById('arcadeResultBubbled');
    const wEl = document.getElementById('arcadeResultWaves');
    if (tEl) tEl.textContent = headline;
    if (mEl) mEl.textContent = `Arena: ${mapInfo.name}`;
    if (sEl) sEl.textContent = String(this.score || 0);
    if (bEl) bEl.textContent = String(this.bubbledGemsCount || 0);
    if (wEl) wEl.textContent = String(this.arcadeWave || 1);
    if (scr) scr.style.display = 'flex';
  }

  startStoryEpisodeFlow(epNum) {
    const ep = Math.max(1, Math.min(10, parseInt(epNum, 10) || 1));
    this.stageIndex = ep;
    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.reset(ep, diff, this.pickups);
    this.audio.lastStageIndex = ep;
    this.audio.playStageMusic(ep, false);

    const launchCombat = () => {
      this.state = 'playing';
      this.lastTime = performance.now();
      this.startStageWave();
    };
    const runPuzzleThenCombat = () => {
      const hasDomPuzzle = !!(typeof document !== 'undefined' && document.getElementById('storyPuzzleScreen'));
      if (this.storyMode !== false && typeof STORY_PUZZLE_CONFIGS !== 'undefined' && STORY_PUZZLE_CONFIGS[ep] && hasDomPuzzle) {
        this.startStoryPuzzle(ep, launchCombat);
      } else {
        launchCombat();
      }
    };
    const hasDomCutscene = !!(typeof document !== 'undefined' && document.getElementById('cutsceneScreen'));
    if (this.storyMode !== false && typeof STORY_CUTSCENES !== 'undefined' && STORY_CUTSCENES[ep] && hasDomCutscene) {
      this.playStoryCutscene(STORY_CUTSCENES[ep], runPuzzleThenCombat);
    } else {
      runPuzzleThenCombat();
    }
  }

  playStoryCutscene(sceneObj, onDone) {
    if (!sceneObj || !sceneObj.lines || sceneObj.lines.length === 0) {
      if (onDone) onDone();
      return;
    }
    const screen = document.getElementById('cutsceneScreen');
    if (!screen) {
      if (onDone) onDone();
      return;
    }
    this.cutsceneActive = true;
    this.cutsceneData = sceneObj;
    this.cutsceneIndex = 0;
    this.cutsceneOnDone = onDone || null;
    this.state = 'cutscene';
    this.releaseAllInputs();
    screen.style.display = 'flex';
    this.renderCutsceneLine();
  }

  renderCutsceneLine() {
    if (!this.cutsceneData || !this.cutsceneData.lines) { this.finishCutscene(); return; }
    const line = this.cutsceneData.lines[this.cutsceneIndex];
    if (!line) { this.finishCutscene(); return; }

    const tagEl = document.getElementById('cutsceneEpisodeTag');
    const spEl = document.getElementById('cutsceneSpeaker');
    const txtEl = document.getElementById('cutsceneText');
    const portEl = document.getElementById('cutscenePortrait');
    const nextBtn = document.getElementById('btnCutsceneNext');

    const speaker = (typeof this.resolveStorySpeaker === 'function')
      ? this.resolveStorySpeaker(line)
      : { id: line.w || 'steven', name: (line.w || 'Steven').toUpperCase(), color: '#ff4f8b' };

    if (tagEl) tagEl.textContent = this.cutsceneData.tag || 'STORY CUTSCENE';
    if (spEl) {
      spEl.textContent = speaker.name;
      spEl.style.color = speaker.color || '#ffd700';
    }
    if (txtEl) txtEl.textContent = line.t || '';
    if (portEl) {
      portEl.innerHTML = (typeof getGuardianAvatarHtml === 'function')
        ? getGuardianAvatarHtml(speaker.id, 78)
        : '';
    }
    if (nextBtn) {
      nextBtn.textContent = (this.cutsceneIndex >= this.cutsceneData.lines.length - 1) ? 'CONTINUE ➔' : 'NEXT ▸';
    }
    this.renderCutsceneCanvas(line.scene || 'beach');
  }

  renderCutsceneCanvas(sceneKind = 'beach') {
    const cvs = document.getElementById('cutsceneCanvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const w = cvs.width, h = cvs.height;
    ctx.clearRect(0, 0, w, h);

    // Paint rich atmospheric lore backdrop per cutscene beat
    const palettes = {
      beach: ['#0f172a', '#be185d', '#fb923c'],
      warp: ['#090d26', '#1e3a8a', '#38bdf8'],
      mantle: ['#1f0a0a', '#7f1d1d', '#ef4444'],
      ice: ['#0c1c36', '#1e40af', '#bae6fd'],
      homeworld: ['#1a0b2e', '#581c87', '#e879f9'],
      mecha: ['#0f172a', '#475569', '#f8fafc'],
      pink_merge: ['#3b0764', '#db2777', '#fbcfe8'],
      white_blush: ['#1e293b', '#f472b6', '#ffffff'],
      fountain: ['#064e3b', '#0284c7', '#f9a8d4'],
      era3: ['#1e1b4b', '#ec4899', '#fde047']
    };
    const pal = palettes[sceneKind] || palettes.beach;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(0.58, pal[1]);
    grad.addColorStop(1, pal[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars & Warp Shimmer
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    for (let i = 0; i < 36; i++) {
      const sx = (i * 97 + 41) % w;
      const sy = (i * 53 + 17) % (h * 0.65);
      const r = (i % 3 === 0) ? 2.2 : 1.1;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Scene focal centerpiece
    if (sceneKind === 'pink_merge' || sceneKind === 'white_blush' || sceneKind === 'mecha') {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 3;
      const cx = w / 2, cy = h * 0.48;
      ctx.fillStyle = sceneKind === 'pink_merge' ? 'rgba(255, 118, 178, 0.35)' : 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 82);
      ctx.lineTo(cx + 62, cy);
      ctx.lineTo(cx, cy + 82);
      ctx.lineTo(cx - 62, cy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (sceneKind === 'fountain' || sceneKind === 'era3') {
      const glow = ctx.createRadialGradient(w / 2, h * 0.65, 10, w / 2, h * 0.65, 240);
      glow.addColorStop(0, 'rgba(255, 214, 102, 0.75)');
      glow.addColorStop(0.5, 'rgba(236, 72, 153, 0.35)');
      glow.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    } else {
      // Crystal Warp Pad silhouette
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(w * 0.42, 0, w * 0.16, h * 0.84);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.84, 170, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Horizon ground silhouette
    ctx.fillStyle = 'rgba(10, 15, 32, 0.85)';
    ctx.fillRect(0, h * 0.82, w, h * 0.18);
  }

  advanceCutscene() {
    if (!this.cutsceneActive) return;
    this.cutsceneIndex++;
    if (this.audio) this.audio.playSfx('menuTap');
    if (!this.cutsceneData || this.cutsceneIndex >= this.cutsceneData.lines.length) {
      this.finishCutscene();
    } else {
      this.renderCutsceneLine();
    }
  }

  finishCutscene() {
    this.cutsceneActive = false;
    const screen = document.getElementById('cutsceneScreen');
    if (screen) screen.style.display = 'none';
    const cb = this.cutsceneOnDone;
    this.cutsceneOnDone = null;
    this.cutsceneData = null;
    if (cb) cb();
  }

  // ---- INTERACTIVE STORY GEM PUZZLES (4 DISTINCT SOLVABLE MECHANICS) ----
  getPuzzleEmblemSvg(key, size = 34) {
    const s = size;
    const svgs = {
      rose_shield: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <circle cx="32" cy="32" r="24" fill="#fb7185" stroke="#881337" stroke-width="3"/>
        <circle cx="32" cy="32" r="16" fill="#fda4af" stroke="#be123c" stroke-width="2"/>
        <polygon points="32,20 35.5,28.5 44.5,29 37.5,34.5 40,43.5 32,38.5 24,43.5 26.5,34.5 19.5,29 28.5,28.5" fill="#fff1f2" stroke="#9f1239" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`,
      garnet_gauntlet: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <path d="M18 26 Q18 14 32 14 Q46 14 46 26 L48 44 Q48 52 38 52 L26 52 Q16 52 16 44 Z" fill="#dc2626" stroke="#450a0a" stroke-width="3" stroke-linejoin="round"/>
        <rect x="20" y="16" width="6" height="10" rx="3" fill="#f87171" stroke="#450a0a" stroke-width="1.8"/>
        <rect x="29" y="14" width="6" height="11" rx="3" fill="#f87171" stroke="#450a0a" stroke-width="1.8"/>
        <rect x="38" y="16" width="6" height="10" rx="3" fill="#f87171" stroke="#450a0a" stroke-width="1.8"/>
        <polygon points="32,29 39,36 32,43 25,36" fill="#fde047" stroke="#78350f" stroke-width="1.8"/>
      </svg>`,
      pearl_spear: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <line x1="14" y1="50" x2="40" y2="24" stroke="#bae6fd" stroke-width="5" stroke-linecap="round"/>
        <polygon points="52,12 42,32 37,27 32,22" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="48,16 39,28 36,25" fill="#e0f2fe"/>
        <ellipse cx="32" cy="32" rx="4.5" ry="4.5" fill="#f8fafc" stroke="#0369a1" stroke-width="2"/>
      </svg>`,
      amethyst_whip: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <path d="M16 48 C14 32 28 20 40 24 C48 27 46 39 36 38 C28 37 28 24 38 18 L50 14" fill="none" stroke="#c084fc" stroke-width="5" stroke-linecap="round"/>
        <path d="M16 48 C14 32 28 20 40 24 C48 27 46 39 36 38" fill="none" stroke="#581c87" stroke-width="2" stroke-linecap="round"/>
        <polygon points="52,13 46,19 45,12" fill="#e9d5ff" stroke="#581c87" stroke-width="1.6"/>
        <circle cx="16" cy="48" r="5" fill="#a855f7" stroke="#3b0764" stroke-width="2"/>
      </svg>`,
      star: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <polygon points="32,10 38.5,24.5 54,26 42.5,36.5 45.5,52 32,44.5 18.5,52 21.5,36.5 10,26 25.5,24.5" fill="#facc15" stroke="#78350f" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="32,17 36,26.5 46,27.5 38.5,34 40.5,44 32,39.5" fill="#fef08a" opacity="0.65"/>
      </svg>`,
      diamond: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <polygon points="32,10 52,24 44,52 20,52 12,24" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="32,17 44,26 39,45 25,45 20,26" fill="#bae6fd" opacity="0.65"/>
        <line x1="12" y1="24" x2="20" y2="26" stroke="#0369a1" stroke-width="1.8"/>
        <line x1="52" y1="24" x2="44" y2="26" stroke="#0369a1" stroke-width="1.8"/>
        <line x1="32" y1="10" x2="32" y2="17" stroke="#0369a1" stroke-width="1.8"/>
      </svg>`,
      ice: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <polygon points="32,8 46,20 46,44 32,56 18,44 18,20" fill="#7dd3fc" stroke="#075985" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="32,15 40,23 40,41 32,49 24,41 24,23" fill="#e0f2fe" opacity="0.7"/>
        <line x1="32" y1="8" x2="32" y2="56" stroke="#0284c7" stroke-width="1.8"/>
      </svg>`,
      forge: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <path d="M32 10 C42 22 48 30 48 40 C48 49 41 54 32 54 C23 54 16 49 16 40 C16 32 22 25 25 22 C25 28 29 30 30 24 Z" fill="#fb923c" stroke="#7c2d12" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M32 27 C37 33 40 38 40 43 C40 47 36 50 32 50 C28 50 24 47 24 43 C24 38 28 33 32 27 Z" fill="#fde047"/>
      </svg>`,
      wave: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <path d="M10 44 C14 26 28 16 42 18 C36 22 34 28 38 32 C42 36 50 34 54 28 C52 44 40 52 24 52 C16 52 12 49 10 44 Z" fill="#0ea5e9" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M16 42 C20 30 30 24 37 24" fill="none" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
      orb: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <circle cx="32" cy="32" r="21" fill="#c084fc" stroke="#581c87" stroke-width="2.5"/>
        <ellipse cx="26" cy="24" rx="7" ry="4" transform="rotate(-25 26 24)" fill="#f3e8ff" opacity="0.8"/>
        <polygon points="32,26 36,32 32,38 28,32" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.5"/>
      </svg>`,
      bubble: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <circle cx="32" cy="32" r="21" fill="rgba(244,114,182,0.35)" stroke="#f472b6" stroke-width="3"/>
        <path d="M20 24 A14 14 0 0 1 32 16" fill="none" stroke="#fbcfe8" stroke-width="3" stroke-linecap="round"/>
        <polygon points="32,25 38,32 32,39 26,32" fill="#f9a8d4" stroke="#9d174d" stroke-width="1.5"/>
      </svg>`,
      shield: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <path d="M16 14 L48 14 L48 34 C48 45 32 53 32 53 C32 53 16 45 16 34 Z" fill="#f472b6" stroke="#831843" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="32,22 35,29 42,30 36.5,34.5 38,41.5 32,37.5 26,41.5 27.5,34.5 22,30 29,29" fill="#fef08a"/>
      </svg>`,
      question: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <polygon points="32,12 49,26 42,50 22,50 15,26" fill="rgba(148,163,184,0.16)" stroke="#64748b" stroke-width="2.2" stroke-linejoin="round"/>
        <polygon points="32,23 35,30 42,31 36.5,35.5 38,42 32,38 26,42 27.5,35.5 22,31 29,30" fill="#94a3b8" opacity="0.55"/>
      </svg>`,
      emitter: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <circle cx="24" cy="32" r="13" fill="#f472b6" stroke="#831843" stroke-width="2.5"/>
        <circle cx="24" cy="32" r="6" fill="#fef08a"/>
        <path d="M40 32 L54 32 M47 25 L55 32 L47 39" fill="none" stroke="#fde047" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      blocker: `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">
        <polygon points="16,50 18,22 30,13 46,20 48,50" fill="#334155" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="30,13 46,20 40,36 26,30" fill="#475569"/>
        <line x1="22" y1="36" x2="36" y2="42" stroke="#1e293b" stroke-width="2"/>
      </svg>`
    };
    return svgs[key] || svgs.diamond;
  }

  getConduitPipeSvg(mask, isLit, isSolved) {
    const outerCol = '#1e293b';
    const rimCol = isSolved ? '#34d399' : (isLit ? '#f472b6' : '#64748b');
    const coreCol = isSolved ? '#a7f3d0' : (isLit ? '#fef08a' : '#334155');
    const segs = [];
    if (mask & 1) segs.push({ x: 32, y: 0 });
    if (mask & 2) segs.push({ x: 64, y: 32 });
    if (mask & 4) segs.push({ x: 32, y: 64 });
    if (mask & 8) segs.push({ x: 0, y: 32 });

    const lines = (stroke, width) => segs.map(pt =>
      `<line x1="32" y1="32" x2="${pt.x}" y2="${pt.y}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`
    ).join('');

    return `<svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
      ${lines(outerCol, 18)}
      ${lines(rimCol, 13)}
      ${lines(coreCol, 5)}
      <circle cx="32" cy="32" r="8" fill="${rimCol}" stroke="${outerCol}" stroke-width="2"/>
      <circle cx="32" cy="32" r="3.5" fill="${coreCol}"/>
    </svg>`;
  }

  getMirrorTileSvg(mir, isLit, isSolved) {
    const frameCol = isSolved ? '#34d399' : (isLit ? '#fde047' : '#cbd5e1');
    const glassCol = isSolved ? '#a7f3d0' : (isLit ? '#fef9c3' : '#7dd3fc');
    const coords = mir === '/'
      ? { x1: 14, y1: 50, x2: 50, y2: 14 }
      : { x1: 14, y1: 14, x2: 50, y2: 50 };
    return `<svg viewBox="0 0 64 64" width="46" height="46" aria-hidden="true">
      <line x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}" stroke="#0f172a" stroke-width="11" stroke-linecap="round"/>
      <line x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}" stroke="${frameCol}" stroke-width="7" stroke-linecap="round"/>
      <line x1="${coords.x1}" y1="${coords.y1}" x2="${coords.x2}" y2="${coords.y2}" stroke="${glassCol}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`;
  }

  syncPuzzleHintUI() {
    const box = document.getElementById('puzzleHintBox');
    const textEl = document.getElementById('puzzleHintText');
    const btn = document.getElementById('btnPuzzleHint');
    const visible = !!(this.puzzleState && this.puzzleState.hintVisible);
    const hintText = (this.puzzleState && this.puzzleState.cfg && this.puzzleState.cfg.hint)
      ? this.puzzleState.cfg.hint
      : 'Study the Crystal board carefully and test your pattern step by step.';
    if (textEl) textEl.textContent = hintText;
    if (box) box.style.display = visible ? 'block' : 'none';
    if (btn) {
      btn.textContent = visible ? 'HIDE HINT' : 'SHOW HINT';
      btn.setAttribute('aria-expanded', visible ? 'true' : 'false');
    }
  }

  startStoryPuzzle(epNum, onSolved) {
    const ep = Math.max(1, Math.min(10, parseInt(epNum, 10) || 1));
    const cfg = (typeof STORY_PUZZLE_CONFIGS !== 'undefined' && STORY_PUZZLE_CONFIGS[ep])
      ? STORY_PUZZLE_CONFIGS[ep]
      : {
          kind: 'pattern',
          title: `EPISODE ${ep} TEMPLE SEAL`,
          desc: 'Align the Gem Harmony sequence!',
          hint: 'Watch the chime order closely and repeat the 4 tiles.'
        };

    const screen = document.getElementById('storyPuzzleScreen');
    if (!screen) { if (onSolved) onSolved(); return; }

    this.puzzleActive = true;
    this.state = 'puzzle';
    this.releaseAllInputs();
    this._puzzleGen = (this._puzzleGen || 0) + 1;
    this.puzzleState = {
      ep,
      cfg,
      gen: this._puzzleGen,
      hintVisible: false,
      onSolved: onSolved || null
    };

    const epTagEl = document.getElementById('puzzleEpTag');
    const titleEl = document.getElementById('puzzleTitle');
    const descEl = document.getElementById('puzzleLoreDesc');
    if (epTagEl) epTagEl.textContent = `EPISODE ${ep} · PUZZLE`;
    if (titleEl) titleEl.textContent = cfg.title;
    if (descEl) descEl.textContent = cfg.desc;
    this.syncPuzzleHintUI();
    screen.style.display = 'flex';
    this.buildPuzzleState();
  }

  resetCurrentPuzzle() {
    if (!this.puzzleActive || !this.puzzleState) return;
    if (this.audio) this.audio.playSfx('menuTap');
    this._puzzleGen = (this._puzzleGen || 0) + 1;
    this.puzzleState.gen = this._puzzleGen;
    this.buildPuzzleState();
  }

  skipCurrentPuzzle() {
    if (!this.puzzleActive) return;
    const cb = this.puzzleState ? this.puzzleState.onSolved : null;
    this._puzzleGen = (this._puzzleGen || 0) + 1;
    this.puzzleActive = false;
    this.puzzleState = null;
    this.syncPuzzleHintUI();
    const screen = document.getElementById('storyPuzzleScreen');
    if (screen) screen.style.display = 'none';
    if (cb) cb();
  }

  completeCurrentPuzzle() {
    if (!this.puzzleActive || !this.puzzleState) return;
    const gen = this.puzzleState.gen;
    const statusEl = document.getElementById('puzzleStatusBar');
    if (statusEl) {
      statusEl.textContent = 'GEM SEAL UNLOCKED · +300 BONUS';
      statusEl.style.color = '#34d399';
    }
    this.score = (this.score || 0) + 300;
    this.updateHUD();
    if (this.audio) this.audio.playSfx('victory');
    const cb = this.puzzleState ? this.puzzleState.onSolved : null;
    setTimeout(() => {
      if (this._puzzleGen !== gen) return;
      this.puzzleActive = false;
      this.puzzleState = null;
      this.syncPuzzleHintUI();
      const screen = document.getElementById('storyPuzzleScreen');
      if (screen) screen.style.display = 'none';
      if (cb) cb();
    }, 620);
  }

  shufflePuzzleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  buildPuzzleState() {
    if (!this.puzzleState) return;
    const { cfg, ep } = this.puzzleState;
    const board = document.getElementById('puzzleBoard');
    const status = document.getElementById('puzzleStatusBar');
    if (!board) return;
    board.innerHTML = '';
    if (status) status.style.color = '#7dd3fc';

    if (cfg.kind === 'pattern') {
      const gems = [
        { label: 'ROSE SHIELD', color: '#ff4f8b', key: 'rose_shield' },
        { label: 'GARNET GAUNTLET', color: '#ef4444', key: 'garnet_gauntlet' },
        { label: 'PEARL SPEAR', color: '#38bdf8', key: 'pearl_spear' },
        { label: 'AMETHYST WHIP', color: '#a855f7', key: 'amethyst_whip' }
      ];
      const sequence = this.shufflePuzzleArray([0, 1, 2, 3]);
      this.puzzleState.data = { sequence, input: [], locked: false };
      board.style.gridTemplateColumns = 'repeat(2, 124px)';
      if (status) status.textContent = `Watch closely · Step 0 / ${sequence.length}`;

      const btns = gems.map((g, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'puzzle-tile';
        b.style.width = '124px';
        b.style.height = '94px';
        b.style.gap = '6px';
        b.style.borderColor = g.color;
        b.innerHTML = `${this.getPuzzleEmblemSvg(g.key, 40)}<span style="font-size:10px;letter-spacing:0.6px;color:#e2e8f0;">${g.label}</span>`;
        b.addEventListener('click', () => this.handlePatternTileClick(idx, btns));
        board.appendChild(b);
        return b;
      });
      this.puzzleState.data.btns = btns;
      this.playPatternPreview();
    } else if (cfg.kind === 'memory') {
      const pairs = ep === 6
        ? ['ice', 'forge', 'shield', 'diamond', 'ice', 'forge', 'shield', 'diamond']
        : ['star', 'wave', 'orb', 'bubble', 'star', 'wave', 'orb', 'bubble'];
      const order = this.shufflePuzzleArray(pairs);
      this.puzzleState.data = { deck: order, revealed: [], matched: new Set(), busy: false };
      board.style.gridTemplateColumns = 'repeat(4, 74px)';
      if (status) status.textContent = 'Pairs Matched: 0 / 4 · Click two tiles to flip';

      const qMarkup = this.getPuzzleEmblemSvg('question', 36);
      order.forEach((_, idx) => {
        const t = document.createElement('button');
        t.type = 'button';
        t.className = 'puzzle-tile';
        t.style.width = '74px';
        t.style.height = '74px';
        t.innerHTML = qMarkup;
        t.addEventListener('click', () => this.handleMemoryTileClick(idx));
        board.appendChild(t);
      });
    } else if (cfg.kind === 'conduit') {
      // RNG shortest monotone circuit from (0,0) W-inlet to (2,2) E-outlet
      const steps = this.shufflePuzzleArray(['R', 'R', 'D', 'D']);
      const path = [0];
      let pr = 0, pc = 0;
      for (const s of steps) {
        if (s === 'R') pc += 1;
        else pr += 1;
        path.push(pr * 3 + pc);
      }
      const maskToPiece = {
        10: { type: 'straight', base: 10, sol: 0 },
        5:  { type: 'straight', base: 10, sol: 1 },
        6:  { type: 'elbow',    base: 6,  sol: 0 },
        12: { type: 'elbow',    base: 6,  sol: 1 },
        9:  { type: 'elbow',    base: 6,  sol: 2 },
        3:  { type: 'elbow',    base: 6,  sol: 3 }
      };
      const pathSet = new Set(path);
      const cells = Array.from({ length: 9 }, () => ({
        type: Math.random() < 0.35 ? 'straight' : 'elbow',
        base: 6,
        sol: 0,
        rot: Math.floor(Math.random() * 4),
        isPath: false
      }));
      cells.forEach(c => { if (c.type === 'straight') c.base = 10; });

      for (let k = 0; k < path.length; k++) {
        const idx = path[k];
        const r = Math.floor(idx / 3), c = idx % 3;
        let inBit = 8;
        if (k > 0) {
          const prev = path[k - 1];
          const prPrev = Math.floor(prev / 3), pcPrev = prev % 3;
          inBit = (prPrev < r) ? 1 : (pcPrev < c ? 8 : (prPrev > r ? 4 : 2));
        }
        let outBit = 2;
        if (k < path.length - 1) {
          const next = path[k + 1];
          const nrNext = Math.floor(next / 3), ncNext = next % 3;
          outBit = (ncNext > c) ? 2 : (nrNext > r ? 4 : (ncNext < c ? 8 : 1));
        }
        const piece = maskToPiece[inBit | outBit] || maskToPiece[6];
        cells[idx] = {
          type: piece.type,
          base: piece.base,
          sol: piece.sol,
          rot: piece.sol,
          isPath: true
        };
      }

      // Scramble 3 path tiles by only 1-2 clicks so each play is intuitive & fresh
      const scramblePick = this.shufflePuzzleArray(path).slice(0, 3);
      for (const idx of scramblePick) {
        const cell = cells[idx];
        const offset = cell.type === 'straight' ? 1 : (Math.random() < 0.65 ? 3 : 2);
        cell.rot = (cell.sol + offset) % 4;
      }

      this.puzzleState.data = { cells, solutionPath: path, pathSet, lit: new Set() };
      if (this.evaluateConduitPower()) {
        cells[0].rot = (cells[0].rot + 1) % 4;
      }
      board.style.gridTemplateColumns = 'repeat(3, 80px)';
      this.renderConduitBoard();
    } else if (cfg.kind === 'mirrors') {
      // RNG 4x4 beam path: Emitter (0,0) East -> corner mirrors '\\' -> Diamond Lock (3,3)
      const c1 = 1 + Math.floor(Math.random() * 2);
      const r1 = 1 + Math.floor(Math.random() * 3);
      const solutions = {};
      const beamCells = new Set(['0,0']);
      for (let c = 1; c <= c1; c++) beamCells.add(`0,${c}`);
      solutions[`0,${c1}`] = '\\';
      for (let r = 1; r <= r1; r++) beamCells.add(`${r},${c1}`);
      solutions[`${r1},${c1}`] = '\\';
      if (r1 < 3) {
        for (let c = c1 + 1; c <= 3; c++) beamCells.add(`${r1},${c}`);
        solutions[`${r1},3`] = '\\';
        for (let r = r1 + 1; r <= 3; r++) beamCells.add(`${r},3`);
      } else {
        for (let c = c1 + 1; c <= 3; c++) beamCells.add(`3,${c}`);
      }

      const spareCells = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const k = `${r},${c}`;
          if (!beamCells.has(k) && k !== '0,0' && k !== '3,3') spareCells.push(k);
        }
      }
      const shuffledSpare = this.shufflePuzzleArray(spareCells);
      const blockers = shuffledSpare.slice(0, 2);
      const mirrors = { ...solutions };
      shuffledSpare.slice(2, 4).forEach(k => {
        mirrors[k] = '/';
      });

      const solKeys = this.shufflePuzzleArray(Object.keys(solutions));
      const flipCount = Math.min(solKeys.length, 2 + Math.floor(Math.random() * 2));
      for (let i = 0; i < flipCount; i++) {
        mirrors[solKeys[i]] = '/';
      }
      // Always flip the first corner mirror so initial beam exits North and never pre-solves via decoys
      mirrors[`0,${c1}`] = '/';

      this.puzzleState.data = {
        size: 4,
        mirrors,
        solutions,
        blockers: new Set(blockers),
        beam: new Set(),
        reached: false
      };
      board.style.gridTemplateColumns = 'repeat(4, 68px)';
      this.renderMirrorBoard();
    }
  }

  playPatternPreview() {
    if (!this.puzzleActive || !this.puzzleState || this.puzzleState.cfg.kind !== 'pattern') return;
    const gen = this.puzzleState.gen;
    const d = this.puzzleState.data;
    d.locked = true;
    d.input = [];
    const status = document.getElementById('puzzleStatusBar');
    if (status) status.textContent = 'Watch closely · Temple gems are chiming';
    d.sequence.forEach((padIdx, step) => {
      setTimeout(() => {
        if (!this.puzzleActive || !this.puzzleState || this.puzzleState.gen !== gen || !d.btns || !d.btns[padIdx]) return;
        const btn = d.btns[padIdx];
        btn.classList.add('lit');
        if (status) status.textContent = `Watch closely · Step ${step + 1} / ${d.sequence.length}`;
        if (this.audio) this.audio.playSfx('menuTap');
        setTimeout(() => btn.classList.remove('lit'), 380);
        if (step === d.sequence.length - 1) {
          setTimeout(() => {
            if (!this.puzzleActive || !this.puzzleState || this.puzzleState.gen !== gen) return;
            d.locked = false;
            if (status) status.textContent = `Your turn · Tap Step 1 / ${d.sequence.length}`;
          }, 460);
        }
      }, step * 580 + 200);
    });
  }

  handlePatternTileClick(idx, btns) {
    if (!this.puzzleActive || !this.puzzleState || this.puzzleState.cfg.kind !== 'pattern') return;
    const gen = this.puzzleState.gen;
    const d = this.puzzleState.data;
    if (d.locked) return;
    const btn = btns[idx];
    if (btn) {
      btn.classList.add('lit');
      setTimeout(() => btn.classList.remove('lit'), 220);
    }
    const expected = d.sequence[d.input.length];
    if (idx === expected) {
      d.input.push(idx);
      if (this.audio) this.audio.playSfx('menuTap');
      const status = document.getElementById('puzzleStatusBar');
      if (status) status.textContent = `Harmony ${d.input.length} / ${d.sequence.length} Matched`;
      if (d.input.length >= d.sequence.length) {
        this.completeCurrentPuzzle();
      }
    } else {
      if (this.audio) this.audio.playSfx('hit');
      const status = document.getElementById('puzzleStatusBar');
      if (status) status.textContent = 'Wrong chime · Replaying sequence';
      d.input = [];
      setTimeout(() => {
        if (this.puzzleActive && this.puzzleState && this.puzzleState.gen === gen) {
          this.playPatternPreview();
        }
      }, 500);
    }
  }

  handleMemoryTileClick(idx) {
    if (!this.puzzleActive || !this.puzzleState || this.puzzleState.cfg.kind !== 'memory') return;
    const gen = this.puzzleState.gen;
    const d = this.puzzleState.data;
    if (d.busy || d.matched.has(idx) || d.revealed.includes(idx)) return;
    const tiles = document.querySelectorAll('#puzzleBoard .puzzle-tile');
    d.revealed.push(idx);
    if (tiles[idx]) {
      tiles[idx].innerHTML = this.getPuzzleEmblemSvg(d.deck[idx], 40);
      tiles[idx].classList.add('lit');
    }
    if (this.audio) this.audio.playSfx('menuTap');

    if (d.revealed.length === 1) {
      const status = document.getElementById('puzzleStatusBar');
      if (status) status.textContent = `Pairs Matched: ${d.matched.size / 2} / ${d.deck.length / 2} · Pick a matching tile`;
    } else if (d.revealed.length === 2) {
      const [a, b] = d.revealed;
      if (d.deck[a] === d.deck[b]) {
        d.matched.add(a);
        d.matched.add(b);
        d.revealed = [];
        [a, b].forEach(i => tiles[i] && tiles[i].classList.add('solved'));
        const status = document.getElementById('puzzleStatusBar');
        if (status) status.textContent = `Pairs Matched: ${d.matched.size / 2} / ${d.deck.length / 2}`;
        if (d.matched.size === d.deck.length) {
          this.completeCurrentPuzzle();
        }
      } else {
        d.busy = true;
        setTimeout(() => {
          if (!this.puzzleActive || !this.puzzleState || this.puzzleState.gen !== gen) return;
          d.revealed = [];
          d.busy = false;
          const qMarkup = this.getPuzzleEmblemSvg('question', 36);
          [a, b].forEach(i => {
            if (tiles[i] && !d.matched.has(i)) {
              tiles[i].innerHTML = qMarkup;
              tiles[i].classList.remove('lit');
            }
          });
        }, 760);
      }
    }
  }

  getConduitMask(cell) {
    let m = cell.base;
    for (let r = 0; r < (cell.rot % 4); r++) {
      m = ((m << 1) | (m >> 3)) & 15;
    }
    return m;
  }

  evaluateConduitPower() {
    if (!this.puzzleState || this.puzzleState.cfg.kind !== 'conduit') return false;
    const d = this.puzzleState.data;
    const lit = new Set();
    const firstMask = this.getConduitMask(d.cells[0]);
    if ((firstMask & 8) !== 0) {
      const queue = [0];
      lit.add(0);
      while (queue.length) {
        const cur = queue.shift();
        const r = Math.floor(cur / 3), c = cur % 3;
        const mask = this.getConduitMask(d.cells[cur]);
        const dirs = [
          { dr: -1, dc: 0, outBit: 1, inBit: 4 },
          { dr: 0, dc: 1, outBit: 2, inBit: 8 },
          { dr: 1, dc: 0, outBit: 4, inBit: 1 },
          { dr: 0, dc: -1, outBit: 8, inBit: 2 }
        ];
        for (const dir of dirs) {
          if ((mask & dir.outBit) === 0) continue;
          const nr = r + dir.dr, nc = c + dir.dc;
          if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
          const ni = nr * 3 + nc;
          if (lit.has(ni)) continue;
          if ((this.getConduitMask(d.cells[ni]) & dir.inBit) !== 0) {
            lit.add(ni);
            queue.push(ni);
          }
        }
      }
    }
    d.lit = lit;
    return lit.has(8) && (this.getConduitMask(d.cells[8]) & 2) !== 0;
  }

  renderConduitBoard() {
    const board = document.getElementById('puzzleBoard');
    const status = document.getElementById('puzzleStatusBar');
    if (!board || !this.puzzleState || this.puzzleState.cfg.kind !== 'conduit') return;
    const d = this.puzzleState.data;
    const isSolved = this.evaluateConduitPower();
    board.innerHTML = '';

    d.cells.forEach((cell, idx) => {
      const m = this.getConduitMask(cell);
      const isLit = d.lit.has(idx);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'puzzle-tile' + (isLit ? ' lit' : '') + (isSolved && isLit ? ' solved' : '');
      btn.style.width = '80px';
      btn.style.height = '80px';
      const tag = idx === 0
        ? '<small style="position:absolute;top:3px;left:5px;font-size:9px;font-weight:800;letter-spacing:0.5px;color:#38bdf8;pointer-events:none;">➔ IN</small>'
        : idx === 8
          ? '<small style="position:absolute;bottom:3px;right:5px;font-size:9px;font-weight:800;letter-spacing:0.5px;color:#34d399;pointer-events:none;">OUT ➔</small>'
          : '';
      btn.innerHTML = `${tag}${this.getConduitPipeSvg(m, isLit, isSolved)}`;
      btn.addEventListener('click', () => {
        if (!this.puzzleActive) return;
        cell.rot = (cell.rot + 1) % 4;
        if (this.audio) this.audio.playSfx('menuTap');
        this.renderConduitBoard();
      });
      board.appendChild(btn);
    });
    if (status) {
      if (isSolved) {
        status.textContent = 'CONDUIT ALIGNED';
      } else if (!d.lit.has(0)) {
        status.textContent = 'Step 1: Click ➔ IN (top-left) so its pipe opens LEFT to catch power';
      } else {
        status.textContent = `Power active (${d.lit.size} lit) · Click dark pipes next to pink flow toward OUT ➔`;
      }
    }
    if (isSolved && this.puzzleActive) this.completeCurrentPuzzle();
  }

  evaluateMirrorBeam() {
    if (!this.puzzleState || this.puzzleState.cfg.kind !== 'mirrors') return false;
    const d = this.puzzleState.data;
    d.beam = new Set();
    let r = 0, c = 0, dir = 1; // 0:N, 1:E, 2:S, 3:W
    const dr = [-1, 0, 1, 0], dc = [0, 1, 0, -1];
    for (let steps = 0; steps < 25; steps++) {
      if (r < 0 || r >= d.size || c < 0 || c >= d.size) break;
      const key = `${r},${c}`;
      if (d.blockers.has(key)) break;
      d.beam.add(key);
      if (r === d.size - 1 && c === d.size - 1) {
        d.reached = true;
        return true;
      }
      const mir = d.mirrors[key];
      if (mir === '/') {
        dir = dir === 1 ? 0 : dir === 0 ? 1 : dir === 2 ? 3 : 2;
      } else if (mir === '\\') {
        dir = dir === 1 ? 2 : dir === 2 ? 1 : dir === 0 ? 3 : 0;
      }
      r += dr[dir];
      c += dc[dir];
    }
    d.reached = false;
    return false;
  }

  renderMirrorBoard() {
    const board = document.getElementById('puzzleBoard');
    const status = document.getElementById('puzzleStatusBar');
    if (!board || !this.puzzleState || this.puzzleState.cfg.kind !== 'mirrors') return;
    const d = this.puzzleState.data;
    const reached = this.evaluateMirrorBeam();
    board.innerHTML = '';

    for (let r = 0; r < d.size; r++) {
      for (let c = 0; c < d.size; c++) {
        const key = `${r},${c}`;
        const mir = d.mirrors[key];
        const isBlk = d.blockers.has(key);
        const isLit = d.beam.has(key);
        const isStart = (r === 0 && c === 0);
        const isEnd = (r === d.size - 1 && c === d.size - 1);

        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'puzzle-tile' + (isLit ? ' lit' : '') + (reached && isLit ? ' solved' : '');
        tile.style.width = '68px';
        tile.style.height = '68px';

        if (isStart) {
          tile.innerHTML = `${this.getPuzzleEmblemSvg('emitter', 36)}<small style="position:absolute;top:2px;left:4px;font-size:8px;font-weight:800;color:#38bdf8;pointer-events:none;">IN ➔</small>`;
          tile.disabled = true;
        } else if (isEnd) {
          tile.innerHTML = `${this.getPuzzleEmblemSvg('diamond', 34)}<small style="position:absolute;bottom:2px;right:4px;font-size:8px;font-weight:800;color:${reached ? '#34d399' : '#38bdf8'};pointer-events:none;">LOCK</small>`;
          tile.style.borderColor = reached ? '#34d399' : '#38bdf8';
          tile.disabled = true;
        } else if (isBlk) {
          tile.innerHTML = this.getPuzzleEmblemSvg('blocker', 36);
          tile.disabled = true;
        } else if (mir) {
          tile.innerHTML = this.getMirrorTileSvg(mir, isLit, reached);
          tile.addEventListener('click', () => {
            if (!this.puzzleActive) return;
            d.mirrors[key] = d.mirrors[key] === '/' ? '\\' : '/';
            if (this.audio) this.audio.playSfx('menuTap');
            this.renderMirrorBoard();
          });
        } else {
          tile.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="${isLit ? 5 : 2.5}" fill="${isLit ? '#fde047' : '#64748b'}" opacity="${isLit ? '0.95' : '0.45'}"/></svg>`;
          tile.disabled = true;
        }
        board.appendChild(tile);
      }
    }
    if (status) {
      status.textContent = reached
        ? 'DIAMOND LOCK ILLUMINATED'
        : `Beam fires RIGHT from IN ➔ · Click / or \\ mirrors to reach LOCK (${d.beam.size} lit)`;
    }
    if (reached && this.puzzleActive) this.completeCurrentPuzzle();
  }

  showPuzzleHint() {
    if (!this.puzzleActive || !this.puzzleState) return;
    this.puzzleState.hintVisible = !this.puzzleState.hintVisible;
    this.syncPuzzleHintUI();
    if (this.audio) this.audio.playSfx('menuTap');
  }

  bindCreditsHoldControls() {
    if (this._creditsHoldBound) return;
    this._creditsHoldBound = true;
    const speedBtn = document.getElementById('btnCreditsSpeed');
    const viewport = document.querySelector('#creditsScreen .credits-viewport');
    const startFast = (e) => {
      if (!this.creditsActive) return;
      if (e && e.cancelable && e.type === 'touchstart') e.preventDefault();
      this.setCreditsSpeedUp(true);
    };
    const stopFast = () => {
      if (this.creditsSpeedUp) this.setCreditsSpeedUp(false);
    };
    [speedBtn, viewport].forEach((target) => {
      if (!target) return;
      target.addEventListener('pointerdown', startFast);
      target.addEventListener('mousedown', startFast);
      target.addEventListener('touchstart', startFast, { passive: false });
      target.addEventListener('pointerleave', stopFast);
      target.addEventListener('pointercancel', stopFast);
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerup', stopFast);
      window.addEventListener('mouseup', stopFast);
      window.addEventListener('touchend', stopFast);
      window.addEventListener('blur', stopFast);
      window.addEventListener('keydown', (e) => {
        if (!this.creditsActive) return;
        if (e.code === 'Space' || e.code === 'ArrowDown') {
          e.preventDefault();
          this.setCreditsSpeedUp(true);
        }
      });
      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowDown') stopFast();
      });
    }
  }

  setCreditsSpeedUp(active) {
    this.creditsSpeedUp = !!active;
    this.creditsSpeed = this.creditsSpeedUp ? 4 : 1;
    const speedBtn = document.getElementById('btnCreditsSpeed');
    if (speedBtn) {
      if (this.creditsSpeedUp) {
        speedBtn.classList.add('fast-active');
        speedBtn.textContent = '⏩ SPEEDING UP (4X)';
      } else {
        speedBtn.classList.remove('fast-active');
        speedBtn.textContent = 'HOLD TO SPEED UP (4X)';
      }
    }
  }

  openCreditsScreen() {
    this.hideAllScreens();
    this.creditsActive = true;
    this.state = 'credits';
    this.setCreditsSpeedUp(false);
    this.bindCreditsHoldControls();
    this.releaseAllInputs();
    const screen = document.getElementById('creditsScreen');
    const track = document.getElementById('creditsTrack');
    const viewport = document.querySelector('#creditsScreen .credits-viewport');
    if (screen) screen.style.display = 'flex';
    const vpH = (viewport && viewport.clientHeight) ? viewport.clientHeight : 520;
    this.creditsScrollY = Math.round(vpH * 0.32);
    if (track) {
      track.style.animation = 'none';
      track.style.transform = `translate3d(0, ${this.creditsScrollY}px, 0)`;
    }
    this._creditsLastTs = 0;
    if (this._creditsRaf) cancelAnimationFrame(this._creditsRaf);
    const stepCredits = (ts) => {
      if (!this.creditsActive) {
        this._creditsRaf = 0;
        return;
      }
      if (!this._creditsLastTs) this._creditsLastTs = ts;
      const dt = Math.min(0.05, Math.max(0.001, (ts - this._creditsLastTs) / 1000));
      this._creditsLastTs = ts;
      const tr = document.getElementById('creditsTrack');
      const vp = document.querySelector('#creditsScreen .credits-viewport');
      const curVpH = (vp && vp.clientHeight) ? vp.clientHeight : 520;
      const trH = (tr && tr.scrollHeight) ? tr.scrollHeight : 1400;
      const pxPerSec = this.creditsSpeedUp ? 220 : 44;
      this.creditsScrollY -= pxPerSec * dt;
      if (this.creditsScrollY < -(trH + 40)) {
        this.creditsScrollY = curVpH - 30;
      }
      if (tr) tr.style.transform = `translate3d(0, ${this.creditsScrollY.toFixed(1)}px, 0)`;
      this._creditsRaf = requestAnimationFrame(stepCredits);
    };
    this._creditsRaf = requestAnimationFrame(stepCredits);
    if (this.audio) {
      this.audio.isManuallyPaused = false;
      this.audio.playTrackById('intro_launch', false);
    }
  }

  toggleCreditsSpeed() {
    this.setCreditsSpeedUp(!this.creditsSpeedUp);
  }

  closeCreditsScreen() {
    this.creditsActive = false;
    this.setCreditsSpeedUp(false);
    if (this._creditsRaf) {
      cancelAnimationFrame(this._creditsRaf);
      this._creditsRaf = 0;
    }
    const screen = document.getElementById('creditsScreen');
    if (screen) screen.style.display = 'none';
    this.showTitleScreen();
  }
}
// Bulletproof Game Bootstrapper (works whether DOM is loading, interactive, or complete)
// ---------------------------------------------------------------------------
// RESPONSIVE STAGE SCALING
// The game is authored at a fixed 1280x720. Scaling the whole stage (canvas, HUD,
// menus) as one unit makes the native window and every browser behave identically
// at any window size, with no HUD overflow on letterboxed viewports.
// ---------------------------------------------------------------------------
function fitGameToViewport() {
  const w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1280;
  const h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 720;
  const preset = (typeof window !== 'undefined' && window.__suResolutionPreset) || 'auto';
  let scale = Math.max(0.35, Math.min(w / 1280, h / 720));
  if (preset !== 'auto' && preset.includes('x')) {
    const [rw, rh] = preset.split('x').map(n => parseInt(n, 10) || 0);
    if (rw > 0 && rh > 0) {
      scale = Math.max(0.35, Math.min(w / 1280, h / 720, rw / 1280, rh / 720));
    }
  }
  document.documentElement.style.setProperty('--gc-scale', String(scale));
}

// ---------------------------------------------------------------------------
// THEMED DROPDOWNS
// Native <select> widgets are painted by the platform (WebKitGTK ignores most CSS on
// them, which is why the jukebox turned white-on-white in the desktop window). Each
// select is kept in the DOM for its value/change API, but hidden behind a fully
// styled dropdown so the control looks identical in every browser and native shell.
// ---------------------------------------------------------------------------
function enhanceSelect(select) {
  if (!select || select.dataset.suEnhanced === 'true') return;
  select.dataset.suEnhanced = 'true';

  const wrap = document.createElement('div');
  wrap.className = 'su-dropdown';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'su-dropdown-btn';

  const label = document.createElement('span');
  label.className = 'su-dropdown-label';

  const chevron = document.createElement('span');
  chevron.className = 'su-dropdown-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '▾';

  btn.appendChild(label);
  btn.appendChild(chevron);

  const list = document.createElement('div');
  list.className = 'su-dropdown-list';
  list.setAttribute('role', 'listbox');

  wrap.appendChild(btn);
  wrap.appendChild(list);
  select.parentNode.insertBefore(wrap, select);
  select.classList.add('su-native-hidden');

  const close = () => wrap.classList.remove('open');
  const isOpen = () => wrap.classList.contains('open');

  const syncLabel = () => {
    const opt = select.options[select.selectedIndex];
    label.textContent = opt ? opt.textContent : '';
    list.querySelectorAll('.su-dropdown-item').forEach((item, i) => {
      item.classList.toggle('selected', i === select.selectedIndex);
    });
  };

  const rebuild = () => {
    list.innerHTML = '';
    Array.from(select.options).forEach((opt, index) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'su-dropdown-item';
      item.textContent = opt.textContent;
      item.setAttribute('role', 'option');
      if (index === select.selectedIndex) item.classList.add('selected');
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        select.selectedIndex = index;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncLabel();
        close();
      });
      list.appendChild(item);
    });
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen()) { close(); return; }
    rebuild();
    wrap.classList.add('open');
  });

  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  select.addEventListener('change', syncLabel);

  select.syncDropdownLabel = syncLabel;
  syncLabel();
}

function enhanceAllSelects() {
  document.querySelectorAll('select.su-select').forEach(enhanceSelect);
}

function bootStevenUniverseGame() {
  if (window.__suGameInitialized) return;
  window.__suGameInitialized = true;

  try {
    const game = new StevenUniverseGame();
    enhanceAllSelects();
    game.start();
    window.game = game;
    console.log('⭐ Steven Universe: Crystal Guardians Unleashed initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize Steven Universe game:', err);
    const errBox = document.createElement('div');
    errBox.style.cssText = 'position:fixed;bottom:10px;left:10px;right:10px;background:#ef4444;color:#fff;padding:12px;border-radius:8px;font-family:sans-serif;font-size:12px;z-index:99999;box-shadow:0 4px 15px rgba(0,0,0,0.5);';
    errBox.innerHTML = `⚠️ <b>Game Initialization Alert:</b> ${err.message || err}`;
    if (document.body) document.body.appendChild(errBox);
  }

  // Register Service Worker for 100% offline play on Android & Xiaomi
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      console.log('⭐ Steven Universe ServiceWorker registered:', reg.scope);
    }).catch((err) => {
      console.warn('ServiceWorker registration error:', err);
    });
  }
}

window.addEventListener('resize', fitGameToViewport);
window.addEventListener('orientationchange', fitGameToViewport);
window.addEventListener('fullscreenchange', fitGameToViewport);
if (typeof ResizeObserver === 'function' && document.documentElement) {
  try {
    new ResizeObserver(() => fitGameToViewport()).observe(document.documentElement);
  } catch (e) {}
}
fitGameToViewport();
setTimeout(fitGameToViewport, 60);
setTimeout(fitGameToViewport, 220);
setTimeout(fitGameToViewport, 500);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fitGameToViewport);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootStevenUniverseGame);
} else {
  // DOM is already parsed (interactive or complete), boot immediately!
  bootStevenUniverseGame();
}
