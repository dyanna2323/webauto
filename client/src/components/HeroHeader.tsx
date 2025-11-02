import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Link } from 'wouter';
import BrainTechLogo from './icons/BrainTechLogo';
import { Button } from '@/components/ui/button';

export const HeroHeader = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa] min-h-[600px] md:min-h-[700px]">
      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-geo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,10 10,20 0,10" fill="white" opacity="0.1" />
              <circle cx="10" cy="10" r="3" fill="white" opacity="0.2" />
              <path d="M0,0 L20,20 M20,0 L0,20" stroke="white" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hero-geo)" />
        </svg>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        <Sparkles className="absolute top-[20%] left-[10%] w-6 h-6 text-white/30 animate-float" />
        <Sparkles className="absolute top-[60%] right-[15%] w-5 h-5 text-white/25 animate-float-delay-1" />
        <Sparkles className="absolute bottom-[30%] left-[80%] w-4 h-4 text-white/20 animate-float-delay-2" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Top bar with logo and CTA */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 mb-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrainTechLogo className="w-10 h-10 md:w-12 md:h-12 text-[#2563eb]" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">TECH</h1>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 -mt-1">NEXO</h1>
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              CREA TU WEB GRATIS
            </h2>
          </div>
        </div>

        {/* Main content with devices showcase */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Device mockups */}
          <div 
            className="relative h-[400px] md:h-[500px] perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Desktop mockup */}
            <div 
              className="absolute left-0 top-0 w-[70%] transform transition-all duration-700 z-30"
              style={{
                transform: `
                  rotateY(${mousePosition.x * 10}deg) 
                  rotateX(${-mousePosition.y * 10}deg)
                  translateZ(${isHovered ? 50 : 0}px)
                `
              }}
            >
              <div className="bg-gray-900 rounded-lg p-2 shadow-2xl">
                <div className="bg-white rounded">
                  <div className="h-2 bg-gray-200 flex items-center px-2 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  <div className="p-4 h-[200px] md:h-[250px] bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="text-xs text-gray-600 mb-2">&lt;insert&gt;</div>
                    <div className="text-xs text-gray-600">&lt;some_code&gt;</div>
                    <div className="text-xs text-gray-600">&lt;here&gt;</div>
                    <div className="mt-4">
                      <div className="h-2 bg-blue-200 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-purple-200 rounded w-1/2" />
                    </div>
                    <div className="text-center mt-6 text-sm font-semibold text-gray-700">
                      Create your own beautiful website
                    </div>
                  </div>
                </div>
              </div>
              <Monitor className="w-6 h-6 text-white/60 mx-auto mt-2" />
            </div>

            {/* Tablet mockup */}
            <div 
              className="absolute right-0 top-[30%] w-[45%] transform transition-all duration-700 z-20"
              style={{
                transform: `
                  rotateY(${mousePosition.x * 15}deg) 
                  rotateX(${-mousePosition.y * 15}deg)
                  translateZ(${isHovered ? 30 : 0}px)
                `
              }}
            >
              <div className="bg-gray-800 rounded-lg p-2 shadow-xl">
                <div className="bg-white rounded h-[150px] md:h-[180px]">
                  <div className="p-3">
                    <div className="h-1.5 bg-blue-300 rounded w-full mb-2" />
                    <div className="h-1.5 bg-purple-300 rounded w-3/4 mb-2" />
                    <div className="h-1.5 bg-pink-300 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded" />
                      <div className="h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <Tablet className="w-5 h-5 text-white/60 mx-auto mt-1" />
            </div>

            {/* Phone mockup */}
            <div 
              className="absolute right-[20%] bottom-0 w-[25%] transform transition-all duration-700 z-10"
              style={{
                transform: `
                  rotateY(${mousePosition.x * 20}deg) 
                  rotateX(${-mousePosition.y * 20}deg)
                  translateZ(${isHovered ? 10 : 0}px)
                `
              }}
            >
              <div className="bg-gray-900 rounded-lg p-1.5 shadow-lg">
                <div className="bg-white rounded h-[120px] md:h-[140px]">
                  <div className="p-2">
                    <div className="h-1 bg-blue-400 rounded w-full mb-1.5" />
                    <div className="h-1 bg-purple-400 rounded w-2/3 mb-1.5" />
                    <div className="h-1 bg-pink-400 rounded w-1/2" />
                    <div className="mt-3 h-16 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded" />
                  </div>
                </div>
              </div>
              <Smartphone className="w-4 h-4 text-white/60 mx-auto mt-1" />
            </div>
          </div>

          {/* Right side - CTA content */}
          <div className="text-white space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 transform transition-all duration-500 hover:bg-white/15">
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                NO PIERDAS CLIENTES
              </h3>
              <p className="text-lg md:text-xl mb-6 leading-relaxed">
                CREA TU PÁGINA WEB CON TECHNEXO.AI<br />
                EN 5 MINUTOS TOTALMENTE <span className="font-bold text-yellow-300">GRATIS</span>
              </p>
              
              <div className="space-y-4">
                <Link href="/register">
                  <Button 
                    size="lg"
                    className="w-full bg-white text-[#2563eb] hover:bg-gray-100 font-bold text-lg py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <span>EMPEZAR GRATIS AHORA</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link href="/chat-builder">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 font-semibold backdrop-blur-sm"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span>Probar con IA Chat</span>
                  </Button>
                </Link>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  Sin tarjeta de crédito
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  IA Avanzada
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  100% Personalizable
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">5min</div>
                <div className="text-xs opacity-90">Tiempo creación</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs opacity-90">Responsive</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs opacity-90">Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};