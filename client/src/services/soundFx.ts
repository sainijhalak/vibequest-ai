// Web Audio API Sound Synthesizer & Vibration Haptics
// Zero external asset dependencies; lightweight, instant, accessible

const STORAGE_KEY = 'vibequest_sound_fx_enabled';

class SoundFxService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // Default strictly to false per game feel requirements
        this.soundEnabled = stored === 'true';
      } catch {
        this.soundEnabled = false;
      }
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, String(enabled));
      } catch {
        // ignore localStorage errors
      }
    }
    if (enabled) {
      this.initContext();
      this.playTap(); // Immediate subtle audio confirmation
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Subtle mechanical card tap click
   */
  public playTap(): void {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Modern whoosh/pop when sending a user message
   */
  public playMessageSent(): void {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // fallback
    }
  }

  /**
   * Warm marimba-style two-tone chime when character response arrives
   */
  public playMessageReceived(): void {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // Note 2: E5 (659.25 Hz) delayed 60ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.06);
      gain2.gain.setValueAtTime(0.045, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.22);
    } catch {
      // fallback
    }
  }

  /**
   * Low dramatic scene start tone
   */
  public playSceneStart(): void {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // fallback
    }
  }

  /**
   * Mobile haptic feedback via the Vibration API (honoring prefers-reduced-motion)
   */
  public triggerHaptic(pattern: number | number[] = 14): void {
    if (typeof window === 'undefined') return;

    // Respect user's motion preference: skip vibration if prefers-reduced-motion is enabled
    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;
    } catch {
      // ignore media query errors
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore vibration permission blocks
      }
    }
  }
}

export const soundFx = new SoundFxService();
