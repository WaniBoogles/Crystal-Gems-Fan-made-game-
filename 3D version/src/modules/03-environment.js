class EnvironmentRenderer {
  constructor(canvasWidth, canvasHeight, stageWidth = 2600) {
    this.width = canvasWidth;
    this.canvasWidth = canvasWidth;
    this.stageWidth = stageWidth;
    this.height = canvasHeight;
    this.groundY = canvasHeight - 120; // 600px
    this.quality = 'high';
    this.clouds = [
      { x: 80, y: 65, speed: 0.2, scale: 1.2 },
      { x: 480, y: 105, speed: 0.35, scale: 0.9 },
      { x: 920, y: 55, speed: 0.25, scale: 1.4 },
      { x: 1380, y: 95, speed: 0.3, scale: 1.1 },
      { x: 1850, y: 70, speed: 0.22, scale: 1.3 },
      { x: 2300, y: 110, speed: 0.28, scale: 1.0 }
    ];
    this.stars = Array.from({ length: 75 }, () => ({
      x: Math.random() * stageWidth,
      y: Math.random() * (canvasHeight - 190),
      radius: Math.random() * 2 + 1,
      twinkle: Math.random() * Math.PI * 2
    }));
  }

  update(dt = 0.016) {
    this.animTime = (this.animTime || 0) + dt;
    for (const c of this.clouds) {
      c.x += c.speed;
      if (c.x > this.stageWidth + 150) c.x = -200;
    }
    for (const s of this.stars) {
      s.twinkle += 0.05;
    }
  }

  getSkyGradient(ctx, stageIndex, isPractice = false) {
    if (!this._gradientCache) this._gradientCache = {};
    const key = (stageIndex === 0 || isPractice) ? 'practice_0' : `stage_${stageIndex}`;
    if (this._gradientCache[key]) return this._gradientCache[key];

    let skyGradient;
    if (stageIndex === 0 || isPractice) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#0c0721');
      skyGradient.addColorStop(0.35, '#1e1b4b');
      skyGradient.addColorStop(0.7, '#3730a3');
      skyGradient.addColorStop(1, '#67e8f9');
    } else if (stageIndex === 1) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#311042');
      skyGradient.addColorStop(0.45, '#7f1d53');
      skyGradient.addColorStop(0.75, '#f472b6');
      skyGradient.addColorStop(1, '#fed7aa');
    } else if (stageIndex === 2) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.4, '#1e1b4b');
      skyGradient.addColorStop(0.8, '#312e81');
      skyGradient.addColorStop(1, '#67e8f9');
    } else if (stageIndex === 3) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#0f051d');
      skyGradient.addColorStop(0.5, '#2e1065');
      skyGradient.addColorStop(0.85, '#581c87');
      skyGradient.addColorStop(1, '#3b0764');
    } else if (stageIndex === 4) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#180404');
      skyGradient.addColorStop(0.4, '#450a0a');
      skyGradient.addColorStop(0.75, '#b91c1c');
      skyGradient.addColorStop(1, '#f97316');
    } else if (stageIndex === 5) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#2a0808');
      skyGradient.addColorStop(0.4, '#7c2d12');
      skyGradient.addColorStop(0.75, '#ea580c');
      skyGradient.addColorStop(1, '#fef08a');
    } else if (stageIndex === 6) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#020617');
      skyGradient.addColorStop(0.35, '#0f3b4c');
      skyGradient.addColorStop(0.7, '#10b981');
      skyGradient.addColorStop(1, '#bae6fd');
    } else if (stageIndex === 7) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#030712');
      skyGradient.addColorStop(0.35, '#3b0764');
      skyGradient.addColorStop(0.7, '#db2777');
      skyGradient.addColorStop(1, '#fbcfe8');
    } else if (stageIndex === 8) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.4, '#1e3a8a');
      skyGradient.addColorStop(0.75, '#0284c7');
      skyGradient.addColorStop(1, '#c7d2fe');
    } else if (stageIndex === 9) {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#022c22');
      skyGradient.addColorStop(0.4, '#064e3b');
      skyGradient.addColorStop(0.75, '#059669');
      skyGradient.addColorStop(1, '#6ee7b7');
    } else {
      skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.3, '#3b0764');
      skyGradient.addColorStop(0.65, '#e0e7ff');
      skyGradient.addColorStop(1, '#fef08a');
    }
    this._gradientCache[key] = skyGradient;
    return skyGradient;
  }

  // Draw Screen-Space Parallax Background (Sky, Stars, Distant Landmarks)
  drawBackground(ctx, stageIndex, cameraX = 0, isPractice = false) {
    ctx.save();
    const skyGradient = this.getSkyGradient(ctx, stageIndex, isPractice);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, this.canvasWidth, this.height);

    // Parallax Twinkling Stars (scaled by Graphics Quality tier)
    const starStep = this.quality === 'low' ? 3 : (this.quality === 'medium' ? 2 : 1);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < this.stars.length; i += starStep) {
      const s = this.stars[i];
      const sx = ((s.x - cameraX * 0.08) % this.canvasWidth + this.canvasWidth) % this.canvasWidth;
      const alpha = 0.4 + 0.6 * Math.sin(s.twinkle);
      ctx.globalAlpha = alpha > 0.1 ? alpha : 0.1;
      const d = s.radius * 1.8;
      ctx.fillRect(sx - s.radius, s.y - s.radius, d, d);
    }
    ctx.globalAlpha = 1.0;

    // Parallax Drifting Clouds (halved on Low graphics preset)
    for (let ci = 0; ci < this.clouds.length; ci++) {
      if (this.quality === 'low' && ci % 2 === 1) continue;
      const c = this.clouds[ci];
      const cx = ((c.x - cameraX * 0.18) % (this.canvasWidth + 240) + (this.canvasWidth + 240)) % (this.canvasWidth + 240) - 120;
      this.drawCloud(ctx, cx, c.y, c.scale, stageIndex);
    }

    // Parallax Distant Silhouettes (Canon Steven Universe Landmarks)
    const bgOffset = cameraX * 0.32;
    const anim = this.animTime || 0;

    if (stageIndex === 1) {
      // Beach City: Colossal Obsidian Temple Cliff, Lighthouse Bluff & Funland Wheel
      ctx.save();
      // Ancient Multi-Armed Temple Obsidian Carving
      ctx.fillStyle = 'rgba(76, 29, 149, 0.38)';
      const tx = 1120 - bgOffset;
      ctx.beginPath();
      ctx.arc(tx, this.groundY - 170, 90, 0, Math.PI * 2); // Temple head
      ctx.fill();
      ctx.fillRect(tx - 70, this.groundY - 130, 140, 130); // Torso & Arms
      // Cliffside rocks
      ctx.beginPath();
      ctx.moveTo(tx - 180, this.groundY);
      ctx.lineTo(tx - 80, this.groundY - 190);
      ctx.lineTo(tx + 160, this.groundY - 200);
      ctx.lineTo(tx + 240, this.groundY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(59, 7, 100, 0.32)';
      ctx.fill();

      // Lighthouse on bluff
      const lx = 420 - bgOffset;
      ctx.fillStyle = 'rgba(88, 28, 135, 0.35)';
      ctx.fillRect(lx - 12, this.groundY - 130, 24, 130);
      ctx.beginPath();
      ctx.arc(lx, this.groundY - 135, 16, Math.PI, 0);
      ctx.fill();
      // Lighthouse rotating beam
      const beamAngle = Math.sin(anim * 1.2) * 0.4;
      ctx.save();
      ctx.translate(lx, this.groundY - 135);
      ctx.rotate(beamAngle);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.14)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(260, -45);
      ctx.lineTo(260, 45);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Distant Funland Ferris Wheel
      const fx = 1850 - bgOffset;
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.30)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(fx, this.groundY - 125, 75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (stageIndex === 2) {
      // Galaxy Warp: Floating Ancient Gem Spire Monoliths & Star Arches
      ctx.save();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.22)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 2;
      for (const sx of [380, 880, 1420, 2020]) {
        const x = sx - bgOffset;
        const floatY = Math.sin(anim * 1.5 + sx) * 8;
        ctx.beginPath();
        ctx.moveTo(x - 22, this.groundY - 90 + floatY);
        ctx.lineTo(x, this.groundY - 210 + floatY);
        ctx.lineTo(x + 22, this.groundY - 90 + floatY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    } else if (stageIndex === 3) {
      // Prime Kindergarten: Towering Injector Drills on Layered Basalt Bluffs
      ctx.save();
      ctx.fillStyle = 'rgba(88, 28, 135, 0.42)';
      for (const drillX of [320, 780, 1260, 1740, 2220]) {
        const dx = drillX - bgOffset;
        // Injector Drill Head & Canister
        ctx.beginPath();
        ctx.moveTo(dx - 30, this.groundY - 200);
        ctx.lineTo(dx + 30, this.groundY - 200);
        ctx.lineTo(dx, this.groundY - 20);
        ctx.closePath();
        ctx.fill();
        // Nutrient fluid canister glow
        ctx.fillStyle = 'rgba(192, 132, 252, 0.30)';
        ctx.fillRect(dx - 12, this.groundY - 180, 24, 60);
        ctx.fillStyle = 'rgba(88, 28, 135, 0.42)';
      }
      ctx.restore();
    } else if (stageIndex === 4) {
      // Mantle Core: Geothermal Magma Spires & Heat Shimmer
      ctx.save();
      ctx.fillStyle = 'rgba(185, 28, 28, 0.32)';
      for (const gx of [450, 1100, 1750, 2300]) {
        const x = gx - bgOffset;
        ctx.beginPath();
        ctx.moveTo(x - 40, this.groundY);
        ctx.lineTo(x - 12, this.groundY - 160);
        ctx.lineTo(x + 12, this.groundY - 160);
        ctx.lineTo(x + 40, this.groundY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (stageIndex === 5) {
      // Bismuth Forge: Volcanic Smelter Furnaces & Massive Hanging Chains
      ctx.save();
      ctx.fillStyle = 'rgba(124, 45, 18, 0.38)';
      for (const fx of [500, 1200, 1900]) {
        const x = fx - bgOffset;
        ctx.fillRect(x - 45, this.groundY - 170, 90, 170);
        ctx.fillStyle = 'rgba(234, 88, 12, 0.35)';
        ctx.beginPath();
        ctx.arc(x, this.groundY - 100, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(124, 45, 18, 0.38)';
      }
      ctx.restore();
    } else if (stageIndex === 6) {
      // Frozen North: Glacial Ice Peaks & Aurora Ribbons
      ctx.save();
      const auroraPulse = 0.18 + 0.10 * Math.sin(anim * 1.5);
      ctx.fillStyle = `rgba(16, 185, 129, ${auroraPulse})`;
      ctx.beginPath();
      ctx.moveTo(0, 80);
      ctx.bezierCurveTo(300, 30 + Math.sin(anim) * 20, 600, 110 - Math.sin(anim) * 20, 1000, 60);
      ctx.lineTo(1000, 140);
      ctx.bezierCurveTo(600, 170, 300, 90, 0, 140);
      ctx.closePath();
      ctx.fill();

      // Sharp Ice Peaks
      ctx.fillStyle = 'rgba(15, 59, 76, 0.40)';
      for (const px of [300, 750, 1300, 1850, 2350]) {
        const x = px - bgOffset;
        ctx.beginPath();
        ctx.moveTo(x - 55, this.groundY);
        ctx.lineTo(x, this.groundY - 190);
        ctx.lineTo(x + 55, this.groundY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (stageIndex === 7) {
      // Pink Diamond Zoo: Cosmic Glass Stasis Domes & Saturnian Rings
      ctx.save();
      ctx.fillStyle = 'rgba(219, 39, 119, 0.28)';
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.40)';
      ctx.lineWidth = 2.5;
      for (const zx of [500, 1250, 2000]) {
        const x = zx - bgOffset;
        ctx.beginPath();
        ctx.arc(x, this.groundY - 80, 80, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    } else if (stageIndex === 8) {
      // Homeworld Abduction Shore: Looming Green Hand Warship
      ctx.save();
      ctx.fillStyle = 'rgba(2, 132, 199, 0.42)';
      ctx.beginPath();
      ctx.arc(900 - bgOffset, 120, 140, 0, Math.PI * 2);
      ctx.fill();
      // Warship fingers
      ctx.fillRect(800 - bgOffset, 70, 30, 90);
      ctx.fillRect(850 - bgOffset, 50, 30, 120);
      ctx.fillRect(900 - bgOffset, 50, 30, 120);
      ctx.fillRect(950 - bgOffset, 70, 30, 90);
      ctx.restore();
    } else if (stageIndex === 9) {
      // Homeworld Courtroom: Monolithic Diamond Statues
      ctx.save();
      ctx.fillStyle = 'rgba(6, 78, 59, 0.45)';
      for (const cx of [600, 1300, 2000]) {
        const x = cx - bgOffset;
        ctx.fillRect(x - 40, this.groundY - 210, 80, 210);
        ctx.beginPath();
        ctx.moveTo(x - 55, this.groundY - 210);
        ctx.lineTo(x, this.groundY - 250);
        ctx.lineTo(x + 55, this.groundY - 210);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (stageIndex === 10) {
      // Change Your Mind: White Diamond Mecha Citadel & Radiant Crown Beams
      ctx.save();
      const mechaX = 950 - bgOffset;
      const pulse = 0.22 + 0.12 * Math.sin(anim * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
      ctx.beginPath();
      ctx.arc(mechaX, 90, 140, 0, Math.PI * 2);
      ctx.fill();
      // Radiant Light Beams
      ctx.strokeStyle = `rgba(254, 240, 138, ${pulse * 0.8})`;
      ctx.lineWidth = 3;
      for (let a = -0.8; a <= 0.8; a += 0.3) {
        ctx.beginPath();
        ctx.moveTo(mechaX, 90);
        ctx.lineTo(mechaX + Math.sin(a) * 320, 90 - Math.cos(a) * 220);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // Draw World-Space Elements (Ground & Platforms across full 2600px width)
  drawForeground(ctx, stageIndex, isPractice = false) {
    ctx.save();
    const anim = this.animTime || 0;
    const bleedL = -500;
    const bleedW = (this.stageWidth || 2600) + 1000;
    const bleedH = (this.height - this.groundY) + 400;

    if (stageIndex === 0 || isPractice) {
      // Practice Mode: Pearl's Sky Spire Colonnade Arena
      ctx.fillStyle = 'rgba(241, 245, 249, 0.24)';
      for (let cx = 80; cx < this.stageWidth; cx += 220) {
        ctx.fillRect(cx, 160, 36, this.groundY - 160);
        ctx.fillRect(cx - 8, 150, 52, 12);
        ctx.fillRect(cx - 8, this.groundY - 12, 52, 12);
      }
      // Pristine Sky Spire Marble Ground
      const spireGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      spireGrad.addColorStop(0, '#1e1b4b');
      spireGrad.addColorStop(0.3, '#312e81');
      spireGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = spireGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);
      // Glowing Cyan Trim & Gold Insignia
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bleedL, this.groundY - 4, bleedW, 5);
      ctx.fillStyle = '#ffd700';
      for (let dx = 400; dx < this.stageWidth; dx += 550) {
        this.drawDiamondInsignia(ctx, dx, this.groundY + 35, 22);
      }
    } else if (stageIndex === 1) {
      // Stage 1: Beach City Boardwalk, Sand Shore & Lapping Ocean Waves
      // 1. Deep Beach Sand Base
      const sandGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      sandGrad.addColorStop(0, '#d97706');
      sandGrad.addColorStop(0.35, '#b45309');
      sandGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = sandGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // 2. Heavy Timber Support Pilings sinking into sand
      ctx.fillStyle = '#451a03';
      for (let px = bleedL + 60; px < bleedL + bleedW; px += 160) {
        ctx.fillRect(px, this.groundY + 12, 18, bleedH - 12);
        ctx.fillStyle = '#270e02';
        ctx.fillRect(px, this.groundY + 12, 4, bleedH - 12);
        ctx.fillStyle = '#451a03';
      }

      // 3. Weathered Cedar Boardwalk Decking
      const deckH = 22;
      const deckGrad = ctx.createLinearGradient(0, this.groundY - 2, 0, this.groundY + deckH);
      deckGrad.addColorStop(0, '#fde68a');
      deckGrad.addColorStop(0.18, '#b45309');
      deckGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = deckGrad;
      ctx.fillRect(bleedL, this.groundY - 2, bleedW, deckH);

      // Drop shadow beneath the boardwalk overhang
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.fillRect(bleedL, this.groundY + deckH, bleedW, 8);

      // Plank dividers and iron nail bolts
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      for (let x = bleedL; x < bleedL + bleedW; x += 38) {
        ctx.beginPath();
        ctx.moveTo(x, this.groundY - 2);
        ctx.lineTo(x, this.groundY + deckH);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 12, this.groundY + 3, 3, 3);
        ctx.fillRect(x + 12, this.groundY + deckH - 5, 3, 3);
      }

      // 4. Animated Turquoise Ocean Surf with Gentle Foam Crests at Bottom Shore
      const waveY = this.height - 30;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.45)';
      ctx.beginPath();
      ctx.moveTo(bleedL, this.height + 400);
      for (let x = bleedL; x <= bleedL + bleedW; x += 30) {
        const wy = waveY + Math.sin(anim * 1.8 + x * 0.018) * 6;
        ctx.lineTo(x, wy);
      }
      ctx.lineTo(bleedL + bleedW, this.height + 400);
      ctx.closePath();
      ctx.fill();

      // White Foam Crest line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = bleedL; x <= bleedL + bleedW; x += 30) {
        const wy = waveY + Math.sin(anim * 1.8 + x * 0.018) * 6;
        if (x === bleedL) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    } else if (stageIndex === 2) {
      // Stage 2: Galaxy Warp & Ancient Gem Spire
      // Lapis-tinted Celestial Marble Slab
      const marbleGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      marbleGrad.addColorStop(0, '#1e1b4b');
      marbleGrad.addColorStop(0.4, '#0f172a');
      marbleGrad.addColorStop(1, '#020617');
      ctx.fillStyle = marbleGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Inlaid Glowing Cyan Warp Circuit Veins
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let rx = bleedL + 40; rx < bleedL + bleedW; rx += 240) {
        ctx.moveTo(rx, this.groundY + 15);
        ctx.lineTo(rx + 60, this.groundY + 45);
        ctx.lineTo(rx + 140, this.groundY + 45);
        ctx.lineTo(rx + 180, this.groundY + 15);
      }
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(bleedL, this.groundY - 4, bleedW, 6);

      // Authentic Galaxy Warp Pad Daises with Inner Pulsing Rings
      const warpPulse = 0.35 + 0.25 * Math.sin(anim * 2.5);
      for (const padX of [350, 900, 1450, 2050]) {
        ctx.save();
        // Outer dais base
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(padX, this.groundY - 2, 58, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Pulsing inner warp rune
        ctx.fillStyle = `rgba(34, 211, 238, ${warpPulse})`;
        ctx.beginPath();
        ctx.ellipse(padX, this.groundY - 2, 42, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Central Warp Gem Insignia
        ctx.fillStyle = '#ffffff';
        this.drawDiamondInsignia(ctx, padX, this.groundY - 2, 6);
        ctx.restore();
      }
    } else if (stageIndex === 3) {
      // Stage 3: The Prime Kindergarten — Hexagonal Basalt Columns & Amethyst Geodes
      const basaltGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      basaltGrad.addColorStop(0, '#2e1065');
      basaltGrad.addColorStop(0.3, '#1e1136');
      basaltGrad.addColorStop(1, '#090514');
      ctx.fillStyle = basaltGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Hexagonal Basalt Column Facets
      ctx.fillStyle = '#170b28';
      for (let bx = bleedL; bx < bleedL + bleedW; bx += 45) {
        const colH = 25 + Math.sin(bx * 0.12) * 15;
        ctx.fillRect(bx, this.groundY - 4, 40, colH);
        ctx.strokeStyle = '#3b0764';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(bx, this.groundY - 4, 40, colH);
      }

      ctx.fillStyle = '#a855f7';
      ctx.fillRect(bleedL, this.groundY - 4, bleedW, 6);

      // Raw Amethyst Geodes growing from the rock crevices
      for (let gx = 180; gx < this.stageWidth; gx += 280) {
        ctx.save();
        ctx.translate(gx, this.groundY - 6);
        ctx.fillStyle = '#c084fc';
        ctx.strokeStyle = '#f3e8ff';
        ctx.lineWidth = 1.2;
        // 3 Crystal Points
        ctx.beginPath();
        ctx.moveTo(-10, 0); ctx.lineTo(-6, -18); ctx.lineTo(-2, 0);
        ctx.moveTo(-2, 0); ctx.lineTo(3, -24); ctx.lineTo(8, 0);
        ctx.moveTo(8, 0); ctx.lineTo(12, -14); ctx.lineTo(16, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    } else if (stageIndex === 4) {
      // Stage 4: Subterranean Mantle Core — Molten Magma Veins & Heat Pulse
      const lavaPulse = 0.65 + 0.35 * Math.sin(anim * 3);
      const mantleGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      mantleGrad.addColorStop(0, '#262626');
      mantleGrad.addColorStop(0.4, '#1c1917');
      mantleGrad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = mantleGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Pulsing Magma Fissures
      ctx.strokeStyle = `rgba(234, 88, 12, ${lavaPulse})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bleedL, this.groundY + 25);
      for (let mx = bleedL + 120; mx <= bleedL + bleedW; mx += 140) {
        ctx.lineTo(mx, this.groundY + 18 + Math.sin(mx + anim) * 16);
      }
      ctx.stroke();

      // Lava Crust Highlight
      ctx.fillStyle = '#f97316';
      ctx.fillRect(bleedL, this.groundY - 4, bleedW, 6);
    } else if (stageIndex === 5) {
      // Stage 5: Bismuth's Burning Forge & Heavy Anvils
      const forgeGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      forgeGrad.addColorStop(0, '#7c2d12');
      forgeGrad.addColorStop(0.35, '#431407');
      forgeGrad.addColorStop(1, '#1c0702');
      ctx.fillStyle = forgeGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Molten Metal Channel
      ctx.fillStyle = 'rgba(234, 88, 12, 0.85)';
      ctx.fillRect(bleedL, this.groundY + 35, bleedW, 14);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(bleedL, this.groundY - 5, bleedW, 7);

      // Heavy Iron Blacksmith Anvils
      for (const ax of [300, 850, 1400, 1950, 2350]) {
        ctx.fillStyle = '#292524';
        ctx.fillRect(ax - 35, this.groundY - 45, 70, 45);
        ctx.fillStyle = '#44403c';
        ctx.fillRect(ax - 48, this.groundY - 58, 96, 16);
        // Red-hot forging metal on anvil
        ctx.fillStyle = '#f97316';
        ctx.fillRect(ax - 12, this.groundY - 63, 24, 6);
      }
    } else if (stageIndex === 6) {
      // Stage 6: The Frozen North — Multi-Layered Glacial Ice Shelf
      const iceGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      iceGrad.addColorStop(0, '#0284c7');
      iceGrad.addColorStop(0.3, '#0369a1');
      iceGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = iceGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Frost-White Top Ice Rim
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(bleedL, this.groundY - 5, bleedW, 7);

      // Crystalline Ice Stalagmites
      for (let ix = bleedL + 80; ix < bleedL + bleedW; ix += 210) {
        ctx.fillStyle = 'rgba(186, 230, 253, 0.65)';
        ctx.beginPath();
        ctx.moveTo(ix - 14, this.groundY);
        ctx.lineTo(ix, this.groundY - 26);
        ctx.lineTo(ix + 14, this.groundY);
        ctx.closePath();
        ctx.fill();
      }
    } else if (stageIndex === 7) {
      // Stage 7: Pink Diamond's Deep Space Zoo — Rose-Gold Marble & Stasis Pods
      const zooGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      zooGrad.addColorStop(0, '#831843');
      zooGrad.addColorStop(0.35, '#4c0519');
      zooGrad.addColorStop(1, '#1f020a');
      ctx.fillStyle = zooGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(bleedL, this.groundY - 4, bleedW, 6);

      // Stasis Dome Arches
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.50)';
      ctx.lineWidth = 3.5;
      for (const domeX of [350, 950, 1550, 2150]) {
        ctx.beginPath();
        ctx.arc(domeX, this.groundY, 110, Math.PI, 0);
        ctx.stroke();
      }
    } else if (stageIndex === 8) {
      // Stage 8: Homeworld Abduction Shore — Deep Space Tech-Dock
      const dockGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      dockGrad.addColorStop(0, '#0f172a');
      dockGrad.addColorStop(0.35, '#020617');
      dockGrad.addColorStop(1, '#000000');
      ctx.fillStyle = dockGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Cyan Vector Circuit Guidance Lines
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let tx = bleedL + 80; tx < bleedL + bleedW; tx += 200) {
        ctx.moveTo(tx, this.groundY + 18);
        ctx.lineTo(tx + 80, this.groundY + 18);
        ctx.lineTo(tx + 120, this.groundY + 45);
      }
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bleedL, this.groundY - 4, bleedW, 6);
    } else if (stageIndex === 9) {
      // Stage 9: Homeworld Courtroom & Trial Chamber — Jade & Emerald Marble
      const courtGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      courtGrad.addColorStop(0, '#064e3b');
      courtGrad.addColorStop(0.35, '#022c22');
      courtGrad.addColorStop(1, '#011711');
      ctx.fillStyle = courtGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Polished Gold Diamond Authority Trim
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(bleedL, this.groundY - 5, bleedW, 6);
      for (let qx = 250; qx < this.stageWidth; qx += 420) {
        this.drawDiamondInsignia(ctx, qx, this.groundY + 28, 16);
      }
    } else {
      // Stage 10: Change Your Mind — White Diamond Citadel Dais
      const citadelGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height + 400);
      citadelGrad.addColorStop(0, '#f8fafc');
      citadelGrad.addColorStop(0.3, '#e2e8f0');
      citadelGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = citadelGrad;
      ctx.fillRect(bleedL, this.groundY, bleedW, bleedH);

      // Prismatic Rainbow Shimmer along the grand platform
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bleedL, this.groundY - 6, bleedW, 8);
      for (let dx = 350; dx < this.stageWidth; dx += 500) {
        ctx.fillStyle = '#ffd700';
        this.drawDiamondInsignia(ctx, dx, this.groundY + 30, 22);
      }
    }

    // Sample-map & pixelfx inspired atmospheric light shafts, swaying props & drifting fireflies
    this.drawSampleMapAtmosphere(ctx, stageIndex, isPractice || stageIndex === 0);

    // Render multi-tiered platforms across the wide 2600px stage
    const platforms = this.getPlatformsForStage(stageIndex, isPractice || stageIndex === 0);
    for (const p of platforms) {
      this.drawPlatform(ctx, p);
    }

    // Render interactive stage hazards & environmental gimmicks
    const hazards = this.getHazardsForStage(stageIndex, isPractice || stageIndex === 0);
    for (const h of hazards) {
      this.drawHazard(ctx, h);
    }

    ctx.restore();
  }

  // Pixel-FX God-Rays & Fireflies (Effects/pixelfx-main weather/ + Fighting Style/samplemap.mp4)
  drawSampleMapAtmosphere(ctx, stageIndex, isPractice = false) {
    const anim = this.animTime || 0;
    const wSpan = (stageIndex === 0 || isPractice) ? 1320 : (this.stageWidth || 2600);
    const palettes = {
      0: { ray: 'rgba(255, 240, 196, 0.085)', core: 'rgba(255, 250, 224, 0.14)', mote: '#fde68a', glow: '#f59e0b' },
      1: { ray: 'rgba(253, 224, 71, 0.075)', core: 'rgba(255, 247, 200, 0.13)', mote: '#fef08a', glow: '#fb923c' },
      2: { ray: 'rgba(56, 189, 248, 0.08)', core: 'rgba(186, 230, 253, 0.14)', mote: '#67e8f9', glow: '#06b6d4' },
      3: { ray: 'rgba(192, 132, 252, 0.075)', core: 'rgba(243, 232, 255, 0.12)', mote: '#d8b4fe', glow: '#a855f7' },
      4: { ray: 'rgba(249, 115, 22, 0.075)', core: 'rgba(254, 215, 170, 0.12)', mote: '#fb923c', glow: '#ea580c' },
      5: { ray: 'rgba(251, 146, 60, 0.08)', core: 'rgba(254, 240, 138, 0.12)', mote: '#fbbf24', glow: '#ea580c' },
      6: { ray: 'rgba(186, 230, 253, 0.085)', core: 'rgba(240, 249, 255, 0.15)', mote: '#e0f2fe', glow: '#38bdf8' },
      7: { ray: 'rgba(244, 114, 182, 0.08)', core: 'rgba(253, 242, 248, 0.13)', mote: '#fbcfe8', glow: '#f43f5e' },
      8: { ray: 'rgba(34, 211, 238, 0.075)', core: 'rgba(207, 250, 254, 0.12)', mote: '#67e8f9', glow: '#0ea5e9' },
      9: { ray: 'rgba(52, 211, 153, 0.08)', core: 'rgba(254, 240, 138, 0.13)', mote: '#fde047', glow: '#10b981' },
      10: { ray: 'rgba(255, 255, 255, 0.10)', core: 'rgba(254, 249, 195, 0.17)', mote: '#ffffff', glow: '#ffd700' }
    };
    const pal = palettes[isPractice ? 0 : stageIndex] || palettes[1];

    // 1. Slanted Breathing God-Ray Shafts
    ctx.save();
    for (let i = 0; i < 6; i++) {
      const baseX = ((i + 0.45) / 6) * wSpan + Math.sin(anim * 0.45 + i * 1.3) * 18;
      const topW = 36 + (i % 3) * 18;
      const botW = topW * 2.5;
      const slant = 165;
      const pulse = 0.72 + 0.28 * Math.sin(anim * 0.8 + i * 2.1);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = pal.ray;
      ctx.beginPath();
      ctx.moveTo(baseX - topW * 0.5, 0);
      ctx.lineTo(baseX + topW * 0.5, 0);
      ctx.lineTo(baseX + slant + botW * 0.5, this.groundY);
      ctx.lineTo(baseX + slant - botW * 0.5, this.groundY);
      ctx.closePath();
      ctx.fill();

      // Inner bright core strand (god-rays.js technique)
      ctx.fillStyle = pal.core;
      ctx.beginPath();
      ctx.moveTo(baseX - topW * 0.16, 0);
      ctx.lineTo(baseX + topW * 0.16, 0);
      ctx.lineTo(baseX + slant + botW * 0.16, this.groundY);
      ctx.lineTo(baseX + slant - botW * 0.16, this.groundY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. Glowing Stage Lantern Posts / Crystal Beacons along the ground
    const spacing = (stageIndex === 0 || isPractice) ? 380 : 480;
    for (let px = 190; px < wSpan - 120; px += spacing) {
      const flicker = 0.75 + 0.25 * Math.sin(anim * 5.2 + px);
      ctx.save();
      ctx.translate(px, this.groundY);
      // Ornamental post
      ctx.fillStyle = (stageIndex === 1 || stageIndex === 0 || isPractice) ? '#451a03' : '#1e293b';
      ctx.fillRect(-3, -52, 6, 52);
      ctx.fillRect(-10, -52, 20, 4);
      // Warm glowing lantern crystal
      const rad = 28 * flicker;
      const g = ctx.createRadialGradient(0, -43, 2, 0, -43, rad);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.35, pal.mote);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, -43, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      this.drawDiamondInsignia(ctx, 0, -43, 5.5);
      ctx.restore();
    }

    // 3. Drifting Fireflies / Atmospheric Dust Motes (fireflies.js technique)
    const count = (stageIndex === 0 || isPractice) ? 14 : 24;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const seed = (i * 197 + stageIndex * 53) % wSpan;
      const fx = seed + Math.sin(anim * (0.9 + (i % 3) * 0.35) + i * 2.1) * 28;
      const fy = (this.groundY - 45) - ((i * 73) % 340) + Math.sin(anim * 1.4 + i) * 16;
      const glowPulse = Math.max(0.15, 0.55 + 0.45 * Math.sin(anim * 2.6 + i * 1.7));
      ctx.globalAlpha = glowPulse * 0.35;
      ctx.fillStyle = pal.glow;
      ctx.beginPath();
      ctx.arc(fx, fy, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = glowPulse;
      ctx.fillStyle = pal.mote;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  getHazardsForStage(stageIndex, isPractice = false) {
    if (!this._hazardsByStage) this._hazardsByStage = {};
    const key = (stageIndex === 0 || isPractice) ? 'practice_0' : `stage_${stageIndex}`;
    if (this._hazardsByStage[key]) return this._hazardsByStage[key];

    let list = [];
    if (stageIndex === 0 || isPractice) {
      list = [
        { id: 'bounce_spire', type: 'bounce_pad', x: 600, y: this.groundY - 14, width: 80, height: 16, color: '#f472b6' }
      ];
    } else if (stageIndex === 1) {
      // Stage 1 (Beach): Pink Bounce Dunes & Breakable Ancient Pillar
      list = [
        { id: 'bounce_beach', type: 'bounce_pad', x: 740, y: this.groundY - 14, width: 85, height: 16, color: '#f472b6' },
        { id: 'pillar_beach', type: 'pillar', x: 1440, y: this.groundY - 110, width: 44, height: 110, hp: 60, maxHp: 60, color: '#cbd5e1' }
      ];
    } else if (stageIndex === 2) {
      // Stage 2 (Galaxy Warp / Ancient Spire): Zero-Gravity Warp Beam
      list = [
        { id: 'antigrav_spire', type: 'low_gravity', x: 1180, y: 160, width: 140, height: 440, color: 'rgba(56, 189, 248, 0.28)' }
      ];
    } else if (stageIndex === 3) {
      // Stage 3 (Prime Kindergarten): Destabilizer Energy Barrier
      list = [
        { id: 'destabilizer_kinder', type: 'destabilizer', x: 1020, y: this.groundY - 140, width: 34, height: 140, cycleTimer: 0, active: true, color: '#facc15' }
      ];
    } else if (stageIndex === 4) {
      // Stage 4 (Subterranean Mantle): Molten Core Geysers
      list = [
        { id: 'geyser_mantle1', type: 'geyser', x: 700, y: this.groundY - 14, width: 75, height: 140, cycleTimer: 0, active: false, color: '#f97316' },
        { id: 'geyser_mantle2', type: 'geyser', x: 1950, y: this.groundY - 14, width: 75, height: 140, cycleTimer: 1.8, active: false, color: '#f97316' }
      ];
    } else if (stageIndex === 5) {
      // Stage 5 (Bismuth's Forge): Molten Forge Geyser & Breakable Iron-Crystal Pillar
      list = [
        { id: 'pillar_forge', type: 'pillar', x: 960, y: this.groundY - 110, width: 44, height: 110, hp: 70, maxHp: 70, color: '#fb923c' },
        { id: 'geyser_forge', type: 'geyser', x: 1640, y: this.groundY - 14, width: 78, height: 145, cycleTimer: 0.6, active: false, color: '#f97316' }
      ];
    } else if (stageIndex === 6) {
      // Stage 6 (The Frozen North): Glacial Thermal Updraft & Ice Monolith Pillar
      list = [
        { id: 'updraft_ice', type: 'low_gravity', x: 1120, y: 160, width: 150, height: 440, color: 'rgba(186, 230, 253, 0.25)' },
        { id: 'pillar_ice', type: 'pillar', x: 1850, y: this.groundY - 110, width: 44, height: 110, hp: 70, maxHp: 70, color: '#bae6fd' }
      ];
    } else if (stageIndex === 7) {
      // Stage 7 (Pink Diamond's Zoo): Rose Gravity Bounce Pads & Zero-G Stasis Column
      list = [
        { id: 'bounce_zoo1', type: 'bounce_pad', x: 680, y: this.groundY - 14, width: 85, height: 16, color: '#fb7185' },
        { id: 'stasis_zoo', type: 'low_gravity', x: 1200, y: 170, width: 145, height: 430, color: 'rgba(244, 114, 182, 0.24)' },
        { id: 'bounce_zoo2', type: 'bounce_pad', x: 1840, y: this.groundY - 14, width: 85, height: 16, color: '#fb7185' }
      ];
    } else if (stageIndex === 8) {
      // Stage 8 (Homeworld Abduction Shore): Destabilizer Gate & Ship Tractor Lift Beam
      list = [
        { id: 'destabilizer_shore', type: 'destabilizer', x: 860, y: this.groundY - 140, width: 34, height: 140, cycleTimer: 0.4, active: true, color: '#facc15' },
        { id: 'tractor_shore', type: 'low_gravity', x: 1660, y: 160, width: 145, height: 440, color: 'rgba(56, 189, 248, 0.28)' }
      ];
    } else if (stageIndex === 9) {
      // Stage 9 (The Homeworld Trial): Jade Courtroom Pillars & Security Destabilizer
      list = [
        { id: 'pillar_trial1', type: 'pillar', x: 820, y: this.groundY - 110, width: 44, height: 110, hp: 75, maxHp: 75, color: '#6ee7b7' },
        { id: 'destabilizer_trial', type: 'destabilizer', x: 1280, y: this.groundY - 140, width: 34, height: 140, cycleTimer: 1.1, active: true, color: '#facc15' },
        { id: 'pillar_trial2', type: 'pillar', x: 1760, y: this.groundY - 110, width: 44, height: 110, hp: 75, maxHp: 75, color: '#6ee7b7' }
      ];
    } else {
      // Stage 10 (White Diamond Citadel): Starlight Bounce Dais, Prismatic Anti-Grav & Obelisk Pillar
      list = [
        { id: 'bounce_citadel', type: 'bounce_pad', x: 640, y: this.groundY - 14, width: 90, height: 16, color: '#fde047' },
        { id: 'prism_citadel', type: 'low_gravity', x: 1200, y: 150, width: 155, height: 450, color: 'rgba(255, 255, 255, 0.24)' },
        { id: 'pillar_citadel', type: 'pillar', x: 1820, y: this.groundY - 115, width: 46, height: 115, hp: 85, maxHp: 85, color: '#f8fafc' }
      ];
    }
    this._hazardsByStage[key] = list;
    return list;
  }

  drawHazard(ctx, h) {
    ctx.save();
    const anim = this.animTime || 0;
    if (h.type === 'bounce_pad') {
      const pulse = Math.sin(anim * 6) * 3;
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(h.x, h.y, h.width, h.height, 8);
      else ctx.rect(h.x, h.y, h.width, h.height);
      ctx.fill();

      ctx.fillStyle = h.color || '#f472b6';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(h.x + 4, h.y + 2, h.width - 8, h.height - 4, 6);
      else ctx.rect(h.x + 4, h.y + 2, h.width - 8, h.height - 4);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      this.drawDiamondInsignia(ctx, h.x + h.width / 2, h.y + h.height / 2, 8 + pulse);
    } else if (h.type === 'pillar') {
      if (h.hp > 0) {
        const grad = ctx.createLinearGradient(h.x, h.y, h.x + h.width, h.y);
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(0.5, '#f1f5f9');
        grad.addColorStop(1, '#64748b');
        ctx.fillStyle = grad;
        ctx.fillRect(h.x, h.y, h.width, h.height);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(h.x, h.y, h.width, h.height);

        if (h.hp < h.maxHp) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(h.x + 10, h.y + 20);
          ctx.lineTo(h.x + 24, h.y + 45);
          ctx.lineTo(h.x + 16, h.y + 70);
          ctx.stroke();
        }
      }
    } else if (h.type === 'low_gravity') {
      ctx.fillStyle = h.color;
      ctx.fillRect(h.x, h.y, h.width, h.height);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x, h.y, h.width, h.height);
      for (let i = 0; i < 4; i++) {
        const arrowY = h.y + h.height - (((anim * 80 + i * 90) % h.height));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(h.x + h.width * 0.25, arrowY + 12);
        ctx.lineTo(h.x + h.width * 0.5, arrowY);
        ctx.lineTo(h.x + h.width * 0.75, arrowY + 12);
        ctx.stroke();
      }
    } else if (h.type === 'destabilizer') {
      h.cycleTimer = (h.cycleTimer || 0) + 0.016;
      const cycle = h.cycleTimer % 4.5;
      h.active = cycle < 2.6;
      ctx.fillStyle = '#475569';
      ctx.fillRect(h.x, h.y, 8, h.height);
      ctx.fillRect(h.x + h.width - 8, h.y, 8, h.height);
      if (h.active) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3 + Math.sin(anim * 35) * 1.5;
        ctx.beginPath();
        ctx.moveTo(h.x + 4, h.y + 10);
        for (let py = h.y + 20; py < h.y + h.height - 10; py += 15) {
          const jitter = (Math.random() - 0.5) * (h.width - 12);
          ctx.lineTo(h.x + h.width / 2 + jitter, py);
        }
        ctx.lineTo(h.x + h.width - 4, h.y + h.height - 10);
        ctx.stroke();
      }
    } else if (h.type === 'geyser') {
      h.cycleTimer = (h.cycleTimer || 0) + 0.016;
      const cycle = h.cycleTimer % 4.0;
      h.active = cycle > 2.8;
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.ellipse(h.x + h.width / 2, h.y + 8, h.width / 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      if (h.active) {
        const flameGrad = ctx.createLinearGradient(h.x, h.y, h.x, h.y - h.height);
        flameGrad.addColorStop(0, '#f97316');
        flameGrad.addColorStop(0.6, '#ef4444');
        flameGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flameGrad;
        ctx.fillRect(h.x + 8, h.y - h.height, h.width - 16, h.height);
      }
    }
    ctx.restore();
  }

  // Backward-compatible monolithic draw method
  draw(ctx, stageIndex, isPractice = false) {
    this.drawBackground(ctx, stageIndex, 0, isPractice);
    this.drawForeground(ctx, stageIndex, isPractice);
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

  drawCloud(ctx, cx, cy, scale, stage) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.fillStyle = stage === 1 ? 'rgba(255, 230, 240, 0.32)' : 'rgba(240, 244, 255, 0.22)';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-45, -6, 90, 18, 9);
    } else {
      ctx.rect(-45, -6, 90, 18);
    }
    ctx.arc(-20, -10, 20, 0, Math.PI * 2);
    ctx.arc(12, -14, 24, 0, Math.PI * 2);
    ctx.arc(32, -8, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getPlatformsForStage(stageIndex, isPractice = false) {
    const pType = (stageIndex === 1) ? 'wood' :
                  (stageIndex === 3 || stageIndex === 5 || stageIndex === 8 || stageIndex === 9) ? 'metal' :
                  (stageIndex === 4) ? 'obsidian' : 'stone';

    if (stageIndex === 0 || isPractice) {
      // Balanced Sky Spire Colonnade Arena (1280px single-screen combat ring)
      // Both endcaps clearly visible, perfectly framed with Holo-Jasper dummy
      return [
        { x: 120, y: 460, width: 220, height: 24, type: pType },
        { x: 220, y: 260, width: 190, height: 22, type: pType },
        { x: 480, y: 360, width: 320, height: 24, type: pType },
        { x: 540, y: 190, width: 200, height: 22, type: pType },
        { x: 870, y: 260, width: 190, height: 22, type: pType },
        { x: 940, y: 460, width: 220, height: 24, type: pType }
      ];
    }

    // Expansive Multi-Tiered Arena Platforms spanning full 2600px width:
    // Left Wing (X: 120 - 680) • Center Dais & Spire (X: 860 - 1720) • Right Wing (X: 1880 - 2480)
    // Distributed so no platform is sliced across the initial 1280 screen view
    return [
      // Left Wing: Low stepped platform & high sniper perch
      { x: 120, y: 475, width: 240, height: 24, type: pType },
      { x: 400, y: 360, width: 230, height: 24, type: pType },
      { x: 200, y: 230, width: 190, height: 22, type: pType },

      // Center Arena: Wide central dais, high bridge & sky perch
      { x: 860, y: 460, width: 300, height: 26, type: pType },
      { x: 1200, y: 320, width: 280, height: 26, type: pType },
      { x: 1520, y: 460, width: 280, height: 26, type: pType },
      { x: 1140, y: 180, width: 200, height: 22, type: pType },

      // Right Wing: Stepped terraces & flyer watchtower
      { x: 1880, y: 360, width: 250, height: 24, type: pType },
      { x: 2160, y: 475, width: 270, height: 24, type: pType },
      { x: 2200, y: 230, width: 210, height: 22, type: pType }
    ];
  }

  drawPlatform(ctx, plat) {
    ctx.save();
    const x = plat.x;
    const y = plat.y;
    const w = plat.width;
    const h = plat.height;
    const anim = this.animTime || 0;

    if (plat.type === 'wood') {
      // Weathered Boardwalk Timber Slabs with Heavy Pilings & Brass Hardware
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + 22, y + h, 14, 130);
      ctx.fillRect(x + w - 36, y + h, 14, 130);
      ctx.fillStyle = '#270e02';
      ctx.fillRect(x + 22, y + h, 4, 130);
      ctx.fillRect(x + w - 36, y + h, 4, 130);

      // Angled Timber Struts
      ctx.strokeStyle = '#381604';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 28, y + h + 24); ctx.lineTo(x + 8, y + h + 4);
      ctx.moveTo(x + w - 28, y + h + 24); ctx.lineTo(x + w - 8, y + h + 4);
      ctx.stroke();

      // Main Timber Decking
      const woodGrad = ctx.createLinearGradient(x, y, x, y + h);
      woodGrad.addColorStop(0, '#f59e0b');
      woodGrad.addColorStop(0.28, '#b45309');
      woodGrad.addColorStop(1, '#5c2306');
      ctx.fillStyle = woodGrad;
      ctx.strokeStyle = '#2d1406';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      // Chamfered Golden Wood Top Edge Highlight
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 4, y + 2, w - 8, 3.5);

      // Plank Grooves & Brass Carriage Bolts
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      for (let px = x + 38; px < x + w - 10; px += 42) {
        ctx.beginPath();
        ctx.moveTo(px, y + 3);
        ctx.lineTo(px, y + h - 2);
        ctx.stroke();

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(px - 10, y + 7, 2.5, 0, Math.PI * 2);
        ctx.arc(px - 10, y + h - 7, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(px - 10, y + 7, 1.2, 0, Math.PI * 2);
        ctx.arc(px - 10, y + h - 7, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hanging Coastal Rope / Kelp Fronds
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.8;
      for (let rx = x + 60; rx < x + w - 50; rx += 70) {
        const sway = Math.sin(anim * 2.5 + rx * 0.05) * 4;
        ctx.beginPath();
        ctx.moveTo(rx, y + h);
        ctx.quadraticCurveTo(rx + sway, y + h + 14, rx + sway * 0.5, y + h + 26);
        ctx.stroke();
      }
    } else if (plat.type === 'stone') {
      // Ancient Gem Sky Spire Runic Marble Slab with Crystalline Inlays
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(x + 4, y + h, w - 8, 7);

      // Carved Marble Support Corbels Underneath
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(x + 18, y + h); ctx.lineTo(x + 28, y + h + 14); ctx.lineTo(x + 12, y + h + 14); ctx.closePath();
      ctx.moveTo(x + w - 18, y + h); ctx.lineTo(x + w - 12, y + h + 14); ctx.lineTo(x + w - 28, y + h + 14); ctx.closePath();
      ctx.fill();

      const stoneGrad = ctx.createLinearGradient(x, y, x, y + h);
      stoneGrad.addColorStop(0, '#ffffff');
      stoneGrad.addColorStop(0.3, '#e2e8f0');
      stoneGrad.addColorStop(0.7, '#94a3b8');
      stoneGrad.addColorStop(1, '#475569');
      ctx.fillStyle = stoneGrad;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      // Luminous Cyan Crystalline Rim Cap
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x + 4, y + 2, w - 8, 3.5);

      // Glowing Cyan Gem Runic Line
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x + 18, y + h / 2);
      ctx.lineTo(x + w - 18, y + h / 2);
      ctx.stroke();

      // Golden Gem Filigree Corner Brackets
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 2, y + 2, 8, 8);
      ctx.fillRect(x + w - 10, y + 2, 8, 8);
      ctx.fillRect(x + 2, y + h - 10, 8, 8);
      ctx.fillRect(x + w - 10, y + h - 10, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 4, y + 4, 4, 4);
      ctx.fillRect(x + w - 8, y + 4, 4, 4);

      // Hanging Crystalline Stalactites / Prisms Underneath
      for (let sx = x + 44; sx < x + w - 40; sx += 54) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.beginPath();
        ctx.moveTo(sx - 5, y + h);
        ctx.lineTo(sx + 5, y + h);
        ctx.lineTo(sx, y + h + 13);
        ctx.closePath();
        ctx.fill();
      }

      // Small Ambient Fern Sprouts on Platform Top (Sample Map Detail!)
      ctx.fillStyle = '#4ade80';
      for (let fx = x + 30; fx < x + w - 25; fx += 80) {
        const sw = Math.sin(anim * 3.0 + fx * 0.08) * 2;
        ctx.beginPath();
        ctx.moveTo(fx, y);
        ctx.quadraticCurveTo(fx + sw - 6, y - 8, fx + sw - 8, y - 13);
        ctx.quadraticCurveTo(fx + sw - 3, y - 6, fx, y);
        ctx.quadraticCurveTo(fx + sw + 5, y - 9, fx + sw + 7, y - 14);
        ctx.quadraticCurveTo(fx + sw + 2, y - 6, fx, y);
        ctx.fill();
      }
    } else if (plat.type === 'metal') {
      // Prime Kindergarten / Forge Industrial Metal Slab with Heavy Brackets
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 18, y + h); ctx.lineTo(x + 6, y + h + 22);
      ctx.moveTo(x + w - 18, y + h); ctx.lineTo(x + w - 6, y + h + 22);
      ctx.stroke();

      const metalGrad = ctx.createLinearGradient(x, y, x, y + h);
      metalGrad.addColorStop(0, '#64748b');
      metalGrad.addColorStop(0.35, '#334155');
      metalGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = metalGrad;
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      // Top Steel Grip Lip
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 4, y + 2, w - 8, 3.5);

      // Yellow & Black Diagonal Hazard Caution Stripes
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 4, y + h - 8, w - 8, 6);
      ctx.clip();
      ctx.fillStyle = '#eab308';
      ctx.fillRect(x + 4, y + h - 8, w - 8, 6);
      ctx.fillStyle = '#0f172a';
      for (let sx = x - 20; sx < x + w + 20; sx += 14) {
        ctx.beginPath();
        ctx.moveTo(sx, y + h - 8);
        ctx.lineTo(sx + 7, y + h - 8);
        ctx.lineTo(sx, y + h);
        ctx.lineTo(sx - 7, y + h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Steel Plate Rivets
      ctx.fillStyle = '#cbd5e1';
      for (let rx = x + 16; rx < x + w; rx += 36) {
        ctx.beginPath();
        ctx.arc(rx, y + 8, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hanging Power Conduit Wires Underneath
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.8;
      for (let wx = x + 50; wx < x + w - 40; wx += 65) {
        ctx.beginPath();
        ctx.moveTo(wx, y + h);
        ctx.quadraticCurveTo(wx + 12, y + h + 15, wx + 24, y + h);
        ctx.stroke();
      }
    } else if (plat.type === 'obsidian') {
      // Subterranean Mantle Core Volcanic Obsidian Slabs
      ctx.fillStyle = '#0f051d';
      ctx.strokeStyle = '#2e1065';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      // Glowing Magma Cap Lip
      const lavaPulse = Math.sin(anim * 4) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(249, 115, 22, ${lavaPulse})`;
      ctx.fillRect(x + 4, y + 2, w - 8, 3.5);

      // Molten Vein Fissure
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 6);
      ctx.lineTo(x + 40, y + h - 5);
      ctx.lineTo(x + 95, y + 4);
      ctx.lineTo(x + 130, y + h - 6);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + 40, y + h - 5, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 95, y + 4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Hanging Basalt Stalactites with Dripping Ember Sparks
      for (let bx = x + 40; bx < x + w - 30; bx += 55) {
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.moveTo(bx - 6, y + h);
        ctx.lineTo(bx + 6, y + h);
        ctx.lineTo(bx, y + h + 14);
        ctx.closePath();
        ctx.fill();
        // Ember tip
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(bx, y + h + 14, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sample-map Ambient Edge Sconce Sparkle on Platforms
    const sconcePulse = 0.7 + 0.3 * Math.sin(anim * 4.5 + x);
    ctx.fillStyle = '#fef08a';
    ctx.globalAlpha = sconcePulse;
    this.drawDiamondInsignia(ctx, x + 8, y - 4, 4);
    this.drawDiamondInsignia(ctx, x + w - 8, y - 4, 4);
    ctx.restore();
  }
}

// ============================================================================
// 4. REALISTIC CRYSTAL GEMS HERO CLASS
// ============================================================================
// ============================================================================
// FREEBUFF COMBAT OVERHAUL — LORE-ACCURATE COMBO PROFILES
// Every Guardian keeps their canonical 3-hit chain, but each step now has its own
// cadence, reach, damage curve and a unique finisher based on their real weapon.
// ============================================================================
// ============================================================================
// 3.6. GEM COMBAT TYPES — Pokémon-style matchup engine with show-accurate types
// ============================================================================
// Every hero keeps the typing the roster already declares (Steven = FAIRY/PSYCHIC
// because his powers are empathic/healing, Garnet = FIGHT/PSYCHIC because of Future
// Vision, Lapis = WATER/FLYING because of hydrokinesis + water wings, and so on).
// The chart below is the authentic Pokémon chart restricted to the 11 types used by
// the Steven Universe cast, so matchups behave the way players already expect.
