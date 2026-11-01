#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
patch_canonical_fusion.py
Applies the full Canonical Gem Fusion System to game.js
"""

import sys
import re

GAME_JS = "/home/wanibur/Documents/Wani Works/Antigravity Tests/Steven Universe/game.js"

with open(GAME_JS, "r", encoding="utf-8") as f:
    content = f.read()

print("Original game.js length:", len(content))

# 1. Update PlayerHero constructor
ph_target = """    // Acrobatics & Jump Enhancements (Reach platforms effortlessly!)
    this.canDoubleJump = true;
    this.jumpDebounce = false;
  }"""

ph_replacement = """    // Acrobatics & Jump Enhancements (Reach platforms effortlessly!)
    this.canDoubleJump = true;
    this.jumpDebounce = false;

    // Canonical Gem Fusion Attributes
    this.isFusion = false;
    this.fusionKey = null;
    this.fusionData = null;
    this.isMergedInFusion = false;
  }"""

if ph_target not in content:
    print("ERROR: ph_target not found in game.js")
    sys.exit(1)
content = content.replace(ph_target, ph_replacement, 1)
print("1. PlayerHero constructor patched.")

# 2. Update PlayerHero.executeAttackJ
j_target = """  executeAttackJ(audioEngine, particles, projectiles) {
    this.isAttacking = true;
    this.attackType = 'J';
    this.actionType = 'punch';
    this.actionDuration = 0.26;
    this.actionTimer = 0.26;
    this.attackCooldown = 0.22;
    this.attackCombo = (this.attackCombo + 1) % 3;"""

j_replacement = """  executeAttackJ(audioEngine, particles, projectiles) {
    this.isAttacking = true;
    this.attackType = 'J';
    this.actionType = 'punch';
    this.actionDuration = 0.26;
    this.actionTimer = 0.26;
    this.attackCooldown = 0.22;
    this.attackCombo = (this.attackCombo + 1) % 3;

    if (this.isFusion && this.fusionData) {
      const f = this.fusionData;
      if (f.id === 'opal') audioEngine.playSfx('laser');
      else if (f.id === 'stevonnie' || f.id === 'rainbowClassic' || f.id === 'rainbow2') audioEngine.playSfx('sword');
      else if (f.id === 'smoky') audioEngine.playSfx('whip');
      else if (f.id === 'malachite') audioEngine.playSfx('water');
      else if (f.id === 'sugilite' || f.id === 'sardonyx') audioEngine.playSfx('hammer');
      else audioEngine.playSfx('punch');

      particles.addDamageText(this.x + this.facing * 55, this.y - 60, `💥 ${f.name.toUpperCase()} STRIKE!`, true, f.color || '#ec4899');
      particles.addSparkle(this.x + this.facing * 55, this.y - 35, f.glowColor || '#ffffff', 20, 6);
      return;
    }"""

if j_target not in content:
    print("ERROR: j_target not found in game.js")
    sys.exit(1)
content = content.replace(j_target, j_replacement, 1)
print("2. PlayerHero.executeAttackJ patched.")

# 3. Update PlayerHero.executeSpecialK
k_target = """  executeSpecialK(audioEngine, particles, projectiles) {
    this.specialCooldown = 0.85;
    this.isAttacking = true;
    this.attackType = 'K';
    this.actionType = 'throw';
    this.actionDuration = 0.38;
    this.actionTimer = 0.38;
    const dmgMult = this.isPinkOverdrive ? 2.0 : 1.0;"""

k_replacement = """  executeSpecialK(audioEngine, particles, projectiles) {
    this.specialCooldown = 0.85;
    this.isAttacking = true;
    this.attackType = 'K';
    this.actionType = 'throw';
    this.actionDuration = 0.38;
    this.actionTimer = 0.38;
    const dmgMult = (this.isPinkOverdrive ? 2.0 : 1.0) * (this.isFusion ? 1.35 : 1.0);

    if (this.isFusion && this.fusionData) {
      this.executeFusionSpecialK(audioEngine, particles, projectiles, dmgMult);
      return;
    }"""

if k_target not in content:
    print("ERROR: k_target not found in game.js")
    sys.exit(1)
content = content.replace(k_target, k_replacement, 1)
print("3. PlayerHero.executeSpecialK patched.")

# 4. Update PlayerHero.executeSkillL
l_target = """  executeSkillL(audioEngine, particles, pickups = [], projectiles = []) {
    if (!Array.isArray(pickups)) pickups = [];
    if (!Array.isArray(projectiles)) projectiles = [];
    this.skillCooldown = 3.2;
    this.isAttacking = true;
    this.attackType = 'L';
    const dmgMult = this.isPinkOverdrive ? 2.0 : 1.0;"""

l_replacement = """  executeSkillL(audioEngine, particles, pickups = [], projectiles = []) {
    if (!Array.isArray(pickups)) pickups = [];
    if (!Array.isArray(projectiles)) projectiles = [];
    this.skillCooldown = 3.2;
    this.isAttacking = true;
    this.attackType = 'L';
    const dmgMult = (this.isPinkOverdrive ? 2.0 : 1.0) * (this.isFusion ? 1.4 : 1.0);

    if (this.isFusion && this.fusionData) {
      this.executeFusionSkillL(audioEngine, particles, pickups, projectiles, dmgMult);
      return;
    }"""

if l_target not in content:
    print("ERROR: l_target not found in game.js")
    sys.exit(1)
content = content.replace(l_target, l_replacement, 1)
print("4. PlayerHero.executeSkillL patched.")

# 5. Insert executeFusionSpecialK and executeFusionSkillL before takeDamage
td_target = """  takeDamage(amount, particles, audioEngine) {"""

fusion_methods = """  executeFusionSpecialK(audioEngine, particles, projectiles, dmgMult = 1.0) {
    const f = this.fusionData;
    const fid = f.id;

    if (fid === 'stevonnie') {
      // Stevonnie: Shield Hover Dropkick!
      audioEngine.playSfx('shield');
      audioEngine.playSfx('whoosh');
      this.vx = this.facing * 340;
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 35,
        vx: this.facing * 620,
        vy: 0,
        radius: 34,
        damage: Math.round(72 * dmgMult),
        type: 'fusionHoverDropkick',
        color: '#ec4899',
        life: 1.1
      });
      particles.addRosePetals(this.x, this.y - 35, 12);
      particles.addDamageText(this.x, this.y - 65, '🛡️ HOVER DROPKICK!', true, '#f472b6');
    } else if (fid === 'smoky') {
      // Smoky Quartz: Yo-Yo Grapple Slam!
      audioEngine.playSfx('whip');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 35,
        vx: this.facing * 580,
        vy: 0,
        radius: 32,
        damage: Math.round(75 * dmgMult),
        type: 'fusionYoYo',
        color: '#a855f7',
        life: 1.0
      });
      particles.addSparkle(this.x + this.facing * 35, this.y - 35, '#c084fc', 18, 5);
      particles.addDamageText(this.x, this.y - 65, '🪀 YO-YO GRAPPLE!', true, '#a855f7');
    } else if (fid === 'rainbow2') {
      // Rainbow Quartz 2.0: Rocket Umbrella Float!
      audioEngine.playSfx('laser');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 40,
        vx: this.facing * 620,
        vy: 0,
        radius: 30,
        damage: Math.round(74 * dmgMult),
        type: 'fusionParasolRocket',
        color: '#38bdf8',
        life: 1.0
      });
      particles.addSparkle(this.x, this.y - 40, '#f472b6', 16, 5);
      particles.addDamageText(this.x, this.y - 65, '☂️ ROCKET PARASOL!', true, '#38bdf8');
    } else if (fid === 'sunstone') {
      // Sunstone: Solar Rocket Punch!
      audioEngine.playSfx('rocket');
      audioEngine.playSfx('punch');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 42,
        vx: this.facing * 640,
        vy: 0,
        radius: 34,
        damage: Math.round(82 * dmgMult),
        type: 'fusionSunGauntlet',
        color: '#ea580c',
        life: 1.1
      });
      particles.addSparkle(this.x, this.y - 42, '#fde047', 22, 6);
      particles.addDamageText(this.x, this.y - 65, '☀️ SOLAR ROCKET PUNCH!', true, '#f97316');
    } else if (fid === 'sugilite') {
      // Sugilite: Earthquake Stomp!
      audioEngine.playSfx('hammer');
      for (const dir of [-1, 1]) {
        projectiles.push({
          x: this.x + dir * 40,
          y: this.groundY - 20,
          vx: dir * 520,
          vy: 0,
          width: 95,
          height: 55,
          damage: Math.round(92 * dmgMult),
          type: 'seismicShockwave',
          color: '#7e22ce',
          life: 0.95
        });
      }
      particles.addDamageText(this.x, this.y - 65, '🟣 EARTHQUAKE STOMP!', true, '#7e22ce');
    } else if (fid === 'sardonyx') {
      // Sardonyx: Spinning Hammer Drill!
      audioEngine.playSfx('hammer');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 40,
        y: this.y - 40,
        vx: this.facing * 600,
        vy: 0,
        radius: 36,
        damage: Math.round(85 * dmgMult),
        type: 'fusionHammerDrill',
        color: '#fb7185',
        life: 1.0
      });
      particles.addSparkle(this.x, this.y - 40, '#fdba74', 20, 6);
      particles.addDamageText(this.x, this.y - 65, '🔨 HAMMER DRILL!', true, '#fb7185');
    } else if (fid === 'opal') {
      // Opal: Multi-Arrow Volley (5 Spread Light Arrows)!
      audioEngine.playSfx('laser');
      const angles = [-130, -65, 0, 65, 130];
      for (const vy of angles) {
        projectiles.push({
          x: this.x + this.facing * 35,
          y: this.y - 40,
          vx: this.facing * 660,
          vy: vy,
          radius: 18,
          damage: Math.round(82 * dmgMult),
          type: 'fusionOpalArrow',
          color: '#818cf8',
          life: 1.2
        });
      }
      particles.addSparkle(this.x, this.y - 40, '#c084fc', 24, 6);
      particles.addDamageText(this.x, this.y - 65, '🏹 5-ARROW VOLLEY!', true, '#818cf8');
    } else if (fid === 'malachite') {
      // Malachite: Glacial Ice Hand Slam!
      audioEngine.playSfx('water');
      audioEngine.playSfx('hammer');
      projectiles.push({
        x: this.x + this.facing * 130,
        y: this.groundY - 55,
        vx: 0,
        vy: 0,
        width: 120,
        height: 120,
        damage: Math.round(96 * dmgMult),
        type: 'fusionGlacialFist',
        color: '#2dd4bf',
        life: 0.85
      });
      particles.addSparkle(this.x + this.facing * 130, this.groundY - 45, '#a7f3d0', 26, 7);
      particles.addDamageText(this.x, this.y - 65, '🧊 GLACIAL ICE SLAM!', true, '#0d9488');
    } else if (fid === 'rainbowClassic') {
      // Rainbow Quartz Classic: Rose Petal Barrier Thrust!
      audioEngine.playSfx('sword');
      audioEngine.playSfx('shield');
      projectiles.push({
        x: this.x + this.facing * 40,
        y: this.y - 40,
        vx: this.facing * 540,
        vy: 0,
        width: 110,
        height: 95,
        damage: Math.round(82 * dmgMult),
        type: 'roseShockwave',
        color: '#f43f5e',
        life: 0.75
      });
      particles.addRosePetals(this.x, this.y - 35, 16);
      particles.addDamageText(this.x, this.y - 65, '🌹 PETAL BARRIER THRUST!', true, '#f43f5e');
    }
  }

  executeFusionSkillL(audioEngine, particles, pickups, projectiles, dmgMult = 1.0) {
    const f = this.fusionData;
    const fid = f.id;
    this.actionType = 'skill';
    this.actionDuration = 0.65;
    this.actionTimer = 0.65;
    this.invulnerableTimer = 0.75;

    if (fid === 'stevonnie') {
      // Stevonnie: Rose Sword Wave!
      audioEngine.playSfx('sword');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 50,
        y: this.y - 45,
        vx: this.facing * 540,
        vy: 0,
        width: 260,
        height: 140,
        damage: Math.round(120 * dmgMult),
        type: 'fusionRoseSwordWave',
        color: '#ec4899',
        life: 1.4
      });
      particles.addRosePetals(this.x, this.y - 45, 24);
      particles.addDamageText(this.x, this.y - 75, '⚔️ ROSE SWORD WAVE!', true, '#ec4899');
    } else if (fid === 'smoky') {
      // Smoky Quartz: Cyclone Tornado!
      audioEngine.playSfx('spindash');
      audioEngine.playSfx('whoosh');
      projectiles.push({
        x: this.x + this.facing * 60,
        y: this.y - 60,
        vx: this.facing * 460,
        vy: 0,
        width: 220,
        height: 190,
        damage: Math.round(125 * dmgMult),
        type: 'fusionCyclone',
        color: '#a855f7',
        life: 1.6
      });
      particles.addSparkle(this.x, this.y - 50, '#c084fc', 30, 8);
      particles.addDamageText(this.x, this.y - 75, '🌪️ CYCLONE TORNADO!', true, '#a855f7');
    } else if (fid === 'rainbow2') {
      // Rainbow Quartz 2.0: Prismatic Prism Cannon!
      audioEngine.playSfx('laser');
      projectiles.push({
        x: this.x + this.facing * 65,
        y: this.y - 45,
        vx: this.facing * 680,
        vy: 0,
        width: 320,
        height: 100,
        damage: Math.round(135 * dmgMult),
        type: 'fusionPrismCannon',
        color: '#38bdf8',
        life: 1.3
      });
      particles.addSparkle(this.x, this.y - 45, '#f472b6', 28, 8);
      particles.addDamageText(this.x, this.y - 75, '🌈 PRISMATIC CANNON!', true, '#38bdf8');
    } else if (fid === 'sunstone') {
      // Sunstone: Supernova Burst!
      audioEngine.playSfx('overdrive');
      audioEngine.playSfx('punch');
      projectiles.push({
        x: this.x - 160,
        y: this.y - 120,
        vx: 0,
        vy: 0,
        width: 340,
        height: 250,
        damage: Math.round(140 * dmgMult),
        type: 'fusionSupernova',
        color: '#ea580c',
        life: 1.0
      });
      particles.addSparkle(this.x, this.y - 50, '#fde047', 40, 10);
      particles.addDamageText(this.x, this.y - 75, '☀️ SUPERNOVA BURST!', true, '#ea580c');
    } else if (fid === 'sugilite') {
      // Sugilite: Flail Cataclysm!
      audioEngine.playSfx('hammer');
      audioEngine.playSfx('overdrive');
      projectiles.push({
        x: this.x + this.facing * 80,
        y: this.groundY - 70,
        vx: this.facing * 320,
        vy: 0,
        width: 300,
        height: 170,
        damage: Math.round(160 * dmgMult),
        type: 'fusionFlailCataclysm',
        color: '#7e22ce',
        life: 1.2
      });
      particles.addSparkle(this.x, this.groundY - 60, '#c084fc', 35, 9);
      particles.addDamageText(this.x, this.y - 75, '🌋 FLAIL CATACLYSM!', true, '#7e22ce');
    } else if (fid === 'sardonyx') {
      // Sardonyx: Showstopper Finale!
      audioEngine.playSfx('stageClear');
      projectiles.push({
        x: this.x - 130,
        y: this.y - 100,
        vx: 0,
        vy: 0,
        width: 280,
        height: 210,
        damage: Math.round(145 * dmgMult),
        type: 'fusionShowstopper',
        color: '#fb7185',
        life: 1.1
      });
      particles.addSparkle(this.x, this.y - 50, '#fdba74', 36, 9);
      particles.addDamageText(this.x, this.y - 75, '✨ SHOWSTOPPER FINALE!', true, '#fb7185');
    } else if (fid === 'opal') {
      // Opal: Celestial Light Rain (24 Golden Light Arrows from the Heavens)!
      audioEngine.playSfx('laser');
      const startX = Math.max(80, this.x - 300);
      for (let a = 0; a < 24; a++) {
        projectiles.push({
          x: startX + a * 26,
          y: this.y - 320 - (a % 4) * 40,
          vx: (Math.random() - 0.5) * 80,
          vy: 680 + Math.random() * 120,
          radius: 18,
          damage: Math.round(45 * dmgMult),
          type: 'fusionCelestialRain',
          color: '#818cf8',
          life: 1.1
        });
      }
      particles.addSparkle(this.x, this.y - 50, '#c084fc', 35, 9);
      particles.addDamageText(this.x, this.y - 75, '🌟 CELESTIAL LIGHT RAIN!', true, '#818cf8');
    } else if (fid === 'malachite') {
      // Malachite: Abyssal Tsunami Cage!
      audioEngine.playSfx('water');
      projectiles.push({
        x: this.x - 160,
        y: this.groundY - 80,
        vx: 0,
        vy: 0,
        width: 320,
        height: 170,
        damage: Math.round(165 * dmgMult),
        type: 'fusionTsunamiCage',
        color: '#0d9488',
        life: 1.2
      });
      particles.addSparkle(this.x, this.groundY - 60, '#2dd4bf', 36, 9);
      particles.addDamageText(this.x, this.y - 75, '🌊 ABYSSAL TSUNAMI CAGE!', true, '#0d9488');
    } else if (fid === 'rainbowClassic') {
      // Rainbow Quartz Classic: Prismatic Tears Dance!
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      pickups.push({ x: this.x - 30, y: this.groundY - 15, type: 'cookie', life: 18 });
      pickups.push({ x: this.x + 30, y: this.groundY - 15, type: 'cookie', life: 18 });
      projectiles.push({
        x: this.x - 120,
        y: this.y - 70,
        vx: 0,
        vy: 0,
        width: 250,
        height: 140,
        damage: Math.round(135 * dmgMult),
        type: 'fusionPrismRose',
        color: '#f43f5e',
        life: 1.1
      });
      particles.addRosePetals(this.x, this.y - 45, 30);
      particles.addDamageText(this.x, this.y - 75, '🌹 PRISMATIC TEARS DANCE!', true, '#f43f5e');
    }
  }

"""

if td_target not in content:
    print("ERROR: td_target not found in game.js")
    sys.exit(1)
content = content.replace(td_target, fusion_methods + td_target, 1)
print("5. executeFusionSpecialK and executeFusionSkillL inserted.")

# 6. Update PlayerHero.prototype.draw to handle isMergedInFusion and drawFusionHero
draw_top_target = """  draw(ctx) {
    // 1. Draw Overdrive Afterimages (Custom colored per character)"""

draw_top_replacement = """  draw(ctx) {
    if (this.isMergedInFusion) return;

    if (this.isFusion && this.fusionData) {
      this.drawFusionHero(ctx);
      return;
    }

    // 1. Draw Overdrive Afterimages (Custom colored per character)"""

if draw_top_target not in content:
    print("ERROR: draw_top_target not found in game.js")
    sys.exit(1)
content = content.replace(draw_top_target, draw_top_replacement, 1)
print("6. PlayerHero.prototype.draw head patched.")

with open(GAME_JS, "w", encoding="utf-8") as f:
    f.write(content)

print("Checkpoint 1 written safely.")
