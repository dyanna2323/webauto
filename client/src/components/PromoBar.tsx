import { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
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
        isAnimating ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}
      data-testid="promo-banner"
    >
      {/* Background with darker gradient for better contrast (WCAG AA compliant) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, #1a252f 0%, #2c3e50 35%, #2563eb 70%, #1e40af 100%)'
        }}
      />
      
      {/* Modern Geometric Pattern - more subtle and clean */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
          <defs>
            <pattern id="modern-geo-pattern" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
              {/* Clean triangular shapes */}
              <polygon points="0,40 30,0 60,40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              <polygon points="15,40 30,20 45,40" fill="white" opacity="0.1"/>
              {/* Minimal dots */}
              <circle cx="15" cy="30" r="1.5" fill="white" opacity="0.3"/>
              <circle cx="45" cy="10" r="1.5" fill="white" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#modern-geo-pattern)" />
        </svg>
      </div>

      {/* Soft gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      
      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* TechNexo Brand */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="hidden sm:inline text-white font-semibold text-sm">TechNexo</span>
            </div>
            
            {/* Vertical divider */}
            <div className="hidden sm:block w-px h-5 bg-white/20" />
            
            {/* Sparkle icon */}
            <Sparkles className="h-4 w-4 text-white/70 animate-pulse" />
            
            {/* Promotional message */}
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm sm:text-base">
                <span className="hidden sm:inline font-medium opacity-90">Lanzamiento Especial:</span>
                <span className="font-bold text-base sm:text-lg sm:ml-2">50% OFF</span>
                <span className="text-xs sm:text-sm opacity-80 ml-1">Plan Premium</span>
              </span>
            </div>
            
            {/* Time indicator */}
            <div className="hidden md:flex items-center">
              <div className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-md">
                <span className="text-white text-xs font-medium" data-testid="text-promo-timer">
                  Tiempo limitado
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/register" onClick={handleCTAClick}>
              <button
                className="bg-white text-[#2c3e50] font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/95 transition-all duration-200 shadow-sm flex items-center gap-1.5"
                data-testid="button-promo-cta"
              >
                <span>Comenzar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
              aria-label="Cerrar banner"
              data-testid="button-close-banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};