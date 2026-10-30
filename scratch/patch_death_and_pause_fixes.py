import sys

with open('game.js', 'r') as f:
    code = f.read()

# -------------------------------------------------------------
# 1. PlayerHero constructor: add fallen state attributes
# -------------------------------------------------------------
t1 = """    // Canonical Gem Fusion Attributes
    this.isFusion = false;
    this.fusionKey = null;
    this.fusionData = null;
    this.isMergedInFusion = false;
    this.hasSynergyBuff = false;
  }"""

r1 = """    // Canonical Gem Fusion Attributes
    this.isFusion = false;
    this.fusionKey = null;
    this.fusionData = null;
    this.isMergedInFusion = false;
    this.hasSynergyBuff = false;

    // Lore-Accurate Knockout & Gem Poofing System
    this.isFallen = false;
    this.fallenType = null; // 'lie_down' for Steven/Connie, 'poofed' for Gems
    this.fallenTimer = 0;
  }"""

assert t1 in code, "Target 1 not found!"
code = code.replace(t1, r1, 1)

# -------------------------------------------------------------
# 2. PlayerHero.switchCharacter: reset fallen state & add revive()
# -------------------------------------------------------------
t2 = """      this.isFusion = false;
      this.fusionKey = null;
      this.fusionData = null;
      this.isMergedInFusion = false;
      this.hasSynergyBuff = false;
      this.actionType = null;
      this.actionTimer = 0;
      this.vx = 0;
      if (audioEngine) audioEngine.playSfx('switch');"""

r2 = """      this.isFusion = false;
      this.fusionKey = null;
      this.fusionData = null;
      this.isMergedInFusion = false;
      this.hasSynergyBuff = false;
      this.isFallen = false;
      this.fallenType = null;
      this.fallenTimer = 0;
      this.actionType = null;
      this.actionTimer = 0;
      this.vx = 0;
      if (audioEngine) audioEngine.playSfx('switch');"""

assert t2 in code, "Target 2 not found!"
code = code.replace(t2, r2, 1)

t2b = """  deactivatePinkOverdrive(audioEngine, particles) {
    this.isPinkOverdrive = false;
    this.pinkOverdriveTimer = 0;
    if (particles) {
      particles.addDamageText(this.x, this.y - 65, 'OVERDRIVE ENDED', false, '#cbd5e1');
    }
  }"""

r2b = """  deactivatePinkOverdrive(audioEngine, particles) {
    this.isPinkOverdrive = false;
    this.pinkOverdriveTimer = 0;
    if (particles) {
      particles.addDamageText(this.x, this.y - 65, 'OVERDRIVE ENDED', false, '#cbd5e1');
    }
  }

  revive(audioEngine, particles) {
    this.isFallen = false;
    this.fallenType = null;
    this.fallenTimer = 0;
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
  }"""

assert t2b in code, "Target 2b not found!"
code = code.replace(t2b, r2b, 1)

# -------------------------------------------------------------
# 3. PlayerHero.update: handle fallen state (freeze & gravity landing)
# -------------------------------------------------------------
t3 = """  update(dt, input, audioEngine, particles, projectiles, pickups, platforms = []) {
    // Cooldown decrements"""

r3 = """  update(dt, input, audioEngine, particles, projectiles, pickups, platforms = []) {
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

    // Cooldown decrements"""

assert t3 in code, "Target 3 not found!"
code = code.replace(t3, r3, 1)

# -------------------------------------------------------------
# 4. PlayerHero.takeDamage: cannot take damage if fallen
# -------------------------------------------------------------
t4 = """  takeDamage(amount, particles, audioEngine) {
    if (this.invulnerableTimer > 0 || this.isShielding || this.isSpinDashing) return false;"""

r4 = """  takeDamage(amount, particles, audioEngine) {
    if (this.isFallen) return false;
    if (this.invulnerableTimer > 0 || this.isShielding || this.isSpinDashing) return false;"""

assert t4 in code, "Target 4 not found!"
code = code.replace(t4, r4, 1)

# -------------------------------------------------------------
# 5. PlayerHero.draw & drawFallenHero
# -------------------------------------------------------------
t5 = """  draw(ctx) {
    if (this.isMergedInFusion) return;

    if (this.isFusion && this.fusionData) {
      this.drawFusionHero(ctx);
      return;
    }"""

r5 = """  draw(ctx) {
    if (this.isMergedInFusion) return;

    if (this.isFallen) {
      this.drawFallenHero(ctx);
      return;
    }

    if (this.isFusion && this.fusionData) {
      this.drawFusionHero(ctx);
      return;
    }"""

assert t5 in code, "Target 5 not found!"
code = code.replace(t5, r5, 1)

# Insert drawFallenHero right before drawFusionHero
t5b = """  drawFusionHero(ctx) {"""
r5b = """  drawFallenHero(ctx) {
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

        // Connie's dark long hair resting on ground
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(18, -8, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Face
        ctx.fillStyle = '#9a3412';
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
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 55, lyingY - 48, 110, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 9px "Rubik", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💔 ${heroName} DOWN (0 HP)`, this.x, lyingY - 36);

    } else {
      // -------------------------------------------------------------
      // FULL GEM POOFED: PHYSICAL BODY GONE, AUTHENTIC GEMSTONE ON FLOOR
      // -------------------------------------------------------------
      const gemY = this.y - 6;
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

      const sparkY = gemY - 14 - ((this.fallenTimer * 18) % 18);
      ctx.fillStyle = gemInfo.color;
      ctx.beginPath();
      ctx.arc(this.x + Math.sin(this.fallenTimer * 5) * 6, sparkY, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = gemInfo.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 70, gemY - 42, 140, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Rubik", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💎 ${gemInfo.name} POOFED`, this.x, gemY - 30);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '7.5px "Rubik", "Outfit", sans-serif';
      ctx.fillText('(Revives Next Stage)', this.x, gemY - 22);
    }

    ctx.restore();
  }

  drawFusionHero(ctx) {"""

assert t5b in code, "Target 5b not found!"
code = code.replace(t5b, r5b, 1)

# -------------------------------------------------------------
# 6. EnemyManager: Target closest living player (ignore fallen)
# -------------------------------------------------------------
t6 = """      // Target closest player in 2-Player mode
      let targetPlayer = player;
      if (player2) {
        targetPlayer = (Math.abs(player.x - e.x) < Math.abs(player2.x - e.x)) ? player : player2;
      }"""

r6 = """      // Target closest living player in 2-Player mode (ignore fallen heroes!)
      let targetPlayer = player;
      if (player2) {
        if (!player.isFallen && !player2.isFallen) {
          targetPlayer = (Math.abs(player.x - e.x) < Math.abs(player2.x - e.x)) ? player : player2;
        } else if (player.isFallen && !player2.isFallen) {
          targetPlayer = player2;
        } else if (!player.isFallen && player2.isFallen) {
          targetPlayer = player;
        }
      }"""

assert t6 in code, "Target 6 not found!"
code = code.replace(t6, r6, 1)

# -------------------------------------------------------------
# 7. StevenUniverseGame constructor: add wave controller variables
# -------------------------------------------------------------
t7 = """    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    this.keysP1 = {"""

r7 = """    this.p1HarmonyReadyTime = 0;
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

    this.keysP1 = {"""

assert t7 in code, "Target 7 not found!"
code = code.replace(t7, r7, 1)

# -------------------------------------------------------------
# 8. StevenUniverseGame: startPracticeDojo & startStageWave & wave sequence
# -------------------------------------------------------------
t8 = """  startPracticeDojo() {
    const badge = document.getElementById('hudStageBadge');
    if (badge) badge.textContent = 'PRACTICE';
    const objText = document.getElementById('hudObjectiveText');
    if (objText) objText.textContent = 'Practice Mode: Infinite HP Training Dummy. Practice combos, juggles & Overdrives freely!';

    const bossHud = document.getElementById('bossHud');
    if (bossHud) {
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
  }"""

r8 = """  startPracticeDojo() {
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
  }"""

assert t8 in code, "Target 8 not found!"
code = code.replace(t8, r8, 1)

# Now startStageWave & wave sequence
t9 = """    const badge = document.getElementById('hudStageBadge');
    if (badge) badge.textContent = stageTitle;
    const objText = document.getElementById('hudObjectiveText');
    if (objText) objText.textContent = stageObj;

    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.reset(this.stageIndex, diff, this.pickups);

    // Start Multi-Wave Progression (4 Waves + Final Boss Wave)
    this.startEpisodeWaveSequence();
  }

  startEpisodeWaveSequence() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    this.enemyManager.wave = 1;
    this.enemyManager.maxWaves = epData.waves.length;
    this.spawnWaveIndex(0);
  }

  spawnWaveIndex(waveIdx) {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData || waveIdx >= epData.waves.length) {
      // All preliminary waves cleared: Summon Final Boss!
      this.spawnFinalBossWave();
      return;
    }

    const currentWaveData = epData.waves[waveIdx];
    this.enemyManager.wave = waveIdx + 1;
    this.updateWaveLine();

    // Trigger PvZ-Style "Huge Wave is Approaching" on huge waves!
    if (currentWaveData.isHugeWave) {
      this.triggerWaveWarning("⚠️ A HUGE WAVE OF CORRUPTED GEMS IS APPROACHING! ⚠️", false);
    }

    // Spawn enemies across the wide 2600px stage (surrounding players from both flanks)
    const enemies = currentWaveData.enemies;
    enemies.forEach((enemyType, idx) => {
      setTimeout(() => {
        if (this.state !== 'playing') return;
        // Alternate spawn positions between left flank (X: 300 - 800) and right flank (X: 1800 - 2400)
        const spawnX = (idx % 2 === 0)
          ? 320 + Math.random() * 500
          : 1800 + Math.random() * 550;
        this.enemyManager.spawnEnemy(enemyType, spawnX);
      }, idx * 650);
    });

    // Check periodically for wave clearance
    const checkInterval = setInterval(() => {
      if (this.state !== 'playing') {
        clearInterval(checkInterval);
        return;
      }
      if (this.enemyManager.enemies.length === 0) {
        clearInterval(checkInterval);
        setTimeout(() => {
          if (this.state === 'playing') {
            this.spawnWaveIndex(waveIdx + 1);
          }
        }, 1200);
      }
    }, 500);
  }

  spawnFinalBossWave() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    this.enemyManager.wave = epData.waves.length + 1;
    this.updateWaveLine();

    // Dramatic Boss Intro Warning Banner
    this.triggerWaveWarning(`⚡ FINAL BOSS: ${epData.bossName}! ⚡`, true);

    setTimeout(() => {
      if (this.state !== 'playing') return;
      // Spawn Boss in central arena
      this.enemyManager.spawnEnemy(epData.boss, 1350);

      // Top-Center Boss Bar
      const bossHud = document.getElementById('bossHud');
      if (bossHud) {
        bossHud.style.display = 'flex';
        const nameEl = document.getElementById('bossName');
        if (nameEl) nameEl.textContent = epData.bossName;
      }
    }, 1200);
  }"""

r9 = """    const badge = document.getElementById('hudStageBadge');
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

    // Start Multi-Wave Progression (4 Waves + Final Boss Wave)
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

    this.waveIndex = waveIdx;
    const currentWaveData = epData.waves[waveIdx];
    this.enemyManager.wave = waveIdx + 1;
    this.updateWaveLine();

    // Trigger PvZ-Style "Huge Wave is Approaching" on huge waves!
    if (currentWaveData.isHugeWave) {
      this.triggerWaveWarning("⚠️ A HUGE WAVE OF CORRUPTED GEMS IS APPROACHING! ⚠️", false);
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

    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;
  }

  prepareBossWave() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    this.waveSpawnQueue = [];
    this.enemyManager.wave = epData.waves.length + 1;
    this.updateWaveLine();

    // Dramatic Boss Intro Warning Banner
    this.triggerWaveWarning(`⚡ FINAL BOSS: ${epData.bossName}! ⚡`, true);
    this.isBossSpawning = true;
    this.bossSpawnTimer = 1.2;
  }

  knockoutOrPoofPlayer(hero) {
    if (!hero || hero.isFallen) return;

    // Cleanly defuse if merged in fusion
    if (this.isFused) {
      this.finishTagTeamHyperAttack();
    }

    hero.isFallen = true;
    hero.fallenTimer = 0;
    hero.vx = 0;
    hero.isAttacking = false;
    hero.isShielding = false;
    hero.isSpinDashing = false;
    hero.isDodging = false;
    hero.invulnerableTimer = 999;

    const isHumanoid = (hero.activeChar === 'steven' || hero.activeChar === 'connie');
    hero.fallenType = isHumanoid ? 'lie_down' : 'poofed';

    if (isHumanoid) {
      this.audio.playSfx('hit');
      this.particles.addDamageText(hero.x, hero.y - 70, `${hero.activeChar === 'steven' ? 'STEVEN' : 'CONNIE'} IS DOWN! 💫`, true, '#f43f5e');
      this.particles.addSparkle(hero.x, hero.y - 25, '#fbbf24', 16, 4);
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
      this.particles.addSparkle(hero.x, hero.y - 25, col, 24, 7);
      this.particles.addDamageText(hero.x, hero.y - 70, `${hero.activeChar.toUpperCase()} POOFED! 💎 (REVIVES NEXT STAGE)`, true, col);
    }

    this.checkTeamWipe();
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
  }"""

assert t9 in code, "Target 9 not found!"
code = code.replace(t9, r9, 1)

# -------------------------------------------------------------
# 10. update(dt): Drive wave progression & handle knockout/poof
# -------------------------------------------------------------
t10 = """    // 1. Update Players (or Tag-Team Hyper Fusion Attack)
    if (this.isHyperAttack) {
      this.updateHyperAttack(dt, platforms);
    } else {
      this.player.update(dt, this.keysP1, this.audio, this.particles, this.projectiles, this.pickups, platforms);

      if (this.playerMode === '2p' && this.player2) {
        this.player2.update(dt, this.keysP2, this.audio, this.particles, this.projectiles, this.pickups, platforms);
      }
    }"""

r10 = """    // --- WAVE CONTROLLER (Delta-Time Driven, Immune to Pauses & Idling) ---
    if (this.gameMode !== 'practice' && this.stageIndex > 0) {
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
                this.prepareWave(this.waveIndex + 1);
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
    } else {
      this.player.update(dt, this.keysP1, this.audio, this.particles, this.projectiles, this.pickups, platforms);

      if (this.playerMode === '2p' && this.player2) {
        this.player2.update(dt, this.keysP2, this.audio, this.particles, this.projectiles, this.pickups, platforms);
      }
    }"""

assert t10 in code, "Target 10 not found!"
code = code.replace(t10, r10, 1)

# Pickups: Only living players can collect
t10b = """      if (nearPlayer) {
        if (p.type === 'cookie' || p.type === 'heart') {
          if (nearPlayer.playerId === 'p2') {
            this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + 1);
          } else {
            this.currentHearts = Math.min(this.maxHearts, this.currentHearts + 1);
          }
          this.particles.addSparkle(nearPlayer.x, nearPlayer.y - 30, '#ff4d79', 16, 5);
          const txt = (p.type === 'heart') ? '+1 HEART! ❤️' : '+1 HEART (COOKIE CAT!)';
          this.particles.addDamageText(nearPlayer.x, nearPlayer.y - 50, txt, false, '#ff2a6d');
          this.audio.playSfx('cookie');
        }
        this.score += 150;
        this.addFusionSync(15);
        this.pickups.splice(i, 1);
        this.updateHUD();
      }"""

r10b = """      if (nearPlayer) {
        if (p.type === 'cookie' || p.type === 'heart') {
          if (!nearPlayer.isFallen) {
            if (nearPlayer.playerId === 'p2') {
              this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + 1);
            } else {
              this.currentHearts = Math.min(this.maxHearts, this.currentHearts + 1);
            }
            this.particles.addSparkle(nearPlayer.x, nearPlayer.y - 30, '#ff4d79', 16, 5);
            const txt = (p.type === 'heart') ? '+1 HEART! ❤️' : '+1 HEART (COOKIE CAT!)';
            this.particles.addDamageText(nearPlayer.x, nearPlayer.y - 50, txt, false, '#ff2a6d');
            this.audio.playSfx('cookie');
            this.score += 150;
            this.addFusionSync(15);
            this.pickups.splice(i, 1);
            this.updateHUD();
          }
        } else {
          this.score += 150;
          this.addFusionSync(15);
          this.pickups.splice(i, 1);
          this.updateHUD();
        }
      }"""

assert t10b in code, "Target 10b not found!"
code = code.replace(t10b, r10b, 1)

# Projectiles: Ignore fallen players & trigger knockoutOrPoofPlayer
t10c = """      if (p.type.startsWith('enemy')) {
        for (const pl of players) {
          const dist = Math.hypot(p.x - pl.x, p.y - (pl.y - 35));
          if (dist < (p.radius || 15) + 20) {
            const damaged = pl.takeDamage(p.damage || 1, this.particles, this.audio);
            if (damaged) {
              if (pl.playerId === 'p2') {
                this.currentHeartsP2 = Math.max(0, this.currentHeartsP2 - (p.damage || 1));
              } else {
                this.currentHearts = Math.max(0, this.currentHearts - (p.damage || 1));
              }
              this.updateHUD();
              if (this.currentHearts <= 0 && (!this.player2 || this.currentHeartsP2 <= 0)) {
                this.handleGameOver();
              }
            }
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }"""

r10c = """      if (p.type.startsWith('enemy')) {
        for (const pl of players) {
          if (pl.isFallen) continue;
          const hitRad = p.radius || (p.width ? p.width / 2 : 15);
          const dist = Math.hypot(p.x - pl.x, p.y - (pl.y - 35));
          if (dist < hitRad + 20) {
            const damaged = pl.takeDamage(p.damage || 1, this.particles, this.audio);
            if (damaged) {
              if (pl.playerId === 'p2') {
                this.currentHeartsP2 = Math.max(0, this.currentHeartsP2 - (p.damage || 1));
                if (this.currentHeartsP2 <= 0) {
                  this.knockoutOrPoofPlayer(pl);
                }
              } else {
                this.currentHearts = Math.max(0, this.currentHearts - (p.damage || 1));
                if (this.currentHearts <= 0) {
                  this.knockoutOrPoofPlayer(pl);
                }
              }
              this.updateHUD();
              this.checkTeamWipe();
            }
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }"""

assert t10c in code, "Target 10c not found!"
code = code.replace(t10c, r10c, 1)

# Health safety check at end of update(dt)
t10d = """    // 5. Gem Bubbling: Auto-collect poofed gems on proximity / touch
    this.autoCollectBubbledGems();"""

r10d = """    // Player Defeat Verification (Steven/Connie Down, Gems Poofed)
    if (this.currentHearts <= 0 && !this.player.isFallen) {
      this.knockoutOrPoofPlayer(this.player);
    }
    if (this.player2 && this.currentHeartsP2 <= 0 && !this.player2.isFallen) {
      this.knockoutOrPoofPlayer(this.player2);
    }

    // 5. Gem Bubbling: Auto-collect poofed gems on proximity / touch
    this.autoCollectBubbledGems();"""

assert t10d in code, "Target 10d not found!"
code = code.replace(t10d, r10d, 1)

# -------------------------------------------------------------
# 11. advanceToNextStage: Revive both players for next stage
# -------------------------------------------------------------
t11 = """    setTimeout(() => {
      if (banner) banner.style.display = 'none';
      this.stageIndex++;
      this.currentHearts = this.maxHearts;
      this.currentHeartsP2 = this.maxHearts;
      this.isTransitioning = false;
      this.updateHUD();
      this.startStageWave();
    }, 2400);"""

r11 = """    setTimeout(() => {
      if (banner) banner.style.display = 'none';
      this.stageIndex++;
      this.currentHearts = this.maxHearts;
      this.currentHeartsP2 = this.maxHearts;
      this.player.revive(this.audio, this.particles);
      if (this.player2) this.player2.revive(this.audio, this.particles);
      this.isTransitioning = false;
      this.updateHUD();
      this.startStageWave();
    }, 2400);"""

assert t11 in code, "Target 11 not found!"
code = code.replace(t11, r11, 1)

# -------------------------------------------------------------
# 12. triggerFusion: Disallow fusion if partner is fallen
# -------------------------------------------------------------
t12 = """    let fusion = null;
    if (this.playerMode === '2p' && this.player2) {"""

r12 = """    if (this.player.isFallen || (this.playerMode === '2p' && this.player2 && this.player2.isFallen)) {
      this.audio.playSfx('hit');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚠️ CANNOT FUSE: PARTNER IS DOWN!', true, '#ef4444');
      return;
    }

    let fusion = null;
    if (this.playerMode === '2p' && this.player2) {"""

assert t12 in code, "Target 12 not found!"
code = code.replace(t12, r12, 1)

# -------------------------------------------------------------
# 13. Escape key & Guardian Select Auto-Lock / Auto-Save
# -------------------------------------------------------------
t13 = """      if (e.code === 'Escape') {
        if (this.state === 'playing') {
          this.state = 'paused';
          document.getElementById('pauseScreen').style.display = 'flex';
        } else if (this.state === 'paused') {
          this.state = 'playing';
          document.getElementById('pauseScreen').style.display = 'none';
        }
      }"""

r13 = """      if (e.code === 'Escape') {
        // If Guardian Select Modal is open, auto-save and close
        const charModal = document.getElementById('characterSelectScreen');
        if (charModal && charModal.style.display !== 'none' && charModal.style.display !== '') {
          if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
            this.selectedCharP2 = this.tempSelectedChar || this.selectedCharP2;
            SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
          } else {
            this.selectedCharP1 = this.tempSelectedChar || this.selectedCharP1;
            this.selectedChar = this.selectedCharP1;
            SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
          }
          this.updateLobbyGuardian();
          charModal.style.display = 'none';
          this.audio.playSfx('cookie');
          return;
        }

        // If Settings Modal is open, auto-save and close
        const settingsModal = document.getElementById('settingsScreen');
        if (settingsModal && settingsModal.style.display !== 'none' && settingsModal.style.display !== '') {
          SafeStorage.setItem('su_fastPerf', this.fastPerfMode ? '1' : '0');
          SafeStorage.setItem('su_screenShake', this.screenShakeEnabled ? '1' : '0');
          SafeStorage.setItem('su_mobileTouch', this.isRealMobile ? '1' : '0');
          settingsModal.style.display = 'none';
          this.audio.playSfx('cookie');
          return;
        }

        // If Other modals open, close them
        const otherModals = ['controlsScreen', 'creditsScreen', 'fusionGuideScreen'];
        for (const modalId of otherModals) {
          const m = document.getElementById(modalId);
          if (m && m.style.display !== 'none' && m.style.display !== '') {
            m.style.display = 'none';
            return;
          }
        }

        // In-game Pause Toggle with clean lastTime synchronization
        if (this.state === 'playing') {
          this.state = 'paused';
          document.getElementById('pauseScreen').style.display = 'flex';
        } else if (this.state === 'paused') {
          this.state = 'playing';
          this.lastTime = performance.now();
          document.getElementById('pauseScreen').style.display = 'none';
        }
      }"""

assert t13 in code, "Target 13 not found!"
code = code.replace(t13, r13, 1)

# In character select grid item click: Auto-save immediately upon click
t14 = """    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
      item.addEventListener('click', () => {
        this.audio.init();
        document.querySelectorAll('.char-grid-item[data-char]').forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        this.tempSelectedChar = item.dataset.char;
        this.updateCharPreview(this.tempSelectedChar);
        this.audio.playSfx('cookie');
      });
    });"""

r14 = """    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
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

        this.audio.playSfx('cookie');
      });
    });"""

assert t14 in code, "Target 14 not found!"
code = code.replace(t14, r14, 1)

# btnCloseCharSelect: Auto-save on modal close
t15 = """    safeClick('btnCloseCharSelect', () => {
      if (charModal) charModal.style.display = 'none';
    });"""

r15 = """    safeClick('btnCloseCharSelect', () => {
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
    });"""

assert t15 in code, "Target 15 not found!"
code = code.replace(t15, r15, 1)

# btnResume: synchronize lastTime
t16 = """    safeClick('btnResume', () => {
      this.state = 'playing';
      const ps = document.getElementById('pauseScreen');
      if (ps) ps.style.display = 'none';
    });"""

r16 = """    safeClick('btnResume', () => {
      this.state = 'playing';
      this.lastTime = performance.now();
      const ps = document.getElementById('pauseScreen');
      if (ps) ps.style.display = 'none';
    });"""

assert t16 in code, "Target 16 not found!"
code = code.replace(t16, r16, 1)

with open('game.js', 'w') as f:
    f.write(code)

print("SUCCESS: All 16 targets replaced cleanly in game.js!")
