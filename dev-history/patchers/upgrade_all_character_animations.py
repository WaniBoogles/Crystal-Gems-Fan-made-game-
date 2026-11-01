import re

with open('game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Safe canvas dimensions in StevenUniverseGame
old_canvas_dims = """    const cw = this.canvas ? this.canvas.width : 1280;
    const ch = this.canvas ? this.canvas.height : 720;"""

new_canvas_dims = """    const cw = (this.canvas && typeof this.canvas.width === 'number' && !isNaN(this.canvas.width) && this.canvas.width > 0) ? this.canvas.width : 1280;
    const ch = (this.canvas && typeof this.canvas.height === 'number' && !isNaN(this.canvas.height) && this.canvas.height > 0) ? this.canvas.height : 720;"""

if old_canvas_dims in code:
    code = code.replace(old_canvas_dims, new_canvas_dims, 1)
    print("1. Updated canvas dimensions in StevenUniverseGame")

# 2. Safe groundY in EnemyManager constructor
old_em_ctor = """  constructor(groundY, stageWidth = 2600) {
    this.groundY = groundY;"""

new_em_ctor = """  constructor(groundY, stageWidth = 2600) {
    this.groundY = (typeof groundY === 'number' && !isNaN(groundY) && groundY > 0) ? groundY : 600;"""

if old_em_ctor in code:
    code = code.replace(old_em_ctor, new_em_ctor, 1)
    print("2. Updated safe groundY in EnemyManager constructor")

# 3. Upgrade Steven's action animations in drawSteven
old_steven_action = """    // Action Poses: Punching Arm Thrust
    if (actionType === 'punch') {
      const punchReach = Math.sin(animP * Math.PI) * 22;
      ctx.fillStyle = shirtColor;
      ctx.fillRect(8, -44 + bob, 10 + punchReach, 9);
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(18 + punchReach, -40 + bob, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      this.drawMiniStar(ctx, 24 + punchReach, -40 + bob, 5.5);
    }

    // Action Poses: Throw follow-through
    const isShieldThrown = (actionType === 'throw' && animP > 0.3);
    if (isShieldThrown) {
      // Reaching forward follow-through
      ctx.fillStyle = shirtColor;
      ctx.fillRect(8, -44 + bob, 16, 8);
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(24, -40 + bob, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Rose Quartz Shield held on left forearm
      const shieldX = (actionType === 'punch') ? 10 : (actionType === 'shield' ? 6 : 14);
      const shieldY = -34 + bob;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 96, 151, 0.88)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(shieldX, shieldY, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(shieldX, shieldY, 8, 0, Math.PI * 1.6);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const tx = shieldX + Math.cos(angle) * 14;
        const ty = shieldY + Math.sin(angle) * 14;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }"""

new_steven_action = """    // Dynamic 3-Hit Combo Arm & Shield Animations
    const combo = this.attackCombo;
    const isShieldThrown = (actionType === 'throw' && animP > 0.28);
    const isShieldStance = (actionType === 'shield');

    if (actionType === 'punch') {
      if (combo === 0) {
        // Hit 1: Star Punch (Lead right fist thrusts out)
        const punchReach = Math.sin(animP * Math.PI) * 24;
        ctx.fillStyle = shirtColor;
        ctx.fillRect(8, -44 + bob, 10 + punchReach, 9);
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.arc(18 + punchReach, -40 + bob, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd166';
        this.drawMiniStar(ctx, 24 + punchReach, -40 + bob, 6);
      } else if (combo === 1) {
        // Hit 2: Crystalline Shield Swipe (Left forearm swings shield across chest)
        const swipeArc = Math.sin(animP * Math.PI) * 28;
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-2, -46 + bob, 14, 9);
        // Swinging shield
        ctx.save();
        ctx.translate(14 + swipeArc, -40 + bob);
        ctx.rotate(0.3 + Math.sin(animP * Math.PI) * 0.8);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.9)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffd166';
        this.drawMiniStar(ctx, 0, 0, 7);
        ctx.restore();
      } else {
        // Hit 3: Shield Uppercut Finisher! (Both arms lift shield high overhead)
        const liftReach = Math.sin(animP * Math.PI) * 32;
        ctx.fillStyle = shirtColor;
        ctx.fillRect(4, -48 + bob - liftReach * 0.5, 12, 10);
        ctx.save();
        ctx.translate(16, -55 + bob - liftReach * 0.6);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.95)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, 0, 9);
        ctx.restore();
      }
    } else if (isShieldThrown) {
      // Shield Throw follow-through
      ctx.fillStyle = shirtColor;
      ctx.fillRect(8, -44 + bob, 18, 8);
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(26, -40 + bob, 6.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal shield held on forearm
      const shieldX = isShieldStance ? 8 : 14;
      const shieldY = -34 + bob;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 96, 151, 0.88)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(shieldX, shieldY, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(shieldX, shieldY, 8, 0, Math.PI * 1.6);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const tx = shieldX + Math.cos(angle) * 14;
        const ty = shieldY + Math.sin(angle) * 14;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }"""

if old_steven_action in code:
    code = code.replace(old_steven_action, new_steven_action, 1)
    print("3. Upgraded Steven 3-hit combo and shield actions in drawSteven")

# 4. Upgrade Garnet's actions in drawGarnet
old_garnet_punch = """    if (isPunch) {
      const punchReach = Math.sin(animP * Math.PI) * 26;
      gx += punchReach;
    }"""

new_garnet_punch = """    const combo = this.attackCombo;
    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Left Ruby Gauntlet Straight Jab
        const punchReach = Math.sin(animP * Math.PI) * 28;
        gx += punchReach;
      } else if (combo === 1) {
        // Hit 2: Right Sapphire Gauntlet Hook
        const punchReach = Math.sin(animP * Math.PI) * 24;
        gx += punchReach;
        gy += -6;
      } else {
        // Hit 3: Seismic Double Gauntlet Hammer Smash!
        const punchReach = Math.sin(animP * Math.PI) * 34;
        gx += punchReach;
        gy += Math.sin(animP * Math.PI) * 12;
      }
    }"""

if old_garnet_punch in code:
    code = code.replace(old_garnet_punch, new_garnet_punch, 1)
    print("4. Upgraded Garnet punch actions in drawGarnet")

# 5. Upgrade Connie's actions in drawConnie
old_connie_action = """    const swordSwing = isPunch ? Math.sin(animP * Math.PI) * 36 : (isSpecial ? 24 : 0);
    const swordX = 14 + swordSwing * 0.4;
    const swordY = -48 + bob - (isPunch ? 6 : 0);

    // Connie's Arms (Jumpsuit Sleeves & Skin Hands holding the grip)
    ctx.fillStyle = '#1e40af'; // Blue jumpsuit sleeve
    ctx.fillRect(2, -54 + bob, 14, 8);
    ctx.fillStyle = '#a16207'; // Warm brown hand
    ctx.beginPath();
    ctx.arc(swordX - 2, swordY + 6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(swordX, swordY);
    if (isPunch) {
      ctx.rotate(0.35 + Math.sin(animP * Math.PI) * 0.85);
    } else if (isSpecial) {
      ctx.rotate(-0.4);
    } else if (isSkill) {
      ctx.rotate(0.8);
    }"""

new_connie_action = """    const combo = this.attackCombo;
    let swordSwing = 0;
    let swordAngle = 0.2;

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Rapier Lunge Thrust
        const reach = Math.sin(animP * Math.PI) * 34;
        swordSwing = reach;
        swordAngle = 0.1;
      } else if (combo === 1) {
        // Hit 2: Horizontal Rose-Crystal Crescent Slash
        const swing = Math.sin(animP * Math.PI) * 28;
        swordSwing = swing;
        swordAngle = -0.5 + Math.sin(animP * Math.PI) * 1.4;
      } else {
        // Hit 3: Aerial Knight's Cleave Finisher!
        const leap = Math.sin(animP * Math.PI) * 40;
        swordSwing = leap;
        swordAngle = 0.8 + Math.sin(animP * Math.PI) * 1.1;
      }
    } else if (isSpecial) {
      swordAngle = -0.4;
    } else if (isSkill) {
      swordAngle = 0.9;
    }

    const swordX = 14 + swordSwing * 0.45;
    const swordY = -48 + bob - (isPunch ? 6 : 0);

    // Connie's Arms (Jumpsuit Sleeves & Skin Hands holding the grip)
    ctx.fillStyle = '#1e40af'; // Blue jumpsuit sleeve
    ctx.fillRect(2, -54 + bob, 14, 8);
    ctx.fillStyle = '#a16207'; // Warm brown hand
    ctx.beginPath();
    ctx.arc(swordX - 2, swordY + 6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(swordX, swordY);
    ctx.rotate(swordAngle);"""

if old_connie_action in code:
    code = code.replace(old_connie_action, new_connie_action, 1)
    print("5. Upgraded Connie 3-hit combo actions in drawConnie")

# 6. Upgrade Jasper's actions in drawJasper
old_jasper_punch = """    } else if (isPunch) {
      // Heavy Gut Punch / Overhead Hammer Fist
      const punchReach = Math.sin(animP * Math.PI) * 32;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(16, -62 + bob, 16 + punchReach, 14);

      // Huge clenched fist
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.arc(28 + punchReach, -55 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      this.drawMiniStar(ctx, 36 + punchReach, -55 + bob, 7);
    }"""

new_jasper_punch = """    } else if (isPunch) {
      const combo = this.attackCombo;
      if (combo === 0) {
        // Hit 1: Ferocious Gut Punch
        const punchReach = Math.sin(animP * Math.PI) * 30;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(16, -62 + bob, 16 + punchReach, 14);
        ctx.fillStyle = '#c2410c';
        ctx.beginPath();
        ctx.arc(28 + punchReach, -55 + bob, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        this.drawMiniStar(ctx, 36 + punchReach, -55 + bob, 7);
      } else if (combo === 1) {
        // Hit 2: Overhead Hammer Fist Slam
        const slamReach = Math.sin(animP * Math.PI) * 26;
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(12, -78 + bob + slamReach, 16, 16);
        ctx.beginPath();
        ctx.arc(24, -70 + bob + slamReach, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ea580c';
        this.drawDiamondInsignia(ctx, 24, -70 + bob + slamReach, 8);
      } else {
        // Hit 3: Ground-Rupturing Beta Haymaker!
        const haymakerReach = Math.sin(animP * Math.PI) * 42;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(16, -58 + bob, 20 + haymakerReach, 16);
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(32 + haymakerReach, -50 + bob, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        this.drawDiamondInsignia(ctx, 42 + haymakerReach, -50 + bob, 10);
      }
    }"""

if old_jasper_punch in code:
    code = code.replace(old_jasper_punch, new_jasper_punch, 1)
    print("6. Upgraded Jasper punch combo actions in drawJasper")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: Upgraded all character action animations in game.js!")
