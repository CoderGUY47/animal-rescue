/**
 * useSound — synthesized sounds via Web Audio API (no audio files needed)
 * - playTap()    : soft UI click/touch feedback
 * - playSiren()  : rising siren for emergency alert; returns a stop() fn
 */
export function useSound() {
  /**
   * Short, soft tap sound (like a mobile press feedback).
   */
  function playTap() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);

      osc.onended = () => ctx.close();
    } catch {
      // Silently fail if AudioContext is not available
    }
  }

  /**
   * Emergency siren: alternates between two high tones continuously.
   * Returns a stop() function so the caller can toggle it off.
   */
  function playSiren(): () => void {
    let ctx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let stopped = false;

    try {
      ctx = new AudioContext();
      osc = ctx.createOscillator();
      gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.25, ctx.currentTime);

      // Alternate between 600Hz and 900Hz every 0.4s for siren effect
      const sirenCycle = () => {
        if (stopped || !osc || !ctx) return;
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.4);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.8);
        setTimeout(sirenCycle, 800);
      };

      osc.start(ctx.currentTime);
      sirenCycle();
    } catch {
      // Silently fail
    }

    return function stop() {
      stopped = true;
      try {
        if (gain && ctx) {
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        }
        setTimeout(() => {
          osc?.stop();
          ctx?.close();
        }, 350);
      } catch {
        // Silently fail
      }
    };
  }

  return { playTap, playSiren };
}
