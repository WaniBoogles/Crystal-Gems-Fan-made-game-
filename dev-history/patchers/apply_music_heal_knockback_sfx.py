import sys

with open('game.js', 'r') as f:
    code = f.read()

# -------------------------------------------------------------
# 1. AudioEngine: Add warpPad, weaponSummon, bubblePop, shieldRetract
# -------------------------------------------------------------
t1 = """        case 'switch':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, t);
          osc.frequency.exponentialRampToValueAtTime(840, t + 0.12);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
          break;"""

r1 = """        case 'switch':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, t);
          osc.frequency.exponentialRampToValueAtTime(840, t + 0.12);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
          break;

        case 'warpPad':
          // Iconic Crystal Gems Warp Pad Chime (Ascending crystalline harmonic sequence)
          [440.00, 554.37, 659.25, 880.00, 1108.73, 1318.51, 1760.00].forEach((freq, idx) => {
            const wOsc = this.ctx.createOscillator();
            const wGain = this.ctx.createGain();
            wOsc.type = 'sine';
            wOsc.frequency.setValueAtTime(freq, t + idx * 0.045);
            wGain.gain.setValueAtTime(0.18, t + idx * 0.045);
            wGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.045 + 0.38);
            wOsc.connect(wGain);
            wGain.connect(this.ctx.destination);
            wOsc.start(t + idx * 0.045);
            wOsc.stop(t + idx * 0.045 + 0.38);
          });
          return;

        case 'weaponSummon':
        case 'gemWeaponSummon':
          // Gem Weapon Manifestation (Gleaming metallic shine with crystalline ring)
          const mOsc = this.ctx.createOscillator();
          const mGain = this.ctx.createGain();
          mOsc.type = 'triangle';
          mOsc.frequency.setValueAtTime(880, t);
          mOsc.frequency.exponentialRampToValueAtTime(2200, t + 0.08);
          mOsc.frequency.exponentialRampToValueAtTime(1320, t + 0.28);
          mGain.gain.setValueAtTime(0.24, t);
          mGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
          mOsc.connect(mGain);
          mGain.connect(this.ctx.destination);
          mOsc.start(t);
          mOsc.stop(t + 0.32);

          const mOsc2 = this.ctx.createOscillator();
          const mGain2 = this.ctx.createGain();
          mOsc2.type = 'sawtooth';
          mOsc2.frequency.setValueAtTime(1760, t + 0.04);
          mOsc2.frequency.exponentialRampToValueAtTime(3520, t + 0.16);
          mGain2.gain.setValueAtTime(0.12, t + 0.04);
          mGain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          mOsc2.connect(mGain2);
          mGain2.connect(this.ctx.destination);
          mOsc2.start(t + 0.04);
          mOsc2.stop(t + 0.25);
          break;

        case 'bubblePop':
          // Authentic Steven Universe Bubble Pop (Acoustic suction ramp + crisp burst pop)
          const bPopOsc = this.ctx.createOscillator();
          const bPopGain = this.ctx.createGain();
          bPopOsc.type = 'sine';
          bPopOsc.frequency.setValueAtTime(320, t);
          bPopOsc.frequency.exponentialRampToValueAtTime(1600, t + 0.04);
          bPopOsc.frequency.exponentialRampToValueAtTime(540, t + 0.09);
          bPopGain.gain.setValueAtTime(0.35, t);
          bPopGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
          bPopOsc.connect(bPopGain);
          bPopGain.connect(this.ctx.destination);
          bPopOsc.start(t);
          bPopOsc.stop(t + 0.11);
          break;

        case 'shieldRetract':
          // Shield De-manifestation / Retraction (Descending crystalline harmonic collapse)
          const sRetOsc = this.ctx.createOscillator();
          const sRetGain = this.ctx.createGain();
          sRetOsc.type = 'sine';
          sRetOsc.frequency.setValueAtTime(1500, t);
          sRetOsc.frequency.exponentialRampToValueAtTime(380, t + 0.18);
          sRetGain.gain.setValueAtTime(0.22, t);
          sRetGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          sRetOsc.connect(sRetGain);
          sRetGain.connect(this.ctx.destination);
          sRetOsc.start(t);
          sRetOsc.stop(t + 0.22);
          break;"""

assert t1 in code, "Target 1 (SFX) not found!"
code = code.replace(t1, r1, 1)

# -------------------------------------------------------------
# 2. AudioEngine: Authentic 10-Track Episode Soundtrack Engine
# -------------------------------------------------------------
t2 = """  playMusic(trackName) {
    this.currentTrack = trackName;
    if (!this.musicEnabled) return;
    this.init();
    this.stopMusic();

    const notesBattle = [
      349.23, 440.0, 523.25, 659.25, 392.0, 493.88, 587.33, 783.99,
      329.63, 392.0, 493.88, 659.25, 440.0, 523.25, 659.25, 880.0
    ];
    const bassBattle = [174.61, 196.0, 164.81, 220.0];

    const notesBoss = [
      220.0, 261.63, 329.63, 440.0, 207.65, 246.94, 311.13, 415.3,
      196.0, 233.08, 293.66, 392.0, 185.0, 220.0, 277.18, 369.99
    ];

    const notesFusion = [
      523.25, 659.25, 783.99, 1046.5, 587.33, 739.99, 880.0, 1174.66,
      659.25, 830.61, 987.77, 1318.5, 783.99, 987.77, 1174.66, 1567.98
    ];

    const tempo = trackName === 'boss' ? 140 : (trackName === 'fusion' ? 150 : 126);
    const intervalMs = (60 / tempo) * 250;

    this.musicBeat = 0;
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicEnabled) return;
      try {
        const t = this.ctx.currentTime;
        let notes = notesBattle;
        if (this.currentTrack === 'boss') notes = notesBoss;
        if (this.currentTrack === 'fusion') notes = notesFusion;

        const noteIdx = this.musicBeat % notes.length;
        const freq = notes[noteIdx];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = this.currentTrack === 'fusion' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.045, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);

        if (this.musicBeat % 4 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          const bFreq = bassBattle[Math.floor((this.musicBeat / 4) % bassBattle.length)];
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bFreq, t);
          bassGain.gain.setValueAtTime(0.08, t);
          bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(t);
          bassOsc.stop(t + 0.35);
        }

        this.musicBeat++;
      } catch (err) {}
    }, intervalMs);
  }"""

r2 = """  playStageMusic(stageIndex = 1, isBoss = false) {
    if (!this.musicEnabled) return;
    this.init();
    this.stopMusic();

    const stageNum = Math.max(1, Math.min(10, parseInt(stageIndex, 10) || 1));
    this.currentTrack = isBoss ? `boss_${stageNum}` : `stage_${stageNum}`;

    // Authentic Steven Universe 10-Episode Atmospheric Synthesizer Profiles
    const stageProfiles = {
      // Ep 1: Beach City Shore - Upbeat, heroic Crystal Gems synth-rock
      1: {
        tempo: 128,
        leadType: 'triangle',
        bassType: 'triangle',
        melody: [349.23, 440.0, 523.25, 659.25, 392.0, 493.88, 587.33, 783.99, 329.63, 392.0, 493.88, 659.25, 440.0, 523.25, 659.25, 880.0],
        bass: [174.61, 196.0, 164.81, 220.0],
        harmonics: [523.25, 659.25, 783.99, 880.0]
      },
      // Ep 2: Ancient Spire - Eerie floating ruins, high-altitude winds, mystical minor harp
      2: {
        tempo: 118,
        leadType: 'sine',
        bassType: 'sine',
        melody: [293.66, 349.23, 440.0, 587.33, 329.63, 392.0, 493.88, 659.25, 261.63, 329.63, 392.0, 523.25, 293.66, 440.0, 587.33, 698.46],
        bass: [146.83, 164.81, 130.81, 146.83],
        harmonics: [440.0, 587.33, 698.46, 880.0]
      },
      // Ep 3: The Prime Kindergarten - Dark, industrial, tragic lore, droning sub-bass & metallic resonance
      3: {
        tempo: 112,
        leadType: 'sawtooth',
        bassType: 'square',
        melody: [261.63, 311.13, 392.0, 466.16, 246.94, 293.66, 369.99, 440.0, 233.08, 277.18, 349.23, 415.3, 261.63, 311.13, 392.0, 523.25],
        bass: [65.41, 77.78, 87.31, 98.0],
        harmonics: [392.0, 466.16, 523.25, 622.25]
      },
      // Ep 4: Subterranean Mantle Drill - Magma core, ticking drill beats, heavy earth rumble
      4: {
        tempo: 134,
        leadType: 'sawtooth',
        bassType: 'sawtooth',
        melody: [185.0, 220.0, 277.18, 369.99, 196.0, 246.94, 293.66, 392.0, 207.65, 261.63, 311.13, 415.3, 220.0, 277.18, 329.63, 440.0],
        bass: [92.5, 98.0, 103.83, 110.0],
        harmonics: [369.99, 440.0, 554.37, 739.99]
      },
      // Ep 5: Bismuth's Burning Forge - Molten iron, heavy synchronized anvil strikes, blazing brass
      5: {
        tempo: 130,
        leadType: 'square',
        bassType: 'triangle',
        melody: [329.63, 392.0, 493.88, 659.25, 369.99, 440.0, 554.37, 739.99, 392.0, 493.88, 587.33, 783.99, 329.63, 493.88, 659.25, 987.77],
        bass: [164.81, 185.0, 196.0, 164.81],
        harmonics: [493.88, 659.25, 783.99, 987.77]
      },
      // Ep 6: The Frozen North & Jasper - Arctic blizzard winds, aggressive warrior war march
      6: {
        tempo: 138,
        leadType: 'sawtooth',
        bassType: 'sawtooth',
        melody: [246.94, 293.66, 369.99, 493.88, 261.63, 329.63, 392.0, 523.25, 220.0, 277.18, 329.63, 440.0, 246.94, 369.99, 493.88, 739.99],
        bass: [123.47, 130.81, 110.0, 123.47],
        harmonics: [493.88, 587.33, 739.99, 987.77]
      },
      // Ep 7: Pink Diamond's Space Zoo - Cosmic isolation, crystalline synth pads, sterile Homeworld elegance
      7: {
        tempo: 120,
        leadType: 'sine',
        bassType: 'sine',
        melody: [392.0, 466.16, 587.33, 783.99, 349.23, 440.0, 523.25, 698.46, 311.13, 392.0, 466.16, 622.25, 392.0, 523.25, 659.25, 783.99],
        bass: [196.0, 174.61, 155.56, 196.0],
        harmonics: [587.33, 783.99, 932.33, 1174.66]
      },
      // Ep 8: Homeworld Abduction Shore - High stakes Beach City crisis, looming invasion dread
      8: {
        tempo: 140,
        leadType: 'square',
        bassType: 'sawtooth',
        melody: [277.18, 329.63, 415.3, 554.37, 261.63, 329.63, 392.0, 523.25, 246.94, 311.13, 369.99, 493.88, 277.18, 415.3, 554.37, 830.61],
        bass: [138.59, 130.81, 123.47, 138.59],
        harmonics: [415.3, 554.37, 659.25, 830.61]
      },
      // Ep 9: Homeworld Courtroom Trial - Totalitarian dystopia, cybernetic Robonoid pulses
      9: {
        tempo: 142,
        leadType: 'sawtooth',
        bassType: 'square',
        melody: [233.08, 277.18, 349.23, 466.16, 220.0, 261.63, 329.63, 440.0, 207.65, 246.94, 311.13, 415.3, 233.08, 349.23, 466.16, 698.46],
        bass: [116.54, 110.0, 103.83, 116.54],
        harmonics: [466.16, 554.37, 698.46, 932.33]
      },
      // Ep 10: White Diamond Supreme Mecha - Grand cathedral organ chords, blinding celestial operatic finale
      10: {
        tempo: 152,
        leadType: 'sawtooth',
        bassType: 'sawtooth',
        melody: [293.66, 369.99, 440.0, 587.33, 329.63, 415.3, 493.88, 659.25, 369.99, 466.16, 554.37, 739.99, 440.0, 554.37, 659.25, 880.0],
        bass: [146.83, 164.81, 185.0, 220.0],
        harmonics: [587.33, 739.99, 880.0, 1174.66]
      }
    };

    const theme = stageProfiles[stageNum] || stageProfiles[1];
    const effectiveTempo = isBoss ? Math.round(theme.tempo * 1.15) : theme.tempo;
    const intervalMs = (60 / effectiveTempo) * 250;

    this.musicBeat = 0;
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicEnabled) return;
      try {
        const t = this.ctx.currentTime;
        const melody = theme.melody;
        const bass = theme.bass;

        const noteIdx = this.musicBeat % melody.length;
        const freq = melody[noteIdx];

        // 1. Lead melody oscillator
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = theme.leadType || 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        const leadVol = isBoss ? 0.055 : 0.042;
        gain.gain.setValueAtTime(leadVol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);

        // 2. Harmonic chord pad / arpeggio every 2nd beat in boss mode or 4th in normal
        const harmStep = isBoss ? 2 : 4;
        if (this.musicBeat % harmStep === 0 && theme.harmonics) {
          const hOsc = this.ctx.createOscillator();
          const hGain = this.ctx.createGain();
          const hIdx = Math.floor((this.musicBeat / harmStep) % theme.harmonics.length);
          hOsc.type = 'sine';
          hOsc.frequency.setValueAtTime(theme.harmonics[hIdx], t);
          hGain.gain.setValueAtTime(isBoss ? 0.035 : 0.022, t);
          hGain.gain.exponentialRampToValueAtTime(0.001, t + (harmStep * 0.12));
          hOsc.connect(hGain);
          hGain.connect(this.ctx.destination);
          hOsc.start(t);
          hOsc.stop(t + (harmStep * 0.12));
        }

        // 3. Driving rhythmic bassline
        if (this.musicBeat % 4 === 0 || (isBoss && this.musicBeat % 2 === 0)) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          const bIdx = Math.floor((this.musicBeat / 4) % bass.length);
          const bFreq = bass[bIdx];

          bassOsc.type = theme.bassType || 'triangle';
          bassOsc.frequency.setValueAtTime(bFreq, t);

          const bassVol = isBoss ? 0.095 : 0.075;
          bassGain.gain.setValueAtTime(bassVol, t);
          bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(t);
          bassOsc.stop(t + 0.32);
        }

        this.musicBeat++;
      } catch (err) {}
    }, intervalMs);
  }

  playMusic(trackName) {
    if (typeof trackName === 'number') {
      return this.playStageMusic(trackName, false);
    }
    if (trackName === 'boss') {
      return this.playStageMusic(this.lastStageIndex || 1, true);
    }
    if (trackName === 'battle') {
      return this.playStageMusic(this.lastStageIndex || 1, false);
    }

    this.currentTrack = trackName;
    if (!this.musicEnabled) return;
    this.init();
    this.stopMusic();

    let melody = [
      349.23, 440.0, 523.25, 659.25, 392.0, 493.88, 587.33, 783.99,
      329.63, 392.0, 493.88, 659.25, 440.0, 523.25, 659.25, 880.0
    ];
    let bass = [174.61, 196.0, 164.81, 220.0];
    let tempo = 124;
    let waveType = 'sine';

    if (trackName === 'practice') {
      // Beach City Daytime / Dojo: Peaceful warm Crystal Temple harmony
      tempo = 108;
      waveType = 'triangle';
      melody = [261.63, 329.63, 392.0, 493.88, 349.23, 440.0, 523.25, 659.25, 293.66, 369.99, 440.0, 587.33, 261.63, 329.63, 392.0, 523.25];
      bass = [130.81, 174.61, 146.83, 130.81];
    } else if (trackName === 'menu') {
      // Iconic Steven Universe Theme / Title screen
      tempo = 114;
      waveType = 'sine';
      melody = [349.23, 392.0, 440.0, 523.25, 392.0, 440.0, 493.88, 587.33, 329.63, 392.0, 440.0, 523.25, 440.0, 493.88, 523.25, 659.25];
      bass = [174.61, 196.0, 164.81, 220.0];
    } else if (trackName === 'fusion') {
      tempo = 150;
      waveType = 'triangle';
      melody = [523.25, 659.25, 783.99, 1046.5, 587.33, 739.99, 880.0, 1174.66, 659.25, 830.61, 987.77, 1318.5, 783.99, 987.77, 1174.66, 1567.98];
      bass = [261.63, 293.66, 329.63, 392.0];
    }

    const intervalMs = (60 / tempo) * 250;
    this.musicBeat = 0;
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicEnabled) return;
      try {
        const t = this.ctx.currentTime;
        const noteIdx = this.musicBeat % melody.length;
        const freq = melody[noteIdx];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.045, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);

        if (this.musicBeat % 4 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          const bFreq = bass[Math.floor((this.musicBeat / 4) % bass.length)];
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bFreq, t);
          bassGain.gain.setValueAtTime(0.08, t);
          bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(t);
          bassOsc.stop(t + 0.35);
        }

        this.musicBeat++;
      } catch (err) {}
    }, intervalMs);
  }"""

assert t2 in code, "Target 2 (Music) not found!"
code = code.replace(t2, r2, 1)

# -------------------------------------------------------------
# 3. PlayerHero: Shared Team Healing on Healing Skills
# -------------------------------------------------------------
# Steven heal
t3a = """    if (this.activeChar === 'steven') {
      // Rose's Bubble & Cookie Cat Heal
      this.actionType = 'shield';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      this.isShielding = true;
      this.bubbleTimer = 2.2;
      this.invulnerableTimer = 2.2;

      pickups.push({
        x: this.x,
        y: this.groundY - 12,
        type: 'cookie',
        life: 15
      });"""

r3a = """    if (this.activeChar === 'steven') {
      // Rose's Bubble & Cookie Cat Heal
      this.actionType = 'shield';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      this.isShielding = true;
      this.bubbleTimer = 2.2;
      this.invulnerableTimer = 2.2;

      // 2-Player Co-Op Shared Team Heal: Heals partner for +1 Heart directly!
      if (typeof this.onTeamHeal === 'function') {
        this.onTeamHeal(this, 1);
      }

      pickups.push({
        x: this.x,
        y: this.groundY - 12,
        type: 'cookie',
        life: 15
      });"""

assert t3a in code, "Target 3a (Steven heal) not found!"
code = code.replace(t3a, r3a, 1)

# Rose heal
t3b = """    } else if (this.activeChar === 'rose') {
      // Sacred Tears of Resurrection!
      this.actionType = 'heal';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');
      pickups.push({
        x: this.x,
        y: this.groundY - 12,
        type: 'cookie',
        life: 15
      });"""

r3b = """    } else if (this.activeChar === 'rose') {
      // Sacred Tears of Resurrection!
      this.actionType = 'heal';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('bubble');
      audioEngine.playSfx('cookie');

      // 2-Player Co-Op Shared Team Heal: Sacred Tears heal partner directly!
      if (typeof this.onTeamHeal === 'function') {
        this.onTeamHeal(this, 1);
      }

      pickups.push({
        x: this.x,
        y: this.groundY - 12,
        type: 'cookie',
        life: 15
      });"""

assert t3b in code, "Target 3b (Rose heal) not found!"
code = code.replace(t3b, r3b, 1)

# -------------------------------------------------------------
# 4. EnemyManager: Comprehensive Knockback for ALL Melee Chars
# -------------------------------------------------------------
t4 = """        // ENEMY STAGGER & KNOCKBACK
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

r4 = """        // ENEMY STAGGER & KNOCKBACK FOR CLOSE-RANGE / MELEE ATTACKS
        if (player.isFusion) {
          // Fusion Titanic Impact: Cataclysmic launch & juggle
          e.vx = player.facing * 580;
          e.vy = -300;
          e.hurtTimer = 0.50;
          particles.addDamageText(e.x, e.y - e.height - 20, 'FUSION IMPACT!', true, '#e11d48');
        } else if (player.activeChar === 'garnet') {
          // Garnet heavy twin gauntlet boxing impact: powerful uppercut knockback
          e.vx = player.facing * 500;
          e.vy = -240;
          e.hurtTimer = 0.44;
          particles.addDamageText(e.x, e.y - e.height - 20, 'GAUNTLET SMASH!', true, '#ef4444');
        } else if (player.activeChar === 'steven') {
          // Steven shield bash & punch combo knockback
          e.vx = player.facing * 420;
          e.vy = -200;
          e.hurtTimer = 0.38;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SHIELD BASH!', true, '#ec4899');
        } else if (player.activeChar === 'amethyst') {
          // Amethyst whip slash & crack knockback
          e.vx = player.facing * 420;
          e.vy = -190;
          e.hurtTimer = 0.38;
          particles.addDamageText(e.x, e.y - e.height - 20, 'WHIP CRACK!', true, '#a855f7');
        } else if (player.activeChar === 'pearl') {
          // Pearl fencing thrust & spear impale knockback
          e.vx = player.facing * 390;
          e.vy = -180;
          e.hurtTimer = 0.36;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SPEAR THRUST!', true, '#22d3ee');
        } else if (player.activeChar === 'rose') {
          // Rose Quartz broadsword celestial sweep knockback
          e.vx = player.facing * 440;
          e.vy = -210;
          e.hurtTimer = 0.40;
          particles.addDamageText(e.x, e.y - e.height - 20, 'ROSE STRIKE!', true, '#f43f5e');
        } else if (player.activeChar === 'bismuth') {
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
          e.vx = player.facing * 380;
          e.vy = -180;
          e.hurtTimer = 0.38;
          particles.addDamageText(e.x, e.y - e.height - 20, 'PIERCE!', true, '#ec4899');
        } else {
          // Long range ranged users (Peridot, Lapis) - travel across map without sudden close melee knockback
          e.vx = player.facing * 140;
          e.hurtTimer = 0.25;
        }"""

assert t4 in code, "Target 4 (Melee knockback) not found!"
code = code.replace(t4, r4, 1)

# Additional Projectile Melee Knockbacks
t4b = """        } else if (p.type === 'connieSwordBeam') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 420;
          e.vy = -180;
          e.hurtTimer = 0.40;
          particles.addDamageText(e.x, e.y - e.height - 20, 'CRESCENT BEAM!', true, '#ec4899');"""

r4b = """        } else if (p.type === 'shieldShockwave' || p.type === 'bubbleShockwave') {
          e.vx = player.facing * 440;
          e.vy = -220;
          e.hurtTimer = 0.42;
          particles.addDamageText(e.x, e.y - e.height - 20, 'BUBBLE BURST!', true, '#ec4899');
        } else if (p.type === 'rocketGauntlet') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 520;
          e.vy = -240;
          e.hurtTimer = 0.45;
          particles.addDamageText(e.x, e.y - e.height - 20, 'ROCKET IMPACT!', true, '#ef4444');
        } else if (p.type === 'roseSwordWave' || p.type === 'roseShockwave') {
          e.vx = player.facing * 460;
          e.vy = -220;
          e.hurtTimer = 0.42;
          particles.addDamageText(e.x, e.y - e.height - 20, 'ROSE BURST!', true, '#f43f5e');
        } else if (p.type === 'spearBeam') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 440;
          e.vy = -190;
          e.hurtTimer = 0.38;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SPEAR PIERCE!', true, '#22d3ee');
        } else if (p.type === 'connieSwordBeam') {
          e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 420;
          e.vy = -180;
          e.hurtTimer = 0.40;
          particles.addDamageText(e.x, e.y - e.height - 20, 'CRESCENT BEAM!', true, '#ec4899');"""

assert t4b in code, "Target 4b (Melee specials knockback) not found!"
code = code.replace(t4b, r4b, 1)

# -------------------------------------------------------------
# 5. StevenUniverseGame: Hook Up onTeamHeal & handleTeamHealing
# -------------------------------------------------------------
t5 = """    this.player.x = 220;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.switchCharacter(this.selectedCharP1, this.audio, this.particles);
    this.player.isShielding = false;
    this.player.isSpinDashing = false;

    const hudP2 = document.getElementById('hudP2Panel');
    if (this.playerMode === '2p') {
      this.player2 = new PlayerHero(this.groundY, 'p2', this.stageWidth);
      this.player2.x = 340;
      this.player2.y = this.groundY;
      this.player2.switchCharacter(this.selectedCharP2, this.audio, this.particles);
      if (hudP2) hudP2.style.display = 'flex';
    } else {
      this.player2 = null;
      if (hudP2) hudP2.style.display = 'none';
    }"""

r5 = """    this.player.x = 220;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.switchCharacter(this.selectedCharP1, this.audio, this.particles);
    this.player.isShielding = false;
    this.player.isSpinDashing = false;
    this.player.onTeamHeal = (src, amt) => this.handleTeamHealing(src, amt);

    const hudP2 = document.getElementById('hudP2Panel');
    if (this.playerMode === '2p') {
      this.player2 = new PlayerHero(this.groundY, 'p2', this.stageWidth);
      this.player2.x = 340;
      this.player2.y = this.groundY;
      this.player2.switchCharacter(this.selectedCharP2, this.audio, this.particles);
      this.player2.onTeamHeal = (src, amt) => this.handleTeamHealing(src, amt);
      if (hudP2) hudP2.style.display = 'flex';
    } else {
      this.player2 = null;
      if (hudP2) hudP2.style.display = 'none';
    }"""

assert t5 in code, "Target 5 (Setup onTeamHeal) not found!"
code = code.replace(t5, r5, 1)

# Add handleTeamHealing method right after knockoutOrPoofPlayer
t5b = """  knockoutOrPoofPlayer(hero) {"""
r5b = """  handleTeamHealing(sourceHero, amount = 1) {
    if (this.playerMode !== '2p' || !this.player2) return;
    const targetHero = (sourceHero === this.player) ? this.player2 : this.player;
    if (!targetHero || targetHero.isFallen) return;

    const isTargetP2 = (targetHero === this.player2);
    const curHearts = isTargetP2 ? this.currentHeartsP2 : this.currentHearts;

    if (curHearts < this.maxHearts) {
      if (isTargetP2) {
        this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + amount);
      } else {
        this.currentHearts = Math.min(this.maxHearts, this.currentHearts + amount);
      }
      this.audio.playSfx('cookie');
      this.particles.addSparkle(targetHero.x, targetHero.y - 35, '#ff4d79', 24, 7);
      this.particles.addSparkle(targetHero.x, targetHero.y - 35, '#ffffff', 16, 5);
      this.particles.addRosePetals(targetHero.x, targetHero.y - 35, 16);
      this.particles.addDamageText(targetHero.x, targetHero.y - 65, `💖 +${amount} HEART (TEAM HEAL!)`, true, '#ff2a6d');
      this.updateHUD();
    } else {
      this.particles.addSparkle(targetHero.x, targetHero.y - 35, '#ffd700', 16, 5);
      this.particles.addDamageText(targetHero.x, targetHero.y - 65, '✨ MAX HP (GEM HARMONY!)', false, '#fde047');
    }
  }

  knockoutOrPoofPlayer(hero) {"""

assert t5b in code, "Target 5b (handleTeamHealing) not found!"
code = code.replace(t5b, r5b, 1)

# -------------------------------------------------------------
# 6. StevenUniverseGame: Music Sync on Stage Start and Boss Spawn
# -------------------------------------------------------------
t6a = """    this.state = 'playing';
    this.audio.playMusic(mode === 'practice' ? 'menu' : 'battle');
    this.updateHUD();"""

r6a = """    this.state = 'playing';
    this.audio.lastStageIndex = this.stageIndex;
    if (mode === 'practice') {
      this.audio.playMusic('practice');
    } else {
      this.audio.playStageMusic(this.stageIndex, false);
    }
    this.updateHUD();"""

assert t6a in code, "Target 6a (startNewGame music) not found!"
code = code.replace(t6a, r6a, 1)

t6b = """    // Start Multi-Wave Progression (4 Waves + Final Boss Wave)
    this.startEpisodeWaveSequence();
  }"""

r6b = """    // Start Multi-Wave Progression (4 Waves + Final Boss Wave)
    this.audio.lastStageIndex = this.stageIndex;
    this.audio.playStageMusic(this.stageIndex, false);
    this.startEpisodeWaveSequence();
  }"""

assert t6b in code, "Target 6b (startStageWave music) not found!"
code = code.replace(t6b, r6b, 1)

t6c = """    // Dramatic Boss Intro Warning Banner
    this.triggerWaveWarning(`⚡ FINAL BOSS: ${epData.bossName}! ⚡`, true);
    this.isBossSpawning = true;
    this.bossSpawnTimer = 1.2;"""

r6c = """    // Dramatic Boss Intro Warning Banner & Intense Boss Track
    this.triggerWaveWarning(`⚡ FINAL BOSS: ${epData.bossName}! ⚡`, true);
    this.audio.playStageMusic(this.stageIndex, true);
    this.isBossSpawning = true;
    this.bossSpawnTimer = 1.2;"""

assert t6c in code, "Target 6c (prepareBossWave music) not found!"
code = code.replace(t6c, r6c, 1)

t6d = """  startPracticeDojo() {
    this.player.revive(this.audio, this.particles);
    if (this.player2) this.player2.revive(this.audio, this.particles);"""

r6d = """  startPracticeDojo() {
    this.audio.playMusic('practice');
    this.player.revive(this.audio, this.particles);
    if (this.player2) this.player2.revive(this.audio, this.particles);"""

assert t6d in code, "Target 6d (startPracticeDojo music) not found!"
code = code.replace(t6d, r6d, 1)

# -------------------------------------------------------------
# 7. UI Sound Effects: Warp Pad, Weapon Summon, Bubble Pop, Shield Retract
# -------------------------------------------------------------
t7a = """    safeClick('btnPlayStory', () => this.startNewGame('story'));
    safeClick('btnPractice', () => this.startNewGame('practice'));
    safeClick('btnPlayerMode', () => this.togglePlayerMode());
    safeClick('btnOpenDifficulty', () => this.cycleDifficulty());
    safeClick('btnQuitGame', () => this.quitGame());
    safeClick('btnCancelQuit', () => this.showTitleScreen());

    safeClick('btnNextStage', () => this.nextStage());
    safeClick('btnVictoryMenu', () => this.showTitleScreen());
    safeClick('btnRetry', () => this.startNewGame(this.gameMode));
    safeClick('btnGameOverMenu', () => this.showTitleScreen());

    safeClick('btnResume', () => {
      this.state = 'playing';
      this.lastTime = performance.now();
      const ps = document.getElementById('pauseScreen');
      if (ps) ps.style.display = 'none';
    });
    safeClick('btnRestartStage', () => {
      this.startNewGame(this.gameMode);
    });
    safeClick('btnQuitToMenu', () => this.showTitleScreen());"""

r7a = """    safeClick('btnPlayStory', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame('story');
    });
    safeClick('btnPractice', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame('practice');
    });
    safeClick('btnPlayerMode', () => {
      this.audio.playSfx('bubblePop');
      this.togglePlayerMode();
    });
    safeClick('btnOpenDifficulty', () => {
      this.audio.playSfx('bubblePop');
      this.cycleDifficulty();
    });
    safeClick('btnQuitGame', () => this.quitGame());
    safeClick('btnCancelQuit', () => {
      this.audio.playSfx('shieldRetract');
      this.showTitleScreen();
    });

    safeClick('btnNextStage', () => {
      this.audio.playSfx('warpPad');
      this.nextStage();
    });
    safeClick('btnVictoryMenu', () => {
      this.audio.playSfx('shieldRetract');
      this.showTitleScreen();
    });
    safeClick('btnRetry', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame(this.gameMode);
    });
    safeClick('btnGameOverMenu', () => {
      this.audio.playSfx('shieldRetract');
      this.showTitleScreen();
    });

    safeClick('btnResume', () => {
      this.audio.playSfx('bubblePop');
      this.state = 'playing';
      this.lastTime = performance.now();
      const ps = document.getElementById('pauseScreen');
      if (ps) ps.style.display = 'none';
    });
    safeClick('btnRestartStage', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame(this.gameMode);
    });
    safeClick('btnQuitToMenu', () => {
      this.audio.playSfx('shieldRetract');
      this.showTitleScreen();
    });"""

assert t7a in code, "Target 7a (Button sounds) not found!"
code = code.replace(t7a, r7a, 1)

# Modal buttons & character select sounds
t7b = """    safeClick('lobbyGuardianCard', openCharModal);
    safeClick('btnCloseCharSelect', () => {
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
    });

    // 2-Player Guardian Tabs inside selection modal
    safeClick('tabSelectP1', () => {
      this.charSelectActiveTab = 'p1';
      document.getElementById('tabSelectP1')?.classList.add('active');
      document.getElementById('tabSelectP2')?.classList.remove('active');
      this.tempSelectedChar = this.selectedCharP1;
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
    });

    safeClick('tabSelectP2', () => {
      this.charSelectActiveTab = 'p2';
      document.getElementById('tabSelectP2')?.classList.add('active');
      document.getElementById('tabSelectP1')?.classList.remove('active');
      this.tempSelectedChar = this.selectedCharP2;
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
    });

    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
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

r7b = """    safeClick('lobbyGuardianCard', () => {
      this.audio.playSfx('weaponSummon');
      openCharModal();
    });
    safeClick('btnCloseCharSelect', () => {
      this.audio.playSfx('shieldRetract');
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
    });

    // 2-Player Guardian Tabs inside selection modal
    safeClick('tabSelectP1', () => {
      this.audio.playSfx('weaponSummon');
      this.charSelectActiveTab = 'p1';
      document.getElementById('tabSelectP1')?.classList.add('active');
      document.getElementById('tabSelectP2')?.classList.remove('active');
      this.tempSelectedChar = this.selectedCharP1;
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
    });

    safeClick('tabSelectP2', () => {
      this.audio.playSfx('weaponSummon');
      this.charSelectActiveTab = 'p2';
      document.getElementById('tabSelectP2')?.classList.add('active');
      document.getElementById('tabSelectP1')?.classList.remove('active');
      this.tempSelectedChar = this.selectedCharP2;
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
    });

    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
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

        // Shimmering weapon summon audio feedback!
        this.audio.playSfx('weaponSummon');
      });
    });"""

assert t7b in code, "Target 7b (Guardian select sounds) not found!"
code = code.replace(t7b, r7b, 1)

# Confirm guardian button
t7c = """    safeClick('btnConfirmChar', () => {
      if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
        this.selectedCharP2 = this.tempSelectedChar;
        SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
      } else {
        this.selectedCharP1 = this.tempSelectedChar;
        this.selectedChar = this.selectedCharP1;
        SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
      }
      this.updateLobbyGuardian();
      if (charModal) charModal.style.display = 'none';
      this.audio.playSfx('stageClear');
    });"""

r7c = """    safeClick('btnConfirmChar', () => {
      if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
        this.selectedCharP2 = this.tempSelectedChar;
        SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
      } else {
        this.selectedCharP1 = this.tempSelectedChar;
        this.selectedChar = this.selectedCharP1;
        SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
      }
      this.updateLobbyGuardian();
      if (charModal) charModal.style.display = 'none';
      this.audio.playSfx('weaponSummon');
    });"""

assert t7c in code, "Target 7c (btnConfirmChar sound) not found!"
code = code.replace(t7c, r7c, 1)

# Settings modal buttons: bubblePop and shieldRetract
t7d = """    safeClick('btnOpenSettings', () => {
      if (btnSettingSound) btnSettingSound.textContent = this.audio.soundEnabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
      if (btnSettingMusic) btnSettingMusic.textContent = this.audio.soundEnabled ? '🎵 Synth Music (BGM): ON' : '🔇 Synth Music (BGM): OFF';
      if (btnSettingPerf) btnSettingPerf.textContent = this.fastPerfMode ? '⚡ Fast Performance Mode: ON' : '⚡ Fast Performance Mode: OFF';
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? '📳 Screen Shake: ON' : '📳 Screen Shake: OFF';
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? '📱 Mobile Controls: FORCED ON' : '📱 Mobile Controls: AUTO';
      if (settingsModal) settingsModal.style.display = 'flex';
    });

    safeClick('btnCloseSettings', () => {
      if (settingsModal) settingsModal.style.display = 'none';
    });

    safeClick('btnSettingSound', () => {
      const enabled = this.audio.toggleSound();
      if (btnSettingSound) btnSettingSound.textContent = enabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
      const soundBtn = document.getElementById('btnSoundToggle');
      if (soundBtn) soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    safeClick('btnSettingMusic', () => {
      const enabled = this.audio.toggleSound();
      if (btnSettingMusic) btnSettingMusic.textContent = enabled ? '🎵 Synth Music (BGM): ON' : '🔇 Synth Music (BGM): OFF';
    });

    safeClick('btnSettingPerf', () => {
      this.fastPerfMode = !this.fastPerfMode;
      if (btnSettingPerf) btnSettingPerf.textContent = this.fastPerfMode ? '⚡ Fast Performance Mode: ON' : '⚡ Fast Performance Mode: OFF';
    });

    safeClick('btnSettingShake', () => {
      this.screenShakeEnabled = !this.screenShakeEnabled;
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? '📳 Screen Shake: ON' : '📳 Screen Shake: OFF';
    });

    safeClick('btnSettingTouch', () => {
      this.isRealMobile = !this.isRealMobile;
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? '📱 Mobile Controls: FORCED ON' : '📱 Mobile Controls: FORCED OFF';
      const touchBox = document.getElementById('touchControls');
      if (touchBox && this.state === 'playing') {
        touchBox.style.display = this.isRealMobile ? 'flex' : 'none';
      }
    });

    safeClick('btnSaveSettings', () => {
      if (settingsModal) settingsModal.style.display = 'none';
      this.audio.playSfx('stageClear');
    });"""

r7d = """    safeClick('btnOpenSettings', () => {
      this.audio.playSfx('bubblePop');
      if (btnSettingSound) btnSettingSound.textContent = this.audio.soundEnabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
      if (btnSettingMusic) btnSettingMusic.textContent = this.audio.soundEnabled ? '🎵 Synth Music (BGM): ON' : '🔇 Synth Music (BGM): OFF';
      if (btnSettingPerf) btnSettingPerf.textContent = this.fastPerfMode ? '⚡ Fast Performance Mode: ON' : '⚡ Fast Performance Mode: OFF';
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? '📳 Screen Shake: ON' : '📳 Screen Shake: OFF';
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? '📱 Mobile Controls: FORCED ON' : '📱 Mobile Controls: AUTO';
      if (settingsModal) settingsModal.style.display = 'flex';
    });

    safeClick('btnCloseSettings', () => {
      this.audio.playSfx('shieldRetract');
      if (settingsModal) settingsModal.style.display = 'none';
    });

    safeClick('btnSettingSound', () => {
      this.audio.playSfx('bubblePop');
      const enabled = this.audio.toggleSound();
      if (btnSettingSound) btnSettingSound.textContent = enabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
      const soundBtn = document.getElementById('btnSoundToggle');
      if (soundBtn) soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    safeClick('btnSettingMusic', () => {
      this.audio.playSfx('bubblePop');
      const enabled = this.audio.toggleSound();
      if (btnSettingMusic) btnSettingMusic.textContent = enabled ? '🎵 Synth Music (BGM): ON' : '🔇 Synth Music (BGM): OFF';
    });

    safeClick('btnSettingPerf', () => {
      this.audio.playSfx('bubblePop');
      this.fastPerfMode = !this.fastPerfMode;
      if (btnSettingPerf) btnSettingPerf.textContent = this.fastPerfMode ? '⚡ Fast Performance Mode: ON' : '⚡ Fast Performance Mode: OFF';
    });

    safeClick('btnSettingShake', () => {
      this.audio.playSfx('bubblePop');
      this.screenShakeEnabled = !this.screenShakeEnabled;
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? '📳 Screen Shake: ON' : '📳 Screen Shake: OFF';
    });

    safeClick('btnSettingTouch', () => {
      this.audio.playSfx('bubblePop');
      this.isRealMobile = !this.isRealMobile;
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? '📱 Mobile Controls: FORCED ON' : '📱 Mobile Controls: FORCED OFF';
      const touchBox = document.getElementById('touchControls');
      if (touchBox && this.state === 'playing') {
        touchBox.style.display = this.isRealMobile ? 'flex' : 'none';
      }
    });

    safeClick('btnSaveSettings', () => {
      this.audio.playSfx('shieldRetract');
      if (settingsModal) settingsModal.style.display = 'none';
    });"""

assert t7d in code, "Target 7d (Settings sounds) not found!"
code = code.replace(t7d, r7d, 1)

# In keyup: Shield Retract Sound when releasing shield
t7e = """        if (e.code === 'KeyS') { this.keysP1.down = false; this.keysP1.shield = false; }"""
r7e = """        if (e.code === 'KeyS') {
          if (this.keysP1.shield) this.audio.playSfx('shieldRetract');
          this.keysP1.down = false;
          this.keysP1.shield = false;
        }"""
assert t7e in code, "Target 7e (KeyS shieldRetract) not found!"
code = code.replace(t7e, r7e, 1)

t7f = """        if (e.code === 'ArrowDown') { this.keysP2.down = false; this.keysP2.shield = false; }"""
r7f = """        if (e.code === 'ArrowDown') {
          if (this.keysP2.shield) this.audio.playSfx('shieldRetract');
          this.keysP2.down = false;
          this.keysP2.shield = false;
        }"""
assert t7f in code, "Target 7f (ArrowDown shieldRetract) not found!"
code = code.replace(t7f, r7f, 1)

with open('game.js', 'w') as f:
    f.write(code)

print("SUCCESS: All music, team healing, melee knockbacks, and audio clicks updated cleanly in game.js!")
