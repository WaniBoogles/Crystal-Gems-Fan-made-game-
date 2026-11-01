#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
patch_fusion_draw.py
Adds drawFusionHero and 9 specialized fusion drawing methods to PlayerHero in game.js
"""

import sys

GAME_JS = "/home/wanibur/Documents/Wani Works/Antigravity Tests/Steven Universe/game.js"

with open(GAME_JS, "r", encoding="utf-8") as f:
    content = f.read()

target = """  drawAttackVisuals(ctx, bob) {"""

draw_code = """  // ==========================================================================
  // CANONICAL GEM FUSION DRAWING ENGINE (OFFICIAL STEVEN UNIVERSE SHOW LORE)
  // ==========================================================================
  drawFusionHero(ctx) {
    const fusion = this.fusionData;
    if (!fusion) return;

    let actionLunge = 0;
    let actionLiftY = 0;
    let actionTorsoTilt = 0;
    let animP = 0;

    if (this.actionTimer > 0 && this.actionDuration > 0) {
      animP = Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration)));
      if (this.actionType === 'punch') {
        const stroke = Math.sin(animP * Math.PI);
        actionLunge = stroke * 28;
        actionLiftY = -stroke * 6;
        actionTorsoTilt = stroke * 0.16;
      } else if (this.actionType === 'throw') {
        const stroke = Math.sin(animP * Math.PI);
        actionLunge = stroke * 20;
      } else if (this.actionType === 'skill') {
        const stroke = Math.sin(animP * Math.PI);
        actionLiftY = -stroke * 16;
        actionTorsoTilt = -stroke * 0.12;
      }
    }

    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const idleBob = Math.sin(t * 3.5) * 3;
    const walkBob = Math.abs(Math.sin(this.walkAnim * 10)) * 6;
    const bob = (Math.abs(this.vx) > 10 ? walkBob : idleBob) + actionLiftY;
    const scale = fusion.scale || 1.45;

    ctx.save();
    ctx.translate(this.x + actionLunge * this.facing, this.y);
    ctx.scale(this.facing * scale, scale);
    ctx.rotate(actionTorsoTilt * this.facing);

    // 1. Luminous Grand Rainbow / Prism Fusion Aura
    this.drawFusionAura(ctx, fusion, bob);

    // 2. Specialized Lore-Accurate Silhouette for each of the 9 Canon Fusions
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

    // 3. Dynamic Attack Slashes & Impact Visuals for Fusion
    if (this.isAttacking) {
      this.drawFusionAttackVisuals(ctx, bob, fusion);
    }

    ctx.restore();
  }

  drawFusionAura(ctx, fusion, bob) {
    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const pulse = 1 + Math.sin(t * 5) * 0.15;

    // Glowing prismatic base ring
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, 38 * pulse, 12 * pulse, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fill();
    ctx.strokeStyle = fusion.glowColor || '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Floating starlight motes orbiting the fusion
    for (let i = 0; i < 4; i++) {
      const angle = t * 3 + (i * Math.PI / 2);
      const orbX = Math.cos(angle) * 32;
      const orbY = -45 + Math.sin(angle) * 18 + bob;
      ctx.fillStyle = (i % 2 === 0) ? (fusion.color || '#ec4899') : '#ffffff';
      ctx.beginPath();
      ctx.arc(orbX, orbY, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 1. STEVONNIE (Steven + Connie) ---
  drawStevonnie(ctx, bob, animP, actionType) {
    // Connie's Blue Jumpsuit Pants & Boots
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-14, -26 + bob, 11, 26);
    ctx.fillRect(3, -26 + bob, 11, 26);

    // Boots with pink/cream accents
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-15, -6 + bob, 13, 6);
    ctx.fillRect(2, -6 + bob, 13, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-15, -2 + bob, 13, 2.5);
    ctx.fillRect(2, -2 + bob, 13, 2.5);

    // Steven's Salmon Pink Star Shirt
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-16, -60 + bob, 32, 36, 6);
    ctx.fill();

    // Gold Star on chest
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 0, -42 + bob, 8.5);

    // Rose Quartz Navel Gem
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    this.drawMiniStar(ctx, 0, -28 + bob, 4.5);
    ctx.stroke();

    // Warm golden-tan skin neck & head
    ctx.fillStyle = '#d4976a';
    ctx.fillRect(-4, -68 + bob, 8, 10);
    ctx.beginPath();
    ctx.arc(0, -75 + bob, 14, 0, Math.PI * 2);
    ctx.fill();

    // Expressive eyes & confident smile
    ctx.fillStyle = '#1f1418';
    ctx.beginPath();
    ctx.arc(4, -76 + bob, 3.2, 0, Math.PI * 2);
    ctx.arc(-4, -76 + bob, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5, -77 + bob, 1.2, 0, Math.PI * 2);
    ctx.arc(-3, -77 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(7, -72 + bob, 3, 0, Math.PI * 2);
    ctx.arc(-7, -72 + bob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Thick, voluminous, wavy dark curls flowing down past shoulders
    ctx.fillStyle = '#1f1418';
    ctx.beginPath();
    ctx.arc(0, -82 + bob, 17, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineTo(16, -55 + bob);
    ctx.bezierCurveTo(18, -40 + bob, -18, -40 + bob, -16, -55 + bob);
    ctx.closePath();
    ctx.fill();

    // Left Arm: Rose's Crystalline Pink Shield
    ctx.fillStyle = 'rgba(255, 96, 151, 0.85)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(-18, -46 + bob, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Inner rose swirl
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-18, -46 + bob, 8, 0, Math.PI * 1.5);
    ctx.stroke();

    // Right Arm: Rose's Sword
    ctx.save();
    ctx.translate(14, -45 + bob);
    const swordSwing = (actionType === 'punch' || actionType === 'throw') ? Math.sin(animP * Math.PI) * 0.9 : 0;
    ctx.rotate(0.3 + swordSwing);
    // Hilt & crossguard
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-2, -4, 4, 10);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-7, -6, 14, 3);
    // Pink steel blade
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.2;
    ctx.fillRect(-3, -38, 6, 32);
    ctx.beginPath();
    ctx.moveTo(-3, -38);
    ctx.lineTo(0, -45);
    ctx.lineTo(3, -38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // --- 2. SMOKY QUARTZ (Steven + Amethyst) ---
  drawSmokyQuartz(ctx, bob, animP, actionType) {
    // Legs: Dark purple ripped leggings with star cutouts
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(-15, -26 + bob, 12, 26);
    ctx.fillRect(3, -26 + bob, 12, 26);
    // Star cutout on knee
    ctx.fillStyle = '#786b6e';
    this.drawMiniStar(ctx, -9, -15 + bob, 3);
    // Bare feet
    ctx.fillStyle = '#786b6e';
    ctx.fillRect(-16, -5 + bob, 13, 5);
    ctx.fillRect(3, -5 + bob, 13, 5);

    // Torso: Steven's stretched salmon star shirt
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-18, -62 + bob, 36, 38, 8);
    ctx.fill();

    // Star on chest
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 0, -44 + bob, 9);

    // Amethyst gem on upper chest
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    this.drawMiniStar(ctx, -5, -53 + bob, 4.5);
    ctx.stroke();

    // Steven gem on navel
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    this.drawMiniStar(ctx, 0, -28 + bob, 4);
    ctx.fill();

    // Head: Grayish-brown skin
    ctx.fillStyle = '#786b6e';
    ctx.beginPath();
    ctx.arc(0, -74 + bob, 15, 0, Math.PI * 2);
    ctx.fill();

    // Cheeky smile with fanged tooth
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.arc(4, -75 + bob, 3.2, 0, Math.PI * 2);
    ctx.arc(-4, -75 + bob, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(1, -68 + bob);
    ctx.lineTo(4, -68 + bob);
    ctx.lineTo(2.5, -64 + bob);
    ctx.closePath();
    ctx.fill();

    // Messy, fluffy dark violet curls
    ctx.fillStyle = '#261e2b';
    ctx.beginPath();
    ctx.arc(0, -82 + bob, 19, 0, Math.PI * 2);
    ctx.arc(-14, -74 + bob, 10, 0, Math.PI * 2);
    ctx.arc(14, -74 + bob, 10, 0, Math.PI * 2);
    ctx.fill();

    // THREE ARMS! Left upper arm, Left lower arm, Right arm
    ctx.fillStyle = '#786b6e';
    // Left upper arm holding yo-yo string
    ctx.fillRect(-24, -58 + bob, 8, 22);
    // Left lower arm holding second yo-yo
    ctx.fillRect(-22, -42 + bob, 8, 20);
    // Right arm swinging main yo-yo
    ctx.fillRect(16, -55 + bob, 8, 24);

    // TRIPLE YO-YO WEAPON!
    const spinRot = (typeof performance !== 'undefined' ? performance.now() / 60 : Date.now() / 60);
    // Yo-Yo 1 (Right hand)
    ctx.save();
    ctx.translate(26, -34 + bob);
    ctx.rotate(spinRot);
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Yo-Yo 2 (Left lower)
    ctx.save();
    ctx.translate(-26, -26 + bob);
    ctx.rotate(-spinRot);
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Yo-Yo 3 (Left upper)
    ctx.save();
    ctx.translate(-30, -48 + bob);
    ctx.rotate(spinRot * 1.3);
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- 3. RAINBOW QUARTZ 2.0 (Steven + Pearl) ---
  drawRainbowQuartz2(ctx, bob, animP, actionType) {
    // Rolled-up blue denim shorts
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-13, -28 + bob, 11, 20);
    ctx.fillRect(2, -28 + bob, 11, 20);
    // White stockings & pointed teal ballerina shoes
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-12, -12 + bob, 9, 8);
    ctx.fillRect(3, -12 + bob, 9, 8);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-13, -5 + bob, 11, 5);
    ctx.fillRect(2, -5 + bob, 11, 5);

    // Magenta blazer over coral shirt
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.roundRect(-15, -64 + bob, 30, 38, 6);
    ctx.fill();
    // Coral undershirt V-neck
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.moveTo(-6, -64 + bob);
    ctx.lineTo(6, -64 + bob);
    ctx.lineTo(0, -48 + bob);
    ctx.closePath();
    ctx.fill();

    // Gems: Forehead pearl + navel diamond
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -84 + bob, 3, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 0, -32 + bob, 4);

    // Fair skin head
    ctx.fillStyle = '#fce7f3';
    ctx.beginPath();
    ctx.arc(0, -76 + bob, 13.5, 0, Math.PI * 2);
    ctx.fill();

    // Four Eyes! Top lavender spectacles, bottom cyan eyes
    ctx.fillStyle = 'rgba(192, 132, 252, 0.75)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(5, -80 + bob, 4.2, 0, Math.PI * 2);
    ctx.arc(-5, -80 + bob, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bottom eyes
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(4, -73 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(-4, -73 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Fluffy two-toned bouffant: Pink on top, Turquoise underneath
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(0, -82 + bob, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(0, -87 + bob, 16, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // WEAPON: Magical Rainbow Parasol!
    ctx.save();
    ctx.translate(14, -50 + bob);
    const angle = (actionType === 'punch' || actionType === 'throw') ? -0.4 + animP * 0.8 : -0.2;
    ctx.rotate(angle);
    // Silver stick & handle
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-2, -48, 4, 60);
    // Curved hook handle
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-4, 12, 5, 0, Math.PI);
    ctx.stroke();
    // Rainbow canopy
    const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a855f7'];
    for (let c = 0; c < colors.length; c++) {
      ctx.fillStyle = colors[c];
      ctx.beginPath();
      ctx.arc(0, -38, 22, -Math.PI * 0.9 + c * 0.35, -Math.PI * 0.9 + (c + 1) * 0.35);
      ctx.lineTo(0, -38);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 4. SUNSTONE (Steven + Garnet) ---
  drawSunstone(ctx, bob, animP, actionType) {
    // Powerful athletic legs in red-brown pants
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(-16, -28 + bob, 13, 28);
    ctx.fillRect(3, -28 + bob, 13, 28);
    // Yellow knee pads & red sneakers
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-17, -18 + bob, 15, 6);
    ctx.fillRect(2, -18 + bob, 15, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-17, -6 + bob, 15, 6);
    ctx.fillRect(2, -6 + bob, 15, 6);

    // Broad muscular brick-red torso
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.roundRect(-20, -68 + bob, 40, 42, 8);
    ctx.fill();

    // Yellow star on chest
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 0, -48 + bob, 11);

    // FOUR ARMS! Two upper muscular arms flexing, two lower arms with suction gauntlets
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-28, -64 + bob, 10, 22);
    ctx.fillRect(18, -64 + bob, 10, 22);
    ctx.fillRect(-26, -46 + bob, 9, 20);
    ctx.fillRect(17, -46 + bob, 9, 20);

    // Oversized suction-cup gauntlets
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.2;
    // Lower right gauntlet
    ctx.beginPath();
    ctx.arc(24, -30 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Lower left gauntlet
    ctx.beginPath();
    ctx.arc(-24, -30 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // BLAZING SUNBURST/STAR HEAD OF COMIC FLAMES!
    const t = (typeof performance !== 'undefined' ? performance.now() / 300 : Date.now() / 300);
    ctx.save();
    ctx.translate(0, -82 + bob);
    // Layer 1: Orange outer flame star
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    for (let s = 0; s < 10; s++) {
      const a = (s * Math.PI / 5) + Math.sin(t + s) * 0.1;
      const r = (s % 2 === 0) ? 26 : 14;
      if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    // Layer 2: Yellow inner comic core
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    for (let s = 0; s < 8; s++) {
      const a = (s * Math.PI / 4) + t * 0.5;
      const r = (s % 2 === 0) ? 17 : 9;
      if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Bold Crimson Sunglasses
    ctx.fillStyle = '#be123c';
    ctx.fillRect(-14, -4, 28, 9);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-10, -2);
    ctx.lineTo(-4, -2);
    ctx.lineTo(-8, 3);
    ctx.closePath();
    ctx.fill();

    // Broad confident smile
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 6, 6, 0.1, Math.PI * 0.9);
    ctx.stroke();
    ctx.restore();
  }

  // --- 5. SUGILITE (Garnet + Amethyst) ---
  drawSugilite(ctx, bob, animP, actionType) {
    // Massive muscular legs in torn deep violet pants
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(-18, -32 + bob, 15, 32);
    ctx.fillRect(3, -32 + bob, 15, 32);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-19, -6 + bob, 16, 6);
    ctx.fillRect(3, -6 + bob, 16, 6);

    // Broad muscular titan torso
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.roundRect(-24, -76 + bob, 48, 48, 10);
    ctx.fill();

    // Torn burgundy tunic
    ctx.fillStyle = '#4a044e';
    ctx.fillRect(-22, -65 + bob, 44, 30);

    // Amethyst chest gem
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1.4;
    this.drawMiniStar(ctx, 0, -60 + bob, 7);
    ctx.stroke();

    // FOUR MUSCULAR ARMS!
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-34, -72 + bob, 12, 28);
    ctx.fillRect(22, -72 + bob, 12, 28);
    ctx.fillRect(-30, -50 + bob, 11, 24);
    ctx.fillRect(20, -50 + bob, 11, 24);

    // Head with menacing fangs & FIVE PURPLE EYES!
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.arc(0, -88 + bob, 17, 0, Math.PI * 2);
    ctx.fill();

    // 5 Glowing Purple Eyes (2 top, 2 bottom, 1 center forehead)
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, -96 + bob, 3, 0, Math.PI * 2); // Center
    ctx.arc(-7, -91 + bob, 3.2, 0, Math.PI * 2); // Top left
    ctx.arc(7, -91 + bob, 3.2, 0, Math.PI * 2);  // Top right
    ctx.arc(-5, -85 + bob, 3, 0, Math.PI * 2);   // Bottom left
    ctx.arc(5, -85 + bob, 3, 0, Math.PI * 2);    // Bottom right
    ctx.fill();

    // Menacing fanged grin
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-6, -78 + bob);
    ctx.lineTo(-3, -73 + bob);
    ctx.lineTo(0, -78 + bob);
    ctx.lineTo(3, -73 + bob);
    ctx.lineTo(6, -78 + bob);
    ctx.closePath();
    ctx.fill();

    // Colossal Spiky Anime Mane in midnight violet
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.arc(0, -96 + bob, 24, 0, Math.PI * 2);
    ctx.arc(-20, -88 + bob, 16, 0, Math.PI * 2);
    ctx.arc(20, -88 + bob, 16, 0, Math.PI * 2);
    ctx.fill();

    // WEAPON: Colossal Spiked Flail / Wrecking Ball!
    ctx.save();
    ctx.translate(32, -45 + bob);
    // Purple energy chain links
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(18, 12);
    ctx.stroke();
    // Heavy Spiked Sphere
    ctx.fillStyle = '#7e22ce';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(26, 18, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Flail spikes
    ctx.fillStyle = '#f3e8ff';
    for (let s = 0; s < 6; s++) {
      const a = s * Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(26 + Math.cos(a) * 15, 18 + Math.sin(a) * 15);
      ctx.lineTo(26 + Math.cos(a) * 23, 18 + Math.sin(a) * 23);
      ctx.lineTo(26 + Math.cos(a + 0.3) * 15, 18 + Math.sin(a + 0.3) * 15);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 6. SARDONYX (Garnet + Pearl) ---
  drawSardonyx(ctx, bob, animP, actionType) {
    // Ultra-tall legs with white spat boots
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-13, -34 + bob, 10, 34);
    ctx.fillRect(3, -34 + bob, 10, 34);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-14, -10 + bob, 12, 10);
    ctx.fillRect(2, -10 + bob, 12, 10);

    // Rotating Midriff Joint & Black Tuxedo with Tails
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(-10, -42 + bob, 20, 8); // Visible rotating waist

    // Tuxedo Torso with peach lapels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-16, -76 + bob, 32, 36, 6);
    ctx.fill();
    // White shirt & black bowtie
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -74 + bob, 10, 16);
    ctx.fillStyle = '#000000';
    ctx.fillRect(-4, -70 + bob, 8, 3.5);

    // Peach skin head & iconic TRIANGULAR AFRO
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(0, -84 + bob, 13, 0, Math.PI * 2);
    ctx.fill();

    // Four Eyes behind round spectacles
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(-4, -86 + bob, 4, 0, Math.PI * 2);
    ctx.arc(4, -86 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Broad showbiz smile with sparkling teeth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -78 + bob, 10, 4);

    // Geometric Triangular Afro in bright reddish-orange
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(0, -114 + bob);
    ctx.lineTo(24, -88 + bob);
    ctx.lineTo(-24, -88 + bob);
    ctx.closePath();
    ctx.fill();

    // FOUR ARMS!
    // Upper arms holding War Hammer
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(-22, -72 + bob, 8, 24);
    ctx.fillRect(14, -72 + bob, 8, 24);
    // Lower arms with pristine white magician gloves
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-20, -50 + bob, 8, 14);
    ctx.fillRect(12, -50 + bob, 8, 14);

    // WEAPON: Colossal Theatrical War Hammer!
    ctx.save();
    ctx.translate(22, -60 + bob);
    // Hammer shaft
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-3, -45, 6, 75);
    // Weighted dual hammer head
    ctx.fillStyle = '#fb7185';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-16, -55, 32, 20, 4);
    ctx.fill();
    ctx.stroke();
    // Star emblem on hammer head
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 0, -45, 5);
    ctx.restore();
  }

  // --- 7. OPAL (Pearl + Amethyst) ---
  drawOpal(ctx, bob, animP, actionType) {
    // Tall slender legs with mint ribbon wraps
    ctx.fillStyle = '#c7d2fe';
    ctx.fillRect(-12, -32 + bob, 10, 32);
    ctx.fillRect(2, -32 + bob, 10, 32);
    // Mint ribbon ankle wraps
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-13, -12 + bob); ctx.lineTo(-2, -6 + bob);
    ctx.moveTo(2, -12 + bob); ctx.lineTo(13, -6 + bob);
    ctx.stroke();

    // Mint turquoise tunic with flowing lavender sash
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.roundRect(-15, -74 + bob, 30, 44, 6);
    ctx.fill();
    // Flowing lavender sash
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(-16, -48 + bob, 32, 6);
    ctx.fillRect(-14, -42 + bob, 8, 18);

    // Forehead pearl + chest amethyst gem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -90 + bob, 3, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    this.drawMiniStar(ctx, 0, -62 + bob, 5);
    ctx.fill();

    // Pale lavender skin head & serene warrior face
    ctx.fillStyle = '#c7d2fe';
    ctx.beginPath();
    ctx.arc(0, -82 + bob, 13, 0, Math.PI * 2);
    ctx.fill();

    // Serene aquamarine eyes
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(4, -83 + bob, 2.8, 0, Math.PI * 2);
    ctx.arc(-4, -83 + bob, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Silvery-white ponytail cascading down past waist
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -89 + bob, 16, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineTo(8, -50 + bob);
    ctx.bezierCurveTo(12, -30 + bob, -8, -30 + bob, -6, -50 + bob);
    ctx.closePath();
    ctx.fill();
    // High ponytail top knot
    ctx.beginPath();
    ctx.arc(0, -98 + bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // FOUR ARMS drawing the Giant Recurve Bow!
    ctx.fillStyle = '#c7d2fe';
    // Lower hands holding bow belly
    ctx.fillRect(-20, -56 + bob, 7, 24);
    ctx.fillRect(13, -56 + bob, 7, 24);
    // Upper hands pulling bowstring
    ctx.fillRect(-18, -70 + bob, 7, 20);
    ctx.fillRect(11, -70 + bob, 7, 20);

    // WEAPON: Giant Opal Recurve Bow & Energy Light Arrow!
    ctx.save();
    ctx.translate(18, -60 + bob);
    // Intertwined Pearl Spear & Amethyst Whip Recurve Bow
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(8, -48);
    ctx.bezierCurveTo(-14, -20, -14, 20, 8, 48);
    ctx.stroke();
    // Glowing bowstring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(8, -48);
    ctx.lineTo(-8, 0);
    ctx.lineTo(8, 48);
    ctx.stroke();
    // Light Arrow
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-16, -2, 38, 4);
    ctx.beginPath();
    ctx.moveTo(22, -6);
    ctx.lineTo(32, 0);
    ctx.lineTo(22, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- 8. MALACHITE (Lapis + Jasper) ---
  drawMalachite(ctx, bob, animP, actionType) {
    // Quadrupedal/bipedal walking limbs in sea-green
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-22, -26 + bob, 14, 26);
    ctx.fillRect(-6, -26 + bob, 13, 26);
    ctx.fillRect(9, -26 + bob, 14, 26);
    // Claws
    ctx.fillStyle = '#047857';
    ctx.fillRect(-23, -4 + bob, 16, 4);
    ctx.fillRect(-7, -4 + bob, 15, 4);
    ctx.fillRect(8, -4 + bob, 16, 4);

    // Monstrous Juggernaut Torso with Jasper tiger stripes
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.roundRect(-26, -78 + bob, 52, 54, 12);
    ctx.fill();
    // Emerald tiger stripes
    ctx.fillStyle = '#047857';
    ctx.fillRect(-24, -68 + bob, 16, 5);
    ctx.fillRect(8, -60 + bob, 16, 5);
    ctx.fillRect(-20, -50 + bob, 18, 5);

    // LAPIS LAZULI WATER WINGS on back!
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -65 + bob);
    ctx.bezierCurveTo(-52, -100 + bob, -60, -40 + bob, -24, -45 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, -65 + bob);
    ctx.bezierCurveTo(52, -100 + bob, 60, -40 + bob, 24, -45 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Upper Thrashing Arms with Hydro-Ice Claws!
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-36, -74 + bob, 12, 28);
    ctx.fillRect(24, -74 + bob, 12, 28);
    // Icy claws
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(-38, -48 + bob, 15, 8);
    ctx.fillRect(23, -48 + bob, 15, 8);

    // Head with Jasper's orange crystalline nose gem & SIX GLOWING EYES!
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.arc(0, -90 + bob, 18, 0, Math.PI * 2);
    ctx.fill();

    // Orange crystal nose gem
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-4, -90 + bob);
    ctx.lineTo(4, -90 + bob);
    ctx.lineTo(0, -84 + bob);
    ctx.closePath();
    ctx.fill();

    // SIX glowing lime-cyan eyes!
    ctx.fillStyle = '#84cc16';
    for (let e = 0; e < 6; e++) {
      const ex = -10 + (e % 3) * 10;
      const ey = -98 + Math.floor(e / 3) * 7 + bob;
      ctx.beginPath();
      ctx.arc(ex, ey, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fierce bared predator teeth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -80 + bob, 14, 4);

    // Massive untamed spiky mint-white mane
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.arc(0, -100 + bob, 26, 0, Math.PI * 2);
    ctx.arc(-22, -92 + bob, 16, 0, Math.PI * 2);
    ctx.arc(22, -92 + bob, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 9. RAINBOW QUARTZ CLASSIC (Rose + Pearl) ---
  drawRainbowQuartzClassic(ctx, bob, animP, actionType) {
    // 80s dance leotard legs with lavender tights & magenta leg warmers
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(-12, -32 + bob, 10, 32);
    ctx.fillRect(2, -32 + bob, 10, 32);
    // Magenta leg warmers & ballet slippers
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-13, -16 + bob, 12, 12);
    ctx.fillRect(1, -16 + bob, 12, 12);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(-13, -4 + bob, 12, 4);
    ctx.fillRect(1, -4 + bob, 12, 4);

    // 80s dance leotard torso with pastel teal sash
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-14, -70 + bob, 28, 40, 6);
    ctx.fill();
    // Pastel teal sash
    ctx.fillStyle = '#5eead4';
    ctx.fillRect(-15, -46 + bob, 30, 6);

    // Rose Quartz Navel Gem + Forehead Pearl
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 0, -38 + bob, 5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -88 + bob, 3, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fair peach-rose skin head & FOUR EYES
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -80 + bob, 13, 0, Math.PI * 2);
    ctx.fill();

    // Four Eyes: Top serene rose eyes, bottom pearl-blue eyes
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(-4, -84 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -84 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-4, -77 + bob, 2.6, 0, Math.PI * 2);
    ctx.arc(4, -77 + bob, 2.6, 0, Math.PI * 2);
    ctx.fill();

    // Voluminous 80s cascading blonde-pink hair
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -88 + bob, 18, 0, Math.PI * 2);
    ctx.arc(-14, -80 + bob, 12, 0, Math.PI * 2);
    ctx.arc(14, -80 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(0, -94 + bob, 14, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // WEAPONS: Rose's Parasol & Fencing Rapier
    ctx.save();
    ctx.translate(14, -54 + bob);
    // Rapier blade
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(28, -12);
    ctx.stroke();
    // Rose pommel
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFusionAttackVisuals(ctx, bob, fusion) {
    const stroke = Math.sin(Math.min(1, this.attackFrame / 3) * Math.PI);
    ctx.save();
    ctx.strokeStyle = fusion.glowColor || '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(28, -45 + bob, 38 * stroke, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.restore();
  }

"""

if target not in content:
    print("ERROR: target drawAttackVisuals not found in game.js")
    sys.exit(1)

content = content.replace(target, draw_code + target, 1)

with open(GAME_JS, "w", encoding="utf-8") as f:
    f.write(content)

print("Checkpoint 2: Fusion drawing methods added successfully!")
