import { useState, useEffect } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';
import { GiftIcon } from './icons/GiftIcon';
import { X, Zap } from 'lucide-react';
import { Link } from 'wouter';

export const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Check if banner was previously closed
    const isClosed = localStorage.getItem('promoBannerClosed');
    if (isClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('promoBannerClosed', 'true');
    }, 300);
  };

  const handleCTAClick = () => {
    // Remove the closed state when CTA is clicked
    localStorage.removeItem('promoBannerClosed');
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${
        isAnimating ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0066ff 25%, #00a6ff 50%, #00d4ff 75%, #00ffea 100%)'
      }}
      data-testid="promo-banner"
    >
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <pattern id="geometric" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,0 40,20 20,40 0,20" fill="none" stroke="white" strokeWidth="0.5"/>
            <circle cx="20" cy="20" r="3" fill="white" opacity="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#geometric)" />
        </svg>
      </div>

      {/* Animated shimmer effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
      </div>

      {/* Floating sparkles animation */}
      <div className="absolute inset-0 overflow-hidden">
        <SparkleIcon className="absolute top-2 left-[15%] h-5 w-5 text-white/40 animate-float" />
        <SparkleIcon className="absolute bottom-2 left-[35%] h-4 w-4 text-white/30 animate-float-delay-1" />
        <SparkleIcon className="absolute top-3 left-[65%] h-5 w-5 text-white/35 animate-float-delay-2" />
        <SparkleIcon className="absolute bottom-3 left-[85%] h-4 w-4 text-white/30 animate-float" />
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* TechNexo Logo/Text */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-white font-bold text-lg">TechNexo</span>
            </div>

            {/* Promo content */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Special offer badge */}
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-3 py-1 shadow-lg">
                <Zap className="h-4 w-4" />
                <span className="font-bold text-xs uppercase tracking-wide" data-testid="text-promo-badge">
                  Black Friday
                </span>
              </div>

              {/* Promo text */}
              <div className="flex items-center gap-2 text-white">
                <GiftIcon className="h-5 w-5 animate-bounce-subtle" />
                <span className="text-sm md:text-base font-medium" data-testid="text-promo-title">
                  <span className="font-bold">50% OFF</span> en Plan Premium
                </span>
                <span className="hidden md:inline text-sm opacity-90" data-testid="text-promo-description">
                  - Crea webs profesionales con IA
                </span>
              </div>

              {/* Timer */}
              <div className="hidden sm:flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-xs font-semibold" data-testid="text-promo-timer">
                  Termina en 24h
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/register" onClick={handleCTAClick}>
              <button
                className="bg-white text-blue-600 font-bold text-sm px-5 py-2 rounded-full shadow-xl transform transition-all duration-200 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
                data-testid="button-promo-cta"
              >
                <span className="hidden sm:inline">Obtener Oferta</span>
                <span className="sm:hidden">50% OFF</span>
                <Zap className="h-4 w-4" />
              </button>
            </Link>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
              aria-label="Cerrar banner"
              data-testid="button-close-banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};