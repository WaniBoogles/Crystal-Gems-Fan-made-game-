class ParticleSystem {
  constructor() {
    this.particles = [];
    this.texts = [];
    this.quality = 'high';
    this.maxParticles = 280;
    this.particleScale = 1.0;
    this.glowEnabled = true;
  }

  setQualityPreset(tier = 'high') {
    const t = (tier === 'low' || tier === 'medium' || tier === 'high') ? tier : 'high';
    this.quality = t;
    if (t === 'low') {
      this.maxParticles = 85;
      this.particleScale = 0.35;
      this.glowEnabled = false;
    } else if (t === 'medium') {
      this.maxParticles = 165;
      this.particleScale = 0.65;
      this.glowEnabled = true;
    } else {
      this.maxParticles = 280;
      this.particleScale = 1.0;
      this.glowEnabled = true;
    }
  }

  addSparkle(x, y, color = '#ffd700', count = 8, speed = 4) {
    const n = Math.max(1, Math.round(count * (this.particleScale || 1)));
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5);
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 1,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color,
        size: Math.random() * 4 + 3,
        isStar: Math.random() > 0.4
      });
    }
  }

  addImpactSparks(x, y, dirX = 1, color = '#ffd700', count = 12) {
    const baseAngle = dirX >= 0 ? 0 : Math.PI;
    const n = Math.max(1, Math.round(count * (this.particleScale || 1)));
    for (let i = 0; i < n; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 1.3 - 0.22;
      const spd = Math.random() * 8.5 + 4.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - (Math.random() * 2.5 + 1.2),
        life: 1.0,
        decay: Math.random() * 0.05 + 0.035,
        color,
        size: Math.random() * 5 + 3,
        isStar: Math.random() > 0.35
      });
    }
  }

  // Directional 4-point sharp diamond hit spark (Reference: pixelfx & Fighting Style)
  addHitSpark(x, y, color = '#fde047', size = 18, angle = Math.PI / 4) {
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      size,
      angle,
      color,
      life: 1.0,
      decay: 0.11,
      isHitSpark: true
    });
  }

  addPerfectParryVFX(x, y) {
    this.addParryClash(x, y, '#fde047');
  }

  // Pixel-FX Parry Clash (Effects/pixelfx-main/src/fx/impacts/parry.js):
  // X-blade flash lines, 4-point star, segmented broken ring arcs & upward spark spray
  addParryClash(x, y, color = '#fde047') {
    this.addShockwaveRing(x, y, 160, color, 4.5);
    this.addShockwaveRing(x, y, 95, '#ffffff', 3.0);
    // Crossing X-edge flash
    for (const ang of [-0.62, Math.PI + 0.62, 0.62, Math.PI - 0.62]) {
      this.particles.push({
        x, y,
        vx: 0, vy: 0,
        angle: ang,
        length: 52,
        color,
        life: 0.42,
        decay: 0.055,
        isClashEdge: true
      });
    }
    // Segmented broken ring arcs
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x, y,
        vx: 0, vy: 0,
        radius: 18,
        growSpeed: 210,
        startAngle: (i / 6) * Math.PI * 2 + 0.1,
        endAngle: (i / 6) * Math.PI * 2 + 0.58,
        color: i % 2 === 0 ? '#ffffff' : color,
        width: 3.5,
        life: 0.48,
        decay: 0.045,
        isBrokenArc: true
      });
    }
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      this.addHitSpark(x + Math.cos(a) * 32, y + Math.sin(a) * 32, color, 24, a);
    }
    this.addImpactFrame(x, y, color, 175);
    this.addSparkle(x, y, '#ffffff', 24, 8);
  }

  // Pixel-FX Anime Impact Frame (Effects/pixelfx-main/src/fx/impacts/impact-frame.js):
  // Brief high-contrast spiky core + radial burst speed wedges for heavy finishers & crits
  addImpactFrame(x, y, color = '#ffffff', radius = 185) {
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      radius,
      color,
      phase: Math.random() * Math.PI * 2,
      life: 0.24,
      decay: 0.048,
      isImpactFrame: true
    });
  }

  // Pixel-FX Collect Burst (Effects/pixelfx-main/src/fx/pickups/collect-burst.js):
  // White pop flash + 4-way cross flare + dual snap rings + curving-path twinkles
  addCollectBurst(x, y, color = '#ff86e6') {
    this.addHitSpark(x, y, '#ffffff', 24, 0);
    this.addShockwaveRing(x, y, 68, '#ffffff', 2.2);
    this.addShockwaveRing(x, y, 48, color, 3.2);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const spd = 4.2 + Math.random() * 2.8;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 0.6,
        turn: (i % 2 === 0 ? 1 : -1) * 0.08,
        size: i % 3 === 0 ? 5.2 : 3.4,
        color: i % 4 === 0 ? '#ffffff' : color,
        life: 0.85,
        decay: 0.032,
        isCurvingTwinkle: true
      });
    }
  }

  // Pixel-FX Heavy Landing (Effects/pixelfx-main/src/fx/impacts/heavy-landing.js):
  // Dual expanding floor dust rings + radial grit & hopping pebbles
  addHeavyLanding(x, y, color = '#e2e8f0') {
    this.addShockwaveRing(x, y, 108, '#ffffff', 3.4);
    this.addShockwaveRing(x, y, 76, color, 5.2);
    this.addDebris(x, y, '#94a3b8', 10);
    for (let i = 0; i < 12; i++) {
      const s = i % 2 === 0 ? 1 : -1;
      this.particles.push({
        x: x + s * (4 + Math.random() * 10),
        y: y - 3 - Math.random() * 4,
        vx: s * (2.5 + Math.random() * 4.5),
        vy: -0.6 - Math.random() * 1.4,
        size: 7 + Math.random() * 6,
        color: i % 3 === 0 ? '#ffffff' : color,
        life: 0.72,
        decay: 0.035,
        isCloud: true
      });
    }
  }

  // Pixel-FX Shield Block Lattice Dome (Effects/pixelfx-main/src/fx/impacts/shield-block.js)
  addShieldBlockRipple(x, y, facing = 1, color = '#62c8f4') {
    this.particles.push({
      x: x + facing * 14,
      y,
      vx: 0, vy: 0,
      facing,
      color,
      radius: 44,
      life: 0.55,
      decay: 0.042,
      isShieldDomeRipple: true
    });
    this.addImpactSparks(x + facing * 28, y - 6, -facing, '#ffe26b', 10);
  }

  // Pixel-FX Double Slash X-Cross (Effects/pixelfx-main/src/fx/melee/double-slash.js)
  addDoubleSlashX(x, y, facing = 1, color = '#ff86a6') {
    for (const ang of [-0.68 * facing, 0.68 * facing]) {
      this.particles.push({
        x: x + facing * 22,
        y,
        vx: facing * 1.2,
        vy: 0,
        angle: ang,
        length: 58,
        color,
        life: 0.36,
        decay: 0.05,
        isClashEdge: true
      });
    }
    this.addHitSpark(x + facing * 22, y, color, 26, Math.PI / 4);
    this.addImpactSparks(x + facing * 26, y, facing, color, 10);
  }

  // Pixel-FX Dash After-Image & Ground Skid (Effects/pixelfx-main/src/fx/moves/dash-strike.js)
  addDashAfterImage(x, y, facing = 1, color = '#38bdf8') {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x - facing * (8 + i * 10),
        y: y - 16 - i * 8,
        vx: -facing * (1.5 + Math.random() * 1.5),
        vy: 0,
        length: 26 + Math.random() * 18,
        height: 2.6,
        facing: -facing,
        color: i % 2 === 0 ? '#ffffff' : color,
        life: 0.32,
        decay: 0.045,
        isSpeedStreak: true
      });
    }
    this.addSparkle(x, y - 18, color, 10, 4.5);
  }

  // Radiant Victory Light Rays (Reference: victory light rays preferred)
  addVictoryLightRays(x, y, color = '#ffd700', rayCount = 14) {
    for (let i = 0; i < rayCount; i++) {
      this.particles.push({
        x, y,
        vx: 0, vy: 0,
        angle: (i / rayCount) * Math.PI * 2,
        rotSpeed: 0.65,
        length: 260,
        width: 22,
        color,
        life: 1.6,
        decay: 0.016,
        isVictoryRay: true
      });
    }
  }

  // --- PIXEL-FX AUTHENTIC COMBAT EMITTERS (Effects / pixelfx-main reference) ---
  addThrustPierce(x, y, facing = 1, color = '#38bdf8') {
    this.addHitSpark(x + facing * 28, y, color, 28, 0);
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x - facing * (i * 8),
        y: y + (i - 1.5) * 6,
        vx: facing * (3 + Math.random() * 2),
        vy: 0,
        length: 28 + Math.random() * 16,
        height: 2.2,
        facing,
        color,
        life: 0.28,
        decay: 0.045,
        isSpeedStreak: true
      });
    }
    this.particles.push({
      x: x + facing * 18,
      y,
      vx: 0, vy: 0,
      radius: 12,
      growSpeed: 75,
      color,
      life: 0.26,
      decay: 0.042,
      isPierceRing: true
    });
  }

  addWhipSnap(x, y, facing = 1, color = '#c084fc') {
    this.addHitSpark(x, y, color, 24, Math.PI / 4);
    this.addShockwaveRing(x, y, 65, color, 3.2);
    for (let i = 0; i < 8; i++) {
      const a = (Math.random() - 0.5) * 1.2 + (facing === 1 ? 0 : Math.PI);
      const spd = Math.random() * 4.5 + 2.0;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        size: Math.random() * 3 + 2,
        color: i % 2 === 0 ? '#ffffff' : color,
        life: 0.45,
        decay: 0.038,
        isStar: true
      });
    }
  }

  addHammerQuake(x, y, color = '#f97316') {
    this.addGroundFissure(x - 35, y, 70, color);
    this.addGroundFissure(x + 35, y, 70, color);
    this.addDebris(x, y, '#94a3b8', 10);
    this.addShockwaveRing(x, y, 140, color, 4.0);
    this.addPoof(x - 30, y - 5, '#e2e8f0');
    this.addPoof(x + 30, y - 5, '#e2e8f0');
  }

  addWaterStream(x, y, facing = 1, color = '#38bdf8') {
    for (let i = 0; i < 6; i++) {
      const a = (Math.random() - 0.5) * 0.6 + (facing === 1 ? 0 : Math.PI);
      const spd = Math.random() * 5.0 + 3.0;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 0.8,
        size: Math.random() * 4 + 2.5,
        color,
        life: 0.55,
        decay: 0.035,
        isWaterDroplet: true
      });
    }
    this.addSparkle(x, y, '#e0f2fe', 8, 3);
  }

  addLightningArc(x1, y1, x2, y2, color = '#facc15') {
    const points = [{ x: x1, y: y1 }];
    const steps = 5;
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const lx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 24;
      const ly = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 24;
      points.push({ x: lx, y: ly });
    }
    points.push({ x: x2, y: y2 });
    this.particles.push({
      x: x1, y: y1,
      x1, y1, points,
      vx: 0, vy: 0,
      color,
      life: 0.22,
      decay: 0.048,
      isLightningBolt: true
    });
  }

  addFireRing(x, y, color = '#ea580c') {
    this.addShockwaveRing(x, y, 95, color, 3.5);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = 24 + Math.random() * 20;
      this.particles.push({
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r * 0.35,
        vx: Math.cos(a) * 0.8,
        vy: -Math.random() * 2.2 - 0.8,
        size: Math.random() * 12 + 6,
        color,
        life: 0.55,
        decay: 0.038,
        isFlameTongue: true
      });
    }
  }

  addHolyHeal(x, y, color = '#ff94ba') {
    for (let h = 0; h < 3; h++) {
      this.particles.push({
        x,
        y: y - h * 18,
        vx: 0, vy: 0,
        radius: 26 + h * 8,
        color,
        life: 0.65 - h * 0.1,
        decay: 0.032,
        isHolyHeal: true
      });
    }
    this.addRosePetals(x, y - 25, 8);
    this.addSparkle(x, y - 25, '#ffffff', 14, 4);
  }

  addRosePetals(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * -2 - 1,
        life: 1.0,
        decay: 0.02,
        color: '#f43f5e',
        size: 5,
        isPetal: true,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15
      });
    }
  }

  addPoof(x, y, color = '#ffffff') {
    // Pixel-FX Poof (Effects/pixelfx-main/src/fx/spawn/poof.js):
    // Cartoon smoke puff ring + radial speed lines between clouds + spinning stars
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.28;
      const spd = Math.random() * 3.8 + 1.8;
      this.particles.push({
        x: x + Math.cos(angle) * 6,
        y: y + Math.sin(angle) * 6,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.5,
        life: 1.0,
        decay: 0.028,
        color: i % 2 === 0 ? color : '#ffffff',
        size: Math.random() * 14 + 10,
        isCloud: true
      });
      if (i % 2 === 0) {
        this.particles.push({
          x: x + Math.cos(angle) * 14,
          y: y + Math.sin(angle) * 14,
          vx: Math.cos(angle) * 4.5,
          vy: Math.sin(angle) * 4.5,
          angle,
          length: 22,
          color: '#ffffff',
          life: 0.34,
          decay: 0.055,
          isClashEdge: true
        });
      }
    }
    this.addSparkle(x, y, '#ffcf33', 14, 6);
  }

  addExplosion(x, y, color = '#f97316', count = 22) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const spd = Math.random() * 4.5 + 2.5;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.6,
        life: 1.0,
        decay: 0.032,
        color: (i % 3 === 0) ? '#ffd700' : (i % 3 === 1 ? color : '#ffffff'),
        size: Math.random() * 16 + 10,
        isCloud: true
      });
    }
    this.addSparkle(x, y, '#ffd700', 16, 7);
  }

  addSlashArc(x, y, facing = 1, color = '#38bdf8') {
    for (let i = 0; i < 7; i++) {
      const angle = (-0.6 + i * 0.22) * facing;
      const dist = 32 + i * 4;
      this.particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: facing * (Math.random() * 2 + 1),
        vy: (Math.random() - 0.5) * 1.5,
        life: 0.65,
        decay: 0.05,
        color: (i % 2 === 0) ? color : '#ffffff',
        size: 4.5 + (3 - Math.abs(i - 3)),
        isStar: true
      });
    }
  }

  addShockwaveRing(x, y, maxRadius = 80, color = '#fbbf24', width = 3) {
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      radius: 8,
      maxRadius,
      growSpeed: maxRadius * 4.6,
      color,
      width,
      life: 1.0,
      decay: 0.048,
      isShockwaveRing: true
    });
  }

  addDebris(x, y, color = '#94a3b8', count = 8) {
    for (let i = 0; i < count; i++) {
      const ang = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.5;
      const spd = Math.random() * 240 + 100;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - Math.random() * 4,
        vx: Math.cos(ang) * spd * 0.016,
        vy: Math.sin(ang) * spd * 0.016,
        gravity: 0.42,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 5 + 3,
        life: 1.0,
        decay: 0.034,
        color,
        isDebris: true
      });
    }
  }

  addGroundFissure(x, y, width = 60, color = '#fbbf24') {
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      width,
      color,
      life: 1.0,
      decay: 0.038,
      isFissure: true
    });
  }

  addHitSparks(x, y, color = '#ffd700', count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4.0 + 2.0;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.8,
        life: 0.7,
        decay: 0.045,
        color: (i % 2 === 0) ? color : '#ffffff',
        size: Math.random() * 4 + 3,
        isStar: true
      });
    }
  }

  addDamageText(x, y, text, isCrit = false, color = '#ffffff') {
    const str = String(text ?? '').trim();
    if (!str) return;
    // STRICT USER REQUIREMENT: Only damage numbers appear (e.g. 25, 120!, -15 HP, +1 HEART).
    // Drop all verbose text tags to prevent lag and declutter combat!
    const isNum = /^[-+]?\d+[!]?(\s*(HP|DMG|HEARTS?))?$/i.test(str);
    if (!isNum) return;

    if (this.texts.length >= 24) {
      this.texts.shift();
    }
    this.texts.push({
      x, y,
      vy: -2.4,
      text: str,
      isCrit,
      color: isCrit ? '#ffcf33' : color,
      life: 0.85,
      decay: 0.026
    });
  }

  update() {
    // Respect graphics tier particle budget (Low: 85, Medium: 165, High: 280)
    const cap = this.maxParticles || 220;
    if (this.particles.length > cap) {
      this.particles.splice(0, this.particles.length - cap);
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.isCloud) {
        p.size += 0.35;
        p.vx *= 0.94;
        p.vy *= 0.94;
      }
      if (p.isPetal) {
        p.angle += p.rotSpeed;
        p.vy += 0.05;
      }
      if (p.isShockwaveRing || p.isBrokenArc) {
        p.radius += p.growSpeed * 0.016;
      }
      if (p.isCurvingTwinkle) {
        const ca = Math.cos(p.turn);
        const sa = Math.sin(p.turn);
        const nvx = p.vx * ca - p.vy * sa;
        const nvy = p.vx * sa + p.vy * ca;
        p.vx = nvx * 0.92;
        p.vy = nvy * 0.92 + 0.06;
      }
      if (p.isDebris) {
        p.vy += p.gravity;
        p.rot += p.rotSpeed;
      }
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.texts.length > 25) {
      this.texts.splice(0, this.texts.length - 25);
    }
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.y += t.vy;
      t.vy *= 0.96;
      t.life -= t.decay;
      if (t.life <= 0) this.texts.splice(i, 1);
    }
  }

  draw(ctx, camMinX = -Infinity, camMaxX = Infinity) {
    ctx.save();
    for (const p of this.particles) {
      if (!p.isImpactFrame && !p.isVictoryRay && (p.x + 140 < camMinX || p.x - 140 > camMaxX)) continue;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;

      if (p.isStar) {
        this.drawStar(ctx, p.x, p.y, 5, p.size, p.size * 0.5);
      } else if (p.isCloud) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.isPetal) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.isShockwaveRing) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1, p.width * p.life);
        ctx.beginPath();
        if (ctx.ellipse) ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.28, 0, 0, Math.PI * 2);
        else ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (p.isDebris) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.fill();
        ctx.restore();
      } else if (p.isHitSpark) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const s = p.size * (0.8 + (1 - p.life) * 0.45);
        // 4-point diamond cross star (pixelfx style)
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s * 0.12, -s * 0.12, s, 0);
        ctx.quadraticCurveTo(s * 0.12, s * 0.12, 0, s);
        ctx.quadraticCurveTo(-s * 0.12, s * 0.12, -s, 0);
        ctx.quadraticCurveTo(-s * 0.12, -s * 0.12, 0, -s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.isFissure) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        const hw = p.width / 2;
        ctx.moveTo(p.x - hw, p.y);
        ctx.lineTo(p.x - hw * 0.4, p.y + 4);
        ctx.lineTo(p.x + hw * 0.2, p.y - 3);
        ctx.lineTo(p.x + hw, p.y + 2);
        ctx.stroke();
        ctx.restore();
      } else if (p.isVictoryRay) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.42;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const grad = ctx.createLinearGradient(0, 0, p.length, 0);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p.length, -p.width);
        ctx.lineTo(p.length, p.width);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        p.angle += p.rotSpeed * 0.016;
      } else if (p.isSpeedStreak) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.75;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.height || 2.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length * p.facing, p.y);
        ctx.stroke();
        ctx.restore();
      } else if (p.isPierceRing) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.65;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius * 0.35, p.radius, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        p.radius += p.growSpeed * 0.016;
      } else if (p.isWaterDroplet) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.85;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.isLightningBolt) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(p.points[0].x, p.points[0].y);
        for (let seg = 1; seg < p.points.length; seg++) {
          ctx.lineTo(p.points[seg].x, p.points[seg].y);
        }
        ctx.stroke();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      } else if (p.isFlameTongue) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.85;
        ctx.translate(p.x, p.y);
        const fGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, p.size);
        fGrad.addColorStop(0, '#ffffff');
        fGrad.addColorStop(0.35, p.color);
        fGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.isHolyHeal) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.75;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        p.y -= 1.4;
        p.radius += 0.5;
      } else if (p.isClashEdge) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const halfL = p.length * (0.65 + (1 - p.life) * 0.5);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.5, 4.5 * p.life);
        ctx.beginPath();
        ctx.moveTo(-halfL, 0);
        ctx.lineTo(halfL, 0);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 2.2 * p.life);
        ctx.beginPath();
        ctx.moveTo(-halfL * 0.6, 0);
        ctx.lineTo(halfL * 0.6, 0);
        ctx.stroke();
        ctx.restore();
      } else if (p.isBrokenArc) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.2, p.width * p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, p.startAngle, p.endAngle);
        ctx.stroke();
        ctx.restore();
      } else if (p.isImpactFrame) {
        ctx.save();
        const prog = 1 - Math.min(1, p.life / 0.24);
        const invert = prog > 0.25 && prog < 0.55;
        ctx.globalAlpha = Math.max(0, p.life * 2.4) * 0.72;
        ctx.translate(p.x, p.y);
        const wedgeCount = 16;
        for (let w = 0; w < wedgeCount; w++) {
          const a = (w / wedgeCount) * Math.PI * 2 + p.phase;
          const inner = (24 + prog * p.radius * 0.85);
          const outer = Math.max(inner + 18, p.radius * (0.75 + prog * 0.6));
          ctx.fillStyle = invert ? '#0f172a' : (w % 2 === 0 ? '#ffffff' : p.color);
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
          ctx.lineTo(Math.cos(a - 0.05) * outer, Math.sin(a - 0.05) * outer);
          ctx.lineTo(Math.cos(a + 0.05) * outer, Math.sin(a + 0.05) * outer);
          ctx.closePath();
          ctx.fill();
        }
        if (prog < 0.5) {
          ctx.fillStyle = invert ? p.color : '#ffffff';
          this.drawStar(ctx, 0, 0, 8, 22 * (1 - prog), 8 * (1 - prog));
        }
        ctx.restore();
      } else if (p.isCurvingTwinkle) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        this.drawStar(ctx, p.x, p.y, 4, p.size * 1.4, p.size * 0.45);
        ctx.restore();
      } else if (p.isShieldDomeRipple) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.85;
        ctx.translate(p.x, p.y);
        ctx.scale(p.facing, 1);
        const r = p.radius;
        ctx.fillStyle = 'rgba(98, 200, 244, 0.22)';
        ctx.strokeStyle = p.life > 0.38 ? '#ffffff' : p.color;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(0, 0, r, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Expanding inner lattice ripple arc
        const rPulse = r * (1 - p.life / 0.55);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(4, rPulse), -Math.PI * 0.42, Math.PI * 0.42);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const t of this.texts) {
      ctx.globalAlpha = Math.max(0, t.life);
      ctx.font = t.isCrit ? "900 20px 'Fredoka One', 'Nunito', sans-serif" : "800 15px 'Fredoka One', 'Nunito', sans-serif";
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.restore();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

// ============================================================================

const OVERDRIVE_THEMES = {
  steven: {
    name: 'STEVEN DIAMOND SURGE',
    short: 'DIAMOND SURGE',
    msg: 'PINK DIAMOND SURGE: FUTURE HYPER STATE!',
    color: '#ff1493'
  },
  garnet: {
    name: 'GARNET FUTURE SURGE',
    short: 'FUTURE SURGE',
    msg: 'GARNET FUTURE SURGE: DUAL RESONANCE!',
    color: '#ef4444'
  },
  amethyst: {
    name: 'AMETHYST QUARTZ SURGE',
    short: 'QUARTZ SURGE',
    msg: 'AMETHYST QUARTZ SURGE: VOLCANIC FURY!',
    color: '#a855f7'
  },
  pearl: {
    name: 'PEARL PRISM SURGE',
    short: 'PRISM SURGE',
    msg: 'PEARL PRISM SURGE: PRISMATIC RADIANCE!',
    color: '#22d3ee'
  },
  bismuth: {
    name: 'BISMUTH FORGE SURGE',
    short: 'FORGE SURGE',
    msg: 'BISMUTH FORGE SURGE: MOLTEN FORGEMASTER!',
    color: '#f97316'
  },
  peridot: {
    name: 'PERIDOT FERRO SURGE',
    short: 'FERRO SURGE',
    msg: 'PERIDOT FERRO SURGE: MAGNETIC OVERCLOCK!',
    color: '#22c55e'
  },
  lapis: {
    name: 'LAPIS HYDRO SURGE',
    short: 'HYDRO SURGE',
    msg: 'LAPIS HYDRO SURGE: OCEAN EMPRESS TIDE!',
    color: '#0ea5e9'
  },
  rose: {
    name: 'ROSE CELESTIAL SURGE',
    short: 'CELESTIAL SURGE',
    msg: 'ROSE CELESTIAL SURGE: DIAMOND MANDALA!',
    color: '#f43f5e'
  },
  connie: {
    name: 'CONNIE KNIGHT SURGE',
    short: 'KNIGHT SURGE',
    msg: 'CONNIE KNIGHT SURGE: CRYSTAL BLADE FOCUS!',
    color: '#ec4899'
  },
  jasper: {
    name: 'JASPER APEX SURGE',
    short: 'APEX SURGE',
    msg: 'JASPER APEX SURGE: SUPREME BETA JUGGERNAUT!',
    color: '#ea580c'
  }
};

// 3. PARALLAX ENVIRONMENT & SCENERY
// ============================================================================
