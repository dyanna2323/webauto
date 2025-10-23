import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const shapes = [
  { size: 120, x: '10%', y: '20%', rotation: 0, speed: 0.02 },
  { size: 80, x: '80%', y: '30%', rotation: 45, speed: 0.015 },
  { size: 100, x: '70%', y: '70%', rotation: 0, speed: 0.025 },
  { size: 60, x: '20%', y: '80%', rotation: 45, speed: 0.018 },
  { size: 90, x: '50%', y: '50%', rotation: 0, speed: 0.022 },
];

export function ParallaxShapes() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 100;
      const y = (e.clientY / window.innerHeight - 0.5) * 100;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-lg backdrop-blur-sm"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            rotate: shape.rotation,
            x: smoothX,
            y: smoothY,
            background: index % 2 === 0
              ? 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(188, 94%, 43%) 100%)'
              : 'linear-gradient(135deg, hsl(188, 94%, 43%) 0%, hsl(142, 76%, 36%) 100%)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
