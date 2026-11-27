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

    // Parallax Distant Silhouettes & Painted Steven Universe Landmarks (All 10 Stages + Sky Arena)
    const bgOffset = cameraX * 0.30;
    const farOffset = cameraX * 0.14;
    const anim = this.animTime || 0;

    if (stageIndex === 0 || isPractice) {
      // Practice Sky Arena: Floating Cloud Sea, Ancient Marble Arches & Fluttering Rebellion Banners
      ctx.save();
      // Soft rose-gold horizon sun halo
      const sunG = ctx.createRadialGradient(this.canvasWidth * 0.5, this.groundY - 120, 12, this.canvasWidth * 0.5, this.groundY - 120, 280);
      sunG.addColorStop(0, 'rgba(254, 240, 138, 0.32)');
      sunG.addColorStop(0.5, 'rgba(103, 232, 249, 0.16)');
      sunG.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunG;
      ctx.fillRect(0, 0, this.canvasWidth, this.groundY);

      // Distant floating broken Sky Arena marble arches
      for (const ax of [260, 740, 1260, 1780]) {
        const x = ax - farOffset;
        const bobY = Math.sin(anim * 0.9 + ax * 0.01) * 5;
        ctx.fillStyle = 'rgba(165, 180, 252, 0.22)';
        ctx.fillRect(x - 62, this.groundY - 220 + bobY, 18, 220);
        ctx.fillRect(x + 44, this.groundY - 220 + bobY, 18, 220);
        ctx.strokeStyle = 'rgba(224, 231, 255, 0.30)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(x, this.groundY - 216 + bobY, 53, Math.PI, 0);
        ctx.stroke();
        // Fluttering Rose Rebellion Banner
        const wave = Math.sin(anim * 2.6 + ax) * 7;
        ctx.fillStyle = 'rgba(244, 114, 182, 0.42)';
        ctx.beginPath();
        ctx.moveTo(x - 16, this.groundY - 210 + bobY);
        ctx.lineTo(x + 16, this.groundY - 210 + bobY);
        ctx.quadraticCurveTo(x + 14 + wave, this.groundY - 145 + bobY, x + 8 + wave * 1.4, this.groundY - 105 + bobY);
        ctx.lineTo(x + wave * 0.8, this.groundY - 120 + bobY);
        ctx.lineTo(x - 10 + wave * 1.1, this.groundY - 105 + bobY);
        ctx.closePath();
        ctx.fill();
      }
      // Pastel Cloud Sea rolling below horizon
      ctx.fillStyle = 'rgba(186, 230, 253, 0.20)';
      for (let cx = -80; cx < this.canvasWidth + 160; cx += 150) {
        const bx = cx - (farOffset % 150);
        ctx.beginPath();
        ctx.arc(bx, this.groundY - 12, 85, Math.PI, 0);
        ctx.fill();
      }
      ctx.restore();
    } else if (stageIndex === 1) {
      // Beach City: Sunset Ocean Horizon, Sculpted Crystal Temple Obsidian Statue + Beach House, Lighthouse & Funland Ferris Wheel
      ctx.save();
      // Glowing Sunset Disc & Horizon Reflection
      const sunX = 760 - farOffset * 0.5;
      const sunY = this.groundY - 145;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 14, sunX, sunY, 175);
      sunGlow.addColorStop(0, 'rgba(254, 249, 195, 0.92)');
      sunGlow.addColorStop(0.28, 'rgba(251, 146, 60, 0.48)');
      sunGlow.addColorStop(0.65, 'rgba(244, 114, 182, 0.18)');
      sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 175, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
      ctx.fill();

      // Distant Sunset Ocean Band + Shimmering Water Ripples
      const seaY = this.groundY - 62;
      const seaG = ctx.createLinearGradient(0, seaY, 0, this.groundY);
      seaG.addColorStop(0, 'rgba(190, 24, 93, 0.52)');
      seaG.addColorStop(0.5, 'rgba(126, 34, 206, 0.48)');
      seaG.addColorStop(1, 'rgba(30, 27, 75, 0.58)');
      ctx.fillStyle = seaG;
      ctx.fillRect(0, seaY, this.canvasWidth, 62);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.38)';
      for (let r = 0; r < 6; r++) {
        const rw = 90 - r * 11 + Math.sin(anim * 2.2 + r) * 8;
        ctx.fillRect(sunX - rw * 0.5, seaY + 6 + r * 8, rw, 2.5);
      }

      // Colossal Crystal Temple Obsidian Statue & Cliff Bluff
      const tx = 1080 - bgOffset;
      // Layered sunset cliff behind statue
      ctx.fillStyle = '#3b154d';
      ctx.beginPath();
      ctx.moveTo(tx - 245, this.groundY);
      ctx.lineTo(tx - 155, this.groundY - 215);
      ctx.lineTo(tx - 55, this.groundY - 240);
      ctx.lineTo(tx + 125, this.groundY - 230);
      ctx.lineTo(tx + 240, this.groundY - 125);
      ctx.lineTo(tx + 310, this.groundY);
      ctx.closePath();
      ctx.fill();
      // Grassy green cliff crest
      ctx.fillStyle = 'rgba(22, 101, 52, 0.55)';
      ctx.beginPath();
      ctx.moveTo(tx - 155, this.groundY - 215);
      ctx.quadraticCurveTo(tx - 5, this.groundY - 252, tx + 128, this.groundY - 228);
      ctx.lineTo(tx + 120, this.groundY - 214);
      ctx.lineTo(tx - 145, this.groundY - 202);
      ctx.closePath();
      ctx.fill();

      // Carved Obsidian Temple Goddess (Multi-armed stone relief + serene face + billowing stone curls)
      ctx.fillStyle = '#4c1d6e';
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
      ctx.lineWidth = 2;
      // Stone curl halo
      ctx.beginPath();
      ctx.arc(tx - 58, this.groundY - 188, 36, 0, Math.PI * 2);
      ctx.arc(tx + 58, this.groundY - 188, 36, 0, Math.PI * 2);
      ctx.arc(tx, this.groundY - 222, 48, 0, Math.PI * 2);
      ctx.fill();
      // Sculpted head & torso
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.ellipse(tx, this.groundY - 186, 42, 46, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Serene closed eyes & gemstone forehead mark
      ctx.strokeStyle = 'rgba(251, 207, 232, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tx - 15, this.groundY - 184, 8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.moveTo(tx + 7, this.groundY - 184);
      ctx.arc(tx + 15, this.groundY - 184, 8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'rgba(244, 114, 182, 0.72)';
      this.drawDiamondInsignia(ctx, tx, this.groundY - 204, 7);
      // Outstretched stone forearms framing the Beach House
      ctx.fillStyle = '#4c1d6e';
      ctx.beginPath();
      ctx.moveTo(tx - 140, this.groundY - 110);
      ctx.lineTo(tx - 65, this.groundY - 140);
      ctx.lineTo(tx - 60, this.groundY - 96);
      ctx.lineTo(tx - 125, this.groundY - 82);
      ctx.closePath();
      ctx.moveTo(tx + 140, this.groundY - 110);
      ctx.lineTo(tx + 65, this.groundY - 140);
      ctx.lineTo(tx + 60, this.groundY - 96);
      ctx.lineTo(tx + 125, this.groundY - 82);
      ctx.closePath();
      ctx.fill();

      // Steven's Beach House perched on the Temple front!
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 54, this.groundY - 94, 108, 56);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(tx - 48, this.groundY - 88, 96, 44);
      // Pitched cedar roof
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.moveTo(tx - 62, this.groundY - 88);
      ctx.lineTo(tx, this.groundY - 126);
      ctx.lineTo(tx + 62, this.groundY - 88);
      ctx.closePath();
      ctx.fill();
      // Warm glowing Beach House windows & wooden deck railing
      ctx.fillStyle = '#fde047';
      ctx.fillRect(tx - 34, this.groundY - 78, 18, 22);
      ctx.fillRect(tx + 16, this.groundY - 78, 18, 22);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(tx - 8, this.groundY - 76, 16, 30);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 60, this.groundY - 46, 120, 6);
      ctx.fillRect(tx - 52, this.groundY - 40, 8, 40);
      ctx.fillRect(tx + 44, this.groundY - 40, 8, 40);

      // Beach City Hilltop Lighthouse + Volumetric Rotating Beam
      const lx = 390 - bgOffset;
      ctx.fillStyle = '#4c1d6e';
      ctx.beginPath();
      ctx.moveTo(lx - 75, this.groundY);
      ctx.quadraticCurveTo(lx, this.groundY - 95, lx + 82, this.groundY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(lx - 14, this.groundY - 70);
      ctx.lineTo(lx - 10, this.groundY - 155);
      ctx.lineTo(lx + 10, this.groundY - 155);
      ctx.lineTo(lx + 14, this.groundY - 70);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(lx - 12, this.groundY - 135, 24, 14);
      ctx.fillRect(lx - 13, this.groundY - 102, 26, 14);
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.arc(lx, this.groundY - 160, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(lx - 8, this.groundY - 162, 16, 8);
      const beamAngle = Math.sin(anim * 0.95) * 0.34;
      ctx.save();
      ctx.translate(lx, this.groundY - 158);
      ctx.rotate(beamAngle);
      const beamG = ctx.createLinearGradient(0, 0, 320, 0);
      beamG.addColorStop(0, 'rgba(254, 249, 195, 0.34)');
      beamG.addColorStop(1, 'rgba(254, 249, 195, 0)');
      ctx.fillStyle = beamG;
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(320, -56);
      ctx.lineTo(320, 56);
      ctx.lineTo(0, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Funland Ferris Wheel (Spokes, A-Frame Legs & Rotating Lit Gondolas!)
      const fx = 1780 - bgOffset;
      const fy = this.groundY - 128;
      const fr = 82;
      ctx.strokeStyle = 'rgba(251, 207, 232, 0.45)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fx - 46, this.groundY); ctx.lineTo(fx, fy); ctx.lineTo(fx + 46, this.groundY);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(fx, fy, fr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(fx, fy, fr * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      const rot = anim * 0.25;
      for (let g = 0; g < 10; g++) {
        const a = rot + (g * Math.PI * 2) / 10;
        const gx = fx + Math.cos(a) * fr;
        const gy = fy + Math.sin(a) * fr;
        ctx.strokeStyle = 'rgba(251, 207, 232, 0.32)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(fx, fy); ctx.lineTo(gx, gy);
        ctx.stroke();
        ctx.fillStyle = g % 2 === 0 ? '#fde047' : '#f472b6';
        ctx.fillRect(gx - 5, gy - 2, 10, 9);
      }
      ctx.restore();
    } else if (stageIndex === 2) {
      // Galaxy Warp & Lunar Sea Spire: Floating Broken Spire Columns, Cascading Sky Waterfalls & Warp Beams
      ctx.save();
      // Cosmic nebula cloud bands
      const neb = ctx.createRadialGradient(this.canvasWidth * 0.45, 160, 20, this.canvasWidth * 0.45, 160, 420);
      neb.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      neb.addColorStop(0.55, 'rgba(139, 92, 246, 0.14)');
      neb.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, this.canvasWidth, this.groundY);

      // Towering Ancient Lunar Sea Spire Towers & Broken Aqueducts with Waterfalls
      for (const sx of [320, 860, 1440, 2040]) {
        const x = sx - bgOffset;
        const floatY = Math.sin(anim * 1.1 + sx * 0.01) * 7;
        // Translucent floating crystal obelisk
        const obG = ctx.createLinearGradient(x - 36, this.groundY - 260, x + 36, this.groundY);
        obG.addColorStop(0, 'rgba(186, 230, 253, 0.42)');
        obG.addColorStop(0.5, 'rgba(56, 189, 248, 0.24)');
        obG.addColorStop(1, 'rgba(30, 27, 75, 0.40)');
        ctx.fillStyle = obG;
        ctx.beginPath();
        ctx.moveTo(x - 32, this.groundY - 50 + floatY);
        ctx.lineTo(x - 24, this.groundY - 230 + floatY);
        ctx.lineTo(x, this.groundY - 275 + floatY);
        ctx.lineTo(x + 24, this.groundY - 230 + floatY);
        ctx.lineTo(x + 32, this.groundY - 50 + floatY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.55)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cascading glowing waterfall pouring off spire ledge into the clouds
        const wfGrad = ctx.createLinearGradient(x, this.groundY - 190, x, this.groundY);
        wfGrad.addColorStop(0, 'rgba(186, 230, 253, 0.55)');
        wfGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
        ctx.fillStyle = wfGrad;
        ctx.fillRect(x - 9, this.groundY - 185 + floatY, 18, 185 - floatY);
        // Animated water shimmer lines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        const dropY = ((anim * 95 + sx) % 160);
        ctx.fillRect(x - 4, this.groundY - 180 + dropY, 3, 24);
        ctx.fillRect(x + 2, this.groundY - 180 + ((dropY + 80) % 160), 2, 18);

        // Orbiting crystal halo ring
        ctx.strokeStyle = 'rgba(165, 243, 252, 0.48)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(x, this.groundY - 220 + floatY, 44, 11, -0.14, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (stageIndex === 3) {
      // Prime Kindergarten: Sheer Violet Canyon Walls Dotted with Gem Exit Holes + Weathered Injector Drills
      ctx.save();
      // Tiered Canyon Cliffs with Carved Gem Exit Holes
      ctx.fillStyle = '#240b47';
      ctx.beginPath();
      ctx.moveTo(-200, this.groundY);
      ctx.lineTo(-200, this.groundY - 255);
      for (let cx = -120; cx < 2800; cx += 180) {
        const px = cx - farOffset;
        const h = 230 + Math.sin(cx * 0.015) * 42;
        ctx.lineTo(px, this.groundY - h);
      }
      ctx.lineTo(this.canvasWidth + 200, this.groundY);
      ctx.closePath();
      ctx.fill();

      // Iconic Kindergarten Wall Exit Holes (humanoid / quartz birth hollows carved into sheer rock!)
      for (let hx = 120; hx < 2500; hx += 165) {
        const x = hx - farOffset;
        const hy = this.groundY - 70 - ((hx * 37) % 130);
        ctx.fillStyle = '#090314';
        ctx.beginPath();
        ctx.arc(x, hy - 20, 9, 0, Math.PI * 2);
        ctx.fillRect(x - 11, hy - 12, 22, 24);
        ctx.fillRect(x - 16, hy - 11, 32, 7);
        ctx.fillRect(x - 9, hy + 11, 7, 14);
        ctx.fillRect(x + 2, hy + 11, 7, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Detailed Towering Homeworld Injector Drills
      for (const drillX of [310, 790, 1290, 1780, 2240]) {
        const dx = drillX - bgOffset;
        // Jointed tripod legs
        ctx.strokeStyle = '#4c1d95';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(dx - 16, this.groundY - 125); ctx.lineTo(dx - 54, this.groundY - 62); ctx.lineTo(dx - 44, this.groundY);
        ctx.moveTo(dx + 16, this.groundY - 125); ctx.lineTo(dx + 54, this.groundY - 62); ctx.lineTo(dx + 44, this.groundY);
        ctx.stroke();
        // Central iron drill shaft & spiral auger
        ctx.fillStyle = '#3b0764';
        ctx.fillRect(dx - 10, this.groundY - 130, 20, 130);
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.moveTo(dx - 24, this.groundY - 140);
        ctx.lineTo(dx + 24, this.groundY - 140);
        ctx.lineTo(dx, this.groundY - 8);
        ctx.closePath();
        ctx.fill();
        // Faceted glowing crystal bio-poison reservoir on top
        const glowA = 0.45 + 0.22 * Math.sin(anim * 2.2 + drillX);
        ctx.fillStyle = `rgba(216, 180, 254, ${glowA})`;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dx, this.groundY - 275);
        ctx.lineTo(dx + 26, this.groundY - 232);
        ctx.lineTo(dx + 22, this.groundY - 150);
        ctx.lineTo(dx - 22, this.groundY - 150);
        ctx.lineTo(dx - 26, this.groundY - 232);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Inner specular facet highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.beginPath();
        ctx.moveTo(dx, this.groundY - 270);
        ctx.lineTo(dx + 10, this.groundY - 232);
        ctx.lineTo(dx + 8, this.groundY - 154);
        ctx.lineTo(dx - 4, this.groundY - 154);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (stageIndex === 4) {
      // Earth's Mantle Core: Subterranean Stalactites, Cascading Magma Rivers & The Colossal Pulsing Cluster Bubble!
      ctx.save();
      // Colossal Cluster Bubble Pulsing in the Abyss
      const clX = 960 - farOffset;
      const clY = this.groundY - 165;
      const clPulse = 1 + Math.sin(anim * 1.8) * 0.035;
      const clG = ctx.createRadialGradient(clX, clY, 24, clX, clY, 185 * clPulse);
      clG.addColorStop(0, 'rgba(254, 240, 138, 0.50)');
      clG.addColorStop(0.45, 'rgba(244, 114, 182, 0.32)');
      clG.addColorStop(0.82, 'rgba(234, 88, 12, 0.22)');
      clG.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = clG;
      ctx.beginPath();
      ctx.arc(clX, clY, 185 * clPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(254, 215, 170, 0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(clX, clY, 128 * clPulse, 0, Math.PI * 2);
      ctx.stroke();
      // Swirling multicolored gem-shard constellations sealed inside the Cluster bubble
      const shardCols = ['#fb7185', '#38bdf8', '#fde047', '#c084fc', '#4ade80'];
      for (let s = 0; s < 14; s++) {
        const ang = anim * 0.35 + (s * Math.PI * 2) / 14;
        const rad = 32 + (s % 4) * 22;
        ctx.fillStyle = shardCols[s % shardCols.length];
        ctx.globalAlpha = 0.52;
        this.drawDiamondInsignia(ctx, clX + Math.cos(ang) * rad, clY + Math.sin(ang) * rad, 5 + (s % 3) * 2);
      }
      ctx.globalAlpha = 1;

      // Volcanic Cavern Stalactites hanging from ceiling + Magma Falls
      ctx.fillStyle = '#290707';
      for (let sx = 60; sx < 2600; sx += 155) {
        const x = sx - bgOffset;
        const len = 75 + ((sx * 17) % 85);
        ctx.beginPath();
        ctx.moveTo(x - 36, 0); ctx.lineTo(x + 36, 0); ctx.lineTo(x, len);
        ctx.closePath();
        ctx.fill();
      }
      // Rising Geothermal Magma Spires & Pouring Lava Columns
      for (const gx of [430, 1120, 1780, 2320]) {
        const x = gx - bgOffset;
        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.moveTo(x - 58, this.groundY);
        ctx.lineTo(x - 20, this.groundY - 210);
        ctx.lineTo(x + 20, this.groundY - 210);
        ctx.lineTo(x + 58, this.groundY);
        ctx.closePath();
        ctx.fill();
        // Glowing lava fissure streak
        ctx.fillStyle = 'rgba(251, 146, 60, 0.55)';
        ctx.fillRect(x - 5, this.groundY - 200, 10, 200);
      }
      ctx.restore();
    } else if (stageIndex === 5) {
      // Bismuth's Forge: Vaulted Smelter Arches, Pouring Lava Waterfalls, Hanging Iron Chains & Weapon Silhouettes
      ctx.save();
      // Vaulted Obsidian Forge Arches & Roaring Furnaces
      for (const fx of [420, 1080, 1740, 2320]) {
        const x = fx - bgOffset;
        // Heavy vaulted masonry arch
        ctx.fillStyle = '#3b1006';
        ctx.fillRect(x - 75, this.groundY - 240, 150, 240);
        // Blazing circular smelter hearth inside
        const fPulse = 0.65 + 0.25 * Math.sin(anim * 3.8 + fx);
        const fGrad = ctx.createRadialGradient(x, this.groundY - 115, 8, x, this.groundY - 115, 58);
        fGrad.addColorStop(0, `rgba(254, 249, 195, ${fPulse})`);
        fGrad.addColorStop(0.5, `rgba(249, 115, 22, ${fPulse * 0.85})`);
        fGrad.addColorStop(1, 'rgba(124, 45, 18, 0)');
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(x, this.groundY - 115, 58, 0, Math.PI * 2);
        ctx.fill();
        // Vertical pouring molten lava waterfall stream
        ctx.fillStyle = 'rgba(251, 146, 60, 0.65)';
        ctx.fillRect(x - 10, 0, 20, this.groundY);
        ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
        ctx.fillRect(x - 4, 0, 8, this.groundY);
        // Heavy swaying iron chains beside furnace
        const sway = Math.sin(anim * 1.4 + fx) * 6;
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 4;
        for (const side of [-52, 52]) {
          ctx.beginPath();
          ctx.moveTo(x + side, 0);
          ctx.quadraticCurveTo(x + side + sway, 135, x + side + sway * 1.3, 240);
          ctx.stroke();
          // Chain links
          for (let cy = 18; cy < 235; cy += 22) {
            ctx.beginPath();
            ctx.ellipse(x + side + sway * (cy / 240), cy, 4, 7, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    } else if (stageIndex === 6) {
      // Frozen North: Multi-Ribbon Undulating Aurora Borealis & Crystalline Ice Cathedral Spires
      ctx.save();
      // Multi-ribbon luminous Aurora curtains
      const ribbons = [
        { y: 78, col: 'rgba(16, 185, 129, 0.30)', phase: 0 },
        { y: 112, col: 'rgba(56, 189, 248, 0.25)', phase: 1.8 },
        { y: 54, col: 'rgba(167, 139, 250, 0.20)', phase: 3.4 }
      ];
      for (const r of ribbons) {
        const w1 = Math.sin(anim * 1.1 + r.phase) * 26;
        const w2 = Math.cos(anim * 0.9 + r.phase) * 24;
        ctx.fillStyle = r.col;
        ctx.beginPath();
        ctx.moveTo(0, r.y);
        ctx.bezierCurveTo(this.canvasWidth * 0.33, r.y - 38 + w1, this.canvasWidth * 0.66, r.y + 42 + w2, this.canvasWidth, r.y - 12);
        ctx.lineTo(this.canvasWidth, r.y + 72);
        ctx.bezierCurveTo(this.canvasWidth * 0.66, r.y + 98 + w2, this.canvasWidth * 0.33, r.y + 22 + w1, 0, r.y + 68);
        ctx.closePath();
        ctx.fill();
      }
      // Far sunlit glacial mountain range
      ctx.fillStyle = 'rgba(12, 74, 110, 0.50)';
      for (const px of [240, 680, 1180, 1720, 2280]) {
        const x = px - farOffset;
        ctx.beginPath();
        ctx.moveTo(x - 135, this.groundY);
        ctx.lineTo(x, this.groundY - 265);
        ctx.lineTo(x + 135, this.groundY);
        ctx.closePath();
        ctx.fill();
        // Lit ice facet on right slope
        ctx.fillStyle = 'rgba(186, 230, 253, 0.24)';
        ctx.beginPath();
        ctx.moveTo(x, this.groundY - 265);
        ctx.lineTo(x + 135, this.groundY);
        ctx.lineTo(x + 18, this.groundY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(12, 74, 110, 0.50)';
      }
      // Closer translucent crystalline Ice Cathedral Spires
      for (const sx of [380, 960, 1580, 2140]) {
        const x = sx - bgOffset;
        ctx.fillStyle = 'rgba(125, 211, 252, 0.24)';
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.50)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 34, this.groundY);
        ctx.lineTo(x - 16, this.groundY - 175);
        ctx.lineTo(x, this.groundY - 215);
        ctx.lineTo(x + 18, this.groundY - 165);
        ctx.lineTo(x + 34, this.groundY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    } else if (stageIndex === 7) {
      // Pink Diamond's Zoo: Ringed Rose-Gold Gas Giant Planet, Luminous Bio-Domes with Pink Trees & Orbital Arches
      ctx.save();
      // Giant Ringed Rose-Cosmos Planet
      const plX = 720 - farOffset * 0.45;
      const plY = 148;
      const plG = ctx.createRadialGradient(plX - 24, plY - 22, 12, plX, plY, 92);
      plG.addColorStop(0, '#fbcfe8');
      plG.addColorStop(0.55, '#db2777');
      plG.addColorStop(1, '#4c0519');
      ctx.fillStyle = plG;
      ctx.beginPath();
      ctx.arc(plX, plY, 82, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 242, 248, 0.52)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(plX, plY + 4, 148, 24, -0.22, 0, Math.PI * 2);
      ctx.stroke();

      // Gleaming Rose-Quartz Habitat Bio-Domes enclosing Pink Blossom Trees
      for (const zx of [460, 1180, 1920]) {
        const x = zx - bgOffset;
        const domeG = ctx.createRadialGradient(x - 20, this.groundY - 120, 10, x, this.groundY - 60, 120);
        domeG.addColorStop(0, 'rgba(253, 242, 248, 0.36)');
        domeG.addColorStop(0.6, 'rgba(244, 114, 182, 0.22)');
        domeG.addColorStop(1, 'rgba(131, 24, 67, 0.35)');
        ctx.fillStyle = domeG;
        ctx.strokeStyle = 'rgba(251, 207, 232, 0.60)';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(x, this.groundY, 115, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Tiny pink sanctuary cherry-blossom trees inside the dome
        ctx.fillStyle = '#831843';
        ctx.fillRect(x - 36, this.groundY - 52, 7, 52);
        ctx.fillRect(x + 22, this.groundY - 64, 8, 64);
        ctx.fillStyle = 'rgba(249, 168, 212, 0.72)';
        ctx.beginPath();
        ctx.arc(x - 32, this.groundY - 62, 24, 0, Math.PI * 2);
        ctx.arc(x + 26, this.groundY - 76, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (stageIndex === 8) {
      // Homeworld Abduction Shore: Looming Colossal Emerald Hand Warship Descending Through Storm Clouds
      ctx.save();
      const shipX = 820 - bgOffset * 0.75;
      const shipY = 148 + Math.sin(anim * 1.1) * 6;
      // Pulsing emerald tractor-beam cone sweeping down onto the shore
      const beamAlpha = 0.16 + 0.08 * Math.sin(anim * 2.8);
      const trG = ctx.createLinearGradient(shipX, shipY + 40, shipX, this.groundY);
      trG.addColorStop(0, `rgba(52, 211, 153, ${beamAlpha * 1.6})`);
      trG.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
      ctx.fillStyle = trG;
      ctx.beginPath();
      ctx.moveTo(shipX - 55, shipY + 35);
      ctx.lineTo(shipX + 55, shipY + 35);
      ctx.lineTo(shipX + 210, this.groundY);
      ctx.lineTo(shipX - 210, this.groundY);
      ctx.closePath();
      ctx.fill();

      // Sculpted Emerald Hand Warship (Palm + 5 Articulated Fingers with Neon Conduit Seams)
      const hullG = ctx.createLinearGradient(shipX - 180, shipY - 110, shipX + 180, shipY + 80);
      hullG.addColorStop(0, '#10b981');
      hullG.addColorStop(0.5, '#047857');
      hullG.addColorStop(1, '#064e3b');
      ctx.fillStyle = hullG;
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 2.5;
      // Palm & forearm hull
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(shipX - 135, shipY - 34, 245, 92, 26) : ctx.rect(shipX - 135, shipY - 34, 245, 92);
      ctx.fill();
      ctx.stroke();
      // Five colossal emerald warship fingers jutting forward/upward
      const fingers = [
        { x: -115, y: -118, w: 32, h: 98 },
        { x: -62, y: -142, w: 34, h: 122 },
        { x: -6, y: -148, w: 34, h: 128 },
        { x: 50, y: -134, w: 32, h: 112 },
        { x: 90, y: -24, w: 58, h: 32 }
      ];
      for (const fg of fingers) {
        ctx.fillStyle = hullG;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(shipX + fg.x, shipY + fg.y, fg.w, fg.h, 12) : ctx.rect(shipX + fg.x, shipY + fg.y, fg.w, fg.h);
        ctx.fill();
        ctx.stroke();
        // Glowing cyan bridge/conduit line
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(shipX + fg.x + fg.w * 0.42, shipY + fg.y + 12, 4, Math.max(12, fg.h - 24));
      }
      // Central emerald bridge diamond core
      ctx.fillStyle = '#ecfdf5';
      this.drawDiamondInsignia(ctx, shipX - 12, shipY + 12, 16);
      ctx.restore();
    } else if (stageIndex === 9) {
      // Homeworld Trial & Courtroom: Monumental Jade Columns, Glowing Yellow & Blue Diamond Stained Crests & Floating Palanquins
      ctx.save();
      for (const cx of [460, 1080, 1720, 2320]) {
        const x = cx - bgOffset;
        // Towering obsidian-jade fluted pillar
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(x - 42, 0, 84, this.groundY);
        ctx.fillStyle = 'rgba(110, 231, 183, 0.16)';
        ctx.fillRect(x - 24, 0, 10, this.groundY);
        ctx.fillRect(x + 14, 0, 10, this.groundY);
        // Tall stained-glass Diamond Authority crest window between columns
        const wx = x + 310;
        ctx.fillStyle = 'rgba(2, 44, 34, 0.72)';
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(wx, 42);
        ctx.lineTo(wx + 72, 185);
        ctx.lineTo(wx, 330);
        ctx.lineTo(wx - 72, 185);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Yellow & Blue Diamond luminous inner panes
        ctx.fillStyle = 'rgba(250, 204, 21, 0.42)';
        this.drawDiamondInsignia(ctx, wx - 26, 185, 22);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
        this.drawDiamondInsignia(ctx, wx + 26, 185, 22);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        this.drawDiamondInsignia(ctx, wx, 134, 20);
      }
      ctx.restore();
    } else if (stageIndex === 10) {
      // White Diamond's Citadel: Towering Monochrome-Prismatic Mecha Head Silhouette, Sweeping Blinding God-Rays & Floating Monoliths
      ctx.save();
      const mechaX = 760 - bgOffset * 0.55;
      const mechaY = 175;
      const pulse = 0.28 + 0.12 * Math.sin(anim * 1.9);

      // Sweeping Cathedral God-Rays radiating from White Diamond's Crown
      for (let i = -5; i <= 5; i++) {
        const ang = i * 0.22 + Math.sin(anim * 0.4) * 0.04;
        ctx.fillStyle = i % 2 === 0 ? `rgba(255, 255, 255, ${pulse * 0.75})` : `rgba(254, 240, 138, ${pulse * 0.48})`;
        ctx.beginPath();
        ctx.moveTo(mechaX, mechaY);
        ctx.lineTo(mechaX + Math.sin(ang - 0.05) * 680, mechaY - Math.cos(ang - 0.05) * 480);
        ctx.lineTo(mechaX + Math.sin(ang + 0.05) * 680, mechaY - Math.cos(ang + 0.05) * 480);
        ctx.closePath();
        ctx.fill();
      }

      // Towering White Diamond Head-Ship Silhouette (Iconic 5-Spiked Star Hair + Glowing Forehead Diamond)
      const headG = ctx.createRadialGradient(mechaX, mechaY, 18, mechaX, mechaY, 190);
      headG.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      headG.addColorStop(0.55, 'rgba(226, 232, 240, 0.52)');
      headG.addColorStop(1, 'rgba(148, 163, 184, 0.08)');
      ctx.fillStyle = headG;
      // 5 Iconic towering star-crown hair spikes
      ctx.beginPath();
      ctx.moveTo(mechaX - 95, mechaY + 80);
      ctx.lineTo(mechaX - 185, mechaY + 12);
      ctx.lineTo(mechaX - 115, mechaY - 30);
      ctx.lineTo(mechaX - 140, mechaY - 120);
      ctx.lineTo(mechaX - 48, mechaY - 76);
      ctx.lineTo(mechaX, mechaY - 165);
      ctx.lineTo(mechaX + 48, mechaY - 76);
      ctx.lineTo(mechaX + 140, mechaY - 120);
      ctx.lineTo(mechaX + 115, mechaY - 30);
      ctx.lineTo(mechaX + 185, mechaY + 12);
      ctx.lineTo(mechaX + 95, mechaY + 80);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Monumental Mecha Torso & Glowing Forehead Diamond Core
      ctx.fillStyle = 'rgba(248, 250, 252, 0.55)';
      ctx.beginPath();
      ctx.moveTo(mechaX - 115, this.groundY);
      ctx.lineTo(mechaX - 68, mechaY + 62);
      ctx.lineTo(mechaX + 68, mechaY + 62);
      ctx.lineTo(mechaX + 115, this.groundY);
      ctx.closePath();
      ctx.fill();
      // Forehead radiant White Diamond jewel
      ctx.fillStyle = '#ffffff';
      this.drawDiamondInsignia(ctx, mechaX, mechaY - 22, 24);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mechaX, mechaY - 22, 34 + Math.sin(anim * 3) * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Floating Monochrome Citadel Obelisks
      for (const ox of [240, 1360, 1880, 2360]) {
        const x = ox - bgOffset;
        const fy = Math.sin(anim * 1.2 + ox) * 8;
        ctx.fillStyle = 'rgba(241, 245, 249, 0.35)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x, this.groundY - 235 + fy);
        ctx.lineTo(x + 28, this.groundY - 125 + fy);
        ctx.lineTo(x, this.groundY - 35 + fy);
        ctx.lineTo(x - 28, this.groundY - 125 + fy);
        ctx.closePath();
        ctx.fill();
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

        // Translucent rising warp-stream beam above active warp dais
        const beamG = ctx.createLinearGradient(padX, this.groundY - 190, padX, this.groundY - 2);
        beamG.addColorStop(0, 'rgba(56, 189, 248, 0)');
        beamG.addColorStop(1, `rgba(103, 232, 249, ${warpPulse * 0.42})`);
        ctx.fillStyle = beamG;
        ctx.fillRect(padX - 28, this.groundY - 190, 56, 188);

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

      // Prismatic Rainbow Shimmer & Diamond Floor Facet Seams along the grand platform
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      for (let gx = bleedL; gx < bleedL + bleedW; gx += 120) {
        ctx.beginPath();
        ctx.moveTo(gx, this.groundY);
        ctx.lineTo(gx - 42, this.groundY + 75);
        ctx.stroke();
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bleedL, this.groundY - 6, bleedW, 8);
      for (let dx = 350; dx < this.stageWidth; dx += 500) {
        ctx.fillStyle = '#fde047';
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
