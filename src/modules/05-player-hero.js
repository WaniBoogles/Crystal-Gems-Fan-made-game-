class PlayerHero {
  constructor(groundY, playerId = 'p1', stageWidth = 2600) {
    this.groundY = (typeof groundY === 'number' && !isNaN(groundY)) ? groundY : 600;
    this.playerId = playerId;
    this.stageWidth = stageWidth;
    this.x = (playerId === 'p2') ? 340 : 200;
    this.currentPlatform = null;
    this.landSquash = 0;      // 1 right after a fall, decays into a squash/stretch
    this.runDustTimer = 0;
    this.wasGrounded = true;
    this.dropThroughTimer = 0;
    this.y = groundY;
    this.vx = 0;
    this.vy = 0;
    this.width = 46;
    this.height = 76;
    this.facing = 1;
    this.isGrounded = true;

    this.activeChar = 'steven';

    this.isAttacking = false;
    this.attackFrame = 0;
    this.attackCombo = 0;
    this.attackType = 'J';
    this.attackCooldown = 0;
    this.specialCooldown = 0;
    this.skillCooldown = 0;

    // Signature per-Guardian combo-chain state: timing window, step impulses, reach, damage and traits
    this.comboStep = 0;
    this.comboStepTimer = 0;
    this.comboLinkBonus = 0;
    this.attackDamageMult = 1;
    this.attackRangeBonus = 0;
    this.attackKnockMult = 1;
    this.attackStyle = 'guardBrawler';
    this.attackGuardTimer = 0;
    this.attackSuperArmorTimer = 0;
    this.attackPullIn = false;
    this.attackLiftY = 0;
    this.attackArmorBreak = false;
    this.comboImpulseVx = 0;
    this.comboImpulseTimer = 0;
    this.comboMoveName = '';

    // Double-Tap Sprint / Speed-Run state
    this.isSprinting = false;
    this.sprintBurstTimer = 0;

    // Steven Bubble Shield state (Fully movable!)
    this.isShielding = false;
    this.bubbleTimer = 0;

    // Amethyst Spin Dash state (Smooth & Fluid!)
    this.isSpinDashing = false;
    this.spinDashTimer = 0;

    // Action Animation System (Moving animations for Punch, Throw, Shield, Heal, Skills)
    this.actionType = null; // 'punch', 'throw', 'shield', 'heal', 'skill'
    this.actionTimer = 0;
    this.actionDuration = 0.28;
    // Per-swing melee hit registry (prevents duplicate frame-by-frame hits per swing)
    this._swingId = 0;
    this._swingHitSet = new Set();

    this.invulnerableTimer = 0;
    this.walkAnim = 0;

    // Steven Universe Future: Pink Overdrive / Diamond Hyper State
    this.isPinkOverdrive = false;
    this.pinkOverdriveTimer = 0;
    this.afterimages = [];
    this.afterimageTimer = 0;

    // Universal Dodge / Evasive Dash System (Dedicated animation for all 8 Gems!)
    this.isDodging = false;
    this.dodgeTimer = 0;
    this.dodgeDuration = 0.30;
    this.dodgeCooldown = 0;
    this.dodgeDirection = 1;
    this.dodgeVx = 0;

    // Acrobatics & Jump Enhancements (Reach platforms effortlessly!)
    this.canDoubleJump = true;
    this.jumpDebounce = false;
    this.inputBuffer = null; // 5-frame input buffer ({ action, timer })

    // Canonical Gem Fusion Attributes
    this.isFusion = false;
    this.fusionKey = null;
    this.fusionData = null;
    this.isMergedInFusion = false;
    this.hasSynergyBuff = false;

    // Lore-Accurate Knockout & Gem Poofing System
    this.isFallen = false;
    this.fallenType = null; // 'lie_down' for Steven/Connie, 'poofed' for Gems
    this.fallenTimer = 0;
    this.reviveTimer = 0;
    this.reviveTotal = 0;
    this.isReforming = false;
    this.reformProgress = 0;
    this.isPinkRevived = false;

    // Advanced Combat & Acrobatic Attributes
    this.parryWindow = 0;
    this.prevShieldPressed = false;
    this.isWallSliding = false;
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.gameRef = null;

    // Lore-Accurate Unique Passive Ability States (All 10 Guardians!)
    this.futureVisionTimer = 0;      // Garnet: auto-parry charge (7s)
    this.futureVisionReady = true;
    this.counterBuffTimer = 0;       // Garnet: +35% counter damage window
    this.momentumStacks = 0;         // Amethyst: up to 5 stacks (+speed/+dmg)
    this.momentumDecayTimer = 0;
    this.precisionHitCount = 0;      // Pearl: every 3rd hit = 1.6x crit + CDR
    this.forgeHitCount = 0;          // Bismuth: every 3rd hit = Molten Burn
    this.orbitZapTimer = 0;          // Peridot: orbiting metal shards auto-zap
    this.sanctuaryHealTimer = 0;     // Rose: periodic healing petals
    this.riposteTimer = 0;           // Connie: dodge/finisher +35% crit & speed
    this.spikeBubbleTickTimer = 0;   // Steven: [S] Spiked Rose Bubble contact thorns
  }

  switchCharacter(charName, audioEngine, particles) {
    const valid = ['steven', 'garnet', 'amethyst', 'pearl', 'bismuth', 'peridot', 'lapis', 'rose', 'connie', 'jasper'];
    if (valid.includes(charName)) {
      this.activeChar = charName;
      this.isShielding = false;
      this.isSpinDashing = false;
      this.isFusion = false;
      this.fusionKey = null;
      this.fusionData = null;
      this.isMergedInFusion = false;
      this.hasSynergyBuff = false;
      this.isFallen = false;
      this.fallenType = null;
      this.fallenTimer = 0;
      this.reviveTimer = 0;
      this.reviveTotal = 0;
      this.isReforming = false;
      this.reformProgress = 0;
      if (charName !== 'connie') this.isPinkRevived = false;
      this.actionType = null;
      this.actionTimer = 0;
      this.vx = 0;
      if (audioEngine) audioEngine.playSfx('switch');
      if (particles) {
        particles.addSparkle(this.x, this.y - 40, '#ffd700', 16, 5);
        particles.addPoof(this.x, this.y - 35, '#ff94ba');
      }
    }
  }

  // --- GEM COMBAT TYPES -----------------------------------------------------
  // The element channelled by a given move slot ('j' | 'k' | 'l').
  getMoveType(slot = 'j') {
    const key = String(slot || 'j').toLowerCase();
    if (this.isFusion && this.fusionData) {
      const fusionSet = FUSION_MOVE_TYPES[this.fusionData.id];
      if (fusionSet && fusionSet[key]) return fusionSet[key];
    }
    const set = HERO_MOVE_TYPES[this.activeChar] || HERO_MOVE_TYPES.steven;
    return set[key] || 'normal';
  }

  // Canonical typing from the roster dossier (lowercased for the matchup chart).
  getTypeList() {
    // A fusion carries both partners' gem types, so either partner's element gets STAB.
    if (this.isFusion && this.fusionData && Array.isArray(this.fusionData.gems)) {
      const merged = [];
      this.fusionData.gems.forEach(gemId => {
        const d = (typeof GUARDIAN_DATA !== 'undefined') ? GUARDIAN_DATA[gemId] : null;
        ((d && d.types) || []).forEach(t => {
          const key = String(t).toLowerCase();
          if (!merged.includes(key)) merged.push(key);
        });
      });
      if (merged.length) return merged;
    }
    const data = (typeof GUARDIAN_DATA !== 'undefined' && GUARDIAN_DATA[this.activeChar]) || null;
    const raw = (data && data.types) || ['FAIRY', 'PSYCHIC'];
    return raw.map(t => String(t).toLowerCase());
  }

  // Same-type attack bonus, exactly like the games the chart comes from.
  getStabMultiplier(slot = 'j') {
    const moveType = this.getMoveType(slot);
    return this.getTypeList().includes(moveType) ? 1.2 : 1.0;
  }

  getCombatStats() {
    if (typeof getHeroCombatStats === 'function') {
      return getHeroCombatStats(this.activeChar, (this.isFusion && this.fusionData) ? this.fusionData : null, !!this.isPinkRevived);
    }
    return { hp: 140, attack: 34, magic: 36, defense: 35, critChance: 0.16, critDamage: 1.65 };
  }

  activatePinkOverdrive(audioOrDuration = 12.0, particles = null) {
    this.isPinkOverdrive = true;
    this.pinkOverdriveTimer = typeof audioOrDuration === 'number' ? audioOrDuration : 12.0;
    this.invulnerableTimer = 1.0;
    const audio = (audioOrDuration && typeof audioOrDuration.playSfx === 'function') ? audioOrDuration : null;
    if (audio) audio.playSfx('overdrive');
    if (particles) {
      const titles = {
        steven: { msg: '⚡ PINK DIAMOND SURGE (SU FUTURE)!', color: '#ff1493' },
        garnet: { msg: '🔥 DUAL RESONANCE GEM SURGE!', color: '#ef4444' },
        amethyst: { msg: '🟣 VOLCANIC QUARTZ SURGE!', color: '#a855f7' },
        pearl: { msg: '⚔️ PRISMATIC HOLOGRAM SURGE!', color: '#22d3ee' },
        bismuth: { msg: '🌋 MOLTEN FORGEMASTER SURGE!', color: '#f97316' },
        peridot: { msg: '⚡ FERROKINETIC GEM SURGE!', color: '#22c55e' },
        lapis: { msg: '🌊 OCEAN EMPRESS HYDRO SURGE!', color: '#0ea5e9' },
        rose: { msg: '🌹 CELESTIAL DIAMOND SURGE!', color: '#f43f5e' },
        connie: { msg: '🗡️ CRYSTAL KNIGHT SURGE!', color: '#ec4899' },
        jasper: { msg: '🔶 SUPREME BETA QUARTZ SURGE!', color: '#ea580c' }
      };
      const t = titles[this.activeChar] || titles.steven;
      particles.addDamageText(this.x, this.y - 75, `${t.msg} (2X POWER)`, true, t.color);
      particles.addSparkle(this.x, this.y - 35, '#ffffff', 30, 8);
      particles.addPoof(this.x, this.y - 35, t.color);
    }
  }

  deactivatePinkOverdrive(audioEngine, particles) {
    this.isPinkOverdrive = false;
    this.pinkOverdriveTimer = 0;
    if (particles) {
      particles.addDamageText(this.x, this.y - 65, 'GEM SURGE ENDED', false, '#cbd5e1');
    }
  }

  revive(audioEngine, particles) {
    this.isFallen = false;
    this.fallenType = null;
    this.fallenTimer = 0;
    this.reviveTimer = 0;
    this.reviveTotal = 0;
    this.isReforming = false;
    this.reformProgress = 0;
    this.invulnerableTimer = 2.0;
    this.vx = 0;
    this.vy = 0;
    this.isAttacking = false;
    this.isShielding = false;
    this.isSpinDashing = false;
    this.isDodging = false;
    if (audioEngine) {
      try {
        audioEngine.playSfx('stageClear');
      } catch (e) {}
    }
    if (particles) {
      particles.addSparkle(this.x, this.y - 35, '#ffffff', 25, 8);
      particles.addSparkle(this.x, this.y - 35, '#38bdf8', 20, 6);
      particles.addDamageText(this.x, this.y - 65, '✨ REVIVED FOR NEXT STAGE! ✨', false, '#38bdf8');
    }
  }

  update(dt, input, audioEngine, particles, projectiles, pickups, platforms = []) {
    this.animTime = (this.animTime || 0) + dt;
    // Lore-Accurate Knockout / Poofed state freeze: Skip inputs and actions
    if (this.isFallen) {
      this.fallenTimer += dt;
      this.vx = 0;
      this.isAttacking = false;
      this.isShielding = false;
      this.isSpinDashing = false;
      this.isDodging = false;
      this.invulnerableTimer = 999;

      if (!this.isGrounded) {
        this.vy += 1200 * dt;
        this.y += this.vy * dt;
        if (platforms && platforms.length > 0 && this.vy >= 0) {
          for (const plat of platforms) {
            if (this.x >= plat.x - 16 && this.x <= plat.x + plat.width + 16) {
              if (this.y >= plat.y) {
                this.y = plat.y;
                this.vy = 0;
                this.isGrounded = true;
                this.currentPlatform = plat;
                break;
              }
            }
          }
        }
        if (this.y >= this.groundY) {
          this.y = this.groundY;
          this.vy = 0;
          this.isGrounded = true;
          this.currentPlatform = null;
        }
      }
      return;
    }

    // Cooldown decrements
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.specialCooldown > 0) this.specialCooldown -= dt;
    if (this.skillCooldown > 0) this.skillCooldown -= dt;
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.parryWindow > 0) this.parryWindow -= dt;
    if (this.counterBuffTimer > 0) this.counterBuffTimer -= dt;
    if (this.riposteTimer > 0) this.riposteTimer -= dt;
    if (this.attackGuardTimer > 0) this.attackGuardTimer -= dt;
    if (this.attackSuperArmorTimer > 0) this.attackSuperArmorTimer -= dt;

    // --- UNIQUE CHARACTER PASSIVES TICK (ALL 10 GUARDIANS) ---
    if (!this.isFusion) {
      const c = this.activeChar;
      if (c === 'steven' && this.isShielding) {
        // Steven Passive: Spiked Pink Bubble damages & knocks back enemies on contact!
        this.spikeBubbleTickTimer -= dt;
        if (this.spikeBubbleTickTimer <= 0 && this.gameRef?.enemyManager?.enemies) {
          let hitAny = false;
          for (const e of this.gameRef.enemyManager.enemies) {
            if (e.hp > 0 && Math.hypot(e.x - this.x, (e.y - 35) - (this.y - 35)) < 76) {
              const thornDmg = this.isPinkOverdrive ? 26 : 15;
              e.hp = Math.max(0, e.hp - thornDmg);
              e.hurtTimer = 0.28;
              e.vx = (e.x < this.x ? -1 : 1) * 260;
              e.vy = -120;
              hitAny = true;
              if (particles) {
                particles.addDamageText(e.x, e.y - 48, `-${thornDmg} SPIKE!`, false, '#ff6097');
                particles.addHitSpark(e.x, e.y - 30, '#ff6097', 16, 0);
              }
            }
          }
          if (hitAny) {
            this.spikeBubbleTickTimer = 0.42;
            if (audioEngine) audioEngine.playSfx('shield');
          }
        }
      } else if (c === 'garnet') {
        // Garnet Passive: Future Vision auto-recharges every 7s
        if (!this.futureVisionReady) {
          this.futureVisionTimer += dt;
          if (this.futureVisionTimer >= 7.0) {
            this.futureVisionReady = true;
            this.futureVisionTimer = 0;
            if (particles) particles.addDamageText(this.x, this.y - 96, '👁️ FUTURE VISION READY', false, '#fde047');
          }
        }
      } else if (c === 'amethyst' && this.momentumStacks > 0) {
        this.momentumDecayTimer -= dt;
        if (this.momentumDecayTimer <= 0) this.momentumStacks = 0;
      } else if (c === 'peridot') {
        // Peridot Passive: Orbiting Ferrokinetic Steel Shards auto-zap nearby enemies!
        this.orbitZapTimer -= dt;
        if (this.orbitZapTimer <= 0 && this.gameRef?.enemyManager?.enemies) {
          for (const e of this.gameRef.enemyManager.enemies) {
            if (e.hp > 0 && Math.hypot(e.x - this.x, e.y - this.y) < 135) {
              const zapDmg = this.isPinkOverdrive ? 22 : 12;
              e.hp = Math.max(0, e.hp - zapDmg);
              e.hurtTimer = 0.2;
              this.orbitZapTimer = 1.45;
              if (particles) {
                particles.addLightningArc(this.x, this.y - 45, e.x, e.y - 30, '#a3e635');
                particles.addDamageText(e.x, e.y - 52, `-${zapDmg} FERRO-ZAP`, false, '#a3e635');
              }
              if (audioEngine) audioEngine.playSfx('metal');
              break;
            }
          }
        }
      } else if (c === 'rose') {
        // Rose Passive: Maternal Sanctuary — periodic healing rose petals!
        this.sanctuaryHealTimer += dt;
        if (this.sanctuaryHealTimer >= 6.5) {
          this.sanctuaryHealTimer = 0;
          if (particles) particles.addRosePetals(this.x, this.y - 36, 8);
          if (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + 1);
            if (particles) particles.addDamageText(this.x, this.y - 84, '🌹 SANCTUARY +1❤', false, '#fbcfe8');
          }
          if (typeof this.onTeamHeal === 'function') this.onTeamHeal(this, 1);
        }
      }
    }

    // Guard / Shield input edge detection for Perfect Parry
    const shieldHeld = !!(input.shield || (input.down && !input.jump));
    if (shieldHeld && !this.prevShieldPressed) {
      this.parryWindow = 0.14;
    }
    this.prevShieldPressed = shieldHeld;

    // Natural eye blinking timer (every 3.6s)
    this.blinkTimer = (this.blinkTimer || 0) + dt;
    if (this.blinkTimer > 3.6) {
      this.isBlinking = true;
      if (this.blinkTimer > 3.74) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    // Combo chain window: let it lapse and the next press starts from step 1 again
    if (this.comboStepTimer > 0) {
      this.comboStepTimer -= dt;
      if (this.comboStepTimer <= 0) {
        this.comboStep = 0;
        this.attackCombo = 0;
        this.comboLinkBonus = 0;
        this.attackDamageMult = 1;
        this.attackRangeBonus = 0;
        this.attackKnockMult = 1;
      }
    }

    // 5-Frame Input Buffering (~85ms window) to prevent dropped inputs during recovery
    if (input.attack) this.inputBuffer = { action: 'attack', timer: 0.085 };
    else if (input.special) this.inputBuffer = { action: 'special', timer: 0.085 };
    else if (input.skill) this.inputBuffer = { action: 'skill', timer: 0.085 };
    else if (input.dodge) this.inputBuffer = { action: 'dodge', timer: 0.085 };
    else if (input.jump && !this.jumpDebounce) this.inputBuffer = { action: 'jump', timer: 0.085 };

    if (this.inputBuffer) {
      this.inputBuffer.timer -= dt;
      if (this.inputBuffer.timer <= 0) this.inputBuffer = null;
    }

    // Dodge Action Execution Check
    const tryDodgeDirect = input.dodge || (this.inputBuffer?.action === 'dodge' && this.actionTimer <= 0);
    if (tryDodgeDirect && this.dodgeCooldown <= 0 && !this.isDodging && !this.isSpinDashing) {
      if (this.inputBuffer?.action === 'dodge') this.inputBuffer = null;
      this.executeDodge(audioEngine, particles, input);
    }

    // Active Dodge Slide Physics & Invulnerability
    if (this.isDodging) {
      this.dodgeTimer -= dt;
      this.invulnerableTimer = Math.max(this.invulnerableTimer, 0.16);
      this.vx = this.dodgeVx * Math.max(0.28, this.dodgeTimer / this.dodgeDuration);

      this.afterimageTimer += dt;
      if (this.afterimageTimer >= 0.05 && this.afterimages.length < 5) {
        this.afterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          life: 0.22,
          maxLife: 0.22,
          isDodge: true
        });
      }

      if (this.dodgeTimer <= 0) {
        this.isDodging = false;
        this.vx = 0;
        this.dodgeCooldown = Math.max(this.dodgeCooldown, 0.25);
      }
    }

    // Pink Overdrive State (Steven Universe Future Diamond Power-Up!)
    if (this.isPinkOverdrive) {
      this.pinkOverdriveTimer -= dt;
      // 3x Faster Cooldown Recovery
      if (this.attackCooldown > 0) this.attackCooldown -= dt * 2;
      if (this.specialCooldown > 0) this.specialCooldown -= dt * 2;
      if (this.skillCooldown > 0) this.skillCooldown -= dt * 2;

      // Spawn glowing Gem Surge ghost afterimages only while in motion (capped & throttled for 60 FPS)
      this.afterimageTimer += dt;
      if ((Math.abs(this.vx) > 25 || Math.abs(this.vy) > 25) && this.afterimageTimer >= 0.14 && this.afterimages.length < 2) {
        this.afterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          life: 0.22,
          maxLife: 0.22
        });
      }

      if (this.pinkOverdriveTimer <= 0) {
        this.deactivatePinkOverdrive(audioEngine, particles);
      }
    }

    // Update afterimages
    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      this.afterimages[i].life -= dt;
      if (this.afterimages[i].life <= 0) {
        this.afterimages.splice(i, 1);
      }
    }

    // Steven Bubble Shield Timer (Deflects damage while allowing movement)
    if (this.isShielding) {
      this.bubbleTimer -= dt;
      this.invulnerableTimer = 0.2;
      if (this.bubbleTimer <= 0) {
        this.isShielding = false;
      }
    }

    // Amethyst Spin Dash Timer (Fast dash, auto-recovers!)
    if (this.isSpinDashing) {
      this.spinDashTimer -= dt;
      this.invulnerableTimer = 0.2;
      particles.addSparkle(this.x, this.y - 20, '#c084fc', 2, 2);
      if (this.spinDashTimer <= 0) {
        this.isSpinDashing = false;
        this.vx = 0; // Strictly clear dash velocity on completion!
      }
    }

    // Movement Speeds for 8 Canon Gems
    let speed = 280;
    if (this.activeChar === 'pearl') speed = 330;
    else if (this.activeChar === 'lapis') speed = 320;
    else if (this.activeChar === 'connie') speed = 315;
    else if (this.activeChar === 'amethyst') speed = 310;
    else if (this.activeChar === 'peridot') speed = 300;
    else if (this.activeChar === 'steven') speed = 280;
    else if (this.activeChar === 'rose') speed = 275;
    else if (this.activeChar === 'bismuth') speed = 270;
    else if (this.activeChar === 'garnet') speed = 265;
    else if (this.activeChar === 'jasper') speed = 265;

    // Pink Overdrive accelerates speed by 1.85x! (Harmony Synergy grants +25%!)
    if (this.isPinkOverdrive) speed *= 1.85;
    if (this.hasSynergyBuff) speed *= 1.25;
    if (this.isFusion) speed *= 1.12;   // a fusion moves with both partners' weight
    if (this.riposteTimer > 0 && this.activeChar === 'connie') speed *= 1.25; // Connie Knight's Riposte speed
    if (this.momentumStacks > 0 && this.activeChar === 'amethyst') speed *= (1 + this.momentumStacks * 0.04);
    if (this.isSpinDashing) speed = 520;

    // Double-Tap A / D Sprint Speed-Run (1.58x burst speed with dedicated sprint kinematics & dust bursts!)
    const wantsMove = !!(input.left || input.right);
    const wasSprinting = this.isSprinting;
    this.isSprinting = !!(input.sprint && wantsMove && !this.isShielding && !this.isAttacking && !this.isDodging && !this.isSpinDashing);
    if (this.isSprinting) {
      speed *= 1.58;
      if (!wasSprinting && this.isGrounded && particles && particles.addPoof) {
        particles.addPoof(this.x - this.facing * 14, this.y - 6, '#e2e8f0');
        if (audioEngine && audioEngine.playSfx) audioEngine.playSfx('whoosh');
      }
      this.sprintBurstTimer = (this.sprintBurstTimer || 0) - dt;
      if (this.sprintBurstTimer <= 0) {
        this.sprintBurstTimer = 0.08;
        if (this.isGrounded && particles && particles.addSparkle) {
          particles.addSparkle(this.x - this.facing * 16, this.y - 6, '#e2e8f0', 3, 2.2);
        }
        if (this.afterimages.length < 3) {
          this.afterimages.push({ x: this.x, y: this.y, facing: this.facing, life: 0.14, maxLife: 0.14 });
        }
      }
    } else {
      this.sprintBurstTimer = 0;
    }

    // Footfall dust while running, and a landing squash when we hit the floor.
    if (this.isGrounded && Math.abs(this.vx) > 40) {
      this.runDustTimer -= dt;
      if (this.runDustTimer <= 0) {
        this.runDustTimer = this.isSprinting ? 0.09 : 0.16;
        if (particles && particles.addSparkle) {
          particles.addSparkle(this.x - this.facing * 9, this.y - 3, this.isSprinting ? '#f8fafc' : '#cbd5e1', this.isSprinting ? 3 : 2, this.isSprinting ? 2.0 : 1.4);
        }
      }
    } else {
      this.runDustTimer = 0;
    }
    if (!this.wasGrounded && this.isGrounded) {
      this.landSquash = 1;
      if (particles && particles.addSparkle) {
        particles.addSparkle(this.x, this.y - 4, '#e2e8f0', 6, 2.2);
      }
    }
    this.wasGrounded = this.isGrounded;

    // Fluid Horizontal Movement (Responsive ramp + strike step impulse, zero drift when idle)
    const targetVx = input.left ? -speed : (input.right ? speed : (this.isSpinDashing ? this.facing * 480 : 0));
    if (this.comboImpulseTimer > 0) {
      this.comboImpulseTimer = Math.max(0, this.comboImpulseTimer - dt);
      if (this.comboImpulseTimer <= 0) this.comboImpulseVx = 0;
    }
    const strideRate = (this.isFusion ? 11.5 : 14) * (this.isSprinting ? 1.52 : 1.0);
    if (this.isDodging) {
      // Movement velocity is handled smoothly by dodge physics
    } else if (input.left) {
      this.facing = -1;
      const blend = Math.min(1, dt * (this.isGrounded ? 20 : 12));
      this.vx = this.vx + (targetVx - this.vx) * blend;
      this.walkAnim += dt * strideRate;
    } else if (input.right) {
      this.facing = 1;
      const blend = Math.min(1, dt * (this.isGrounded ? 20 : 12));
      this.vx = this.vx + (targetVx - this.vx) * blend;
      this.walkAnim += dt * strideRate;
    } else {
      if (this.isSpinDashing) {
        this.vx = this.facing * 480;
      } else if (this.comboImpulseTimer > 0 && Math.abs(this.comboImpulseVx) > 8) {
        this.vx = this.comboImpulseVx * (this.comboImpulseTimer / 0.16);
      } else {
        this.vx = 0;
        this.walkAnim = 0;
      }
    }

    // Platform Drop-Down & Timers
    if (this.dropThroughTimer > 0) {
      this.dropThroughTimer -= dt;
    }

    // Drop down through platform when Down/S is held
    if (this.currentPlatform && (input.down || (input.down && input.jump))) {
      this.dropThroughTimer = 0.32;
      this.y = this.currentPlatform.y + 10;
      this.vy = 180;
      this.isGrounded = false;
      this.currentPlatform = null;
    }

    // Enhanced Jump & Double Jump System with 5-Frame Input Buffer
    const tryJump = (input.jump && !this.jumpDebounce && !input.down) || (this.isGrounded && this.inputBuffer?.action === 'jump');
    if (tryJump) {
      if (this.inputBuffer?.action === 'jump') this.inputBuffer = null;
      if (this.isGrounded) {
        this.vy = -680; // Powerful crisp leap: reaches 192px apex
        this.isGrounded = false;
        this.canDoubleJump = true;
        this.currentPlatform = null;
        this.jumpDebounce = true;
        if (audioEngine) audioEngine.playSfx('jump');
        if (particles) particles.addSparkle(this.x, this.y, '#ffffff', 8, 3);
      } else if (this.canDoubleJump) {
        this.vy = -600; // Gem Aerial Flutter / Double Jump
        this.canDoubleJump = false;
        this.jumpDebounce = true;
        if (audioEngine) audioEngine.playSfx('jump');
        if (particles) {
          particles.addSparkle(this.x, this.y - 15, '#fde047', 14, 5);
          particles.addSparkle(this.x, this.y - 15, '#c084fc', 12, 4);
        }
      }
    }
    if (!input.jump) {
      this.jumpDebounce = false;
    }

    // Fast-Fall Mechanic (Reference: Jump and Land)
    // "for characters who do a double jump and press keyboard 'S', double the pace of character's going down when that key is pressed"
    let gravity = 1200;
    if (!this.isGrounded && input.down && !this.currentPlatform) {
      gravity = 4200; // Double the pace of going down!
      if (this.vy < 700) this.vy = 700;
      this.isFastFalling = true;
      if (particles && Math.random() < 0.28) {
        particles.addSparkle(this.x + (Math.random() * 20 - 10), this.y - 20, '#ffffff', 2, 1.5);
      }
    } else if (this.isGrounded) {
      this.isFastFalling = false;
    }

    // Gravity & Position Updates (Lapis Passive: Hydro-Wing Glide while holding Jump midair!)
    const prevY = this.y;
    const prevVy = this.vy;
    this.vy += gravity * dt;
    if (!this.isGrounded && this.activeChar === 'lapis' && !this.isFusion && input.jump && this.vy > 95 && !this.isFastFalling) {
      this.vy = 95;
      if (particles && Math.random() < 0.25) {
        particles.addSparkle(this.x + (Math.random() * 26 - 13), this.y - 45, '#bae6fd', 2, 1.8);
      }
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Platform collision check (One-way jump-through platforms)
    let landedOnPlat = false;
    if (platforms && platforms.length > 0 && this.vy >= 0 && this.dropThroughTimer <= 0) {
      for (const plat of platforms) {
        if (this.x >= plat.x - 16 && this.x <= plat.x + plat.width + 16) {
          if (prevY <= plat.y + 6 && this.y >= plat.y) {
            const hadFastFall = this.isFastFalling;
            this.y = plat.y;
            this.vy = 0;
            this.isGrounded = true;
            this.canDoubleJump = true;
            this.currentPlatform = plat;
            landedOnPlat = true;
            this.isFastFalling = false;
            if (prevVy > 220) {
              if (audioEngine) audioEngine.playSfx('land');
              if (particles) {
                particles.addHeavyLanding(this.x, plat.y, hadFastFall ? '#fde68a' : '#e2e8f0');
                particles.addPoof(this.x - 14, plat.y - 4, '#e2e8f0');
                particles.addPoof(this.x + 14, plat.y - 4, '#e2e8f0');
                particles.addShockwaveRing(this.x, plat.y, hadFastFall ? 75 : 45, '#cbd5e1', 2.8);
                particles.addDebris(this.x, plat.y, '#94a3b8', hadFastFall ? 8 : 4);
              }
            }
            break;
          }
        }
      }
    }

    // Walk off platform check
    if (this.currentPlatform && !landedOnPlat) {
      const inX = this.x >= this.currentPlatform.x - 16 && this.x <= this.currentPlatform.x + this.currentPlatform.width + 16;
      if (!inX && this.y < this.groundY) {
        this.currentPlatform = null;
        this.isGrounded = false;
      }
    }

    // Main Stage Ground Collision
    if (this.y >= this.groundY) {
      const wasAirborne = !this.isGrounded;
      const hadFastFall = this.isFastFalling;
      this.y = this.groundY;
      this.vy = 0;
      this.isGrounded = true;
      this.canDoubleJump = true;
      this.currentPlatform = null;
      this.isFastFalling = false;

      if (wasAirborne && prevVy > 220) {
        if (audioEngine) audioEngine.playSfx('land');
        if (particles) {
          particles.addHeavyLanding(this.x, this.groundY, hadFastFall ? '#fbbf24' : '#e2e8f0');
          particles.addPoof(this.x - 16, this.groundY - 5, '#e2e8f0');
          particles.addPoof(this.x + 16, this.groundY - 5, '#e2e8f0');
          particles.addShockwaveRing(this.x, this.groundY, hadFastFall ? 100 : 65, hadFastFall ? '#f59e0b' : '#cbd5e1', 3.5);
          particles.addDebris(this.x, this.groundY, '#94a3b8', hadFastFall ? 10 : 5);
        }

        // Steven's bubble slam impact damage (only when Bubble Shield skill is active — silent & clean!)
        if (this.activeChar === 'steven' && (this.bubbleTimer > 0 || this.actionType === 'shield')) {
          if (audioEngine) {
            audioEngine.playSfx('bubble');
          }
          if (particles) {
            particles.addShockwaveRing(this.x, this.y, 120, '#ff94ba', 4.5);
            particles.addRosePetals(this.x, this.y - 10, 12);
            particles.addExplosion(this.x, this.y - 15, '#ff94ba', 16);
          }
          if (projectiles) {
            projectiles.push({
              x: this.x,
              y: this.y - 25,
              width: 170,
              height: 55,
              vx: 0,
              vy: 0,
              damage: Math.round(55 * (this.isPinkOverdrive ? 2.0 : 1.0)),
              type: 'bubbleShockwave',
              life: 0.32,
              color: '#ff94ba'
            });
          }
        }
      }
    }

    // Stage bounds (Widescreen 2600px Arena)
    const maxX = this.stageWidth || 2600;
    if (this.x < 35) this.x = 35;
    if (this.x > maxX - 35) this.x = maxX - 35;

    // Wall-Slide & Wall-Kick Acrobatic Movement
    const isAtStageWall = (this.x <= 45 || this.x >= maxX - 45);
    if (!this.isGrounded && isAtStageWall && this.vy > 80) {
      this.isWallSliding = true;
      this.vy = Math.min(180, this.vy); // Wall friction slows descent
      if (particles && Math.random() < 0.3) {
        particles.addPoof(this.x, this.y - 15, '#cbd5e1');
      }
      if (input.jump && !this.jumpDebounce) {
        this.jumpDebounce = true;
        this.vy = -720;
        const kickDir = (this.x <= 45 ? 1 : -1);
        this.vx = kickDir * 450;
        this.facing = kickDir;
        this.canDoubleJump = true;
        if (audioEngine) audioEngine.playSfx('jump');
        if (particles) particles.addSparkle(this.x, this.y - 20, '#38bdf8', 14, 4);
      }
    } else {
      this.isWallSliding = false;
    }

    // Motion blur ghost afterimages during evasive dodge
    if (this.isDodging) {
      this.dodgeAfterimageTimer = (this.dodgeAfterimageTimer || 0) + dt;
      if (this.dodgeAfterimageTimer >= 0.05 && this.afterimages.length < 5) {
        this.dodgeAfterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          life: 0.22,
          maxLife: 0.22
        });
      }
    }

    // Attack Triggers (J, K, L) with 5-Frame Input Buffering
    const isActionable = this.actionTimer <= 0 && !this.isDodging && !this.isSpinDashing;
    const tryAttack = input.attack || (isActionable && this.inputBuffer?.action === 'attack');
    const trySpecial = input.special || (isActionable && this.inputBuffer?.action === 'special');
    const trySkill = input.skill || (isActionable && this.inputBuffer?.action === 'skill');

    if (tryAttack && this.attackCooldown <= 0) {
      if (this.inputBuffer?.action === 'attack') this.inputBuffer = null;
      this.executeAttackJ(audioEngine, particles, projectiles);
    }
    if (trySpecial && this.specialCooldown <= 0) {
      if (this.inputBuffer?.action === 'special') this.inputBuffer = null;
      this.executeSpecialK(audioEngine, particles, projectiles);
    }
    if (trySkill && this.skillCooldown <= 0) {
      if (this.inputBuffer?.action === 'skill') this.inputBuffer = null;
      this.executeSkillL(audioEngine, particles, pickups, projectiles);
    }

    // Guard / Shielding Stance: Steven & Rose can hold Down/S to raise protective shield
    if ((input.down || input.shield) && (this.activeChar === 'steven' || this.activeChar === 'rose' || this.activeChar === 'connie')) {
      this.isShielding = true;
      this.actionType = 'shield';
      this.vx = 0;
    } else if (this.bubbleTimer <= 0) {
      if (this.actionType === 'shield' && !input.skill) {
        this.isShielding = false;
      }
    }

    // Attack animation frame calculation & action countdown
    if (this.actionTimer > 0) {
      this.actionTimer -= dt;
      this.attackFrame = (1 - this.actionTimer / this.actionDuration) * 3;
      if (this.actionTimer <= 0) {
        this.actionTimer = 0;
        this.isAttacking = false;
        this.attackFrame = 0;
        if (this.actionType !== 'shield' || (!input.down && !input.shield && this.bubbleTimer <= 0)) {
          this.actionType = null;
        }
      }
    } else {
      this.isAttacking = false;
      this.attackFrame = 0;
    }
  }

  // --- UNIVERSAL DODGE / EVASIVE DASH (ALL 8 GEMS) ---
  executeDodge(audioEngine, particles, input = null) {
    if (this.dodgeCooldown > 0 || this.isDodging || this.isSpinDashing) return;

    this.isDodging = true;
    this.dodgeDuration = 0.30;
    this.dodgeTimer = this.dodgeDuration;
    this.dodgeCooldown = 0.55;
    this.invulnerableTimer = 0.38; // Generous i-frames throughout dodge
    this.parryWindow = 0.14; // Perfect Parry / Flash Step reward window!

    // Determine dodge direction
    let dir = this.facing;
    if (input && input.left && !input.right) {
      dir = -1;
      this.facing = -1;
    } else if (input && input.right && !input.left) {
      dir = 1;
      this.facing = 1;
    }
    this.dodgeDirection = dir;
    this.dodgeVx = dir * 520;

    // Interrupt normal attack into dodge (responsive dodge cancel)
    this.isAttacking = false;
    this.actionType = 'dodge';
    if (this.activeChar === 'connie' && !this.isFusion) {
      this.riposteTimer = 2.8;
      if (particles) particles.addDamageText(this.x, this.y - 82, "⚔️ KNIGHT'S RIPOSTE!", false, '#f472b6');
    }

    if (audioEngine) audioEngine.playSfx('dash');

    if (particles) {
      const c = this.activeChar;
      const dashCol = (typeof OVERDRIVE_THEMES !== 'undefined' && OVERDRIVE_THEMES[c]?.color) || '#38bdf8';
      particles.addDashAfterImage(this.x, this.y, this.facing, dashCol);
      if (c === 'steven') {
        particles.addSparkle(this.x, this.y - 20, '#ff94ba', 12, 4);
      } else if (c === 'garnet') {
        particles.addSparkle(this.x, this.y - 20, '#ef4444', 8, 3);
        particles.addSparkle(this.x, this.y - 20, '#38bdf8', 8, 3);
      } else if (c === 'amethyst') {
        particles.addSparkle(this.x, this.y - 15, '#c084fc', 14, 5);
      } else if (c === 'pearl') {
        particles.addSparkle(this.x, this.y - 30, '#a5f3fc', 12, 4);
      } else if (c === 'bismuth') {
        particles.addSparkle(this.x, this.groundY - 5, '#f97316', 16, 5);
      } else if (c === 'peridot') {
        particles.addSparkle(this.x, this.groundY - 5, '#84cc16', 14, 4);
      } else if (c === 'lapis') {
        particles.addSparkle(this.x, this.y - 25, '#38bdf8', 16, 5);
      } else if (c === 'rose') {
        particles.addRosePetals(this.x, this.y - 25, 8);
        particles.addSparkle(this.x, this.y - 25, '#fbcfe8', 12, 4);
      } else if (c === 'connie') {
        particles.addSparkle(this.x, this.y - 25, '#f472b6', 14, 5);
        particles.addSparkle(this.x, this.y - 25, '#93c5fd', 10, 4);
      } else if (c === 'jasper') {
        particles.addSparkle(this.x, this.groundY - 10, '#ea580c', 16, 6);
        particles.addSparkle(this.x, this.groundY - 10, '#fbbf24', 12, 4);
      }
    }
  }

  // --- [J] SIGNATURE PER-GUARDIAN FIGHTING STYLES (10 GUARDIANS & 9 FUSIONS) ---
  executeAttackJ(audioEngine, particles, projectiles) {
    this.isAttacking = true;
    this.attackType = 'J';
    this.actionType = 'punch';
    this._swingId = (this._swingId || 0) + 1;
    if (this._swingHitSet) this._swingHitSet.clear();
    else this._swingHitSet = new Set();

    const profile = (this.isFusion && this.fusionData)
      ? (FUSION_COMBO_PROFILES[this.fusionData.id] || FUSION_COMBO_PROFILE)
      : (HERO_COMBO_PROFILES[this.activeChar] || HERO_COMBO_PROFILES.steven);
    const chainLen = (profile.cadence && profile.cadence.length) || 3;
    this.comboStep = (this.comboStepTimer > 0) ? (this.comboStep + 1) % chainLen : 0;
    const isFinisher = (this.comboStep === chainLen - 1);
    const perfectLink = (this.comboStepTimer > 0.12 && this.comboStep > 0);
    this.comboLinkBonus = perfectLink ? 0.12 : 0;
    this.attackCombo = this.comboStep;
    this.attackStyle = profile.style || 'boxer';
    this.comboStepTimer = profile.cadence[this.comboStep] + 0.36;
    this.attackDamageMult = profile.damage[this.comboStep] * (1 + this.comboLinkBonus);
    this.attackRangeBonus = profile.range ? (profile.range[this.comboStep] || 0) : 0;
    this.attackKnockMult = profile.knock[this.comboStep];
    this.attackGuardTimer = (profile.guard && profile.guard[this.comboStep]) ? profile.guard[this.comboStep] : 0;
    this.attackSuperArmorTimer = (profile.superArmor && profile.superArmor[this.comboStep]) ? (profile.cadence[this.comboStep] + 0.14) : 0;
    this.attackPullIn = !!(profile.pull && profile.pull[this.comboStep]);
    this.attackLiftY = (profile.lift && profile.lift[this.comboStep]) ? profile.lift[this.comboStep] : 0;
    this.attackArmorBreak = !!(profile.armorBreak && profile.armorBreak[this.comboStep]);
    this.actionDuration = isFinisher ? 0.34 : Math.max(0.18, profile.cadence[this.comboStep] + 0.08);
    this.actionTimer = this.actionDuration;
    let cd = profile.cadence[this.comboStep];

    // Style-specific vertical hop / vault / backstep kinematics
    const stepHop = (profile.hop && profile.hop[this.comboStep]) ? profile.hop[this.comboStep] : 0;
    if (stepHop < 0 && this.isGrounded) {
      this.vy = Math.min(this.vy, stepHop);
      this.isGrounded = false;
    }

    // Passive Combat Modifiers for All 10 Playable Guardians
    if (!this.isFusion) {
      const ch = this.activeChar;
      if (ch === 'garnet' && this.counterBuffTimer > 0) {
        this.attackDamageMult *= 1.35;
      } else if (ch === 'amethyst') {
        this.momentumStacks = Math.min(5, (this.momentumStacks || 0) + 1);
        this.momentumDecayTimer = 4.5;
        this.attackDamageMult *= (1 + this.momentumStacks * 0.05);
        cd *= Math.max(0.70, 1 - this.momentumStacks * 0.06);
      } else if (ch === 'pearl') {
        this.precisionHitCount = (this.precisionHitCount || 0) + 1;
        if (this.precisionHitCount % 3 === 0) {
          this.attackDamageMult *= 1.6;
          this.specialCooldown = Math.max(0, this.specialCooldown - 0.6);
          this.skillCooldown = Math.max(0, this.skillCooldown - 0.6);
          if (particles) particles.addDamageText(this.x, this.y - 102, '💎 PRECISION CRIT!', true, '#67e8f9');
        }
      } else if (ch === 'bismuth') {
        this.forgeHitCount = (this.forgeHitCount || 0) + 1;
        if (this.forgeHitCount % 3 === 0) {
          this.attackDamageMult *= 1.35;
          if (particles) {
            particles.addFireRing(this.x + this.facing * 42, this.y - 18, '#f97316');
            particles.addDamageText(this.x, this.y - 102, '🔥 MOLTEN TEMPER!', false, '#fb923c');
          }
        }
      } else if (ch === 'lapis' && !this.isGrounded) {
        this.attackDamageMult *= 1.25;
      } else if (ch === 'rose' && isFinisher) {
        if (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.hp < this.maxHp) {
          this.hp = Math.min(this.maxHp, this.hp + 1);
          if (particles) particles.addDamageText(this.x, this.y - 104, '🌹 +1❤ PETAL HEAL', false, '#fbcfe8');
        }
      } else if (ch === 'connie') {
        if (this.riposteTimer > 0) this.attackDamageMult *= 1.35;
        if (isFinisher) this.riposteTimer = 2.8;
      } else if (ch === 'jasper') {
        const hpRatio = (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.maxHp > 0) ? (this.hp / this.maxHp) : 1;
        this.attackDamageMult *= (1 + (1 - Math.min(1, hpRatio)) * 0.35);
      }
    }
    this.attackCooldown = cd;

    const moveLabel = (profile.moves && profile.moves[this.comboStep]) || '';
    this.comboMoveName = moveLabel;
    const lungeSpd = (profile.lunge && profile.lunge[this.comboStep] !== undefined) ? profile.lunge[this.comboStep] : 110;
    this.comboImpulseVx = this.facing * lungeSpd;
    this.comboImpulseTimer = 0.15;

    if (particles && moveLabel) {
      const col = (this.isFusion && this.fusionData?.color) || (OVERDRIVE_THEMES[this.activeChar]?.color) || '#fde047';
      const stepTag = isFinisher ? `★ ${moveLabel}` : `${this.comboStep + 1}: ${moveLabel}`;
      particles.addDamageText(this.x, this.y - (this.isFusion ? 112 : 84), stepTag, isFinisher, col);
    }
    if (perfectLink && particles) {
      particles.addDamageText(this.x, this.y - (this.isFusion ? 132 : 104), '⭐ PERFECT LINK!', false, '#fde047');
    }

    if (isFinisher && projectiles) {
      this.spawnComboFinisher(audioEngine, particles, projectiles);
      if (typeof this.onComboFinisher === 'function') this.onComboFinisher(this.activeChar, perfectLink, this);
    }

    if (this.isFusion && this.fusionData) {
      const f = this.fusionData;
      const odMult = this.isPinkOverdrive ? (this.dualOverdrive ? 2.5 : 2.0) : 1.0;
      const dmgMult = odMult * (this.hasSynergyBuff ? 1.25 : 1.0) * (1 + this.comboLinkBonus);
      if (f.id === 'opal') {
        // Opal Long-Range Bow String: fires actual seeking starlight arrows at distant targets on every combo step!
        this.actionType = 'throw';
        audioEngine.playSfx('laser');
        const arrowY = this.y - 54;
        const arrowX = this.x + this.facing * 42;
        if (projectiles) {
          if (this.comboStep === 0) {
            // 1: Swift Star Arrow
            projectiles.push({
              x: arrowX, y: arrowY,
              vx: this.facing * 940, vy: 0,
              radius: 17, damage: Math.round(48 * dmgMult),
              type: 'fusionOpalArrow', color: '#67e8f9', life: 1.45,
              homing: 380, pierceLeft: 1, knockX: 210, knockY: -90, hitText: 'STAR ARROW!'
            });
          } else if (this.comboStep === 1) {
            // 2: Twin Spread Volley
            for (const vy of [-80, 80]) {
              projectiles.push({
                x: arrowX, y: arrowY,
                vx: this.facing * 960, vy,
                radius: 17, damage: Math.round(42 * dmgMult),
                type: 'fusionOpalArrow', color: '#a5b4fc', life: 1.45,
                homing: 420, pierceLeft: 1, knockX: 240, knockY: -120, hitText: 'TWIN VOLLEY!'
              });
            }
          } else if (this.comboStep === 2) {
            // 3: Vaulting Backstep Snipe (graceful archer leap back + fast piercing arrow)
            if (this.isGrounded) this.vy = Math.min(this.vy, -190);
            projectiles.push({
              x: arrowX, y: arrowY - 6,
              vx: this.facing * 1060, vy: -35,
              radius: 20, damage: Math.round(68 * dmgMult),
              type: 'fusionOpalArrow', color: '#c084fc', life: 1.55,
              homing: 480, pierceLeft: 2, knockX: 310, knockY: -190, hitText: 'SNIPE PIERCE!'
            });
          } else {
            // 4: Finisher - Great Starlight Piercer + 2 Wingman Arrows
            for (const cfg of [{ vy: 0, r: 26, dmg: 96, p: 4 }, { vy: -120, r: 16, dmg: 42, p: 2 }, { vy: 120, r: 16, dmg: 42, p: 2 }]) {
              projectiles.push({
                x: arrowX, y: arrowY,
                vx: this.facing * 1120, vy: cfg.vy,
                radius: cfg.r, damage: Math.round(cfg.dmg * dmgMult),
                type: 'fusionOpalArrow', color: cfg.r > 20 ? '#fde047' : '#818cf8', life: 1.65,
                homing: 520, pierceLeft: cfg.p, knockX: 420, knockY: -240, hitText: 'STARLIGHT GREAT-ARROW!'
              });
            }
          }
        }
        if (particles) {
          particles.addThrustPierce(arrowX + this.facing * 14, arrowY, this.facing, '#818cf8');
          particles.addSparkle(arrowX + this.facing * 14, arrowY, '#67e8f9', isFinisher ? 22 : 12, 5);
        }
        return;
      }
      else if (f.id === 'stevonnie' || f.id === 'rainbowClassic' || f.id === 'rainbow2') {
        audioEngine.playSfx('sword');
        particles.addSlashArc(this.x + this.facing * 55, this.y - 50, this.facing, f.color || '#ec4899');
        if (particles) particles.addThrustPierce(this.x + this.facing * 50, this.y - 45, this.facing, f.color || '#ec4899');
      }
      else if (f.id === 'smoky') {
        audioEngine.playSfx('whip');
        if (particles) particles.addWhipSnap(this.x + this.facing * 55, this.y - 35, this.facing, '#a855f7');
      }
      else if (f.id === 'malachite') {
        audioEngine.playSfx('water');
        if (particles) particles.addWaterStream(this.x + this.facing * 50, this.y - 35, this.facing, '#2dd4bf');
      }
      else if (f.id === 'sugilite' || f.id === 'sardonyx') {
        audioEngine.playSfx('explosion');
        particles.addExplosion(this.x + this.facing * 60, this.groundY - 15, f.color || '#fbbf24', 20);
        if (particles) particles.addHammerQuake(this.x + this.facing * 55, this.groundY, f.color || '#fbbf24');
      }
      else {
        audioEngine.playSfx('punch');
        if (f.id === 'sunstone' && particles) particles.addFireRing(this.x + this.facing * 45, this.groundY, '#ea580c');
      }

      particles.addSparkle(this.x + this.facing * 55, this.y - 35, f.glowColor || '#ffffff', 20, 6);
      return;
    }

    if (this.activeChar === 'steven') {
      audioEngine.playSfx('shield');
      particles.addRosePetals(this.x + this.facing * 40, this.y - 35, 5);
      particles.addSparkle(this.x + this.facing * 35, this.y - 30, '#ff94ba', 8, 3);
    } else if (this.activeChar === 'garnet') {
      if (isFinisher) {
        audioEngine.playSfx('explosion');
        particles.addExplosion(this.x + this.facing * 45, this.groundY - 15, '#ef4444', 16);
        particles.addHammerQuake(this.x + this.facing * 45, this.groundY, '#ef4444');
        particles.addLightningArc(this.x + this.facing * 20, this.groundY, this.x + this.facing * 65, this.groundY, '#fbbf24');
      } else {
        audioEngine.playSfx('punch');
      }
      particles.addSparkle(this.x + this.facing * 45, this.y - 35, '#fbbf24', 12, 5);
    } else if (this.activeChar === 'amethyst') {
      // Spiked Dual Whip Flurry
      audioEngine.playSfx('whip');
      particles.addWhipSnap(this.x + this.facing * 60, this.y - 35, this.facing, '#c084fc');
      particles.addSparkle(this.x + this.facing * 60, this.y - 35, '#c084fc', 14, 5);
    } else if (this.activeChar === 'pearl') {
      audioEngine.playSfx('spear');
      particles.addSlashArc(this.x + this.facing * 50, this.y - 42, this.facing, '#38bdf8');
      if (this.comboStep === 0) {
        particles.addThrustPierce(this.x + this.facing * 50, this.y - 42, this.facing, '#38bdf8');
      }
      particles.addSparkle(this.x + this.facing * 55, this.y - 42, '#38bdf8', 9, 5);
    } else if (this.activeChar === 'bismuth') {
      if (isFinisher) {
        audioEngine.playSfx('explosion');
        particles.addExplosion(this.x + this.facing * 45, this.y - 15, '#f97316', 16);
        particles.addHammerQuake(this.x + this.facing * 45, this.y, '#f97316');
      } else {
        audioEngine.playSfx('hammer');
      }
      particles.addSparkle(this.x + this.facing * 50, this.y - 35, '#f59e0b', 14, 5);
    } else if (this.activeChar === 'peridot') {
      // Ferrokinetic Metal Claws
      audioEngine.playSfx('metal');
      if (isFinisher) {
        particles.addLightningArc(this.x + this.facing * 20, this.y - 38, this.x + this.facing * 60, this.y - 38, '#84cc16');
      }
      particles.addSparkle(this.x + this.facing * 50, this.y - 38, '#84cc16', 14, 5);
    } else if (this.activeChar === 'lapis') {
      audioEngine.playSfx('water');
      particles.addWaterStream(this.x + this.facing * 55, this.y - 36, this.facing, '#38bdf8');
      particles.addSparkle(this.x + this.facing * 55, this.y - 36, '#38bdf8', 12, 5);
    } else if (this.activeChar === 'rose') {
      audioEngine.playSfx('sword');
      particles.addSlashArc(this.x + this.facing * 45, this.y - 40, this.facing, '#fbcfe8');
      particles.addRosePetals(this.x + this.facing * 45, this.y - 40, 6);
      if (isFinisher) {
        particles.addHolyHeal(this.x + this.facing * 45, this.y - 40, '#fbcfe8');
      }
      particles.addSparkle(this.x + this.facing * 45, this.y - 35, '#fbcfe8', 10, 4);
    } else if (this.activeChar === 'connie') {
      // Knight's Fencing Combo: Lunge Thrust -> Crescent Slash -> Overhead Cleave!
      audioEngine.playSfx('sword');
      particles.addSlashArc(this.x + this.facing * 45, this.y - 38, this.facing, '#f472b6');
      if (this.comboStep === 0) {
        particles.addThrustPierce(this.x + this.facing * 45, this.y - 38, this.facing, '#f472b6');
      } else if (isFinisher) {
        particles.addHammerQuake(this.x + this.facing * 55, this.y, '#f43f5e');
      }
      particles.addSparkle(this.x + this.facing * 50, this.y - 36, '#f472b6', 14, 5);
    } else if (this.activeChar === 'jasper') {
      // Beta Quartz Brawler Combo: Gut Punch -> Hammer Fist -> Seismic Haymaker!
      if (isFinisher) {
        audioEngine.playSfx('explosion');
        particles.addExplosion(this.x + this.facing * 50, this.y - 15, '#ea580c', 18);
        particles.addHammerQuake(this.x + this.facing * 50, this.y, '#ea580c');
        particles.addFireRing(this.x + this.facing * 50, this.y, '#ea580c');
      } else {
        audioEngine.playSfx('punch');
      }
      particles.addSparkle(this.x + this.facing * 50, this.y - 32, '#ea580c', 16, 6);
      particles.addSparkle(this.x + this.facing * 50, this.y - 5, '#fbbf24', 12, 4);
    }
  }

  // Freebuff finisher: each Guardian's third hit releases their signature weapon
  // technique as a short-range wave, flurry or shockwave based on canon.
  spawnComboFinisher(audioEngine, particles, projectiles) {
    const profile = (this.isFusion && this.fusionData)
      ? (FUSION_COMBO_PROFILES[this.fusionData.id] || FUSION_COMBO_PROFILE)
      : HERO_COMBO_PROFILES[this.activeChar];
    if (!profile || !profile.finisher || !projectiles) return;
    const f = profile.finisher;
    const dir = this.facing;
    const count = f.count || 1;
    const dmgScale = (this.isPinkOverdrive ? 2.0 : 1.0) * (this.hasSynergyBuff ? 1.25 : 1.0) * (this.isFusion ? 1.35 : 1.0);

    for (let i = 0; i < count; i++) {
      const offsetY = count > 1 ? (i - (count - 1) / 2) * (f.spread || 0) : 0;
      const proj = {
        x: this.x + dir * 48,
        y: this.y - 38 + offsetY,
        vx: dir * (f.speed || 320),
        vy: 0,
        radius: f.radius || 0,
        width: f.width || 0,
        height: f.height || 0,
        damage: Math.round((f.damage || 14) * dmgScale),
        type: f.type,
        color: f.color || '#fbbf24',
        life: this.isFusion ? 0.34 : 0.22,
        hitText: f.label,
        knockX: f.knockX || 280,
        knockY: f.knockY || -120,
        hurtTime: 0.4
      };
      projectiles.push(proj);
    }

    if (audioEngine) {
      try { audioEngine.playSfx('whoosh'); } catch (e) {}
    }
    if (particles) {
      particles.addSparkle(this.x + dir * 60, this.y - 34, f.color || '#fde047', 18, 6);
    }
  }

  // --- [K] SPECIAL WEAPON ATTACK (8 GEMS) ---
  executeSpecialK(audioEngine, particles, projectiles) {
    this.specialCooldown = 0.85;
    this.isAttacking = true;
    this.attackType = 'K';
    this.actionType = 'throw';
    this.actionDuration = 0.38;
    this.actionTimer = 0.38;
    this._swingId = (this._swingId || 0) + 1;
    if (this._swingHitSet) this._swingHitSet.clear();
    const odMult = this.isPinkOverdrive ? (this.dualOverdrive ? 2.5 : 2.0) : 1.0;
    const dmgMult = odMult * (this.isFusion ? 1.35 : 1.0) * (this.hasSynergyBuff ? 1.25 : 1.0);
    if (particles) {
      const kMeta = getTypeMeta(this.getMoveType('k'));
      particles.addShockwaveRing(this.x + this.facing * 26, this.y - 40, this.isFusion ? 78 : 54, kMeta.color || '#f472b6', 3.6);
      particles.addSparkle(this.x + this.facing * 28, this.y - 42, kMeta.color || '#ffffff', this.isFusion ? 14 : 9, 5);
    }

    if (this.isFusion && this.fusionData) {
      this.executeFusionSpecialK(audioEngine, particles, projectiles, dmgMult);
      return;
    }

    if (this.activeChar === 'steven') {
      // Rose's Shield Throw (Bounces & Ricochets + Healing Petal Surge!)
      audioEngine.playSfx('shield');
      projectiles.push({
        x: this.x + this.facing * 25,
        y: this.y - 36,
        vx: this.facing * 560,
        vy: 0,
        radius: 21,
        damage: Math.round(40 * dmgMult),
        type: 'stevenShield',
        color: '#ff6097',
        bounces: 4,
        startX: this.x,
        life: 2.0
      });
      if (particles) {
        particles.addRosePetals(this.x, this.y - 35, 10);
        particles.addShockwaveRing(this.x + this.facing * 25, this.y - 36, 48, '#f472b6', 3.5);
      }
    } else if (this.activeChar === 'garnet') {
      // Twin Rocket Gauntlet Salvo (Ruby & Sapphire Dual Fists!)
      audioEngine.playSfx('rocket');
      for (const offsetY of [-9, 9]) {
        projectiles.push({
          x: this.x + this.facing * (30 + (offsetY > 0 ? 12 : 0)),
          y: this.y - 38 + offsetY,
          vx: this.facing * (offsetY > 0 ? 600 : 540),
          vy: 0,
          radius: 21,
          damage: Math.round(34 * dmgMult),
          type: 'garnetGauntlet',
          color: offsetY < 0 ? '#e11d48' : '#2563eb',
          life: 1.05
        });
      }
      if (particles) {
        particles.addFireRing(this.x + this.facing * 25, this.y - 38, '#e11d48');
        particles.addHitSpark(this.x + this.facing * 32, this.y - 38, '#fbbf24', 22, 0);
      }
      particles.addSparkle(this.x, this.y - 38, '#f59e0b', 18, 5);
    } else if (this.activeChar === 'amethyst') {
      // Authentic Sonic Spin Dash (Melee Quartz Buzzsaw Rush attached to Amethyst!)
      audioEngine.playSfx('spindash');
      this.isSpinDashing = true;
      this.spinDashTimer = 0.55;
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      this.vx = this.facing * 560;
      projectiles.push({
        x: this.x + this.facing * 18,
        y: this.y - 24,
        vx: this.facing * 560,
        vy: 0,
        followOwner: this,
        offsetX: 18,
        offsetY: -24,
        radius: 38,
        damage: Math.round(52 * dmgMult),
        type: 'amethystSpinDashHit',
        color: '#c084fc',
        life: 0.55
      });
      if (particles) {
        particles.addWhipSnap(this.x + this.facing * 20, this.y - 20, this.facing, '#c084fc');
        particles.addDashAfterImage(this.x, this.y, this.facing, '#c084fc');
        particles.addShockwaveRing(this.x + this.facing * 20, this.y - 24, 65, '#a855f7', 3);
      }
      particles.addSparkle(this.x, this.y - 20, '#e9d5ff', 20, 6);
    } else if (this.activeChar === 'pearl') {
      // Spear Laser Beam (3 Piercing Cyan Star-Lasers!)
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k++) {
        projectiles.push({
          x: this.x + this.facing * 42,
          y: this.y - 44 + k * 9,
          vx: this.facing * 740,
          vy: k * 24,
          radius: 13,
          damage: Math.round(38 * dmgMult),
          type: 'pearlLaser',
          color: '#38bdf8',
          life: 1.15
        });
      }
      if (particles) {
        particles.addThrustPierce(this.x + this.facing * 40, this.y - 44, this.facing, '#38bdf8');
        particles.addHitSpark(this.x + this.facing * 42, this.y - 44, '#ffffff', 22, 0);
      }
      particles.addSparkle(this.x + this.facing * 40, this.y - 44, '#67e8f9', 14, 5);
    } else if (this.activeChar === 'bismuth') {
      // Lore-Accurate Molten Hammer Leap Slam (Close-Range Armored Vault & Ground Smash — NO detached ranged shot!)
      audioEngine.playSfx('hammer');
      this.actionType = 'punch';
      this.actionDuration = 0.44;
      this.actionTimer = 0.44;
      this.comboImpulseVx = this.facing * 430;
      this.comboImpulseTimer = 0.34;
      if (this.isGrounded) {
        this.vy = -290;
        this.isGrounded = false;
      }
      this.invulnerableTimer = Math.max(this.invulnerableTimer, 0.30);
      projectiles.push({
        x: this.x + this.facing * 42,
        y: this.y - 32,
        vx: 0,
        vy: 0,
        followOwner: this,
        offsetX: 44,
        offsetY: -30,
        width: 92,
        height: 84,
        radius: 44,
        pierceLeft: 6,
        damage: Math.round(64 * dmgMult),
        type: 'bismuthAnvil',
        color: '#f97316',
        hitText: '⚒️ ANVIL SLAM!',
        life: 0.42
      });
      if (particles) {
        particles.addHammerQuake(this.x + this.facing * 44, this.y, '#f97316');
        particles.addFireRing(this.x + this.facing * 40, this.y - 28, '#fbbf24');
      }
      particles.addSparkle(this.x + this.facing * 38, this.y - 36, '#ea580c', 18, 6);
    } else if (this.activeChar === 'peridot') {
      // Authentic Ferrokinetic Scrap Salvo (Levitates 3 Homing Magnetic Scraps!)
      this.actionDuration = 0.45;
      this.actionTimer = 0.45;
      audioEngine.playSfx('metal');
      const scrapTypes = ['metalGirder', 'scrapGear', 'trashLid'];
      if (particles) particles.addLightningArc(this.x, this.y - 40, this.x + this.facing * 50, this.y - 40, '#84cc16');
      for (let s = 0; s < 3; s++) {
        setTimeout(() => {
          projectiles.push({
            x: this.x + this.facing * (35 + s * 22),
            y: this.y - 46 - (s * 8),
            vx: this.facing * (560 + s * 55),
            vy: (s - 1) * 28,
            homing: 260,
            radius: 19,
            damage: Math.round(28 * dmgMult),
            type: scrapTypes[s],
            color: '#84cc16',
            life: 1.25
          });
          particles.addSparkle(this.x + this.facing * 35, this.y - 42, '#a3e635', 12, 4);
        }, s * 75);
      }
    } else if (this.activeChar === 'lapis') {
      // Hydro-Chains & Giant Water Fist (Snares & stuns enemies!)
      audioEngine.playSfx('water');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 40,
        vx: this.facing * 620,
        vy: 0,
        radius: 28,
        damage: Math.round(50 * dmgMult),
        type: 'hydroFist',
        color: '#38bdf8',
        stunTime: 0.85,
        hitText: 'HYDRO SNARE!',
        life: 1.25
      });
      if (particles) {
        particles.addWaterStream(this.x + this.facing * 35, this.y - 40, this.facing, '#38bdf8');
        particles.addHitSpark(this.x + this.facing * 38, this.y - 40, '#e0f2fe', 20, 0);
      }
      particles.addSparkle(this.x + this.facing * 35, this.y - 40, '#0284c7', 16, 5);
    } else if (this.activeChar === 'rose') {
      // Healing Petal Cyclone Wave (Pierces foes & restores ally vigor!)
      audioEngine.playSfx('shield');
      projectiles.push({
        x: this.x + this.facing * 30,
        y: this.y - 38,
        vx: this.facing * 520,
        vy: 0,
        radius: 26,
        pierceLeft: 3,
        damage: Math.round(44 * dmgMult),
        type: 'roseShield',
        color: '#f43f5e',
        bounces: 3,
        startX: this.x,
        life: 1.8
      });
      if (typeof this.onTeamHeal === 'function') this.onTeamHeal(this, 1);
      if (particles) particles.addHolyHeal(this.x + this.facing * 25, this.y - 38, '#f43f5e');
      particles.addRosePetals(this.x, this.y - 35, 14);
    } else if (this.activeChar === 'connie') {
      // Lore-Accurate Sworn Sword Iai-Lunge (Pure Human Sword Dash-Cut + Projectile Deflect — NO magic beam!)
      audioEngine.playSfx('sword');
      this.actionType = 'throw';
      this.actionDuration = 0.30;
      this.actionTimer = 0.30;
      this.comboImpulseVx = this.facing * 640;
      this.comboImpulseTimer = 0.24;
      this.invulnerableTimer = Math.max(this.invulnerableTimer, 0.24);
      projectiles.push({
        x: this.x + this.facing * 46,
        y: this.y - 38,
        vx: this.facing * 640,
        vy: 0,
        followOwner: this,
        offsetX: 48,
        offsetY: -38,
        deflectEnemyShots: true,
        width: 82,
        height: 78,
        radius: 40,
        pierceLeft: 5,
        damage: Math.round(52 * dmgMult),
        type: 'connieSwordBeam',
        color: '#f472b6',
        hitText: '⚔️ IAI LUNGE!',
        life: 0.26
      });
      if (particles) {
        particles.addDashAfterImage(this.x, this.y, this.facing, '#f472b6');
        particles.addThrustPierce(this.x + this.facing * 42, this.y - 38, this.facing, '#f472b6');
        particles.addDoubleSlashX(this.x + this.facing * 44, this.y - 38, this.facing, '#fbcfe8');
      }
      particles.addSparkle(this.x + this.facing * 42, this.y - 38, '#fbcfe8', 18, 6);
    } else if (this.activeChar === 'jasper') {
      // Lore-Accurate Crash Helmet Bull-Rush (Pure Physical Armored Quartz Charge — NO detached ranged projectile!)
      audioEngine.playSfx('rocket');
      audioEngine.playSfx('hammer');
      this.actionType = 'throw';
      this.actionDuration = 0.44;
      this.actionTimer = 0.44;
      this.comboImpulseVx = this.facing * 650;
      this.comboImpulseTimer = 0.40;
      this.invulnerableTimer = Math.max(this.invulnerableTimer, 0.38);
      projectiles.push({
        x: this.x + this.facing * 36,
        y: this.y - 44,
        vx: this.facing * 650,
        vy: 0,
        followOwner: this,
        offsetX: 36,
        offsetY: -44,
        width: 82,
        height: 68,
        radius: 40,
        pierceLeft: 6,
        damage: Math.round(68 * dmgMult),
        type: 'jasperCrashHelmet',
        color: '#ea580c',
        hitText: '🪖 HELMET RAM!',
        life: 0.42
      });
      if (particles) {
        particles.addDashAfterImage(this.x, this.y, this.facing, '#ea580c');
        particles.addHammerQuake(this.x + this.facing * 35, this.y, '#ea580c');
        particles.addFireRing(this.x + this.facing * 35, this.y, '#ea580c');
      }
      particles.addSparkle(this.x + this.facing * 35, this.y - 44, '#f97316', 22, 6);
    }
  }

  // --- [L] SIGNATURE GEM SKILL (10 GUARDIANS) ---
  executeSkillL(audioEngine, particles, pickups = [], projectiles = []) {
    if (!Array.isArray(pickups)) pickups = [];
    if (!Array.isArray(projectiles)) projectiles = [];
    this.skillCooldown = 3.2;
    this.isAttacking = true;
    this.attackType = 'L';
    this._swingId = (this._swingId || 0) + 1;
    if (this._swingHitSet) this._swingHitSet.clear();
    const odMult = this.isPinkOverdrive ? (this.dualOverdrive ? 2.5 : 2.0) : 1.0;
    const dmgMult = odMult * (this.isFusion ? 1.4 : 1.0) * (this.hasSynergyBuff ? 1.25 : 1.0);
    const slamY = this.y;
    if (particles) {
      const lMeta = getTypeMeta(this.getMoveType('l'));
      particles.addShockwaveRing(this.x, slamY - 12, this.isFusion ? 135 : 92, lMeta.color || '#fde047', 4.8);
      particles.addSparkle(this.x, slamY - 46, lMeta.color || '#ffffff', this.isFusion ? 20 : 12, 7);
    }

    if (this.isFusion && this.fusionData) {
      this.executeFusionSkillL(audioEngine, particles, pickups, projectiles, dmgMult);
      return;
    }

    if (this.activeChar === 'steven') {
      // Rose's Bubble & Cookie Cat Starburst Heal
      this.actionType = 'shield';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      this.isShielding = true;
      this.bubbleTimer = 2.2;
      this.invulnerableTimer = 2.2;
      if (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + 1);
      }

      // 2-Player Co-Op Shared Team Heal: Heals partner for +1 Heart directly!
      if (typeof this.onTeamHeal === 'function') {
        this.onTeamHeal(this, 1);
      }

      pickups.push({
        x: this.x,
        y: slamY - 12,
        type: 'cookie',
        life: 15
      });

      projectiles.push({
        x: this.x,
        y: slamY - 36,
        width: 175,
        height: 76,
        damage: Math.round(42 * dmgMult),
        type: 'bubbleShockwave',
        life: 0.38
      });
      if (particles) {
        particles.addHolyHeal(this.x, slamY, '#ff94ba');
        particles.addImpactFrame(this.x, slamY - 35, '#ff94ba', 165);
        particles.addCollectBurst(this.x, slamY - 35, '#ff94ba');
        particles.addHitSpark(this.x, slamY - 40, '#fde047', 26, 0);
      }
      particles.addRosePetals(this.x, slamY - 35, 14);
      particles.addSparkle(this.x, slamY - 35, '#ff94ba', 22, 6);
    } else if (this.activeChar === 'garnet') {
      // Giant Gauntlets Seismic Slam! (Erupts at player elevation + twin shockwaves)
      this.actionType = 'skill';
      this.actionDuration = 0.50;
      this.actionTimer = 0.50;
      audioEngine.playSfx('explosion');
      particles.addExplosion(this.x, slamY - 15, '#fbbf24', 26);
      if (particles) {
        particles.addImpactFrame(this.x, slamY - 25, '#fbbf24', 195);
        particles.addHeavyLanding(this.x, slamY, '#e11d48');
        particles.addHammerQuake(this.x, slamY, '#fbbf24');
        particles.addLightningArc(this.x - 75, slamY, this.x + 75, slamY, '#fbbf24');
      }
      particles.addSparkle(this.x, slamY, '#fbbf24', 32, 9);
      particles.addSparkle(this.x, slamY, '#e11d48', 32, 9);
      projectiles.push({
        x: this.x,
        y: slamY - 24,
        width: 250,
        height: 56,
        damage: Math.round(68 * dmgMult),
        type: 'giantGauntletSlam',
        life: 0.36
      });
      for (const dir of [-1, 1]) {
        projectiles.push({
          x: this.x + dir * 38,
          y: slamY - 22,
          vx: dir * 420,
          vy: 0,
          width: 72,
          height: 46,
          damage: Math.round(32 * dmgMult),
          type: 'seismicShockwave',
          color: '#fbbf24',
          life: 0.45
        });
      }
    } else if (this.activeChar === 'amethyst') {
      // Dual Whip Ground Slam & Violet Energy Geysers (4 Rising Eruptions at player elevation!)
      this.actionType = 'skill';
      this.actionDuration = 0.60;
      this.actionTimer = 0.60;
      audioEngine.playSfx('whip');
      audioEngine.playSfx('rocket');
      const originX = this.x;
      const originDir = this.facing;
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const gx = originX + originDir * (52 + i * 56);
          projectiles.push({
            x: gx,
            y: slamY - 60,
            width: 62,
            height: 120,
            radius: 34,
            damage: Math.round(44 * dmgMult),
            type: 'purpleGeyser',
            color: '#a855f7',
            life: 0.60,
            maxLife: 0.60
          });
          if (particles) {
            particles.addHammerQuake(gx, slamY, '#a855f7');
            particles.addHitSpark(gx, slamY - 65, '#fde047', 20, Math.PI / 4);
            particles.addLightningArc(gx - 20, slamY, gx + 20, slamY - 60, '#c084fc');
            particles.addSparkle(gx, slamY - 15, '#d8b4fe', 16, 5);
            particles.addSparkle(gx, slamY - 30, '#fde047', 12, 4);
          }
        }, i * 80);
      }
    } else if (this.activeChar === 'pearl') {
      // Holo-Pearl Training Clone Summon + Twin Guard Starlight Slash!
      this.actionType = 'skill';
      this.actionDuration = 0.45;
      this.actionTimer = 0.45;
      audioEngine.playSfx('laser');
      const isOd = this.isPinkOverdrive;
      projectiles.push({
        x: this.x + this.facing * 45,
        y: slamY - 42,
        vx: this.facing * 480,
        vy: 0,
        facing: this.facing,
        radius: 34,
        damage: Math.round(58 * dmgMult),
        type: 'holoPearl',
        color: isOd ? '#f472b6' : '#67e8f9',
        isOverdrive: isOd,
        life: 2.4,
        maxLife: 2.4,
        hitCooldowns: {}
      });
      if (particles) {
        const pCol = isOd ? '#f472b6' : '#38bdf8';
        particles.addImpactFrame(this.x + this.facing * 40, slamY - 42, pCol, 155);
        particles.addDoubleSlashX(this.x + this.facing * 45, slamY - 42, this.facing, pCol);
        particles.addThrustPierce(this.x + this.facing * 45, slamY - 42, this.facing, pCol);
      }
      particles.addSparkle(this.x + this.facing * 45, slamY - 42, isOd ? '#f472b6' : '#a5f3fc', 22, 6);
    } else if (this.activeChar === 'bismuth') {
      // Molten Forge Breaking Point!
      this.actionType = 'skill';
      this.actionDuration = 0.50;
      this.actionTimer = 0.50;
      audioEngine.playSfx('explosion');
      particles.addExplosion(this.x, slamY - 15, '#f97316', 26);
      if (particles) {
        particles.addImpactFrame(this.x, slamY - 22, '#f97316', 185);
        particles.addHeavyLanding(this.x, slamY, '#fb923c');
        particles.addHammerQuake(this.x, slamY, '#f97316');
      }
      particles.addSparkle(this.x, slamY, '#f97316', 30, 9);
      projectiles.push({
        x: this.x,
        y: slamY - 22,
        width: 240,
        height: 48,
        damage: Math.round(70 * dmgMult),
        type: 'moltenShockwave',
        life: 0.38
      });
    } else if (this.activeChar === 'peridot') {
      // Homeworld Flask Robonoid Drone & Magnetic EMP Vortex Pulse
      this.actionType = 'skill';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('metal');
      audioEngine.playSfx('laser');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: slamY - 18,
        vx: this.facing * 360,
        vy: 0,
        radius: 22,
        damage: Math.round(48 * dmgMult),
        type: 'flaskRobonoid',
        color: '#84cc16',
        life: 1.8
      });
      projectiles.push({
        x: this.x,
        y: slamY - 42,
        width: 230,
        height: 84,
        damage: Math.round(58 * dmgMult),
        type: 'magneticVortex',
        life: 0.52
      });
      if (particles) {
        particles.addImpactFrame(this.x, slamY - 40, '#84cc16', 165);
        particles.addLightningArc(this.x - 65, slamY - 40, this.x + 65, slamY - 40, '#84cc16');
        particles.addLightningArc(this.x - 45, slamY - 60, this.x + 45, slamY - 20, '#a3e635');
      }
      particles.addSparkle(this.x, slamY - 35, '#a3e635', 25, 7);
    } else if (this.activeChar === 'lapis') {
      // Water Wings Tidal Surge! Sweeps across Lapis's current elevation!
      this.actionType = 'skill';
      this.actionDuration = 0.60;
      this.actionTimer = 0.60;
      audioEngine.playSfx('water');
      const waveFacing = this.facing;
      projectiles.push({
        x: this.x + waveFacing * 42,
        y: slamY - 65,
        vx: waveFacing * 520,
        vy: 0,
        facing: waveFacing,
        width: 100,
        height: 145,
        radius: 72,
        damage: Math.round(72 * dmgMult),
        type: 'tidalWave',
        color: '#0284c7',
        life: 1.6,
        maxLife: 1.6
      });
      if (particles) {
        particles.addImpactFrame(this.x + waveFacing * 35, slamY - 45, '#38bdf8', 180);
        particles.addWaterStream(this.x + waveFacing * 40, slamY - 65, waveFacing, '#0284c7');
        particles.addWaterStream(this.x + waveFacing * 60, slamY - 40, waveFacing, '#38bdf8');
      }
      particles.addSparkle(this.x, slamY - 45, '#38bdf8', 28, 8);
      particles.addSparkle(this.x, slamY - 45, '#e0f2fe', 20, 6);
    } else if (this.activeChar === 'rose') {
      // Sacred Tears of Resurrection!
      this.actionType = 'heal';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      if (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + 1);
      }

      if (typeof this.onTeamHeal === 'function') {
        this.onTeamHeal(this, 1);
      }

      pickups.push({
        x: this.x,
        y: slamY - 12,
        type: 'cookie',
        life: 15
      });
      pickups.push({
        x: this.x + 35,
        y: slamY - 12,
        type: 'cookie',
        life: 15
      });
      projectiles.push({
        x: this.x,
        y: slamY - 42,
        width: 220,
        height: 82,
        damage: Math.round(54 * dmgMult),
        type: 'roseShockwave',
        life: 0.38
      });
      if (particles) {
        particles.addHolyHeal(this.x, slamY, '#fbcfe8');
        particles.addHolyHeal(this.x + 35, slamY, '#f43f5e');
        particles.addVictoryLightRays(this.x, slamY - 40, '#fbcfe8', 12);
        particles.addCollectBurst(this.x, slamY - 35, '#ff86e6');
      }
      particles.addRosePetals(this.x, slamY - 35, 22);
      particles.addSparkle(this.x, slamY - 35, '#fbcfe8', 28, 8);
    } else if (this.activeChar === 'connie') {
      // Sword Stance: Pearl's Disciple (Shadow Step Multi-Slash!)
      this.actionType = 'skill';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('whoosh');
      audioEngine.playSfx('sword');
      this.invulnerableTimer = 0.55;
      const dashDist = this.facing * 260;
      const startX = this.x;
      this.x = Math.max(45, Math.min((this.stageWidth || 2600) - 45, this.x + dashDist));
      if (particles) {
        particles.addDashAfterImage(startX, slamY, this.facing, '#f472b6');
        particles.addImpactFrame(this.x, slamY - 38, '#f472b6', 175);
      }

      for (let s = 1; s <= 3; s++) {
        const sx = startX + (dashDist / 4) * s;
        projectiles.push({
          x: sx,
          y: slamY - 38,
          width: 88,
          height: 68,
          damage: Math.round(62 * dmgMult),
          type: 'connieShadowSlash',
          life: 0.36
        });
        if (particles) {
          particles.addThrustPierce(sx, slamY - 38, this.facing, '#f472b6');
          particles.addDoubleSlashX(sx, slamY - 38, this.facing, '#ff94ba');
        }
      }
      particles.addSparkle(this.x, slamY - 35, '#ff94ba', 24, 7);
      particles.addSparkle(startX, slamY - 35, '#f472b6', 20, 6);
    } else if (this.activeChar === 'jasper') {
      // Quartz Tornado Spin Dash (Spiked Beta Buzzsaw at current elevation!)
      audioEngine.playSfx('explosion');
      this.isSpinDashing = true;
      this.spinDashTimer = 0.65;
      this.actionDuration = 0.65;
      this.actionTimer = 0.65;
      this.invulnerableTimer = 0.65;
      this.vx = this.facing * 590;
      projectiles.push({
        x: this.x + this.facing * 35,
        y: slamY - 24,
        vx: this.facing * 590,
        vy: 0,
        radius: 36,
        damage: Math.round(68 * dmgMult),
        type: 'jasperSpinDashHit',
        color: '#ea580c',
        life: 0.65
      });
      if (particles) {
        particles.addImpactFrame(this.x + this.facing * 25, slamY - 24, '#ea580c', 180);
        particles.addDashAfterImage(this.x, slamY, this.facing, '#f97316');
        particles.addFireRing(this.x, slamY, '#ea580c');
        particles.addHammerQuake(this.x + this.facing * 35, slamY, '#ea580c');
      }
      particles.addExplosion(this.x + this.facing * 35, slamY - 15, '#ea580c', 22);
      particles.addSparkle(this.x, slamY - 15, '#fbbf24', 22, 7);
      particles.addSparkle(this.x, slamY - 15, '#ea580c', 22, 7);
    }
  }

  executeFusionSpecialK(audioEngine, particles, projectiles, dmgMult = 1.0) {
    const f = this.fusionData;
    const fid = f.id;
    const slamY = this.y;

    if (fid === 'stevonnie') {
      // Stevonnie: Shield Hover Dropkick + Trailing Rose Sword Wave!
      audioEngine.playSfx('shield');
      audioEngine.playSfx('whoosh');
      this.vx = this.facing * 370;
      projectiles.push({
        x: this.x + this.facing * 38,
        y: slamY - 35,
        vx: this.facing * 660,
        vy: 0,
        radius: 38,
        damage: Math.round(80 * dmgMult),
        type: 'fusionHoverDropkick',
        color: '#ec4899',
        life: 1.2
      });
      projectiles.push({
        x: this.x + this.facing * 24,
        y: slamY - 40,
        vx: this.facing * 520,
        vy: 0,
        width: 120,
        height: 80,
        damage: Math.round(38 * dmgMult),
        type: 'connieSwordBeam',
        color: '#f43f5e',
        life: 0.75
      });
      if (particles) {
        particles.addThrustPierce(this.x + this.facing * 35, slamY - 35, this.facing, '#ec4899');
        particles.addHitSpark(this.x + this.facing * 35, slamY - 35, '#fde047', 26, 0);
      }
      particles.addRosePetals(this.x, slamY - 35, 16);
    } else if (fid === 'smoky') {
      // Smoky Quartz: 4-String Tethered Yo-Yo Barrage!
      audioEngine.playSfx('whip');
      for (const offsetY of [-24, -8, 8, 24]) {
        projectiles.push({
          x: this.x + this.facing * 38,
          y: slamY - 36 + offsetY,
          originX: this.x + this.facing * 12,
          originY: slamY - 36,
          vx: this.facing * (620 - Math.abs(offsetY) * 2),
          vy: offsetY * 3.0,
          radius: Math.abs(offsetY) === 8 ? 32 : 21,
          damage: Math.round((Math.abs(offsetY) === 8 ? 52 : 34) * dmgMult),
          type: 'fusionYoYo',
          color: '#a855f7',
          life: 1.05
        });
      }
      if (particles) {
        particles.addWhipSnap(this.x + this.facing * 35, slamY - 35, this.facing, '#a855f7');
        particles.addHitSpark(this.x + this.facing * 38, slamY - 35, '#fde047', 26, Math.PI / 4);
      }
      particles.addSparkle(this.x + this.facing * 35, slamY - 35, '#c084fc', 24, 6);
    } else if (fid === 'rainbow2') {
      // Rainbow Quartz 2.0: Prismatic Parasol Blaster + 5-Color Rainbow Star Volley!
      audioEngine.playSfx('laser');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 40,
        y: slamY - 40,
        vx: this.facing * 660,
        vy: 0,
        radius: 34,
        damage: Math.round(76 * dmgMult),
        type: 'fusionParasolRocket',
        color: '#38bdf8',
        life: 1.05
      });
      const starPalette = ['#f43f5e', '#fb923c', '#fde047', '#34d399', '#c084fc'];
      const fanVy = [-115, -55, 0, 55, 115];
      for (let i = 0; i < fanVy.length; i++) {
        projectiles.push({
          x: this.x + this.facing * 44,
          y: slamY - 42,
          vx: this.facing * 630,
          vy: fanVy[i],
          radius: 17,
          damage: Math.round(28 * dmgMult),
          type: 'fusionPrismCannon',
          color: starPalette[i],
          life: 0.95
        });
      }
      if (particles) {
        particles.addThrustPierce(this.x + this.facing * 35, slamY - 40, this.facing, '#38bdf8');
        particles.addCollectBurst(this.x + this.facing * 35, slamY - 40, '#f472b6');
      }
      particles.addSparkle(this.x, slamY - 40, '#f472b6', 22, 6);
    } else if (fid === 'sunstone') {
      // Sunstone: Solar Rocket Punch!
      audioEngine.playSfx('rocket');
      audioEngine.playSfx('punch');
      projectiles.push({
        x: this.x + this.facing * 38,
        y: slamY - 42,
        vx: this.facing * 660,
        vy: 0,
        radius: 36,
        damage: Math.round(86 * dmgMult),
        type: 'fusionSunGauntlet',
        color: '#ea580c',
        life: 1.15
      });
      if (particles) {
        particles.addFireRing(this.x + this.facing * 35, slamY, '#ea580c');
        particles.addHitSpark(this.x + this.facing * 40, slamY - 42, '#fde047', 26, 0);
      }
      particles.addSparkle(this.x, slamY - 42, '#fde047', 24, 6);
    } else if (fid === 'sugilite') {
      // Sugilite: Earthquake Stomp at current elevation!
      audioEngine.playSfx('hammer');
      for (const dir of [-1, 1]) {
        projectiles.push({
          x: this.x + dir * 48,
          y: slamY - 24,
          vx: dir * 540,
          vy: 0,
          width: 100,
          height: 58,
          damage: Math.round(94 * dmgMult),
          type: 'seismicShockwave',
          color: '#7e22ce',
          life: 0.95
        });
      }
      if (particles) {
        particles.addHammerQuake(this.x, slamY, '#7e22ce');
        particles.addShockwaveRing(this.x, slamY, 145, '#c084fc', 4.5);
      }
    } else if (fid === 'sardonyx') {
      // Sardonyx: Spinning Hammer Drill!
      audioEngine.playSfx('hammer');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 42,
        y: slamY - 40,
        vx: this.facing * 620,
        vy: 0,
        radius: 38,
        damage: Math.round(88 * dmgMult),
        type: 'fusionHammerDrill',
        color: '#fb7185',
        life: 1.05
      });
      if (particles) {
        particles.addHammerQuake(this.x + this.facing * 40, slamY, '#fb7185');
        particles.addHitSpark(this.x + this.facing * 42, slamY - 40, '#fde047', 24, Math.PI / 4);
      }
      particles.addSparkle(this.x, slamY - 40, '#fdba74', 22, 6);
    } else if (fid === 'opal') {
      // Opal: Long-Range Seeking 5-Arrow Volley (reaches clear across the arena!)
      audioEngine.playSfx('laser');
      const angles = [-140, -70, 0, 70, 140];
      for (const vy of angles) {
        projectiles.push({
          x: this.x + this.facing * 42,
          y: slamY - 54,
          vx: this.facing * 920,
          vy: vy,
          radius: 20,
          damage: Math.round(92 * dmgMult),
          type: 'fusionOpalArrow',
          color: '#818cf8',
          life: 1.55,
          homing: 460,
          pierceLeft: 2,
          knockX: 320,
          knockY: -180,
          hitText: 'OPAL VOLLEY!'
        });
      }
      if (particles) {
        particles.addThrustPierce(this.x + this.facing * 42, slamY - 54, this.facing, '#818cf8');
        particles.addHitSpark(this.x + this.facing * 45, slamY - 54, '#67e8f9', 26, 0);
      }
      particles.addSparkle(this.x, slamY - 52, '#c084fc', 24, 6);
    } else if (fid === 'malachite') {
      // Malachite: Glacial Ice Hand Slam at current elevation!
      audioEngine.playSfx('water');
      audioEngine.playSfx('hammer');
      projectiles.push({
        x: this.x + this.facing * 125,
        y: slamY - 58,
        vx: 0,
        vy: 0,
        width: 130,
        height: 120,
        damage: Math.round(98 * dmgMult),
        type: 'fusionGlacialFist',
        color: '#2dd4bf',
        life: 0.85
      });
      if (particles) {
        particles.addWaterStream(this.x + this.facing * 125, slamY - 55, this.facing, '#2dd4bf');
        particles.addShockwaveRing(this.x + this.facing * 125, slamY, 130, '#a7f3d0', 4.0);
      }
      particles.addSparkle(this.x + this.facing * 125, slamY - 45, '#a7f3d0', 26, 7);
    } else if (fid === 'rainbowClassic') {
      // Rainbow Quartz Classic: Rose Petal Barrier Thrust!
      audioEngine.playSfx('sword');
      audioEngine.playSfx('shield');
      projectiles.push({
        x: this.x + this.facing * 42,
        y: slamY - 42,
        vx: this.facing * 580,
        vy: 0,
        width: 118,
        height: 98,
        damage: Math.round(86 * dmgMult),
        type: 'roseShockwave',
        color: '#f43f5e',
        life: 0.80
      });
      if (particles) particles.addHolyHeal(this.x + this.facing * 40, slamY - 40, '#f43f5e');
      particles.addRosePetals(this.x, slamY - 35, 18);
    }
  }

  executeFusionSkillL(audioEngine, particles, pickups, projectiles, dmgMult = 1.0) {
    const f = this.fusionData;
    const fid = f.id;
    const slamY = this.y;
    this.actionType = 'skill';
    this.actionDuration = 0.65;
    this.actionTimer = 0.65;
    this.invulnerableTimer = 0.75;
    if (audioEngine && audioEngine.duckMusic) audioEngine.duckMusic(0.75, 1.2);

    if (fid === 'stevonnie') {
      // Stevonnie: Rose Sword Wave + Team Heal Spark!
      audioEngine.playSfx('sword');
      audioEngine.playSfx('whoosh');
      if (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + 1);
      }
      if (typeof this.onTeamHeal === 'function') this.onTeamHeal(this, 1);
      projectiles.push({
        x: this.x + this.facing * 52,
        y: slamY - 50,
        vx: this.facing * 580,
        vy: 0,
        width: 290,
        height: 155,
        damage: Math.round(135 * dmgMult),
        type: 'fusionRoseSwordWave',
        color: '#ec4899',
        life: 1.4
      });
      if (particles) {
        particles.addThrustPierce(this.x + this.facing * 50, slamY - 45, this.facing, '#ec4899');
        particles.addCollectBurst(this.x + this.facing * 45, slamY - 45, '#f43f5e');
      }
      particles.addRosePetals(this.x, slamY - 45, 26);
    } else if (fid === 'smoky') {
      // Smoky Quartz: Cyclone Tornado!
      audioEngine.playSfx('spindash');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 60,
        y: slamY - 64,
        vx: this.facing * 470,
        vy: 0,
        width: 230,
        height: 185,
        damage: Math.round(130 * dmgMult),
        type: 'fusionCyclone',
        color: '#a855f7',
        life: 1.6
      });
      if (particles) {
        particles.addWhipSnap(this.x + this.facing * 60, slamY - 60, this.facing, '#a855f7');
        particles.addHitSpark(this.x + this.facing * 55, slamY - 58, '#fde047', 28, Math.PI / 4);
      }
      particles.addSparkle(this.x, slamY - 50, '#c084fc', 32, 8);
    } else if (fid === 'rainbow2') {
      // Rainbow Quartz 2.0: Prismatic Prism Cannon!
      audioEngine.playSfx('laser');
      projectiles.push({
        x: this.x + this.facing * 68,
        y: slamY - 48,
        vx: this.facing * 700,
        vy: 0,
        width: 330,
        height: 105,
        damage: Math.round(140 * dmgMult),
        type: 'fusionPrismCannon',
        color: '#38bdf8',
        life: 1.35
      });
      if (particles) {
        particles.addLightningArc(this.x, slamY - 45, this.x + this.facing * 185, slamY - 45, '#38bdf8');
        particles.addCollectBurst(this.x + this.facing * 48, slamY - 48, '#f472b6');
      }
      particles.addSparkle(this.x, slamY - 45, '#f472b6', 30, 8);
    } else if (fid === 'sunstone') {
      // Sunstone: Supernova Crater Dive Slam + Twin Solar Shockwaves!
      audioEngine.playSfx('overdrive');
      audioEngine.playSfx('punch');
      projectiles.push({
        x: this.x,
        y: slamY - 82,
        vx: 0,
        vy: 0,
        width: 350,
        height: 185,
        damage: Math.round(156 * dmgMult),
        type: 'fusionSupernova',
        color: '#ea580c',
        life: 1.05
      });
      for (const sdir of [-1, 1]) {
        projectiles.push({
          x: this.x + sdir * 45,
          y: slamY - 38,
          vx: sdir * 460,
          vy: 0,
          radius: 28,
          damage: Math.round(45 * dmgMult),
          type: 'fusionSunGauntlet',
          color: '#fde047',
          life: 0.85
        });
      }
      if (particles) {
        particles.addFireRing(this.x, slamY, '#ea580c');
        particles.addHammerQuake(this.x, slamY, '#f97316');
        particles.addShockwaveRing(this.x, slamY - 24, 185, '#fde047', 5);
        particles.addHitSpark(this.x, slamY - 56, '#ffffff', 32, 0);
      }
      particles.addSparkle(this.x, slamY - 50, '#fde047', 40, 10);
    } else if (fid === 'sugilite') {
      // Sugilite: Flail Cataclysm!
      audioEngine.playSfx('hammer');
      audioEngine.playSfx('overdrive');
      projectiles.push({
        x: this.x + this.facing * 85,
        y: slamY - 72,
        vx: this.facing * 330,
        vy: 0,
        width: 300,
        height: 165,
        damage: Math.round(165 * dmgMult),
        type: 'fusionFlailCataclysm',
        color: '#7e22ce',
        life: 1.2
      });
      if (particles) {
        particles.addHammerQuake(this.x + this.facing * 85, slamY, '#7e22ce');
        particles.addShockwaveRing(this.x + this.facing * 85, slamY - 30, 165, '#c084fc', 4.5);
      }
      particles.addSparkle(this.x, slamY - 60, '#c084fc', 35, 9);
    } else if (fid === 'sardonyx') {
      // Sardonyx: Showstopper Finale (centered spotlight at slamY)!
      audioEngine.playSfx('stageClear');
      projectiles.push({
        x: this.x,
        y: slamY - 90,
        vx: 0,
        vy: 0,
        width: 300,
        height: 195,
        damage: Math.round(150 * dmgMult),
        type: 'fusionShowstopper',
        color: '#fb7185',
        life: 1.1
      });
      if (particles) {
        particles.addHammerQuake(this.x, slamY, '#fb7185');
        particles.addVictoryLightRays(this.x, slamY - 65, '#fde047', 12);
      }
      particles.addSparkle(this.x, slamY - 50, '#fdba74', 36, 9);
    } else if (fid === 'opal') {
      // Opal: Long-Range Celestial Light Rain (rains forward across distant targets + 3 piercing horizon arrows)!
      audioEngine.playSfx('laser');
      for (let a = 0; a < 22; a++) {
        const forwardDist = 90 + a * 34;
        const rainX = Math.max(40, this.x + this.facing * forwardDist);
        projectiles.push({
          x: rainX,
          y: slamY - 360 - (a % 4) * 38,
          vx: this.facing * 140 + (Math.random() - 0.5) * 60,
          vy: 740 + Math.random() * 120,
          radius: 20,
          damage: Math.round(52 * dmgMult),
          type: 'fusionCelestialRain',
          color: '#818cf8',
          life: 1.35,
          homing: 320,
          pierceLeft: 2,
          knockX: 280,
          knockY: -200,
          hitText: 'CELESTIAL RAIN!'
        });
      }
      // Plus 3 ultra-long-range horizon starlight arrows to snipe distant enemies directly!
      for (const vy of [-55, 0, 55]) {
        projectiles.push({
          x: this.x + this.facing * 45,
          y: slamY - 56,
          vx: this.facing * 1050,
          vy,
          radius: 22,
          damage: Math.round(88 * dmgMult),
          type: 'fusionOpalArrow',
          color: '#fde047',
          life: 1.55,
          homing: 520,
          pierceLeft: 3,
          knockX: 380,
          knockY: -220,
          hitText: 'STARLIGHT SNIPE!'
        });
      }
      if (particles) {
        particles.addThrustPierce(this.x + this.facing * 45, slamY - 54, this.facing, '#818cf8');
        particles.addHitSpark(this.x + this.facing * 45, slamY - 68, '#fde047', 28, Math.PI / 4);
      }
      particles.addSparkle(this.x, slamY - 52, '#c084fc', 35, 9);
    } else if (fid === 'malachite') {
      // Malachite: Abyssal Tsunami Cage (centered on Malachite at slamY)!
      audioEngine.playSfx('water');
      projectiles.push({
        x: this.x,
        y: slamY - 82,
        vx: 0,
        vy: 0,
        width: 320,
        height: 170,
        damage: Math.round(168 * dmgMult),
        type: 'fusionTsunamiCage',
        color: '#0d9488',
        life: 1.2
      });
      if (particles) {
        particles.addWaterStream(this.x, slamY - 75, 1, '#0d9488');
        particles.addWaterStream(this.x, slamY - 75, -1, '#2dd4bf');
        particles.addShockwaveRing(this.x, slamY - 25, 170, '#2dd4bf', 4.5);
      }
      particles.addSparkle(this.x, slamY - 60, '#2dd4bf', 36, 9);
    } else if (fid === 'rainbowClassic') {
      // Rainbow Quartz Classic: Prismatic Tears Dance (centered at slamY + team heal)!
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      if (typeof this.hp === 'number' && typeof this.maxHp === 'number' && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + 1);
      }
      pickups.push({ x: this.x - 30, y: slamY - 15, type: 'cookie', life: 18 });
      pickups.push({ x: this.x + 30, y: slamY - 15, type: 'cookie', life: 18 });
      projectiles.push({
        x: this.x,
        y: slamY - 70,
        vx: 0,
        vy: 0,
        width: 260,
        height: 145,
        damage: Math.round(140 * dmgMult),
        type: 'fusionPrismRose',
        color: '#f43f5e',
        life: 1.1
      });
      if (particles) particles.addVictoryLightRays(this.x, slamY - 55, '#fbcfe8', 10);
      particles.addRosePetals(this.x, slamY - 45, 30);
    }
  }

  takeDamage(amount, particles, audioEngine) {
    if (this.isFallen) return false;

    // PERFECT PARRY / COUNTER-FLASH (140ms precision timing window)
    if (this.parryWindow > 0) {
      this.parryWindow = 0;
      this.invulnerableTimer = 0.45;
      this.attackCooldown = 0;
      this.specialCooldown = 0;
      this.skillCooldown = 0;
      this.dodgeCooldown = 0;
      if (audioEngine) {
        audioEngine.playSfx('parry');
        audioEngine.playSfx('subBass');
      }
      if (particles) {
        particles.addPerfectParryVFX(this.x, this.y - 30);
        particles.addDamageText(this.x, this.y - 65, '★ PERFECT PARRY!', true, '#fde047');
      }
      if (this.gameRef) {
        this.gameRef.triggerHitstop(0.08, 4.0);
        if (this.playerId === 'p2') {
          this.gameRef.starPowerMeterP2 = Math.min(100, (this.gameRef.starPowerMeterP2 || 0) + 15);
        } else {
          this.gameRef.starPowerMeter = Math.min(100, this.gameRef.starPowerMeter + 15);
        }
        this.gameRef.addFusionSync(15);
        if (this.gameRef.enemyManager && this.gameRef.enemyManager.enemies) {
          for (const e of this.gameRef.enemyManager.enemies) {
            if (Math.hypot(e.x - this.x, e.y - this.y) < 240) {
              e.hurtTimer = 0.85;
              e.stunTimer = 0.85;
              e.vx = (e.x < this.x ? -1 : 1) * 260;
              particles.addHitSpark(e.x, e.y - 20, '#fde047', 24, 0);
            }
          }
        }
      }
      return false;
    }

    if (this.invulnerableTimer > 0 || this.isSpinDashing) return false;
    // Garnet Passive: Future Vision automatically foresees & parries the next incoming hit!
    if (!this.isFusion && this.activeChar === 'garnet' && this.futureVisionReady) {
      this.futureVisionReady = false;
      this.futureVisionTimer = 0;
      this.counterBuffTimer = 3.0;
      this.invulnerableTimer = 0.55;
      if (audioEngine) audioEngine.playSfx('parry');
      if (particles) {
        particles.addPerfectParryVFX(this.x, this.y - 38);
        particles.addDamageText(this.x, this.y - 82, '👁️ FUTURE VISION!', true, '#fde047');
      }
      return false;
    }
    if (this.isShielding) {
      this.invulnerableTimer = 0.28;
      if (audioEngine) audioEngine.playSfx('shield');
      if (particles) particles.addShieldBlockRipple(this.x, this.y - 34, this.facing, this.activeChar === 'steven' ? '#ff6097' : '#62c8f4');
      // Steven Spiked Pink Bubble reflects thorn damage to nearby attackers on block!
      if (this.activeChar === 'steven' && this.gameRef?.enemyManager?.enemies) {
        for (const e of this.gameRef.enemyManager.enemies) {
          if (e.hp > 0 && Math.hypot(e.x - this.x, e.y - this.y) < 120) {
            e.hp = Math.max(0, e.hp - 18);
            e.hurtTimer = 0.35;
            e.vx = (e.x < this.x ? -1 : 1) * 290;
            if (particles) particles.addDamageText(e.x, e.y - 52, '-18 SPIKE COUNTER!', true, '#ff6097');
          }
        }
      }
      return false;
    }
    // Steven & Rose Shield-Guard attack frames reduce incoming damage by 50% without interrupting their swing
    let attackGuardMult = 1.0;
    if (this.attackGuardTimer > 0) {
      attackGuardMult = 0.50;
      if (audioEngine) audioEngine.playSfx('shield');
      if (particles) {
        particles.addShieldBlockRipple(this.x, this.y - 34, this.facing, '#ff94ba');
        particles.addDamageText(this.x, this.y - 84, 'GUARDED!', false, '#fbcfe8');
      }
    }
    this.invulnerableTimer = 1.25; // Generous 1.25s iframes to prevent rapid tick deaths!
    const bismuthArmor = (!this.isFusion && this.activeChar === 'bismuth') ? 0.80 : 1.0;
    const finalDamage = this.isPinkOverdrive
      ? Math.max(1, Math.round(amount * 0.5 * bismuthArmor * attackGuardMult))
      : Math.max(1, Math.round(amount * bismuthArmor * attackGuardMult));
    if (audioEngine) audioEngine.playSfx('hurt');
    const stats = (typeof this.getCombatStats === 'function') ? this.getCombatStats() : { defense: 35 };
    const baseUnitDmg = (finalDamage || 1) * 95;
    const defMit = 100 / (100 + (stats.defense || 0));
    const displayHpLoss = Math.max(14, Math.round(baseUnitDmg * defMit * (this.isPinkOverdrive ? 0.65 : 1.0)));
    if (particles) {
      particles.addDamageText(this.x, this.y - 65, `-${displayHpLoss} HP`, true, '#ef4444');
      particles.addSparkle(this.x, this.y - 35, '#ef4444', 10, 4);
    }
    this._lastMitigatedHpLoss = displayHpLoss;
    return finalDamage;
  }

  draw(ctx) {
    if (this.isMergedInFusion) return;

    // Dynamic Cast Shadow on Ground / Platform
    const floorY = this.currentPlatform ? this.currentPlatform.y : this.groundY;
    const elev = Math.max(0, floorY - this.y);
    const shadowScale = Math.max(0.25, 1 - (elev / 380));
    ctx.save();
    ctx.translate(this.x, floorY);
    ctx.scale(shadowScale, shadowScale * 0.32);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (this.isFallen) {
      this.drawFallenHero(ctx);
      return;
    }

    if (this.isFusion && this.fusionData) {
      this.drawFusionHero(ctx);
      return;
    }

    // 1. Draw Overdrive Afterimages (Custom colored per character)
    if (this.afterimages && this.afterimages.length > 0) {
      const charThemes = {
        steven: { fill: 'rgba(255, 20, 147, 0.35)', stroke: 'rgba(255, 105, 180, 0.6)' },
        garnet: { fill: 'rgba(239, 68, 68, 0.35)', stroke: 'rgba(56, 189, 248, 0.6)' },
        amethyst: { fill: 'rgba(168, 85, 247, 0.35)', stroke: 'rgba(233, 213, 255, 0.6)' },
        pearl: { fill: 'rgba(34, 211, 238, 0.35)', stroke: 'rgba(255, 255, 255, 0.7)' },
        bismuth: { fill: 'rgba(249, 115, 22, 0.35)', stroke: 'rgba(250, 204, 21, 0.6)' },
        peridot: { fill: 'rgba(34, 197, 94, 0.35)', stroke: 'rgba(163, 230, 53, 0.6)' },
        lapis: { fill: 'rgba(14, 165, 233, 0.35)', stroke: 'rgba(224, 242, 254, 0.7)' },
        rose: { fill: 'rgba(244, 114, 182, 0.35)', stroke: 'rgba(255, 228, 230, 0.7)' },
        connie: { fill: 'rgba(244, 114, 182, 0.45)', stroke: 'rgba(56, 189, 248, 0.8)' },
        jasper: { fill: 'rgba(234, 88, 12, 0.45)', stroke: 'rgba(251, 191, 36, 0.8)' }
      };
      const theme = charThemes[this.activeChar] || charThemes.steven;
      for (const img of this.afterimages) {
        ctx.save();
        ctx.translate(img.x, img.y);
        ctx.scale(img.facing, 1);
        ctx.globalAlpha = (img.life / img.maxLife) * 0.4;
        ctx.fillStyle = theme.fill;
        this.drawHeroSilhouette(ctx, this.activeChar, theme.fill, theme.stroke);
        ctx.restore();
      }
    }

    // Dynamic Kinetic Action Movement & Body Physics (Anticipation -> Snap -> Hold -> Recovery!)
    let actionLunge = 0;
    let actionLiftY = 0;
    let actionTorsoTilt = 0;
    let actionScaleX = 1;
    let actionScaleY = 1;
    let animP = 0;

    if (this.actionTimer > 0 && this.actionDuration > 0) {
      animP = Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration)));
      const strike = this.getStrikeCurve(animP);
      const posStrike = Math.max(0, strike);
      if (this.actionType === 'punch') {
        // Differentiated per-Guardian fighting style kinetics
        const combo = this.attackCombo || 0;
        const st = this.attackStyle || 'boxer';
        if (st === 'guardBrawler' || st === 'paladin') {
          // Shield-forward braced steps -> rising guardian sweep
          if (combo === 0) {
            actionLunge = strike * 18;
            actionTorsoTilt = strike * 0.12;
            actionScaleX = 1 + posStrike * 0.05;
          } else if (combo === 1) {
            actionLunge = strike * 26;
            actionLiftY = posStrike * 4;
            actionTorsoTilt = strike * 0.18;
            actionScaleX = 1 + posStrike * 0.08;
            actionScaleY = 1 - posStrike * 0.05;
          } else {
            actionLunge = strike * 24;
            actionLiftY = -posStrike * 18;
            actionTorsoTilt = -posStrike * 0.18;
            actionScaleY = 1 + posStrike * 0.08;
          }
        } else if (st === 'whipAcrobat' || st === 'iaido') {
          // Rapid 5-hit fluid martial chain (snaps -> diagonal twist -> vault -> finisher)
          if (combo === 0 || combo === 2) {
            actionLunge = strike * (st === 'iaido' ? 28 : 16);
            actionTorsoTilt = strike * 0.22;
            actionScaleX = 1 + posStrike * 0.07;
          } else if (combo === 1) {
            actionLunge = strike * (st === 'iaido' ? 24 : 10);
            actionLiftY = posStrike * 5;
            actionTorsoTilt = -strike * 0.20;
          } else if (combo === 3) {
            actionLunge = strike * 24;
            actionLiftY = -posStrike * 20;
            actionTorsoTilt = -posStrike * 0.26;
            actionScaleY = 1 + posStrike * 0.09;
          } else {
            actionLunge = strike * 34;
            actionLiftY = (animP < 0.38) ? -18 * Math.sin((animP / 0.38) * (Math.PI / 2)) : 8 * Math.sin(((animP - 0.38) / 0.62) * Math.PI);
            actionTorsoTilt = (animP < 0.38) ? -0.22 : 0.32 * posStrike;
            actionScaleX = 1 + posStrike * 0.09;
          }
        } else if (st === 'fencer' || st === 'hydroWeaver') {
          // Graceful linear thrusts & airborne pirouette/geyser lift
          if (combo === 0 || combo === 1) {
            actionLunge = strike * 26;
            actionLiftY = -posStrike * 4;
            actionTorsoTilt = strike * 0.14;
            actionScaleX = 1 + posStrike * 0.06;
          } else if (combo === 2) {
            actionLunge = strike * 20;
            actionLiftY = -posStrike * 24;
            actionTorsoTilt = -posStrike * 0.22;
            actionScaleY = 1 + posStrike * 0.10;
          } else {
            actionLunge = strike * 30;
            actionLiftY = -posStrike * 10;
            actionTorsoTilt = strike * 0.24;
            actionScaleX = 1 + posStrike * 0.08;
          }
        } else if (st === 'ferroZoner') {
          // Telekinetic stance + Hit 3 tactical backstep hop
          if (combo < 2) {
            actionLunge = strike * 10;
            actionTorsoTilt = -strike * 0.10;
            actionScaleY = 1 + posStrike * 0.05;
          } else {
            actionLunge = -strike * 22;
            actionLiftY = -posStrike * 14;
            actionTorsoTilt = -posStrike * 0.24;
          }
        } else if (st === 'heavyForge' || st === 'juggernaut') {
          // Heavy windup -> thunderous forward shoulder ram / molten anvil drop
          if (combo === 0) {
            actionLunge = strike * 24;
            actionTorsoTilt = strike * 0.22;
            actionScaleX = 1 + posStrike * 0.08;
          } else if (combo === 1) {
            actionLunge = strike * 36;
            actionLiftY = posStrike * 6;
            actionTorsoTilt = strike * 0.30;
            actionScaleX = 1 + posStrike * 0.10;
            actionScaleY = 1 - posStrike * 0.08;
          } else {
            actionLunge = strike * 38;
            if (animP < 0.42) {
              const leap = Math.sin((animP / 0.42) * (Math.PI / 2));
              actionLiftY = -26 * leap;
              actionTorsoTilt = -0.28 * leap;
              actionScaleY = 1 + 0.09 * leap;
            } else {
              const slam = Math.sin(((animP - 0.42) / 0.58) * Math.PI);
              actionLiftY = 12 * slam;
              actionTorsoTilt = 0.34 * slam;
              actionScaleX = 1 + 0.11 * slam;
              actionScaleY = 1 - 0.09 * slam;
            }
          }
        } else {
          // Orthodox Boxer (Garnet): 1-2 Jab-Cross -> Rising Shoryu Uppercut -> Electro-Meteor Slam
          if (combo === 0) {
            actionLunge = strike * 22;
            actionLiftY = -posStrike * 3;
            actionTorsoTilt = strike * 0.16;
            actionScaleX = 1 + posStrike * 0.06;
            actionScaleY = 1 - posStrike * 0.03;
          } else if (combo === 1) {
            actionLunge = strike * 22;
            actionLiftY = posStrike * 4;
            actionTorsoTilt = -strike * 0.18;
            actionScaleX = 1 + posStrike * 0.06;
          } else if (combo === 2) {
            actionLunge = strike * 22;
            actionLiftY = -posStrike * 20;
            actionTorsoTilt = -posStrike * 0.18;
            actionScaleY = 1 + posStrike * 0.09;
          } else {
            actionLunge = strike * 32;
            if (animP < 0.40) {
              const leap = Math.sin((animP / 0.40) * (Math.PI / 2));
              actionLiftY = -22 * leap;
              actionTorsoTilt = -0.24 * leap;
              actionScaleY = 1 + 0.07 * leap;
            } else {
              const slam = Math.sin(((animP - 0.40) / 0.60) * Math.PI);
              actionLiftY = 10 * slam;
              actionTorsoTilt = 0.30 * slam;
              actionScaleX = 1 + 0.08 * slam;
              actionScaleY = 1 - 0.07 * slam;
            }
          }
        }
      } else if (this.actionType === 'throw') {
        // Physical throw: deep windup coil backwards then whipping launch forward
        if (animP < 0.30) {
          const windup = Math.sin((animP / 0.30) * (Math.PI / 2));
          actionLunge = -12 * windup;
          actionTorsoTilt = -0.20 * windup;
          actionScaleX = 1 - 0.04 * windup;
        } else {
          const whip = Math.sin(((animP - 0.30) / 0.70) * Math.PI);
          actionLunge = 22 * whip;
          actionTorsoTilt = 0.24 * whip;
          actionScaleX = 1 + 0.06 * whip;
        }
      } else if (this.actionType === 'shield') {
        // Braced defensive crouch & grounding
        const p = Math.sin(animP * Math.PI);
        actionLiftY = p * 6;
        actionTorsoTilt = p * 0.08;
        actionScaleY = 1 - p * 0.04;
      } else if (this.actionType === 'heal') {
        // Graceful ascending float into divine celestial light
        const p = Math.sin(animP * Math.PI);
        actionLiftY = -p * 16;
        actionTorsoTilt = -p * 0.06;
      } else if (this.actionType === 'skill') {
        // High leap and seismic impact slam
        if (animP < 0.36) {
          const leap = Math.sin((animP / 0.36) * (Math.PI / 2));
          actionLiftY = -18 * leap;
          actionTorsoTilt = -0.16 * leap;
          actionScaleY = 1 + 0.06 * leap;
        } else {
          const slam = Math.sin(((animP - 0.36) / 0.64) * Math.PI);
          actionLunge = 14 * slam;
          actionLiftY = 9 * slam;
          actionTorsoTilt = 0.26 * slam;
          actionScaleX = 1 + 0.06 * slam;
          actionScaleY = 1 - 0.06 * slam;
        }
      }
    }

    // Character-Specific Dodge Kinetics & Cartoon Poses
    let dodgeTilt = 0;
    let dodgeLiftY = 0;
    let dodgeScaleX = 1;
    let dodgeScaleY = 1;

    if (this.isDodging) {
      const p = Math.min(1, Math.max(0, 1 - (this.dodgeTimer / this.dodgeDuration)));
      const dir = this.dodgeDirection;

      if (this.activeChar === 'connie') {
        // Fencing low tumble roll & lunge recovery
        dodgeTilt = p * Math.PI * 2 * dir;
        dodgeLiftY = -Math.sin(p * Math.PI) * 12;
      } else if (this.activeChar === 'jasper') {
        // Armored shoulder ram tackle slide
        dodgeLiftY = Math.sin(p * Math.PI) * 14;
        dodgeTilt = Math.sin(p * Math.PI) * 0.48 * dir;
        dodgeScaleY = 1 - Math.sin(p * Math.PI) * 0.22;
      } else if (this.activeChar === 'steven') {
        // Full somersault roll inside bubble
        dodgeTilt = p * Math.PI * 2 * dir;
        dodgeLiftY = -Math.sin(p * Math.PI) * 14;
      } else if (this.activeChar === 'garnet') {
        // Boxer low duck slip & weave
        dodgeLiftY = Math.sin(p * Math.PI) * 16;
        dodgeTilt = Math.sin(p * Math.PI) * 0.42 * dir;
        dodgeScaleY = 1 - Math.sin(p * Math.PI) * 0.22;
      } else if (this.activeChar === 'amethyst') {
        // Agile gymnastic spin roll
        dodgeTilt = p * Math.PI * 2 * dir;
        dodgeLiftY = Math.sin(p * Math.PI) * 8;
      } else if (this.activeChar === 'pearl') {
        // Graceful ballet pirouette / airborne leap
        dodgeLiftY = -Math.sin(p * Math.PI) * 25;
        dodgeTilt = -Math.sin(p * Math.PI) * 0.5 * dir;
      } else if (this.activeChar === 'bismuth') {
        // Heavy armored shoulder duck & anvil skid
        dodgeLiftY = Math.sin(p * Math.PI) * 14;
        dodgeTilt = Math.sin(p * Math.PI) * 0.46 * dir;
        dodgeScaleY = 1 - Math.sin(p * Math.PI) * 0.25;
      } else if (this.activeChar === 'peridot') {
        // Panicked thruster skitter / comedy lean
        dodgeLiftY = Math.sin(p * Math.PI) * 10;
        dodgeTilt = -Math.sin(p * Math.PI) * 0.45 * dir;
      } else if (this.activeChar === 'lapis') {
        // Fluid water-mist phase glide
        dodgeLiftY = -Math.sin(p * Math.PI) * 16;
        dodgeTilt = Math.sin(p * Math.PI) * 0.24 * dir;
      } else if (this.activeChar === 'rose') {
        // Sacred floating levitation glide & petal swirl
        dodgeLiftY = -Math.sin(p * Math.PI) * 18;
        dodgeTilt = Math.sin(p * Math.PI) * 0.16 * dir;
      }
    }

    ctx.save();
    ctx.translate(this.x + actionLunge * this.facing, this.y + actionLiftY + dodgeLiftY);
    // Landing squash & stretch: wide and low on impact, springing back
    this.landSquash = Math.max(0, (this.landSquash || 0) - 0.055);
    const sq = this.landSquash;
    const landX = 1 + 0.18 * sq;
    const landY = 1 - 0.20 * sq;
    const motion = this.getCharacterMotionState();
    const uSq = this.getUnleashIdleSquash();
    ctx.scale(this.facing * dodgeScaleX * actionScaleX * landX * motion.breathScaleX * uSq.sx, dodgeScaleY * actionScaleY * landY * motion.breathScaleY * uSq.sy);
    if (motion.hoverY) ctx.translate(0, motion.hoverY);

    // Dodge ghost trail & Double-Tap Sprint Speed-Lines
    if (this.isSprinting) {
      ctx.save();
      const sPulse = Math.sin((this.animTime || 0) * 28);
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.72)';
      ctx.lineCap = 'round';
      for (let sl = 0; sl < 4; sl++) {
        const ly = -16 - sl * 15 + (sl % 2 === 0 ? sPulse * 2 : -sPulse * 2);
        const len = 24 + (sl % 3) * 14;
        ctx.lineWidth = sl === 1 ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(-18 - sl * 5, ly);
        ctx.lineTo(-18 - sl * 5 - len, ly);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (this.isDodging) {
      for (let gI = 1; gI <= 3; gI++) {
        ctx.save();
        ctx.globalAlpha = 0.20 - gI * 0.05;
        ctx.fillStyle = '#a5f3fc';
        ctx.beginPath();
        ctx.ellipse(-this.facing * gI * 16, -38, 16, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.rotate(actionTorsoTilt + dodgeTilt + motion.torsoTilt);

    if (this.isDodging && this.activeChar === 'lapis') {
      ctx.globalAlpha = 0.65; // Lapis phase mist translucency
    } else if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const isMoving = motion.isMoving;
    const bob = motion.bob;

    // 2. Character Overdrive Aura & Power-Up Visuals + Crisp Cel Rim Light Glow
    if (this.isPinkOverdrive) {
      this.drawCharacterOverdriveAura(ctx, this.activeChar, bob);
    } else {
      // Subtle character-themed rim aura so every hero pops crisply off dark & bright arenas
      const rimMap = {
        steven: 'rgba(244,114,182,0.18)', garnet: 'rgba(225,29,72,0.18)',
        amethyst: 'rgba(168,85,247,0.20)', pearl: 'rgba(56,189,248,0.18)',
        bismuth: 'rgba(251,146,60,0.20)', peridot: 'rgba(74,222,128,0.20)',
        lapis: 'rgba(59,130,246,0.22)', rose: 'rgba(251,113,133,0.20)',
        connie: this.isPinkRevived ? 'rgba(244,114,182,0.34)' : 'rgba(249,168,212,0.18)',
        jasper: 'rgba(245,158,11,0.20)'
      };
      ctx.save();
      const rimG = ctx.createRadialGradient(0, -40 + bob, 6, 0, -40 + bob, 44);
      rimG.addColorStop(0, rimMap[this.activeChar] || 'rgba(244,114,182,0.18)');
      rimG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rimG;
      ctx.beginPath();
      ctx.arc(0, -40 + bob, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }



    if (this.activeChar === 'steven') {
      this.drawSteven(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'garnet') {
      this.drawGarnet(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'amethyst') {
      this.drawAmethyst(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'pearl') {
      this.drawPearl(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'bismuth') {
      this.drawBismuth(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'peridot') {
      this.drawPeridot(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'lapis') {
      this.drawLapis(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'rose') {
      this.drawRose(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'connie') {
      this.drawConnie(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'jasper') {
      this.drawJasper(ctx, bob, animP, this.actionType);
    }

    // Per-Hero Animated Signature Polish (gemstone gleams, elemental weapon arcs, visor sheen, petals)
    this.drawHeroSignatureFlourish(ctx, this.activeChar, bob, animP);

    if (this.isShielding && (this.activeChar === 'steven' || this.bubbleTimer > 0)) {
      this.drawBubbleShield(ctx);
    }

    // Dynamic Dodge Visual Accents
    if (this.isDodging) {
      this.drawDodgeVisuals(ctx, bob);
    }

    // 3. Dynamic Attack Slashes & Impact Visuals for each attack
    if (this.isAttacking) {
      this.drawAttackVisuals(ctx, bob);
    }

    ctx.restore();
  }

  // --- PER-HERO SIGNATURE VISUAL FLOURISHES (ALL 10 GUARDIANS + PINK CONNIE) ---
  drawHeroSignatureFlourish(ctx, charId, bob = 0, animP = 0) {
    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const pulse = 0.5 + 0.5 * Math.sin(t * 5.2);
    ctx.save();
    if (charId === 'steven') {
      // Glowing Rose-Quartz belly gem shimmer + drifting diamond starlight
      ctx.fillStyle = `rgba(255, 182, 217, ${0.42 + pulse * 0.35})`;
      this.drawMiniStar(ctx, 2, -26 + bob, 4.5 + pulse * 1.6);
      ctx.strokeStyle = `rgba(244, 114, 182, ${0.45 + pulse * 0.3})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(14, -32 + bob, 14 + pulse * 2, -0.7, 0.9);
      ctx.stroke();
    } else if (charId === 'garnet') {
      // Dual Ruby/Sapphire visor specular streaks + crackling gauntlet lightning
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(1, -67 + bob); ctx.lineTo(8, -62 + bob);
      ctx.stroke();
      ctx.strokeStyle = pulse > 0.5 ? '#38bdf8' : '#fb7185';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14, -38 + bob);
      ctx.lineTo(19, -43 + bob + Math.sin(t * 24) * 3);
      ctx.lineTo(25, -36 + bob);
      ctx.stroke();
    } else if (charId === 'amethyst') {
      // Faceted chest amethyst sparkle + crackling violet whip energy motes
      ctx.fillStyle = '#e9d5ff';
      this.drawMiniStar(ctx, 3, -39 + bob, 4.2 + pulse * 1.4);
      ctx.strokeStyle = `rgba(192, 132, 252, ${0.55 + pulse * 0.3})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(18, -32 + bob, 11 + pulse * 3, 0.2, 2.2);
      ctx.stroke();
    } else if (charId === 'pearl') {
      // Forehead pearl lustre + flowing translucent cyan ribbon gleam + spear tip glint
      ctx.fillStyle = '#ffffff';
      this.drawMiniStar(ctx, 4, -67 + bob, 3.8 + pulse * 1.2);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-10, -34 + bob);
      ctx.quadraticCurveTo(-22, -26 + bob + Math.sin(t * 7) * 4, -28, -14 + bob);
      ctx.stroke();
    } else if (charId === 'bismuth') {
      // Recessed rainbow chest gem glow + rising molten forge embers
      const rCol = ['#f43f5e', '#f59e0b', '#38bdf8', '#a855f7'][Math.floor(t * 4) % 4];
      ctx.strokeStyle = rCol;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-4, -44 + bob, 9, 9);
      for (let i = 0; i < 3; i++) {
        const ey = -28 - ((t * 26 + i * 14) % 34) + bob;
        ctx.fillStyle = i % 2 ? '#fde047' : '#fb923c';
        ctx.beginPath();
        ctx.arc(16 + Math.sin(t * 6 + i * 2) * 6, ey, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (charId === 'peridot') {
      // Glossy visor gleam + orbiting ferrokinetic metal shards
      ctx.strokeStyle = 'rgba(217, 249, 157, 0.8)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-2, -62 + bob); ctx.lineTo(9, -59 + bob);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const a = t * 3.8 + (i * Math.PI * 2) / 3;
        const sx = 14 + Math.cos(a) * 14;
        const sy = -40 + bob + Math.sin(a) * 8;
        ctx.fillStyle = '#a3e635';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 4); ctx.lineTo(sx + 3.5, sy); ctx.lineTo(sx, sy + 4); ctx.lineTo(sx - 3.5, sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (charId === 'lapis') {
      // Shimmering hydro-wing foam highlights + orbiting water droplets
      for (let i = 0; i < 4; i++) {
        const a = t * 3.2 + (i * Math.PI) / 2;
        const wx = Math.cos(a) * 26;
        const wy = -46 + bob + Math.sin(a) * 12;
        ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
        ctx.beginPath();
        ctx.arc(wx, wy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (charId === 'rose') {
      // Floating rose petals + radiant rose-quartz starlight
      for (let i = 0; i < 3; i++) {
        const py = -18 - ((t * 18 + i * 22) % 58) + bob;
        const px = Math.sin(t * 3 + i * 2.1) * 22;
        ctx.fillStyle = 'rgba(251, 113, 133, 0.78)';
        ctx.beginPath();
        ctx.ellipse(px, py, 3.6, 1.9, t + i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff1f2';
      this.drawMiniStar(ctx, 2, -29 + bob, 4.5 + pulse * 1.5);
    } else if (charId === 'connie') {
      // Sword specular blade gleam + Pink Connie Lion/Lars starlight halo!
      ctx.fillStyle = '#ffffff';
      this.drawMiniStar(ctx, 18, -48 + bob, 4.0 + pulse * 1.4);
      if (this.isPinkRevived) {
        ctx.strokeStyle = `rgba(244, 114, 182, ${0.55 + pulse * 0.35})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.ellipse(0, -40 + bob, 24 + pulse * 3, 36 + pulse * 3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fbcfe8';
        this.drawMiniStar(ctx, -18, -58 + bob, 4.5);
        this.drawMiniStar(ctx, 20, -24 + bob, 3.8);
      }
    } else if (charId === 'jasper') {
      // Glowing orange nose gem + fiery comet sparks off armored shoulders
      ctx.fillStyle = '#fde047';
      this.drawMiniStar(ctx, 7, -58 + bob, 3.4 + pulse * 1.2);
      for (let i = 0; i < 3; i++) {
        const jy = -26 - ((t * 28 + i * 16) % 44) + bob;
        ctx.fillStyle = i % 2 ? '#fb923c' : '#fde047';
        ctx.beginPath();
        ctx.arc(-14 + i * 14, jy, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // --- PER-FUSION SIGNATURE VISUAL FLOURISHES (ALL 9 CANON FUSIONS) ---
  drawFusionSignatureFlourish(ctx, fid, bob = 0, animP = 0) {
    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const pulse = 0.5 + 0.5 * Math.sin(t * 5.6);
    ctx.save();
    if (fid === 'stevonnie') {
      ctx.fillStyle = '#fbcfe8';
      this.drawMiniStar(ctx, 20, -48 + bob, 5.2 + pulse * 1.6);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.72)';
      ctx.beginPath();
      ctx.ellipse(-18, -32 + bob + Math.sin(t * 4) * 5, 4, 2, t, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'smoky') {
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(0, -34 + bob, 28 + pulse * 4, 9, -0.15, 0, Math.PI * 2);
      ctx.stroke();
    } else if (fid === 'rainbow2' || fid === 'rainbowClassic') {
      const pCols = ['#f472b6', '#facc15', '#38bdf8', '#c084fc'];
      for (let i = 0; i < 4; i++) {
        const a = t * 3.4 + (i * Math.PI) / 2;
        ctx.fillStyle = pCols[i];
        this.drawMiniStar(ctx, Math.cos(a) * 26, -48 + bob + Math.sin(a) * 16, 4.2);
      }
    } else if (fid === 'sunstone') {
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.65 + pulse * 0.3})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, -48 + bob, 30 + pulse * 5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (fid === 'sugilite') {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-26, -42 + bob); ctx.lineTo(-16, -54 + bob); ctx.lineTo(-8, -40 + bob);
      ctx.moveTo(14, -44 + bob); ctx.lineTo(24, -56 + bob); ctx.lineTo(30, -42 + bob);
      ctx.stroke();
    } else if (fid === 'sardonyx') {
      ctx.fillStyle = '#fde047';
      this.drawMiniStar(ctx, -20, -64 + bob, 5.5 + pulse * 1.8);
      this.drawMiniStar(ctx, 24, -44 + bob, 4.8 + pulse * 1.4);
    } else if (fid === 'opal') {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(18, -68 + bob); ctx.lineTo(18, -28 + bob);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      this.drawMiniStar(ctx, 26, -48 + bob, 5.5 + pulse * 1.5);
    } else if (fid === 'malachite') {
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.72)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -44 + bob, 34 + pulse * 4, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
      ctx.fillStyle = '#99f6e4';
      this.drawMiniStar(ctx, -22, -52 + bob, 4.2);
      this.drawMiniStar(ctx, 22, -52 + bob, 4.2);
    }
    ctx.restore();
  }

  // --- UNIQUE VISUAL OVERDRIVE AURAS FOR ALL 8 CANON GEMS ---
  drawCharacterOverdriveAura(ctx, charId, bob) {
    const time = Date.now();
    ctx.save();

    switch (charId) {
      case 'steven': {
        // 1. Steven: Steven Universe Future Giant Pink State!
        const pulse = Math.sin(time / 70) * 5;

        // Rotating Spiky Pink Diamond Star Ground Aura
        ctx.strokeStyle = 'rgba(255, 20, 147, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const starPoints = 6;
        for (let i = 0; i < starPoints * 2; i++) {
          const r = (i % 2 === 0) ? (32 + pulse) : 16;
          const a = (Math.PI / starPoints) * i + (time / 300);
          const px = Math.cos(a) * r * 1.2;
          const py = Math.sin(a) * (r * 0.45);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Concentric Pink Diamond Body Auras
        ctx.strokeStyle = 'rgba(255, 20, 147, 0.3)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, -38, 28 + pulse * 0.5, 46 + pulse * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 105, 180, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -38, 25 + pulse * 0.5, 42 + pulse * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ascending Pink Diamond Energy Shards
        for (let f = 0; f < 5; f++) {
          const fx = -18 + f * 9;
          const fy = -72 - ((time / 12 + f * 22) % 32);
          ctx.fillStyle = 'rgba(255, 105, 180, 0.75)';
          ctx.beginPath();
          ctx.moveTo(fx, fy - 4);
          ctx.lineTo(fx + 3, fy);
          ctx.lineTo(fx, fy + 4);
          ctx.lineTo(fx - 3, fy);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      case 'garnet': {
        // 2. Garnet: Ruby & Sapphire Dual Flame Resonance!
        const flamePulse = Math.sin(time / 80) * 4;

        // Ruby Flame Aura (Crimson Red / Ember Orange on back/left)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(-14, -48, 16 + flamePulse, 42 + flamePulse, -0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Sapphire Glacial Flame Aura (Electric Cyan / Frost Blue on front/right)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(14, -48, 16 + flamePulse, 42 + flamePulse, 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Swirling Dual Flames
        for (let i = 0; i < 6; i++) {
          const t = (time / 150 + i * 1.05);
          const rx = -16 + Math.cos(t) * 10;
          const ry = -20 - ((time / 10 + i * 20) % 70);
          ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f97316';
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.fill();

          const sx = 16 + Math.sin(t) * 10;
          const sy = -20 - ((time / 10 + i * 20 + 35) % 70);
          ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cosmic Visor Beam Flash
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-22, -82 + bob);
        ctx.lineTo(26, -82 + bob);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, -82 + bob, 6);
        break;
      }

      case 'amethyst': {
        // 3. Amethyst: Prime Kindergarten Volcanic Supercharged Quartz!
        const pulse = Math.sin(time / 65) * 5;

        // Electric Violet Shock Rings
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.38)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, -38, 28 + pulse, 44 + pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(233, 213, 255, 0.92)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -38, 25 + pulse, 40 + pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 4 Orbiting Jagged Amethyst Crystals
        for (let c = 0; c < 4; c++) {
          const angle = (time / 200) + (c * Math.PI / 2);
          const cx = Math.cos(angle) * (34 + pulse);
          const cy = -38 + Math.sin(angle) * (20 + pulse * 0.5);

          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx + 5, cy);
          ctx.lineTo(cx, cy + 8);
          ctx.lineTo(cx - 5, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Crackling Quartz Lightning Spark
        const lA = (time / 80) % (Math.PI * 2);
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(lA) * 22, -38 + Math.sin(lA) * 30);
        ctx.lineTo(Math.cos(lA + 0.5) * 28, -38 + Math.sin(lA + 0.5) * 35);
        ctx.stroke();
        break;
      }

      case 'pearl': {
        // 4. Pearl: Prismatic Holographic Mastery & Rainbow Radiant Form!
        const pulse = Math.sin(time / 90) * 4;

        // Rainbow Prism Concentric Arcs
        const colors = ['rgba(34, 211, 238, 0.75)', 'rgba(244, 114, 182, 0.75)', 'rgba(250, 204, 21, 0.75)', 'rgba(255, 255, 255, 0.9)'];
        for (let k = 0; k < colors.length; k++) {
          ctx.strokeStyle = colors[k];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, -42, 22 + k * 4 + pulse * 0.5, 46 + k * 4 + pulse * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Holographic Light Ribbons / Wings behind Pearl
        ctx.fillStyle = 'rgba(34, 211, 238, 0.28)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        const wingWave = Math.sin(time / 120) * 8;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.quadraticCurveTo(-38, -90 + wingWave, -48, -60 + wingWave);
        ctx.quadraticCurveTo(-30, -40, 0, -48);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.quadraticCurveTo(38, -90 - wingWave, 48, -60 - wingWave);
        ctx.quadraticCurveTo(30, -40, 0, -48);
        ctx.fill();
        ctx.stroke();

        // Gleaming Forehead Pearl Star Radiance
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 0, -88 + bob, 7);
        break;
      }

      case 'bismuth': {
        // 5. Bismuth: Incandescent Molten Lava Blacksmith / Forgemaster State!
        const heatPulse = Math.sin(time / 60) * 5;

        // Molten Magma Heat Shield / Volcanic Halo
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.ellipse(0, -36, 32 + heatPulse, 44 + heatPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, -36, 28 + heatPulse, 40 + heatPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Rising Forge Embers & Volcanic Sparks
        for (let e = 0; e < 7; e++) {
          const ex = -24 + (e * 8);
          const ey = -5 - ((time / 8 + e * 18) % 75);
          ctx.fillStyle = (e % 2 === 0) ? '#f97316' : '#fde047';
          ctx.beginPath();
          ctx.arc(ex + Math.sin(time / 100 + e) * 5, ey, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glowing Anvil Ground Stamp
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-28, -6, 56, 10);
        break;
      }

      case 'peridot': {
        // 6. Peridot: Ferrokinetic Master / Homeworld Tech Overclock!
        const techPulse = Math.sin(time / 70) * 4;

        // Neon Lime Electromagnetic Field Rings
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.ellipse(0, -36, 28 + techPulse, 44 + techPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(134, 239, 172, 0.95)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -36, 25 + techPulse, 40 + techPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting Ring of Levitating Magnetic Scrap Metal (5 pieces)
        for (let m = 0; m < 5; m++) {
          const angle = (time / 160) + (m * Math.PI * 2 / 5);
          const mx = Math.cos(angle) * (34 + techPulse);
          const my = -42 + Math.sin(angle) * (20 + techPulse * 0.5);

          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (m % 2 === 0) {
            ctx.arc(mx, my, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillRect(mx - 4, my - 3, 8, 6);
            ctx.strokeRect(mx - 4, my - 3, 8, 6);
          }
        }

        // Holographic Visor Targeting Reticle
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -82 + bob);
        ctx.lineTo(14, -72 + bob);
        ctx.lineTo(0, -62 + bob);
        ctx.lineTo(-14, -72 + bob);
        ctx.closePath();
        ctx.stroke();
        break;
      }

      case 'lapis': {
        // 7. Lapis Lazuli: Massive Translucent Ocean Wings, Whirlpool Vortex at feet!
        const hydroPulse = Math.sin(time / 80) * 5;

        // Giant Majestic Translucent Water Wings (Overdrive scale)
        const wingFlap = Math.sin(time / 100) * 14;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.82)';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.5;

        // Grand Left Wing
        ctx.beginPath();
        ctx.moveTo(-6, -56 + bob);
        ctx.bezierCurveTo(-45, -115 + wingFlap, -75, -85 + wingFlap, -65, -50 + wingFlap);
        ctx.bezierCurveTo(-50, -30, -25, -45, -6, -50 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Grand Right Wing
        ctx.beginPath();
        ctx.moveTo(6, -56 + bob);
        ctx.bezierCurveTo(45, -115 - wingFlap, 75, -85 - wingFlap, 65, -50 - wingFlap);
        ctx.bezierCurveTo(50, -30, 25, -45, 6, -50 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Water droplets spray
        for (let w = 0; w < 5; w++) {
          const wx = -30 + w * 15 + Math.sin(time / 100 + w) * 8;
          const wy = -30 - ((time / 10 + w * 18) % 65);
          ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
          ctx.beginPath();
          ctx.arc(wx, wy, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swirling Water Whirlpool at feet
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 36 + hydroPulse, 10 + hydroPulse * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 'rose': {
        // 8. Rose Quartz: Rotating 8-Petaled Sacred Rose Mandala, Floating Rose Petals!
        const pulse = Math.sin(time / 90) * 4;

        // Celestial Rose-Gold Warm Halo
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, -42, 34 + pulse, 48 + pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating 8-Petaled Sacred Rose Mandala behind Rose's back
        ctx.save();
        ctx.translate(0, -44 + bob);
        ctx.rotate(time / 600);
        for (let p = 0; p < 8; p++) {
          const angle = (Math.PI / 4) * p;
          ctx.save();
          ctx.rotate(angle);
          ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
          ctx.strokeStyle = 'rgba(255, 228, 230, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-10, -20, -14, -36, 0, -44);
          ctx.bezierCurveTo(14, -36, 10, -20, 0, 0);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // Orbiting Floating Rose Petals
        for (let rp = 0; rp < 6; rp++) {
          const pAngle = (time / 250) + (rp * Math.PI / 3);
          const px = Math.cos(pAngle) * (42 + pulse);
          const py = -42 + Math.sin(pAngle) * (26 + pulse * 0.5);

          ctx.fillStyle = '#ff6097';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(px, py, 5, 3, pAngle, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Glowing Rose Navel Star Beacon
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 0, -28 + bob, 6);
        break;
      }

      case 'connie': {
        // Connie: Knight's Stevonnie Radiant Pink Blade State!
        const pulse = Math.sin(time / 70) * 5;
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 36 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f472b6';
        this.drawMiniStar(ctx, 0, 0, 10 + pulse * 0.4);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, -50 + bob);
        ctx.lineTo(55, -80 + bob);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < 4; i++) {
          const a = (time / 100) + (i * Math.PI / 2);
          ctx.beginPath();
          ctx.arc(Math.cos(a) * 28, -40 + bob + Math.sin(a) * 22, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'jasper': {
        // Jasper: Supreme Beta Quartz Juggernaut Overdrive!
        const pulse = Math.sin(time / 60) * 6;

        ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
        ctx.beginPath();
        ctx.arc(0, -42 + bob, 45 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 38 + pulse * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ea580c';
        for (let s = 0; s < 5; s++) {
          const sa = (time / 140) + (s * Math.PI * 2 / 5);
          const sx = Math.cos(sa) * (36 + pulse);
          const sy = -35 + bob + Math.sin(sa) * (32 + pulse);
          this.drawMiniStar(ctx, sx, sy, 7);
        }
        break;
      }
    }

    ctx.restore();
  }

  // --- FLUID COMBAT ANIMATION CURVES, HAIR PHYSICS & SMEAR HELPERS ---
  getStrikeCurve(animP) {
    if (animP <= 0 || animP >= 1) return 0;
    if (animP < 0.16) {
      // Quick anticipation coil backward (-0.28)
      return -0.28 * Math.sin((animP / 0.16) * (Math.PI / 2));
    }
    if (animP < 0.42) {
      // Explosive whip-fast strike extension (-0.28 -> +1.0)
      return -0.28 + 1.28 * Math.sin(((animP - 0.16) / 0.26) * (Math.PI / 2));
    }
    if (animP < 0.68) {
      // Impact power hold (1.0 -> 0.86)
      return 1.0 - 0.14 * ((animP - 0.42) / 0.26);
    }
    // Smooth follow-through recovery (0.86 -> 0)
    return 0.86 * Math.cos(((animP - 0.68) / 0.32) * (Math.PI / 2));
  }

  /**
   * Show-accurate continuous motion state for all 10 heroes & 9 fusions.
   * Ensures expressive idle weight-shifts, breathing, hover, sprint lean,
   * and continuous arm/head secondary motion even when standing still.
   */
  getCharacterMotionState() {
    const t = this.animTime || 0;
    const id = (this.activeFusion && !this.activeFusion.ended) ? this.activeFusion.id : (this.activeChar || 'steven');
    const isMoving = Math.abs(this.vx) > 22;
    const grounded = this.isGrounded !== false;
    const runSpeed = Math.min(1.4, Math.abs(this.vx) / 280);

    // Character-specific cadence & personality
    let breathFreq = 3.2;
    let breathAmp = 0.018;
    let hoverAmp = 0;
    let idleArmAmp = 0.14;
    let idleSwayAmp = 0.028;
    let sprintLean = 0.085;

    if (id === 'steven' || id === 'rainbow2') {
      breathFreq = 4.1; breathAmp = 0.022; idleArmAmp = 0.22; idleSwayAmp = 0.042; sprintLean = 0.095;
    } else if (id === 'amethyst' || id === 'smoky' || id === 'sugilite') {
      breathFreq = 4.4; breathAmp = 0.025; idleArmAmp = 0.24; idleSwayAmp = 0.048; sprintLean = 0.125;
    } else if (id === 'garnet' || id === 'sunstone' || id === 'bismuth' || id === 'jasper') {
      breathFreq = 2.6; breathAmp = 0.026; idleArmAmp = 0.16; idleSwayAmp = 0.024; sprintLean = 0.075;
    } else if (id === 'pearl' || id === 'connie' || id === 'stevonnie' || id === 'sardonyx') {
      breathFreq = 3.0; breathAmp = 0.015; idleArmAmp = 0.14; idleSwayAmp = 0.022; sprintLean = 0.075;
    } else if (id === 'peridot') {
      breathFreq = 5.4; breathAmp = 0.020; idleArmAmp = 0.28; idleSwayAmp = 0.055; sprintLean = 0.11;
    } else if (id === 'lapis' || id === 'rose' || id === 'opal' || id === 'rainbowClassic') {
      breathFreq = 2.5; breathAmp = 0.016; hoverAmp = (id === 'lapis' || id === 'rose') ? 4.2 : 2.6;
      idleArmAmp = 0.18; idleSwayAmp = 0.032; sprintLean = 0.065;
    } else if (id === 'malachite') {
      breathFreq = 3.4; breathAmp = 0.028; idleArmAmp = 0.26; idleSwayAmp = 0.05; sprintLean = 0.115;
    }

    const bSin = Math.sin(t * breathFreq);
    const bCos = Math.cos(t * breathFreq * 0.5);
    const isSprinting = !!this.isSprinting && isMoving;
    const walkWave = Math.sin(this.walkAnim || 0);
    const walkDouble = Math.abs(Math.sin(this.walkAnim || 0));
    const idleBob = grounded ? bSin * 2.1 : Math.sin(t * 4.5) * 1.6;
    const runBob = grounded
      ? (-walkDouble * (isSprinting ? 6.2 : 4.2) + Math.sin((this.walkAnim || 0) * 2) * (isSprinting ? 2.0 : 1.4))
      : Math.max(-5, Math.min(5, this.vy * 0.01));
    const bob = isMoving ? runBob : idleBob;
    const hoverY = hoverAmp ? (Math.sin(t * 2.4) * hoverAmp - (isMoving ? hoverAmp * 0.45 : hoverAmp * 0.6)) : 0;

    // Forward sprint torso lean (deep aerodynamic speed-run lean when double-tap sprinting!) + idle rhythmic stance shift
    const torsoTilt = isMoving
      ? (grounded
        ? (isSprinting ? (sprintLean + 0.165) : sprintLean * (0.65 + 0.35 * runSpeed)) + walkWave * (isSprinting ? 0.042 : 0.025)
        : Math.max(-0.14, Math.min(0.24, this.vy * 0.00035 + (isSprinting ? 0.10 : 0))))
      : bCos * idleSwayAmp;

    const breathScaleX = 1 + (isSprinting ? 0.032 : (isMoving ? -0.012 : -bSin * breathAmp * 0.65));
    const breathScaleY = 1 + (isSprinting ? -0.032 : (isMoving ? 0.014 : bSin * breathAmp));

    // Continuous dual-phase arm oscillation (vigorous athletic pumping when sprinting!)
    const armAmp = isSprinting ? 0.88 : 0.58;
    const armSwingF = isMoving ? (Math.sin(this.walkAnim || 0) * armAmp) : (Math.sin(t * breathFreq * 0.85) * idleArmAmp);
    const armSwingB = isMoving ? (-Math.sin(this.walkAnim || 0) * (armAmp * 0.94)) : (-Math.sin(t * breathFreq * 0.85 + 0.9) * idleArmAmp * 0.85);
    const headBob = isMoving ? (Math.cos((this.walkAnim || 0) * 2) * (isSprinting ? 1.8 : 1.2)) : (bSin * 1.1);
    const headTilt = isMoving ? (walkWave * (isSprinting ? 0.055 : 0.035) + (isSprinting ? 0.06 : 0)) : (Math.sin(t * breathFreq * 0.5) * 0.035);

    return {
      id,
      t,
      isMoving,
      isSprinting,
      grounded,
      bob,
      hoverY,
      torsoTilt,
      breathScaleX,
      breathScaleY,
      armSwingF,
      armSwingB,
      headBob,
      headTilt
    };
  }

  getHairSway(animP = 0, actionType = '') {
    const t = this.animTime || (Date.now() / 1000);
    const isMoving = Math.abs(this.vx) > 12;
    const isSprinting = !!this.isSprinting && isMoving;
    const strike = actionType ? this.getStrikeCurve(animP) : 0;
    // Trailing backward (-X) when running/sprinting forward or lunging into a strike
    const runTrail = isMoving
      ? ((isSprinting ? -13.5 : -6.5) + Math.sin(this.walkAnim * (isSprinting ? 2.2 : 1.6)) * (isSprinting ? 3.8 : 2.8))
      : (Math.sin(t * 3.1) * 2.1);
    const strikeTrail = -strike * 7.2;
    const airLift = !this.isGrounded ? Math.max(-8, Math.min(8, this.vy * 0.014)) : (isSprinting ? -1.8 : 0);
    const walkBounce = isMoving ? Math.cos(this.walkAnim * 2) * (isSprinting ? 3.2 : 2.2) : Math.cos(t * 2.7) * 1.2;
    return {
      swayX: runTrail + strikeTrail,
      swayY: airLift + walkBounce
    };
  }

  getLegKinematics(animP = 0, actionType = '') {
    const t = this.animTime || 0;
    const isMoving = Math.abs(this.vx) > 12;
    const isSprinting = !!this.isSprinting && isMoving;
    const walkS = isMoving ? Math.sin(this.walkAnim) : 0;
    const walkC = isMoving ? Math.cos(this.walkAnim) : 0;
    const liftMult = isSprinting ? 9.0 : 5.2;
    const walkLiftB = isMoving ? Math.max(0, -walkS) * liftMult : 0;
    const walkLiftF = isMoving ? Math.max(0, walkS) * liftMult : 0;

    if (!this.isGrounded && !actionType) {
      const airT = Math.sin(t * 8) * 1.4;
      return { backX: -4.5, backY: -3 + airT * 0.4, backRot: 0.25, frontX: 5, frontY: -6 - airT * 0.4, frontRot: -0.22 };
    }
    if (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') {
      const s = Math.max(0, this.getStrikeCurve(animP));
      const coil = Math.min(0, this.getStrikeCurve(animP));
      return {
        backX: -5 * s + 2 * coil,
        backY: 0,
        backRot: 0.22 * s - 0.1 * coil,
        frontX: 7 * s + 2 * coil,
        frontY: -2 * s,
        frontRot: -0.18 * s + 0.08 * coil
      };
    }
    if (actionType === 'shield') {
      return { backX: -4, backY: 0, backRot: 0.16, frontX: 5, frontY: 0, frontRot: -0.14 };
    }
    if (!isMoving) {
      // Subtle athletic weight shift even at rest
      const shift = Math.sin(t * 2.3);
      return {
        backX: -1.6 + shift * 1.1,
        backY: Math.max(0, shift) * 0.8,
        backRot: 0.04 + shift * 0.045,
        frontX: 1.6 - shift * 1.1,
        frontY: Math.max(0, -shift) * 0.8,
        frontRot: -0.04 - shift * 0.045
      };
    }
    const strideX = isSprinting ? 11.8 : 7.8;
    const strideRot = isSprinting ? 0.44 : 0.28;
    return {
      backX: -walkS * strideX + walkC * (isSprinting ? 2.2 : 1.4),
      backY: -walkLiftB,
      backRot: walkS * strideRot,
      frontX: walkS * strideX - walkC * (isSprinting ? 2.2 : 1.4),
      frontY: -walkLiftF,
      frontRot: -walkS * strideRot
    };
  }

  drawArticulatedArm(ctx, sx, sy, ex, ey, hx, hy, upperColor, lowerColor, upperW = 8, lowerW = 7, handColor = null, handR = 0) {
    // Tapered cel-shaded upper arm (shoulder -> elbow)
    this.drawCelTaperedLimb(ctx, sx, sy, ex, ey, upperW * 0.56, Math.max(upperW * 0.44, lowerW * 0.48), upperColor, 'rgba(0, 0, 0, 0.14)', 1);
    // Tapered cel-shaded forearm (elbow -> wrist/hand)
    this.drawCelTaperedLimb(ctx, ex, ey, hx, hy, Math.max(lowerW * 0.52, 2.2), lowerW * 0.40, lowerColor, 'rgba(0, 0, 0, 0.12)', 1);

    // Expressive comic mitten/fist hand (Character style.mp4 lineless vector style)
    if (handColor && handR > 0) {
      this.drawCelHandMitten(ctx, hx, hy, handR, handColor, Math.atan2(hy - ey, hx - ex));
    }
  }

  // Unleash the Light rhythmic squash-and-stretch factor (volume-preserving)
  getUnleashIdleSquash() {
    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const isMoving = Math.abs(this.vx || 0) > 25;
    if (!this.isGrounded) {
      const airS = this.vy < 0 ? 1.045 : 0.965;
      return { sx: 1 / Math.sqrt(airS), sy: airS };
    }
    const freq = isMoving ? 14.0 : 4.6;
    const amp = isMoving ? 0.035 : 0.032;
    const phase = (this.activeChar ? this.activeChar.charCodeAt(0) : 0) * 0.35;
    const sy = 1 + Math.sin(t * freq + phase) * amp;
    return { sx: 1 / Math.sqrt(sy), sy };
  }

  // Crisp lineless 4- or 5-point Starburst Flare (Character style.mp4 / Unleash the Light VFX)
  drawCelStarBurst(ctx, cx, cy, outerR, primaryCol = '#ffffff', accentCol = '#fde047', points = 4, rot = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const drawStarPoly = (rOut, rIn, fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      const total = points * 2;
      for (let i = 0; i < total; i++) {
        const a = (i * Math.PI) / points - Math.PI / 2;
        const r = (i % 2 === 0) ? rOut : rIn;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    };
    drawStarPoly(outerR * 1.25, outerR * 0.30, accentCol);
    drawStarPoly(outerR * 0.85, outerR * 0.22, primaryCol);
    ctx.restore();
  }

  // Clean geometric cloud-puff ring for impacts & landings (Character style.mp4)
  drawCelImpactPuff(ctx, cx, cy, radius, col = '#ffffff') {
    ctx.save();
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.72;
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * radius * 0.45, cy + Math.sin(a) * radius * 0.35, radius * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawCrescentSlash(ctx, cx, cy, radius, startA, endA, outerGlow, bladeColor, edgeColor = '#ffffff', thickness = 14) {
    ctx.save();
    const midA = (startA + endA) * 0.5;
    const innerShiftX = -Math.cos(midA) * (thickness * 0.55);
    const innerShiftY = -Math.sin(midA) * (thickness * 0.55);
    const innerR = Math.max(6, radius - thickness * 0.45);

    // 1. Soft Outer Elemental Smear Ribbon
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + thickness * 0.32, startA, endA, false);
    ctx.arc(cx + innerShiftX * 1.15, cy + innerShiftY * 1.15, Math.max(4, innerR - 3), endA, startA, true);
    ctx.closePath();
    ctx.fill();

    // 2. Vibrant Saturated Core Crescent
    ctx.fillStyle = bladeColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startA, endA, false);
    ctx.arc(cx + innerShiftX, cy + innerShiftY, innerR, endA, startA, true);
    ctx.closePath();
    ctx.fill();

    // 3. Razor-Sharp Specular Leading Edge
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 0.5, startA + (endA - startA) * 0.08, endA - (endA - startA) * 0.05, false);
    ctx.stroke();
    ctx.restore();
  }

  drawSpeedLines(ctx, xStart, yCenter, length, spreadY, count, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const frac = count > 1 ? (i / (count - 1)) - 0.5 : 0;
      const ly = yCenter + frac * spreadY;
      const offset = (i % 2 === 0) ? 0 : 8;
      ctx.moveTo(xStart + offset, ly);
      ctx.lineTo(xStart + length + offset * 0.5, ly);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Organic tapered cel-shaded cartoon limb (smooth outward rounded caps, zero bow-tie joint glitches!)
  drawCelTaperedLimb(ctx, x1, y1, x2, y2, r1, r2, fillCol, shadowCol = null, shadowSide = 1) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 0.01) return;
    const nx = -dy / len;
    const ny = dx / len;
    const aPlus = Math.atan2(ny, nx);
    const aMinus = Math.atan2(-ny, -nx);

    ctx.save();
    const traceLimb = () => {
      ctx.beginPath();
      ctx.moveTo(x1 + nx * r1, y1 + ny * r1);
      ctx.quadraticCurveTo((x1 + x2) * 0.5 + nx * (r1 + r2) * 0.52, (y1 + y2) * 0.5 + ny * (r1 + r2) * 0.52, x2 + nx * r2, y2 + ny * r2);
      ctx.arc(x2, y2, r2, aPlus, aMinus, true);
      ctx.quadraticCurveTo((x1 + x2) * 0.5 - nx * (r1 + r2) * 0.52, (y1 + y2) * 0.5 - ny * (r1 + r2) * 0.52, x1 - nx * r1, y1 - ny * r1);
      ctx.arc(x1, y1, r1, aMinus, aPlus, true);
      ctx.closePath();
    };

    traceLimb();
    ctx.fillStyle = fillCol;
    ctx.fill();

    // Crisp cel-shaded shadow band clipped cleanly inside the limb
    if (shadowCol) {
      ctx.save();
      traceLimb();
      ctx.clip();
      const s = shadowSide >= 0 ? -1 : 1;
      ctx.fillStyle = shadowCol;
      ctx.beginPath();
      ctx.moveTo(x1 + nx * s * r1 * 0.2, y1 + ny * s * r1 * 0.2);
      ctx.lineTo(x2 + nx * s * r2 * 0.2, y2 + ny * s * r2 * 0.2);
      ctx.lineTo(x2 + nx * s * (r2 + 4), y2 + ny * s * (r2 + 4));
      ctx.lineTo(x1 + nx * s * (r1 + 4), y1 + ny * s * (r1 + 4));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Lit specular highlight sliver + clean warm cartoon ink outline
    const lit = shadowSide >= 0 ? 1 : -1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.lineWidth = 1.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1 + nx * lit * r1 * 0.58, y1 + ny * lit * r1 * 0.58);
    ctx.lineTo(x2 + nx * lit * r2 * 0.58, y2 + ny * lit * r2 * 0.58);
    ctx.stroke();

    traceLimb();
    ctx.strokeStyle = 'rgba(26, 14, 44, 0.72)';
    ctx.lineWidth = 1.35;
    ctx.stroke();
    ctx.restore();
  }

  // Stylized cel-inked comic mitten/fist hand
  drawCelHandMitten(ctx, x, y, r, fillCol, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = fillCol;
    ctx.strokeStyle = 'rgba(22, 12, 40, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(r * 0.12, 0, r * 1.15, r * 0.92, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Stylized tucked thumb silhouette
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, -r * 0.65, r * 0.58, r * 0.42, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.beginPath();
    ctx.ellipse(r * 0.25, -r * 0.35, r * 0.45, r * 0.25, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Stylish cel-inked vector boot / sneaker / flat with arched toe, cuff & specular gleam
  drawCelBoot(ctx, footX, footY, toeLen = 11, ankleH = 9, bootCol = '#27272a', soleCol = '#f8fafc', cuffCol = null) {
    ctx.save();
    ctx.translate(footX, footY);
    // Optional upper cuff band
    if (cuffCol) {
      ctx.fillStyle = cuffCol;
      ctx.beginPath();
      ctx.roundRect(-toeLen * 0.46, -ankleH - 3.5, toeLen * 0.86, 5.2, 2.6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(22, 12, 40, 0.72)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
    // Arched upper boot silhouette
    ctx.fillStyle = bootCol;
    ctx.beginPath();
    ctx.moveTo(-toeLen * 0.42, -ankleH);
    ctx.lineTo(toeLen * 0.32, -ankleH * 0.92);
    ctx.quadraticCurveTo(toeLen * 0.65, -ankleH * 0.45, toeLen * 0.98, -2.5);
    ctx.quadraticCurveTo(toeLen * 1.04, 1.5, toeLen * 0.72, 2.2);
    ctx.lineTo(-toeLen * 0.46, 2.2);
    ctx.quadraticCurveTo(-toeLen * 0.55, -ankleH * 0.4, -toeLen * 0.42, -ankleH);
    ctx.closePath();
    ctx.fill();

    // Hard-edged heel shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.moveTo(-toeLen * 0.42, -ankleH);
    ctx.lineTo(-toeLen * 0.08, -ankleH * 0.85);
    ctx.lineTo(-toeLen * 0.12, 2.2);
    ctx.lineTo(-toeLen * 0.46, 2.2);
    ctx.closePath();
    ctx.fill();

    // Toe specular highlight + crisp ink outline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.beginPath();
    ctx.ellipse(toeLen * 0.42, -ankleH * 0.32, toeLen * 0.26, 1.6, 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(22, 12, 40, 0.78)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-toeLen * 0.42, -ankleH);
    ctx.lineTo(toeLen * 0.32, -ankleH * 0.92);
    ctx.quadraticCurveTo(toeLen * 0.65, -ankleH * 0.45, toeLen * 0.98, -2.5);
    ctx.quadraticCurveTo(toeLen * 1.04, 1.5, toeLen * 0.72, 2.2);
    ctx.lineTo(-toeLen * 0.46, 2.2);
    ctx.quadraticCurveTo(-toeLen * 0.55, -ankleH * 0.4, -toeLen * 0.42, -ankleH);
    ctx.closePath();
    ctx.stroke();

    // Sole / toe rubber wedge
    if (soleCol) {
      ctx.fillStyle = soleCol;
      ctx.beginPath();
      ctx.moveTo(-toeLen * 0.46, 0.2);
      ctx.lineTo(toeLen * 0.92, 0.0);
      ctx.quadraticCurveTo(toeLen * 0.98, 2.4, toeLen * 0.70, 2.6);
      ctx.lineTo(-toeLen * 0.44, 2.6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // Sculpted lineless cel-shaded face with chin shadow, geometric nose, expressive sclera+iris+catchlight eyes, and dynamic mouth
  drawCelFace(ctx, cfg) {
    const {
      cx = 0, cy = -58, rx = 12, ry = 13,
      skin = '#f5cbb7', shadow = '#dfb099',
      eyeY = -59, eyeXBack = -1.5, eyeXFront = 6.2, eyeW = 2.6, eyeH = 3.2,
      irisCol = '#18181b', scleraCol = '#ffffff', browCol = '#18181b',
      noseStyle = 'button', noseX = 3.8, noseY = -56,
      mouthY = -51.5, mouthStyle = 'auto',
      extraEyes = null, hideDefaultEyes = false,
      gemForehead = null
    } = cfg;

    const nowT = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const isBlinking = Math.sin(nowT * 2.3 + rx * 1.7) > 0.97;
    const combatExpr = !!(this.isAttacking || this.isPinkOverdrive || this.actionType === 'skill');

    ctx.save();
    // 1. Sculpted head silhouette (rounded cranium + tapered jaw/chin toward facing)
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.moveTo(-rx * 0.88, cy - ry * 0.35);
    ctx.bezierCurveTo(-rx * 1.02, cy - ry * 1.15, rx * 0.95, cy - ry * 1.15, rx * 0.96, cy - ry * 0.25);
    ctx.bezierCurveTo(rx * 1.05, cy + ry * 0.48, rx * 0.62, cy + ry * 0.98, rx * 0.14, cy + ry);
    ctx.bezierCurveTo(-rx * 0.48, cy + ry * 0.98, -rx * 0.96, cy + ry * 0.48, -rx * 0.88, cy - ry * 0.35);
    ctx.closePath();
    ctx.fill();

    // 2. Hard-edged cel shadow along back cheek & under jaw
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.moveTo(-rx * 0.84, cy - ry * 0.15);
    ctx.quadraticCurveTo(-rx * 0.46, cy + ry * 0.68, rx * 0.34, cy + ry * 0.92);
    ctx.quadraticCurveTo(-rx * 0.48, cy + ry * 1.04, -rx * 0.90, cy + ry * 0.38);
    ctx.closePath();
    ctx.fill();

    // 2b. Crisp cel-shaded specular rim highlight along front temple/cheek + soft anime blush + ink outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rx * 0.58, cy - ry * 0.72);
    ctx.quadraticCurveTo(rx * 0.94, cy - ry * 0.18, rx * 0.76, cy + ry * 0.42);
    ctx.stroke();

    ctx.fillStyle = 'rgba(244, 114, 182, 0.20)';
    ctx.beginPath();
    ctx.ellipse(eyeXFront + 0.6, eyeY + eyeH * 1.45, Math.max(1.8, eyeW * 0.9), Math.max(1.1, eyeH * 0.42), 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(24, 14, 42, 0.78)';
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(-rx * 0.88, cy - ry * 0.35);
    ctx.bezierCurveTo(-rx * 1.02, cy - ry * 1.15, rx * 0.95, cy - ry * 1.15, rx * 0.96, cy - ry * 0.25);
    ctx.bezierCurveTo(rx * 1.05, cy + ry * 0.48, rx * 0.62, cy + ry * 0.98, rx * 0.14, cy + ry);
    ctx.bezierCurveTo(-rx * 0.48, cy + ry * 0.98, -rx * 0.96, cy + ry * 0.48, -rx * 0.88, cy - ry * 0.35);
    ctx.closePath();
    ctx.stroke();

    // 3. Forehead Gem if any (Pearl / Peridot / Opal / Rainbow 2.0 / Sardonyx / White)
    if (gemForehead) {
      ctx.fillStyle = gemForehead.col || '#f8fafc';
      ctx.beginPath();
      if (gemForehead.shape === 'oval') {
        ctx.ellipse(gemForehead.x || 1.5, gemForehead.y || (cy - ry * 0.62), gemForehead.w || 3.4, gemForehead.h || 4.2, 0.08, 0, Math.PI * 2);
      } else {
        const gx = gemForehead.x || 1.5;
        const gy = gemForehead.y || (cy - ry * 0.6);
        const r = gemForehead.r || 4.2;
        ctx.moveTo(gx, gy - r * 1.1);
        ctx.lineTo(gx + r * 0.95, gy + r * 0.65);
        ctx.lineTo(gx - r * 0.95, gy + r * 0.65);
        ctx.closePath();
      }
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.beginPath();
      ctx.arc((gemForehead.x || 1.5) - 0.8, (gemForehead.y || (cy - ry * 0.6)) - 1.2, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Helper for drawing a single expressive cel eye
    const drawSingleEye = (ex, ey, ew, eh, iris, browTilt = 0) => {
      if (isBlinking && !combatExpr) {
        ctx.strokeStyle = browCol;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ex - ew * 0.85, ey);
        ctx.quadraticCurveTo(ex, ey + 1.4, ex + ew * 0.85, ey);
        ctx.stroke();
        return;
      }
      // White sclera + crisp upper lash line
      ctx.fillStyle = scleraCol;
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew * 1.20, eh * 1.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(24, 14, 42, 0.72)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(ex, ey, ew * 1.12, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();

      // Expressive iris/pupil shifted slightly toward facing (+x)
      const isStarPupil = !!(this.isPinkOverdrive || this.isFusion);
      ctx.fillStyle = isStarPupil ? '#f472b6' : iris;
      ctx.beginPath();
      ctx.ellipse(ex + ew * 0.24, ey + 0.1, ew * 0.68, eh * 0.76, 0, 0, Math.PI * 2);
      ctx.fill();
      // Deep inner pupil core
      ctx.fillStyle = '#0f071c';
      ctx.beginPath();
      ctx.ellipse(ex + ew * 0.28, ey + 0.15, ew * 0.36, eh * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      // Dual specular catchlights (separate paths — zero white connector line!)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex + ew * 0.44, ey - eh * 0.32, Math.max(0.9, ew * 0.34), 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex - ew * 0.05, ey + eh * 0.28, Math.max(0.45, ew * 0.16), 0, Math.PI * 2);
      ctx.fill();
      // Expressive cel eyebrow
      ctx.strokeStyle = browCol;
      ctx.lineWidth = 1.55;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const ang = combatExpr ? 0.26 + browTilt : -0.10 + browTilt;
      ctx.moveTo(ex - ew * 0.95, ey - eh * 1.25 - Math.sin(ang) * 1.6);
      ctx.lineTo(ex + ew * 0.95, ey - eh * 1.25 + Math.sin(ang) * 1.6);
      ctx.stroke();
    };

    if (!hideDefaultEyes) {
      drawSingleEye(eyeXBack, eyeY, eyeW * 0.92, eyeH, irisCol, -0.05);
      drawSingleEye(eyeXFront, eyeY, eyeW, eyeH, irisCol, 0.05);
    }
    if (extraEyes && Array.isArray(extraEyes)) {
      for (const ee of extraEyes) {
        drawSingleEye(ee.x, ee.y, ee.w || eyeW * 0.85, ee.h || eyeH * 0.85, ee.iris || irisCol, ee.browTilt || 0);
      }
    }

    // 5. Stylized Geometric Nose
    if (noseStyle === 'pointed') {
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.moveTo(rx * 0.72, noseY - 2.6);
      ctx.lineTo(rx * 1.38, noseY + 0.2);
      ctx.lineTo(rx * 0.76, noseY + 2.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.moveTo(rx * 0.76, noseY + 0.2);
      ctx.lineTo(rx * 1.34, noseY + 0.2);
      ctx.lineTo(rx * 0.76, noseY + 2.2);
      ctx.closePath();
      ctx.fill();
    } else if (noseStyle === 'bridge') {
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.moveTo(noseX - 0.5, noseY - 2.4);
      ctx.lineTo(noseX + 2.6, noseY + 0.8);
      ctx.lineTo(noseX - 0.4, noseY + 2.0);
      ctx.closePath();
      ctx.fill();
    } else if (noseStyle === 'broad') {
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(noseX + 0.4, noseY + 0.4, 2.5, 1.8, 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else if (noseStyle !== 'none') {
      // Classic SU rounded button nose
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(noseX, noseY + 0.5, 1.85, 1.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(noseX - 0.3, noseY, 1.5, 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Expressive Mouth (wide cel teeth D-grin, smirk, or battle grit)
    const mMode = mouthStyle === 'auto' ? (combatExpr ? 'battle' : 'grin') : mouthStyle;
    const mx = Math.max(0.5, noseX - 0.8);
    if (mMode === 'battle') {
      // Wide determined shout/grin showing teeth
      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.roundRect(mx - 3.6, mouthY - 1.4, 7.2, 4.0, 1.8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(mx - 3.0, mouthY - 1.1, 6.0, 1.4, 0.6);
      ctx.fill();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.ellipse(mx + 0.4, mouthY + 1.5, 2.0, 1.0, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (mMode === 'grin') {
      // Happy SU open D-grin with tongue
      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.arc(mx, mouthY - 0.6, 3.8, 0, Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(mx - 3.1, mouthY - 0.6, 6.2, 1.1);
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.ellipse(mx, mouthY + 1.8, 2.0, 1.0, 0, 0, Math.PI);
      ctx.fill();
    } else {
      // Confident curved smirk
      ctx.strokeStyle = '#6b2737';
      ctx.lineWidth = 1.55;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(mx, mouthY - 0.8, 3.3, 0.15, Math.PI * 0.72);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- SHOW-ACCURATE STEVEN UNIVERSE ---
  drawHeroSilhouette(ctx, charId, fill, stroke) {
    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.6;

    if (charId === 'steven') {
      ctx.beginPath();
      ctx.ellipse(0, -32, 18, 22, 0, 0, Math.PI * 2);
      ctx.ellipse(0, -56, 14, 13, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      for (let a = 0; a < 6; a++) {
        const ang = -Math.PI * 0.9 + a * 0.36;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * 14, -58 + Math.sin(ang) * 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath(); ctx.ellipse(-14, -34, 6, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (charId === 'garnet') {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-12, -72, 24, 18, 3); else ctx.rect(-12, -72, 24, 18);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -40, 16, 26, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(12, -42, 16, 16); ctx.rect(-28, -38, 16, 16); ctx.fill(); ctx.stroke();
    } else if (charId === 'amethyst') {
      ctx.beginPath();
      ctx.ellipse(0, -32, 16, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(2, -50, 12, 12, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, -58); ctx.quadraticCurveTo(-26, -42, -22, -18); ctx.lineTo(-12, -24);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (charId === 'pearl') {
      ctx.beginPath();
      ctx.ellipse(0, -36, 11, 24, 0, 0, Math.PI * 2);
      ctx.ellipse(2, -62, 9, 10, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, -68); ctx.lineTo(-20, -62); ctx.lineTo(-4, -54); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, -30); ctx.lineTo(44, -30); ctx.stroke();
    } else if (charId === 'connie') {
      ctx.beginPath();
      ctx.ellipse(0, -32, 13, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(2, -52, 10, 11, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -58); ctx.quadraticCurveTo(-22, -45, -18, -25); ctx.lineTo(-8, -32);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, -28); ctx.lineTo(42, -28); ctx.stroke();
    } else if (charId === 'jasper') {
      ctx.beginPath();
      ctx.ellipse(0, -42, 22, 30, 0, 0, Math.PI * 2);
      ctx.ellipse(2, -72, 14, 15, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, -84); ctx.quadraticCurveTo(-34, -60, -28, -22); ctx.lineTo(-14, -36);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, -34, 15, 24, 0, 0, Math.PI * 2);
      ctx.ellipse(0, -56, 12, 12, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }


  drawSteven(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const isPink = this.isPinkOverdrive;
    const skinColor = isPink ? '#ff6097' : '#fde0d7';
    const jacketColor = isPink ? '#ff1493' : '#f472b6';
    const shirtColor = isPink ? '#be185d' : '#18181b';
    const pantsColor = isPink ? '#be185d' : '#2563eb';
    const cuffColor = isPink ? '#f43f5e' : '#93c5fd';
    const hairColor = isPink ? '#be123c' : '#26151c';
    const hairSheen = isPink ? '#fb7185' : '#462633';
    const eyeColor = isPink ? '#ffffff' : '#1e1233';

    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isShieldThrown = (actionType === 'throw' && animP > 0.25);
    const isShieldWindup = (actionType === 'throw' && animP <= 0.25);
    const isShieldStance = (actionType === 'shield');

    // Helper to draw one tapered lineless cel jean leg + cuffed hem + curved flip-flop
    const drawStevenLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -22 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 12.5, 5.6, 4.8, darken ? (isPink ? '#9d174d' : '#1d4ed8') : pantsColor, isPink ? '#831843' : '#1e3a8a', 1);
      ctx.fillStyle = cuffColor;
      ctx.beginPath(); ctx.ellipse(0, 13, 5.4, 2.3, 0, 0, Math.PI * 2); ctx.fill();
      this.drawCelTaperedLimb(ctx, 0, 14, 0, 19.5, 4.0, 3.3, skinColor, '#dba895', 1);
      this.drawCelBoot(ctx, 0.5, 22, 8.8, 3.2, '#ef4444', '#fca5a5');
      ctx.restore();
    };

    // 1. Articulated Jeans & Flip-Flops (Back leg then Front leg)
    drawStevenLeg(-8 + legs.backX, legs.backY, legs.backRot, true);
    drawStevenLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear / Left Counter-Balance Arm (Draws behind torso!)
    if (isPunch && combo === 0) {
      // Left arm pulls Rose's Shield back to rear hip for punch torque!
      const pullBack = Math.max(0, strike) * 8;
      this.drawArticulatedArm(ctx, -12, -45 + bob, -19 - pullBack * 0.5, -38 + bob, -16 - pullBack, -30 + bob, shirtColor, skinColor, 8.5, 7, skinColor, 4.5);
      ctx.save();
      ctx.translate(-18 - pullBack, -30 + bob);
      ctx.fillStyle = 'rgba(255, 96, 151, 0.85)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 14, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (isShieldStance && this.bubbleTimer > 0) {
      // Joyful arms-outstretched Bubble/Cookie summon pose!
      this.drawArticulatedArm(ctx, -14, -46 + bob, -23, -52 + bob, -28, -60 + bob, shirtColor, skinColor, 8.5, 7, skinColor, 5);
    } else {
      // Natural continuous swing + pink varsity jacket sleeve with curved white cuff & idle Rose-Bubble bracelet glint
      const armSwing = motion.armSwingB * 14;
      this.drawArticulatedArm(ctx, -13, -45 + bob, -17 - armSwing * 0.55, -36 + bob + Math.abs(armSwing) * 0.15, -15 - armSwing, -28 + bob, jacketColor, jacketColor, 8.5, 7, skinColor, 4.5);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-19 - armSwing, -31 + bob);
      ctx.quadraticCurveTo(-15 - armSwing, -29 + bob, -11 - armSwing, -31 + bob);
      ctx.stroke();
      // Soft luminous pink Rose-Bubble shield aura pulsing softly on Steven's guard wrist
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 96, 151, 0.72)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-15 - armSwing, -28 + bob, 6.2 + Math.sin(Date.now() / 160) * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Future Pink Varsity Jacket (Contoured Lapels + Ribbed Collar/Hem + Crisp Ink Outlines!) over Black Star Tee
    const ink = isPink ? '#831843' : '#1a1218';
    ctx.fillStyle = shirtColor;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-17, -51 + bob);
    ctx.lineTo(17, -51 + bob);
    ctx.quadraticCurveTo(19, -35 + bob, 16, -20 + bob);
    ctx.lineTo(-16, -20 + bob);
    ctx.quadraticCurveTo(-19, -35 + bob, -17, -51 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Open pink varsity jacket sculpted panels with crisp cartoon outline (Steven.png!)
    ctx.fillStyle = jacketColor;
    ctx.beginPath();
    ctx.moveTo(-19, -51 + bob);
    ctx.quadraticCurveTo(-22, -37 + bob, -18, -21 + bob);
    ctx.lineTo(-9, -21 + bob);
    ctx.quadraticCurveTo(-10, -37 + bob, -10, -53 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(19, -51 + bob);
    ctx.quadraticCurveTo(22, -37 + bob, 18, -21 + bob);
    ctx.lineTo(9, -21 + bob);
    ctx.quadraticCurveTo(10, -37 + bob, 10, -53 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Crisp white varsity collar & ribbed hem trim
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-15, -53 + bob); ctx.quadraticCurveTo(-12, -55 + bob, -9, -51 + bob);
    ctx.moveTo(15, -53 + bob); ctx.quadraticCurveTo(12, -55 + bob, 9, -51 + bob);
    ctx.moveTo(-18, -21 + bob); ctx.lineTo(-9, -21 + bob);
    ctx.moveTo(9, -21 + bob); ctx.lineTo(18, -21 + bob);
    ctx.stroke();

    // Bold 5-Pointed Gold Star on center black chest
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 1, -37 + bob, 8.8);

    // 4. Unified Sculpted 5-Lobe Cloud-Curl Silhouette with Crisp Ink Outline (Steven.png!)
    const hx = hair.swayX * 0.45;
    const hy = hair.swayY * 0.35;
    ctx.fillStyle = hairColor;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-17, -56 + bob);
    ctx.bezierCurveTo(-26 + hx, -58 + bob + hy, -27 + hx, -71 + bob + hy, -19 + hx * 0.8, -74 + bob + hy);
    ctx.bezierCurveTo(-23 + hx, -84 + bob + hy, -12 + hx * 0.6, -91 + bob + hy, -3 + hx * 0.4, -86 + bob + hy);
    ctx.bezierCurveTo(1 + hx * 0.3, -95 + bob + hy, 15 + hx * 0.3, -93 + bob + hy, 15 + hx * 0.2, -83 + bob + hy);
    ctx.bezierCurveTo(24 + hx * 0.2, -82 + bob + hy, 25, -69 + bob + hy, 18, -65 + bob);
    ctx.quadraticCurveTo(21, -59 + bob, 15, -55 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Sculpted Cel Face & Jaw with Warm Shading & Crisp Ink Outline (Show-Accurate Future Steven!)
    ctx.fillStyle = skinColor;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0.5, -61.5 + bob, 15.6, 14.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Subtle lower-left cel face shading crescent
    ctx.save();
    ctx.clip();
    ctx.fillStyle = isPink ? 'rgba(190, 24, 93, 0.28)' : 'rgba(205, 135, 110, 0.24)';
    ctx.beginPath();
    ctx.ellipse(-4, -55 + bob, 14, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Warm rosy cheek blushes
    ctx.fillStyle = isPink ? 'rgba(255, 255, 255, 0.25)' : 'rgba(244, 114, 182, 0.28)';
    ctx.beginPath(); ctx.ellipse(-7.5, -57.5 + bob, 3.3, 1.9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(9.5, -57.5 + bob, 3.0, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(0.5, -61.5 + bob, 15.6, 14.8, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Sculpted Front Hairline & Soft Top Curl Overhang + Inner Spiral Accents!
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.moveTo(-16, -64 + bob);
    ctx.quadraticCurveTo(-14, -75 + bob, -5, -73 + bob);
    ctx.quadraticCurveTo(1, -78 + bob, 7.5, -74 + bob);
    ctx.quadraticCurveTo(13.5, -76 + bob, 16, -68 + bob);
    ctx.lineTo(16, -77 + bob);
    ctx.lineTo(-17, -77 + bob);
    ctx.closePath();
    ctx.fill();

    // Warm cocoa sheen & sculpted inner C-curl swirls
    ctx.strokeStyle = hairSheen;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-8 + hx * 0.4, -80 + bob + hy, 4.5, Math.PI * 0.8, Math.PI * 2.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(5 + hx * 0.3, -83 + bob + hy, 5, Math.PI * 0.9, Math.PI * 2.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-16 + hx * 0.6, -67 + bob + hy, 4, Math.PI * 0.6, Math.PI * 1.85);
    ctx.stroke();

    // Cute rounded cartoon nose
    ctx.strokeStyle = isPink ? '#9d174d' : '#a86b58';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(2.4, -58.5 + bob, 2.0, -Math.PI * 0.4, Math.PI * 0.55);
    ctx.stroke();

    // 6. Crisp Expressive Cartoon Eyes (Separate paths — zero bridge artifact!)
    if (this.isBlinking && !isPink && !this.isAttacking) {
      ctx.strokeStyle = '#26151c';
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(-4.2, -62.5 + bob, 3.6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(6.2, -62.5 + bob, 3.6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    } else {
      for (const [ex, px] of [[-4.2, -3.5], [6.2, 6.8]]) {
        ctx.fillStyle = isPink ? '#ff1493' : '#ffffff';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.ellipse(ex, -63.5 + bob, 3.8, 4.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.ellipse(px, -63.0 + bob, 2.5, 3.6, 0, 0, Math.PI * 2);
        ctx.fill();

        if (!isPink) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(px + 0.8, -64.4 + bob, 1.35, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px - 0.9, -61.8 + bob, 0.65, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // Dynamic Eyebrows (Determined hero brow during attacks, cheerful arch on idle)
    ctx.strokeStyle = isPink ? '#ffffff' : '#26151c';
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(-8.8, -71 + bob); ctx.lineTo(-1.2, -69 + bob);
      ctx.moveTo(2.4, -69 + bob); ctx.lineTo(10.5, -71 + bob);
    } else {
      ctx.moveTo(-8.5, -70 + bob); ctx.quadraticCurveTo(-4.2, -72.8 + bob, -0.5, -70 + bob);
      ctx.moveTo(2.5, -70 + bob); ctx.quadraticCurveTo(6.5, -72.8 + bob, 10.5, -70 + bob);
    }
    ctx.stroke();

    // 7. Signature Warm Open Steven Smile
    ctx.fillStyle = isPink ? '#ffffff' : '#881337';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-5.5, -54.5 + bob);
    ctx.quadraticCurveTo(1.2, -53.2 + bob, 7.2, -54.8 + bob);
    ctx.quadraticCurveTo(1.0, -45.5 + bob, -5.5, -54.5 + bob);
    ctx.fill();
    ctx.stroke();

    if (!isPink) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-4.8, -54.2 + bob);
      ctx.lineTo(6.4, -54.5 + bob);
      ctx.quadraticCurveTo(1.0, -51.0 + bob, -4.8, -54.2 + bob);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(1.0, -48.5 + bob, 2.8, Math.PI, 0);
      ctx.fill();
    }

    // 8. Articulated Lead Arm & Rose's Shield Choreography (Distinct 4-Hit Shield-Brawler!)
    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Snappy Star-Fist Cross with Pink Quartz Knuckle Burst!
        const reach = strike * 26;
        const fistX = 20 + reach;
        const fistY = -41 + bob - Math.max(0, strike) * 2;
        this.drawArticulatedArm(ctx, 10, -44 + bob, 15 + reach * 0.45, -42 + bob, fistX, fistY, jacketColor, skinColor, 8.8, 7.2, skinColor, 6.2);
        if (strike > 0.1) {
          ctx.fillStyle = 'rgba(255, 96, 151, 0.55)';
          ctx.beginPath(); ctx.arc(fistX + 2, fistY, 9.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, fistX + 7, fistY, 6.5);
        }
      } else if (combo === 1) {
        // Hit 2: Wide Spinning Rose-Shield Backhand Slash!
        const sweep = strike * 30;
        const shX = 16 + sweep;
        const shY = -40 + bob - sweep * 0.12;
        this.drawArticulatedArm(ctx, 10, -44 + bob, 12 + sweep * 0.45, -45 + bob, shX, shY, jacketColor, skinColor, 8.8, 7.2);
        ctx.save();
        ctx.translate(shX, shY);
        ctx.rotate(animP * Math.PI * 2.5);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.92)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(0, 0, 18.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#be185d';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 9.5, 0, Math.PI * 1.5); ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, 0, 7.2);
        ctx.restore();
      } else if (combo === 2) {
        // Hit 3: Leaping Rising Star-Shield Skyward Uppercut!
        const lift = Math.max(-6, strike * 34);
        const shX = 18 + Math.max(0, strike) * 14;
        const shY = -44 + bob - lift;
        this.drawArticulatedArm(ctx, 10, -45 + bob, 15 + Math.max(0, strike) * 6, -46 + bob - lift * 0.45, shX, shY, jacketColor, skinColor, 9, 7.5);
        ctx.save();
        ctx.translate(shX, shY);
        ctx.rotate(-0.35 + animP * 1.2);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.96)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.arc(0, 0, 20.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, 0, 8.8);
        ctx.restore();
      } else {
        // Hit 4: PINK DIAMOND PULSE — Double-Hand Forward Radiant Star Thrust!
        const push = Math.max(0, strike) * 32;
        this.drawArticulatedArm(ctx, -8, -45 + bob, 6 + push * 0.4, -44 + bob, 20 + push, -42 + bob, jacketColor, skinColor, 8.5, 7, skinColor, 5.5);
        this.drawArticulatedArm(ctx, 10, -44 + bob, 16 + push * 0.45, -40 + bob, 24 + push, -38 + bob, jacketColor, skinColor, 8.8, 7.2, skinColor, 5.8);
        ctx.save();
        ctx.translate(28 + push, -40 + bob);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.45)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 0, 23 + Math.sin(animP * Math.PI) * 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        this.drawCelStarBurst(ctx, 0, 0, 15, '#ffffff', '#ff6097', 5, animP * 2);
        ctx.restore();
      }
    } else if (isShieldWindup) {
      // Discus Coil Across Chest before hurling Rose's Shield!
      this.drawArticulatedArm(ctx, 10, -44 + bob, 2, -40 + bob, -8, -38 + bob, jacketColor, skinColor, 8.8, 7.2);
      ctx.save();
      ctx.translate(-8, -38 + bob);
      ctx.fillStyle = 'rgba(255, 96, 151, 0.92)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.ellipse(0, 0, 17, 9, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    } else if (isShieldThrown) {
      // Dynamic Discus Release Follow-Through!
      const ext = Math.sin(((animP - 0.25) / 0.75) * Math.PI) * 12;
      this.drawArticulatedArm(ctx, 10, -44 + bob, 19 + ext * 0.5, -43 + bob, 27 + ext, -41 + bob, jacketColor, skinColor, 8.8, 7.2, skinColor, 5.8);
    } else if (isShieldStance && this.bubbleTimer > 0) {
      // Right arm raised high in Bubble Summon pose!
      this.drawArticulatedArm(ctx, 12, -46 + bob, 21, -52 + bob, 27, -60 + bob, jacketColor, skinColor, 8.5, 7, skinColor, 5);
    } else {
      // Ready Forearm holding Show-Accurate Translucent Rose's Shield cleanly off to the side so star tee shines!
      const fSw = motion.armSwingF * 10;
      const shieldX = (isShieldStance ? 21 : 19) + fSw * 0.45;
      const shieldY = (isShieldStance ? -36 : -31) + bob + fSw * 0.25;
      this.drawArticulatedArm(ctx, 11, -44 + bob, 15 + fSw * 0.25, -38 + bob, shieldX, shieldY, jacketColor, jacketColor, 8.5, 7.0);
      ctx.save();
      ctx.fillStyle = 'rgba(244, 114, 182, 0.78)';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.arc(shieldX, shieldY, 15.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(shieldX, shieldY, 11.2, 0.3, Math.PI * 1.85); ctx.stroke();

      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(shieldX, shieldY, 6.8, 0, Math.PI * 1.65); ctx.stroke();

      // Faceted pink diamond center core
      ctx.fillStyle = '#e11d48';
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(shieldX, shieldY, 3.4, 0, Math.PI * 2); ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- SHOW-ACCURATE GARNET ---
  drawGarnet(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isRocketLaunched = (actionType === 'throw' && animP > 0.25);
    const isRocketWindup = (actionType === 'throw' && animP <= 0.25);
    const isSeismicSlam = (actionType === 'skill');

    // Helper for Garnet's Era 3 crimson banded boxing gauntlet with gold star wrist plate (Garnet.webp!)
    const ink = '#170a1c';
    const drawArmoredGauntlet = (gx, gy, angle, isRuby) => {
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(angle);
      ctx.scale(0.88, 0.88);
      // Crimson-red gauntlet shell with dark plum bands
      ctx.fillStyle = isRuby ? '#dc2626' : '#be123c';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-13, -12, 27, 24, 7);
      ctx.fill();
      ctx.stroke();
      // Signature dark-crimson gauntlet cuff band
      ctx.fillStyle = '#4c0519';
      ctx.fillRect(-10, -11, 5, 22);
      // Knuckle plates & magenta gem knuckles
      ctx.fillStyle = '#ec4899';
      for (const ky of [-7, -2.5, 2.5, 7]) {
        ctx.beginPath();
        ctx.ellipse(12, ky, 3.2, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Iconic bright gold 5-point star plate on wrist
      ctx.fillStyle = '#facc15';
      this.drawMiniStar(ctx, -1, 0, 7.2);
      ctx.restore();
    };

    // 1. Era 3 Powerful Dark-Navy Bodysuit Legs w/ Hot-Pink Toe/Heel Accents (Garnet.webp!)
    const drawGarnetLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -36 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 29, 8.2, 4.6, darken ? '#090624' : '#0f0a3c', '#050314', 1);
      // Pointed dark-navy boot with hot-pink toe cap & heel flash
      ctx.fillStyle = darken ? '#090624' : '#0f0a3c';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-4.5, 28);
      ctx.lineTo(5, 28);
      ctx.lineTo(11.5, 35.5);
      ctx.lineTo(-5.5, 35.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(5.5, 31); ctx.lineTo(11.5, 35.5); ctx.lineTo(5.5, 35.5); ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    drawGarnetLeg(-8.5 + legs.backX, legs.backY, legs.backRot, true);
    drawGarnetLeg(8.5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Ruby Arm (slender magenta-plum upper arm into massive crimson gauntlet!)
    if (isPunch && combo === 0) {
      const jab = strike * 34;
      this.drawArticulatedArm(ctx, -12, -62 + bob, 2 + jab * 0.45, -58 + bob, 16 + jab, -56 + bob, '#9d3b7d', '#9d3b7d', 5.8, 5.2);
      drawArmoredGauntlet(16 + jab, -56 + bob, 0, true);
    } else if (!isSeismicSlam && !(isPunch && combo === 2)) {
      const weaveB = motion.armSwingB * 12;
      const guardX = ((isPunch && combo === 1) ? -22 : -18) + weaveB * 0.5;
      const guardY = ((isPunch && combo === 1) ? -52 : -49) + bob + weaveB * 0.35;
      this.drawArticulatedArm(ctx, -15, -64 + bob, -21 + weaveB * 0.3, -55 + bob, guardX, guardY, '#9d3b7d', '#9d3b7d', 5.6, 5.0);
      drawArmoredGauntlet(guardX, guardY, -0.35, true);
    }

    // 3. Era 3 Split Indigo/Magenta Hourglass Waist + Hot-Pink Chevron Chest & Puff Shoulders (Garnet.webp!)
    // Curvy dark-navy hips
    ctx.fillStyle = '#0f0a3c';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-11, -44 + bob);
    ctx.lineTo(11, -44 + bob);
    ctx.quadraticCurveTo(19, -37 + bob, 17, -29 + bob);
    ctx.lineTo(-17, -29 + bob);
    ctx.quadraticCurveTo(-19, -37 + bob, -11, -44 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Split indigo/plum waist corset
    ctx.fillStyle = '#1e1b5e';
    ctx.beginPath();
    ctx.moveTo(-10, -56 + bob); ctx.lineTo(0, -56 + bob); ctx.lineTo(0, -41 + bob); ctx.lineTo(-12, -41 + bob); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#701a5c';
    ctx.beginPath();
    ctx.moveTo(0, -56 + bob); ctx.lineTo(10, -56 + bob); ctx.lineTo(12, -41 + bob); ctx.lineTo(0, -41 + bob); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Hot-pink & light-pink chevron chest top (matches Garnet.webp!)
    ctx.fillStyle = '#f43f8e';
    ctx.beginPath();
    ctx.ellipse(0, -61 + bob, 14.5, 9.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.moveTo(-12, -64 + bob);
    ctx.quadraticCurveTo(0, -70 + bob, 12, -64 + bob);
    ctx.lineTo(7, -58 + bob);
    ctx.lineTo(0, -63 + bob);
    ctx.lineTo(-7, -58 + bob);
    ctx.closePath();
    ctx.fill();

    // Iconic Hot-Pink Puffed Shoulder Pads
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(-15.5, -66 + bob, 8.2, 7.0, -0.3, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(15.5, -66 + bob, 8.2, 7.0, 0.3, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 4. Signature Rounded-Cube Dark-Plum Afro (Garnet.webp!)
    const afroShift = hair.swayX * 0.35;
    ctx.save();
    ctx.translate(afroShift, hair.swayY * 0.25);
    ctx.fillStyle = '#231126';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.roundRect(-23, -118 + bob, 46, 47, 15);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#361a3b';
    ctx.beginPath();
    ctx.roundRect(-19, -114 + bob, 38, 12, 8);
    ctx.fill();
    ctx.restore();

    // 5. Sculpted Magenta-Plum Jaw & Confident Garnet Grin (Garnet.webp!)
    ctx.fillStyle = '#9d3b7d';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-10.5, -88 + bob);
    ctx.lineTo(10.5, -88 + bob);
    ctx.lineTo(9.5, -73 + bob);
    ctx.quadraticCurveTo(0, -69 + bob, -9.5, -73 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Confident toothy Garnet smile
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(1, -76.5 + bob, 5.2, 2.5, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 6. ICONIC ERA 3 GOLDEN-ORANGE 5-POINT STAR VISOR (Garnet.webp!)
    const visorGrad = ctx.createLinearGradient(-16, -96 + bob, 16, -80 + bob);
    visorGrad.addColorStop(0, '#fef08a');
    visorGrad.addColorStop(0.55, '#fbbf24');
    visorGrad.addColorStop(1, '#fb923c');
    ctx.fillStyle = visorGrad;
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -101 + bob);
    ctx.lineTo(5.5, -91.5 + bob);
    ctx.lineTo(16.5, -92.5 + bob);
    ctx.lineTo(9.5, -84.5 + bob);
    ctx.lineTo(12, -76 + bob);
    ctx.lineTo(0, -82 + bob);
    ctx.lineTo(-12, -76 + bob);
    ctx.lineTo(-9.5, -84.5 + bob);
    ctx.lineTo(-16.5, -92.5 + bob);
    ctx.lineTo(-5.5, -91.5 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crisp specular shine across star visor
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.moveTo(-3, -97 + bob);
    ctx.lineTo(2, -97 + bob);
    ctx.lineTo(-4, -84 + bob);
    ctx.lineTo(-8, -86 + bob);
    ctx.closePath();
    ctx.fill();

    // 7. Kinetic Boxer Gauntlet Action Poses
    if (isSeismicSlam) {
      const slamProgress = Math.max(0, this.getStrikeCurve(animP));
      const slamY = -44 + slamProgress * 34;
      this.drawArticulatedArm(ctx, -16, -64 + bob, -28, -50 + bob, -22, slamY, '#9d3b7d', '#9d3b7d', 6.2, 5.5);
      this.drawArticulatedArm(ctx, 16, -64 + bob, 28, -50 + bob, 22, slamY, '#9d3b7d', '#9d3b7d', 6.2, 5.5);
      drawArmoredGauntlet(-22, slamY + 6, Math.PI * 0.45, true);
      drawArmoredGauntlet(22, slamY + 6, Math.PI * 0.55, false);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-48, 0); ctx.lineTo(-20, -10); ctx.lineTo(20, -10); ctx.lineTo(48, 0);
      ctx.stroke();
    } else if (isRocketWindup) {
      this.drawArticulatedArm(ctx, 14, -62 + bob, 4, -56 + bob, -2, -52 + bob, '#9d3b7d', '#9d3b7d', 6, 5.2);
      drawArmoredGauntlet(2, -52 + bob, -0.2, false);
    } else if (isRocketLaunched) {
      this.drawArticulatedArm(ctx, 14, -62 + bob, 20, -56 + bob, 26, -54 + bob, '#9d3b7d', '#78350f', 6, 5.2);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(18, -60 + bob, 14, 12);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(32, -60 + bob); ctx.lineTo(46, -54 + bob); ctx.lineTo(32, -48 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(36, -54 + bob, 9, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isPunch) {
      if (combo === 0) {
        const jab = strike * 34;
        drawArmoredGauntlet(20 + jab, -56 + bob, -0.04, true);
        this.drawArticulatedArm(ctx, 14, -62 + bob, 10, -50 + bob, 8, -58 + bob, '#9d3b7d', '#9d3b7d', 5.8, 5.2);
        drawArmoredGauntlet(10, -58 + bob, -0.45, false);
      } else if (combo === 1) {
        const hook = strike * 32;
        const gy = -50 + bob - Math.max(0, strike) * 12;
        this.drawArticulatedArm(ctx, 14, -62 + bob, 18 + hook * 0.45, -48 + bob, 22 + hook, gy, '#9d3b7d', '#9d3b7d', 6.2, 5.5);
        drawArmoredGauntlet(26 + hook, gy, -0.28 * Math.max(0, strike), false);
      } else {
        const arcP = animP < 0.35 ? -1 + (animP / 0.35) : 1;
        const reach = Math.max(0, strike) * 34;
        const smashY = animP < 0.32 ? (-88 + bob) : (-88 + bob + Math.min(1, (animP - 0.32) / 0.28) * 52);
        const smashAngle = animP < 0.32 ? -1.1 : 0.48;
        this.drawArticulatedArm(ctx, -12, -64 + bob, 6 + reach * 0.4, smashY - 8, 18 + reach, smashY - 4, '#9d3b7d', '#9d3b7d', 6.0, 5.5);
        this.drawArticulatedArm(ctx, 14, -64 + bob, 12 + reach * 0.45, smashY - 4, 24 + reach, smashY + 2, '#9d3b7d', '#9d3b7d', 6.2, 5.5);
        drawArmoredGauntlet(20 + reach + arcP * 2, smashY - 4, smashAngle, true);
        drawArmoredGauntlet(26 + reach + arcP * 2, smashY + 3, smashAngle, false);
      }
    } else {
      const weaveF = motion.armSwingF * 12;
      this.drawArticulatedArm(ctx, 14, -62 + bob, 17 + weaveF * 0.4, -52 + bob, 22 + weaveF, -50 + bob + Math.abs(weaveF) * 0.3, '#9d3b7d', '#9d3b7d', 5.8, 5.2);
      drawArmoredGauntlet(24 + weaveF, -50 + bob + Math.abs(weaveF) * 0.3, -0.1 + motion.armSwingF * 0.15, false);
    }
  }

  // --- SHOW-ACCURATE AMETHYST ---
  drawAmethyst(ctx, bob, animP = 0, actionType = '') {
    if (this.isSpinDashing) {
      this.drawAmethystSpinDash(ctx);
      return;
    }

    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isSkillSlam = (actionType === 'skill');

    // Helper to draw a full-sized braided quartz whip + 8-spiked morningstar flail!
    const drawQuartzWhip = (hx, hy, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, tipX, tipY, scaleM = 1) => {
      // Outer electric violet cord
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 6 * scaleM;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, tipX, tipY);
      ctx.stroke();

      // Inner bright lilac braided highlight
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 2.2 * scaleM;
      ctx.stroke();

      // Quartz barb nodules along cord
      const midX = (hx + ctrl1X + ctrl2X + tipX) * 0.25;
      const midY = (hy + ctrl1Y + ctrl2Y + tipY) * 0.25;
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(midX, midY, 3.8 * scaleM, 0, Math.PI * 2);
      ctx.fill();

      // Heavy 8-Spiked Quartz Morningstar Tip
      const starR = 8.5 * scaleM;
      ctx.fillStyle = '#7e22ce';
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(tipX, tipY, starR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.9;
      const spin = Date.now() / 160;
      for (let s = 0; s < 8; s++) {
        const sa = (Math.PI * 2 / 8) * s + spin;
        ctx.beginPath();
        ctx.moveTo(tipX + Math.cos(sa) * (starR + 6.5 * scaleM), tipY + Math.sin(sa) * (starR + 6.5 * scaleM));
        ctx.lineTo(tipX + Math.cos(sa + 0.34) * starR, tipY + Math.sin(sa + 0.34) * starR);
        ctx.lineTo(tipX + Math.cos(sa - 0.34) * starR, tipY + Math.sin(sa - 0.34) * starR);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    };

    // 0. LONG, VOLUMINOUS, WILD WAVY PALE-LILAC HAIR MANE (BACK CASCADE — NO CIRCLES!)
    const swX = hair.swayX;
    const swY = hair.swayY;
    // Deep lilac under-wave shadow layer
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.moveTo(-4, -86 + bob);
    ctx.bezierCurveTo(-24, -84 + bob, -31 + swX * 0.5, -66 + bob + swY * 0.4, -25 + swX * 0.7, -50 + bob + swY * 0.5);
    ctx.bezierCurveTo(-34 + swX, -36 + bob + swY, -32 + swX * 1.2, -20 + bob + swY, -22 + swX * 1.3, -12 + bob + swY);
    ctx.quadraticCurveTo(-13 + swX, -18 + bob + swY, -12 + swX * 0.8, -26 + bob + swY);
    ctx.quadraticCurveTo(-5 + swX * 0.6, -15 + bob + swY, 2 + swX * 0.4, -22 + bob + swY);
    ctx.bezierCurveTo(14, -34 + bob, 20, -56 + bob, 14, -78 + bob);
    ctx.closePath();
    ctx.fill();

    // Main lush pale-lilac S-wave cascading mane with crisp cartoon ink outline (Amethyst.jpeg!)
    const ink = '#1e1326';
    ctx.fillStyle = '#dcd4ef';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(2, -88 + bob);
    ctx.bezierCurveTo(-18, -90 + bob, -29 + swX * 0.4, -72 + bob + swY * 0.3, -24 + swX * 0.6, -56 + bob + swY * 0.4);
    ctx.bezierCurveTo(-33 + swX * 0.9, -42 + bob + swY * 0.7, -30 + swX * 1.15, -24 + bob + swY, -19 + swX * 1.2, -14 + bob + swY);
    ctx.quadraticCurveTo(-12 + swX * 0.9, -22 + bob + swY, -10 + swX * 0.8, -30 + bob + swY * 0.7);
    ctx.quadraticCurveTo(-6 + swX * 0.7, -19 + bob + swY, 0 + swX * 0.5, -18 + bob + swY);
    ctx.quadraticCurveTo(6 + swX * 0.3, -28 + bob + swY * 0.5, 6, -38 + bob);
    ctx.bezierCurveTo(18, -42 + bob, 22, -62 + bob, 14, -80 + bob);
    ctx.quadraticCurveTo(10, -88 + bob, 2, -88 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sinuous lavender S-wave strand ribbons + bright specular hair shine inside back mane
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -80 + bob);
    ctx.bezierCurveTo(-22 + swX * 0.4, -66 + bob, -15 + swX * 0.7, -50 + bob, -23 + swX, -32 + bob + swY * 0.7);
    ctx.moveTo(-6, -74 + bob);
    ctx.bezierCurveTo(-14 + swX * 0.3, -58 + bob, -8 + swX * 0.6, -42 + bob, -14 + swX * 0.8, -24 + bob + swY * 0.7);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(-5, -86 + bob);
    ctx.quadraticCurveTo(-18, -80 + bob, -20 + swX * 0.4, -62 + bob);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 1. Era 3 Star Denim Shorts w/ White Frayed Hems + Tapered Lavender Legs & Lilac Boots
    const drawAmethystLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -26 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 10, 6.2, 5.5, darken ? '#334155' : '#475569', '#1e293b', 1);
      ctx.fillStyle = '#0f172a';
      this.drawMiniStar(ctx, 0.5, 5, 3.6);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-6, 9.5); ctx.lineTo(-3, 12.8); ctx.lineTo(0, 9.5); ctx.lineTo(3, 12.8); ctx.lineTo(6, 9.5); ctx.lineTo(6, 8.2); ctx.lineTo(-6, 8.2);
      ctx.closePath();
      ctx.fill();
      this.drawCelTaperedLimb(ctx, 0, 11, 0, 19, 4.4, 3.8, darken ? '#c084fc' : '#d8b4fe', '#a855f7', 1);
      this.drawCelBoot(ctx, 0.5, 24.5, 9.5, 5.8, darken ? '#7e22ce' : '#9333ea', '#f8fafc');
      ctx.restore();
    };
    drawAmethystLeg(-7 + legs.backX, legs.backY, legs.backRot, true);
    drawAmethystLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Whip Arm (Either resting coiled whip OR Hit 3 Dual-Whip X-Cleave!)
    if (isPunch && combo === 2) {
      // Hit 3: Left arm whips forward in unison for Twin Morningstar X-Cleave!
      const lash = Math.max(0, strike) * 38;
      this.drawArticulatedArm(ctx, -10, -48 + bob, 4 + lash * 0.35, -54 + bob, 16 + lash * 0.55, -52 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      drawQuartzWhip(16 + lash * 0.55, -52 + bob, 28 + lash * 0.8, -68 + bob, 44 + lash, -28 + bob, 56 + lash * 1.15, -18 + bob, 0.92);
    } else if (!isSkillSlam) {
      const swB = motion.armSwingB * 12;
      this.drawArticulatedArm(ctx, -11, -48 + bob, -17 - swB * 0.4, -40 + bob, -15 - swB, -32 + bob, '#d8b4fe', '#d8b4fe', 7.5, 6.5, '#d8b4fe', 4);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-15 - swB, -32 + bob);
      ctx.bezierCurveTo(-24 - swB, -26 + bob, -22 - swB, -16 + bob, -16 - swB * 0.7, -15 + bob);
      ctx.stroke();
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(-16 - swB * 0.7, -15 + bob, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Era 3 Contoured Lavender Shoulders & Asymmetric Cutout Charcoal Tank Top
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.moveTo(-13, -56 + bob);
    ctx.quadraticCurveTo(0, -59 + bob, 13, -56 + bob);
    ctx.lineTo(15, -42 + bob);
    ctx.lineTo(-15, -42 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-14, -52 + bob);
    ctx.quadraticCurveTo(0, -49 + bob, 14, -52 + bob);
    ctx.quadraticCurveTo(17, -38 + bob, 14, -25 + bob);
    ctx.lineTo(-14, -25 + bob);
    ctx.quadraticCurveTo(-17, -38 + bob, -14, -52 + bob);
    ctx.closePath();
    ctx.fill();
    // Asymmetric single-shoulder black strap
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-13, -56 + bob); ctx.lineTo(-7.5, -56 + bob); ctx.lineTo(-8.5, -48 + bob); ctx.lineTo(-14, -48 + bob);
    ctx.closePath(); ctx.fill();
    // Sleek charcoal highlight rim + open shoulder glow cutout
    ctx.fillStyle = '#3f3f46';
    ctx.beginPath(); ctx.ellipse(-4, -36 + bob, 8, 2.5, 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.arc(10, -50 + bob, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Hexagonal Faceted Amethyst Gem on Chest
    ctx.fillStyle = '#7e22ce';
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const cx = 0, cy = -44 + bob, r = 6;
    for (let a = 0; a < 6; a++) {
      const angle = (Math.PI / 3) * a;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#c084fc';
      this.drawMiniStar(ctx, 0, -44 + bob, 5);
    }

    // 5. Lavender Face with Crisp Outline (Amethyst.jpeg!)
    ctx.fillStyle = '#b895d1';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -66 + bob, 15.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 6. Signature Cocky Toothy Grin (Amethyst.jpeg!)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-2, -60 + bob);
    ctx.quadraticCurveTo(5, -58.5 + bob, 11.5, -61 + bob);
    ctx.quadraticCurveTo(9, -54 + bob, -1, -55.5 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 7. Expressive Dark Violet Right Eye (with natural blink)
    if (this.isBlinking && !this.isAttacking) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(6.5, -66 + bob, 3.8, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(6.5, -67 + bob, 4.4, 5.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(7.2, -66.5 + bob, 2.3, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. Sculpted Wavy Front Bangs Sweeping Dramatically OVER Her Left Eye!
    ctx.fillStyle = '#dcd4ef';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(5, -84 + bob);
    ctx.bezierCurveTo(-8, -85 + bob, -19, -73 + bob, -15, -58 + bob);
    ctx.bezierCurveTo(-13, -50 + bob, -18 + swX * 0.25, -42 + bob, -9 + swX * 0.2, -39 + bob);
    ctx.bezierCurveTo(-4, -47 + bob, -7, -55 + bob, -1, -63 + bob);
    ctx.quadraticCurveTo(4, -71 + bob, 5, -84 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 9. Kinetic Lead Arm & Dual Spiked Quartz Whip Action Poses
    if (isSkillSlam) {
      const whipWiggle = Math.sin(animP * Math.PI * 4) * 9;
      this.drawArticulatedArm(ctx, -10, -48 + bob, -18, -56 + bob, -8, -44 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      this.drawArticulatedArm(ctx, 10, -48 + bob, 18, -56 + bob, 16, -42 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      drawQuartzWhip(-8, -44 + bob, -22, -65 + bob, -18 + whipWiggle, -18, 18 + whipWiggle, -2, 0.95);
      drawQuartzWhip(16, -42 + bob, 30, -68 + bob, 44 - whipWiggle, -18, 38 - whipWiggle, -2, 1.0);
      ctx.fillStyle = '#fde047';
      this.drawMiniStar(ctx, 18 + whipWiggle, 0, 9);
      this.drawMiniStar(ctx, 38 - whipWiggle, 0, 9);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(28, 0, 38, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isPunch) {
      const lash = Math.max(0, strike) * 44;
      const coil = Math.min(0, strike) * 14;
      if (combo === 0) {
        // Hit 1: High-Snapping S-Curve Whip Crack!
        const hx = 18 + lash * 0.35 + coil;
        const hy = -48 + bob - Math.max(0, strike) * 5;
        this.drawArticulatedArm(ctx, 10, -48 + bob, 14 + lash * 0.18 + coil * 0.5, -52 + bob, hx, hy, '#d8b4fe', '#d8b4fe', 8.5, 7, '#d8b4fe', 5);
        const wave = Math.sin(animP * Math.PI * 2.5) * 14;
        drawQuartzWhip(hx, hy, hx + 14 + lash * 0.3, hy - 18 + wave, hx + 28 + lash * 0.65, hy + 14 - wave, 34 + lash * 1.15 + coil, -38 + bob, 1.0);
      } else if (combo === 1) {
        // Hit 2: Low-Sweeping Rising Diagonal Whip Lash!
        const hx = 18 + lash * 0.35 + coil;
        const hy = -42 + bob + Math.max(0, 1 - animP * 2) * 8;
        this.drawArticulatedArm(ctx, 10, -46 + bob, 14 + lash * 0.18, -40 + bob, hx, hy, '#d8b4fe', '#d8b4fe', 8.5, 7, '#d8b4fe', 5);
        const sweepY = -12 + bob - animP * 44;
        drawQuartzWhip(hx, hy, hx + 16 + lash * 0.3, -10 + bob, hx + 30 + lash * 0.7, sweepY + 12, 36 + lash * 1.15, sweepY, 1.0);
      } else {
        // Hit 3: Right Whip of Dual-Whip Twin X-Cleave (Slashes from low-to-high crossing Left Whip!)
        const hx = 20 + lash * 0.4;
        const hy = -42 + bob;
        this.drawArticulatedArm(ctx, 10, -48 + bob, 15 + lash * 0.2, -42 + bob, hx, hy, '#d8b4fe', '#d8b4fe', 8.5, 7, '#d8b4fe', 5);
        drawQuartzWhip(hx, hy, 32 + lash * 0.65, -14 + bob, 48 + lash * 0.9, -58 + bob, 60 + lash * 1.18, -64 + bob, 1.05);
      }
    } else {
      // Idle / Walking Ready Spiked Whip with continuous motion
      const swF = motion.armSwingF * 11;
      const idleWave = Math.sin(motion.t * 4.5) * 4;
      this.drawArticulatedArm(ctx, 10, -48 + bob, 15 + swF * 0.4, -43 + bob, 20 + swF, -44 + bob + swF * 0.2, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      drawQuartzWhip(20 + swF, -44 + bob + swF * 0.2, 26 + swF, -34 + bob + idleWave, 24 + swF * 0.5, -24 + bob - idleWave, 32 + swF, -32 + bob + idleWave * 0.5, 0.95);
    }
  }

  // Authentic Lore: Quartz Buzzsaw Spin Dash Ball
  drawAmethystSpinDash(ctx) {
    ctx.save();
    const rot = (Date.now() / 25) * this.facing;
    const r = 24;

    for (let t = 1; t <= 3; t++) {
      ctx.save();
      ctx.globalAlpha = 0.28 / t;
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(-t * 12, -22, r - t * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(216, 180, 254, 0.45)';
    ctx.beginPath();
    ctx.arc(-20, -6, 8, 0, Math.PI * 2);
    ctx.arc(-28, -8, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -22);
    ctx.rotate(rot);

    const spikes = 10;
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
      const a = (i * Math.PI * 2) / spikes;
      const x1 = Math.cos(a) * (r + 7);
      const y1 = Math.sin(a) * (r + 7);
      const aMid = a + Math.PI / spikes;
      const x2 = Math.cos(aMid) * (r - 2);
      const y2 = Math.sin(aMid) * (r - 2);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();

    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    coreGrad.addColorStop(0, '#f3e8ff');
    coreGrad.addColorStop(0.4, '#c084fc');
    coreGrad.addColorStop(1, '#6b21a8');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }

    ctx.restore();
  }

  // --- SHOW-ACCURATE PEARL ---
  drawPearl(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isLaser = (actionType === 'throw');
    const isHolo = (actionType === 'skill');
    const ink = '#1e1626';

    // Helper: slender ballet leg matching Pearl.jpeg (ochre shorts, ivory leg, pastel-pink sock, mint flat)
    const drawPearlLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -38 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 12, 4.3, 3.5, darken ? '#e0a44d' : '#f2bf6d', '#c28534', 1);
      this.drawCelTaperedLimb(ctx, 0, 12, 0, 26, 3.1, 2.3, darken ? '#e9e7d6' : '#f5f4e6', '#d6d3be', 1);
      this.drawCelTaperedLimb(ctx, 0, 25, 0, 34, 2.8, 2.5, darken ? '#f5b8c8' : '#fbcfe8', '#ec9eb3', 1);
      // Pointed mint ballet flat with crisp ink outline
      ctx.fillStyle = darken ? '#5eead4' : '#99f6e4';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-3.2, 34);
      ctx.quadraticCurveTo(3.5, 33.5, 9.8, 36.8);
      ctx.quadraticCurveTo(9.2, 38.8, -3.5, 38.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    // 1. Ballet / Fencing Legs
    if (isPunch && combo === 2) {
      drawPearlLeg(-2, 0, 0.06, true);
      ctx.save();
      ctx.translate(3, -38 + bob);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 6.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(11, 13); ctx.lineTo(2, 23);
      ctx.stroke();
      ctx.strokeStyle = '#f5f4e6';
      ctx.lineWidth = 4.2;
      ctx.stroke();
      ctx.restore();
    } else {
      drawPearlLeg(-4 + legs.backX, legs.backY, legs.backRot, true);
      drawPearlLeg(4 + legs.frontX, legs.frontY, legs.frontRot, false);
    }

    // 2. Flowing Cyan Waist Sash Tails (behind torso, matching Pearl.jpeg!)
    const sashSway = hair.swayX * 0.9;
    ctx.fillStyle = '#5eead4';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-8, -44 + bob);
    ctx.bezierCurveTo(-18 + sashSway * 0.4, -38 + bob, -21 + sashSway * 0.8, -24 + bob, -16 + sashSway, -13 + bob + hair.swayY * 0.4);
    ctx.lineTo(-9 + sashSway * 0.7, -15 + bob + hair.swayY * 0.3);
    ctx.quadraticCurveTo(-12 + sashSway * 0.3, -28 + bob, -5, -40 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Rear Left Arm (slender porcelain arm with ballet grace)
    if (isPunch && combo === 0) {
      const poise = Math.max(0, strike) * 5;
      this.drawArticulatedArm(ctx, -5.5, -65 + bob, -18 - poise, -71 + bob, -25 - poise, -80 + bob, '#f5f4e6', '#f5f4e6', 4.6, 3.8, '#f5f4e6', 3.3);
    } else if (!isPunch && !isLaser && !isHolo) {
      const armSwing = motion.armSwingB * 11;
      this.drawArticulatedArm(ctx, -5.5, -65 + bob, -11 - armSwing * 0.55, -52 + bob, -13 - armSwing, -40 + bob, '#f5f4e6', '#f5f4e6', 4.4, 3.6, '#f5f4e6', 3.1);
    }

    // 4. Sculpted Mint-Teal Halter Tunic + Peplum Skirt + Cyan Sash + Yellow Star (Pearl.jpeg)
    ctx.fillStyle = '#f2bf6d';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-7.5, -42 + bob);
    ctx.lineTo(7.5, -42 + bob);
    ctx.lineTo(7, -33 + bob);
    ctx.lineTo(-7, -33 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#7bd2c4';
    ctx.beginPath();
    ctx.moveTo(-4, -71 + bob);
    ctx.lineTo(4, -71 + bob);
    ctx.quadraticCurveTo(9, -60 + bob, 7.5, -48 + bob);
    ctx.lineTo(12, -40 + bob);
    ctx.quadraticCurveTo(0, -39 + bob, -11, -40 + bob);
    ctx.lineTo(-7.5, -48 + bob);
    ctx.quadraticCurveTo(-8.5, -60 + bob, -4, -71 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draped cyan sash wrap around waist
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.moveTo(-8.5, -49 + bob);
    ctx.quadraticCurveTo(0, -47 + bob, 8.5, -50 + bob);
    ctx.lineTo(9.5, -44 + bob);
    ctx.quadraticCurveTo(0, -42 + bob, -9.5, -44 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Soft lemon-yellow 5-point chest star
    ctx.fillStyle = '#fef08a';
    this.drawMiniStar(ctx, 1.5, -59 + bob, 5.4);

    // 5. Iconic Swept-Back Peach Triangular Bob (Pearl.jpeg!)
    const tipX = -21 + hair.swayX * 0.45;
    const tipY = -88 + bob + hair.swayY * 0.35;
    ctx.fillStyle = '#f8c6b3';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(4, -99 + bob);
    ctx.quadraticCurveTo(-5, -101 + bob, tipX, tipY);
    ctx.lineTo(tipX + 4, tipY + 4);
    ctx.lineTo(tipX + 2, tipY + 7);
    ctx.quadraticCurveTo(-12, -74 + bob, -4, -75 + bob);
    ctx.quadraticCurveTo(6, -78 + bob, 10, -89 + bob);
    ctx.quadraticCurveTo(9, -97 + bob, 4, -99 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hair specular cel highlight
    ctx.fillStyle = '#fde2d7';
    ctx.beginPath();
    ctx.moveTo(2, -97 + bob);
    ctx.quadraticCurveTo(-7, -97 + bob, tipX + 5, tipY + 2);
    ctx.quadraticCurveTo(-5, -92 + bob, 3, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // 6. Slender Porcelain Neck & Show-Accurate Oval Face + Pointed Nose + Forehead Pearl!
    this.drawCelTaperedLimb(ctx, 0.5, -70 + bob, 0.5, -76 + bob, 2.7, 2.4, '#f5f4e6', '#e2dfc9', 1);
    ctx.fillStyle = '#f5f4e6';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(2, -85 + bob, 10.5, 12.2, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Peach hairline curving over left temple (matches Pearl.jpeg!)
    ctx.fillStyle = '#f8c6b3';
    ctx.beginPath();
    ctx.moveTo(-8.5, -86 + bob);
    ctx.quadraticCurveTo(-10, -96 + bob, 1, -98 + bob);
    ctx.quadraticCurveTo(-4, -93 + bob, -3.5, -84 + bob);
    ctx.quadraticCurveTo(-4, -77 + bob, -7.5, -76 + bob);
    ctx.quadraticCurveTo(-10, -80 + bob, -8.5, -86 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Luminous Oval Forehead Pearl Gem
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = (isLaser || isHolo) ? '#22d3ee' : ink;
    ctx.lineWidth = (isLaser || isHolo) ? 2.0 : 1.4;
    ctx.beginPath();
    ctx.ellipse(4.5, -94.5 + bob, 4.4, 3.2, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(5.5, -93.8 + bob, 2.2, 1.3, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Two Large Expressive Sky-Blue Eyes (with natural blink)
    if (this.isBlinking && !this.isAttacking) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.arc(0.5, -85 + bob, 2.6, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(8.2, -85 + bob, 2.5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else {
      for (const [ex, erx] of [[0.5, 3.0], [8.2, 2.8]]) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(ex, -85.5 + bob, erx, 4.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.ellipse(ex + 1.0, -85.2 + bob, erx * 0.55, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(ex + 1.2, -85.2 + bob, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Iconic Sharp Pointed Pearl Nose (cleanly outlined, pointing forward +X!)
    ctx.fillStyle = '#f5f4e6';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(6.5, -85 + bob);
    ctx.lineTo(18.5, -84 + bob);
    ctx.lineTo(8.5, -80 + bob);
    ctx.stroke();
    ctx.fill();

    // Confident Pearl Smile
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0.5, -77.5 + bob);
    ctx.quadraticCurveTo(4.5, -77 + bob, 7.5, -78.2 + bob);
    ctx.quadraticCurveTo(4.5, -73.8 + bob, 0.5, -77.5 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 7. SHOW-ACCURATE SPIRALING RIBBON SPEAR & FENCING CHOREOGRAPHY!
    let spearBaseX = 11;
    let spearBaseY = -48 + bob;
    let spearAngle = -0.32;

    if (isPunch) {
      if (combo === 0) {
        const reach = strike * 46;
        spearBaseX = 12 + reach;
        spearBaseY = -52 + bob;
        spearAngle = 0.02;
        this.drawArticulatedArm(ctx, 5, -64 + bob, 9 + reach * 0.45, -56 + bob, spearBaseX, spearBaseY, '#f5f4e6', '#f5f4e6', 4.8, 4.0, '#f5f4e6', 3.4);
      } else if (combo === 1) {
        const sweepP = Math.min(1, animP * 1.35);
        spearBaseX = 14 + Math.max(0, strike) * 20;
        spearBaseY = -52 + bob;
        spearAngle = -0.95 + sweepP * 1.55;
        this.drawArticulatedArm(ctx, -4, -64 + bob, 4, -56 + bob, spearBaseX - 6, spearBaseY, '#f5f4e6', '#f5f4e6', 4.5, 3.8);
        this.drawArticulatedArm(ctx, 6, -64 + bob, 11, -55 + bob, spearBaseX, spearBaseY, '#f5f4e6', '#f5f4e6', 4.8, 4.0, '#f5f4e6', 3.4);
      } else {
        spearBaseX = 14 + Math.max(0, strike) * 22;
        spearBaseY = -54 + bob;
        spearAngle = -Math.PI + animP * Math.PI * 2.2;
        this.drawArticulatedArm(ctx, 4, -64 + bob, 10, -60 + bob, spearBaseX, spearBaseY, '#f5f4e6', '#f5f4e6', 4.8, 4.0, '#f5f4e6', 3.4);
      }
    } else if (isLaser) {
      spearBaseX = 14 + Math.max(0, strike) * 10;
      spearBaseY = -52 + bob;
      spearAngle = 0.0;
      this.drawArticulatedArm(ctx, -5, -64 + bob, 3, -55 + bob, spearBaseX - 8, spearBaseY, '#f5f4e6', '#f5f4e6', 4.5, 3.8);
      this.drawArticulatedArm(ctx, 6, -64 + bob, 11, -55 + bob, spearBaseX, spearBaseY, '#f5f4e6', '#f5f4e6', 4.8, 4.0, '#f5f4e6', 3.4);
    } else if (isHolo) {
      spearBaseX = 16;
      spearBaseY = -44 + bob;
      spearAngle = -Math.PI * 0.48;
      this.drawArticulatedArm(ctx, 5, -64 + bob, 12, -54 + bob, spearBaseX, spearBaseY, '#f5f4e6', '#f5f4e6', 4.8, 4.0, '#f5f4e6', 3.4);
      ctx.fillStyle = 'rgba(103, 232, 249, 0.28)';
      ctx.beginPath();
      ctx.moveTo(5, -94 + bob);
      ctx.lineTo(50, -78 + bob);
      ctx.lineTo(50, -28 + bob);
      ctx.closePath();
      ctx.fill();
    } else {
      const pSw = motion.armSwingF * 9;
      spearBaseX = 11 + pSw * 0.45;
      spearBaseY = -48 + bob + pSw * 0.25;
      spearAngle = -0.34 + motion.armSwingF * 0.08;
      this.drawArticulatedArm(ctx, 5, -64 + bob, 8 + pSw * 0.25, -54 + bob, spearBaseX, spearBaseY, '#f5f4e6', '#f5f4e6', 4.6, 3.8, '#f5f4e6', 3.3);
    }

    // Draw Pearl's Iconic White-Pole + Glowing Cyan Spiraling Ribbon Spear (matches Pearl.jpeg!)
    ctx.save();
    ctx.translate(spearBaseX, spearBaseY);
    ctx.rotate(spearAngle);

    // Sleek white pole + cyan collar + yellow-white star pommel
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.fillRect(-26, -1.8, 48, 3.6);
    ctx.strokeRect(-26, -1.8, 48, 3.6);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(19, -2.5, 4, 5);
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, -28, 0, 5.2);

    // Iconic Glowing White-Cyan Spiraling Ribbon Spearhead!
    ctx.fillStyle = 'rgba(224, 252, 255, 0.94)';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(22, -3.5);
    ctx.bezierCurveTo(32, -9, 42, -3, 52, -7);
    ctx.quadraticCurveTo(64, -5, 76, 0);
    ctx.quadraticCurveTo(64, 5, 52, 6.5);
    ctx.bezierCurveTo(42, 3, 32, 9, 22, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Spiral double-helix ribbon line twisting up the blade
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(23, 3);
    ctx.bezierCurveTo(31, -7, 39, 7, 48, -5);
    ctx.bezierCurveTo(56, 4, 63, -3, 72, 0);
    ctx.stroke();

    if (isLaser) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(76, 0, 10 + Math.sin(Date.now() / 35) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBubbleShield(ctx) {
    ctx.save();
    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const bubbleGrad = ctx.createRadialGradient(0, -45, 10, 0, -45, 55);
    bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
    bubbleGrad.addColorStop(0.6, 'rgba(255, 96, 151, 0.48)');
    bubbleGrad.addColorStop(1, 'rgba(244, 63, 94, 0.86)');

    // Steven Universe Future: Spiked Pink Diamond Bubble!
    if (this.activeChar === 'steven') {
      const spikes = 12;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.88)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < spikes; i++) {
        const a = (i * Math.PI * 2) / spikes + t * 0.8;
        const bx = Math.cos(a) * 49;
        const by = -45 + Math.sin(a) * 49;
        const tx = Math.cos(a) * 65;
        const ty = -45 + Math.sin(a) * 65;
        const pX = -Math.sin(a) * 6.5;
        const pY = Math.cos(a) * 6.5;
        ctx.beginPath();
        ctx.moveTo(bx + pX, by + pY);
        ctx.lineTo(tx, ty);
        ctx.lineTo(bx - pX, by - pY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.fillStyle = bubbleGrad;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -45, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -45, 46, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.restore();
  }

  // --- SHOW-ACCURATE BISMUTH ---
  drawBismuth(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isSkillSlam = (actionType === 'skill');
    const isAnvilThrow = (actionType === 'throw' && animP > 0.28);
    const ink = '#1e1624';
    const skin = '#8ba0cb';
    const skinShade = '#6b82b2';

    // 1. Articulated BUFFED Plum-Magenta Overalls Legs & Heavy Forge Boots (Bismuth.png!)
    const drawBismuthLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -30 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 21, 9.5, 7.6, darken ? '#601744' : '#7b2059', '#4a1033', 1);
      this.drawCelBoot(ctx, 1, 28, 14, 8.5, '#23141c', '#12090e', '#3b2430');
      ctx.restore();
    };
    drawBismuthLeg(-11.5 + legs.backX, legs.backY, legs.backRot, true);
    drawBismuthLeg(11.5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear MASSIVE Buffed Periwinkle-Blue Arm with Dark Star Shoulder Tattoo (Bismuth.png!)
    if (!(isPunch && combo === 2)) {
      const armSwing = motion.armSwingB * 13;
      this.drawArticulatedArm(ctx, -22, -64 + bob, -31 - armSwing * 0.4, -48 + bob, -28 - armSwing, -33 + bob, skinShade, skin, 14.5, 12.2, skin, 8.2);
      ctx.fillStyle = '#2d1c2e';
      this.drawMiniStar(ctx, -26 - armSwing * 0.2, -56 + bob, 5.8);
    }

    // 3. POWERFUL Broad Blacksmith Torso + Plum-Magenta Overalls + Gold Chevron Clasps (Bismuth.png!)
    ctx.fillStyle = skin;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(-27, -71 + bob);
    ctx.quadraticCurveTo(0, -75 + bob, 27, -71 + bob);
    ctx.quadraticCurveTo(28, -48 + bob, 21, -26 + bob);
    ctx.lineTo(-21, -26 + bob);
    ctx.quadraticCurveTo(-28, -48 + bob, -27, -71 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Plum-magenta blacksmith overalls bib, waist seam & shoulder straps
    ctx.fillStyle = '#7b2059';
    ctx.beginPath();
    ctx.moveTo(-21, -54 + bob);
    ctx.lineTo(21, -54 + bob);
    ctx.quadraticCurveTo(23, -40 + bob, 20.5, -26 + bob);
    ctx.lineTo(-20.5, -26 + bob);
    ctx.quadraticCurveTo(-23, -40 + bob, -21, -54 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Stitched vertical apron seams & waist band
    ctx.strokeStyle = '#4a1033';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, -37 + bob); ctx.lineTo(20, -37 + bob);
    ctx.moveTo(-8, -54 + bob); ctx.lineTo(-8, -40 + bob);
    ctx.moveTo(8, -54 + bob); ctx.lineTo(8, -40 + bob);
    ctx.moveTo(0, -54 + bob); ctx.lineTo(0, -42 + bob);
    ctx.stroke();

    // Thick plum straps + iconic golden chevron clasps (Bismuth.png!)
    ctx.fillStyle = '#7b2059';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.7;
    for (const sx of [-19.5, 12]) {
      ctx.beginPath();
      ctx.roundRect(sx, -71 + bob, 7.8, 19, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(sx - 1.5, -57 + bob);
      ctx.lineTo(sx + 9.2, -57 + bob);
      ctx.lineTo(sx + 9.2, -51.5 + bob);
      ctx.lineTo(sx + 3.8, -47.5 + bob);
      ctx.lineTo(sx - 1.5, -51.5 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#7b2059';
    }

    // 4. Iconic Recessed Square-Spiral Rainbow Bismuth Chest Gem (Bismuth.png!)
    const gemX = 0, gemY = -60 + bob;
    ctx.fillStyle = '#9b7ca8';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.fillRect(gemX - 7.5, gemY - 7.5, 15, 15);
    ctx.strokeRect(gemX - 7.5, gemY - 7.5, 15, 15);
    const bandCols = this.isPinkOverdrive
      ? ['#f472b6', '#38bdf8', '#fde047', '#ffffff']
      : ['#a855f7', '#22d3ee', '#4ade80', '#fef08a'];
    ctx.fillStyle = bandCols[0]; ctx.fillRect(gemX - 5.2, gemY - 5.2, 10.4, 10.4);
    ctx.fillStyle = bandCols[1]; ctx.fillRect(gemX - 5.2, gemY - 3.6, 8.6, 8.8);
    ctx.fillStyle = bandCols[2]; ctx.fillRect(gemX - 5.2, gemY - 1.6, 6.4, 6.8);
    ctx.fillStyle = bandCols[3]; ctx.fillRect(gemX - 5.2, gemY + 0.4, 4.2, 4.8);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.1;
    ctx.strokeRect(gemX - 5.2, gemY - 5.2, 10.4, 10.4);

    // 5. Rounded Friendly Periwinkle Face + Thick Rainbow Dreadlocks Framing Head (Bismuth.png!)
    const swX = hair.swayX * 0.5;
    // Back rainbow dreads draping softly behind shoulders
    const backDreads = [
      { col: '#22d3ee', x1: -12, y1: -88, cx: -21 + swX * 0.5, cy: -76, x2: -18 + swX, y2: -64, w: 6.5 },
      { col: '#4ade80', x1: 11, y1: -88, cx: 20 + swX * 0.4, cy: -76, x2: 18 + swX * 0.7, y2: -66, w: 6.2 },
      { col: '#f472b6', x1: 9, y1: -86, cx: 16 + swX * 0.3, cy: -74, x2: 14 + swX * 0.5, y2: -65, w: 5.5 }
    ];
    for (const d of backDreads) {
      ctx.lineCap = 'round';
      ctx.strokeStyle = ink;
      ctx.lineWidth = d.w + 3;
      ctx.beginPath(); ctx.moveTo(d.x1, d.y1 + bob); ctx.quadraticCurveTo(d.cx, d.cy + bob, d.x2, d.y2 + bob); ctx.stroke();
      ctx.strokeStyle = d.col;
      ctx.lineWidth = d.w;
      ctx.stroke();
    }

    // Top rainbow crown braids arching over forehead
    const topBraids = [
      { col: '#fef08a', cx: -8, cy: -96, rx: 5.5, ry: 4.5 },
      { col: '#fb923c', cx: -3, cy: -97.5, rx: 5.5, ry: 4.5 },
      { col: '#ec4899', cx: 3, cy: -97.5, rx: 5.5, ry: 4.5 },
      { col: '#a855f7', cx: 8, cy: -96, rx: 5.5, ry: 4.5 },
      { col: '#22d3ee', cx: 12, cy: -92, rx: 5.0, ry: 4.2 }
    ];
    for (const tb of topBraids) {
      ctx.fillStyle = tb.col;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(tb.cx, tb.cy + bob, tb.rx, tb.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Lavender-slate hairline band + broad warm rounded periwinkle face
    ctx.fillStyle = '#9281a8';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -83 + bob, 16.5, 14.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(0.5, -81.5 + bob, 14.8, 12.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Front signature cream-yellow & cyan framing dreadlocks (Bismuth.png!)
    const frontDreads = [
      { col: '#22d3ee', x1: -13, y1: -88, cx: -18 + swX * 0.4, cy: -75, x2: -14 + swX * 0.6, y2: -63, w: 6.2 },
      { col: '#fef08a', x1: 12, y1: -87, cx: 17 + swX * 0.3, cy: -74, x2: 14 + swX * 0.5, y2: -61, w: 6.2 }
    ];
    for (const d of frontDreads) {
      ctx.lineCap = 'round';
      ctx.strokeStyle = ink;
      ctx.lineWidth = d.w + 3;
      ctx.beginPath(); ctx.moveTo(d.x1, d.y1 + bob); ctx.quadraticCurveTo(d.cx, d.cy + bob, d.x2, d.y2 + bob); ctx.stroke();
      ctx.strokeStyle = d.col;
      ctx.lineWidth = d.w;
      ctx.stroke();
    }

    // Big Expressive Cartoon Eyes + Warm Wide Grin (Bismuth.png!)
    if (this.isBlinking && !this.isAttacking) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(-4, -84 + bob, 3.2, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(5.5, -84 + bob, 3.2, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else {
      for (const ex of [-4, 5.5]) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(ex, -84.5 + bob, 3.6, 4.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.ellipse(ex + 0.8, -84 + bob, 1.8, 2.7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Wide friendly toothy smile
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6.5, -75 + bob);
    ctx.quadraticCurveTo(1.5, -75.5 + bob, 9.5, -77.5 + bob);
    ctx.quadraticCurveTo(8, -71 + bob, -4.5, -71.8 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 6. SHAPESHIFTING BLACKSMITH WEAPON ARMS!
    if (isAnvilThrow) {
      const ext = Math.sin(((animP - 0.28) / 0.72) * Math.PI) * 14;
      this.drawArticulatedArm(ctx, 15, -60 + bob, 22 + ext * 0.5, -54 + bob, 29 + ext, -50 + bob, skin, '#f97316', 11.5, 9.8, '#fbbf24', 5.8);
    } else if (isSkillSlam) {
      const slamP = Math.max(0, strike);
      const hy = -42 + bob + slamP * 26;
      const hx = 19 + slamP * 14;
      this.drawArticulatedArm(ctx, 15, -60 + bob, 23, -48 + bob, hx, hy, skin, skinShade, 12, 11);
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(0.45);
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.fillRect(-6, -12, 24, 24);
      ctx.strokeRect(-6, -12, 24, 24);
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(18, -9); ctx.lineTo(42, 0); ctx.lineTo(18, 9); ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (isPunch) {
      if (combo === 0) {
        const reach = strike * 32;
        const hx = 21 + reach;
        const hy = -50 + bob + Math.max(0, strike) * 4;
        this.drawArticulatedArm(ctx, 15, -60 + bob, 18 + reach * 0.45, -55 + bob, hx, hy, skin, skinShade, 11.5, 9.8);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(-0.35 + Math.max(0, strike) * 0.65);
        ctx.fillStyle = skin;
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(0, -15, 22, 30, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        this.drawMiniStar(ctx, 11, 0, 5.5);
        ctx.restore();
      } else if (combo === 1) {
        const reach = strike * 34;
        const hx = 22 + reach;
        const hy = -52 + bob;
        this.drawArticulatedArm(ctx, 15, -60 + bob, 18 + reach * 0.45, -55 + bob, hx, hy, skin, skinShade, 11.5, 9.8);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(-0.55 + animP * 1.15);
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.quadraticCurveTo(18, -26, 28, -18);
        ctx.quadraticCurveTo(34, 0, 28, 18);
        ctx.quadraticCurveTo(18, 26, 0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f97316';
        this.drawMiniStar(ctx, 14, 0, 5.5);
        ctx.restore();
      } else {
        const reach = Math.max(0, strike) * 34;
        const smashY = animP < 0.34 ? (-88 + bob) : (-88 + bob + Math.min(1, (animP - 0.34) / 0.30) * 64);
        this.drawArticulatedArm(ctx, -14, -62 + bob, 4 + reach * 0.4, smashY - 6, 18 + reach, smashY, skinShade, skinShade, 11, 9.5);
        this.drawArticulatedArm(ctx, 15, -62 + bob, 12 + reach * 0.45, smashY - 4, 22 + reach, smashY, skin, skinShade, 11.5, 10);
        ctx.save();
        ctx.translate(22 + reach, smashY);
        ctx.rotate(animP < 0.34 ? -0.9 : 0.35);
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-10, -16); ctx.lineTo(24, -16); ctx.lineTo(36, -6); ctx.lineTo(24, 16); ctx.lineTo(-10, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f97316';
        this.drawMiniStar(ctx, 10, 0, 7);
        ctx.restore();
      }
    } else {
      // Idle Ready MASSIVE Buffed Blacksmith Arm & Clenched Forge Fist (Bismuth.png!)
      const swF = motion.armSwingF * 11;
      this.drawArticulatedArm(ctx, 21, -62 + bob, 29 + swF * 0.4, -47 + bob, 28 + swF, -33 + bob + swF * 0.25, skin, skin, 14.5, 12.2, skin, 8.6);
    }
  }

  // --- SHOW-ACCURATE PERIDOT ---
  drawPeridot(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isChanneling = (actionType === 'throw' || actionType === 'skill');

    // 1. Era 3 Emerald Tapered Leggings, Black Knee Stars & Pale-Yellow Boots
    const drawPeridotLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -28 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 20, 4.4, 3.3, darken ? '#065f46' : '#16a34a', '#064e3b', 1);
      ctx.fillStyle = '#18181b';
      this.drawMiniStar(ctx, 0.4, 9.5, 3.6);
      this.drawCelBoot(ctx, 0.5, 26.5, 8.8, 5.5, '#fef08a', '#facc15', '#ffffff');
      ctx.restore();
    };
    drawPeridotLeg(-5 + legs.backX, legs.backY, legs.backRot, true);
    drawPeridotLeg(5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Arm (Expressive Ferrokinetic Conductor Pose!)
    if (isChanneling || (isPunch && combo === 2)) {
      this.drawArticulatedArm(ctx, -10, -54 + bob, -19, -62 + bob, -23, -72 + bob, '#14532d', '#a3e635', 6.5, 5.5, '#a3e635', 4);
      ctx.strokeStyle = 'rgba(163, 230, 53, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-23, -72 + bob, 7, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const armSwing = motion.armSwingB * 12;
      this.drawArticulatedArm(ctx, -10, -54 + bob, -15 - armSwing * 0.5, -45 + bob, -13 - armSwing, -36 + bob, '#14532d', '#a3e635', 6, 5, '#a3e635', 3.8);
    }

    // 3. Dark Forest-Green Top + Black Briefs + Bright Yellow Chest Star (Peridot.jpeg!)
    const ink = '#132a18';
    ctx.fillStyle = '#14532d';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-11.5, -58 + bob, 23, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(-11.5, -36 + bob, 23, 10, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    this.drawMiniStar(ctx, 0.5, -46 + bob, 6.8);

    // 4. Crisp Pale-Yellow Dorito Hair (Peridot.jpeg!)
    const hTilt = hair.swayX * 0.012;
    ctx.save();
    ctx.translate(0, -76 + bob);
    ctx.rotate(hTilt);
    ctx.fillStyle = '#eef79c';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(27, 8);
    ctx.quadraticCurveTo(0, 13, -27, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 5. Bright Lime-Chartreuse Sculpted Neck & Cel Face (Peridot.jpeg!)
    this.drawCelTaperedLimb(ctx, 0, -57 + bob, 0.5, -66 + bob, 3.4, 3.0, '#76e065', '#4ade80', 1);
    ctx.fillStyle = '#76e065';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -73 + bob, 12.2, 13.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 6. Forehead Rounded-Triangle Peridot Gemstone
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, -79 + bob);
    ctx.lineTo(6, -86 + bob);
    ctx.lineTo(-6, -86 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 7. Expressive Big Eyes + ICONIC POINTED KAMINA YELLOW STAR VISOR (Peridot.jpeg!)
    if (this.isBlinking && !this.isAttacking) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-7, -74 + bob); ctx.lineTo(-2, -74 + bob);
      ctx.moveTo(3, -74 + bob); ctx.lineTo(8, -74 + bob);
      ctx.stroke();
    } else {
      for (const ex of [-4.2, 5.2]) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(ex, -74 + bob, 3.5, 4.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(ex + 0.6, -74 + bob, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Iconic sharp winged translucent yellow Kamina visor!
    ctx.fillStyle = 'rgba(254, 249, 130, 0.72)';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -76 + bob);
    ctx.lineTo(24, -90 + bob);
    ctx.lineTo(11, -69 + bob);
    ctx.lineTo(0, -72 + bob);
    ctx.lineTo(-11, -69 + bob);
    ctx.lineTo(-24, -90 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Big cheeky Peridot toothy grin!
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-7.5, -66.5 + bob);
    ctx.quadraticCurveTo(0, -64.5 + bob, 7.5, -66.5 + bob);
    ctx.quadraticCurveTo(6.5, -59.5 + bob, 0, -59.5 + bob);
    ctx.quadraticCurveTo(-6.5, -59.5 + bob, -7.5, -66.5 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#86efac';
      this.drawDiamondInsignia(ctx, 0, -82 + bob, 5);
    }

    // 8. Expressive Ferrokinetic Hand Gestures & Levitating Metal Constructs!
    const reach = Math.max(0, strike) * 26;
    const fSw = motion.armSwingF * 9;
    const handX = isChanneling ? 22 : (isPunch ? 20 + reach * 0.45 : 16 + fSw * 0.5);
    const handY = isChanneling ? -58 + bob : (isPunch ? -50 + bob : -46 + bob + fSw * 0.3);
    this.drawArticulatedArm(ctx, 10, -54 + bob, 14 + (isPunch ? reach * 0.2 : fSw * 0.2), -49 + bob, handX, handY, '#14532d', '#a3e635', 6.5, 5.5, '#a3e635', 4.2);

    // Glowing Ferrokinetic Control Ring around Lead Hand
    const ringRadius = (isChanneling || isPunch) ? 11 + Math.sin(Date.now() / 50) * 2.5 : 7.5;
    ctx.strokeStyle = (isChanneling || isPunch) ? 'rgba(163, 230, 53, 0.95)' : 'rgba(132, 204, 22, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(handX + 2, handY, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: 3 Gleaming Levitating Steel Claws Slashing Forward!
        for (let cl = -1; cl <= 1; cl++) {
          const cx = 30 + reach * 1.15 + Math.abs(cl) * -4;
          const cy = -48 + bob + cl * 9;
          ctx.fillStyle = '#cbd5e1';
          ctx.strokeStyle = '#84cc16';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cx - 10, cy - 3);
          ctx.lineTo(cx + 12, cy + cl * 2);
          ctx.lineTo(cx - 8, cy + 3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else if (combo === 1) {
        // Hit 2: Heavy Riveted Steel I-Beam Girder Whipped Upward!
        ctx.save();
        ctx.translate(36 + reach, -44 + bob - reach * 0.4);
        ctx.rotate(-0.65 + animP * 1.4);
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-20, -6, 40, 12);
        ctx.strokeRect(-20, -6, 40, 12);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-20, -3, 40, 6);
        ctx.restore();
      } else {
        // Hit 3: Twin Magnetic Steel Crusher Jaws Clamping Shut!
        const clampGap = Math.max(3, (1 - Math.max(0, strike)) * 22);
        const jx = 40 + reach;
        const jy = -44 + bob;
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.8;
        // Upper crusher jaw
        ctx.beginPath();
        ctx.moveTo(jx - 14, jy - clampGap - 10);
        ctx.lineTo(jx + 16, jy - clampGap - 8);
        ctx.lineTo(jx + 10, jy - clampGap);
        ctx.lineTo(jx - 8, jy - clampGap);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Lower crusher jaw
        ctx.beginPath();
        ctx.moveTo(jx - 14, jy + clampGap + 10);
        ctx.lineTo(jx + 16, jy + clampGap + 8);
        ctx.lineTo(jx + 10, jy + clampGap);
        ctx.lineTo(jx - 8, jy + clampGap);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // Ambient Levitating Metal Shards
      const metalBob = Math.sin(Date.now() / 110) * 4.5;
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 1;
      ctx.fillRect(24 + (isChanneling ? 8 : 0), -52 + bob + metalBob, 7, 11);
      ctx.strokeRect(24 + (isChanneling ? 8 : 0), -52 + bob + metalBob, 7, 11);
      ctx.fillRect(-22, -46 + bob - metalBob, 6, 9);
    }
  }

  // --- SHOW-ACCURATE LAPIS LAZULI ---
  drawLapis(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isTidal = (actionType === 'skill');
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');
    const isGlowing = this.isPinkOverdrive || isTidal;
    const ink = '#0f2046';
    const skin = '#38c6f4';
    const skinShade = '#1aa3d6';

    // 0. Iconic Liquid-Aqua Flowing Water Wings (matches Lapis.png!)
    ctx.save();
    const wingFlap = Math.sin(Date.now() / 130) * (isTidal ? 9 : 4.5);
    const wS = isTidal ? 1.45 : (this.isPinkOverdrive ? 1.25 : 1.0);
    const drawLiquidWing = (dir) => {
      ctx.save();
      ctx.scale(dir, 1);
      ctx.fillStyle = 'rgba(186, 250, 255, 0.84)';
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(4, -56 + bob);
      ctx.bezierCurveTo(16 * wS, -92 + bob + wingFlap, 42 * wS, -94 + bob + wingFlap, 49 * wS, -66 + bob + wingFlap);
      ctx.bezierCurveTo(54 * wS, -48 + bob + wingFlap, 46 * wS, -34 + bob + wingFlap, 39 * wS, -40 + bob + wingFlap);
      ctx.bezierCurveTo(35 * wS, -44 + bob + wingFlap, 34 * wS, -54 + bob, 29 * wS, -50 + bob + wingFlap * 0.5);
      ctx.bezierCurveTo(25 * wS, -44 + bob, 23 * wS, -60 + bob, 16 * wS, -52 + bob);
      ctx.quadraticCurveTo(10 * wS, -48 + bob, 4, -48 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Glossy white water highlights & trailing droplets
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(16 * wS, -78 + bob + wingFlap * 0.8);
      ctx.quadraticCurveTo(31 * wS, -84 + bob + wingFlap, 40 * wS, -70 + bob + wingFlap);
      ctx.stroke();
      ctx.fillStyle = 'rgba(186, 250, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(32 * wS, -38 + bob + wingFlap * 0.8, 2.5, 3.6, 0.2, 0, Math.PI * 2);
      ctx.ellipse(24 * wS, -44 + bob + wingFlap * 0.5, 2.0, 2.8, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawLiquidWing(-1);
    drawLiquidWing(1);
    ctx.restore();

    // 1. Graceful Hovering Barefoot Cerulean Legs (Lapis.png!)
    const drawLapisLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -27 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 24, 3.4, 2.2, darken ? skinShade : skin, '#0d7ba8', 1);
      ctx.fillStyle = darken ? skinShade : skin;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(1.5, 25.5, 4.2, 2.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    drawLapisLeg(-5 + legs.backX, legs.backY, legs.backRot, true);
    drawLapisLeg(5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Flowing Asymmetrical High-Low Cobalt Skirt w/ Deep Navy Inner Lining (Lapis.png!)
    const skSway = hair.swayX * 0.7;
    // Deep navy underside arch
    ctx.fillStyle = '#0b256b';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-18 + skSway, -13 + bob);
    ctx.quadraticCurveTo(0 + skSway * 0.5, -5 + bob, 16 + skSway, -14 + bob);
    ctx.lineTo(12, -26 + bob);
    ctx.lineTo(-14, -26 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Outer royal-cobalt skirt flowing cleanly over knees
    ctx.fillStyle = '#1e64c8';
    ctx.beginPath();
    ctx.moveTo(-8.5, -39 + bob);
    ctx.lineTo(8.5, -39 + bob);
    ctx.quadraticCurveTo(14 + skSway * 0.4, -26 + bob, 17 + skSway, -14 + bob);
    ctx.quadraticCurveTo(4 + skSway * 0.4, -22 + bob, -18 + skSway, -13 + bob);
    ctx.quadraticCurveTo(-15 + skSway * 0.4, -26 + bob, -8.5, -39 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Dark navy diamond inverted triangle on skirt waist
    ctx.fillStyle = '#0b1c48';
    ctx.beginPath();
    ctx.moveTo(-7.5, -39 + bob);
    ctx.lineTo(7.5, -39 + bob);
    ctx.lineTo(0, -30 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Exposed Cyan Midriff + Cobalt Halter Top w/ Dark Navy Diamond & Fluttering Ribbons (Lapis.png!)
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.moveTo(-7, -45 + bob);
    ctx.lineTo(7, -45 + bob);
    ctx.lineTo(7.5, -39 + bob);
    ctx.lineTo(-7.5, -39 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fluttering cobalt neck ribbons behind shoulder
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(-5, -59 + bob);
    ctx.quadraticCurveTo(-15 + skSway * 0.5, -58 + bob, -22 + skSway, -51 + bob + hair.swayY * 0.3);
    ctx.stroke();
    ctx.strokeStyle = '#1e64c8';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Cobalt halter bodice + dark navy upper diamond
    ctx.fillStyle = '#1e64c8';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-8.5, -60 + bob);
    ctx.lineTo(-2.5, -60 + bob);
    ctx.lineTo(0, -54 + bob);
    ctx.lineTo(2.5, -60 + bob);
    ctx.lineTo(8.5, -60 + bob);
    ctx.lineTo(7.5, -44 + bob);
    ctx.lineTo(-7.5, -44 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0b1c48';
    ctx.beginPath();
    ctx.moveTo(0, -55 + bob);
    ctx.lineTo(6.5, -45 + bob);
    ctx.lineTo(-6.5, -45 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Swept Asymmetrical Royal-Blue Bob Hair (matches Lapis.png!)
    const hSway = hair.swayX * 0.6;
    ctx.fillStyle = '#1d63c6';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -92 + bob);
    ctx.quadraticCurveTo(-14, -93 + bob, -20 + hSway * 0.4, -79 + bob);
    ctx.lineTo(-16 + hSway * 0.5, -75 + bob);
    ctx.quadraticCurveTo(-22 + hSway * 0.7, -69 + bob, -15 + hSway * 0.6, -63 + bob);
    ctx.quadraticCurveTo(-6, -62 + bob, 14 + hSway * 0.3, -64 + bob);
    ctx.quadraticCurveTo(21, -72 + bob, 18, -84 + bob);
    ctx.lineTo(13, -86 + bob);
    ctx.quadraticCurveTo(10, -93 + bob, 0, -92 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Slender Neck & Show-Accurate Cerulean Face + Two Expressive Eyes!
    this.drawCelTaperedLimb(ctx, 0, -59 + bob, 0.5, -67 + bob, 3.0, 2.6, skin, skinShade, 1);
    ctx.fillStyle = skin;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(1, -76 + bob, 10.5, 11.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sweeping front cobalt bangs across forehead
    ctx.fillStyle = '#1d63c6';
    ctx.beginPath();
    ctx.moveTo(-11, -80 + bob);
    ctx.quadraticCurveTo(-6, -92 + bob, 7, -90 + bob);
    ctx.quadraticCurveTo(14, -87 + bob, 12, -79 + bob);
    ctx.quadraticCurveTo(7, -84 + bob, 2, -81 + bob);
    ctx.quadraticCurveTo(-3, -86 + bob, -11, -80 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Expressive Twin Eyes (Lapis.png!)
    if (this.isBlinking && !this.isAttacking && !isGlowing) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-2, -76 + bob, 2.7, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(6, -76 + bob, 2.7, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else {
      for (const [ex, erx] of [[-2, 2.9], [6, 2.8]]) {
        ctx.fillStyle = isGlowing ? '#e0f2fe' : '#ffffff';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(ex, -76 + bob, erx, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isGlowing ? '#38bdf8' : '#0f2046';
        ctx.beginPath();
        ctx.ellipse(ex + 0.7, -75.8 + bob, 1.3, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Subtle nose & serene mouth
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(2.5, -75 + bob); ctx.lineTo(4.2, -72.5 + bob); ctx.lineTo(2.2, -72 + bob);
    ctx.moveTo(0, -68 + bob); ctx.quadraticCurveTo(2.5, -67 + bob, 4.8, -68 + bob);
    ctx.stroke();

    // 6. Graceful Hydrokinetic Arm Choreography & Water Constructs!
    if (isTidal) {
      this.drawArticulatedArm(ctx, -8, -56 + bob, -15, -68 + bob, -11, -82 + bob, skin, skin, 4.8, 4.2, '#bae6fd', 4);
      this.drawArticulatedArm(ctx, 8, -56 + bob, 15, -68 + bob, 11, -82 + bob, skin, skin, 4.8, 4.2, '#bae6fd', 4);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-11, -84 + bob, 7.5, 0, Math.PI * 2);
      ctx.arc(11, -84 + bob, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      this.drawMiniStar(ctx, 0, -98 + bob, 8.5);
    } else if (isThrow) {
      const throwReach = Math.max(0, strike) * 26;
      const hx = 20 + throwReach;
      const hy = -54 + bob;
      this.drawArticulatedArm(ctx, 7, -56 + bob, 13 + throwReach * 0.45, -55 + bob, hx, hy, skin, skin, 4.8, 4.2, '#bae6fd', 4);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.85)';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hx + 8, hy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (isPunch) {
      const reach = Math.max(0, strike) * 30;
      if (combo === 0) {
        const hx = 18 + reach * 0.55;
        const hy = -52 + bob;
        this.drawArticulatedArm(ctx, 7, -56 + bob, 13 + reach * 0.25, -55 + bob, hx, hy, skin, skin, 4.8, 4.2, '#bae6fd', 3.8);
        this.drawCrescentSlash(ctx, hx + 6, hy, 24 + reach * 0.4, -Math.PI * 0.48, Math.PI * 0.48, 'rgba(14, 165, 233, 0.45)', 'rgba(56, 189, 248, 0.92)', '#ffffff', 12);
      } else if (combo === 1) {
        const lift = Math.max(0, strike) * 24;
        this.drawArticulatedArm(ctx, 7, -56 + bob, 14, -58 + bob - lift * 0.4, 18 + reach * 0.35, -62 + bob - lift, skin, skin, 4.8, 4.2, '#bae6fd', 4);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.88)';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(28 + reach * 0.5, -64 + bob - lift, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        this.drawArticulatedArm(ctx, -6, -56 + bob, 6, -62 + bob, 18 + reach * 0.4, -58 + bob, skin, skin, 4.6, 4.0);
        this.drawArticulatedArm(ctx, 7, -56 + bob, 14, -48 + bob, 22 + reach * 0.45, -44 + bob, skin, skin, 4.8, 4.2);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.92)';
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(16, -58 + bob);
        ctx.bezierCurveTo(32 + reach * 0.5, -76 + bob, 44 + reach * 0.8, -22 + bob, 62 + reach, -34 + bob);
        ctx.moveTo(18, -44 + bob);
        ctx.bezierCurveTo(34 + reach * 0.5, -18 + bob, 46 + reach * 0.8, -68 + bob, 62 + reach, -52 + bob);
        ctx.stroke();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
    } else {
      const armSwing = motion.armSwingF * 10;
      this.drawArticulatedArm(ctx, -7, -56 + bob, -12 - armSwing * 0.35, -46 + bob, -15 - armSwing * 0.6, -37 + bob, skinShade, skinShade, 4.4, 3.6, skinShade, 3.0);
      this.drawArticulatedArm(ctx, 7, -56 + bob, 12 + armSwing * 0.4, -46 + bob, 14 + armSwing * 0.7, -37 + bob, skin, skin, 4.5, 3.8, skin, 3.1);
    }
  }

  // --- SHOW-ACCURATE ROSE QUARTZ ---
  drawRose(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');
    const isHeal = (actionType === 'heal');

    // Helper to draw a sculpted hollow-center Rose Quartz spiral tube curl end!
    const drawSpiralTubeEnd = (cx, cy, r) => {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Hollow dark-rose tube interior!
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      ctx.ellipse(cx + 1, cy + 1, r * 0.58, r * 0.48, 0.25, 0, Math.PI * 2);
      ctx.fill();
      // Crisp pastel-pink spiral coil line
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx + 0.5, cy + 0.5, r * 0.52, 0, Math.PI * 1.65);
      ctx.stroke();
    };

    // 0. MAJESTIC CASCADING PINK SPIRAL ROSE-TUBE RINGLETS (BACK WATERFALL — NO FLOATING BALLS!)
    const swX = hair.swayX * 0.8;
    const swY = hair.swayY * 0.5;
    // Deep rose shadow waterfall
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(0, -98 + bob);
    ctx.bezierCurveTo(-24, -98 + bob, -36 + swX * 0.5, -72 + bob, -32 + swX * 0.8, -42 + bob + swY);
    ctx.bezierCurveTo(-36 + swX, -24 + bob + swY, -26 + swX, -8 + bob + swY, -12 + swX * 0.7, -10 + bob + swY);
    ctx.lineTo(18, -32 + bob);
    ctx.bezierCurveTo(28, -58 + bob, 26, -92 + bob, 0, -98 + bob);
    ctx.closePath();
    ctx.fill();

    // Lush sculpted main pink wave cascade with crisp cartoon outline (Rose.jpeg!)
    const inkR = '#331224';
    ctx.fillStyle = '#f59bc0';
    ctx.strokeStyle = inkR;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(2, -102 + bob);
    ctx.bezierCurveTo(-24, -103 + bob, -35 + swX * 0.4, -76 + bob, -30 + swX * 0.7, -50 + bob + swY);
    ctx.bezierCurveTo(-36 + swX, -32 + bob + swY, -30 + swX, -14 + bob + swY, -16 + swX * 0.8, -14 + bob + swY);
    ctx.quadraticCurveTo(0, -18 + bob, 18, -38 + bob);
    ctx.bezierCurveTo(30, -56 + bob, 28, -94 + bob, 2, -102 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3 Sculpted Hollow-Center Rose-Tube Spiral Curl Tips at bottom of cascade!
    drawSpiralTubeEnd(-25 + swX, -20 + bob + swY, 8.5);
    drawSpiralTubeEnd(-14 + swX * 0.8, -14 + bob + swY, 9);
    drawSpiralTubeEnd(-28 + swX * 0.7, -42 + bob + swY * 0.6, 8);

    // 1. Multi-Tiered Scalloped Ivory-to-Blush Bell Gown with Crisp Ink Outlines (Rose.jpeg!)
    const ink = '#331224';
    const gownSway = swX * 0.45;
    ctx.fillStyle = '#fce7f3';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-17, -42 + bob);
    ctx.lineTo(17, -42 + bob);
    ctx.quadraticCurveTo(25 + gownSway * 0.5, -18 + bob, 29 + gownSway, 1 + bob);
    ctx.quadraticCurveTo(0 + gownSway, 4 + bob, -29 + gownSway, 1 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Scalloped petal tier lines across ballgown (matches Rose.jpeg!)
    ctx.strokeStyle = '#d69eb8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-24 + gownSway * 0.7, -14 + bob);
    ctx.quadraticCurveTo(-8 + gownSway * 0.6, -10 + bob, 0 + gownSway * 0.6, -17 + bob);
    ctx.quadraticCurveTo(10 + gownSway * 0.6, -10 + bob, 24 + gownSway * 0.7, -14 + bob);
    ctx.stroke();

    // Upper scalloped cream-ivory bodice & skirt tier (#fffbeb)
    ctx.fillStyle = '#fffbeb';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-15, -62 + bob);
    ctx.quadraticCurveTo(-6, -65 + bob, 0, -59 + bob);
    ctx.quadraticCurveTo(6, -65 + bob, 15, -62 + bob);
    ctx.lineTo(22 + gownSway * 0.4, -27 + bob);
    ctx.quadraticCurveTo(11 + gownSway * 0.4, -23 + bob, 0 + gownSway * 0.4, -31 + bob);
    ctx.quadraticCurveTo(-11 + gownSway * 0.4, -23 + bob, -22 + gownSway * 0.4, -27 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Iconic 5-point star cutout on stomach displaying Rose Quartz navel gem!
    ctx.fillStyle = '#fce4ec';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.2;
    this.drawMiniStar(ctx, 1, -46 + bob, 8.2);
    ctx.fillStyle = '#f472b6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(1, -46 + bob, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Sculpted Blush-Ivory Neck & Gentle Motherly Cel Face (Show-Accurate Rose Quartz!)
    this.drawCelTaperedLimb(ctx, 0, -61 + bob, 0, -70 + bob, 4.8, 4.4, '#fce4ec', '#f8bbd0', 1);
    ctx.fillStyle = '#fce4ec';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -80 + bob, 14.5, 15.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Soft blush cheek glow + cel jaw shading
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
    ctx.beginPath(); ctx.ellipse(-7, -75 + bob, 3.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8.5, -75 + bob, 3.5, 2.0, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(219, 39, 119, 0.12)';
    ctx.beginPath(); ctx.ellipse(-5, -71 + bob, 12, 9, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(0, -80 + bob, 14.5, 15.2, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Romantic Star-Parted Pink Curtain Bangs & Shoulder Spiral Tube Ringlets!
    ctx.fillStyle = '#f472b6';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, -93 + bob);
    ctx.bezierCurveTo(-11, -99 + bob, -23, -91 + bob, -22, -74 + bob);
    ctx.bezierCurveTo(-23, -62 + bob, -25 + swX * 0.3, -52 + bob, -18 + swX * 0.3, -46 + bob);
    ctx.quadraticCurveTo(-12, -56 + bob, -14, -74 + bob);
    ctx.quadraticCurveTo(-10, -86 + bob, 0, -88 + bob);
    ctx.quadraticCurveTo(10, -86 + bob, 14, -74 + bob);
    ctx.quadraticCurveTo(13, -58 + bob, 18, -48 + bob);
    ctx.bezierCurveTo(24, -54 + bob, 22, -64 + bob, 21, -74 + bob);
    ctx.bezierCurveTo(22, -91 + bob, 11, -99 + bob, 0, -93 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pastel crown highlight sheen
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, -89 + bob);
    ctx.quadraticCurveTo(-6, -95 + bob, 0, -91 + bob);
    ctx.quadraticCurveTo(6, -95 + bob, 14, -89 + bob);
    ctx.stroke();

    // Sculpted Shoulder Spiral Tube Ringlets framing chest!
    drawSpiralTubeEnd(-19 + swX * 0.3, -48 + bob, 7.6);
    drawSpiralTubeEnd(19, -50 + bob, 7.2);

    // Delicate nose curve
    ctx.strokeStyle = 'rgba(190, 24, 93, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(1.8, -77.5 + bob, 1.8, -0.5, 1.4);
    ctx.stroke();

    // 4. Gentle, Warm Motherly Eyes with Curved Eyelashes (Separate paths — zero bridge artifact!)
    if (this.isBlinking && !this.isAttacking) {
      ctx.strokeStyle = '#2d1024';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(-4.2, -81.5 + bob, 3.6, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(5.8, -81.5 + bob, 3.6, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    } else {
      for (const [ex, px, lashDir] of [[-4.2, -3.7, -1], [5.8, 6.2, 1]]) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#2d1024';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(ex, -82 + bob, 3.8, 4.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2d1024';
        ctx.beginPath(); ctx.ellipse(px, -81.6 + bob, 2.5, 3.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(px + 0.8, -83 + bob, 1.35, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px - 0.8, -80.4 + bob, 0.65, 0, Math.PI * 2); ctx.fill();
        // Graceful upturned eyelash flick
        ctx.strokeStyle = '#2d1024';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ex + lashDir * 2.8, -85.2 + bob);
        ctx.lineTo(ex + lashDir * 5.2, -86.6 + bob);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = '#6b1d45';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-8.5, -87.5 + bob); ctx.quadraticCurveTo(-4.2, -89.5 + bob, -0.5, -86.8 + bob);
    ctx.moveTo(1.8, -86.8 + bob); ctx.quadraticCurveTo(5.8, -89.5 + bob, 9.8, -87.5 + bob);
    ctx.stroke();

    // Benevolent Sweet Rose-Pink Lips
    ctx.fillStyle = '#e11d74';
    ctx.beginPath();
    ctx.moveTo(-4.5, -73 + bob);
    ctx.quadraticCurveTo(0.8, -68.5 + bob, 5.5, -73 + bob);
    ctx.quadraticCurveTo(0.8, -71.5 + bob, -4.5, -73 + bob);
    ctx.fill();

    // 5. ROSE'S MASSIVE PINK BROADSWORD & SHIELD CHOREOGRAPHY (Positioned cleanly so gown & star gem shine!)
    const rSw = motion.armSwingF * 10;
    const rSwB = motion.armSwingB * 10;
    let shieldX = -21 + rSwB * 0.45;
    let shieldY = -39 + bob + rSwB * 0.3;
    let swordX = 21 + rSw * 0.5;
    let swordY = -44 + bob + rSw * 0.3;
    let swordAngle = 0.38 + motion.armSwingF * 0.08;

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Sweeping Regal Rose Broadsword Cleave!
        const reach = Math.max(0, strike) * 28;
        swordX = 20 + reach;
        swordY = -48 + bob;
        swordAngle = -1.05 + Math.min(1, animP * 1.35) * 1.85;
      } else if (combo === 1) {
        // Hit 2: Valkyrie Thorny Shield Bash Out Front while Sword Chambers Overhead!
        const bash = Math.max(0, strike) * 38;
        shieldX = -6 + bash;
        shieldY = -46 + bob;
        swordX = 8 - Math.max(0, strike) * 10;
        swordY = -64 + bob;
        swordAngle = -1.25;
      } else if (combo === 2) {
        // Hit 3: Valiant Rising Rose-Petal Cut!
        const reach = Math.max(0, strike) * 32;
        swordX = 22 + reach;
        swordY = -52 + bob - Math.max(0, strike) * 10;
        swordAngle = 1.25 - Math.min(1, animP * 1.3) * 2.45;
      } else {
        // Hit 4: ROSE SANCTUARY SWEEP — Radiant Twin Sword & Shield Spiral Flourish!
        const reach = Math.max(0, strike) * 34;
        swordX = 24 + reach;
        swordY = -44 + bob;
        swordAngle = -0.8 + animP * 3.1;
        shieldX = 10 + reach * 0.4;
        shieldY = -42 + bob;
      }
    } else if (isHeal) {
      swordX = 20;
      swordY = -54 + bob;
      swordAngle = 0.15;
      shieldX = -20;
      shieldY = -52 + bob;
    }

    // Rear Shield Arm + Rose Quartz's Defensive Shield (drawn cleanly at left hip!)
    this.drawArticulatedArm(ctx, -13, -57 + bob, (-13 + shieldX) * 0.5, -49 + bob, shieldX, shieldY, '#fce4ec', '#fce4ec', 7.2, 6.2, '#fce4ec', 4.2);

    // Articulated Sword Arm + Legendary Broadsword
    this.drawArticulatedArm(ctx, 13, -57 + bob, (13 + swordX) * 0.5, -51 + bob, swordX, swordY, '#fce4ec', '#fce4ec', 7.4, 6.4, '#fce4ec', 4.4);

    ctx.save();
    ctx.translate(swordX, swordY);
    ctx.rotate(swordAngle);
    ctx.strokeStyle = '#9d174d';
    ctx.lineWidth = 4.6;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-2, 20);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-2, 22, 4.8, 0, Math.PI * 2);
    ctx.fill();

    this.drawMiniStar(ctx, 0, 0, 9.2);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Sleek Pink Broadsword Blade
    ctx.fillStyle = 'rgba(244, 114, 182, 0.96)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-6.8, 0);
    ctx.lineTo(-6.8, -42);
    ctx.lineTo(0, -54);
    ctx.lineTo(6.8, -42);
    ctx.lineTo(6.8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-1.1, -46, 2.2, 42);
    ctx.restore();

    // Rose Quartz's Defensive Shield (Hidden briefly during [K] Shield Throw flight!)
    if (!(isThrow && animP > 0.25)) {
      ctx.save();
      ctx.translate(shieldX, shieldY);
      const shieldR = 16.5;
      ctx.fillStyle = 'rgba(255, 96, 151, 0.84)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 3.5; a += 0.25) {
        const sr = (a / (Math.PI * 3.5)) * (shieldR - 3.5);
        const sx = Math.cos(a) * sr;
        const sy = Math.sin(a) * sr;
        if (a === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.fillStyle = '#ffd166';
      this.drawMiniStar(ctx, 0, 0, 6);
      ctx.restore();
    }

    if (isHeal) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 207, 232, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -60 + bob, 34 + Math.sin(Date.now() / 80) * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ff6097';
      ctx.beginPath();
      ctx.arc(4, -72 + bob + ((Date.now() / 25) % 18), 3, 0, Math.PI * 2);
      ctx.arc(-4, -72 + bob + (((Date.now() / 25) + 9) % 18), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawMiniStar(ctx, cx, cy, radius) {
    let rot = (Math.PI / 2) * 3;
    const spikes = 5;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * (radius * 0.45), cy + Math.sin(rot) * (radius * 0.45));
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  }

  // --- SHOW-ACCURATE CONNIE MAHESWARAN (SAVE THE LIGHT DESIGN) ---
  drawConnie(ctx, bob, animP = 0, actionType = '') {
    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isSpecial = (actionType === 'throw');
    const isSkill = (actionType === 'skill');

    // Lars/Lion lore: If revived in 2P Arcade Mode, Connie becomes Pink Connie!
    const pinkRev = !!this.isPinkRevived;
    const ink = pinkRev ? '#831843' : '#1c1110';
    const hairMain = pinkRev ? '#f472b6' : '#1e1114';
    const hairSheen = pinkRev ? '#fbcfe8' : '#3f282d';
    const skinMain = pinkRev ? '#f9a8d4' : '#8d4e31';
    const skinShade = pinkRev ? '#ec4899' : '#6c3820';
    const faceDarkShade = pinkRev ? '#db2777' : '#733b22';
    const irisColor = pinkRev ? '#831843' : '#1c1110';

    if (pinkRev) {
      ctx.save();
      const auraGrad = ctx.createRadialGradient(0, -45 + bob, 6, 0, -45 + bob, 42);
      auraGrad.addColorStop(0, 'rgba(244, 114, 182, 0.34)');
      auraGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -45 + bob, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 0. LUSH FLOWING ESPRESSO / PINK WAVY HAIR WITH CRISP INK OUTLINE (Connie.jpeg!)
    const swX = hair.swayX * 0.85;
    const swY = hair.swayY * 0.5;
    ctx.fillStyle = hairMain;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(2, -91 + bob);
    ctx.bezierCurveTo(-18, -92 + bob, -27 + swX * 0.5, -75 + bob, -23 + swX * 0.7, -57 + bob + swY * 0.5);
    ctx.bezierCurveTo(-31 + swX, -46 + bob + swY, -28 + swX * 1.1, -35 + bob + swY, -16 + swX, -37 + bob + swY);
    ctx.quadraticCurveTo(-8 + swX * 0.6, -42 + bob, 14, -46 + bob);
    ctx.bezierCurveTo(21, -54 + bob, 20, -76 + bob, 13, -87 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wave sheen ribbon inside hair
    ctx.strokeStyle = hairSheen;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -82 + bob);
    ctx.bezierCurveTo(-19 + swX * 0.4, -70 + bob, -14 + swX * 0.7, -56 + bob, -20 + swX, -44 + bob + swY);
    ctx.stroke();

    // 1. Cuffed Slate-Grey Denim Shorts, Tapered Legs & Coral Sneakers
    const drawConnieLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -26 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 10, 5.2, 4.6, darken ? '#475569' : '#64748b', '#334155', 1);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.ellipse(0, 10.5, 5.0, 2.0, 0, 0, Math.PI * 2); ctx.fill();
      this.drawCelTaperedLimb(ctx, 0, 11.5, 0, 19.5, 3.8, 3.2, skinMain, skinShade, 1);
      this.drawCelBoot(ctx, 0.5, 24.5, 9.0, 5.4, '#fb7185', '#ffffff', '#ffffff');
      ctx.restore();
    };
    drawConnieLeg(-6 + legs.backX, legs.backY, legs.backRot, true);
    drawConnieLeg(6 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Bare Arm (Sleeveless white shirt ref + continuous fencing sway!)
    if (isPunch && combo === 0) {
      const poise = Math.max(0, strike) * 6;
      this.drawArticulatedArm(ctx, -10, -54 + bob, -19 - poise * 0.5, -58 + bob, -26 - poise, -65 + bob, skinMain, skinMain, 6.5, 5.5, skinMain, 3.8);
    } else if (!isPunch && !isSpecial && !isSkill) {
      const armSwing = motion.armSwingB * 12;
      this.drawArticulatedArm(ctx, -10, -54 + bob, -15 - armSwing * 0.5, -44 + bob, -13 - armSwing, -34 + bob, skinMain, skinMain, 6.2, 5.2, skinMain, 3.6);
    }

    // 3. Tailored Save-the-Light / Future Connie Outfit: Fitted Collared Top + Teal Adventure Vest + Slate Shorts!
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-10.5, -57 + bob);
    ctx.quadraticCurveTo(0, -59 + bob, 10.5, -57 + bob);
    ctx.quadraticCurveTo(12.2, -43 + bob, 10.2, -29 + bob);
    ctx.lineTo(-10.2, -29 + bob);
    ctx.quadraticCurveTo(-12.2, -43 + bob, -10.5, -57 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Subtle left cel fabric shading & tailored teal collar scarf/vest trim
    ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.beginPath();
    ctx.moveTo(-10.5, -56 + bob); ctx.lineTo(-4, -56 + bob); ctx.lineTo(-4.5, -30 + bob); ctx.lineTo(-10, -30 + bob);
    ctx.closePath();
    ctx.fill();
    // Crisp pointed shirt collar + two neat buttons
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-6, -57 + bob); ctx.lineTo(-2.2, -51 + bob); ctx.lineTo(0, -54.5 + bob);
    ctx.lineTo(2.2, -51 + bob); ctx.lineTo(6, -57 + bob);
    ctx.stroke();
    ctx.fillStyle = '#0d9488';
    ctx.beginPath(); ctx.arc(0.5, -47 + bob, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0.5, -42 + bob, 1.3, 0, Math.PI * 2); ctx.fill();
    // Fitted slate-grey denim shorts waistband
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-10.8, -31 + bob, 21.6, 8, 2.5);
    ctx.fill();
    ctx.stroke();

    // 4. Tapered Neck & Sculpted Cel Face with Warm Shading & Crisp Ink Outline!
    this.drawCelTaperedLimb(ctx, 0, -57 + bob, 0, -66 + bob, 3.6, 3.2, skinMain, skinShade, 1);
    ctx.fillStyle = skinMain;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0.4, -74 + bob, 12.6, 13.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(69, 26, 3, 0.22)';
    ctx.beginPath(); ctx.ellipse(-4.5, -69 + bob, 11, 10, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pinkRev ? 'rgba(255, 255, 255, 0.25)' : 'rgba(244, 114, 182, 0.24)';
    ctx.beginPath(); ctx.ellipse(-5.5, -70 + bob, 2.8, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7.2, -70 + bob, 2.6, 1.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(0.4, -74 + bob, 12.6, 13.6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Sculpted Wavy Crown Hairline & Cheek-Framing S-Wave Tendrils!
    ctx.fillStyle = hairMain;
    ctx.beginPath();
    ctx.moveTo(-13.8, -77 + bob);
    ctx.quadraticCurveTo(-13, -91 + bob, 0, -91 + bob);
    ctx.quadraticCurveTo(13, -91 + bob, 13.8, -78 + bob);
    ctx.bezierCurveTo(17.5, -71 + bob, 15.5, -61 + bob, 17.5, -54 + bob);
    ctx.quadraticCurveTo(12.5, -57 + bob, 11.8, -73 + bob);
    ctx.quadraticCurveTo(5, -83.5 + bob, -2, -81.5 + bob);
    ctx.quadraticCurveTo(-8, -83.5 + bob, -11.8, -75 + bob);
    ctx.quadraticCurveTo(-11.8, -62 + bob, -15.8 + swX * 0.25, -52 + bob);
    ctx.bezierCurveTo(-18.5, -60 + bob, -16.8, -70 + bob, -13.8, -77 + bob);
    ctx.closePath();
    ctx.fill();

    // 5. Iconic Connie Turquoise Adventure Headband + Hair Highlight!
    ctx.strokeStyle = pinkRev ? '#f9a8d4' : '#14b8a6';
    ctx.lineWidth = 3.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -76 + bob, 13.2, Math.PI * 1.16, Math.PI * 1.84);
    ctx.stroke();
    ctx.strokeStyle = hairSheen;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -79.5 + bob, 12.2, Math.PI * 1.24, Math.PI * 1.76);
    ctx.stroke();

    // Subtle sculpted nose
    ctx.strokeStyle = faceDarkShade;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(1.8, -71.2 + bob, 1.5, -0.4, 1.3);
    ctx.stroke();

    // 6. Clean Expressive Knight Eyes (Separate paths — completely fixes the white line glitch!)
    if (this.isBlinking && !this.isAttacking) {
      ctx.strokeStyle = irisColor;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(-3.6, -74.5 + bob, 3.4, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(5.2, -74.5 + bob, 3.4, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    } else {
      for (const [ex, px, lashDir] of [[-3.6, -3.1, -1], [5.2, 5.6, 1]]) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(ex, -75 + bob, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = irisColor;
        ctx.beginPath(); ctx.ellipse(px, -74.6 + bob, 2.3, 3.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(px + 0.8, -76 + bob, 1.25, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px - 0.8, -73.4 + bob, 0.6, 0, Math.PI * 2); ctx.fill();
        // Crisp expressive eyelash
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ex + lashDir * 2.5, -78 + bob);
        ctx.lineTo(ex + lashDir * 4.5, -79.2 + bob);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = irisColor;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(-8, -82.5 + bob); ctx.lineTo(-1, -80.2 + bob);
      ctx.moveTo(2.2, -80.2 + bob); ctx.lineTo(9.5, -82.5 + bob);
    } else {
      ctx.moveTo(-7.5, -81.5 + bob); ctx.quadraticCurveTo(-3.6, -83.8 + bob, -0.5, -81.5 + bob);
      ctx.moveTo(2.2, -81.5 + bob); ctx.quadraticCurveTo(5.6, -83.8 + bob, 9.2, -81.5 + bob);
    }
    ctx.stroke();

    // Confident Open Warrior Smile
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-4.5, -67 + bob);
    ctx.quadraticCurveTo(0.8, -65.2 + bob, 5.8, -67 + bob);
    ctx.quadraticCurveTo(0.8, -60.2 + bob, -4.5, -67 + bob);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-4, -66.8 + bob);
    ctx.lineTo(5.2, -66.8 + bob);
    ctx.quadraticCurveTo(0.8, -64.2 + bob, -4, -66.8 + bob);
    ctx.fill();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#f472b6';
      this.drawMiniStar(ctx, 0, -85 + bob, 5.5);
    }

    // 7. PEARL'S DISCIPLE SWORDSMANSHIP CHOREOGRAPHY (Distinct 4-Hit Iaido Style!)
    let swordX = 18;
    let swordY = -43 + bob;
    let swordAngle = 0.36;

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Instant Iaido Quick-Draw Thrust!
        const reach = strike * 36;
        swordX = 18 + reach;
        swordY = -48 + bob;
        swordAngle = Math.PI * 0.48;
        this.drawArticulatedArm(ctx, 9, -54 + bob, 14 + reach * 0.45, -51 + bob, swordX, swordY, skinMain, skinMain, 6.4, 5.4, skinMain, 4.0);
      } else if (combo === 1) {
        // Hit 2: Rising Two-Handed Diagonal Cross-Cut!
        const reach = Math.max(0, strike) * 28;
        swordX = 18 + reach;
        swordY = -50 + bob - Math.max(0, strike) * 6;
        swordAngle = 2.35 - Math.min(1, animP * 1.35) * 2.15;
        this.drawArticulatedArm(ctx, -6, -54 + bob, 6, -51 + bob, swordX - 3, swordY + 2, skinMain, skinMain, 6.0, 5.0);
        this.drawArticulatedArm(ctx, 9, -54 + bob, 14, -52 + bob, swordX, swordY, skinMain, skinMain, 6.4, 5.4, skinMain, 4.0);
      } else if (combo === 2) {
        // Hit 3: Acrobatic Vaulting Crescent Slash!
        const reach = Math.max(0, strike) * 32;
        swordX = 19 + reach;
        swordY = -54 + bob - Math.sin(animP * Math.PI) * 14;
        swordAngle = -1.1 + animP * 3.4;
        this.drawArticulatedArm(ctx, 9, -54 + bob, 15, -53 + bob, swordX, swordY, skinMain, skinMain, 6.4, 5.4, skinMain, 4.0);
      } else {
        // Hit 4: Two-Handed Helm-Splitter Overhead Cleave!
        const reach = Math.max(0, strike) * 34;
        swordX = 20 + reach;
        swordY = animP < 0.34 ? (-66 + bob) : (-42 + bob);
        swordAngle = -0.65 + Math.min(1, animP * 1.35) * 2.85;
        this.drawArticulatedArm(ctx, -6, -54 + bob, 6, swordY - 6, swordX - 2, swordY, skinMain, skinMain, 6.0, 5.0);
        this.drawArticulatedArm(ctx, 9, -54 + bob, 14, swordY - 4, swordX, swordY, skinMain, skinMain, 6.4, 5.4, skinMain, 4.0);
      }
    } else if (isSpecial) {
      // Sworn Iai-Lunge: Low aerodynamic dash-slash!
      const reach = Math.max(0, strike) * 28;
      swordX = 22 + reach;
      swordY = -46 + bob;
      swordAngle = 1.62;
      this.drawArticulatedArm(ctx, 9, -54 + bob, 16, -49 + bob, swordX, swordY, skinMain, skinMain, 6.4, 5.4, skinMain, 4.0);
    } else if (isSkill) {
      // Tactical Parry Counter-Guard Pose!
      swordX = 24;
      swordY = -44 + bob;
      swordAngle = 1.85;
      this.drawArticulatedArm(ctx, 9, -54 + bob, 16, -48 + bob, swordX, swordY, skinMain, skinMain, 6.4, 5.4, skinMain, 4.0);
    } else {
      const cSw = motion.armSwingF * 10;
      swordX = 18 + cSw * 0.45;
      swordY = -43 + bob + cSw * 0.28;
      swordAngle = 0.38 + motion.armSwingF * 0.08;
      this.drawArticulatedArm(ctx, 9, -54 + bob, 14 + cSw * 0.25, -48 + bob, swordX, swordY, skinMain, skinMain, 6.2, 5.2, skinMain, 3.8);
      // Signature Pink Glow-Bracelet on Connie's wrist!
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(swordX - 1.5, swordY - 1.5, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawConnieSword(ctx, swordX, swordY, swordAngle, isSkill);
  }

  drawConnieSword(ctx, swordX, swordY, swordAngle = 0.2, isSkill = false) {
    ctx.save();
    ctx.translate(swordX, swordY);
    ctx.rotate(swordAngle);

    // --- FULL-SIZED CANONICAL ROSE'S BROADSWORD (Forged by Bismuth) ---
    ctx.strokeStyle = '#9d174d';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-2, 18);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-2, 20, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let pet = 0; pet < 5; pet++) {
      const pa = (Math.PI * 2 / 5) * pet - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(pa) * 6, Math.sin(pa) * 6, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    const bladeLen = this.isPinkOverdrive ? 66 : 52;
    const halfW = this.isPinkOverdrive ? 8.5 : 7.5;

    ctx.fillStyle = 'rgba(244, 114, 182, 0.96)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.lineTo(-halfW, -bladeLen + 10);
    ctx.lineTo(0, -bladeLen);
    ctx.lineTo(halfW, -bladeLen + 10);
    ctx.lineTo(halfW, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#db2777';
    ctx.fillRect(-1.5, -bladeLen + 14, 3, bladeLen - 16);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-0.8, -bladeLen + 12, 1.6, bladeLen - 18);

    if (isSkill || this.isPinkOverdrive) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- SHOW-ACCURATE JASPER (SUPREME BETA QUARTZ JUGGERNAUT) ---
  drawJasper(ctx, bob, animP = 0, actionType = '') {
    if (this.isSpinDashing) {
      this.drawJasperSpinDash(ctx);
      return;
    }

    const motion = this.getCharacterMotionState();
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');

    // 0. MASSIVE, WILD, FLOWING WAVY PALE PEACH-CREAM LION'S MANE (BACK CASCADE — ZERO CIRCLES!)
    const swX = hair.swayX * 0.9;
    const swY = hair.swayY * 0.55;
    // Warm amber-peach under-mane shadow waves (#fdba74)
    ctx.fillStyle = '#fdba74';
    ctx.beginPath();
    ctx.moveTo(4, -112 + bob);
    ctx.bezierCurveTo(-24, -114 + bob, -40 + swX * 0.5, -90 + bob, -34 + swX * 0.7, -68 + bob + swY * 0.4);
    ctx.bezierCurveTo(-44 + swX, -52 + bob + swY, -40 + swX * 1.15, -30 + bob + swY, -28 + swX * 1.2, -18 + bob + swY);
    ctx.quadraticCurveTo(-18 + swX, -26 + bob + swY, -16 + swX * 0.8, -36 + bob + swY);
    ctx.quadraticCurveTo(-8 + swX * 0.6, -20 + bob + swY, 2 + swX * 0.4, -26 + bob + swY);
    ctx.bezierCurveTo(22, -46 + bob, 28, -82 + bob, 18, -104 + bob);
    ctx.closePath();
    ctx.fill();

    // Main towering spiky cream-blush Beta Quartz mane with crisp ink outline (Jasper.webp!)
    const ink = '#241210';
    ctx.fillStyle = '#fce7dc';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(6, -116 + bob);
    ctx.bezierCurveTo(-18, -122 + bob, -38 + swX * 0.4, -98 + bob, -31 + swX * 0.6, -76 + bob + swY * 0.4);
    ctx.bezierCurveTo(-42 + swX * 0.85, -60 + bob + swY * 0.7, -38 + swX * 1.1, -38 + bob + swY, -25 + swX * 1.15, -22 + bob + swY);
    ctx.quadraticCurveTo(-16 + swX * 0.9, -30 + bob + swY, -14 + swX * 0.8, -40 + bob + swY * 0.7);
    ctx.quadraticCurveTo(-8 + swX * 0.65, -26 + bob + swY, 0 + swX * 0.45, -24 + bob + swY);
    ctx.quadraticCurveTo(8, -36 + bob, 10, -52 + bob);
    ctx.bezierCurveTo(24, -60 + bob, 29, -88 + bob, 19, -106 + bob);
    ctx.quadraticCurveTo(14, -115 + bob, 6, -116 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 1. Future Jasper: Tapered Dark-Espresso Torn-Knee Pants & Heavy Maroon Boots (Jasper.webp!)
    const drawJasperLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -34 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 23, 7.8, 5.8, darken ? '#1f1212' : '#2b1a19', '#140a0a', 1);
      // Iconic jagged orange torn-knee cutout!
      ctx.fillStyle = '#f59e42';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-4, 10); ctx.lineTo(4.5, 9); ctx.lineTo(3, 13.5); ctx.lineTo(-3, 12.5);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      this.drawCelBoot(ctx, 0.5, 33, 12.5, 9.0, '#7f2424', '#3b1212', '#992b2b');
      ctx.restore();
    };
    drawJasperLeg(-9 + legs.backX, legs.backY, legs.backRot, true);
    drawJasperLeg(8 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Muscular Arm w/ Crimson Stripe & Teal Corruption Patch (Jasper.webp!)
    if (!(isPunch && combo === 1)) {
      const chamber = (isPunch && (combo === 0 || combo === 2)) ? Math.max(0, strike) * 8 : motion.armSwingB * 14;
      this.drawArticulatedArm(ctx, -18, -68 + bob, -26 - chamber * 0.5, -56 + bob, -22 - chamber, -44 + bob, '#f59e42', '#dc2626', 12, 10.5, '#f59e42', 7);
      ctx.fillStyle = '#14b8a6';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(-21 - chamber * 0.25, -62 + bob, 4.8, 3.2, -0.3, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }

    // 3. Muscular V-Tapered Homeworld Quartz Warrior Bodysuit + Yellow Diamond Crest (Show-Accurate Jasper!)
    ctx.fillStyle = '#3b1518';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-16, -48 + bob);
    ctx.quadraticCurveTo(0, -45 + bob, 16, -48 + bob);
    ctx.quadraticCurveTo(18.5, -38 + bob, 16.5, -29 + bob);
    ctx.quadraticCurveTo(0, -26 + bob, -16.5, -29 + bob);
    ctx.quadraticCurveTo(-18.5, -38 + bob, -16, -48 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sculpted Broad-Shouldered Crimson/Maroon Homeworld Quartz Tunic!
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(-21, -73 + bob);
    ctx.quadraticCurveTo(-12, -77 + bob, -7, -73 + bob);
    ctx.lineTo(0, -64 + bob);
    ctx.lineTo(7, -73 + bob);
    ctx.quadraticCurveTo(12, -77 + bob, 21, -73 + bob);
    ctx.quadraticCurveTo(22, -59 + bob, 16, -47 + bob);
    ctx.lineTo(-16, -47 + bob);
    ctx.quadraticCurveTo(-22, -59 + bob, -21, -73 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Warm terracotta V-armor chevrons & Yellow Diamond Chest Insignia
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-19, -71 + bob); ctx.lineTo(0, -56 + bob); ctx.lineTo(19, -71 + bob);
    ctx.lineTo(17, -58 + bob); ctx.lineTo(0, -49 + bob); ctx.lineTo(-17, -58 + bob);
    ctx.closePath();
    ctx.fill();
    // Glowing Yellow Diamond emblem on chest
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, -62 + bob); ctx.lineTo(5.5, -55 + bob); ctx.lineTo(0, -48 + bob); ctx.lineTo(-5.5, -55 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Muscular Neck & Fierce Sculpted Tiger-Striped Quartz Face (No Bug-Eyes!)
    this.drawCelTaperedLimb(ctx, 0, -72 + bob, 0, -82 + bob, 6.4, 5.6, '#f59e42', '#d97706', 1);
    ctx.fillStyle = '#f59e42';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-14.5, -99 + bob);
    ctx.quadraticCurveTo(0, -104 + bob, 14.5, -99 + bob);
    ctx.quadraticCurveTo(16.5, -86 + bob, 11.5, -75 + bob);
    ctx.quadraticCurveTo(0, -71 + bob, -11.5, -75 + bob);
    ctx.quadraticCurveTo(-16.5, -86 + bob, -14.5, -99 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bold Crimson-Red Quartz Tiger-Mask War Stripes across temples & cheeks
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-14.5, -96 + bob); ctx.lineTo(-4, -92.5 + bob); ctx.lineTo(0, -96 + bob); ctx.lineTo(4, -92.5 + bob); ctx.lineTo(14.5, -96 + bob);
    ctx.lineTo(14.2, -88 + bob); ctx.lineTo(6.5, -90 + bob); ctx.lineTo(0, -86 + bob); ctx.lineTo(-6.5, -90 + bob); ctx.lineTo(-14.2, -88 + bob);
    ctx.closePath();
    ctx.fill();
    // Cheek claw war-stripes
    ctx.beginPath();
    ctx.moveTo(-14, -84 + bob); ctx.lineTo(-7, -81.5 + bob); ctx.lineTo(-12.5, -78 + bob); ctx.closePath();
    ctx.moveTo(14, -84 + bob); ctx.lineTo(7, -81.5 + bob); ctx.lineTo(12.5, -78 + bob); ctx.closePath();
    ctx.fill();

    // Swept-Back Wild Lion's Mane Bangs Framing Her Forehead + Widow's Peak
    ctx.fillStyle = '#fce7dc';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -104 + bob);
    ctx.quadraticCurveTo(-11, -108 + bob, -17.5, -99 + bob);
    ctx.quadraticCurveTo(-20, -86 + bob, -15, -75 + bob);
    ctx.lineTo(-12.5, -93 + bob);
    ctx.lineTo(-4, -97 + bob);
    ctx.lineTo(0, -94 + bob);
    ctx.lineTo(4, -97 + bob);
    ctx.lineTo(12.5, -93 + bob);
    ctx.lineTo(15, -75 + bob);
    ctx.quadraticCurveTo(20, -86 + bob, 17.5, -99 + bob);
    ctx.quadraticCurveTo(11, -108 + bob, 0, -104 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle Sleek Future-Jasper Teal Corruption Scar-Horns tucked cleanly along brow crest
    ctx.fillStyle = '#0d9488';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.2;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 6, -101 + bob);
      ctx.lineTo(sgn * 10.5, -106 + bob);
      ctx.lineTo(sgn * 11, -99 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // FIERCE NARROWED PREDATOR GOLDEN-AMBER EYES (No round surprised eyes!)
    for (const sgn of [-1, 1]) {
      const ex = sgn * 6.2;
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(ex - sgn * 4.2, -91.5 + bob);
      ctx.lineTo(ex + sgn * 3.8, -94.2 + bob);
      ctx.lineTo(ex + sgn * 3.0, -89.2 + bob);
      ctx.lineTo(ex - sgn * 3.2, -88.8 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Sharp vertical predator iris & slit pupil
      ctx.fillStyle = '#ea580c';
      ctx.beginPath(); ctx.ellipse(ex + sgn * 0.4, -91.2 + bob, 1.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#290707';
      ctx.beginPath(); ctx.ellipse(ex + sgn * 0.4, -91.2 + bob, 0.9, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Heavy Aggressive Quartz Brow Ridge
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-11.5, -96.8 + bob); ctx.lineTo(-2.0, -93.2 + bob);
    ctx.moveTo(2.0, -93.2 + bob); ctx.lineTo(11.5, -96.8 + bob);
    ctx.stroke();

    // Iconic Faceted Amber Diamond Gemstone ON NOSE
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0.2, -90.5 + bob);
    ctx.lineTo(4.6, -85.2 + bob);
    ctx.lineTo(0.2, -80.2 + bob);
    ctx.lineTo(-4.2, -85.2 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Gem top facet glint
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(0.2, -89.5 + bob); ctx.lineTo(2.4, -85.5 + bob); ctx.lineTo(0.2, -84.2 + bob); ctx.lineTo(-2.0, -85.5 + bob);
    ctx.closePath();
    ctx.fill();

    // Fierce Smirking Warrior Grin
    ctx.fillStyle = '#450a0a';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-6.2, -77.5 + bob);
    ctx.quadraticCurveTo(0, -76.5 + bob, 7.2, -79.2 + bob);
    ctx.lineTo(5.8, -74.2 + bob);
    ctx.quadraticCurveTo(0, -73 + bob, -5.5, -74.5 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-5.2, -77.2 + bob); ctx.lineTo(6.2, -78.6 + bob); ctx.lineTo(5.2, -75.5 + bob); ctx.lineTo(-4.8, -75.5 + bob);
    ctx.closePath();
    ctx.fill();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#ea580c';
      this.drawMiniStar(ctx, 0, -118 + bob, 7);
    }

    // 5. SUPREME BETA QUARTZ BRAWLER ARMS & CRASH HELMET CHOREOGRAPHY (Distinct 4-Hit Juggernaut Style!)
    if (isThrow) {
      // [K] Crash Helmet Bull-Rush: Braced Battering-Ram Arms + Iconic Horned Bronze/Amber Crash Helmet!
      this.drawArticulatedArm(ctx, 16, -66 + bob, 10, -54 + bob, 20, -56 + bob, '#f59e42', '#b91c1c', 12.5, 11, '#ea580c', 8);
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(2, -92 + bob, 22, -Math.PI * 0.85, Math.PI * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Glowing translucent orange visor Hammer-Horn protruding forward!
      ctx.fillStyle = 'rgba(249, 115, 22, 0.92)';
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, -104 + bob);
      ctx.lineTo(44, -92 + bob);
      ctx.lineTo(39, -79 + bob);
      ctx.lineTo(12, -82 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (isPunch) {
      if (combo === 0) {
        // Hit 1: Crushing Beta Haymaker Straight!
        const reach = strike * 36;
        const fx = 24 + reach;
        const fy = -55 + bob;
        this.drawArticulatedArm(ctx, 16, -66 + bob, 19 + reach * 0.45, -60 + bob, fx, fy, '#f59e42', '#b91c1c', 13, 11.5, '#ea580c', 10);
        if (strike > 0.15) {
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, fx + 10, fy, 7.5);
        }
      } else if (combo === 1) {
        // Hit 2: Brutal Armored Shoulder Ram Tackle!
        const ram = Math.max(0, strike) * 24;
        this.drawArticulatedArm(ctx, 16, -66 + bob, 24 + ram, -62 + bob, 16 + ram, -48 + bob, '#f59e42', '#b91c1c', 14, 11.5, '#ea580c', 9.5);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';
        ctx.beginPath(); ctx.arc(26 + ram, -60 + bob, 16, -Math.PI * 0.5, Math.PI * 0.5); ctx.fill();
      } else if (combo === 2) {
        // Hit 3: Horned Crash-Helmet Uppercut!
        const reach = Math.max(0, strike) * 30;
        const fy = -64 + bob - reach * 0.9;
        this.drawArticulatedArm(ctx, 16, -66 + bob, 20 + reach * 0.3, -62 + bob - reach * 0.4, 24 + reach * 0.5, fy, '#f59e42', '#b91c1c', 13, 11.5, '#ea580c', 10.5);
        // Flash of Crash Helmet horn on uppercut!
        ctx.fillStyle = 'rgba(249, 115, 22, 0.88)';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(8, -104 + bob); ctx.lineTo(30, -112 + bob); ctx.lineTo(24, -92 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        // Hit 4: SEISMIC HELMET CRASH — Two-Handed Overhead Meteor Double-Slam!
        const reach = Math.max(0, strike) * 34;
        const sy = animP < 0.32 ? (-104 + bob) : (-104 + bob + Math.min(1, (animP - 0.32) / 0.30) * 72);
        this.drawArticulatedArm(ctx, -14, -68 + bob, 2 + reach * 0.4, sy - 8, 18 + reach, sy, '#f59e42', '#b91c1c', 12.5, 11, '#ea580c', 10);
        this.drawArticulatedArm(ctx, 16, -68 + bob, 12 + reach * 0.45, sy - 6, 26 + reach, sy + 2, '#f59e42', '#b91c1c', 13.5, 12, '#ea580c', 11);
        ctx.fillStyle = '#fde047';
        this.drawDiamondInsignia(ctx, 28 + reach, sy + 2, 10);
      }
    } else {
      // Idle Muscular Tiger-Striped Right Arm w/ subtle teal scar + continuous sway
      const armSwing = motion.armSwingF * 13;
      this.drawArticulatedArm(ctx, 17, -68 + bob, 23 + armSwing * 0.4, -56 + bob, 21 + armSwing, -44 + bob, '#f59e42', '#b91c1c', 12.2, 10.8, '#ea580c', 7.2);
      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.ellipse(20 + armSwing * 0.2, -62 + bob, 3.6, 2.2, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Authentic Lore: Jasper's Flaming Spiky Quartz Spin Dash
  drawJasperSpinDash(ctx) {
    ctx.save();
    const rot = (Date.now() / 22) * this.facing;
    const r = 28;

    // 1. Motion blur trails with orange flame
    for (let t = 1; t <= 3; t++) {
      ctx.save();
      ctx.globalAlpha = 0.30 / t;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-t * 14, -24, r - t * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Fiery ground sparks & smoke
    ctx.fillStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.beginPath();
    ctx.arc(-22, -8, 10, 0, Math.PI * 2);
    ctx.arc(-32, -10, 7, 0, Math.PI * 2);
    ctx.fill();

    // 3. Spiked Buzzsaw Outer Perimeter (Heavy Bronze & Amber Spikes)
    ctx.translate(0, -24);
    ctx.rotate(rot);

    const spikes = 10;
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
      const a = (i * Math.PI * 2) / spikes;
      const x1 = Math.cos(a) * (r + 9);
      const y1 = Math.sin(a) * (r + 9);
      const aMid = a + Math.PI / spikes;
      const x2 = Math.cos(aMid) * (r - 2);
      const y2 = Math.sin(aMid) * (r - 2);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();

    // 4. Inner glowing amber/flame quartz core
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    coreGrad.addColorStop(0, '#fef08a');
    coreGrad.addColorStop(0.4, '#ea580c');
    coreGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Faceted crystal star lines
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }

    ctx.restore();
  }

  drawDiamondInsignia(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx + radius * 0.7, cy);
    ctx.lineTo(cx, cy + radius);
    ctx.lineTo(cx - radius * 0.7, cy);
    ctx.closePath();
    ctx.fill();
  }

  drawDodgeVisuals(ctx, bob) {
    const c = this.activeChar;
    const time = Date.now();
    ctx.save();

    if (c === 'steven') {
      // Crystalline Pink Diamond Bubble Barrier & Fluttering Rose Petals
      const pulse = Math.sin(time / 60) * 3;
      ctx.strokeStyle = 'rgba(255, 105, 180, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -36 + bob, 32 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 192, 203, 0.35)';
      ctx.fill();
      // Floating Pink Star Facet
      ctx.fillStyle = '#ff6097';
      this.drawMiniStar(ctx, -this.dodgeDirection * 20, -36 + bob, 7);
    } else if (c === 'garnet') {
      // Boxer Dual Weave Trail: Ruby Fire & Sapphire Frost Speed Shadows
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, -32 + bob, 22, 28, 0, 0, Math.PI * 2);
      else ctx.arc(0, -32 + bob, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, -30 + bob, 18, 24, 0, 0, Math.PI * 2);
      else ctx.arc(0, -30 + bob, 20, 0, Math.PI * 2);
      ctx.stroke();
      // Lightning Sparks
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-this.dodgeDirection * 15, -45 + bob);
      ctx.lineTo(-this.dodgeDirection * 30, -35 + bob);
      ctx.lineTo(-this.dodgeDirection * 22, -25 + bob);
      ctx.lineTo(-this.dodgeDirection * 38, -15 + bob);
      ctx.stroke();
    } else if (c === 'amethyst') {
      // Agile Violet Buzzsaw Spin Ring & Electric Crackles
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, -28 + bob, 30, 0, Math.PI * 1.6);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      this.drawMiniStar(ctx, -this.dodgeDirection * 22, -28 + bob, 6);
      // Electric sparks
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -28 + bob, 36, Math.PI * 0.2, Math.PI * 0.9);
      ctx.stroke();
    } else if (c === 'pearl') {
      // Graceful Ballet Holographic Leap & Cyan Ribbon Trails
      ctx.strokeStyle = 'rgba(103, 232, 249, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, -45 + bob, 20, 42, 0.25, 0, Math.PI * 2);
      else ctx.arc(0, -45 + bob, 30, 0, Math.PI * 2);
      ctx.stroke();
      // Flowing silk sash ribbons
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-this.dodgeDirection * 12, -45 + bob);
      ctx.quadraticCurveTo(-this.dodgeDirection * 28, -35 + bob, -this.dodgeDirection * 40, -50 + bob);
      ctx.stroke();
      ctx.fillStyle = '#a5f3fc';
      this.drawMiniStar(ctx, -this.dodgeDirection * 24, -45 + bob, 5.5);
    } else if (c === 'bismuth') {
      // Molten Forge Heavy Shoulder Skid & Thermal Sparks
      ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.fillRect(-26, -2, 52, 5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-18, -4, 36, 3);
      // Glowing anvil shield ghost
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = 'rgba(234, 88, 12, 0.25)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-22, -62 + bob, 44, 46, 10);
      else ctx.rect(-22, -62 + bob, 44, 46);
      ctx.fill();
      ctx.stroke();
    } else if (c === 'peridot') {
      // Panicked Magnetic Thruster Glide & Floating Scraps
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, 2, 28, 8, 0, 0, Math.PI * 2);
      else ctx.arc(0, 2, 18, 0, Math.PI * 2);
      ctx.stroke();
      // Green magnetic pulse wave
      ctx.strokeStyle = '#a3e635';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, -32 + bob, 22, 26, 0, 0, Math.PI * 2);
      else ctx.arc(0, -32 + bob, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      this.drawMiniStar(ctx, -this.dodgeDirection * 24, -30 + bob, 6);
    } else if (c === 'lapis') {
      // Fluid Hydro-Mist Phase Shimmer & Water Crest Droplets
      ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
      for (let d = -24; d <= 24; d += 8) {
        ctx.beginPath();
        ctx.arc(d, -20 - Math.abs(d) * 0.7 + bob, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -36 + bob, 32, -Math.PI * 0.4, Math.PI * 0.8);
      ctx.stroke();
    } else if (c === 'rose') {
      // Divine Celestial Levitation Glide & Sacred Blooming Petals
      ctx.fillStyle = '#ff6097';
      for (let r = 0; r < 5; r++) {
        const a = (time / 140) + (r * Math.PI * 2 / 5);
        ctx.beginPath();
        if (ctx.ellipse) ctx.ellipse(Math.cos(a) * 32, -42 + Math.sin(a) * 18 + bob, 6, 3.5, a, 0, Math.PI * 2);
        else ctx.arc(Math.cos(a) * 32, -42 + Math.sin(a) * 18 + bob, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(255, 228, 230, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -42 + bob, 38, 0, Math.PI * 2);
      ctx.stroke();
    } else if (c === 'connie') {
      // Pearl's Disciple: Acrobatic Fencing Tumble Roll & Rose Blade Glint
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.95)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, -36 + bob, 25, 36, 0.25, 0, Math.PI * 2);
      else ctx.arc(0, -36 + bob, 28, 0, Math.PI * 2);
      ctx.stroke();
      // Swift fencing sword gleam
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-this.dodgeDirection * 20, -50 + bob);
      ctx.lineTo(this.dodgeDirection * 35, -25 + bob);
      ctx.stroke();
      ctx.fillStyle = '#fbcfe8';
      this.drawMiniStar(ctx, this.dodgeDirection * 30, -25 + bob, 6.5);
    } else if (c === 'jasper') {
      // Supreme Beta Quartz Ram: Armored Shoulder Tackle & Fiery Shockwave
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(234, 88, 12, 0.35)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-24, -68 + bob, 48, 52, 12);
      else ctx.rect(-24, -68 + bob, 48, 52);
      ctx.fill();
      ctx.stroke();
      // Fiery ground friction sparks
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-30, -3, 60, 5);
      ctx.fillStyle = '#ef4444';
      this.drawDiamondInsignia(ctx, this.dodgeDirection * 26, -50 + bob, 7);
    }

    ctx.restore();
  }

  // ==========================================================================
  // CANONICAL GEM FUSION DRAWING ENGINE (OFFICIAL STEVEN UNIVERSE SHOW LORE)
  // ==========================================================================
  drawFallenHero(ctx) {
    ctx.save();
    const isHumanoid = (this.activeChar === 'steven' || this.activeChar === 'connie');

    if (isHumanoid) {
      // -------------------------------------------------------------
      // HUMAN / HALF-HUMAN KNOCKOUT: LIE DOWN FLAT ON THE FLOOR
      // -------------------------------------------------------------
      const lyingY = this.y - 4;
      const facing = this.facing || 1;

      ctx.save();
      ctx.translate(this.x, lyingY);
      ctx.scale(facing, 1);

      if (this.activeChar === 'steven') {
        // --- STEVEN UNIVERSE LYING DOWN ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stretched legs (jeans)
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.roundRect(-36, -8, 26, 7, 3);
        ctx.fill();

        // Flip-flops
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-38, -6, 5, 5);

        // Torso / Salmon-pink T-shirt
        ctx.fillStyle = '#ff2a6d';
        ctx.beginPath();
        ctx.roundRect(-14, -13, 26, 12, 4);
        ctx.fill();

        // Golden Star on T-shirt
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', -1, -4);

        // Steven's head resting peacefully
        ctx.fillStyle = '#1c1917'; // Curly dark hair back
        ctx.beginPath();
        ctx.arc(20, -11, 13, 0, Math.PI * 2);
        ctx.fill();

        // Head skin
        ctx.fillStyle = '#ffd1b3';
        ctx.beginPath();
        ctx.arc(18, -10, 10, 0, Math.PI * 2);
        ctx.fill();

        // Sleeping closed eyes (⌒ ⌒)
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(15, -10, 2.5, Math.PI, 0, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(21, -10, 2.5, Math.PI, 0, false);
        ctx.stroke();

        // Peaceful mouth
        ctx.beginPath();
        ctx.arc(18, -5, 2, 0, Math.PI, false);
        ctx.stroke();

        // Rose Quartz Shield resting flat on the ground beside him
        ctx.save();
        ctx.translate(-8, -4);
        ctx.fillStyle = 'rgba(244, 114, 182, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 6, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 3, -0.15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

      } else {
        // --- CONNIE MAHESWARAN LYING DOWN ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stretched legs (training pants)
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(-34, -7, 24, 6, 2);
        ctx.fill();

        // Boots
        ctx.fillStyle = '#475569';
        ctx.fillRect(-36, -5, 5, 5);

        // Tunic / training shirt
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.roundRect(-13, -12, 24, 11, 4);
        ctx.fill();

        // Connie's long hair resting on ground (pink if revived as Pink Connie!)
        ctx.fillStyle = this.isPinkRevived ? '#f472b6' : '#0f172a';
        ctx.beginPath();
        ctx.ellipse(18, -8, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Face
        ctx.fillStyle = this.isPinkRevived ? '#f9a8d4' : '#9a3412';
        ctx.beginPath();
        ctx.arc(17, -9, 8.5, 0, Math.PI * 2);
        ctx.fill();

        // Connie's spectacles / glasses
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(13, -12, 4, 4);
        ctx.strokeRect(18, -12, 4, 4);
        ctx.beginPath();
        ctx.moveTo(17, -10);
        ctx.lineTo(18, -10);
        ctx.stroke();

        // Sleeping eyes (⌒ ⌒)
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(15, -9, 1.8, Math.PI, 0, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(20, -9, 1.8, Math.PI, 0, false);
        ctx.stroke();

        // Rose Sword resting flat on the ground
        ctx.save();
        ctx.translate(-4, -3);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(8, 0);
        ctx.stroke();
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-18, -3, 3, 6);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(-22, -1.5, 4, 3);
        ctx.restore();
      }

      ctx.restore(); // restore translation

      // Dizzy cartoon stars orbiting overhead
      const dizzyAngle = this.fallenTimer * 3.5;
      const starColors = ['#fde047', '#38bdf8', '#f472b6'];
      for (let s = 0; s < 3; s++) {
        const a = dizzyAngle + (s * Math.PI * 2 / 3);
        const starX = this.x + Math.cos(a) * 16;
        const starY = lyingY - 26 + Math.sin(a) * 5;
        ctx.fillStyle = starColors[s];
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💫', starX, starY);
      }

      // Overhead Status Badge
      const heroName = (this.activeChar === 'steven') ? 'STEVEN' : 'CONNIE';
      const isArcRev = (this.reviveTimer > 0);
      const isPinkHumanRev = isArcRev && this.activeChar === 'connie';
      if (isArcRev) {
        // Gentle rising aura & final 3-second luminous reformation silhouette (Pink Lion/Lars aura for Connie!)
        const elapsedRev = Math.max(0, (this.reviveTotal || 18) - this.reviveTimer);
        const auraLift = Math.min(1, elapsedRev / 3.5) * 28 + Math.sin(this.fallenTimer * 2.8) * 4;
        const revCol = isPinkHumanRev ? '#f472b6' : '#fda4af';
        const auraR = (this.isReforming ? 42 : 24) + Math.sin(this.fallenTimer * 5) * 4;
        const orbGrad = ctx.createRadialGradient(this.x, lyingY - 12 - auraLift, 4, this.x, lyingY - 12 - auraLift, auraR);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.45, revCol);
        orbGrad.addColorStop(1, 'rgba(244, 114, 182, 0)');
        ctx.save();
        ctx.globalAlpha = this.isReforming ? 0.85 : 0.45;
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(this.x, lyingY - 12 - auraLift, auraR, 0, Math.PI * 2);
        ctx.fill();

        if (this.isReforming) {
          const p = Math.max(0, Math.min(1, this.reformProgress || 0));
          // Vertical rising light column + reforming humanoid silhouette
          const beamGrad = ctx.createLinearGradient(0, this.y - 105, 0, this.y);
          beamGrad.addColorStop(0, 'rgba(255,255,255,0)');
          beamGrad.addColorStop(0.5, revCol);
          beamGrad.addColorStop(1, '#ffffff');
          ctx.globalAlpha = 0.35 + p * 0.45;
          ctx.fillStyle = beamGrad;
          ctx.fillRect(this.x - 24, this.y - 105, 48, 105);

          ctx.globalAlpha = 0.4 + p * 0.55;
          ctx.fillStyle = isPinkHumanRev ? '#fbcfe8' : '#ffffff';
          const hScale = 0.55 + p * 0.45;
          ctx.beginPath();
          ctx.ellipse(this.x, this.y - 34 * hScale, 13 * hScale, 28 * hScale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(this.x, this.y - 68 * hScale, 12 * hScale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = isPinkHumanRev ? '#f472b6' : '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 68, lyingY - 50, 136, 19, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isPinkHumanRev ? '#fbcfe8' : '#fecdd3';
      ctx.font = 'bold 9px "Rubik", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      const badgeMsg = this.isReforming
        ? `🌸 ${isPinkHumanRev ? 'PINK CONNIE' : heroName} IN ${this.reviveTimer.toFixed(1)}s`
        : (isArcRev ? `⏳ ${heroName} REVIVES ${Math.ceil(this.reviveTimer)}s` : `💔 ${heroName} DOWN (0 HP)`);
      ctx.fillText(badgeMsg, this.x, lyingY - 37);

    } else {
      // -------------------------------------------------------------
      // FULL GEM POOFED: GEMSTONE FLOATS UP & REFORMS INTO FORM OVER 3S
      // -------------------------------------------------------------
      const isArcRev = (this.reviveTimer > 0);
      const elapsedRev = isArcRev ? Math.max(0, (this.reviveTotal || 18) - this.reviveTimer) : 0;
      const baseFloat = isArcRev ? (Math.min(1, elapsedRev / 3.2) * 38 + Math.sin(this.fallenTimer * 2.8) * 5) : 0;
      const gemY = this.y - 6 - baseFloat;
      const pulse = 0.85 + Math.sin(this.fallenTimer * 4.0) * 0.15;

      const gemInfo = {
        garnet: { name: 'GARNET', color: '#ef4444', aura: 'rgba(239, 68, 68, 0.45)' },
        amethyst: { name: 'AMETHYST', color: '#a855f7', aura: 'rgba(168, 85, 247, 0.45)' },
        pearl: { name: 'PEARL', color: '#38bdf8', aura: 'rgba(56, 189, 248, 0.45)' },
        bismuth: { name: 'BISMUTH', color: '#f97316', aura: 'rgba(249, 115, 22, 0.45)' },
        peridot: { name: 'PERIDOT', color: '#22c55e', aura: 'rgba(34, 197, 94, 0.45)' },
        lapis: { name: 'LAPIS', color: '#0ea5e9', aura: 'rgba(14, 165, 233, 0.45)' },
        rose: { name: 'ROSE QUARTZ', color: '#f43f5e', aura: 'rgba(244, 63, 94, 0.45)' },
        jasper: { name: 'JASPER', color: '#ea580c', aura: 'rgba(234, 88, 12, 0.45)' }
      }[this.activeChar] || { name: 'GEM', color: '#c084fc', aura: 'rgba(192, 132, 252, 0.45)' };

      const auraGrad = ctx.createRadialGradient(this.x, gemY, 4, this.x, gemY, 26 * pulse);
      auraGrad.addColorStop(0, gemInfo.aura);
      auraGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.ellipse(this.x, gemY, 28 * pulse, 10 * pulse, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(this.x, gemY);

      if (this.activeChar === 'garnet') {
        // Garnet: Twin Gemstones side-by-side (Ruby left, Sapphire right)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.rect(-13, -7, 10, 10);
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-10, -4, 4, 4);

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.moveTo(8, -7);
        ctx.lineTo(13, 3);
        ctx.lineTo(3, 3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.2;
        ctx.stroke();

      } else if (this.activeChar === 'amethyst') {
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, -4);
        ctx.lineTo(8, 4);
        ctx.lineTo(0, 9);
        ctx.lineTo(-8, 4);
        ctx.lineTo(-8, -4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(4, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();

      } else if (this.activeChar === 'pearl') {
        const pearlGrad = ctx.createRadialGradient(-2, -3, 1, 0, 0, 8);
        pearlGrad.addColorStop(0, '#ffffff');
        pearlGrad.addColorStop(0.6, '#e0f2fe');
        pearlGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = pearlGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.4;
        ctx.stroke();

      } else if (this.activeChar === 'bismuth') {
        const colors = ['#f97316', '#a855f7', '#06b6d4', '#10b981'];
        for (let s = 4; s >= 1; s--) {
          ctx.fillStyle = colors[s - 1];
          ctx.fillRect(-s * 2.5, -s * 2.5, s * 5, s * 5);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(-s * 2.5, -s * 2.5, s * 5, s * 5);
        }

      } else if (this.activeChar === 'peridot') {
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, 6);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#bef264';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(4, 3);
        ctx.lineTo(-4, 3);
        ctx.closePath();
        ctx.fill();

      } else if (this.activeChar === 'lapis') {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.quadraticCurveTo(8, -1, 7, 5);
        ctx.quadraticCurveTo(0, 10, -7, 5);
        ctx.quadraticCurveTo(-8, -1, 0, -9);
        ctx.fill();
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(1, 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (this.activeChar === 'rose') {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#fb7185';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', 0, 4);

      } else if (this.activeChar === 'jasper') {
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, 6);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fed7aa';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(0, 6);
        ctx.stroke();
      }

      ctx.restore();

      // 3-Second Luminous Gem Reformation Silhouette & Light Beam (taking form again!)
      if (this.reviveTimer > 0 && this.isReforming) {
        const p = Math.max(0, Math.min(1, this.reformProgress || 0));
        ctx.save();
        const beamW = 36 + p * 18;
        const beamGrad = ctx.createLinearGradient(0, gemY - 68, 0, gemY + 34);
        beamGrad.addColorStop(0, 'rgba(255,255,255,0)');
        beamGrad.addColorStop(0.5, gemInfo.color);
        beamGrad.addColorStop(1, 'rgba(255,255,255,0.85)');
        ctx.globalAlpha = 0.35 + p * 0.45;
        ctx.fillStyle = beamGrad;
        ctx.fillRect(this.x - beamW / 2, gemY - 66, beamW, 100);

        // Glowing hard-light body silhouette materializing around the floating gem
        const s = 0.45 + p * 0.55;
        ctx.globalAlpha = 0.45 + p * 0.52;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = gemInfo.color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.ellipse(this.x, gemY + 4, 15 * s, 30 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, gemY - 32 * s, 12.5 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const sparkY = gemY - 14 - ((this.fallenTimer * 18) % 18);
      ctx.fillStyle = gemInfo.color;
      ctx.beginPath();
      ctx.arc(this.x + Math.sin(this.fallenTimer * 5) * 6, sparkY, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = gemInfo.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 74, gemY - 46, 148, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Rubik", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💎 ${gemInfo.name} POOFED`, this.x, gemY - 34);
      ctx.fillStyle = this.isReforming ? '#fde047' : '#94a3b8';
      ctx.font = 'bold 7.5px "Rubik", "Outfit", sans-serif';
      const subTxt = this.isReforming
        ? `REFORMING IN ${this.reviveTimer.toFixed(1)}s`
        : (this.reviveTimer > 0 ? `Gem Floating · ${Math.ceil(this.reviveTimer)}s` : '(Revives Next Stage)');
      ctx.fillText(subTxt, this.x, gemY - 26);
    }

    ctx.restore();
  }

  drawFusionHero(ctx) {
    const fusion = this.fusionData;
    if (!fusion) return;

    let actionLunge = 0;
    let actionLiftY = 0;
    let actionTorsoTilt = 0;
    let actionScaleX = 1;
    let actionScaleY = 1;
    let animP = 0;

    if (this.actionTimer > 0 && this.actionDuration > 0) {
      animP = Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration)));
      const strike = this.getStrikeCurve(animP);
      const posStrike = Math.max(0, strike);
      const combo = this.attackCombo || 0;
      if (this.actionType === 'punch') {
        if (combo === 0) {
          actionLunge = strike * 26;
          actionLiftY = -posStrike * 4;
          actionTorsoTilt = strike * 0.15;
          actionScaleX = 1 + posStrike * 0.06;
          actionScaleY = 1 - posStrike * 0.04;
        } else if (combo === 1) {
          actionLunge = strike * 24;
          actionLiftY = posStrike * 5;
          actionTorsoTilt = -strike * 0.16;
          actionScaleX = 1 + posStrike * 0.06;
        } else if (combo === 2) {
          actionLunge = strike * 26;
          actionLiftY = -posStrike * 14;
          actionTorsoTilt = -posStrike * 0.14;
          actionScaleY = 1 + posStrike * 0.06;
        } else {
          actionLunge = strike * 34;
          if (animP < 0.38) {
            const leap = Math.sin((animP / 0.38) * (Math.PI / 2));
            actionLiftY = -20 * leap;
            actionTorsoTilt = -0.20 * leap;
            actionScaleY = 1 + 0.07 * leap;
          } else {
            const slam = Math.sin(((animP - 0.38) / 0.62) * Math.PI);
            actionLiftY = 10 * slam;
            actionTorsoTilt = 0.24 * slam;
            actionScaleX = 1 + 0.08 * slam;
            actionScaleY = 1 - 0.06 * slam;
          }
        }
      } else if (this.actionType === 'throw') {
        const bowBackstep = (fusion.id === 'opal') ? -14 * posStrike : 22 * strike;
        actionLunge = bowBackstep;
        actionTorsoTilt = (fusion.id === 'opal') ? -posStrike * 0.09 : strike * 0.14;
        actionScaleX = 1 + posStrike * 0.05;
        actionScaleY = 1 - posStrike * 0.03;
      } else if (this.actionType === 'skill') {
        const pulse = Math.sin(animP * Math.PI);
        actionLiftY = -pulse * 18;
        actionTorsoTilt = -pulse * 0.12;
        actionScaleX = 1 - pulse * 0.04;
        actionScaleY = 1 + pulse * 0.07;
      }
    }

    const motion = this.getCharacterMotionState();
    const uSq = this.getUnleashIdleSquash();
    const bob = motion.bob + actionLiftY;
    const scale = fusion.scale || 1.45;

    // 0. Fusion Overdrive Afterimages & Trail (when Overdrive is active while fused)
    if (this.afterimages && this.afterimages.length > 0 && this.isPinkOverdrive) {
      for (const img of this.afterimages) {
        const a = Math.max(0, (img.life / Math.max(0.01, img.maxLife)) * 0.42);
        ctx.save();
        ctx.translate(img.x, img.y);
        ctx.scale(img.facing * scale, scale);
        ctx.globalAlpha = a;
        ctx.fillStyle = this.dualOverdrive ? '#fde047' : (fusion.color || '#f472b6');
        ctx.beginPath();
        ctx.ellipse(0, -48, 22, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(this.x + actionLunge * this.facing, this.y + motion.hoverY);
    ctx.scale(this.facing * scale * actionScaleX * motion.breathScaleX * uSq.sx, scale * actionScaleY * motion.breathScaleY * uSq.sy);
    ctx.rotate(actionTorsoTilt + motion.torsoTilt);

    // Sprint Speed-Lines behind sprinting Canon Fusions!
    if (this.isSprinting) {
      ctx.save();
      const sPulse = Math.sin((this.animTime || 0) * 26);
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.72)';
      ctx.lineCap = 'round';
      for (let sl = 0; sl < 5; sl++) {
        const ly = -16 - sl * 16 + (sl % 2 === 0 ? sPulse * 2 : -sPulse * 2);
        const len = 26 + (sl % 3) * 14;
        ctx.lineWidth = sl === 2 ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(-22 - sl * 5, ly);
        ctx.lineTo(-22 - sl * 5 - len, ly);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 1. Luminous Grand Rainbow / Prism Fusion Aura + Fusion Overdrive Halo + Crisp Fusion Rim Glow
    this.drawFusionAura(ctx, fusion, bob);
    ctx.save();
    const fRim = ctx.createRadialGradient(0, -50 + bob, 8, 0, -50 + bob, 56);
    fRim.addColorStop(0, (fusion.glowColor || fusion.color || '#f472b6') + '40');
    fRim.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fRim;
    ctx.beginPath();
    ctx.arc(0, -50 + bob, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. High-Fidelity Animated Procedural Vector Fusion Characters (Full Kinematics, Articulated Limbs & Visual Skills)
    const fid = fusion.id;
    if (fid === 'stevonnie') {
      this.drawStevonnie(ctx, bob, animP, this.actionType);
    } else if (fid === 'smoky') {
      this.drawSmokyQuartz(ctx, bob, animP, this.actionType);
    } else if (fid === 'rainbow2') {
      this.drawRainbowQuartz2(ctx, bob, animP, this.actionType);
    } else if (fid === 'sunstone') {
      this.drawSunstone(ctx, bob, animP, this.actionType);
    } else if (fid === 'sugilite') {
      this.drawSugilite(ctx, bob, animP, this.actionType);
    } else if (fid === 'sardonyx') {
      this.drawSardonyx(ctx, bob, animP, this.actionType);
    } else if (fid === 'opal') {
      this.drawOpal(ctx, bob, animP, this.actionType);
    } else if (fid === 'malachite') {
      this.drawMalachite(ctx, bob, animP, this.actionType);
    } else if (fid === 'rainbowClassic') {
      this.drawRainbowQuartzClassic(ctx, bob, animP, this.actionType);
    }

    // Per-Fusion Animated Signature Polish (prismatic weapon gleams, aura sparks, canon flair)
    this.drawFusionSignatureFlourish(ctx, fid, bob, animP);

    // 3. Dynamic Attack Slashes & Impact Visuals for Fusion
    if (this.isAttacking) {
      this.drawFusionAttackVisuals(ctx, bob, fusion, animP);
    }

    ctx.restore();
  }

  drawFusionAura(ctx, fusion, bob) {
    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const pulse = 1 + Math.sin(t * 5) * 0.15;
    const isOd = !!this.isPinkOverdrive;
    const isDual = !!this.dualOverdrive;

    ctx.save();
    // Overdrive Prismatic Back-Flame & Halo when Overdrive is active on the Fusion
    if (isOd) {
      const odCol = isDual ? '#fde047' : (fusion.color || '#f472b6');
      const odGlow = isDual ? '#f472b6' : (fusion.glowColor || '#ffffff');
      const flameH = 98 + Math.sin(t * 14) * 10;
      const flameW = (isDual ? 44 : 36) + Math.cos(t * 11) * 4;
      ctx.save();
      ctx.globalAlpha = isDual ? 0.34 : 0.25;
      ctx.fillStyle = odCol;
      ctx.beginPath();
      ctx.moveTo(-flameW, 0);
      ctx.quadraticCurveTo(-flameW * 1.15, -flameH * 0.55, 0, -flameH + bob);
      ctx.quadraticCurveTo(flameW * 1.15, -flameH * 0.55, flameW, 0);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = odGlow;
      ctx.beginPath();
      ctx.moveTo(-flameW * 0.68, 0);
      ctx.quadraticCurveTo(-flameW * 0.8, -flameH * 0.45, 0, -flameH * 0.84 + bob);
      ctx.quadraticCurveTo(flameW * 0.8, -flameH * 0.45, flameW * 0.68, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Rotating 4-point cel overdrive star crests around torso
      this.drawCelStarBurst(ctx, 0, -52 + bob, isDual ? 34 : 26, odCol, '#ffffff', isDual ? 6 : 4, t * 2.4);
    }

    // Glowing prismatic base ring
    ctx.beginPath();
    ctx.ellipse(0, 0, (isOd ? 46 : 38) * pulse, (isOd ? 14 : 12) * pulse, 0, 0, Math.PI * 2);
    ctx.fillStyle = isOd ? 'rgba(255, 235, 130, 0.24)' : 'rgba(255, 255, 255, 0.18)';
    ctx.fill();
    ctx.strokeStyle = isOd ? (isDual ? '#fde047' : '#ff66b2') : (fusion.glowColor || '#ffffff');
    ctx.lineWidth = isOd ? 3 : 2.2;
    ctx.stroke();

    // Floating starlight motes orbiting the fusion
    const count = isOd ? (isDual ? 8 : 6) : 4;
    for (let i = 0; i < count; i++) {
      const angle = t * (isOd ? 4.8 : 3) + (i * (Math.PI * 2 / count));
      const orbX = Math.cos(angle) * (isOd ? 38 : 32);
      const orbY = -45 + Math.sin(angle) * (isOd ? 22 : 18) + bob;
      ctx.fillStyle = (i % 2 === 0) ? (isDual ? '#fde047' : (fusion.color || '#ec4899')) : '#ffffff';
      ctx.beginPath();
      ctx.arc(orbX, orbY, isOd ? 3.5 : 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 1. STEVONNIE (Steven + Connie) ---
  drawStevonnie(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;
    const isShieldStance = (actionType === 'shield');

    // 1. BACK LAYER: Lush billowing dark-espresso waves with two-tone cel sheen
    const swX = hair.swayX * 0.9;
    const swY = hair.swayY * 0.55;
    ctx.fillStyle = '#1c1216';
    ctx.beginPath();
    ctx.moveTo(4, -90 + bob);
    ctx.bezierCurveTo(-15, -94 + bob, -28 + swX * 0.45, -75 + bob, -23 + swX * 0.75, -56 + bob + swY * 0.5);
    ctx.bezierCurveTo(-31 + swX, -41 + bob + swY, -19 + swX * 1.1, -24 + bob + swY, -25 + swX * 1.2, -13 + bob + swY);
    ctx.bezierCurveTo(-12 + swX * 0.9, -12 + bob, -3 + swX * 0.5, -24 + bob, 6, -42 + bob);
    ctx.lineTo(10, -76 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#3b242c';
    ctx.beginPath();
    ctx.moveTo(-8, -86 + bob);
    ctx.bezierCurveTo(-20 + swX * 0.3, -72 + bob, -15 + swX * 0.65, -52 + bob, -20 + swX * 0.95, -28 + bob + swY);
    ctx.bezierCurveTo(-14 + swX * 0.8, -32 + bob + swY, -10 + swX * 0.5, -54 + bob, -4, -76 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Sculpted Honey-Tan Barefoot Legs & Rolled Blue Denim Shorts (matches Stevonnie.png!)
    const drawStevonnieLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -29 + bob + ly);
      ctx.rotate(rot);
      const jeanCol = darken ? '#1e40af' : '#2563eb';
      const jeanShade = darken ? '#172554' : '#1d4ed8';
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 10.5, 6.0, 5.2, jeanCol, jeanShade, 1);
      // Rolled light-denim cuff
      ctx.fillStyle = darken ? '#3b82f6' : '#60a5fa';
      ctx.beginPath();
      ctx.ellipse(0, 11, 5.6, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Bare warm-honey calf + barefoot contoured toes!
      this.drawCelTaperedLimb(ctx, 0, 12.5, 0, 26, 4.1, 3.3, darken ? '#c28358' : '#d4976a', '#a16640', 1);
      ctx.fillStyle = darken ? '#c28358' : '#d4976a';
      ctx.strokeStyle = '#7c4a2a';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-3.2, 25);
      ctx.quadraticCurveTo(3.5, 24.5, 7.2, 27.2);
      ctx.quadraticCurveTo(7.5, 29.5, -2.5, 29.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };
    drawStevonnieLeg(-6.5 + legs.backX, legs.backY, legs.backRot, true);
    drawStevonnieLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Rear Arm + Pink Glow Bracelet + Rose's Crystalline Shield
    const m = this.getCharacterMotionState();
    const poise = Math.max(0, strike) * 9 + m.armSwingB * 10;
    if (isShieldStance) {
      this.drawArticulatedArm(ctx, -11, -56 + bob, -2, -52 + bob, 13, -47 + bob, '#e11d48', '#d4976a', 6.5, 5.2, '#d4976a', 4.2);
      ctx.save();
      ctx.translate(15, -47 + bob);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.90)';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.6;
      ctx.stroke();
      ctx.fillStyle = '#fda4af';
      this.drawMiniStar(ctx, 0, 0, 9);
      ctx.restore();
    } else {
      const shHx = -24 - poise;
      const shHy = -49 + bob + m.armSwingB * 6;
      this.drawArticulatedArm(ctx, -11, -56 + bob, -18 - poise * 0.5, -56 + bob + m.armSwingB * 4, shHx, shHy, '#e11d48', '#d4976a', 6.5, 5.2, '#d4976a', 4.0);
      // Pink glow bracelet
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(shHx + 3, shHy - 1, 3.2, 2.2, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(shHx, shHy);
      ctx.fillStyle = 'rgba(255, 96, 151, 0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, 0.2, Math.PI * 1.65);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Contoured Cropped Salmon-Red Star Tee + Exposed Midriff + Navel Gem (ZERO detached box!)
    ctx.fillStyle = '#d4976a';
    ctx.beginPath();
    ctx.moveTo(-10.5, -35 + bob);
    ctx.lineTo(11, -35 + bob);
    ctx.quadraticCurveTo(12, -28 + bob, 9.5, -26 + bob);
    ctx.lineTo(-9.5, -26 + bob);
    ctx.quadraticCurveTo(-12, -28 + bob, -10.5, -35 + bob);
    ctx.closePath();
    ctx.fill();

    // Sculpted waist-to-shoulder torso with crisp cel-ink contour!
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#3b0a1a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-13.5, -60 + bob);
    ctx.quadraticCurveTo(0, -63 + bob, 14.5, -60 + bob);
    ctx.quadraticCurveTo(13, -46 + bob, 11.5, -34 + bob);
    ctx.quadraticCurveTo(0, -32.5 + bob, -11.5, -34 + bob);
    ctx.quadraticCurveTo(-13, -46 + bob, -13.5, -60 + bob);
    ctx.closePath();
    ctx.fill();
    // Hard-edged back cel shadow on shirt (aligned properly with bob!)
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(-13.5, -60 + bob);
    ctx.lineTo(-4, -61 + bob);
    ctx.quadraticCurveTo(-6, -47 + bob, -5, -33.5 + bob);
    ctx.lineTo(-11.5, -34 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-13.5, -60 + bob);
    ctx.quadraticCurveTo(0, -63 + bob, 14.5, -60 + bob);
    ctx.quadraticCurveTo(13, -46 + bob, 11.5, -34 + bob);
    ctx.quadraticCurveTo(0, -32.5 + bob, -11.5, -34 + bob);
    ctx.quadraticCurveTo(-13, -46 + bob, -13.5, -60 + bob);
    ctx.closePath();
    ctx.stroke();

    // Crisp Star + Rose Quartz Navel Gem
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 2.5, -47.5 + bob, 8.2);
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 1.8, -30.5 + bob, 4.1);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(1.2, -31.5 + bob, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Sculpted Neck & Lineless Cel Face (`Character style.mp4` proportions!)
    this.drawCelTaperedLimb(ctx, -0.5, -59 + bob, 0.5, -67 + bob, 4.3, 3.8, '#d4976a', '#b6784e', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -76 + bob, rx: 12.2, ry: 12.8,
      skin: '#d4976a', shadow: '#b6784e',
      eyeY: -76.5 + bob, eyeXBack: -2.2, eyeXFront: 6.4, eyeW: 2.7, eyeH: 3.3,
      irisCol: '#1f1418', browCol: '#1c1216',
      noseStyle: 'button', noseX: 4.2, noseY: -73 + bob,
      mouthY: -68.5 + bob, mouthStyle: 'auto'
    });

    // Sweeping front hairline & locks framing face with Peridot-grade cel sheen + contour
    ctx.fillStyle = '#1c1216';
    ctx.strokeStyle = '#090507';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-13, -76 + bob);
    ctx.bezierCurveTo(-15, -90 + bob, -3, -96 + bob, 8, -91.5 + bob);
    ctx.bezierCurveTo(15, -88 + bob, 15.5, -80 + bob, 11.5, -75 + bob);
    ctx.bezierCurveTo(8, -81.5 + bob, 2.5, -83.5 + bob, -3, -81.5 + bob);
    ctx.bezierCurveTo(-8.5, -80 + bob, -10.5, -75 + bob, -13, -76 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hair cel specular sheen crescent
    ctx.fillStyle = '#5b3946';
    ctx.beginPath();
    ctx.ellipse(-1.5, -87.5 + bob, 6.8, 2.3, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a87d8b';
    ctx.beginPath();
    ctx.ellipse(-2.5, -88 + bob, 3.2, 1.0, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // 6. Front Arm + Cyan Glow Bracelet + Rose's Broadsword (Tekken multi-angle sword guard & slashes)
    const comboStep = this.attackCombo || 0;
    const isAct = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill');
    const handX = 14 + strike * (comboStep === 0 ? 22 : 18);
    const handY = -46 + bob - strike * (comboStep === 2 ? 14 : 6);
    this.drawArticulatedArm(ctx, 11.5, -56 + bob, 14.5 + strike * 9, -50 + bob, handX, handY, '#f43f5e', '#d4976a', 6.8, 5.2, '#d4976a', 4.3);
    // Cyan Connie glow bracelet on sword wrist
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.ellipse(handX - 3.5, handY - 1, 3.2, 2.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(handX, handY);
    const swordSwing = isAct
      ? (comboStep === 0 ? (Math.PI * 0.42 + strike * 0.4) : comboStep === 1 ? (-Math.PI * 0.1 + strike * 1.35) : (-0.55 + strike * 1.85))
      : 0.26;
    ctx.rotate(swordSwing);
    ctx.fillStyle = '#9f1239';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-2.2, -4, 4.4, 11, 2);
    ctx.fill();
    ctx.stroke();
    // Curved thorny rose brass crossguard + rose pommel
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-9, -4.5);
    ctx.quadraticCurveTo(0, -8.5, 9, -4.5);
    ctx.lineTo(7, -2);
    ctx.quadraticCurveTo(0, -5, -7, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-4.4, -6);
    ctx.lineTo(-3.4, -43);
    ctx.lineTo(0, -55);
    ctx.lineTo(3.4, -43);
    ctx.lineTo(4.4, -6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#be185d';
    ctx.beginPath();
    ctx.moveTo(-4.4, -6);
    ctx.lineTo(-3.4, -43);
    ctx.lineTo(0, -55);
    ctx.lineTo(0, -6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4.4, -6);
    ctx.lineTo(-3.4, -43);
    ctx.lineTo(0, -55);
    ctx.lineTo(3.4, -43);
    ctx.lineTo(4.4, -6);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0.2, -8);
    ctx.lineTo(1.6, -48);
    ctx.lineTo(2.4, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- 2. SMOKY QUARTZ (Steven + Amethyst) ---
  drawSmokyQuartz(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Tousled puffy chocolate-brown curls swaying behind neck (matches Smoky Quartz.png!)
    const swX = hair.swayX * 0.85;
    const swY = hair.swayY * 0.45;
    ctx.fillStyle = '#291c19';
    ctx.beginPath();
    ctx.moveTo(6, -90 + bob);
    ctx.bezierCurveTo(-14, -96 + bob, -28 + swX * 0.5, -82 + bob, -26 + swX * 0.8, -64 + bob + swY);
    ctx.bezierCurveTo(-31 + swX, -52 + bob + swY, -21 + swX, -42 + bob + swY, -12 + swX * 0.7, -45 + bob);
    ctx.lineTo(9, -66 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4a322c';
    ctx.beginPath();
    ctx.ellipse(-12 + swX * 0.35, -75 + bob, 7.5, 4.2, -0.45, 0, Math.PI * 2);
    ctx.fill();

    // 2. Sculpted Denim Shorts w/ Lavender Frayed Hem + Dark Tights & White Slip-On Sneakers (matches Smoky Quartz.png!)
    const drawSmokyLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -26 + bob + ly);
      ctx.rotate(rot);
      // Indigo shorts leg + jagged pastel lavender frayed cuff
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 9.5, 7.2, 6.2, darken ? '#1e3a8a' : '#2563eb', '#172554', 1);
      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath();
      ctx.moveTo(-6.5, 9);
      ctx.lineTo(-3, 12.2); ctx.lineTo(0, 9.2); ctx.lineTo(3.2, 12.4); ctx.lineTo(6.5, 9);
      ctx.closePath();
      ctx.fill();
      // Taupe-plum knee skin & dark tights + clean white slip-on sneaker
      this.drawCelTaperedLimb(ctx, 0, 10.5, 0, 14.5, 4.9, 4.5, darken ? '#7c656b' : '#8b797d', '#5c494f', 1);
      this.drawCelTaperedLimb(ctx, 0, 14, 0, 21, 4.4, 3.8, '#18181b', '#09090b', 1);
      this.drawCelBoot(ctx, 0.5, 25, 9.5, 5.5, '#f8fafc', '#18181b');
      ctx.restore();
    };
    drawSmokyLeg(-7.5 + legs.backX, legs.backY, legs.backRot, true);
    drawSmokyLeg(8 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Exposed Taupe Belly + Cropped Dark Tee w/ Orange/Red Stripes & Horizontal Keyhole Gem Cutout
    ctx.fillStyle = '#8b797d';
    ctx.beginPath();
    ctx.ellipse(0, -25.5 + bob, 13.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 1.5, -26.5 + bob, 4.0);

    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-17, -61 + bob);
    ctx.quadraticCurveTo(0, -64 + bob, 17, -61 + bob);
    ctx.bezierCurveTo(18, -46 + bob, 16, -34 + bob, 13.5, -29 + bob);
    ctx.quadraticCurveTo(0, -27 + bob, -13.5, -29 + bob);
    ctx.bezierCurveTo(-16, -35 + bob, -18, -48 + bob, -17, -61 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Red/Orange/Gold curved collar trim around horizontal keyhole cutout
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.ellipse(0.5, -52 + bob, 9.2, 4.4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(0.5, -52 + bob, 10.6, 5.4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#8b797d';
    ctx.beginPath(); ctx.ellipse(0.5, -52 + bob, 7.6, 3.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a855f7';
    this.drawMiniStar(ctx, 1.5, -52 + bob, 4.2);

    // 4. Sculpted Neck + Lineless Cel Face + Cheek Freckles + Mischievous Fang Smile!
    this.drawCelTaperedLimb(ctx, 0, -60 + bob, 0.5, -67 + bob, 5.2, 4.6, '#8b797d', '#6d5c60', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -76 + bob, rx: 14.2, ry: 13.6,
      skin: '#8b797d', shadow: '#6d5c60',
      eyeY: -76.5 + bob, eyeXBack: -2.6, eyeXFront: 6.8, eyeW: 2.9, eyeH: 3.3,
      irisCol: '#1e102d', browCol: '#18181b',
      noseStyle: 'button', noseX: 4.5, noseY: -73 + bob,
      mouthY: -68.5 + bob, mouthStyle: 'auto'
    });
    // Signature Quartz cheek freckles & cheeky fang tooth
    ctx.fillStyle = '#524046';
    for (const [fx, fy] of [[-5.5, -72], [-3.2, -71], [8.5, -72.5], [10.6, -71]]) {
      ctx.beginPath();
      ctx.arc(fx, fy + bob, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(4.2, -68.8 + bob);
    ctx.lineTo(6.2, -68.8 + bob);
    ctx.lineTo(5.2, -66.4 + bob);
    ctx.closePath();
    ctx.fill();

    // Sculpted tousled chocolate-brown curls + warm highlight
    ctx.fillStyle = '#291c19';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-14.5, -74 + bob);
    ctx.bezierCurveTo(-18, -91 + bob, -3, -97 + bob, 9, -92 + bob);
    ctx.bezierCurveTo(17, -89 + bob, 17, -79 + bob, 13, -73.5 + bob);
    ctx.bezierCurveTo(9, -80 + bob, 3, -83 + bob, -3, -80 + bob);
    ctx.bezierCurveTo(-8.5, -82.5 + bob, -11.5, -78 + bob, -14.5, -74 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#5c3f38';
    ctx.beginPath();
    ctx.ellipse(-1, -88.5 + bob, 7.2, 2.5, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8b685e';
    ctx.beginPath();
    ctx.ellipse(-2, -89 + bob, 3.2, 1.0, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // 5. THREE ARTICULATED ARMS (2 from rear shoulder, 1 front) + Giant Brown/Cream Star Yo-Yo!
    const mSmoky = this.getCharacterMotionState();
    const spinRot = mSmoky.t * 15;
    const swB = mSmoky.armSwingB * 12;
    const swF = mSmoky.armSwingF * 12;

    const drawCelYoyo = (yx, yy, r, angle) => {
      ctx.save();
      ctx.translate(yx, yy);
      ctx.rotate(angle);
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#291c19';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(-r * 0.22, -r * 0.22, r * 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef3c7';
      this.drawMiniStar(ctx, 0, 0, r * 0.56);
      ctx.restore();
    };

    const yo1x = -29 - swB;
    const yo1y = -55 + bob + Math.sin(mSmoky.t * 4) * 3;
    this.drawArticulatedArm(ctx, -14, -56 + bob, -22 - swB * 0.4, -63 + bob, yo1x, yo1y, '#18181b', '#8b797d', 7.4, 5.8, '#8b797d', 4.3);
    drawCelYoyo(yo1x, yo1y, 8.8, spinRot * 1.2);

    const yo2x = -24 + swF * 0.8;
    const yo2y = -31 + bob + Math.cos(mSmoky.t * 4.4) * 3.5;
    this.drawArticulatedArm(ctx, -14, -51 + bob, -20 + swF * 0.4, -43 + bob, yo2x, yo2y, '#18181b', '#8b797d', 7.0, 5.4, '#8b797d', 4.1);
    drawCelYoyo(yo2x, yo2y, 9.2, -spinRot);

    // Front Primary Brown Star Yo-Yo Whip
    const yoyoReach = 34 + strike * 42;
    const yoyoY = -37 + bob - strike * 7;
    const handX = 14 + strike * 15;
    const handY = -45 + bob - strike * 4;
    this.drawArticulatedArm(ctx, 13, -55 + bob, 16 + strike * 8, -49 + bob, handX, handY, '#ef4444', '#8b797d', 7.5, 6.2, '#8b797d', 4.6);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(handX + strike * 16, -45 + bob, yoyoReach, yoyoY);
    ctx.stroke();

    drawCelYoyo(yoyoReach, yoyoY, 14.0, spinRot * 1.6);
  }

  // --- 3. RAINBOW QUARTZ 2.0 (Steven + Pearl) ---
  drawRainbowQuartz2(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Sculpted swirling pastel cotton-candy curls (turquoise, lavender & rose!)
    const swX = hair.swayX * 0.75;
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(-4, -90 + bob);
    ctx.bezierCurveTo(-22 + swX * 0.4, -92 + bob, -26 + swX * 0.7, -75 + bob, -16 + swX * 0.6, -64 + bob);
    ctx.quadraticCurveTo(-8, -68 + bob, -2, -76 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c4b5fd';
    ctx.beginPath();
    ctx.moveTo(-8, -94 + bob);
    ctx.bezierCurveTo(-20 + swX * 0.4, -98 + bob, -16 + swX * 0.5, -80 + bob, -4, -84 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Slender Dancer Legs: Rolled denim jeans + TALL PASTEL-PINK BOOTS (matches Rainbow Quartz 2.0.png!)
    const drawRainbowLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -28 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 12.5, 5.4, 4.6, darken ? '#1e40af' : '#2563eb', '#172554', 1);
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath(); ctx.ellipse(0, 12.5, 5.2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      this.drawCelBoot(ctx, 0.5, 24, 9.6, 13.5, darken ? '#ec4899' : '#f472b6', '#fdf2f8', '#fbcfe8');
      ctx.restore();
    };
    drawRainbowLeg(-5.5 + legs.backX, legs.backY, legs.backRot, true);
    drawRainbowLeg(6 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Fitted Mint-Seafoam Blazer over Red Yellow-Star Tee & Exposed Midriff (matches Rainbow Quartz 2.0.png!)
    ctx.fillStyle = '#5eead4';
    ctx.strokeStyle = '#0f3d3e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-13, -64 + bob);
    ctx.quadraticCurveTo(0, -66 + bob, 14, -64 + bob);
    ctx.quadraticCurveTo(13, -46 + bob, 11.5, -26 + bob);
    ctx.quadraticCurveTo(0, -24 + bob, -11.5, -26 + bob);
    ctx.quadraticCurveTo(-13, -46 + bob, -13, -64 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hard cel back shade
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.moveTo(-13, -64 + bob);
    ctx.lineTo(-4, -64.5 + bob);
    ctx.lineTo(-4.5, -25.5 + bob);
    ctx.lineTo(-11.5, -26 + bob);
    ctx.closePath();
    ctx.fill();

    // Inner red tee + exposed peach midriff + sharp tailored blazer lapels
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-6.5, -64 + bob);
    ctx.lineTo(7, -64 + bob);
    ctx.lineTo(4.5, -36 + bob);
    ctx.lineTo(-4.5, -36 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fde2e4';
    ctx.beginPath();
    ctx.ellipse(0.5, -30.5 + bob, 6.2, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#99f6e4';
    ctx.beginPath();
    ctx.moveTo(-11, -64 + bob); ctx.lineTo(-4, -50 + bob); ctx.lineTo(-9, -46 + bob); ctx.closePath();
    ctx.moveTo(11, -64 + bob); ctx.lineTo(5, -50 + bob); ctx.lineTo(10, -46 + bob); ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 1, -50 + bob, 4.6);
    ctx.fillStyle = '#f472b6';
    this.drawMiniStar(ctx, 1, -30.5 + bob, 4.0);

    // 4. Sculpted Neck + Pointed-Nose Warm-Peach Cel Face + 4 Expressive Eyes + Pastel Lavender Curl Pompadour!
    this.drawCelTaperedLimb(ctx, 0, -63 + bob, 0.5, -70 + bob, 3.6, 3.2, '#fde2e4', '#f9a8d4', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -78.5 + bob, rx: 11.4, ry: 12.6,
      skin: '#fde2e4', shadow: '#f5d0e6',
      eyeY: -75.5 + bob, eyeXBack: -2.0, eyeXFront: 5.5, eyeW: 2.3, eyeH: 2.6,
      irisCol: '#0284c7', browCol: '#7c3aed',
      noseStyle: 'pointed', noseX: 5.4, noseY: -76.5 + bob,
      mouthY: -69.5 + bob, mouthStyle: 'grin',
      gemForehead: { shape: 'oval', col: '#ffffff', x: 1.2, y: -86.5 + bob, w: 2.5, h: 3.3 },
      extraEyes: [
        { x: -2.4, y: -81 + bob, w: 2.2, h: 2.4, iris: '#38bdf8' },
        { x: 5.8, y: -81 + bob, w: 2.2, h: 2.4, iris: '#38bdf8' }
      ]
    });

    // Sweeping pastel-lavender curly pompadour crest (matches Rainbow Quartz 2.0.png!)
    ctx.fillStyle = '#ddd6fe';
    ctx.strokeStyle = '#6d28d9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-12.5, -83 + bob);
    ctx.bezierCurveTo(-15, -96 + bob, 2, -101 + bob, 12, -91.5 + bob);
    ctx.bezierCurveTo(16, -87 + bob, 10, -83 + bob, 4, -86.5 + bob);
    ctx.bezierCurveTo(-2, -88.5 + bob, -8, -85.5 + bob, -12.5, -83 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f5f3ff';
    ctx.beginPath();
    ctx.ellipse(1, -93 + bob, 5.5, 2.0, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Arms + Rainbow Parasol that Morphs into a Rainbow Star Blaster during Attacks!
    const mR2 = this.getCharacterMotionState();
    const swB2 = mR2.armSwingB * 10;
    const swF2 = mR2.armSwingF * 10;
    this.drawArticulatedArm(ctx, -10.5, -59 + bob, -17 - swB2 * 0.4, -64 + bob, -21 - swB2, -54 + bob + swB2 * 0.3, '#0d9488', '#fce7f3', 5.8, 4.6, '#fce7f3', 3.7);

    const isShooting = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill');
    const handX = 13 + strike * 17 + swF2 * 0.45;
    const handY = -49 + bob - strike * 5 + swF2 * 0.3;
    this.drawArticulatedArm(ctx, 10.5, -59 + bob, 13.5 + strike * 8 + swF2 * 0.2, -52 + bob, handX, handY, '#2dd4bf', '#fce7f3', 6.2, 5.0, '#fce7f3', 4.0);

    ctx.save();
    ctx.translate(handX, handY);
    const angle = isShooting ? (Math.PI * 0.44 + strike * 0.14) : (0.52 + mR2.armSwingF * 0.14);
    ctx.rotate(angle);
    // Pearl-white shaft + magenta curved crook handle
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath(); ctx.roundRect(-2, -48, 4, 60, 2); ctx.fill();
    ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(-4, 12, 5, 0, Math.PI); ctx.stroke();

    const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a855f7'];
    const openSpread = isShooting ? 0.20 : 0.35; // Parasol tightens into cannon cone when firing!
    const rimR = isShooting ? 27 : 23;
    for (let c = 0; c < colors.length; c++) {
      ctx.fillStyle = colors[c];
      const a0 = -Math.PI * 0.5 - (colors.length * openSpread) * 0.5 + c * openSpread;
      const a1 = a0 + openSpread;
      ctx.beginPath();
      ctx.arc(0, -34, rimR, a0 - Math.PI * 0.5, a1 - Math.PI * 0.5);
      ctx.lineTo(0, -34);
      ctx.closePath();
      ctx.fill();
    }
    if (isShooting) {
      this.drawCelStarBurst(ctx, 0, -64, 15, '#ffffff', '#fde047', 5, strike * 2.5);
    }
    ctx.restore();
  }

  // --- 4. SUNSTONE (Steven + Garnet) — Character style.mp4 Unleash Cel! ---
  drawSunstone(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. Sturdy Cuffed Denim Shorts & Coral-Red Flip-Flops (matches Sunstone.webp!)
    const drawSunstoneLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -28 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 11.5, 6.8, 5.4, darken ? '#1e3a8a' : '#2563eb', '#172554', 1);
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath(); ctx.ellipse(0, 12, 6.1, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      this.drawCelTaperedLimb(ctx, 0, 13, 0, 23, 4.6, 3.8, darken ? '#c2410c' : '#ea580c', '#7c2d12', 1);
      // Bare orange foot + coral-red flip-flop strap & sole
      ctx.fillStyle = '#fb923c';
      ctx.beginPath(); ctx.ellipse(1.5, 24.5, 6.5, 3.0, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-5, 26.2, 13.5, 2.8);
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2.0;
      ctx.beginPath(); ctx.moveTo(-2, 23.5); ctx.lineTo(4.5, 26.2); ctx.stroke();
      ctx.restore();
    };
    drawSunstoneLeg(-9 + legs.backX, legs.backY, legs.backRot, true);
    drawSunstoneLeg(9 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Exposed Orange Tummy w/ Navel Gem + Open Pink Varsity Jacket over Black Yellow-Star Crop Top!
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -32 + bob, 14.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    this.drawMiniStar(ctx, 1, -30.5 + bob, 4.5);

    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-16, -64 + bob);
    ctx.quadraticCurveTo(0, -68 + bob, 16, -64 + bob);
    ctx.lineTo(14.5, -39 + bob);
    ctx.lineTo(-14.5, -39 + bob);
    ctx.closePath();
    ctx.fill();
    // Open Hot-Pink Varsity Jacket Panels w/ White Trim
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(-21, -65 + bob); ctx.lineTo(-9, -65 + bob); ctx.lineTo(-10, -37 + bob); ctx.lineTo(-17, -38 + bob); ctx.closePath();
    ctx.moveTo(21, -65 + bob); ctx.lineTo(9, -65 + bob); ctx.lineTo(10, -37 + bob); ctx.lineTo(17, -38 + bob); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-9, -65 + bob); ctx.lineTo(-10, -37 + bob); ctx.moveTo(9, -65 + bob); ctx.lineTo(10, -37 + bob); ctx.stroke();

    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 1, -51 + bob, 8.8);

    // 3. FOUR ARTICULATED ARMS (2 Thin Lower Burgundy-Gloved Arms + 2 Massive Pink-Varsity Boxing Arms!)
    const mSun = this.getCharacterMotionState();
    const sSwF = mSun.armSwingF * 13;
    const sSwB = mSun.armSwingB * 13;
    // Lower thin orange arms with burgundy fingerless gloves
    this.drawArticulatedArm(ctx, -15, -45 + bob, -23 - sSwB * 0.4, -40 + bob, -26 - sSwB, -30 + bob + sSwB * 0.3, '#ea580c', '#881337', 5.2, 4.4, '#881337', 4.6);
    this.drawArticulatedArm(ctx, 15, -45 + bob, 22 + sSwF * 0.3, -40 + bob, 26 + sSwF, -30 + bob - sSwF * 0.3, '#f97316', '#881337', 5.2, 4.4, '#881337', 4.6);
    // Massive Pink Varsity upper punching arms
    this.drawArticulatedArm(ctx, -16, -61 + bob, -26 - sSwB * 0.3, -68 + bob, -28 - sSwB * 0.7, -80 + bob + Math.abs(sSwB) * 0.3, '#ec4899', '#ec4899', 11.4, 9.2, '#f97316', 7.6);

    const reach = strike * 42;
    const fx = 24 + reach + sSwF * 0.65;
    const fy = -54 + bob - strike * 7 + sSwF * 0.35;
    this.drawArticulatedArm(ctx, 16, -61 + bob, 20 + reach * 0.45 + sSwF * 0.3, -57 + bob, fx, fy, '#ec4899', '#ec4899', 12, 9.6, '#ea580c', 8.5);

    // Crisp Varsity Striped Cuff
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(15 + reach * 0.25, -46 + bob, 3.2, 6.2, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Suction-Cup Gauntlet Head + Cel Impact Flame
    ctx.save();
    ctx.translate(fx, fy);
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath(); ctx.arc(-2.5, -3.5, 7.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.quadraticCurveTo(17, -11, 16, 0);
    ctx.quadraticCurveTo(17, 11, 8, 10);
    ctx.closePath();
    ctx.fill();
    if (strike > 0.2) {
      this.drawCelStarBurst(ctx, 20, 0, 16, '#ffffff', '#fde047', 5, strike * 3);
    }
    ctx.restore();

    // 4. BLAZING CEL SUN-FLAME HEAD (Jagged Comic Spikes matching Character style.mp4!)
    const t = (typeof performance !== 'undefined' ? performance.now() / 300 : Date.now() / 300);
    ctx.save();
    ctx.translate(0.5, -81 + bob);
    // Outer crimson-orange 9-flame corona with cel contour
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let s = 0; s < 18; s++) {
      const a = (s * Math.PI / 9) - Math.PI / 2 + Math.sin(t + s * 0.7) * 0.08;
      const r = (s % 2 === 0) ? (s === 0 ? 31 : 27) : 16;
      if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner bright solar gold-yellow face
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    for (let s = 0; s < 12; s++) {
      const a = (s * Math.PI / 6) + Math.sin(t * 1.4 + s) * 0.06;
      const r = (s % 2 === 0) ? 19.5 : 13.5;
      if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Cool Angular Crimson Shades with Crisp Frame Rim + Specular Gleam + Wide Smile
    ctx.fillStyle = '#be123c';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-13, -7);
    ctx.lineTo(0, -4);
    ctx.lineTo(15, -8.5);
    ctx.lineTo(12.5, 2.5);
    ctx.lineTo(1.5, 1.5);
    ctx.lineTo(-10.5, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-9, -4.5); ctx.lineTo(-3.5, -4); ctx.lineTo(-7, 1.5); ctx.closePath();
    ctx.moveTo(4.5, -4.5); ctx.lineTo(10, -6); ctx.lineTo(7, 1); ctx.closePath();
    ctx.fill();
    // Wide cheerful open Sunstone grin (contoured tooth arc, no flat box)
    ctx.fillStyle = '#991b1b';
    ctx.beginPath(); ctx.arc(1.5, 5.5, 6.2, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-4, 5.5);
    ctx.lineTo(7, 5.5);
    ctx.quadraticCurveTo(1.5, 8.2, -4, 5.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- 5. SUGILITE (Garnet + Amethyst) ---
  drawSugilite(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Jagged spiky midnight-indigo anime mane + cel violet highlight
    const swX = hair.swayX * 0.9;
    const swY = hair.swayY * 0.55;
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.moveTo(6, -104 + bob);
    ctx.lineTo(-10 + swX * 0.3, -125 + bob);
    ctx.lineTo(-16 + swX * 0.4, -108 + bob);
    ctx.lineTo(-37 + swX * 0.7, -115 + bob);
    ctx.lineTo(-27 + swX * 0.6, -94 + bob);
    ctx.bezierCurveTo(-45 + swX, -82 + bob, -39 + swX * 1.1, -56 + bob + swY, -46 + swX * 1.3, -33 + bob + swY);
    ctx.bezierCurveTo(-30 + swX, -31 + bob, -18 + swX * 0.7, -42 + bob, -8, -56 + bob);
    ctx.lineTo(10, -88 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.moveTo(-10, -108 + bob);
    ctx.quadraticCurveTo(-30 + swX * 0.6, -86 + bob, -33 + swX, -42 + bob + swY);
    ctx.quadraticCurveTo(-22 + swX * 0.7, -64 + bob, -4, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Massive Tapered Dark-Indigo Shorts w/ Purple Star Knee Cutouts & Stomping Boots (matches Sugilite.jpeg!)
    const drawSugiliteLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -31 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 18, 9.4, 7.0, darken ? '#1e1b4b' : '#312e81', '#0f0717', 1);
      ctx.fillStyle = '#a855f7';
      this.drawMiniStar(ctx, 1, 10, 4.2);
      this.drawCelBoot(ctx, 1, 27, 13, 9, darken ? '#3b0764' : '#4c1d95', '#e9d5ff', '#7e22ce');
      ctx.restore();
    };
    drawSugiliteLeg(-11 + legs.backX, legs.backY, legs.backRot, true);
    drawSugiliteLeg(11 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Broad Shredded Purple/Indigo Vest Torso & Keyhole Chest Amethyst Gem (Crisp Cel-Ink Contour!)
    ctx.fillStyle = '#6b21a8';
    ctx.strokeStyle = '#1e0b36';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-25, -75 + bob);
    ctx.quadraticCurveTo(0, -80 + bob, 25, -75 + bob);
    ctx.bezierCurveTo(24, -52 + bob, 19, -34 + bob, 15, -28 + bob);
    ctx.quadraticCurveTo(0, -25 + bob, -15, -28 + bob);
    ctx.bezierCurveTo(-19, -34 + bob, -24, -52 + bob, -25, -75 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Indigo vest sides & teardrop keyhole window
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(-25, -75 + bob);
    ctx.lineTo(-10, -76 + bob);
    ctx.lineTo(-4, -34 + bob);
    ctx.lineTo(-15, -28 + bob);
    ctx.closePath();
    ctx.moveTo(25, -75 + bob);
    ctx.lineTo(10, -76 + bob);
    ctx.lineTo(5, -34 + bob);
    ctx.lineTo(15, -28 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#9333ea';
    this.drawMiniStar(ctx, 0.5, -59 + bob, 6.8);
    ctx.fillStyle = '#f3e8ff';
    this.drawMiniStar(ctx, -0.5, -60.5 + bob, 2.3);

    // 4. FOUR STRIPE-BANDED MUSCULAR ARMS
    const mSug = this.getCharacterMotionState();
    const ugB = mSug.armSwingB * 13;
    const ugF = mSug.armSwingF * 13;
    this.drawArticulatedArm(ctx, -20, -73 + bob, -32 - ugB * 0.4, -87 + bob, -34 - ugB, -104 + bob + ugB * 0.25, '#3b0764', '#7e22ce', 11, 9, '#6b21a8', 7);
    this.drawArticulatedArm(ctx, -18, -54 + bob, -28 + ugB * 0.3, -51 + bob, -24 + ugB * 0.6, -35 + bob, '#3b0764', '#7e22ce', 10, 8.2, '#6b21a8', 7);
    this.drawArticulatedArm(ctx, 19, -73 + bob, 31 + ugF * 0.4, -85 + bob, 33 + ugF, -101 + bob - ugF * 0.25, '#4c1d95', '#7e22ce', 11, 9, '#6b21a8', 7);

    const handX = 22 + strike * 16 + ugF * 0.55;
    const handY = -48 + bob - strike * 6 + ugF * 0.35;
    this.drawArticulatedArm(ctx, 18, -54 + bob, 22 + strike * 8 + ugF * 0.25, -51 + bob, handX, handY, '#4c1d95', '#7e22ce', 11, 9, '#6b21a8', 7.5);
    // Banded plum wrist cuffs on front arms
    ctx.fillStyle = '#9333ea';
    ctx.beginPath(); ctx.ellipse(handX - 5, handY - 3, 4.2, 6.2, 0.3, 0, Math.PI * 2); ctx.fill();

    // 5. Sculpted Broad Jaw Face (`drawCelFace`) + 5 Sharp Eyes + Pointed Cyan Visor + Fanged Sneer!
    this.drawCelTaperedLimb(ctx, 0, -74 + bob, 0.5, -80 + bob, 7.5, 6.8, '#6b21a8', '#4c1d95', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -89 + bob, rx: 16.5, ry: 15.2,
      skin: '#6b21a8', shadow: '#4c1d95',
      eyeY: -87 + bob, eyeXBack: -5, eyeXFront: 5.5, eyeW: 2.3, eyeH: 2.5,
      irisCol: '#f3e8ff', scleraCol: '#2e1065', browCol: '#1e102d',
      noseStyle: 'broad', noseX: 2.2, noseY: -84 + bob,
      mouthY: -78.5 + bob, mouthStyle: 'battle',
      extraEyes: [
        { x: 0.5, y: -96 + bob, w: 2.2, h: 2.3, iris: '#f3e8ff' },
        { x: -7.5, y: -91.5 + bob, w: 2.3, h: 2.4, iris: '#f3e8ff' },
        { x: 8, y: -91.5 + bob, w: 2.3, h: 2.4, iris: '#f3e8ff' }
      ]
    });

    // Widow's peak crown spikes + 3-tone cel highlight
    ctx.fillStyle = '#1e102d';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-16, -93 + bob);
    ctx.lineTo(-10, -114 + bob);
    ctx.lineTo(0, -102 + bob);
    ctx.lineTo(10, -115 + bob);
    ctx.lineTo(16, -94 + bob);
    ctx.quadraticCurveTo(0, -101 + bob, -16, -93 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Translucent Cyan Pointed Kamina Visor + Exposed 3rd Magenta Forehead Eye (matches Sugilite.jpeg!)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.78)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0.5, -90 + bob);
    ctx.lineTo(20, -100 + bob);
    ctx.lineTo(11.5, -85 + bob);
    ctx.lineTo(0.5, -84 + bob);
    ctx.lineTo(-10.5, -85 + bob);
    ctx.lineTo(-19, -100 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(4, -91 + bob); ctx.lineTo(15, -97 + bob); ctx.lineTo(10.5, -88 + bob); ctx.closePath();
    ctx.fill();
    // Glowing 3rd forehead magenta eye above visor
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath(); ctx.ellipse(0.5, -97.5 + bob, 3.0, 2.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0.8, -97.5 + bob, 1.1, 0, Math.PI * 2); ctx.fill();

    // 6. WEAPON: Dark Whip Cord + Garnet's Colossal Spiked Purple-Crimson Gauntlet Wrecking Ball!
    ctx.save();
    ctx.translate(handX, handY);
    const flailX = 28 + strike * 36;
    const flailY = 16 - strike * 25;
    ctx.strokeStyle = '#312e81';
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(flailX * 0.5, -14 * strike, flailX, flailY);
    ctx.stroke();

    ctx.fillStyle = '#581c87';
    ctx.strokeStyle = '#1e102d';
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(flailX, flailY, 17.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#a21caf';
    ctx.beginPath(); ctx.arc(flailX + 3, flailY - 3, 9.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#facc15';
    this.drawMiniStar(ctx, flailX, flailY, 5.2);
    ctx.fillStyle = '#e9d5ff';
    ctx.strokeStyle = '#3b0764';
    ctx.lineWidth = 1.2;
    for (let s = 0; s < 6; s++) {
      const a = s * Math.PI / 3 + strike * 1.5;
      ctx.beginPath();
      ctx.moveTo(flailX + Math.cos(a) * 16, flailY + Math.sin(a) * 16);
      ctx.lineTo(flailX + Math.cos(a) * 27, flailY + Math.sin(a) * 27);
      ctx.lineTo(flailX + Math.cos(a + 0.34) * 16, flailY + Math.sin(a + 0.34) * 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- 6. SARDONYX (Garnet + Pearl) ---
  drawSardonyx(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Smooth Curved Pale-Peach Dorito Coiffure (matches Sardonyx.png!)
    ctx.fillStyle = '#fdba74';
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -120 + bob);
    ctx.quadraticCurveTo(20, -104 + bob, 25, -83 + bob);
    ctx.quadraticCurveTo(0, -79 + bob, -25, -83 + bob);
    ctx.quadraticCurveTo(-20, -104 + bob, 0, -120 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(0, -119 + bob);
    ctx.lineTo(0, -82 + bob);
    ctx.lineTo(-24, -83 + bob);
    ctx.quadraticCurveTo(-18, -102 + bob, 0, -119 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.moveTo(-2, -112 + bob);
    ctx.lineTo(-4, -88 + bob);
    ctx.lineTo(-14, -89 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Ultra-Tall Maroon-Burgundy Tuxedo Trousers & Pointed Black-White Showbiz Heels
    const drawSardonyxLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -34 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 22, 5.2, 3.6, darken ? '#4c0519' : '#6b0f26', '#2a040f', 1);
      this.drawCelBoot(ctx, 1, 29, 9.5, 6.5, '#0f172a', '#f8fafc', '#4c0519');
      ctx.restore();
    };
    drawSardonyxLeg(-6.5 + legs.backX, legs.backY, legs.backRot, true);
    drawSardonyxLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Tuxedo Coat w/ Coral Underside Tails + White Vest & Cummerbund + Red Bowtie
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.moveTo(-14, -42 + bob); ctx.lineTo(-22, -21 + bob); ctx.lineTo(-7, -30 + bob); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-16, -76 + bob);
    ctx.quadraticCurveTo(0, -78 + bob, 16, -76 + bob);
    ctx.bezierCurveTo(15, -58 + bob, 14, -44 + bob, 11.5, -39 + bob);
    ctx.lineTo(-11.5, -39 + bob);
    ctx.bezierCurveTo(-14, -44 + bob, -15, -58 + bob, -16, -76 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(0, -37 + bob, 11, 3.2, 0, 0, Math.PI * 2); ctx.fill();
    // White dress shirt triangle + Ruby bowtie + yellow chest star
    ctx.beginPath();
    ctx.moveTo(-6, -76 + bob); ctx.lineTo(6, -76 + bob); ctx.lineTo(0.5, -52 + bob); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(-5, -73 + bob); ctx.lineTo(0, -70 + bob); ctx.lineTo(5, -73 + bob);
    ctx.lineTo(5, -67 + bob); ctx.lineTo(0, -70 + bob); ctx.lineTo(-5, -67 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 1, -59 + bob, 4.2);

    // 4. Sculpted Neck + Warm Crimson-Burgundy Cel Face (`Sardonyx.png`!) + 4 Eyes + Ruby Shades!
    this.drawCelTaperedLimb(ctx, 0, -75 + bob, 0.5, -80 + bob, 3.8, 3.4, '#be123c', '#881337', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -87 + bob, rx: 11.6, ry: 12.6,
      skin: '#be123c', shadow: '#881337',
      eyeY: -83.5 + bob, eyeXBack: -2.0, eyeXFront: 5.5, eyeW: 2.2, eyeH: 2.5,
      irisCol: '#0f172a', browCol: '#4c0519',
      noseStyle: 'pointed', noseX: 5, noseY: -84.5 + bob,
      mouthY: -79 + bob, mouthStyle: 'grin',
      gemForehead: { shape: 'oval', col: '#ffffff', x: 1, y: -94.5 + bob, w: 2.5, h: 3.3 },
      extraEyes: [
        { x: -2.5, y: -88 + bob, w: 2.1, h: 2.3, iris: '#0f172a' },
        { x: 5.8, y: -88 + bob, w: 2.1, h: 2.3, iris: '#0f172a' }
      ]
    });

    // Ruby Translucent Butterfly Glasses + Crisp Rim & Specular
    ctx.fillStyle = 'rgba(244, 63, 94, 0.78)';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0.5, -87.5 + bob);
    ctx.lineTo(13.5, -94 + bob);
    ctx.lineTo(9.5, -82.5 + bob);
    ctx.lineTo(0.5, -84.5 + bob);
    ctx.lineTo(-8.5, -82.5 + bob);
    ctx.lineTo(-12.5, -94 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(4, -89.5 + bob); ctx.lineTo(10.5, -92.5 + bob); ctx.lineTo(8, -84.5 + bob); ctx.closePath();
    ctx.fill();

    // 5. FOUR CRIMSON ARMS w/ White Tuxedo Cuffs + Double-Garnet-Fist Star War Hammer
    const mSar = this.getCharacterMotionState();
    const sB = mSar.armSwingB * 10;
    const sF = mSar.armSwingF * 10;
    this.drawArticulatedArm(ctx, -14, -74 + bob, -24 - sB * 0.4, -82 + bob, -28 - sB, -96 + bob + sB * 0.3, '#0f172a', '#ffffff', 6, 4.8, '#be123c', 4);
    this.drawArticulatedArm(ctx, 14, -74 + bob, 22 + sF * 0.4, -84 + bob, 26 + sF, -98 + bob - sF * 0.3, '#0f172a', '#ffffff', 6, 4.8, '#be123c', 4);

    const handX = 16 + strike * 15 + sF * 0.5;
    const handY = -56 + bob - strike * 4 + sF * 0.3;
    this.drawArticulatedArm(ctx, -10, -56 + bob, 2, -54 + bob, handX - 4, handY, '#0f172a', '#ffffff', 5.8, 4.8, '#be123c', 3.9);
    this.drawArticulatedArm(ctx, 12, -56 + bob, 16 + strike * 6, -52 + bob, handX + 4, handY, '#0f172a', '#ffffff', 6, 4.8, '#be123c', 4);

    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(strike * 1.3 + mSar.armSwingF * 0.14);
    this.drawCelTaperedLimb(ctx, 0, 26, 0, -48, 3.0, 2.6, '#f43f5e', '#881337', 1);
    // Garnet double-gauntlet mallet head + top star crest
    ctx.fillStyle = '#9f1239';
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-21, -57); ctx.lineTo(-14, -62); ctx.lineTo(14, -62); ctx.lineTo(21, -57);
    ctx.lineTo(21, -38); ctx.lineTo(14, -34); ctx.lineTo(-14, -34); ctx.lineTo(-21, -38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(-16, -58, 32, 10);
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 0, -63, 6.8);
    this.drawMiniStar(ctx, -12, -47, 4.2);
    this.drawMiniStar(ctx, 12, -47, 4.2);
    ctx.restore();
  }

  // --- 7. OPAL (Pearl + Amethyst) ---
  drawOpal(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Pale-Cream High Ponytail + 2 Bound Shoulder-Tails w/ Gold Rings (matches Opal.webp!)
    const swX = hair.swayX * 0.85;
    const swY = hair.swayY * 0.5;
    ctx.fillStyle = '#fef9c3';
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(-2.5, -101 + bob, 8.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(-4, -99 + bob);
    ctx.bezierCurveTo(-24 + swX * 0.4, -92 + bob, -32 + swX * 0.8, -68 + bob, -26 + swX, -45 + bob + swY);
    ctx.bezierCurveTo(-34 + swX * 1.2, -26 + bob + swY, -21 + swX * 1.3, -11 + bob + swY, -13 + swX, -13 + bob);
    ctx.bezierCurveTo(-7 + swX * 0.7, -28 + bob, -12 + swX * 0.4, -56 + bob, 2, -84 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Bound shoulder framing hair tails cinched with golden rings
    for (const [tx, ty] of [[-12.5, -78], [11.5, -78]]) {
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.moveTo(tx - 2.6, ty + bob);
      ctx.quadraticCurveTo(tx + swX * 0.2, ty + 20 + bob, tx - 1 + swX * 0.25, ty + 33 + bob);
      ctx.lineTo(tx + 3.2 + swX * 0.25, ty + 32 + bob);
      ctx.quadraticCurveTo(tx + 2.8, ty + 16 + bob, tx + 2.6, ty + bob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx - 2.5, ty + 14 + bob, 5.5, 2.5);
    }

    // 2. Plum-Mauve Leggings + Pale-Yellow Ankle Boots (matches Opal.webp!)
    const drawOpalLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -33 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 23, 5.2, 3.5, darken ? '#581c87' : '#6b4c7a', '#3b0764', 1);
      this.drawCelBoot(ctx, 0.5, 29, 8.8, 5.5, darken ? '#eab308' : '#fef08a', '#ffffff', '#fde047');
      ctx.restore();
    };
    drawOpalLeg(-6 + legs.backX, legs.backY, legs.backRot, true);
    drawOpalLeg(6.5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Mint Halter Top -> Deep-Teal Corset -> Long Mint Front Tabard Skirt w/ Big YELLOW 5-Pt Star!
    ctx.fillStyle = '#5eead4';
    ctx.beginPath();
    ctx.moveTo(-13, -74 + bob);
    ctx.quadraticCurveTo(0, -76 + bob, 13, -74 + bob);
    ctx.lineTo(11, -55 + bob);
    ctx.lineTo(-11, -55 + bob);
    ctx.closePath();
    ctx.fill();
    // Teal corset waist
    ctx.fillStyle = '#115e59';
    ctx.beginPath();
    ctx.moveTo(-11.5, -55 + bob);
    ctx.lineTo(11.5, -55 + bob);
    ctx.lineTo(9.5, -42 + bob);
    ctx.lineTo(0.5, -39 + bob);
    ctx.lineTo(-9.5, -42 + bob);
    ctx.closePath();
    ctx.fill();
    // Long flowing mint tabard skirt down to knees + iconic Yellow 5-Point Star
    ctx.fillStyle = '#5eead4';
    ctx.strokeStyle = '#0f766e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-10, -43 + bob);
    ctx.lineTo(10, -43 + bob);
    ctx.quadraticCurveTo(13, -24 + bob, 11 + swX * 0.2, -13 + bob);
    ctx.lineTo(-10 + swX * 0.2, -13 + bob);
    ctx.quadraticCurveTo(-12, -24 + bob, -10, -43 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 1.5, -26 + bob, 9.2);

    // Amethyst Chest Gem framed in dark purple diamond/ring cutout
    ctx.fillStyle = '#a855f7';
    this.drawMiniStar(ctx, 1.2, -64 + bob, 5.2);
    ctx.fillStyle = '#f3e8ff';
    this.drawMiniStar(ctx, 0.4, -65 + bob, 2.0);

    // 4. Sculpted Neck & Graceful Opal Cel Face
    this.drawCelTaperedLimb(ctx, 0, -73 + bob, 0.5, -78 + bob, 3.6, 3.2, '#d8b4fe', '#a855f7', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -85.5 + bob, rx: 11.5, ry: 12.6,
      skin: '#ddd6fe', shadow: '#c4b5fd',
      eyeY: -85.5 + bob, eyeXBack: -2.0, eyeXFront: 5.5, eyeW: 2.3, eyeH: 2.8,
      irisCol: '#06b6d4', browCol: '#6366f1',
      noseStyle: 'pointed', noseX: 5.4, noseY: -83.5 + bob,
      mouthY: -78 + bob, mouthStyle: 'smirk',
      gemForehead: { shape: 'oval', col: '#ffffff', x: 1, y: -92.5 + bob, w: 2.6, h: 3.5 }
    });

    // Parted Cream Bangs Framing Forehead Gem
    ctx.fillStyle = '#fef9c3';
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-12.5, -84 + bob);
    ctx.quadraticCurveTo(-11, -98 + bob, 0.5, -96 + bob);
    ctx.quadraticCurveTo(12, -97 + bob, 12.5, -83 + bob);
    ctx.quadraticCurveTo(7.5, -90.5 + bob, 0.5, -92 + bob);
    ctx.quadraticCurveTo(-7.5, -90.5 + bob, -12.5, -84 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. FOUR LILAC ARMS + Ornate Gold-Hilted Aqua/Periwinkle Greatbow (matches Opal.webp!)
    const mOpal = this.getCharacterMotionState();
    const comboOpal = this.attackCombo || 0;
    const isFiring = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill');
    const oPull = isFiring ? (comboOpal === 2 ? 4 : 7) : Math.sin(mOpal.t * 2.6) * 2.5;
    const bowX = 25 + strike * 11 + oPull * 0.35;
    const bowY = -58 + bob + (comboOpal === 2 && isFiring ? -8 : 0);
    const drawPull = -10 - strike * 18 - oPull;

    this.drawArticulatedArm(ctx, 10, -70 + bob, 19, -66 + bob, bowX, bowY - 12, '#2dd4bf', '#ddd6fe', 5.8, 4.6, '#ddd6fe', 3.7);
    this.drawArticulatedArm(ctx, 10, -56 + bob, 17, -56 + bob, bowX, bowY + 12, '#2dd4bf', '#ddd6fe', 5.8, 4.6, '#ddd6fe', 3.7);
    this.drawArticulatedArm(ctx, -10, -70 + bob, -2, -62 + bob, bowX + drawPull, bowY - 2, '#0d9488', '#ddd6fe', 5.8, 4.6, '#ddd6fe', 3.7);
    this.drawArticulatedArm(ctx, -10, -56 + bob, -2, -56 + bob, bowX + drawPull, bowY + 2, '#0d9488', '#ddd6fe', 5.8, 4.6, '#ddd6fe', 3.7);

    ctx.save();
    ctx.translate(bowX, bowY);
    if (isFiring && comboOpal === 2) ctx.rotate(-0.18);
    else if (isFiring && comboOpal === 1) ctx.rotate(0.10);
    // Angled aqua & periwinkle bow limbs + gold grip handle
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 5.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(10, -49);
    ctx.lineTo(-4, -22);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-4, 22);
    ctx.lineTo(10, 49);
    ctx.stroke();
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 3.2;
    ctx.stroke();
    // Gold center bow grip
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.roundRect(-5, -10, 7, 20, 3); ctx.fill(); ctx.stroke();
    // Drawn luminous bowstring + glowing arrow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(10, -49); ctx.lineTo(drawPull, 0); ctx.lineTo(10, 49);
    ctx.stroke();
    this.drawCelTaperedLimb(ctx, drawPull, 0, 36, 0, 1.9, 1.9, '#67e8f9');
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(32, -6.5); ctx.lineTo(46, 0); ctx.lineTo(32, 6.5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  // --- 8. MALACHITE (Lapis + Jasper) ---
  drawMalachite(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Translucent Hydro-Ice Wings & Wild Mint-Cream Lion Mane
    const swX = hair.swayX * 0.9;
    const swY = hair.swayY * 0.55;
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -65 + bob);
    ctx.bezierCurveTo(-58 + swX * 0.6, -108 + bob, -66 + swX, -38 + bob + swY, -24, -44 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.moveTo(8, -108 + bob);
    ctx.bezierCurveTo(-10, -126 + bob, -34 + swX * 0.5, -110 + bob, -31 + swX * 0.8, -88 + bob);
    ctx.bezierCurveTo(-45 + swX, -70 + bob, -35 + swX * 1.1, -46 + bob + swY, -42 + swX * 1.3, -24 + bob + swY);
    ctx.bezierCurveTo(-24 + swX, -22 + bob, -12 + swX * 0.6, -38 + bob, -4, -56 + bob);
    ctx.lineTo(10, -90 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6ee7b7';
    ctx.beginPath();
    ctx.moveTo(-12, -104 + bob);
    ctx.bezierCurveTo(-28 + swX * 0.6, -80 + bob, -22 + swX * 0.9, -54 + bob, -31 + swX, -30 + bob + swY);
    ctx.bezierCurveTo(-20 + swX * 0.7, -50 + bob, -16 + swX * 0.5, -76 + bob, -4, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Four Gripping Monstrous Claw Hand-Feet on the Ground (NO boots — matches Malachite.png!)
    const drawMalachiteHandFoot = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -25 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 19, 6.4, 5.2, darken ? '#0f766e' : '#2dd4bf', '#064e3b', 1);
      // Splayed clawed spider-hand palm + fingers gripping ground
      ctx.fillStyle = darken ? '#0d9488' : '#5eead4';
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 21, 9.5, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const fx of [-6.5, -2, 2.5, 7]) {
        ctx.beginPath(); ctx.moveTo(fx - 1.5, 22); ctx.lineTo(fx, 27); ctx.lineTo(fx + 2, 22); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    };
    drawMalachiteHandFoot(-21 + legs.backX * 0.8, legs.backY, legs.backRot, true);
    drawMalachiteHandFoot(-7.5 + legs.backX, legs.backY, legs.backRot, false);
    drawMalachiteHandFoot(7 + legs.frontX * 0.8, legs.frontY, legs.frontRot, true);
    drawMalachiteHandFoot(21 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 3. Monstrous Neon-Mint Juggernaut Torso w/ Dark-Teal X-Halter, Swirls & Yellow Diamond Belt
    ctx.fillStyle = '#5eead4';
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-26, -77 + bob);
    ctx.quadraticCurveTo(0, -82 + bob, 26, -77 + bob);
    ctx.bezierCurveTo(25, -54 + bob, 21, -34 + bob, 16, -24 + bob);
    ctx.quadraticCurveTo(0, -21 + bob, -16, -24 + bob);
    ctx.bezierCurveTo(-21, -34 + bob, -25, -54 + bob, -26, -77 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Dark forest-green X-halter top & tiger markings
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.moveTo(-21, -77 + bob); ctx.lineTo(0, -56 + bob); ctx.lineTo(21, -77 + bob);
    ctx.lineTo(14, -55 + bob); ctx.lineTo(15, -35 + bob); ctx.lineTo(-15, -35 + bob); ctx.lineTo(-14, -55 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.moveTo(-25, -67 + bob); ctx.lineTo(-9, -68 + bob); ctx.lineTo(-11, -61 + bob); ctx.lineTo(-24, -61 + bob); ctx.closePath();
    ctx.moveTo(25, -60 + bob); ctx.lineTo(9, -58 + bob); ctx.lineTo(10, -52 + bob); ctx.lineTo(24, -53 + bob); ctx.closePath();
    ctx.fill();
    // Yellow Diamond Belt
    ctx.fillStyle = '#fde047';
    this.drawDiamondInsignia(ctx, 1, -39 + bob, 8.0);

    // 4. Hydro-Ice Clawed Thrashing Arms
    const mMal = this.getCharacterMotionState();
    const malSwF = mMal.armSwingF * 14;
    const malSwB = mMal.armSwingB * 14;
    const reach = strike * 30;
    this.drawArticulatedArm(ctx, -18, -72 + bob, -30 - malSwB * 0.4, -68 + bob, -38 - malSwB, -50 + bob + malSwB * 0.35, '#2dd4bf', '#0f766e', 10, 8, '#0d9488', 7.5);
    this.drawArticulatedArm(ctx, 18, -72 + bob, 26 + reach * 0.5 + malSwF * 0.4, -66 + bob, 34 + reach + malSwF, -48 + bob - strike * 6 + malSwF * 0.35, '#2dd4bf', '#0f766e', 10, 8, '#0d9488', 8);

    // 5. Fierce Cel Face (`drawCelFace`) with Jasper Orange Nose Gem & All 6 Neon-Lime Eyes!
    this.drawCelTaperedLimb(ctx, 0, -76 + bob, 0.5, -81 + bob, 7.5, 6.8, '#0d9488', '#0f766e', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -91 + bob, rx: 17.5, ry: 15.8,
      skin: '#0d9488', shadow: '#065f46',
      eyeY: -90 + bob, eyeXBack: -5, eyeXFront: 7, eyeW: 2.3, eyeH: 2.5,
      irisCol: '#a3e635', scleraCol: '#042f2e', browCol: '#022c22',
      noseStyle: 'none', noseX: 3.5, noseY: -86.5 + bob,
      mouthY: -80 + bob, mouthStyle: 'battle',
      extraEyes: [
        { x: -8.5, y: -96 + bob, w: 2.1, h: 2.2, iris: '#a3e635' },
        { x: 0.5, y: -96 + bob, w: 2.1, h: 2.2, iris: '#a3e635' },
        { x: 9.5, y: -96 + bob, w: 2.1, h: 2.2, iris: '#a3e635' },
        { x: 0.8, y: -89.5 + bob, w: 2.1, h: 2.2, iris: '#a3e635' }
      ]
    });

    // Swept mint-cream widow's peak crown with crisp contour + bright specular glint
    ctx.fillStyle = '#a7f3d0';
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-17.5, -96 + bob);
    ctx.bezierCurveTo(-18, -116 + bob, 4, -120 + bob, 17, -102 + bob);
    ctx.quadraticCurveTo(4, -106 + bob, 0.5, -101 + bob);
    ctx.quadraticCurveTo(-8, -106 + bob, -17.5, -96 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ecfdf5';
    ctx.beginPath();
    ctx.ellipse(-2, -110 + bob, 7.2, 2.2, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Jasper's Orange Crystal Nose Gem + Rim
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0.5, -88.5 + bob);
    ctx.lineTo(8.5, -86.5 + bob);
    ctx.lineTo(3, -83 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fdba74';
    ctx.beginPath();
    ctx.arc(3.2, -86.8 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 9. RAINBOW QUARTZ CLASSIC (Rose + Pearl) ---
  drawRainbowQuartzClassic(ctx, bob, animP, actionType) {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Voluminous 80s Cascading Blonde & Pastel-Rose Spiral Mane
    const swX = hair.swayX * 0.88;
    const swY = hair.swayY * 0.5;
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(6, -96 + bob);
    ctx.bezierCurveTo(-14, -104 + bob, -28 + swX * 0.5, -86 + bob, -24 + swX * 0.8, -64 + bob + swY);
    ctx.bezierCurveTo(-34 + swX, -46 + bob + swY, -22 + swX * 1.1, -24 + bob + swY, -28 + swX * 1.3, -12 + bob + swY);
    ctx.bezierCurveTo(-14 + swX, -10 + bob, -4 + swX * 0.6, -24 + bob, 4, -46 + bob);
    ctx.lineTo(8, -80 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.moveTo(-6, -90 + bob);
    ctx.bezierCurveTo(-22 + swX * 0.6, -72 + bob, -16 + swX * 0.9, -46 + bob, -22 + swX, -20 + bob + swY);
    ctx.bezierCurveTo(-14 + swX * 0.8, -20 + bob, -10 + swX * 0.6, -44 + bob, -2, -76 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Pink Tights + Scrunched Hot-Pink & Lavender Leg Warmers + Bare Toes (matches Rainbow Quartz.webp!)
    const drawClassicLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -31 + bob + ly);
      ctx.rotate(rot);
      this.drawCelTaperedLimb(ctx, 0, 0, 0, 14, 5.2, 4.2, darken ? '#f472b6' : '#f9a8d4', '#db2777', 1);
      // Scrunched 80s leg warmer layers
      ctx.fillStyle = darken ? '#9333ea' : '#c084fc';
      ctx.beginPath(); ctx.ellipse(0, 13.5, 5.8, 3.0, 0, 0, Math.PI * 2); ctx.fill();
      this.drawCelTaperedLimb(ctx, 0, 14, 0, 23, 5.6, 5.0, darken ? '#db2777' : '#ec4899', '#9d174d', 1);
      // Pointed bare dancer foot
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath(); ctx.ellipse(1.5, 26, 6.2, 2.7, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    drawClassicLeg(-6 + legs.backX, legs.backY, legs.backRot, true);
    drawClassicLeg(6.5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // White Strapless Leotard + Translucent Cyan Off-Shoulder Wrap Veil + Teal Sash Belt (matches Rainbow Quartz.webp!)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-13, -70 + bob);
    ctx.quadraticCurveTo(0, -72 + bob, 13, -70 + bob);
    ctx.quadraticCurveTo(13, -52 + bob, 10, -32 + bob);
    ctx.quadraticCurveTo(0, -29 + bob, -10, -32 + bob);
    ctx.quadraticCurveTo(-13, -52 + bob, -13, -70 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Translucent cyan wrap veil across bust/shoulders
    ctx.fillStyle = 'rgba(103, 232, 249, 0.65)';
    ctx.beginPath();
    ctx.moveTo(-15, -68 + bob);
    ctx.quadraticCurveTo(0, -61 + bob, 15, -68 + bob);
    ctx.lineTo(14, -56 + bob);
    ctx.quadraticCurveTo(0, -50 + bob, -14, -56 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath(); ctx.ellipse(0, -45 + bob, 12.5, 3.6, -0.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 1, -37.5 + bob, 5.0);

    // 3. Sculpted Neck & Graceful Cel Face + 4 Expressive Eyes + Lavender-Violet Eye Mask!
    this.drawCelTaperedLimb(ctx, 0, -69 + bob, 0.5, -74 + bob, 3.8, 3.3, '#fed7aa', '#fdba74', 1);
    this.drawCelFace(ctx, {
      cx: 0.5, cy: -81 + bob, rx: 11.8, ry: 12.6,
      skin: '#fed7aa', shadow: '#fdba74',
      eyeY: -78.5 + bob, eyeXBack: -2.0, eyeXFront: 5.5, eyeW: 2.3, eyeH: 2.6,
      irisCol: '#38bdf8', browCol: '#9d174d',
      noseStyle: 'pointed', noseX: 5.2, noseY: -80 + bob,
      mouthY: -74.5 + bob, mouthStyle: 'grin',
      gemForehead: { shape: 'oval', col: '#ffffff', x: 1, y: -88 + bob, w: 2.6, h: 3.4 },
      extraEyes: [
        { x: -2.5, y: -83.5 + bob, w: 2.1, h: 2.3, iris: '#f43f5e' },
        { x: 5.5, y: -83.5 + bob, w: 2.1, h: 2.3, iris: '#f43f5e' }
      ]
    });
    // Signature Lavender-Violet Translucent Eye Mask!
    ctx.fillStyle = 'rgba(167, 139, 250, 0.52)';
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(2, -81 + bob, 11.2, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Feathered 80s Blonde-Pink Crown Bangs + Crisp Cel Outline & Specular Crest
    ctx.fillStyle = '#fbcfe8';
    ctx.strokeStyle = '#9d174d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-12.5, -83 + bob);
    ctx.bezierCurveTo(-14, -99 + bob, 2, -103 + bob, 13.5, -92 + bob);
    ctx.quadraticCurveTo(2, -90.5 + bob, -12.5, -83 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff1f2';
    ctx.beginPath();
    ctx.ellipse(-1, -95.5 + bob, 5.2, 1.8, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // 4. Articulated Dancer Arms + Gleaming Fencing Spear/Foil
    const mRC = this.getCharacterMotionState();
    const rcB = mRC.armSwingB * 12;
    const rcF = mRC.armSwingF * 12;
    this.drawArticulatedArm(ctx, -10, -64 + bob, -18 - rcB * 0.4, -72 + bob, -22 - rcB, -84 + bob + rcB * 0.3, '#fed7aa', '#fed7aa', 6, 4.8, '#fed7aa', 3.8);

    const handX = 14 + strike * 18 + rcF * 0.55;
    const handY = -52 + bob - strike * 4 + rcF * 0.35;
    this.drawArticulatedArm(ctx, 10, -64 + bob, 14 + strike * 8 + rcF * 0.25, -56 + bob, handX, handY, '#fed7aa', '#fed7aa', 6.4, 5.2, '#fed7aa', 4);

    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(mRC.armSwingF * 0.14);
    this.drawCelTaperedLimb(ctx, 0, 0, 38 + strike * 12, -8 + strike * 6, 2.5, 0.8, '#f8fafc', '#cbd5e1', 1);
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(0, 0, 5.0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, 0, 2.0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // --- CANONICAL FUSION COMBAT VFX (Unleash the Light Starbursts & Kinetic Slashes) ---
  drawFusionAttackVisuals(ctx, bob, fusion, animP = 0.5) {
    const fid = fusion.id;
    const strike = Math.max(0.2, this.getStrikeCurve(animP));
    const glow = fusion.glowColor || '#ffffff';
    const base = fusion.color || '#f472b6';
    const isSkillL = (this.attackType === 'L');
    const isSpecialK = (this.attackType === 'K');
    ctx.save();

    if (fid === 'stevonnie') {
      // Sweeping Rose-sword two-tier crescent blade waves + Unleash Starburst + Rose Petals
      this.drawCrescentSlash(ctx, 28 + strike * 14, -46 + bob, (isSkillL ? 62 : 48) + strike * 12, -Math.PI * 0.55, Math.PI * 0.42, 'rgba(244, 114, 182, 0.45)', '#f43f5e', '#ffffff', isSkillL ? 20 : 16);
      this.drawSpeedLines(ctx, 16, -46 + bob, 48 * strike, 24, 4, '#fb7185');
      this.drawCelStarBurst(ctx, 60 + strike * 14, -46 + bob, isSkillL ? 16 : 11, '#ffffff', '#fde047', 4, animP * 2);
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(45 + strike * 10, -62 + bob, 4.5, 2.2, 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (fid === 'smoky') {
      // Triple spinning yo-yo whirlwind trails & sonic star shockwave
      const rot = (typeof performance !== 'undefined' ? performance.now() / 28 : Date.now() / 28);
      ctx.save();
      ctx.translate(34 + strike * 18, -42 + bob);
      ctx.rotate(rot);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.78)';
      ctx.lineWidth = isSkillL ? 5.2 : 3.8;
      ctx.beginPath();
      ctx.arc(0, 0, (isSkillL ? 48 : 36) + strike * 12, 0, Math.PI * 1.65);
      ctx.stroke();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, (isSkillL ? 36 : 26) + strike * 10, 0.4, Math.PI * 1.45);
      ctx.stroke();
      ctx.restore();
      this.drawSpeedLines(ctx, 16, -42 + bob, 48 * strike, 28, 4, '#c084fc');
      this.drawCelStarBurst(ctx, 60 + strike * 16, -42 + bob, isSkillL ? 18 : 12, '#ffffff', '#fde047', 5, rot * 0.3);
    } else if (fid === 'rainbow2') {
      // Prismatic Rainbow Umbrella-Blaster Beam + 5-Band Cel Arcs (Character style.mp4!)
      const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a855f7'];
      for (let i = 0; i < colors.length; i++) {
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = isSkillL ? 3.5 : 2.5;
        ctx.beginPath();
        ctx.arc(24 + strike * 14, -48 + bob, (isSkillL ? 44 : 33) + i * 3.8, -Math.PI * 0.42, Math.PI * 0.38);
        ctx.stroke();
      }
      if (isSkillL || isSpecialK) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.moveTo(42, -52 + bob);
        ctx.lineTo(106 + strike * 18, -64 + bob);
        ctx.lineTo(106 + strike * 18, -32 + bob);
        ctx.closePath();
        ctx.fill();
      }
      this.drawCelStarBurst(ctx, 64 + strike * 14, -48 + bob, isSpecialK || isSkillL ? 17 : 11, '#ffffff', '#fde047', 5, animP * 3);
    } else if (fid === 'sunstone') {
      // Blazing Jagged Cel Fire Crown Shockwave & Radial Impact Sparks (Character style.mp4!)
      const crX = 48 + strike * 18;
      const crY = isSkillL ? -8 + bob : -42 + bob;
      const crR = isSkillL ? 38 : 22;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      for (let s = 0; s < 16; s++) {
        const a = (s * Math.PI / 8) + animP;
        const r = (s % 2 === 0) ? crR * 1.45 : crR * 0.65;
        if (s === 0) ctx.moveTo(crX + Math.cos(a) * r, crY + Math.sin(a) * r);
        else ctx.lineTo(crX + Math.cos(a) * r, crY + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      for (let s = 0; s < 12; s++) {
        const a = (s * Math.PI / 6) - animP;
        const r = (s % 2 === 0) ? crR * 0.95 : crR * 0.42;
        if (s === 0) ctx.moveTo(crX + Math.cos(a) * r, crY + Math.sin(a) * r);
        else ctx.lineTo(crX + Math.cos(a) * r, crY + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      this.drawCelImpactPuff(ctx, crX, crY, isSkillL ? 24 : 15, '#ffffff');
      this.drawCelStarBurst(ctx, crX + 16, crY - 6, isSkillL ? 18 : 13, '#ffffff', '#fde047', 4, animP * 2);
    } else if (fid === 'sugilite') {
      // Colossal violet wrecking ball cataclysm impact wave & starburst
      this.drawCrescentSlash(ctx, 36 + strike * 16, -40 + bob, (isSkillL ? 76 : 64) + strike * 16, -Math.PI * 0.65, Math.PI * 0.45, 'rgba(126, 34, 206, 0.55)', '#7e22ce', '#e9d5ff', 22);
      this.drawSpeedLines(ctx, 20, -40 + bob, 60 * strike, 36, 5, '#c084fc');
      this.drawCelStarBurst(ctx, 68 + strike * 16, -40 + bob, isSkillL ? 18 : 12, '#ffffff', '#c084fc', 4, animP);
    } else if (fid === 'sardonyx') {
      // Grand theatrical hammer shockwave & diamond glints
      this.drawCrescentSlash(ctx, 32 + strike * 14, -46 + bob, (isSkillL ? 66 : 52) + strike * 14, -Math.PI * 0.7, Math.PI * 0.35, 'rgba(251, 146, 60, 0.50)', '#fb7185', '#fde047', 18);
      this.drawCelStarBurst(ctx, 64 + strike * 14, -54 + bob, 14, '#ffffff', '#fde047', 4, animP * 2);
      this.drawCelStarBurst(ctx, 48 + strike * 10, -74 + bob, 9, '#ffffff', '#fb7185', 4, 0);
    } else if (fid === 'opal') {
      // Radiant opalescent light arrows and starlight trails
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.9)';
      ctx.lineWidth = isSkillL ? 5 : 3.5;
      ctx.beginPath();
      ctx.moveTo(24, -58 + bob);
      ctx.lineTo(72 + strike * 28, -58 + bob);
      ctx.stroke();
      this.drawCelStarBurst(ctx, 74 + strike * 28, -58 + bob, 13, '#ffffff', '#67e8f9', 4, animP * 2);
      this.drawCelStarBurst(ctx, 52 + strike * 20, -58 + bob, 8, '#ffffff', '#818cf8', 4, 0.5);
    } else if (fid === 'malachite') {
      // Abyssal surging hydro-frost tidal claws
      this.drawCrescentSlash(ctx, 34 + strike * 16, -46 + bob, (isSkillL ? 68 : 54) + strike * 16, -Math.PI * 0.55, Math.PI * 0.45, 'rgba(45, 212, 191, 0.55)', '#0d9488', '#ccfbf1', 18);
      this.drawSpeedLines(ctx, 22, -46 + bob, 56 * strike, 30, 4, '#2dd4bf');
      this.drawCelStarBurst(ctx, 66 + strike * 16, -46 + bob, 14, '#ffffff', '#2dd4bf', 4, animP);
    } else {
      // Rainbow Quartz Classic: Graceful pastel fencing ribbons + starburst
      this.drawCrescentSlash(ctx, 28 + strike * 12, -48 + bob, 44 + strike * 10, -Math.PI * 0.48, Math.PI * 0.45, 'rgba(251, 207, 232, 0.45)', base, glow, 14);
      this.drawSpeedLines(ctx, 16, -48 + bob, 46 * strike, 24, 4, glow);
      this.drawCelStarBurst(ctx, 58 + strike * 12, -48 + bob, 12, '#ffffff', '#f472b6', 5, animP * 2);
    }

    ctx.restore();
  }

  drawAttackVisuals(ctx, bob) {
    ctx.save();
    const frame = this.attackFrame; // 0 to 3
    const combo = this.attackCombo; // 0, 1, 2
    const c = this.activeChar;
    const animP = this.actionDuration > 0 ? Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration))) : 0.5;
    const strike = Math.max(0.2, this.getStrikeCurve(animP));

    if (c === 'connie') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Swift Fencing Lunge Thrust — tapered pink-white lance cone + speed streaks!
          const tipX = 56 + strike * 26;
          const tipY = -44 + bob;
          this.drawSpeedLines(ctx, 18, tipY, 36 + strike * 20, 18, 4, 'rgba(244, 114, 182, 0.85)');
          ctx.fillStyle = 'rgba(236, 72, 153, 0.42)';
          ctx.beginPath();
          ctx.moveTo(22, tipY - 7);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(22, tipY + 7);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(28, tipY - 3);
          ctx.lineTo(tipX + 4, tipY);
          ctx.lineTo(28, tipY + 3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, tipX + 4, tipY, 6.5);
        } else if (combo === 1) {
          // Hit 2: Rising Two-Handed Rose-Crystal Crescent Slash + drifting petals!
          this.drawCrescentSlash(ctx, 24 + strike * 8, -40 + bob, 38 + strike * 8, Math.PI * 0.48, -Math.PI * 0.52, 'rgba(244, 114, 182, 0.38)', '#ec4899', '#ffffff', 13);
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(48 + strike * 8, -22 + bob, 4, 2, -0.5, 0, Math.PI * 2);
          ctx.ellipse(54 + strike * 8, -56 + bob, 4.5, 2.2, 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 56 + strike * 8, -42 + bob, 7.5);
        } else {
          // Hit 3: Aerial Knight's Helm-Splitter Double Crescent Cleave & Star Eruption!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -34 + bob, 48 + strike * 10, -Math.PI * 0.68, Math.PI * 0.40, 'rgba(219, 39, 119, 0.42)', '#f43f5e', '#ffffff', 16);
          this.drawCrescentSlash(ctx, 22 + strike * 8, -34 + bob, 34 + strike * 6, -Math.PI * 0.55, Math.PI * 0.28, 'rgba(251, 207, 232, 0.35)', '#fbcfe8', '#fde047', 9);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 64 + strike * 10, -24 + bob, 9.5);
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 48 + strike * 8, -62 + bob, 7);
        }
      } else if (this.attackType === 'K') {
        // Flying Sword Shockwave Beam Launch
        this.drawCrescentSlash(ctx, 28 + strike * 8, -38 + bob, 32 + strike * 6, -Math.PI * 0.52, Math.PI * 0.52, 'rgba(244, 114, 182, 0.4)', '#ec4899', '#ffffff', 12);
        this.drawSpeedLines(ctx, 20, -38 + bob, 38, 20, 3, '#fbcfe8');
        ctx.fillStyle = '#fbbf24';
        this.drawMiniStar(ctx, 58 + strike * 8, -38 + bob, 8);
      } else if (this.attackType === 'L') {
        // Lion's Shadow-Step Twin X-Cross Tapered Slashes + Starburst!
        ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
        ctx.beginPath();
        ctx.moveTo(-28, -64 + bob); ctx.lineTo(62, -12 + bob); ctx.lineTo(56, -6 + bob); ctx.lineTo(-34, -58 + bob); ctx.closePath();
        ctx.moveTo(-28, -12 + bob); ctx.lineTo(62, -64 + bob); ctx.lineTo(56, -70 + bob); ctx.lineTo(-34, -18 + bob); ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-28, -62 + bob); ctx.lineTo(60, -14 + bob);
        ctx.moveTo(-28, -14 + bob); ctx.lineTo(60, -62 + bob);
        ctx.stroke();
        this.drawCelStarBurst(ctx, 56, -38 + bob, 14, '#ffffff', '#fde047', 4, animP * 2);
      }
    } else if (c === 'jasper') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          const reach = 32 + strike * 22;
          this.drawSpeedLines(ctx, 14, -40 + bob, reach, 20, 4, '#fb923c');
          this.drawCrescentSlash(ctx, 24 + strike * 10, -40 + bob, 30 + strike * 6, -Math.PI * 0.38, Math.PI * 0.38, 'rgba(234, 88, 12, 0.42)', '#ea580c', '#fde047', 12);
          this.drawCelStarBurst(ctx, 52 + strike * 10, -40 + bob, 10, '#ffffff', '#fde047', 4);
        } else if (combo === 1) {
          this.drawCrescentSlash(ctx, 22 + strike * 8, -38 + bob, 42 + strike * 8, -Math.PI * 0.68, Math.PI * 0.25, 'rgba(194, 65, 12, 0.45)', '#ea580c', '#fde047', 15);
          this.drawCelStarBurst(ctx, 54 + strike * 8, -18 + bob, 12, '#ffffff', '#f97316', 4);
        } else {
          this.drawCrescentSlash(ctx, 28 + strike * 12, -36 + bob, 48 + strike * 12, -Math.PI * 0.55, Math.PI * 0.45, 'rgba(234, 88, 12, 0.5)', '#dc2626', '#fde047', 18);
          this.drawCelImpactPuff(ctx, 56, -4 + bob, 18, '#fed7aa');
          this.drawCelStarBurst(ctx, 64 + strike * 10, -36 + bob, 14, '#ffffff', '#fde047', 4, animP);
        }
      } else if (this.attackType === 'K') {
        // Crash Helmet Battering-Ram Blazing Comet Cone!
        this.drawSpeedLines(ctx, -18, -46 + bob, 56, 26, 5, '#fde047');
        ctx.fillStyle = 'rgba(234, 88, 12, 0.72)';
        ctx.beginPath();
        ctx.moveTo(12, -68 + bob);
        ctx.lineTo(64, -46 + bob);
        ctx.lineTo(12, -24 + bob);
        ctx.quadraticCurveTo(28, -46 + bob, 12, -68 + bob);
        ctx.closePath();
        ctx.fill();
        this.drawCelStarBurst(ctx, 64, -46 + bob, 13, '#ffffff', '#fde047', 4);
      } else if (this.attackType === 'L') {
        // Fiery Sawblade Spin-Dash Vortex Rings!
        const spinPulse = Math.sin((typeof performance !== 'undefined' ? performance.now() : Date.now()) / 35) * 6;
        this.drawCrescentSlash(ctx, 0, -28 + bob, 44 + spinPulse, 0, Math.PI * 1.4, 'rgba(234, 88, 12, 0.45)', '#f97316', '#fde047', 12);
        this.drawCrescentSlash(ctx, 0, -28 + bob, 44 + spinPulse, Math.PI, Math.PI * 2.4, 'rgba(234, 88, 12, 0.45)', '#ea580c', '#ffffff', 12);
      }
    } else if (c === 'steven') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          this.drawSpeedLines(ctx, 10, -34 + bob, 32 + strike * 16, 16, 3, '#fda4af');
          this.drawCrescentSlash(ctx, 18 + strike * 8, -34 + bob, 26 + strike * 6, -Math.PI * 0.42, Math.PI * 0.42, 'rgba(255, 96, 151, 0.38)', '#ff6097', '#ffffff', 11);
          this.drawCelStarBurst(ctx, 42 + strike * 8, -34 + bob, 9.5, '#ffffff', '#ffd166', 5);
        } else if (combo === 1) {
          this.drawCrescentSlash(ctx, 22 + strike * 8, -34 + bob, 35 + strike * 8, -Math.PI * 0.52, Math.PI * 0.44, 'rgba(255, 96, 151, 0.42)', '#ec4899', '#ffffff', 14);
          this.drawCelStarBurst(ctx, 50 + strike * 8, -34 + bob, 11, '#ffffff', '#ff94ba', 5);
        } else {
          this.drawCrescentSlash(ctx, 24 + strike * 10, -40 + bob, 44 + strike * 8, Math.PI * 0.35, -Math.PI * 0.68, 'rgba(225, 29, 72, 0.42)', '#ff6097', '#ffffff', 16);
          this.drawCelStarBurst(ctx, 56 + strike * 10, -48 + bob, 14, '#ffffff', '#ffd166', 5, animP * 2);
          this.drawCelStarBurst(ctx, 38 + strike * 6, -74 + bob, 9, '#ffffff', '#fbcfe8', 4);
        }
      } else if (this.attackType === 'K') {
        this.drawSpeedLines(ctx, 14, -36 + bob, 38, 18, 3, '#ff6097');
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.ellipse(32 + strike * 10, -36 + bob, 8, 22, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // Hexagonal Pink Diamond / Rose Bubble Shockwave + 5-Point Starburst!
        const rad = 42 + strike * 10;
        ctx.fillStyle = 'rgba(255, 96, 151, 0.22)';
        ctx.strokeStyle = '#ff94ba';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
          const ha = (h * Math.PI) / 3;
          const hx = Math.cos(ha) * rad;
          const hy = -32 + bob + Math.sin(ha) * rad;
          if (h === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.drawCelStarBurst(ctx, rad - 4, -32 + bob, 13, '#ffffff', '#ffd166', 5, animP * 2);
      }
    } else if (c === 'garnet') {
      if (this.attackType === 'J') {
        const punchX = 28 + strike * 26;
        if (combo === 0) {
          this.drawSpeedLines(ctx, 12, -50 + bob, punchX - 6, 16, 4, '#f87171');
          this.drawCrescentSlash(ctx, punchX - 10, -50 + bob, 22, -Math.PI * 0.4, Math.PI * 0.4, 'rgba(239, 68, 68, 0.45)', '#ef4444', '#fde047', 11);
          this.drawCelStarBurst(ctx, punchX + 12, -50 + bob, 10, '#ffffff', '#fde047', 4);
        } else if (combo === 1) {
          this.drawCrescentSlash(ctx, punchX - 8, -46 + bob, 32, Math.PI * 0.42, -Math.PI * 0.48, 'rgba(56, 189, 248, 0.42)', '#0284c7', '#ffffff', 13);
          this.drawCelStarBurst(ctx, punchX + 16, -54 + bob, 11, '#ffffff', '#38bdf8', 4);
        } else {
          this.drawCrescentSlash(ctx, 28 + strike * 10, -42 + bob, 46 + strike * 8, -Math.PI * 0.65, Math.PI * 0.38, 'rgba(225, 29, 72, 0.45)', '#e11d48', '#fde047', 17);
          this.drawCrescentSlash(ctx, 24 + strike * 8, -42 + bob, 34 + strike * 6, -Math.PI * 0.55, Math.PI * 0.28, 'rgba(56, 189, 248, 0.4)', '#38bdf8', '#ffffff', 10);
          this.drawCelImpactPuff(ctx, punchX + 16, -24 + bob, 16, '#fde047');
          this.drawCelStarBurst(ctx, punchX + 22, -32 + bob, 15, '#ffffff', '#fde047', 4, animP * 2);
        }
      } else if (this.attackType === 'K') {
        // Rocket Gauntlet Launch Sonic Ring & Flame Jet!
        this.drawSpeedLines(ctx, 14, -48 + bob, 44, 18, 4, '#fbbf24');
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(34 + strike * 10, -48 + bob, 9, 22, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // High-Voltage Electro-Seismic Ground Shock!
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(12, -74 + bob); ctx.lineTo(26, -42 + bob); ctx.lineTo(18, -20 + bob); ctx.lineTo(42, 0);
        ctx.moveTo(-12, -68 + bob); ctx.lineTo(-24, -36 + bob); ctx.lineTo(-16, -18 + bob); ctx.lineTo(-36, 0);
        ctx.stroke();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(0, -2, 46 + strike * 12, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (c === 'amethyst') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: S-Curve Whip Crack + Sonic Tip Ring!
          this.drawCrescentSlash(ctx, 24 + strike * 10, -36 + bob, 38 + strike * 10, -Math.PI * 0.48, Math.PI * 0.38, 'rgba(192, 132, 252, 0.4)', '#a855f7', '#ffffff', 13);
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(54 + strike * 12, -26 + bob, 8 + strike * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 56 + strike * 12, -26 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Low-Sweeping Rising Whip Lash!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -24 + bob, 44 + strike * 10, Math.PI * 0.55, -Math.PI * 0.35, 'rgba(168, 85, 247, 0.42)', '#9333ea', '#fde047', 15);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 60 + strike * 10, -20 + bob, 8);
        } else {
          // Hit 3: Dual-Whip Twin X-Cleave!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 48 + strike * 10, -Math.PI * 0.58, Math.PI * 0.35, 'rgba(147, 51, 234, 0.45)', '#a855f7', '#ffffff', 15);
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 44 + strike * 8, Math.PI * 0.58, -Math.PI * 0.35, 'rgba(232, 121, 249, 0.4)', '#d946ef', '#fde047', 13);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 64 + strike * 12, -38 + bob, 10.5);
        }
      } else if (this.attackType === 'K') {
        // Purple Whirlwind Spin-Dash Launch!
        this.drawCrescentSlash(ctx, 4, -26 + bob, 36 + strike * 8, -Math.PI * 0.7, Math.PI * 0.8, 'rgba(192, 132, 252, 0.42)', '#a855f7', '#ffffff', 12);
      } else if (this.attackType === 'L') {
        // Violet Whip Geyser Ground Shockwave & Crystal Burst!
        this.drawCrescentSlash(ctx, 36 + strike * 8, -20 + bob, 38 + strike * 8, -Math.PI * 0.48, Math.PI * 0.48, 'rgba(192, 132, 252, 0.45)', '#9333ea', '#fde047', 15);
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 62 + strike * 8, -20 + bob, 10);
      }
    } else if (c === 'pearl') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Multi-Jab Holographic Fencing Flurry (3 rapid cyan-white needle cones)!
          const baseReach = 50 + strike * 24;
          const offsets = [
            { dy: 0, dx: 8, w: 5.5, col: '#ffffff' },
            { dy: -11, dx: -4, w: 4, col: '#67e8f9' },
            { dy: 10, dx: -2, w: 4, col: '#bae6fd' }
          ];
          this.drawSpeedLines(ctx, 18, -50 + bob, baseReach - 14, 22, 4, '#67e8f9');
          for (let j = 0; j < offsets.length; j++) {
            const o = offsets[j];
            const tx = baseReach + o.dx;
            const ty = -50 + bob + o.dy;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.beginPath();
            ctx.moveTo(22, ty - o.w);
            ctx.lineTo(tx, ty);
            ctx.lineTo(22, ty + o.w);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = o.col;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(24, ty);
            ctx.lineTo(tx + 3, ty);
            ctx.stroke();
          }
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, baseReach + 10, -50 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Graceful Two-Handed Halberd Crescent Sweep!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -46 + bob, 40 + strike * 10, -Math.PI * 0.55, Math.PI * 0.45, 'rgba(56, 189, 248, 0.4)', '#06b6d4', '#ffffff', 14);
          ctx.fillStyle = '#a5f3fc';
          this.drawMiniStar(ctx, 58 + strike * 10, -46 + bob, 7.5);
        } else {
          // Hit 3: 360-Degree Ballet Pirouette Spear Halo Ribbon!
          this.drawCrescentSlash(ctx, 14 + strike * 8, -48 + bob, 46 + strike * 8, -Math.PI * 0.85, Math.PI * 0.55, 'rgba(56, 189, 248, 0.42)', '#38bdf8', '#ffffff', 14);
          this.drawCrescentSlash(ctx, 14 + strike * 8, -48 + bob, 42 + strike * 6, Math.PI * 0.25, Math.PI * 1.55, 'rgba(253, 186, 116, 0.35)', '#fb923c', '#ffffff', 10);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 58 + strike * 10, -48 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Spear Plasma Laser Muzzle Burst!
        this.drawSpeedLines(ctx, 22, -50 + bob, 44, 16, 3, '#67e8f9');
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 52 + strike * 8, -50 + bob, 8);
      } else if (this.attackType === 'L') {
        // Holo-Pearl Summoning Diamond Projection Grid!
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(38, -42 + bob, 28 + strike * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#bae6fd';
        this.drawDiamondInsignia(ctx, 38, -42 + bob, 11);
      }
    } else if (c === 'bismuth') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Spiked War-Hammer Heavy Forge Swing!
          this.drawCrescentSlash(ctx, 24 + strike * 8, -36 + bob, 38 + strike * 8, -Math.PI * 0.55, Math.PI * 0.30, 'rgba(249, 115, 22, 0.45)', '#f97316', '#fde047', 15);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 54 + strike * 8, -22 + bob, 7.5);
        } else if (combo === 1) {
          // Hit 2: Double Crescent Battle-Axe Cleave!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -38 + bob, 44 + strike * 10, -Math.PI * 0.60, Math.PI * 0.42, 'rgba(234, 88, 12, 0.48)', '#ea580c', '#ffffff', 17);
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 60 + strike * 10, -34 + bob, 8.5);
        } else {
          // Hit 3: Overhead Molten Anvil-Maul Tectonic Smash!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -34 + bob, 50 + strike * 10, -Math.PI * 0.72, Math.PI * 0.28, 'rgba(194, 65, 12, 0.52)', '#dc2626', '#fde047', 19);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(54 + strike * 8, -3, 24 + strike * 8, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 58 + strike * 10, -8 + bob, 11.5);
        }
      } else if (this.attackType === 'K') {
        // Forge Ingot Hurl Burst!
        this.drawSpeedLines(ctx, 16, -44 + bob, 42, 20, 4, '#fb923c');
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 48 + strike * 8, -44 + bob, 8);
      } else if (this.attackType === 'L') {
        // Breaking Point Armor-Piercing Pneumatic Shock-Cone!
        this.drawSpeedLines(ctx, 14, -42 + bob, 54, 24, 5, '#ef4444');
        ctx.fillStyle = 'rgba(239, 68, 68, 0.52)';
        ctx.beginPath();
        ctx.moveTo(22, -62 + bob);
        ctx.lineTo(72 + strike * 12, -42 + bob);
        ctx.lineTo(22, -22 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 68 + strike * 12, -42 + bob, 11);
      }
    } else if (c === 'peridot') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Triple Ferrokinetic Claw Rake (3 parallel lime-green tapered arcs)!
          for (let r = -1; r <= 1; r++) {
            this.drawCrescentSlash(ctx, 20 + strike * 8, -38 + bob + r * 9, 30 + strike * 6, -Math.PI * 0.42, Math.PI * 0.35, 'rgba(132, 204, 22, 0.35)', '#84cc16', '#ecfccb', 7);
          }
          ctx.fillStyle = '#bef264';
          this.drawMiniStar(ctx, 50 + strike * 8, -38 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Levitating Steel I-Beam Wide Magnetic Sweep!
          this.drawCrescentSlash(ctx, 24 + strike * 10, -38 + bob, 40 + strike * 8, Math.PI * 0.45, -Math.PI * 0.50, 'rgba(101, 163, 13, 0.42)', '#84cc16', '#ffffff', 14);
          ctx.fillStyle = '#fde047';
          this.drawDiamondInsignia(ctx, 56 + strike * 10, -48 + bob, 7.5);
        } else {
          // Hit 3: Magnetic Crusher Jaws Converging Pincer Arcs!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 40 + strike * 8, -Math.PI * 0.62, Math.PI * 0.12, 'rgba(132, 204, 22, 0.45)', '#65a30d', '#fde047', 13);
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 40 + strike * 8, Math.PI * 0.62, -Math.PI * 0.12, 'rgba(132, 204, 22, 0.45)', '#84cc16', '#ffffff', 13);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 62 + strike * 10, -38 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Magnetic Tractor Rings!
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.ellipse(32 + strike * 10, -38 + bob, 7, 18, 0, 0, Math.PI * 2);
        ctx.ellipse(46 + strike * 14, -38 + bob, 5, 13, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // EMP Magnetic Vortex Concentric Rings!
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(32, -36 + bob, 26 + strike * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ecfccb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, -36 + bob, 16 + strike * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 32, -36 + bob, 8.5);
      }
    } else if (c === 'lapis') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Crescent Hydro-Scythe Slash + Seafoam Spray!
          this.drawCrescentSlash(ctx, 22 + strike * 8, -40 + bob, 36 + strike * 8, -Math.PI * 0.48, Math.PI * 0.45, 'rgba(56, 189, 248, 0.45)', '#0284c7', '#e0f2fe', 14);
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(54 + strike * 10, -24 + bob, 3.2, 0, Math.PI * 2);
          ctx.arc(58 + strike * 10, -52 + bob, 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (combo === 1) {
          // Hit 2: Surging Giant Water Fist Rising Crest!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -44 + bob, 42 + strike * 8, Math.PI * 0.38, -Math.PI * 0.62, 'rgba(2, 132, 199, 0.48)', '#0ea5e9', '#ffffff', 16);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 58 + strike * 10, -56 + bob, 7.5);
        } else {
          // Hit 3: Coiling Dual Ocean Dragon Tendrils Smash!
          this.drawCrescentSlash(ctx, 30 + strike * 12, -36 + bob, 50 + strike * 10, -Math.PI * 0.58, Math.PI * 0.44, 'rgba(14, 165, 233, 0.5)', '#0369a1', '#e0f2fe', 18);
          this.drawCrescentSlash(ctx, 24 + strike * 8, -36 + bob, 36 + strike * 6, -Math.PI * 0.45, Math.PI * 0.35, 'rgba(125, 211, 252, 0.42)', '#38bdf8', '#ffffff', 11);
          ctx.fillStyle = '#e0f2fe';
          this.drawMiniStar(ctx, 68 + strike * 12, -36 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Pressurized Hydro Jet Stream Lance!
        this.drawSpeedLines(ctx, 18, -42 + bob, 48, 16, 4, '#38bdf8');
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.ellipse(36 + strike * 10, -42 + bob, 7, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // Roaring Tsunami Wave Crest with Whitecap Foam!
        this.drawCrescentSlash(ctx, 34 + strike * 10, -36 + bob, 42 + strike * 8, -Math.PI * 0.48, Math.PI * 0.62, 'rgba(2, 132, 199, 0.52)', '#0284c7', '#ffffff', 18);
      }
    } else if (c === 'rose') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Graceful Rose Broadsword Cleave + Drifting Petals!
          this.drawCrescentSlash(ctx, 22 + strike * 8, -42 + bob, 38 + strike * 8, -Math.PI * 0.52, Math.PI * 0.38, 'rgba(244, 63, 94, 0.4)', '#f43f5e', '#ffffff', 14);
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(52 + strike * 8, -28 + bob, 4.2, 2.2, 0.5, 0, Math.PI * 2);
          ctx.ellipse(46 + strike * 8, -58 + bob, 3.8, 2.0, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 54 + strike * 8, -38 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Valkyrie Thorny Shield Bash Shockwave!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -40 + bob, 44 + strike * 8, -Math.PI * 0.45, Math.PI * 0.45, 'rgba(225, 29, 72, 0.45)', '#ec4899', '#ffffff', 16);
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 60 + strike * 10, -40 + bob, 8);
        } else {
          // Hit 3: Celestial Rising Rose Vortex Cleave!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 50 + strike * 10, -Math.PI * 0.68, Math.PI * 0.38, 'rgba(219, 39, 119, 0.48)', '#f43f5e', '#ffffff', 18);
          this.drawCrescentSlash(ctx, 22 + strike * 8, -38 + bob, 36 + strike * 6, Math.PI * 0.42, -Math.PI * 0.55, 'rgba(251, 207, 232, 0.42)', '#f9a8d4', '#fde047', 11);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 66 + strike * 10, -32 + bob, 10);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 48 + strike * 8, -68 + bob, 7.5);
        }
      } else if (this.attackType === 'K') {
        // Spiraling Rose Petal Wave Release!
        this.drawCrescentSlash(ctx, 26 + strike * 8, -42 + bob, 34 + strike * 6, -Math.PI * 0.5, Math.PI * 0.5, 'rgba(244, 114, 182, 0.4)', '#f43f5e', '#ffffff', 12);
      } else if (this.attackType === 'L') {
        // Sacred Healing Tears Divine Light Halo & Blooming Petals!
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.92)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -42 + bob, 44 + strike * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#fbcfe8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -42 + bob, 32 + strike * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, -42 + bob, 9.5);
      }
    }

    ctx.restore();
  }
}

