let audioCtx: AudioContext | null = null;
let engineOscillators: (OscillatorNode | null)[] = [];
let engineGainNodes: (GainNode | null)[] = [];

export const stopEngineSound = () => {
  try {
    engineOscillators.forEach(osc => {
      if (osc) {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Ignore errors
        }
      }
    });
    engineGainNodes.forEach(gain => {
      if (gain) {
        try {
          gain.disconnect();
        } catch (e) {
          // Ignore errors
        }
      }
    });
    engineOscillators = [];
    engineGainNodes = [];
  } catch (e) {
    // Graceful failure
  }
};

export const playClickSound = () => {
  try {
    const isSoundEnabled = localStorage.getItem("vaakku_sound_enabled_v3");
    if (isSoundEnabled === "false") return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const theme = localStorage.getItem("vaakku_sound_theme_v3") || "default";

    if (theme === "cyber") {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    } else if (theme === "organic") {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    } else {
      // Default pop
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } catch (e) {
    // Graceful failure
  }
};

export const playAnnouncementSound = () => {
  try {
    const isSoundEnabled = localStorage.getItem("vaakku_sound_enabled_v3");
    if (isSoundEnabled === "false") return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Play a unique announcement sound - a dramatic chord
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioCtx!.createOscillator();
      const gainNode = audioCtx!.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx!.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx!.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0, audioCtx!.currentTime + (index * 0.05));
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx!.currentTime + (index * 0.05) + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx!.currentTime + 0.6);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx!.destination);
      
      oscillator.start(audioCtx!.currentTime + (index * 0.05));
      oscillator.stop(audioCtx!.currentTime + 0.6);
    });
  } catch (e) {
    // Graceful failure
  }
};

export const playEngineSound = () => {
  try {
    const isSoundEnabled = localStorage.getItem("vaakku_sound_enabled_v3");
    if (isSoundEnabled === "false") return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Futuristic ambient whoosh sound
    const duration = 6.5; // Match intro duration
    const now = audioCtx.currentTime;

    // Clear any existing engine sounds
    stopEngineSound();

    // Base ambient drone (low frequency)
    const baseOsc = audioCtx.createOscillator();
    const baseGain = audioCtx.createGain();
    baseOsc.type = 'sine';
    baseOsc.frequency.setValueAtTime(80, now);
    baseOsc.frequency.exponentialRampToValueAtTime(40, now + duration);
    baseGain.gain.setValueAtTime(0, now);
    baseGain.gain.linearRampToValueAtTime(0.15, now + 1);
    baseGain.gain.linearRampToValueAtTime(0.1, now + duration);
    baseGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);

    // Futuristic whoosh (sweep)
    const whooshOsc = audioCtx.createOscillator();
    const whooshGain = audioCtx.createGain();
    whooshOsc.type = 'sawtooth';
    whooshOsc.frequency.setValueAtTime(200, now);
    whooshOsc.frequency.exponentialRampToValueAtTime(800, now + 2);
    whooshOsc.frequency.exponentialRampToValueAtTime(200, now + duration);
    whooshGain.gain.setValueAtTime(0, now);
    whooshGain.gain.linearRampToValueAtTime(0.1, now + 0.5);
    whooshGain.gain.linearRampToValueAtTime(0.05, now + duration);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);

    // Ethereal harmonics
    const harmonics = [440, 554, 659]; // A major chord
    harmonics.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.setValueAtTime(freq * 1.5, now + 3);
      osc.frequency.setValueAtTime(freq, now + duration);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1 + i * 0.2);
      gain.gain.linearRampToValueAtTime(0.05, now + duration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx!.destination);
      osc.start(now);
      osc.stop(now + duration + 0.5);
      
      engineOscillators.push(osc);
      engineGainNodes.push(gain);
    });

    // High frequency sparkle
    const sparkleOsc = audioCtx.createOscillator();
    const sparkleGain = audioCtx.createGain();
    sparkleOsc.type = 'triangle';
    sparkleOsc.frequency.setValueAtTime(1200, now);
    sparkleOsc.frequency.exponentialRampToValueAtTime(2400, now + 1.5);
    sparkleOsc.frequency.exponentialRampToValueAtTime(1200, now + duration);
    sparkleGain.gain.setValueAtTime(0, now);
    sparkleGain.gain.linearRampToValueAtTime(0.03, now + 0.5);
    sparkleGain.gain.linearRampToValueAtTime(0.02, now + duration);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);

    // Connect main oscillators
    baseOsc.connect(baseGain);
    baseGain.connect(audioCtx.destination);
    whooshOsc.connect(whooshGain);
    whooshGain.connect(audioCtx.destination);
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(audioCtx.destination);

    baseOsc.start(now);
    baseOsc.stop(now + duration + 0.5);
    whooshOsc.start(now);
    whooshOsc.stop(now + duration + 0.5);
    sparkleOsc.start(now);
    sparkleOsc.stop(now + duration + 0.5);
    
    engineOscillators.push(baseOsc, whooshOsc, sparkleOsc);
    engineGainNodes.push(baseGain, whooshGain, sparkleGain);
  } catch (e) {
    // Graceful failure
  }
};
