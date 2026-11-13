/**
 * Background Music Manager
 * - Never autoplays before user interaction.
 * - Prefers /audio/background.mp3 when present in public/audio/background.mp3.
 * - Gracefully falls back to a sweet, romantic, cheerful synthesized Web Audio
 *   music-box/celesta instrumental loop if no MP3 file has been added yet.
 */

type AudioMode = 'uninitialized' | 'mp3' | 'synth';

const MELODY_NOTES: { time: number; freq: number; dur: number; gain: number }[] = [
  // Bar 1: Fmaj7 (F4 - A4 - C5 - E5 - C5 - A4)
  { time: 0.0, freq: 174.61, dur: 1.8, gain: 0.12 }, // F3 bass
  { time: 0.0, freq: 349.23, dur: 0.55, gain: 0.14 }, // F4
  { time: 0.35, freq: 440.0, dur: 0.55, gain: 0.13 }, // A4
  { time: 0.7, freq: 523.25, dur: 0.65, gain: 0.15 }, // C5
  { time: 1.05, freq: 659.25, dur: 0.7, gain: 0.16 }, // E5
  { time: 1.45, freq: 523.25, dur: 0.55, gain: 0.12 }, // C5

  // Bar 2: Dm7 (D4 - F4 - A4 - C5 - A4)
  { time: 2.0, freq: 146.83, dur: 1.8, gain: 0.12 }, // D3 bass
  { time: 2.0, freq: 293.66, dur: 0.55, gain: 0.13 }, // D4
  { time: 2.35, freq: 349.23, dur: 0.55, gain: 0.13 }, // F4
  { time: 2.7, freq: 440.0, dur: 0.65, gain: 0.15 }, // A4
  { time: 3.05, freq: 587.33, dur: 0.7, gain: 0.16 }, // D5
  { time: 3.45, freq: 523.25, dur: 0.55, gain: 0.14 }, // C5

  // Bar 3: Bbmaj7 (Bb3 - D4 - F4 - A4 - G4)
  { time: 4.0, freq: 116.54, dur: 1.8, gain: 0.12 }, // Bb2 bass
  { time: 4.0, freq: 233.08, dur: 0.55, gain: 0.13 }, // Bb3
  { time: 4.35, freq: 349.23, dur: 0.55, gain: 0.14 }, // F4
  { time: 4.7, freq: 440.0, dur: 0.65, gain: 0.15 }, // A4
  { time: 5.05, freq: 587.33, dur: 0.65, gain: 0.15 }, // D5
  { time: 5.45, freq: 466.16, dur: 0.55, gain: 0.13 }, // Bb4

  // Bar 4: C7sus4 -> C7 (C4 - G4 - Bb4 - A4 - G4)
  { time: 6.0, freq: 130.81, dur: 1.8, gain: 0.12 }, // C3 bass
  { time: 6.0, freq: 392.0, dur: 0.55, gain: 0.14 }, // G4
  { time: 6.35, freq: 466.16, dur: 0.55, gain: 0.14 }, // Bb4
  { time: 6.7, freq: 440.0, dur: 0.6, gain: 0.15 }, // A4
  { time: 7.05, freq: 392.0, dur: 0.7, gain: 0.14 }, // G4
  { time: 7.45, freq: 329.63, dur: 0.6, gain: 0.13 }, // E4
];

const LOOP_DURATION_MS = 8000;

class BackgroundMusicController {
  private mode: AudioMode = 'uninitialized';
  private mp3Audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private isPlaying = false;
  private volume = 0.45;
  private activeOscillators: Set<OscillatorNode> = new Set();

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    if (!this.ctx) {
      this.ctx = new Ctx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume * 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private async detectMode(): Promise<AudioMode> {
    if (this.mode !== 'uninitialized') return this.mode;
    try {
      const response = await fetch('/audio/background.mp3', { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.toLowerCase().startsWith('audio/')) {
        const audio = new Audio('/audio/background.mp3');
        audio.loop = true;
        audio.volume = this.volume;
        this.mp3Audio = audio;
        this.mode = 'mp3';
        return 'mp3';
      }
    } catch {
      // Fall back safely to synthesized romantic instrumental
    }
    this.mode = 'synth';
    return 'synth';
  }

  private scheduleSynthBar() {
    if (!this.isPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const baseTime = ctx.currentTime + 0.04;
    MELODY_NOTES.forEach((note) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = note.freq < 200 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(note.freq, baseTime + note.time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, baseTime + note.time);

      const start = baseTime + note.time;
      const peak = note.gain;
      noteGain.gain.setValueAtTime(0.0001, start);
      noteGain.gain.linearRampToValueAtTime(peak, start + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, start + note.dur);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain!);

      this.activeOscillators.add(osc);
      osc.onended = () => {
        this.activeOscillators.delete(osc);
      };

      osc.start(start);
      osc.stop(start + note.dur + 0.05);
    });
  }

  async play(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const mode = await this.detectMode();
    if (!this.isPlaying) return;

    if (mode === 'mp3' && this.mp3Audio) {
      this.mp3Audio.volume = this.volume;
      try {
        await this.mp3Audio.play();
        return;
      } catch {
        // Fallback to synth if browser rejects MP3 playback
        this.mode = 'synth';
      }
    }

    this.scheduleSynthBar();
    this.loopTimer = window.setInterval(() => {
      this.scheduleSynthBar();
    }, LOOP_DURATION_MS);
  }

  pause(): void {
    this.isPlaying = false;
    if (this.mp3Audio) {
      this.mp3Audio.pause();
    }
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeOscillators.clear();
  }

  setVolume(val: number): void {
    const clamped = Math.max(0, Math.min(1, val));
    this.volume = clamped;
    if (this.mp3Audio) {
      this.mp3Audio.volume = clamped;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        clamped * 0.45,
        this.ctx.currentTime,
        0.04
      );
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const bgmController = new BackgroundMusicController();
