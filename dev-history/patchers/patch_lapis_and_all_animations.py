import re

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update executeSkillL for Lapis
old_lapis_skill = """    } else if (this.activeChar === 'lapis') {
      // Water Wings Tidal Surge!
      this.actionType = 'skill';
      this.actionDuration = 0.50;
      this.actionTimer = 0.50;
      audioEngine.playSfx('water');
      projectiles.push({
        x: this.x + this.facing * 30,
        y: this.groundY - 55,
        vx: this.facing * 480,
        vy: 0,
        width: 45,
        height: 80,
        damage: Math.round(60 * dmgMult),
        type: 'tidalWave',
        color: '#0284c7',
        life: 1.4
      });
      particles.addSparkle(this.x, this.y - 40, '#38bdf8', 24, 7);"""

new_lapis_skill = """    } else if (this.activeChar === 'lapis') {
      // Water Wings Tidal Surge! Towering 140px Tsunami Sweeps Battlefield!
      this.actionType = 'skill';
      this.actionDuration = 0.60;
      this.actionTimer = 0.60;
      audioEngine.playSfx('water');
      const waveFacing = this.facing;
      projectiles.push({
        x: this.x + waveFacing * 40,
        y: this.groundY - 65,
        vx: waveFacing * 500,
        vy: 0,
        facing: waveFacing,
        width: 95,
        height: 145,
        radius: 72,
        damage: Math.round(68 * dmgMult),
        type: 'tidalWave',
        color: '#0284c7',
        life: 1.6,
        maxLife: 1.6
      });
      particles.addSparkle(this.x, this.y - 45, '#38bdf8', 28, 8);
      particles.addSparkle(this.x, this.y - 45, '#e0f2fe', 20, 6);
      particles.addDamageText(this.x, this.y - 80, '🌊 TIDAL SURGE!', true, '#0284c7');"""

assert old_lapis_skill in code, "old_lapis_skill not found"
code = code.replace(old_lapis_skill, new_lapis_skill, 1)
print("1. Updated executeSkillL for Lapis")

# 2. Fix collision checking and throttling bug in checkPlayerAttackCollisions
old_collision_block = """      // Throttle persistent AoE projectiles so they do not deal damage on every single frame
      const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash');
      if (isPersistentAoE) {
        p.hitMap = p.hitMap || new Map();
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const lastHit = p.hitMap.get(e) || 0;
        if (now - lastHit < 300) {
          continue; // Enemy recently hit by this AoE hitbox; do not spam damage
        }
        p.hitMap.set(e, now);
      }

      const dist = Math.hypot(p.x - e.x, p.y - (e.y - e.height / 2));
      if (dist < (p.radius || 20) + (e.width / 2)) {
        this.damageEnemy(e, p.damage || 25, particles, audioEngine, onPoofed, enemyIndex);
        particles.addSparkle(p.x, p.y, p.color || '#fff', 8, 4);

        // Specific Knockbacks based on lore weapons
        if (p.type === 'jasperCrashHelmet') {"""

new_collision_block = """      // 1. Determine hit detection based on projectile geometry (AABB for waves/shockwaves, radial for projectiles)
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

      if (!isHit) continue;

      // 2. Throttle persistent AoE projectiles so they do not deal damage on every single frame to the same enemy
      const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash');
      if (isPersistentAoE) {
        p.hitMap = p.hitMap || new Map();
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const lastHit = p.hitMap.get(e) || 0;
        if (now - lastHit < 320) {
          continue; // Enemy was recently hit by this wave/shockwave; wait for next tick
        }
        p.hitMap.set(e, now);
      }

      // 3. Confirmed Hit! Apply damage, particle sparkle, and weapon knockback
      this.damageEnemy(e, p.damage || 25, particles, audioEngine, onPoofed, enemyIndex);
      particles.addSparkle(p.x, p.y, p.color || '#fff', 12, 4);

      // Specific Knockbacks based on lore weapons
      if (p.type === 'tidalWave') {
        // Lapis Lazuli Towering Tidal Wave: Sweeps enemies into the air with hydro surge!
        e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 520;
        e.vy = -360;
        e.hurtTimer = 0.55;
        particles.addDamageText(e.x, e.y - e.height - 25, '🌊 TIDAL WAVE!', true, '#0284c7');
        particles.addSparkle(e.x, e.y - 25, '#38bdf8', 22, 6);
        particles.addSparkle(e.x, e.y - 45, '#e0f2fe', 16, 5);
      } else if (p.type === 'jasperCrashHelmet') {"""

assert old_collision_block in code, "old_collision_block not found"
code = code.replace(old_collision_block, new_collision_block, 1)
print("2. Fixed projectile collision detection and throttling bug in checkPlayerAttackCollisions")

# 3. Upgrade PlayerHero.draw kinetic 3-hit combo movement
old_punch_physics = """      if (this.actionType === 'punch') {
        // Physical punch lunge & forward body lean
        const stroke = Math.sin(animP * Math.PI);
        actionLunge = stroke * 16;
        actionLiftY = -stroke * 3;
        actionTorsoTilt = stroke * 0.18;
      }"""

new_punch_physics = """      if (this.actionType === 'punch') {
        // Dynamic Physical 3-Hit Combo Kinetics & Body Deformation!
        const stroke = Math.sin(animP * Math.PI);
        const combo = this.attackCombo;
        if (combo === 0) {
          // Hit 1: Rapid forward jab / rapier thrust
          actionLunge = stroke * 18;
          actionLiftY = -stroke * 3;
          actionTorsoTilt = stroke * 0.16;
        } else if (combo === 1) {
          // Hit 2: Sweeping horizontal hook / cleave
          actionLunge = stroke * 15;
          actionLiftY = stroke * 4;
          actionTorsoTilt = -stroke * 0.22;
        } else {
          // Hit 3: Colossal aerial finisher / uppercut slam
          actionLunge = stroke * 30;
          if (animP < 0.45) {
            actionLiftY = -18 * Math.sin((animP / 0.45) * (Math.PI / 2));
            actionTorsoTilt = -0.25;
          } else {
            actionLiftY = 10 * Math.sin(((animP - 0.45) / 0.55) * Math.PI);
            actionTorsoTilt = 0.38;
          }
        }
      }"""

assert old_punch_physics in code, "old_punch_physics not found"
code = code.replace(old_punch_physics, new_punch_physics, 1)
print("3. Upgraded PlayerHero.draw kinetic 3-hit combo movement")

# 4. Upgrade drawLapis in game.js
old_lapis_start = code.find("  drawLapis(ctx, bob, animP = 0, actionType = '') {")
rose_start = code.find("  // --- SHOW-ACCURATE ROSE QUARTZ ---")
assert old_lapis_start != -1 and rose_start != -1, "drawLapis or Rose marker not found"
old_lapis_fn = code[old_lapis_start:rose_start]

new_lapis_fn = """  drawLapis(ctx, bob, animP = 0, actionType = '') {
    // Cerulean blue bare legs & feet
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-7, -26 + bob, 6, 26);
    ctx.fillRect(2, -26 + bob, 6, 26);

    // Flowing Azure Midi-Skirt
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-12, -40 + bob);
    ctx.lineTo(12, -40 + bob);
    ctx.lineTo(18, -14 + bob);
    ctx.lineTo(-18, -14 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(0, -40 + bob);
    ctx.lineTo(6, -14 + bob);
    ctx.lineTo(-6, -14 + bob);
    ctx.closePath();
    ctx.fill();

    // Dark Navy Halter Crop Top
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-10, -58 + bob, 20, 20);

    // Cerulean bare shoulders & face
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-4, -66 + bob, 8, 10);
    ctx.beginPath();
    ctx.arc(0, -72 + bob, 11, 0, Math.PI * 2);
    ctx.fill();

    // Gentle facial features / battle eyes
    const isTidal = (actionType === 'skill');
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');
    const isGlowingEyes = this.isPinkOverdrive || isTidal;

    ctx.fillStyle = isGlowingEyes ? '#38bdf8' : '#0c4a6e';
    ctx.beginPath();
    ctx.arc(3, -73 + bob, isGlowingEyes ? 3.5 : 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (isGlowingEyes) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3, -73 + bob, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Neat Dark Blue Bob Hair with Bangs
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(0, -76 + bob, 14, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.fillRect(-12, -76 + bob, 5, 14);
    ctx.fillRect(7, -76 + bob, 5, 14);

    // Teardrop Gemstone on upper back
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    if (ctx.ellipse) ctx.ellipse(-8, -54 + bob, 3, 5, 0.2, 0, Math.PI * 2);
    else ctx.arc(-8, -54 + bob, 4, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Hydro Water Wings Sprouting From Back
    ctx.save();
    ctx.fillStyle = isTidal ? 'rgba(56, 189, 248, 0.88)' : 'rgba(56, 189, 248, 0.72)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = isTidal ? 2.5 : 1.5;
    const flapMult = isTidal ? 2.4 : 1.0;
    const wingFlap = Math.sin(Date.now() / 100) * (11 * flapMult);
    const wingSize = isTidal ? 42 : (this.isPinkOverdrive ? 26 : 0);

    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-6, -56 + bob);
    ctx.quadraticCurveTo(-38 - wingSize, -94 - wingSize + wingFlap, -52 - wingSize, -68 + wingFlap);
    ctx.quadraticCurveTo(-32, -45, -6, -50 + bob);
    ctx.fill();
    ctx.stroke();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(6, -56 + bob);
    ctx.quadraticCurveTo(38 + wingSize, -94 - wingSize - wingFlap, 52 + wingSize, -68 - wingFlap);
    ctx.quadraticCurveTo(32, -45, 6, -50 + bob);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Arms & Hands based on Action
    if (isTidal) {
      // TIDAL SURGE POSE: Majestic Ocean Empress floating with both arms raised high!
      ctx.fillStyle = '#38bdf8';
      // Left arm raised high
      ctx.fillRect(-12, -78 + bob, 6, 22);
      // Right arm raised high commanding the waves
      ctx.fillRect(6, -78 + bob, 6, 22);

      // Glowing Cyan Hydro Orbs in her palms
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-9, -82 + bob, 7, 0, Math.PI * 2);
      ctx.arc(9, -82 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Swirling Water Arcs around her body
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -52 + bob, 34 + Math.sin(Date.now() / 60) * 5, 0, Math.PI * 2);
      ctx.stroke();
      this.drawMiniStar(ctx, 0, -96 + bob, 8.5);
    } else if (isThrow) {
      // HYDRO FIST POSE: Right arm thrusts straight forward with giant water gauntlet!
      const throwReach = Math.sin(animP * Math.PI) * 22;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(6, -58 + bob, 14 + throwReach, 7);
      // Giant water knuckle
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(22 + throwReach, -54 + bob, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (isPunch) {
      const combo = this.attackCombo;
      if (combo === 0) {
        // Hit 1: Swift Hydro-Blade Slash
        const scytheReach = Math.sin(animP * Math.PI) * 24;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(6, -56 + bob, 10 + scytheReach, 6);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(18 + scytheReach, -53 + bob, 18, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.lineTo(24 + scytheReach, -53 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (combo === 1) {
        // Hit 2: Upward Water Fist Swipe
        const scytheReach = Math.sin(animP * Math.PI) * 26;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(4, -62 + bob - scytheReach * 0.5, 12, 10);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.9)';
        ctx.beginPath();
        ctx.arc(16, -64 + bob - scytheReach * 0.6, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Hit 3: Dual Water Tendril Cleave
        const scytheReach = Math.sin(animP * Math.PI) * 32;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(10, -70 + bob);
        ctx.lineTo(34 + scytheReach, -35 + bob);
        ctx.lineTo(10, -25 + bob);
        ctx.stroke();
      }
    } else {
      // Idle / Walking arm resting naturally
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(4, -54 + bob, 5, 18);
    }
  }

"""

code = code.replace(old_lapis_fn, new_lapis_fn, 1)
print("4. Upgraded drawLapis with Tidal Surge levitation, wings, and 3-hit combo water arms")

# 5. Upgrade projectile visual for tidalWave, hydroFist, flaskRobonoid, pearlLaser, holoPearl in StevenUniverseGame.draw
old_projs_block = """    } else if (p.type === 'hydroFist') {
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius || 24, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    } else if (p.type === 'tidalWave') {
      this.ctx.fillStyle = 'rgba(2, 132, 199, 0.85)';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y + 40);
      this.ctx.quadraticCurveTo(p.x + 25, p.y - 45, p.x + 50, p.y + 40);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(p.x + 12, p.y - 35, 24, 6);
    } else if (p.type === 'pearlLaser') {
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.fillRect(p.x - 20, p.y - 4, 40, 8);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(p.x - 14, p.y - 2, 28, 4);
    } else if (p.type === 'holoPearl') {
      this.ctx.fillStyle = p.color || 'rgba(103, 232, 249, 0.75)';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius || 22, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + (p.facing || 1) * 35, p.y);
      this.ctx.stroke();
    }"""

new_projs_block = """    } else if (p.type === 'hydroFist') {
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
      const groundLevel = this.groundY || 520;

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
      // Elegant Translucent Holo-Pearl Sparring Clone
      this.ctx.fillStyle = p.isOverdrive ? 'rgba(244, 114, 182, 0.75)' : 'rgba(103, 232, 249, 0.75)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.8;
      // Head & Bun
      this.ctx.beginPath();
      this.ctx.arc(0, -22, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      // Torso & Fencing Tunic
      this.ctx.beginPath();
      this.ctx.moveTo(-6, -12);
      this.ctx.lineTo(6, -12);
      this.ctx.lineTo(10, 14);
      this.ctx.lineTo(-10, 14);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Glowing Fencing Rapier
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(4, 0);
      this.ctx.lineTo(36, 0);
      this.ctx.stroke();
      this.ctx.restore();
    }"""

assert old_projs_block in code, "old_projs_block not found"
code = code.replace(old_projs_block, new_projs_block, 1)
print("5. Upgraded tidalWave, hydroFist, pearlLaser, and holoPearl in StevenUniverseGame.draw")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: game.js fully patched with Lapis Tidal Wave fixes and enhanced animation styles!")
