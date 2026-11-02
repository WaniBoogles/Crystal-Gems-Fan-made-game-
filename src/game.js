/**
 * STEVEN UNIVERSE: CRYSTAL GUARDIANS UNLEASHED
 * Advanced HTML5 Canvas Vector Engine + Web Audio Synthesizer
 * Feature-rich, canon-accurate Steven Universe game.
 * Fully compatible with Linux Mint desktop and Android / Xiaomi mobile devices.
 */

// ============================================================================
// 1. SOUND & MUSIC SYNTHESIZER (WEB AUDIO API - 100% OFFLINE)
// ============================================================================
class GemAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxGainNode = null;
    this.musicGainNode = null;
    const getVal = (k, def) => (typeof SafeStorage !== 'undefined' && SafeStorage.getItem ? SafeStorage.getItem(k) : null) ?? def;
    this.soundEnabled = getVal('su_soundEnabled', 'true') !== 'false';
    this.musicEnabled = getVal('su_musicEnabled', 'true') !== 'false';
    this.sfxVolume = parseFloat(getVal('su_sfxVol', '0.8'));
    this.musicVolume = parseFloat(getVal('su_musicVol', '0.7'));
    this.bgmOverrideManual = getVal('su_bgmManual', 'false') === 'true';
    let storedBgm = getVal('su_selectedBgm', 'distant_shore');
    if (!storedBgm || storedBgm === 'auto' || storedBgm === 'menu') storedBgm = 'distant_shore';
    this.selectedBgm = storedBgm;
    this.musicInterval = null;
    this.musicBeat = 0;
    this.currentTrack = storedBgm;
    this.lastStageIndex = 1;
    this.isManuallyPaused = false;
    this.isResuming = false;
    this.hasAwakened = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = (typeof window !== 'undefined') ? (window.AudioContext || window.webkitAudioContext) : null;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          
          // SFX Master Gain: Set directly to sfxVolume so SFX is always crisp and audible
          this.sfxGainNode = this.ctx.createGain();
          this.sfxGainNode.gain.setValueAtTime(this.soundEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
          this.sfxGainNode.connect(this.ctx.destination);

          // Music Master Gain: Smooth musical volume
          this.musicGainNode = this.ctx.createGain();
          this.musicGainNode.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
          this.musicGainNode.connect(this.ctx.destination);
        } catch (e) {
          console.warn("Audio gain init error:", e);
        }
      }
    }

    if (this.ctx) {
      if (this.ctx.state === 'running') {
        this.onAudioRunning();
      } else if (this.ctx.state === 'suspended') {
        if (!this.isResuming) {
          this.isResuming = true;
          this.ctx.resume().then(() => {
            if (this.ctx && this.ctx.state === 'running') {
              this.onAudioRunning();
            }
          }).catch(() => {}).finally(() => {
            this.isResuming = false;
          });
        }
      }
    }
  }

  onAudioRunning() {
    const firstTime = !this.hasAwakened;
    this.hasAwakened = true;

    if (this.sfxGainNode && this.ctx) {
      try {
        this.sfxGainNode.gain.setValueAtTime(this.soundEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
      } catch (e) {}
    }
    if (!this.ctx || !this.musicGainNode || !this.musicEnabled) return;

    if (firstTime) {
      // First play of the session: nice 1s fade-in from silence.
      this.fadeInMusic(1.0);
    } else if (this.musicGainNode.gain.value < this.musicVolume * 0.98) {
      // Woken up again (tab focus, suspended context): top the track straight back up.
      // Never call fadeInMusic() here — that restarts from ~0 and ducks the music on
      // every single keypress, which is exactly what players were hearing.
      try {
        this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      } catch (e) {}
    }
  }

  fadeInMusic(duration = 1.0) {
    if (!this.ctx || !this.musicGainNode || !this.musicEnabled) return;
    try {
      const t = this.ctx.currentTime;
      const targetVol = this.musicVolume;
      this.musicGainNode.gain.cancelScheduledValues(t);
      this.musicGainNode.gain.setValueAtTime(0.0001, t);
      this.musicGainNode.gain.linearRampToValueAtTime(targetVol, t + duration);
    } catch (e) {
      if (this.musicGainNode && this.musicGainNode.gain) {
        try {
          this.musicGainNode.gain.value = this.musicEnabled ? this.musicVolume : 0;
        } catch (err) {}
      }
    }
  }

  getSfxDestination() {
    return this.sfxGainNode || this.ctx?.destination;
  }

  getMusicDestination() {
    return this.musicGainNode || this.ctx?.destination;
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (typeof SafeStorage !== 'undefined' && SafeStorage.setItem) {
      SafeStorage.setItem('su_sfxVol', this.sfxVolume.toString());
    }
    if (this.ctx && this.sfxGainNode) {
      this.sfxGainNode.gain.setValueAtTime(this.soundEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (typeof SafeStorage !== 'undefined' && SafeStorage.setItem) {
      SafeStorage.setItem('su_musicVol', this.musicVolume.toString());
    }
    if (this.ctx && this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
    }
  }

  setBgmOverride(trackId) {
    this.selectedBgm = trackId || 'auto';
    this.bgmOverrideManual = true;
    if (typeof SafeStorage !== 'undefined' && SafeStorage.setItem) {
      SafeStorage.setItem('su_bgmManual', 'true');
    }
    this.isManuallyPaused = false;
    if (typeof SafeStorage !== 'undefined' && SafeStorage.setItem) {
      SafeStorage.setItem('su_selectedBgm', this.selectedBgm);
    }
    if (!this.musicEnabled) return;
    this.init();
    if (this.selectedBgm === 'auto') {
      if (this.currentTrack === 'menu' || !this.currentTrack) {
        this.playTrackById('distant_shore', false);
      } else if (this.currentTrack === 'practice') {
        this.playTrackById('distant_shore', false);
      } else {
        this.playStageMusic(this.lastStageIndex || 1, this.currentTrack.startsWith('boss_'));
      }
    } else {
      this.playTrackById(this.selectedBgm, this.currentTrack.startsWith('boss_'));
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (typeof SafeStorage !== 'undefined' && SafeStorage.setItem) {
      SafeStorage.setItem('su_soundEnabled', this.soundEnabled ? 'true' : 'false');
    }
    if (this.ctx && this.sfxGainNode) {
      this.sfxGainNode.gain.setValueAtTime(this.soundEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
    return this.soundEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (typeof SafeStorage !== 'undefined' && SafeStorage.setItem) {
      SafeStorage.setItem('su_musicEnabled', this.musicEnabled ? 'true' : 'false');
    }
    if (this.ctx && this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
    }
    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      this.init();
      if (this.currentTrack.startsWith('stage_') || this.currentTrack.startsWith('boss_')) {
        this.playStageMusic(this.lastStageIndex || 1, this.currentTrack.startsWith('boss_'));
      } else {
        this.playMusic(this.currentTrack);
      }
    }
    return this.musicEnabled;
  }

  playSfx(type) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.getSfxDestination());

      switch (type) {
        case 'menuTap':
          // Soft, gentle UI chime (single warm 587Hz D5 sine note, whisper volume, fast silky decay)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, t);
          osc.frequency.exponentialRampToValueAtTime(880.00, t + 0.06);
          gain.gain.setValueAtTime(0.04, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          osc.start(t);
          osc.stop(t + 0.08);
          break;

        case 'jump':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(240, t);
          osc.frequency.exponentialRampToValueAtTime(560, t + 0.16);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          osc.start(t);
          osc.stop(t + 0.16);
          break;

        case 'punch':
        case 'hit':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(160, t);
          osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
          gain.gain.setValueAtTime(0.32, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
          osc.start(t);
          osc.stop(t + 0.12);
          break;

        case 'pop':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(680, t);
          osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);
          gain.gain.setValueAtTime(0.38, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
          osc.start(t);
          osc.stop(t + 0.09);
          break;

        case 'shield':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, t);
          osc.frequency.exponentialRampToValueAtTime(1760, t + 0.08);
          gain.gain.setValueAtTime(0.28, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.start(t);
          osc.stop(t + 0.45);
          break;

        case 'whip':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(900, t);
          osc.frequency.exponentialRampToValueAtTime(150, t + 0.14);
          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
          osc.start(t);
          osc.stop(t + 0.14);
          break;

        case 'rocket':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(120, t);
          osc.frequency.linearRampToValueAtTime(320, t + 0.2);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
          osc.start(t);
          osc.stop(t + 0.35);
          break;

        case 'spindash':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, t);
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.3);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
          osc.start(t);
          osc.stop(t + 0.35);
          break;

        case 'lightning':
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.start(t);
          osc.stop(t + 0.25);
          break;

        case 'hammer':
          osc.type = 'square';
          osc.frequency.setValueAtTime(140, t);
          osc.frequency.exponentialRampToValueAtTime(45, t + 0.2);
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.start(t);
          osc.stop(t + 0.25);
          break;

        case 'water':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(480, t);
          osc.frequency.exponentialRampToValueAtTime(160, t + 0.22);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.start(t);
          osc.stop(t + 0.25);
          break;

        case 'metal':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, t);
          osc.frequency.exponentialRampToValueAtTime(350, t + 0.15);
          gain.gain.setValueAtTime(0.26, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
          osc.start(t);
          osc.stop(t + 0.18);
          break;

        case 'sword':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(850, t);
          osc.frequency.exponentialRampToValueAtTime(280, t + 0.12);
          gain.gain.setValueAtTime(0.28, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
          break;

        case 'overdrive':
          // Pink Diamond Power-Up Surge Sound
          [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(freq, t + idx * 0.05);
            o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + idx * 0.05 + 0.4);
            g.gain.setValueAtTime(0.22, t + idx * 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.55);
            o.connect(g);
            g.connect(this.getSfxDestination());
            o.start(t + idx * 0.05);
            o.stop(t + idx * 0.05 + 0.55);
          });
          return;

        case 'stageClear':
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const toneOsc = this.ctx.createOscillator();
            const toneGain = this.ctx.createGain();
            toneOsc.type = 'triangle';
            toneOsc.frequency.setValueAtTime(freq, t + idx * 0.08);
            toneGain.gain.setValueAtTime(0.2, t + idx * 0.08);
            toneGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
            toneOsc.connect(toneGain);
            toneGain.connect(this.getSfxDestination());
            toneOsc.start(t + idx * 0.08);
            toneOsc.stop(t + idx * 0.08 + 0.35);
          });
          return;

        case 'waveWarning':
          // Plants vs Zombies Style Huge Wave Alert Sound (Dramatic Brass Swell)
          [130.81, 164.81, 196.00].forEach((freq, idx) => {
            const toneOsc = this.ctx.createOscillator();
            const toneGain = this.ctx.createGain();
            toneOsc.type = 'sawtooth';
            toneOsc.frequency.setValueAtTime(freq, t + idx * 0.12);
            toneOsc.frequency.exponentialRampToValueAtTime(freq * 0.82, t + idx * 0.12 + 0.65);
            toneGain.gain.setValueAtTime(0.26, t + idx * 0.12);
            toneGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.7);
            toneOsc.connect(toneGain);
            toneGain.connect(this.getSfxDestination());
            toneOsc.start(t + idx * 0.12);
            toneOsc.stop(t + idx * 0.12 + 0.7);
          });
          return;

        case 'bossIntro':
          // Dramatic Corrupted Boss Fanfare
          [220.00, 277.18, 329.63, 440.00].forEach((freq, idx) => {
            const toneOsc = this.ctx.createOscillator();
            const toneGain = this.ctx.createGain();
            toneOsc.type = 'square';
            toneOsc.frequency.setValueAtTime(freq, t + idx * 0.14);
            toneGain.gain.setValueAtTime(0.24, t + idx * 0.14);
            toneGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.14 + 0.55);
            toneOsc.connect(toneGain);
            toneGain.connect(this.getSfxDestination());
            toneOsc.start(t + idx * 0.14);
            toneOsc.stop(t + idx * 0.14 + 0.55);
          });
          return;

        case 'dodge':
        case 'whoosh':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(460, t);
          osc.frequency.exponentialRampToValueAtTime(130, t + 0.18);
          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.start(t);
          osc.stop(t + 0.18);
          break;

        case 'poof':
          if (this.ctx && typeof this.ctx.createBuffer === 'function' && this.ctx.sampleRate) {
            try {
              const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
              const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
              const data = buffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
              }
              const noise = this.ctx.createBufferSource();
              noise.buffer = buffer;
              const filter = this.ctx.createBiquadFilter();
              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(900, t);
              filter.frequency.exponentialRampToValueAtTime(140, t + 0.25);
              noise.connect(filter);
              filter.connect(gain);
              gain.gain.setValueAtTime(0.38, t);
              gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
              noise.start(t);
              break;
            } catch (bufErr) {}
          }
          // Synth fallback
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, t);
          osc.frequency.exponentialRampToValueAtTime(30, t + 0.22);
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
          osc.start(t);
          osc.stop(t + 0.22);
          break;

        case 'powerup':
        case 'bubble':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(1320, t + 0.16);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
          osc.start(t);
          osc.stop(t + 0.35);

          setTimeout(() => {
            if (!this.soundEnabled || !this.ctx) return;
            try {
              const osc2 = this.ctx.createOscillator();
              const gain2 = this.ctx.createGain();
              osc2.type = 'triangle';
              osc2.frequency.setValueAtTime(1760, this.ctx.currentTime);
              osc2.frequency.exponentialRampToValueAtTime(2640, this.ctx.currentTime + 0.22);
              gain2.gain.setValueAtTime(0.18, this.ctx.currentTime);
              gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
              osc2.connect(gain2);
              gain2.connect(this.getSfxDestination());
              osc2.start();
              osc2.stop(this.ctx.currentTime + 0.4);
            } catch (err) {}
          }, 110);
          break;

        case 'fusion':
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const oscF = this.ctx.createOscillator();
            const gainF = this.ctx.createGain();
            oscF.type = 'triangle';
            oscF.frequency.setValueAtTime(freq, t + idx * 0.06);
            gainF.gain.setValueAtTime(0.2, t + idx * 0.06);
            gainF.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
            oscF.connect(gainF);
            gainF.connect(this.getSfxDestination());
            oscF.start(t + idx * 0.06);
            oscF.stop(t + 1.3);
          });
          break;

        case 'laser':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1300, t);
          osc.frequency.exponentialRampToValueAtTime(250, t + 0.18);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
          osc.start(t);
          osc.stop(t + 0.18);
          break;

        case 'heart':
        case 'cookie':
          [659.25, 830.61, 987.77, 1318.5].forEach((freq, idx) => {
            const oscC = this.ctx.createOscillator();
            const gainC = this.ctx.createGain();
            oscC.type = 'sine';
            oscC.frequency.setValueAtTime(freq, t + idx * 0.07);
            gainC.gain.setValueAtTime(0.16, t + idx * 0.07);
            gainC.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.32);
            oscC.connect(gainC);
            gainC.connect(this.getSfxDestination());
            oscC.start(t + idx * 0.07);
            oscC.stop(t + idx * 0.07 + 0.32);
          });
          break;

        case 'switch':
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
            wGain.gain.setValueAtTime(0.035, t + idx * 0.045);
            wGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.045 + 0.38);
            wOsc.connect(wGain);
            wGain.connect(this.getSfxDestination());
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
          mGain.connect(this.getSfxDestination());
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
          mGain2.connect(this.getSfxDestination());
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
          bPopGain.gain.setValueAtTime(0.18, t);
          bPopGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
          bPopOsc.connect(bPopGain);
          bPopGain.connect(this.getSfxDestination());
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
          sRetGain.connect(this.getSfxDestination());
          sRetOsc.start(t);
          sRetOsc.stop(t + 0.22);
          break;
      }
    } catch (e) {
      console.warn("Audio effect error:", e);
    }
  }

  getTrackProfile(trackId) {
    const profiles = {
      // 1. "That Distant Shore" (Lapis' Peaceful Solo Song) - DEFAULT FOR MAIN MENU & PRACTICE
      // Gentle, tender 3/4 waltz with soft crystalline chime notes and warm resonant trail
      'distant_shore': {
        name: 'That Distant Shore (Lapis Peace Theme)',
        tempo: 90,
        leadType: 'sine',
        bassType: 'sine',
        harmType: 'triangle',
        leadVol: 0.135,
        bassVol: 0.175,
        harmVol: 0.080,
        noteAttack: 0.02,
        noteDecay: 0.44,
        bassDecay: 0.55,
        harmDecay: 0.50,
        harmStep: 3,
        bassStep: 3,
        melody: [
          261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63,
          220.0, 261.63, 329.63, 392.0, 349.23, 329.63, 293.66, 261.63,
          293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 329.63, 293.66,
          261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 349.23, 329.63
        ],
        bass: [130.81, 164.81, 174.61, 130.81, 146.83, 164.81, 130.81, 164.81],
        harmonics: [523.25, 659.25, 698.46, 783.99]
      },

      // 2. "Defenders of the Deep" / "Water Clone Battle"
      // Driving synth action melody with heroic brass stabs & battle surge
      'defenders_deep': {
        name: 'Defenders of the Deep (Water Clone Battle)',
        tempo: 136,
        leadType: 'sawtooth',
        bassType: 'triangle',
        harmType: 'sine',
        leadVol: 0.130,
        bassVol: 0.175,
        harmVol: 0.080,
        noteAttack: 0.01,
        noteDecay: 0.22,
        bassDecay: 0.32,
        harmDecay: 0.30,
        harmStep: 2,
        bassStep: 4,
        melody: [
          349.23, 415.3, 523.25, 622.25, 698.46, 622.25, 523.25, 415.3,
          466.16, 554.37, 698.46, 830.61, 783.99, 698.46, 622.25, 554.37,
          523.25, 622.25, 783.99, 932.33, 830.61, 783.99, 698.46, 622.25,
          698.46, 830.61, 1046.5, 1244.51, 1108.73, 1046.5, 932.33, 830.61
        ],
        bass: [87.31, 69.3, 77.78, 65.41, 87.31, 103.83, 116.54, 130.81],
        harmonics: [523.25, 698.46, 830.61, 1046.5]
      },

      // 3. "Amethyst's Drum / Opal's Theme"
      // Heavy combat waves, syncopated funk breakbeats, and Opal's mystic recurve bow riffs
      'opal_theme': {
        name: "Amethyst's Drum / Opal's Theme",
        tempo: 144,
        leadType: 'triangle',
        bassType: 'square',
        harmType: 'triangle',
        leadVol: 0.138,
        bassVol: 0.180,
        harmVol: 0.080,
        noteAttack: 0.015,
        noteDecay: 0.26,
        bassDecay: 0.32,
        harmDecay: 0.30,
        harmStep: 2,
        bassStep: 2,
        melody: [
          293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0,
          392.0, 349.23, 293.66, 349.23, 392.0, 466.16, 440.0, 392.0,
          349.23, 293.66, 261.63, 293.66, 349.23, 392.0, 440.0, 523.25,
          587.33, 698.46, 659.25, 587.33, 523.25, 440.0, 392.0, 440.0
        ],
        bass: [73.42, 73.42, 87.31, 98.0, 110.0, 65.41, 73.42, 87.31],
        harmonics: [440.0, 587.33, 698.46, 880.0, 1046.5]
      },

      // 4. "I Am Lapis Lazuli" (The Mirror Gem Suite)
      // Dark, powerful orchestral build with frantic hydrokinetic piano runs
      'mirror_gem': {
        name: 'I Am Lapis Lazuli (The Mirror Gem Suite)',
        tempo: 148,
        leadType: 'triangle',
        bassType: 'sawtooth',
        harmType: 'sine',
        leadVol: 0.138,
        bassVol: 0.185,
        harmVol: 0.080,
        noteAttack: 0.01,
        noteDecay: 0.28,
        bassDecay: 0.38,
        harmDecay: 0.35,
        harmStep: 2,
        bassStep: 4,
        melody: [
          277.18, 329.63, 415.3, 554.37, 622.25, 554.37, 415.3, 329.63,
          261.63, 329.63, 392.0, 523.25, 587.33, 523.25, 392.0, 329.63,
          246.94, 311.13, 369.99, 493.88, 554.37, 493.88, 369.99, 311.13,
          277.18, 415.3, 554.37, 830.61, 932.33, 830.61, 554.37, 415.3
        ],
        bass: [69.3, 65.41, 61.74, 69.3, 73.42, 69.3, 65.41, 69.3],
        harmonics: [415.3, 554.37, 659.25, 830.61, 932.33]
      },

      // 5. "Lapis' Flight / Tower of Water"
      // Soaring strings & immense ocean terraforming theme reaching into the stratosphere
      'lapis_tower': {
        name: "Lapis' Flight / Tower of Water",
        tempo: 126,
        leadType: 'sine',
        bassType: 'triangle',
        harmType: 'sawtooth',
        leadVol: 0.132,
        bassVol: 0.170,
        harmVol: 0.075,
        noteAttack: 0.02,
        noteDecay: 0.36,
        bassDecay: 0.42,
        harmDecay: 0.40,
        harmStep: 2,
        bassStep: 4,
        melody: [
          293.66, 349.23, 440.0, 587.33, 659.25, 587.33, 440.0, 349.23,
          392.0, 466.16, 587.33, 783.99, 698.46, 587.33, 466.16, 392.0,
          440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 523.25, 440.0,
          587.33, 698.46, 880.0, 1174.66, 1046.5, 880.0, 698.46, 659.25
        ],
        bass: [73.42, 98.0, 110.0, 73.42, 87.31, 130.81, 98.0, 73.42],
        harmonics: [440.0, 587.33, 698.46, 880.0, 1174.66]
      },

      // Menu fallback alias
      'menu': {
        name: 'That Distant Shore (Lapis Peace Theme)',
        tempo: 90,
        leadType: 'sine',
        bassType: 'sine',
        harmType: 'triangle',
        leadVol: 0.135,
        bassVol: 0.175,
        harmVol: 0.080,
        noteAttack: 0.02,
        noteDecay: 0.44,
        bassDecay: 0.55,
        harmDecay: 0.50,
        harmStep: 3,
        bassStep: 3,
        melody: [
          261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63,
          220.0, 261.63, 329.63, 392.0, 349.23, 329.63, 293.66, 261.63,
          293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 329.63, 293.66,
          261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 349.23, 329.63
        ],
        bass: [130.81, 164.81, 174.61, 130.81, 146.83, 164.81, 130.81, 164.81],
        harmonics: [523.25, 659.25, 698.46, 783.99]
      },

      // Stage Themes 3..7, 9, 10
      'stage_3': {
        tempo: 92,
        leadType: 'sine',
        bassType: 'triangle',
        harmType: 'sine',
        leadVol: 0.042,
        bassVol: 0.075,
        harmVol: 0.022,
        harmStep: 4,
        bassStep: 4,
        melody: [261.63, 311.13, 392.0, 466.16, 246.94, 293.66, 369.99, 440.0, 233.08, 277.18, 349.23, 415.3, 261.63, 311.13, 392.0, 523.25],
        bass: [65.41, 77.78, 87.31, 98.0],
        harmonics: [392.0, 466.16, 523.25, 622.25]
      },
      'stage_4': {
        tempo: 76,
        leadType: 'sawtooth',
        bassType: 'sine',
        harmType: 'square',
        leadVol: 0.042,
        bassVol: 0.075,
        harmVol: 0.020,
        harmStep: 4,
        bassStep: 4,
        melody: [185.0, 220.0, 277.18, 369.99, 196.0, 246.94, 293.66, 392.0, 207.65, 261.63, 311.13, 415.3, 220.0, 277.18, 329.63, 440.0],
        bass: [92.5, 98.0, 103.83, 110.0],
        harmonics: [369.99, 440.0, 554.37, 739.99]
      },
      'stage_5': {
        tempo: 124,
        leadType: 'square',
        bassType: 'square',
        harmType: 'sawtooth',
        leadVol: 0.044,
        bassVol: 0.075,
        harmVol: 0.022,
        harmStep: 4,
        bassStep: 4,
        melody: [329.63, 392.0, 493.88, 659.25, 369.99, 440.0, 554.37, 739.99, 392.0, 493.88, 587.33, 783.99, 329.63, 493.88, 659.25, 987.77],
        bass: [164.81, 185.0, 196.0, 164.81],
        harmonics: [493.88, 659.25, 783.99, 987.77]
      },
      'stage_6': {
        tempo: 84,
        leadType: 'sine',
        bassType: 'sine',
        harmType: 'triangle',
        leadVol: 0.046,
        bassVol: 0.080,
        harmVol: 0.022,
        harmStep: 4,
        bassStep: 4,
        melody: [246.94, 293.66, 369.99, 493.88, 261.63, 329.63, 392.0, 523.25, 220.0, 277.18, 329.63, 440.0, 246.94, 369.99, 493.88, 739.99],
        bass: [123.47, 130.81, 110.0, 123.47],
        harmonics: [493.88, 587.33, 739.99, 987.77]
      },
      'stage_7': {
        tempo: 120,
        leadType: 'sine',
        bassType: 'sine',
        harmType: 'sine',
        leadVol: 0.042,
        bassVol: 0.065,
        harmVol: 0.020,
        harmStep: 4,
        bassStep: 4,
        melody: [392.0, 466.16, 587.33, 783.99, 349.23, 440.0, 523.25, 698.46, 311.13, 392.0, 466.16, 622.25, 392.0, 523.25, 659.25, 783.99],
        bass: [196.0, 174.61, 155.56, 196.0],
        harmonics: [587.33, 783.99, 932.33, 1174.66]
      },
      // Episode 8: the Homeworld abduction shore — imperial, marching, cold
      'stage_8': {
        tempo: 112,
        leadType: 'sawtooth',
        bassType: 'square',
        harmType: 'triangle',
        leadVol: 0.046,
        bassVol: 0.082,
        harmVol: 0.024,
        harmStep: 3,
        bassStep: 2,
        melody: [261.63, 311.13, 349.23, 311.13, 261.63, 233.08, 220.0, 233.08,
                 261.63, 311.13, 392.0, 349.23, 311.13, 261.63, 233.08, 220.0,
                 207.65, 233.08, 261.63, 311.13, 349.23, 392.0, 349.23, 311.13,
                 261.63, 293.66, 311.13, 349.23, 392.0, 349.23, 311.13, 261.63],
        bass: [130.81, 130.81, 116.54, 110.0, 130.81, 146.83, 130.81, 116.54],
        harmonics: [523.25, 622.25, 698.46, 783.99]
      },
      'stage_9': {
        tempo: 140,
        leadType: 'sawtooth',
        bassType: 'square',
        harmType: 'sawtooth',
        leadVol: 0.046,
        bassVol: 0.080,
        harmVol: 0.024,
        harmStep: 4,
        bassStep: 4,
        melody: [233.08, 277.18, 349.23, 466.16, 220.0, 261.63, 329.63, 440.0, 207.65, 246.94, 311.13, 415.3, 233.08, 349.23, 466.16, 698.46],
        bass: [116.54, 110.0, 103.83, 116.54],
        harmonics: [466.16, 554.37, 698.46, 932.33]
      },
      'stage_10': {
        tempo: 156,
        leadType: 'sawtooth',
        bassType: 'sawtooth',
        harmType: 'square',
        leadVol: 0.052,
        bassVol: 0.090,
        harmVol: 0.028,
        harmStep: 2,
        bassStep: 2,
        melody: [293.66, 369.99, 440.0, 587.33, 329.63, 415.3, 493.88, 659.25, 369.99, 466.16, 554.37, 739.99, 440.0, 554.37, 659.25, 880.0],
        bass: [146.83, 164.81, 185.0, 220.0],
        harmonics: [587.33, 739.99, 880.0, 1174.66]
      }
    };

    if (profiles[trackId]) return profiles[trackId];
    if (trackId === 'practice' || trackId === 'menu' || trackId === 'auto') return profiles['distant_shore'];
    if (trackId === 'fusion') return profiles['opal_theme'];
    if (trackId === 'stage_1') return profiles['defenders_deep'];
    if (trackId === 'stage_2') return profiles['lapis_tower'];
    if (trackId === 'stage_8') return profiles['mirror_gem'];
    return profiles['distant_shore'];
  }

  playTrackById(trackId, isBoss = false, isWaveAlert = false) {
    if (!this.musicEnabled) return;
    this.init();
    this.stopMusic();
    this.currentTrack = trackId;

    const theme = this.getTrackProfile(trackId);
    const effectiveTempo = isBoss ? Math.round(theme.tempo * 1.15) : (isWaveAlert ? Math.round(theme.tempo * 1.08) : theme.tempo);
    const intervalMs = (60 / effectiveTempo) * 250;

    this.musicBeat = 0;
    this.fadeInMusic(1.0);

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicEnabled) return;

      // Active auto-resume check: wake up context seamlessly without waiting for button clicks
      if (this.ctx.state !== 'running') {
        if (!this.isResuming) {
          this.isResuming = true;
          this.ctx.resume().then(() => {
            if (this.ctx && this.ctx.state === 'running') {
              this.onAudioRunning();
            }
          }).catch(() => {}).finally(() => {
            this.isResuming = false;
          });
        }
        return; // Never schedule oscillators while suspended to guarantee 0 jumpscare
      }

      try {
        const t = this.ctx.currentTime;
        const melody = theme.melody;
        const bass = theme.bass;
        const harmonics = theme.harmonics;

        const noteIdx = this.musicBeat % melody.length;
        const freq = melody[noteIdx];

        // 1. Lead voice with smooth attack and musical sustain
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = theme.leadType || 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        const leadVol = (isBoss ? 1.25 : 1.0) * (theme.leadVol || 0.045);
        const leadAttack = theme.noteAttack || 0.015;
        const leadDecay = theme.noteDecay || 0.22;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(leadVol, t + leadAttack);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + leadDecay);

        osc.connect(gain);
        gain.connect(this.getMusicDestination());
        osc.start(t);
        osc.stop(t + leadDecay + 0.02);

        // 2. Chords / Shimmer harmonics with gentle envelope
        const harmStep = theme.harmStep || (isBoss ? 2 : 4);
        if (this.musicBeat % harmStep === 0 && harmonics && harmonics.length > 0) {
          const hOsc = this.ctx.createOscillator();
          const hGain = this.ctx.createGain();
          const hIdx = Math.floor((this.musicBeat / harmStep) % harmonics.length);
          hOsc.type = theme.harmType || 'sine';
          hOsc.frequency.setValueAtTime(harmonics[hIdx], t);
          const hVol = theme.harmVol || (isBoss ? 0.035 : 0.022);
          const hDecay = theme.harmDecay || (harmStep * 0.14);
          hGain.gain.setValueAtTime(0.0001, t);
          hGain.gain.linearRampToValueAtTime(hVol, t + 0.02);
          hGain.gain.exponentialRampToValueAtTime(0.0001, t + hDecay);
          hOsc.connect(hGain);
          hGain.connect(this.getMusicDestination());
          hOsc.start(t);
          hOsc.stop(t + hDecay + 0.02);
        }

        // 3. Driving rhythmic bassline with warm acoustic body
        const bassStep = theme.bassStep || (isBoss ? 2 : 4);
        if (this.musicBeat % bassStep === 0 && bass && bass.length > 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          const bIdx = Math.floor((this.musicBeat / bassStep) % bass.length);
          const bFreq = bass[bIdx];

          bassOsc.type = theme.bassType || 'square';
          bassOsc.frequency.setValueAtTime(bFreq, t);

          const bassVol = (isBoss ? 1.2 : 1.0) * (theme.bassVol || 0.075);
          const bDecay = theme.bassDecay || 0.35;
          bassGain.gain.setValueAtTime(0.0001, t);
          bassGain.gain.linearRampToValueAtTime(bassVol, t + 0.02);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, t + bDecay);

          bassOsc.connect(bassGain);
          bassGain.connect(this.getMusicDestination());
          bassOsc.start(t);
          bassOsc.stop(t + bDecay + 0.02);
        }

        this.musicBeat++;
      } catch (err) {}
    }, intervalMs);
  }

  playStageMusic(stageIndex = 1, isBoss = false) {
    if (!this.musicEnabled) return;
    this.init();
    this.stopMusic();

    const stageNum = Math.max(1, Math.min(10, parseInt(stageIndex, 10) || 1));
    this.lastStageIndex = stageNum;

    // One track per episode, picked for that map's atmosphere. (The old code asked
    // for 'boss_N' and 'stage_8' profiles that never existed, so boss fights and
    // the Homeworld shore silently fell back to the menu theme.)
    const STAGE_TRACKS = {
      1: 'defenders_deep',   // Beach City — bright, heroic boardwalk skirmish
      2: 'lapis_tower',      // Galaxy Warp — vast, drifting, ancient
      3: 'stage_3',          // Kindergarten — hollow, eerie, slow
      4: 'stage_4',          // The Cluster — deep, heavy, ominous
      5: 'stage_5',          // Forge — industrial, hammering, hot
      6: 'stage_6',          // Frozen North — icy, sparse, glassy
      7: 'stage_7',          // Space Zoo — elegant, lilting waltz
      8: 'stage_8',          // Homeworld shore — imperial, marching
      9: 'stage_9',          // Trial / Off-Colors — tense, chromatic
      10: 'stage_10'         // Change Your Mind — full heroic finale
    };
    const trackId = STAGE_TRACKS[stageNum] || 'defenders_deep';
    this.currentTrack = trackId;

    // Only an explicit jukebox pick overrides the level's own theme.
    if (this.bgmOverrideManual && this.selectedBgm && this.selectedBgm !== 'auto') {
      return this.playTrackById(this.selectedBgm, isBoss);
    }
    return this.playTrackById(trackId, isBoss);
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

    if (!this.musicEnabled) return;
    this.init();
    this.stopMusic();

    let targetTrack = (this.selectedBgm && this.selectedBgm !== 'auto') ? this.selectedBgm : null;
    if (!targetTrack) {
      if (trackName === 'practice' || trackName === 'menu') {
        targetTrack = 'distant_shore';
      } else if (trackName === 'fusion') {
        targetTrack = 'opal_theme';
      } else {
        targetTrack = trackName || 'distant_shore';
      }
    }
    return this.playTrackById(targetTrack, false);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGainNode && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.musicGainNode.gain.cancelScheduledValues(t);
        this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, t);
        this.musicGainNode.gain.linearRampToValueAtTime(0, t + 0.08);
      } catch (e) {}
    }
  }
}

// ============================================================================
// 2. PARTICLE & HIT FX SYSTEM
// ============================================================================
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.texts = [];
  }

  addSparkle(x, y, color = '#ffd700', count = 8, speed = 4) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
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
    for (let i = 0; i < count; i++) {
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
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 3.5 + 1.5;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.5,
        life: 1.0,
        decay: 0.025,
        color: i % 2 === 0 ? '#ff94ba' : '#ffffff',
        size: Math.random() * 16 + 10,
        isCloud: true
      });
    }
    this.addSparkle(x, y, '#ffcf33', 14, 6);
  }

  addDamageText(x, y, text, isCrit = false, color = '#ffffff') {
    this.texts.push({
      x, y,
      vy: -2.4,
      text,
      isCrit,
      color: isCrit ? '#ffcf33' : color,
      life: 1.0,
      decay: 0.022
    });
  }

  update() {
    // Keep max active particles reasonable to ensure buttery smooth 60 FPS
    if (this.particles.length > 160) {
      this.particles.splice(0, this.particles.length - 160);
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

  draw(ctx) {
    ctx.save();
    for (const p of this.particles) {
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
    name: 'STEVEN OVERDRIVE',
    short: 'STEVEN',
    msg: '⚡ STEVEN OVERDRIVE: DIAMOND HYPER STATE!',
    color: '#ff1493'
  },
  garnet: {
    name: 'GARNET OVERDRIVE',
    short: 'GARNET',
    msg: '🔥 GARNET OVERDRIVE: DUAL RESONANCE!',
    color: '#ef4444'
  },
  amethyst: {
    name: 'AMETHYST OVERDRIVE',
    short: 'AMETHYST',
    msg: '🟣 AMETHYST OVERDRIVE: VOLCANIC QUARTZ!',
    color: '#a855f7'
  },
  pearl: {
    name: 'PEARL OVERDRIVE',
    short: 'PEARL',
    msg: '⚔️ PEARL OVERDRIVE: PRISMATIC RADIANCE!',
    color: '#22d3ee'
  },
  bismuth: {
    name: 'BISMUTH OVERDRIVE',
    short: 'BISMUTH',
    msg: '🌋 BISMUTH OVERDRIVE: MOLTEN FORGEMASTER!',
    color: '#f97316'
  },
  peridot: {
    name: 'PERIDOT OVERDRIVE',
    short: 'PERIDOT',
    msg: '⚡ PERIDOT OVERDRIVE: FERROKINETIC OVERCLOCK!',
    color: '#22c55e'
  },
  lapis: {
    name: 'LAPIS OVERDRIVE',
    short: 'LAPIS',
    msg: '🌊 LAPIS OVERDRIVE: OCEAN EMPRESS HYDRO-SURGE!',
    color: '#0ea5e9'
  },
  rose: {
    name: 'ROSE OVERDRIVE',
    short: 'ROSE',
    msg: '🌹 ROSE OVERDRIVE: CELESTIAL DIAMOND MANDALA!',
    color: '#f43f5e'
  },
  connie: {
    name: 'CONNIE OVERDRIVE',
    short: 'CONNIE',
    msg: '⚔️ CONNIE OVERDRIVE: KNIGHT OF THE CRYSTAL GEMS!',
    color: '#ec4899'
  },
  jasper: {
    name: 'JASPER OVERDRIVE',
    short: 'JASPER',
    msg: '💥 JASPER OVERDRIVE: SUPREME BETA QUARTZ JUGGERNAUT!',
    color: '#ea580c'
  }
};

// 3. PARALLAX ENVIRONMENT & SCENERY
// ============================================================================
class EnvironmentRenderer {
  constructor(canvasWidth, canvasHeight, stageWidth = 2600) {
    this.width = canvasWidth;
    this.canvasWidth = canvasWidth;
    this.stageWidth = stageWidth;
    this.height = canvasHeight;
    this.groundY = canvasHeight - 120; // 600px
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

  update() {
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

    // Parallax Twinkling Stars
    ctx.fillStyle = '#ffffff';
    for (const s of this.stars) {
      const sx = ((s.x - cameraX * 0.08) % this.canvasWidth + this.canvasWidth) % this.canvasWidth;
      const alpha = 0.4 + 0.6 * Math.sin(s.twinkle);
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.beginPath();
      ctx.arc(sx, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Parallax Drifting Clouds
    for (const c of this.clouds) {
      const cx = ((c.x - cameraX * 0.18) % (this.canvasWidth + 240) + (this.canvasWidth + 240)) % (this.canvasWidth + 240) - 120;
      this.drawCloud(ctx, cx, c.y, c.scale, stageIndex);
    }

    // Parallax Distant Silhouettes
    const bgOffset = cameraX * 0.32;
    if (stageIndex === 1) {
      // Beach City Temple Cliff & Distant Ferris Wheel
      ctx.fillStyle = 'rgba(76, 29, 149, 0.35)';
      ctx.beginPath();
      ctx.arc(1100 - bgOffset, this.groundY - 150, 95, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(1040 - bgOffset, this.groundY - 120, 120, 120);
    } else if (stageIndex === 3) {
      // Prime Kindergarten Distant Injectors
      ctx.fillStyle = 'rgba(88, 28, 135, 0.35)';
      for (const drillX of [400, 1000, 1600, 2200]) {
        const dx = drillX - bgOffset;
        ctx.beginPath();
        ctx.moveTo(dx - 25, this.groundY - 180);
        ctx.lineTo(dx + 25, this.groundY - 180);
        ctx.lineTo(dx, this.groundY - 20);
        ctx.closePath();
        ctx.fill();
      }
    } else if (stageIndex === 8) {
      // Hovering Homeworld Warship
      ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
      ctx.beginPath();
      ctx.arc(900 - bgOffset, 120, 140, 0, Math.PI * 2);
      ctx.fill();
    } else if (stageIndex === 10) {
      // White Diamond Mecha Silhouette
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.arc(950 - bgOffset, 90, 150, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw World-Space Elements (Ground & Platforms across full 2600px width)
  drawForeground(ctx, stageIndex, isPractice = false) {
    ctx.save();

    if (stageIndex === 0 || isPractice) {
      // Practice Mode: Pearl's Sky Spire Arena
      ctx.fillStyle = 'rgba(241, 245, 249, 0.22)';
      for (let cx = 80; cx < this.stageWidth; cx += 220) {
        ctx.fillRect(cx, 160, 36, this.groundY - 160);
        ctx.fillRect(cx - 8, 150, 52, 12);
        ctx.fillRect(cx - 8, this.groundY - 12, 52, 12);
      }
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 5);
      ctx.fillStyle = '#ffd700';
      this.drawDiamondInsignia(ctx, this.stageWidth / 2, this.groundY + 35, 22);
    } else if (stageIndex === 1) {
      // Stage 1: Beach City Boardwalk & Beach Piers
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      for (let x = 0; x < this.stageWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, this.groundY);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, this.groundY - 3, this.stageWidth, 5);
    } else if (stageIndex === 2) {
      // Stage 2: Galaxy Warp & Ancient Gem Spire
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 6);
      for (const padX of [350, 900, 1450, 2050]) {
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(padX, this.groundY + 25, 38, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (stageIndex === 3) {
      // Stage 3: The Prime Kindergarten
      ctx.fillStyle = '#1e1136';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 6);
    } else if (stageIndex === 4) {
      // Stage 4: Subterranean Mantle Core (Magma Veins & Geo-Weapon)
      ctx.fillStyle = '#262626';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 6);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, this.groundY + 20);
      for (let mx = 200; mx <= this.stageWidth; mx += 200) {
        ctx.lineTo(mx, this.groundY + 15 + Math.sin(mx) * 15);
      }
      ctx.stroke();
    } else if (stageIndex === 5) {
      // Stage 5: Bismuth's Burning Forge & Anvils
      ctx.fillStyle = '#431407';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, this.groundY - 5, this.stageWidth, 7);
      for (const ax of [300, 850, 1400, 1950, 2350]) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(ax - 35, this.groundY - 45, 70, 45);
        ctx.fillRect(ax - 48, this.groundY - 58, 96, 16);
      }
    } else if (stageIndex === 6) {
      // Stage 6: The Frozen North & Glacial Peaks
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, this.groundY - 5, this.stageWidth, 7);
    } else if (stageIndex === 7) {
      // Stage 7: Pink Diamond's Deep Space Zoo
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 6);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.lineWidth = 4;
      for (const domeX of [350, 950, 1550, 2150]) {
        ctx.beginPath();
        ctx.arc(domeX, this.groundY, 110, Math.PI, 0);
        ctx.stroke();
      }
    } else if (stageIndex === 8) {
      // Stage 8: Homeworld Abduction Shore
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 6);
    } else if (stageIndex === 9) {
      // Stage 9: Homeworld Courtroom & Underground
      ctx.fillStyle = '#022c22';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, this.groundY - 4, this.stageWidth, 6);
    } else {
      // Stage 10: Change Your Mind - Era 3 Climax
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, this.groundY, this.stageWidth, this.height - this.groundY);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, this.groundY - 5, this.stageWidth, 7);
      for (let dx = 400; dx < this.stageWidth; dx += 600) {
        ctx.fillStyle = '#ffd700';
        this.drawDiamondInsignia(ctx, dx, this.groundY + 30, 20);
      }
    }

    // Render multi-tiered platforms across the wide 2600px stage
    const platforms = this.getPlatformsForStage(stageIndex, isPractice || stageIndex === 0);
    for (const p of platforms) {
      this.drawPlatform(ctx, p);
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
    ctx.fillStyle = stage === 1 ? 'rgba(255, 230, 240, 0.45)' : 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.arc(22, -10, 28, 0, Math.PI * 2);
    ctx.arc(50, 0, 24, 0, Math.PI * 2);
    ctx.arc(26, 12, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getPlatformsForStage(stageIndex, isPractice = false) {
    const pType = (stageIndex === 1) ? 'wood' :
                  (stageIndex === 3 || stageIndex === 5 || stageIndex === 8 || stageIndex === 9) ? 'metal' :
                  (stageIndex === 4) ? 'obsidian' : 'stone';

    // Expansive Multi-Tiered Arena Platforms spanning full 2600px width:
    // Left Wing (X: 140 - 750) • Center Dais & Spire (X: 950 - 1650) • Right Wing (X: 1850 - 2460)
    return [
      // Left Wing: Low stepped platform & high sniper perch
      { x: 140, y: 475, width: 260, height: 24, type: pType },
      { x: 420, y: 360, width: 240, height: 24, type: pType },
      { x: 220, y: 240, width: 200, height: 22, type: pType },

      // Center Arena: Wide central dais, high bridge & sky perch
      { x: 880, y: 460, width: 320, height: 26, type: pType },
      { x: 1220, y: 330, width: 300, height: 26, type: pType },
      { x: 1540, y: 460, width: 300, height: 26, type: pType },
      { x: 1150, y: 200, width: 220, height: 22, type: pType },

      // Right Wing: Stepped terraces & flyer watchtower
      { x: 1880, y: 360, width: 260, height: 24, type: pType },
      { x: 2160, y: 475, width: 280, height: 24, type: pType },
      { x: 2220, y: 240, width: 220, height: 22, type: pType }
    ];
  }

  drawPlatform(ctx, plat) {
    ctx.save();
    const x = plat.x;
    const y = plat.y;
    const w = plat.width;
    const h = plat.height;

    if (plat.type === 'wood') {
      // Weathered Boardwalk Timber Slabs with Posts
      ctx.fillStyle = '#5c2b09';
      ctx.fillRect(x + 22, y + h, 14, 130);
      ctx.fillRect(x + w - 36, y + h, 14, 130);
      ctx.fillStyle = '#3f1d05';
      ctx.fillRect(x + 22, y + h, 3, 130);
      ctx.fillRect(x + w - 36, y + h, 3, 130);

      const woodGrad = ctx.createLinearGradient(x, y, x, y + h);
      woodGrad.addColorStop(0, '#d97706');
      woodGrad.addColorStop(0.35, '#b45309');
      woodGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = woodGrad;
      ctx.strokeStyle = '#2d1406';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 4, y + 2, w - 8, 3);

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      for (let px = x + 40; px < x + w - 10; px += 45) {
        ctx.beginPath();
        ctx.moveTo(px, y + 3);
        ctx.lineTo(px, y + h - 2);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(px - 10, y + 7, 2, 0, Math.PI * 2);
        ctx.arc(px - 10, y + h - 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (plat.type === 'stone') {
      // Ancient Gem Sky Spire Runic Marble Slab
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fillRect(x + 4, y + h, w - 8, 6);

      const stoneGrad = ctx.createLinearGradient(x, y, x, y + h);
      stoneGrad.addColorStop(0, '#f8fafc');
      stoneGrad.addColorStop(0.35, '#cbd5e1');
      stoneGrad.addColorStop(1, '#64748b');
      ctx.fillStyle = stoneGrad;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      // Glowing Cyan Gem Runic Line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x + 14, y + h / 2);
      ctx.lineTo(x + w - 14, y + h / 2);
      ctx.stroke();

      // Golden Gem Corner Brackets
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 2, y + 2, 8, 8);
      ctx.fillRect(x + w - 10, y + 2, 8, 8);
      ctx.fillRect(x + 2, y + h - 10, 8, 8);
      ctx.fillRect(x + w - 10, y + h - 10, 8, 8);
    } else if (plat.type === 'metal') {
      // Prime Kindergarten / Forge Industrial Metal Slab
      const metalGrad = ctx.createLinearGradient(x, y, x, y + h);
      metalGrad.addColorStop(0, '#475569');
      metalGrad.addColorStop(0.5, '#334155');
      metalGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = metalGrad;
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 4, y + 2, w - 8, 3);

      // Yellow & Black Diagonal Hazard Stripes
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

      ctx.fillStyle = '#cbd5e1';
      for (let rx = x + 16; rx < x + w; rx += 36) {
        ctx.beginPath();
        ctx.arc(rx, y + 8, 2, 0, Math.PI * 2);
        ctx.fill();
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

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 6);
      ctx.lineTo(x + 40, y + h - 5);
      ctx.lineTo(x + 95, y + 4);
      ctx.lineTo(x + 140, y + h - 4);
      ctx.lineTo(x + w - 10, y + 6);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + 40, y + h - 5, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 140, y + h - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
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
const TYPE_META = {
  normal:  { label: 'NORMAL',  color: '#a8a878', icon: '⭐' },
  fight:   { label: 'FIGHT',   color: '#c03028', icon: '🥊' },
  flying:  { label: 'FLYING',  color: '#a890f0', icon: '🪶' },
  psychic: { label: 'PSYCHIC', color: '#f85888', icon: '🔮' },
  fairy:   { label: 'FAIRY',   color: '#ee99ac', icon: '💗' },
  steel:   { label: 'STEEL',   color: '#9fa8c7', icon: '⚙️' },
  electr:  { label: 'ELECTR',  color: '#d9a800', icon: '⚡' },
  water:   { label: 'WATER',   color: '#6890f0', icon: '💧' },
  fire:    { label: 'FIRE',    color: '#e8762c', icon: '🔥' },
  dark:    { label: 'DARK',    color: '#7c6250', icon: '🌑' },
  dragon:  { label: 'DRAGON',  color: '#7038f8', icon: '🐉' }
};

// attacker -> { defender: multiplier }. Anything unspecified is 1x.
const TYPE_CHART = {
  normal:  { steel: 0.5 },
  fight:   { normal: 2, steel: 2, dark: 2, flying: 0.5, psychic: 0.5, fairy: 0.5 },
  flying:  { fight: 2, steel: 0.5, electr: 0.5 },
  psychic: { fight: 2, steel: 0.5, psychic: 0.5, dark: 0 },
  fairy:   { fight: 2, dragon: 2, dark: 2, steel: 0.5 },
  steel:   { fairy: 2, steel: 0.5, water: 0.5, electr: 0.5, fire: 0.5 },
  electr:  { water: 2, flying: 2, dragon: 0.5, electr: 0.5 },
  water:   { fire: 2, water: 0.5, dragon: 0.5 },
  fire:    { steel: 2, water: 0.5, fire: 0.5, dragon: 0.5 },
  dark:    { psychic: 2, fight: 0.5, dark: 0.5, fairy: 0.5 },
  dragon:  { dragon: 2, fairy: 0, steel: 0.5 }
};

// Canon-flavoured rider effects, one per damage type.
const TYPE_STATUS = {
  fight:   { id: 'stagger',  label: 'STAGGERED',   color: '#c03028' },
  psychic: { id: 'dazed',    label: 'DAZED',       color: '#f85888' },
  fairy:   { id: 'charmed',  label: 'CHARMED',     color: '#ee99ac' },
  steel:   { id: 'cracked',  label: 'ARMOR CRACK', color: '#9fa8c7' },
  electr:  { id: 'shocked',  label: 'OVERLOADED',  color: '#f8d030' },
  water:   { id: 'soaked',   label: 'SOAKED',      color: '#6890f0' },
  fire:    { id: 'scorched', label: 'SCORCHED',    color: '#f08030' },
  dark:    { id: 'corrupted',label: 'CORRUPTED',   color: '#7c6250' },
  dragon:  { id: 'shattered',label: 'SHATTERED',   color: '#7038f8' },
  flying:  { id: 'launched', label: 'LAUNCHED',    color: '#a890f0' },
  normal:  { id: 'focused',  label: 'FOCUSED',     color: '#a8a878' }
};

// Which element each of a hero's three moves actually channels.
// J = primary weapon/combo, K = special, L = signature skill.
const HERO_MOVE_TYPES = {
  steven:   { j: 'fairy',   k: 'fairy',   l: 'psychic' }, // Rose's shield + empathic healing
  garnet:   { j: 'fight',   k: 'fight',   l: 'electr'  }, // gauntlets + electrokinesis
  amethyst: { j: 'fight',   k: 'fight',   l: 'dark'    }, // whips + Violet geysers
  pearl:    { j: 'fight',   k: 'steel',   l: 'psychic' }, // spear thrust + Holo-Pearl
  bismuth:  { j: 'steel',   k: 'steel',   l: 'fire'    }, // forge hammer + magma
  peridot:  { j: 'steel',   k: 'electr',  l: 'steel'   }, // ferrokinesis + robonoid
  lapis:    { j: 'water',   k: 'water',   l: 'flying'  }, // hydrokinesis + water wings
  rose:     { j: 'fight',   k: 'fairy',   l: 'fairy'   }, // sword + bubble/healing tears
  connie:   { j: 'normal',  k: 'fight',   l: 'normal'  }, // Rose's sword fencing
  jasper:   { j: 'fight',   k: 'dragon',  l: 'fight'   }  // crash helmet + quartz fury
};

const FUSION_MOVE_TYPES = {
  stevonnie:      { j: 'fight', k: 'fairy',   l: 'fairy'   },
  smoky:          { j: 'fight', k: 'fairy',   l: 'dark'    },
  rainbow2:       { j: 'fairy', k: 'psychic', l: 'psychic' },
  sunstone:       { j: 'fight', k: 'fairy',   l: 'fire'    },
  sugilite:       { j: 'fight', k: 'fight',   l: 'electr'  },
  sardonyx:       { j: 'fight', k: 'steel',   l: 'psychic' },
  opal:           { j: 'fight', k: 'psychic', l: 'fairy'   },
  malachite:      { j: 'water', k: 'water',   l: 'dragon'  },
  rainbowClassic: { j: 'fairy', k: 'fairy',   l: 'psychic' }
};

// Projectiles are tagged with the element of the move that spawned them.
const PROJECTILE_TYPE_ELEMENTS = {
  stevenShield: 'fairy', roseShield: 'fairy', roseShockwave: 'fairy',
  garnetGauntlet: 'fight', giantGauntletSlam: 'fight', seismicShockwave: 'fight',
  amethystSpinDashHit: 'fight', purpleGeyser: 'dark', magneticVortex: 'steel',
  pearlLaser: 'steel', holoPearl: 'psychic', bismuthAnvil: 'steel', moltenShockwave: 'fire',
  tidalWave: 'water', hydroFist: 'water', connieSwordBeam: 'fight', connieShadowSlash: 'normal',
  jasperCrashHelmet: 'dragon', jasperSpinDashHit: 'fight',
  comboRosePulse: 'fairy', comboGauntletQuake: 'fight', comboWhipCyclone: 'dark',
  comboSpearFlurry: 'steel', comboAnvilEcho: 'steel', comboMagneticBurst: 'steel',
  comboTidalLash: 'water', comboRoseThorn: 'fairy', comboCrescentSlash: 'fight',
  comboSeismicSlam: 'fight', flaskRobonoid: 'steel'
};

// Enemy defensive typings (corrupted gems skew DARK; forged/robotic units skew STEEL).
const ENEMY_TYPES = {
  centipeetle: ['dark'], acid_centipeetle: ['dark'], winged_centipeetle: ['dark', 'flying'],
  blade_quartz: ['fight'], cluster: ['dark'], ice_monster: ['water'], snow_monster: ['water'],
  ice_gargoyle: ['water', 'flying'], spire_harpy: ['flying', 'dark'],
  volcanic_firebird: ['fire', 'flying'], forge_automaton: ['steel'],
  destabilizer_soldier: ['steel'], robonoid_scout: ['steel', 'electr'],
  carnelian_enforcer: ['fight'], obsidian: ['dark'],
  boss_spitter: ['dark'], boss_centipeetle: ['dark'], boss_ice_guardian: ['water', 'flying'],
  boss_cluster_titan: ['dark'], boss_cluster_core: ['dark', 'steel'],
  boss_forge_guardian: ['steel', 'fire'], boss_jasper: ['fight', 'dragon'],
  boss_quartz_beast: ['fight'], boss_agate_warden: ['psychic', 'fight'],
  boss_topaz_fusion: ['fight', 'steel'], boss_robonoid_titan: ['steel', 'electr'],
  boss_white_diamond: ['psychic', 'fairy'], boss_giant_bird: ['flying', 'dark'],
  boss_jasper_dummy: ['fight']
};

function getTypeMeta(type) {
  return TYPE_META[(type || '').toLowerCase()] || TYPE_META.normal;
}

function typeMultiplier(attackType, defenderTypes) {
  if (!attackType || !defenderTypes || !defenderTypes.length) return 1;
  const row = TYPE_CHART[String(attackType).toLowerCase()] || {};
  let mult = 1;
  for (const def of defenderTypes) {
    const key = String(def).toLowerCase();
    mult *= (row[key] !== undefined ? row[key] : 1);
  }
  return mult;
}

function typeEffectLabel(mult) {
  if (mult <= 0) return { text: 'IMMUNE!', color: '#94a3b8' };
  if (mult >= 2) return { text: 'SUPER EFFECTIVE!', color: '#facc15' };
  if (mult <= 0.5) return { text: 'RESISTED…', color: '#94a3b8' };
  return null;
}

const HERO_COMBO_PROFILES = {
  steven: {
    label: 'Rose Punch Combo',
    cadence: [0.20, 0.19, 0.32],
    damage: [1.0, 1.15, 1.6],
    range: [0, 4, 12],
    knock: [0.95, 1.0, 1.5],
    finisher: { label: 'STAR SHIELD PULSE!', type: 'comboRosePulse', damage: 16, width: 130, height: 90, speed: 300, knockX: 300, knockY: -150, color: '#ff6097' }
  },
  garnet: {
    label: 'Gauntlet Boxing Combo',
    cadence: [0.24, 0.22, 0.38],
    damage: [1.05, 1.2, 1.75],
    range: [0, 3, 10],
    knock: [1.1, 1.15, 1.7],
    finisher: { label: 'GAUNTLET QUAKE!', type: 'comboGauntletQuake', damage: 20, width: 170, height: 70, speed: 260, knockX: 380, knockY: -260, color: '#ef4444' }
  },
  amethyst: {
    label: 'Dual Whip Flurry',
    cadence: [0.16, 0.15, 0.26],
    damage: [0.95, 1.05, 1.5],
    range: [6, 10, 18],
    knock: [0.85, 0.9, 1.35],
    finisher: { label: 'WHIP CYCLONE!', type: 'comboWhipCyclone', damage: 15, width: 160, height: 100, speed: 220, knockX: 260, knockY: -180, color: '#c084fc' }
  },
  pearl: {
    label: 'Spear Thrust Combo',
    cadence: [0.15, 0.14, 0.26],
    damage: [0.9, 0.95, 1.5],
    range: [8, 12, 20],
    knock: [0.8, 0.85, 1.3],
    finisher: { label: 'SPEAR FLURRY!', type: 'comboSpearFlurry', count: 3, spread: 24, radius: 13, damage: 9, speed: 380, knockX: 240, knockY: -120, color: '#22d3ee' }
  },
  bismuth: {
    label: 'Forge Hammer Slams',
    cadence: [0.27, 0.26, 0.42],
    damage: [1.1, 1.25, 1.85],
    range: [0, 2, 8],
    knock: [1.2, 1.3, 1.8],
    finisher: { label: 'ANVIL ECHO!', type: 'comboAnvilEcho', damage: 22, width: 180, height: 80, speed: 250, knockX: 420, knockY: -280, color: '#f97316' }
  },
  peridot: {
    label: 'Ferrokinetic Scrap Barrage',
    cadence: [0.18, 0.17, 0.30],
    damage: [0.95, 1.05, 1.45],
    range: [10, 14, 22],
    knock: [0.75, 0.8, 1.2],
    finisher: { label: 'MAGNETIC BURST!', type: 'comboMagneticBurst', damage: 14, width: 150, height: 120, speed: 200, knockX: 210, knockY: -190, color: '#84cc16' }
  },
  lapis: {
    label: 'Hydro Whip Lash',
    cadence: [0.17, 0.16, 0.28],
    damage: [1.0, 1.1, 1.55],
    range: [8, 12, 20],
    knock: [0.9, 0.95, 1.4],
    finisher: { label: 'TIDAL LASH!', type: 'comboTidalLash', damage: 16, width: 170, height: 90, speed: 300, knockX: 320, knockY: -220, color: '#38bdf8' }
  },
  rose: {
    label: 'Broadsword & Shield Sweep',
    cadence: [0.24, 0.22, 0.36],
    damage: [1.05, 1.2, 1.7],
    range: [0, 4, 10],
    knock: [1.05, 1.15, 1.6],
    finisher: { label: 'ROSE THORN SWEEP!', type: 'comboRoseThorn', damage: 18, width: 170, height: 90, speed: 280, knockX: 340, knockY: -200, color: '#f43f5e' }
  },
  connie: {
    label: "Knight's Fencing Combo",
    cadence: [0.16, 0.15, 0.27],
    damage: [0.95, 1.05, 1.55],
    range: [8, 14, 24],
    knock: [0.85, 0.9, 1.4],
    finisher: { label: 'CRESCENT SLASH!', type: 'comboCrescentSlash', damage: 15, width: 160, height: 70, speed: 420, knockX: 300, knockY: -160, color: '#ec4899' }
  },
  jasper: {
    label: 'Beta Quartz Brawler',
    cadence: [0.28, 0.26, 0.44],
    damage: [1.15, 1.3, 1.95],
    range: [0, 2, 8],
    knock: [1.25, 1.35, 1.9],
    finisher: { label: 'SEISMIC HAYMAKER!', type: 'comboSeismicSlam', damage: 24, width: 190, height: 70, speed: 240, knockX: 460, knockY: -300, color: '#ea580c' }
  }
};

// Fused heroes get a heavier, slower chain — a fusion hits like a boss.
const FUSION_COMBO_PROFILE = {
  cadence: [0.22, 0.20, 0.34],
  damage: [1.0, 1.15, 1.65],
  knock: [1.0, 1.15, 1.7]
};

// Per-fusion power identity: Sugilite hits hardest but shortest, Sardonyx lasts
// longest, Malachite trades the heal for raw damage (canon: an unstable fusion).
const FUSION_POWER = {
  stevonnie: { nuke: 1.0, duration: 12.0, heal: 1, title: 'SWORD & SHIELD' },
  smoky: { nuke: 1.05, duration: 12.0, heal: 1, title: 'YO-YO TEMPEST' },
  rainbow2: { nuke: 0.95, duration: 12.5, heal: 1, title: 'PARASOL PRISM' },
  sunstone: { nuke: 1.05, duration: 12.0, heal: 1, title: 'SOLAR GAUNTLET' },
  sugilite: { nuke: 1.25, duration: 11.5, heal: 1, title: 'FLAIL CATACLYSM' },
  sardonyx: { nuke: 1.0, duration: 12.8, heal: 1, title: 'SHOWSTOPPER' },
  opal: { nuke: 0.95, duration: 12.2, heal: 1, title: 'ARROW RAIN' },
  malachite: { nuke: 1.3, duration: 11.5, heal: 0, title: 'GLACIAL TIDE' },
  rainbowClassic: { nuke: 1.0, duration: 12.2, heal: 1, title: 'ROSE MANDALA' }
};

class PlayerHero {
  constructor(groundY, playerId = 'p1', stageWidth = 2600) {
    this.groundY = (typeof groundY === 'number' && !isNaN(groundY)) ? groundY : 600;
    this.playerId = playerId;
    this.stageWidth = stageWidth;
    this.x = (playerId === 'p2') ? 340 : 200;
    this.currentPlatform = null;
    this.landSquash = 0;      // 1 right after a fall, decays into a squash/stretch
    this.runDustTimer = 0;
    this.wasGrounded = true;
    this.dropThroughTimer = 0;
    this.y = groundY;
    this.vx = 0;
    this.vy = 0;
    this.width = 46;
    this.height = 76;
    this.facing = 1;
    this.isGrounded = true;

    this.activeChar = 'steven';

    this.isAttacking = false;
    this.attackFrame = 0;
    this.attackCombo = 0;
    this.attackType = 'J';
    this.attackCooldown = 0;
    this.specialCooldown = 0;
    this.skillCooldown = 0;

    // Freebuff combo-chain state: timing window, reach, damage and finisher
    this.comboStep = 0;
    this.comboStepTimer = 0;
    this.comboLinkBonus = 0;
    this.attackDamageMult = 1;
    this.attackRangeBonus = 0;
    this.attackKnockMult = 1;

    // Steven Bubble Shield state (Fully movable!)
    this.isShielding = false;
    this.bubbleTimer = 0;

    // Amethyst Spin Dash state (Smooth & Fluid!)
    this.isSpinDashing = false;
    this.spinDashTimer = 0;

    // Action Animation System (Moving animations for Punch, Throw, Shield, Heal, Skills)
    this.actionType = null; // 'punch', 'throw', 'shield', 'heal', 'skill'
    this.actionTimer = 0;
    this.actionDuration = 0.28;

    this.invulnerableTimer = 0;
    this.walkAnim = 0;

    // Steven Universe Future: Pink Overdrive / Diamond Hyper State
    this.isPinkOverdrive = false;
    this.pinkOverdriveTimer = 0;
    this.afterimages = [];
    this.afterimageTimer = 0;

    // Universal Dodge / Evasive Dash System (Dedicated animation for all 8 Gems!)
    this.isDodging = false;
    this.dodgeTimer = 0;
    this.dodgeDuration = 0.30;
    this.dodgeCooldown = 0;
    this.dodgeDirection = 1;
    this.dodgeVx = 0;

    // Acrobatics & Jump Enhancements (Reach platforms effortlessly!)
    this.canDoubleJump = true;
    this.jumpDebounce = false;

    // Canonical Gem Fusion Attributes
    this.isFusion = false;
    this.fusionKey = null;
    this.fusionData = null;
    this.isMergedInFusion = false;
    this.hasSynergyBuff = false;

    // Lore-Accurate Knockout & Gem Poofing System
    this.isFallen = false;
    this.fallenType = null; // 'lie_down' for Steven/Connie, 'poofed' for Gems
    this.fallenTimer = 0;
  }

  switchCharacter(charName, audioEngine, particles) {
    const valid = ['steven', 'garnet', 'amethyst', 'pearl', 'bismuth', 'peridot', 'lapis', 'rose', 'connie', 'jasper'];
    if (valid.includes(charName)) {
      this.activeChar = charName;
      this.isShielding = false;
      this.isSpinDashing = false;
      this.isFusion = false;
      this.fusionKey = null;
      this.fusionData = null;
      this.isMergedInFusion = false;
      this.hasSynergyBuff = false;
      this.isFallen = false;
      this.fallenType = null;
      this.fallenTimer = 0;
      this.actionType = null;
      this.actionTimer = 0;
      this.vx = 0;
      if (audioEngine) audioEngine.playSfx('switch');
      if (particles) {
        particles.addSparkle(this.x, this.y - 40, '#ffd700', 16, 5);
        particles.addPoof(this.x, this.y - 35, '#ff94ba');
      }
    }
  }

  // --- GEM COMBAT TYPES -----------------------------------------------------
  // The element channelled by a given move slot ('j' | 'k' | 'l').
  getMoveType(slot = 'j') {
    const key = String(slot || 'j').toLowerCase();
    if (this.isFusion && this.fusionData) {
      const fusionSet = FUSION_MOVE_TYPES[this.fusionData.id];
      if (fusionSet && fusionSet[key]) return fusionSet[key];
    }
    const set = HERO_MOVE_TYPES[this.activeChar] || HERO_MOVE_TYPES.steven;
    return set[key] || 'normal';
  }

  // Canonical typing from the roster dossier (lowercased for the matchup chart).
  getTypeList() {
    // A fusion carries both partners' gem types, so either partner's element gets STAB.
    if (this.isFusion && this.fusionData && Array.isArray(this.fusionData.gems)) {
      const merged = [];
      this.fusionData.gems.forEach(gemId => {
        const d = (typeof GUARDIAN_DATA !== 'undefined') ? GUARDIAN_DATA[gemId] : null;
        ((d && d.types) || []).forEach(t => {
          const key = String(t).toLowerCase();
          if (!merged.includes(key)) merged.push(key);
        });
      });
      if (merged.length) return merged;
    }
    const data = (typeof GUARDIAN_DATA !== 'undefined' && GUARDIAN_DATA[this.activeChar]) || null;
    const raw = (data && data.types) || ['FAIRY', 'PSYCHIC'];
    return raw.map(t => String(t).toLowerCase());
  }

  // Same-type attack bonus, exactly like the games the chart comes from.
  getStabMultiplier(slot = 'j') {
    const moveType = this.getMoveType(slot);
    return this.getTypeList().includes(moveType) ? 1.2 : 1.0;
  }

  activatePinkOverdrive(audioOrDuration = 12.0, particles = null) {
    this.isPinkOverdrive = true;
    this.pinkOverdriveTimer = typeof audioOrDuration === 'number' ? audioOrDuration : 12.0;
    this.invulnerableTimer = 1.0;
    const audio = (audioOrDuration && typeof audioOrDuration.playSfx === 'function') ? audioOrDuration : null;
    if (audio) audio.playSfx('overdrive');
    if (particles) {
      const titles = {
        steven: { msg: '⚡ PINK OVERDRIVE (SU FUTURE)!', color: '#ff1493' },
        garnet: { msg: '🔥 DUAL RESONANCE (RUBY & SAPPHIRE)!', color: '#ef4444' },
        amethyst: { msg: '🟣 VOLCANIC QUARTZ SUPERCHARGED!', color: '#a855f7' },
        pearl: { msg: '⚔️ PRISMATIC HOLOGRAM RADIANCE!', color: '#22d3ee' },
        bismuth: { msg: '🌋 MOLTEN FORGEMASTER OVERDRIVE!', color: '#f97316' },
        peridot: { msg: '⚡ FERROKINETIC OVERCLOCK!', color: '#22c55e' },
        lapis: { msg: '🌊 OCEAN EMPRESS HYDRO-SURGE!', color: '#0ea5e9' },
        rose: { msg: '🌹 CELESTIAL DIAMOND MANDALA!', color: '#f43f5e' }
      };
      const t = titles[this.activeChar] || titles.steven;
      particles.addDamageText(this.x, this.y - 75, `${t.msg} (2X POWER)`, true, t.color);
      particles.addSparkle(this.x, this.y - 35, '#ffffff', 30, 8);
      particles.addPoof(this.x, this.y - 35, t.color);
    }
  }

  deactivatePinkOverdrive(audioEngine, particles) {
    this.isPinkOverdrive = false;
    this.pinkOverdriveTimer = 0;
    if (particles) {
      particles.addDamageText(this.x, this.y - 65, 'OVERDRIVE ENDED', false, '#cbd5e1');
    }
  }

  revive(audioEngine, particles) {
    this.isFallen = false;
    this.fallenType = null;
    this.fallenTimer = 0;
    this.invulnerableTimer = 2.0;
    this.vx = 0;
    this.vy = 0;
    this.isAttacking = false;
    this.isShielding = false;
    this.isSpinDashing = false;
    this.isDodging = false;
    if (audioEngine) {
      try {
        audioEngine.playSfx('stageClear');
      } catch (e) {}
    }
    if (particles) {
      particles.addSparkle(this.x, this.y - 35, '#ffffff', 25, 8);
      particles.addSparkle(this.x, this.y - 35, '#38bdf8', 20, 6);
      particles.addDamageText(this.x, this.y - 65, '✨ REVIVED FOR NEXT STAGE! ✨', false, '#38bdf8');
    }
  }

  update(dt, input, audioEngine, particles, projectiles, pickups, platforms = []) {
    // Lore-Accurate Knockout / Poofed state freeze: Skip inputs and actions
    if (this.isFallen) {
      this.fallenTimer += dt;
      this.vx = 0;
      this.isAttacking = false;
      this.isShielding = false;
      this.isSpinDashing = false;
      this.isDodging = false;
      this.invulnerableTimer = 999;

      if (!this.isGrounded) {
        this.vy += 1200 * dt;
        this.y += this.vy * dt;
        if (platforms && platforms.length > 0 && this.vy >= 0) {
          for (const plat of platforms) {
            if (this.x >= plat.x - 16 && this.x <= plat.x + plat.width + 16) {
              if (this.y >= plat.y) {
                this.y = plat.y;
                this.vy = 0;
                this.isGrounded = true;
                this.currentPlatform = plat;
                break;
              }
            }
          }
        }
        if (this.y >= this.groundY) {
          this.y = this.groundY;
          this.vy = 0;
          this.isGrounded = true;
          this.currentPlatform = null;
        }
      }
      return;
    }

    // Cooldown decrements
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.specialCooldown > 0) this.specialCooldown -= dt;
    if (this.skillCooldown > 0) this.skillCooldown -= dt;
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

    // Combo chain window: let it lapse and the next press starts from step 1 again
    if (this.comboStepTimer > 0) {
      this.comboStepTimer -= dt;
      if (this.comboStepTimer <= 0) {
        this.comboStep = 0;
        this.attackCombo = 0;
        this.comboLinkBonus = 0;
        this.attackDamageMult = 1;
        this.attackRangeBonus = 0;
        this.attackKnockMult = 1;
      }
    }

    // Dodge Action Execution Check
    if (input.dodge && this.dodgeCooldown <= 0 && !this.isDodging && !this.isSpinDashing) {
      this.executeDodge(audioEngine, particles, input);
    }

    // Active Dodge Slide Physics & Invulnerability
    if (this.isDodging) {
      this.dodgeTimer -= dt;
      this.invulnerableTimer = Math.max(this.invulnerableTimer, 0.16);
      this.vx = this.dodgeVx * Math.max(0.28, this.dodgeTimer / this.dodgeDuration);

      this.afterimageTimer += dt;
      if (this.afterimageTimer >= 0.05 && this.afterimages.length < 5) {
        this.afterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          life: 0.22,
          maxLife: 0.22,
          isDodge: true
        });
      }

      if (this.dodgeTimer <= 0) {
        this.isDodging = false;
        this.vx = 0;
      }
    }

    // Pink Overdrive State (Steven Universe Future Diamond Power-Up!)
    if (this.isPinkOverdrive) {
      this.pinkOverdriveTimer -= dt;
      // 3x Faster Cooldown Recovery
      if (this.attackCooldown > 0) this.attackCooldown -= dt * 2;
      if (this.specialCooldown > 0) this.specialCooldown -= dt * 2;
      if (this.skillCooldown > 0) this.skillCooldown -= dt * 2;

      // Spawn glowing pink ghost afterimages (Throttled for ultra smooth 60 FPS)
      this.afterimageTimer += dt;
      if (this.afterimageTimer >= 0.12 && this.afterimages.length < 3) {
        this.afterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          life: 0.24,
          maxLife: 0.24
        });
      }

      if (this.pinkOverdriveTimer <= 0) {
        this.deactivatePinkOverdrive(audioEngine, particles);
      }
    }

    // Update afterimages
    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      this.afterimages[i].life -= dt;
      if (this.afterimages[i].life <= 0) {
        this.afterimages.splice(i, 1);
      }
    }

    // Steven Bubble Shield Timer (Deflects damage while allowing movement)
    if (this.isShielding) {
      this.bubbleTimer -= dt;
      this.invulnerableTimer = 0.2;
      if (this.bubbleTimer <= 0) {
        this.isShielding = false;
      }
    }

    // Amethyst Spin Dash Timer (Fast dash, auto-recovers!)
    if (this.isSpinDashing) {
      this.spinDashTimer -= dt;
      this.invulnerableTimer = 0.2;
      particles.addSparkle(this.x, this.y - 20, '#c084fc', 2, 2);
      if (this.spinDashTimer <= 0) {
        this.isSpinDashing = false;
        this.vx = 0; // Strictly clear dash velocity on completion!
      }
    }

    // Movement Speeds for 8 Canon Gems
    let speed = 280;
    if (this.activeChar === 'pearl') speed = 330;
    else if (this.activeChar === 'lapis') speed = 320;
    else if (this.activeChar === 'connie') speed = 315;
    else if (this.activeChar === 'amethyst') speed = 310;
    else if (this.activeChar === 'peridot') speed = 300;
    else if (this.activeChar === 'steven') speed = 280;
    else if (this.activeChar === 'rose') speed = 275;
    else if (this.activeChar === 'bismuth') speed = 270;
    else if (this.activeChar === 'garnet') speed = 265;
    else if (this.activeChar === 'jasper') speed = 265;

    // Pink Overdrive accelerates speed by 1.85x! (Harmony Synergy grants +25%!)
    if (this.isPinkOverdrive) speed *= 1.85;
    if (this.hasSynergyBuff) speed *= 1.25;
    if (this.isFusion) speed *= 1.12;   // a fusion moves with both partners' weight
    if (this.isSpinDashing) speed = 520;

    // Footfall dust while running, and a landing squash when we hit the floor.
    if (this.isGrounded && Math.abs(this.vx) > 40) {
      this.runDustTimer -= dt;
      if (this.runDustTimer <= 0) {
        this.runDustTimer = 0.16;
        if (particles && particles.addSparkle) {
          particles.addSparkle(this.x - this.facing * 9, this.y - 3, '#cbd5e1', 2, 1.4);
        }
      }
    } else {
      this.runDustTimer = 0;
    }
    if (!this.wasGrounded && this.isGrounded) {
      this.landSquash = 1;
      if (particles && particles.addSparkle) {
        particles.addSparkle(this.x, this.y - 4, '#e2e8f0', 6, 2.2);
      }
    }
    this.wasGrounded = this.isGrounded;

    // Fluid Horizontal Movement (NEVER AUTO-RUNS: STRICT ZERO VELOCITY WHEN IDLE!)
    if (this.isDodging) {
      // Movement velocity is handled smoothly by dodge physics
    } else if (input.left) {
      this.vx = -speed;
      this.facing = -1;
      this.walkAnim += dt * 14;
    } else if (input.right) {
      this.vx = speed;
      this.facing = 1;
      this.walkAnim += dt * 14;
    } else {
      if (this.isSpinDashing) {
        this.vx = this.facing * 480;
      } else {
        this.vx = 0;
        this.walkAnim = 0;
      }
    }

    // Platform Drop-Down & Timers
    if (this.dropThroughTimer > 0) {
      this.dropThroughTimer -= dt;
    }

    // Drop down through platform when Down/S is held
    if (this.currentPlatform && (input.down || (input.down && input.jump))) {
      this.dropThroughTimer = 0.32;
      this.y = this.currentPlatform.y + 10;
      this.vy = 180;
      this.isGrounded = false;
      this.currentPlatform = null;
    }

    // Enhanced Jump & Double Jump System (Every platform reached smoothly!)
    if (input.jump && !this.jumpDebounce && !input.down) {
      if (this.isGrounded) {
        this.vy = -680; // Powerful crisp leap: reaches 192px apex
        this.isGrounded = false;
        this.canDoubleJump = true;
        this.currentPlatform = null;
        this.jumpDebounce = true;
        if (audioEngine) audioEngine.playSfx('jump');
        if (particles) particles.addSparkle(this.x, this.y, '#ffffff', 8, 3);
      } else if (this.canDoubleJump) {
        this.vy = -600; // Gem Aerial Flutter / Double Jump
        this.canDoubleJump = false;
        this.jumpDebounce = true;
        if (audioEngine) audioEngine.playSfx('jump');
        if (particles) {
          particles.addSparkle(this.x, this.y - 15, '#fde047', 14, 5);
          particles.addSparkle(this.x, this.y - 15, '#c084fc', 12, 4);
        }
      }
    }
    if (!input.jump) {
      this.jumpDebounce = false;
    }

    // Gravity & Position Updates
    const prevY = this.y;
    this.vy += 1200 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Platform collision check (One-way jump-through platforms)
    let landedOnPlat = false;
    if (platforms && platforms.length > 0 && this.vy >= 0 && this.dropThroughTimer <= 0) {
      for (const plat of platforms) {
        if (this.x >= plat.x - 16 && this.x <= plat.x + plat.width + 16) {
          if (prevY <= plat.y + 6 && this.y >= plat.y) {
            this.y = plat.y;
            this.vy = 0;
            this.isGrounded = true;
            this.canDoubleJump = true;
            this.currentPlatform = plat;
            landedOnPlat = true;
            break;
          }
        }
      }
    }

    // Walk off platform check
    if (this.currentPlatform && !landedOnPlat) {
      const inX = this.x >= this.currentPlatform.x - 16 && this.x <= this.currentPlatform.x + this.currentPlatform.width + 16;
      if (!inX && this.y < this.groundY) {
        this.currentPlatform = null;
        this.isGrounded = false;
      }
    }

    // Main Stage Ground Collision
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.vy = 0;
      this.isGrounded = true;
      this.canDoubleJump = true;
      this.currentPlatform = null;
    }

    // Stage bounds (Widescreen 2600px Arena)
    const maxX = this.stageWidth || 2600;
    if (this.x < 35) this.x = 35;
    if (this.x > maxX - 35) this.x = maxX - 35;

    // Motion blur ghost afterimages during evasive dodge
    if (this.isDodging) {
      this.dodgeAfterimageTimer = (this.dodgeAfterimageTimer || 0) + dt;
      if (this.dodgeAfterimageTimer >= 0.05 && this.afterimages.length < 5) {
        this.dodgeAfterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          life: 0.22,
          maxLife: 0.22
        });
      }
    }

    // Attack Triggers (J, K, L)
    if (input.attack && this.attackCooldown <= 0) {
      this.executeAttackJ(audioEngine, particles, projectiles);
    }
    if (input.special && this.specialCooldown <= 0) {
      this.executeSpecialK(audioEngine, particles, projectiles);
    }
    if (input.skill && this.skillCooldown <= 0) {
      this.executeSkillL(audioEngine, particles, pickups, projectiles);
    }

    // Guard / Shielding Stance: Steven & Rose can hold Down/S to raise protective shield
    if ((input.down || input.shield) && (this.activeChar === 'steven' || this.activeChar === 'rose' || this.activeChar === 'connie')) {
      this.isShielding = true;
      this.actionType = 'shield';
      this.vx = 0;
    } else if (this.bubbleTimer <= 0) {
      if (this.actionType === 'shield' && !input.skill) {
        this.isShielding = false;
      }
    }

    // Attack animation frame calculation & action countdown
    if (this.actionTimer > 0) {
      this.actionTimer -= dt;
      this.attackFrame = (1 - this.actionTimer / this.actionDuration) * 3;
      if (this.actionTimer <= 0) {
        this.actionTimer = 0;
        this.isAttacking = false;
        this.attackFrame = 0;
        if (this.actionType !== 'shield' || (!input.down && !input.shield && this.bubbleTimer <= 0)) {
          this.actionType = null;
        }
      }
    } else {
      this.isAttacking = false;
      this.attackFrame = 0;
    }
  }

  // --- UNIVERSAL DODGE / EVASIVE DASH (ALL 8 GEMS) ---
  executeDodge(audioEngine, particles, input = null) {
    if (this.dodgeCooldown > 0 || this.isDodging || this.isSpinDashing) return;

    this.isDodging = true;
    this.dodgeDuration = 0.30;
    this.dodgeTimer = this.dodgeDuration;
    this.dodgeCooldown = 0.55;
    this.invulnerableTimer = 0.38; // Generous i-frames throughout dodge

    // Determine dodge direction
    let dir = this.facing;
    if (input && input.left && !input.right) {
      dir = -1;
      this.facing = -1;
    } else if (input && input.right && !input.left) {
      dir = 1;
      this.facing = 1;
    }
    this.dodgeDirection = dir;
    this.dodgeVx = dir * 520;

    // Interrupt normal attack into dodge (responsive dodge cancel)
    this.isAttacking = false;
    this.actionType = 'dodge';

    if (audioEngine) audioEngine.playSfx('whoosh');

    if (particles) {
      const c = this.activeChar;
      if (c === 'steven') {
        particles.addSparkle(this.x, this.y - 20, '#ff94ba', 12, 4);
      } else if (c === 'garnet') {
        particles.addSparkle(this.x, this.y - 20, '#ef4444', 8, 3);
        particles.addSparkle(this.x, this.y - 20, '#38bdf8', 8, 3);
      } else if (c === 'amethyst') {
        particles.addSparkle(this.x, this.y - 15, '#c084fc', 14, 5);
      } else if (c === 'pearl') {
        particles.addSparkle(this.x, this.y - 30, '#a5f3fc', 12, 4);
      } else if (c === 'bismuth') {
        particles.addSparkle(this.x, this.groundY - 5, '#f97316', 16, 5);
      } else if (c === 'peridot') {
        particles.addSparkle(this.x, this.groundY - 5, '#84cc16', 14, 4);
      } else if (c === 'lapis') {
        particles.addSparkle(this.x, this.y - 25, '#38bdf8', 16, 5);
      } else if (c === 'rose') {
        particles.addRosePetals(this.x, this.y - 25, 8);
        particles.addSparkle(this.x, this.y - 25, '#fbcfe8', 12, 4);
      } else if (c === 'connie') {
        particles.addSparkle(this.x, this.y - 25, '#f472b6', 14, 5);
        particles.addSparkle(this.x, this.y - 25, '#93c5fd', 10, 4);
      } else if (c === 'jasper') {
        particles.addSparkle(this.x, this.groundY - 10, '#ea580c', 16, 6);
        particles.addSparkle(this.x, this.groundY - 10, '#fbbf24', 12, 4);
      }
    }
  }

  // --- [J] ATTACK COMBO (10 GUARDIANS) ---
  executeAttackJ(audioEngine, particles, projectiles) {
    this.isAttacking = true;
    this.attackType = 'J';
    this.actionType = 'punch';

    // Freebuff: per-hero chain with real timing windows and finisher payoffs
    const profile = (this.isFusion && this.fusionData) ? FUSION_COMBO_PROFILE : (HERO_COMBO_PROFILES[this.activeChar] || HERO_COMBO_PROFILES.steven);
    this.comboStep = (this.comboStepTimer > 0) ? (this.comboStep + 1) % 3 : 0;
    const isFinisher = (this.comboStep === 2);
    const perfectLink = (this.comboStepTimer > 0.12 && this.comboStep > 0);
    this.comboLinkBonus = perfectLink ? 0.12 : 0;
    this.attackCombo = this.comboStep;
    this.comboStepTimer = profile.cadence[this.comboStep] + 0.34;
    this.attackDamageMult = profile.damage[this.comboStep] * (1 + this.comboLinkBonus);
    this.attackRangeBonus = profile.range ? profile.range[this.comboStep] : 0;
    this.attackKnockMult = profile.knock[this.comboStep];
    this.actionDuration = isFinisher ? 0.34 : (this.comboStep === 0 ? 0.26 : 0.24);
    this.actionTimer = this.actionDuration;
    this.attackCooldown = profile.cadence[this.comboStep];

    if (perfectLink && particles) {
      particles.addDamageText(this.x, this.y - 92, '⭐ PERFECT LINK!', false, '#fde047');
    }

    if (isFinisher && projectiles && !this.isFusion) {
      this.spawnComboFinisher(audioEngine, particles, projectiles);
      if (typeof this.onComboFinisher === 'function') this.onComboFinisher(this.activeChar, perfectLink, this);
    }

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
    }

    if (this.activeChar === 'steven') {
      audioEngine.playSfx('hit');
      particles.addRosePetals(this.x + this.facing * 40, this.y - 35, 5);
      particles.addSparkle(this.x + this.facing * 35, this.y - 30, '#ff94ba', 8, 3);
    } else if (this.activeChar === 'garnet') {
      audioEngine.playSfx('punch');
      particles.addDamageText(this.x + this.facing * 45, this.y - 50, this.attackCombo === 2 ? 'KAPOW!' : 'POW!', true, '#e11d48');
      particles.addSparkle(this.x + this.facing * 45, this.y - 35, '#fbbf24', 12, 5);
    } else if (this.activeChar === 'amethyst') {
      // Spiked Dual Whip Flurry
      audioEngine.playSfx('whip');
      particles.addSparkle(this.x + this.facing * 60, this.y - 35, '#c084fc', 14, 5);
    } else if (this.activeChar === 'pearl') {
      audioEngine.playSfx('laser');
      particles.addSparkle(this.x + this.facing * 55, this.y - 42, '#38bdf8', 9, 5);
    } else if (this.activeChar === 'bismuth') {
      audioEngine.playSfx('hammer');
      particles.addDamageText(this.x + this.facing * 45, this.y - 50, 'CLANG!', true, '#f97316');
      particles.addSparkle(this.x + this.facing * 50, this.y - 35, '#f59e0b', 14, 5);
    } else if (this.activeChar === 'peridot') {
      // Ferrokinetic Metal Claws
      audioEngine.playSfx('metal');
      particles.addSparkle(this.x + this.facing * 50, this.y - 38, '#84cc16', 14, 5);
    } else if (this.activeChar === 'lapis') {
      audioEngine.playSfx('water');
      particles.addSparkle(this.x + this.facing * 55, this.y - 36, '#38bdf8', 12, 5);
    } else if (this.activeChar === 'rose') {
      audioEngine.playSfx('sword');
      particles.addRosePetals(this.x + this.facing * 45, this.y - 40, 6);
      particles.addSparkle(this.x + this.facing * 45, this.y - 35, '#fbcfe8', 10, 4);
    } else if (this.activeChar === 'connie') {
      // Knight's Fencing Combo: Lunge Thrust -> Crescent Slash -> Overhead Cleave!
      audioEngine.playSfx('sword');
      particles.addSparkle(this.x + this.facing * 50, this.y - 36, '#f472b6', 14, 5);
      particles.addDamageText(this.x + this.facing * 45, this.y - 50, this.attackCombo === 2 ? 'EN GARDE!' : 'SLASH!', true, '#ec4899');
    } else if (this.activeChar === 'jasper') {
      // Beta Quartz Brawler Combo: Gut Punch -> Hammer Fist -> Seismic Haymaker!
      audioEngine.playSfx('punch');
      audioEngine.playSfx('hammer');
      particles.addSparkle(this.x + this.facing * 50, this.y - 32, '#ea580c', 16, 6);
      particles.addSparkle(this.x + this.facing * 50, this.groundY - 5, '#fbbf24', 12, 4);
      particles.addDamageText(this.x + this.facing * 50, this.y - 55, this.attackCombo === 2 ? '💥 OBLITERATE!' : (this.attackCombo === 1 ? 'CRUSH!' : 'WHAM!'), true, '#ea580c');
    }
  }

  // Freebuff finisher: each Guardian's third hit releases their signature weapon
  // technique as a short-range wave, flurry or shockwave based on canon.
  spawnComboFinisher(audioEngine, particles, projectiles) {
    const profile = HERO_COMBO_PROFILES[this.activeChar];
    if (!profile || !profile.finisher || !projectiles) return;
    const f = profile.finisher;
    const dir = this.facing;
    const count = f.count || 1;
    const dmgScale = (this.isPinkOverdrive ? 2.0 : 1.0) * (this.hasSynergyBuff ? 1.25 : 1.0);

    for (let i = 0; i < count; i++) {
      const offsetY = count > 1 ? (i - (count - 1) / 2) * (f.spread || 0) : 0;
      const proj = {
        x: this.x + dir * 48,
        y: this.y - 38 + offsetY,
        vx: dir * (f.speed || 320),
        vy: 0,
        radius: f.radius || 0,
        width: f.width || 0,
        height: f.height || 0,
        damage: Math.round((f.damage || 14) * dmgScale),
        type: f.type,
        color: f.color || '#fbbf24',
        life: 0.18,
        hitText: f.label,
        knockX: f.knockX || 280,
        knockY: f.knockY || -120,
        hurtTime: 0.4
      };
      projectiles.push(proj);
    }

    if (audioEngine) {
      try { audioEngine.playSfx('whoosh'); } catch (e) {}
    }
    if (particles) {
      particles.addDamageText(this.x + dir * 72, this.y - 64, f.label || 'FINISHER!', true, f.color || '#fde047');
      particles.addSparkle(this.x + dir * 60, this.y - 34, f.color || '#fde047', 18, 6);
    }
  }

  // --- [K] SPECIAL WEAPON ATTACK (8 GEMS) ---
  executeSpecialK(audioEngine, particles, projectiles) {
    this.specialCooldown = 0.85;
    this.isAttacking = true;
    this.attackType = 'K';
    this.actionType = 'throw';
    this.actionDuration = 0.38;
    this.actionTimer = 0.38;
    const dmgMult = (this.isPinkOverdrive ? 2.0 : 1.0) * (this.isFusion ? 1.35 : 1.0) * (this.hasSynergyBuff ? 1.25 : 1.0);

    if (this.isFusion && this.fusionData) {
      this.executeFusionSpecialK(audioEngine, particles, projectiles, dmgMult);
      return;
    }

    if (this.activeChar === 'steven') {
      // Rose's Shield Throw (Bounces & Ricochets smoothly)
      audioEngine.playSfx('shield');
      projectiles.push({
        x: this.x + this.facing * 25,
        y: this.y - 36,
        vx: this.facing * 520,
        vy: 0,
        radius: 18,
        damage: Math.round(34 * dmgMult),
        type: 'stevenShield',
        color: '#ff6097',
        bounces: 3,
        startX: this.x,
        life: 1.8
      });
      particles.addRosePetals(this.x, this.y - 35, 6);
    } else if (this.activeChar === 'garnet') {
      // Rocket Gauntlet Blast!
      audioEngine.playSfx('rocket');
      projectiles.push({
        x: this.x + this.facing * 30,
        y: this.y - 38,
        vx: this.facing * 560,
        vy: 0,
        radius: 20,
        damage: Math.round(50 * dmgMult),
        type: 'garnetGauntlet',
        color: '#e11d48',
        life: 1.0
      });
      particles.addSparkle(this.x, this.y - 38, '#f59e0b', 14, 5);
    } else if (this.activeChar === 'amethyst') {
      // Authentic Sonic Spin Dash (Quartz Buzzsaw Ball)
      audioEngine.playSfx('spindash');
      this.isSpinDashing = true;
      this.spinDashTimer = 0.55;
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      this.vx = this.facing * 540;
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.groundY - 24,
        vx: this.facing * 540,
        vy: 0,
        radius: 28,
        damage: Math.round(45 * dmgMult),
        type: 'amethystSpinDashHit',
        color: '#c084fc',
        life: 0.55
      });
      particles.addSparkle(this.x, this.groundY - 20, '#e9d5ff', 16, 5);
    } else if (this.activeChar === 'pearl') {
      // Spear Laser Beam (3 Piercing Cyan Lasers!)
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k++) {
        projectiles.push({
          x: this.x + this.facing * 40,
          y: this.y - 44 + k * 10,
          vx: this.facing * 680,
          vy: k * 30,
          radius: 12,
          damage: Math.round(36 * dmgMult),
          type: 'pearlLaser',
          color: '#38bdf8',
          life: 1.1
        });
      }
      particles.addSparkle(this.x + this.facing * 40, this.y - 44, '#67e8f9', 12, 5);
    } else if (this.activeChar === 'bismuth') {
      // Anvil Hand Launch
      audioEngine.playSfx('hammer');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 38,
        vx: this.facing * 520,
        vy: 0,
        radius: 22,
        damage: Math.round(50 * dmgMult),
        type: 'bismuthAnvil',
        color: '#f97316',
        life: 1.1
      });
      particles.addSparkle(this.x + this.facing * 35, this.y - 38, '#ea580c', 12, 4);
    } else if (this.activeChar === 'peridot') {
      // Authentic Ferrokinetic Scrap Salvo (Levitates 3 Magnetic Scraps!)
      this.actionDuration = 0.45;
      this.actionTimer = 0.45;
      audioEngine.playSfx('metal');
      const scrapTypes = ['metalGirder', 'scrapGear', 'trashLid'];
      for (let s = 0; s < 3; s++) {
        setTimeout(() => {
          projectiles.push({
            x: this.x + this.facing * (35 + s * 22),
            y: this.y - 48 - (s * 8),
            vx: this.facing * (500 + s * 50),
            vy: (s - 1) * 35,
            radius: 18,
            damage: Math.round(24 * dmgMult),
            type: scrapTypes[s],
            color: '#84cc16',
            life: 1.1
          });
          particles.addSparkle(this.x + this.facing * 35, this.y - 42, '#a3e635', 12, 4);
        }, s * 85);
      }
    } else if (this.activeChar === 'lapis') {
      // Giant Hydro-Fist
      audioEngine.playSfx('water');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 40,
        vx: this.facing * 540,
        vy: 0,
        radius: 24,
        damage: Math.round(46 * dmgMult),
        type: 'hydroFist',
        color: '#38bdf8',
        life: 1.2
      });
      particles.addSparkle(this.x + this.facing * 35, this.y - 40, '#0284c7', 16, 5);
    } else if (this.activeChar === 'rose') {
      // Thorny Bramble Shield Throw
      audioEngine.playSfx('shield');
      projectiles.push({
        x: this.x + this.facing * 30,
        y: this.y - 38,
        vx: this.facing * 520,
        vy: 0,
        radius: 20,
        damage: Math.round(40 * dmgMult),
        type: 'roseShield',
        color: '#f43f5e',
        bounces: 2,
        startX: this.x,
        life: 1.6
      });
      particles.addRosePetals(this.x, this.y - 35, 8);
    } else if (this.activeChar === 'connie') {
      // Pink Sword Flying Arc (Crescent Sword Beam Projectile)
      audioEngine.playSfx('sword');
      audioEngine.playSfx('laser');
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 38,
        vx: this.facing * 580,
        vy: 0,
        width: 38,
        height: 64,
        radius: 24,
        damage: Math.round(42 * dmgMult),
        type: 'connieSwordBeam',
        color: '#f472b6',
        life: 1.2
      });
      particles.addSparkle(this.x + this.facing * 40, this.y - 38, '#fbcfe8', 16, 6);
    } else if (this.activeChar === 'jasper') {
      // Crash Helmet Comet Charge (Battering Ram Projectile / Rush)
      audioEngine.playSfx('rocket');
      audioEngine.playSfx('hammer');
      this.actionType = 'throw';
      this.actionDuration = 0.45;
      this.actionTimer = 0.45;
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.y - 44,
        vx: this.facing * 620,
        vy: 0,
        width: 60,
        height: 52,
        radius: 28,
        damage: Math.round(52 * dmgMult),
        type: 'jasperCrashHelmet',
        color: '#ea580c',
        life: 0.95
      });
      particles.addSparkle(this.x + this.facing * 35, this.y - 44, '#f97316', 18, 6);
    }
  }

  // --- [L] SIGNATURE GEM SKILL (8 GEMS) ---
  executeSkillL(audioEngine, particles, pickups = [], projectiles = []) {
    if (!Array.isArray(pickups)) pickups = [];
    if (!Array.isArray(projectiles)) projectiles = [];
    this.skillCooldown = 3.2;
    this.isAttacking = true;
    this.attackType = 'L';
    const dmgMult = (this.isPinkOverdrive ? 2.0 : 1.0) * (this.isFusion ? 1.4 : 1.0) * (this.hasSynergyBuff ? 1.25 : 1.0);

    if (this.isFusion && this.fusionData) {
      this.executeFusionSkillL(audioEngine, particles, pickups, projectiles, dmgMult);
      return;
    }

    if (this.activeChar === 'steven') {
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
      });

      projectiles.push({
        x: this.x - 70,
        y: this.y - 50,
        width: 140,
        height: 60,
        damage: Math.round(35 * dmgMult),
        type: 'bubbleShockwave',
        life: 0.35
      });
      particles.addRosePetals(this.x, this.y - 35, 12);
      particles.addSparkle(this.x, this.y - 35, '#ff94ba', 20, 6);
    } else if (this.activeChar === 'garnet') {
      // Giant Gauntlets Seismic Slam! (Enlarges twin gauntlets to titanic size!)
      this.actionType = 'skill';
      this.actionDuration = 0.50;
      this.actionTimer = 0.50;
      audioEngine.playSfx('hammer');
      audioEngine.playSfx('lightning');
      particles.addSparkle(this.x, this.groundY, '#fbbf24', 32, 9);
      particles.addSparkle(this.x, this.groundY, '#e11d48', 32, 9);
      particles.addDamageText(this.x, this.y - 70, '💥 GIANT GAUNTLETS SLAM!', true, '#fbbf24');
      projectiles.push({
        x: this.x - 120,
        y: this.groundY - 30,
        width: 240,
        height: 45,
        damage: Math.round(65 * dmgMult),
        type: 'giantGauntletSlam',
        life: 0.35
      });
    } else if (this.activeChar === 'amethyst') {
      // Authentic Lore: Dual Whip Ground Slam & Violet Energy Geysers (4 Rising Eruptions!)
      this.actionType = 'skill';
      this.actionDuration = 0.60;
      this.actionTimer = 0.60;
      audioEngine.playSfx('whip');
      audioEngine.playSfx('rocket');
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          projectiles.push({
            x: this.x + this.facing * (50 + i * 55),
            y: this.groundY,
            width: 58,
            height: 120,
            radius: 34,
            damage: Math.round(42 * dmgMult),
            type: 'purpleGeyser',
            color: '#a855f7',
            life: 0.60,
            maxLife: 0.60
          });
          if (particles) {
            particles.addSparkle(this.x + this.facing * (50 + i * 55), this.groundY - 15, '#d8b4fe', 16, 5);
            particles.addSparkle(this.x + this.facing * (50 + i * 55), this.groundY - 30, '#fde047', 12, 4);
          }
        }, i * 85);
      }
    } else if (this.activeChar === 'pearl') {
      // Holo-Pearl Training Clone Summon! ("Steven the Sword Fighter")
      this.actionType = 'skill';
      this.actionDuration = 0.45;
      this.actionTimer = 0.45;
      audioEngine.playSfx('laser');
      const isOd = this.isPinkOverdrive;
      projectiles.push({
        x: this.x + this.facing * 45,
        y: this.y - 42,
        vx: this.facing * 460,
        vy: 0,
        facing: this.facing,
        radius: 32,
        damage: Math.round(55 * dmgMult),
        type: 'holoPearl',
        color: isOd ? '#f472b6' : '#67e8f9',
        isOverdrive: isOd,
        life: 2.4,
        maxLife: 2.4,
        hitCooldowns: {}
      });
      const quote = isOd ? "⚔️ 'HOLO-PEARL: MAXIMUM OVERDRIVE!'" : "⚔️ 'DO YOU WISH TO ENGAGE IN COMBAT?!'";
      particles.addDamageText(this.x + this.facing * 40, this.y - 75, quote, true, isOd ? '#f472b6' : '#38bdf8');
      particles.addSparkle(this.x + this.facing * 45, this.y - 42, isOd ? '#f472b6' : '#a5f3fc', 20, 6);
    } else if (this.activeChar === 'bismuth') {
      // Molten Forge Breaking Point!
      this.actionType = 'skill';
      this.actionDuration = 0.50;
      this.actionTimer = 0.50;
      audioEngine.playSfx('hammer');
      particles.addSparkle(this.x, this.groundY, '#f97316', 30, 9);
      projectiles.push({
        x: this.x - 110,
        y: this.groundY - 28,
        width: 220,
        height: 40,
        damage: Math.round(65 * dmgMult),
        type: 'moltenShockwave',
        life: 0.35
      });
    } else if (this.activeChar === 'peridot') {
      // Authentic Lore: Homeworld Flask Robonoid Drone & Magnetic EMP Vortex Pulse
      this.actionType = 'skill';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('metal');
      audioEngine.playSfx('laser');
      // 1. Deploy Flask Robonoid Walking Tripod Drone
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.groundY - 18,
        vx: this.facing * 340,
        vy: 0,
        radius: 20,
        damage: Math.round(45 * dmgMult),
        type: 'flaskRobonoid',
        color: '#84cc16',
        life: 1.8
      });
      // 2. High-Voltage EMP Vortex Field
      projectiles.push({
        x: this.x - 110,
        y: this.y - 60,
        width: 220,
        height: 80,
        damage: Math.round(55 * dmgMult),
        type: 'magneticVortex',
        life: 0.5
      });
      particles.addSparkle(this.x, this.y - 35, '#a3e635', 25, 7);
    } else if (this.activeChar === 'lapis') {
      // Water Wings Tidal Surge! Towering 140px Tsunami Sweeps Battlefield!
      this.actionType = 'skill';
      this.actionDuration = 0.60;
      this.actionTimer = 0.60;
      audioEngine.playSfx('water');
      const waveFacing = this.facing;
      projectiles.push({
        x: this.x + waveFacing * 40,
        y: ((typeof this.groundY === 'number' && !isNaN(this.groundY)) ? this.groundY : 600) - 65,
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
      particles.addDamageText(this.x, this.y - 80, '🌊 TIDAL SURGE!', true, '#0284c7');
    } else if (this.activeChar === 'rose') {
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
      });
      pickups.push({
        x: this.x + 35,
        y: this.groundY - 12,
        type: 'cookie',
        life: 15
      });
      projectiles.push({
        x: this.x,
        y: this.y - 45,
        width: 190,
        height: 70,
        damage: Math.round(50 * dmgMult),
        type: 'roseShockwave',
        life: 0.35
      });
      particles.addRosePetals(this.x, this.y - 35, 20);
      particles.addSparkle(this.x, this.y - 35, '#fbcfe8', 26, 8);
    } else if (this.activeChar === 'connie') {
      // Sword Stance: Pearl's Disciple (Instant Shadow Step Multi-Slash Across Arena!)
      this.actionType = 'skill';
      this.actionDuration = 0.55;
      this.actionTimer = 0.55;
      audioEngine.playSfx('whoosh');
      audioEngine.playSfx('sword');
      this.invulnerableTimer = 0.55;
      const dashDist = this.facing * 260;
      const startX = this.x;
      this.x = Math.max(45, Math.min((this.stageWidth || 2600) - 45, this.x + dashDist));

      for (let s = 1; s <= 3; s++) {
        projectiles.push({
          x: startX + (dashDist / 4) * s,
          y: this.y - 38,
          width: 80,
          height: 60,
          damage: Math.round(58 * dmgMult),
          type: 'connieShadowSlash',
          life: 0.35
        });
      }
      particles.addDamageText(this.x, this.y - 70, '⚔️ KNIGHT\'S FLURRY!', true, '#f472b6');
      particles.addSparkle(this.x, this.y - 35, '#ff94ba', 24, 7);
      particles.addSparkle(startX, this.y - 35, '#f472b6', 20, 6);
    } else if (this.activeChar === 'jasper') {
      // Quartz Tornado Spin Dash (Heavy Spiked Beta Buzzsaw with Flaming Shockwaves!)
      audioEngine.playSfx('spindash');
      this.isSpinDashing = true;
      this.spinDashTimer = 0.65;
      this.actionDuration = 0.65;
      this.actionTimer = 0.65;
      this.invulnerableTimer = 0.65;
      this.vx = this.facing * 580;
      projectiles.push({
        x: this.x + this.facing * 35,
        y: this.groundY - 24,
        vx: this.facing * 580,
        vy: 0,
        radius: 34,
        damage: Math.round(65 * dmgMult),
        type: 'jasperSpinDashHit',
        color: '#ea580c',
        life: 0.65
      });
      particles.addDamageText(this.x, this.y - 70, '🔥 QUARTZ TORNADO!', true, '#ea580c');
      particles.addSparkle(this.x, this.groundY - 15, '#fbbf24', 22, 7);
      particles.addSparkle(this.x, this.groundY - 15, '#ea580c', 22, 7);
    }
  }

  executeFusionSpecialK(audioEngine, particles, projectiles, dmgMult = 1.0) {
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

  takeDamage(amount, particles, audioEngine) {
    if (this.isFallen) return false;
    if (this.invulnerableTimer > 0 || this.isShielding || this.isSpinDashing) return false;
    this.invulnerableTimer = 1.25; // Generous 1.25s iframes to prevent rapid tick deaths!
    const finalDamage = this.isPinkOverdrive ? Math.max(1, Math.round(amount * 0.5)) : amount;
    audioEngine.playSfx('hit');
    particles.addDamageText(this.x, this.y - 65, `-${finalDamage} HP`, true, '#ef4444');
    particles.addSparkle(this.x, this.y - 35, '#ef4444', 12, 4);
    return finalDamage;
  }

  draw(ctx) {
    if (this.isMergedInFusion) return;

    if (this.isFallen) {
      this.drawFallenHero(ctx);
      return;
    }

    if (this.isFusion && this.fusionData) {
      this.drawFusionHero(ctx);
      return;
    }

    // 1. Draw Overdrive Afterimages (Custom colored per character)
    if (this.afterimages && this.afterimages.length > 0) {
      const charThemes = {
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
      };
      const theme = charThemes[this.activeChar] || charThemes.steven;
      for (const img of this.afterimages) {
        ctx.save();
        ctx.translate(img.x, img.y);
        ctx.scale(img.facing, 1);
        ctx.globalAlpha = (img.life / img.maxLife) * 0.4;
        ctx.fillStyle = theme.fill;
        ctx.beginPath();
        ctx.ellipse(0, -38, 20, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = theme.stroke;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Dynamic Kinetic Action Movement & Body Physics (Anticipation -> Snap -> Hold -> Recovery!)
    let actionLunge = 0;
    let actionLiftY = 0;
    let actionTorsoTilt = 0;
    let actionScaleX = 1;
    let actionScaleY = 1;
    let animP = 0;

    if (this.actionTimer > 0 && this.actionDuration > 0) {
      animP = Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration)));
      const strike = this.getStrikeCurve(animP);
      const posStrike = Math.max(0, strike);
      if (this.actionType === 'punch') {
        // Snappy 3-Hit Combo Kinetics with Anticipation Coil, Strike Snap & Squash/Stretch!
        const combo = this.attackCombo;
        if (combo === 0) {
          // Hit 1: Quick coil back -> explosive forward thrust/jab
          actionLunge = strike * 20;
          actionLiftY = -posStrike * 3;
          actionTorsoTilt = strike * 0.16;
          actionScaleX = 1 + posStrike * 0.05;
          actionScaleY = 1 - posStrike * 0.03;
        } else if (combo === 1) {
          // Hit 2: Wide rotational sweep / rising slash
          actionLunge = strike * 18;
          actionLiftY = -posStrike * 4;
          actionTorsoTilt = -strike * 0.18;
          actionScaleX = 1 + posStrike * 0.04;
        } else {
          // Hit 3: Weighty aerial cleave / seismic finisher!
          actionLunge = strike * 28;
          if (animP < 0.42) {
            const leap = Math.sin((animP / 0.42) * (Math.PI / 2));
            actionLiftY = -20 * leap;
            actionTorsoTilt = -0.22 * leap;
            actionScaleY = 1 + 0.06 * leap;
          } else {
            const slam = Math.sin(((animP - 0.42) / 0.58) * Math.PI);
            actionLiftY = 8 * slam;
            actionTorsoTilt = 0.28 * slam;
            actionScaleX = 1 + 0.07 * slam;
            actionScaleY = 1 - 0.06 * slam;
          }
        }
      } else if (this.actionType === 'throw') {
        // Physical throw: deep windup coil backwards then whipping launch forward
        if (animP < 0.30) {
          const windup = Math.sin((animP / 0.30) * (Math.PI / 2));
          actionLunge = -12 * windup;
          actionTorsoTilt = -0.20 * windup;
          actionScaleX = 1 - 0.04 * windup;
        } else {
          const whip = Math.sin(((animP - 0.30) / 0.70) * Math.PI);
          actionLunge = 22 * whip;
          actionTorsoTilt = 0.24 * whip;
          actionScaleX = 1 + 0.06 * whip;
        }
      } else if (this.actionType === 'shield') {
        // Braced defensive crouch & grounding
        const p = Math.sin(animP * Math.PI);
        actionLiftY = p * 6;
        actionTorsoTilt = p * 0.08;
        actionScaleY = 1 - p * 0.04;
      } else if (this.actionType === 'heal') {
        // Graceful ascending float into divine celestial light
        const p = Math.sin(animP * Math.PI);
        actionLiftY = -p * 16;
        actionTorsoTilt = -p * 0.06;
      } else if (this.actionType === 'skill') {
        // High leap and seismic impact slam
        if (animP < 0.36) {
          const leap = Math.sin((animP / 0.36) * (Math.PI / 2));
          actionLiftY = -18 * leap;
          actionTorsoTilt = -0.16 * leap;
          actionScaleY = 1 + 0.06 * leap;
        } else {
          const slam = Math.sin(((animP - 0.36) / 0.64) * Math.PI);
          actionLunge = 14 * slam;
          actionLiftY = 9 * slam;
          actionTorsoTilt = 0.26 * slam;
          actionScaleX = 1 + 0.06 * slam;
          actionScaleY = 1 - 0.06 * slam;
        }
      }
    }

    // Character-Specific Dodge Kinetics & Cartoon Poses
    let dodgeTilt = 0;
    let dodgeLiftY = 0;
    let dodgeScaleX = 1;
    let dodgeScaleY = 1;

    if (this.isDodging) {
      const p = Math.min(1, Math.max(0, 1 - (this.dodgeTimer / this.dodgeDuration)));
      const dir = this.dodgeDirection;

      if (this.activeChar === 'connie') {
        // Fencing low tumble roll & lunge recovery
        dodgeTilt = p * Math.PI * 2 * dir;
        dodgeLiftY = -Math.sin(p * Math.PI) * 12;
      } else if (this.activeChar === 'jasper') {
        // Armored shoulder ram tackle slide
        dodgeLiftY = Math.sin(p * Math.PI) * 14;
        dodgeTilt = Math.sin(p * Math.PI) * 0.48 * dir;
        dodgeScaleY = 1 - Math.sin(p * Math.PI) * 0.22;
      } else if (this.activeChar === 'steven') {
        // Full somersault roll inside bubble
        dodgeTilt = p * Math.PI * 2 * dir;
        dodgeLiftY = -Math.sin(p * Math.PI) * 14;
      } else if (this.activeChar === 'garnet') {
        // Boxer low duck slip & weave
        dodgeLiftY = Math.sin(p * Math.PI) * 16;
        dodgeTilt = Math.sin(p * Math.PI) * 0.42 * dir;
        dodgeScaleY = 1 - Math.sin(p * Math.PI) * 0.22;
      } else if (this.activeChar === 'amethyst') {
        // Agile gymnastic spin roll
        dodgeTilt = p * Math.PI * 2 * dir;
        dodgeLiftY = Math.sin(p * Math.PI) * 8;
      } else if (this.activeChar === 'pearl') {
        // Graceful ballet pirouette / airborne leap
        dodgeLiftY = -Math.sin(p * Math.PI) * 25;
        dodgeTilt = -Math.sin(p * Math.PI) * 0.5 * dir;
      } else if (this.activeChar === 'bismuth') {
        // Heavy armored shoulder duck & anvil skid
        dodgeLiftY = Math.sin(p * Math.PI) * 14;
        dodgeTilt = Math.sin(p * Math.PI) * 0.46 * dir;
        dodgeScaleY = 1 - Math.sin(p * Math.PI) * 0.25;
      } else if (this.activeChar === 'peridot') {
        // Panicked thruster skitter / comedy lean
        dodgeLiftY = Math.sin(p * Math.PI) * 10;
        dodgeTilt = -Math.sin(p * Math.PI) * 0.45 * dir;
      } else if (this.activeChar === 'lapis') {
        // Fluid water-mist phase glide
        dodgeLiftY = -Math.sin(p * Math.PI) * 16;
        dodgeTilt = Math.sin(p * Math.PI) * 0.24 * dir;
      } else if (this.activeChar === 'rose') {
        // Sacred floating levitation glide & petal swirl
        dodgeLiftY = -Math.sin(p * Math.PI) * 18;
        dodgeTilt = Math.sin(p * Math.PI) * 0.16 * dir;
      }
    }

    ctx.save();
    ctx.translate(this.x + actionLunge * this.facing, this.y + actionLiftY + dodgeLiftY);
    // Landing squash & stretch: wide and low on impact, springing back
    this.landSquash = Math.max(0, (this.landSquash || 0) - 0.055);
    const sq = this.landSquash;
    const landX = 1 + 0.18 * sq;
    const landY = 1 - 0.20 * sq;
    ctx.scale(this.facing * dodgeScaleX * actionScaleX * landX, dodgeScaleY * actionScaleY * landY);

    // Dodge ghost trail
    if (this.isDodging) {
      for (let gI = 1; gI <= 3; gI++) {
        ctx.save();
        ctx.globalAlpha = 0.20 - gI * 0.05;
        ctx.fillStyle = '#a5f3fc';
        ctx.beginPath();
        ctx.ellipse(-this.facing * gI * 16, -38, 16, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.rotate(actionTorsoTilt + dodgeTilt);

    if (this.isDodging && this.activeChar === 'lapis') {
      ctx.globalAlpha = 0.65; // Lapis phase mist translucency
    } else if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const bob = Math.sin(this.walkAnim) * 3;

    // 2. Character Overdrive Aura & Power-Up Visuals (Visually stunning for all 8 Gems!)
    if (this.isPinkOverdrive) {
      this.drawCharacterOverdriveAura(ctx, this.activeChar, bob);
    }



    if (this.activeChar === 'steven') {
      this.drawSteven(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'garnet') {
      this.drawGarnet(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'amethyst') {
      this.drawAmethyst(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'pearl') {
      this.drawPearl(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'bismuth') {
      this.drawBismuth(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'peridot') {
      this.drawPeridot(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'lapis') {
      this.drawLapis(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'rose') {
      this.drawRose(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'connie') {
      this.drawConnie(ctx, bob, animP, this.actionType);
    } else if (this.activeChar === 'jasper') {
      this.drawJasper(ctx, bob, animP, this.actionType);
    }

    if (this.isShielding && (this.activeChar === 'steven' || this.bubbleTimer > 0)) {
      this.drawBubbleShield(ctx);
    }

    // Dynamic Dodge Visual Accents
    if (this.isDodging) {
      this.drawDodgeVisuals(ctx, bob);
    }

    // 3. Dynamic Attack Slashes & Impact Visuals for each attack
    if (this.isAttacking) {
      this.drawAttackVisuals(ctx, bob);
    }

    ctx.restore();
  }

  // --- UNIQUE VISUAL OVERDRIVE AURAS FOR ALL 8 CANON GEMS ---
  drawCharacterOverdriveAura(ctx, charId, bob) {
    const time = Date.now();
    ctx.save();

    switch (charId) {
      case 'steven': {
        // 1. Steven: Steven Universe Future Giant Pink State!
        const pulse = Math.sin(time / 70) * 5;

        // Rotating Spiky Pink Diamond Star Ground Aura
        ctx.strokeStyle = 'rgba(255, 20, 147, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const starPoints = 6;
        for (let i = 0; i < starPoints * 2; i++) {
          const r = (i % 2 === 0) ? (32 + pulse) : 16;
          const a = (Math.PI / starPoints) * i + (time / 300);
          const px = Math.cos(a) * r * 1.2;
          const py = Math.sin(a) * (r * 0.45);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Concentric Pink Diamond Body Auras
        ctx.strokeStyle = 'rgba(255, 20, 147, 0.3)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, -38, 28 + pulse * 0.5, 46 + pulse * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 105, 180, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -38, 25 + pulse * 0.5, 42 + pulse * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ascending Pink Diamond Energy Shards
        for (let f = 0; f < 5; f++) {
          const fx = -18 + f * 9;
          const fy = -72 - ((time / 12 + f * 22) % 32);
          ctx.fillStyle = 'rgba(255, 105, 180, 0.75)';
          ctx.beginPath();
          ctx.moveTo(fx, fy - 4);
          ctx.lineTo(fx + 3, fy);
          ctx.lineTo(fx, fy + 4);
          ctx.lineTo(fx - 3, fy);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      case 'garnet': {
        // 2. Garnet: Ruby & Sapphire Dual Flame Resonance!
        const flamePulse = Math.sin(time / 80) * 4;

        // Ruby Flame Aura (Crimson Red / Ember Orange on back/left)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(-14, -48, 16 + flamePulse, 42 + flamePulse, -0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Sapphire Glacial Flame Aura (Electric Cyan / Frost Blue on front/right)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(14, -48, 16 + flamePulse, 42 + flamePulse, 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Swirling Dual Flames
        for (let i = 0; i < 6; i++) {
          const t = (time / 150 + i * 1.05);
          const rx = -16 + Math.cos(t) * 10;
          const ry = -20 - ((time / 10 + i * 20) % 70);
          ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f97316';
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.fill();

          const sx = 16 + Math.sin(t) * 10;
          const sy = -20 - ((time / 10 + i * 20 + 35) % 70);
          ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cosmic Visor Beam Flash
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-22, -82 + bob);
        ctx.lineTo(26, -82 + bob);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, -82 + bob, 6);
        break;
      }

      case 'amethyst': {
        // 3. Amethyst: Prime Kindergarten Volcanic Supercharged Quartz!
        const pulse = Math.sin(time / 65) * 5;

        // Electric Violet Shock Rings
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.38)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, -38, 28 + pulse, 44 + pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(233, 213, 255, 0.92)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -38, 25 + pulse, 40 + pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 4 Orbiting Jagged Amethyst Crystals
        for (let c = 0; c < 4; c++) {
          const angle = (time / 200) + (c * Math.PI / 2);
          const cx = Math.cos(angle) * (34 + pulse);
          const cy = -38 + Math.sin(angle) * (20 + pulse * 0.5);

          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx + 5, cy);
          ctx.lineTo(cx, cy + 8);
          ctx.lineTo(cx - 5, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Crackling Quartz Lightning Spark
        const lA = (time / 80) % (Math.PI * 2);
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(lA) * 22, -38 + Math.sin(lA) * 30);
        ctx.lineTo(Math.cos(lA + 0.5) * 28, -38 + Math.sin(lA + 0.5) * 35);
        ctx.stroke();
        break;
      }

      case 'pearl': {
        // 4. Pearl: Prismatic Holographic Mastery & Rainbow Radiant Form!
        const pulse = Math.sin(time / 90) * 4;

        // Rainbow Prism Concentric Arcs
        const colors = ['rgba(34, 211, 238, 0.75)', 'rgba(244, 114, 182, 0.75)', 'rgba(250, 204, 21, 0.75)', 'rgba(255, 255, 255, 0.9)'];
        for (let k = 0; k < colors.length; k++) {
          ctx.strokeStyle = colors[k];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, -42, 22 + k * 4 + pulse * 0.5, 46 + k * 4 + pulse * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Holographic Light Ribbons / Wings behind Pearl
        ctx.fillStyle = 'rgba(34, 211, 238, 0.28)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        const wingWave = Math.sin(time / 120) * 8;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.quadraticCurveTo(-38, -90 + wingWave, -48, -60 + wingWave);
        ctx.quadraticCurveTo(-30, -40, 0, -48);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.quadraticCurveTo(38, -90 - wingWave, 48, -60 - wingWave);
        ctx.quadraticCurveTo(30, -40, 0, -48);
        ctx.fill();
        ctx.stroke();

        // Gleaming Forehead Pearl Star Radiance
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 0, -88 + bob, 7);
        break;
      }

      case 'bismuth': {
        // 5. Bismuth: Incandescent Molten Lava Blacksmith / Forgemaster State!
        const heatPulse = Math.sin(time / 60) * 5;

        // Molten Magma Heat Shield / Volcanic Halo
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.ellipse(0, -36, 32 + heatPulse, 44 + heatPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, -36, 28 + heatPulse, 40 + heatPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Rising Forge Embers & Volcanic Sparks
        for (let e = 0; e < 7; e++) {
          const ex = -24 + (e * 8);
          const ey = -5 - ((time / 8 + e * 18) % 75);
          ctx.fillStyle = (e % 2 === 0) ? '#f97316' : '#fde047';
          ctx.beginPath();
          ctx.arc(ex + Math.sin(time / 100 + e) * 5, ey, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glowing Anvil Ground Stamp
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-28, -6, 56, 10);
        break;
      }

      case 'peridot': {
        // 6. Peridot: Ferrokinetic Master / Homeworld Tech Overclock!
        const techPulse = Math.sin(time / 70) * 4;

        // Neon Lime Electromagnetic Field Rings
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.ellipse(0, -36, 28 + techPulse, 44 + techPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(134, 239, 172, 0.95)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, -36, 25 + techPulse, 40 + techPulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting Ring of Levitating Magnetic Scrap Metal (5 pieces)
        for (let m = 0; m < 5; m++) {
          const angle = (time / 160) + (m * Math.PI * 2 / 5);
          const mx = Math.cos(angle) * (34 + techPulse);
          const my = -42 + Math.sin(angle) * (20 + techPulse * 0.5);

          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (m % 2 === 0) {
            ctx.arc(mx, my, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillRect(mx - 4, my - 3, 8, 6);
            ctx.strokeRect(mx - 4, my - 3, 8, 6);
          }
        }

        // Holographic Visor Targeting Reticle
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-18, -80 + bob, 36, 14);
        ctx.beginPath();
        ctx.moveTo(0, -82 + bob);
        ctx.lineTo(0, -64 + bob);
        ctx.stroke();
        break;
      }

      case 'lapis': {
        // 7. Lapis Lazuli: Massive Translucent Ocean Wings, Whirlpool Vortex at feet!
        const hydroPulse = Math.sin(time / 80) * 5;

        // Giant Majestic Translucent Water Wings (Overdrive scale)
        const wingFlap = Math.sin(time / 100) * 14;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.82)';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.5;

        // Grand Left Wing
        ctx.beginPath();
        ctx.moveTo(-6, -56 + bob);
        ctx.bezierCurveTo(-45, -115 + wingFlap, -75, -85 + wingFlap, -65, -50 + wingFlap);
        ctx.bezierCurveTo(-50, -30, -25, -45, -6, -50 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Grand Right Wing
        ctx.beginPath();
        ctx.moveTo(6, -56 + bob);
        ctx.bezierCurveTo(45, -115 - wingFlap, 75, -85 - wingFlap, 65, -50 - wingFlap);
        ctx.bezierCurveTo(50, -30, 25, -45, 6, -50 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Water droplets spray
        for (let w = 0; w < 5; w++) {
          const wx = -30 + w * 15 + Math.sin(time / 100 + w) * 8;
          const wy = -30 - ((time / 10 + w * 18) % 65);
          ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
          ctx.beginPath();
          ctx.arc(wx, wy, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swirling Water Whirlpool at feet
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 36 + hydroPulse, 10 + hydroPulse * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 'rose': {
        // 8. Rose Quartz: Rotating 8-Petaled Sacred Rose Mandala, Floating Rose Petals!
        const pulse = Math.sin(time / 90) * 4;

        // Celestial Rose-Gold Warm Halo
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(0, -42, 34 + pulse, 48 + pulse, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating 8-Petaled Sacred Rose Mandala behind Rose's back
        ctx.save();
        ctx.translate(0, -44 + bob);
        ctx.rotate(time / 600);
        for (let p = 0; p < 8; p++) {
          const angle = (Math.PI / 4) * p;
          ctx.save();
          ctx.rotate(angle);
          ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
          ctx.strokeStyle = 'rgba(255, 228, 230, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-10, -20, -14, -36, 0, -44);
          ctx.bezierCurveTo(14, -36, 10, -20, 0, 0);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // Orbiting Floating Rose Petals
        for (let rp = 0; rp < 6; rp++) {
          const pAngle = (time / 250) + (rp * Math.PI / 3);
          const px = Math.cos(pAngle) * (42 + pulse);
          const py = -42 + Math.sin(pAngle) * (26 + pulse * 0.5);

          ctx.fillStyle = '#ff6097';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(px, py, 5, 3, pAngle, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Glowing Rose Navel Star Beacon
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 0, -28 + bob, 6);
        break;
      }

      case 'connie': {
        // Connie: Knight's Stevonnie Radiant Pink Blade State!
        const pulse = Math.sin(time / 70) * 5;
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 36 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f472b6';
        this.drawMiniStar(ctx, 0, 0, 10 + pulse * 0.4);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, -50 + bob);
        ctx.lineTo(55, -80 + bob);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < 4; i++) {
          const a = (time / 100) + (i * Math.PI / 2);
          ctx.beginPath();
          ctx.arc(Math.cos(a) * 28, -40 + bob + Math.sin(a) * 22, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'jasper': {
        // Jasper: Supreme Beta Quartz Juggernaut Overdrive!
        const pulse = Math.sin(time / 60) * 6;

        ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
        ctx.beginPath();
        ctx.arc(0, -42 + bob, 45 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 38 + pulse * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ea580c';
        for (let s = 0; s < 5; s++) {
          const sa = (time / 140) + (s * Math.PI * 2 / 5);
          const sx = Math.cos(sa) * (36 + pulse);
          const sy = -35 + bob + Math.sin(sa) * (32 + pulse);
          this.drawMiniStar(ctx, sx, sy, 7);
        }
        break;
      }
    }

    ctx.restore();
  }

  // --- FLUID COMBAT ANIMATION CURVES, HAIR PHYSICS & SMEAR HELPERS ---
  getStrikeCurve(animP) {
    if (animP <= 0 || animP >= 1) return 0;
    if (animP < 0.16) {
      // Quick anticipation coil backward (-0.28)
      return -0.28 * Math.sin((animP / 0.16) * (Math.PI / 2));
    }
    if (animP < 0.42) {
      // Explosive whip-fast strike extension (-0.28 -> +1.0)
      return -0.28 + 1.28 * Math.sin(((animP - 0.16) / 0.26) * (Math.PI / 2));
    }
    if (animP < 0.68) {
      // Impact power hold (1.0 -> 0.86)
      return 1.0 - 0.14 * ((animP - 0.42) / 0.26);
    }
    // Smooth follow-through recovery (0.86 -> 0)
    return 0.86 * Math.cos(((animP - 0.68) / 0.32) * (Math.PI / 2));
  }

  getHairSway(animP = 0, actionType = '') {
    const t = Date.now() / 280;
    const isMoving = Math.abs(this.vx) > 12;
    const strike = actionType ? this.getStrikeCurve(animP) : 0;
    // Trailing backward (-X) when running forward or lunging into a strike
    const runTrail = isMoving ? (-5.5 + Math.sin(this.walkAnim * 1.5) * 2.5) : (Math.sin(t) * 1.6);
    const strikeTrail = -strike * 6.5;
    const airLift = !this.isGrounded ? Math.max(-7, Math.min(7, this.vy * 0.012)) : 0;
    const walkBounce = isMoving ? Math.cos(this.walkAnim * 2) * 1.8 : Math.cos(t * 0.9) * 0.9;
    return {
      swayX: runTrail + strikeTrail,
      swayY: airLift + walkBounce
    };
  }

  getLegKinematics(animP = 0, actionType = '') {
    const isMoving = Math.abs(this.vx) > 12;
    const walkS = isMoving ? Math.sin(this.walkAnim) : 0;
    const walkLiftB = isMoving ? Math.max(0, -walkS) * 4 : 0;
    const walkLiftF = isMoving ? Math.max(0, walkS) * 4 : 0;

    if (!this.isGrounded && !actionType) {
      return { backX: -4, backY: -3, backRot: 0.24, frontX: 5, frontY: -6, frontRot: -0.22 };
    }
    if (actionType === 'punch' || actionType === 'throw' || actionType === 'skill') {
      const s = Math.max(0, this.getStrikeCurve(animP));
      const coil = Math.min(0, this.getStrikeCurve(animP));
      return {
        backX: -5 * s + 2 * coil,
        backY: 0,
        backRot: 0.22 * s - 0.1 * coil,
        frontX: 7 * s + 2 * coil,
        frontY: -2 * s,
        frontRot: -0.18 * s + 0.08 * coil
      };
    }
    if (actionType === 'shield') {
      return { backX: -4, backY: 0, backRot: 0.16, frontX: 5, frontY: 0, frontRot: -0.14 };
    }
    return {
      backX: -walkS * 6.5,
      backY: -walkLiftB,
      backRot: walkS * 0.22,
      frontX: walkS * 6.5,
      frontY: -walkLiftF,
      frontRot: -walkS * 0.22
    };
  }

  drawArticulatedArm(ctx, sx, sy, ex, ey, hx, hy, upperColor, lowerColor, upperW = 8, lowerW = 7, handColor = null, handR = 0) {
    // Upper arm segment (shoulder -> elbow)
    const ang1 = Math.atan2(ey - sy, ex - sx);
    const len1 = Math.hypot(ex - sx, ey - sy);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(ang1);
    ctx.fillStyle = upperColor;
    ctx.beginPath();
    ctx.roundRect(-upperW * 0.35, -upperW * 0.5, len1 + upperW * 0.5, upperW, upperW * 0.45);
    ctx.fill();
    ctx.restore();

    // Forearm segment (elbow -> hand)
    const ang2 = Math.atan2(hy - ey, hx - ex);
    const len2 = Math.hypot(hx - ex, hy - ey);
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(ang2);
    ctx.fillStyle = lowerColor;
    ctx.beginPath();
    ctx.roundRect(-lowerW * 0.35, -lowerW * 0.5, len2 + lowerW * 0.45, lowerW, lowerW * 0.45);
    ctx.fill();
    ctx.restore();

    // Optional Fist / Hand
    if (handColor && handR > 0) {
      ctx.fillStyle = handColor;
      ctx.beginPath();
      ctx.arc(hx, hy, handR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCrescentSlash(ctx, cx, cy, radius, startA, endA, outerGlow, bladeColor, edgeColor = '#ffffff', thickness = 14) {
    ctx.save();
    const midA = (startA + endA) * 0.5;
    const innerShiftX = -Math.cos(midA) * (thickness * 0.55);
    const innerShiftY = -Math.sin(midA) * (thickness * 0.55);
    const innerR = Math.max(6, radius - thickness * 0.45);

    // 1. Soft Outer Elemental Smear Ribbon
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + thickness * 0.32, startA, endA, false);
    ctx.arc(cx + innerShiftX * 1.15, cy + innerShiftY * 1.15, Math.max(4, innerR - 3), endA, startA, true);
    ctx.closePath();
    ctx.fill();

    // 2. Vibrant Saturated Core Crescent
    ctx.fillStyle = bladeColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startA, endA, false);
    ctx.arc(cx + innerShiftX, cy + innerShiftY, innerR, endA, startA, true);
    ctx.closePath();
    ctx.fill();

    // 3. Razor-Sharp Specular Leading Edge
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 0.5, startA + (endA - startA) * 0.08, endA - (endA - startA) * 0.05, false);
    ctx.stroke();
    ctx.restore();
  }

  drawSpeedLines(ctx, xStart, yCenter, length, spreadY, count, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const frac = count > 1 ? (i / (count - 1)) - 0.5 : 0;
      const ly = yCenter + frac * spreadY;
      const offset = (i % 2 === 0) ? 0 : 8;
      ctx.moveTo(xStart + offset, ly);
      ctx.lineTo(xStart + length + offset * 0.5, ly);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- SHOW-ACCURATE STEVEN UNIVERSE ---
  drawSteven(ctx, bob, animP = 0, actionType = '') {
    const isPink = this.isPinkOverdrive;
    const skinColor = isPink ? '#ff6097' : '#fde0d7';
    const shirtColor = isPink ? '#ff1493' : '#e8453c';
    const pantsColor = isPink ? '#be185d' : '#2563eb';
    const cuffColor = isPink ? '#f43f5e' : '#93c5fd';
    const hairColor = isPink ? '#be123c' : '#26151c';
    const hairSheen = isPink ? '#fb7185' : '#462633';
    const eyeColor = isPink ? '#ffffff' : '#1e1233';

    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isShieldThrown = (actionType === 'throw' && animP > 0.25);
    const isShieldWindup = (actionType === 'throw' && animP <= 0.25);
    const isShieldStance = (actionType === 'shield');

    // Helper to draw one articulated jean leg + flip-flop
    const drawStevenLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -22 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? (isPink ? '#9d174d' : '#1d4ed8') : pantsColor;
      ctx.fillRect(-5.5, 0, 11, 17);
      ctx.fillStyle = cuffColor;
      ctx.fillRect(-6.5, 12, 13, 5);
      ctx.fillStyle = skinColor;
      ctx.fillRect(-4.5, 16, 9, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-6, 20, 13, 3);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-4.5, 18); ctx.lineTo(0.5, 20); ctx.lineTo(5, 18);
      ctx.stroke();
      ctx.restore();
    };

    // 1. Articulated Jeans & Flip-Flops (Back leg then Front leg)
    drawStevenLeg(-8 + legs.backX, legs.backY, legs.backRot, true);
    drawStevenLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear / Left Counter-Balance Arm (Draws behind torso!)
    if (isPunch && combo === 0) {
      // Left arm pulls Rose's Shield back to rear hip for punch torque!
      const pullBack = Math.max(0, strike) * 8;
      this.drawArticulatedArm(ctx, -12, -45 + bob, -19 - pullBack * 0.5, -38 + bob, -16 - pullBack, -30 + bob, shirtColor, skinColor, 8.5, 7, skinColor, 4.5);
      ctx.save();
      ctx.translate(-18 - pullBack, -30 + bob);
      ctx.fillStyle = 'rgba(255, 96, 151, 0.85)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 14, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (isShieldStance && this.bubbleTimer > 0) {
      // Joyful arms-outstretched Bubble/Cookie summon pose!
      this.drawArticulatedArm(ctx, -14, -46 + bob, -23, -52 + bob, -28, -60 + bob, shirtColor, skinColor, 8.5, 7, skinColor, 5);
    } else {
      // Natural walking swing for rear arm
      const armSwing = Math.sin(this.walkAnim) * 5;
      this.drawArticulatedArm(ctx, -13, -45 + bob, -17 - armSwing * 0.5, -36 + bob, -15 - armSwing, -28 + bob, shirtColor, skinColor, 8, 6.5, skinColor, 4.5);
    }

    // 3. T-shirt & Rose Quartz Navel Gem
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.roundRect(-19, -52 + bob, 38, 33, 8);
    ctx.fill();

    // Bold 5-Pointed Gold Star on chest
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 1, -35 + bob, 8.5);

    // Navel Rose Quartz gem — canon placement, faceted pentagon cut
    ctx.save();
    ctx.translate(1, -24 + bob);
    ctx.fillStyle = '#f472b6';
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, -5); ctx.lineTo(4.6, -1.6); ctx.lineTo(2.8, 4); ctx.lineTo(-2.8, 4); ctx.lineTo(-4.6, -1.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.moveTo(0, -4); ctx.lineTo(2.2, -1.4); ctx.lineTo(0, 0.6); ctx.lineTo(-2.2, -1.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Unified Sculpted 5-Lobe Cloud-Curl Silhouette (Back Volume — ZERO disconnected circles!)
    const hx = hair.swayX * 0.45;
    const hy = hair.swayY * 0.35;
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.moveTo(-17, -56 + bob);
    // Lower-back curl lobe
    ctx.bezierCurveTo(-26 + hx, -58 + bob + hy, -27 + hx, -71 + bob + hy, -19 + hx * 0.8, -74 + bob + hy);
    // Upper-left crown curl lobe
    ctx.bezierCurveTo(-23 + hx, -84 + bob + hy, -12 + hx * 0.6, -91 + bob + hy, -3 + hx * 0.4, -86 + bob + hy);
    // Center-top hero poof lobe
    ctx.bezierCurveTo(1 + hx * 0.3, -95 + bob + hy, 15 + hx * 0.3, -93 + bob + hy, 15 + hx * 0.2, -83 + bob + hy);
    // Front-right temple curl lobe
    ctx.bezierCurveTo(24 + hx * 0.2, -82 + bob + hy, 25, -69 + bob + hy, 18, -65 + bob);
    // Tucks cleanly behind right ear/cheek (no awkward beads hanging down jaw!)
    ctx.quadraticCurveTo(21, -59 + bob, 15, -55 + bob);
    ctx.closePath();
    ctx.fill();

    // 5. Chubby Pear-Shaped Head & Rosy Cheeks
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(0, -61 + bob, 17.5, 16.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Front Hairline & Soft Top Curl Overhang + Inner Spiral Accents!
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.moveTo(-17, -64 + bob);
    ctx.quadraticCurveTo(-15, -75 + bob, -6, -74 + bob);
    ctx.quadraticCurveTo(0, -79 + bob, 7, -75 + bob);
    ctx.quadraticCurveTo(14, -77 + bob, 17, -69 + bob);
    ctx.lineTo(17, -76 + bob);
    ctx.lineTo(-18, -76 + bob);
    ctx.closePath();
    ctx.fill();

    // Warm cocoa sheen & sculpted inner C-curl swirls (reads unmistakably as soft bouncy curls!)
    ctx.strokeStyle = hairSheen;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-8 + hx * 0.4, -80 + bob + hy, 4.5, Math.PI * 0.8, Math.PI * 2.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(5 + hx * 0.3, -83 + bob + hy, 5, Math.PI * 0.9, Math.PI * 2.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-16 + hx * 0.6, -67 + bob + hy, 4, Math.PI * 0.6, Math.PI * 1.85);
    ctx.stroke();

    // Rosy Cheeks
    ctx.fillStyle = isPink ? 'rgba(255, 255, 255, 0.5)' : 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-9, -57 + bob, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(9, -57 + bob, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Big Expressive Cartoon Eyes
    ctx.fillStyle = isPink ? '#ff1493' : '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-5, -64 + bob, 4.5, 5.8, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -64 + bob, 4.5, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.ellipse(-4.2, -63.5 + bob, 3.2, 4.6, 0, 0, Math.PI * 2);
    ctx.ellipse(5.8, -63.5 + bob, 3.2, 4.6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isPink) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3.2, -65 + bob, 1.6, 0, Math.PI * 2);
      ctx.arc(6.8, -65 + bob, 1.6, 0, Math.PI * 2);
      ctx.arc(-5.2, -62 + bob, 0.8, 0, Math.PI * 2);
      ctx.arc(4.8, -62 + bob, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic Eyebrows (Determined hero brow during attacks, cheerful arch on idle)
    ctx.strokeStyle = isPink ? '#ffffff' : '#26151c';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(-10, -73 + bob); ctx.lineTo(-1.5, -70.5 + bob);
      ctx.moveTo(1.5, -70.5 + bob); ctx.lineTo(10, -73 + bob);
    } else {
      ctx.moveTo(-10, -71.5 + bob); ctx.quadraticCurveTo(-5, -74.5 + bob, -1, -71.5 + bob);
      ctx.moveTo(1, -71.5 + bob); ctx.quadraticCurveTo(5, -74.5 + bob, 10, -71.5 + bob);
    }
    ctx.stroke();

    // 7. Signature Wide Open Happy Smile
    ctx.fillStyle = isPink ? '#ffffff' : '#881337';
    ctx.beginPath();
    ctx.moveTo(-7, -54 + bob);
    ctx.quadraticCurveTo(0, -53 + bob, 7, -54 + bob);
    ctx.quadraticCurveTo(0, -44 + bob, -7, -54 + bob);
    ctx.fill();

    if (!isPink) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-6.5, -54 + bob);
      ctx.lineTo(6.5, -54 + bob);
      ctx.quadraticCurveTo(0, -50 + bob, -6.5, -54 + bob);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(0, -46 + bob, 3.5, Math.PI, 0);
      ctx.fill();
    }

    // 8. Articulated Lead Arm & Rose's Shield Choreography
    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Snappy Star-Fist Cross with Pink Quartz Knuckle Burst!
        const reach = strike * 26;
        const fistX = 20 + reach;
        const fistY = -41 + bob - Math.max(0, strike) * 2;
        this.drawArticulatedArm(ctx, 10, -44 + bob, 15 + reach * 0.45, -42 + bob, fistX, fistY, shirtColor, skinColor, 9, 7.5, skinColor, 6.5);
        if (strike > 0.1) {
          ctx.fillStyle = 'rgba(255, 96, 151, 0.55)';
          ctx.beginPath();
          ctx.arc(fistX + 2, fistY, 9.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, fistX + 7, fistY, 6.5);
        }
      } else if (combo === 1) {
        // Hit 2: Wide Spinning Rose-Shield Backhand Slash!
        const sweep = strike * 30;
        const shX = 16 + sweep;
        const shY = -40 + bob - sweep * 0.12;
        this.drawArticulatedArm(ctx, 10, -44 + bob, 12 + sweep * 0.45, -45 + bob, shX, shY, shirtColor, skinColor, 9, 7.5);
        ctx.save();
        ctx.translate(shX, shY);
        ctx.rotate(animP * Math.PI * 2.5);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.92)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#be185d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 9.5, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, 0, 7.5);
        ctx.restore();
      } else {
        // Hit 3: Leaping Rising Star-Shield Skyward Uppercut Finisher!
        const lift = Math.max(-6, strike * 34);
        const shX = 18 + Math.max(0, strike) * 14;
        const shY = -44 + bob - lift;
        this.drawArticulatedArm(ctx, 10, -45 + bob, 15 + Math.max(0, strike) * 6, -46 + bob - lift * 0.45, shX, shY, shirtColor, skinColor, 9.5, 8);
        ctx.save();
        ctx.translate(shX, shY);
        ctx.rotate(-0.35 + animP * 1.2);
        ctx.fillStyle = 'rgba(255, 96, 151, 0.96)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, 0, 9.5);
        ctx.restore();
      }
    } else if (isShieldWindup) {
      // Discus Coil Across Chest before hurling Rose's Shield!
      this.drawArticulatedArm(ctx, 10, -44 + bob, 2, -40 + bob, -8, -38 + bob, shirtColor, skinColor, 9, 7.5);
      ctx.save();
      ctx.translate(-8, -38 + bob);
      ctx.fillStyle = 'rgba(255, 96, 151, 0.92)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 17, 9, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (isShieldThrown) {
      // Dynamic Discus Release Follow-Through!
      const ext = Math.sin(((animP - 0.25) / 0.75) * Math.PI) * 12;
      this.drawArticulatedArm(ctx, 10, -44 + bob, 19 + ext * 0.5, -43 + bob, 27 + ext, -41 + bob, shirtColor, skinColor, 9, 7.5, skinColor, 6);
    } else if (isShieldStance && this.bubbleTimer > 0) {
      // Right arm raised high in Bubble Summon pose!
      this.drawArticulatedArm(ctx, 12, -46 + bob, 21, -52 + bob, 27, -60 + bob, shirtColor, skinColor, 8.5, 7, skinColor, 5);
    } else {
      // Ready Forearm holding Canonical Rose Shield
      const shieldX = isShieldStance ? 18 : 14;
      const shieldY = (isShieldStance ? -38 : -34) + bob;
      this.drawArticulatedArm(ctx, 10, -44 + bob, 12, -39 + bob, shieldX, shieldY, shirtColor, skinColor, 8.5, 7);
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
    }
  }

  // --- SHOW-ACCURATE GARNET ---
  drawGarnet(ctx, bob, animP = 0, actionType = '') {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isRocketLaunched = (actionType === 'throw' && animP > 0.25);
    const isRocketWindup = (actionType === 'throw' && animP <= 0.25);
    const isSeismicSlam = (actionType === 'skill');

    // Helper for Garnet's full-sized heavy armored spiked gauntlet
    const drawArmoredGauntlet = (gx, gy, angle, isRuby) => {
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(angle);
      ctx.scale(0.84, 0.84); // canon proportion: big gauntlets, not torso-sized
      // Armored forearm sleeve
      ctx.fillStyle = isRuby ? '#9f1239' : '#881337';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-12, -11, 26, 22, 4);
      ctx.fill();
      ctx.stroke();
      // Heavy golden knuckle plate
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(10, -10, 6, 20);
      // 3 sharp 3D pyramid spikes
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let sp = 0; sp < 3; sp++) {
        const spy = -8 + sp * 6;
        ctx.beginPath();
        ctx.moveTo(16, spy);
        ctx.lineTo(25, spy + 2.5);
        ctx.lineTo(16, spy + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // Star & Ruby/Sapphire Palm Gem
      ctx.fillStyle = '#fbbf24';
      this.drawMiniStar(ctx, 1, 0, 7);
      ctx.fillStyle = isRuby ? '#ef4444' : '#38bdf8';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-5, 0, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    // 1. Articulated Bodysuit Legs (canon: one maroon suit, darker shading on the rear leg)
    ctx.save();
    ctx.translate(-9 + legs.backX, -36 + bob + legs.backY);
    ctx.rotate(legs.backRot);
    ctx.fillStyle = '#5f1029';
    ctx.beginPath();
    ctx.roundRect(-6.5, 0, 13, 36, 4);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-6.5, 24, 13, 2.5);
    ctx.restore();

    ctx.save();
    ctx.translate(8 + legs.frontX, -36 + bob + legs.frontY);
    ctx.rotate(legs.frontRot);
    ctx.fillStyle = '#7f1d3a';
    ctx.beginPath();
    ctx.roundRect(-6.5, 0, 13, 36, 4);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-6.5, 24, 13, 2.5);
    ctx.restore();

    // 2. Rear Left Ruby Arm (Chambered or Launching Hit 1 Straight Jab!)
    if (isPunch && combo === 0) {
      // Left Ruby Gauntlet fires across torso in a snappy boxer straight jab!
      const jab = strike * 34;
      this.drawArticulatedArm(ctx, -12, -62 + bob, 2 + jab * 0.45, -58 + bob, 16 + jab, -56 + bob, '#881337', '#9f1239', 10, 9);
    } else if (!isSeismicSlam && !(isPunch && combo === 2)) {
      const guardX = (isPunch && combo === 1) ? -22 : -14;
      const guardY = (isPunch && combo === 1) ? -52 + bob : -46 + bob;
      this.drawArticulatedArm(ctx, -15, -64 + bob, -21, -55 + bob, guardX, guardY, '#881337', '#9f1239', 9.5, 8.5);
      // Compact rear Ruby Gauntlet ready in boxer guard
      ctx.fillStyle = '#9f1239';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(guardX - 9, guardY - 9, 18, 18, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(guardX, guardY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Hourglass Torso & Star Shoulder Armor
    ctx.fillStyle = '#4c0519';
    ctx.beginPath();
    ctx.moveTo(-19, -71 + bob);
    ctx.lineTo(19, -71 + bob);
    ctx.lineTo(13, -48 + bob);
    ctx.lineTo(17, -33 + bob);
    ctx.lineTo(-17, -33 + bob);
    ctx.lineTo(-13, -48 + bob);
    ctx.closePath();
    ctx.fill();

    // Crimson chest star with gold rim (canon emblem)
    ctx.fillStyle = '#fbbf24';
    this.drawMiniStar(ctx, 1, -56 + bob, 10);
    ctx.fillStyle = '#e11d48';
    this.drawMiniStar(ctx, 1, -56 + bob, 8);

    // Cubic Shoulder Pads
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(-26, -73 + bob); ctx.lineTo(-13, -73 + bob); ctx.lineTo(-17, -61 + bob); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(26, -73 + bob); ctx.lineTo(13, -73 + bob); ctx.lineTo(17, -61 + bob); ctx.closePath();
    ctx.fill();

    // 4. Signature rounded-cube afro (canon silhouette: wraps the whole skull)
    const afroShift = hair.swayX * 0.35;
    ctx.save();
    ctx.translate(afroShift, hair.swayY * 0.25);
    ctx.fillStyle = '#1b0d26';
    ctx.beginPath();
    ctx.roundRect(-23, -120 + bob, 46, 50, 15);
    ctx.fill();
    // soft plum bevel on the upper-right volume of the cube
    ctx.fillStyle = '#2a1238';
    ctx.beginPath();
    ctx.roundRect(-23, -115 + bob, 46, 15, 9);
    ctx.fill();
    // crisp violet specular band (studio-light reading of the cube)
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.roundRect(-21, -112 + bob, 38, 3.5, 2);
    ctx.fill();
    // sideburn locks framing the visor
    ctx.fillStyle = '#1b0d26';
    ctx.beginPath();
    ctx.roundRect(-21, -88 + bob, 7, 20, 4);
    ctx.roundRect(14, -88 + bob, 7, 20, 4);
    ctx.fill();
    ctx.restore();

    // 5. Deep umber skin, squared jaw & stoic mouth
    ctx.fillStyle = '#8b4a42';
    ctx.beginPath();
    ctx.roundRect(-13, -86 + bob, 26, 20, 5);
    ctx.fill();
    ctx.fillStyle = '#5b2c28';
    ctx.fillRect(-6, -71 + bob, 12, 2.4);

    // 6. Iconic wrap-around visor: dark lens, magenta rim light, star glint
    const visorGrad = ctx.createLinearGradient(-17, -90 + bob, 17, -78 + bob);
    visorGrad.addColorStop(0, '#2a1050');
    visorGrad.addColorStop(0.55, '#3b1466');
    visorGrad.addColorStop(1, '#1b0b33');
    ctx.fillStyle = visorGrad;
    ctx.beginPath();
    ctx.moveTo(-14.5, -89 + bob);
    ctx.lineTo(14.5, -89 + bob);
    ctx.lineTo(10, -77 + bob);
    ctx.lineTo(-10, -77 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-14, -88 + bob);
    ctx.lineTo(-9.5, -77.5 + bob);
    ctx.moveTo(14, -88 + bob);
    ctx.lineTo(9.5, -77.5 + bob);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-14, -86.5 + bob);
    ctx.lineTo(14, -86.5 + bob);
    ctx.stroke();

    ctx.globalAlpha = this.isAttacking ? 0.95 : 0.55;
    ctx.fillStyle = this.isAttacking ? '#fde047' : '#ffffff';
    this.drawMiniStar(ctx, 2, -82.5 + bob, this.isAttacking ? 6 : 4);
    ctx.globalAlpha = 1;

    // 7. Kinetic Boxer Gauntlet Action Poses
    if (isSeismicSlam) {
      // Giant Twin Gauntlets: Enlarged to titanic size slamming down into the earth!
      const slamProgress = Math.max(0, this.getStrikeCurve(animP));
      const slamY = -44 + slamProgress * 34;

      this.drawArticulatedArm(ctx, -16, -64 + bob, -28, -50 + bob, -22, slamY, '#881337', '#9f1239', 11, 10);
      this.drawArticulatedArm(ctx, 16, -64 + bob, 28, -50 + bob, 22, slamY, '#1e1b4b', '#881337', 11, 10);

      drawArmoredGauntlet(-22, slamY + 6, Math.PI * 0.45, true);
      drawArmoredGauntlet(22, slamY + 6, Math.PI * 0.55, false);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-48, 0); ctx.lineTo(-20, -10); ctx.lineTo(20, -10); ctx.lineTo(48, 0);
      ctx.stroke();
    } else if (isRocketWindup) {
      this.drawArticulatedArm(ctx, 14, -62 + bob, 4, -56 + bob, -2, -52 + bob, '#1e1b4b', '#881337', 10, 9);
      drawArmoredGauntlet(2, -52 + bob, -0.2, false);
    } else if (isRocketLaunched) {
      // Braced Forearm Rocket Exhaust Thruster!
      this.drawArticulatedArm(ctx, 14, -62 + bob, 20, -56 + bob, 26, -54 + bob, '#1e1b4b', '#78350f', 9.5, 8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(18, -60 + bob, 14, 12);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(32, -60 + bob); ctx.lineTo(46, -54 + bob); ctx.lineTo(32, -48 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(36, -54 + bob, 9, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isPunch) {
      if (combo === 0) {
        // Hit 1: Ruby Straight Jab extends far ahead while Sapphire guards chin!
        const jab = strike * 34;
        drawArmoredGauntlet(20 + jab, -56 + bob, -0.04, true);
        // Lead Sapphire arm tucked in high cheek guard
        this.drawArticulatedArm(ctx, 14, -62 + bob, 10, -50 + bob, 8, -58 + bob, '#1e1b4b', '#881337', 9.5, 8.5);
        drawArmoredGauntlet(10, -58 + bob, -0.45, false);
      } else if (combo === 1) {
        // Hit 2: Explosive Sapphire Rising Hook / Cross!
        const hook = strike * 32;
        const gy = -50 + bob - Math.max(0, strike) * 12;
        this.drawArticulatedArm(ctx, 14, -62 + bob, 18 + hook * 0.45, -48 + bob, 22 + hook, gy, '#1e1b4b', '#881337', 10.5, 9.5);
        drawArmoredGauntlet(26 + hook, gy, -0.28 * Math.max(0, strike), false);
      } else {
        // Hit 3: Twin-Gauntlet Overhead Meteor Hammer Smash!
        const arcP = animP < 0.35 ? -1 + (animP / 0.35) : 1;
        const reach = Math.max(0, strike) * 34;
        const smashY = animP < 0.32 ? (-88 + bob) : (-88 + bob + Math.min(1, (animP - 0.32) / 0.28) * 52);
        const smashAngle = animP < 0.32 ? -1.1 : 0.48;
        this.drawArticulatedArm(ctx, -12, -64 + bob, 6 + reach * 0.4, smashY - 8, 18 + reach, smashY - 4, '#881337', '#9f1239', 10, 9);
        this.drawArticulatedArm(ctx, 14, -64 + bob, 12 + reach * 0.45, smashY - 4, 24 + reach, smashY + 2, '#1e1b4b', '#881337', 10.5, 9.5);
        drawArmoredGauntlet(20 + reach + arcP * 2, smashY - 4, smashAngle, true);
        drawArmoredGauntlet(26 + reach + arcP * 2, smashY + 3, smashAngle, false);
      }
    } else {
      // Ready Boxer Stance
      this.drawArticulatedArm(ctx, 14, -62 + bob, 15, -52 + bob, 20, -48 + bob, '#1e1b4b', '#881337', 9.5, 8.5);
      drawArmoredGauntlet(22, -48 + bob, -0.1, false);
    }
  }

  // --- SHOW-ACCURATE AMETHYST ---
  drawAmethyst(ctx, bob, animP = 0, actionType = '') {
    if (this.isSpinDashing) {
      this.drawAmethystSpinDash(ctx);
      return;
    }

    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isSkillSlam = (actionType === 'skill');

    // Helper to draw a full-sized braided quartz whip + 8-spiked morningstar flail!
    const drawQuartzWhip = (hx, hy, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, tipX, tipY, scaleM = 1) => {
      // Outer electric violet cord
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 6 * scaleM;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, tipX, tipY);
      ctx.stroke();

      // Inner bright lilac braided highlight
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 2.2 * scaleM;
      ctx.stroke();

      // Quartz barb nodules along cord
      const midX = (hx + ctrl1X + ctrl2X + tipX) * 0.25;
      const midY = (hy + ctrl1Y + ctrl2Y + tipY) * 0.25;
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(midX, midY, 3.8 * scaleM, 0, Math.PI * 2);
      ctx.fill();

      // Heavy 8-Spiked Quartz Morningstar Tip
      const starR = 8.5 * scaleM;
      ctx.fillStyle = '#7e22ce';
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(tipX, tipY, starR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.9;
      const spin = Date.now() / 160;
      for (let s = 0; s < 8; s++) {
        const sa = (Math.PI * 2 / 8) * s + spin;
        ctx.beginPath();
        ctx.moveTo(tipX + Math.cos(sa) * (starR + 6.5 * scaleM), tipY + Math.sin(sa) * (starR + 6.5 * scaleM));
        ctx.lineTo(tipX + Math.cos(sa + 0.34) * starR, tipY + Math.sin(sa + 0.34) * starR);
        ctx.lineTo(tipX + Math.cos(sa - 0.34) * starR, tipY + Math.sin(sa - 0.34) * starR);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    };

    // 0. LONG, VOLUMINOUS, WILD WAVY PALE-LILAC HAIR MANE (BACK CASCADE — NO CIRCLES!)
    const swX = hair.swayX;
    const swY = hair.swayY;
    // Deep lilac under-wave shadow layer
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.moveTo(-4, -86 + bob);
    ctx.bezierCurveTo(-24, -84 + bob, -31 + swX * 0.5, -66 + bob + swY * 0.4, -25 + swX * 0.7, -50 + bob + swY * 0.5);
    ctx.bezierCurveTo(-34 + swX, -36 + bob + swY, -32 + swX * 1.2, -20 + bob + swY, -22 + swX * 1.3, -12 + bob + swY);
    ctx.quadraticCurveTo(-13 + swX, -18 + bob + swY, -12 + swX * 0.8, -26 + bob + swY);
    ctx.quadraticCurveTo(-5 + swX * 0.6, -15 + bob + swY, 2 + swX * 0.4, -22 + bob + swY);
    ctx.bezierCurveTo(14, -34 + bob, 20, -56 + bob, 14, -78 + bob);
    ctx.closePath();
    ctx.fill();

    // Main lush pale-lilac S-wave cascading mane (#f3e8ff)
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.moveTo(2, -88 + bob);
    // Crown wave sweeping back (-X) into deep sinuous S-waves down past her hips!
    ctx.bezierCurveTo(-18, -90 + bob, -28 + swX * 0.4, -72 + bob + swY * 0.3, -22 + swX * 0.6, -56 + bob + swY * 0.4);
    ctx.bezierCurveTo(-31 + swX * 0.9, -42 + bob + swY * 0.7, -29 + swX * 1.15, -26 + bob + swY, -19 + swX * 1.2, -15 + bob + swY);
    // Wavy layered tips (3 soft flowing locks, zero circles!)
    ctx.quadraticCurveTo(-12 + swX * 0.9, -23 + bob + swY, -10 + swX * 0.8, -31 + bob + swY * 0.7);
    ctx.quadraticCurveTo(-6 + swX * 0.7, -20 + bob + swY, 0 + swX * 0.5, -18 + bob + swY);
    ctx.quadraticCurveTo(6 + swX * 0.3, -28 + bob + swY * 0.5, 6, -38 + bob);
    // Right/front shoulder-draping wavy lock
    ctx.bezierCurveTo(18, -42 + bob, 22, -62 + bob, 14, -80 + bob);
    ctx.quadraticCurveTo(10, -88 + bob, 2, -88 + bob);
    ctx.closePath();
    ctx.fill();

    // Sinuous lavender S-wave strand ribbons inside back hair
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -80 + bob);
    ctx.bezierCurveTo(-22 + swX * 0.4, -66 + bob, -15 + swX * 0.7, -50 + bob, -23 + swX, -32 + bob + swY * 0.7);
    ctx.moveTo(-6, -74 + bob);
    ctx.bezierCurveTo(-14 + swX * 0.3, -58 + bob, -8 + swX * 0.6, -42 + bob, -14 + swX * 0.8, -24 + bob + swY * 0.7);
    ctx.stroke();

    // 1. Articulated Black Leggings with Lilac Star-Cutouts & White Brawler Boots
    const drawAmethystLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -26 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#17153b' : '#1e1b4b';
      ctx.fillRect(-5.5, 0, 11, 22);
      ctx.fillStyle = '#c084fc';
      this.drawMiniStar(ctx, 0, 10, 4.2);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-6, 20, 13, 6);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-6, 24.5, 13, 2);
      ctx.restore();
    };
    drawAmethystLeg(-7 + legs.backX, legs.backY, legs.backRot, true);
    drawAmethystLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Whip Arm (Either resting coiled whip OR Hit 3 Dual-Whip X-Cleave!)
    if (isPunch && combo === 2) {
      // Hit 3: Left arm whips forward in unison for Twin Morningstar X-Cleave!
      const lash = Math.max(0, strike) * 38;
      this.drawArticulatedArm(ctx, -10, -48 + bob, 4 + lash * 0.35, -54 + bob, 16 + lash * 0.55, -52 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      drawQuartzWhip(16 + lash * 0.55, -52 + bob, 28 + lash * 0.8, -68 + bob, 44 + lash, -28 + bob, 56 + lash * 1.15, -18 + bob, 0.92);
    } else if (!isSkillSlam) {
      this.drawArticulatedArm(ctx, -11, -48 + bob, -17, -40 + bob, -15, -32 + bob, '#d8b4fe', '#d8b4fe', 7.5, 6.5, '#d8b4fe', 4);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-15, -32 + bob);
      ctx.bezierCurveTo(-24, -26 + bob, -22, -16 + bob, -16, -15 + bob);
      ctx.stroke();
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(-16, -15 + bob, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Off-the-Shoulder Brawler Tank Top & Lavender Torso
    ctx.fillStyle = '#d8b4fe';
    ctx.fillRect(-14, -56 + bob, 28, 30);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-13, -56 + bob, 4, 10);
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(-15, -52 + bob, 30, 27, 6);
    ctx.fill();

    // 4. Hexagonal Faceted Amethyst Gem on Chest
    ctx.fillStyle = '#7e22ce';
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const cx = 0, cy = -44 + bob, r = 6;
    for (let a = 0; a < 6; a++) {
      const angle = (Math.PI / 3) * a;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#c084fc';
      this.drawMiniStar(ctx, 0, -44 + bob, 5);
    }

    // 5. Lavender Face with Round Chin
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.arc(0, -66 + bob, 15.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.beginPath();
    ctx.ellipse(6, -62 + bob, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Signature Cocky Toothy Smirk with Quartz Fang!
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.moveTo(0, -60 + bob);
    ctx.quadraticCurveTo(6, -58 + bob, 12, -61 + bob);
    ctx.quadraticCurveTo(6, -52 + bob, 0, -60 + bob);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(1, -60 + bob);
    ctx.lineTo(11, -61 + bob);
    ctx.lineTo(9, -57 + bob);
    ctx.lineTo(6, -59 + bob);
    ctx.lineTo(2, -58 + bob);
    ctx.closePath();
    ctx.fill();

    // 7. Expressive Dark Violet Right Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(6.5, -67 + bob, 4.4, 5.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.ellipse(7, -66.5 + bob, 3.1, 4.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7.8, -68 + bob, 1.4, 0, Math.PI * 2);
    ctx.arc(5.8, -65 + bob, 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3b0764';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(2.5, -71.5 + bob); ctx.lineTo(11.5, -74.5 + bob);
    } else {
      ctx.moveTo(2.5, -73 + bob); ctx.quadraticCurveTo(7, -76 + bob, 11.5, -72 + bob);
    }
    ctx.stroke();

    // 8. Sculpted Wavy Front Bangs Sweeping Dramatically OVER Her Left Eye + Right Cheek Tendril!
    // Right-temple wavy tendril framing face
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.moveTo(5, -83 + bob);
    ctx.bezierCurveTo(15, -80 + bob, 20, -68 + bob, 15, -55 + bob);
    ctx.quadraticCurveTo(18, -46 + bob, 13, -42 + bob);
    ctx.quadraticCurveTo(12, -54 + bob, 13, -66 + bob);
    ctx.quadraticCurveTo(11, -76 + bob, 3, -79 + bob);
    ctx.closePath();
    ctx.fill();

    // Signature thick S-wave lilac curtain bang draping diagonally across left eye!
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.moveTo(5, -84 + bob);
    ctx.bezierCurveTo(-8, -85 + bob, -19, -73 + bob, -15, -58 + bob);
    ctx.bezierCurveTo(-13, -50 + bob, -18 + swX * 0.25, -42 + bob, -9 + swX * 0.2, -39 + bob);
    ctx.bezierCurveTo(-4, -47 + bob, -7, -55 + bob, -1, -63 + bob);
    ctx.quadraticCurveTo(4, -71 + bob, 5, -84 + bob);
    ctx.closePath();
    ctx.fill();

    // Subtle wavy lavender strand highlight on front bang
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(1, -81 + bob);
    ctx.bezierCurveTo(-9, -74 + bob, -7, -60 + bob, -10, -45 + bob);
    ctx.stroke();

    // 9. Kinetic Lead Arm & Dual Spiked Quartz Whip Action Poses
    if (isSkillSlam) {
      const whipWiggle = Math.sin(animP * Math.PI * 4) * 9;
      this.drawArticulatedArm(ctx, -10, -48 + bob, -18, -56 + bob, -8, -44 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      this.drawArticulatedArm(ctx, 10, -48 + bob, 18, -56 + bob, 16, -42 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      drawQuartzWhip(-8, -44 + bob, -22, -65 + bob, -18 + whipWiggle, -18, 18 + whipWiggle, -2, 0.95);
      drawQuartzWhip(16, -42 + bob, 30, -68 + bob, 44 - whipWiggle, -18, 38 - whipWiggle, -2, 1.0);
      ctx.fillStyle = '#fde047';
      this.drawMiniStar(ctx, 18 + whipWiggle, 0, 9);
      this.drawMiniStar(ctx, 38 - whipWiggle, 0, 9);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(28, 0, 38, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isPunch) {
      const lash = Math.max(0, strike) * 44;
      const coil = Math.min(0, strike) * 14;
      if (combo === 0) {
        // Hit 1: High-Snapping S-Curve Whip Crack!
        const hx = 18 + lash * 0.35 + coil;
        const hy = -48 + bob - Math.max(0, strike) * 5;
        this.drawArticulatedArm(ctx, 10, -48 + bob, 14 + lash * 0.18 + coil * 0.5, -52 + bob, hx, hy, '#d8b4fe', '#d8b4fe', 8.5, 7, '#d8b4fe', 5);
        const wave = Math.sin(animP * Math.PI * 2.5) * 14;
        drawQuartzWhip(hx, hy, hx + 14 + lash * 0.3, hy - 18 + wave, hx + 28 + lash * 0.65, hy + 14 - wave, 34 + lash * 1.15 + coil, -38 + bob, 1.0);
      } else if (combo === 1) {
        // Hit 2: Low-Sweeping Rising Diagonal Whip Lash!
        const hx = 18 + lash * 0.35 + coil;
        const hy = -42 + bob + Math.max(0, 1 - animP * 2) * 8;
        this.drawArticulatedArm(ctx, 10, -46 + bob, 14 + lash * 0.18, -40 + bob, hx, hy, '#d8b4fe', '#d8b4fe', 8.5, 7, '#d8b4fe', 5);
        const sweepY = -12 + bob - animP * 44;
        drawQuartzWhip(hx, hy, hx + 16 + lash * 0.3, -10 + bob, hx + 30 + lash * 0.7, sweepY + 12, 36 + lash * 1.15, sweepY, 1.0);
      } else {
        // Hit 3: Right Whip of Dual-Whip Twin X-Cleave (Slashes from low-to-high crossing Left Whip!)
        const hx = 20 + lash * 0.4;
        const hy = -42 + bob;
        this.drawArticulatedArm(ctx, 10, -48 + bob, 15 + lash * 0.2, -42 + bob, hx, hy, '#d8b4fe', '#d8b4fe', 8.5, 7, '#d8b4fe', 5);
        drawQuartzWhip(hx, hy, 32 + lash * 0.65, -14 + bob, 48 + lash * 0.9, -58 + bob, 60 + lash * 1.18, -64 + bob, 1.05);
      }
    } else {
      // Idle / Walking Ready Spiked Whip
      const idleWave = Math.sin(Date.now() / 220) * 3;
      this.drawArticulatedArm(ctx, 10, -48 + bob, 15, -43 + bob, 20, -44 + bob, '#d8b4fe', '#d8b4fe', 8, 7, '#d8b4fe', 4.5);
      drawQuartzWhip(20, -44 + bob, 26, -34 + bob + idleWave, 24, -24 + bob - idleWave, 32, -32 + bob + idleWave * 0.5, 0.95);
    }
  }

  // Authentic Lore: Quartz Buzzsaw Spin Dash Ball
  drawAmethystSpinDash(ctx) {
    ctx.save();
    const rot = (Date.now() / 25) * this.facing;
    const r = 24;

    for (let t = 1; t <= 3; t++) {
      ctx.save();
      ctx.globalAlpha = 0.28 / t;
      ctx.fillStyle = '#7e22ce';
      ctx.beginPath();
      ctx.arc(-t * 12, -22, r - t * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(216, 180, 254, 0.45)';
    ctx.beginPath();
    ctx.arc(-20, -6, 8, 0, Math.PI * 2);
    ctx.arc(-28, -8, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -22);
    ctx.rotate(rot);

    const spikes = 10;
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
      const a = (i * Math.PI * 2) / spikes;
      const x1 = Math.cos(a) * (r + 7);
      const y1 = Math.sin(a) * (r + 7);
      const aMid = a + Math.PI / spikes;
      const x2 = Math.cos(aMid) * (r - 2);
      const y2 = Math.sin(aMid) * (r - 2);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();

    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    coreGrad.addColorStop(0, '#f3e8ff');
    coreGrad.addColorStop(0.4, '#c084fc');
    coreGrad.addColorStop(1, '#6b21a8');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }

    ctx.restore();
  }

  // --- SHOW-ACCURATE PEARL ---
  drawPearl(ctx, bob, animP = 0, actionType = '') {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isLaser = (actionType === 'throw');
    const isHolo = (actionType === 'skill');

    // Helper to draw slender ballerina leg + teal ribbon slipper
    const drawPearlLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -38 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#f1f5f9' : '#fffbeb';
      ctx.fillRect(-2.8, 0, 5.6, 35);
      ctx.fillStyle = '#2dd4bf';
      ctx.beginPath();
      ctx.roundRect(-3, 34, 9.5, 4, 2);
      ctx.fill();
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-2.5, 28); ctx.lineTo(3, 32);
      ctx.moveTo(3, 28); ctx.lineTo(-2.5, 32);
      ctx.stroke();
      ctx.restore();
    };

    // 1. Ballet / Fencing Legs (Deep classical en-garde lunge on Hit 1!)
    if (isPunch && combo === 2) {
      // Ballet Pirouette Passe Leg Pose on 3rd hit spin!
      drawPearlLeg(-2, 0, 0.06, true);
      ctx.save();
      ctx.translate(3, -38 + bob);
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(11, 13); ctx.lineTo(1, 22);
      ctx.lineWidth = 5.2;
      ctx.strokeStyle = '#fffbeb';
      ctx.stroke();
      ctx.restore();
    } else {
      drawPearlLeg(-4 + legs.backX, legs.backY, legs.backRot, true);
      drawPearlLeg(4 + legs.frontX, legs.frontY, legs.frontRot, false);
    }

    // 2. Rear Left Arm (Classical Fencing Counter-Poise on Thrust, Two-Handed on Slash/Laser!)
    if (isPunch && combo === 0) {
      // Elegant classical fencing rear arm raised behind (-X) with curled wrist!
      const poise = Math.max(0, strike) * 5;
      this.drawArticulatedArm(ctx, -6, -65 + bob, -18 - poise, -71 + bob, -25 - poise, -80 + bob, '#38bdf8', '#fff7ed', 5.5, 4.8, '#fff7ed', 3.5);
    } else if (!isPunch && !isLaser && !isHolo) {
      const armSwing = Math.sin(this.walkAnim) * 4;
      this.drawArticulatedArm(ctx, -6, -65 + bob, -10 - armSwing * 0.5, -52 + bob, -8 - armSwing, -40 + bob, '#38bdf8', '#fff7ed', 5.2, 4.5, '#fff7ed', 3.2);
    }

    // 3. Cyan Ballerina Tunic with Bold Gold 5-Pointed Star
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(-9, -70 + bob, 18, 34, 4);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 1.5, -56 + bob, 6.5);

    // 4. Translucent Pink Chiffon Ribbon Sash (Flows gracefully BEHIND her [-X])
    const sashSway = hair.swayX * 0.9;
    ctx.fillStyle = 'rgba(255, 148, 186, 0.78)';
    ctx.beginPath();
    ctx.moveTo(-11, -42 + bob);
    ctx.lineTo(11, -42 + bob);
    ctx.lineTo(8, -34 + bob);
    ctx.lineTo(-14, -34 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-12, -36 + bob);
    ctx.quadraticCurveTo(-21 + sashSway * 0.6, -28 + bob, -26 + sashSway, -17 + bob + hair.swayY);
    ctx.moveTo(-9, -36 + bob);
    ctx.quadraticCurveTo(-16 + sashSway * 0.5, -24 + bob, -19 + sashSway * 0.8, -12 + bob + hair.swayY);
    ctx.stroke();

    // 5. Canon Pearl haircut: short back-swept bob with a tapered point and soft volume
    const tipX = -18 + hair.swayX * 0.5;
    const tipY = -101 + bob + hair.swayY * 0.4;

    // Rounded skull-cap mass that comes to a point behind the head
    ctx.fillStyle = '#f7ddc4';
    ctx.beginPath();
    ctx.moveTo(10, -90 + bob);
    ctx.quadraticCurveTo(15, -103 + bob, 3, -106 + bob);
    ctx.quadraticCurveTo(-9, -108 + bob, tipX, tipY);
    ctx.quadraticCurveTo(-14, -92 + bob, -9, -80 + bob);
    ctx.quadraticCurveTo(0, -76 + bob, 9, -83 + bob);
    ctx.closePath();
    ctx.fill();

    // Tapered nape lock sweeping down-back
    ctx.fillStyle = '#eac4a2';
    ctx.beginPath();
    ctx.moveTo(-8, -85 + bob);
    ctx.quadraticCurveTo(tipX - 1, tipY + 7, -15, -74 + bob);
    ctx.quadraticCurveTo(-11, -86 + bob, -4, -89 + bob);
    ctx.closePath();
    ctx.fill();

    // Glossy crown highlight
    ctx.fillStyle = '#fdf0e0';
    ctx.beginPath();
    ctx.moveTo(8, -95 + bob);
    ctx.quadraticCurveTo(3, -106 + bob, -8, -101 + bob);
    ctx.quadraticCurveTo(-1, -98 + bob, 2, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // 6. Graceful Porcelain Neck & Head
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(-2, -76 + bob, 6, 8);
    ctx.beginPath();
    ctx.ellipse(0, -84 + bob, 11.5, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Signature forehead curl (the little question-mark wisp over the gem)
    ctx.strokeStyle = '#eac4a2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(6, -94 + bob, 4.4, Math.PI * 0.05, Math.PI * 1.35);
    ctx.stroke();

    // 7. Forehead Luminous Oval Pearl Gemstone
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = (isLaser || isHolo) ? '#67e8f9' : '#38bdf8';
    ctx.lineWidth = (isLaser || isHolo) ? 2.4 : 1.2;
    ctx.beginPath();
    ctx.ellipse(2.5, -92 + bob, 4, 6.2, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
    ctx.beginPath();
    ctx.ellipse(1.5, -93.5 + bob, 1.5, 2.8, 0.15, 0, Math.PI * 2);
    ctx.fill();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#ffffff';
      this.drawMiniStar(ctx, 2.5, -92 + bob, 6);
    }

    // 8. Sharp Pointed Nose (Points cleanly FORWARD [+X])
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(7, -84 + bob);
    ctx.lineTo(16, -81 + bob);
    ctx.lineTo(7, -78 + bob);
    ctx.closePath();
    ctx.fill();

    // 9. Expressive Cyan Anime Eye & Fencing Focus Brow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(4, -83 + bob, 3.8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(4.5, -82.5 + bob, 2.6, 4.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.ellipse(4.8, -82.5 + bob, 1.4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5.2, -84 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(1, -88.5 + bob); ctx.lineTo(8.5, -86.5 + bob);
    } else {
      ctx.moveTo(1, -87 + bob); ctx.quadraticCurveTo(5, -89 + bob, 8.5, -86 + bob);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(251, 146, 60, 0.35)';
    ctx.beginPath();
    ctx.ellipse(4, -78 + bob, 3, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(3, -74 + bob);
    ctx.quadraticCurveTo(6, -72 + bob, 8, -73.5 + bob);
    ctx.stroke();

    // 10. SUBSTANTIAL SHOW-ACCURATE PEARL SPEAR & FENCING / BALLET CHOREOGRAPHY!
    let spearBaseX = 10;
    let spearBaseY = -48 + bob;
    let spearAngle = -0.22;

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Lightning Fencing Lunge Thrust + Multi-Jab Afterimage Tips!
        const reach = strike * 46;
        spearBaseX = 12 + reach;
        spearBaseY = -51 + bob;
        spearAngle = 0.02;
        this.drawArticulatedArm(ctx, 5, -64 + bob, 9 + reach * 0.45, -56 + bob, spearBaseX, spearBaseY, '#38bdf8', '#fff7ed', 5.8, 5, '#fff7ed', 3.6);
      } else if (combo === 1) {
        // Hit 2: Wide Two-Handed Sweeping Halberd Crescent Slash!
        const sweepP = Math.min(1, animP * 1.35);
        spearBaseX = 14 + Math.max(0, strike) * 20;
        spearBaseY = -52 + bob;
        spearAngle = -0.95 + sweepP * 1.55;
        this.drawArticulatedArm(ctx, -4, -64 + bob, 4, -56 + bob, spearBaseX - 6, spearBaseY, '#38bdf8', '#fff7ed', 5.5, 4.8);
        this.drawArticulatedArm(ctx, 6, -64 + bob, 11, -55 + bob, spearBaseX, spearBaseY, '#38bdf8', '#fff7ed', 5.8, 5, '#fff7ed', 3.6);
      } else {
        // Hit 3: Graceful 360° Ballet Pirouette Spear Twirl!
        spearBaseX = 14 + Math.max(0, strike) * 22;
        spearBaseY = -54 + bob;
        spearAngle = -Math.PI + animP * Math.PI * 2.2;
        this.drawArticulatedArm(ctx, 4, -64 + bob, 10, -60 + bob, spearBaseX, spearBaseY, '#38bdf8', '#fff7ed', 5.8, 5, '#fff7ed', 3.6);
      }
    } else if (isLaser) {
      // Two-Handed Spear-Laser Aiming Stance!
      spearBaseX = 14 + Math.max(0, strike) * 10;
      spearBaseY = -52 + bob;
      spearAngle = 0.0;
      this.drawArticulatedArm(ctx, -5, -64 + bob, 3, -55 + bob, spearBaseX - 8, spearBaseY, '#38bdf8', '#fff7ed', 5.5, 4.8);
      this.drawArticulatedArm(ctx, 6, -64 + bob, 11, -55 + bob, spearBaseX, spearBaseY, '#38bdf8', '#fff7ed', 5.8, 5, '#fff7ed', 3.6);
    } else if (isHolo) {
      // Elegant Upright Fencing Salute Summoning Holo-Pearl!
      spearBaseX = 16;
      spearBaseY = -44 + bob;
      spearAngle = -Math.PI * 0.48;
      this.drawArticulatedArm(ctx, 5, -64 + bob, 12, -54 + bob, spearBaseX, spearBaseY, '#38bdf8', '#fff7ed', 5.8, 5, '#fff7ed', 3.6);
      // Holographic projection cone from Forehead Pearl!
      ctx.fillStyle = 'rgba(103, 232, 249, 0.28)';
      ctx.beginPath();
      ctx.moveTo(4, -92 + bob);
      ctx.lineTo(48, -78 + bob);
      ctx.lineTo(48, -28 + bob);
      ctx.closePath();
      ctx.fill();
    } else {
      // Ready Poise
      this.drawArticulatedArm(ctx, 5, -64 + bob, 8, -54 + bob, spearBaseX, spearBaseY, '#38bdf8', '#fff7ed', 5.6, 4.8, '#fff7ed', 3.5);
    }

    // Multi-jab holographic spear afterimage tips on Hit 1!
    if (isPunch && combo === 0 && strike > 0.2) {
      for (const angOff of [-0.14, 0.14]) {
        ctx.save();
        ctx.globalAlpha = 0.42;
        ctx.translate(spearBaseX - 8, spearBaseY);
        ctx.rotate(angOff);
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(34, 0); ctx.lineTo(78, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(spearBaseX, spearBaseY);
    ctx.rotate(spearAngle);

    // Slender pearlescent shaft with a single gold collar (canon: elegant, not a lance)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.fillRect(-16, -2, 54, 4);
    ctx.strokeRect(-16, -2, 54, 4);

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(30, -2.6, 5, 5.2);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-16, 0, 3.6, 0, Math.PI * 2);
    ctx.fill();

    // Spiraling Golden Wing Crossguard Collar
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(40, -8);
    ctx.quadraticCurveTo(44, 0, 40, 8);
    ctx.lineTo(46, 5);
    ctx.lineTo(48, 0);
    ctx.lineTo(46, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(44, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Glorious Large Crystalline Cyan Spearhead Blade (46px long, 16px wide!)
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(38, -5);
    ctx.lineTo(58, -6.5);
    ctx.lineTo(74, 0);
    ctx.lineTo(58, 6.5);
    ctx.lineTo(38, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(68, 0);
    ctx.lineTo(58, -2.6);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(58, -6);
    ctx.lineTo(74, 0);
    ctx.lineTo(58, 6);
    ctx.stroke();

    if (isLaser) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(74, 0, 10 + Math.sin(Date.now() / 35) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBubbleShield(ctx) {
    ctx.save();
    const bubbleGrad = ctx.createRadialGradient(0, -45, 10, 0, -45, 55);
    bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    bubbleGrad.addColorStop(0.6, 'rgba(255, 96, 151, 0.5)');
    bubbleGrad.addColorStop(1, 'rgba(244, 63, 94, 0.85)');

    ctx.fillStyle = bubbleGrad;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -45, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -45, 46, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.restore();
  }

  // --- SHOW-ACCURATE BISMUTH ---
  drawBismuth(ctx, bob, animP = 0, actionType = '') {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isSkillSlam = (actionType === 'skill');
    const isAnvilThrow = (actionType === 'throw' && animP > 0.28);

    // 0. THICK, CHUNKY TUBULAR RAINBOW DREADLOCKS CASCADING BEHIND SHOULDERS (-X, NO FLOATING DOTS!)
    const swX = hair.swayX * 0.75;
    const swY = hair.swayY * 0.6;
    const dreadSpecs = [
      { color: '#a855f7', endX: -22, endY: -44, midX: -28, midY: -68, w: 6.5 },
      { color: '#3b82f6', endX: -27, endY: -48, midX: -32, midY: -74, w: 6.8 },
      { color: '#22c55e', endX: -31, endY: -54, midX: -35, midY: -80, w: 7.0 },
      { color: '#eab308', endX: -33, endY: -62, midX: -34, midY: -86, w: 7.0 },
      { color: '#f97316', endX: -30, endY: -70, midX: -30, midY: -92, w: 6.8 },
      { color: '#ef4444', endX: -25, endY: -78, midX: -24, midY: -97, w: 6.5 }
    ];
    for (let d = 0; d < dreadSpecs.length; d++) {
      const dr = dreadSpecs[d];
      const tx = dr.endX + swX * (0.6 + d * 0.08);
      const ty = dr.endY + bob + swY;
      // Dark charcoal separation outline
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = dr.w + 2.2;
      ctx.beginPath();
      ctx.moveTo(-10, -91 + bob);
      ctx.quadraticCurveTo(dr.midX + swX * 0.4, dr.midY + bob, tx, ty);
      ctx.stroke();
      // Chunky vibrant rainbow dreadlock tube
      ctx.strokeStyle = dr.color;
      ctx.lineWidth = dr.w;
      ctx.stroke();
      // Squared stepped dreadlock end-cap!
      ctx.fillStyle = dr.color;
      ctx.fillRect(tx - 3.5, ty - 3.5, 7, 7);
    }

    // Dark slate hair-tie band bundling the rainbow dreads behind crown
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-16, -98 + bob, 8, 13, 3);
    ctx.fill();
    ctx.stroke();

    // 1. Articulated Heavy Forge Pants & Armored Boots
    const drawBismuthLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -30 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#350808' : '#450a0a';
      ctx.fillRect(-6.5, 0, 13, 24);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-7, 22, 15, 8);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-7, 28, 15, 2.5);
      ctx.restore();
    };
    drawBismuthLeg(-8 + legs.backX, legs.backY, legs.backRot, true);
    drawBismuthLeg(7 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Muscular Arm
    if (!(isPunch && combo === 2)) {
      const armSwing = Math.sin(this.walkAnim) * 5;
      this.drawArticulatedArm(ctx, -15, -62 + bob, -23 - armSwing * 0.4, -50 + bob, -20 - armSwing, -38 + bob, '#64748b', '#94a3b8', 11, 9.5, '#94a3b8', 6);
    }

    // 3. Muscular Slate-Grey Torso & Blacksmith Leather Apron
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(-19, -68 + bob, 38, 40, 6);
    ctx.fill();

    ctx.fillStyle = '#92400e';
    ctx.fillRect(-14, -58 + bob, 28, 30);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, -68 + bob);
    ctx.lineTo(14, -48 + bob);
    ctx.stroke();

    // 4. Concentric Square Bismuth Gemstone on Chest
    const gemX = 1, gemY = -52 + bob;
    if (this.isPinkOverdrive) {
      const hue = (Date.now() / 8) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
      ctx.fillRect(gemX - 8, gemY - 8, 16, 16);
      ctx.fillStyle = `hsl(${(hue + 60) % 360}, 100%, 70%)`;
      ctx.fillRect(gemX - 5.5, gemY - 5.5, 11, 11);
      ctx.fillStyle = `hsl(${(hue + 120) % 360}, 100%, 75%)`;
      ctx.fillRect(gemX - 3, gemY - 3, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(gemX - 1.5, gemY - 1.5, 3, 3);
    } else {
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(gemX - 7, gemY - 7, 14, 14);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(gemX - 5, gemY - 5, 10, 10);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(gemX - 3, gemY - 3, 6, 6);
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(gemX - 1.5, gemY - 1.5, 3, 3);
    }

    // 5. Muscular Slate-Grey Face & Swept Rainbow Crown Hairline!
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(0, -80 + bob, 16, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // Swept-back rainbow dreadlock crown roots framing her upper forehead
    const crownBands = [
      { c: '#ef4444', y: -96, x1: 8, x2: -10 },
      { c: '#f97316', y: -93, x1: 5, x2: -12 },
      { c: '#eab308', y: -90, x1: 1, x2: -14 },
      { c: '#22c55e', y: -86, x1: -4, x2: -15 }
    ];
    for (const cb of crownBands) {
      ctx.strokeStyle = cb.c;
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(cb.x1, cb.y + bob);
      ctx.quadraticCurveTo(-4, cb.y - 2 + bob, cb.x2, cb.y + 1 + bob);
      ctx.stroke();
    }

    // Friendly Eyes & Bushy Warrior Eyebrows
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(-4.5, -82 + bob, 3.6, 4.8, 0, 0, Math.PI * 2);
    ctx.ellipse(5.5, -82 + bob, 3.6, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3.5, -83.5 + bob, 1.4, 0, Math.PI * 2);
    ctx.arc(6.5, -83.5 + bob, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(-10, -89.5 + bob); ctx.lineTo(-1, -87 + bob);
      ctx.moveTo(2, -87 + bob); ctx.lineTo(11, -89.5 + bob);
    } else {
      ctx.moveTo(-10, -88.5 + bob); ctx.lineTo(-1, -87.5 + bob);
      ctx.moveTo(2, -87.5 + bob); ctx.lineTo(11, -88.5 + bob);
    }
    ctx.stroke();

    // 6. Broad Boisterous Toothy Grin
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-8, -73 + bob);
    ctx.quadraticCurveTo(0, -71 + bob, 8, -73 + bob);
    ctx.quadraticCurveTo(0, -62 + bob, -8, -73 + bob);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-7.5, -73 + bob);
    ctx.lineTo(7.5, -73 + bob);
    ctx.quadraticCurveTo(0, -68 + bob, -7.5, -73 + bob);
    ctx.fill();

    // 7. TRUE SHAPESHIFTING BLACKSMITH WEAPON ARMS!
    if (isAnvilThrow) {
      const ext = Math.sin(((animP - 0.28) / 0.72) * Math.PI) * 14;
      this.drawArticulatedArm(ctx, 13, -60 + bob, 20 + ext * 0.5, -54 + bob, 28 + ext, -50 + bob, '#64748b', '#f97316', 11, 9.5, '#fbbf24', 5.5);
    } else if (isSkillSlam) {
      // Breaking Point Pneumatic Magma Pile-Driver!
      const slamP = Math.max(0, strike);
      const hy = -42 + bob + slamP * 26;
      const hx = 18 + slamP * 14;
      this.drawArticulatedArm(ctx, 13, -60 + bob, 22, -48 + bob, hx, hy, '#64748b', '#475569', 12, 11);
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(0.45);
      // Heavy piston housing
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.fillRect(-6, -12, 24, 24);
      ctx.strokeRect(-6, -12, 24, 24);
      // Glowing incandescent Breaking Point drill spike!
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(18, -9);
      ctx.lineTo(42, 0);
      ctx.lineTo(18, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (isPunch) {
      if (combo === 0) {
        // Hit 1: Shapeshifted Spiked Forge War-Hammer Swing!
        const reach = strike * 32;
        const hx = 20 + reach;
        const hy = -50 + bob + Math.max(0, strike) * 4;
        this.drawArticulatedArm(ctx, 13, -60 + bob, 16 + reach * 0.45, -56 + bob, hx, hy, '#64748b', '#64748b', 11, 9.5);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(-0.4 + Math.max(0, strike) * 0.65);
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(0, -16, 22, 32, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        this.drawMiniStar(ctx, 11, 0, 5.5);
        // Striking face spikes
        ctx.fillStyle = '#fbbf24';
        for (const sy of [-10, 0, 10]) {
          ctx.beginPath();
          ctx.moveTo(22, sy - 3); ctx.lineTo(30, sy); ctx.lineTo(22, sy + 3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else if (combo === 1) {
        // Hit 2: Shapeshifted Broad Crescent Battle-Axe Cleave!
        const reach = strike * 34;
        const hx = 22 + reach;
        const hy = -52 + bob;
        this.drawArticulatedArm(ctx, 13, -60 + bob, 17 + reach * 0.45, -55 + bob, hx, hy, '#64748b', '#64748b', 11, 9.5);
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(-0.55 + animP * 1.15);
        // Double crescent steel battle-axe blade!
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.quadraticCurveTo(18, -26, 28, -18);
        ctx.quadraticCurveTo(34, 0, 28, 18);
        ctx.quadraticCurveTo(18, 26, 0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f97316';
        this.drawMiniStar(ctx, 14, 0, 5.5);
        ctx.restore();
      } else {
        // Hit 3: Two-Handed Colossal Molten Anvil-Maul Overhead Smash!
        const reach = Math.max(0, strike) * 34;
        const smashY = animP < 0.34 ? (-88 + bob) : (-88 + bob + Math.min(1, (animP - 0.34) / 0.30) * 64);
        this.drawArticulatedArm(ctx, -12, -62 + bob, 4 + reach * 0.4, smashY - 6, 18 + reach, smashY, '#64748b', '#64748b', 10.5, 9.5);
        this.drawArticulatedArm(ctx, 14, -62 + bob, 12 + reach * 0.45, smashY - 4, 22 + reach, smashY, '#64748b', '#64748b', 11, 10);
        ctx.save();
        ctx.translate(22 + reach, smashY);
        ctx.rotate(animP < 0.34 ? -0.9 : 0.35);
        // Giant glowing blacksmith anvil head!
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-10, -16);
        ctx.lineTo(24, -16);
        ctx.lineTo(36, -6); // Anvil horn!
        ctx.lineTo(24, 16);
        ctx.lineTo(-10, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f97316';
        this.drawMiniStar(ctx, 10, 0, 7);
        ctx.restore();
      }
    } else {
      // Idle Ready Hammer-Fist
      this.drawArticulatedArm(ctx, 13, -60 + bob, 16, -50 + bob, 20, -46 + bob, '#64748b', '#64748b', 10.5, 9);
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(18, -56 + bob, 18, 22, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      this.drawMiniStar(ctx, 27, -45 + bob, 4.5);
    }
  }

  // --- SHOW-ACCURATE PERIDOT ---
  drawPeridot(ctx, bob, animP = 0, actionType = '') {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isChanneling = (actionType === 'throw' || actionType === 'skill');

    // 1. Articulated Dark Emerald Leggings & Star-Tech Boots
    const drawPeridotLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -28 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#053b2c' : '#064e3b';
      ctx.fillRect(-4, 0, 8, 23);
      ctx.fillStyle = '#facc15';
      this.drawMiniStar(ctx, 0, 10, 3.2);
      ctx.fillStyle = '#047857';
      ctx.fillRect(-4.5, 22, 10, 6);
      ctx.restore();
    };
    drawPeridotLeg(-5 + legs.backX, legs.backY, legs.backRot, true);
    drawPeridotLeg(5 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Arm (Expressive Ferrokinetic Conductor Pose!)
    if (isChanneling || (isPunch && combo === 2)) {
      this.drawArticulatedArm(ctx, -10, -54 + bob, -19, -62 + bob, -23, -72 + bob, '#15803d', '#a3e635', 6.5, 5.5, '#a3e635', 4);
      ctx.strokeStyle = 'rgba(163, 230, 53, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-23, -72 + bob, 7, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const armSwing = Math.sin(this.walkAnim) * 4;
      this.drawArticulatedArm(ctx, -10, -54 + bob, -15 - armSwing * 0.5, -45 + bob, -13 - armSwing, -36 + bob, '#15803d', '#a3e635', 6, 5, '#a3e635', 3.8);
    }

    // 3. Green Tech Suit with Crystal Gem Gold Star
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(-12, -58 + bob, 24, 32, 4);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    this.drawMiniStar(ctx, 0.5, -44 + bob, 6.5);

    // 4. Sculpted 3D Curved-Facet Tetrahedral Chartreuse Hair (Softened 3D Dorito Volume!)
    const hTilt = hair.swayX * 0.012;
    ctx.save();
    ctx.translate(0, -76 + bob);
    ctx.rotate(hTilt);
    // Main luminous chartreuse front/left curved tetrahedron
    ctx.fillStyle = '#d9f99d';
    ctx.beginPath();
    ctx.moveTo(0, -34); // Softened apex
    ctx.quadraticCurveTo(16, -16, 28, 10); // Gently curved right slope
    ctx.quadraticCurveTo(0, 14, -28, 10); // Gently curved lower volume
    ctx.quadraticCurveTo(-16, -16, 0, -34); // Gently curved left slope
    ctx.closePath();
    ctx.fill();

    // Right 3D tetrahedral shading facet
    ctx.fillStyle = '#bef264';
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.quadraticCurveTo(16, -16, 28, 10);
    ctx.quadraticCurveTo(12, 8, 2, 2);
    ctx.closePath();
    ctx.fill();

    // Specular crown highlight
    ctx.fillStyle = '#ecfccb';
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(-14, -6);
    ctx.lineTo(-2, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 5. Pale Lime Neck & Face
    ctx.fillStyle = '#a3e635';
    ctx.fillRect(-4, -66 + bob, 8, 10);
    ctx.beginPath();
    ctx.ellipse(0, -73 + bob, 13, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Forehead Triangular Peridot Gemstone
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -78 + bob);
    ctx.lineTo(6, -88 + bob);
    ctx.lineTo(-6, -88 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 7. Iconic Pointy Yellow Winged Visor Glasses
    ctx.fillStyle = 'rgba(250, 204, 21, 0.92)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -75 + bob);
    ctx.lineTo(9, -80 + bob);
    ctx.lineTo(20, -83 + bob);
    ctx.lineTo(11, -71 + bob);
    ctx.lineTo(0, -69 + bob);
    ctx.lineTo(-11, -71 + bob);
    ctx.lineTo(-20, -83 + bob);
    ctx.lineTo(-9, -80 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-16, -80 + bob);
    ctx.lineTo(16, -80 + bob);
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(-4.5, -74 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(5.5, -74 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3.8, -75 + bob, 1.2, 0, Math.PI * 2);
    ctx.arc(6.2, -75 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Quirky open grin
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(-5, -65 + bob);
    ctx.quadraticCurveTo(0, -63 + bob, 5, -65 + bob);
    ctx.quadraticCurveTo(0, -58 + bob, -5, -65 + bob);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -65 + bob, 8, 2.5);

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#86efac';
      this.drawDiamondInsignia(ctx, 0, -82 + bob, 5);
    }

    // 8. Expressive Ferrokinetic Hand Gestures & Levitating Metal Constructs!
    const reach = Math.max(0, strike) * 26;
    const handX = isChanneling ? 22 : (isPunch ? 20 + reach * 0.45 : 16);
    const handY = isChanneling ? -58 + bob : (isPunch ? -50 + bob : -46 + bob);
    this.drawArticulatedArm(ctx, 10, -54 + bob, 14 + (isPunch ? reach * 0.2 : 0), -49 + bob, handX, handY, '#15803d', '#a3e635', 6.5, 5.5, '#a3e635', 4.2);

    // Glowing Ferrokinetic Control Ring around Lead Hand
    const ringRadius = (isChanneling || isPunch) ? 11 + Math.sin(Date.now() / 50) * 2.5 : 7.5;
    ctx.strokeStyle = (isChanneling || isPunch) ? 'rgba(163, 230, 53, 0.95)' : 'rgba(132, 204, 22, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(handX + 2, handY, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: 3 Gleaming Levitating Steel Claws Slashing Forward!
        for (let cl = -1; cl <= 1; cl++) {
          const cx = 30 + reach * 1.15 + Math.abs(cl) * -4;
          const cy = -48 + bob + cl * 9;
          ctx.fillStyle = '#cbd5e1';
          ctx.strokeStyle = '#84cc16';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cx - 10, cy - 3);
          ctx.lineTo(cx + 12, cy + cl * 2);
          ctx.lineTo(cx - 8, cy + 3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else if (combo === 1) {
        // Hit 2: Heavy Riveted Steel I-Beam Girder Whipped Upward!
        ctx.save();
        ctx.translate(36 + reach, -44 + bob - reach * 0.4);
        ctx.rotate(-0.65 + animP * 1.4);
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-20, -6, 40, 12);
        ctx.strokeRect(-20, -6, 40, 12);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-20, -3, 40, 6);
        ctx.restore();
      } else {
        // Hit 3: Twin Magnetic Steel Crusher Jaws Clamping Shut!
        const clampGap = Math.max(3, (1 - Math.max(0, strike)) * 22);
        const jx = 40 + reach;
        const jy = -44 + bob;
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.8;
        // Upper crusher jaw
        ctx.beginPath();
        ctx.moveTo(jx - 14, jy - clampGap - 10);
        ctx.lineTo(jx + 16, jy - clampGap - 8);
        ctx.lineTo(jx + 10, jy - clampGap);
        ctx.lineTo(jx - 8, jy - clampGap);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Lower crusher jaw
        ctx.beginPath();
        ctx.moveTo(jx - 14, jy + clampGap + 10);
        ctx.lineTo(jx + 16, jy + clampGap + 8);
        ctx.lineTo(jx + 10, jy + clampGap);
        ctx.lineTo(jx - 8, jy + clampGap);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // Ambient Levitating Metal Shards
      const metalBob = Math.sin(Date.now() / 110) * 4.5;
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 1;
      ctx.fillRect(24 + (isChanneling ? 8 : 0), -52 + bob + metalBob, 7, 11);
      ctx.strokeRect(24 + (isChanneling ? 8 : 0), -52 + bob + metalBob, 7, 11);
      ctx.fillRect(-22, -46 + bob - metalBob, 6, 9);
    }
  }

  // --- SHOW-ACCURATE LAPIS LAZULI ---
  drawLapis(ctx, bob, animP = 0, actionType = '') {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isTidal = (actionType === 'skill');
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');
    const isGlowing = this.isPinkOverdrive || isTidal;

    // 0. Layered hydro wings: three tapered water blades per side, translucent with a
    //    bright leading edge. Reads as water wings instead of two flat balloons.
    ctx.save();
    const wingFlap = Math.sin(Date.now() / 110) * (isTidal ? 10 : 5);
    const wingScale = isTidal ? 1.6 : (this.isPinkOverdrive ? 1.3 : 1.0);
    const bladeSpecs = [
      { len: 44, lift: -52, tint: 'rgba(14, 165, 233, 0.55)', edge: '#7dd3fc' },
      { len: 58, lift: -38, tint: 'rgba(56, 189, 248, 0.65)', edge: '#bae6fd' },
      { len: 48, lift: -22, tint: 'rgba(125, 211, 252, 0.55)', edge: '#e0f2fe' }
    ];

    const drawWaterWing = (dir, phase) => {
      ctx.save();
      ctx.scale(dir, 1);
      bladeSpecs.forEach((b, i) => {
        const len = b.len * wingScale;
        const sway = wingFlap * (0.4 + i * 0.30) + phase;
        const rootY = -52 + bob + i * 5;
        ctx.beginPath();
        ctx.moveTo(3, rootY);
        ctx.bezierCurveTo(
          -len * 0.40, rootY + b.lift * 0.45 + sway,
          -len * 0.82, rootY + b.lift * 0.25 + sway * 1.5,
          -len, rootY + b.lift * 0.10 + sway
        );
        ctx.bezierCurveTo(
          -len * 0.62, rootY + b.lift * 0.02 + sway * 0.7,
          -len * 0.28, rootY + 4,
          3, rootY + 4
        );
        ctx.closePath();
        ctx.fillStyle = b.tint;
        ctx.fill();
        ctx.strokeStyle = b.edge;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      });
      // Bright spine of the nearest blade
      ctx.strokeStyle = 'rgba(240, 249, 255, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(2, -44 + bob);
      ctx.quadraticCurveTo(-30 * wingScale, -60 + bob + wingFlap, -52 * wingScale, -48 + bob + wingFlap);
      ctx.stroke();
      ctx.restore();
    };

    drawWaterWing(-1, 0);
    drawWaterWing(1, Math.PI);
    ctx.restore();

    // 1. Articulated Cerulean Bare Legs
    const drawLapisLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -26 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#4f97bd' : '#7cc7e8';
      ctx.fillRect(-3, 0, 6, 26);
      ctx.beginPath();
      ctx.ellipse(1.5, 25, 4.5, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawLapisLeg(-4 + legs.backX, legs.backY, legs.backRot, true);
    drawLapisLeg(4 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Flowing Azure Midi-Skirt with Dynamic Wind/Water Sway
    const skSway = hair.swayX * 0.7;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-11, -40 + bob);
    ctx.lineTo(11, -40 + bob);
    ctx.quadraticCurveTo(16 + skSway * 0.4, -26 + bob, 19 + skSway, -13 + bob);
    ctx.quadraticCurveTo(0 + skSway * 0.6, -10 + bob, -19 + skSway, -13 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(0, -40 + bob);
    ctx.lineTo(7 + skSway * 0.7, -12 + bob);
    ctx.lineTo(-6 + skSway * 0.7, -12 + bob);
    ctx.closePath();
    ctx.fill();

    // 3. Golden Yellow Waist Ribbon Sash & Flowing Tails
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-11.5, -42 + bob, 23, 4);
    ctx.beginPath();
    ctx.arc(3, -40 + bob, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(3, -40 + bob);
    ctx.quadraticCurveTo(6 + skSway * 0.5, -34 + bob, 7 + skSway, -28 + bob);
    ctx.moveTo(3, -40 + bob);
    ctx.quadraticCurveTo(1 + skSway * 0.5, -33 + bob, 0 + skSway, -27 + bob);
    ctx.stroke();

    // 4. Dark Navy Halter Crop Top & Back Teardrop Gem
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(-10, -58 + bob, 20, 19, 3);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(-8, -53 + bob, 2.8, 4.8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. SLEEK, FLUID FEATHERED DARK-NAVY BOB HAIR (Back Volume — Zero Stiff Rectangles!)
    const hSway = hair.swayX * 0.65;
    ctx.fillStyle = '#172554';
    ctx.beginPath();
    ctx.moveTo(0, -92 + bob);
    ctx.bezierCurveTo(-18, -91 + bob, -22 + hSway * 0.5, -74 + bob, -21 + hSway, -58 + bob + hair.swayY * 0.5);
    // Feathered flared bob tips behind neck (-X)
    ctx.quadraticCurveTo(-14 + hSway * 0.7, -61 + bob, -12 + hSway * 0.6, -56 + bob);
    ctx.quadraticCurveTo(-4, -59 + bob, 14 + hSway * 0.3, -58 + bob);
    ctx.bezierCurveTo(19, -68 + bob, 18, -88 + bob, 0, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // 6. Pale cerulean skin (canon Lapis is soft blue, not neon cyan)
    ctx.fillStyle = '#7cc7e8';
    ctx.fillRect(-3.5, -66 + bob, 7, 10);
    ctx.beginPath();
    ctx.ellipse(0, -74 + bob, 12.8, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Feathered Front/Side Navy Bob Locks & Windswept Bangs!
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    // Crown & windswept side-parted bangs
    ctx.moveTo(-14, -82 + bob);
    ctx.quadraticCurveTo(-12, -93 + bob, 1, -93 + bob);
    ctx.quadraticCurveTo(13, -92 + bob, 15, -80 + bob);
    // Right cheek-framing tapered lock
    ctx.quadraticCurveTo(17, -69 + bob, 12 + hSway * 0.25, -60 + bob);
    ctx.quadraticCurveTo(10, -68 + bob, 10, -77 + bob);
    // Feathered forehead bangs
    ctx.lineTo(6, -74 + bob);
    ctx.lineTo(1, -81 + bob);
    ctx.lineTo(-4, -73.5 + bob);
    ctx.lineTo(-9, -80 + bob);
    // Left side feathered bob lock flaring softly
    ctx.quadraticCurveTo(-11, -67 + bob, -16 + hSway * 0.5, -58 + bob);
    ctx.quadraticCurveTo(-19 + hSway * 0.4, -70 + bob, -14, -82 + bob);
    ctx.closePath();
    ctx.fill();

    // Ocean-blue hair sheen arc across crown
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -79 + bob, 11, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();

    // 7. Expressive Deep Lapis Anime Eye
    ctx.fillStyle = isGlowing ? '#bae6fd' : '#ffffff';
    ctx.beginPath();
    ctx.ellipse(3.5, -74.5 + bob, 4.3, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isGlowing ? '#38bdf8' : '#0284c7';
    ctx.beginPath();
    ctx.ellipse(4, -74 + bob, 3.1, 4.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isGlowing ? '#ffffff' : '#082f49';
    ctx.beginPath();
    ctx.ellipse(4.3, -74 + bob, 1.7, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4.7, -76 + bob, 1.3, 0, Math.PI * 2);
    ctx.arc(3.2, -72.5 + bob, 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-0.5, -79.5 + bob);
    ctx.quadraticCurveTo(4, -81.5 + bob, 8.5, -78.5 + bob);
    ctx.stroke();

    ctx.strokeStyle = '#075985';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(1.5, -65.5 + bob);
    ctx.quadraticCurveTo(4.5, -63.5 + bob, 7, -65 + bob);
    ctx.stroke();

    // 8. Graceful Hydrokinetic Arm Choreography & Water Constructs!
    if (isTidal) {
      this.drawArticulatedArm(ctx, -8, -56 + bob, -15, -68 + bob, -11, -82 + bob, '#38bdf8', '#38bdf8', 5.5, 5, '#bae6fd', 4);
      this.drawArticulatedArm(ctx, 8, -56 + bob, 15, -68 + bob, 11, -82 + bob, '#38bdf8', '#38bdf8', 5.5, 5, '#bae6fd', 4);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-11, -84 + bob, 7.5, 0, Math.PI * 2);
      ctx.arc(11, -84 + bob, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      this.drawMiniStar(ctx, 0, -98 + bob, 8.5);
    } else if (isThrow) {
      const throwReach = Math.max(0, strike) * 26;
      const hx = 20 + throwReach;
      const hy = -54 + bob;
      this.drawArticulatedArm(ctx, 7, -56 + bob, 13 + throwReach * 0.45, -55 + bob, hx, hy, '#38bdf8', '#38bdf8', 5.8, 5, '#bae6fd', 4);
      // Giant Sculpted Hydro Gauntlet Fist!
      ctx.fillStyle = 'rgba(14, 165, 233, 0.85)';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hx + 8, hy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (isPunch) {
      const reach = Math.max(0, strike) * 30;
      if (combo === 0) {
        // Hit 1: Sweeping Arm Arc + Luminous Crescent Water Scythe!
        const hx = 18 + reach * 0.55;
        const hy = -52 + bob;
        this.drawArticulatedArm(ctx, 7, -56 + bob, 13 + reach * 0.25, -55 + bob, hx, hy, '#38bdf8', '#38bdf8', 5.8, 5, '#bae6fd', 3.8);
        this.drawCrescentSlash(ctx, hx + 6, hy, 24 + reach * 0.4, -Math.PI * 0.48, Math.PI * 0.48, 'rgba(14, 165, 233, 0.45)', 'rgba(56, 189, 248, 0.92)', '#ffffff', 12);
      } else if (combo === 1) {
        // Hit 2: Rising Palm Uppercut + Colossal Surging Water Fist!
        const lift = Math.max(0, strike) * 24;
        this.drawArticulatedArm(ctx, 7, -56 + bob, 14, -58 + bob - lift * 0.4, 18 + reach * 0.35, -62 + bob - lift, '#38bdf8', '#38bdf8', 5.8, 5, '#bae6fd', 4);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.88)';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(28 + reach * 0.5, -64 + bob - lift, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Hit 3: Twin-Arm Cross Sweep + Dual Coiling Ocean Dragon Tendrils!
        this.drawArticulatedArm(ctx, -6, -56 + bob, 6, -62 + bob, 18 + reach * 0.4, -58 + bob, '#38bdf8', '#38bdf8', 5.5, 4.8);
        this.drawArticulatedArm(ctx, 7, -56 + bob, 14, -48 + bob, 22 + reach * 0.45, -44 + bob, '#38bdf8', '#38bdf8', 5.8, 5);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.92)';
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(16, -58 + bob);
        ctx.bezierCurveTo(32 + reach * 0.5, -76 + bob, 44 + reach * 0.8, -22 + bob, 62 + reach, -34 + bob);
        ctx.moveTo(18, -44 + bob);
        ctx.bezierCurveTo(34 + reach * 0.5, -18 + bob, 46 + reach * 0.8, -68 + bob, 62 + reach, -52 + bob);
        ctx.stroke();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
    } else {
      const armSwing = Math.sin(this.walkAnim) * 4;
      this.drawArticulatedArm(ctx, 6, -55 + bob, 8 + armSwing * 0.4, -46 + bob, 7 + armSwing, -37 + bob, '#38bdf8', '#38bdf8', 5.4, 4.6, '#38bdf8', 3.2);
    }
  }

  // --- SHOW-ACCURATE ROSE QUARTZ ---
  drawRose(ctx, bob, animP = 0, actionType = '') {
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');
    const isHeal = (actionType === 'heal');

    // Helper to draw a sculpted hollow-center Rose Quartz spiral tube curl end!
    const drawSpiralTubeEnd = (cx, cy, r) => {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Hollow dark-rose tube interior!
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      ctx.ellipse(cx + 1, cy + 1, r * 0.58, r * 0.48, 0.25, 0, Math.PI * 2);
      ctx.fill();
      // Crisp pastel-pink spiral coil line
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx + 0.5, cy + 0.5, r * 0.52, 0, Math.PI * 1.65);
      ctx.stroke();
    };

    // 0. MAJESTIC CASCADING PINK SPIRAL ROSE-TUBE RINGLETS (BACK WATERFALL — NO FLOATING BALLS!)
    const swX = hair.swayX * 0.8;
    const swY = hair.swayY * 0.5;
    // Deep rose shadow waterfall
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(0, -98 + bob);
    ctx.bezierCurveTo(-24, -98 + bob, -36 + swX * 0.5, -72 + bob, -32 + swX * 0.8, -42 + bob + swY);
    ctx.bezierCurveTo(-36 + swX, -24 + bob + swY, -26 + swX, -8 + bob + swY, -12 + swX * 0.7, -10 + bob + swY);
    ctx.lineTo(18, -32 + bob);
    ctx.bezierCurveTo(28, -58 + bob, 26, -92 + bob, 0, -98 + bob);
    ctx.closePath();
    ctx.fill();

    // Lush sculpted main pink wave cascade (#f472b6)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(2, -100 + bob);
    ctx.bezierCurveTo(-22, -101 + bob, -33 + swX * 0.4, -76 + bob, -28 + swX * 0.7, -50 + bob + swY);
    ctx.bezierCurveTo(-34 + swX, -32 + bob + swY, -28 + swX, -14 + bob + swY, -16 + swX * 0.8, -14 + bob + swY);
    ctx.quadraticCurveTo(0, -18 + bob, 16, -38 + bob);
    ctx.bezierCurveTo(28, -56 + bob, 26, -94 + bob, 2, -100 + bob);
    ctx.closePath();
    ctx.fill();

    // 3 Sculpted Hollow-Center Rose-Tube Spiral Curl Tips at bottom of cascade!
    drawSpiralTubeEnd(-25 + swX, -20 + bob + swY, 8.5);
    drawSpiralTubeEnd(-14 + swX * 0.8, -14 + bob + swY, 9);
    drawSpiralTubeEnd(-28 + swX * 0.7, -42 + bob + swY * 0.6, 8);

    // 1. Massive Tiered White Petal Ballgown with Graceful Sway
    const gownSway = swX * 0.45;
    ctx.fillStyle = '#fdf2f8';
    ctx.beginPath();
    ctx.moveTo(-17, -42 + bob);
    ctx.lineTo(17, -42 + bob);
    ctx.quadraticCurveTo(24 + gownSway * 0.5, -18 + bob, 28 + gownSway, 1 + bob);
    ctx.quadraticCurveTo(0 + gownSway, 4 + bob, -28 + gownSway, 1 + bob);
    ctx.closePath();
    ctx.fill();

    // Upper ruffled petal tier (#ffffff)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-16, -44 + bob);
    ctx.lineTo(16, -44 + bob);
    ctx.lineTo(23 + gownSway * 0.6, -12 + bob);
    ctx.quadraticCurveTo(11 + gownSway * 0.6, -6 + bob, 0 + gownSway * 0.6, -13 + bob);
    ctx.quadraticCurveTo(-11 + gownSway * 0.6, -6 + bob, -23 + gownSway * 0.6, -12 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Regal Sweetheart Corset & Navel Star Cutout + Rose Quartz Gem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-15, -63 + bob, 30, 23, 6);
    ctx.fill();

    ctx.fillStyle = '#ff6097';
    this.drawMiniStar(ctx, 1, -28 + bob, 7);
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(1, -28 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Porcelain Neck & Gentle Motherly Face
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -70 + bob, 10, 10);
    ctx.beginPath();
    ctx.ellipse(0, -80 + bob, 15.5, 16.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Romantic Star-Parted Pink Curtain Bangs & Shoulder Spiral Tube Ringlets!
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    // Center part sweeping gracefully over both temples into thick shoulder ringlets
    ctx.moveTo(0, -92 + bob);
    ctx.bezierCurveTo(-10, -98 + bob, -22, -90 + bob, -21, -74 + bob);
    ctx.bezierCurveTo(-22, -62 + bob, -24 + swX * 0.3, -52 + bob, -18 + swX * 0.3, -46 + bob);
    ctx.quadraticCurveTo(-12, -56 + bob, -14, -74 + bob);
    ctx.quadraticCurveTo(-10, -86 + bob, 0, -88 + bob);
    ctx.quadraticCurveTo(10, -86 + bob, 14, -74 + bob);
    ctx.quadraticCurveTo(13, -58 + bob, 18, -48 + bob);
    ctx.bezierCurveTo(24, -54 + bob, 22, -64 + bob, 21, -74 + bob);
    ctx.bezierCurveTo(22, -90 + bob, 10, -98 + bob, 0, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // Pastel crown highlight sheen
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-14, -88 + bob);
    ctx.quadraticCurveTo(-6, -94 + bob, 0, -90 + bob);
    ctx.quadraticCurveTo(6, -94 + bob, 14, -88 + bob);
    ctx.stroke();

    // Sculpted Shoulder Spiral Tube Ringlets framing chest!
    drawSpiralTubeEnd(-18 + swX * 0.3, -48 + bob, 7.5);
    drawSpiralTubeEnd(18, -50 + bob, 7);

    // Soft pink cheek blush
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-7, -77 + bob, 4.5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -77 + bob, 4.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Gentle, Warm Motherly Eyes with Curved Eyelashes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-4.5, -82 + bob, 4, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(5.5, -82 + bob, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.ellipse(-4, -81.5 + bob, 2.8, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(6, -81.5 + bob, 2.8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -83 + bob, 1.4, 0, Math.PI * 2);
    ctx.arc(7, -83 + bob, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e102d';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-9, -87 + bob);
    ctx.quadraticCurveTo(-4.5, -89 + bob, -0.5, -86 + bob);
    ctx.moveTo(1.5, -86 + bob);
    ctx.quadraticCurveTo(5.5, -89 + bob, 9.5, -87 + bob);
    ctx.stroke();

    // Benevolent Sweet Pink Smile
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.moveTo(-5, -73 + bob);
    ctx.quadraticCurveTo(0, -69 + bob, 5, -73 + bob);
    ctx.quadraticCurveTo(0, -71 + bob, -5, -73 + bob);
    ctx.fill();

    // 5. ROSE'S MASSIVE PINK BROADSWORD & SHIELD CHOREOGRAPHY!
    let shieldX = -15;
    let shieldY = -45 + bob;
    let swordX = 18;
    let swordY = -46 + bob;
    let swordAngle = -0.25;

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Sweeping Regal Rose Broadsword Cleave!
        const reach = Math.max(0, strike) * 28;
        swordX = 20 + reach;
        swordY = -48 + bob;
        swordAngle = -1.05 + Math.min(1, animP * 1.35) * 1.85;
      } else if (combo === 1) {
        // Hit 2: Valkyrie Thorny Shield Bash Out Front while Sword Chambers Overhead!
        const bash = Math.max(0, strike) * 38;
        shieldX = -6 + bash;
        shieldY = -46 + bob;
        swordX = 8 - Math.max(0, strike) * 10;
        swordY = -64 + bob;
        swordAngle = -1.25;
      } else {
        // Hit 3: Celestial Rising Broadsword Vortex!
        const reach = Math.max(0, strike) * 32;
        swordX = 22 + reach;
        swordY = -52 + bob - Math.max(0, strike) * 10;
        swordAngle = 1.25 - Math.min(1, animP * 1.3) * 2.45;
      }
    } else if (isHeal) {
      swordX = 16;
      swordY = -54 + bob;
      swordAngle = -0.05;
      shieldX = -16;
      shieldY = -52 + bob;
    }

    // Articulated Sword Arm + Legendary Broadsword
    this.drawArticulatedArm(ctx, 11, -58 + bob, (11 + swordX) * 0.5, -52 + bob, swordX, swordY, '#fed7aa', '#fed7aa', 7.5, 6.5, '#fed7aa', 4.5);

    ctx.save();
    ctx.translate(swordX, swordY);
    ctx.rotate(swordAngle);
    ctx.strokeStyle = '#9d174d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-2, 22);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-2, 24, 5.5, 0, Math.PI * 2);
    ctx.fill();

    this.drawMiniStar(ctx, 0, 0, 10);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Massive 16px wide x 58px long Pink Blade
    ctx.fillStyle = 'rgba(244, 114, 182, 0.96)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-8, -46);
    ctx.lineTo(0, -58);
    ctx.lineTo(8, -46);
    ctx.lineTo(8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-1.2, -50, 2.4, 46);
    ctx.restore();

    // Rose Quartz's Defensive Shield (Hidden briefly during [K] Shield Throw flight!)
    if (!(isThrow && animP > 0.25)) {
      ctx.save();
      ctx.translate(shieldX, shieldY);
      const shieldR = 20;
      ctx.fillStyle = 'rgba(255, 96, 151, 0.95)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, shieldR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 3.5; a += 0.25) {
        const sr = (a / (Math.PI * 3.5)) * (shieldR - 4);
        const sx = Math.cos(a) * sr;
        const sy = Math.sin(a) * sr;
        if (a === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.fillStyle = '#ffd166';
      this.drawMiniStar(ctx, 0, 0, 7);
      ctx.restore();
    }

    if (isHeal) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 207, 232, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -60 + bob, 34 + Math.sin(Date.now() / 80) * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ff6097';
      ctx.beginPath();
      ctx.arc(4, -72 + bob + ((Date.now() / 25) % 18), 3, 0, Math.PI * 2);
      ctx.arc(-4, -72 + bob + (((Date.now() / 25) + 9) % 18), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawMiniStar(ctx, cx, cy, radius) {
    let rot = (Math.PI / 2) * 3;
    const spikes = 5;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * (radius * 0.45), cy + Math.sin(rot) * (radius * 0.45));
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  }

  // --- SHOW-ACCURATE CONNIE MAHESWARAN (SAVE THE LIGHT DESIGN) ---
  drawConnie(ctx, bob, animP = 0, actionType = '') {
    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isSpecial = (actionType === 'throw');
    const isSkill = (actionType === 'skill');

    // 0. LUSH, NATURAL FLOWING DARK WAVY HAIR (BACK CASCADE — ZERO CIRCLES ON TOP!)
    const swX = hair.swayX * 0.85;
    const swY = hair.swayY * 0.5;
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(2, -90 + bob);
    // Flowing S-wave back cascade streaming behind her (-X) when dashing & fencing!
    ctx.bezierCurveTo(-16, -91 + bob, -25 + swX * 0.5, -75 + bob, -21 + swX * 0.7, -58 + bob + swY * 0.5);
    ctx.bezierCurveTo(-29 + swX, -48 + bob + swY, -27 + swX * 1.1, -38 + bob + swY, -16 + swX, -39 + bob + swY);
    ctx.quadraticCurveTo(-8 + swX * 0.6, -44 + bob, 14, -46 + bob);
    ctx.bezierCurveTo(21, -54 + bob, 20, -76 + bob, 13, -86 + bob);
    ctx.closePath();
    ctx.fill();

    // Warm dark-espresso wave sheen ribbon inside hair
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -82 + bob);
    ctx.bezierCurveTo(-19 + swX * 0.4, -70 + bob, -14 + swX * 0.7, -56 + bob, -20 + swX, -44 + bob + swY);
    ctx.stroke();

    // 1. Articulated Khaki Combat Shorts, Warm Brown Legs, White Socks & Pink Sneakers!
    const drawConnieLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -26 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#92400e' : '#b45309';
      ctx.fillRect(-5, 0, 10, 14);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(-4, 13, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4.5, 19, 9, 3);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-5, 21, 12, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, 24.5, 12, 2);
      ctx.restore();
    };
    drawConnieLeg(-6 + legs.backX, legs.backY, legs.backRot, true);
    drawConnieLeg(6 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Arm (Fencing Counter-Balance on Hit 1, Two-Handed Grip on Slash/Cleave!)
    if (isPunch && combo === 0) {
      const poise = Math.max(0, strike) * 6;
      this.drawArticulatedArm(ctx, -10, -54 + bob, -19 - poise * 0.5, -58 + bob, -26 - poise, -65 + bob, '#fb7185', '#a16207', 6.5, 5.5, '#a16207', 3.8);
    } else if (!isPunch && !isSpecial && !isSkill) {
      const armSwing = Math.sin(this.walkAnim) * 4.5;
      this.drawArticulatedArm(ctx, -10, -54 + bob, -15 - armSwing * 0.5, -44 + bob, -13 - armSwing, -34 + bob, '#fb7185', '#a16207', 6.2, 5.2, '#a16207', 3.6);
    }

    // 3. Back Scabbard & Salmon Pink Polo Shirt with White Pointed Collar
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-15, -62 + bob, 5, 36);

    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.roundRect(-13, -58 + bob, 26, 33, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-7, -58 + bob);
    ctx.lineTo(0, -51 + bob);
    ctx.lineTo(7, -58 + bob);
    ctx.lineTo(10, -56 + bob);
    ctx.lineTo(0, -48 + bob);
    ctx.lineTo(-10, -56 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#78350f';
    ctx.fillRect(-13, -28 + bob, 26, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, -29 + bob, 6, 6);

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(11, -58 + bob);
    ctx.lineTo(-11, -28 + bob);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2, -45 + bob, 5, 5);

    // 4. Neck & Warm Brown Skin Face
    ctx.fillStyle = '#a16207';
    ctx.fillRect(-4, -66 + bob, 8, 10);
    ctx.beginPath();
    ctx.ellipse(0, -74 + bob, 13.8, 14.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Wavy Crown Hairline & Cheek-Framing S-Wave Tendrils!
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(-14, -77 + bob);
    ctx.quadraticCurveTo(-13, -91 + bob, 0, -91 + bob);
    ctx.quadraticCurveTo(13, -91 + bob, 14, -78 + bob);
    // Soft wavy right side-lock
    ctx.bezierCurveTo(18, -71 + bob, 16, -61 + bob, 18, -54 + bob);
    ctx.quadraticCurveTo(13, -57 + bob, 12, -73 + bob);
    // Soft parted forehead wave
    ctx.quadraticCurveTo(5, -84 + bob, -2, -82 + bob);
    ctx.quadraticCurveTo(-8, -84 + bob, -12, -75 + bob);
    // Soft wavy left side-lock
    ctx.quadraticCurveTo(-12, -62 + bob, -16 + swX * 0.25, -52 + bob);
    ctx.bezierCurveTo(-19, -60 + bob, -17, -70 + bob, -14, -77 + bob);
    ctx.closePath();
    ctx.fill();

    // 5. Signature Turquoise / Teal Headband Nestled Naturally Into Wavy Crown!
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.arc(0, -76.5 + bob, 13.8, Math.PI * 1.06, Math.PI * 1.94);
    ctx.stroke();
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -76.5 + bob, 13.8, Math.PI * 1.2, Math.PI * 1.65);
    ctx.stroke();

    // Rosy-brown cheeks
    ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-7, -70 + bob, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -70 + bob, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Big Expressive Cartoon Eyes & Determined Knight Eyebrows
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-4, -75 + bob, 4, 5.2, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -75 + bob, 4, 5.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(-3.4, -74.5 + bob, 2.8, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse(5.6, -74.5 + bob, 2.8, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2.5, -76 + bob, 1.3, 0, Math.PI * 2);
    ctx.arc(6.5, -76 + bob, 1.3, 0, Math.PI * 2);
    ctx.arc(-4.5, -73 + bob, 0.7, 0, Math.PI * 2);
    ctx.arc(4.5, -73 + bob, 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    if (this.isAttacking) {
      ctx.moveTo(-8.5, -83 + bob); ctx.lineTo(-1, -80.5 + bob);
      ctx.moveTo(2, -80.5 + bob); ctx.lineTo(10, -83 + bob);
    } else {
      ctx.moveTo(-8, -82 + bob); ctx.quadraticCurveTo(-4, -84.5 + bob, -1, -82 + bob);
      ctx.moveTo(2, -82 + bob); ctx.quadraticCurveTo(6, -84.5 + bob, 10, -82 + bob);
    }
    ctx.stroke();

    // Confident Open Smile
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-5, -67 + bob);
    ctx.quadraticCurveTo(0, -65 + bob, 6, -67 + bob);
    ctx.quadraticCurveTo(0, -59 + bob, -5, -67 + bob);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-4.5, -67 + bob);
    ctx.lineTo(5.5, -67 + bob);
    ctx.quadraticCurveTo(0, -64 + bob, -4.5, -67 + bob);
    ctx.fill();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#f472b6';
      this.drawMiniStar(ctx, 0, -85 + bob, 5.5);
    }

    // 7. PEARL'S DISCIPLE SWORDSMANSHIP CHOREOGRAPHY!
    // Note: in drawConnieSword, angle=0 points UP (-Y), angle=Math.PI/2 points FORWARD (+X)!
    let swordX = 16;
    let swordY = -46 + bob;
    let swordAngle = 0.25;

    if (isPunch) {
      if (combo === 0) {
        // Hit 1: Deep Fencing Lunge Thrust (Blade leveled horizontally forward at ~Math.PI/2!)
        const reach = strike * 36;
        swordX = 18 + reach;
        swordY = -48 + bob;
        swordAngle = Math.PI * 0.48;
        this.drawArticulatedArm(ctx, 9, -54 + bob, 14 + reach * 0.45, -51 + bob, swordX, swordY, '#fb7185', '#a16207', 6.8, 5.8, '#a16207', 4.2);
      } else if (combo === 1) {
        // Hit 2: Rising Two-Handed Diagonal Broadsword Slash (Sweeps from low-front up to high!)
        const reach = Math.max(0, strike) * 28;
        swordX = 18 + reach;
        swordY = -50 + bob - Math.max(0, strike) * 6;
        swordAngle = 2.35 - Math.min(1, animP * 1.35) * 2.15;
        this.drawArticulatedArm(ctx, -6, -54 + bob, 6, -51 + bob, swordX - 3, swordY + 2, '#fb7185', '#a16207', 6.2, 5.2);
        this.drawArticulatedArm(ctx, 9, -54 + bob, 14, -52 + bob, swordX, swordY, '#fb7185', '#a16207', 6.8, 5.8, '#a16207', 4.2);
      } else {
        // Hit 3: Acrobatic Airborne Two-Handed Helm-Splitter Overhead Cleave!
        const reach = Math.max(0, strike) * 32;
        swordX = 18 + reach;
        swordY = animP < 0.34 ? (-66 + bob) : (-44 + bob);
        swordAngle = -0.65 + Math.min(1, animP * 1.35) * 2.85;
        this.drawArticulatedArm(ctx, -6, -54 + bob, 6, swordY - 6, swordX - 2, swordY, '#fb7185', '#a16207', 6.2, 5.2);
        this.drawArticulatedArm(ctx, 9, -54 + bob, 14, swordY - 4, swordX, swordY, '#fb7185', '#a16207', 6.8, 5.8, '#a16207', 4.2);
      }
    } else if (isSpecial) {
      // Horizontal Sword-Beam Slash Release!
      const reach = Math.max(0, strike) * 24;
      swordX = 20 + reach;
      swordY = -48 + bob;
      swordAngle = 1.65;
      this.drawArticulatedArm(ctx, 9, -54 + bob, 15, -50 + bob, swordX, swordY, '#fb7185', '#a16207', 6.8, 5.8, '#a16207', 4.2);
    } else if (isSkill) {
      // Knight's Flurry Shadow-Step Draw Pose!
      swordX = 24;
      swordY = -44 + bob;
      swordAngle = 1.85;
      this.drawArticulatedArm(ctx, 9, -54 + bob, 16, -48 + bob, swordX, swordY, '#fb7185', '#a16207', 6.8, 5.8, '#a16207', 4.2);
    } else {
      this.drawArticulatedArm(ctx, 9, -54 + bob, 13, -49 + bob, swordX, swordY, '#fb7185', '#a16207', 6.5, 5.5, '#a16207', 4);
    }

    this.drawConnieSword(ctx, swordX, swordY, swordAngle, isSkill);
  }

  drawConnieSword(ctx, swordX, swordY, swordAngle = 0.2, isSkill = false) {
    ctx.save();
    ctx.translate(swordX, swordY);
    ctx.rotate(swordAngle);

    // --- FULL-SIZED CANONICAL ROSE'S BROADSWORD (Forged by Bismuth) ---
    ctx.strokeStyle = '#9d174d';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-2, 18);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-2, 20, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let pet = 0; pet < 5; pet++) {
      const pa = (Math.PI * 2 / 5) * pet - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(pa) * 6, Math.sin(pa) * 6, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    const bladeLen = this.isPinkOverdrive ? 66 : 52;
    const halfW = this.isPinkOverdrive ? 8.5 : 7.5;

    ctx.fillStyle = 'rgba(244, 114, 182, 0.96)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.lineTo(-halfW, -bladeLen + 10);
    ctx.lineTo(0, -bladeLen);
    ctx.lineTo(halfW, -bladeLen + 10);
    ctx.lineTo(halfW, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#db2777';
    ctx.fillRect(-1.5, -bladeLen + 14, 3, bladeLen - 16);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-0.8, -bladeLen + 12, 1.6, bladeLen - 18);

    if (isSkill || this.isPinkOverdrive) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- SHOW-ACCURATE JASPER (SUPREME BETA QUARTZ JUGGERNAUT) ---
  drawJasper(ctx, bob, animP = 0, actionType = '') {
    if (this.isSpinDashing) {
      this.drawJasperSpinDash(ctx);
      return;
    }

    const legs = this.getLegKinematics(animP, actionType);
    const hair = this.getHairSway(animP, actionType);
    const strike = this.getStrikeCurve(animP);
    const combo = this.attackCombo;
    const isPunch = (actionType === 'punch');
    const isThrow = (actionType === 'throw');

    // 0. MASSIVE, WILD, FLOWING WAVY PALE PEACH-CREAM LION'S MANE (BACK CASCADE — ZERO CIRCLES!)
    const swX = hair.swayX * 0.9;
    const swY = hair.swayY * 0.55;
    // Warm amber-peach under-mane shadow waves (#fdba74)
    ctx.fillStyle = '#fdba74';
    ctx.beginPath();
    ctx.moveTo(4, -112 + bob);
    ctx.bezierCurveTo(-24, -114 + bob, -40 + swX * 0.5, -90 + bob, -34 + swX * 0.7, -68 + bob + swY * 0.4);
    ctx.bezierCurveTo(-44 + swX, -52 + bob + swY, -40 + swX * 1.15, -30 + bob + swY, -28 + swX * 1.2, -18 + bob + swY);
    ctx.quadraticCurveTo(-18 + swX, -26 + bob + swY, -16 + swX * 0.8, -36 + bob + swY);
    ctx.quadraticCurveTo(-8 + swX * 0.6, -20 + bob + swY, 2 + swX * 0.4, -26 + bob + swY);
    ctx.bezierCurveTo(22, -46 + bob, 28, -82 + bob, 18, -104 + bob);
    ctx.closePath();
    ctx.fill();

    // Main towering swept-back wavy Beta Quartz mane (#fed7aa)
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(6, -115 + bob);
    // Sweeping crown crest flowing into 3 heavy S-curved waves down her back (-X)!
    ctx.bezierCurveTo(-18, -120 + bob, -36 + swX * 0.4, -98 + bob, -29 + swX * 0.6, -76 + bob + swY * 0.4);
    ctx.bezierCurveTo(-40 + swX * 0.85, -60 + bob + swY * 0.7, -37 + swX * 1.1, -38 + bob + swY, -25 + swX * 1.15, -22 + bob + swY);
    // Layered wavy mane locks (smooth S-tapers, not circles!)
    ctx.quadraticCurveTo(-16 + swX * 0.9, -30 + bob + swY, -14 + swX * 0.8, -40 + bob + swY * 0.7);
    ctx.quadraticCurveTo(-8 + swX * 0.65, -26 + bob + swY, 0 + swX * 0.45, -24 + bob + swY);
    ctx.quadraticCurveTo(8, -36 + bob, 10, -52 + bob);
    ctx.bezierCurveTo(24, -60 + bob, 28, -88 + bob, 18, -106 + bob);
    ctx.quadraticCurveTo(14, -114 + bob, 6, -115 + bob);
    ctx.closePath();
    ctx.fill();

    // Sunlit cream top-crest wave highlight (#ffedd5) + warm wave contour lines
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.moveTo(4, -114 + bob);
    ctx.bezierCurveTo(-14, -118 + bob, -28 + swX * 0.4, -98 + bob, -22 + swX * 0.6, -80 + bob);
    ctx.quadraticCurveTo(-10, -90 + bob, 8, -106 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -98 + bob);
    ctx.bezierCurveTo(-28 + swX * 0.5, -82 + bob, -20 + swX * 0.7, -62 + bob, -29 + swX, -40 + bob + swY);
    ctx.stroke();

    // 1. Articulated Broad Muscular Legs & Cuffed Combat Boots
    const drawJasperLeg = (lx, ly, rot, darken) => {
      ctx.save();
      ctx.translate(lx, -34 + bob + ly);
      ctx.rotate(rot);
      ctx.fillStyle = darken ? '#350808' : '#450a0a';
      ctx.fillRect(-7, 0, 14, 26);
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-8, 24, 17, 10);
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(-8, 32, 17, 2.5);
      ctx.restore();
    };
    drawJasperLeg(-9 + legs.backX, legs.backY, legs.backRot, true);
    drawJasperLeg(8 + legs.frontX, legs.frontY, legs.frontRot, false);

    // 2. Rear Left Tiger-Striped Muscular Arm
    if (!(isPunch && combo === 1)) {
      const chamber = (isPunch && (combo === 0 || combo === 2)) ? Math.max(0, strike) * 8 : Math.sin(this.walkAnim) * 5;
      this.drawArticulatedArm(ctx, -18, -68 + bob, -26 - chamber * 0.5, -56 + bob, -22 - chamber, -44 + bob, '#ea580c', '#c2410c', 12, 10.5, '#991b1b', 7);
    }

    // 3. Towering Muscular V-Taper Torso & Yellow Diamond Insignia
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(-22, -74 + bob);
    ctx.lineTo(22, -74 + bob);
    ctx.lineTo(17, -32 + bob);
    ctx.lineTo(-17, -32 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    this.drawDiamondInsignia(ctx, 1, -60 + bob, 6.8);

    // 4. Neck & Broad Fierce Tiger-Striped Face
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-7, -82 + bob, 14, 12);
    ctx.beginPath();
    ctx.ellipse(0, -90 + bob, 17, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark Red Tiger Mask Stripe across eyes
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-15, -96 + bob, 30, 8);

    // Sculpted Swept-Back Wavy Widow's Peak & Temple Locks Framing Face!
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    // Fierce widow's peak at x=1, y=-101 sweeping up and out into wavy side locks!
    ctx.moveTo(1, -101 + bob);
    ctx.quadraticCurveTo(-9, -108 + bob, -17, -100 + bob);
    ctx.bezierCurveTo(-23, -92 + bob, -20, -80 + bob, -24 + swX * 0.3, -72 + bob);
    ctx.quadraticCurveTo(-16, -78 + bob, -15, -92 + bob);
    ctx.lineTo(-15, -106 + bob);
    ctx.lineTo(17, -106 + bob);
    ctx.lineTo(15, -92 + bob);
    ctx.quadraticCurveTo(16, -79 + bob, 22, -74 + bob);
    ctx.bezierCurveTo(20, -84 + bob, 22, -94 + bob, 16, -101 + bob);
    ctx.quadraticCurveTo(9, -108 + bob, 1, -101 + bob);
    ctx.closePath();
    ctx.fill();

    // Fierce Golden Eyes with Feline Slit Pupils
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(-5, -92 + bob, 4, 4.8, 0, 0, Math.PI * 2);
    ctx.ellipse(5.5, -92 + bob, 4, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(-4.8, -92 + bob, 1.6, 3.8, 0, 0, Math.PI * 2);
    ctx.ellipse(5.7, -92 + bob, 1.6, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Angry Quartz Brow Ridge
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-11, -98 + bob); ctx.lineTo(-2, -95.5 + bob);
    ctx.moveTo(2.5, -95.5 + bob); ctx.lineTo(11.5, -98 + bob);
    ctx.stroke();

    // Faceted Amber Diamond Gemstone ON NOSE
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0.5, -90 + bob);
    ctx.lineTo(5.5, -85 + bob);
    ctx.lineTo(0.5, -80 + bob);
    ctx.lineTo(-4.5, -85 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Menacing Toothy Sneer
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.moveTo(-7, -78 + bob);
    ctx.quadraticCurveTo(0, -76 + bob, 7, -79 + bob);
    ctx.lineTo(6, -73 + bob);
    ctx.lineTo(-6, -72 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-6, -78 + bob);
    ctx.lineTo(6, -79 + bob);
    ctx.lineTo(4, -75 + bob);
    ctx.lineTo(2, -77 + bob);
    ctx.lineTo(0, -75 + bob);
    ctx.lineTo(-2, -77 + bob);
    ctx.lineTo(-4, -75 + bob);
    ctx.closePath();
    ctx.fill();

    if (this.isPinkOverdrive) {
      ctx.fillStyle = '#ea580c';
      this.drawMiniStar(ctx, 0, -118 + bob, 7);
    }

    // 5. SUPREME BETA QUARTZ BRAWLER ARMS & CRASH HELMET CHOREOGRAPHY!
    if (isThrow) {
      // Braced Battering-Ram Arms + Iconic Horned Bronze/Amber Crash Helmet!
      this.drawArticulatedArm(ctx, 16, -66 + bob, 10, -54 + bob, 20, -56 + bob, '#ea580c', '#991b1b', 12.5, 11, '#c2410c', 8);
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(2, -92 + bob, 22, -Math.PI * 0.85, Math.PI * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Glowing translucent orange visor Hammer-Horn protruding forward!
      ctx.fillStyle = 'rgba(249, 115, 22, 0.92)';
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, -104 + bob);
      ctx.lineTo(42, -92 + bob);
      ctx.lineTo(38, -80 + bob);
      ctx.lineTo(12, -82 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (isPunch) {
      if (combo === 0) {
        // Hit 1: Coiled Beta Quartz Gut-Breaker Straight Punch!
        const reach = strike * 36;
        const fx = 24 + reach;
        const fy = -55 + bob;
        this.drawArticulatedArm(ctx, 16, -66 + bob, 19 + reach * 0.45, -60 + bob, fx, fy, '#ea580c', '#991b1b', 13, 11.5, '#c2410c', 10);
        if (strike > 0.15) {
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, fx + 10, fy, 7.5);
        }
      } else if (combo === 1) {
        // Hit 2: Two-Handed Overhead Meteor Double-Axe-Handle Slam!
        const reach = Math.max(0, strike) * 28;
        const sy = animP < 0.32 ? (-102 + bob) : (-102 + bob + Math.min(1, (animP - 0.32) / 0.30) * 68);
        this.drawArticulatedArm(ctx, -14, -68 + bob, 2 + reach * 0.4, sy - 8, 18 + reach, sy, '#ea580c', '#991b1b', 12, 10.5, '#c2410c', 9.5);
        this.drawArticulatedArm(ctx, 16, -68 + bob, 12 + reach * 0.45, sy - 6, 24 + reach, sy + 2, '#ea580c', '#991b1b', 13, 11.5, '#c2410c', 10.5);
        ctx.fillStyle = '#ea580c';
        this.drawDiamondInsignia(ctx, 26 + reach, sy + 2, 8.5);
      } else {
        // Hit 3: Earth-Rupturing Spinning Beta Haymaker!
        const reach = strike * 46;
        const fx = 26 + reach;
        const fy = -50 + bob + Math.max(0, strike) * 4;
        this.drawArticulatedArm(ctx, 16, -66 + bob, 22 + reach * 0.45, -58 + bob, fx, fy, '#ea580c', '#991b1b', 14, 12.5, '#7f1d1d', 13);
        if (strike > 0.15) {
          ctx.fillStyle = '#fde047';
          this.drawDiamondInsignia(ctx, fx + 12, fy, 10.5);
        }
      }
    } else {
      // Idle Muscular Tiger-Striped Right Arm
      const armSwing = Math.sin(this.walkAnim) * 5;
      this.drawArticulatedArm(ctx, 17, -68 + bob, 23 + armSwing * 0.4, -56 + bob, 21 + armSwing, -44 + bob, '#ea580c', '#991b1b', 12.5, 11, '#c2410c', 7.5);
    }
  }

  // Authentic Lore: Jasper's Flaming Spiky Quartz Spin Dash
  drawJasperSpinDash(ctx) {
    ctx.save();
    const rot = (Date.now() / 22) * this.facing;
    const r = 28;

    // 1. Motion blur trails with orange flame
    for (let t = 1; t <= 3; t++) {
      ctx.save();
      ctx.globalAlpha = 0.30 / t;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-t * 14, -24, r - t * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Fiery ground sparks & smoke
    ctx.fillStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.beginPath();
    ctx.arc(-22, -8, 10, 0, Math.PI * 2);
    ctx.arc(-32, -10, 7, 0, Math.PI * 2);
    ctx.fill();

    // 3. Spiked Buzzsaw Outer Perimeter (Heavy Bronze & Amber Spikes)
    ctx.translate(0, -24);
    ctx.rotate(rot);

    const spikes = 10;
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
      const a = (i * Math.PI * 2) / spikes;
      const x1 = Math.cos(a) * (r + 9);
      const y1 = Math.sin(a) * (r + 9);
      const aMid = a + Math.PI / spikes;
      const x2 = Math.cos(aMid) * (r - 2);
      const y2 = Math.sin(aMid) * (r - 2);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();

    // 4. Inner glowing amber/flame quartz core
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    coreGrad.addColorStop(0, '#fef08a');
    coreGrad.addColorStop(0.4, '#ea580c');
    coreGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Faceted crystal star lines
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }

    ctx.restore();
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

  drawDodgeVisuals(ctx, bob) {
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

  // ==========================================================================
  // CANONICAL GEM FUSION DRAWING ENGINE (OFFICIAL STEVEN UNIVERSE SHOW LORE)
  // ==========================================================================
  drawFallenHero(ctx) {
    ctx.save();
    const isHumanoid = (this.activeChar === 'steven' || this.activeChar === 'connie');

    if (isHumanoid) {
      // -------------------------------------------------------------
      // HUMAN / HALF-HUMAN KNOCKOUT: LIE DOWN FLAT ON THE FLOOR
      // -------------------------------------------------------------
      const lyingY = this.y - 4;
      const facing = this.facing || 1;

      ctx.save();
      ctx.translate(this.x, lyingY);
      ctx.scale(facing, 1);

      if (this.activeChar === 'steven') {
        // --- STEVEN UNIVERSE LYING DOWN ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stretched legs (jeans)
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.roundRect(-36, -8, 26, 7, 3);
        ctx.fill();

        // Flip-flops
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-38, -6, 5, 5);

        // Torso / Salmon-pink T-shirt
        ctx.fillStyle = '#ff2a6d';
        ctx.beginPath();
        ctx.roundRect(-14, -13, 26, 12, 4);
        ctx.fill();

        // Golden Star on T-shirt
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', -1, -4);

        // Steven's head resting peacefully
        ctx.fillStyle = '#1c1917'; // Curly dark hair back
        ctx.beginPath();
        ctx.arc(20, -11, 13, 0, Math.PI * 2);
        ctx.fill();

        // Head skin
        ctx.fillStyle = '#ffd1b3';
        ctx.beginPath();
        ctx.arc(18, -10, 10, 0, Math.PI * 2);
        ctx.fill();

        // Sleeping closed eyes (⌒ ⌒)
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(15, -10, 2.5, Math.PI, 0, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(21, -10, 2.5, Math.PI, 0, false);
        ctx.stroke();

        // Peaceful mouth
        ctx.beginPath();
        ctx.arc(18, -5, 2, 0, Math.PI, false);
        ctx.stroke();

        // Rose Quartz Shield resting flat on the ground beside him
        ctx.save();
        ctx.translate(-8, -4);
        ctx.fillStyle = 'rgba(244, 114, 182, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 6, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 3, -0.15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

      } else {
        // --- CONNIE MAHESWARAN LYING DOWN ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stretched legs (training pants)
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(-34, -7, 24, 6, 2);
        ctx.fill();

        // Boots
        ctx.fillStyle = '#475569';
        ctx.fillRect(-36, -5, 5, 5);

        // Tunic / training shirt
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.roundRect(-13, -12, 24, 11, 4);
        ctx.fill();

        // Connie's dark long hair resting on ground
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(18, -8, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Face
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.arc(17, -9, 8.5, 0, Math.PI * 2);
        ctx.fill();

        // Connie's spectacles / glasses
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(13, -12, 4, 4);
        ctx.strokeRect(18, -12, 4, 4);
        ctx.beginPath();
        ctx.moveTo(17, -10);
        ctx.lineTo(18, -10);
        ctx.stroke();

        // Sleeping eyes (⌒ ⌒)
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(15, -9, 1.8, Math.PI, 0, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(20, -9, 1.8, Math.PI, 0, false);
        ctx.stroke();

        // Rose Sword resting flat on the ground
        ctx.save();
        ctx.translate(-4, -3);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(8, 0);
        ctx.stroke();
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-18, -3, 3, 6);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(-22, -1.5, 4, 3);
        ctx.restore();
      }

      ctx.restore(); // restore translation

      // Dizzy cartoon stars orbiting overhead
      const dizzyAngle = this.fallenTimer * 3.5;
      const starColors = ['#fde047', '#38bdf8', '#f472b6'];
      for (let s = 0; s < 3; s++) {
        const a = dizzyAngle + (s * Math.PI * 2 / 3);
        const starX = this.x + Math.cos(a) * 16;
        const starY = lyingY - 26 + Math.sin(a) * 5;
        ctx.fillStyle = starColors[s];
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💫', starX, starY);
      }

      // Overhead Status Badge
      const heroName = (this.activeChar === 'steven') ? 'STEVEN' : 'CONNIE';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 55, lyingY - 48, 110, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 9px "Rubik", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💔 ${heroName} DOWN (0 HP)`, this.x, lyingY - 36);

    } else {
      // -------------------------------------------------------------
      // FULL GEM POOFED: PHYSICAL BODY GONE, AUTHENTIC GEMSTONE ON FLOOR
      // -------------------------------------------------------------
      const gemY = this.y - 6;
      const pulse = 0.85 + Math.sin(this.fallenTimer * 4.0) * 0.15;

      const gemInfo = {
        garnet: { name: 'GARNET', color: '#ef4444', aura: 'rgba(239, 68, 68, 0.45)' },
        amethyst: { name: 'AMETHYST', color: '#a855f7', aura: 'rgba(168, 85, 247, 0.45)' },
        pearl: { name: 'PEARL', color: '#38bdf8', aura: 'rgba(56, 189, 248, 0.45)' },
        bismuth: { name: 'BISMUTH', color: '#f97316', aura: 'rgba(249, 115, 22, 0.45)' },
        peridot: { name: 'PERIDOT', color: '#22c55e', aura: 'rgba(34, 197, 94, 0.45)' },
        lapis: { name: 'LAPIS', color: '#0ea5e9', aura: 'rgba(14, 165, 233, 0.45)' },
        rose: { name: 'ROSE QUARTZ', color: '#f43f5e', aura: 'rgba(244, 63, 94, 0.45)' },
        jasper: { name: 'JASPER', color: '#ea580c', aura: 'rgba(234, 88, 12, 0.45)' }
      }[this.activeChar] || { name: 'GEM', color: '#c084fc', aura: 'rgba(192, 132, 252, 0.45)' };

      const auraGrad = ctx.createRadialGradient(this.x, gemY, 4, this.x, gemY, 26 * pulse);
      auraGrad.addColorStop(0, gemInfo.aura);
      auraGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.ellipse(this.x, gemY, 28 * pulse, 10 * pulse, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(this.x, gemY);

      if (this.activeChar === 'garnet') {
        // Garnet: Twin Gemstones side-by-side (Ruby left, Sapphire right)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.rect(-13, -7, 10, 10);
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-10, -4, 4, 4);

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.moveTo(8, -7);
        ctx.lineTo(13, 3);
        ctx.lineTo(3, 3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.2;
        ctx.stroke();

      } else if (this.activeChar === 'amethyst') {
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, -4);
        ctx.lineTo(8, 4);
        ctx.lineTo(0, 9);
        ctx.lineTo(-8, 4);
        ctx.lineTo(-8, -4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(4, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();

      } else if (this.activeChar === 'pearl') {
        const pearlGrad = ctx.createRadialGradient(-2, -3, 1, 0, 0, 8);
        pearlGrad.addColorStop(0, '#ffffff');
        pearlGrad.addColorStop(0.6, '#e0f2fe');
        pearlGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = pearlGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.4;
        ctx.stroke();

      } else if (this.activeChar === 'bismuth') {
        const colors = ['#f97316', '#a855f7', '#06b6d4', '#10b981'];
        for (let s = 4; s >= 1; s--) {
          ctx.fillStyle = colors[s - 1];
          ctx.fillRect(-s * 2.5, -s * 2.5, s * 5, s * 5);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(-s * 2.5, -s * 2.5, s * 5, s * 5);
        }

      } else if (this.activeChar === 'peridot') {
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, 6);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#bef264';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(4, 3);
        ctx.lineTo(-4, 3);
        ctx.closePath();
        ctx.fill();

      } else if (this.activeChar === 'lapis') {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.quadraticCurveTo(8, -1, 7, 5);
        ctx.quadraticCurveTo(0, 10, -7, 5);
        ctx.quadraticCurveTo(-8, -1, 0, -9);
        ctx.fill();
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(1, 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (this.activeChar === 'rose') {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = '#fb7185';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', 0, 4);

      } else if (this.activeChar === 'jasper') {
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, 6);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fed7aa';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(0, 6);
        ctx.stroke();
      }

      ctx.restore();

      const sparkY = gemY - 14 - ((this.fallenTimer * 18) % 18);
      ctx.fillStyle = gemInfo.color;
      ctx.beginPath();
      ctx.arc(this.x + Math.sin(this.fallenTimer * 5) * 6, sparkY, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = gemInfo.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(this.x - 70, gemY - 42, 140, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Rubik", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💎 ${gemInfo.name} POOFED`, this.x, gemY - 30);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '7.5px "Rubik", "Outfit", sans-serif';
      ctx.fillText('(Revives Next Stage)', this.x, gemY - 22);
    }

    ctx.restore();
  }

  drawFusionHero(ctx) {
    const fusion = this.fusionData;
    if (!fusion) return;

    let actionLunge = 0;
    let actionLiftY = 0;
    let actionTorsoTilt = 0;
    let actionScaleX = 1;
    let actionScaleY = 1;
    let animP = 0;

    if (this.actionTimer > 0 && this.actionDuration > 0) {
      animP = Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration)));
      const strike = this.getStrikeCurve(animP);
      if (this.actionType === 'punch') {
        actionLunge = strike * 30;
        actionLiftY = -Math.max(0, strike) * 6;
        actionTorsoTilt = strike * 0.16;
        actionScaleX = 1 + strike * 0.08;
        actionScaleY = 1 - strike * 0.05;
      } else if (this.actionType === 'throw') {
        actionLunge = strike * 22;
        actionTorsoTilt = strike * 0.12;
        actionScaleX = 1 + strike * 0.06;
        actionScaleY = 1 - strike * 0.04;
      } else if (this.actionType === 'skill') {
        const pulse = Math.sin(animP * Math.PI);
        actionLiftY = -pulse * 16;
        actionTorsoTilt = -pulse * 0.10;
        actionScaleX = 1 - pulse * 0.04;
        actionScaleY = 1 + pulse * 0.07;
      }
    }

    const t = (typeof performance !== 'undefined' && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
    const idleBob = Math.sin(t * 3.5) * 3;
    const walkBob = Math.abs(Math.sin(this.walkAnim * 10)) * 6;
    const bob = (Math.abs(this.vx) > 10 ? walkBob : idleBob) + actionLiftY;
    const scale = fusion.scale || 1.45;

    ctx.save();
    ctx.translate(this.x + actionLunge * this.facing, this.y);
    ctx.scale(this.facing * scale * actionScaleX, scale * actionScaleY);
    ctx.rotate(actionTorsoTilt);

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
      this.drawFusionAttackVisuals(ctx, bob, fusion, animP);
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
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: Lush, voluminous wavy dark espresso hair cascading behind shoulders (-X)
    ctx.fillStyle = '#1f1418';
    ctx.beginPath();
    ctx.moveTo(4, -89 + bob);
    ctx.bezierCurveTo(-14, -92 + bob, -24 + hairSway * 0.4, -76 + bob, -21 + hairSway * 0.7, -60 + bob);
    ctx.bezierCurveTo(-28 + hairSway, -46 + bob, -18 + hairSway * 1.1, -30 + bob, -24 + hairSway * 1.2, -18 + bob);
    ctx.bezierCurveTo(-14 + hairSway, -16 + bob, -4 + hairSway * 0.6, -26 + bob, 4, -42 + bob);
    ctx.lineTo(8, -76 + bob);
    ctx.closePath();
    ctx.fill();
    // Wavy espresso highlight ribbon
    ctx.strokeStyle = '#3b252c';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-10, -82 + bob);
    ctx.bezierCurveTo(-19 + hairSway * 0.5, -68 + bob, -14 + hairSway * 0.8, -50 + bob, -20 + hairSway, -30 + bob);
    ctx.stroke();

    // 2. Connie's Blue Jumpsuit Pants & Boots
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-14, -26 + bob, 11, 26);
    ctx.fillRect(3, -26 + bob, 11, 26);
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-15, -6 + bob, 13, 6);
    ctx.fillRect(2, -6 + bob, 13, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-15, -2 + bob, 13, 2.5);
    ctx.fillRect(2, -2 + bob, 13, 2.5);

    // 3. Steven's Cropped Salmon-Red Star Shirt & Midriff
    ctx.fillStyle = '#d4976a';
    ctx.fillRect(-13, -34 + bob, 26, 10);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-16, -60 + bob, 32, 28, 6);
    ctx.fill();

    // Gold Star on chest + Rose Quartz Navel Gem
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 2, -46 + bob, 8.5);
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.2;
    this.drawMiniStar(ctx, 1, -29 + bob, 4.2);
    ctx.stroke();

    // 4. Warm golden-tan neck & head (clear face!)
    ctx.fillStyle = '#d4976a';
    ctx.fillRect(-4, -68 + bob, 8, 10);
    ctx.beginPath();
    ctx.arc(0, -75 + bob, 14, 0, Math.PI * 2);
    ctx.fill();

    // Expressive eyes, eyebrows, rosy cheeks & confident smile
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-3.5, -76 + bob, 3.6, 4.0, 0, 0, Math.PI * 2);
    ctx.ellipse(5.5, -76 + bob, 3.6, 4.0, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1f1418';
    ctx.beginPath();
    ctx.arc(-2.8, -76 + bob, 2.2, 0, Math.PI * 2);
    ctx.arc(6.2, -76 + bob, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2.2, -77.2 + bob, 0.9, 0, Math.PI * 2);
    ctx.arc(6.8, -77.2 + bob, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(7.5, -71.5 + bob, 2.8, 0, Math.PI * 2);
    ctx.arc(-6.5, -71.5 + bob, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(1.5, -70 + bob, 3.8, 0.15, Math.PI * 0.85);
    ctx.stroke();

    // Crown & side-swept wavy bangs (above eyes, framing temples!)
    ctx.fillStyle = '#1f1418';
    ctx.beginPath();
    ctx.moveTo(-14, -75 + bob);
    ctx.bezierCurveTo(-16, -89 + bob, -4, -95 + bob, 7, -91 + bob);
    ctx.bezierCurveTo(15, -88 + bob, 16, -80 + bob, 12, -74 + bob);
    ctx.bezierCurveTo(10, -81 + bob, 4, -84 + bob, -2, -82 + bob);
    ctx.bezierCurveTo(-7, -84 + bob, -11, -80 + bob, -14, -75 + bob);
    ctx.closePath();
    ctx.fill();

    // 5. Back Arm: Rose's Crystalline Pink Shield
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-19, -59 + bob, 7, 10);
    ctx.fillStyle = '#d4976a';
    ctx.fillRect(-18, -50 + bob, 6, 14);
    ctx.save();
    ctx.translate(-18 - strike * 4, -46 + bob);
    ctx.fillStyle = 'rgba(255, 96, 151, 0.88)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    // 6. Front Arm: Rose's Broadsword with kinetic slash!
    const handX = 14 + strike * 12;
    const handY = -45 + bob - strike * 4;
    this.drawArticulatedArm(ctx, 11, -56 + bob, 13 + strike * 5, -49 + bob, handX, handY, '#f43f5e', '#d4976a', 6.5, 5.5, '#d4976a', 4);
    ctx.save();
    ctx.translate(handX, handY);
    const swordSwing = (actionType === 'punch' || actionType === 'throw') ? -0.35 + strike * 1.55 : 0.28;
    ctx.rotate(swordSwing);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(-2, -4, 4, 11);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-8, -6, 16, 3.5);
    ctx.fillStyle = '#fda4af';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-4, -6);
    ctx.lineTo(-3.5, -40);
    ctx.lineTo(0, -49);
    ctx.lineTo(3.5, -40);
    ctx.lineTo(4, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // --- 2. SMOKY QUARTZ (Steven + Amethyst) ---
  drawSmokyQuartz(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: Fluffy, tousled wavy dark taupe-violet hair trailing backward (-X)
    ctx.fillStyle = '#261e2b';
    ctx.beginPath();
    ctx.moveTo(6, -89 + bob);
    ctx.bezierCurveTo(-12, -95 + bob, -26 + hairSway * 0.5, -82 + bob, -24 + hairSway * 0.8, -66 + bob);
    ctx.bezierCurveTo(-30 + hairSway, -54 + bob, -20 + hairSway, -44 + bob, -14 + hairSway * 0.7, -46 + bob);
    ctx.lineTo(8, -66 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Legs: Dark purple ripped leggings with star cutouts
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(-15, -26 + bob, 12, 26);
    ctx.fillRect(3, -26 + bob, 12, 26);
    ctx.fillStyle = '#8b797d';
    this.drawMiniStar(ctx, -9, -15 + bob, 3.2);
    this.drawMiniStar(ctx, 9, -15 + bob, 3.2);
    ctx.fillRect(-16, -5 + bob, 13, 5);
    ctx.fillRect(3, -5 + bob, 13, 5);

    // 3. Torso: Steven's stretched salmon star shirt
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-18, -62 + bob, 36, 38, 8);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 1, -44 + bob, 9);

    // Amethyst chest gem + Steven navel gem
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.2;
    this.drawMiniStar(ctx, 1, -55 + bob, 4.2);
    ctx.stroke();
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 1, -28 + bob, 4);

    // 4. Head: Warm smoky taupe-brown skin (unobstructed face!)
    ctx.fillStyle = '#8b797d';
    ctx.beginPath();
    ctx.arc(0, -74 + bob, 15, 0, Math.PI * 2);
    ctx.fill();

    // Expressive eyes + cheeky grin with cute fang
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-4, -75 + bob, 3.6, 3.8, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -75 + bob, 3.6, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.arc(-3.2, -75 + bob, 2.2, 0, Math.PI * 2);
    ctx.arc(5.8, -75 + bob, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#261e2b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(1, -69 + bob, 4.5, 0.1, Math.PI * 0.9);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(2.5, -67.5 + bob);
    ctx.lineTo(5, -68 + bob);
    ctx.lineTo(3.8, -64.5 + bob);
    ctx.closePath();
    ctx.fill();

    // Sculpted wavy/fluffy crown bangs above eyes (zero face-covering circles!)
    ctx.fillStyle = '#261e2b';
    ctx.beginPath();
    ctx.moveTo(-15, -74 + bob);
    ctx.bezierCurveTo(-18, -90 + bob, -4, -97 + bob, 8, -92 + bob);
    ctx.bezierCurveTo(17, -89 + bob, 18, -79 + bob, 13, -73 + bob);
    ctx.bezierCurveTo(10, -80 + bob, 4, -83 + bob, -2, -80 + bob);
    ctx.bezierCurveTo(-8, -83 + bob, -12, -79 + bob, -15, -74 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#4a3b52';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -86 + bob);
    ctx.quadraticCurveTo(0, -91 + bob, 9, -85 + bob);
    ctx.stroke();

    // 5. THREE ARMS + TRIPLE YO-YO WHIP EXTENSION!
    ctx.fillStyle = '#8b797d';
    ctx.fillRect(-24, -58 + bob, 8, 20);
    ctx.fillRect(-22, -41 + bob, 8, 18);
    ctx.fillRect(15, -55 + bob, 8 + strike * 6, 20);

    const spinRot = (typeof performance !== 'undefined' ? performance.now() / 55 : Date.now() / 55);
    const yoyoReach = 28 + strike * 34;
    const yoyoY = -36 + bob - strike * 6;

    // Glowing Amethyst Yo-Yo String!
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(21, -40 + bob);
    ctx.quadraticCurveTo(22 + strike * 16, -46 + bob, yoyoReach, yoyoY);
    ctx.moveTo(-20, -48 + bob);
    ctx.lineTo(-30, -48 + bob);
    ctx.moveTo(-19, -28 + bob);
    ctx.lineTo(-27, -25 + bob);
    ctx.stroke();

    // Yo-Yo 1 (Primary strike yo-yo)
    ctx.save();
    ctx.translate(yoyoReach, yoyoY);
    ctx.rotate(spinRot);
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 0, 0, 5);
    ctx.restore();

    // Yo-Yo 2 & 3 (Left dual arms)
    ctx.save();
    ctx.translate(-27, -25 + bob);
    ctx.rotate(-spinRot);
    ctx.fillStyle = '#9333ea';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(-31, -48 + bob);
    ctx.rotate(spinRot * 1.3);
    ctx.fillStyle = '#c084fc';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // --- 3. RAINBOW QUARTZ 2.0 (Steven + Pearl) ---
  drawRainbowQuartz2(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: Two-toned turquoise & rose feathered wavy bouffant behind head (-X)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(6, -88 + bob);
    ctx.bezierCurveTo(-12, -94 + bob, -24 + hairSway * 0.5, -84 + bob, -22 + hairSway * 0.8, -68 + bob);
    ctx.bezierCurveTo(-14 + hairSway * 0.6, -64 + bob, -4, -66 + bob, 8, -72 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Rolled-up blue denim shorts & ballerina shoes
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-13, -28 + bob, 11, 20);
    ctx.fillRect(2, -28 + bob, 11, 20);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-12, -12 + bob, 9, 8);
    ctx.fillRect(3, -12 + bob, 9, 8);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-13, -5 + bob, 11, 5);
    ctx.fillRect(2, -5 + bob, 11, 5);

    // 3. Magenta blazer over coral shirt + Navel Gem
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.roundRect(-15, -64 + bob, 30, 38, 6);
    ctx.fill();
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.moveTo(-6, -64 + bob);
    ctx.lineTo(6, -64 + bob);
    ctx.lineTo(0, -48 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 0, -32 + bob, 4);

    // 4. Fair skin head, Forehead Pearl & Four Unobstructed Eyes!
    ctx.fillStyle = '#fce7f3';
    ctx.beginPath();
    ctx.arc(0, -76 + bob, 13.5, 0, Math.PI * 2);
    ctx.fill();

    // Swept rose-pink feathered top-crest (above forehead Pearl!)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-14, -81 + bob);
    ctx.bezierCurveTo(-16, -96 + bob, 2, -102 + bob, 14, -93 + bob);
    ctx.bezierCurveTo(10, -88 + bob, 2, -88 + bob, -14, -81 + bob);
    ctx.closePath();
    ctx.fill();

    // Forehead Pearl Gem
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, -85.5 + bob, 2.8, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Top eyes behind lavender spectacles + bottom cyan eyes
    ctx.fillStyle = 'rgba(192, 132, 252, 0.78)';
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(5, -79.5 + bob, 3.8, 0, Math.PI * 2);
    ctx.arc(-5, -79.5 + bob, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(4, -72.5 + bob, 2.3, 0, Math.PI * 2);
    ctx.arc(-4, -72.5 + bob, 2.3, 0, Math.PI * 2);
    ctx.fill();

    // 5. WEAPON: Magical Rainbow Parasol with kinetic thrust!
    ctx.save();
    ctx.translate(14 + strike * 14, -50 + bob - strike * 3);
    const angle = (actionType === 'punch' || actionType === 'throw') ? -0.15 + strike * 1.25 : -0.2;
    ctx.rotate(angle);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-2, -48, 4, 60);
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-4, 12, 5, 0, Math.PI);
    ctx.stroke();
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
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;

    // Powerful athletic legs in red-brown pants
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(-16, -28 + bob, 13, 28);
    ctx.fillRect(3, -28 + bob, 13, 28);
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
    ctx.fillStyle = '#ffd166';
    this.drawMiniStar(ctx, 0, -48 + bob, 11);

    // FOUR ARMS + Kinetic Suction-Cup Gauntlet Punch!
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-28, -64 + bob, 10, 22);
    ctx.fillRect(18, -64 + bob, 10 + strike * 8, 22);
    ctx.fillRect(-26, -46 + bob, 9, 20);
    ctx.fillRect(17, -46 + bob, 9 + strike * 14, 18);

    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(25 + strike * 20, -34 + bob - strike * 6, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-24, -30 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // BLAZING SUNBURST HEAD OF COMIC FLAMES!
    const t = (typeof performance !== 'undefined' ? performance.now() / 300 : Date.now() / 300);
    ctx.save();
    ctx.translate(0, -82 + bob);
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

    // Bold Crimson Shades + Smile
    ctx.fillStyle = '#be123c';
    ctx.fillRect(-14, -4, 28, 9);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-10, -2);
    ctx.lineTo(-4, -2);
    ctx.lineTo(-8, 3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 6, 6, 0.1, Math.PI * 0.9);
    ctx.stroke();
    ctx.restore();
  }

  // --- 5. SUGILITE (Garnet + Amethyst) ---
  drawSugilite(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: Colossal sweeping spiky-wavy midnight-violet anime mane (-X, behind face!)
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.moveTo(6, -104 + bob);
    ctx.lineTo(-10 + hairSway * 0.3, -124 + bob);
    ctx.lineTo(-16 + hairSway * 0.4, -108 + bob);
    ctx.lineTo(-36 + hairSway * 0.7, -114 + bob);
    ctx.lineTo(-26 + hairSway * 0.6, -94 + bob);
    ctx.bezierCurveTo(-44 + hairSway, -82 + bob, -38 + hairSway * 1.1, -56 + bob, -46 + hairSway * 1.3, -34 + bob);
    ctx.bezierCurveTo(-30 + hairSway, -32 + bob, -18 + hairSway * 0.7, -42 + bob, -8, -56 + bob);
    ctx.lineTo(10, -88 + bob);
    ctx.closePath();
    ctx.fill();
    // Violet mane highlight wave
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-12, -102 + bob);
    ctx.bezierCurveTo(-28 + hairSway * 0.6, -84 + bob, -24 + hairSway * 0.9, -62 + bob, -34 + hairSway, -42 + bob);
    ctx.stroke();

    // 2. Massive muscular legs & broad titan torso
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(-18, -32 + bob, 15, 32);
    ctx.fillRect(3, -32 + bob, 15, 32);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-19, -6 + bob, 16, 6);
    ctx.fillRect(3, -6 + bob, 16, 6);

    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.roundRect(-24, -76 + bob, 48, 48, 10);
    ctx.fill();
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
    ctx.fillRect(22, -72 + bob, 12 + strike * 8, 28);
    ctx.fillRect(-30, -50 + bob, 11, 24);
    ctx.fillRect(20, -50 + bob, 11 + strike * 8, 24);

    // 3. Head with ALL FIVE PURPLE EYES & Menacing Fangs (100% unobstructed!)
    ctx.fillStyle = '#6b21a8';
    ctx.beginPath();
    ctx.arc(0, -88 + bob, 17, 0, Math.PI * 2);
    ctx.fill();

    // Widow's peak crown spikes above forehead eye
    ctx.fillStyle = '#1e102d';
    ctx.beginPath();
    ctx.moveTo(-16, -92 + bob);
    ctx.lineTo(-10, -112 + bob);
    ctx.lineTo(0, -101 + bob);
    ctx.lineTo(10, -113 + bob);
    ctx.lineTo(16, -93 + bob);
    ctx.quadraticCurveTo(0, -100 + bob, -16, -92 + bob);
    ctx.closePath();
    ctx.fill();

    // 5 Glowing Purple Eyes + Translucent Dark Visor Gleam
    ctx.fillStyle = '#e9d5ff';
    ctx.beginPath();
    ctx.arc(0, -96 + bob, 2.8, 0, Math.PI * 2);
    ctx.arc(-7, -91 + bob, 3.0, 0, Math.PI * 2);
    ctx.arc(7, -91 + bob, 3.0, 0, Math.PI * 2);
    ctx.arc(-5, -85 + bob, 2.8, 0, Math.PI * 2);
    ctx.arc(5, -85 + bob, 2.8, 0, Math.PI * 2);
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

    // 4. WEAPON: Colossal Spiked Flail / Wrecking Ball whipping forward!
    ctx.save();
    ctx.translate(32 + strike * 8, -45 + bob);
    const flailX = 24 + strike * 26;
    const flailY = 14 - strike * 18;
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(flailX * 0.5, -8 * strike, flailX, flailY);
    ctx.stroke();

    ctx.fillStyle = '#7e22ce';
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(flailX, flailY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f3e8ff';
    for (let s = 0; s < 6; s++) {
      const a = s * Math.PI / 3 + strike * 1.5;
      ctx.beginPath();
      ctx.moveTo(flailX + Math.cos(a) * 15, flailY + Math.sin(a) * 15);
      ctx.lineTo(flailX + Math.cos(a) * 24, flailY + Math.sin(a) * 24);
      ctx.lineTo(flailX + Math.cos(a + 0.3) * 15, flailY + Math.sin(a + 0.3) * 15);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 6. SARDONYX (Garnet + Pearl) ---
  drawSardonyx(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;

    // 1. BACK LAYER: Sculpted 3D Beveled Tetrahedral Afro behind head!
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(0, -118 + bob);
    ctx.lineTo(25, -83 + bob);
    ctx.lineTo(-25, -83 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.moveTo(0, -118 + bob);
    ctx.lineTo(0, -83 + bob);
    ctx.lineTo(-25, -83 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Ultra-tall legs with white spat boots & Tuxedo Torso
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-13, -34 + bob, 10, 34);
    ctx.fillRect(3, -34 + bob, 10, 34);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-14, -10 + bob, 12, 10);
    ctx.fillRect(2, -10 + bob, 12, 10);

    ctx.fillStyle = '#fb923c';
    ctx.fillRect(-10, -42 + bob, 20, 8);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-16, -76 + bob, 32, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -74 + bob, 10, 16);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(-4, -70 + bob, 8, 3.5);

    // 3. Peach-orange skin head, Four Eyes behind Spectacles & Showbiz Grin
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(0, -84 + bob, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-4.5, -86 + bob, 4.2, 0, Math.PI * 2);
    ctx.arc(4.5, -86 + bob, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-4, -87 + bob, 1.3, 0, Math.PI * 2);
    ctx.arc(5, -87 + bob, 1.3, 0, Math.PI * 2);
    ctx.arc(-4, -84.5 + bob, 1.3, 0, Math.PI * 2);
    ctx.arc(5, -84.5 + bob, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -78.5 + bob, 10, 3.5);

    // 4. FOUR ARMS + Colossal Theatrical War Hammer Smash!
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(-22, -72 + bob, 8, 24);
    ctx.fillRect(14, -72 + bob, 8 + strike * 8, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-20, -50 + bob, 8, 14);
    ctx.fillRect(12, -50 + bob, 8, 14);

    ctx.save();
    ctx.translate(22 + strike * 10, -60 + bob);
    ctx.rotate(strike * 1.15);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-3, -48, 6, 76);
    ctx.fillStyle = '#fb7185';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-17, -58, 34, 22, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 0, -47, 5.5);
    ctx.restore();
  }

  // --- 7. OPAL (Pearl + Amethyst) ---
  drawOpal(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: High top-knot + long, thick, flowing wavy pearl-white ponytail (-X, behind face!)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(-3, -99 + bob, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4, -98 + bob);
    ctx.bezierCurveTo(-24 + hairSway * 0.4, -92 + bob, -32 + hairSway * 0.8, -68 + bob, -26 + hairSway, -46 + bob);
    ctx.bezierCurveTo(-34 + hairSway * 1.2, -28 + bob, -22 + hairSway * 1.3, -12 + bob, -14 + hairSway, -14 + bob);
    ctx.bezierCurveTo(-8 + hairSway * 0.7, -28 + bob, -12 + hairSway * 0.4, -56 + bob, 2, -84 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -90 + bob);
    ctx.bezierCurveTo(-24 + hairSway * 0.6, -68 + bob, -18 + hairSway * 0.9, -42 + bob, -20 + hairSway, -20 + bob);
    ctx.stroke();

    // 2. Tall slender legs & Mint turquoise tunic with flowing lavender sash
    ctx.fillStyle = '#c7d2fe';
    ctx.fillRect(-12, -32 + bob, 10, 32);
    ctx.fillRect(2, -32 + bob, 10, 32);
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-13, -12 + bob); ctx.lineTo(-2, -6 + bob);
    ctx.moveTo(2, -12 + bob); ctx.lineTo(13, -6 + bob);
    ctx.stroke();

    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.roundRect(-15, -74 + bob, 30, 44, 6);
    ctx.fill();
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(-16, -48 + bob, 32, 6);
    ctx.fillRect(-14, -42 + bob, 8, 18);

    // Chest Amethyst gem
    ctx.fillStyle = '#a855f7';
    this.drawMiniStar(ctx, 1, -62 + bob, 5);

    // 3. Pale opalescent lavender head, Forehead Pearl & Serene Aquamarine Eyes (100% clear!)
    ctx.fillStyle = '#c7d2fe';
    ctx.beginPath();
    ctx.arc(0, -82 + bob, 13, 0, Math.PI * 2);
    ctx.fill();

    // Delicate parted pearl-white crown bangs framing forehead gem
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-13, -81 + bob);
    ctx.quadraticCurveTo(-12, -96 + bob, 0, -95 + bob);
    ctx.quadraticCurveTo(12, -96 + bob, 13, -81 + bob);
    ctx.quadraticCurveTo(8, -89 + bob, 0, -91 + bob);
    ctx.quadraticCurveTo(-8, -89 + bob, -13, -81 + bob);
    ctx.closePath();
    ctx.fill();

    // Forehead Pearl Gem + Serene Aquamarine Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -88.5 + bob, 2.6, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(4.5, -82 + bob, 2.6, 0, Math.PI * 2);
    ctx.arc(-3.5, -82 + bob, 2.6, 0, Math.PI * 2);
    ctx.fill();

    // 4. FOUR ARMS + Giant Opal Recurve Bow with dynamic bowstring draw!
    ctx.fillStyle = '#c7d2fe';
    ctx.fillRect(-20, -56 + bob, 7, 24);
    ctx.fillRect(13, -56 + bob, 7 + strike * 6, 24);
    ctx.fillRect(-18, -70 + bob, 7, 20);
    ctx.fillRect(11, -70 + bob, 7, 20);

    ctx.save();
    ctx.translate(20 + strike * 6, -58 + bob);
    const drawPull = -8 - strike * 12;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(8, -48);
    ctx.bezierCurveTo(-14, -20, -14, 20, 8, 48);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(8, -48);
    ctx.lineTo(drawPull, 0);
    ctx.lineTo(8, 48);
    ctx.stroke();
    // Opalescent Light Arrow
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(drawPull, -2, 34 - drawPull, 4);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(30, -6);
    ctx.lineTo(42, 0);
    ctx.lineTo(30, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- 8. MALACHITE (Lapis + Jasper) ---
  drawMalachite(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: Massive untamed WAVY mint-cream lion's mane (-X, behind face!) + Lapis Water Wings
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -65 + bob);
    ctx.bezierCurveTo(-56, -104 + bob, -64, -40 + bob, -24, -45 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.moveTo(8, -106 + bob);
    ctx.bezierCurveTo(-8, -124 + bob, -32 + hairSway * 0.5, -110 + bob, -30 + hairSway * 0.8, -88 + bob);
    ctx.bezierCurveTo(-44 + hairSway, -70 + bob, -34 + hairSway * 1.1, -46 + bob, -42 + hairSway * 1.3, -24 + bob);
    ctx.bezierCurveTo(-24 + hairSway, -22 + bob, -12 + hairSway * 0.6, -38 + bob, -4, -56 + bob);
    ctx.lineTo(10, -90 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-12, -104 + bob);
    ctx.bezierCurveTo(-26 + hairSway * 0.6, -82 + bob, -20 + hairSway * 0.9, -56 + bob, -30 + hairSway, -32 + bob);
    ctx.stroke();

    // 2. Walking limbs & Monstrous Juggernaut Torso with Emerald Tiger Stripes
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-22, -26 + bob, 14, 26);
    ctx.fillRect(-6, -26 + bob, 13, 26);
    ctx.fillRect(9, -26 + bob, 14, 26);
    ctx.fillStyle = '#047857';
    ctx.fillRect(-23, -4 + bob, 16, 4);
    ctx.fillRect(-7, -4 + bob, 15, 4);
    ctx.fillRect(8, -4 + bob, 16, 4);

    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.roundRect(-26, -78 + bob, 52, 54, 12);
    ctx.fill();
    ctx.fillStyle = '#047857';
    ctx.fillRect(-24, -68 + bob, 16, 5);
    ctx.fillRect(8, -60 + bob, 16, 5);
    ctx.fillRect(-20, -50 + bob, 18, 5);

    // Upper Thrashing Arms with Hydro-Ice Claws!
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-36, -74 + bob, 12, 28);
    ctx.fillRect(24, -74 + bob, 12 + strike * 14, 26);
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(-38, -48 + bob, 15, 8);
    ctx.fillRect(26 + strike * 16, -50 + bob - strike * 6, 17, 9);

    // 3. Head with Jasper's Orange Nose Gem & ALL SIX GLOWING EYES (100% clear!)
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.arc(0, -90 + bob, 18, 0, Math.PI * 2);
    ctx.fill();

    // Swept mint-cream widow's peak crown above eyes
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.moveTo(-18, -94 + bob);
    ctx.bezierCurveTo(-18, -114 + bob, 4, -118 + bob, 17, -101 + bob);
    ctx.quadraticCurveTo(4, -104 + bob, 0, -99 + bob);
    ctx.quadraticCurveTo(-8, -104 + bob, -18, -94 + bob);
    ctx.closePath();
    ctx.fill();

    // SIX glowing lime-cyan eyes!
    ctx.fillStyle = '#a3e635';
    for (let e = 0; e < 6; e++) {
      const ex = -9 + (e % 3) * 9;
      const ey = -96 + Math.floor(e / 3) * 6 + bob;
      ctx.beginPath();
      ctx.arc(ex, ey, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orange crystal nose gem + Fierce bared predator teeth
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-3.5, -88 + bob);
    ctx.lineTo(4.5, -86 + bob);
    ctx.lineTo(-1, -83 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -80 + bob, 14, 4);
  }

  // --- 9. RAINBOW QUARTZ CLASSIC (Rose + Pearl) ---
  drawRainbowQuartzClassic(ctx, bob, animP, actionType) {
    const strike = (actionType === 'punch' || actionType === 'throw') ? this.getStrikeCurve(animP) : 0;
    const hairSway = this.getHairSway(animP, actionType);

    // 1. BACK LAYER: Voluminous 80s cascading wavy/spiral blonde & pastel-pink mane (-X, behind face!)
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(6, -96 + bob);
    ctx.bezierCurveTo(-14, -104 + bob, -28 + hairSway * 0.5, -86 + bob, -24 + hairSway * 0.8, -64 + bob);
    ctx.bezierCurveTo(-34 + hairSway, -46 + bob, -22 + hairSway * 1.1, -24 + bob, -28 + hairSway * 1.3, -12 + bob);
    ctx.bezierCurveTo(-14 + hairSway, -10 + bob, -4 + hairSway * 0.6, -24 + bob, 4, -46 + bob);
    ctx.lineTo(8, -80 + bob);
    ctx.closePath();
    ctx.fill();
    // Pastel rose-pink spiral wave ribbon
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.moveTo(-6, -90 + bob);
    ctx.bezierCurveTo(-22 + hairSway * 0.6, -72 + bob, -16 + hairSway * 0.9, -46 + bob, -22 + hairSway, -20 + bob);
    ctx.bezierCurveTo(-14 + hairSway * 0.8, -20 + bob, -10 + hairSway * 0.6, -44 + bob, -2, -76 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. 80s dance leotard legs, leg warmers & torso
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(-12, -32 + bob, 10, 32);
    ctx.fillRect(2, -32 + bob, 10, 32);
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-13, -16 + bob, 12, 12);
    ctx.fillRect(1, -16 + bob, 12, 12);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(-13, -4 + bob, 12, 4);
    ctx.fillRect(1, -4 + bob, 12, 4);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-14, -70 + bob, 28, 40, 6);
    ctx.fill();
    ctx.fillStyle = '#5eead4';
    ctx.fillRect(-15, -46 + bob, 30, 6);
    ctx.fillStyle = '#fda4af';
    this.drawMiniStar(ctx, 0, -38 + bob, 5);

    // 3. Fair peach-rose head, Forehead Pearl & ALL FOUR EYES (100% clear!)
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -80 + bob, 13, 0, Math.PI * 2);
    ctx.fill();

    // Feathered 80s blonde-pink crown bangs above forehead Pearl
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.moveTo(-13, -84 + bob);
    ctx.bezierCurveTo(-15, -99 + bob, 2, -103 + bob, 14, -93 + bob);
    ctx.quadraticCurveTo(2, -91 + bob, -13, -84 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -88 + bob, 2.6, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(-4, -83 + bob, 2.3, 0, Math.PI * 2);
    ctx.arc(4, -83 + bob, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-4, -77 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -77 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Arms, Rose Parasol & Kinetic Fencing Rapier Lunge!
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-18, -65 + bob, 6, 20);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-22, -60 + bob, 3, 30);
    ctx.beginPath();
    ctx.arc(-20, -60 + bob, 14, -Math.PI * 0.9, -Math.PI * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(12, -65 + bob, 6 + strike * 8, 18);
    ctx.save();
    ctx.translate(16 + strike * 12, -54 + bob - strike * 3);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(32 + strike * 10, -8 + strike * 6);
    ctx.stroke();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFusionAttackVisuals(ctx, bob, fusion, animP = 0.5) {
    const strike = Math.max(0.25, this.getStrikeCurve(animP));
    const glow = fusion.glowColor || '#ffffff';
    const base = fusion.color || '#f472b6';
    ctx.save();
    this.drawCrescentSlash(ctx, 26 + strike * 10, -46 + bob, 42 + strike * 10, -Math.PI * 0.48, Math.PI * 0.45, 'rgba(255, 255, 255, 0.35)', base, glow, 14);
    this.drawSpeedLines(ctx, 16, -46 + bob, 44 * strike, 26, 4, glow);
    ctx.fillStyle = '#fde047';
    this.drawMiniStar(ctx, 56 + strike * 12, -46 + bob, 9);
    ctx.fillStyle = '#ffffff';
    this.drawMiniStar(ctx, 44 + strike * 10, -66 + bob, 6);
    ctx.restore();
  }

  drawAttackVisuals(ctx, bob) {
    ctx.save();
    const frame = this.attackFrame; // 0 to 3
    const combo = this.attackCombo; // 0, 1, 2
    const c = this.activeChar;
    const animP = this.actionDuration > 0 ? Math.min(1, Math.max(0, 1 - (this.actionTimer / this.actionDuration))) : 0.5;
    const strike = Math.max(0.2, this.getStrikeCurve(animP));

    if (c === 'connie') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Swift Fencing Lunge Thrust — tapered pink-white lance cone + speed streaks!
          const tipX = 56 + strike * 26;
          const tipY = -44 + bob;
          this.drawSpeedLines(ctx, 18, tipY, 36 + strike * 20, 18, 4, 'rgba(244, 114, 182, 0.85)');
          ctx.fillStyle = 'rgba(236, 72, 153, 0.42)';
          ctx.beginPath();
          ctx.moveTo(22, tipY - 7);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(22, tipY + 7);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(28, tipY - 3);
          ctx.lineTo(tipX + 4, tipY);
          ctx.lineTo(28, tipY + 3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, tipX + 4, tipY, 6.5);
        } else if (combo === 1) {
          // Hit 2: Rising Two-Handed Rose-Crystal Crescent Slash + drifting petals!
          this.drawCrescentSlash(ctx, 24 + strike * 8, -40 + bob, 38 + strike * 8, Math.PI * 0.48, -Math.PI * 0.52, 'rgba(244, 114, 182, 0.38)', '#ec4899', '#ffffff', 13);
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(48 + strike * 8, -22 + bob, 4, 2, -0.5, 0, Math.PI * 2);
          ctx.ellipse(54 + strike * 8, -56 + bob, 4.5, 2.2, 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 56 + strike * 8, -42 + bob, 7.5);
        } else {
          // Hit 3: Aerial Knight's Helm-Splitter Double Crescent Cleave & Star Eruption!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -34 + bob, 48 + strike * 10, -Math.PI * 0.68, Math.PI * 0.40, 'rgba(219, 39, 119, 0.42)', '#f43f5e', '#ffffff', 16);
          this.drawCrescentSlash(ctx, 22 + strike * 8, -34 + bob, 34 + strike * 6, -Math.PI * 0.55, Math.PI * 0.28, 'rgba(251, 207, 232, 0.35)', '#fbcfe8', '#fde047', 9);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 64 + strike * 10, -24 + bob, 9.5);
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 48 + strike * 8, -62 + bob, 7);
        }
      } else if (this.attackType === 'K') {
        // Flying Sword Shockwave Beam Launch
        this.drawCrescentSlash(ctx, 28 + strike * 8, -38 + bob, 32 + strike * 6, -Math.PI * 0.52, Math.PI * 0.52, 'rgba(244, 114, 182, 0.4)', '#ec4899', '#ffffff', 12);
        this.drawSpeedLines(ctx, 20, -38 + bob, 38, 20, 3, '#fbcfe8');
        ctx.fillStyle = '#fbbf24';
        this.drawMiniStar(ctx, 58 + strike * 8, -38 + bob, 8);
      } else if (this.attackType === 'L') {
        // Lion's Shadow-Step Twin X-Cross Tapered Slashes!
        ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
        ctx.beginPath();
        ctx.moveTo(-28, -64 + bob); ctx.lineTo(62, -12 + bob); ctx.lineTo(56, -6 + bob); ctx.lineTo(-34, -58 + bob); ctx.closePath();
        ctx.moveTo(-28, -12 + bob); ctx.lineTo(62, -64 + bob); ctx.lineTo(56, -70 + bob); ctx.lineTo(-34, -18 + bob); ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-28, -62 + bob); ctx.lineTo(60, -14 + bob);
        ctx.moveTo(-28, -14 + bob); ctx.lineTo(60, -62 + bob);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 56, -38 + bob, 9);
      }
    } else if (c === 'jasper') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Brutal Coiled Tiger Gut-Breaker — blazing speed streaks + shockwave cone!
          const reach = 32 + strike * 22;
          this.drawSpeedLines(ctx, 14, -40 + bob, reach, 20, 4, '#fb923c');
          this.drawCrescentSlash(ctx, 24 + strike * 10, -40 + bob, 30 + strike * 6, -Math.PI * 0.38, Math.PI * 0.38, 'rgba(234, 88, 12, 0.42)', '#ea580c', '#fde047', 12);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 52 + strike * 10, -40 + bob, 7.5);
        } else if (combo === 1) {
          // Hit 2: Two-Handed Overhead Meteor Slam — heavy downward fiery arc!
          this.drawCrescentSlash(ctx, 22 + strike * 8, -38 + bob, 42 + strike * 8, -Math.PI * 0.68, Math.PI * 0.25, 'rgba(194, 65, 12, 0.45)', '#ea580c', '#fde047', 15);
          ctx.fillStyle = '#f97316';
          this.drawMiniStar(ctx, 54 + strike * 8, -18 + bob, 9);
        } else {
          // Hit 3: Ground-Rupturing Beta Haymaker + Tectonic Shockwave!
          this.drawCrescentSlash(ctx, 28 + strike * 12, -36 + bob, 48 + strike * 12, -Math.PI * 0.55, Math.PI * 0.45, 'rgba(234, 88, 12, 0.5)', '#dc2626', '#fde047', 18);
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(32, -8 + bob);
          ctx.lineTo(52, 0);
          ctx.lineTo(74, -4);
          ctx.moveTo(52, 0);
          ctx.lineTo(62, 10);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawDiamondInsignia(ctx, 64 + strike * 10, -36 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Crash Helmet Battering-Ram Blazing Comet Cone!
        this.drawSpeedLines(ctx, -18, -46 + bob, 56, 26, 5, '#fde047');
        ctx.fillStyle = 'rgba(234, 88, 12, 0.72)';
        ctx.beginPath();
        ctx.moveTo(12, -68 + bob);
        ctx.lineTo(64, -46 + bob);
        ctx.lineTo(12, -24 + bob);
        ctx.quadraticCurveTo(28, -46 + bob, 12, -68 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // Fiery Sawblade Spin-Dash Vortex Rings!
        const spinPulse = Math.sin((typeof performance !== 'undefined' ? performance.now() : Date.now()) / 35) * 6;
        this.drawCrescentSlash(ctx, 0, -28 + bob, 44 + spinPulse, 0, Math.PI * 1.4, 'rgba(234, 88, 12, 0.45)', '#f97316', '#fde047', 12);
        this.drawCrescentSlash(ctx, 0, -28 + bob, 44 + spinPulse, Math.PI, Math.PI * 2.4, 'rgba(234, 88, 12, 0.45)', '#ea580c', '#ffffff', 12);
      }
    } else if (c === 'steven') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Star-Fist Jab — speed lines + pink crystal punch arc!
          this.drawSpeedLines(ctx, 10, -34 + bob, 32 + strike * 16, 16, 3, '#fda4af');
          this.drawCrescentSlash(ctx, 18 + strike * 8, -34 + bob, 26 + strike * 6, -Math.PI * 0.42, Math.PI * 0.42, 'rgba(255, 96, 151, 0.38)', '#ff6097', '#ffffff', 11);
          ctx.fillStyle = '#ffd166';
          this.drawMiniStar(ctx, 42 + strike * 8, -34 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Spinning Rose Shield Crescent Slash!
          this.drawCrescentSlash(ctx, 22 + strike * 8, -34 + bob, 35 + strike * 8, -Math.PI * 0.52, Math.PI * 0.44, 'rgba(255, 96, 151, 0.42)', '#ec4899', '#ffffff', 14);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 50 + strike * 8, -34 + bob, 7.5);
        } else {
          // Hit 3: Skyward Shield Uppercut + Expanding Golden Star Burst!
          this.drawCrescentSlash(ctx, 24 + strike * 10, -40 + bob, 44 + strike * 8, Math.PI * 0.35, -Math.PI * 0.68, 'rgba(225, 29, 72, 0.42)', '#ff6097', '#ffffff', 16);
          ctx.fillStyle = '#ffd166';
          this.drawMiniStar(ctx, 56 + strike * 10, -48 + bob, 10);
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 38 + strike * 6, -74 + bob, 7);
        }
      } else if (this.attackType === 'K') {
        // Shield Discus Sonic Release Ring!
        this.drawSpeedLines(ctx, 14, -36 + bob, 38, 18, 3, '#ff6097');
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.ellipse(32 + strike * 10, -36 + bob, 8, 22, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // Hexagonal Pink Diamond / Rose Bubble Shockwave!
        const rad = 42 + strike * 10;
        ctx.fillStyle = 'rgba(255, 96, 151, 0.22)';
        ctx.strokeStyle = '#ff94ba';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
          const ha = (h * Math.PI) / 3;
          const hx = Math.cos(ha) * rad;
          const hy = -32 + bob + Math.sin(ha) * rad;
          if (h === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffd166';
        this.drawMiniStar(ctx, rad - 4, -32 + bob, 8);
      }
    } else if (c === 'garnet') {
      if (this.attackType === 'J') {
        const punchX = 28 + strike * 26;
        if (combo === 0) {
          // Hit 1: Left Ruby Rocket Straight Jab!
          this.drawSpeedLines(ctx, 12, -50 + bob, punchX - 6, 16, 4, '#f87171');
          this.drawCrescentSlash(ctx, punchX - 10, -50 + bob, 22, -Math.PI * 0.4, Math.PI * 0.4, 'rgba(239, 68, 68, 0.45)', '#ef4444', '#fde047', 11);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, punchX + 12, -50 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Right Sapphire Rising Hook!
          this.drawCrescentSlash(ctx, punchX - 8, -46 + bob, 32, Math.PI * 0.42, -Math.PI * 0.48, 'rgba(56, 189, 248, 0.42)', '#0284c7', '#ffffff', 13);
          ctx.fillStyle = '#bae6fd';
          this.drawDiamondInsignia(ctx, punchX + 16, -54 + bob, 7.5);
        } else {
          // Hit 3: Twin-Gauntlet Overhead Meteor Smash (Ruby + Sapphire Fusion Impact)!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -42 + bob, 46 + strike * 8, -Math.PI * 0.65, Math.PI * 0.38, 'rgba(225, 29, 72, 0.45)', '#e11d48', '#fde047', 17);
          this.drawCrescentSlash(ctx, 24 + strike * 8, -42 + bob, 34 + strike * 6, -Math.PI * 0.55, Math.PI * 0.28, 'rgba(56, 189, 248, 0.4)', '#38bdf8', '#ffffff', 10);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, punchX + 22, -32 + bob, 10);
        }
      } else if (this.attackType === 'K') {
        // Rocket Gauntlet Launch Sonic Ring & Flame Jet!
        this.drawSpeedLines(ctx, 14, -48 + bob, 44, 18, 4, '#fbbf24');
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(34 + strike * 10, -48 + bob, 9, 22, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // High-Voltage Electro-Seismic Ground Shock!
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(12, -74 + bob); ctx.lineTo(26, -42 + bob); ctx.lineTo(18, -20 + bob); ctx.lineTo(42, 0);
        ctx.moveTo(-12, -68 + bob); ctx.lineTo(-24, -36 + bob); ctx.lineTo(-16, -18 + bob); ctx.lineTo(-36, 0);
        ctx.stroke();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(0, -2, 46 + strike * 12, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (c === 'amethyst') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: S-Curve Whip Crack + Sonic Tip Ring!
          this.drawCrescentSlash(ctx, 24 + strike * 10, -36 + bob, 38 + strike * 10, -Math.PI * 0.48, Math.PI * 0.38, 'rgba(192, 132, 252, 0.4)', '#a855f7', '#ffffff', 13);
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(54 + strike * 12, -26 + bob, 8 + strike * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 56 + strike * 12, -26 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Low-Sweeping Rising Whip Lash!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -24 + bob, 44 + strike * 10, Math.PI * 0.55, -Math.PI * 0.35, 'rgba(168, 85, 247, 0.42)', '#9333ea', '#fde047', 15);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 60 + strike * 10, -20 + bob, 8);
        } else {
          // Hit 3: Dual-Whip Twin X-Cleave!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 48 + strike * 10, -Math.PI * 0.58, Math.PI * 0.35, 'rgba(147, 51, 234, 0.45)', '#a855f7', '#ffffff', 15);
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 44 + strike * 8, Math.PI * 0.58, -Math.PI * 0.35, 'rgba(232, 121, 249, 0.4)', '#d946ef', '#fde047', 13);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 64 + strike * 12, -38 + bob, 10.5);
        }
      } else if (this.attackType === 'K') {
        // Purple Whirlwind Spin-Dash Launch!
        this.drawCrescentSlash(ctx, 4, -26 + bob, 36 + strike * 8, -Math.PI * 0.7, Math.PI * 0.8, 'rgba(192, 132, 252, 0.42)', '#a855f7', '#ffffff', 12);
      } else if (this.attackType === 'L') {
        // Violet Whip Geyser Ground Shockwave & Crystal Burst!
        this.drawCrescentSlash(ctx, 36 + strike * 8, -20 + bob, 38 + strike * 8, -Math.PI * 0.48, Math.PI * 0.48, 'rgba(192, 132, 252, 0.45)', '#9333ea', '#fde047', 15);
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 62 + strike * 8, -20 + bob, 10);
      }
    } else if (c === 'pearl') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Multi-Jab Holographic Fencing Flurry (3 rapid cyan-white needle cones)!
          const baseReach = 50 + strike * 24;
          const offsets = [
            { dy: 0, dx: 8, w: 5.5, col: '#ffffff' },
            { dy: -11, dx: -4, w: 4, col: '#67e8f9' },
            { dy: 10, dx: -2, w: 4, col: '#bae6fd' }
          ];
          this.drawSpeedLines(ctx, 18, -50 + bob, baseReach - 14, 22, 4, '#67e8f9');
          for (let j = 0; j < offsets.length; j++) {
            const o = offsets[j];
            const tx = baseReach + o.dx;
            const ty = -50 + bob + o.dy;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.beginPath();
            ctx.moveTo(22, ty - o.w);
            ctx.lineTo(tx, ty);
            ctx.lineTo(22, ty + o.w);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = o.col;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(24, ty);
            ctx.lineTo(tx + 3, ty);
            ctx.stroke();
          }
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, baseReach + 10, -50 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Graceful Two-Handed Halberd Crescent Sweep!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -46 + bob, 40 + strike * 10, -Math.PI * 0.55, Math.PI * 0.45, 'rgba(56, 189, 248, 0.4)', '#06b6d4', '#ffffff', 14);
          ctx.fillStyle = '#a5f3fc';
          this.drawMiniStar(ctx, 58 + strike * 10, -46 + bob, 7.5);
        } else {
          // Hit 3: 360-Degree Ballet Pirouette Spear Halo Ribbon!
          this.drawCrescentSlash(ctx, 14 + strike * 8, -48 + bob, 46 + strike * 8, -Math.PI * 0.85, Math.PI * 0.55, 'rgba(56, 189, 248, 0.42)', '#38bdf8', '#ffffff', 14);
          this.drawCrescentSlash(ctx, 14 + strike * 8, -48 + bob, 42 + strike * 6, Math.PI * 0.25, Math.PI * 1.55, 'rgba(253, 186, 116, 0.35)', '#fb923c', '#ffffff', 10);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 58 + strike * 10, -48 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Spear Plasma Laser Muzzle Burst!
        this.drawSpeedLines(ctx, 22, -50 + bob, 44, 16, 3, '#67e8f9');
        ctx.fillStyle = '#ffffff';
        this.drawMiniStar(ctx, 52 + strike * 8, -50 + bob, 8);
      } else if (this.attackType === 'L') {
        // Holo-Pearl Summoning Diamond Projection Grid!
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(38, -42 + bob, 28 + strike * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#bae6fd';
        this.drawDiamondInsignia(ctx, 38, -42 + bob, 11);
      }
    } else if (c === 'bismuth') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Spiked War-Hammer Heavy Forge Swing!
          this.drawCrescentSlash(ctx, 24 + strike * 8, -36 + bob, 38 + strike * 8, -Math.PI * 0.55, Math.PI * 0.30, 'rgba(249, 115, 22, 0.45)', '#f97316', '#fde047', 15);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 54 + strike * 8, -22 + bob, 7.5);
        } else if (combo === 1) {
          // Hit 2: Double Crescent Battle-Axe Cleave!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -38 + bob, 44 + strike * 10, -Math.PI * 0.60, Math.PI * 0.42, 'rgba(234, 88, 12, 0.48)', '#ea580c', '#ffffff', 17);
          ctx.fillStyle = '#fbbf24';
          this.drawMiniStar(ctx, 60 + strike * 10, -34 + bob, 8.5);
        } else {
          // Hit 3: Overhead Molten Anvil-Maul Tectonic Smash!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -34 + bob, 50 + strike * 10, -Math.PI * 0.72, Math.PI * 0.28, 'rgba(194, 65, 12, 0.52)', '#dc2626', '#fde047', 19);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(54 + strike * 8, -3, 24 + strike * 8, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 58 + strike * 10, -8 + bob, 11.5);
        }
      } else if (this.attackType === 'K') {
        // Forge Ingot Hurl Burst!
        this.drawSpeedLines(ctx, 16, -44 + bob, 42, 20, 4, '#fb923c');
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 48 + strike * 8, -44 + bob, 8);
      } else if (this.attackType === 'L') {
        // Breaking Point Armor-Piercing Pneumatic Shock-Cone!
        this.drawSpeedLines(ctx, 14, -42 + bob, 54, 24, 5, '#ef4444');
        ctx.fillStyle = 'rgba(239, 68, 68, 0.52)';
        ctx.beginPath();
        ctx.moveTo(22, -62 + bob);
        ctx.lineTo(72 + strike * 12, -42 + bob);
        ctx.lineTo(22, -22 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 68 + strike * 12, -42 + bob, 11);
      }
    } else if (c === 'peridot') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Triple Ferrokinetic Claw Rake (3 parallel lime-green tapered arcs)!
          for (let r = -1; r <= 1; r++) {
            this.drawCrescentSlash(ctx, 20 + strike * 8, -38 + bob + r * 9, 30 + strike * 6, -Math.PI * 0.42, Math.PI * 0.35, 'rgba(132, 204, 22, 0.35)', '#84cc16', '#ecfccb', 7);
          }
          ctx.fillStyle = '#bef264';
          this.drawMiniStar(ctx, 50 + strike * 8, -38 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Levitating Steel I-Beam Wide Magnetic Sweep!
          this.drawCrescentSlash(ctx, 24 + strike * 10, -38 + bob, 40 + strike * 8, Math.PI * 0.45, -Math.PI * 0.50, 'rgba(101, 163, 13, 0.42)', '#84cc16', '#ffffff', 14);
          ctx.fillStyle = '#fde047';
          this.drawDiamondInsignia(ctx, 56 + strike * 10, -48 + bob, 7.5);
        } else {
          // Hit 3: Magnetic Crusher Jaws Converging Pincer Arcs!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 40 + strike * 8, -Math.PI * 0.62, Math.PI * 0.12, 'rgba(132, 204, 22, 0.45)', '#65a30d', '#fde047', 13);
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 40 + strike * 8, Math.PI * 0.62, -Math.PI * 0.12, 'rgba(132, 204, 22, 0.45)', '#84cc16', '#ffffff', 13);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 62 + strike * 10, -38 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Magnetic Tractor Rings!
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.ellipse(32 + strike * 10, -38 + bob, 7, 18, 0, 0, Math.PI * 2);
        ctx.ellipse(46 + strike * 14, -38 + bob, 5, 13, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // EMP Magnetic Vortex Concentric Rings!
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(32, -36 + bob, 26 + strike * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ecfccb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, -36 + bob, 16 + strike * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 32, -36 + bob, 8.5);
      }
    } else if (c === 'lapis') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Crescent Hydro-Scythe Slash + Seafoam Spray!
          this.drawCrescentSlash(ctx, 22 + strike * 8, -40 + bob, 36 + strike * 8, -Math.PI * 0.48, Math.PI * 0.45, 'rgba(56, 189, 248, 0.45)', '#0284c7', '#e0f2fe', 14);
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(54 + strike * 10, -24 + bob, 3.2, 0, Math.PI * 2);
          ctx.arc(58 + strike * 10, -52 + bob, 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (combo === 1) {
          // Hit 2: Surging Giant Water Fist Rising Crest!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -44 + bob, 42 + strike * 8, Math.PI * 0.38, -Math.PI * 0.62, 'rgba(2, 132, 199, 0.48)', '#0ea5e9', '#ffffff', 16);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 58 + strike * 10, -56 + bob, 7.5);
        } else {
          // Hit 3: Coiling Dual Ocean Dragon Tendrils Smash!
          this.drawCrescentSlash(ctx, 30 + strike * 12, -36 + bob, 50 + strike * 10, -Math.PI * 0.58, Math.PI * 0.44, 'rgba(14, 165, 233, 0.5)', '#0369a1', '#e0f2fe', 18);
          this.drawCrescentSlash(ctx, 24 + strike * 8, -36 + bob, 36 + strike * 6, -Math.PI * 0.45, Math.PI * 0.35, 'rgba(125, 211, 252, 0.42)', '#38bdf8', '#ffffff', 11);
          ctx.fillStyle = '#e0f2fe';
          this.drawMiniStar(ctx, 68 + strike * 12, -36 + bob, 9.5);
        }
      } else if (this.attackType === 'K') {
        // Pressurized Hydro Jet Stream Lance!
        this.drawSpeedLines(ctx, 18, -42 + bob, 48, 16, 4, '#38bdf8');
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.ellipse(36 + strike * 10, -42 + bob, 7, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.attackType === 'L') {
        // Roaring Tsunami Wave Crest with Whitecap Foam!
        this.drawCrescentSlash(ctx, 34 + strike * 10, -36 + bob, 42 + strike * 8, -Math.PI * 0.48, Math.PI * 0.62, 'rgba(2, 132, 199, 0.52)', '#0284c7', '#ffffff', 18);
      }
    } else if (c === 'rose') {
      if (this.attackType === 'J') {
        if (combo === 0) {
          // Hit 1: Graceful Rose Broadsword Cleave + Drifting Petals!
          this.drawCrescentSlash(ctx, 22 + strike * 8, -42 + bob, 38 + strike * 8, -Math.PI * 0.52, Math.PI * 0.38, 'rgba(244, 63, 94, 0.4)', '#f43f5e', '#ffffff', 14);
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(52 + strike * 8, -28 + bob, 4.2, 2.2, 0.5, 0, Math.PI * 2);
          ctx.ellipse(46 + strike * 8, -58 + bob, 3.8, 2.0, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 54 + strike * 8, -38 + bob, 6.5);
        } else if (combo === 1) {
          // Hit 2: Valkyrie Thorny Shield Bash Shockwave!
          this.drawCrescentSlash(ctx, 26 + strike * 10, -40 + bob, 44 + strike * 8, -Math.PI * 0.45, Math.PI * 0.45, 'rgba(225, 29, 72, 0.45)', '#ec4899', '#ffffff', 16);
          ctx.fillStyle = '#fbcfe8';
          this.drawMiniStar(ctx, 60 + strike * 10, -40 + bob, 8);
        } else {
          // Hit 3: Celestial Rising Rose Vortex Cleave!
          this.drawCrescentSlash(ctx, 28 + strike * 10, -38 + bob, 50 + strike * 10, -Math.PI * 0.68, Math.PI * 0.38, 'rgba(219, 39, 119, 0.48)', '#f43f5e', '#ffffff', 18);
          this.drawCrescentSlash(ctx, 22 + strike * 8, -38 + bob, 36 + strike * 6, Math.PI * 0.42, -Math.PI * 0.55, 'rgba(251, 207, 232, 0.42)', '#f9a8d4', '#fde047', 11);
          ctx.fillStyle = '#ffffff';
          this.drawMiniStar(ctx, 66 + strike * 10, -32 + bob, 10);
          ctx.fillStyle = '#fde047';
          this.drawMiniStar(ctx, 48 + strike * 8, -68 + bob, 7.5);
        }
      } else if (this.attackType === 'K') {
        // Spiraling Rose Petal Wave Release!
        this.drawCrescentSlash(ctx, 26 + strike * 8, -42 + bob, 34 + strike * 6, -Math.PI * 0.5, Math.PI * 0.5, 'rgba(244, 114, 182, 0.4)', '#f43f5e', '#ffffff', 12);
      } else if (this.attackType === 'L') {
        // Sacred Healing Tears Divine Light Halo & Blooming Petals!
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.92)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -42 + bob, 44 + strike * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#fbcfe8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -42 + bob, 32 + strike * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        this.drawMiniStar(ctx, 0, -42 + bob, 9.5);
      }
    }

    ctx.restore();
  }
}

const EPISODE_WAVES = {
  1: {
    waves: [
      { enemies: ['centipeetle', 'centipeetle', 'centipeetle', 'centipeetle'] },
      { enemies: ['winged_centipeetle', 'acid_centipeetle', 'centipeetle', 'winged_centipeetle', 'centipeetle'] },
      { enemies: ['winged_centipeetle', 'acid_centipeetle', 'acid_centipeetle', 'centipeetle', 'centipeetle', 'winged_centipeetle'] },
      { isHugeWave: true, enemies: ['winged_centipeetle', 'winged_centipeetle', 'acid_centipeetle', 'acid_centipeetle', 'centipeetle', 'centipeetle', 'centipeetle', 'centipeetle'] }
    ],
    boss: 'boss_spitter',
    bossName: 'MOTHER CENTIPEETLE'
  },
  2: {
    waves: [
      { enemies: ['blade_quartz', 'blade_quartz', 'ice_monster', 'blade_quartz'] },
      { enemies: ['spire_harpy', 'blade_quartz', 'ice_monster', 'spire_harpy', 'blade_quartz'] },
      { enemies: ['spire_harpy', 'spire_harpy', 'blade_quartz', 'ice_monster', 'blade_quartz', 'spire_harpy'] },
      { isHugeWave: true, enemies: ['spire_harpy', 'spire_harpy', 'blade_quartz', 'blade_quartz', 'ice_monster', 'ice_monster', 'blade_quartz'] }
    ],
    boss: 'boss_ice_guardian',
    bossName: 'ANCIENT SPIRE GIANT BIRD'
  },
  3: {
    waves: [
      { enemies: ['cluster', 'cluster', 'blade_quartz', 'cluster'] },
      { enemies: ['cluster', 'blade_quartz', 'cluster', 'blade_quartz', 'cluster'] },
      { enemies: ['cluster', 'cluster', 'blade_quartz', 'blade_quartz', 'cluster', 'cluster'] },
      { isHugeWave: true, enemies: ['cluster', 'cluster', 'cluster', 'blade_quartz', 'blade_quartz', 'blade_quartz', 'cluster', 'cluster'] }
    ],
    boss: 'boss_cluster_titan',
    bossName: 'KINDERGARTEN AMALGAM TITAN'
  },
  4: {
    waves: [
      { enemies: ['cluster', 'cluster', 'acid_centipeetle', 'cluster'] },
      { enemies: ['volcanic_firebird', 'cluster', 'acid_centipeetle', 'volcanic_firebird', 'cluster'] },
      { enemies: ['volcanic_firebird', 'cluster', 'cluster', 'acid_centipeetle', 'cluster', 'volcanic_firebird'] },
      { isHugeWave: true, enemies: ['volcanic_firebird', 'volcanic_firebird', 'cluster', 'cluster', 'acid_centipeetle', 'cluster', 'cluster'] }
    ],
    boss: 'boss_cluster_core',
    bossName: 'GEO-WEAPON CLUSTER CORE'
  },
  5: {
    waves: [
      { enemies: ['forge_automaton', 'forge_automaton', 'blade_quartz', 'forge_automaton'] },
      { enemies: ['forge_automaton', 'blade_quartz', 'destabilizer_soldier', 'forge_automaton', 'blade_quartz'] },
      { enemies: ['destabilizer_soldier', 'forge_automaton', 'blade_quartz', 'destabilizer_soldier', 'forge_automaton'] },
      { isHugeWave: true, enemies: ['forge_automaton', 'forge_automaton', 'destabilizer_soldier', 'destabilizer_soldier', 'blade_quartz', 'blade_quartz', 'forge_automaton'] }
    ],
    boss: 'boss_forge_guardian',
    bossName: 'ANCIENT FORGE SENTINEL'
  },
  6: {
    waves: [
      { enemies: ['ice_monster', 'ice_monster', 'blade_quartz', 'ice_monster'] },
      { enemies: ['ice_gargoyle', 'ice_monster', 'blade_quartz', 'ice_gargoyle', 'ice_monster'] },
      { enemies: ['ice_gargoyle', 'ice_monster', 'blade_quartz', 'ice_gargoyle', 'blade_quartz', 'ice_monster'] },
      { isHugeWave: true, enemies: ['ice_gargoyle', 'ice_gargoyle', 'ice_monster', 'ice_monster', 'blade_quartz', 'blade_quartz', 'ice_monster'] }
    ],
    boss: 'boss_jasper',
    bossName: 'CORRUPTED JASPER & SNOW TITAN'
  },
  7: {
    waves: [
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'blade_quartz', 'robonoid_scout'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'blade_quartz'] },
      { isHugeWave: true, enemies: ['robonoid_scout', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'destabilizer_soldier', 'blade_quartz'] }
    ],
    boss: 'boss_agate_warden',
    bossName: 'HOLY BLUE AGATE WARDEN'
  },
  8: {
    waves: [
      { enemies: ['destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'robonoid_scout'] },
      { enemies: ['destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier'] },
      { isHugeWave: true, enemies: ['destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier'] }
    ],
    boss: 'boss_topaz_fusion',
    bossName: 'FUSED TOPAZ ENFORCER'
  },
  9: {
    waves: [
      { enemies: ['destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'robonoid_scout'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'blade_quartz'] },
      { isHugeWave: true, enemies: ['robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'robonoid_scout'] }
    ],
    boss: 'boss_robonoid_titan',
    bossName: 'ROBONOID HUNTER COLOSSUS'
  },
  10: {
    waves: [
      { enemies: ['destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier', 'blade_quartz'] },
      { enemies: ['robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'robonoid_scout', 'destabilizer_soldier'] },
      { isHugeWave: true, enemies: ['robonoid_scout', 'robonoid_scout', 'robonoid_scout', 'destabilizer_soldier', 'destabilizer_soldier', 'destabilizer_soldier', 'blade_quartz', 'blade_quartz'] }
    ],
    boss: 'boss_white_diamond',
    bossName: 'WHITE DIAMOND SUPREME MECHA'
  }
};

// ============================================================================
// 5. AUTHENTIC CORRUPTED GEMS & MONSTER MANAGER
// ============================================================================
// ============================================================================
// FREEBUFF ENEMY AI — readable telegraphs, spacing roles and attack slots
// ============================================================================
// Ranged = units that genuinely fight from beyond melee reach (ground spitters, aerial monsters).
// Brawlers (centipeetles, robonoids, destabilizer lancers) press in like in the original, keeping acid as a close-range bonus shot.
const ENEMY_RANGED_TYPES = new Set([
  'ice_monster',
  'winged_centipeetle', 'spire_harpy', 'volcanic_firebird', 'ice_gargoyle',
  'boss_spitter', 'boss_cluster_titan', 'boss_ice_guardian',
  'boss_cluster_core', 'boss_topaz_fusion'
]);

// Per-type preferred standoff distance (px). Brawlers sit inside the player's attack reach.
const ENEMY_PREFERRED_RANGE = {
  centipeetle: 48,
  acid_centipeetle: 48,
  robonoid_scout: 46,
  destabilizer_soldier: 48,
  blade_quartz: 50,
  cluster: 46,
  ice_monster: 105,
  winged_centipeetle: 130,
  spire_harpy: 140,
  volcanic_firebird: 140,
  ice_gargoyle: 120
};

const ENEMY_TELEGRAPH_BASE = {
  centipeetle: 0.46,
  acid_centipeetle: 0.44,
  blade_quartz: 0.52,
  cluster: 0.42,
  ice_monster: 0.48,
  robonoid_scout: 0.40,
  destabilizer_soldier: 0.44,
  winged_centipeetle: 0.42,
  spire_harpy: 0.40,
  volcanic_firebird: 0.44,
  ice_gargoyle: 0.46,
  forge_automaton: 0.58
};

class EnemyManager {
  constructor(groundY, stageWidth = 2600) {
    this.groundY = (typeof groundY === 'number' && !isNaN(groundY) && groundY > 0) ? groundY : 600;
    this.stageWidth = stageWidth;
    this.enemies = [];
    this.droppedGems = [];
    this.wave = 1;
    this.maxWaves = 4;
    this.waveState = 'active';
    this.spawnTimer = 0;
    this.isBossAlive = false;
    this.bossDefeated = false;
    this.pickupsRef = null;
    this.dropRate = 0.38;
    this.hpMult = 1.0;
    this.speedMult = 1.0;

    // Freebuff AI/difficulty knobs (populated by reset from DIFFICULTY_CONFIG)
    this.stageHpScale = 1.0;
    this.telegraphMult = 1.0;
    this.maxAttackers = 2;
    this.evasionChance = 0;
    this.eliteChance = 0;
    this.aggression = 1.0;

    // Plants vs Zombies Wave Progression Trackers
    this.stageIndex = 1;
    this.totalStageEnemies = 20;
    this.enemiesDefeatedInStage = 0;
    this.waveQueue = [];
    this.waveTimer = 0;

    // Offscreen scratch canvas for silhouette-masked hit flash & poofing
    this.flashCanvas = null;
    this.flashCtx = null;
    if (typeof document !== 'undefined') {
      try {
        this.flashCanvas = document.createElement('canvas');
        this.flashCanvas.width = 640;
        this.flashCanvas.height = 640;
        this.flashCtx = this.flashCanvas.getContext('2d');
      } catch (err) {
        this.flashCanvas = null;
        this.flashCtx = null;
      }
    }
  }

  reset(stageIndex, difficultyConfig = null, pickupsRef = null) {
    this.stageIndex = stageIndex;
    this.enemies = [];
    this.droppedGems = [];
    this.wave = 1;
    this.maxWaves = 4;
    this.waveState = 'active';
    this.spawnTimer = 0;
    this.isBossAlive = false;
    this.bossDefeated = false;
    this.pickupsRef = pickupsRef;
    this.enemiesDefeatedInStage = 0;

    if (difficultyConfig) {
      this.dropRate = difficultyConfig.cookieDropRate ?? difficultyConfig.dropRate ?? 0.38;
      this.hpMult = difficultyConfig.enemyHpMultiplier ?? difficultyConfig.enemyHpMult ?? 1.0;
      this.speedMult = difficultyConfig.enemySpeedMult || 1.0;

      // Freebuff difficulty dimensions beyond raw HP/speed
      this.telegraphMult = difficultyConfig.enemyTelegraphMult ?? 1.0;
      this.maxAttackers = difficultyConfig.maxConcurrentAttackers ?? 2;
      this.evasionChance = difficultyConfig.enemyEvasion ?? 0;
      this.eliteChance = difficultyConfig.eliteChance ?? 0;
      this.aggression = difficultyConfig.enemyAggression ?? 1.0;

      // Escalation knobs added with the harder difficulty pass
      this.cooldownMult = difficultyConfig.attackCooldownMult ?? 1.0;
      this.waveBonus = difficultyConfig.waveSizeBonus ?? 0;
      this.bossHpMult = difficultyConfig.bossHpMult ?? 1.0;
      this.eliteHpMult = difficultyConfig.eliteHpMult ?? 1.6;
      this.stageHeal = difficultyConfig.stageHeal ?? -1;
      this.knockbackResist = difficultyConfig.knockbackResist ?? 0;
    }
    // Later episodes quietly raise enemy durability so the curve keeps climbing
    this.stageHpScale = 1 + Math.max(0, stageIndex - 1) * 0.035;

    if (stageIndex > 0 && EPISODE_WAVES[stageIndex]) {
      const epData = EPISODE_WAVES[stageIndex];
      let totalEnemies = 1; // plus boss
      epData.waves.forEach(w => { totalEnemies += w.enemies.length; });
      this.totalStageEnemies = totalEnemies;
    } else {
      this.totalStageEnemies = 1;
    }
  }

  getProgressPercent() {
    if (this.stageIndex === 0) return 100;
    if (this.totalStageEnemies <= 0) return 0;
    return Math.min(100, Math.round((this.enemiesDefeatedInStage / this.totalStageEnemies) * 100));
  }

  spawnDummy(x = 1300) {
    this.enemies = [{
      type: 'boss_jasper_dummy',
      name: 'HOLO-JASPER (TRAINING DUMMY)',
      x,
      y: this.groundY,
      vx: 0,
      vy: 0,
      facing: -1,
      width: 72,
      height: 84,
      hp: 99999,
      maxHp: 99999,
      speed: 0,
      attackCooldown: 9999,
      attackTimer: 0,
      hurtTimer: 0,
      isBoss: true,
      isImmortalDummy: true,
      gemColor: '#f97316',
      gemShape: 'jasper_nose',
      animTime: 0
    }];
    this.isBossAlive = true;
    this.bossDefeated = false;
  }

  spawnEnemy(type, x = 1200, customY = null) {
    const isBoss = type.startsWith('boss_');
    const isFlyer = (type.includes('wing') || type.includes('harpy') || type.includes('bird') || type.includes('gargoyle') || type.includes('scout') || type.includes('drone') || type === 'boss_giant_bird' || type === 'boss_cluster_core' || type === 'boss_white_diamond');
    const isJumper = (type === 'cluster' || type === 'blade_quartz' || type === 'acid_centipeetle' || type === 'snow_monster' || type === 'carnelian_enforcer' || type === 'boss_jasper' || type === 'boss_cluster_titan');

    const movementType = isFlyer ? 'fly' : (isJumper ? 'jump' : 'walk');
    const initialY = customY !== null ? customY : (isFlyer ? (210 + Math.random() * 80) : this.groundY);

    const enemy = {
      type,
      x,
      y: initialY,
      vx: 0,
      vy: 0,
      facing: -1,
      width: 46,
      height: 52,
      hp: 50,
      maxHp: 50,
      speed: 120,
      attackCooldown: 1.6,
      attackTimer: 0,
      hurtTimer: 0,
      movementType,
      isBoss,
      flyAltitude: isFlyer ? initialY : null,
      jumpCooldown: isJumper ? (1.5 + Math.random() * 1.5) : null,
      name: 'Corrupted Gem',
      animTime: Math.random() * 10
    };

    if (type === 'centipeetle') {
      enemy.hp = Math.round(50 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(130 * this.speedMult);
      enemy.gemColor = '#22c55e';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Centipeetle Hatchling';
    } else if (type === 'acid_centipeetle') {
      enemy.hp = Math.round(45 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(140 * this.speedMult);
      enemy.gemColor = '#4ade80';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Acid Centipeetle';
    } else if (type === 'blade_quartz') {
      enemy.hp = Math.round(90 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(95 * this.speedMult);
      enemy.width = 68;
      enemy.height = 58;
      enemy.gemColor = '#f43f5e';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Blade Quartz Beast';
    } else if (type === 'cluster') {
      enemy.hp = Math.round(65 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(120 * this.speedMult);
      enemy.gemColor = '#c084fc';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'Cluster Fusion Mutant';
    } else if (type === 'ice_monster') {
      enemy.hp = Math.round(85 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 54;
      enemy.height = 58;
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Ice Spire Puffer';
    } else if (type === 'boss_spitter') {
      enemy.hp = Math.round(350 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(95 * this.speedMult);
      enemy.width = 90;
      enemy.height = 80;
      enemy.gemColor = '#15803d';
      enemy.gemShape = 'centipeetle_mother';
      enemy.name = 'Alpha Centipeetle Leader';
      this.isBossAlive = true;
    } else if (type === 'boss_quartz_beast') {
      enemy.hp = Math.round(550 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(105 * this.speedMult);
      enemy.width = 130;
      enemy.height = 110;
      enemy.gemColor = '#0284c7';
      enemy.gemShape = 'ocean_jasper';
      enemy.name = 'Corrupted Quartz Titan';
      this.isBossAlive = true;
    } else if (type === 'boss_cluster_titan') {
      enemy.hp = Math.round(650 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(115 * this.speedMult);
      enemy.width = 110;
      enemy.height = 115;
      enemy.gemColor = '#9333ea';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'Kindergarten Amalgam Titan';
      this.isBossAlive = true;
    } else if (type === 'boss_ice_guardian') {
      enemy.hp = Math.round(750 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(110 * this.speedMult);
      enemy.width = 120;
      enemy.height = 120;
      enemy.gemColor = '#0284c7';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Ancient Spire Colossus';
      this.isBossAlive = true;
    } else if (type === 'boss_jasper') {
      enemy.hp = Math.round(1200 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(140 * this.speedMult);
      enemy.width = 100;
      enemy.height = 105;
      enemy.gemColor = '#ea580c';
      enemy.gemShape = 'jasper_diamond';
      enemy.name = 'CORRUPTED JASPER & SNOW TITAN';
      this.isBossAlive = true;
    } else if (type === 'boss_cluster_core') {
      enemy.hp = Math.round(850 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(85 * this.speedMult);
      enemy.width = 110;
      enemy.height = 110;
      enemy.gemColor = '#c084fc';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'GEO-WEAPON CLUSTER CORE';
      this.isBossAlive = true;
    } else if (type === 'boss_forge_guardian') {
      enemy.hp = Math.round(950 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 115;
      enemy.height = 115;
      enemy.gemColor = '#ea580c';
      enemy.gemShape = 'teardrop';
      enemy.name = 'ANCIENT FORGE SENTINEL';
      this.isBossAlive = true;
    } else if (type === 'boss_agate_warden') {
      enemy.hp = Math.round(1050 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(115 * this.speedMult);
      enemy.width = 90;
      enemy.height = 100;
      enemy.gemColor = '#0284c7';
      enemy.gemShape = 'ocean_jasper';
      enemy.name = 'HOLY BLUE AGATE WARDEN';
      this.isBossAlive = true;
    } else if (type === 'boss_topaz_fusion') {
      enemy.hp = Math.round(1200 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(95 * this.speedMult);
      enemy.width = 110;
      enemy.height = 110;
      enemy.gemColor = '#fbbf24';
      enemy.gemShape = 'cluster_shard';
      enemy.name = 'FUSED TOPAZ ENFORCER';
      this.isBossAlive = true;
    } else if (type === 'boss_robonoid_titan') {
      enemy.hp = Math.round(1350 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(100 * this.speedMult);
      enemy.width = 120;
      enemy.height = 115;
      enemy.gemColor = '#10b981';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'ROBONOID HUNTER COLOSSUS';
      this.isBossAlive = true;
    } else if (type === 'boss_white_diamond') {
      // Grand Climax Supreme Boss (Era 3 Healing & Peace)
      enemy.hp = Math.round(1800 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(85 * this.speedMult);
      enemy.width = 140;
      enemy.height = 140;
      enemy.gemColor = '#ffffff';
      enemy.gemShape = 'jasper_diamond';
      enemy.name = 'WHITE DIAMOND SUPREME MECHA';
      this.isBossAlive = true;
    } else if (type === 'robonoid_scout') {
      enemy.hp = Math.round(55 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(135 * this.speedMult);
      enemy.gemColor = '#84cc16';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Flask Robonoid Scout';
    } else if (type === 'forge_automaton') {
      enemy.hp = Math.round(75 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(110 * this.speedMult);
      enemy.gemColor = '#f97316';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Forge Automaton';
    } else if (type === 'destabilizer_soldier') {
      enemy.hp = Math.round(80 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(125 * this.speedMult);
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Destabilizer Guard';
    } else if (type === 'winged_centipeetle') {
      // Lore: Aerial winged spitters from Gem Glow
      enemy.hp = Math.round(45 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(145 * this.speedMult);
      enemy.width = 48;
      enemy.height = 42;
      enemy.gemColor = '#22c55e';
      enemy.gemShape = 'centipeetle';
      enemy.name = 'Winged Centipeetle';
    } else if (type === 'spire_harpy') {
      // Lore: Celestial Spire winged corrupted gem
      enemy.hp = Math.round(60 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(150 * this.speedMult);
      enemy.width = 54;
      enemy.height = 46;
      enemy.gemColor = '#06b6d4';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Spire Harpy';
    } else if (type === 'volcanic_firebird') {
      // Lore: Magma mantle flying corruption
      enemy.hp = Math.round(65 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(140 * this.speedMult);
      enemy.width = 52;
      enemy.height = 44;
      enemy.gemColor = '#f97316';
      enemy.gemShape = 'teardrop';
      enemy.name = 'Volcanic Firebird';
    } else if (type === 'ice_gargoyle') {
      // Lore: Glacial northern tundra flying gargoyle
      enemy.hp = Math.round(70 * this.hpMult);
      enemy.maxHp = enemy.hp;
      enemy.speed = Math.round(135 * this.speedMult);
      enemy.width = 56;
      enemy.height = 48;
      enemy.gemColor = '#38bdf8';
      enemy.gemShape = 'ice_prism';
      enemy.name = 'Glacial Ice Gargoyle';
    }

    // --- Freebuff AI profile: combat role, telegraph length, elite & stage scaling ---
    const ranged = ENEMY_RANGED_TYPES.has(type);
    enemy.hasRanged = ranged;
    // Gem combat typing (drives the Pokémon-style damage chart)
    enemy.types = (ENEMY_TYPES[type] || ['dark']).slice();
    enemy.vulnMult = 1;
    enemy.vulnTimer = 0;

    // Standoff: per-type map first (brawler vs spitter/flyer), bosses hold mid-arena range,
    // generic ranged fallback 95 / melee fallback 48 (both within the player's attack reach).
    enemy.preferredRange = isBoss ? 90 : (ENEMY_PREFERRED_RANGE[type] ?? (ranged ? 95 : 48));
    enemy.attackRange = isBoss ? 520 : (ranged ? 300 : 150);
    enemy.attackCooldown = (isBoss ? 2.0 : (ranged ? 1.7 : 1.55)) * (this.cooldownMult || 1.0);
    enemy.windup = 0;
    enemy.windupMax = 0;
    enemy.aiState = 'approach';
    enemy.evasionCooldown = 0;
    enemy.isElite = false;
    enemy.phase2 = false;

    // Elite corrupted gems: rarer, gold-tinged, tougher versions at higher difficulty
    if (!isBoss && this.eliteChance > 0 && Math.random() < this.eliteChance * (1 + (this.wave - 1) * 0.12)) {
      enemy.isElite = true;
      const eliteMult = this.eliteHpMult || 1.6;
      enemy.hp = Math.round(enemy.hp * eliteMult);
      enemy.maxHp = Math.round(enemy.maxHp * eliteMult);
      enemy.speed = Math.round(enemy.speed * 1.08);
      enemy.name = `Elite ${enemy.name}`;
      enemy.gemColor = '#fbbf24';
    }

    // Difficulty tier boss durability
    if (isBoss && this.bossHpMult && this.bossHpMult !== 1) {
      enemy.hp = Math.round(enemy.hp * this.bossHpMult);
      enemy.maxHp = Math.round(enemy.maxHp * this.bossHpMult);
    }

    // Later episodes creep upward in durability (bosses scale at half rate)
    const hpScale = isBoss ? Math.min(1.22, this.stageHpScale || 1) : (this.stageHpScale || 1);
    if (hpScale !== 1) {
      enemy.hp = Math.round(enemy.hp * hpScale);
      enemy.maxHp = Math.round(enemy.maxHp * hpScale);
    }

    enemy.baseSpeed = enemy.speed;
    this.enemies.push(enemy);
    return enemy;
  }

  update(dt, player, audioEngine, particles, projectiles, onPoofed, platforms = [], player2 = null) {
    // Top-Center Boss Bar Synchronization (Cached DOM references for zero frame hitches)
    if (!this.domBoss && typeof document !== 'undefined') {
      this.domBoss = {
        hud: document.getElementById('bossHud'),
        name: document.getElementById('bossName'),
        digits: document.getElementById('bossHpDigits'),
        fill: document.getElementById('bossHpFill')
      };
    }
    const d = this.domBoss;
    const activeBoss = this.enemies.find(en => en.isBoss);

    if (activeBoss && d && d.hud) {
      if (d.hud.style.display !== 'flex') d.hud.style.display = 'flex';
      const curHp = activeBoss.hp;
      if (this._lastBossHp !== curHp || this._lastBossName !== activeBoss.name) {
        this._lastBossHp = curHp;
        this._lastBossName = activeBoss.name;
        if (d.name) d.name.textContent = activeBoss.name;
        if (d.digits) d.digits.textContent = activeBoss.isImmortalDummy ? 'INFINITE / INFINITE' : `${Math.max(0, Math.ceil(curHp))} / ${activeBoss.maxHp}`;
        if (d.fill) {
          const pct = activeBoss.isImmortalDummy ? 100 : Math.max(0, (curHp / activeBoss.maxHp) * 100);
          d.fill.style.width = `${pct}%`;
        }
      }
    } else if (d && d.hud && d.hud.style.display !== 'none') {
      d.hud.style.display = 'none';
      this._lastBossHp = null;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.isPoofed) {
        this.enemies.splice(i, 1);
        continue;
      }
      if (e.isPoofing) {
        e.poofTimer -= dt;
        e.vx *= 0.8;
        e.vy *= 0.8;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (e.poofTimer <= 0) {
          e.isPoofing = false;
          e.isPoofed = true;
          this.poofEnemy(e, i, particles, audioEngine, onPoofed);
          this.enemies.splice(i, 1);
        }
        continue;
      }
      e.animTime += dt;
      if (e.hurtTimer > 0) e.hurtTimer -= dt;

      // --- GEM COMBAT TYPE STATUSES ----------------------------------------
      if (e.vulnTimer > 0) { e.vulnTimer -= dt; if (e.vulnTimer <= 0) e.vulnMult = 1; }
      if (e.charmTimer > 0) e.charmTimer -= dt;
      if (e.dazeTimer > 0) { e.dazeTimer -= dt; e.windup = 0; }
      if (e.stunTimer > 0) {
        e.stunTimer -= dt;
        e.hurtTimer = Math.max(e.hurtTimer, 0.16);
        e.vx *= 0.85;
        if (e.stunTimer <= 0) e.attackTimer = 0;
      }
      // Lapis waterlogging: a soaked corruption moves at 72% speed while it dries
      if (e.soakTimer > 0) {
        e.soakTimer -= dt;
        e.speed = (e.baseSpeed ?? e.speed) * 0.72;
      } else if (e.baseSpeed !== undefined && e.speed !== e.baseSpeed) {
        e.speed = e.baseSpeed;
      }
      // Bismuth / Firebird scorch: burns for 3% max HP per second
      if (e.scorchTimer > 0 && !e.isImmortalDummy) {
        e.scorchTimer -= dt;
        e.hp -= e.maxHp * 0.03 * dt;
        if (Math.random() < dt * 6) {
          particles.addSparkle(e.x + (Math.random() * 18 - 9), e.y - e.height * (0.35 + Math.random() * 0.4), '#f97316', 2, 2);
        }
        if (e.hp <= 0 && !e.isPoofed) {
          e.isPoofed = true;
          this.poofEnemy(e, i, particles, audioEngine, onPoofed);
          continue;
        }
      }

      // Freebuff: clean hits interrupt a wind-up, rewarding aggressive play
      if (e.hurtTimer > 0 && e.windup > 0) {
        e.windup = 0;
        e.aiState = 'staggered';
      }

      // Boss phase 2 at half health: shorter telegraphs, faster cadence, shockwave burst
      if (e.isBoss && !e.isImmortalDummy && !e.phase2 && e.hp <= e.maxHp * 0.5) {
        e.phase2 = true;
        e.attackCooldown = Math.max(0.9, e.attackCooldown * 0.78);
        e.speed *= 1.12;
        e.windup = 0;
        audioEngine.playSfx('overdrive');
        particles.addDamageText(e.x, e.y - e.height - 30, '⚡ ENRAGED — PHASE 2! ⚡', true, '#ef4444');
        for (const dir of [-1, 1]) {
          projectiles.push({
            x: e.x + dir * 60,
            y: this.groundY - 30,
            vx: dir * 420,
            width: 160,
            height: 40,
            radius: 40,
            damage: 1,
            type: 'enemyShockwave',
            color: '#ef4444',
            life: 0.5
          });
        }
      }

      // Target closest living player in 2-Player mode (ignore fallen heroes!)
      let targetPlayer = player;
      if (player2) {
        if (!player.isFallen && !player2.isFallen) {
          targetPlayer = (Math.abs(player.x - e.x) < Math.abs(player2.x - e.x)) ? player : player2;
        } else if (player.isFallen && !player2.isFallen) {
          targetPlayer = player2;
        } else if (!player.isFallen && player2.isFallen) {
          targetPlayer = player;
        }
      }
      const dx = targetPlayer.x - e.x;
      const dy = targetPlayer.y - e.y;
      e.facing = dx >= 0 ? 1 : -1;

      if (e.movementType === 'fly') {
        // --- 1. FLYING CORRUPTED GEM (2D Aerial Cruising & Divebombs) ---
        e.flyAltitude = e.flyAltitude || (210 + Math.random() * 80);
        const hoverWave = Math.sin(e.animTime * 2.8 + e.x * 0.01) * 35;
        let targetY = e.flyAltitude + hoverWave;

        // Swoop only for pure melee flyers; ranged flyers hold altitude and fire
        if (!e.hasRanged && Math.abs(dx) < 180 && e.hurtTimer <= 0) {
          targetY = targetPlayer.y - 30;
        }

        e.y += (targetY - e.y) * dt * 2.2;

        if (e.hurtTimer <= 0) {
          const gap = Math.abs(dx);
          const pref = e.preferredRange || 180;
          const flySpeed = e.speed * (e.windup > 0 ? 0.25 : 0.9);
          if (gap > pref + 24) e.vx = e.facing * flySpeed;
          else if (gap < pref - 34) e.vx = -e.facing * flySpeed;
          else e.vx *= 0.9;
        } else {
          e.vx *= 0.94;
        }
        e.x += e.vx * dt;

      } else if (e.movementType === 'jump') {
        // --- 2. JUMPING CORRUPTED GEM (Pounces & Platform Leaping) ---
        if (e.hurtTimer <= 0) {
          const gap = Math.abs(dx);
          const pref = e.preferredRange || 70;
          const jumpSpeed = e.speed * (e.windup > 0 ? 0.3 : 1);
          if (gap > pref + 20) e.vx = e.facing * jumpSpeed;
          else if (gap < pref - 30) e.vx = -e.facing * jumpSpeed * 0.8;
          else e.vx = 0;

          // Leap onto platforms if player is above, or pounce forward
          e.jumpCooldown = (e.jumpCooldown || 2.0) - dt;
          const isGrounded = (e.y >= this.groundY || e.currentPlatform);
          const shouldJump = isGrounded && e.jumpCooldown <= 0 && ((targetPlayer.y < e.y - 50) || (Math.abs(dx) > 140 && Math.abs(dx) < 320 && Math.random() < 0.6));
          if (shouldJump) {
            e.vy = -620; // Agile leap to reach elevated platforms
            e.vx = e.facing * (e.speed * 1.5);
            e.isGrounded = false;
            e.currentPlatform = null;
            e.jumpCooldown = 2.4 + Math.random() * 1.2;
            if (particles) particles.addSparkle(e.x, e.y - 15, e.gemColor || '#c084fc', 8, 3);
          }
        } else {
          e.vx *= 0.94;
        }
        e.x += e.vx * dt;

        // Gravity & Platform physics
        const prevEy = e.y;
        e.y += e.vy * dt;
        e.vy += 1200 * dt;

        // Land on platforms
        if (platforms && platforms.length > 0 && e.vy >= 0) {
          for (const plat of platforms) {
            if (e.x >= plat.x - 14 && e.x <= plat.x + plat.width + 14) {
              if (prevEy <= plat.y + 6 && e.y >= plat.y) {
                e.y = plat.y;
                e.vy = 0;
                e.currentPlatform = plat;
                break;
              }
            }
          }
        }

        if (e.y >= this.groundY) {
          e.y = this.groundY;
          e.vy = 0;
          e.currentPlatform = null;
        }

      } else {
        // --- 3. GROUND & PLATFORM WALKER ---
        if (e.hurtTimer <= 0) {
          const gap = Math.abs(dx);
          const pref = e.preferredRange || 60;
          const walkSpeed = e.speed * (e.windup > 0 ? 0.3 : 1);
          // Ranged units keep their distance; melee units press in to the player's reach
          if (gap > pref + 14) e.vx = e.facing * walkSpeed;
          else if (gap < pref - 22) e.vx = -e.facing * walkSpeed * 0.85;
          else e.vx = 0;
        } else {
          e.vx *= 0.94;
        }
        e.x += e.vx * dt;

        const prevEy = e.y;
        e.y += e.vy * dt;
        e.vy += 1200 * dt;

        if (platforms && platforms.length > 0 && e.vy >= 0) {
          for (const plat of platforms) {
            if (e.x >= plat.x - 14 && e.x <= plat.x + plat.width + 14) {
              if (prevEy <= plat.y + 6 && e.y >= plat.y) {
                e.y = plat.y;
                e.vy = 0;
                e.currentPlatform = plat;
                break;
              }
            }
          }
        }

        if (e.y >= this.groundY) {
          e.y = this.groundY;
          e.vy = 0;
          e.currentPlatform = null;
        }
      }

      // Keep enemies safely inside wide arena bounds (2600px)
      const maxX = this.stageWidth || 2600;
      if (e.x < 45) { e.x = 45; e.vx = Math.abs(e.vx) * 0.3; }
      if (e.x > maxX - 45) { e.x = maxX - 45; e.vx = -Math.abs(e.vx) * 0.3; }

      e.attackTimer += dt;

      const gapNow = Math.abs(dx);
      const inRange = gapNow < (e.attackRange || 280) && Math.abs(dy) < 280;
      const charmFactor = (e.charmTimer > 0) ? 1.45 : 1.0;
      const readyToFire = e.hurtTimer <= 0 && inRange && e.attackTimer >= ((e.attackCooldown * charmFactor) / (this.aggression || 1));

      if (e.windup > 0) {
        // Telegraph window: readable, dodgeable and interruptible
        e.windup -= dt;
        if (e.windup <= 0) {
          e.windup = 0;
          e.attackTimer = 0;
          e.aiState = 'recover';
          this.executeEnemyAttack(e, targetPlayer, projectiles, audioEngine, particles);
          if (particles) particles.addSparkle(e.x + e.facing * 24, e.y - 30, e.gemColor || '#ef4444', 10, 4);
        }
      } else if (readyToFire) {
        const committed = this.enemies.reduce((n, other) => n + (other.windup > 0 ? 1 : 0), 0);
        const hasSlot = e.isBoss || committed < (this.maxAttackers || 2);
        if (hasSlot) {
          e.windup = this.getEnemyTelegraph(e);
          e.windupMax = e.windup;
          e.aiState = 'windup';
          if (particles) particles.addDamageText(e.x, e.y - e.height - 26, '!', true, '#ef4444');
        } else {
          // No attack slot: hold fire instead of forming a firing squad
          e.attackTimer = Math.max(0, e.attackCooldown / (this.aggression || 1) - 0.25);
        }
      }

      // Difficulty-scaled evasion: back-hop out of melee pressure
      e.evasionCooldown = Math.max(0, (e.evasionCooldown || 0) - dt);
      if (!e.isBoss && this.evasionChance > 0 && e.evasionCooldown <= 0 && e.windup <= 0 && e.hurtTimer <= 0 && player.isAttacking) {
        if (Math.abs(player.x - e.x) < 135 && Math.random() < this.evasionChance) {
          e.evasionCooldown = 2.2;
          e.vx = -e.facing * 300;
          e.vy = -380;
          e.isGrounded = false;
          if (particles) particles.addDamageText(e.x, e.y - e.height - 18, 'DODGE!', false, '#a5f3fc');
        }
      }

      this.checkPlayerAttackCollisions(e, player, projectiles, particles, audioEngine, onPoofed, i);
      if (!e.isPoofed && player2) {
        this.checkPlayerAttackCollisions(e, player2, [], particles, audioEngine, onPoofed, i);
      }
    }

    // Dropped Gemstones
    for (let i = this.droppedGems.length - 1; i >= 0; i--) {
      const g = this.droppedGems[i];
      g.life -= dt;
      g.sparkleTimer += dt;
      if (g.sparkleTimer >= 0.25) {
        g.sparkleTimer = 0;
        particles.addSparkle(g.x, g.y, g.color, 3, 1);
      }
      if (g.life <= 0) {
        this.droppedGems.splice(i, 1);
      }
    }
  }

  getEnemyTelegraph(e) {
    const base = e.isBoss ? 0.70 : (ENEMY_TELEGRAPH_BASE[e.type] ?? 0.50);
    const phaseScale = e.phase2 ? 0.8 : 1.0;
    return Math.max(0.22, base * (this.telegraphMult || 1) * phaseScale);
  }

  executeEnemyAttack(e, player, projectiles, audioEngine, particles) {
    if (e.type === 'centipeetle' || e.type === 'acid_centipeetle') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 24,
        y: e.y - 28,
        vx: e.facing * 330,
        vy: 0,
        radius: 9,
        damage: 1,
        type: 'enemyAcid',
        color: '#22c55e',
        life: 1.5
      });
      particles.addSparkle(e.x + e.facing * 24, e.y - 28, '#4ade80', 6, 2);
    } else if (e.type === 'blade_quartz') {
      audioEngine.playSfx('hit');
      projectiles.push({
        x: e.x + e.facing * 30,
        y: e.y - 30,
        vx: e.facing * 380,
        vy: 0,
        radius: 12,
        damage: 1,
        type: 'enemyShard',
        color: '#f43f5e',
        life: 1.4
      });
    } else if (e.type === 'cluster') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 360;
    } else if (e.type === 'ice_monster') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 28,
        y: e.y - 32,
        vx: e.facing * 350,
        vy: 0,
        radius: 11,
        damage: 1,
        type: 'enemyIce',
        color: '#38bdf8',
        life: 1.5
      });
    } else if (e.type === 'winged_centipeetle') {
      // Aerial spitter: diving acid glob
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 20,
        y: e.y - 18,
        vx: e.facing * 330,
        vy: 40,
        radius: 8,
        damage: 1,
        type: 'enemyAcid',
        color: '#4ade80',
        life: 1.4
      });
      particles.addSparkle(e.x + e.facing * 20, e.y - 18, '#4ade80', 6, 2);
    } else if (e.type === 'spire_harpy') {
      // Spire Harpy: paired feather shards
      audioEngine.playSfx('whoosh');
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 22,
          y: e.y - 24 + k * 10,
          vx: e.facing * 360,
          vy: k * 40,
          radius: 9,
          damage: 1,
          type: 'enemyShard',
          color: '#06b6d4',
          life: 1.4
        });
      }
    } else if (e.type === 'volcanic_firebird') {
      // Volcanic Firebird: molten cinder lob
      audioEngine.playSfx('rocket');
      projectiles.push({
        x: e.x + e.facing * 22,
        y: e.y - 20,
        vx: e.facing * 320,
        vy: 120,
        radius: 11,
        damage: 1,
        type: 'enemyShard',
        color: '#f97316',
        life: 1.5
      });
      particles.addSparkle(e.x + e.facing * 22, e.y - 20, '#fb923c', 8, 3);
    } else if (e.type === 'ice_gargoyle') {
      // Glacial Gargoyle: frost lance
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 24,
        y: e.y - 26,
        vx: e.facing * 380,
        vy: 20,
        radius: 10,
        damage: 1,
        type: 'enemyIce',
        color: '#38bdf8',
        life: 1.4
      });
    } else if (e.type === 'boss_spitter') {
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k++) {
        projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 35,
          vx: e.facing * 340,
          vy: k * 50,
          radius: 12,
          damage: 1,
          type: 'enemyAcid',
          color: '#15803d',
          life: 1.6
        });
      }
    } else if (e.type === 'boss_quartz_beast') {
      audioEngine.playSfx('hit');
      particles.addSparkle(e.x, this.groundY, '#38bdf8', 20, 6);
      projectiles.push({
        x: e.x + e.facing * 50,
        y: this.groundY - 30,
        vx: e.facing * 380,
        width: 150,
        height: 40,
        damage: 1,
        type: 'enemyShockwave',
        life: 0.7
      });
    } else if (e.type === 'boss_cluster_titan') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 400;
      projectiles.push({
        x: e.x + e.facing * 60,
        y: this.groundY - 30,
        vx: e.facing * 400,
        width: 165,
        height: 40,
        damage: 1,
        type: 'enemyShockwave',
        color: '#9333ea',
        life: 0.7
      });
    } else if (e.type === 'boss_ice_guardian') {
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 40,
          y: e.y - 45,
          vx: e.facing * 380,
          vy: k * 60,
          radius: 14,
          damage: 1,
          type: 'enemyIce',
          color: '#38bdf8',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_jasper') {
      // Grand Climax Multi-Attack
      audioEngine.playSfx('hit');
      e.vx = e.facing * 450;
      projectiles.push({
        x: e.x + e.facing * 35,
        y: e.y - 35,
        vx: e.facing * 400,
        radius: 34,
        damage: 1,
        type: 'enemyShockwave',
        color: '#ea580c',
        life: 0.65
      });
      // Also spit dual acid bursts
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 45,
          vx: e.facing * 340,
          vy: k * 50,
          radius: 12,
          damage: 1,
          type: 'enemyAcid',
          color: '#15803d',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_cluster_core') {
      audioEngine.playSfx('laser');
      for (let k = -2; k <= 2; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 35,
          y: e.y - 45,
          vx: e.facing * 360,
          vy: k * 45,
          radius: 12,
          damage: 1,
          type: 'enemyShard',
          color: '#c084fc',
          life: 1.5
        });
      }
    } else if (e.type === 'boss_forge_guardian') {
      audioEngine.playSfx('hammer');
      particles.addSparkle(e.x, this.groundY, '#f97316', 24, 7);
      projectiles.push({
        x: e.x + e.facing * 60,
        y: this.groundY - 30,
        vx: e.facing * 390,
        width: 180,
        height: 40,
        damage: 1,
        type: 'enemyShockwave',
        color: '#f97316',
        life: 0.7
      });
    } else if (e.type === 'boss_agate_warden') {
      audioEngine.playSfx('whip');
      audioEngine.playSfx('lightning');
      projectiles.push({
        x: e.x + e.facing * 40,
        y: e.y - 40,
        vx: e.facing * 420,
        vy: 0,
        radius: 16,
        damage: 1,
        type: 'enemyShockwave',
        color: '#38bdf8',
        life: 0.6
      });
    } else if (e.type === 'boss_topaz_fusion') {
      audioEngine.playSfx('hit');
      e.vx = e.facing * 460;
      projectiles.push({
        x: e.x + e.facing * 65,
        y: this.groundY - 35,
        vx: e.facing * 410,
        width: 190,
        height: 42,
        damage: 1,
        type: 'enemyShockwave',
        color: '#fbbf24',
        life: 0.7
      });
    } else if (e.type === 'boss_robonoid_titan') {
      audioEngine.playSfx('laser');
      for (let k = -1; k <= 1; k += 2) {
        projectiles.push({
          x: e.x + e.facing * 40,
          y: e.y - 40 + k * 18,
          vx: e.facing * 420,
          vy: 0,
          radius: 14,
          damage: 1,
          type: 'enemyLaser',
          color: '#10b981',
          life: 1.4
        });
      }
    } else if (e.type === 'boss_white_diamond') {
      // Supreme Mecha Blinding Light & Radial Tri-Beam
      audioEngine.playSfx('laser');
      audioEngine.playSfx('lightning');
      particles.addSparkle(e.x, e.y - 60, '#ffffff', 30, 8);
      for (let angle = -0.3; angle <= 0.3; angle += 0.3) {
        projectiles.push({
          x: e.x + e.facing * 45,
          y: e.y - 60,
          vx: e.facing * Math.cos(angle) * 440,
          vy: Math.sin(angle) * 440,
          radius: 18,
          damage: 1,
          type: 'enemyLaser',
          color: '#ffffff',
          life: 1.6
        });
      }
    } else if (e.type === 'robonoid_scout') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 20,
        y: e.y - 25,
        vx: e.facing * 340,
        vy: 0,
        radius: 8,
        damage: 1,
        type: 'enemyLaser',
        color: '#84cc16',
        life: 1.4
      });
    } else if (e.type === 'forge_automaton') {
      audioEngine.playSfx('hammer');
      e.vx = e.facing * 320;
    } else if (e.type === 'destabilizer_soldier') {
      audioEngine.playSfx('laser');
      projectiles.push({
        x: e.x + e.facing * 25,
        y: e.y - 30,
        vx: e.facing * 360,
        vy: 0,
        radius: 10,
        damage: 1,
        type: 'enemyLaser',
        color: '#38bdf8',
        life: 1.4
      });
    }
  }

  checkPlayerAttackCollisions(e, player, projectiles, particles, audioEngine, onPoofed, enemyIndex) {
    if (e.isPoofed) return;

    // Amethyst Buzzsaw Roll Contact Collision (Full immunity + continuous shred)
    if (player.isSpinDashing) {
      const dist = Math.abs(player.x - e.x);
      if (dist < 65 && e.hurtTimer <= 0) {
        let dmg = (player.isPinkOverdrive ? 60 : 35) * (player.hasSynergyBuff ? 1.25 : 1.0);
        this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, player.getMoveType('k'), player.getStabMultiplier('k'));
        particles.addImpactSparks(e.x, e.y - 20, player.facing, '#c084fc', 10);
        if (this.gameRef && this.gameRef.triggerHitstop) {
          this.gameRef.triggerHitstop(0.035, 2.5);
        }
        e.vx = player.facing * 440;
        e.vy = -240;
        e.hurtTimer = 0.35;
        audioEngine.playSfx('hit');
        particles.addSparkle(e.x, e.y - 20, '#c084fc', 12, 4);
        if (e.isPoofed) return;
      }
    }

    // Melee Attack Check with Generous Hitbox & Stagger Knockback
    if (player.isAttacking && (player.attackFrame >= 0.2 || player.actionTimer > 0)) {
      let hitRange = 85;
      if (player.isFusion) hitRange = 165;
      else if (player.activeChar === 'amethyst') hitRange = 120;
      else if (player.activeChar === 'lapis') hitRange = 115;
      else if (player.activeChar === 'jasper') hitRange = 110;
      else if (player.activeChar === 'connie') hitRange = 105;
      else if (player.activeChar === 'rose' || player.activeChar === 'pearl') hitRange = 100;
      else if (player.activeChar === 'bismuth') hitRange = 95;
      hitRange += (player.attackRangeBonus || 0);

      const isFacing = (player.facing === 1 && e.x >= player.x - 15) || (player.facing === -1 && e.x <= player.x + 15);
      const dist = Math.abs(player.x - e.x);

      if (isFacing && dist < hitRange && e.hurtTimer <= 0) {
        let dmg = 25;
        if (player.isFusion) dmg = 75;
        else if (player.activeChar === 'bismuth') dmg = 44;
        else if (player.activeChar === 'jasper') dmg = 42;
        else if (player.activeChar === 'garnet') dmg = 38;
        else if (player.activeChar === 'rose') dmg = 36;
        else if (player.activeChar === 'connie') dmg = 32;
        else if (player.activeChar === 'pearl') dmg = 30;
        else if (player.activeChar === 'lapis') dmg = 30;
        else if (player.activeChar === 'amethyst') dmg = 28;
        else if (player.activeChar === 'peridot') dmg = 28;

        // Combo step scaling: finishers hit hardest, perfect links add 12%
        dmg = Math.round(dmg * (player.attackDamageMult || 1));

        if (player.isPinkOverdrive) {
          dmg = Math.round(dmg * 2.0);
        }
        if (player.hasSynergyBuff) {
          dmg = Math.round(dmg * 1.25);
        }

        this.damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, player.getMoveType(player.attackType), player.getStabMultiplier(player.attackType));
        const sparkColor = player.isPinkOverdrive ? '#f43f5e' : (CHARACTER_CONFIG[player.activeChar]?.color || '#fde047');
        particles.addImpactSparks(e.x, e.y - e.height / 2, player.facing, sparkColor, 12);
        if (this.gameRef && this.gameRef.triggerHitstop) {
          this.gameRef.triggerHitstop(player.isFusion ? 0.055 : 0.038, player.isFusion ? 4.5 : 2.5);
        }

        // ENEMY STAGGER & KNOCKBACK FOR CLOSE-RANGE / MELEE ATTACKS
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
        }
        // Heavier chain steps launch further; finishers add extra lift
        e.vx *= (player.attackKnockMult || 1);
        if (this.knockbackResist) e.vx *= Math.max(0.35, 1 - this.knockbackResist);
        if (player.comboStep === 2 && e.vy) e.vy *= 1.15;
        e.attackTimer = 0;

        if (e.isPoofed) return;
      }
    }

    // Projectile Collisions
    for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
      const p = projectiles[pIdx];
      if (p.type.startsWith('enemy')) continue;

      // Show-Accurate Holo-Pearl Sparring Clone: Multi-Hit Piercing Fencing Lunges!
      if (p.type === 'holoPearl') {
        const dist = Math.hypot(p.x - e.x, p.y - (e.y - e.height / 2));
        if (dist < (p.radius || 32) + (e.width / 2)) {
          p.hitCooldowns = p.hitCooldowns || {};
          const eKey = e.id || `${Math.round(e.x)}_${Math.round(e.y)}_${enemyIndex}`;
          if (!p.hitCooldowns[eKey] || p.hitCooldowns[eKey] <= 0) {
            p.hitCooldowns[eKey] = 0.35; // allow re-hit after 0.35s
            this.damageEnemy(e, p.damage || 55, particles, audioEngine, onPoofed, enemyIndex, p.elementType || 'psychic', p.stabMult || 1);
            audioEngine.playSfx('laser');
            particles.addDamageText(e.x, e.y - e.height - 20, '🤺 PARRY! THRUST!', true, p.isOverdrive ? '#f472b6' : '#38bdf8');
            particles.addSparkle(e.x, e.y - 25, p.isOverdrive ? '#f472b6' : '#a5f3fc', 16, 5);
            e.vx = (p.facing || (p.vx >= 0 ? 1 : -1)) * 380;
            e.vy = -190;
            e.hurtTimer = 0.45;
            e.attackTimer = 0;
            if (e.isPoofed) break;
          }
        }
        continue; // Holo-Pearl continues lunging through enemies without vanishing!
      }

      // 1. Determine hit detection based on projectile geometry (AABB for waves/shockwaves, radial for projectiles)
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

      if (isHit) {

      // 2. Throttle persistent AoE projectiles so they do not deal damage on every single frame to the same enemy
      const isPersistentAoE = (p.type === 'purpleGeyser' || p.type === 'tidalWave' || p.type === 'moltenShockwave' || p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam' || p.type === 'bubbleShockwave' || p.type === 'roseShockwave' || p.type === 'magneticVortex' || p.type === 'connieShadowSlash' || p.type === 'fusionRoseSwordWave' || p.type === 'fusionCyclone' || p.type === 'fusionPrismCannon' || p.type === 'fusionSupernova' || p.type === 'fusionFlailCataclysm' || p.type === 'fusionShowstopper' || p.type === 'fusionTsunamiCage' || p.type === 'fusionPrismRose');
      if (isPersistentAoE) {
        p.hitMap = p.hitMap || new Map();
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (p.hitMap.has(e)) {
          const lastHit = p.hitMap.get(e);
          if (now - lastHit < 320) {
            continue; // Enemy was recently hit by this wave/shockwave; wait for next tick
          }
        }
        p.hitMap.set(e, now);
      }

      // 3. Confirmed Hit! Apply damage, particle sparkle, and weapon knockback
      this.damageEnemy(e, p.damage || 25, particles, audioEngine, onPoofed, enemyIndex, p.elementType || null, p.stabMult || 1);
      particles.addSparkle(p.x, p.y, p.color || '#fff', 12, 4);
      const projDir = (p.vx && p.vx > 0) ? 1 : ((p.vx && p.vx < 0) ? -1 : player.facing);
      particles.addImpactSparks(e.x, e.y - e.height / 2, projDir, p.color || '#fde047', 10);
      if (this.gameRef && this.gameRef.triggerHitstop) {
        this.gameRef.triggerHitstop(0.032, 2.0);
      }

      // Specific Knockbacks based on lore weapons
      if (p.type === 'tidalWave') {
        // Lapis Lazuli Towering Tidal Wave: Sweeps enemies into the air with hydro surge!
        e.vx = (p.vx && p.vx > 0 ? 1 : -1) * 520;
        e.vy = -360;
        e.hurtTimer = 0.55;
        particles.addDamageText(e.x, e.y - e.height - 25, '🌊 TIDAL WAVE!', true, '#0284c7');
        particles.addSparkle(e.x, e.y - 25, '#38bdf8', 22, 6);
        particles.addSparkle(e.x, e.y - 45, '#e0f2fe', 16, 5);
      } else if (p.type === 'jasperCrashHelmet') {
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
        } else if (p.type === 'shieldShockwave' || p.type === 'bubbleShockwave') {
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
          particles.addDamageText(e.x, e.y - e.height - 20, 'CRESCENT BEAM!', true, '#ec4899');
        } else if (p.type === 'connieShadowSlash') {
          e.vx = player.facing * 340;
          e.vy = -200;
          e.hurtTimer = 0.40;
          particles.addDamageText(e.x, e.y - e.height - 20, 'SHADOW CUT!', true, '#f472b6');
        } else if (p.type === 'bismuthAnvil') {
          // Bismuth Anvil Launch: heavy catapult knockback
          e.vx = (p.vx && p.vx > 0 ? 1 : (p.vx && p.vx < 0 ? -1 : player.facing)) * 620;
          e.vy = -300;
          e.hurtTimer = 0.50;
          particles.addDamageText(e.x, e.y - e.height - 20, 'HEAVY ANVIL!', true, '#ea580c');
        } else if (p.type === 'moltenShockwave') {
          // Bismuth Breaking Point Ultimate: catastrophic air pop & knockback!
          e.vx = player.facing * 850;
          e.vy = -480;
          e.hurtTimer = 0.65;
          particles.addDamageText(e.x, e.y - e.height - 30, 'BREAKING POINT!', true, '#ef4444');
        } else if (p.type === 'giantGauntletSlam' || p.type === 'seismicShockwave') {
          // Garnet Giant Gauntlets Seismic Slam: ground tremor pop
          e.vx = player.facing * 450;
          e.vy = -360;
          e.hurtTimer = 0.50;
          particles.addDamageText(e.x, e.y - e.height - 20, 'MEGA SLAM!', true, '#fbbf24');
        } else {
          // Standard Projectile Knockback (combo finishers carry their own tuning)
          const dir = (p.vx && p.vx > 0) ? 1 : ((p.vx && p.vx < 0) ? -1 : player.facing);
          e.vx = dir * (p.knockX || 180);
          if (p.knockY) e.vy = p.knockY;
          e.hurtTimer = p.hurtTime || 0.3;
          if (p.hitText) {
            particles.addDamageText(e.x, e.y - e.height - 22, p.hitText, true, p.color || '#fde047');
          }
        }
        e.attackTimer = 0;

        if (p.type === 'stevenShield' && p.bounces > 0) {
          p.bounces--;
          p.vx = -p.vx;
          p.x += p.vx * 0.05;
        } else if (p.type === 'roseShield' && p.bounces > 0) {
          p.bounces--;
          p.vx = -p.vx;
          p.x += p.vx * 0.05;
        } else if (p.type === 'purpleGeyser') {
          // Amethyst Violet Geyser Air Juggle! Launches targets straight up with electric crackles
          e.vx = player.facing * 120;
          e.vy = -360;
          e.hurtTimer = 0.50;
          particles.addDamageText(e.x, e.y - e.height - 25, 'VIOLET GEYSER!', true, '#c084fc');
          particles.addSparkle(e.x, e.y - 30, '#fde047', 12, 4);
        } else if (!isPersistentAoE && p.type !== 'amethystSpinDashHit' && p.type !== 'jasperSpinDashHit') {
          projectiles.splice(pIdx, 1);
        }
        if (e.isPoofed) break;
      }
    }
  }

  // Type-status rider applied on every damaging hit.
  applyTypeStatus(e, moveType, particles) {
    const status = TYPE_STATUS[moveType];
    if (!status || e.isImmortalDummy) return;
    const already = (id) => {
      if (id === 'soaked') return e.soakTimer > 0;
      if (id === 'shocked') return e.stunTimer > 0;
      if (id === 'dazed') return e.dazeTimer > 0;
      if (id === 'charmed') return e.charmTimer > 0;
      if (id === 'cracked' || id === 'corrupted' || id === 'shattered') return e.vulnTimer > 0;
      if (id === 'scorched') return e.scorchTimer > 0;
      return false;
    };
    const fresh = !already(status.id);

    switch (status.id) {
      case 'soaked':   e.soakTimer = 4.0; break;                                  // Lapis: waterlogged, slowed
      case 'shocked':  e.stunTimer = Math.max(e.stunTimer || 0, 0.9); e.windup = 0; break; // Garnet/Peridot
      case 'dazed':    e.dazeTimer = 3.0; e.windup = 0; break;                    // Future Vision scrambles aim
      case 'charmed':  e.charmTimer = 5.0; break;                                 // Steven: empathy disarms
      case 'cracked':  e.vulnTimer = 5.0; e.vulnMult = Math.max(e.vulnMult || 1, 1.18); break;
      case 'shattered':e.vulnTimer = 4.0; e.vulnMult = Math.max(e.vulnMult || 1, 1.25); break;
      case 'corrupted':e.vulnTimer = 5.0; e.vulnMult = Math.max(e.vulnMult || 1, 1.10); break;
      case 'scorched': e.scorchTimer = 3.0; break;                                // Bismuth / firebird heat
      case 'launched': e.launchBoost = 1.35; break;                               // water wings / pegasus
      case 'stagger':  e.windup = 0; e.aiState = 'staggered'; break;              // quartz fists
      default: break;
    }

    // Announce a rider only when it is fresh and not spamming (one label per 1.2 s per enemy)
    if (fresh && status.id !== 'focused' && status.id !== 'stagger' &&
        (e.animTime - (e.lastStatusFxAt ?? -9)) > 1.2) {
      e.lastStatusFxAt = e.animTime;
      particles.addDamageText(e.x + (Math.random() * 18 - 9), e.y - e.height - 40, status.label, false, status.color);
    }
  }

  damageEnemy(e, dmg, particles, audioEngine, onPoofed, enemyIndex, attackType = null, stabMult = 1) {
    if (e.isPoofed) return;

    const moveType = attackType ? String(attackType).toLowerCase() : null;
    const typeMeta = getTypeMeta(moveType || 'normal');
    const typeMult = typeMultiplier(moveType, e.types);
    const vulnMult = (e.vulnTimer > 0 ? (e.vulnMult || 1) : 1);
    const finalDmg = Math.max(1, Math.round(dmg * typeMult * (stabMult || 1) * vulnMult));

    if (this.onComboHit) {
      this.onComboHit(finalDmg);
    }

    // Show the matchup verdict (throttled per enemy so it never floods the screen)
    const effect = typeEffectLabel(typeMult);
    if (effect && (e.animTime - (e.lastTypeFxAt ?? -9)) > 0.55) {
      e.lastTypeFxAt = e.animTime;
      particles.addDamageText(e.x, e.y - e.height - 26, effect.text, typeMult >= 2, effect.color);
    }

    // Tekken Practice Dojo: Training dummy takes zero permanent damage!
    if (e.isImmortalDummy) {
      e.hp = e.maxHp;
      e.hurtTimer = 0.28;
      particles.addDamageText(e.x, e.y - e.height - 14, `${finalDmg}`, finalDmg >= 30, typeMeta.color);
      this.applyTypeStatus(e, moveType, particles);
      audioEngine.playSfx('hit');
      return;
    }

    e.hp -= finalDmg;
    e.hurtTimer = 0.35;
    particles.addDamageText(e.x, e.y - e.height - 12, `${finalDmg}`, finalDmg >= 30 || typeMult >= 2, typeMeta.color);
    this.applyTypeStatus(e, moveType, particles);
    audioEngine.playSfx('hit');

    if (e.hp <= 0) {
      if (!e.isPoofed && !e.isPoofing) {
        e.hp = 0;
        e.isPoofing = true;
        e.poofTimer = 0.16;
        e.maxPoofTime = 0.16;
        if (this.gameRef && this.gameRef.triggerHitstop) {
          this.gameRef.triggerHitstop(0.065, 5.0);
        }
      }
      return;
    }
  }

  poofEnemy(e, enemyIndex, particles, audioEngine, onPoofed) {
    audioEngine.playSfx('pop');
    audioEngine.playSfx('poof');
    particles.addPoof(e.x, e.y - e.height / 2, e.gemColor || '#22c55e');
    this.enemiesDefeatedInStage = (this.enemiesDefeatedInStage || 0) + 1;

    // Health Recovery Drop: 30-40% chance healing Heart drop
    if (this.pickupsRef) {
      const dropRoll = Math.random();
      if (dropRoll < this.dropRate) {
        this.pickupsRef.push({
          x: e.x,
          y: this.groundY - 14,
          type: 'heart',
          life: 20
        });
        particles.addSparkle(e.x, this.groundY - 15, '#ff4d79', 16, 5);
      }
    }

    // 15% - 30% Bubble Collection Charge based on enemy tier & difficulty
    let basePercent = 18;
    if (e.type === 'centipeetle' || e.type === 'acid_centipeetle' || e.type === 'robonoid_scout') {
      basePercent = 16;
    } else if (e.type === 'blade_quartz' || e.type === 'cluster' || e.type === 'ice_monster' || e.type === 'forge_automaton' || e.type === 'destabilizer_soldier') {
      basePercent = 23;
    } else if (e.isBoss) {
      basePercent = 30;
    }
    const diffMultiplier = this.diffMult || 1.0;
    const bubblePercent = Math.max(15, Math.min(30, Math.round(basePercent * diffMultiplier)));

    this.droppedGems.push({
      x: e.x,
      y: this.groundY - 10,
      color: e.gemColor || '#22c55e',
      shape: e.gemShape || 'centipeetle',
      type: e.type,
      bubblePercent: bubblePercent,
      life: 18.0,
      sparkleTimer: 0
    });

    if (e.isBoss) {
      this.isBossAlive = false;
      this.bossDefeated = true;
    }

    const idx = this.enemies.indexOf(e);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
    }
    if (onPoofed) onPoofed(e);
  }

  drawEnemyModel(ctx, e) {
    if (e.type === 'winged_centipeetle') {
      this.drawWingedCentipeetle(ctx, e);
    } else if (e.type === 'spire_harpy') {
      this.drawSpireHarpy(ctx, e);
    } else if (e.type === 'volcanic_firebird') {
      this.drawVolcanicFirebird(ctx, e);
    } else if (e.type === 'ice_gargoyle') {
      this.drawIceGargoyle(ctx, e);
    } else if (e.type === 'centipeetle' || e.type === 'acid_centipeetle') {
      this.drawCentipeetleHatchling(ctx, e);
    } else if (e.type === 'blade_quartz') {
      this.drawBladeQuartz(ctx, e);
    } else if (e.type === 'cluster') {
      this.drawClusterMutant(ctx, e);
    } else if (e.type === 'ice_monster') {
      this.drawIceMonster(ctx, e);
    } else if (e.type === 'boss_spitter' || e.type === 'boss_centipeetle') {
      this.drawMotherCentipeetle(ctx, e);
    } else if (e.type === 'boss_quartz_beast') {
      this.drawCorruptedQuartzBeast(ctx, e);
    } else if (e.type === 'boss_cluster_titan') {
      this.drawClusterTitan(ctx, e);
    } else if (e.type === 'boss_ice_guardian') {
      this.drawIceGuardian(ctx, e);
    } else if (e.type === 'boss_jasper' || e.type === 'boss_jasper_dummy' || e.type.includes('dummy') || e.type.includes('jasper')) {
      this.drawCorruptedJasper(ctx, e);
    } else if (e.type === 'boss_cluster_core') {
      this.drawClusterCore(ctx, e);
    } else if (e.type === 'boss_forge_guardian') {
      this.drawForgeGuardian(ctx, e);
    } else if (e.type === 'boss_agate_warden') {
      this.drawAgateWarden(ctx, e);
    } else if (e.type === 'boss_topaz_fusion') {
      this.drawTopazFusion(ctx, e);
    } else if (e.type === 'boss_robonoid_titan') {
      this.drawRobonoidTitan(ctx, e);
    } else if (e.type === 'boss_white_diamond') {
      this.drawWhiteDiamond(ctx, e);
    } else if (e.type === 'robonoid_scout') {
      this.drawRobonoidScout(ctx, e);
    } else if (e.type === 'forge_automaton') {
      this.drawForgeAutomaton(ctx, e);
    } else if (e.type === 'destabilizer_soldier') {
      this.drawDestabilizerSoldier(ctx, e);
    } else {
      // Safe ultimate fallback: guarantees NO enemy or boss is ever invisible!
      this.drawCorruptedJasper(ctx, e);
    }
  }

  draw(ctx) {
    ctx.save();
    for (const g of this.droppedGems) {
      this.drawGemstone(ctx, g.x, g.y, g.color, g.shape);
    }

    for (const e of this.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.scale(e.facing, 1);

      if (e.isPoofing) {
        const poofProgress = Math.max(0, Math.min(1, 1 - (e.poofTimer / (e.maxPoofTime || 0.16))));
        const swell = 1.0 + Math.sin(poofProgress * Math.PI * 0.85) * 0.42;
        ctx.scale(swell, swell);
      }

      // Boss on its last legs: light bleeds out of the cracks before it breaks.
      if (e.isBoss && !e.isImmortalDummy && e.maxHp > 0 && e.hp / e.maxHp < 0.3) {
        const pulse = 0.5 + 0.5 * Math.sin(e.animTime * 10);
        const r = Math.max(e.width, e.height) * 1.0;
        ctx.save();
        ctx.globalAlpha = 0.26 + 0.30 * pulse;
        const glow = ctx.createRadialGradient(0, -e.height * 0.5, 4, 0, -e.height * 0.5, r);
        glow.addColorStop(0, 'rgba(255,255,255,0.95)');
        glow.addColorStop(0.45, `rgba(248,113,113,${0.5 + 0.3 * pulse})`);
        glow.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, -e.height * 0.5, r, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 6; i++) {
          const rise = ((e.animTime * 0.7 + i * 1.63) % 1);
          ctx.globalAlpha = (1 - rise) * 0.9;
          ctx.fillStyle = i % 2 ? '#fde68a' : '#ffffff';
          ctx.beginPath();
          ctx.arc(Math.sin(i * 2.3 + e.animTime * 1.4) * r * 0.55, -rise * e.height - 4, 1.8 + (1 - rise) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw base enemy
      this.drawEnemyModel(ctx, e);

      // 1: IMPACT FLASH & BALLOON POP (Fighting Style Guide)
      // Flash ONLY the exact silhouette of the enemy using an isolated offscreen canvas mask (no square box!)
      if (e.isPoofing || e.hurtTimer > 0.16) {
        if (!this.flashCanvas && typeof document !== 'undefined') {
          try {
            this.flashCanvas = document.createElement('canvas');
            this.flashCanvas.width = 512;
            this.flashCanvas.height = 512;
            this.flashCtx = this.flashCanvas.getContext('2d');
          } catch (err) {
            this.flashCanvas = null;
            this.flashCtx = null;
          }
        }
        if (this.flashCanvas && this.flashCtx) {
          const fc = this.flashCanvas;
          const fctx = this.flashCtx;
          const cx = 256;
          const cy = 360;

          // Localized bounding box for zero-lag CPU/GPU processing
          const halfW = Math.min(240, Math.ceil(Math.max((e.width || 60) * 1.35, 75)));
          const topH = Math.min(340, Math.ceil(Math.max((e.height || 60) * 1.35, 85)));
          const botH = 25;
          const boxW = halfW * 2;
          const boxH = topH + botH;
          const sx = cx - halfW;
          const sy = cy - topH;

          // Clear and fill ONLY the localized sub-rect
          fctx.clearRect(sx, sy, boxW, boxH);
          fctx.save();
          fctx.translate(cx, cy);
          this.drawEnemyModel(fctx, e);
          fctx.globalCompositeOperation = 'source-in';
          fctx.fillStyle = e.isPoofing ? '#ffffff' : 'rgba(255, 255, 255, 0.92)';
          fctx.fillRect(-halfW, -topH, boxW, boxH);
          fctx.restore();

          // Blit only the localized sub-rect cleanly onto main canvas
          ctx.drawImage(fc, sx, sy, boxW, boxH, -halfW, -topH, boxW, boxH);
        }
      }

      if (!e.isPoofing) {
        this.drawHealthBar(ctx, e);
      }
      ctx.restore();

      // Freebuff readability layer: elite aura + wind-up warning
      this.drawAITelegraph(ctx, e);
    }
    ctx.restore();
  }

  drawAITelegraph(ctx, e) {
    if (e.isElite) {
      ctx.save();
      ctx.globalAlpha = 0.30 + 0.15 * Math.sin(e.animTime * 6);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y - e.height / 2, Math.max(28, e.width * 0.75), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (e.windup > 0 && e.windupMax > 0) {
      const progress = 1 - (e.windup / e.windupMax);
      ctx.save();
      ctx.globalAlpha = 0.55 + 0.4 * Math.sin(e.animTime * 20);
      ctx.strokeStyle = e.phase2 ? '#f97316' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y - e.height - 26, 12 + progress * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = e.phase2 ? '#f97316' : '#ef4444';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', e.x, e.y - e.height - 26);
      ctx.restore();
    }
  }

  // --- AERIAL & FLYING CORRUPTED GEMS DRAWINGS ---
  drawWingedCentipeetle(ctx, e) {
    const wingFlap = Math.sin(e.animTime * 24) * 14;

    // Two pairs of veined emerald insect wings, beating out of phase
    const drawWing = (rootX, rootY, dir, len, alpha) => {
      ctx.save();
      ctx.translate(rootX, rootY);
      ctx.rotate(dir * (0.35 + wingFlap * 0.012));
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
      ctx.strokeStyle = '#dcfce7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * len * 0.55, -len * 0.55, dir * len, -len * 0.12);
      ctx.quadraticCurveTo(dir * len * 0.62, len * 0.16, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Wing vein
      ctx.strokeStyle = 'rgba(240, 253, 244, 0.75)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * len * 0.5, -len * 0.3, dir * len * 0.95, -len * 0.1);
      ctx.stroke();
      ctx.restore();
    };
    drawWing(-2, -34, -1, 30, 0.60);
    drawWing(6, -36, 1, 28, 0.52);

    // Segmented Centipede Body
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(-14, -16, 10, 0, Math.PI * 2);
    ctx.arc(0, -20, 12, 0, Math.PI * 2);
    ctx.arc(14, -22, 14, 0, Math.PI * 2);
    ctx.fill();

    // Acid Mandibles
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(22, -26);
    ctx.lineTo(32, -32);
    ctx.moveTo(22, -18);
    ctx.lineTo(32, -14);
    ctx.stroke();

    // Glowing Single Eye Gemstone
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(20, -22, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.arc(22, -22, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSpireHarpy(ctx, e) {
    const wingFlap = Math.sin(e.animTime * 20) * 16;

    // Celestial Iridescent Feathered Wings
    ctx.fillStyle = 'rgba(6, 182, 212, 0.75)';
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(-25, -55 + wingFlap, -45, -40 + wingFlap, -35, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(25, -55 - wingFlap, 45, -40 - wingFlap, 35, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Body & Beak
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(0, -18, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(8, -20);
    ctx.lineTo(24, -16);
    ctx.lineTo(8, -12);
    ctx.closePath();
    ctx.fill();

    // Cyan Forehead Gem
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(0, -24, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawVolcanicFirebird(ctx, e) {
    const flap = Math.sin(e.animTime * 12) * 0.45;
    const gy = -30 + Math.sin(e.animTime * 3) * 2;

    // Tail feathers (molten)
    ctx.fillStyle = '#c2410c';
    for (let i = -1; i <= 1; i++) {
      ctx.save();
      ctx.translate(-14, gy + 4);
      ctx.rotate(0.5 + i * 0.28);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, -3 + i * 2);
      ctx.lineTo(-2, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Wings
    ctx.save();
    ctx.translate(-4, gy - 2);
    ctx.rotate(-0.3 + flap);
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-16, -16);
    ctx.lineTo(-4, -4);
    ctx.lineTo(-12, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(4, gy - 4);
    ctx.rotate(0.25 - flap);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(18, -14);
    ctx.lineTo(6, -2);
    ctx.lineTo(16, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Body + head
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.ellipse(0, gy + 6, 12, 9, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(9, gy - 4, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Molten chest glow
    ctx.fillStyle = `rgba(251, 191, 36, ${0.55 + 0.35 * Math.abs(Math.sin(e.animTime * 6))})`;
    ctx.beginPath();
    ctx.ellipse(1, gy + 6, 6, 5, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Beak + eye
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(14, gy - 6);
    ctx.lineTo(20, gy - 3);
    ctx.lineTo(14, gy - 1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(10, gy - 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(10.6, gy - 6, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  drawIceGargoyle(ctx, e) {
    const wingFlap = Math.sin(e.animTime * 18) * 14;

    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-32, -48 + wingFlap);
    ctx.lineTo(-18, -16);
    ctx.lineTo(32, -48 - wingFlap);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -18, 14, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.lineTo(-14, -38);
    ctx.moveTo(6, -26);
    ctx.lineTo(14, -38);
    ctx.stroke();
  }

  // --- SHOW-ACCURATE CORRUPTED GEMS DRAWINGS ---
  drawCentipeetleHatchling(ctx, e) {
    const legWiggle = Math.sin(e.animTime * 14) * 4;

    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(-16, -18, 12, 0, Math.PI * 2);
    ctx.arc(0, -22, 14, 0, Math.PI * 2);
    ctx.arc(16, -26, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 2.5;
    for (let lx of [-12, -2, 8]) {
      ctx.beginPath();
      ctx.moveTo(lx, -16);
      ctx.lineTo(lx - 6, -2 + legWiggle);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(-24, -20);
    ctx.lineTo(-34, -28);
    ctx.moveTo(-24, -16);
    ctx.lineTo(-34, -10);
    ctx.stroke();

    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.arc(22, -26, 14, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.fill();

    // Centipeetle Eye Gemstone
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(25, -26, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.arc(26, -26, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMotherCentipeetle(ctx, e) {
    const breathe = Math.sin(e.animTime * 4) * 3;

    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.arc(-36, -50 + breathe, 30, 0, Math.PI * 2);
    ctx.arc(0, -60 + breathe, 38, 0, Math.PI * 2);
    ctx.arc(42, -65 + breathe, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(-20, -70 + breathe, 14, 0, Math.PI * 2);
    ctx.arc(15, -80 + breathe, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(55, -85 + breathe);
    ctx.quadraticCurveTo(85, -95 + breathe, 95, -70 + breathe);
    ctx.moveTo(55, -45 + breathe);
    ctx.quadraticCurveTo(85, -35 + breathe, 95, -60 + breathe);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(62, -65 + breathe, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.arc(64, -65 + breathe, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(67, -68 + breathe, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCorruptedQuartzBeast(ctx, e) {
    const bob = Math.sin(e.animTime * 6) * 4;

    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.roundRect(-45, -65 + bob, 90, 55, 16);
    ctx.fill();

    ctx.fillStyle = '#e0f2fe';
    for (let x = -40; x <= 30; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, -65 + bob);
      ctx.lineTo(x + 8, -85 + bob);
      ctx.lineTo(x + 16, -65 + bob);
      ctx.fill();
    }

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(36, -55 + bob, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(35, -42 + bob);
    ctx.lineTo(40, -34 + bob);
    ctx.lineTo(45, -42 + bob);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(38, -62 + bob, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(28, -75 + bob);
    ctx.quadraticCurveTo(45, -105 + bob, 15, -110 + bob);
    ctx.stroke();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.ellipse(5, -45 + bob, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawClusterMutant(ctx, e) {
    const wob = Math.sin(e.animTime * 9) * 3;
    const wob2 = Math.cos(e.animTime * 7) * 2;

    // Knotted mass of fused limbs that never settled into one shape
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.bezierCurveTo(-28, -14 + wob, -18, -26 - wob2, -4, -28 + wob);
    ctx.bezierCurveTo(10, -30 - wob, 24, -20 + wob2, 25, -6);
    ctx.bezierCurveTo(26, 0, 18, 2, -24, 0);
    ctx.closePath();
    ctx.fill();

    // Shoulder lumps
    ctx.fillStyle = '#6d28d9';
    ctx.beginPath();
    ctx.ellipse(-12, -22 + wob, 9, 7, -0.3, 0, Math.PI * 2);
    ctx.ellipse(11, -20 - wob2, 8, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Three mismatched gems embedded in the cluster
    const gems = [
      { x: -14, y: -12 + wob, c: '#f43f5e' },
      { x: 2, y: -18 + wob2, c: '#38bdf8' },
      { x: 15, y: -9 - wob, c: '#fbbf24' }
    ];
    gems.forEach(g => {
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.moveTo(g.x, g.y - 4);
      ctx.lineTo(g.x + 4, g.y);
      ctx.lineTo(g.x, g.y + 4);
      ctx.lineTo(g.x - 4, g.y);
      ctx.closePath();
      ctx.fill();
    });

    // Two eyes from two different gems, both staring the wrong way
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(-7, -24 + wob, 3.2, 0, Math.PI * 2);
    ctx.arc(7, -25 - wob2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-6, -24 + wob, 1.5, 0, Math.PI * 2);
    ctx.arc(8, -25 - wob2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Stubby fused leg
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.roundRect(-9, -2 + wob, 7, 10, 3);
    ctx.roundRect(6, -2, 6, 10, 3);
    ctx.fill();
  }

  drawCorruptedJasper(ctx, e) {
    const bob = Math.sin(e.animTime * 6) * 3;

    // Tekken Practice Dojo: Holographic Cyan Grid Aura & Scanner Ring
    if (e.isImmortalDummy) {
      ctx.save();
      const scanY = -35 + Math.sin(Date.now() / 180) * 35;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, scanY, 45, 9, 0, 0, Math.PI * 2);
      else ctx.arc(0, scanY, 36, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-42, -75 + bob, 84, 75);
      ctx.restore();
    }

    ctx.fillStyle = e.isImmortalDummy ? '#ea580c' : '#c2410c';
    ctx.beginPath();
    ctx.roundRect(-36, -60 + bob, 72, 50, 14);
    ctx.fill();

    ctx.fillStyle = '#0f766e';
    for (let x = -26; x <= 20; x += 15) {
      ctx.fillRect(x, -58 + bob, 6, 30);
    }

    ctx.fillStyle = '#f8fafc';
    for (let x = -30; x <= 25; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, -60 + bob);
      ctx.lineTo(x + 6, -82 + bob);
      ctx.lineTo(x + 12, -60 + bob);
      ctx.fill();
    }

    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(30, -50 + bob, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(44, -50 + bob);
    ctx.lineTo(49, -46 + bob);
    ctx.lineTo(44, -42 + bob);
    ctx.lineTo(39, -46 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(25, -66 + bob);
    ctx.quadraticCurveTo(45, -92 + bob, 18, -90 + bob);
    ctx.stroke();
  }

  drawBladeQuartz(ctx, e) {
    const bob = Math.sin(e.animTime * 5) * 2;
    const lean = Math.sin(e.animTime * 3) * 1.5;

    // Stumpy legs
    ctx.fillStyle = '#3f0d1a';
    ctx.beginPath();
    ctx.roundRect(-13, -18 + bob, 10, 18, 3);
    ctx.roundRect(4, -18 + bob, 10, 18, 3);
    ctx.fill();

    // Hunched, corrupted quartz torso
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(-16, -18 + bob);
    ctx.lineTo(-13, -40 + bob + lean);
    ctx.quadraticCurveTo(0, -47 + bob + lean, 14, -41 + bob + lean);
    ctx.lineTo(17, -18 + bob);
    ctx.closePath();
    ctx.fill();

    // Ribbed chest plates
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-11, -33 + bob + i * 5);
      ctx.quadraticCurveTo(1, -30 + bob + i * 5, 12, -33 + bob + i * 5);
      ctx.stroke();
    }

    // Corrupted gem shard in the chest
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#fecdd3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1, -36 + bob); ctx.lineTo(6, -31 + bob); ctx.lineTo(2, -25 + bob);
    ctx.lineTo(-4, -30 + bob); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Angular head with a single glowing eye
    ctx.fillStyle = '#9f1239';
    ctx.beginPath();
    ctx.moveTo(-9, -44 + bob + lean);
    ctx.lineTo(6, -50 + bob + lean);
    ctx.lineTo(13, -43 + bob + lean);
    ctx.lineTo(4, -38 + bob + lean);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(4, -44 + bob + lean, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // Massive crystal blade arm (the thing the type is named for)
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(13, -38 + bob);
    ctx.lineTo(26, -34 + bob);
    ctx.lineTo(38, -52 + bob);
    ctx.lineTo(30, -30 + bob);
    ctx.lineTo(17, -26 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(26, -34 + bob);
    ctx.lineTo(38, -52 + bob);
    ctx.stroke();
  }

  drawIceMonster(ctx, e) {
    const bob = Math.sin(e.animTime * 6) * 3;
    const pulse = 0.5 + 0.5 * Math.sin(e.animTime * 4);

    // Jagged ice shoulders
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(-18, -26 + bob);
    ctx.lineTo(-24, -46 + bob);
    ctx.lineTo(-8, -36 + bob);
    ctx.closePath();
    ctx.moveTo(10, -34 + bob);
    ctx.lineTo(20, -52 + bob);
    ctx.lineTo(24, -30 + bob);
    ctx.closePath();
    ctx.fill();

    // Crystalline body
    const bodyGrad = ctx.createLinearGradient(0, -46 + bob, 0, -6 + bob);
    bodyGrad.addColorStop(0, '#bae6fd');
    bodyGrad.addColorStop(0.55, '#38bdf8');
    bodyGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-20, -8 + bob);
    ctx.lineTo(-24, -30 + bob);
    ctx.lineTo(-6, -44 + bob);
    ctx.lineTo(12, -42 + bob);
    ctx.lineTo(24, -24 + bob);
    ctx.lineTo(18, -6 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Frozen core
    ctx.fillStyle = `rgba(240, 249, 255, ${0.55 + 0.3 * pulse})`;
    ctx.beginPath();
    ctx.ellipse(-2, -24 + bob, 7, 9, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#082f49';
    ctx.beginPath();
    ctx.arc(2, -34 + bob, 2.6, 0, Math.PI * 2);
    ctx.arc(11, -32 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // Icicle legs
    ctx.fillStyle = '#0c4a6e';
    ctx.beginPath();
    ctx.moveTo(-14, -6 + bob); ctx.lineTo(-9, 0); ctx.lineTo(-6, -6 + bob); ctx.closePath();
    ctx.moveTo(8, -6 + bob); ctx.lineTo(13, 0); ctx.lineTo(16, -6 + bob); ctx.closePath();
    ctx.fill();
  }

  drawClusterTitan(ctx, e) {
    const bob = Math.sin(e.animTime * 5) * 4;
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.roundRect(-45, -75 + bob, 90, 65, 20);
    ctx.fill();

    // Multi-gem fusion shards protruding
    const shards = [
      { x: -30, y: -75, col: '#f43f5e' },
      { x: -10, y: -90, col: '#38bdf8' },
      { x: 15, y: -85, col: '#fbbf24' },
      { x: 35, y: -70, col: '#c084fc' }
    ];
    shards.forEach(s => {
      ctx.fillStyle = s.col;
      ctx.beginPath();
      ctx.moveTo(s.x - 8, -75 + bob);
      ctx.lineTo(s.x, s.y + bob);
      ctx.lineTo(s.x + 8, -75 + bob);
      ctx.closePath();
      ctx.fill();
    });

    // Crawling giant hands
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(-50, -30 + bob, 22, 28);
    ctx.fillRect(28, -30 + bob, 22, 28);
  }

  drawIceGuardian(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 3;
    ctx.fillStyle = '#0c4a6e';
    ctx.beginPath();
    ctx.roundRect(-50, -80 + bob, 100, 70, 22);
    ctx.fill();

    // Massive Sapphire Horns
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-30, -80 + bob);
    ctx.lineTo(-45, -115 + bob);
    ctx.lineTo(-15, -80 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, -80 + bob);
    ctx.lineTo(45, -115 + bob);
    ctx.lineTo(15, -80 + bob);
    ctx.closePath();
    ctx.fill();

    // Glowing ice core
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(0, -50 + bob, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGemstone(ctx, x, y, color, shape) {
    ctx.save();
    const pulse = Math.sin(Date.now() / 180) * 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.arc(x, y, 18 + pulse, 0, Math.PI * 2);
    ctx.fill();

    if (shape === 'centipeetle' || shape === 'centipeetle_mother') {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#052e16';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 11);
      ctx.lineTo(x + 11, y);
      ctx.lineTo(x, y + 11);
      ctx.lineTo(x - 11, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = "bold 10px 'Fredoka One', sans-serif";
    ctx.fillStyle = '#ffcf33';
    ctx.textAlign = 'center';
    ctx.fillText("AUTO-BUBBLE 💎", x, y - 20);
    ctx.restore();
  }

  drawClusterCore(ctx, e) {
    const pulse = Math.sin(e.animTime * 6) * 6;
    ctx.fillStyle = '#6b21a8';
    ctx.beginPath();
    ctx.arc(0, -55, 45 + pulse * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Multicolored artificial fusion shards protruding
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#c084fc', '#4ade80'];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8 + e.animTime;
      const sx = Math.cos(a) * (50 + pulse);
      const sy = -55 + Math.sin(a) * (50 + pulse);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(a + 0.3) * 16, sy + Math.sin(a + 0.3) * 16);
      ctx.lineTo(sx + Math.cos(a) * 28, sy + Math.sin(a) * 28);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawForgeGuardian(ctx, e) {
    // Dark volcanic steel anvil golem
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-35, -95, 70, 95);
    // Glowing lava cracks
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, -80);
    ctx.lineTo(0, -60);
    ctx.lineTo(-15, -40);
    ctx.lineTo(15, -20);
    ctx.stroke();
    // Twin forging hammer fists
    ctx.fillStyle = '#78350f';
    ctx.fillRect(25, -65, 30, 24);
    ctx.fillRect(45, -75, 14, 44);
    // Glowing orange visor
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-15, -88, 30, 10);
  }

  drawAgateWarden(ctx, e) {
    // Holy Blue Agate
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-22, -80, 44, 50);
    // Hair horns
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-24, -85);
    ctx.lineTo(-38, -108);
    ctx.lineTo(-12, -85);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(24, -85);
    ctx.lineTo(38, -108);
    ctx.lineTo(12, -85);
    ctx.closePath();
    ctx.fill();
    // Face & stoic scowl
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -78, 16, 0, Math.PI * 2);
    ctx.fill();
    // Electric blue shock whip in hand
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(18, -60);
    ctx.quadraticCurveTo(35, -40, 50, -25);
    ctx.stroke();
  }

  drawTopazFusion(ctx, e) {
    // Giant fused topaz bruiser
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-38, -95, 76, 65);
    // Legs
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-32, -30, 28, 30);
    ctx.fillRect(4, -30, 28, 30);
    // Yellow block head & visor
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-22, -120, 44, 25);
    // Twin topaz ear gemstones
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-26, -112, 6, 12);
    ctx.fillRect(20, -112, 6, 12);
  }

  drawRobonoidTitan(ctx, e) {
    // Mechanical Tripod Colossus
    const legWalk = Math.sin(e.animTime * 6) * 8;
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 5;
    // 3 walker legs
    ctx.beginPath();
    ctx.moveTo(-25, -60);
    ctx.lineTo(-45, -20);
    ctx.lineTo(-55, 0 + legWalk);
    ctx.moveTo(25, -60);
    ctx.lineTo(45, -20);
    ctx.lineTo(55, 0 - legWalk);
    ctx.moveTo(0, -60);
    ctx.lineTo(0, 0);
    ctx.stroke();
    // Central metallic spherical body
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(0, -75, 42, 0, Math.PI * 2);
    ctx.fill();
    // Central glowing emerald sensor eye
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(12, -75, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(14, -76, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawWhiteDiamond(ctx, e) {
    // White Diamond Supreme Mecha Avatar
    const floatBob = Math.sin(e.animTime * 3) * 6;
    // Radiant white aura
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -85 + floatBob, 55, 0, Math.PI * 2);
    ctx.stroke();

    // Spire diamond crown
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-35, -100 + floatBob);
    ctx.lineTo(0, -145 + floatBob);
    ctx.lineTo(35, -100 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Head & face
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -85 + floatBob, 28, 0, Math.PI * 2);
    ctx.fill();

    // Eyes with black lashes & glowing diamond pupil
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -92 + floatBob, 7, 3);
    ctx.fillRect(5, -92 + floatBob, 7, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-8, -88 + floatBob, 2.5, 0, Math.PI * 2);
    ctx.arc(8, -88 + floatBob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Black lipstick smile
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -75 + floatBob, 6, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Flowing pearlescent gown / robes
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-32, -65 + floatBob);
    ctx.lineTo(-55, 0);
    ctx.lineTo(55, 0);
    ctx.lineTo(32, -65 + floatBob);
    ctx.closePath();
    ctx.fill();

    // Giant White Diamond on forehead
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -112 + floatBob);
    ctx.lineTo(7, -104 + floatBob);
    ctx.lineTo(0, -96 + floatBob);
    ctx.lineTo(-7, -104 + floatBob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawRobonoidScout(ctx, e) {
    const hover = Math.sin(e.animTime * 3.4) * 4;

    // Three dangling manipulator legs
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2;
    for (const dx of [-8, 0, 8]) {
      ctx.beginPath();
      ctx.moveTo(dx * 0.6, -20 + hover);
      ctx.quadraticCurveTo(dx, -12 + hover, dx * 1.2, -6 + hover);
      ctx.stroke();
    }

    // Floating lime shell
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.ellipse(0, -30 + hover, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4d7c0f';
    ctx.beginPath();
    ctx.ellipse(0, -24 + hover, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big glass eye
    ctx.fillStyle = '#ecfccb';
    ctx.beginPath();
    ctx.arc(3, -32 + hover, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(4.5, -32 + hover, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5.5, -34 + hover, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Antenna blinker
    ctx.strokeStyle = '#a3e635';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-6, -42 + hover);
    ctx.lineTo(-9, -50 + hover);
    ctx.stroke();
    ctx.fillStyle = Math.sin(e.animTime * 8) > 0 ? '#f43f5e' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(-9, -51 + hover, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawForgeAutomaton(ctx, e) {
    const bob = Math.sin(e.animTime * 4) * 1.5;
    const piston = Math.sin(e.animTime * 8) * 3;

    // Legs
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(-12, -14 + bob, 8, 14);
    ctx.fillRect(5, -14 + bob, 8, 14);

    // Riveted iron torso
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(-18, -46 + bob, 36, 34, 6);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Furnace grate with live fire
    const glow = 0.55 + 0.45 * Math.abs(Math.sin(e.animTime * 6));
    ctx.fillStyle = `rgba(249, 115, 22, ${glow})`;
    ctx.beginPath();
    ctx.roundRect(-9, -40 + bob, 18, 14, 3);
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-9, -36 + bob + i * 4);
      ctx.lineTo(9, -36 + bob + i * 4);
      ctx.stroke();
    }

    // Piston arms
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-26, -44 + bob + piston, 8, 20);
    ctx.fillRect(18, -44 + bob - piston, 8, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-28, -47 + bob + piston, 12, 6);
    ctx.fillRect(16, -47 + bob - piston, 12, 6);

    // Single amber sensor eye
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -54 + bob, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.arc(1, -54 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // Smokestack puff
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.beginPath();
    ctx.arc(10 + Math.sin(e.animTime * 2) * 3, -62 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDestabilizerSoldier(ctx, e) {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-16, -55, 32, 55);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -65, 12, 0, Math.PI * 2);
    ctx.fill();
    // Destabilizer prong
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(14, -50);
    ctx.lineTo(26, -50);
    ctx.lineTo(30, -56);
    ctx.moveTo(26, -50);
    ctx.lineTo(30, -44);
    ctx.stroke();
  }

  drawHealthBar(ctx, e) {
    // Only display floating health bar if damaged or if boss/elite
    if (!e.isBoss && !e.isElite && e.hp >= e.maxHp) return;

    ctx.save();
    // Un-flip so health bar always depletes left-to-right regardless of enemy facing direction
    if (e.facing < 0) {
      ctx.scale(-1, 1);
    }

    const barWidth = e.isBoss ? 76 : 36;
    const barHeight = e.isBoss ? 5 : 4;
    const yOff = e.isBoss ? -e.height - 16 : -e.height - 8;
    const pct = Math.max(0, Math.min(1, e.hp / e.maxHp));
    const radius = barHeight / 2;

    // Dark slate capsule background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-barWidth / 2, yOff, barWidth, barHeight, radius);
    } else {
      ctx.rect(-barWidth / 2, yOff, barWidth, barHeight);
    }
    ctx.fill();
    ctx.stroke();

    // Smooth health fill
    if (pct > 0) {
      if (e.isBoss) {
        ctx.fillStyle = '#f43f5e';
      } else if (pct > 0.5) {
        ctx.fillStyle = '#22c55e';
      } else if (pct > 0.25) {
        ctx.fillStyle = '#eab308';
      } else {
        ctx.fillStyle = '#ef4444';
      }
      ctx.beginPath();
      const fillW = Math.max(barHeight, barWidth * pct);
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-barWidth / 2, yOff, fillW, barHeight, radius);
      } else {
        ctx.rect(-barWidth / 2, yOff, barWidth * pct, barHeight);
      }
      ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================================
// 6. DIFFICULTY CONFIG & GUARDIAN ROSTER DATA (8 CANON GEMS)
// ============================================================================
const DIFFICULTY_CONFIG = {
  easy: {
    name: 'EASY',
    hearts: 7,
    enemyHpMultiplier: 0.70,
    enemySpeedMult: 0.85,
    cookieDropRate: 0.50,
    enemyTelegraphMult: 1.55,
    maxConcurrentAttackers: 1,
    enemyEvasion: 0,
    eliteChance: 0,
    enemyAggression: 0.90,
    attackCooldownMult: 1.25,
    waveSizeBonus: 0,
    bossHpMult: 0.90,
    eliteHpMult: 1.30,
    stageHeal: -1,          // -1 = restore every heart on stage clear
    knockbackResist: 0,
    pillColor: '#22c55e'
  },
  medium: {
    name: 'MEDIUM',
    hearts: 5,
    enemyHpMultiplier: 1.0,
    enemySpeedMult: 1.0,
    cookieDropRate: 0.34,
    enemyTelegraphMult: 1.0,
    maxConcurrentAttackers: 2,
    enemyEvasion: 0.03,
    eliteChance: 0.06,
    enemyAggression: 1.0,
    attackCooldownMult: 1.0,
    waveSizeBonus: 0,
    bossHpMult: 1.0,
    eliteHpMult: 1.60,
    stageHeal: -1,
    knockbackResist: 0,
    pillColor: '#eab308'
  },
  hard: {
    name: 'HARD',
    hearts: 4,
    enemyHpMultiplier: 1.40,
    enemySpeedMult: 1.18,
    cookieDropRate: 0.20,
    enemyTelegraphMult: 0.72,
    maxConcurrentAttackers: 3,
    enemyEvasion: 0.09,
    eliteChance: 0.18,
    enemyAggression: 1.15,
    attackCooldownMult: 0.88,
    waveSizeBonus: 1,
    bossHpMult: 1.20,
    eliteHpMult: 1.80,
    stageHeal: 1,
    knockbackResist: 0.15,
    pillColor: '#f97316'
  },
  extreme: {
    name: 'EXTREME',
    hearts: 3,
    enemyHpMultiplier: 1.90,
    enemySpeedMult: 1.40,
    cookieDropRate: 0.09,
    enemyTelegraphMult: 0.48,
    maxConcurrentAttackers: 4,
    enemyEvasion: 0.16,
    eliteChance: 0.34,
    enemyAggression: 1.38,
    attackCooldownMult: 0.74,
    waveSizeBonus: 2,
    bossHpMult: 1.45,
    eliteHpMult: 2.00,
    stageHeal: 1,
    knockbackResist: 0.30,
    pillColor: '#ef4444'
  },
  diamond: {
    name: 'DIAMOND',
    hearts: 2,
    enemyHpMultiplier: 2.50,
    enemySpeedMult: 1.55,
    cookieDropRate: 0.03,
    enemyTelegraphMult: 0.36,
    maxConcurrentAttackers: 4,
    enemyEvasion: 0.24,
    eliteChance: 0.55,
    enemyAggression: 1.60,
    attackCooldownMult: 0.62,
    waveSizeBonus: 3,
    bossHpMult: 1.80,
    eliteHpMult: 2.20,
    stageHeal: 0,           // no recovery between episodes
    knockbackResist: 0.45,
    pillColor: '#a855f7'
  }
};

// Canonical order used by the quick-cycle button and the difficulty panel.
const DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'extreme', 'diamond'];

// ============================================================================
// 6.1. CANONICAL SAVE THE LIGHT / UNLEASH THE LIGHT CHARACTER PORTRAITS (SVG)
// ============================================================================
const GUARDIAN_PORTRAITS = {
  steven: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Steven Sculpted Cloud-Curl Crown (Espresso Brown with inner C-swirls) -->
    <path d="M 12 36 C 8 28 10 18 18 14 C 22 10 30 8 35 12 C 40 8 49 10 52 16 C 58 22 57 32 52 38 C 50 44 44 48 38 48 C 30 50 20 48 14 42 Z" fill="#26151c"/>
    <path d="M 18 19 Q 24 14 30 18" stroke="#3b252c" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 33 14 Q 40 12 46 17" stroke="#3b252c" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 14 28 Q 11 20 18 22" stroke="#3b252c" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Face / Head -->
    <ellipse cx="32" cy="33" rx="18.5" ry="17.5" fill="#fbd0be"/>
    <ellipse cx="19" cy="37" rx="5" ry="3.5" fill="#f43f5e" opacity="0.35"/>
    <ellipse cx="45" cy="37" rx="5" ry="3.5" fill="#f43f5e" opacity="0.35"/>
    <!-- Big Expressive Cartoon Eyes (Save the Light Style) -->
    <ellipse cx="25" cy="30" rx="4.5" ry="6" fill="#1e102d"/>
    <ellipse cx="39" cy="30" rx="4.5" ry="6" fill="#1e102d"/>
    <ellipse cx="26" cy="28.5" rx="1.8" ry="2.5" fill="#ffffff"/>
    <ellipse cx="40" cy="28.5" rx="1.8" ry="2.5" fill="#ffffff"/>
    <circle cx="24" cy="32" r="0.8" fill="#ffffff"/>
    <circle cx="38" cy="32" r="0.8" fill="#ffffff"/>
    <!-- Arched Eyebrows -->
    <path d="M 20 22 Q 25 18 29 21" stroke="#1e102d" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 44 22 Q 39 18 35 21" stroke="#1e102d" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Huge Open Teeny Smile with Upper Teeth Band & Crimson Depth -->
    <path d="M 23 37 Q 32 37 41 37 Q 41 49 32 49 Q 23 49 23 37 Z" fill="#881337"/>
    <path d="M 23 37 Q 32 37 41 37 Q 40 42 32 42 Q 24 42 23 37 Z" fill="#ffffff"/>
    <path d="M 27 45 Q 32 43 37 45 Q 35 48 32 48 Q 29 48 27 45 Z" fill="#f472b6"/>
    <!-- Red Shirt & Star -->
    <path d="M 16 50 Q 32 54 48 50 L 52 64 L 12 64 Z" fill="#ff5975"/>
    <polygon points="32,49 34.5,55 40,55 35.5,58.5 37,64 32,60.5 27,64 28.5,58.5 24,55 29.5,55" fill="#fde047"/>
  </svg>`,

  garnet: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- 3D Beveled Cubic Box Afro -->
    <rect x="11" y="9" width="42" height="30" rx="5" fill="#200a2e"/>
    <path d="M 11 14 L 32 10 L 53 14" stroke="#701a75" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <polygon points="11,9 53,9 49,15 15,15" fill="#4a044e" opacity="0.6"/>
    <!-- Face / Jaw -->
    <polygon points="19,30 45,30 42,48 22,48" fill="#78350f"/>
    <!-- Iconic Angular Visor (Ruby & Sapphire Shimmer) -->
    <defs>
      <linearGradient id="garnetVisorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <polygon points="15,26 49,26 44,38 20,38" fill="url(#garnetVisorGrad)"/>
    <polygon points="17,27 47,27 44,30 20,30" fill="#ffffff" opacity="0.6"/>
    <!-- Golden Star Specular Glint (Unleash the Light) -->
    <polygon points="32,27 33.5,31 37,32 33.5,33 32,37 30.5,33 27,32 30.5,31" fill="#fde047" opacity="0.95"/>
    <!-- Stoic Mouth / Lips -->
    <rect x="28" y="43" width="8" height="2" rx="1" fill="#be185d"/>
    <!-- Asymmetrical Bodysuit Collar -->
    <path d="M 12 48 L 32 50 L 32 64 L 10 64 Z" fill="#881337"/>
    <path d="M 32 50 L 52 48 L 54 64 L 32 64 Z" fill="#1e1b4b"/>
    <!-- Cubic Shoulder Armor -->
    <polygon points="8,48 16,46 14,56 6,56" fill="#be123c"/>
    <polygon points="56,48 48,46 50,56 58,56" fill="#312e81"/>
  </svg>`,

  pearl: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Conical Peach Hair Sweeping Gracefully BACKWARD (-X) -->
    <path d="M 30 7 Q 12 11 4 22 Q 13 32 25 28 Z" fill="#fed7aa"/>
    <path d="M 28 9 Q 14 13 7 22 Q 15 29 24 26 Z" fill="#fbcfe8"/>
    <!-- Porcelain Head in Profile -->
    <ellipse cx="32" cy="30" rx="14" ry="15" fill="#fff7ed"/>
    <!-- Sharp Pointed Nose pointing FORWARD (+X) -->
    <polygon points="38,28 50,31 38,34" fill="#fed7aa"/>
    <!-- Forehead Luminous Oval Pearl Gemstone -->
    <ellipse cx="32" cy="18" rx="4.5" ry="6.5" fill="#ffffff" stroke="#38bdf8" stroke-width="1.2"/>
    <ellipse cx="31" cy="16.5" rx="1.6" ry="2.5" fill="#e0f2fe"/>
    <!-- Expressive Cyan Anime Eye in Profile -->
    <ellipse cx="34" cy="29" rx="4" ry="5.5" fill="#0284c7"/>
    <ellipse cx="35" cy="28.5" rx="2.5" ry="3.8" fill="#082f49"/>
    <circle cx="36" cy="27.5" r="1.3" fill="#ffffff"/>
    <path d="M 30 22 Q 35 20 40 23" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Peach Blush & Cheerful Smile -->
    <ellipse cx="34" cy="35" rx="3.5" ry="2" fill="rgba(251, 146, 60, 0.4)"/>
    <path d="M 32 37 Q 37 40 41 37" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <!-- Cyan Ballerina Tunic & Gold Star -->
    <path d="M 18 46 Q 32 50 46 46 L 49 64 L 15 64 Z" fill="#38bdf8"/>
    <polygon points="32,48 34,53 39,53 35,56 36.5,61 32,58 27.5,61 29,56 25,53 30,53" fill="#fde047"/>
    <!-- Translucent Pink Sash -->
    <path d="M 14 56 Q 32 60 50 56 L 48 60 Q 32 64 16 60 Z" fill="rgba(255, 148, 186, 0.8)"/>
  </svg>`,

  amethyst: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Long Voluminous Flowing WAVY Pale-Lilac Hair Cascading Past Shoulders -->
    <path d="M 32 8 C 14 8 6 22 6 36 C 6 48 10 58 14 62 C 18 54 18 46 22 38 C 24 30 28 20 32 18 C 36 20 42 30 44 40 C 46 48 48 56 52 62 C 58 56 60 44 60 34 C 60 18 48 8 32 8 Z" fill="#e9d5ff"/>
    <path d="M 10 32 C 8 44 14 54 18 60 C 16 52 14 44 18 36" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 54 32 C 56 44 50 54 46 60 C 48 52 50 44 46 36" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Purple Face -->
    <circle cx="34" cy="33" r="15.5" fill="#d8b4fe"/>
    <!-- Mischievous Smirking Quartz Grin with White Teeth -->
    <path d="M 28 39 Q 36 41 43 37 Q 40 45 33 45 Q 28 45 28 39 Z" fill="#3b0764"/>
    <path d="M 28 39 Q 36 41 43 37 Q 38 41 33 41 Q 29 41 28 39 Z" fill="#ffffff"/>
    <!-- Dark Purple Eye (Right Eye visible) -->
    <ellipse cx="38" cy="31" rx="4" ry="5.5" fill="#3b0764"/>
    <circle cx="39.5" cy="29.5" r="1.6" fill="#ffffff"/>
    <path d="M 33 24 Q 38 21 43 23" stroke="#3b0764" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Flowing Wavy Mane Cascading OVER Left Eye (Signature S-Curve Lock) -->
    <path d="M 22 10 Q 32 14 28 26 Q 22 36 24 50 Q 16 40 18 24 Z" fill="#d8b4fe"/>
    <path d="M 26 12 Q 34 20 30 32 Q 26 40 28 54 Q 22 44 24 28 Z" fill="#e9d5ff"/>
    <!-- Hexagonal Faceted Amethyst Gem on Chest -->
    <polygon points="32,49 35,51 35,55 32,57 29,55 29,51" fill="#7e22ce" stroke="#f3e8ff" stroke-width="1"/>
    <!-- Dark Tank Top with Star Strap -->
    <path d="M 18 52 Q 32 56 46 52 L 48 64 L 16 64 Z" fill="#1e1b4b"/>
  </svg>`,

  connie: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Flowing Dark Wavy Hair Cascading Past Shoulders -->
    <path d="M 32 10 C 16 10 8 22 8 36 C 8 48 12 56 16 62 C 20 54 20 44 22 34 C 24 22 40 22 42 34 C 44 44 44 54 48 62 C 52 56 56 48 56 36 C 56 22 48 10 32 10 Z" fill="#1c1917"/>
    <path d="M 12 36 C 10 46 16 54 20 60" stroke="#292524" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 52 36 C 54 46 48 54 44 60" stroke="#292524" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Warm Brown Skin Face -->
    <ellipse cx="32" cy="34" rx="16" ry="16" fill="#a16207"/>
    <!-- Signature Turquoise / Teal Headband across Hair (Save the Light Key Item!) -->
    <path d="M 18 24 Q 32 16 46 24" stroke="#0d9488" stroke-width="4.2" stroke-linecap="round" fill="none"/>
    <!-- Expressive Dark Eyes & Determined Eyebrows -->
    <ellipse cx="26" cy="32" rx="4" ry="5.5" fill="#1c1917"/>
    <ellipse cx="38" cy="32" rx="4" ry="5.5" fill="#1c1917"/>
    <circle cx="27" cy="30.5" r="1.5" fill="#ffffff"/>
    <circle cx="39" cy="30.5" r="1.5" fill="#ffffff"/>
    <path d="M 21 24 Q 26 21 30 23" stroke="#1c1917" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 43 24 Q 38 21 34 23" stroke="#1c1917" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Confident Warrior Smile with Teeth -->
    <path d="M 26 40 Q 32 45 38 40 Z" fill="#ffffff" stroke="#78350f" stroke-width="1.2"/>
    <!-- Salmon Pink Polo Shirt with White Pointed Collar -->
    <path d="M 18 50 Q 32 54 46 50 L 48 64 L 16 64 Z" fill="#fb7185"/>
    <polygon points="26,50 32,56 30,50" fill="#ffffff"/>
    <polygon points="38,50 32,56 34,50" fill="#ffffff"/>
  </svg>`,

  lapis: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Liquid Translucent Cyan Hydro Wings Flanking Head -->
    <path d="M 16 32 Q 4 16 2 32 Q 10 38 16 36 Z" fill="rgba(56, 189, 248, 0.75)" stroke="#e0f2fe" stroke-width="1.2"/>
    <path d="M 48 32 Q 60 16 62 32 Q 54 38 48 36 Z" fill="rgba(56, 189, 248, 0.75)" stroke="#e0f2fe" stroke-width="1.2"/>
    <!-- Fluid Feathered Navy Bob Hair -->
    <ellipse cx="32" cy="28" rx="18" ry="18" fill="#1e3a8a"/>
    <path d="M 14 30 L 16 44 L 22 34 Z" fill="#1e3a8a"/>
    <path d="M 50 30 L 48 44 L 42 34 Z" fill="#1e3a8a"/>
    <!-- Azure Blue Skin Face -->
    <ellipse cx="32" cy="33" rx="14" ry="15" fill="#38bdf8"/>
    <!-- Angular Windswept Bangs -->
    <polygon points="20,20 26,30 32,22 38,30 44,20" fill="#1e3a8a"/>
    <!-- Serene / Mystical Blue Eyes -->
    <ellipse cx="26" cy="32" rx="3.5" ry="4.5" fill="#0c4a6e"/>
    <ellipse cx="38" cy="32" rx="3.5" ry="4.5" fill="#0c4a6e"/>
    <circle cx="27" cy="31" r="1.3" fill="#ffffff"/>
    <circle cx="39" cy="31" r="1.3" fill="#ffffff"/>
    <!-- Gentle Smile -->
    <path d="M 28 41 Q 32 44 36 41" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <!-- Royal Blue Halter Top & Golden Ribbon Tie -->
    <path d="M 20 48 Q 32 52 44 48 L 46 64 L 18 64 Z" fill="#1d4ed8"/>
    <polygon points="32,48 30,53 34,53" fill="#fbbf24"/>
  </svg>`,

  peridot: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Sculpted 3D Tetrahedral Chartreuse Hair (Iconic Faceted Dorito Shape!) -->
    <polygon points="32,6 54,34 10,34" fill="#d9f99d"/>
    <polygon points="32,8 52,33 32,24" fill="#bef264"/>
    <polygon points="32,8 32,24 12,33" fill="#a3e635" opacity="0.75"/>
    <!-- Lime Green Face -->
    <polygon points="20,28 44,28 40,46 24,46" fill="#a3e635"/>
    <!-- Forehead Triangular Peridot Gem -->
    <polygon points="32,21 35,26 29,26" fill="#4ade80" stroke="#15803d" stroke-width="0.8"/>
    <!-- Winged Yellow Visor Glasses (Change Your Mind / Save the Light) -->
    <polygon points="16,28 32,32 48,28 46,38 32,40 18,38" fill="rgba(250, 204, 21, 0.95)" stroke="#ffffff" stroke-width="1.2"/>
    <circle cx="26" cy="33" r="1.3" fill="#ffffff"/>
    <circle cx="38" cy="33" r="1.3" fill="#ffffff"/>
    <!-- Smug Smirk -->
    <path d="M 28 42 Q 33 45 37 42" stroke="#15803d" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Tech Uniform with Yellow Diamond Insignia -->
    <path d="M 18 48 Q 32 52 46 48 L 48 64 L 16 64 Z" fill="#15803d"/>
    <polygon points="32,50 35,54 32,58 29,54" fill="#facc15"/>
  </svg>`,

  bismuth: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Thick Curved Tubular Rainbow Dreadlocks Bundled by Headband -->
    <path d="M 14 26 C 10 18 16 10 24 10 C 22 16 20 22 18 28 Z" fill="#ef4444"/>
    <path d="M 22 12 C 22 8 28 6 34 8 C 32 14 30 20 28 26 Z" fill="#f97316"/>
    <path d="M 32 8 C 36 6 42 8 44 12 C 40 18 38 24 36 28 Z" fill="#eab308"/>
    <path d="M 42 12 C 48 10 52 14 52 20 C 48 24 44 28 42 32 Z" fill="#22c55e"/>
    <path d="M 48 20 C 54 22 56 28 54 34 C 50 36 46 36 44 38 Z" fill="#3b82f6"/>
    <path d="M 52 32 C 56 36 56 42 52 46 C 48 46 46 42 46 40 Z" fill="#a855f7"/>
    <!-- Dark Leather Hair Tie -->
    <path d="M 18 22 Q 34 16 50 22" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Muscular Slate-Blue Face -->
    <circle cx="32" cy="33" r="16" fill="#94a3b8"/>
    <!-- Big Friendly Eyes & Bushy Brows -->
    <ellipse cx="26" cy="28" rx="3.5" ry="4.5" fill="#1e293b"/>
    <ellipse cx="38" cy="28" rx="3.5" ry="4.5" fill="#1e293b"/>
    <circle cx="27" cy="27" r="1.2" fill="#ffffff"/>
    <circle cx="39" cy="27" r="1.2" fill="#ffffff"/>
    <path d="M 22 22 Q 26 20 30 22" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 42 22 Q 38 20 34 22" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Broad Grin with Big White Teeth -->
    <path d="M 23 37 Q 32 46 41 37 Z" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
    <!-- 98-Facet Stepped-Pyramid Chest Gemstone -->
    <rect x="27" y="50" width="10" height="10" fill="#ec4899"/>
    <rect x="29" y="52" width="6" height="6" fill="#06b6d4"/>
    <rect x="31" y="54" width="2" height="2" fill="#eab308"/>
    <!-- Blacksmith Apron & Star Strap -->
    <path d="M 14 50 L 50 50 L 52 64 L 12 64 Z" fill="#78350f"/>
    <line x1="16" y1="50" x2="38" y2="64" stroke="#f59e0b" stroke-width="2"/>
  </svg>`,

  jasper: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Massive Swept-Back WAVY Pale Peach-Cream Lion's Mane Cascading Behind Shoulders -->
    <path d="M 32 6 C 14 6 6 18 6 34 C 6 48 10 58 14 62 C 16 52 18 44 20 36 C 22 26 26 18 32 16 C 38 18 42 26 44 36 C 46 44 48 52 50 62 C 54 58 58 48 58 34 C 58 18 50 6 32 6 Z" fill="#fed7aa"/>
    <path d="M 10 32 C 8 44 12 54 16 60 C 14 50 14 42 18 34" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 54 32 C 56 44 52 54 48 60 C 50 50 50 42 46 34" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Widow's Peak Crown Crest -->
    <polygon points="32,12 36,20 28,20" fill="#fed7aa"/>
    <!-- Broad Orange Face with Dark Red Tiger Stripes -->
    <polygon points="18,24 46,24 42,48 22,48" fill="#ea580c"/>
    <path d="M 18 28 L 26 30 L 18 34 Z" fill="#991b1b"/>
    <path d="M 46 28 L 38 30 L 46 34 Z" fill="#991b1b"/>
    <path d="M 28 24 L 32 30 L 36 24 Z" fill="#991b1b"/>
    <!-- Faceted Amber Gemstone ON NOSE -->
    <polygon points="32,32 36,37 32,41 28,37" fill="#b45309" stroke="#f59e0b" stroke-width="1"/>
    <!-- Fierce Golden Eyes -->
    <ellipse cx="24" cy="29" rx="3.5" ry="4" fill="#fbbf24"/>
    <ellipse cx="40" cy="29" rx="3.5" ry="4" fill="#fbbf24"/>
    <ellipse cx="24" cy="29" rx="1.8" ry="3" fill="#450a0a"/>
    <ellipse cx="40" cy="29" rx="1.8" ry="3" fill="#450a0a"/>
    <!-- Fierce Warrior Scowl -->
    <path d="M 26 44 L 38 43" stroke="#450a0a" stroke-width="2" stroke-linecap="round"/>
    <!-- Maroon Tunic with Yellow Diamond -->
    <path d="M 16 50 Q 32 54 48 50 L 50 64 L 14 64 Z" fill="#7f1d1d"/>
    <polygon points="32,51 35,55 32,59 29,55" fill="#fde047"/>
  </svg>`,

  rose: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Cascading Voluminous Pink Spiral Rose-Tube Ringlets with Hollow Centers -->
    <path d="M 32 8 C 16 8 8 20 8 36 C 8 48 12 56 16 62 C 20 54 20 44 22 36 C 24 24 40 24 42 36 C 44 44 44 54 48 62 C 52 56 56 48 56 36 C 56 20 48 8 32 8 Z" fill="#f472b6"/>
    <!-- Hollow Center Spirals -->
    <path d="M 12 28 C 10 36 14 44 18 42 C 20 40 18 34 16 36" stroke="#db2777" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 52 28 C 54 36 50 44 46 42 C 44 40 46 34 48 36" stroke="#db2777" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 16 46 C 14 52 18 58 22 56" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 48 46 C 50 52 46 58 42 56" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Gentle Romantic Curtain Bangs -->
    <path d="M 22 18 Q 32 22 42 18 Q 32 26 22 18 Z" fill="#fbcfe8"/>
    <!-- Gentle Peach Face -->
    <ellipse cx="32" cy="33" rx="15" ry="16" fill="#fed7aa"/>
    <!-- Gentle Eyes with Eyelashes -->
    <ellipse cx="26" cy="31" rx="3.5" ry="4.5" fill="#1e102d"/>
    <ellipse cx="38" cy="31" rx="3.5" ry="4.5" fill="#1e102d"/>
    <circle cx="27" cy="30" r="1.3" fill="#ffffff"/>
    <circle cx="39" cy="30" r="1.3" fill="#ffffff"/>
    <!-- Sweet Pink Smile -->
    <path d="M 27 40 Q 32 44 37 40" stroke="#db2777" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <!-- Tiered White Gown with Star Cutout & Navel Gem -->
    <path d="M 16 50 Q 32 54 48 50 L 52 64 L 12 64 Z" fill="#ffffff"/>
    <polygon points="32,52 34,56 38,56 35,59 36,63 32,60 28,63 29,59 26,56 30,56" fill="#f43f5e"/>
    <circle cx="32" cy="58" r="2.2" fill="#fbcfe8"/>
  </svg>`
};

function getGuardianSvg(charId, size = 44) {
  const svg = GUARDIAN_PORTRAITS[charId] || GUARDIAN_PORTRAITS.steven;
  return `<span class="guardian-svg-wrap" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${svg}</span>`;
}

const GUARDIAN_DATA = {
  steven: {
    id: 'steven',
    name: 'Steven Universe',
    icon: '⭐',
    types: ['FAIRY', 'PSYCHIC'],
    title: 'The Heart of the Crystal Gems',
    desc: 'Rose Punch Combo • Bouncing Shield Throw • Crystalline Bubble & Healing Saliva (+1 Heart)',
    lore: 'Half-human, half-gem hero. Uses Rose Quartz\'s magical shield, his canon healing saliva, and channels his terrifying Pink Overdrive state — plus a well-earned Cookie Cat snack when things get rough!',
    j: { name: 'Shield Strike', icon: '🛡️', desc: 'Fast shield bash and punch combo with pink star sparks' },
    k: { name: 'Shield Throw', icon: '💫', desc: 'Bouncing Rose Shield projectile ricocheting off foes (35 DMG)' },
    l: { name: 'Bubble & Heal', icon: '🫧', desc: 'Spawns a crystalline Bubble Shield shockwave and restores +1 Heart with his healing saliva (canon power)' }
  },
  garnet: {
    id: 'garnet',
    name: 'Garnet',
    icon: '🥊',
    types: ['FIGHT', 'PSYCHIC'],
    title: 'Leader of the Crystal Gems (Ruby & Sapphire Fusion)',
    desc: 'Heavy Gauntlet Combo • Rocket Gauntlet Blast • Giant Gauntlets Seismic Slam',
    lore: 'Physical powerhouse and leader of the Crystal Gems. Made of love, packing twin spiked rocket gauntlets and the ability to enlarge them into titanic Giant Gauntlets that crush the earth!',
    j: { name: 'Gauntlet Combo', icon: '🥊', desc: 'Heavy dual spiked gauntlet punch flurry with KAPOW! impact' },
    k: { name: 'Rocket Gauntlet', icon: '🚀', desc: 'Fires rocket-propelled spiked gauntlets across the screen (40 DMG)' },
    l: { name: 'Giant Gauntlets Slam', icon: '💥', desc: 'Enlarges gauntlets to titanic size and slams downward with high-voltage seismic tremor (65 DMG)' }
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst',
    icon: '🟣',
    types: ['FIGHT', 'DARK'],
    title: 'Wild Earth-Born Quartz Warrior',
    desc: 'Spiked Dual Whip Flurry • Sonic Spin Dash (Quartz Buzzsaw) • Dual Whip Violet Energy Geysers',
    lore: 'Earth-born warrior from Prime Kindergarten. Attacks with spiked dual whips, curls into a high-speed rotating Quartz Buzzsaw ball, and erupts 4 rising violet volcanic energy geysers!',
    j: { name: 'Whip Flurry', icon: '🟣', desc: 'Dual whip slashing combo sweeping through nearby enemies' },
    k: { name: 'Sonic Spin Dash', icon: '🌀', desc: 'Authentic Quartz Buzzsaw roll charging through enemy ranks at high speed (45 DMG)' },
    l: { name: 'Whip Quake', icon: '🔥', desc: 'Slams both whips into the ground, cracking the arena in four violet shockwaves (40 DMG each)' }
  },
  pearl: {
    id: 'pearl',
    name: 'Pearl',
    icon: '🗡️',
    types: ['PSYCHIC', 'FIGHT'],
    title: 'Elegant Tactician & Master Spearwoman',
    desc: 'Spear Flurry • Laser Blast • Holo-Pearl Training Clone',
    lore: 'Graceful swordmaster and spear prodigy. Summons holographic Holo-Pearl sparring clones and pierces corruptions with laser beams!',
    j: { name: 'Spear Flurry', icon: '🗡️', desc: 'Rapid thrusting spear combo piercing enemy defenses' },
    k: { name: 'Holo-Spear Volley', icon: '✨', desc: 'Projects three hard-light Holo-Pearl spears that pierce through the corruption (35 DMG)' },
    l: { name: 'Holo-Pearl Clone', icon: '🤺', desc: 'Summons an animated holographic sparring clone that dashes forward lunging with fencing thrusts (55 DMG)' }
  },
  bismuth: {
    id: 'bismuth',
    name: 'Bismuth',
    icon: '🔨',
    types: ['STEEL', 'FIGHT'],
    title: 'Master Blacksmith & Weapon Forger',
    desc: 'Heavy Knockback Hammers • Forged Anvil Toss • Breaking Point Molten Fissure',
    lore: 'Legendary Crystal Gem blacksmith with a 98-facet rainbow crystal. Her brutal hammer swings and anvil launches send enemies flying backward, while the Breaking Point ruptures molten fissures!',
    j: { name: 'Heavy Hammer', icon: '🔨', desc: 'Crushing shapeshifted hammer strike that sends monsters flying backward' },
    k: { name: 'Forged Anvil', icon: '🔩', desc: 'Hurls an incandescent forged anvil projectile dealing heavy impact and knockback (50 DMG)' },
    l: { name: 'Breaking Point', icon: '🌋', desc: 'Shatters the ground with the Breaking Point, catapulting enemies into the air with lava plumes (70 DMG)' }
  },
  peridot: {
    id: 'peridot',
    name: 'Peridot',
    icon: '🔩',
    types: ['STEEL', 'ELECTR'],
    title: 'Certified Kindergartener & Metal Master',
    desc: 'Ferrokinetic Swipes • Scrap Metal Salvo (3 Magnetic Scraps) • Flask Robonoid Drone & EMP Vortex',
    lore: 'Former Homeworld technician who discovered ferrokinesis on Earth! Controls metal scraps, hurls levitating scrap salvos, and deploys Homeworld Flask Robonoids with EMP magnetic vortex fields!',
    j: { name: 'Magnetic Swipe', icon: '🔩', desc: 'Quick ferrokinetic scrap swipe combo knocking back targets' },
    k: { name: 'Scrap Salvo', icon: '⚙️', desc: 'Levitates and hurls 3 magnetic scrap chunks: steel girder, gear, and trash lid (24 DMG each)' },
    l: { name: 'Flask Robonoid', icon: '🤖', desc: 'Deploys a walking Homeworld Flask Robonoid drone & concentric Magnetic EMP Vortex (55 DMG)' }
  },
  lapis: {
    id: 'lapis',
    name: 'Lapis Lazuli',
    icon: '💧',
    types: ['WATER', 'FLYING'],
    title: 'Powerful Hydrokinetic Gem',
    desc: 'Water Scythe Combo • Hydro Fist • Giant Tidal Wave Surge',
    lore: 'Powerful Gem capable of controlling Earth\'s oceans. Manifests majestic liquid water wings and summons tidal waves!',
    j: { name: 'Water Scythe', icon: '💧', desc: 'Fluid liquid blade slash combo cutting through multiple monsters' },
    k: { name: 'Hydro Fist', icon: '🌊', desc: 'Launches a massive pressurized water fist projectile (40 DMG)' },
    l: { name: 'Tidal Wave', icon: '🌀', desc: 'Summons a roaring ocean tidal wave crashing across the battlefield (60 DMG)' }
  },
  rose: {
    id: 'rose',
    name: 'Rose Quartz',
    icon: '🌹',
    types: ['FIGHT', 'FAIRY'],
    title: 'Founder & Commander of the Rebellion',
    desc: 'Rose Broadsword Slash • Bouncing Rose Crest • Sacred Tears of Resurrection (+2 Hearts)',
    lore: 'Rebel leader who fought for organic life on Earth. Wields her custom broadsword, throws her indestructible spinning crest shield, and weeps Sacred Tears of Life that blossom into a pink mandala restoring +2 Hearts and dropping 2 Cookie Cats!',
    j: { name: 'Rose Sword', icon: '🌹', desc: 'Graceful broadsword strikes with rose petal flurry and impact stars' },
    k: { name: 'Rose Crest Shield', icon: '🛡️', desc: 'Hurls high-speed spinning Rose Quartz crest shield (40 DMG)' },
    l: { name: 'Sacred Tears of Life', icon: '💖', desc: 'Blossoms an 8-petaled Rose Mandala shockwave, restoring +2 Hearts and spawning 2 Cookie Cats (50 DMG)' }
  },
  connie: {
    id: 'connie',
    name: 'Connie Maheswaran',
    icon: '⚔️',
    types: ['NORMAL', 'FIGHT'],
    title: 'Swordmaster & Knight of the Crystal Gems',
    desc: 'Knight Fencing Flurry • Pink Sword Flying Arc • Shadow Step Blade Dash',
    lore: 'Human sword prodigy trained in classical fencing and combat choreography by Pearl. Armed with the custom Pink Sword forged by Bismuth, Connie dashes swiftly across battlefields, parrying corruptions and executing high-velocity sword flurries!',
    j: { name: 'Knight\'s Flurry', icon: '⚔️', desc: 'Rapid 3-hit fencing thrust and crescent slash combo (En Garde!)' },
    k: { name: 'Sword Dash Slash', icon: '💫', desc: "Rose's sword carves a crescent of air as Connie lunges through the enemy line (42 DMG)" },
    l: { name: 'Tactical Parry', icon: '⚡', desc: 'The guard stance Pearl drilled into her — slips through every strike, then answers it (60 DMG)' }
  },
  jasper: {
    id: 'jasper',
    name: 'Jasper',
    icon: '💥',
    types: ['FIGHT', 'DRAGON'],
    title: 'Supreme Beta Quartz Juggernaut',
    desc: 'Beta Brawler Flurry • Crash Helmet Ram • Quartz Tornado Spin Dash',
    lore: 'The ultimate Quartz soldier born from the Beta Kindergarten. Unrivaled physical strength, unstoppable inertia, and master of the Comet Crash Helmet and flaming Quartz Spin Dash. When enraged, she enters a hyper-armored juggernaut frenzy that shatters the earth!',
    j: { name: 'Beta Brawler', icon: '👊', desc: 'Brutal gut punch and seismic hammer fist flurry with heavy knockback' },
    k: { name: 'Crash Helmet Ram', icon: '🪖', desc: 'Summons spiky bronze Crash Helmet, rocketing forward like a battering ram (52 DMG)' },
    l: { name: 'Quartz Tornado', icon: '🔥', desc: 'Curls into a flaming spiked Beta Spin Dash ball erupting seismic shockwaves (65 DMG)' }
  }
};

// ============================================================================
// 6.2. CANONICAL GEM FUSION REGISTRY (OFFICIAL STEVEN UNIVERSE LORE)
// ============================================================================
const CANON_FUSIONS = {
  'connie+steven': {
    id: 'stevonnie',
    name: 'Stevonnie',
    title: 'Knight & Guardian',
    gems: ['steven', 'connie'],
    icon: '⚔️🛡️',
    weapon: 'Rose’s Sword & Shield',
    color: '#ec4899',
    glowColor: '#f472b6',
    scale: 1.25,
    maxHpBonus: 100,
    quote: '"I am an experience! Stevonnie, sword and shield!"',
    j: { name: 'Sword & Shield Strikes', desc: 'Rapid blade slashes and shield bash' },
    k: { name: 'Shield Hover Dropkick', desc: 'Glides on shield and dropkicks' },
    l: { name: 'Rose Sword Wave', desc: 'Giant crescent blade shockwave' }
  },
  'amethyst+steven': {
    id: 'smoky',
    name: 'Smoky Quartz',
    title: 'Yo-Yo Brawler',
    gems: ['steven', 'amethyst'],
    icon: '🪀🌪️',
    weapon: 'Triple Yo-Yo',
    color: '#a855f7',
    glowColor: '#c084fc',
    scale: 1.35,
    maxHpBonus: 120,
    quote: '"What does a fusion of an Amethyst and a Steven make? Smoky Quartz!"',
    j: { name: 'Triple Yo-Yo Flurry', desc: 'Sweeping 3-armed yo-yo swings' },
    k: { name: 'Yo-Yo Grapple Slam', desc: 'Pulls enemies in and slams them' },
    l: { name: 'Cyclone Tornado', desc: 'Supersonic yo-yo vacuum whirlwind' }
  },
  'pearl+steven': {
    id: 'rainbow2',
    name: 'Rainbow Quartz 2.0',
    title: 'Acrobatic Showman',
    gems: ['steven', 'pearl'],
    icon: '☂️🌈',
    weapon: 'Magic Rainbow Parasol',
    color: '#38bdf8',
    glowColor: '#f472b6',
    scale: 1.3,
    maxHpBonus: 115,
    quote: '"Well, hello there! Did you miss us?"',
    j: { name: 'Parasol Fencing', desc: 'Rapier thrusts and umbrella spin' },
    k: { name: 'Rocket Parasol Float', desc: 'Rockets forward with rainbow trail' },
    l: { name: 'Prism Laser Cannon', desc: 'Giant rainbow laser cannon' }
  },
  'garnet+steven': {
    id: 'sunstone',
    name: 'Sunstone',
    title: 'Solar Superhero',
    gems: ['steven', 'garnet'],
    icon: '☀️🔥',
    weapon: 'Flame Suction Gauntlets',
    color: '#f97316',
    glowColor: '#fde047',
    scale: 1.45,
    maxHpBonus: 140,
    quote: '"Always remember to stay in school and check both ways before crossing!"',
    j: { name: 'Solar Flame Punches', desc: 'Rapid flaming fist strikes' },
    k: { name: 'Solar Rocket Fist', desc: 'Launches rocket gauntlet forward' },
    l: { name: 'Supernova Burst', desc: 'Full-screen solar flare blast' }
  },
  'amethyst+garnet': {
    id: 'sugilite',
    name: 'Sugilite',
    title: 'Power Titan',
    gems: ['garnet', 'amethyst'],
    icon: '🟣⛓️',
    weapon: 'Spiked Wrecking Flail',
    color: '#7e22ce',
    glowColor: '#9333ea',
    scale: 1.65,
    maxHpBonus: 180,
    quote: '"You like that, little man? You want some more?!"',
    j: { name: 'Spiked Flail Smash', desc: 'Heavy crushing flail swings' },
    k: { name: 'Earthquake Stomp', desc: 'Ground shockwaves in both directions' },
    l: { name: 'Flail Cataclysm', desc: 'Crater explosion on the ground' }
  },
  'garnet+pearl': {
    id: 'sardonyx',
    name: 'Sardonyx',
    title: 'Theatrical Showstopper',
    gems: ['garnet', 'pearl'],
    icon: '🔨✨',
    weapon: 'Colossal War Hammer',
    color: '#fb7185',
    glowColor: '#fdba74',
    scale: 1.55,
    maxHpBonus: 150,
    quote: '"Good evening, everybody! It is I, the lovely Sardonyx!"',
    j: { name: 'War Hammer Swings', desc: 'Hammer strikes with spinning waist' },
    k: { name: 'Hammer Drill Charge', desc: 'Spins 360 degrees drilling forward' },
    l: { name: 'Showstopper Finale', desc: 'Spotlight fireworks stage blast' }
  },
  'amethyst+pearl': {
    id: 'opal',
    name: 'Opal',
    title: 'The Giant Woman Archer',
    gems: ['pearl', 'amethyst'],
    icon: '🏹🌟',
    weapon: 'Giant Recurve Bow',
    color: '#818cf8',
    glowColor: '#c084fc',
    scale: 1.55,
    maxHpBonus: 135,
    quote: '"Stay low... All you wanna do is see me turn into a giant woman..."',
    j: { name: 'Bow & Arrow Strikes', desc: '4-armed palm and arrow strikes' },
    k: { name: '5-Arrow Light Volley', desc: 'Fires 5 fanning light arrows' },
    l: { name: 'Celestial Light Rain', desc: '24 golden arrows rain from above' }
  },
  'jasper+lapis': {
    id: 'malachite',
    name: 'Malachite',
    title: 'Abyssal Juggernaut',
    gems: ['lapis', 'jasper'],
    icon: '🌊🧊',
    weapon: 'Water Wings & Ice Claws',
    color: '#0d9488',
    glowColor: '#2dd4bf',
    scale: 1.75,
    maxHpBonus: 190,
    quote: '"I\'m done being everyone\'s prisoner. Now you\'re my prisoner! And I\'m never letting you go!"',
    j: { name: 'Six-Arm Hydro Claws', desc: 'Crushing water claw thrashes' },
    k: { name: 'Glacial Ice Slam', desc: 'Summons frozen ice fist from below' },
    l: { name: 'Abyssal Tsunami Cage', desc: 'Two tidal waves crash together' }
  },
  'pearl+rose': {
    id: 'rainbowClassic',
    name: 'Rainbow Quartz',
    title: 'Rebellion Dancer',
    gems: ['rose', 'pearl'],
    icon: '🌹🩰',
    weapon: 'Rose Parasol & Rapier',
    color: '#f43f5e',
    glowColor: '#fda4af',
    scale: 1.45,
    maxHpBonus: 135,
    quote: '"What can I do for you? What can I do that no one else can do?"',
    j: { name: 'Ballet Blade Pirouette', desc: 'Spinning blade and parasol dance' },
    k: { name: 'Petal Barrier Thrust', desc: 'Charges with glowing rose shield' },
    l: { name: 'Prismatic Tears Dance', desc: 'Rose petal storm and team heal' }
  }
};

const COOP_FUSION_MOVES = {
  stevonnie: {
    p1: {
      j: { icon: '⚔️', name: 'Knight Rapier', type: 'ATTACK' },
      k: { icon: '🛡️', name: 'Hover Dropkick', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🛡️', name: 'Shield Bash Rush', type: 'ATTACK' },
      k: { icon: '⚔️', name: 'Rose Sword Wave', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  smoky: {
    p1: {
      j: { icon: '🪀', name: 'Yo-Yo Whip Flurry', type: 'ATTACK' },
      k: { icon: '💫', name: 'Yo-Yo Grapple Slam', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🛡️', name: 'Shield Yo-Yo Spin', type: 'ATTACK' },
      k: { icon: '🌪️', name: 'Cyclone Whirlwind', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  rainbow2: {
    p1: {
      j: { icon: '☂️', name: 'Parasol Thrust', type: 'ATTACK' },
      k: { icon: '🚀', name: 'Rocket Parasol', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '✨', name: 'Rainbow Flourish', type: 'ATTACK' },
      k: { icon: '🌈', name: 'Prismatic Laser', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  sunstone: {
    p1: {
      j: { icon: '☀️', name: 'Suction Slap', type: 'ATTACK' },
      k: { icon: '🥊', name: 'Solar Rocket Punch', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🛡️', name: 'Solar Shield Slam', type: 'ATTACK' },
      k: { icon: '🛹', name: 'Safety PSA Wave', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  sugilite: {
    p1: {
      j: { icon: '🟣', name: 'Giant Flail Sweep', type: 'ATTACK' },
      k: { icon: '💥', name: 'Earthquake Stomp', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🥊', name: 'Dual Fist Smash', type: 'ATTACK' },
      k: { icon: '☄️', name: 'Wrecking Catapult', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  sardonyx: {
    p1: {
      j: { icon: '🔨', name: 'War Hammer Smash', type: 'ATTACK' },
      k: { icon: '💫', name: 'Spinning Drill', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '✨', name: 'Stage Bow & Clap', type: 'ATTACK' },
      k: { icon: '💥', name: 'Colossal Slam', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  opal: {
    p1: {
      j: { icon: '🏹', name: 'Bow Slash Combo', type: 'ATTACK' },
      k: { icon: '✨', name: '5-Arrow Volley', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '💫', name: 'Piercing Light Shot', type: 'ATTACK' },
      k: { icon: '🌧️', name: 'Grand Light Rain', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  malachite: {
    p1: {
      j: { icon: '🌊', name: 'Hydro Crash Claws', type: 'ATTACK' },
      k: { icon: '🧊', name: 'Glacial Ice Slam', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '💧', name: 'Water Wing Whirl', type: 'ATTACK' },
      k: { icon: '🌊', name: 'Water Tomb Blast', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  rainbowClassic: {
    p1: {
      j: { icon: '🌹', name: 'Rose Petal Rapier', type: 'ATTACK' },
      k: { icon: '🛡️', name: 'Barrier Thrust', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '✨', name: 'Elegant Pirouette', type: 'ATTACK' },
      k: { icon: '🌸', name: 'Celestial Mandala', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  }
};

function getCanonFusion(charA, charB) {
  if (!charA || !charB || charA === charB) return null;
  const k1 = `${charA}+${charB}`;
  const k2 = `${charB}+${charA}`;
  return CANON_FUSIONS[k1] || CANON_FUSIONS[k2] || null;
}

function getCompatibleFusionPartners(charId) {
  const partners = [];
  const allChars = ['steven', 'garnet', 'amethyst', 'pearl', 'bismuth', 'peridot', 'lapis', 'rose', 'connie', 'jasper'];
  for (const other of allChars) {
    if (other !== charId) {
      const f = getCanonFusion(charId, other);
      if (f) partners.push({ partnerId: other, fusion: f });
    }
  }
  return partners;
}

// ============================================================================
// 6.5. BULLETPROOF PERSISTENT STORAGE (FALLS BACK TO MEMORY ON file:/// ORIGIN)
// ============================================================================
// ============================================================================
// 6.2. STORY SCRIPT — one beat per wave, following the show's own arc.
// Episodes 1-10 map onto Seasons 1-5, so the cast talks about what they are
// actually going through in that part of the story. `party` / `partner` resolve
// to whoever the player brought, so the lines stay in character for any roster.
// ============================================================================
const STORY_SCRIPT = {
  1: {
    map: 'Beach City Boardwalk',
    waves: [
      [{ w: 'garnet', t: "Centipeetles. Three of them, right on the boardwalk." },
       { w: 'steven',  t: "Three?! Okay. Okay okay okay. I can do three." },
       { w: 'amethyst', t: "You can do one. We'll take the other two." }],
      [{ w: 'pearl', t: "They're nesting behind the fry stand — mind the civilians!" },
       { w: 'amethyst', t: "Ohhh, so THAT'S why we don't just smash everything." },
       { w: 'pearl', t: "It has literally always been why, Amethyst." }],
      [{ w: 'steven', t: "Hey... that little one isn't attacking. It's guarding something." },
       { w: 'garnet', t: "Corrupted gems aren't evil, Steven. They're frightened." },
       { w: 'steven', t: "Then we bubble them gently. Nobody gets hurt." }],
      [{ w: 'amethyst', t: "Uh, guys? The big one's awake. Like, tower-of-mother big." },
       { w: 'pearl', t: "Formation! Backs to the water!" },
       { w: 'steven', t: "I've got the shield — let's finish this on the sand!" }]
    ],
    boss: [
      { w: 'villain', n: 'MOTHER CENTIPEETLE', i: '🐛', t: 'SCREEEEEE!' },
      { w: 'steven', t: "She's protecting her babies. We are NOT the enemy here." },
      { w: 'garnet', t: "Then show her, Steven. Kindness first. Shield second." }
    ]
  },
  2: {
    map: 'Galaxy Warp & Spire',
    waves: [
      [{ w: 'pearl', t: "The Galaxy Warp is cracked. Every pad we cross could fling us anywhere in the galaxy." },
       { w: 'garnet', t: "Then we walk. Slowly." },
       { w: 'amethyst', t: "Booooring. I vote fling." }],
      [{ w: 'steven', t: "This place is ancient. Like, before-Beach-City ancient." },
       { w: 'garnet', t: "Older than the town. Older than the coastline. Older than me." }],
      [{ w: 'pearl', t: "Blade Quartzes. They were soldiers once — Rose's own allies." },
       { w: 'steven', t: "Do they remember her?" },
       { w: 'pearl', t: "...I don't think they remember anything at all." }],
      [{ w: 'amethyst', t: "Spire's waking up. That's a LOT of stairs, even for me." },
       { w: 'steven', t: "Race you to the top?" },
       { w: 'amethyst', t: "You're on, chubs. Loser buys Cookie Cats." }]
    ],
    boss: [
      { w: 'villain', n: 'ANCIENT SPIRE GIANT BIRD', i: '🦅', t: 'KRAAAAA!' },
      { w: 'garnet', t: "It slept through the war. It doesn't even know it lost." },
      { w: 'steven', t: "Then let's put it back to sleep. Gently this time." }
    ]
  },
  3: {
    map: 'The Prime Kindergarten',
    waves: [
      [{ w: 'amethyst', t: "Welcome to my birthplace. Home sweet hole." },
       { w: 'steven', t: "You were... made here? Out of that wall?" },
       { w: 'amethyst', t: "Every hole is a gem. One of 'em's me." }],
      [{ w: 'pearl', t: "The injectors are still humming. This place should have died a thousand years ago." },
       { w: 'amethyst', t: "It's not dead, P. It's just empty. There's a difference." }],
      [{ w: 'amethyst', t: "Homeworld used this place up, then left it to rot — with us inside." },
       { w: 'steven', t: "That's horrible." },
       { w: 'amethyst', t: "Yeah. But I got you guys out of it. So. There's that." }],
      [{ w: 'amethyst', t: "Cluster mutants. Gems that didn't make it out of the ground right." },
       { w: 'steven', t: "Then we bubble every single one of them." },
       { w: 'amethyst', t: "Now you're talking like a Crystal Gem." }]
    ],
    boss: [
      { w: 'villain', n: 'KINDERGARTEN AMALGAM TITAN', i: '🪨', t: 'GRRRRAAAH!' },
      { w: 'amethyst', t: "That titan's the Kindergarten's last tantrum." },
      { w: 'steven', t: "Then let's give it a hug." },
      { w: 'amethyst', t: "A punch-hug. My favourite kind." }
    ]
  },
  4: {
    map: "Earth's Mantle — The Cluster",
    waves: [
      [{ w: 'peridot', t: "The Cluster is gestating at the planet's core. We have HOURS, not days!" },
       { w: 'steven', t: "Then we drill. Right now." },
       { w: 'peridot', t: "I hate that that's the plan. I hate that it's a GOOD plan!" }],
      [{ w: 'peridot', t: "Warning: mantle unstable. Also warning: I am extremely not built for this!" },
       { w: 'steven', t: "You're doing amazing, Peridot." },
       { w: 'peridot', t: "I know! Keep saying it!" }],
      [{ w: 'steven', t: "They're all fused together down here. Millions of them." },
       { w: 'peridot', t: "They didn't choose it. Nobody asked them. That's what Homeworld DOES." }],
      [{ w: 'peridot', t: "If the Cluster wakes, Earth cracks like an egg and we are the YOLK!" },
       { w: 'garnet', t: "Then it stays asleep. Permanently." },
       { w: 'peridot', t: "Garnet said 'permanently' and I felt that in my gem." }]
    ],
    boss: [
      { w: 'villain', n: 'GEO-WEAPON CLUSTER CORE', i: '🌋', t: '...who... am... I...' },
      { w: 'peridot', t: "It's aware! It's confused! It's ALSO enormous!" },
      { w: 'steven', t: "Then we talk to it. Gems can be talked to." }
    ]
  },
  5: {
    map: "Bismuth's Burning Forge",
    waves: [
      [{ w: 'bismuth', t: "Welcome to my workshop! Best forge on Earth — mind the lava, it bites." },
       { w: 'steven', t: "You made ALL of Rose's weapons here?" },
       { w: 'bismuth', t: "Every last one. Even the ones she never used." }],
      [{ w: 'bismuth', t: "Rose's sword? My finest work. Built it to cut anything except a gem." },
       { w: 'pearl', t: "We agreed never to speak about the Breaking Point." },
       { w: 'bismuth', t: "Yeah, well. We agreed a lot of things, Pearl." }],
      [{ w: 'bismuth', t: "These automatons were mine — turned on us the day Homeworld took the forge." },
       { w: 'steven', t: "Can you fix them?" },
       { w: 'bismuth', t: "Fix? Buddy, I'm gonna BREAK 'em." }],
      [{ w: 'garnet', t: "Bismuth, focus. The forge is fighting back." },
       { w: 'bismuth', t: "Forge is MINE. It knows better than to fight me." },
       { w: 'garnet', t: "...It's a building, Bismuth." }]
    ],
    boss: [
      { w: 'villain', n: 'ANCIENT FORGE SENTINEL', i: '🔥', t: 'SYSTEM: INTRUDER.' },
      { w: 'bismuth', t: "Big, hot, ugly. My specialty." },
      { w: 'steven', t: "Together?" },
      { w: 'bismuth', t: "Always, little man." }
    ]
  },
  6: {
    map: 'The Frozen North',
    waves: [
      [{ w: 'lapis', t: "I can feel him under the ice. Jasper." },
       { w: 'steven', t: "You don't have to do this." },
       { w: 'lapis', t: "I know. That's exactly why I'm doing it." }],
      [{ w: 'lapis', t: "When we were Malachite, I held us both at the bottom of the ocean. For months." },
       { w: 'steven', t: "Lapis..." },
       { w: 'lapis', t: "I'm not that person anymore. I need him to know that." }],
      [{ w: 'garnet', t: "The corruption is eating him alive." },
       { w: 'lapis', t: "He asked for power. He got it." },
       { w: 'garnet', t: "Nobody deserves this. Not even him." }],
      [{ w: 'jasper', t: "You think you can beat me, runt?!" },
       { w: 'steven', t: "I think we can SAVE you!" },
       { w: 'jasper', t: "SAVE THIS!" }]
    ],
    boss: [
      { w: 'villain', n: 'CORRUPTED JASPER', i: '🐯', t: "BETA'S FINEST DOESN'T LOSE!" },
      { w: 'garnet', t: "You already did, Jasper. You lost yourself." },
      { w: 'steven', t: "But you can still come back. I've seen it." }
    ]
  },
  7: {
    map: "Pink Diamond's Space Zoo",
    waves: [
      [{ w: 'pearl', t: "A Human Zoo. They kept people in here. Like collectibles." },
       { w: 'steven', t: "That's... really messed up." },
       { w: 'pearl', t: "Yes. That's one word for it." }],
      [{ w: 'garnet', t: "Blue Diamond's gems still run this place." },
       { w: 'pearl', t: "Then we go quietly. Or loudly. I'm flexible." },
       { w: 'garnet', t: "You're never quiet." }],
      [{ w: 'steven', t: "These Zoomans are happy. They don't know anything else exists." },
       { w: 'lapis', t: "Freedom you don't know you're missing isn't freedom. It's a cage with nice wallpaper." }],
      [{ w: 'garnet', t: "Agate's wardens hold the control room." },
       { w: 'pearl', t: "I'll take the controls. You take the smashy part." },
       { w: 'garnet', t: "Finally. A plan I like." }]
    ],
    boss: [
      { w: 'villain', n: 'HOLY BLUE AGATE WARDEN', i: '🔷', t: 'HOW DARE YOU TOUCH MY ZOO!' },
      { w: 'pearl', t: "Cruel, petty, and loud." },
      { w: 'garnet', t: "Then she'll be very loud when she loses." }
    ]
  },
  8: {
    map: 'Homeworld Abduction Shore',
    waves: [
      [{ w: 'steven', t: "They're taking humans. Like they took Dad." },
       { w: 'connie', t: "Not on our beach. Not today." },
       { w: 'steven', t: "Connie, you're terrifying." },
       { w: 'connie', t: "Thank you!" }],
      [{ w: 'connie', t: "Pearl taught me to hold a sword. She didn't teach me to lose." },
       { w: 'steven', t: "That's... actually a little scary, Connie." },
       { w: 'connie', t: "Good!" }],
      [{ w: 'garnet', t: "Topaz fusion. Two gems, one body, and no choice in the matter." },
       { w: 'steven', t: "That's not a fusion. That's a prison." },
       { w: 'garnet', t: "Exactly." }],
      [{ w: 'steven', t: "Aquamarine's ship is lifting! If it clears the beach, those people are gone!" },
       { w: 'connie', t: "Then it doesn't clear the beach." },
       { w: 'steven', t: "I love it when you say things like that!" }]
    ],
    boss: [
      { w: 'villain', n: 'FUSED TOPAZ ENFORCER', i: '💛', t: 'ORDERS ARE ORDERS.' },
      { w: 'connie', t: "They're not evil. They're scared." },
      { w: 'steven', t: "Then let's be brave enough for both of them!" }
    ]
  },
  9: {
    map: 'Homeworld Trial & Off-Colors',
    waves: [
      [{ w: 'steven', t: "The courtroom. Last time I stood here, I was on trial for Mom's murder." },
       { w: 'connie', t: "And this time?" },
       { w: 'steven', t: "This time I brought backup." }],
      [{ w: 'steven', t: "I'm not alone anymore." },
       { w: 'pearl', t: "You never were, Steven." },
       { w: 'garnet', t: "We're right here." }],
      [{ w: 'garnet', t: "Off-Colors. Rhodonite, Padparadscha, Fluorite. Gems Homeworld threw away." },
       { w: 'steven', t: "Then they're Crystal Gems now." },
       { w: 'garnet', t: "That's the whole idea, yes." }],
      [{ w: 'garnet', t: "The Robonoid Hunter was built to find runaway gems." },
       { w: 'steven', t: "Good! Let it find us!" },
       { w: 'pearl', t: "Steven, that is NOT a strategy!" },
       { w: 'steven', t: "It's a LITTLE bit of a strategy!" }]
    ],
    boss: [
      { w: 'villain', n: 'ROBONOID HUNTER COLOSSUS', i: '🤖', t: 'TARGETS ACQUIRED.' },
      { w: 'pearl', t: "Aim for the core!" },
      { w: 'steven', t: "Every gem deserves a chance. Even the one hunting us." }
    ]
  },
  10: {
    map: 'Change Your Mind — Era 3',
    waves: [
      [{ w: 'steven', t: "White Diamond's mecha is the size of a CITY." },
       { w: 'garnet', t: "Then we make ourselves the size of a problem." },
       { w: 'amethyst', t: "Now THAT I can work with!" }],
      [{ w: 'connie', t: "Everyone's here. All of us." },
       { w: 'bismuth', t: "All of us is what Homeworld is afraid of." },
       { w: 'steven', t: "Then let's give them something to be afraid of!" }],
      [{ w: 'pearl', t: "White Diamond believes she is perfect. Perfection doesn't bend." },
       { w: 'steven', t: "Then I'll bend it." },
       { w: 'pearl', t: "...That's either very brave or very stupid." },
       { w: 'steven', t: "Both! It's both!" }],
      [{ w: 'steven', t: "I'm not Rose Quartz. I'm not Pink Diamond. I'm Steven." },
       { w: 'garnet', t: "And that's enough." },
       { w: 'amethyst', t: "Yeah it is!" }]
    ],
    boss: [
      { w: 'villain', n: 'WHITE DIAMOND SUPREME MECHA', i: '💎', t: 'I AM PERFECTION.' },
      { w: 'steven', t: "No. You're just scared of being wrong." },
      { w: 'garnet', t: "Era 3 starts here." }
    ]
  }
};

// Boss portraits we do not have art for are represented by an emoji crest.
const STORY_VILLAIN_COLORS = {
  1: '#22c55e', 2: '#06b6d4', 3: '#a855f7', 4: '#f97316', 5: '#ef4444',
  6: '#ea580c', 7: '#3b82f6', 8: '#eab308', 9: '#94a3b8', 10: '#f8fafc'
};

const SafeStorage = {
  _mem: {},
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch (e) {
      // Chrome blocks localStorage access on file:/// origin with SecurityError
    }
    return Object.prototype.hasOwnProperty.call(this._mem, key) ? this._mem[key] : null;
  },
  setItem(key, value) {
    const strVal = String(value);
    this._mem[key] = strVal;
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.setItem(key, strVal);
      }
    } catch (e) {
      // LocalStorage access is blocked or quota exceeded
    }
  },
  removeItem(key) {
    delete this._mem[key];
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// ============================================================================
// 7. MAIN GAME CONTROLLER & HUD SYNCHRONIZER
// ============================================================================
// ============================================================================
// 7.0. SUPER-MOVE PORTRAITS
// Painted bust portraits for the Overdrive / Fusion cut-ins. Drawn with Canvas so
// they scale cleanly to the 340px cut-in frame, and cached as data URLs.
// ============================================================================
const PORTRAIT_SPECS = {
  steven:   { skin: '#f7d3bd', shade: '#e6b49b', hair: '#2a1720', hairType: 'curls',  outfit: '#e8453c', collar: '#f4766f', gem: '#f472b6', accent: '#ffd166', star: true,  freckles: true,  eyes: '#2b1b3a' },
  garnet:   { skin: '#8b4a42', shade: '#73372f', hair: '#1b0d26', hairType: 'cube',   outfit: '#7f1d3a', collar: '#a32448', gem: '#ef4444', accent: '#f472b6', visor: '#2a1050', eyes: '#fde047' },
  amethyst: { skin: '#c99ae8', shade: '#a875cc', hair: '#e9d5ff', hairType: 'long',   outfit: '#1f1235', collar: '#31224f', gem: '#7c3aed', accent: '#c084fc', star: true, eyes: '#2b1b3a' },
  pearl:    { skin: '#fff3e6', shade: '#f2d6bd', hair: '#f7dcc4', hairType: 'peak',   outfit: '#38bdf8', collar: '#7dd3fc', gem: '#f8fafc', accent: '#f9a8d4', gemHead: true, eyes: '#1e3a5f' },
  bismuth:  { skin: '#94a3b8', shade: '#6f7c8f', hair: '#7c3aed', hairType: 'dreads', outfit: '#475569', collar: '#64748b', gem: '#ec4899', accent: '#f59e0b', eyes: '#1f2937' },
  peridot:  { skin: '#b7f27a', shade: '#8fd456', hair: '#d9f99d', hairType: 'triangle', outfit: '#14532d', collar: '#166534', gem: '#a3e635', accent: '#4ade80', gemHead: true, visor: '#0f2b1c', eyes: '#052e16' },
  lapis:    { skin: '#7cc7e8', shade: '#5aa7cc', hair: '#172554', hairType: 'bob',   outfit: '#1e3a8a', collar: '#2563eb', gem: '#38bdf8', accent: '#bae6fd', eyes: '#082f49' },
  rose:     { skin: '#f9b9d0', shade: '#e694b3', hair: '#f472b6', hairType: 'bigcurls', outfit: '#fdf2f8', collar: '#fbcfe8', gem: '#fb7185', accent: '#fda4af', eyes: '#3f1226' },
  connie:   { skin: '#a9714b', shade: '#8a5738', hair: '#1c1917', hairType: 'wavy',  outfit: '#f9a8d4', collar: '#fbcfe8', gem: null,      accent: '#2dd4bf', eyes: '#1c1917' },
  jasper:   { skin: '#f2a65a', shade: '#d98a3c', hair: '#fde9d2', hairType: 'mane',   outfit: '#7f1d1d', collar: '#991b1b', gem: '#fbbf24', accent: '#f97316', noseGem: true, stripes: true, eyes: '#3f1d0b' },
  stevonnie:      { skin: '#b8794f', shade: '#98603b', hair: '#241a17', hairType: 'wavy',    outfit: '#e8453c', collar: '#f9a8d4', gem: '#f472b6', accent: '#f9a8d4', star: true, eyes: '#241a17' },
  smoky:          { skin: '#b98bdd', shade: '#9668bb', hair: '#e9d5ff', hairType: 'long',    outfit: '#e8453c', collar: '#c084fc', gem: '#a855f7', accent: '#c084fc', star: true, eyes: '#2b1b3a' },
  rainbow2:       { skin: '#fff3e6', shade: '#f2d6bd', hair: '#f7dcc4', hairType: 'peak',    outfit: '#f9a8d4', collar: '#38bdf8', gem: '#ffffff', accent: '#38bdf8', eyes: '#1e3a5f' },
  sunstone:       { skin: '#c66a3c', shade: '#a8542c', hair: '#1b0d26', hairType: 'cube',    outfit: '#f97316', collar: '#fbbf24', gem: '#ef4444', accent: '#fbbf24', star: true, eyes: '#3f1d0b' },
  sugilite:       { skin: '#a06bd0', shade: '#7f4fae', hair: '#e9d5ff', hairType: 'long',    outfit: '#a21caf', collar: '#d946ef', gem: '#7c3aed', accent: '#f472b6', eyes: '#2b1b3a' },
  sardonyx:       { skin: '#a35a4a', shade: '#864438', hair: '#f7dcc4', hairType: 'peak',    outfit: '#7f1d3a', collar: '#14b8a6', gem: '#fb923c', accent: '#14b8a6', eyes: '#3f1226' },
  opal:           { skin: '#dcc7ea', shade: '#c0a6d4', hair: '#f8fafc', hairType: 'peak',    outfit: '#0f766e', collar: '#2dd4bf', gem: '#22d3ee', accent: '#a5f3fc', eyes: '#164e63' },
  malachite:      { skin: '#7cc7e8', shade: '#59a3c4', hair: '#f8fafc', hairType: 'mane',    outfit: '#0f766e', collar: '#38bdf8', gem: '#38bdf8', accent: '#67e8f9', eyes: '#082f49' },
  rainbowClassic: { skin: '#f9b9d0', shade: '#e694b3', hair: '#f472b6', hairType: 'bigcurls',outfit: '#fdf2f8', collar: '#fbcfe8', gem: '#ffffff', accent: '#fda4af', eyes: '#3f1226' }
};

function portraitHairBack(ctx, spec, W, H) {
  const c = spec.hair;
  ctx.fillStyle = c;
  if (spec.hairType === 'cube' || spec.hairType === 'afro') {
    ctx.beginPath(); ctx.roundRect(W * 0.16, H * 0.05, W * 0.68, H * 0.50, W * 0.10); ctx.fill();
  } else if (spec.hairType === 'long' || spec.hairType === 'wavy' || spec.hairType === 'bigcurls' || spec.hairType === 'mane') {
    const spread = spec.hairType === 'bigcurls' ? 0.10 : 0.06;
    ctx.beginPath();
    ctx.moveTo(W * 0.33, H * 0.16);
    ctx.bezierCurveTo(W * (0.20 - spread), H * 0.34, W * (0.19 - spread), H * 0.62, W * (0.27 - spread * 0.7), H * 0.78);
    ctx.lineTo(W * (0.73 + spread * 0.7), H * 0.78);
    ctx.bezierCurveTo(W * (0.81 + spread), H * 0.62, W * (0.80 + spread), H * 0.34, W * 0.67, H * 0.16);
    ctx.closePath(); ctx.fill();
  } else if (spec.hairType === 'dreads') {
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      ctx.fillStyle = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899'][i];
      ctx.beginPath();
      ctx.ellipse(W * (0.16 + t * 0.68), H * (0.22 + Math.sin(t * Math.PI) * 0.10), W * 0.055, H * 0.24, t * 0.5 - 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.hairType === 'bob') {
    ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.35, W * 0.29, H * 0.30, 0, 0, Math.PI * 2); ctx.fill();
  } else if (spec.hairType === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.02); ctx.lineTo(W * 0.86, H * 0.42);
    ctx.lineTo(W * 0.14, H * 0.42); ctx.closePath(); ctx.fill();
  } else if (spec.hairType === 'peak') {
    ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.31, W * 0.26, H * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  } else { // curls
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.15 + i * 0.12);
      ctx.beginPath();
      ctx.arc(W * 0.5 + Math.cos(a) * W * 0.30, H * 0.34 - Math.sin(a) * H * 0.16, W * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPortrait(ctx, id, size = 512) {
  const spec = PORTRAIT_SPECS[id] || PORTRAIT_SPECS.steven;
  const W = size, H = size;
  const ink = 'rgba(42, 16, 32, 0.92)';
  const lw = W * 0.016;
  ctx.clearRect(0, 0, W, H);

  const cx = W * 0.48;
  const headY = H * 0.385;
  const headRX = W * 0.225;
  const headRY = H * 0.245;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // ---- Raised arm (waving) behind the torso --------------------------------
  ctx.save();
  ctx.strokeStyle = spec.outfit;
  ctx.lineWidth = W * 0.115;
  ctx.beginPath();
  ctx.moveTo(W * 0.70, H * 0.80);
  ctx.quadraticCurveTo(W * 0.86, H * 0.68, W * 0.83, H * 0.47);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(42,16,32,0.55)';
  ctx.lineWidth = W * 0.012;
  ctx.stroke();
  // hand
  ctx.fillStyle = spec.skin;
  ctx.beginPath();
  ctx.arc(W * 0.83, H * 0.44, W * 0.052, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();
  ctx.restore();

  // ---- Shoulders / torso ---------------------------------------------------
  const torso = () => {
    ctx.beginPath();
    ctx.moveTo(W * 0.04, H * 1.02);
    ctx.quadraticCurveTo(W * 0.10, H * 0.72, W * 0.32, H * 0.64);
    ctx.lineTo(W * 0.64, H * 0.64);
    ctx.quadraticCurveTo(W * 0.86, H * 0.72, W * 0.92, H * 1.02);
    ctx.closePath();
  };
  ctx.fillStyle = spec.outfit;
  torso(); ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();

  // collar / neckline
  ctx.fillStyle = spec.collar || spec.outfit;
  ctx.beginPath();
  ctx.moveTo(W * 0.33, H * 0.655);
  ctx.quadraticCurveTo(cx, H * 0.86, W * 0.63, H * 0.655);
  ctx.quadraticCurveTo(cx, H * 0.75, W * 0.33, H * 0.655);
  ctx.fill();

  if (spec.star) {
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7;
    const sx = cx, sy = H * 0.85, r = W * 0.062;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r);
      ctx.lineTo(sx + Math.cos(a + Math.PI / 5) * r * 0.45, sy + Math.sin(a + Math.PI / 5) * r * 0.45);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // ---- Neck ---------------------------------------------------------------
  ctx.fillStyle = spec.shade;
  ctx.beginPath();
  ctx.roundRect(cx - W * 0.062, H * 0.545, W * 0.124, H * 0.135, W * 0.03);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();

  // ---- Hair (back volume) -------------------------------------------------
  portraitHairBack(ctx, spec, W, H);

  // ---- Head ---------------------------------------------------------------
  ctx.fillStyle = spec.skin;
  ctx.beginPath();
  ctx.ellipse(cx, headY, headRX, headRY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();

  // cheek shading
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = spec.shade;
  ctx.beginPath();
  ctx.ellipse(cx, headY + headRY * 0.55, headRX * 0.72, headRY * 0.3, 0, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  // ---- Face ---------------------------------------------------------------
  const eyeY = headY + H * 0.005;
  const eyeDX = W * 0.088;
  // whites
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.8;
  ctx.beginPath();
  ctx.ellipse(cx - eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.stroke();
  // irises
  const irisGrad = ctx.createRadialGradient(cx - eyeDX, eyeY, 2, cx - eyeDX, eyeY, W * 0.05);
  irisGrad.addColorStop(0, spec.eyes || '#1f2937');
  irisGrad.addColorStop(1, '#0b0714');
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.ellipse(cx - eyeDX + W * 0.004, eyeY + H * 0.004, W * 0.033, H * 0.048, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeDX + W * 0.004, eyeY + H * 0.004, W * 0.033, H * 0.048, 0, 0, Math.PI * 2);
  ctx.fill();
  // highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - eyeDX - W * 0.008, eyeY - H * 0.016, W * 0.014, 0, Math.PI * 2);
  ctx.arc(cx + eyeDX - W * 0.008, eyeY - H * 0.016, W * 0.014, 0, Math.PI * 2);
  ctx.arc(cx - eyeDX + W * 0.016, eyeY + H * 0.020, W * 0.007, 0, Math.PI * 2);
  ctx.arc(cx + eyeDX + W * 0.016, eyeY + H * 0.020, W * 0.007, 0, Math.PI * 2);
  ctx.fill();

  // brows
  ctx.strokeStyle = spec.hair; ctx.lineWidth = W * 0.016;
  ctx.beginPath();
  ctx.moveTo(cx - eyeDX - W * 0.048, eyeY - H * 0.082);
  ctx.quadraticCurveTo(cx - eyeDX, eyeY - H * 0.105, cx - eyeDX + W * 0.048, eyeY - H * 0.080);
  ctx.moveTo(cx + eyeDX - W * 0.048, eyeY - H * 0.080);
  ctx.quadraticCurveTo(cx + eyeDX, eyeY - H * 0.105, cx + eyeDX + W * 0.048, eyeY - H * 0.082);
  ctx.stroke();

  // blush
  ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
  ctx.beginPath();
  ctx.ellipse(cx - W * 0.135, eyeY + H * 0.062, W * 0.042, H * 0.024, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + W * 0.135, eyeY + H * 0.062, W * 0.042, H * 0.024, 0, 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.strokeStyle = spec.shade; ctx.lineWidth = W * 0.011;
  ctx.beginPath();
  ctx.moveTo(cx, headY + H * 0.072);
  ctx.quadraticCurveTo(cx + W * 0.018, headY + H * 0.10, cx - W * 0.004, headY + H * 0.108);
  ctx.stroke();

  // open, joyful smile
  ctx.fillStyle = '#7f1d3a';
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.075, headY + H * 0.135);
  ctx.quadraticCurveTo(cx, headY + H * 0.225, cx + W * 0.075, headY + H * 0.135);
  ctx.quadraticCurveTo(cx, headY + H * 0.165, cx - W * 0.075, headY + H * 0.135);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.062, headY + H * 0.140);
  ctx.quadraticCurveTo(cx, headY + H * 0.170, cx + W * 0.062, headY + H * 0.140);
  ctx.quadraticCurveTo(cx, headY + H * 0.152, cx - W * 0.062, headY + H * 0.140);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(cx, headY + H * 0.185, W * 0.028, H * 0.016, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- Hair (front) -------------------------------------------------------
  ctx.fillStyle = spec.hair;
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.9;
  if (spec.hairType === 'peak') {
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.22, headY - H * 0.12);
    ctx.quadraticCurveTo(cx, headY - H * 0.42, cx + W * 0.22, headY - H * 0.12);
    ctx.quadraticCurveTo(cx, headY - H * 0.24, cx - W * 0.22, headY - H * 0.12);
    ctx.fill(); ctx.stroke();
  } else if (spec.hairType === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(cx, headY - H * 0.36); ctx.lineTo(cx + W * 0.28, headY - H * 0.06);
    ctx.quadraticCurveTo(cx, headY - H * 0.20, cx - W * 0.28, headY - H * 0.06);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (spec.hairType === 'cube') {
    ctx.beginPath();
    ctx.roundRect(cx - W * 0.26, headY - H * 0.34, W * 0.52, H * 0.20, W * 0.05);
    ctx.fill(); ctx.stroke();
  } else if (['bob', 'wavy', 'long', 'mane', 'bigcurls'].includes(spec.hairType)) {
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.23, headY - H * 0.08);
    ctx.quadraticCurveTo(cx - W * 0.14, headY - H * 0.38, cx, headY - H * 0.34);
    ctx.quadraticCurveTo(cx + W * 0.14, headY - H * 0.38, cx + W * 0.23, headY - H * 0.08);
    ctx.quadraticCurveTo(cx + W * 0.10, headY - H * 0.24, cx, headY - H * 0.21);
    ctx.quadraticCurveTo(cx - W * 0.10, headY - H * 0.24, cx - W * 0.23, headY - H * 0.08);
    ctx.fill(); ctx.stroke();
  } else {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(cx + W * (i - 2) * 0.085, headY - H * 0.22 + Math.sin(i) * H * 0.02, W * 0.072, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  }

  // ---- Gem ----------------------------------------------------------------
  if (spec.gem) {
    const gx = cx, gy = spec.gemHead ? headY - H * 0.245 : H * 0.755;
    const r = W * (spec.gemHead ? 0.045 : 0.058);
    ctx.save();
    ctx.translate(gx, gy);
    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, spec.gem); g.addColorStop(1, spec.shade);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -r); ctx.lineTo(r * 0.9, -r * 0.3); ctx.lineTo(r * 0.5, r);
    ctx.lineTo(-r * 0.5, r); ctx.lineTo(-r * 0.9, -r * 0.3);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.8; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(r * 0.34, -r * 0.2); ctx.lineTo(0, r * 0.1); ctx.lineTo(-r * 0.34, -r * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  if (spec.noseGem) {
    ctx.fillStyle = spec.gem || '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(cx, headY + H * 0.055); ctx.lineTo(cx + W * 0.028, headY + H * 0.082);
    ctx.lineTo(cx, headY + H * 0.108); ctx.lineTo(cx - W * 0.028, headY + H * 0.082);
    ctx.closePath(); ctx.fill();
  }

  // ---- Accessories --------------------------------------------------------
  if (spec.visor) {
    ctx.fillStyle = spec.visor;
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.215, eyeY - H * 0.038);
    ctx.lineTo(cx + W * 0.215, eyeY - H * 0.038);
    ctx.lineTo(cx + W * 0.16, eyeY + H * 0.050);
    ctx.lineTo(cx - W * 0.16, eyeY + H * 0.050);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = spec.accent; ctx.lineWidth = lw; ctx.stroke();
    ctx.fillStyle = spec.eyes;
    ctx.beginPath();
    ctx.ellipse(cx - eyeDX, eyeY + H * 0.004, W * 0.026, H * 0.022, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + eyeDX, eyeY + H * 0.004, W * 0.026, H * 0.022, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (spec.stripes) {
    ctx.fillStyle = spec.accent;
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.215, eyeY - H * 0.105); ctx.lineTo(cx - W * 0.115, eyeY - H * 0.075); ctx.lineTo(cx - W * 0.215, eyeY - H * 0.045);
    ctx.moveTo(cx + W * 0.215, eyeY - H * 0.105); ctx.lineTo(cx + W * 0.115, eyeY - H * 0.075); ctx.lineTo(cx + W * 0.215, eyeY - H * 0.045);
    ctx.fill();
  }
  if (spec.freckles) {
    ctx.fillStyle = 'rgba(190, 90, 90, 0.55)';
    [[-0.155, 0.055], [-0.115, 0.078], [-0.185, 0.082], [0.155, 0.055], [0.115, 0.078], [0.185, 0.082]].forEach(([dx, dy]) => {
      ctx.beginPath(); ctx.arc(cx + W * dx, headY + H * dy, W * 0.0085, 0, Math.PI * 2); ctx.fill();
    });
  }

  // ---- Rim light ----------------------------------------------------------
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = W * 0.02;
  ctx.beginPath();
  ctx.ellipse(cx, headY, headRX, headRY, 0, Math.PI * 1.10, Math.PI * 1.72);
  ctx.stroke();
  ctx.restore();

  // ---- Sparkles -----------------------------------------------------------
  const sparkle = (sx, sy, r) => {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.moveTo(sx, sy - r); ctx.quadraticCurveTo(sx + r * 0.22, sy - r * 0.22, sx + r, sy);
    ctx.quadraticCurveTo(sx + r * 0.22, sy + r * 0.22, sx, sy + r);
    ctx.quadraticCurveTo(sx - r * 0.22, sy + r * 0.22, sx - r, sy);
    ctx.quadraticCurveTo(sx - r * 0.22, sy - r * 0.22, sx, sy - r);
    ctx.fill();
  };
  sparkle(W * 0.16, H * 0.18, W * 0.045);
  sparkle(W * 0.84, H * 0.22, W * 0.035);
  sparkle(W * 0.10, H * 0.62, W * 0.028);
  sparkle(W * 0.90, H * 0.70, W * 0.032);
}

// Official reference portraits (generated by tools/make_portraits.py) are drawn when
// available; the vector portrait is only a fallback.
const _portraitImages = {};
if (typeof PORTRAIT_IMAGES !== 'undefined') {
  Object.keys(PORTRAIT_IMAGES).forEach(id => {
    const img = new Image();
    img.decoding = 'async';
    img.src = PORTRAIT_IMAGES[id];
    _portraitImages[id] = img;
  });
}

function drawPortraitCard(ctx, id, size = 512) {
  ctx.clearRect(0, 0, size, size);
  const img = _portraitImages[id];
  if (img && img.complete && img.naturalWidth > 0) {
    const theme = (typeof OVERDRIVE_THEMES !== 'undefined' && OVERDRIVE_THEMES[id]) ? OVERDRIVE_THEMES[id].color :
                  (typeof CANON_FUSIONS !== 'undefined' && CANON_FUSIONS[id]) ? CANON_FUSIONS[id].color : '#f472b6';

    // 1. Dynamic rotating energy rays behind character
    ctx.save();
    ctx.translate(size / 2, size * 0.50);
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = theme;
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.035, -size * 0.85);
      ctx.lineTo(-size * 0.035, -size * 0.85);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. High-speed action slash stripes in signature gem color
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = theme;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.36);
    ctx.lineTo(size, size * 0.16);
    ctx.lineTo(size, size * 0.29);
    ctx.lineTo(0, size * 0.49);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, size * 0.74);
    ctx.lineTo(size, size * 0.54);
    ctx.lineTo(size, size * 0.67);
    ctx.lineTo(0, size * 0.87);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Draw pristine HD character portrait
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight) * 0.96;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (size - w) / 2, size - h - size * 0.02, w, h);
    ctx.restore();

    // 4. Sparkling four-point gem stars
    const spark = (sx, sy, r, a = 1.0) => {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(sx, sy - r);
      ctx.quadraticCurveTo(sx + r * 0.18, sy - r * 0.18, sx + r, sy);
      ctx.quadraticCurveTo(sx + r * 0.18, sy + r * 0.18, sx, sy + r);
      ctx.quadraticCurveTo(sx - r * 0.18, sy + r * 0.18, sx - r, sy);
      ctx.quadraticCurveTo(sx - r * 0.18, sy - r * 0.18, sx, sy - r);
      ctx.fill();
      ctx.restore();
    };
    spark(size * 0.14, size * 0.22, size * 0.05, 0.95);
    spark(size * 0.86, size * 0.28, size * 0.038, 0.85);
    spark(size * 0.12, size * 0.65, size * 0.032, 0.75);
    spark(size * 0.88, size * 0.70, size * 0.042, 0.9);
    return true;
  }
  drawPortrait(ctx, id, size);
  return false;
}

const _portraitCache = {};
function getPortraitDataUrl(id, size = 512) {
  const key = `${id}@${size}`;
  if (_portraitCache[key]) return _portraitCache[key];
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    drawPortrait(canvas.getContext('2d'), id, size);
    _portraitCache[key] = canvas.toDataURL('image/png');
  } catch (e) {
    _portraitCache[key] = '';
  }
  return _portraitCache[key];
}

class StevenUniverseGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.audio = new GemAudioEngine();
    this.particles = new ParticleSystem();
    const cw = (this.canvas && typeof this.canvas.width === 'number' && !isNaN(this.canvas.width) && this.canvas.width > 0) ? this.canvas.width : 1280;
    const ch = (this.canvas && typeof this.canvas.height === 'number' && !isNaN(this.canvas.height) && this.canvas.height > 0) ? this.canvas.height : 720;
    this.groundY = ch - 120;
    this.stageWidth = 2600; // Wide stage arena!
    this.cameraX = 0;
    this.environment = new EnvironmentRenderer(cw, ch, this.stageWidth);

    this.playerMode = SafeStorage.getItem('su_playerMode') || '1p';
    this.selectedCharP1 = SafeStorage.getItem('su_selectedChar') || 'steven';
    this.selectedCharP2 = SafeStorage.getItem('su_selectedCharP2') || 'garnet';
    this.selectedChar = this.selectedCharP1;
    this.tempSelectedChar = this.selectedChar;
    this.charSelectActiveTab = 'p1';

    this.player = new PlayerHero(this.groundY, 'p1', this.stageWidth);
    this.player2 = null;
    this.enemyManager = new EnemyManager(this.groundY, this.stageWidth);
    this.enemyManager.diffMult = 1.0;
    this.enemyManager.onComboHit = (dmg) => this.registerComboHit(dmg);
    this.enemyManager.gameRef = this;
    this.hitstopTimer = 0;
    this.hitShake = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    this.projectiles = [];
    this.pickups = [];

    this.state = 'title';
    this.gameMode = 'story';
    this.stageIndex = 1;
    this.maxStages = 10;
    this.isTransitioning = false;

    this.difficulty = SafeStorage.getItem('su_difficulty') || 'medium';
    // Story cutscenes (dialogue between waves). OFF = pure arcade run.
    this.storyMode = (SafeStorage.getItem('su_storyMode') || 'true') !== 'false';
    this.tempDifficulty = this.difficulty;

    const diffCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.diffMult = diffCfg.enemyHpMult || 1.0;
    this.maxHearts = diffCfg.hearts;
    this.currentHearts = this.maxHearts;
    this.currentHeartsP2 = this.maxHearts;
    this.score = 0;
    this.bubbledGemsCount = 0;

    this.starPowerMeter = 0;
    this.isOverdriveActive = false;
    this.overdriveTimer = 0;

    this.starPowerMeterP2 = 0;
    this.isOverdriveActiveP2 = false;
    this.overdriveTimerP2 = 0;

    this.overdriveDuration = 12.0;

    // Tekken-Style Combo Tracker
    this.comboHits = 0;
    this.comboDamage = 0;
    this.comboTimer = 0;

    this.highScore = parseInt(SafeStorage.getItem('su_highScore') || '0', 10) || 0;
    this.savedBubbles = safeJsonParse(SafeStorage.getItem('su_bubbledGems'), []);

    // Canonical Gem Fusion Attributes (Tag-Team Hyper Attack)
    this.fusionEnergy = 0;
    this.isFused = false;
    this.fusionTimer = 0;
    this.fusionMaxDuration = 12.0;
    this.isHyperAttack = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    // Freebuff fusion tuning: overcharge, pair power and variable duration (matched with 12s Overdrive)
    this.hyperAttackDuration = 12.0;
    this.activeFusionNukeMult = 1.0;
    this.activeFusionHeal = 1;
    this.synergyBuffTimer = 0;

    // 2-Player Co-Op Fusion Synergy Attributes
    this.lastAttackTimeP1 = 0;
    this.lastAttackTimeP2 = 0;
    this.lastDualStrikeTime = 0;
    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    // Robust Delta-Time Wave Controller Attributes (Immune to Pause & Idling)
    this.waveIndex = 0;
    this.waveSpawnQueue = [];
    this.waveClearTimer = 0;
    this.isWaitingForWaveClear = false;
    this.isBossSpawning = false;
    this.bossSpawnTimer = 0;
    this.gameOverTimerActive = false;

    this.keysP1 = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, dodge: false, bubble: false
    };
    this.keysP2 = {
      left: false, right: false, jump: false,
      down: false, shield: false,
      attack: false, special: false, skill: false, dodge: false, bubble: false
    };
    this.keys = this.keysP1;

    this.lastTime = performance.now();
    this.initEventListeners();
    this.updateLobbyGuardian();
    this.updateLobbyDifficulty();
    this.updateHUD();
    this.updateActionBar();
    this.updateFusionHUD();
    this.initLobbySlideshow();
    this.syncCharGridIcons();

    // Automatic Main Menu Music Autoplay & Front-Page Jukebox
    const updateLobbyMusicButton = (isPlaying) => {
      const btn = document.getElementById('btnLobbyPlayMusic');
      const icon = document.getElementById('lobbyMusicPlayIcon');
      const txt = document.getElementById('lobbyMusicPlayText');
      if (btn) {
        if (isPlaying) {
          btn.classList.add('playing');
          if (icon) icon.textContent = '⏸';
          if (txt) txt.textContent = 'PAUSE';
        } else {
          btn.classList.remove('playing');
          if (icon) icon.textContent = '▶';
          if (txt) txt.textContent = 'PLAY';
        }
      }
    };
    this.updateLobbyMusicButton = updateLobbyMusicButton;

    // Start playing current active track
    this.audio.playMusic('menu');

    let hasAudioUnlocked = false;
    const unlockEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];

    const unlockMenuAudio = (e) => {
      this.audio.init();
      if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
        this.audio.ctx.resume().then(() => {
          if (this.audio.ctx && this.audio.ctx.state === 'running') {
            this.audio.onAudioRunning();
            if (!this.audio.isManuallyPaused) {
              updateLobbyMusicButton(true);
              if (this.state === 'title' && !this.audio.musicInterval) {
                const trk = (this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'distant_shore';
                this.audio.playTrackById(trk, false);
              }
            }
            cleanupUnlockListeners();
          }
        }).catch(() => {});
      } else if (this.audio.ctx && this.audio.ctx.state === 'running') {
        this.audio.onAudioRunning();
        if (!this.audio.isManuallyPaused) {
          updateLobbyMusicButton(true);
          if (this.state === 'title' && !this.audio.musicInterval) {
            const trk = (this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'distant_shore';
            this.audio.playTrackById(trk, false);
          }
        }
        cleanupUnlockListeners();
      }
    };
    const unlockAndPlay = unlockMenuAudio;

    const cleanupUnlockListeners = () => {
      if (!hasAudioUnlocked) {
        hasAudioUnlocked = true;
        unlockEvents.forEach(evt => window.removeEventListener(evt, unlockMenuAudio));
      }
      const promptEl = document.getElementById('audioUnlockPrompt');
      if (promptEl) promptEl.style.display = 'none';
    };

    const tryAutoPlay = () => {
      this.audio.init();
      const promptEl = document.getElementById('audioUnlockPrompt');
      if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
        if (promptEl && !this.audio.isManuallyPaused) promptEl.style.display = 'block';
        this.audio.ctx.resume().then(() => {
          if (this.audio.ctx && this.audio.ctx.state === 'running') {
            this.audio.onAudioRunning();
            if (!this.audio.isManuallyPaused) {
              updateLobbyMusicButton(true);
            }
            cleanupUnlockListeners();
          }
        }).catch(() => {});
      } else if (this.audio.ctx && this.audio.ctx.state === 'running') {
        if (promptEl) promptEl.style.display = 'none';
        this.audio.onAudioRunning();
        if (!this.audio.isManuallyPaused) {
          updateLobbyMusicButton(true);
        }
        cleanupUnlockListeners();
      }
    };

    // Immediate attempt on boot. If the engine allows audio right away, the lobby
    // track starts on its own; otherwise the first click/keypress unlocks it.
    tryAutoPlay();
    const ensureLobbyMusic = () => {
      if (this.state !== 'title' || this.audio.isManuallyPaused) return;
      if (!this.audio.ctx || this.audio.ctx.state !== 'running') return;
      if (!this.audio.musicInterval) {
        const trk = (this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'distant_shore';
        this.audio.playTrackById(trk, false);
      }
      if (this.audio.musicGainNode) {
        try { this.audio.musicGainNode.gain.setValueAtTime(this.audio.musicVolume, this.audio.ctx.currentTime); } catch (e) {}
      }
    };
    window.addEventListener('pointerdown', ensureLobbyMusic, { passive: true });
    window.addEventListener('keydown', ensureLobbyMusic, { passive: true });
    setTimeout(ensureLobbyMusic, 600);
    setTimeout(ensureLobbyMusic, 2500);

    // Polling auto-resume interval during first 10 seconds of boot
    let autoAttempts = 0;
    const autoResumeTimer = setInterval(() => {
      autoAttempts++;
      if (this.audio.ctx && this.audio.ctx.state === 'running') {
        this.audio.onAudioRunning();
        if (!this.audio.isManuallyPaused) updateLobbyMusicButton(true);
        cleanupUnlockListeners();
        clearInterval(autoResumeTimer);
      } else {
        tryAutoPlay();
      }
      if (autoAttempts > 40) clearInterval(autoResumeTimer);
    }, 250);

    unlockEvents.forEach(evt => {
      window.addEventListener(evt, unlockMenuAudio, { passive: true });
    });

    // Strict mobile detection: Only enable touch controls on actual phones/tablets (Android / Xiaomi / iOS)
    this.isRealMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (window.innerWidth <= 950 && 'ontouchstart' in window);
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.style.display = 'none'; // Keep hidden on title screen until game starts
      if (this.isRealMobile) {
        document.body.classList.add('mobile-device');
        const mobileFooter = document.querySelector('.title-footer-mobile');
        const pcFooter = document.querySelector('.title-footer-pc');
        if (mobileFooter) mobileFooter.style.display = 'block';
        if (pcFooter) pcFooter.style.display = 'none';
        const pcBar = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
        if (pcBar) pcBar.style.display = 'none';
      } else {
        document.body.classList.remove('mobile-device');
      }
    }
  }

  updateLobbyGuardian() {
    const dataP1 = GUARDIAN_DATA[this.selectedCharP1] || GUARDIAN_DATA.steven;
    const avatarEl = document.getElementById('lobbyGuardianAvatar');
    const nameEl = document.getElementById('lobbyGuardianName');
    const descEl = document.getElementById('lobbyGuardianDesc');
    const badgeEl = document.querySelector('.lobby-guardian-badge');
    const modeBtnText = document.getElementById('btnPlayerModeText');
    const typesContainer = document.getElementById('lobbyGuardianTypes');

    if (modeBtnText) {
      modeBtnText.textContent = this.playerMode === '2p' ? 'Mode: Co-Op (2P)' : 'Mode: Solo (1P)';
    }

    if (this.playerMode === '2p') {
      const dataP2 = GUARDIAN_DATA[this.selectedCharP2] || GUARDIAN_DATA.garnet;
      if (avatarEl) avatarEl.innerHTML = `${getGuardianSvg(this.selectedCharP1, 32)}${getGuardianSvg(this.selectedCharP2, 32)}`;
      if (nameEl) nameEl.textContent = `P1: ${dataP1.name} • P2: ${dataP2.name}`;
      if (descEl) descEl.textContent = `P1 (${dataP1.name}): WASD + F/G/H/R • P2 (${dataP2.name}): Arrows + J/K/L/O`;
      if (badgeEl) badgeEl.textContent = 'CHOSEN GUARDIANS (P1 & P2) • CLICK TO SWITCH 🔄';

      if (typesContainer) {
        const p1Badges = (dataP1.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
        const p2Badges = (dataP2.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
        typesContainer.innerHTML = `<span style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-right: 4px;">P1:</span>${p1Badges}<span style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-left: 8px; margin-right: 4px;">P2:</span>${p2Badges}`;
      }
    } else {
      if (avatarEl) avatarEl.innerHTML = getGuardianSvg(this.selectedCharP1, 46);
      if (nameEl) nameEl.textContent = dataP1.name;
      if (descEl) descEl.textContent = dataP1.desc;
      if (badgeEl) badgeEl.textContent = 'CHOSEN GUARDIAN • CLICK TO SWITCH 🔄';

      if (typesContainer) {
        typesContainer.innerHTML = (dataP1.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
      }
    }

    const fusionEl = document.getElementById('lobbyGuardianFusion');
    const fusionText = document.getElementById('lobbyGuardianFusionText');
    if (fusionEl && fusionText) {
      if (this.playerMode === '2p') {
        fusionEl.style.display = 'flex';
        const f = getCanonFusion(this.selectedCharP1, this.selectedCharP2);
        if (f) {
          fusionEl.className = 'lobby-guardian-fusion compatible';
          fusionText.innerHTML = `<b>Fusion:</b> ${f.name} (Ready in battle)`;
        } else {
          fusionEl.className = 'lobby-guardian-fusion incompatible';
          fusionText.innerHTML = `<b>Independent Duo</b> (No canon fusion)`;
        }
      } else {
        fusionEl.style.display = 'none';
      }
    }
  }

  updateLobbyDifficulty() {
    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    const cleanDiffName = (diff.name || 'Medium').replace(/^[^\w\s]+\s*/, '');
    const pill = document.getElementById('lobbyDifficultyPill');
    if (pill) {
      pill.textContent = cleanDiffName;
      pill.style.background = diff.pillColor;
    }
    const btnText = document.getElementById('btnDiffLevelText');
    if (btnText) {
      btnText.textContent = `Difficulty: ${cleanDiffName}`;
    }
  }

  openDifficultyScreen() {
    const screen = document.getElementById('difficultyScreen');
    if (!screen) return;
    this.syncDifficultyPanel();
    screen.style.display = 'flex';
    this.audio.playSfx('menuTap');
  }

  closeDifficultyScreen() {
    const screen = document.getElementById('difficultyScreen');
    if (screen) screen.style.display = 'none';
  }

  setDifficulty(key) {
    if (!DIFFICULTY_CONFIG[key]) return;
    this.difficulty = key;
    SafeStorage.setItem('su_difficulty', key);
    const cfg = DIFFICULTY_CONFIG[key];
    this.enemyManager.diffMult = cfg.enemyHpMultiplier || 1.0;
    this.updateLobbyDifficulty();
    this.syncDifficultyPanel();
    this.audio.playSfx('menuTap');
  }

  syncDifficultyPanel() {
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === this.difficulty);
    });
  }

  cycleDifficulty() {
    const diffs = DIFFICULTY_ORDER;
    const idx = diffs.indexOf(this.difficulty);
    this.difficulty = diffs[(idx + 1) % diffs.length];
    SafeStorage.setItem('su_difficulty', this.difficulty);
    const diffCfg = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.diffMult = diffCfg.enemyHpMult || 1.0;
    this.maxHearts = diffCfg.hearts;
    this.currentHearts = this.maxHearts;
    this.currentHeartsP2 = this.maxHearts;
    this.updateLobbyDifficulty();
    this.audio.playSfx('cookie');
  }

  togglePlayerMode() {
    this.playerMode = this.playerMode === '1p' ? '2p' : '1p';
    SafeStorage.setItem('su_playerMode', this.playerMode);

    // Strict 1-Player Fusion Reset: If toggled to 1P, immediately defuse and revert player hero!
    if (this.playerMode === '1p') {
      this.isFused = false;
      this.isHyperAttack = false;
      this.hyperAttackTimer = 0;
      this.hyperAttackFired = false;
      this.fusionTimer = 0;
      this.fusionEnergy = 0;
      if (this.player) {
        this.player.isFusion = false;
        this.player.fusionKey = null;
        this.player.fusionData = null;
        this.player.isMergedInFusion = false;
        this.player.hasSynergyBuff = false;
        this.player.switchCharacter(this.selectedCharP1);
      }
      this.player2 = null;
      this.updateFusionHUD();
    }

    this.updateLobbyGuardian();
    this.audio.playSfx('switch');
  }

  updateCharPreview(charId) {
    const data = GUARDIAN_DATA[charId] || GUARDIAN_DATA.steven;
    const iconEl = document.getElementById('paneIcon');
    const nameEl = document.getElementById('paneName');
    const titleEl = document.getElementById('paneTitle');
    const loreEl = document.getElementById('paneLore');
    const jEl = document.getElementById('paneJ');
    const kEl = document.getElementById('paneK');
    const lEl = document.getElementById('paneL');
    const paneTypes = document.getElementById('paneTypes');

    if (iconEl) iconEl.innerHTML = getGuardianSvg(charId, 72);
    if (nameEl) nameEl.textContent = data.name;
    if (titleEl) titleEl.textContent = data.title;
    if (loreEl) loreEl.textContent = data.lore;
    if (jEl) jEl.textContent = data.j.desc;
    if (kEl) kEl.textContent = data.k.desc;
    if (lEl) lEl.textContent = data.l.desc;

    if (paneTypes) {
      paneTypes.innerHTML = (data.types || []).map(t => `<span class="gem-type-badge type-${t.toLowerCase()}">${t}</span>`).join('');
    }

    const fList = document.getElementById('fusionPreviewList');
    if (fList) {
      fList.innerHTML = '';
      const partners = getCompatibleFusionPartners(charId);
      if (partners.length > 0) {
        for (const p of partners) {
          const chip = document.createElement('span');
          chip.className = 'fusion-chip';
          const partnerName = GUARDIAN_DATA[p.partnerId]?.name || p.partnerId;
          chip.innerHTML = `${p.fusion.icon} <b>${p.fusion.name}</b> (+${partnerName}) • ${p.fusion.weapon}`;
          fList.appendChild(chip);
        }
      } else {
        const chip = document.createElement('span');
        chip.className = 'fusion-chip none';
        chip.innerHTML = `⚠️ Independent Gem — No canon show fusion`;
        fList.appendChild(chip);
      }
    }
  }

  // ==========================================================
  // LEFT 4 DEAD 2-STYLE CINEMATIC LIVING LOBBY SLIDESHOW
  // ==========================================================
  initLobbySlideshow() {
    this.lobbySlideIndex = 0;
    this.lobbySlideshowTimer = null;
    this.initLobbyMotes();
    this.startLobbySlideshow();
  }

  initLobbyMotes() {
    try {
      const container = document.getElementById('lobbyAmbientMotes');
      if (!container || (container.children && container.children.length > 0)) return;
      const colors = ['#ffd700', '#ff6097', '#38bdf8', '#c084fc', '#fef08a', '#a7f3d0'];
      for (let i = 0; i < 22; i++) {
        const mote = document.createElement('div');
        mote.className = 'lobby-mote';
        const size = Math.floor(3 + Math.random() * 4);
        mote.style.width = `${size}px`;
        mote.style.height = `${size}px`;
        mote.style.left = `${Math.random() * 100}%`;
        const dur = (7 + Math.random() * 8).toFixed(1);
        const delay = (Math.random() * 7).toFixed(1);
        mote.style.animationDuration = `${dur}s`;
        mote.style.animationDelay = `${delay}s`;
        const col = colors[i % colors.length];
        mote.style.background = col;
        mote.style.boxShadow = `0 0 10px ${col}, 0 0 18px ${col}`;
        mote.style.opacity = (0.4 + Math.random() * 0.4).toFixed(2);
        container.appendChild(mote);
      }
    } catch (e) {}
  }

  startLobbySlideshow() {
    this.stopLobbySlideshow();
    try {
      const slides = document.querySelectorAll('.lobby-slide');
      if (!slides || slides.length === 0) return;

      slides.forEach((s, idx) => {
        if (idx === this.lobbySlideIndex) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      this.lobbySlideshowTimer = setInterval(() => {
        const allSlides = document.querySelectorAll('.lobby-slide');
        if (!allSlides || allSlides.length === 0) return;
        this.lobbySlideIndex = (this.lobbySlideIndex + 1) % allSlides.length;

        allSlides.forEach((slide, idx) => {
          if (idx === this.lobbySlideIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });
      }, 7500);
    } catch (e) {}
  }

  stopLobbySlideshow() {
    if (this.lobbySlideshowTimer) {
      clearInterval(this.lobbySlideshowTimer);
      this.lobbySlideshowTimer = null;
    }
  }

  start() {
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // Stamp every freshly-spawned player projectile with the element of the move that
  // fired it, plus that move's same-type attack bonus. Runs the frame the shot appears.
  tagPlayerProjectiles(owner) {
    if (!owner || !owner.getMoveType) return;
    const ownerTypes = owner.getTypeList();
    const slotElement = owner.getMoveType(owner.attackType);
    for (const p of this.projectiles) {
      if (!p || p.elementType) continue;
      if (typeof p.type === 'string' && p.type.startsWith('enemy')) continue;
      const el = PROJECTILE_TYPE_ELEMENTS[p.type] || slotElement;
      p.elementType = el;
      p.stabMult = ownerTypes.includes(el) ? 1.2 : 1.0;
    }
  }

  registerComboHit(dmg) {
    this.comboHits++;
    this.comboDamage += dmg;
    this.comboTimer = 1.8;
    this.addFusionSync(2 + Math.min(8, this.comboHits * 0.5));

    const cDisp = document.getElementById('comboDisplay');
    const cHits = document.getElementById('comboHits');
    const cDmg = document.getElementById('comboDmg');
    if (cDisp && cHits && cDmg) {
      cHits.textContent = `${this.comboHits} HIT${this.comboHits > 1 ? 'S' : ''}!`;
      cDmg.textContent = `${this.comboDamage} DAMAGE`;
      cDisp.style.display = 'flex';
      cDisp.classList.remove('active');
      void cDisp.offsetWidth;
      cDisp.classList.add('active');
    }
  }

  triggerHitstop(duration = 0.024, shake = 2.5) {
    // Only trigger if not already active to prevent chain-freezing on continuous attacks
    if (this.hitstopTimer > 0) return;
    this.hitstopTimer = Math.min(0.028, duration);
    this.hitShake = Math.max(this.hitShake, Math.min(3.5, shake));
  }

  // Freebuff: finishing a 3-hit chain feeds the fusion meter — teamwork pays off
  registerComboFinisher(charId, perfect, source) {
    const bonus = perfect ? 16 : 10;
    this.addFusionSync(bonus);
    this.score += perfect ? 120 : 80;
    if (perfect && source) {
      this.particles.addDamageText(source.x, source.y - 108, '⭐ PERFECT FINISHER — SYNC CHARGED!', false, '#fde047');
    }
    this.updateHUD();
  }

  startNewGame(mode = 'story') {
    this.stopLobbySlideshow();
    this.gameMode = mode;
    this.score = 0;
    this.bubbledGemsCount = 0;
    this.starPowerMeter = 0;
    this.isOverdriveActive = false;
    this.overdriveTimer = 0;
    this.player.deactivatePinkOverdrive();

    this.starPowerMeterP2 = 0;
    this.isOverdriveActiveP2 = false;
    this.overdriveTimerP2 = 0;

    this.comboHits = 0;
    this.comboDamage = 0;
    this.comboTimer = 0;
    const comboEl = document.getElementById('comboDisplay');
    if (comboEl) comboEl.style.display = 'none';

    // Completely reset Fusion state on every game start / restart
    this.isFused = false;
    this.isHyperAttack = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    this.synergyBuffTimer = 0;
    this.fusionEnergy = (mode === 'practice') ? 100 : 0;
    this.fusionTimer = 0;
    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    this.player.isFusion = false;
    this.player.fusionKey = null;
    this.player.fusionData = null;
    this.player.isMergedInFusion = false;
    this.player.hasSynergyBuff = false;
    if (this.player2) {
      this.player2.hasSynergyBuff = false;
    }

    this.isTransitioning = false;
    this.transitionTimer = 0;
    this.lastStoryBeat = null;
    this.releaseAllInputs();
    this.dialogueActive = false;
    this.dialogueOnDone = null;
    this.screenTransition = null;
    this.cutinActive = false;
    this.cutinFreeze = 0;
    if (document.getElementById('dialogueBox')) document.getElementById('dialogueBox').style.display = 'none';
    if (document.getElementById('portraitCutin')) document.getElementById('portraitCutin').style.display = 'none';
    this.setVeil(false);

    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.maxHearts = diff.hearts;
    this.currentHearts = this.maxHearts;
    this.currentHeartsP2 = this.maxHearts;

    this.player.x = 220;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.switchCharacter(this.selectedCharP1, this.audio, this.particles);
    this.player.isShielding = false;
    this.player.isSpinDashing = false;
    this.player.onTeamHeal = (src, amt) => this.handleTeamHealing(src, amt);
    this.player.onComboFinisher = (charId, perfect, source) => this.registerComboFinisher(charId, perfect, source);

    const hudP2 = document.getElementById('hudP2Panel');
    if (this.playerMode === '2p') {
      const hudEl = document.getElementById('hud');
      if (hudEl) hudEl.classList.add('two-player');
      this.player2 = new PlayerHero(this.groundY, 'p2', this.stageWidth);
      this.player2.x = 340;
      this.player2.y = this.groundY;
      this.player2.switchCharacter(this.selectedCharP2, this.audio, this.particles);
      this.player2.onTeamHeal = (src, amt) => this.handleTeamHealing(src, amt);
      this.player2.onComboFinisher = (charId, perfect, source) => this.registerComboFinisher(charId, perfect, source);
      if (hudP2) hudP2.style.display = 'flex';
    } else {
      this.player2 = null;
      if (hudP2) hudP2.style.display = 'none';
      const hudEl = document.getElementById('hud');
      if (hudEl) hudEl.classList.remove('two-player');
    }
    this.updateFusionHUD();

    this.projectiles = [];
    this.pickups = [];

    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';

    this.hideAllScreens();
    document.getElementById('hud').style.display = 'grid';
    const actionBars = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    if (actionBars) actionBars.style.display = this.isRealMobile ? 'none' : 'flex';

    if (document.body) document.body.classList.add('in-game');
    const touchBox = document.getElementById('touchControls');
    if (touchBox && this.isRealMobile) {
      touchBox.classList.add('active');
      touchBox.style.display = 'flex';
    }

    this.state = 'playing';
    this.audio.lastStageIndex = this.stageIndex;
    if (mode === 'practice') {
      this.audio.playMusic('practice');
    } else {
      this.audio.playStageMusic(this.stageIndex, false);
    }
    this.updateHUD();
    this.updateActionBar();
    this.updateFusionHUD();

    if (mode === 'practice') {
      this.stageIndex = 0;
      this.startPracticeDojo();
    } else {
      this.stageIndex = 1;
      this.startStageWave();
    }
  }

  startPracticeDojo() {
    this.audio.playMusic('practice');
    this.player.revive(this.audio, this.particles);
    if (this.player2) this.player2.revive(this.audio, this.particles);

    // Remove "Practice" on top so health bar of enemy is clean and unobstructed
    const badge = document.getElementById('hudStageBadge');
    if (badge) badge.style.display = 'none';
    const objText = document.getElementById('hudObjectiveText');
    if (objText) objText.style.display = 'none';

    const bossHud = document.getElementById('bossHud');
    if (bossHud) {
      bossHud.classList.remove('story-mode-boss');
      bossHud.style.display = 'flex';
      const bName = document.getElementById('bossName');
      if (bName) bName.textContent = 'HOLO-JASPER (TRAINING DUMMY)';
      const bDigits = document.getElementById('bossHpDigits');
      if (bDigits) bDigits.textContent = 'INFINITE / INFINITE';
      const bFill = document.getElementById('bossHpFill');
      if (bFill) bFill.style.width = '100%';
    }

    this.enemyManager.reset(0, DIFFICULTY_CONFIG[this.difficulty], this.pickups);
    this.enemyManager.spawnDummy(760);
  }

  // --- PLANTS VS. ZOMBIES STYLE WAVE PROGRESSION & WARNINGS ---
  updateWaveLine() {
    if (!this._waveDom && typeof document !== 'undefined') {
      this._waveDom = {
        container: document.getElementById('pvzWaveContainer'),
        fillEl: document.getElementById('pvzWaveFill'),
        markerEl: document.getElementById('pvzWaveMarker'),
        labelEl: document.getElementById('pvzWaveLabel'),
        statusEl: document.getElementById('pvzWaveStatus')
      };
    }
    const d = this._waveDom;
    if (!d || !d.container) return;

    if (this.gameMode === 'practice' || this.stageIndex === 0) {
      if (d.container.style.display !== 'none') d.container.style.display = 'none';
      return;
    }
    if (d.container.style.display !== 'flex') d.container.style.display = 'flex';

    const pct = this.enemyManager.getProgressPercent();
    if (this._lastWavePct !== pct) {
      this._lastWavePct = pct;
      if (d.fillEl) d.fillEl.style.width = `${pct}%`;
      if (d.markerEl) d.markerEl.style.left = `${pct}%`;
    }

    const curWave = this.enemyManager.wave || 1;
    const maxW = this.enemyManager.maxWaves || 4;
    const isBoss = this.enemyManager.isBossAlive;
    const waveKey = `${curWave}_${maxW}_${isBoss}`;

    if (this._lastWaveKey !== waveKey) {
      this._lastWaveKey = waveKey;
      if (d.labelEl) {
        if (isBoss) {
          d.labelEl.textContent = '⚡ FINAL BOSS FIGHT!';
        } else if (curWave >= maxW) {
          d.labelEl.textContent = `⚠️ WAVE ${curWave} / ${maxW} (HUGE WAVE!)`;
        } else {
          d.labelEl.textContent = `WAVE ${curWave} / ${maxW}`;
        }
      }

      if (d.statusEl) {
        if (isBoss) {
          d.statusEl.textContent = 'BOSS ENCOUNTER';
          d.statusEl.style.color = '#f43f5e';
        } else if (curWave >= maxW) {
          d.statusEl.textContent = 'HUGE WAVE';
          d.statusEl.style.color = '#fbbf24';
        } else {
          d.statusEl.textContent = 'APPROACHING';
          d.statusEl.style.color = '#94a3b8';
        }
      }
    }
  }

  triggerWaveWarning(text, isBoss = false) {
    if (this.audio) {
      this.audio.playSfx(isBoss ? 'bossIntro' : 'waveWarning');
    }

    const banner = document.getElementById('waveWarningBanner');
    const textEl = document.getElementById('waveWarningText');
    if (banner && textEl) {
      textEl.textContent = text;
      if (isBoss) {
        banner.classList.add('boss-wave');
      } else {
        banner.classList.remove('boss-wave');
      }
      banner.style.display = 'flex';

      setTimeout(() => {
        if (banner) banner.style.display = 'none';
      }, 2600);
    }
  }

  // ======================================================================
  // STORY DIALOGUE (Stardew-style box with a portrait)
  // ======================================================================
  resolveStorySpeaker(line) {
    let who = line.w;
    // Story dialogue is always spoken by the canonical character for that scene —
    // whoever the player picked is irrelevant (the box must never put Steven's line
    // in, say, Lapis' mouth).
    if (who === 'party') who = 'steven';
    if (who === 'partner') who = (this.player2 && this.player2.activeChar) ? this.player2.activeChar : 'garnet';
    if (who === 'villain') {
      return {
        villain: true,
        name: line.n || 'CORRUPTED GEM',
        icon: line.i || '💎',
        color: STORY_VILLAIN_COLORS[this.stageIndex] || '#ef4444'
      };
    }
    const data = GUARDIAN_DATA[who] || GUARDIAN_DATA.steven;
    return {
      id: who,
      name: data.name,
      color: (OVERDRIVE_THEMES[who] || OVERDRIVE_THEMES.steven).color
    };
  }

  // Dialogue and cut-in are in-game overlays only: they vanish while the pause
  // menu, title screen or any modal is up, and come back on resume.
  setOverlaysVisible(visible) {
    if (!visible) {
      const gate = document.getElementById('bossGateHint');
      if (gate) gate.style.display = 'none';
    } else if (this.isWaitingForBoss) {
      const gate = document.getElementById('bossGateHint');
      if (gate) gate.style.display = 'flex';
    }
    const box = document.getElementById('dialogueBox');
    if (box) {
      if (!visible) {
        box.style.display = 'none';
      } else if (this.dialogueActive) {
        box.style.display = 'flex';
        box.classList.add('dialogue-in');
      }
    }
    if (!visible) {
      const cutin = document.getElementById('portraitCutin');
      if (cutin) cutin.style.display = 'none';
    } else if (this.cutinActive) {
      const cutin = document.getElementById('portraitCutin');
      if (cutin) cutin.style.display = 'flex';
    }
  }

  // Zero every held input. Called on blur, tab hide, pause and menu changes so a
  // missed keyup can never leave the hero sliding on their own.
  releaseAllInputs() {
    const blank = { left: false, right: false, jump: false, down: false, shield: false, dodge: false, attack: false, special: false, skill: false, overdrive: false };
    this.keysP1 = Object.assign(this.keysP1 || {}, blank);
    this.keysP2 = Object.assign(this.keysP2 || {}, blank);
    for (const hero of [this.player, this.player2]) {
      if (!hero) continue;
      hero.vx = 0;
      hero.isShielding = false;
      hero.isDodging = false;
    }
    // Release any on-screen touch buttons stuck in the pressed state
    document.querySelectorAll('.touch-btn.pressed, .touch-btn.active').forEach(el => el.classList.remove('pressed', 'active'));
  }

  releaseStuckTouchKeys() {
    // Only clears when no pointer is still down (multi-touch friendly)
    for (const hero of [this.player, this.player2]) {
      if (hero && hero.isDodging) hero.isDodging = false;
    }
  }

  releaseKeysOnModifierChange(e) {
    // Alt-Tab / Cmd-Tab / focus switches can swallow the keyup for a held key.
    if (e.key === 'Alt' || e.key === 'Meta' || e.key === 'OS') this.releaseAllInputs();
  }

  bindDialogueInput() {
    if (this._dialogueBound) return;
    this._dialogueBound = true;
    document.addEventListener('keydown', (e) => {
      if (!this.dialogueActive) return;
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'KeyE') {
        e.preventDefault();
        e.stopPropagation(); // keep the game's own key handling out of it
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        this.advanceDialogue();
      }
    }, true);
    const box = document.getElementById('dialogueBox');
    if (box) box.addEventListener('click', () => this.advanceDialogue());
  }

  showDialogue(lines, onDone) {
    if (!lines || !lines.length) { if (onDone) onDone(); return; }
    this.bindDialogueInput();
    this.dialogueLines = lines.slice();
    this.dialogueIndex = 0;
    this.dialogueOnDone = onDone || null;
    this.dialogueActive = true;
    this.dialogueTimer = 0;
    this.dialogueAutoTimer = 0;
    const box = document.getElementById('dialogueBox');
    if (box) {
      box.style.display = 'flex';
      box.classList.remove('dialogue-in');
      void box.offsetWidth;
      box.classList.add('dialogue-in');
    }
    this.renderDialogueLine();
    this.audio.playSfx('menuTap');
  }

  renderDialogueLine() {
    const line = this.dialogueLines[this.dialogueIndex];
    if (!line) { this.closeDialogue(); return; }
    const speaker = this.resolveStorySpeaker(line);
    const nameEl = document.getElementById('dialogueName');
    const textEl = document.getElementById('dialogueText');
    const portraitEl = document.getElementById('dialoguePortrait');
    if (nameEl) {
      nameEl.textContent = speaker.name;
      nameEl.parentElement.style.background = `linear-gradient(135deg, ${speaker.color}, #7c1533)`;
    }
    if (textEl) textEl.textContent = line.t;
    const hintEl = document.getElementById('dialogueHint');
    if (hintEl) {
      hintEl.textContent = 'CLICK or SPACE ▶';
      // Inline style so no cascade quirk can ever hide the "how to continue" hint.
      hintEl.style.display = 'block';
      hintEl.style.visibility = 'visible';
      hintEl.style.opacity = '0.9';
      hintEl.style.color = '#ffd700';
      hintEl.style.fontSize = '10px';
      hintEl.style.fontWeight = '900';
      hintEl.style.letterSpacing = '1.2px';
      hintEl.style.textAlign = 'right';
    }
    if (portraitEl) {
      if (speaker.villain) {
        portraitEl.innerHTML = `<div style="width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:44px;background:radial-gradient(circle, ${speaker.color}55, #0b0714);border:2px solid ${speaker.color};box-shadow:0 0 22px ${speaker.color}88">${speaker.icon}</div>`;
      } else {
        portraitEl.innerHTML = (typeof getGuardianSvg === 'function')
          ? getGuardianSvg(speaker.id, 88)
          : ((GUARDIAN_PORTRAITS && GUARDIAN_PORTRAITS[speaker.id]) || '');
      }
    }
  }

  advanceDialogue() {
    if (!this.dialogueActive) return;
    this.dialogueIndex++;
    this.dialogueAutoTimer = 0;
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.closeDialogue();
    } else {
      this.renderDialogueLine();
      this.audio.playSfx('menuTap');
    }
  }

  closeDialogue() {
    this.dialogueActive = false;
    const box = document.getElementById('dialogueBox');
    if (box) {
      box.classList.remove('dialogue-in');
      setTimeout(() => { if (!this.dialogueActive) box.style.display = 'none'; }, 200);
    }
    const cb = this.dialogueOnDone;
    this.dialogueOnDone = null;
    if (cb) cb();
  }

  // ======================================================================
  // PORTRAIT CUT-IN (hitstop super-move intro)
  // ======================================================================
  startCutin(opts) {
    if (this.cutinActive) return;
    const o = opts || {};
    this.cutinActive = true;
    this.cutinTimer = o.duration || 1.9;
    this.cutinFreeze = o.freeze != null ? o.freeze : this.cutinTimer;
    this.cutinOnDone = o.onDone || null;

    const root = document.getElementById('portraitCutin');
    const kicker = document.getElementById('cutinKicker');
    const nameEl = document.getElementById('cutinName');
    const quoteEl = document.getElementById('cutinQuote');
    const flash = document.getElementById('cutinFlash');
    const leftWrap = document.getElementById('cutinLeftWrap');
    const rightWrap = document.getElementById('cutinRightWrap');
    const leftPortrait = document.getElementById('cutinPortraitLeft');
    const rightPortrait = document.getElementById('cutinPortraitRight');

    // Overdrive: one portrait on that player's side.
    // Fusion: the fused gem takes the centre, both partners flank it as medallions.
    const primaryId = o.portraitId || o.charId;
    const partnerId = o.secondPortraitId || null;
    const centerId = o.centerPortraitId || null;
    const isFusionCard = !!centerId;
    const showCenter = isFusionCard;
    const showLeft = isFusionCard ? true : (o.side !== 'right');
    const showRight = isFusionCard ? true : (o.side === 'right');

    // Painted straight into a <canvas>: a data-URL <img> can paint a frame late (and
    // showed up blank), while canvas output is synchronous.
    const portraitMarkup = (id) => id
      ? `<canvas class="cutin-portrait-canvas" data-portrait="${id}" width="512" height="512"></canvas>`
      : `<div style="font-size:170px;line-height:1">${o.icon || '💎'}</div>`;

    const centerWrap = document.getElementById('cutinCenterWrap');
    const centerPortrait = document.getElementById('cutinPortraitCenter');

    if (centerWrap) centerWrap.classList.toggle('hidden', !showCenter);
    if (leftWrap) {
      leftWrap.classList.toggle('hidden', !showLeft);
      leftWrap.classList.toggle('is-partner', isFusionCard);
    }
    if (rightWrap) {
      rightWrap.classList.toggle('hidden', !showRight);
      rightWrap.classList.toggle('is-partner', isFusionCard);
    }
    if (centerPortrait) centerPortrait.innerHTML = showCenter ? portraitMarkup(centerId) : '';
    if (leftPortrait) leftPortrait.innerHTML = showLeft ? portraitMarkup(primaryId) : '';
    if (rightPortrait) rightPortrait.innerHTML = showRight ? portraitMarkup(partnerId || primaryId) : '';

    [centerPortrait, leftPortrait, rightPortrait].forEach(el => {
      if (!el) return;
      const cv = el.querySelector('canvas[data-portrait]');
      if (!cv) return;
      try { drawPortraitCard(cv.getContext('2d'), cv.dataset.portrait, cv.width); } catch (e) {}
    });

    // Restart the entrance animation on every activation
    [centerWrap, leftWrap, rightWrap].forEach(w => {
      if (!w) return;
      w.style.animation = 'none';
      void w.offsetWidth;
      w.style.animation = '';
    });
    if (kicker) { kicker.textContent = o.kicker || 'PINK OVERDRIVE'; kicker.style.color = o.kickerColor || '#ffd700'; }
    if (nameEl) nameEl.textContent = o.name || '';
    if (quoteEl) quoteEl.textContent = o.quote || '';
    if (flash) { flash.classList.remove('flash'); void flash.offsetWidth; }
    if (root) root.style.display = 'flex';

    setTimeout(() => { if (flash) flash.classList.add('flash'); }, 260);
    this.audio.playSfx('overdrive');
  }

  endCutin() {
    this.cutinActive = false;
    this.cutinFreeze = 0;
    const root = document.getElementById('portraitCutin');
    if (root) root.style.display = 'none';
    const cb = this.cutinOnDone;
    this.cutinOnDone = null;
    if (cb) cb();
  }

  // ======================================================================
  // SCREEN TRANSITIONS (walk out right -> black veil -> next wave/level)
  // ======================================================================
  setVeil(on) {
    const veil = document.getElementById('stageVeil');
    if (!veil) return;
    if (on) {
      veil.style.display = 'block';
      void veil.offsetWidth;
      veil.classList.add('veil-in');
    } else {
      veil.classList.remove('veil-in');
      setTimeout(() => { if (!veil.classList.contains('veil-in')) veil.style.display = 'none'; }, 430);
    }
  }

  // The last wave is cleared: the boss waits at the right edge. The player walks
  // there themselves so they can farm bubbles/pickups for Overdrive first.
  updateStoryModeUI() {
    const btn = document.getElementById('btnStoryMode');
    const label = document.getElementById('btnStoryModeText');
    if (btn) btn.classList.toggle('off', this.storyMode === false);
    if (label) label.textContent = this.storyMode === false ? 'Story: Off' : 'Story: On';
  }

  toggleStoryMode() {
    this.storyMode = !this.storyMode;
    SafeStorage.setItem('su_storyMode', this.storyMode ? 'true' : 'false');
    this.updateStoryModeUI();
    this.audio.playSfx('menuTap');
  }

  // Jump straight into any episode from the menu (no restarting from episode 1).
  startEpisode(stageNumber) {
    const n = Math.max(1, Math.min(10, parseInt(stageNumber, 10) || 1));
    if (this.dialogueActive) {
      this.dialogueActive = false;
      this.dialogueOnDone = null;
      const box = document.getElementById('dialogueBox');
      if (box) box.style.display = 'none';
    }
    this.startNewGame('story');
    // startNewGame forces episode 1 — override it for the chosen stage.
    this.stageIndex = n;
    this.lastStoryBeat = null;
    this.isWaitingForBoss = false;
    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.reset(n, diff, this.pickups);
    this.updateHUD();
    this.startStageWave();
  }

  openEpisodeScreen() {
    const screen = document.getElementById('episodeSelectScreen');
    if (screen) screen.style.display = 'flex';
    this.audio.playSfx('menuTap');
  }

  closeEpisodeScreen() {
    const screen = document.getElementById('episodeSelectScreen');
    if (screen) screen.style.display = 'none';
  }

  openBossGate() {
    if (this.isWaitingForBoss) return;
    this.isWaitingForBoss = true;
    this.bossGatePulse = 0;
    this.bossGateAutoTimer = (this.storyMode === false) ? 2.4 : 0;
    this.audio.playSfx('waveWarning');
    this.triggerWaveWarning('⚠️ THE BOSS IS WAITING AT THE RIGHT EDGE! ⚠️', true);
    const hint = document.getElementById('bossGateHint');
    if (hint) hint.style.display = 'flex';
  }

  enterBossArena() {
    if (!this.isWaitingForBoss) return;
    this.isWaitingForBoss = false;
    const hint = document.getElementById('bossGateHint');
    if (hint) hint.style.display = 'none';
    this.audio.playSfx('warpPad');
    this.setVeil(true);
    this.screenTransition = { kind: 'boss', phase: 'veil', timer: 0.42 };
  }

  drawBossGateArrow(ctx) {
    const x = this.stageWidth - 78;
    const y = this.groundY - 96;
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 220);
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * pulse;

    const glow = ctx.createRadialGradient(x, y, 6, x, y, 82);
    glow.addColorStop(0, 'rgba(255, 207, 51, 0.55)');
    glow.addColorStop(1, 'rgba(255, 207, 51, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 82, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffcf33';
    ctx.strokeStyle = '#7c1533';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const off = ((Date.now() / 300 + i * 0.5) % 1.5) * 16;
      ctx.beginPath();
      ctx.moveTo(x - 30 + off, y - 17);
      ctx.lineTo(x + 2 + off, y);
      ctx.lineTo(x - 30 + off, y + 17);
      ctx.lineTo(x - 17 + off, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = "900 13px 'Fredoka One', 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.strokeText('BOSS AHEAD', x - 8, y - 36);
    ctx.fillStyle = '#fff7ed';
    ctx.fillText('BOSS AHEAD', x - 8, y - 36);
    ctx.restore();
  }

  beginWaveExit(nextWaveIdx) {
    if (this.screenTransition) return;
    this.isWaitingForWaveClear = false;
    this.screenTransition = { kind: 'wave', phase: 'walk', timer: 0, nextWaveIdx };
  }

  beginStageExit() {
    if (this.screenTransition) return;
    this.isTransitioning = false;
    this.screenTransition = { kind: 'stage', phase: 'walk', timer: 0 };
  }

  performStageAdvance() {
    const banner = document.getElementById('stageClearBanner');
    if (banner) banner.style.display = 'none';
    this.stageIndex++;
    const stageHeal = (this.enemyManager.stageHeal ?? -1);
    if (stageHeal < 0) {
      this.currentHearts = this.maxHearts;
      this.currentHeartsP2 = this.maxHearts;
    } else {
      this.currentHearts = Math.min(this.maxHearts, this.currentHearts + stageHeal);
      this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + stageHeal);
    }
    this.player.revive(this.audio, this.particles);
    if (this.player2) this.player2.revive(this.audio, this.particles);
    this.isTransitioning = false;
    this.updateHUD();
    this.startStageWave();
  }

  updateScreenTransition(dt) {
    const t = this.screenTransition;
    if (!t) return;
    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    if (t.phase === 'walk') {
      let allGone = true;
      for (const p of players) {
        p.facing = 1;
        p.vx = 260;
        p.x += 260 * dt;
        p.walkAnim = (p.walkAnim || 0) + dt * 12;
        p.isAttacking = false;
        p.isShielding = false;
        p.actionTimer = 0;
        if (p.x < this.stageWidth + 60) allGone = false;
      }
      if (allGone) {
        this.setVeil(true);
        t.phase = 'veil';
        t.timer = 0.45;
      }
    } else if (t.phase === 'veil') {
      t.timer -= dt;
      if (t.timer <= 0) {
        for (const p of players) { p.x = -60; p.vx = 0; p.vy = 0; p.walkAnim = 0; }
        t.phase = 'enter';
      }
    } else if (t.phase === 'enter') {
      let settled = true;
      for (const p of players) {
        if (p.x < 230) {
          p.x += 320 * dt;
          p.walkAnim += dt * 12;
          p.facing = 1;
          settled = false;
        } else {
          p.vx = 0;
        }
      }
      if (settled) {
        this.setVeil(false);
        this.screenTransition = null;
        if (t.kind === 'wave') {
          this.prepareWave(t.nextWaveIdx);
        } else if (t.kind === 'boss') {
          this.prepareBossWave();
        } else {
          this.performStageAdvance();
        }
      }
    }
  }

  startStageWave() {
    this.isWaitingForBoss = false;
    const gateHint = document.getElementById('bossGateHint');
    if (gateHint) gateHint.style.display = 'none';
    const titles = [
      'EPISODE 1: BEACH CITY BOARDWALK',
      'EPISODE 2: GALAXY WARP & SPIRE',
      'EPISODE 3: THE PRIME KINDERGARTEN',
      'EPISODE 4: SUBTERRANEAN MANTLE DRILL',
      "EPISODE 5: BISMUTH'S BURNING FORGE",
      'EPISODE 6: THE FROZEN NORTH & JASPER',
      "EPISODE 7: PINK DIAMOND'S SPACE ZOO",
      'EPISODE 8: HOMEWORLD ABDUCTION SHORE',
      'EPISODE 9: HOMEWORLD TRIAL & OFF-COLORS',
      'EPISODE 10: CHANGE YOUR MIND - ERA 3'
    ];
    const objectives = [
      'Defend Beach City from Centipeetle Hatchlings & Alpha Mother!',
      'Battle Corrupted Blade Quartzes and repel ancient Spire Colossus!',
      'Neutralize artificial fusion mutants and Kindergarten Amalgam Titan!',
      "Drill into Earth's core and bubble the planetary Geo-Weapon Cluster!",
      'Enter the molten forge and defeat the Ancient Forge Sentinel!',
      'Subdue snow corruptions and conquer the corrupted warrior Jasper!',
      'Infiltrate deep space zoo and defeat Holy Blue Agate Warden!',
      'Withstand crushing Topaz fusions and protect Beach City!',
      'Escape Homeworld courtroom and defeat the Robonoid Hunter Titan!',
      "Confront White Diamond's Supreme Mecha and heal all gems!"
    ];

    const stageTitle = titles[this.stageIndex - 1] || `EPISODE ${this.stageIndex}`;
    const stageObj = objectives[this.stageIndex - 1] || 'Defeat all corrupted gem monsters!';

    const badge = document.getElementById('hudStageBadge');
    if (badge) {
      badge.textContent = stageTitle;
      badge.style.display = 'block';
    }
    const objText = document.getElementById('hudObjectiveText');
    if (objText) {
      objText.textContent = stageObj;
      objText.style.display = 'block';
    }

    const bossHud = document.getElementById('bossHud');
    if (bossHud) {
      bossHud.classList.add('story-mode-boss');
    }

    const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
    this.enemyManager.reset(this.stageIndex, diff, this.pickups);

    // Multi-Wave Progression State Reset
    this.waveIndex = 0;
    this.isBossSpawning = false;
    this.bossSpawnTimer = 0;
    this.waveSpawnQueue = [];
    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;

    // Start Multi-Wave Progression (4 Waves + Final Boss Wave)
    this.audio.lastStageIndex = this.stageIndex;
    this.audio.playStageMusic(this.stageIndex, false);
    this.startEpisodeWaveSequence();
  }

  startEpisodeWaveSequence() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    this.enemyManager.wave = 1;
    this.enemyManager.maxWaves = epData.waves.length;
    this.prepareWave(0);
  }

  prepareWave(waveIdx) {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData || waveIdx >= epData.waves.length) {
      // All preliminary waves cleared: Summon Final Boss!
      this.prepareBossWave();
      return;
    }

    // Story beat for this wave (plays once, before the enemies arrive)
    const story = (this.storyMode !== false) ? STORY_SCRIPT[this.stageIndex] : null;
    const beatKey = `${this.stageIndex}:w${waveIdx}`;
    if (story && story.waves && story.waves[waveIdx] && this.lastStoryBeat !== beatKey) {
      this.lastStoryBeat = beatKey;
      this.waveIndex = waveIdx;
      this.showDialogue(story.waves[waveIdx], () => this.prepareWave(waveIdx));
      return;
    }

    this.waveIndex = waveIdx;
    const currentWaveData = epData.waves[waveIdx];
    this.enemyManager.wave = waveIdx + 1;
    this.updateWaveLine();

    // Trigger PvZ-Style "Huge Wave is Approaching" on huge waves!
    if (currentWaveData.isHugeWave) {
      this.triggerWaveWarning("⚠️ A HUGE WAVE OF CORRUPTED GEMS IS APPROACHING! ⚠️", false);
    }

    // Build spawn queue driven by dt inside update()
    this.waveSpawnQueue = [];
    const enemies = currentWaveData.enemies;
    enemies.forEach((enemyType, idx) => {
      const spawnX = (idx % 2 === 0)
        ? 320 + Math.random() * 500
        : 1800 + Math.random() * 550;
      this.waveSpawnQueue.push({
        type: enemyType,
        timer: idx * 0.65,
        spawnX: spawnX
      });
    });

    // Harder tiers flood the arena with reinforcements from the far edge
    const bonus = this.enemyManager.waveBonus || 0;
    for (let b = 0; b < bonus; b++) {
      const pool = enemies && enemies.length ? enemies : ['centipeetle'];
      const extraType = pool[Math.floor(Math.random() * pool.length)];
      this.waveSpawnQueue.push({
        type: extraType,
        timer: enemies.length * 0.65 + b * 0.9,
        spawnX: 2200 + Math.random() * 320
      });
    }

    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;
  }

  prepareBossWave() {
    const epData = EPISODE_WAVES[this.stageIndex];
    if (!epData) return;

    const story = (this.storyMode !== false) ? STORY_SCRIPT[this.stageIndex] : null;
    const beatKey = `${this.stageIndex}:boss`;
    if (story && story.boss && this.lastStoryBeat !== beatKey) {
      this.lastStoryBeat = beatKey;
      this.showDialogue(story.boss, () => this.prepareBossWave());
      return;
    }

    this.waveIndex = epData.waves.length;
    this.waveSpawnQueue = [];
    this.enemyManager.wave = epData.waves.length + 1;
    this.updateWaveLine();

    // Dramatic Boss Intro Warning Banner & Intense Boss Track
    this.triggerWaveWarning(`⚡ FINAL BOSS: ${epData.bossName}! ⚡`, true);
    this.audio.playStageMusic(this.stageIndex, true);
    this.isBossSpawning = true;
    this.bossSpawnTimer = 1.2;
  }

  handleTeamHealing(sourceHero, amount = 1) {
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

  knockoutOrPoofPlayer(hero) {
    if (!hero || hero.isFallen) return;

    // Cleanly defuse if merged in fusion
    if (this.isFused) {
      this.finishTagTeamHyperAttack();
    }

    hero.isFallen = true;
    hero.fallenTimer = 0;
    hero.vx = 0;
    hero.isAttacking = false;
    hero.isShielding = false;
    hero.isSpinDashing = false;
    hero.isDodging = false;
    hero.invulnerableTimer = 999;

    const isHumanoid = (hero.activeChar === 'steven' || hero.activeChar === 'connie');
    hero.fallenType = isHumanoid ? 'lie_down' : 'poofed';

    if (isHumanoid) {
      this.audio.playSfx('hit');
      this.particles.addDamageText(hero.x, hero.y - 70, `${hero.activeChar === 'steven' ? 'STEVEN' : 'CONNIE'} IS DOWN! 💫`, true, '#f43f5e');
      this.particles.addSparkle(hero.x, hero.y - 25, '#fbbf24', 16, 4);
    } else {
      this.audio.playSfx('poof');
      const gemColors = {
        garnet: '#ef4444',
        amethyst: '#a855f7',
        pearl: '#38bdf8',
        bismuth: '#f97316',
        peridot: '#22c55e',
        lapis: '#0ea5e9',
        rose: '#f43f5e',
        jasper: '#ea580c'
      };
      const col = gemColors[hero.activeChar] || '#c084fc';
      this.particles.addPoof(hero.x, hero.y - 30, '#ffffff');
      this.particles.addPoof(hero.x, hero.y - 30, col);
      this.particles.addSparkle(hero.x, hero.y - 25, col, 24, 7);
      this.particles.addDamageText(hero.x, hero.y - 70, `${hero.activeChar.toUpperCase()} POOFED! 💎 (REVIVES NEXT STAGE)`, true, col);
    }

    this.checkTeamWipe();
  }

  checkTeamWipe() {
    if (this.playerMode === '2p' && this.player2) {
      if (this.currentHearts <= 0 && this.currentHeartsP2 <= 0) {
        if (!this.gameOverTimerActive) {
          this.gameOverTimerActive = true;
          setTimeout(() => {
            if (this.state === 'playing') {
              this.gameOverTimerActive = false;
              this.handleGameOver();
            }
          }, 2000);
        }
      }
    } else {
      if (this.currentHearts <= 0) {
        if (!this.gameOverTimerActive) {
          this.gameOverTimerActive = true;
          setTimeout(() => {
            if (this.state === 'playing') {
              this.gameOverTimerActive = false;
              this.handleGameOver();
            }
          }, 2000);
        }
      }
    }
  }

  gameLoop(currentTime) {
    try {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      // Coordinate and Camera Sanity Guards (Prevent NaN physics explosion)
      if (isNaN(this.cameraX)) this.cameraX = 0;
      if (this.player) {
        if (isNaN(this.player.x)) this.player.x = 220;
        if (isNaN(this.player.y)) this.player.y = this.groundY;
        if (isNaN(this.player.vx)) this.player.vx = 0;
        if (isNaN(this.player.vy)) this.player.vy = 0;
      }
      if (this.player2) {
        if (isNaN(this.player2.x)) this.player2.x = 340;
        if (isNaN(this.player2.y)) this.player2.y = this.groundY;
        if (isNaN(this.player2.vx)) this.player2.vx = 0;
        if (isNaN(this.player2.vy)) this.player2.vy = 0;
      }

      if (this.hitstopTimer > 0) {
        this.hitstopTimer -= dt;
        if (this.hitShake > 0) this.hitShake = Math.max(0, this.hitShake - dt * 25);
        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
        return;
      }
      if (this.hitShake > 0) {
        this.hitShake = Math.max(0, this.hitShake - dt * 25);
      }

      if (this.state === 'playing') {
        this.update(dt);
      }

      this.render();
    } catch (err) {
      console.error("Game loop error caught:", err);
    }
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    // Portrait cut-in: the world keeps flowing, just in slow motion, so the run
    // never stalls. The timer itself runs on real time.
    if (this.cutinActive) {
      this.cutinTimer -= dt;
      if (this.cutinTimer <= 0) {
        this.endCutin();
      } else {
        dt *= (this.cutinSlowFactor || 0.22);
      }
    }

    this.environment.update();
    this.particles.update();

    if (this.dialogueActive) {
      this.dialogueAutoTimer = (this.dialogueAutoTimer || 0) + dt;
      if (this.dialogueAutoTimer > 7) this.advanceDialogue();
      return;
    }
    if (this.screenTransition) {
      this.updateScreenTransition(dt);
      return;
    }

    // Boss gate: walk to the right edge when you are ready (or auto in arcade mode).
    if (this.isWaitingForBoss) {
      this.bossGatePulse = (this.bossGatePulse || 0) + dt;
      if (this.bossGateAutoTimer > 0) {
        this.bossGateAutoTimer -= dt;
        if (this.bossGateAutoTimer <= 0) this.enterBossArena();
      } else if (this.player && this.player.x > this.stageWidth - 140) {
        this.enterBossArena();
      }
    }

    if (this.isTransitioning) {
      // Delta-time driven stage transition: Immune to browser background throttling & inactivity!
      if (this.transitionTimer > 0) {
        this.transitionTimer -= dt;
        if (this.transitionTimer <= 0) {
          const banner = document.getElementById('stageClearBanner');
          if (banner) banner.style.display = 'none';
          this.stageIndex++;
          const stageHeal = (this.enemyManager.stageHeal ?? -1);
          if (stageHeal < 0) {
            this.currentHearts = this.maxHearts;
            this.currentHeartsP2 = this.maxHearts;
          } else {
            this.currentHearts = Math.min(this.maxHearts, this.currentHearts + stageHeal);
            this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + stageHeal);
          }
          this.player.revive(this.audio, this.particles);
          if (this.player2) this.player2.revive(this.audio, this.particles);
          this.isTransitioning = false;
          this.updateHUD();
          this.startStageWave();
        }
      }
      return;
    }

    const platforms = this.environment.getPlatformsForStage(this.stageIndex, this.gameMode === 'practice');

    // Combo Timer Decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboTimer = 0;
        this.comboHits = 0;
        this.comboDamage = 0;
        const cDisp = document.getElementById('comboDisplay');
        if (cDisp) cDisp.style.display = 'none';
      }
    }

    // In Practice Mode: Rapid Overdrive charging so moves can be tested continuously
    if (this.gameMode === 'practice') {
      this.starPowerMeter = Math.min(100, this.starPowerMeter + dt * 45);
      if (this.playerMode === '2p') {
        this.starPowerMeterP2 = Math.min(100, (this.starPowerMeterP2 || 0) + dt * 45);
      }
      this.fusionEnergy = Math.min(100, (this.fusionEnergy || 0) + dt * 50);
    }

    // Update Smooth Dynamic Camera tracking player (Widescreen 2600px Arena)
    const targetCamX = (this.playerMode === '2p' && this.player2)
      ? ((this.player.x + this.player2.x) / 2) - (this.canvas.width / 2)
      : this.player.x - (this.canvas.width / 2);

    this.cameraX += (targetCamX - this.cameraX) * Math.min(1, dt * 6.5);
    this.cameraX = Math.max(0, Math.min(this.stageWidth - this.canvas.width, this.cameraX));

    // Update Plants vs Zombies style wave progression bar
    this.updateWaveLine();

    // Update Canonical Gem Fusion Timer
    if (this.isFused) {
      this.fusionTimer -= dt;
      if (this.fusionTimer <= 0) {
        this.unfuseGems();
      }
    }

    // 0. Update Overdrive States
    if (this.isOverdriveActive) {
      this.overdriveTimer -= dt;
      if (this.overdriveTimer <= 0) {
        this.isOverdriveActive = false;
        this.overdriveTimer = 0;
        this.player.deactivatePinkOverdrive();
      }
    }

    if (this.isOverdriveActiveP2 && this.player2) {
      this.overdriveTimerP2 -= dt;
      if (this.overdriveTimerP2 <= 0) {
        this.isOverdriveActiveP2 = false;
        this.overdriveTimerP2 = 0;
        this.player2.deactivatePinkOverdrive();
      }
    }
    this.updateHUD();

    // Synergy Buff Timer (Post-Fusion Tag Team Power Surge)
    if (this.synergyBuffTimer > 0) {
      this.synergyBuffTimer -= dt;
      this.player.hasSynergyBuff = true;
      if (this.player2) this.player2.hasSynergyBuff = true;
      if (Math.random() < 0.3) {
        this.particles.addSparkle(this.player.x, this.player.y - 30, '#ffd700', 4, 2);
        if (this.player2) this.particles.addSparkle(this.player2.x, this.player2.y - 30, '#38bdf8', 4, 2);
      }
    } else {
      this.player.hasSynergyBuff = false;
      if (this.player2) this.player2.hasSynergyBuff = false;
    }

    // --- WAVE CONTROLLER (Delta-Time Driven, Immune to Pauses & Idling) ---
    if (!this.isTransitioning && this.gameMode !== 'practice' && this.stageIndex > 0) {
      // 1. Process wave spawn queue
      if (this.waveSpawnQueue && this.waveSpawnQueue.length > 0) {
        for (let q = this.waveSpawnQueue.length - 1; q >= 0; q--) {
          const item = this.waveSpawnQueue[q];
          item.timer -= dt;
          if (item.timer <= 0) {
            this.enemyManager.spawnEnemy(item.type, item.spawnX);
            this.waveSpawnQueue.splice(q, 1);
          }
        }
      }

      // 2. Boss spawning timer
      if (this.isBossSpawning) {
        this.bossSpawnTimer -= dt;
        if (this.bossSpawnTimer <= 0) {
          this.isBossSpawning = false;
          const epData = EPISODE_WAVES[this.stageIndex];
          if (epData) {
            this.enemyManager.spawnEnemy(epData.boss, 1350);
            const bossHud = document.getElementById('bossHud');
            if (bossHud) {
              bossHud.style.display = 'flex';
              bossHud.classList.add('story-mode-boss');
              const nameEl = document.getElementById('bossName');
              if (nameEl) nameEl.textContent = epData.bossName;
            }
          }
        }
      }

      // 3. Wave clearance check & progression
      const epData = EPISODE_WAVES[this.stageIndex];
      if (epData && !this.isBossSpawning && (!this.waveSpawnQueue || this.waveSpawnQueue.length === 0)) {
        if (this.waveIndex < epData.waves.length) {
          if (this.enemyManager.enemies.length === 0) {
            if (!this.isWaitingForWaveClear) {
              this.isWaitingForWaveClear = true;
              this.waveClearTimer = 1.2;
            } else {
              this.waveClearTimer -= dt;
              if (this.waveClearTimer <= 0) {
                this.isWaitingForWaveClear = false;
                // Waves flow straight into each other — no walking off screen.
                // Only the run up to a boss asks the player to walk right, manually.
                if (this.waveIndex >= epData.waves.length - 1) {
                  this.openBossGate();
                } else {
                  this.prepareWave(this.waveIndex + 1);
                }
              }
            }
          } else {
            this.isWaitingForWaveClear = false;
          }
        }
      }
    }

    // 1. Update Players (or Tag-Team Hyper Fusion Attack)
    if (this.isHyperAttack) {
      this.updateHyperAttack(dt, platforms);
    } else if (this.isFused && this.playerMode === '2p' && this.player2) {
      // 2-Player Co-Op Fusion: Shared movement and divided skills!
      const sharedKeys = {
        left: this.keysP1.left || this.keysP2.left,
        right: this.keysP1.right || this.keysP2.right,
        jump: this.keysP1.jump || this.keysP2.jump,
        down: this.keysP1.down || this.keysP2.down,
        shield: this.keysP1.shield || this.keysP2.shield,
        dodge: this.keysP1.dodge || this.keysP2.dodge,
        attack: this.keysP1.attack,
        special: this.keysP1.special,
        skill: this.keysP1.skill,
        overdrive: this.keysP1.overdrive
      };

      this.player.update(dt, sharedKeys, this.audio, this.particles, this.projectiles, this.pickups, platforms);
      this.tagPlayerProjectiles(this.player);

      // Keep Player 2 synced with Fusion
      this.player2.x = this.player.x;
      this.player2.y = this.player.y;
      this.player2.vx = this.player.vx;
      this.player2.vy = this.player.vy;
      this.player2.facing = this.player.facing;
      this.player2.isMergedInFusion = true;

      // Tick P2 Fusion Cooldowns
      if (this.player2AttackCooldown > 0) this.player2AttackCooldown -= dt;
      if (this.player2SpecialCooldown > 0) this.player2SpecialCooldown -= dt;
      if (this.player2SkillCooldown > 0) this.player2SkillCooldown -= dt;

      // Process Player 2 Fusion Actions
      if (this.keysP2.attack && (this.player2AttackCooldown || 0) <= 0) {
        this.executePlayer2FusionAction('j');
      }
      if (this.keysP2.special && (this.player2SpecialCooldown || 0) <= 0) {
        this.executePlayer2FusionAction('k');
      }
      if (this.keysP2.skill && (this.player2SkillCooldown || 0) <= 0) {
        this.executePlayer2FusionAction('l');
      }
    } else {
      this.player.update(dt, this.keysP1, this.audio, this.particles, this.projectiles, this.pickups, platforms);
      this.tagPlayerProjectiles(this.player);

      if (this.playerMode === '2p' && this.player2) {
        this.player2.update(dt, this.keysP2, this.audio, this.particles, this.projectiles, this.pickups, platforms);
        this.tagPlayerProjectiles(this.player2);
      }
    }

    // 2. Update Pickups
    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.life -= dt;
      let nearPlayer = null;
      for (const pl of players) {
        if (Math.hypot(p.x - pl.x, p.y - pl.y) < 38) {
          nearPlayer = pl;
          break;
        }
      }

      if (nearPlayer) {
        if (p.type === 'cookie' || p.type === 'heart') {
          if (!nearPlayer.isFallen) {
            if (nearPlayer.playerId === 'p2') {
              this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + 1);
            } else {
              this.currentHearts = Math.min(this.maxHearts, this.currentHearts + 1);
            }
            this.particles.addSparkle(nearPlayer.x, nearPlayer.y - 30, '#ff4d79', 16, 5);
            const txt = (p.type === 'heart') ? '+1 HEART! ❤️' : '+1 HEART (COOKIE CAT!)';
            this.particles.addDamageText(nearPlayer.x, nearPlayer.y - 50, txt, false, '#ff2a6d');
            this.audio.playSfx('cookie');
            this.score += 150;
            this.addFusionSync(15);
            this.pickups.splice(i, 1);
            this.updateHUD();
          }
        } else {
          this.score += 150;
          this.addFusionSync(15);
          this.pickups.splice(i, 1);
          this.updateHUD();
        }
      } else if (p.life <= 0) {
        this.pickups.splice(i, 1);
      }
    }

    // 3. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      p.life -= dt;

      if (p.hitCooldowns) {
        for (const k in p.hitCooldowns) {
          if (p.hitCooldowns[k] > 0) p.hitCooldowns[k] -= dt;
        }
      }

      if (p.type === 'holoPearl') {
        p.sparkleTimer = (p.sparkleTimer || 0) + dt;
        if (p.sparkleTimer >= 0.08) {
          p.sparkleTimer = 0;
          this.particles.addSparkle(p.x - (p.facing || 1) * 18, p.y + 12, p.isOverdrive ? '#f472b6' : '#67e8f9', 4, 3);
        }
      }

      if (p.type.startsWith('enemy')) {
        for (const pl of players) {
          if (pl.isFallen) continue;
          const hitRad = p.radius || (p.width ? p.width / 2 : 15);
          const dist = Math.hypot(p.x - pl.x, p.y - (pl.y - 35));
          if (dist < hitRad + 20) {
            const damaged = pl.takeDamage(p.damage || 1, this.particles, this.audio);
            if (damaged) {
              if (pl.playerId === 'p2') {
                this.currentHeartsP2 = Math.max(0, this.currentHeartsP2 - (p.damage || 1));
                if (this.currentHeartsP2 <= 0) {
                  this.knockoutOrPoofPlayer(pl);
                }
              } else {
                this.currentHearts = Math.max(0, this.currentHearts - (p.damage || 1));
                if (this.currentHearts <= 0) {
                  this.knockoutOrPoofPlayer(pl);
                }
              }
              this.updateHUD();
              this.checkTeamWipe();
            }
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }

      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Update Enemies
    this.enemyManager.update(dt, this.player, this.audio, this.particles, this.projectiles, (poofedEnemy) => {
      this.score += poofedEnemy.isBoss ? 1500 : 300;
      this.addFusionSync(poofedEnemy.isBoss ? 25 : 15);
      this.updateHUD();
    }, platforms, this.player2);

    // Player Defeat Verification (Steven/Connie Down, Gems Poofed)
    if (this.currentHearts <= 0 && !this.player.isFallen) {
      this.knockoutOrPoofPlayer(this.player);
    }
    if (this.player2 && this.currentHeartsP2 <= 0 && !this.player2.isFallen) {
      this.knockoutOrPoofPlayer(this.player2);
    }

    // 5. Gem Bubbling: Auto-collect poofed gems on proximity / touch
    this.autoCollectBubbledGems();

    // 6. Action Bar Cooldown Sweeps
    this.updateCooldowns();

    // 7. Victory Check (Story mode only)
    const epData = EPISODE_WAVES[this.stageIndex];
    const wavesFinished = epData ? (this.waveIndex >= epData.waves.length) : true;
    const queueEmpty = !this.waveSpawnQueue || this.waveSpawnQueue.length === 0;

    if (
      !this.isTransitioning &&
      this.gameMode === 'story' &&
      wavesFinished &&
      !this.isBossSpawning &&
      queueEmpty &&
      this.enemyManager.bossDefeated &&
      this.enemyManager.enemies.length === 0
    ) {
      if (this.stageIndex < this.maxStages) {
        this.advanceToNextStage();
      } else {
        this.handleFinalVictory();
      }
    }
  }

  activatePinkOverdrive(playerId = 'p1') {
    if (this.state !== 'playing') return;
    const hero = playerId === 'p2' ? this.player2 : this.player;
    if (!hero) return;

    const alreadyActive = playerId === 'p2' ? this.isOverdriveActiveP2 : this.isOverdriveActive;
    const meter = playerId === 'p2' ? (this.starPowerMeterP2 || 0) : this.starPowerMeter;
    if (alreadyActive) return;
    if (this.gameMode !== 'practice' && meter < 100) return;
    if (this.cutinActive || this.dialogueActive || this.screenTransition) return;

    const theme = OVERDRIVE_THEMES[hero.activeChar] || OVERDRIVE_THEMES.steven;
    this.startCutin({
      kicker: 'PINK OVERDRIVE',
      kickerColor: theme.color,
      charId: hero.activeChar,
      name: theme.name,
      quote: 'PINK STATE · 2× POWER · 12 SECONDS',
      side: playerId === 'p2' ? 'right' : 'left',
      duration: 1.05,
      freeze: 0,
      onDone: () => this.applyOverdrive(playerId)
    });
  }

  // The actual power-up, played after the portrait cut-in finishes.
  applyOverdrive(playerId = 'p1') {
    if (playerId === 'p1') {
      if (this.isOverdriveActive) return;
      if (this.gameMode !== 'practice' && this.starPowerMeter < 100) return;

      this.starPowerMeter = 0;
      this.isOverdriveActive = true;
      this.overdriveTimer = this.overdriveDuration;
      this.player.activatePinkOverdrive(this.overdriveDuration);

      this.audio.playSfx('overdrive');
      const theme = OVERDRIVE_THEMES[this.player.activeChar] || OVERDRIVE_THEMES.steven;
      this.particles.addPoof(this.player.x, this.player.y - 30, theme.color);
      this.particles.addSparkle(this.player.x, this.player.y - 30, '#ffffff', 32, 8);
      this.particles.addDamageText(this.player.x, this.player.y - 65, `${theme.msg} (2X POWER)`, true, theme.color);
    } else if (playerId === 'p2' && this.player2) {
      if (this.isOverdriveActiveP2) return;
      if (this.gameMode !== 'practice' && (this.starPowerMeterP2 || 0) < 100) return;

      this.starPowerMeterP2 = 0;
      this.isOverdriveActiveP2 = true;
      this.overdriveTimerP2 = this.overdriveDuration;
      this.player2.activatePinkOverdrive(this.overdriveDuration);

      this.audio.playSfx('overdrive');
      const theme = OVERDRIVE_THEMES[this.player2.activeChar] || OVERDRIVE_THEMES.garnet;
      this.particles.addPoof(this.player2.x, this.player2.y - 30, theme.color);
      this.particles.addSparkle(this.player2.x, this.player2.y - 30, '#ffffff', 32, 8);
      this.particles.addDamageText(this.player2.x, this.player2.y - 65, `${theme.msg} (2X POWER)`, true, theme.color);
    }

    this.updateHUD();
  }

  autoCollectBubbledGems() {
    const gems = this.enemyManager.droppedGems;
    const players = [this.player];
    if (this.playerMode === '2p' && this.player2) players.push(this.player2);

    for (let i = gems.length - 1; i >= 0; i--) {
      const g = gems[i];
      let collector = null;
      for (const pl of players) {
        if (Math.hypot(g.x - pl.x, g.y - pl.y) < 95) {
          collector = pl;
          break;
        }
      }

      if (collector) {
        this.audio.playSfx('powerup');
        this.particles.addSparkle(g.x, g.y - 15, '#ffdf00', 18, 6);
        const awardPct = g.bubblePercent || 20;
        this.particles.addDamageText(g.x, g.y - 40, `💎 BUBBLED! (+${awardPct}% OVERDRIVE)`, true, '#38bdf8');

        this.bubbledGemsCount++;
        this.score += 500;

        if (collector.playerId === 'p2') {
          this.starPowerMeterP2 = Math.min(100, (this.starPowerMeterP2 || 0) + awardPct);
        } else {
          this.starPowerMeter = Math.min(100, this.starPowerMeter + awardPct);
        }

        this.savedBubbles.push({
          color: g.color,
          shape: g.shape,
          type: g.type,
          timestamp: Date.now()
        });
        SafeStorage.setItem('su_bubbledGems', JSON.stringify(this.savedBubbles));

        gems.splice(i, 1);
        this.updateHUD();
      }
    }
  }

  advanceToNextStage() {
    if (this.isTransitioning || this.screenTransition) return;
    this.isTransitioning = false;
    this.beginStageExit();
    this.isBossSpawning = false;
    this.bossSpawnTimer = 0;
    this.waveSpawnQueue = [];
    this.isWaitingForWaveClear = false;
    this.waveClearTimer = 0;
    this.enemyManager.bossDefeated = false;
    this.enemyManager.isBossAlive = false;
    this.enemyManager.enemies = [];
    this.audio.playSfx('stageClear');

    // Cleanly defuse if fused upon finishing a stage so fusion doesn't glitch across stages
    if (this.isFused) {
      this.finishTagTeamHyperAttack();
    }

    const nextNames = [
      'Episode 2: Galaxy Warp & Ancient Spire',
      'Episode 3: The Prime Kindergarten',
      'Episode 4: Subterranean Mantle Drill - The Cluster',
      'Episode 5: Bismuth\'s Burning Forge',
      'Episode 6: The Frozen North & Jasper',
      'Episode 7: Pink Diamond\'s Space Zoo',
      'Episode 8: Homeworld Abduction Shore',
      'Episode 9: The Homeworld Trial & Off-Colors',
      'Episode 10: Change Your Mind - White Diamond Mecha'
    ];

    const banner = document.getElementById('stageClearBanner');
    const titleEl = document.getElementById('stageClearTitle');
    const descEl = document.getElementById('stageClearDesc');

    if (banner && titleEl && descEl) {
      titleEl.textContent = `STAGE ${this.stageIndex} COMPLETED! ⭐`;
      descEl.textContent = `Corruptions cleansed! Next: ${nextNames[this.stageIndex - 1] || 'Next Stage'}`;
      banner.style.display = 'block';
    }
  }

  handleFinalVictory() {
    this.state = 'victory';
    this.audio.playSfx('fusion');
    this.audio.stopMusic();

    if (document.body) document.body.classList.remove('in-game');
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.classList.remove('active');
      touchBox.style.display = 'none';
    }

    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';

    if (this.score > this.highScore) {
      this.highScore = this.score;
      SafeStorage.setItem('su_highScore', this.highScore.toString());
    }

    const title = document.getElementById('victoryTitle');
    if (title) title.textContent = 'GRAND VICTORY! EARTH IS SAVED!';
    const subtitle = document.getElementById('victorySubtitle');
    if (subtitle) subtitle.textContent = 'All 10 Campaign Episodes conquered! The Great Diamond Authority is reconciled, corruption is healed, and Era 3 galactic peace is achieved!';

    document.getElementById('vStatPoofed').textContent = 'ALL CLEARED';
    document.getElementById('vStatBubbled').textContent = `${this.bubbledGemsCount}`;
    document.getElementById('vStatScore').textContent = `${this.score}`;
    document.getElementById('vStatRank').textContent = this.currentHearts >= 4 ? 'STAR ⭐ (S+)' : 'GEM 💎 (A)';

    document.getElementById('victoryScreen').style.display = 'flex';
  }

  handleGameOver() {
    this.state = 'gameover';
    this.audio.stopMusic();
    this.audio.playSfx('hit');

    if (document.body) document.body.classList.remove('in-game');
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.classList.remove('active');
      touchBox.style.display = 'none';
    }

    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';

    if (this.score > this.highScore) {
      this.highScore = this.score;
      SafeStorage.setItem('su_highScore', this.highScore.toString());
    }

    document.getElementById('goFinalScore').textContent = `${this.score}`;
    document.getElementById('goBubbled').textContent = `${this.bubbledGemsCount}`;
    document.getElementById('gameOverScreen').style.display = 'flex';
  }

  nextStage() {
    this.stageIndex++;
    if (this.stageIndex > this.maxStages) {
      this.showTitleScreen();
    } else {
      this.hideAllScreens();
      this.state = 'playing';
      this.currentHearts = this.maxHearts;
      this.currentHeartsP2 = this.maxHearts;
      const diff = DIFFICULTY_CONFIG[this.difficulty] || DIFFICULTY_CONFIG.medium;
      this.enemyManager.reset(this.stageIndex, diff, this.pickups);
      this.audio.playMusic('battle');
      this.updateHUD();
      this.updateActionBar();
      this.startStageWave();
    }
  }

  render() {
    // Low-health boss: the whole arena trembles while it is about to break.
    const boss = this.enemyManager.enemies.find(en => en.isBoss && !en.isPoofed && !en.isImmortalDummy);
    let shakeX = 0;
    let shakeY = 0;
    if (this.hitShake && this.hitShake > 0) {
      shakeX += (Math.random() - 0.5) * this.hitShake * 2.2;
      shakeY += (Math.random() - 0.5) * this.hitShake * 2.2;
    }
    if (boss && boss.maxHp > 0 && boss.hp / boss.maxHp < 0.3) {
      const frac = Math.min(1, (1 - (boss.hp / boss.maxHp) / 0.3));
      const amp = 1.4 + 4.2 * frac;
      const t = Date.now() / 42;
      shakeX = Math.sin(t) * amp;
      shakeY = Math.cos(t * 1.7) * amp * 0.7;
    }
    this.ctx.save();
    this.ctx.translate(shakeX, shakeY);

    // 1. Far Parallax Background (Screen Space)
    this.environment.drawBackground(this.ctx, this.stageIndex, this.cameraX, this.gameMode === 'practice');

    // 2. World Space Elements (Shifted by camera offset -cameraX)
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX), 0);

    // Foreground Terrain & Platforms across full 2600px
    this.environment.drawForeground(this.ctx, this.stageIndex, this.gameMode === 'practice');

    // Boss gate arrow: tells the player where to walk, and never moves them there.
    if (this.isWaitingForBoss) this.drawBossGateArrow(this.ctx);

    // Pickups (Cookie Cats, Hearts)
    for (const p of this.pickups) {
      this.drawPickup(p);
    }

    // Enemies (Walkers, Jumpers, Flyers) & Bosses
    this.enemyManager.draw(this.ctx);

    // Projectiles
    for (const p of this.projectiles) {
      this.drawProjectile(p);
    }

    // Players
    this.player.draw(this.ctx);
    if (this.playerMode === '2p' && this.player2) {
      this.player2.draw(this.ctx);
    }

    // Particle System & Hit Numbers
    this.particles.draw(this.ctx);

    this.ctx.restore();
    this.ctx.restore(); // screen-shake transform
  }

  drawPickup(p) {
    this.ctx.save();
    const bob = Math.sin(Date.now() / 150) * 4;
    if (p.type === 'cookie') {
      // Cookie Cat
      this.ctx.fillStyle = '#451a03';
      this.ctx.beginPath();
      this.ctx.arc(p.x - 4, p.y + bob, 12, Math.PI * 0.5, Math.PI * 1.5);
      this.ctx.fill();

      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.arc(p.x + 4, p.y + bob, 12, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.fill();

      this.ctx.fillStyle = '#451a03';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x - 12, p.y - 6 + bob);
      this.ctx.lineTo(p.x - 6, p.y - 18 + bob);
      this.ctx.lineTo(p.x, p.y - 8 + bob);
      this.ctx.fill();

      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y - 8 + bob);
      this.ctx.lineTo(p.x + 6, p.y - 18 + bob);
      this.ctx.lineTo(p.x + 12, p.y - 6 + bob);
      this.ctx.fill();
    } else if (p.type === 'heart') {
      // Healing Heart Pickup
      this.ctx.fillStyle = '#ff2a6d';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const hx = p.x, hy = p.y + bob;
      this.ctx.moveTo(hx, hy);
      this.ctx.bezierCurveTo(hx - 12, hy - 12, hx - 16, hy + 4, hx, hy + 16);
      this.ctx.bezierCurveTo(hx + 16, hy + 4, hx + 12, hy - 12, hx, hy);
      this.ctx.fill();
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawProjectile(p) {
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
    } else if (p.type === 'connieSwordBeam') {
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      this.ctx.fillStyle = 'rgba(244, 114, 182, 0.85)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 24, -Math.PI * 0.4, Math.PI * 0.4);
      this.ctx.lineTo(4, 0);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#fdf2f8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, (p.radius || 24) * 0.6, -Math.PI * 0.35, Math.PI * 0.35);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'connieShadowSlash') {
      this.ctx.translate(p.x, p.y);
      this.ctx.strokeStyle = '#f472b6';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.moveTo(-35, -25);
      this.ctx.lineTo(35, 25);
      this.ctx.moveTo(-35, 25);
      this.ctx.lineTo(35, -25);
      this.ctx.stroke();
    } else if (p.type === 'jasperCrashHelmet') {
      this.ctx.translate(p.x, p.y);
      this.ctx.scale(p.vx < 0 ? -1 : 1, 1);
      // Flame trail
      this.ctx.fillStyle = 'rgba(234, 88, 12, 0.65)';
      this.ctx.beginPath();
      this.ctx.moveTo(-p.radius, -12);
      this.ctx.lineTo(-p.radius - 24, 0);
      this.ctx.lineTo(-p.radius, 12);
      this.ctx.closePath();
      this.ctx.fill();
      // Bronze/Amber Helmet Dome
      this.ctx.fillStyle = '#b45309';
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 26, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Heavy Horn Spikes
      this.ctx.fillStyle = '#ea580c';
      this.ctx.beginPath();
      this.ctx.moveTo(p.radius * 0.5, -p.radius * 0.7);
      this.ctx.lineTo(p.radius * 1.3, -p.radius * 0.4);
      this.ctx.lineTo(p.radius * 0.7, 0);
      this.ctx.lineTo(p.radius * 1.3, p.radius * 0.4);
      this.ctx.lineTo(p.radius * 0.5, p.radius * 0.7);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (p.type === 'jasperSpinDashHit') {
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = 'rgba(234, 88, 12, 0.55)';
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 32, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else if (p.type === 'stevenShield') {
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 40);
      this.ctx.fillStyle = 'rgba(255, 96, 151, 0.9)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.strokeStyle = '#f43f5e';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 8, 0, Math.PI * 1.5);
      this.ctx.stroke();
    } else if (p.type === 'roseShield') {
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 35);
      this.ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 20, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#fbcfe8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 9, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (p.type === 'garnetGauntlet') {
      this.ctx.translate(p.x, p.y);
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.moveTo(-p.radius, -8);
      this.ctx.lineTo(-p.radius - 16, 0);
      this.ctx.lineTo(-p.radius, 8);
      this.ctx.fill();

      this.ctx.fillStyle = '#e11d48';
      this.ctx.fillRect(-p.radius + 4, -p.radius / 2, p.radius * 1.2, p.radius);

      this.ctx.fillStyle = '#fbbf24';
      this.ctx.beginPath();
      this.ctx.moveTo(p.radius * 0.8, -6);
      this.ctx.lineTo(p.radius * 1.4, 0);
      this.ctx.lineTo(p.radius * 0.8, 6);
      this.ctx.fill();
    } else if (p.type === 'bismuthAnvil') {
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 80);
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(-18, -10, 36, 20);
      this.ctx.fillStyle = '#f97316';
      this.ctx.fillRect(-12, -6, 24, 12);
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(-18, -10, 36, 20);
    } else if (p.type === 'metalGirder') {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 90);
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillRect(-18, -8, 36, 16);
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(-18, -8, 36, 16);
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.fillRect(-14, -4, 28, 8);
      this.ctx.restore();
    } else if (p.type === 'scrapGear') {
      // Peridot Levitated Iron Cog / Gear
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 60);
      this.ctx.fillStyle = '#475569';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Gear teeth
      const ctx = this.ctx;
      ctx.fillStyle = '#64748b';
      for (let t = 0; t < 6; t++) {
        const ga = (Math.PI / 3) * t;
        ctx.fillRect(Math.cos(ga) * 16 - 3, Math.sin(ga) * 16 - 3, 6, 6);
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'trashLid') {
      // Peridot Corrugated Metal Trash Can Lid (Show-Accurate!)
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 50);
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius || 20, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#cbd5e1';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // Center Handle
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(-6, -3, 12, 6);
      this.ctx.strokeStyle = '#84cc16';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(-6, -3, 12, 6);
      this.ctx.restore();
    } else if (p.type === 'flaskRobonoid') {
      this.ctx.fillStyle = '#84cc16';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y - 12, p.radius || 18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.beginPath();
      this.ctx.arc(p.x + 4, p.y - 14, 5, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (p.type === 'hydroFist') {
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
      // --- SHOW-ACCURATE HOLO-PEARL TRAINING CLONE ("Steven the Sword Fighter") ---
      // Full-sized sky-blue translucent sparring clone of Pearl in a classic fencing lunge!
      const holoAlpha = 0.78 + Math.sin(Date.now() / 45) * 0.12;
      const holoBody = p.isOverdrive ? `rgba(244, 114, 182, ${holoAlpha})` : `rgba(56, 189, 248, ${holoAlpha})`;
      const holoOutline = p.isOverdrive ? '#f472b6' : '#67e8f9';
      const holoStar = p.isOverdrive ? '#ffffff' : '#e0f2fe';

      this.ctx.fillStyle = holoBody;
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 1.8;

      // 1. Deep Fencing Lunge Stance: Legs & Ballet Flats
      // Back leg extended straight behind (-X)
      this.ctx.beginPath();
      this.ctx.moveTo(-4, -12);
      this.ctx.lineTo(-24, 24);
      this.ctx.lineTo(-20, 24);
      this.ctx.lineTo(-1, -12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Back ballet slipper
      this.ctx.fillRect(-28, 22, 9, 4);

      // Front leg bent forward in dynamic lunge (+X)
      this.ctx.beginPath();
      this.ctx.moveTo(4, -12);
      this.ctx.lineTo(14, 8);
      this.ctx.lineTo(12, 24);
      this.ctx.lineTo(7, 24);
      this.ctx.lineTo(9, 8);
      this.ctx.lineTo(0, -12);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
      // Front ballet slipper
      this.ctx.fillRect(7, 22, 11, 4);

      // 2. Slender Fencing Tunic & Sash
      this.ctx.beginPath();
      this.ctx.moveTo(-8, -44);
      this.ctx.lineTo(10, -44);
      this.ctx.lineTo(12, -14);
      this.ctx.lineTo(-10, -14);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Bold 5-Pointed Star on tunic
      this.ctx.fillStyle = holoStar;
      this.ctx.beginPath();
      const stX = 1, stY = -30, stR = 5.5;
      for (let s = 0; s < 5; s++) {
        const a = (Math.PI * 2 / 5) * s - Math.PI / 2;
        const x1 = stX + Math.cos(a) * stR;
        const y1 = stY + Math.sin(a) * stR;
        if (s === 0) this.ctx.moveTo(x1, y1); else this.ctx.lineTo(x1, y1);
        const aMid = a + Math.PI / 5;
        this.ctx.lineTo(stX + Math.cos(aMid) * (stR * 0.45), stY + Math.sin(aMid) * (stR * 0.45));
      }
      this.ctx.closePath();
      this.ctx.fill();

      // Floating Chiffon Sash trailing behind (-X)
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 2.2;
      this.ctx.beginPath();
      this.ctx.moveTo(-10, -18);
      this.ctx.quadraticCurveTo(-22, -12, -26, 0);
      this.ctx.stroke();

      // 3. Slender Neck & Head with Conical Hair Point pointing BACK (-X)
      this.ctx.fillStyle = holoBody;
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 1.8;
      // Neck
      this.ctx.fillRect(-2, -52, 5, 8);
      // Head
      this.ctx.beginPath();
      this.ctx.ellipse(0, -60, 11, 12, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Conical Pixie Hair Point sweeping cleanly BACKWARD (-X)
      this.ctx.beginPath();
      this.ctx.moveTo(2, -70);
      this.ctx.quadraticCurveTo(-8, -72, -22, -62);
      this.ctx.quadraticCurveTo(-11, -54, -4, -53);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Sharp Pointed Nose pointing cleanly FORWARD (+X)
      this.ctx.beginPath();
      this.ctx.moveTo(6, -60);
      this.ctx.lineTo(15, -57);
      this.ctx.lineTo(6, -55);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Forehead Luminous Pearl Gem with glowing lens flare!
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#e0f2fe';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.ellipse(2, -67, 3.5, 5.5, 0.15, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Robotic / Fencing Hologram Anime Eye
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.ellipse(4, -59, 3.2, 4.2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = holoOutline;
      this.ctx.beginPath();
      this.ctx.arc(4.5, -59, 1.8, 0, Math.PI * 2);
      this.ctx.fill();

      // 4. Horizontal Holographic Scanline Interference Stripes
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.lineWidth = 1.2;
      for (let y = -68; y <= 22; y += 6) {
        this.ctx.beginPath();
        this.ctx.moveTo(-22, y);
        this.ctx.lineTo(24, y);
        this.ctx.stroke();
      }

      // 5. GLOWING SILVER-CYAN FENCING RAPIER (Real weapon size: Bell Guard + Long Blade!)
      this.ctx.save();
      this.ctx.translate(12, -26); // Extended fencing hand

      // Cup / Bell Guard
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = holoOutline;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 6.5, -Math.PI * 0.5, Math.PI * 0.5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      // Long, piercing rapier blade thrusting straight forward (+X)
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.4;
      this.ctx.beginPath();
      this.ctx.moveTo(6, 0);
      this.ctx.lineTo(52, 0); // 46px long rapier blade!
      this.ctx.stroke();

      // Piercing needle tip & energy sparks
      this.ctx.fillStyle = '#67e8f9';
      this.ctx.beginPath();
      this.ctx.moveTo(52, 0);
      this.ctx.lineTo(46, -2);
      this.ctx.lineTo(46, 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();

      this.ctx.restore();
    } else if (p.type === 'purpleGeyser') {
      // Amethyst Violet Crystalline Energy Geyser (Spectacular Rising Volcanic Pillar!)
      const progress = 1 - Math.max(0, p.life / (p.maxLife || 0.60));
      // Rapid upward explosion (0-0.3), peak vibration (0.3-0.7), dissipating fade (0.7-1.0)
      let surgeH;
      if (progress < 0.28) {
        surgeH = (progress / 0.28) * 135;
      } else if (progress < 0.72) {
        surgeH = 135 + Math.sin(Date.now() / 30) * 8;
      } else {
        surgeH = Math.max(0, ((1 - progress) / 0.28) * 135);
      }

      const surgeW = 60;
      const gx = p.x;
      const gy = p.y || this.groundY; // Sits flush on the battlefield ground

      this.ctx.save();
      // 1. Violet Ground Rupture Glow & Fissure Cracks
      this.ctx.fillStyle = 'rgba(168, 85, 247, 0.55)';
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(gx, gy, 46, 14, 0, 0, Math.PI * 2);
      else this.ctx.arc(gx, gy, 36, 0, Math.PI * 2);
      this.ctx.fill();

      // Ground crack lines
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(gx - 32, gy);
      this.ctx.lineTo(gx - 12, gy + 4);
      this.ctx.lineTo(gx + 14, gy - 2);
      this.ctx.lineTo(gx + 34, gy + 3);
      this.ctx.stroke();

      // 2. Exploding Crystalline Energy Column
      const grad = this.ctx.createLinearGradient(gx, gy, gx, gy - surgeH);
      grad.addColorStop(0, '#3b0764');
      grad.addColorStop(0.3, '#7e22ce');
      grad.addColorStop(0.7, '#c084fc');
      grad.addColorStop(1, '#f5d0fe');
      this.ctx.fillStyle = grad;

      this.ctx.beginPath();
      this.ctx.moveTo(gx - surgeW * 0.5, gy);
      this.ctx.lineTo(gx - surgeW * 0.38, gy - surgeH * 0.5);
      this.ctx.lineTo(gx - surgeW * 0.48, gy - surgeH * 0.72);
      this.ctx.lineTo(gx, gy - surgeH); // Sharp crystal peak
      this.ctx.lineTo(gx + surgeW * 0.48, gy - surgeH * 0.72);
      this.ctx.lineTo(gx + surgeW * 0.38, gy - surgeH * 0.5);
      this.ctx.lineTo(gx + surgeW * 0.5, gy);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // Inner Core Glow
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.beginPath();
      this.ctx.moveTo(gx - 10, gy);
      this.ctx.lineTo(gx, gy - surgeH * 0.85);
      this.ctx.lineTo(gx + 10, gy);
      this.ctx.closePath();
      this.ctx.fill();

      // 3. Twin Crackling Lightning Zig-Zags
      this.ctx.strokeStyle = '#fde047';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(gx - 8, gy - 12);
      this.ctx.lineTo(gx + 14, gy - surgeH * 0.35);
      this.ctx.lineTo(gx - 12, gy - surgeH * 0.65);
      this.ctx.lineTo(gx + 6, gy - surgeH * 0.95);
      this.ctx.stroke();

      this.ctx.strokeStyle = '#e9d5ff';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(gx + 8, gy - 8);
      this.ctx.lineTo(gx - 10, gy - surgeH * 0.4);
      this.ctx.lineTo(gx + 12, gy - surgeH * 0.7);
      this.ctx.stroke();

      // 4. Glowing Quartz Star at peak
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(gx, gy - surgeH, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#fde047';
      this.ctx.beginPath();
      this.ctx.arc(gx, gy - surgeH, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    } else if (p.type === 'moltenShockwave') {
      const fissureW = p.width || 220;
      const fissureH = p.height || 40;
      this.ctx.save();
      this.ctx.translate(p.x + fissureW / 2, p.y + fissureH / 2);
      this.ctx.fillStyle = 'rgba(234, 88, 12, 0.55)';
      this.ctx.fillRect(-fissureW / 2, -10, fissureW, 20);
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.fillRect(-fissureW / 2 + 10, -5, fissureW - 20, 10);
      this.ctx.fillStyle = '#f97316';
      for (let s = -fissureW / 2 + 15; s <= fissureW / 2 - 15; s += 25) {
        const spikeHeight = 18 + Math.sin(s * 0.2 + Date.now() * 0.015) * 12;
        this.ctx.beginPath();
        this.ctx.moveTo(s - 10, 5);
        this.ctx.lineTo(s, -spikeHeight);
        this.ctx.lineTo(s + 10, 5);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();
    } else if (p.type === 'roseShockwave') {
      const mandalaR = (p.width || 190) / 2;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(Date.now() / 200);
      this.ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, mandalaR * 0.9, 0, Math.PI * 2);
      this.ctx.stroke();

      const petals = 8;
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        this.ctx.save();
        this.ctx.rotate(angle);
        this.ctx.fillStyle = 'rgba(251, 207, 232, 0.65)';
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        if (this.ctx.ellipse) this.ctx.ellipse(mandalaR * 0.5, 0, mandalaR * 0.38, mandalaR * 0.18, 0, 0, Math.PI * 2);
        else this.ctx.arc(mandalaR * 0.5, 0, mandalaR * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      }
      this.ctx.restore();
    } else if (p.type === 'magneticVortex') {
      const radius = (p.width || 220) / 2;
      this.ctx.save();
      this.ctx.translate(p.x + radius, p.y + (p.height || 80) / 2);
      const rot = Date.now() / 120;
      this.ctx.strokeStyle = 'rgba(132, 204, 22, 0.75)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius * 0.85, rot, rot + Math.PI * 1.8);
      this.ctx.stroke();
      this.ctx.restore();
    } else if (p.type === 'seismicShockwave' || p.type === 'giantGauntletSlam') {
      const w = p.width || 220;
      this.ctx.save();
      this.ctx.translate(p.x + w / 2, p.y + 15);
      this.ctx.strokeStyle = '#fbbf24';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w / 2, 18, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, 45, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    } else if (p.type === 'bubbleShockwave') {
      const w = p.width || 140;
      this.ctx.save();
      this.ctx.translate(p.x + w / 2, p.y + 25);
      this.ctx.strokeStyle = '#ff94ba';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      if (this.ctx.ellipse) this.ctx.ellipse(0, 0, w / 2, 28, 0, 0, Math.PI * 2);
      else this.ctx.arc(0, 0, 40, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.fillStyle = 'rgba(255, 96, 151, 0.25)';
      this.ctx.fill();
      this.ctx.restore();
    } else {
      this.ctx.fillStyle = p.color || '#ffcf33';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius || 12, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(p.x - 2, p.y - 2, (p.radius || 12) * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  updateHUD() {
    if (!this._domHud && typeof document !== 'undefined') {
      this._domHud = {
        heartsContainer: document.getElementById('hudHearts'),
        nameEl: document.getElementById('hudCharacterName'),
        avatarEl: document.getElementById('hudAvatarIcon'),
        odLabel: document.getElementById('overdriveLabel'),
        fill: document.getElementById('harmonyBarFill'),
        pct: document.getElementById('harmonyPercent'),
        btnOverdrive: document.getElementById('btnOverdrive'),
        btnText: document.getElementById('btnOverdriveText'),
        touchOd: document.getElementById('touchOverdrive'),
        nameP2: document.getElementById('hudCharacterNameP2'),
        avatarP2: document.getElementById('hudAvatarIconP2'),
        heartsContainerP2: document.getElementById('hudHeartsP2'),
        odLabelP2: document.getElementById('overdriveLabelP2'),
        fillP2: document.getElementById('harmonyBarFillP2'),
        pctP2: document.getElementById('harmonyPercentP2'),
        btnOverdriveP2: document.getElementById('btnOverdriveP2'),
        btnTextP2: document.getElementById('btnOverdriveTextP2'),
        p2Panel: document.getElementById('hudP2Panel'),
        scoreEl: document.getElementById('hudScore'),
        bubbledEl: document.getElementById('hudBubbledGems')
      };
    }
    const d = this._domHud || {};

    // 1. Player 1 Hearts (Re-use existing DOM nodes to prevent GC thrashing & mobile lag)
    const heartsContainer = d.heartsContainer;
    if (heartsContainer) {
      if (heartsContainer.children.length !== this.maxHearts) {
        heartsContainer.innerHTML = '';
        for (let i = 0; i < this.maxHearts; i++) {
          const heart = document.createElement('span');
          heart.className = 'hud-heart';
          heart.textContent = i < this.currentHearts ? '💖' : '🖤';
          heartsContainer.appendChild(heart);
        }
      } else {
        for (let i = 0; i < this.maxHearts; i++) {
          const expected = i < this.currentHearts ? '💖' : '🖤';
          const child = heartsContainer.children[i];
          if (child.textContent !== expected) {
            child.textContent = expected;
          }
        }
      }
    }

    // Player 1 Character Info & Character-Specific Overdrive
    const charData = GUARDIAN_DATA[this.player.activeChar] || GUARDIAN_DATA.steven;
    const nameEl = d.nameEl;
    if (nameEl && nameEl.textContent !== charData.name) nameEl.textContent = charData.name;
    const avatarEl = d.avatarEl;
    if (avatarEl && avatarEl.dataset.char !== this.player.activeChar) {
      avatarEl.dataset.char = this.player.activeChar;
      avatarEl.innerHTML = (typeof getGuardianSvg === 'function')
        ? getGuardianSvg(this.player.activeChar, 44)
        : charData.icon;
    }

    const odTheme = OVERDRIVE_THEMES[this.player.activeChar] || OVERDRIVE_THEMES.steven;
    const odLabel = d.odLabel;
    if (odLabel && odLabel.textContent !== `⚡ ${odTheme.name}`) odLabel.textContent = `⚡ ${odTheme.name}`;

    const fill = d.fill;
    const pct = d.pct;
    const btnOverdrive = d.btnOverdrive;
    const btnText = d.btnText;
    const touchOd = d.touchOd;

    if (this.isOverdriveActive) {
      const remainingPct = Math.max(0, (this.overdriveTimer / this.overdriveDuration) * 100);
      if (fill) fill.style.width = `${remainingPct}%`;
      if (pct) pct.textContent = `${Math.ceil(this.overdriveTimer)}s ACTIVE!`;
      if (btnOverdrive) {
        btnOverdrive.className = 'btn-overdrive-hud active';
        if (btnText) btnText.textContent = `${odTheme.short} ACTIVE (${Math.ceil(this.overdriveTimer)}s)`;
      }
      if (touchOd) touchOd.classList.add('ready');
    } else {
      if (fill) fill.style.width = `${this.starPowerMeter}%`;
      if (pct) pct.textContent = `${Math.floor(this.starPowerMeter)}%`;
      const isReady = this.starPowerMeter >= 100 || this.gameMode === 'practice';
      if (btnOverdrive) {
        btnOverdrive.className = `btn-overdrive-hud ${isReady ? 'ready' : 'disabled'}`;
        if (btnText) btnText.textContent = isReady ? `${odTheme.short} READY! [${this.playerMode === '2p' ? 'R' : 'U'}]` : odTheme.name;
      }
      if (touchOd) {
        if (isReady) touchOd.classList.add('ready');
        else touchOd.classList.remove('ready');
      }
    }

    // 2. Player 2 HUD Panel (Active in 2P Co-Op Mode)
    if (this.playerMode === '2p' && this.player2) {
      const charDataP2 = GUARDIAN_DATA[this.player2.activeChar] || GUARDIAN_DATA.garnet;
      const nameP2 = d.nameP2;
      if (nameP2 && nameP2.textContent !== `${charDataP2.name} (P2)`) nameP2.textContent = `${charDataP2.name} (P2)`;
      const avatarP2 = d.avatarP2;
      if (avatarP2 && avatarP2.dataset.char !== this.player2.activeChar) {
        avatarP2.dataset.char = this.player2.activeChar;
        avatarP2.innerHTML = (typeof getGuardianSvg === 'function')
          ? getGuardianSvg(this.player2.activeChar, 44)
          : charDataP2.icon;
      }

      const heartsContainerP2 = d.heartsContainerP2;
      if (heartsContainerP2) {
        if (heartsContainerP2.children.length !== this.maxHearts) {
          heartsContainerP2.innerHTML = '';
          for (let i = 0; i < this.maxHearts; i++) {
            const heart = document.createElement('span');
            heart.className = 'hud-heart';
            heart.textContent = i < this.currentHeartsP2 ? '💖' : '🖤';
            heartsContainerP2.appendChild(heart);
          }
        } else {
          for (let i = 0; i < this.maxHearts; i++) {
            const expected = i < this.currentHeartsP2 ? '💖' : '🖤';
            const child = heartsContainerP2.children[i];
            if (child.textContent !== expected) {
              child.textContent = expected;
            }
          }
        }
      }

      const odThemeP2 = OVERDRIVE_THEMES[this.player2.activeChar] || OVERDRIVE_THEMES.garnet;
      const odLabelP2 = d.odLabelP2;
      if (odLabelP2 && odLabelP2.textContent !== `⚡ ${odThemeP2.name}`) odLabelP2.textContent = `⚡ ${odThemeP2.name}`;

      const fillP2 = d.fillP2;
      const pctP2 = d.pctP2;
      const btnOverdriveP2 = d.btnOverdriveP2;
      const btnTextP2 = d.btnTextP2;

      if (this.isOverdriveActiveP2) {
        const remainingPct = Math.max(0, (this.overdriveTimerP2 / this.overdriveDuration) * 100);
        if (fillP2) fillP2.style.width = `${remainingPct}%`;
        if (pctP2) pctP2.textContent = `${Math.ceil(this.overdriveTimerP2)}s ACTIVE!`;
        if (btnOverdriveP2) {
          btnOverdriveP2.className = 'btn-overdrive-hud active';
          if (btnTextP2) btnTextP2.textContent = `${odThemeP2.short} ACTIVE (${Math.ceil(this.overdriveTimerP2)}s)`;
        }
      } else {
        const curP2 = this.starPowerMeterP2 || 0;
        if (fillP2) fillP2.style.width = `${curP2}%`;
        if (pctP2) pctP2.textContent = `${Math.floor(curP2)}%`;
        const isReadyP2 = curP2 >= 100 || this.gameMode === 'practice';
        if (btnOverdriveP2) {
          btnOverdriveP2.className = `btn-overdrive-hud ${isReadyP2 ? 'ready' : 'disabled'}`;
          if (btnTextP2) btnTextP2.textContent = isReadyP2 ? `${odThemeP2.short} READY! [O]` : odThemeP2.name;
        }
      }
    }

    const p2Panel = d.p2Panel;
    if (p2Panel) {
      p2Panel.style.display = (this.playerMode === '2p' && this.player2) ? 'flex' : 'none';
    }

    const scoreEl = d.scoreEl;
    const curScore = `${this.score}`;
    if (scoreEl && scoreEl.textContent !== curScore) scoreEl.textContent = curScore;
    const bubbledEl = d.bubbledEl;
    const curBubbled = `💎 ${this.bubbledGemsCount}`;
    if (bubbledEl && bubbledEl.textContent !== curBubbled) bubbledEl.textContent = curBubbled;

    this.updateFusionHUD();
  }

  // ==========================================================
  // CANONICAL GEM FUSION CONTROLLER
  // ==========================================================
  addFusionSync(amount) {
    if (this.isFused || this.isHyperAttack) return;
    // Cap is intentionally above 100: extra teamwork becomes an overcharge bonus
    this.fusionEnergy = Math.min(120, (this.fusionEnergy || 0) + amount);
    this.updateFusionHUD();
  }

  triggerFusion() {
    if (this.playerMode !== '2p' || !this.player2) {
      return;
    }

    if (this.isHyperAttack || this.isFused) {
      return;
    }

    if (this.player.isFallen || this.player2.isFallen) {
      this.audio.playSfx('hit');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚠️ CANNOT FUSE: PARTNER IS DOWN!', true, '#ef4444');
      return;
    }

    const fusion = getCanonFusion(this.player.activeChar, this.player2.activeChar);

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

    // Pair-specific fusion identity (Extended to match 12s Overdrive duration!)
    const power = FUSION_POWER[fusion.id] || { nuke: 1.0, duration: 12.0, heal: 1, title: 'GEM FUSION' };

    this.startCutin({
      kicker: 'GEM FUSION',
      kickerColor: fusion.color || '#f472b6',
      portraitId: (fusion.gems && fusion.gems[0]) || fusion.id,
      secondPortraitId: (fusion.gems && fusion.gems[1]) || null,
      centerPortraitId: fusion.id,
      icon: fusion.icon || '💎',
      name: fusion.name.toUpperCase(),
      quote: `${fusion.weapon} · ${power.title} · ${Math.round(power.duration)} SECONDS`,
      side: 'left',
      duration: 1.0,
      freeze: 0
    });
    const overcharge = Math.max(0, (this.fusionEnergy || 0) - 100);
    const duration = power.duration + Math.min(2.5, overcharge * 0.08);
    this.activeFusionNukeMult = power.nuke * (1 + Math.min(0.3, overcharge * 0.008));
    this.activeFusionHeal = power.heal;
    this.hyperAttackDuration = duration;

    // ACTIVATE TAG-TEAM HYPER FUSION ATTACK (pair-tuned cinematic screen nuke!)
    this.isFused = true;
    this.isHyperAttack = true;
    this.fusionPlayable = false;
    this.hyperAttackTimer = duration;
    this.hyperAttackFired = false;
    this.fusionTimer = duration;
    this.fusionEnergy = (this.gameMode === 'practice') ? 100 : 0;

    this.player.isFusion = true;
    this.player.fusionKey = fusion.id;
    this.player.fusionData = fusion;
    this.player.invulnerableTimer = duration + 0.5;
    this.player.actionType = 'skill';
    this.player.actionDuration = 1.3;
    this.player.actionTimer = 1.3;

    const targetX = (this.playerMode === '2p' && this.player2) ? (this.player.x + this.player2.x) / 2 : this.player.x;
    this.player.x = targetX;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.vy = 0;

    if (this.playerMode === '2p' && this.player2) {
      this.player2.x = targetX;
      this.player2.y = this.groundY;
      this.player2.vx = 0;
      this.player2.vy = 0;
      this.player2.invulnerableTimer = duration + 0.5;
      this.player2.isMergedInFusion = true;
    }

    this.audio.playSfx('fusion');
    this.audio.playSfx('overdrive');
    this.audio.playSfx('stageClear');
    this.particles.addPoof(targetX, this.groundY - 45, fusion.color || '#ec4899');
    this.particles.addSparkle(targetX, this.groundY - 45, '#ffffff', 40, 10);
    this.particles.addSparkle(targetX, this.groundY - 45, fusion.glowColor || '#ffd700', 40, 10);
    this.particles.addDamageText(targetX, this.groundY - 100, `✨ TAG FUSION: ${fusion.name.toUpperCase()}! ✨`, true, fusion.color || '#ec4899');
    this.particles.addDamageText(targetX, this.groundY - 75, fusion.quote || 'WE ARE AN EXPERIENCE!', false, '#fde047');
    if (overcharge >= 5) {
      this.particles.addDamageText(targetX, this.groundY - 125, `⚡ PERFECT SYNC! +${Math.min(30, Math.round(overcharge * 0.8))}% POWER ⚡`, true, '#fde047');
    }

    this.updateFusionHUD();
    this.updateActionBar();
  }

  unfuseGems() {
    this.finishTagTeamHyperAttack();
  }

  executePlayer2FusionAction(slot) {
    if (!this.isFused || !this.player || !this.player.isFusion || !this.player.fusionData) return;
    const fid = this.player.fusionData.id;
    const coop = COOP_FUSION_MOVES[fid];
    const dmgMult = this.isPinkOverdriveP2 ? 2.0 : 1.0;

    if (slot === 'j') {
      this.player2AttackCooldown = 0.22;
      this.triggerSlotAnimation('slotP2_J');
      this.player.facing = this.player.facing || 1;
      this.player.isAttacking = true;
      this.player.attackTimer = 0.22;
      this.player.attackFrame = 0.25;
      this.player.attackType = 'j';
      this.audio.playSfx('punch');
      this.particles.addSparkle(this.player.x + this.player.facing * 40, this.player.y - 40, this.player.fusionData.color || '#ec4899', 12, 4);
      const moveName = coop?.p2?.j?.name || 'Synergy Strike';
      this.particles.addDamageText(this.player.x, this.player.y - 65, `${moveName}!`, false, this.player.fusionData.color || '#ec4899');
    } else if (slot === 'k') {
      this.player2SpecialCooldown = 0.85;
      this.triggerSlotAnimation('slotP2_K');
      if (typeof this.player.executeFusionSkillL === 'function') {
        this.player.executeFusionSkillL(this.audio, this.particles, this.pickups, this.projectiles, dmgMult);
      }
    } else if (slot === 'l') {
      this.player2SkillCooldown = 3.5;
      this.triggerSlotAnimation('slotP2_L');
      this.audio.playSfx('overdrive');
      this.executeHyperAttackBlast(this.player.fusionData);
      const moveName = coop?.p2?.l?.name || 'Harmony Surge';
      this.particles.addDamageText(this.player.x, this.player.y - 110, `🌟 ${moveName}! 🌟`, true, '#fde047');
    }
  }

  updateHyperAttack(dt, platforms) {
    this.hyperAttackTimer -= dt;
    this.fusionTimer = Math.max(0, this.hyperAttackTimer);

    if (this.player2) {
      this.player2.x = this.player.x;
      this.player2.y = this.player.y;
      this.player2.isMergedInFusion = true;
    }

    // Phase 2: Unleash Colossal Screen Nuke early in the fusion intro
    if (this.hyperAttackTimer <= (this.hyperAttackDuration - 0.6) && !this.hyperAttackFired) {
      this.hyperAttackFired = true;
      this.executeHyperAttackBlast(this.player.fusionData);

      // Pair-based heal: Malachite is a forced fusion and grants none
      const fusionHeal = this.activeFusionHeal || 0;
      if (fusionHeal > 0) {
        this.currentHearts = Math.min(this.maxHearts, this.currentHearts + fusionHeal);
        if (this.player2) {
          this.currentHeartsP2 = Math.min(this.maxHearts, this.currentHeartsP2 + fusionHeal);
        }
        this.updateHUD();
        this.particles.addDamageText(this.player.x, this.player.y - 120, `💖 +${fusionHeal} HEART HEALED TO BOTH GEMS! 💖`, false, '#ff4081');
      } else {
        this.particles.addDamageText(this.player.x, this.player.y - 120, '🌊 UNSTABLE FUSION: NO HEAL, PURE POWER!', false, '#2dd4bf');
      }
    }

    // Once the cinematic has had its moment, hand control back to the players while
    // the fusion is still standing: from here the pair drives ONE body with the fused
    // shared kit (J/K/L blend both partners' skills).
    // Now with extended 12s fusion, players get ~10.7+ seconds of active playable fusion!
    if (!this.fusionPlayable && this.hyperAttackTimer <= (this.hyperAttackDuration - 1.3)) {
      this.fusionPlayable = true;
      this.isHyperAttack = false;
      this.fusionTimer = Math.max(10.0, this.hyperAttackTimer);
      this.player.actionType = null;
      this.player.actionTimer = 0;
      this.particles.addDamageText(this.player.x, this.player.y - 150, '💎 SHARED KIT UNLOCKED — PLAY AS THE FUSION!', true, '#f472b6');
      this.audio.playSfx('powerup');
      this.updateFusionHUD();
      return;
    }

    // At T <= 0: Complete Tag-Team Hyper Attack and cleanly return to heroes!
    if (this.hyperAttackTimer <= 0) {
      this.finishTagTeamHyperAttack();
      return;
    }

    this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer, 0.5);
    if (this.player2) this.player2.invulnerableTimer = Math.max(this.player2.invulnerableTimer, 0.5);

    this.updateFusionHUD();
  }

  executeHyperAttackBlast(fusion) {
    if (!fusion) return;
    const fid = fusion.id;
    const dmgMult = this.isPinkOverdrive ? 2.0 : 1.0;
    const blastStartIndex = this.projectiles.length;

    this.audio.playSfx('overdrive');
    this.audio.playSfx('stageClear');

    if (fid === 'stevonnie') {
      this.audio.playSfx('sword');
      this.audio.playSfx('shield');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 45,
          vx: dir * 680,
          vy: 0,
          width: 260,
          height: 160,
          damage: Math.round(300 * dmgMult),
          type: 'hyperRoseSwordWave',
          color: '#ec4899',
          life: 1.2
        });
      }
      this.particles.addRosePetals(this.player.x, this.player.y - 45, 30);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '⚔️ SHIELD HOVER & ROSE SWORD WAVE! (300 DMG)', true, '#ec4899');
    } else if (fid === 'smoky') {
      this.audio.playSfx('whip');
      this.audio.playSfx('spindash');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 50,
          vx: dir * 640,
          vy: 0,
          width: 280,
          height: 180,
          damage: Math.round(320 * dmgMult),
          type: 'hyperYoYoCyclone',
          color: '#a855f7',
          life: 1.2
        });
      }
      this.particles.addSparkle(this.player.x, this.player.y - 45, '#c084fc', 35, 10);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🌪️ SUPERSONIC YO-YO CYCLONE! (320 DMG)', true, '#a855f7');
    } else if (fid === 'rainbow2') {
      this.audio.playSfx('laser');
      this.audio.playSfx('whoosh');
      for (let i = -6; i <= 6; i++) {
        this.projectiles.push({
          x: this.player.x + i * 30,
          y: this.player.y - 50,
          vx: i * 80 + Math.sign(i || 1) * 450,
          vy: -80 + Math.abs(i) * 15,
          radius: 20,
          damage: Math.round(75 * dmgMult),
          type: 'hyperPrismaticLaser',
          color: '#38bdf8',
          life: 1.3
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '☂️ PRISMATIC PARASOL BARRAGE! (300 DMG)', true, '#38bdf8');
    } else if (fid === 'sunstone') {
      this.audio.playSfx('rocket');
      this.audio.playSfx('punch');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 45,
          y: this.player.y - 45,
          vx: dir * 660,
          vy: 0,
          radius: 40,
          damage: Math.round(340 * dmgMult),
          type: 'hyperSunGauntlet',
          color: '#f97316',
          life: 1.2
        });
      }
      this.particles.addSparkle(this.player.x, this.player.y - 45, '#fde047', 40, 10);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '☀️ SOLAR CATACLYSM PUNCH! (340 DMG)', true, '#f97316');
    } else if (fid === 'sugilite') {
      this.audio.playSfx('hammer');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.groundY - 30,
          vx: dir * 600,
          vy: 0,
          width: 300,
          height: 140,
          damage: Math.round(360 * dmgMult),
          type: 'hyperSeismicFlail',
          color: '#7e22ce',
          life: 1.2
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🟣 TITANIC WRECKING FLAIL SLAM! (360 DMG)', true, '#7e22ce');
    } else if (fid === 'sardonyx') {
      this.audio.playSfx('hammer');
      this.audio.playSfx('whoosh');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 45,
          vx: dir * 640,
          vy: 0,
          radius: 42,
          damage: Math.round(340 * dmgMult),
          type: 'hyperWarHammerDrill',
          color: '#fb7185',
          life: 1.2
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🔨 COLOSSAL WAR HAMMER DRILL! (340 DMG)', true, '#fb7185');
    } else if (fid === 'opal') {
      this.audio.playSfx('laser');
      for (let k = 0; k < 18; k++) {
        setTimeout(() => {
          this.projectiles.push({
            x: 80 + Math.random() * (this.stageWidth - 160),
            y: 40,
            vx: (Math.random() - 0.5) * 60,
            vy: 680,
            radius: 16,
            damage: Math.round(75 * dmgMult),
            type: 'hyperOpalLightArrow',
            color: '#818cf8',
            life: 1.1
          });
        }, k * 45);
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🏹 CELESTIAL LIGHT ARROW RAIN! (330 DMG)', true, '#818cf8');
    } else if (fid === 'malachite') {
      this.audio.playSfx('water');
      this.audio.playSfx('hammer');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 80,
          y: this.groundY - 60,
          vx: dir * 540,
          vy: 0,
          width: 280,
          height: 180,
          damage: Math.round(350 * dmgMult),
          type: 'hyperGlacialFist',
          color: '#2dd4bf',
          life: 1.2
        });
      }
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🧊 GLACIAL ICE CATACLYSM! (350 DMG)', true, '#0d9488');
    } else if (fid === 'rainbowClassic') {
      this.audio.playSfx('sword');
      this.audio.playSfx('shield');
      for (const dir of [-1, 1]) {
        this.projectiles.push({
          x: this.player.x + dir * 40,
          y: this.player.y - 45,
          vx: dir * 650,
          vy: 0,
          width: 250,
          height: 150,
          damage: Math.round(320 * dmgMult),
          type: 'hyperRoseMandala',
          color: '#f43f5e',
          life: 1.2
        });
      }
      this.particles.addRosePetals(this.player.x, this.player.y - 45, 30);
      this.particles.addDamageText(this.player.x, this.player.y - 100, '🌹 CELESTIAL ROSE MANDALA! (320 DMG)', true, '#f43f5e');
    }

    // Apply the pair's nuke multiplier to every wave spawned by this fusion
    const nukeMult = this.activeFusionNukeMult || 1.0;
    if (nukeMult !== 1.0) {
      for (let i = blastStartIndex; i < this.projectiles.length; i++) {
        const proj = this.projectiles[i];
        if (proj && typeof proj.damage === 'number') {
          proj.damage = Math.round(proj.damage * nukeMult);
        }
      }
    }
  }

  finishTagTeamHyperAttack() {
    this.isFused = false;
    this.isHyperAttack = false;
    this.fusionPlayable = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    this.fusionTimer = 0;

    this.player.isFusion = false;
    this.player.fusionKey = null;
    this.player.fusionData = null;
    this.player.actionType = null;
    this.player.actionTimer = 0;

    if (this.playerMode === '2p' && this.player2) {
      this.player2.isFusion = false;
      this.player2.fusionKey = null;
      this.player2.fusionData = null;
      this.player2.isMergedInFusion = false;
      this.player2.actionType = null;
      this.player2.actionTimer = 0;

      // Graceful side-by-side landing
      this.player.x = Math.max(60, this.player.x - 70);
      this.player.y = this.groundY;
      this.player.vx = 0;
      this.player2.x = Math.min(this.stageWidth - 60, this.player.x + 140);
      this.player2.y = this.groundY;
      this.player2.vx = 0;

      // Grant 8s Harmony Synergy Buff (+25% power & speed!)
      this.synergyBuffTimer = 8.0;
      this.player.hasSynergyBuff = true;
      this.player2.hasSynergyBuff = true;
      this.audio.playSfx('cookie');
      this.particles.addPoof(this.player.x, this.player.y - 30, '#ff94ba');
      this.particles.addPoof(this.player2.x, this.player2.y - 30, '#c084fc');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚡ GEM HARMONY SYNERGY BUFF! ⚡', true, '#ffd700');
      this.particles.addDamageText(this.player2.x, this.player2.y - 70, '⚡ +25% SPEED & ATTACK! ⚡', false, '#38bdf8');
    } else {
      this.synergyBuffTimer = 8.0;
      this.player.hasSynergyBuff = true;
      this.audio.playSfx('cookie');
      this.particles.addPoof(this.player.x, this.player.y - 30, '#ff94ba');
      this.particles.addDamageText(this.player.x, this.player.y - 70, '⚡ FUSION POWER UNLEASHED! ⚡', true, '#ffd700');
    }

    this.updateHUD();
    this.updateActionBar();
    this.updateFusionHUD();
  }

  updateFusionHUD() {
    if (!this._domFusion && typeof document !== 'undefined') {
      this._domFusion = {
        container: document.getElementById('hudFusionContainer'),
        iconEl: document.getElementById('hudFusionIcon'),
        labelEl: document.getElementById('hudFusionLabel'),
        pctEl: document.getElementById('hudFusionPct'),
        fillEl: document.getElementById('hudFusionFill'),
        btnEl: document.getElementById('btnFuseHud'),
        btnText: document.getElementById('btnFuseText'),
        btnElP2: document.getElementById('btnFuseHudP2'),
        btnTextP2: document.getElementById('btnFuseTextP2'),
        touchFuse: document.getElementById('touchFuse'),
        touchLbl: document.getElementById('touchLblFuse')
      };
    }
    const d = this._domFusion || {};
    const container = d.container;
    const iconEl = d.iconEl;
    const labelEl = d.labelEl;
    const pctEl = d.pctEl;
    const fillEl = d.fillEl;
    const btnEl = d.btnEl;
    const btnText = d.btnText;
    const btnElP2 = d.btnElP2;
    const btnTextP2 = d.btnTextP2;
    const touchFuse = d.touchFuse;
    const touchLbl = d.touchLbl;

    // Strict Rule: Fusion is exclusively a 2-Player feature and must be hidden in 1-Player mode!
    if (this.playerMode !== '2p') {
      if (container) container.style.display = 'none';
      if (btnEl) btnEl.style.display = 'none';
      if (btnElP2) btnElP2.style.display = 'none';
      if (touchFuse) touchFuse.style.display = 'none';
      this.isFused = false;
      this.isHyperAttack = false;
      if (this.player && this.player.isFusion) {
        this.player.isFusion = false;
        this.player.fusionKey = null;
        this.player.fusionData = null;
        this.player.isMergedInFusion = false;
        this.player.switchCharacter(this.selectedCharP1);
      }
      return;
    }

    if (btnEl) btnEl.style.display = 'inline-flex';
    if (btnElP2) btnElP2.style.display = 'inline-flex';
    if (touchFuse) touchFuse.style.display = this.isRealMobile ? 'flex' : 'none';

    let fusion = null;
    let canFuse = false;
    let isIndependent = false;

    if (this.player2) {
      fusion = getCanonFusion(this.player.activeChar, this.player2.activeChar);
      canFuse = !!fusion;
      isIndependent = !canFuse;
    }

    if (this.isHyperAttack || this.isFused) {
      if (container) container.style.display = 'flex';
      const timerVal = Math.max(0, this.hyperAttackTimer || this.fusionTimer || 0);
      const remainingPct = Math.max(0, (timerVal / (this.hyperAttackDuration || 12.0)) * 100);
      if (fillEl) {
        fillEl.style.width = `${remainingPct}%`;
        fillEl.style.background = 'linear-gradient(90deg, #ec4899, #a855f7, #38bdf8, #fbbf24)';
      }
      if (iconEl) iconEl.textContent = this.player.fusionData?.icon || '💎';
      if (labelEl) labelEl.textContent = `HYPER: ${this.player.fusionData?.name || 'FUSION'}`.toUpperCase();
      if (pctEl) pctEl.textContent = `${Math.ceil(timerVal)}s`;

      if (btnEl) {
        btnEl.className = 'btn-fuse-hud fused';
        if (btnText) btnText.textContent = `HYPER FUSION! (${Math.ceil(timerVal)}s)`;
      }
      if (btnElP2) {
        btnElP2.className = 'btn-fuse-hud fused';
        if (btnTextP2) btnTextP2.textContent = `HYPER FUSION! (${Math.ceil(timerVal)}s)`;
      }
      if (touchFuse) {
        touchFuse.classList.add('ready');
        if (touchLbl) touchLbl.textContent = 'HYPER!';
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
        btnEl.title = 'No canonical Steven Universe show fusion exists for this gem pair.';
      }
      if (btnElP2) {
        btnElP2.className = 'btn-fuse-hud disabled';
        if (btnTextP2) btnTextP2.textContent = 'INDEPENDENT GEMS';
        btnElP2.title = 'No canonical Steven Universe show fusion exists for this gem pair.';
      }
      if (touchFuse) {
        touchFuse.classList.remove('ready');
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
            ? `TAG FUSE! [${this.playerMode === '2p' ? 'V' : 'F'}]`
            : `TAG FUSE (${displayPct}%)`;
        }
        btnEl.title = isReady
          ? `Unleash Tag-Team Hyper Fusion Attack with ${fusion.name}!`
          : `Gather sync energy by landing combos, poofing gems, and collecting bubbles.`;
      }
      if (btnElP2) {
        btnElP2.className = `btn-fuse-hud ${isReady ? 'ready' : 'disabled'}`;
        if (btnTextP2) {
          btnTextP2.textContent = isReady
            ? `TAG FUSE! [V]`
            : `TAG FUSE (${displayPct}%)`;
        }
        btnElP2.title = isReady
          ? `Unleash Tag-Team Hyper Fusion Attack with ${fusion.name}!`
          : `Gather sync energy by landing combos, poofing gems, and collecting bubbles.`;
      }
      if (touchFuse) {
        if (isReady) touchFuse.classList.add('ready');
        else touchFuse.classList.remove('ready');
        const touchLbl = document.getElementById('touchLblFuse');
        if (touchLbl) touchLbl.textContent = isReady ? 'TAG FUSE!' : `${displayPct}%`;
      }
    }
  }

  // Paint the gem-type of each hotbar move (J / K / L) with its matchup colour.
  syncMoveTypeChips() {
    const paint = (owner, ids) => {
      ['j', 'k', 'l'].forEach((slot, idx) => {
        const el = document.getElementById(ids[idx]);
        if (!el) return;
        const typeEl = el.querySelector('.action-type');
        if (!owner) {
          if (typeEl) { typeEl.textContent = ['ATTACK', 'SPECIAL', 'SKILL'][idx]; typeEl.style.color = ''; }
          return;
        }
        const type = owner.getMoveType(slot);
        const meta = getTypeMeta(type);
        if (typeEl) {
          typeEl.textContent = `${meta.icon} ${meta.label}`;
          typeEl.style.color = meta.color;
        }
        const stab = owner.getStabMultiplier(slot) > 1 ? ' (STAB +20%)' : '';
        el.title = `${meta.label} move${stab}`;
      });
    };
    paint(this.player, ['slotJ', 'slotK', 'slotL']);
    paint(this.playerMode === '2p' ? this.player2 : null, ['slotP2_J', 'slotP2_K', 'slotP2_L']);
  }

  updateActionBar() {
    this.syncMoveTypeChips();
    const active = this.player.activeChar;
    const isHyper = (this.isHyperAttack || this.isFused) && this.player.fusionData;
    const current = isHyper ? this.player.fusionData : (GUARDIAN_DATA[active] || GUARDIAN_DATA.steven);

    const actionBars = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    const barP1 = document.getElementById('actionBarP1');
    const barP2 = document.getElementById('actionBarP2');
    const barNameP1 = document.getElementById('barNameP1');
    const barNameP2 = document.getElementById('barNameP2');

    if (actionBars) {
      actionBars.style.display = this.isRealMobile ? 'none' : 'flex';
    }

    if (this.playerMode === '2p' && this.player2) {
      if (actionBars) actionBars.classList.remove('mode-1p');
      if (barP1) barP1.style.display = 'flex';
      if (barP2) barP2.style.display = 'flex';

      // Badges: P1 has F, G, H, E
      const badgeJ = document.getElementById('badgeJ');
      const badgeK = document.getElementById('badgeK');
      const badgeL = document.getElementById('badgeL');
      const badgeI = document.getElementById('badgeI');
      if (badgeJ) badgeJ.textContent = 'F';
      if (badgeK) badgeK.textContent = 'G';
      if (badgeL) badgeL.textContent = 'H';
      if (badgeI) badgeI.textContent = 'E';

      // Badges: P2 has J, K, L, I
      const badgeP2_J = document.getElementById('badgeP2_J');
      const badgeP2_K = document.getElementById('badgeP2_K');
      const badgeP2_L = document.getElementById('badgeP2_L');
      const badgeP2_I = document.getElementById('badgeP2_I');
      if (badgeP2_J) badgeP2_J.textContent = 'J';
      if (badgeP2_K) badgeP2_K.textContent = 'K';
      if (badgeP2_L) badgeP2_L.textContent = 'L';
      if (badgeP2_I) badgeP2_I.textContent = 'I';

      if (isHyper) {
        const fid = this.player.fusionData.id;
        const coop = COOP_FUSION_MOVES[fid] || {
          p1: { j: { icon: '💥', name: 'Primary Strike' }, k: { icon: '✨', name: 'Fusion Special' }, l: { icon: '🌟', name: 'Screen Nuke' }, i: { icon: '🛡️', name: 'Invulnerable' } },
          p2: { j: { icon: '🥊', name: 'Synergy Strike' }, k: { icon: '💫', name: 'Fusion Burst' }, l: { icon: '🌟', name: 'Screen Nuke' }, i: { icon: '🛡️', name: 'Invulnerable' } }
        };

        if (barNameP1) barNameP1.textContent = `TAG HYPER: ${this.player.fusionData.name}`.toUpperCase();
        if (barNameP2) barNameP2.textContent = `TAG HYPER: ${this.player.fusionData.name}`.toUpperCase();

        // P1 Slots
        const iconJ = document.getElementById('iconJ');
        const nameJ = document.getElementById('nameJ');
        const iconK = document.getElementById('iconK');
        const nameK = document.getElementById('nameK');
        const iconL = document.getElementById('iconL');
        const nameL = document.getElementById('nameL');
        const iconI = document.getElementById('iconI');
        const nameI = document.getElementById('nameI');
        if (iconJ) iconJ.textContent = coop.p1.j.icon;
        if (nameJ) nameJ.textContent = coop.p1.j.name;
        if (iconK) iconK.textContent = coop.p1.k.icon;
        if (nameK) nameK.textContent = coop.p1.k.name;
        if (iconL) iconL.textContent = coop.p1.l.icon;
        if (nameL) nameL.textContent = coop.p1.l.name;
        if (iconI) iconI.textContent = coop.p1.i?.icon || '💨';
        if (nameI) nameI.textContent = coop.p1.i?.name || 'Flash Step';

        // P2 Slots
        const iconP2_J = document.getElementById('iconP2_J');
        const nameP2_J = document.getElementById('nameP2_J');
        const iconP2_K = document.getElementById('iconP2_K');
        const nameP2_K = document.getElementById('nameP2_K');
        const iconP2_L = document.getElementById('iconP2_L');
        const nameP2_L = document.getElementById('nameP2_L');
        const iconP2_I = document.getElementById('iconP2_I');
        const nameP2_I = document.getElementById('nameP2_I');
        if (iconP2_J) iconP2_J.textContent = coop.p2.j.icon;
        if (nameP2_J) nameP2_J.textContent = coop.p2.j.name;
        if (iconP2_K) iconP2_K.textContent = coop.p2.k.icon;
        if (nameP2_K) nameP2_K.textContent = coop.p2.k.name;
        if (iconP2_L) iconP2_L.textContent = coop.p2.l.icon;
        if (nameP2_L) nameP2_L.textContent = coop.p2.l.name;
        if (iconP2_I) iconP2_I.textContent = coop.p2.i?.icon || '💨';
        if (nameP2_I) nameP2_I.textContent = coop.p2.i?.name || 'Flash Step';
      } else {
        // Unfused 2-Player Mode: P1 on left bar, P2 on right bar
        const d1 = GUARDIAN_DATA[this.player.activeChar] || GUARDIAN_DATA.steven;
        const d2 = GUARDIAN_DATA[this.player2.activeChar] || GUARDIAN_DATA.garnet;

        if (barNameP1) barNameP1.textContent = d1.name.toUpperCase();
        if (barNameP2) barNameP2.textContent = d2.name.toUpperCase();

        // P1 Slots
        const iconJ = document.getElementById('iconJ');
        const nameJ = document.getElementById('nameJ');
        const iconK = document.getElementById('iconK');
        const nameK = document.getElementById('nameK');
        const iconL = document.getElementById('iconL');
        const nameL = document.getElementById('nameL');
        const iconI = document.getElementById('iconI');
        const nameI = document.getElementById('nameI');
        if (iconJ) iconJ.textContent = d1.j.icon;
        if (nameJ) nameJ.textContent = d1.j.name;
        if (iconK) iconK.textContent = d1.k.icon;
        if (nameK) nameK.textContent = d1.k.name;
        if (iconL) iconL.textContent = d1.l.icon;
        if (nameL) nameL.textContent = d1.l.name;
        if (iconI) iconI.textContent = '💨';
        if (nameI) nameI.textContent = 'Dodge';

        // P2 Slots
        const iconP2_J = document.getElementById('iconP2_J');
        const nameP2_J = document.getElementById('nameP2_J');
        const iconP2_K = document.getElementById('iconP2_K');
        const nameP2_K = document.getElementById('nameP2_K');
        const iconP2_L = document.getElementById('iconP2_L');
        const nameP2_L = document.getElementById('nameP2_L');
        const iconP2_I = document.getElementById('iconP2_I');
        const nameP2_I = document.getElementById('nameP2_I');
        if (iconP2_J) iconP2_J.textContent = d2.j.icon;
        if (nameP2_J) nameP2_J.textContent = d2.j.name;
        if (iconP2_K) iconP2_K.textContent = d2.k.icon;
        if (nameP2_K) nameP2_K.textContent = d2.k.name;
        if (iconP2_L) iconP2_L.textContent = d2.l.icon;
        if (nameP2_L) nameP2_L.textContent = d2.l.name;
        if (iconP2_I) iconP2_I.textContent = '💨';
        if (nameP2_I) nameP2_I.textContent = 'Dodge';
      }
    } else {
      // 1-Player Mode (Centered Bottom Bar)
      if (actionBars) actionBars.classList.add('mode-1p');
      if (barP1) barP1.style.display = 'flex';
      if (barP2) barP2.style.display = 'none';

      if (barNameP1) barNameP1.textContent = (isHyper ? `TAG HYPER: ${this.player.fusionData.name}` : current.name).toUpperCase();

      const badgeJ = document.getElementById('badgeJ');
      const badgeK = document.getElementById('badgeK');
      const badgeL = document.getElementById('badgeL');
      const badgeI = document.getElementById('badgeI');
      if (badgeJ) badgeJ.textContent = 'J';
      if (badgeK) badgeK.textContent = 'K';
      if (badgeL) badgeL.textContent = 'L';
      if (badgeI) badgeI.textContent = 'I';

      const iconJ = document.getElementById('iconJ');
      const nameJ = document.getElementById('nameJ');
      const iconK = document.getElementById('iconK');
      const nameK = document.getElementById('nameK');
      const iconL = document.getElementById('iconL');
      const nameL = document.getElementById('nameL');
      const iconI = document.getElementById('iconI');
      const nameI = document.getElementById('nameI');

      if (iconJ) iconJ.textContent = isHyper ? '💥' : current.j.icon;
      if (nameJ) nameJ.textContent = isHyper ? (current.attack || 'Primary Blast') : current.j.name;
      if (iconK) iconK.textContent = isHyper ? '✨' : current.k.icon;
      if (nameK) nameK.textContent = isHyper ? (current.special || 'Special Wave') : current.k.name;
      if (iconL) iconL.textContent = isHyper ? '🌟' : current.l.icon;
      if (nameL) nameL.textContent = isHyper ? 'Screen Nuke' : current.l.name;
      if (iconI) iconI.textContent = isHyper ? '🛡️' : '💨';
      if (nameI) nameI.textContent = isHyper ? 'Invulnerable' : 'Dodge';
    }

    // 2. Sync Mobile Touch Controls
    const touchIconAtk = document.getElementById('touchIconAttack');
    const touchLblAtk = document.getElementById('touchLblAttack');
    const touchIconSp = document.getElementById('touchIconSpecial');
    const touchLblSp = document.getElementById('touchLblSpecial');
    const touchIconSk = document.getElementById('touchIconSkill');
    const touchLblSk = document.getElementById('touchLblSkill');

    if (touchIconAtk) touchIconAtk.textContent = isHyper ? '💥' : current.j.icon;
    if (touchLblAtk) touchLblAtk.textContent = (isHyper ? (current.attack || 'BLAST') : current.j.name).toUpperCase();
    if (touchIconSp) touchIconSp.textContent = isHyper ? '✨' : current.k.icon;
    if (touchLblSp) touchLblSp.textContent = (isHyper ? (current.special || 'SPECIAL') : current.k.name).toUpperCase();
    if (touchIconSk) touchIconSk.textContent = isHyper ? '🌟' : current.l.icon;
    if (touchLblSk) touchLblSk.textContent = (isHyper ? 'NUKE' : current.l.name).toUpperCase();
  }

  quitGame() {
    try {
      window.close();
    } catch (e) {}
    const qs = document.getElementById('quitScreen');
    if (qs) qs.style.display = 'flex';
  }

    takeScreenshot() {
    try {
      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const now = new Date();
      const timeStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
      link.download = `Crystal-Gems-${timeStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Play camera shutter sound
      if (this.audio) this.audio.playSfx('cookie');

      // Visual flash indicator
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.65);pointer-events:none;z-index:99999;transition:opacity 0.35s ease-out;';
      document.body.appendChild(flash);
      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 380);
      });

      console.log('📸 Clean screenshot captured and saved as:', link.download);
    } catch (err) {
      console.warn('Screenshot capture error:', err);
    }
  }

  syncCharGridIcons() {
    document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
      const cId = item.dataset.char;
      const b = item.querySelector('.char-item-bubble');
      if (b && typeof getGuardianSvg === 'function') {
        b.innerHTML = getGuardianSvg(cId, 42);
      }
    });
  }

  showTitleScreen() {
    this.hideAllScreens();
    this.state = 'title';
    this.releaseAllInputs();
    this.audio.isManuallyPaused = false;
    this.audio.init();
    if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
      this.audio.ctx.resume().catch(() => {});
    }
    const lobbyTrack = (this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'distant_shore';
    this.audio.playTrackById(lobbyTrack, false);
    // A returning player should always land on music, not silence.
    if (this.audio.ctx && this.audio.ctx.state === 'running' && this.audio.musicGainNode) {
      try { this.audio.musicGainNode.gain.setValueAtTime(this.audio.musicVolume, this.audio.ctx.currentTime); } catch (e) {}
    }
    if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(true);

    // Reset Fusion state cleanly without spawning in-game unfuse poofs/particles
    this.isFused = false;
    this.isHyperAttack = false;
    this.hyperAttackTimer = 0;
    this.hyperAttackFired = false;
    this.synergyBuffTimer = 0;
    this.fusionEnergy = 0;
    this.fusionTimer = 0;
    this.p1HarmonyReadyTime = 0;
    this.p2HarmonyReadyTime = 0;
    this.player2AttackCooldown = 0;
    this.player2SpecialCooldown = 0;
    this.player2SkillCooldown = 0;

    if (this.player) {
      this.player.isFusion = false;
      this.player.fusionKey = null;
      this.player.fusionData = null;
      this.player.isMergedInFusion = false;
      this.player.hasSynergyBuff = false;
      this.player.switchCharacter(this.selectedCharP1);
    }
    if (this.playerMode !== '2p') {
      this.player2 = null;
    } else if (this.player2) {
      this.player2.isFusion = false;
      this.player2.fusionKey = null;
      this.player2.fusionData = null;
      this.player2.isMergedInFusion = false;
      this.player2.hasSynergyBuff = false;
      this.player2.switchCharacter(this.selectedCharP2);
    }

    if (document.body) document.body.classList.remove('in-game');
    document.getElementById('hud').style.display = 'none';
    const actionBars = document.getElementById('actionBarsContainer') || document.getElementById('actionBar');
    if (actionBars) actionBars.style.display = 'none';
    const bossHud = document.getElementById('bossHud');
    if (bossHud) bossHud.style.display = 'none';
    const touchBox = document.getElementById('touchControls');
    if (touchBox) {
      touchBox.classList.remove('active');
      touchBox.style.display = 'none';
    }
    const comboEl = document.getElementById('comboDisplay');
    if (comboEl) comboEl.style.display = 'none';

    this.updateLobbyGuardian();
    this.updateLobbyDifficulty();
    document.getElementById('titleScreen').style.display = 'flex';
    this.startLobbySlideshow();
  }

  hideAllScreens() {
    document.querySelectorAll('.overlay-screen').forEach(el => el.style.display = 'none');
  }

  initEventListeners() {
    const resetAllKeys = () => {
      this.keysP1.left = false;
      this.keysP1.right = false;
      this.keysP1.jump = false;
      this.keysP1.down = false;
      this.keysP1.shield = false;
      this.keysP1.dodge = false;
      this.keysP1.attack = false;
      this.keysP1.special = false;
      this.keysP1.skill = false;
      this.keysP1.overdrive = false;

      this.keysP2.left = false;
      this.keysP2.right = false;
      this.keysP2.jump = false;
      this.keysP2.down = false;
      this.keysP2.shield = false;
      this.keysP2.dodge = false;
      this.keysP2.attack = false;
      this.keysP2.special = false;
      this.keysP2.skill = false;
      this.keysP2.overdrive = false;

      if (this.player) {
        this.player.vx = 0;
        this.player.isGuarding = false;
        this.player.isSpinDashing = false;
        if (this.player.state === 'running' || this.player.state === 'walk') this.player.state = 'idle';
      }
      if (this.player2) {
        this.player2.vx = 0;
        this.player2.isGuarding = false;
        this.player2.isSpinDashing = false;
        if (this.player2.state === 'running' || this.player2.state === 'walk') this.player2.state = 'idle';
      }

      document.querySelectorAll('.touch-btn').forEach(btn => btn.classList.remove('active-touch'));
    };

    // Screenshot & OS Focus Fix: Do NOT auto-pause on window blur!
    // Pressing PrintScreen, Windows Snipping Tool, or OS screenshot shortcut blurs window;
    // resetting keys prevents stuck controls without popping up the pause menu.
    window.addEventListener('blur', () => {
      resetAllKeys();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        resetAllKeys();
        if (this.state === 'playing') {
          this.state = 'paused';
          if (this.syncVolumeUI) this.syncVolumeUI();
          if (syncBgmUI) syncBgmUI();
          const ps = document.getElementById('pauseScreen');
          if (ps) ps.style.display = 'flex';
          const touchBox = document.getElementById('touchControls');
          if (touchBox) touchBox.style.display = 'none';
        }
      } else {
        this.lastTime = performance.now();
      }
    });

    // Auto-lock landscape on mobile
    const lockLandscape = () => {
      try {
        if (this.isRealMobile) {
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
          }
        }
      } catch (err) {}
    };
    window.addEventListener('touchstart', lockLandscape, { passive: true });
    window.addEventListener('pointerdown', lockLandscape, { passive: true });

    // Keyboard Handling for 1P and 2P modes (Strict Separation of Controls!)
    window.addEventListener('keydown', (e) => {
      // Only touch the audio graph when it actually needs unlocking.
      if (!this.audio.ctx || this.audio.ctx.state !== 'running') this.audio.init();
      this.releaseKeysOnModifierChange(e);

      // Screenshot hotkey: PrintScreen (or [P] in Solo Mode)
      if (e.code === 'PrintScreen' || (e.code === 'KeyP' && this.playerMode !== '2p')) {
        e.preventDefault();
        this.takeScreenshot();
        return;
      }

      if (['KeyA', 'ArrowLeft', 'KeyD', 'ArrowRight', 'KeyW', 'ArrowUp', 'Space', 'KeyJ', 'KeyK', 'KeyL', 'KeyI', 'KeyU', 'KeyO', 'KeyS', 'ArrowDown', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyR', 'KeyV', 'KeyB'].includes(e.code)) {
        e.preventDefault();
      }

      // Fusion Trigger Keybinds: [V] or [B] or [Enter] - Strictly active ONLY in 2-Player mode!
      if (this.playerMode === '2p' && ['KeyV', 'KeyB', 'Enter'].includes(e.code)) {
        this.triggerFusion();
      }

      if (this.playerMode === '2p') {
        // Player 1 Controls (Left Hand side of keyboard)
        if (e.code === 'KeyA') this.keysP1.left = true;
        if (e.code === 'KeyD') this.keysP1.right = true;
        if (e.code === 'KeyW') this.keysP1.jump = true;
        if (e.code === 'KeyS') { this.keysP1.down = true; this.keysP1.shield = true; }
        if (e.code === 'KeyE') { this.keysP1.dodge = true; this.triggerSlotAnimation('slotI'); }
        if (e.code === 'KeyF') { this.keysP1.attack = true; this.triggerSlotAnimation('slotJ'); }
        if (e.code === 'KeyG') { this.keysP1.special = true; this.triggerSlotAnimation('slotK'); }
        if (e.code === 'KeyH') { this.keysP1.skill = true; this.triggerSlotAnimation('slotL'); }
        if (e.code === 'KeyR') { this.activatePinkOverdrive('p1'); }

        // Player 2 Controls (Right Hand side / Arrow keys)
        if (e.code === 'ArrowLeft') this.keysP2.left = true;
        if (e.code === 'ArrowRight') this.keysP2.right = true;
        if (e.code === 'ArrowUp') this.keysP2.jump = true;
        if (e.code === 'ArrowDown') { this.keysP2.down = true; this.keysP2.shield = true; }
        if (e.code === 'KeyI') { this.keysP2.dodge = true; this.triggerSlotAnimation('slotP2_I'); }
        if (e.code === 'KeyJ') { this.keysP2.attack = true; this.triggerSlotAnimation('slotP2_J'); }
        if (e.code === 'KeyK') { this.keysP2.special = true; this.triggerSlotAnimation('slotP2_K'); }
        if (e.code === 'KeyL') { this.keysP2.skill = true; this.triggerSlotAnimation('slotP2_L'); }
        if (e.code === 'KeyO' || e.code === 'KeyP') { this.activatePinkOverdrive('p2'); }
      } else {
        // Solo 1-Player Mode: STRICTLY A, D, W/Space, S, J, K, L, I (Dodge), U/O (Overdrive)
        if (e.code === 'KeyA') this.keysP1.left = true;
        if (e.code === 'KeyD') this.keysP1.right = true;
        if (e.code === 'KeyW' || e.code === 'Space') this.keysP1.jump = true;
        if (e.code === 'KeyS') {
          this.keysP1.down = true;
          this.keysP1.shield = true;
        }

        if (e.code === 'KeyJ') {
          this.keysP1.attack = true;
          this.triggerSlotAnimation('slotJ');
        }
        if (e.code === 'KeyK') {
          this.keysP1.special = true;
          this.triggerSlotAnimation('slotK');
        }
        if (e.code === 'KeyL') {
          this.keysP1.skill = true;
          this.triggerSlotAnimation('slotL');
        }
        if (e.code === 'KeyI') {
          this.keysP1.dodge = true;
          this.triggerSlotAnimation('slotI');
        }
        if (e.code === 'KeyU' || e.code === 'KeyO') {
          this.activatePinkOverdrive('p1');
        }
      }

      if (e.code === 'Escape') {
        // If Guardian Select Modal is open, auto-save and close
        const charModal = document.getElementById('characterSelectScreen');
        if (charModal && charModal.style.display !== 'none' && charModal.style.display !== '') {
          if (this.playerMode === '2p' && this.charSelectActiveTab === 'p2') {
            this.selectedCharP2 = this.tempSelectedChar || this.selectedCharP2;
            SafeStorage.setItem('su_selectedCharP2', this.selectedCharP2);
          } else {
            this.selectedCharP1 = this.tempSelectedChar || this.selectedCharP1;
            this.selectedChar = this.selectedCharP1;
            SafeStorage.setItem('su_selectedChar', this.selectedCharP1);
          }
          this.updateLobbyGuardian();
          charModal.style.display = 'none';
          this.audio.playSfx('cookie');
          return;
        }

        // If Settings Modal is open, auto-save and close
        const settingsModal = document.getElementById('settingsScreen');
        if (settingsModal && settingsModal.style.display !== 'none' && settingsModal.style.display !== '') {
          SafeStorage.setItem('su_fastPerf', this.fastPerfMode ? '1' : '0');
          SafeStorage.setItem('su_screenShake', this.screenShakeEnabled ? '1' : '0');
          SafeStorage.setItem('su_mobileTouch', this.isRealMobile ? '1' : '0');
          settingsModal.style.display = 'none';
          this.audio.playSfx('cookie');
          return;
        }

        // If Other modals open, close them
        const otherModals = ['controlsScreen', 'creditsScreen', 'fusionGuideScreen'];
        for (const modalId of otherModals) {
          const m = document.getElementById(modalId);
          if (m && m.style.display !== 'none' && m.style.display !== '') {
            m.style.display = 'none';
            return;
          }
        }

        // In-game Pause Toggle with clean lastTime synchronization
        if (this.state === 'playing') {
          this.state = 'paused';
          this.releaseAllInputs();
          this.setOverlaysVisible(false);
          if (this.syncVolumeUI) this.syncVolumeUI();
          document.getElementById('pauseScreen').style.display = 'flex';
          const touchBox = document.getElementById('touchControls');
          if (touchBox) touchBox.style.display = 'none';
        } else if (this.state === 'paused') {
          this.state = 'playing';
          this.releaseAllInputs();
          this.setOverlaysVisible(true);
          this.lastTime = performance.now();
          document.getElementById('pauseScreen').style.display = 'none';
          const touchBox = document.getElementById('touchControls');
          if (touchBox && this.isRealMobile) {
            touchBox.classList.add('active');
            touchBox.style.display = 'flex';
          }
        }
      }
    });

    // If the window loses focus, the keyup never arrives and the hero would keep
    // walking forever ("it moves by itself"). Release everything on blur/hide.
    window.addEventListener('blur', () => this.releaseAllInputs());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.releaseAllInputs();
    });
    window.addEventListener('pointerup', () => this.releaseStuckTouchKeys());
    window.addEventListener('pointercancel', () => this.releaseAllInputs());

    window.addEventListener('keyup', (e) => {
      if (this.playerMode === '2p') {
        if (e.code === 'KeyA') this.keysP1.left = false;
        if (e.code === 'KeyD') this.keysP1.right = false;
        if (e.code === 'KeyW') this.keysP1.jump = false;
        if (e.code === 'KeyS') {
          if (this.keysP1.shield) this.audio.playSfx('shieldRetract');
          this.keysP1.down = false;
          this.keysP1.shield = false;
        }
        if (e.code === 'KeyE') this.keysP1.dodge = false;
        if (e.code === 'KeyF') this.keysP1.attack = false;
        if (e.code === 'KeyG') this.keysP1.special = false;
        if (e.code === 'KeyH') this.keysP1.skill = false;

        if (e.code === 'ArrowLeft') this.keysP2.left = false;
        if (e.code === 'ArrowRight') this.keysP2.right = false;
        if (e.code === 'ArrowUp') this.keysP2.jump = false;
        if (e.code === 'ArrowDown') {
          if (this.keysP2.shield) this.audio.playSfx('shieldRetract');
          this.keysP2.down = false;
          this.keysP2.shield = false;
        }
        if (e.code === 'KeyI') this.keysP2.dodge = false;
        if (e.code === 'KeyJ') this.keysP2.attack = false;
        if (e.code === 'KeyK') this.keysP2.special = false;
        if (e.code === 'KeyL') this.keysP2.skill = false;
      } else {
        if (e.code === 'KeyA') this.keysP1.left = false;
        if (e.code === 'KeyD') this.keysP1.right = false;
        if (e.code === 'KeyW' || e.code === 'Space') this.keysP1.jump = false;
        if (e.code === 'KeyS') {
          this.keysP1.down = false;
          this.keysP1.shield = false;
        }
        if (e.code === 'KeyJ') this.keysP1.attack = false;
        if (e.code === 'KeyK') this.keysP1.special = false;
        if (e.code === 'KeyL') this.keysP1.skill = false;
        if (e.code === 'KeyI') this.keysP1.dodge = false;
      }
    });

    // Helper for safe click bindings
    const safeClick = (id, fn) => {
      const el = document.getElementById(id);
      if (el) {
        let lastTime = 0;
        const trigger = (e) => {
          const now = Date.now();
          if (now - lastTime < 250) return;
          lastTime = now;
          try {
            this.audio.init();
            if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
              this.audio.ctx.resume().catch(() => {});
            }
            fn(e);
          } catch (err) {
            console.error(`Click handler error on #${id}:`, err);
          }
        };
        el.addEventListener('click', trigger);
        el.addEventListener('touchend', (e) => {
          if (!e.defaultPrevented) trigger(e);
        }, { passive: true });
      }
    };

    // Main Menu Buttons
    safeClick('btnPlayStory', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame('story');
    });
    safeClick('btnPractice', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame('practice');
    });
    safeClick('btnPlayerMode', () => {
      this.audio.playSfx('menuTap');
      this.togglePlayerMode();
    });
    safeClick('btnOpenDifficulty', () => this.openDifficultyScreen());
    safeClick('btnCloseDifficulty', () => this.closeDifficultyScreen());
    safeClick('btnConfirmDifficulty', () => {
      this.audio.playSfx('warpPad');
      this.closeDifficultyScreen();
      this.updateLobbyDifficulty();
    });
    // Quick-cycle from the difficulty pill in the lobby
    safeClick('lobbyDifficultyPill', () => this.cycleDifficulty());
    // The five tier cards
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setDifficulty(btn.dataset.diff));
    });
    safeClick('btnQuitGame', () => this.quitGame());
    safeClick('btnStoryMode', () => this.toggleStoryMode());
    safeClick('btnEpisodes', () => this.openEpisodeScreen());
    safeClick('btnCloseEpisodes', () => this.closeEpisodeScreen());
    safeClick('btnCloseEpisodesBtn', () => this.closeEpisodeScreen());
    document.querySelectorAll('.episode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ep = parseInt(btn.dataset.episode, 10);
        this.closeEpisodeScreen();
        this.startEpisode(ep);
      });
    });
    this.updateStoryModeUI();
    safeClick('btnCancelQuit', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });

    safeClick('btnNextStage', () => {
      this.audio.playSfx('warpPad');
      this.nextStage();
    });
    safeClick('btnVictoryMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });
    safeClick('btnRetry', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame(this.gameMode);
    });
    safeClick('btnGameOverMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });

    safeClick('btnResume', () => {
      this.audio.playSfx('menuTap');
      this.state = 'playing';
      this.lastTime = performance.now();
      const ps = document.getElementById('pauseScreen');
      if (ps) ps.style.display = 'none';
      const touchBox = document.getElementById('touchControls');
      if (touchBox && this.isRealMobile) {
        touchBox.classList.add('active');
        touchBox.style.display = 'flex';
      }
    });
    safeClick('btnRestartStage', () => {
      this.audio.playSfx('warpPad');
      this.startNewGame(this.gameMode);
    });
    safeClick('btnQuitToMenu', () => {
      this.audio.playSfx('menuTap');
      this.showTitleScreen();
    });

    // Chosen Guardian Card Button -> Opens Character Select Modal!
    const charModal = document.getElementById('characterSelectScreen');
    const syncCharGridIcons = () => {
      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        const cId = item.dataset.char;
        const b = item.querySelector('.char-item-bubble');
        if (b && !b.querySelector('svg')) {
          b.innerHTML = getGuardianSvg(cId, 42);
        }
      });
    };
    syncCharGridIcons();

    const openCharModal = () => {
      this.charSelectActiveTab = 'p1';
      this.tempSelectedChar = (this.charSelectActiveTab === 'p2') ? this.selectedCharP2 : this.selectedCharP1;

      const pTabs = document.getElementById('charPlayerTabs');
      if (pTabs) {
        pTabs.style.display = this.playerMode === '2p' ? 'flex' : 'none';
      }

      syncCharGridIcons();

      document.querySelectorAll('.char-grid-item[data-char]').forEach(item => {
        if (item.dataset.char === this.tempSelectedChar) item.classList.add('active');
        else item.classList.remove('active');
      });
      this.updateCharPreview(this.tempSelectedChar);
      if (charModal) charModal.style.display = 'flex';
    };

    safeClick('lobbyGuardianCard', () => {
      this.audio.playSfx('weaponSummon');
      openCharModal();
    });
    safeClick('btnCloseCharSelect', () => {
      this.audio.playSfx('menuTap');
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
      this.audio.playSfx('menuTap');
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
      this.audio.playSfx('menuTap');
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
    });

    safeClick('btnFuseHud', () => this.triggerFusion());
    safeClick('btnFuseHudP2', () => this.triggerFusion());
    safeClick('touchFuse', () => this.triggerFusion());

    safeClick('btnConfirmChar', () => {
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
    });

    // Settings & Audio Controls
    const settingsModal = document.getElementById('settingsScreen');
    const btnSettingSound = document.getElementById('btnSettingSound');
    const btnSettingMusic = document.getElementById('btnSettingMusic');
    const btnSettingPerf = document.getElementById('btnSettingPerf');
    const btnSettingShake = document.getElementById('btnSettingShake');
    const btnSettingTouch = document.getElementById('btnSettingTouch');

    const sliderSfx = document.getElementById('sliderSfxVol');
    const sliderMusic = document.getElementById('sliderMusicVol');
    const labelSfx = document.getElementById('sliderSfxVal');
    const labelMusic = document.getElementById('sliderMusicVal');

    const pauseSliderSfx = document.getElementById('pauseSliderSfxVol');
    const pauseSliderMusic = document.getElementById('pauseSliderMusicVol');
    const pauseLabelSfx = document.getElementById('pauseSliderSfxVal');
    const pauseLabelMusic = document.getElementById('pauseSliderMusicVal');

    const syncVolumeUI = () => {
      const sfxPct = Math.round(this.audio.sfxVolume * 100);
      const musicPct = Math.round(this.audio.musicVolume * 100);

      if (sliderSfx) sliderSfx.value = sfxPct;
      if (pauseSliderSfx) pauseSliderSfx.value = sfxPct;
      if (labelSfx) labelSfx.textContent = `${sfxPct}%`;
      if (pauseLabelSfx) pauseLabelSfx.textContent = `${sfxPct}%`;

      if (sliderMusic) sliderMusic.value = musicPct;
      if (pauseSliderMusic) pauseSliderMusic.value = musicPct;
      if (labelMusic) labelMusic.textContent = `${musicPct}%`;
      if (pauseLabelMusic) pauseLabelMusic.textContent = `${musicPct}%`;
    };

    this.syncVolumeUI = syncVolumeUI;
    syncVolumeUI();

    const onSfxInput = (val) => {
      const pct = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
      this.audio.setSfxVolume(pct / 100);
      syncVolumeUI();
    };

    const onMusicInput = (val) => {
      const pct = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
      this.audio.setMusicVolume(pct / 100);
      syncVolumeUI();
    };

    if (sliderSfx) {
      sliderSfx.addEventListener('input', (e) => onSfxInput(e.target.value));
      sliderSfx.addEventListener('change', () => this.audio.playSfx('menuTap'));
    }
    if (pauseSliderSfx) {
      pauseSliderSfx.addEventListener('input', (e) => onSfxInput(e.target.value));
      pauseSliderSfx.addEventListener('change', () => this.audio.playSfx('menuTap'));
    }

    if (sliderMusic) {
      sliderMusic.addEventListener('input', (e) => onMusicInput(e.target.value));
    }
    if (pauseSliderMusic) {
      pauseSliderMusic.addEventListener('input', (e) => onMusicInput(e.target.value));
    }

    this.fastPerfMode = false;
    this.screenShakeEnabled = true;

    // Jukebox Background Music (BGM) Track Selector Listeners (Lobby, Settings & Pause)
    const selectBgm = document.getElementById('selectBgmTrack');
    const pauseSelectBgm = document.getElementById('pauseSelectBgmTrack');
    const lobbySelectBgm = document.getElementById('lobbySelectBgm');

    const syncBgmUI = () => {
      let cur = this.audio.selectedBgm || 'distant_shore';
      if (cur === 'auto' || cur === 'menu') cur = 'distant_shore';
      if (selectBgm) selectBgm.value = cur;
      if (pauseSelectBgm) pauseSelectBgm.value = cur;
      if (lobbySelectBgm) lobbySelectBgm.value = cur;
      [selectBgm, pauseSelectBgm, lobbySelectBgm].forEach(el => {
        if (el && typeof el.syncDropdownLabel === 'function') el.syncDropdownLabel();
      });
      if (this.updateLobbyMusicButton) {
        this.updateLobbyMusicButton(!!this.audio.musicInterval && !this.audio.isManuallyPaused);
      }
    };
    syncBgmUI();

    const onBgmChange = (val) => {
      this.audio.init();
      this.audio.isManuallyPaused = false;
      this.audio.setBgmOverride(val);
      syncBgmUI();
      if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(true);
      this.audio.playSfx('menuTap');
    };

    if (lobbySelectBgm) {
      lobbySelectBgm.addEventListener('change', (e) => onBgmChange(e.target.value));
    }
    if (selectBgm) {
      selectBgm.addEventListener('change', (e) => onBgmChange(e.target.value));
    }
    if (pauseSelectBgm) {
      pauseSelectBgm.addEventListener('change', (e) => onBgmChange(e.target.value));
    }

    safeClick('btnLobbyPlayMusic', (e) => {
      if (e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
      this.audio.init();
      if (this.audio.musicInterval) {
        this.audio.isManuallyPaused = true;
        this.audio.stopMusic();
        if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(false);
      } else {
        this.audio.isManuallyPaused = false;
        const cur = (this.audio.selectedBgm && this.audio.selectedBgm !== 'auto') ? this.audio.selectedBgm : 'distant_shore';
        this.audio.playTrackById(cur, false);
        if (this.updateLobbyMusicButton) this.updateLobbyMusicButton(true);
      }
    });

    safeClick('btnOpenSettings', () => {
      this.audio.playSfx('menuTap');
      syncVolumeUI();
      syncBgmUI();
      if (btnSettingSound) btnSettingSound.textContent = this.audio.soundEnabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
      if (btnSettingMusic) btnSettingMusic.textContent = this.audio.musicEnabled ? '🎵 Synth Music (BGM): ON' : '🔇 Synth Music (BGM): OFF';
      if (btnSettingPerf) btnSettingPerf.textContent = this.fastPerfMode ? '⚡ Fast Performance Mode: ON' : '⚡ Fast Performance Mode: OFF';
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? '📳 Screen Shake: ON' : '📳 Screen Shake: OFF';
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? '📱 Mobile Controls: FORCED ON' : '📱 Mobile Controls: AUTO';
      if (settingsModal) settingsModal.style.display = 'flex';
    });

    safeClick('btnCloseSettings', () => {
      this.audio.playSfx('menuTap');
      if (settingsModal) settingsModal.style.display = 'none';
    });

    safeClick('btnSettingSound', () => {
      this.audio.playSfx('menuTap');
      const enabled = this.audio.toggleSound();
      if (btnSettingSound) btnSettingSound.textContent = enabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
      const soundBtn = document.getElementById('btnSoundToggle');
      if (soundBtn) soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    safeClick('btnSettingMusic', () => {
      this.audio.playSfx('menuTap');
      const enabled = this.audio.toggleMusic();
      if (btnSettingMusic) btnSettingMusic.textContent = enabled ? '🎵 Synth Music (BGM): ON' : '🔇 Synth Music (BGM): OFF';
    });

    safeClick('btnSettingPerf', () => {
      this.audio.playSfx('menuTap');
      this.fastPerfMode = !this.fastPerfMode;
      if (btnSettingPerf) btnSettingPerf.textContent = this.fastPerfMode ? '⚡ Fast Performance Mode: ON' : '⚡ Fast Performance Mode: OFF';
    });

    safeClick('btnSettingShake', () => {
      this.audio.playSfx('menuTap');
      this.screenShakeEnabled = !this.screenShakeEnabled;
      if (btnSettingShake) btnSettingShake.textContent = this.screenShakeEnabled ? '📳 Screen Shake: ON' : '📳 Screen Shake: OFF';
    });

    safeClick('btnSettingTouch', () => {
      this.audio.playSfx('menuTap');
      this.isRealMobile = !this.isRealMobile;
      if (btnSettingTouch) btnSettingTouch.textContent = this.isRealMobile ? '📱 Mobile Controls: FORCED ON' : '📱 Mobile Controls: FORCED OFF';
      const touchBox = document.getElementById('touchControls');
      if (touchBox && this.state === 'playing') {
        touchBox.style.display = this.isRealMobile ? 'flex' : 'none';
      }
    });

    safeClick('btnSaveSettings', () => {
      this.audio.playSfx('menuTap');
      if (settingsModal) settingsModal.style.display = 'none';
    });

    // Sound toggle
    safeClick('btnSoundToggle', () => {
      this.audio.playSfx('menuTap');
      const enabled = this.audio.toggleSound();
      const soundBtn = document.getElementById('btnSoundToggle');
      if (soundBtn) soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    // Mobile UI Toggle
    safeClick('btnMobileToggle', () => {
      const touchBox = document.getElementById('touchControls');
      if (touchBox) {
        const isShown = touchBox.style.display === 'flex';
        touchBox.style.display = isShown ? 'none' : 'flex';
      }
    });

    safeClick('btnScreenshot', () => this.takeScreenshot());

    safeClick('btnPause', () => {
      if (this.state === 'playing') {
        this.state = 'paused';
        this.releaseAllInputs();
        this.setOverlaysVisible(false);
        syncVolumeUI();
        const ps = document.getElementById('pauseScreen');
        if (ps) ps.style.display = 'flex';
      }
    });

    // Touch controls binding
    const bindTouch = (id, keyName) => {
      const el = document.getElementById(id);
      if (!el) return;
      let activeTouchId = null;

      const press = (e) => {
        if (e.cancelable) e.preventDefault();
        this.audio.init();
        this.keysP1[keyName] = true;
        el.classList.add('active-touch');
        if (navigator.vibrate) {
          try { navigator.vibrate(12); } catch (vErr) {}
        }
        if (keyName === 'attack') this.triggerSlotAnimation('slotJ');
        if (keyName === 'special') this.triggerSlotAnimation('slotK');
        if (keyName === 'skill') this.triggerSlotAnimation('slotL');
      };

      const release = (e) => {
        if (e && e.cancelable) e.preventDefault();
        this.keysP1[keyName] = false;
        el.classList.remove('active-touch');
        activeTouchId = null;
      };

      el.addEventListener('touchstart', (e) => {
        if (activeTouchId === null && e.changedTouches.length > 0) {
          activeTouchId = e.changedTouches[0].identifier;
          press(e);
        }
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === activeTouchId) {
            release(e);
            break;
          }
        }
      }, { passive: false });

      el.addEventListener('touchcancel', (e) => {
        release(e);
      }, { passive: false });

      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' || activeTouchId === null) {
          press(e);
          try { el.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });

      el.addEventListener('pointerup', (e) => {
        release(e);
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      });

      el.addEventListener('pointercancel', (e) => {
        release(e);
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      });
    };

    bindTouch('touchLeft', 'left');
    bindTouch('touchRight', 'right');
    bindTouch('touchJump', 'jump');
    bindTouch('touchAttack', 'attack');
    bindTouch('touchSpecial', 'special');
    bindTouch('touchSkill', 'skill');
    bindTouch('touchDodge', 'dodge');

    // Clickable Action Bar Slots for Desktop
    safeClick('slotJ', () => {
      this.keysP1.attack = true;
      this.triggerSlotAnimation('slotJ');
      setTimeout(() => { this.keysP1.attack = false; }, 80);
    });
    safeClick('slotK', () => {
      this.keysP1.special = true;
      this.triggerSlotAnimation('slotK');
      setTimeout(() => { this.keysP1.special = false; }, 80);
    });
    safeClick('slotL', () => {
      this.keysP1.skill = true;
      this.triggerSlotAnimation('slotL');
      setTimeout(() => { this.keysP1.skill = false; }, 80);
    });
    safeClick('slotI', () => {
      this.keysP1.dodge = true;
      this.triggerSlotAnimation('slotI');
      setTimeout(() => { this.keysP1.dodge = false; }, 80);
    });

    // P2 Clickable Action Bar Slots (Desktop)
    safeClick('slotP2_J', () => {
      this.keysP2.attack = true;
      this.triggerSlotAnimation('slotP2_J');
      setTimeout(() => { this.keysP2.attack = false; }, 80);
    });
    safeClick('slotP2_K', () => {
      this.keysP2.special = true;
      this.triggerSlotAnimation('slotP2_K');
      setTimeout(() => { this.keysP2.special = false; }, 80);
    });
    safeClick('slotP2_L', () => {
      this.keysP2.skill = true;
      this.triggerSlotAnimation('slotP2_L');
      setTimeout(() => { this.keysP2.skill = false; }, 80);
    });
    safeClick('slotP2_I', () => {
      this.keysP2.dodge = true;
      this.triggerSlotAnimation('slotP2_I');
      setTimeout(() => { this.keysP2.dodge = false; }, 80);
    });

    // Overdrive Button Listeners
    safeClick('btnOverdrive', () => this.activatePinkOverdrive('p1'));
    safeClick('btnOverdriveP2', () => this.activatePinkOverdrive('p2'));

    const touchOverdrive = document.getElementById('touchOverdrive');
    if (touchOverdrive) {
      touchOverdrive.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        this.audio.init();
        this.activatePinkOverdrive('p1');
        touchOverdrive.classList.add('active-touch');
      }, { passive: false });

      touchOverdrive.addEventListener('touchend', (e) => {
        if (e && e.cancelable) e.preventDefault();
        touchOverdrive.classList.remove('active-touch');
      }, { passive: false });
    }
  }

  triggerSlotAnimation(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    slot.classList.remove('active-trigger');
    void slot.offsetWidth;
    slot.classList.add('active-trigger');
  }

  updateCooldowns() {
    const cdJ = document.getElementById('cdJ');
    const cdK = document.getElementById('cdK');
    const cdL = document.getElementById('cdL');
    const cdI = document.getElementById('cdI');
    if (cdJ) cdJ.style.height = `${Math.min(100, Math.max(0, (this.player.attackCooldown / 0.22) * 100))}%`;
    if (cdK) cdK.style.height = `${Math.min(100, Math.max(0, (this.player.specialCooldown / 0.85) * 100))}%`;
    if (cdL) cdL.style.height = `${Math.min(100, Math.max(0, (this.player.skillCooldown / 3.2) * 100))}%`;
    if (cdI) cdI.style.height = `${Math.min(100, Math.max(0, (this.player.dodgeCooldown / 0.55) * 100))}%`;

    if (this.playerMode === '2p' && this.player2) {
      const cdP2_J = document.getElementById('cdP2_J');
      const cdP2_K = document.getElementById('cdP2_K');
      const cdP2_L = document.getElementById('cdP2_L');
      const cdP2_I = document.getElementById('cdP2_I');
      const p2AtkCd = (this.isFused && this.player2.isMergedInFusion) ? (this.player2AttackCooldown || 0) : this.player2.attackCooldown;
      const p2SpCd = (this.isFused && this.player2.isMergedInFusion) ? (this.player2SpecialCooldown || 0) : this.player2.specialCooldown;
      const p2SkCd = (this.isFused && this.player2.isMergedInFusion) ? (this.player2SkillCooldown || 0) : this.player2.skillCooldown;
      const p2DodgeCd = (this.isFused && this.player2.isMergedInFusion) ? this.player.dodgeCooldown : this.player2.dodgeCooldown;

      if (cdP2_J) cdP2_J.style.height = `${Math.min(100, Math.max(0, (p2AtkCd / 0.22) * 100))}%`;
      if (cdP2_K) cdP2_K.style.height = `${Math.min(100, Math.max(0, (p2SpCd / 0.85) * 100))}%`;
      if (cdP2_L) cdP2_L.style.height = `${Math.min(100, Math.max(0, (p2SkCd / 3.2) * 100))}%`;
      if (cdP2_I) cdP2_I.style.height = `${Math.min(100, Math.max(0, (p2DodgeCd / 0.55) * 100))}%`;
    }

    const touchCdDodge = document.getElementById('touchCdDodge');
    if (touchCdDodge) touchCdDodge.style.height = `${Math.min(100, Math.max(0, (this.player.dodgeCooldown / 0.55) * 100))}%`;
  }
}
// Bulletproof Game Bootstrapper (works whether DOM is loading, interactive, or complete)
// ---------------------------------------------------------------------------
// RESPONSIVE STAGE SCALING
// The game is authored at a fixed 1280x720. Scaling the whole stage (canvas, HUD,
// menus) as one unit makes the native window and every browser behave identically
// at any window size, with no HUD overflow on letterboxed viewports.
// ---------------------------------------------------------------------------
function fitGameToViewport() {
  const w = window.innerWidth || 1280;
  const h = window.innerHeight || 720;
  const scale = Math.max(0.35, Math.min(w / 1280, h / 720));
  document.documentElement.style.setProperty('--gc-scale', String(scale));
}

// ---------------------------------------------------------------------------
// THEMED DROPDOWNS
// Native <select> widgets are painted by the platform (WebKitGTK ignores most CSS on
// them, which is why the jukebox turned white-on-white in the desktop window). Each
// select is kept in the DOM for its value/change API, but hidden behind a fully
// styled dropdown so the control looks identical in every browser and native shell.
// ---------------------------------------------------------------------------
function enhanceSelect(select) {
  if (!select || select.dataset.suEnhanced === 'true') return;
  select.dataset.suEnhanced = 'true';

  const wrap = document.createElement('div');
  wrap.className = 'su-dropdown';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'su-dropdown-btn';

  const label = document.createElement('span');
  label.className = 'su-dropdown-label';

  const chevron = document.createElement('span');
  chevron.className = 'su-dropdown-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '▾';

  btn.appendChild(label);
  btn.appendChild(chevron);

  const list = document.createElement('div');
  list.className = 'su-dropdown-list';
  list.setAttribute('role', 'listbox');

  wrap.appendChild(btn);
  wrap.appendChild(list);
  select.parentNode.insertBefore(wrap, select);
  select.classList.add('su-native-hidden');

  const close = () => wrap.classList.remove('open');
  const isOpen = () => wrap.classList.contains('open');

  const syncLabel = () => {
    const opt = select.options[select.selectedIndex];
    label.textContent = opt ? opt.textContent : '';
    list.querySelectorAll('.su-dropdown-item').forEach((item, i) => {
      item.classList.toggle('selected', i === select.selectedIndex);
    });
  };

  const rebuild = () => {
    list.innerHTML = '';
    Array.from(select.options).forEach((opt, index) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'su-dropdown-item';
      item.textContent = opt.textContent;
      item.setAttribute('role', 'option');
      if (index === select.selectedIndex) item.classList.add('selected');
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        select.selectedIndex = index;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncLabel();
        close();
      });
      list.appendChild(item);
    });
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen()) { close(); return; }
    rebuild();
    wrap.classList.add('open');
  });

  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  select.addEventListener('change', syncLabel);

  select.syncDropdownLabel = syncLabel;
  syncLabel();
}

function enhanceAllSelects() {
  document.querySelectorAll('select.su-select').forEach(enhanceSelect);
}

function bootStevenUniverseGame() {
  if (window.__suGameInitialized) return;
  window.__suGameInitialized = true;

  try {
    const game = new StevenUniverseGame();
    enhanceAllSelects();
    game.start();
    window.game = game;
    console.log('⭐ Steven Universe: Crystal Guardians Unleashed initialized successfully!');
  } catch (err) {
    console.error('Failed to initialize Steven Universe game:', err);
    const errBox = document.createElement('div');
    errBox.style.cssText = 'position:fixed;bottom:10px;left:10px;right:10px;background:#ef4444;color:#fff;padding:12px;border-radius:8px;font-family:sans-serif;font-size:12px;z-index:99999;box-shadow:0 4px 15px rgba(0,0,0,0.5);';
    errBox.innerHTML = `⚠️ <b>Game Initialization Alert:</b> ${err.message || err}`;
    if (document.body) document.body.appendChild(errBox);
  }

  // Register Service Worker for 100% offline play on Android & Xiaomi
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      console.log('⭐ Steven Universe ServiceWorker registered:', reg.scope);
    }).catch((err) => {
      console.warn('ServiceWorker registration error:', err);
    });
  }
}

window.addEventListener('resize', fitGameToViewport);
window.addEventListener('orientationchange', fitGameToViewport);
window.addEventListener('fullscreenchange', fitGameToViewport);
fitGameToViewport();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fitGameToViewport);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootStevenUniverseGame);
} else {
  // DOM is already parsed (interactive or complete), boot immediately!
  bootStevenUniverseGame();
}
