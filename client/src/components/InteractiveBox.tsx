import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const painPoints = [
  "¿Te ha pasado? Clientes preguntando '¿Tienes web?' y tú ahí, con excusas...",
  "¿Frustrado con diseñadores que cobran 2000€ y tardan 2 meses?",
  "¿Cansado de plataformas complicadas que necesitas un máster para usar?",
  "¿Perdiendo clientes porque no tienes presencia online profesional?",
  "¿Agobiado entre llevar tu negocio Y aprender a crear webs?",
];

export function InteractiveBox() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPainPoint = () => {
    setCurrentIndex((prev) => (prev + 1) % painPoints.length);
  };

  return (
    <Card
      onClick={nextPainPoint}
      className="relative p-6 cursor-pointer overflow-hidden hover-elevate active-elevate-2 border-2 animate-pulse-border"
      data-testid="interactive-box"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-medium text-center"
        >
          {painPoints[currentIndex]}
        </motion.p>
      </AnimatePresence>
      <p className="text-sm text-muted-foreground text-center mt-4">
        Haz clic para ver más
      </p>
    </Card>
  );
}
