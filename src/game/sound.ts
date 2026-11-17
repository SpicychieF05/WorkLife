/**
 * Web Audio procedural synthesizer for WorkLife.
 * No external sound assets required; all tones are generated in real-time.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgOsc: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private pulseTimer: number | null = null;

  constructor() {
    const saved = localStorage.getItem('worklife:muted');
    if (saved !== null) {
      this.enabled = saved !== 'true';
    }
  }

  public unlock(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('worklife:muted', (!this.enabled).toString());
    if (!this.enabled) {
      this.stopBed();
    }
    return this.enabled;
  }

  // 1. Flap blip (~880Hz, 60ms)
  public playFlap(): void {
    if (!this.enabled || !this.ctx) return;
    this.unlock();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio context error ignore
    }
  }

  // 2. Company gate passed (high clean tone + click)
  public playClear(tier: string = 'MASS'): void {
    if (!this.enabled || !this.ctx) return;
    this.unlock();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = tier === 'FAANG' ? 'sine' : 'triangle';
      const baseFreq = tier === 'FAANG' ? 1320 : 1046; // C6 or E6
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio error
    }
  }

  // 3. Hazard / Collision Thump (120Hz)
  public playThump(): void {
    if (!this.enabled || !this.ctx) return;
    this.unlock();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {
      // Audio error
    }
  }

  // 4. Burnout / Exit letter paper rustle & tone
  public playExit(): void {
    if (!this.enabled || !this.ctx) return;
    this.unlock();
    this.stopBed();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {
      // Audio error
    }
  }

  // 5. Retirement two-note "adieu" chime
  public playRetire(): void {
    if (!this.enabled || !this.ctx) return;
    this.unlock();
    this.stopBed();

    try {
      const now = this.ctx.currentTime;
      // Note 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Note 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.3); // A4
      gain2.gain.setValueAtTime(0.22, now + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.3);
      osc2.stop(now + 0.9);
    } catch {
      // Audio error
    }
  }

  // 6. Corporate IT corridor bed (pulse)
  public startBed(): void {
    if (!this.enabled || !this.ctx) return;
    this.stopBed();
    this.unlock();

    try {
      // Start a subtle recurring IT pulse beat
      const tick = () => {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.08);

          gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.09);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.09);
        } catch {
          // ignore
        }
      };

      this.pulseTimer = window.setInterval(tick, 500); // 120 bpm corporate sprint pulse
    } catch {
      // Audio error
    }
  }

  public stopBed(): void {
    if (this.pulseTimer !== null) {
      clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }
    if (this.bgOsc) {
      try {
        this.bgOsc.stop();
        this.bgOsc.disconnect();
      } catch {}
      this.bgOsc = null;
    }
    if (this.bgGain) {
      try {
        this.bgGain.disconnect();
      } catch {}
      this.bgGain = null;
    }
  }
}

export const sound = new SoundSystem();
