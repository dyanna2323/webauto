import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function KonamiCode() {
  const [partyMode, setPartyMode] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence(prev => {
        const newSequence = [...prev, e.key].slice(-KONAMI_CODE.length);
        
        if (newSequence.join(',') === KONAMI_CODE.join(',')) {
          activatePartyMode();
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activatePartyMode = () => {
    setPartyMode(true);

    // Confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    setTimeout(() => setPartyMode(false), duration);
  };

  return partyMode ? (
    <div className="fixed inset-0 pointer-events-none z-[999] flex items-center justify-center">
      <div className="bg-gradient-to-r from-primary via-accent to-primary text-white px-8 py-4 rounded-lg text-2xl font-bold animate-bounce shadow-2xl">
        ¡MODO FIESTA ACTIVADO!
      </div>
    </div>
  ) : null;
}
