#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
patch_game_controller_and_projectiles.py
Applies fusion projectile drawing, game controller sync, and fusion methods to game.js
"""

import sys

GAME_JS = "/home/wanibur/Documents/Wani Works/Antigravity Tests/Steven Universe/game.js"

with open(GAME_JS, "r", encoding="utf-8") as f:
    content = f.read()

print("Current length:", len(content))

# 1. Update EnemyManager melee collision for fusions
em_hitrange_target = """      let hitRange = 85;
      if (player.activeChar === 'amethyst') hitRange = 120;"""

em_hitrange_replacement = """      let hitRange = 85;
      if (player.isFusion) hitRange = 165;
      else if (player.activeChar === 'amethyst') hitRange = 120;"""

if em_hitrange_target not in content:
    print("ERROR: em_hitrange_target not found")
    sys.exit(1)
content = content.replace(em_hitrange_target, em_hitrange_replacement, 1)

em_dmg_target = """        let dmg = 25;
        if (player.activeChar === 'bismuth') dmg = 44;"""

em_dmg_replacement = """        let dmg = 25;
        if (player.isFusion) dmg = 75;
        else if (player.activeChar === 'bismuth') dmg = 44;"""

if em_dmg_target not in content:
    print("ERROR: em_dmg_target not found")
    sys.exit(1)
content = content.replace(em_dmg_target, em_dmg_replacement, 1)

# Add fusion types to persistent AoE throttle
aoe_target = """const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash');"""

aoe_replacement = """const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash' || p.type === 'fusionRoseSwordWave' || p.type === 'fusionCyclone' || p.type === 'fusionPrismCannon' || p.type === 'fusionSupernova' || p.type === 'fusionFlailCataclysm' || p.type === 'fusionShowstopper' || p.type === 'fusionTsunamiCage' || p.type === 'fusionPrismRose');"""

if aoe_target not in content:
    print("ERROR: aoe_target not found")
    sys.exit(1)
content = content.replace(aoe_target, aoe_replacement, 1)
print("1. EnemyManager collision and AoE throttle updated for fusions.")

# 2. Add fusion projectiles to drawProjectile(p)
dp_target = """  drawProjectile(p) {
    this.ctx.save();
    if (p.type === 'connieSwordBeam') {"""

dp_replacement = """  drawProjectile(p) {
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
      // Smoky Quartz: Twin Spinning Yo-Yos!
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 45 : Date.now() / 45);
      this.ctx.rotate(rot);
      this.ctx.fillStyle = '#a855f7';
      this.ctx.strokeStyle = '#f3e8ff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 30, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
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
      // Rainbow Quartz 2.0: Titanic Prismatic Laser Beam!
      this.ctx.translate(p.x, p.y);
      const w = p.width || 320, h = p.height || 90;
      const beamGrad = this.ctx.createLinearGradient(0, -h/2, 0, h/2);
      beamGrad.addColorStop(0, '#f43f5e');
      beamGrad.addColorStop(0.25, '#fb923c');
      beamGrad.addColorStop(0.5, '#ffffff');
      beamGrad.addColorStop(0.75, '#38bdf8');
      beamGrad.addColorStop(1, '#a855f7');
      this.ctx.fillStyle = beamGrad;
      this.ctx.fillRect(-w/2, -h/2, w, h);
    } else if (p.type === 'fusionSunGauntlet') {
      // Sunstone: Solar Rocket Punch!
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      this.ctx.fillStyle = '#ea580c';
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 32, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      // Suction cup rim
      this.ctx.fillStyle = '#f97316';
      this.ctx.fillRect(8, -12, 10, 24);
    } else if (p.type === 'fusionSupernova') {
      // Sunstone: Supernova Solar Burst!
      this.ctx.translate(p.x, p.y);
      const w = p.width || 340, h = p.height || 250;
      const sunGrad = this.ctx.createRadialGradient(0, 0, 10, 0, 0, w/2);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#fde047');
      sunGrad.addColorStop(0.7, '#ea580c');
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.fillRect(-w/2, -h/2, w, h);
    } else if (p.type === 'fusionHammerDrill') {
      // Sardonyx: Spinning Hammer Drill!
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 40 : Date.now() / 40);
      this.ctx.rotate(rot);
      this.ctx.fillStyle = '#fb7185';
      this.ctx.strokeStyle = '#fdba74';
      this.ctx.lineWidth = 3;
      this.ctx.fillRect(-20, -14, 40, 28);
      this.ctx.strokeRect(-20, -14, 40, 28);
    } else if (p.type === 'fusionShowstopper') {
      // Sardonyx: Showstopper Finale Spotlights!
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = 'rgba(253, 186, 116, 0.45)';
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -90);
      this.ctx.lineTo(-80, 70);
      this.ctx.lineTo(80, 70);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'fusionOpalArrow' || p.type === 'fusionCelestialRain') {
      // Opal: Piercing Light Arrow!
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = '#fde047';
      this.ctx.strokeStyle = '#818cf8';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.radius || 18, 5, (p.vy ? Math.atan2(p.vy, p.vx || 1) : 0), 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'fusionGlacialFist') {
      // Malachite: Glacial Ice Slam Fist!
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = 'rgba(45, 212, 191, 0.85)';
      this.ctx.strokeStyle = '#a7f3d0';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.roundRect(-45, -55, 90, 110, 12);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'fusionTsunamiCage') {
      // Malachite: Abyssal Tsunami Cage!
      this.ctx.translate(p.x, p.y);
      const w = p.width || 320, h = p.height || 170;
      this.ctx.fillStyle = 'rgba(13, 148, 136, 0.75)';
      this.ctx.strokeStyle = '#2dd4bf';
      this.ctx.lineWidth = 4;
      this.ctx.fillRect(-w/2, -h/2, w, h);
      this.ctx.strokeRect(-w/2, -h/2, w, h);
    } else if (p.type === 'fusionFlailCataclysm') {
      // Sugilite: Flail Cataclysm Crater!
      this.ctx.translate(p.x, p.y);
      const w = p.width || 300, h = p.height || 170;
      this.ctx.fillStyle = 'rgba(126, 34, 206, 0.8)';
      this.ctx.strokeStyle = '#f3e8ff';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, w/2, h/2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'fusionPrismRose') {
      // Rainbow Quartz Classic: Prismatic Tears Vortex!
      this.ctx.translate(p.x, p.y);
      const rot = (typeof performance !== 'undefined' ? performance.now() / 50 : Date.now() / 50);
      this.ctx.rotate(rot);
      this.ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
      this.ctx.strokeStyle = '#fbcfe8';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 75, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'connieSwordBeam') {"""

if dp_target not in content:
    print("ERROR: dp_target not found")
    sys.exit(1)
content = content.replace(dp_target, dp_replacement, 1)
print("2. drawProjectile updated with all fusion projectiles.")

# 3. Update StevenUniverseGame constructor to initialize fusion attributes
su_cons_target = """    this.highScore = parseInt(SafeStorage.getItem('su_highScore') || '0', 10) || 0;
    this.savedBubbles = safeJsonParse(SafeStorage.getItem('su_bubbledGems'), []);"""

su_cons_replacement = """    this.highScore = parseInt(SafeStorage.getItem('su_highScore') || '0', 10) || 0;
    this.savedBubbles = safeJsonParse(SafeStorage.getItem('su_bubbledGems'), []);

    // Canonical Gem Fusion Attributes
    this.fusionEnergy = 0;
    this.isFused = false;
    this.fusionTimer = 0;
    this.fusionMaxDuration = 25.0;"""

if su_cons_target not in content:
    print("ERROR: su_cons_target not found")
    sys.exit(1)
content = content.replace(su_cons_target, su_cons_replacement, 1)
print("3. StevenUniverseGame constructor updated with fusion fields.")

# 4. Update updateLobbyGuardian() to update #lobbyFusionStatus
lg_target = """    if (this.playerMode === '2p') {
      const dataP2 = GUARDIAN_DATA[this.selectedCharP2] || GUARDIAN_DATA.garnet;
      if (avatarEl) avatarEl.textContent = `${dataP1.icon}${dataP2.icon}`;
      if (nameEl) nameEl.textContent = `P1: ${dataP1.name} • P2: ${dataP2.name}`;
      if (descEl) descEl.textContent = `P1 (${dataP1.name}): WASD + F/G/H/R • P2 (${dataP2.name}): Arrows + J/K/L/O`;
      if (badgeEl) badgeEl.textContent = 'CHOSEN GUARDIANS (P1 & P2) • CLICK TO SWITCH 🔄';
    } else {
      if (avatarEl) avatarEl.textContent = dataP1.icon;
      if (nameEl) nameEl.textContent = dataP1.name;
      if (descEl) descEl.textContent = dataP1.desc;
      if (badgeEl) badgeEl.textContent = 'CHOSEN GUARDIAN • CLICK TO SWITCH 🔄';
    }
  }"""

lg_replacement = """    if (this.playerMode === '2p') {
      const dataP2 = GUARDIAN_DATA[this.selectedCharP2] || GUARDIAN_DATA.garnet;
      if (avatarEl) avatarEl.textContent = `${dataP1.icon}${dataP2.icon}`;
      if (nameEl) nameEl.textContent = `P1: ${dataP1.name} • P2: ${dataP2.name}`;
      if (descEl) descEl.textContent = `P1 (${dataP1.name}): WASD + F/G/H/R • P2 (${dataP2.name}): Arrows + J/K/L/O`;
      if (badgeEl) badgeEl.textContent = 'CHOSEN GUARDIANS (P1 & P2) • CLICK TO SWITCH 🔄';
    } else {
      if (avatarEl) avatarEl.textContent = dataP1.icon;
      if (nameEl) nameEl.textContent = dataP1.name;
      if (descEl) descEl.textContent = dataP1.desc;
      if (badgeEl) badgeEl.textContent = 'CHOSEN GUARDIAN • CLICK TO SWITCH 🔄';
    }

    const lobbyFusionStatus = document.getElementById('lobbyFusionStatus');
    const lobbyFusionText = document.getElementById('lobbyFusionStatusText');
    if (lobbyFusionStatus && lobbyFusionText) {
      if (this.playerMode === '2p') {
        const f = getCanonFusion(this.selectedCharP1, this.selectedCharP2);
        if (f) {
          lobbyFusionStatus.className = 'lobby-fusion-status compatible';
          lobbyFusionText.innerHTML = `✨ <b>CANON FUSION READY: ${f.name.toUpperCase()}</b> (${GUARDIAN_DATA[this.selectedCharP1]?.name} + ${GUARDIAN_DATA[this.selectedCharP2]?.name}) • ${f.weapon}`;
        } else {
          lobbyFusionStatus.className = 'lobby-fusion-status incompatible';
          lobbyFusionText.innerHTML = `⚠️ <b>NO CANON SHOW FUSION</b> (${GUARDIAN_DATA[this.selectedCharP1]?.name} & ${GUARDIAN_DATA[this.selectedCharP2]?.name} fight as independent gems)`;
        }
      } else {
        const partners = getCompatibleFusionPartners(this.selectedCharP1);
        if (partners.length > 0) {
          lobbyFusionStatus.className = 'lobby-fusion-status compatible';
          const names = partners.map(p => `<b>${p.fusion.name}</b> (+${GUARDIAN_DATA[p.partnerId]?.name})`).join(', ');
          lobbyFusionText.innerHTML = `✨ <b>CANON FUSIONS AVAILABLE:</b> ${names}`;
        } else {
          lobbyFusionStatus.className = 'lobby-fusion-status incompatible';
          lobbyFusionText.innerHTML = `⚠️ <b>INDEPENDENT GEM:</b> ${GUARDIAN_DATA[this.selectedCharP1]?.name} has no canonical show fusion`;
        }
      }
    }
  }"""

if lg_target not in content:
    print("ERROR: lg_target not found")
    sys.exit(1)
content = content.replace(lg_target, lg_replacement, 1)
print("4. updateLobbyGuardian updated with fusion compatibility badge.")

# 5. Update updateCharPreview(charId) to populate #fusionPreviewList
cp_target = """    if (jEl) jEl.textContent = data.j.desc;
    if (kEl) kEl.textContent = data.k.desc;
    if (lEl) lEl.textContent = data.l.desc;
  }"""

cp_replacement = """    if (jEl) jEl.textContent = data.j.desc;
    if (kEl) kEl.textContent = data.k.desc;
    if (lEl) lEl.textContent = data.l.desc;

    const fList = document.getElementById('fusionPreviewList');
    if (fList) {
      fList.innerHTML = '';
      const partners = getCompatibleFusionPartners(charId);
      if (partners.length > 0) {
        for (const p of partners) {
          const chip = document.createElement('span');
          chip.className = 'fusion-chip';
          const partnerName = GUARDIAN_DATA[p.partnerId]?.name || p.partnerId;
          chip.innerHTML = `${p.fusion.icon} <b>${p.fusion.name}</b> (+${partnerName}) — <i>${p.fusion.weapon}</i>`;
          fList.appendChild(chip);
        }
      } else {
        const chip = document.createElement('span');
        chip.className = 'fusion-chip none';
        chip.innerHTML = `⚠️ Independent Gem — No canonical show fusion`;
        fList.appendChild(chip);
      }
    }
  }"""

if cp_target not in content:
    print("ERROR: cp_target not found")
    sys.exit(1)
content = content.replace(cp_target, cp_replacement, 1)
print("5. updateCharPreview updated with partner chips.")

# 6. Update combo hits, poofed enemies, pickups, and practice mode to charge fusion sync
combo_target = """  registerComboHit(dmg) {
    this.comboHits++;
    this.comboDamage += dmg;
    this.comboTimer = 1.8;"""

combo_replacement = """  registerComboHit(dmg) {
    this.comboHits++;
    this.comboDamage += dmg;
    this.comboTimer = 1.8;
    this.addFusionSync(2 + Math.min(8, this.comboHits * 0.5));"""

if combo_target not in content:
    print("ERROR: combo_target not found")
    sys.exit(1)
content = content.replace(combo_target, combo_replacement, 1)

practice_charge_target = """    if (this.gameMode === 'practice') {
      this.starPowerMeter = Math.min(100, this.starPowerMeter + dt * 45);
      if (this.playerMode === '2p') {
        this.starPowerMeterP2 = Math.min(100, (this.starPowerMeterP2 || 0) + dt * 45);
      }
    }"""

practice_charge_replacement = """    if (this.gameMode === 'practice') {
      this.starPowerMeter = Math.min(100, this.starPowerMeter + dt * 45);
      if (this.playerMode === '2p') {
        this.starPowerMeterP2 = Math.min(100, (this.starPowerMeterP2 || 0) + dt * 45);
      }
      this.fusionEnergy = Math.min(100, (this.fusionEnergy || 0) + dt * 50);
    }"""

if practice_charge_target not in content:
    print("ERROR: practice_charge_target not found")
    sys.exit(1)
content = content.replace(practice_charge_target, practice_charge_replacement, 1)

fusion_timer_target = """    // 0. Update Overdrive States"""

fusion_timer_replacement = """    // Update Canonical Gem Fusion Timer
    if (this.isFused) {
      this.fusionTimer -= dt;
      if (this.fusionTimer <= 0) {
        this.unfuseGems();
      }
    }

    // 0. Update Overdrive States"""

if fusion_timer_target not in content:
    print("ERROR: fusion_timer_target not found")
    sys.exit(1)
content = content.replace(fusion_timer_target, fusion_timer_replacement, 1)

pickup_sync_target = """        this.score += 150;
        this.pickups.splice(i, 1);
        this.updateHUD();"""

pickup_sync_replacement = """        this.score += 150;
        this.addFusionSync(15);
        this.pickups.splice(i, 1);
        this.updateHUD();"""

if pickup_sync_target not in content:
    print("ERROR: pickup_sync_target not found")
    sys.exit(1)
content = content.replace(pickup_sync_target, pickup_sync_replacement, 1)

poof_sync_target = """    this.enemyManager.update(dt, this.player, this.audio, this.particles, this.projectiles, (poofedEnemy) => {
      this.score += poofedEnemy.isBoss ? 1500 : 300;
      this.updateHUD();
    }, platforms, this.player2);"""

poof_sync_replacement = """    this.enemyManager.update(dt, this.player, this.audio, this.particles, this.projectiles, (poofedEnemy) => {
      this.score += poofedEnemy.isBoss ? 1500 : 300;
      this.addFusionSync(poofedEnemy.isBoss ? 25 : 15);
      this.updateHUD();
    }, platforms, this.player2);"""

if poof_sync_target not in content:
    print("ERROR: poof_sync_target not found")
    sys.exit(1)
content = content.replace(poof_sync_target, poof_sync_replacement, 1)
print("6. Fusion sync triggers integrated into combo, poofs, pickups, and practice loop.")

# 7. Add fusion methods and updateHUD call
hud_call_target = """    const scoreEl = document.getElementById('hudScore');
    if (scoreEl) scoreEl.textContent = `${this.score}`;
    const bubbledEl = document.getElementById('hudBubbledGems');
    if (bubbledEl) bubbledEl.textContent = `💎 ${this.bubbledGemsCount}`;
  }"""

hud_call_replacement = """    const scoreEl = document.getElementById('hudScore');
    if (scoreEl) scoreEl.textContent = `${this.score}`;
    const bubbledEl = document.getElementById('hudBubbledGems');
    if (bubbledEl) bubbledEl.textContent = `💎 ${this.bubbledGemsCount}`;

    this.updateFusionHUD();
  }

  // ==========================================================
  // CANONICAL GEM FUSION CONTROLLER
  // ==========================================================
  addFusionSync(amount) {
    if (this.isFused) return;
    this.fusionEnergy = Math.min(100, (this.fusionEnergy || 0) + amount);
    this.updateFusionHUD();
  }

  triggerFusion() {
    if (this.isFused) {
      this.unfuseGems();
      return;
    }

    let fusion = null;
    if (this.playerMode === '2p' && this.player2) {
      fusion = getCanonFusion(this.player.activeChar, this.player2.activeChar);
    } else {
      const partners = getCompatibleFusionPartners(this.player.activeChar);
      if (partners && partners.length > 0) {
        fusion = partners[0].fusion;
      }
    }

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

    // ACTIVATE FUSION!
    this.isFused = true;
    this.fusionTimer = this.fusionMaxDuration;
    this.player.isFusion = true;
    this.player.fusionKey = fusion.id;
    this.player.fusionData = fusion;
    this.player.invulnerableTimer = 1.5;

    if (this.playerMode === '2p' && this.player2) {
      const midX = (this.player.x + this.player2.x) / 2;
      this.player.x = midX;
      this.player2.x = midX;
      this.player2.isMergedInFusion = true;
    }

    this.audio.playSfx('stageClear');
    this.audio.playSfx('overdrive');
    this.particles.addPoof(this.player.x, this.player.y - 45, fusion.color || '#ec4899');
    this.particles.addSparkle(this.player.x, this.player.y - 45, '#ffffff', 40, 10);
    this.particles.addDamageText(this.player.x, this.player.y - 95, `✨ WE ARE ${fusion.name.toUpperCase()}!`, true, fusion.color || '#ec4899');
    this.particles.addDamageText(this.player.x, this.player.y - 70, fusion.quote || 'GIANT FUSION!', false, '#fde047');

    this.updateFusionHUD();
    this.updateActionBar();
  }

  unfuseGems() {
    if (!this.isFused) return;
    this.isFused = false;
    this.fusionTimer = 0;
    this.fusionEnergy = 0;

    this.player.isFusion = false;
    this.player.fusionKey = null;
    this.player.fusionData = null;

    if (this.playerMode === '2p' && this.player2) {
      this.player2.isMergedInFusion = false;
      this.player2.x = Math.min(this.stageWidth - 60, this.player.x + 80);
      this.player2.y = this.groundY;
    }

    this.audio.playSfx('bubble');
    this.particles.addPoof(this.player.x, this.player.y - 35, '#ff94ba');
    this.particles.addSparkle(this.player.x, this.player.y - 35, '#ffffff', 20, 6);
    this.particles.addDamageText(this.player.x, this.player.y - 65, 'UNFUSED!', true, '#38bdf8');

    this.updateFusionHUD();
    this.updateActionBar();
  }

  updateFusionHUD() {
    const container = document.getElementById('hudFusionContainer');
    if (!container) return;

    let fusion = null;
    let canFuse = false;
    let isIndependent = false;

    if (this.playerMode === '2p' && this.player2) {
      fusion = getCanonFusion(this.player.activeChar, this.player2.activeChar);
      canFuse = !!fusion;
      isIndependent = !canFuse;
    } else {
      const partners = getCompatibleFusionPartners(this.player.activeChar);
      if (partners && partners.length > 0) {
        fusion = partners[0].fusion;
        canFuse = true;
      } else {
        isIndependent = true;
      }
    }

    const iconEl = document.getElementById('hudFusionIcon');
    const labelEl = document.getElementById('hudFusionLabel');
    const pctEl = document.getElementById('hudFusionPct');
    const fillEl = document.getElementById('hudFusionFill');
    const btnEl = document.getElementById('btnFuseHud');
    const btnText = document.getElementById('btnFuseText');
    const touchFuse = document.getElementById('touchFuse');

    if (this.isFused) {
      container.style.display = 'flex';
      const remainingPct = Math.max(0, (this.fusionTimer / this.fusionMaxDuration) * 100);
      if (fillEl) {
        fillEl.style.width = `${remainingPct}%`;
        fillEl.style.background = 'linear-gradient(90deg, #ec4899, #a855f7, #38bdf8, #fbbf24)';
      }
      if (iconEl) iconEl.textContent = this.player.fusionData?.icon || '💎';
      if (labelEl) labelEl.textContent = `FUSED: ${this.player.fusionData?.name || 'FUSION'}`;
      if (pctEl) pctEl.textContent = `${Math.ceil(this.fusionTimer)}s`;

      if (btnEl) {
        btnEl.className = 'btn-fuse-hud fused';
        if (btnText) btnText.textContent = `UNFUSE [${this.playerMode === '2p' ? 'V' : 'F'}]`;
      }
      if (touchFuse) {
        touchFuse.classList.add('ready');
        const touchLbl = document.getElementById('touchLblFuse');
        if (touchLbl) touchLbl.textContent = 'UNFUSE';
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
        btnEl.title = 'No canonical Steven Universe show fusion exists for this gem.';
      }
      if (touchFuse) {
        touchFuse.classList.remove('ready');
        const touchLbl = document.getElementById('touchLblFuse');
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
            ? `FUSE! [${this.playerMode === '2p' ? 'V' : 'F'}]`
            : `GATHER SYNC (${displayPct}%)`;
        }
        btnEl.title = isReady
          ? `Fuse into ${fusion.name}!`
          : `Gather sync energy by landing combos, poofing gems, and collecting bubbles.`;
      }
      if (touchFuse) {
        if (isReady) touchFuse.classList.add('ready');
        else touchFuse.classList.remove('ready');
        const touchLbl = document.getElementById('touchLblFuse');
        if (touchLbl) touchLbl.textContent = isReady ? 'FUSE!' : `${displayPct}%`;
      }
    }
  }"""

if hud_call_target not in content:
    print("ERROR: hud_call_target not found")
    sys.exit(1)
content = content.replace(hud_call_target, hud_call_replacement, 1)
print("7. addFusionSync, triggerFusion, unfuseGems, updateFusionHUD added.")

# 8. Update updateActionBar to show fusion moves
ab_target = """  updateActionBar() {
    const active = this.player.activeChar;
    const current = GUARDIAN_DATA[active] || GUARDIAN_DATA.steven;

    // 1. Sync PC Action Bar
    const iconJ = document.getElementById('iconJ');
    const nameJ = document.getElementById('nameJ');
    const iconK = document.getElementById('iconK');
    const nameK = document.getElementById('nameK');
    const iconL = document.getElementById('iconL');
    const nameL = document.getElementById('nameL');

    if (iconJ) iconJ.textContent = current.j.icon;
    if (nameJ) nameJ.textContent = current.j.name;
    if (iconK) iconK.textContent = current.k.icon;
    if (nameK) nameK.textContent = current.k.name;
    if (iconL) iconL.textContent = current.l.icon;
    if (nameL) nameL.textContent = current.l.name;"""

ab_replacement = """  updateActionBar() {
    const active = this.player.activeChar;
    const isFused = this.isFused && this.player.fusionData;
    const current = isFused ? this.player.fusionData : (GUARDIAN_DATA[active] || GUARDIAN_DATA.steven);

    // 1. Sync PC Action Bar
    const iconJ = document.getElementById('iconJ');
    const nameJ = document.getElementById('nameJ');
    const iconK = document.getElementById('iconK');
    const nameK = document.getElementById('nameK');
    const iconL = document.getElementById('iconL');
    const nameL = document.getElementById('nameL');

    if (iconJ) iconJ.textContent = isFused ? '💥' : current.j.icon;
    if (nameJ) nameJ.textContent = current.j.name;
    if (iconK) iconK.textContent = isFused ? '✨' : current.k.icon;
    if (nameK) nameK.textContent = current.k.name;
    if (iconL) iconL.textContent = isFused ? '🌟' : current.l.icon;
    if (nameL) nameL.textContent = current.l.name;"""

if ab_target not in content:
    print("ERROR: ab_target not found")
    sys.exit(1)
content = content.replace(ab_target, ab_replacement, 1)
print("8. updateActionBar updated to show fusion signature attacks.")

# 9. Update initEventListeners to bind fusion keys and buttons
kb_target = """      if (['KeyA', 'ArrowLeft', 'KeyD', 'ArrowRight', 'KeyW', 'ArrowUp', 'Space', 'KeyJ', 'KeyK', 'KeyL', 'KeyI', 'KeyU', 'KeyO', 'KeyS', 'ArrowDown', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyR'].includes(e.code)) {
        e.preventDefault();
      }"""

kb_replacement = """      if (['KeyA', 'ArrowLeft', 'KeyD', 'ArrowRight', 'KeyW', 'ArrowUp', 'Space', 'KeyJ', 'KeyK', 'KeyL', 'KeyI', 'KeyU', 'KeyO', 'KeyS', 'ArrowDown', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyR', 'KeyV', 'KeyB'].includes(e.code)) {
        e.preventDefault();
      }

      // Fusion Trigger Keybinds: [V] or [B] or [Enter] or [F] (1P mode)
      if (['KeyV', 'KeyB', 'Enter'].includes(e.code) || (this.playerMode === '1p' && e.code === 'KeyF')) {
        this.triggerFusion();
      }"""

if kb_target not in content:
    print("ERROR: kb_target not found")
    sys.exit(1)
content = content.replace(kb_target, kb_replacement, 1)

# Wire buttons in initEventListeners
ev_btn_target = """    safeClick('btnConfirmChar', () => {"""

ev_btn_replacement = """    safeClick('btnFuseHud', () => this.triggerFusion());
    safeClick('touchFuse', () => this.triggerFusion());

    safeClick('btnConfirmChar', () => {"""

if ev_btn_target not in content:
    print("ERROR: ev_btn_target not found")
    sys.exit(1)
content = content.replace(ev_btn_target, ev_btn_replacement, 1)
print("9. Key listeners and button handlers wired for fusion.")

with open(GAME_JS, "w", encoding="utf-8") as f:
    f.write(content)

print("Checkpoint 3 applied and saved successfully!")
