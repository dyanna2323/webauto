import { useState, useRef, MouseEvent } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function RippleButton({ children, onClick, className, ...props }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: rippleIdRef.current++,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <Button
      ref={buttonRef}
      onClick={createRipple}
      className={`relative overflow-hidden ${className || ''}`}
      {...props}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {children}
    </Button>
  );
}
