
import React from 'react';
import Header from './Header';
import { HeroIllustration } from './icons/HeroIllustration';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#0066FF] to-[#00D4FF] overflow-hidden">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-2 lg:order-1">
             <HeroIllustration className="w-full max-w-md lg:max-w-lg h-auto" />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tighter">
              Crea tu web profesional en solo 5 minutos
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl mx-auto lg:mx-0">
              La plataforma más rápida y sencilla para crear sitios web increíbles. Sin complicaciones, sin código.
            </p>
            <div className="mt-10 flex flex-col items-center lg:items-start">
              <button 
                className="bg-white text-[#0A1628] font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 glow-on-hover"
                aria-label="Crear mi web ahora"
              >
                ⚡ Crear Mi Web Ahora
              </button>
              <p className="mt-3 text-sm text-white/80">Completamente gratis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
