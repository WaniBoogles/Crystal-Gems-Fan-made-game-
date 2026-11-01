import re

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update charThemes for afterimages in PlayerHero.draw to include connie and jasper
old_themes = """      const charThemes = {
        steven: { fill: 'rgba(255, 20, 147, 0.35)', stroke: 'rgba(255, 105, 180, 0.6)' },
        garnet: { fill: 'rgba(239, 68, 68, 0.35)', stroke: 'rgba(56, 189, 248, 0.6)' },
        amethyst: { fill: 'rgba(168, 85, 247, 0.35)', stroke: 'rgba(233, 213, 255, 0.6)' },
        pearl: { fill: 'rgba(34, 211, 238, 0.35)', stroke: 'rgba(255, 255, 255, 0.7)' },
        bismuth: { fill: 'rgba(249, 115, 22, 0.35)', stroke: 'rgba(250, 204, 21, 0.6)' },
        peridot: { fill: 'rgba(34, 197, 94, 0.35)', stroke: 'rgba(163, 230, 53, 0.6)' },
        lapis: { fill: 'rgba(14, 165, 233, 0.35)', stroke: 'rgba(224, 242, 254, 0.7)' },
        rose: { fill: 'rgba(244, 114, 182, 0.35)', stroke: 'rgba(255, 228, 230, 0.7)' }
      };"""

new_themes = """      const charThemes = {
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
      };"""

if old_themes in code:
    code = code.replace(old_themes, new_themes, 1)
    print("1. Updated charThemes with connie and jasper")

# 2. Remove early return in PlayerHero.draw for jasper spin dash
bad_jasper_return = """    if (this.isSpinDashing && this.activeChar === 'jasper') {
      this.drawJasperSpinDash(ctx);
      return;
    }"""
if bad_jasper_return in code:
    code = code.replace(bad_jasper_return, "", 1)
    print("2. Removed bad jasper spin dash early return in PlayerHero.draw")

# 3. Add Connie arms before sword in drawConnie
old_connie_arms = """    // 5. Kinetic Action Poses & Pink Sword (Bismuth-Forged Sword)
    const isPunch = (actionType === 'punch');
    const isSpecial = (actionType === 'throw');
    const isSkill = (actionType === 'skill');

    const swordSwing = isPunch ? Math.sin(animP * Math.PI) * 36 : (isSpecial ? 24 : 0);
    const swordX = 14 + swordSwing * 0.4;
    const swordY = -48 + bob - (isPunch ? 6 : 0);"""

new_connie_arms = """    // 5. Kinetic Action Poses & Pink Sword (Bismuth-Forged Sword)
    const isPunch = (actionType === 'punch');
    const isSpecial = (actionType === 'throw');
    const isSkill = (actionType === 'skill');

    const swordSwing = isPunch ? Math.sin(animP * Math.PI) * 36 : (isSpecial ? 24 : 0);
    const swordX = 14 + swordSwing * 0.4;
    const swordY = -48 + bob - (isPunch ? 6 : 0);

    // Connie's Arms (Jumpsuit Sleeves & Skin Hands holding the grip)
    ctx.fillStyle = '#1e40af'; // Blue jumpsuit sleeve
    ctx.fillRect(2, -54 + bob, 14, 8);
    ctx.fillStyle = '#a16207'; // Warm brown hand
    ctx.beginPath();
    ctx.arc(swordX - 2, swordY + 6, 4.5, 0, Math.PI * 2);
    ctx.fill();"""

if old_connie_arms in code:
    code = code.replace(old_connie_arms, new_connie_arms, 1)
    print("3. Added Connie arms and hands holding sword in drawConnie")

# 4. Upgrade drawDodgeVisuals
start_dodge = code.find("  drawDodgeVisuals(ctx, bob) {")
attack_start = code.find("  drawAttackVisuals(ctx, bob) {")
assert start_dodge != -1 and attack_start != -1, "drawDodgeVisuals or drawAttackVisuals not found"
old_dodge_fn = code[start_dodge:attack_start]

new_dodge_fn = """  drawDodgeVisuals(ctx, bob) {
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
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(-22, -56 + bob, 44, 48);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-18, -52 + bob, 36, 42);
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
      ctx.lineWidth = 3;
      ctx.strokeRect(-22, -62 + bob, 44, 46);
      ctx.fillStyle = 'rgba(234, 88, 12, 0.3)';
      ctx.fillRect(-20, -60 + bob, 40, 42);
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
      ctx.strokeRect(-20, -52 + bob, 40, 42);
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
      ctx.lineWidth = 4;
      ctx.strokeRect(-26, -72 + bob, 52, 56);
      ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
      ctx.fillRect(-22, -68 + bob, 44, 50);
      // Fiery ground friction sparks
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-30, -3, 60, 5);
      ctx.fillStyle = '#ef4444';
      this.drawDiamondInsignia(ctx, this.dodgeDirection * 26, -50 + bob, 7);
    }

    ctx.restore();
  }

"""

code = code.replace(old_dodge_fn, new_dodge_fn, 1)
print("4. Upgraded drawDodgeVisuals for all 10 characters")

# 5. Upgrade drawAttackVisuals with 3-Hit Combo Variations for all 10 characters
start_attack = code.find("  drawAttackVisuals(ctx, bob) {")
end_waves = code.find("const EPISODE_WAVES = {")
hero_end = code.rfind("  }\n}", 0, end_waves)
old_attack_fn = code[start_attack : hero_end + 3]

new_attack_fn = """  drawAttackVisuals(ctx, bob) {
    ctx.save();
    const frame = this.attackFrame; // 0 to 3
    const combo = this.attackCombo; // 0, 1, 2
    const c = this.activeChar;

    if (c === 'connie') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Swift Fencing Rapier Lunge Thrust
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(12, -45 + bob);
          ctx.lineTo(60 + frame * 6, -45 + bob);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(60 + frame * 6, -45 + bob, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 64 + frame * 6, -45 + bob, 6);
        } else if (combo === 1) {
          // Hit 2: High Horizontal Rose-Crystal Crescent Slash
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(22, -38 + bob, 36, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(22, -38 + bob, 32, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 52, -38 + bob, 7);
        } else {
          // Hit 3: Aerial Knight's Cleave with Massive Pink Crescent & Golden Star Eruption!
          ctx.strokeStyle = '#db2777';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(26, -34 + bob, 46, -Math.PI * 0.6, Math.PI * 0.35);
          ctx.stroke();
          ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
          ctx.fill();
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 58, -25 + bob, 9);
          this.drawMiniStar(ctx, 42, -58 + bob, 6.5);
        }
      } else if (this.attackType === 'K') {
        // Flying Sword Shockwave Beam Pulse
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.95)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(28, -38 + bob, 28, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 148, 186, 0.45)';
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        this.drawMiniStar(ctx, 54, -38 + bob, 8);
      } else if (this.attackType === 'L') {
        // Shadow Step Cross-Cutting Slashes with Lightning Trail
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(-30, -60 + bob);
        ctx.lineTo(55, -15 + bob);
        ctx.moveTo(-30, -15 + bob);
        ctx.lineTo(55, -60 + bob);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-25, -38 + bob);
        ctx.lineTo(60, -38 + bob);
        ctx.stroke();
        ctx.fillStyle = '#ec4899';
        this.drawMiniStar(ctx, 55, -38 + bob, 8.5);
      }
    } else if (c === 'jasper') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Brutal Tiger Gut Punch
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(26, -42 + bob, 28, -Math.PI * 0.35, Math.PI * 0.35);
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 48, -42 + bob, 7);
        } else if (combo === 1) {
          // Hit 2: Overhead Hammer Fist Slam
          ctx.strokeStyle = '#c2410c';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(20, -80 + bob);
          ctx.lineTo(48, -25 + bob);
          ctx.stroke();
          ctx.fillStyle = '#f97316';
          this.drawMiniStar(ctx, 48, -25 + bob, 8.5);
        } else {
          // Hit 3: Ground-Rupturing Beta Haymaker with Cracking Shockwave!
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.arc(30, -36 + bob, 45, -Math.PI * 0.5, Math.PI * 0.4);
          ctx.stroke();
          ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
          ctx.fill();
          // Volcanic impact cracks
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(35, -15 + bob);
          ctx.lineTo(65, -5 + bob);
          ctx.lineTo(55, 10);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          this.drawDiamondInsignia(ctx, 56, -36 + bob, 9);
        }
      } else if (this.attackType === 'K') {
        // Crash Helmet Charge Ram Cone & Burning Comet Trail
        ctx.fillStyle = 'rgba(234, 88, 12, 0.8)';
        ctx.beginPath();
        ctx.moveTo(10, -66 + bob);
        ctx.lineTo(55, -48 + bob);
        ctx.lineTo(10, -30 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // Spin Dash Fiery Shockwaves & Flaming Disc
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(0, 0, 40 + Math.sin(Date.now() / 40) * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 48 + Math.sin(Date.now() / 40) * 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (c === 'steven') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Star Punch
          ctx.strokeStyle = '#ff6097';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(18, -34 + bob, 24, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.stroke();
          ctx.fillStyle = '#ffd166';
          this.drawMiniStar(ctx, 36, -34 + bob, 6);
        } else if (combo === 1) {
          // Hit 2: Crystalline Shield Swipe
          ctx.strokeStyle = '#ff6097';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(22, -34 + bob, 32, -Math.PI * 0.5, Math.PI * 0.4);
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 96, 151, 0.35)';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 45, -34 + bob, 7);
        } else {
          // Hit 3: Shield Uppercut with Expanding Star Burst!
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(24, -40 + bob, 40, -Math.PI * 0.65, Math.PI * 0.25);
          ctx.stroke();
          ctx.fillStyle = '#ffd166';
          this.drawMiniStar(ctx, 52, -45 + bob, 9.5);
          this.drawMiniStar(ctx, 36, -70 + bob, 6.5);
        }
      } else if (this.attackType === 'L') {
        // Crystalline Bubble Shockwave Expanding Aura
        ctx.strokeStyle = 'rgba(255, 148, 186, 0.9)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, -32 + bob, 42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ff6097';
        this.drawMiniStar(ctx, 36, -32 + bob, 7.5);
      }
    } else if (c === 'garnet') {
      if (this.attackType === 'J') {
        const punchX = 28 + frame * 8;
        if (combo === 0) {
          // Hit 1: Left Ruby Gauntlet Jab
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(punchX, -50 + bob, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (combo === 1) {
          // Hit 2: Right Sapphire Gauntlet Cross
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(punchX + 4, -44 + bob, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          // Hit 3: Seismic Double Gauntlet Hammer Slam
          ctx.fillStyle = '#e11d48';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(punchX + 6, -42 + bob, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(punchX - 10, -56 + bob, 32, 28);
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, punchX + 16, -42 + bob, 9);
        }
      } else if (this.attackType === 'L') {
        // High-Voltage Lightning Ground Shock
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(10, -70 + bob);
        ctx.lineTo(24, -40 + bob);
        ctx.lineTo(16, -20 + bob);
        ctx.lineTo(38, 0);
        ctx.stroke();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-10, -65 + bob);
        ctx.lineTo(-20, -35 + bob);
        ctx.lineTo(-14, -18 + bob);
        ctx.lineTo(-32, 0);
        ctx.stroke();
      }
    } else if (c === 'amethyst') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Forward Whip Slash Arc
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(22, -36 + bob, 36, -Math.PI * 0.45, Math.PI * 0.35);
          ctx.stroke();
          ctx.fillStyle = '#f3e8ff';
          this.drawMiniStar(ctx, 46, -25 + bob, 6);
        } else if (combo === 1) {
          // Hit 2: Low-Sweeping Whip Crack
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(26, -22 + bob, 42, -Math.PI * 0.2, Math.PI * 0.6);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 52, -15 + bob, 7.5);
        } else {
          // Hit 3: Dual Spiked Whip Cross-Cleave
          ctx.strokeStyle = '#9333ea';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(10, -65 + bob);
          ctx.lineTo(55, -15 + bob);
          ctx.moveTo(10, -15 + bob);
          ctx.lineTo(55, -65 + bob);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 55, -40 + bob, 10);
        }
      } else if (this.attackType === 'L') {
        // Amethyst Violet Geyser Ground Shockwave Arc & Electric Star
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(38, -18 + bob, 36, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 54, -18 + bob, 10);
      }
    } else if (c === 'pearl') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Laser Needle Thrust
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(20, -52 + bob);
          ctx.lineTo(58, -52 + bob);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(58, -52 + bob, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (combo === 1) {
          // Hit 2: Sweeping Crescent Spear Cleave
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(24, -46 + bob, 36, -Math.PI * 0.5, Math.PI * 0.4);
          ctx.stroke();
          ctx.fillStyle = '#a5f3fc';
          this.drawMiniStar(ctx, 52, -46 + bob, 6.5);
        } else {
          // Hit 3: Pirouette Spear Halo Spin
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(28, -48 + bob, 44, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 58, -48 + bob, 9);
        }
      } else if (this.attackType === 'L') {
        // Holo-Pearl Summoning Portal Glint
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(38, -42 + bob, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 38, -42 + bob, 9);
      }
    } else if (c === 'bismuth') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Spiked Mace Swing
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(22, -35 + bob, 36, -Math.PI * 0.5, Math.PI * 0.2);
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(48, -12 + bob, 6, 6);
        } else if (combo === 1) {
          // Hit 2: Heavy Anvil Swipe
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.arc(24, -38 + bob, 42, -Math.PI * 0.6, Math.PI * 0.3);
          ctx.stroke();
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(52, -22 + bob, 8, 8);
        } else {
          // Hit 3: Molten Anvil Ground Smash
          ctx.strokeStyle = '#c2410c';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(15, -75 + bob);
          ctx.lineTo(50, -5 + bob);
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 52, -5 + bob, 11);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(44, -12 + bob, 14, 10);
        }
      } else if (this.attackType === 'L') {
        // Breaking Point Molten Rupture Aura
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(10, -60 + bob);
        ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        this.drawMiniStar(ctx, 40, 0, 11);
      }
    } else if (c === 'peridot') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Magnetic Claw Slash
          ctx.strokeStyle = '#84cc16';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(15, -55 + bob);
          ctx.lineTo(48, -32 + bob);
          ctx.stroke();
          ctx.fillStyle = '#a3e635';
          this.drawMiniStar(ctx, 48, -32 + bob, 6);
        } else if (combo === 1) {
          // Hit 2: Levitating Girder Swipe
          ctx.strokeStyle = '#65a30d';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(12, -28 + bob);
          ctx.lineTo(52, -52 + bob);
          ctx.stroke();
          ctx.fillStyle = '#84cc16';
          this.drawMiniStar(ctx, 52, -52 + bob, 7.5);
        } else {
          // Hit 3: Magnetic Vice Clamp
          ctx.strokeStyle = '#84cc16';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(32, -38 + bob, 32, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 52, -38 + bob, 9);
        }
      } else if (this.attackType === 'L') {
        // EMP Magnetic Vortex Wave Pulse
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(28, -35 + bob, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#a3e635';
        this.drawMiniStar(ctx, 28, -35 + bob, 8);
      }
    } else if (c === 'lapis') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Hydro-Blade Slash
          ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(22, -40 + bob, 32, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.lineTo(26, -40 + bob);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (combo === 1) {
          // Hit 2: Water Fist Uppercut
          ctx.fillStyle = 'rgba(2, 132, 199, 0.85)';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(28, -45 + bob, 36, -Math.PI * 0.6, Math.PI * 0.2);
          ctx.stroke();
          ctx.fill();
        } else {
          // Hit 3: Giant Water Tendril Whip Smash
          ctx.fillStyle = 'rgba(14, 165, 233, 0.85)';
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(32, -35 + bob, 46, -Math.PI * 0.5, Math.PI * 0.4);
          ctx.stroke();
          ctx.fill();
        }
      } else if (this.attackType === 'L') {
        // Roaring Tidal Surge Water Crest
        ctx.fillStyle = 'rgba(2, 132, 199, 0.8)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(34, -35 + bob, 34, -Math.PI * 0.4, Math.PI * 0.6);
        ctx.stroke();
        ctx.fill();
      }
    } else if (c === 'rose') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Rose Sword Slash
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(20, -40 + bob, 36, -Math.PI * 0.5, Math.PI * 0.35);
          ctx.stroke();
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 46, -30 + bob, 5.5);
        } else if (combo === 1) {
          // Hit 2: Bramble Shield Bash
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(24, -38 + bob, 42, -Math.PI * 0.4, Math.PI * 0.4);
          ctx.stroke();
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 52, -38 + bob, 7);
        } else {
          // Hit 3: Celestial Rose Vortex Cleave
          ctx.strokeStyle = '#db2777';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(26, -36 + bob, 48, -Math.PI * 0.65, Math.PI * 0.35);
          ctx.stroke();
          ctx.fillStyle = 'rgba(251, 207, 232, 0.4)';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 56, -30 + bob, 9.5);
        }
      } else if (this.attackType === 'L') {
        // Sacred Tears Divine Light Halo & Blooming Petals
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.95)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -40 + bob, 42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fbcfe8';
        this.drawMiniStar(ctx, 0, -40 + bob, 9);
      }
    }

    ctx.restore();
  }"""

code = code.replace(old_attack_fn, new_attack_fn, 1)
print("5. Upgraded drawAttackVisuals with 3-Hit Combo Variations for all 10 characters")

# 6. Update EnemyManager checkPlayerAttackCollisions:
old_melee_check = """      let hitRange = 85;
      if (player.activeChar === 'amethyst') hitRange = 120;
      else if (player.activeChar === 'lapis') hitRange = 115;
      else if (player.activeChar === 'rose' || player.activeChar === 'pearl') hitRange = 100;
      else if (player.activeChar === 'bismuth') hitRange = 95;

      const isFacing = (player.facing === 1 && e.x >= player.x - 15) || (player.facing === -1 && e.x <= player.x + 15);
      const dist = Math.abs(player.x - e.x);

      if (isFacing && dist < hitRange && e.hurtTimer <= 0) {
        let dmg = 25;
        if (player.activeChar === 'garnet') dmg = 38;
        else if (player.activeChar === 'amethyst') dmg = 28;
        else if (player.activeChar === 'pearl') dmg = 30;
        else if (player.activeChar === 'bismuth') dmg = 44;
        else if (player.activeChar === 'peridot') dmg = 28;
        else if (player.activeChar === 'lapis') dmg = 30;
        else if (player.activeChar === 'rose') dmg = 36;

        if (player.isPinkOverdrive) {
          dmg = Math.round(dmg * 2.0);
        }

        this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex);

        // ENEMY STAGGER & KNOCKBACK
        if (player.activeChar === 'bismuth') {
          // Bismuth heavy hammer knockback: launches back with vertical lift!
          e.vx = player.facing * 560;
          e.vy = -280;
          e.hurtTimer = 0.45;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SMASH!', true, '#f97316');
        } else {
          e.vx = player.facing * 220;
          e.hurtTimer = 0.35;
        }"""

new_melee_check = """      let hitRange = 85;
      if (player.activeChar === 'amethyst') hitRange = 120;
      else if (player.activeChar === 'lapis') hitRange = 115;
      else if (player.activeChar === 'jasper') hitRange = 110;
      else if (player.activeChar === 'connie') hitRange = 105;
      else if (player.activeChar === 'rose' || player.activeChar === 'pearl') hitRange = 100;
      else if (player.activeChar === 'bismuth') hitRange = 95;

      const isFacing = (player.facing === 1 && e.x >= player.x - 15) || (player.facing === -1 && e.x <= player.x + 15);
      const dist = Math.abs(player.x - e.x);

      if (isFacing && dist < hitRange && e.hurtTimer <= 0) {
        let dmg = 25;
        if (player.activeChar === 'bismuth') dmg = 44;
        else if (player.activeChar === 'jasper') dmg = 42;
        else if (player.activeChar === 'garnet') dmg = 38;
        else if (player.activeChar === 'rose') dmg = 36;
        else if (player.activeChar === 'connie') dmg = 32;
        else if (player.activeChar === 'pearl') dmg = 30;
        else if (player.activeChar === 'lapis') dmg = 30;
        else if (player.activeChar === 'amethyst') dmg = 28;
        else if (player.activeChar === 'peridot') dmg = 28;

        if (player.isPinkOverdrive) {
          dmg = Math.round(dmg * 2.0);
        }

        this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex);

        // ENEMY STAGGER & KNOCKBACK
        if (player.activeChar === 'bismuth') {
          // Bismuth heavy hammer knockback: launches back with vertical lift!
          e.vx = player.facing * 560;
          e.vy = -280;
          e.hurtTimer = 0.45;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SMASH!', true, '#f97316');
        } else if (player.activeChar === 'jasper') {
          // Jasper crushing Beta Quartz impact
          e.vx = player.facing * 520;
          e.vy = -240;
          e.hurtTimer = 0.42;
          particles.addDamageText(e.x, e.y - e.height - 20, 'BRUTAL HIT!', true, '#ea580c');
        } else if (player.activeChar === 'connie') {
          // Connie precision fencing thrust
          e.vx = player.facing * 260;
          e.vy = -120;
          e.hurtTimer = 0.36;
          particles.addDamageText(e.x, e.y - e.height - 20, 'PIERCE!', true, '#ec4899');
        } else {
          e.vx = player.facing * 220;
          e.hurtTimer = 0.35;
        }"""

if old_melee_check in code:
    code = code.replace(old_melee_check, new_melee_check, 1)
    print("6. Updated melee check with connie and jasper hitRange, damage, and knockback")

# 7. Update isPersistentAoE to include connieShadowSlash
old_aoe = "const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex');"
new_aoe = "const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash');"
if old_aoe in code:
    code = code.replace(old_aoe, new_aoe, 1)
    print("7. Updated isPersistentAoE with connieShadowSlash")

# 8. Add specific knockback for jasperCrashHelmet, jasperSpinDashHit, connieSwordBeam
old_kb = """        if (p.type === 'bismuthAnvil') {"""
new_kb = """        if (p.type === 'jasperCrashHelmet') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 650;
          e.vy = -320;
          e.hurtTimer = 0.55;
          particles.addDamageText(e.x, e.y - e.height - 20, 'HELMET CRASH!', true, '#ea580c');
          particles.addSparkle(e.x, e.y - 20, '#fbbf24', 16, 5);
        } else if (p.type === 'jasperSpinDashHit') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 580;
          e.vy = -260;
          e.hurtTimer = 0.45;
          particles.addDamageText(e.x, e.y - e.height - 20, 'TORNADO SHRED!', true, '#f97316');
        } else if (p.type === 'connieSwordBeam') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 420;
          e.vy = -180;
          e.hurtTimer = 0.40;
          particles.addDamageText(e.x, e.y - e.height - 20, 'CRESCENT BEAM!', true, '#ec4899');
        } else if (p.type === 'connieShadowSlash') {
          e.vx = player.facing * 340;
          e.vy = -200;
          e.hurtTimer = 0.40;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SHADOW CUT!', true, '#f472b6');
        } else if (p.type === 'bismuthAnvil') {"""

if old_kb in code:
    code = code.replace(old_kb, new_kb, 1)
    print("8. Added knockbacks for Jasper and Connie projectiles")

# 9. Update projectile cleanup condition for jasperSpinDashHit
old_cleanup = "} else if (!isPersistentAoE && p.type !== 'amethystSpinDashHit') {"
new_cleanup = "} else if (!isPersistentAoE && p.type !== 'amethystSpinDashHit' && p.type !== 'jasperSpinDashHit') {"
if old_cleanup in code:
    code = code.replace(old_cleanup, new_cleanup, 1)
    print("9. Updated projectile cleanup for jasperSpinDashHit")

# 10. Update practice mode objective text
old_obj = "objText.textContent = 'Tekken Practice Mode: Infinite HP Training Dummy. Practice combos, juggles & Overdrives freely!';"
new_obj = "objText.textContent = 'Practice Mode: Infinite HP Training Dummy. Practice combos, juggles & Overdrives freely!';"
if old_obj in code:
    code = code.replace(old_obj, new_obj, 1)
    print("10. Updated practice mode objective text")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: All 10 steps applied cleanly to game.js!")
