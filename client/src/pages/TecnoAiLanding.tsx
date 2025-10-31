import { Link } from 'wouter';
import { useEffect, useRef, useState } from 'react';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { HeroIllustration } from '@/components/icons/HeroIllustration';

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
}

const allMessages: Message[] = [
  { id: 1, sender: 'assistant', text: '¡Hola! Vamos a crear tu web perfecta. ¿Qué tipo de negocio tienes?' },
  { id: 2, sender: 'user', text: 'Tengo un restaurante mediterráneo.' },
  { id: 3, sender: 'assistant', text: '¡Perfecto! Un restaurante mediterráneo suena genial. ¿Cuál es el nombre de tu negocio?' },
  { id: 4, sender: 'user', text: "Se llama 'Mare Nostrum'" },
];

function ChatPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let messageIndex = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const showNextMessage = () => {
      if (messageIndex < allMessages.length) {
        const nextMessage = allMessages[messageIndex];
        const delay = nextMessage.sender === 'user' ? 1000 : 1500;
        
        const timeout = setTimeout(() => {
          setMessages(prev => [...prev, nextMessage]);
          messageIndex++;
          showNextMessage();
        }, delay);
        timeouts.push(timeout);
      }
    };

    const initialTimeout = setTimeout(showNextMessage, 500);
    timeouts.push(initialTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-[#101C30] border border-white/10 rounded-3xl shadow-2xl shadow-black/30 flex flex-col h-[34rem] max-h-[90vh]">
      <div className="p-4 border-b border-white/10 text-center">
        <h3 className="font-semibold text-gray-200">TecnoAi Assistant</h3>
        <p className="text-sm text-gray-400">Creando tu web perfecta</p>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-6 space-y-5 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00D4FF] flex-shrink-0"></div>
            )}
            <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-white/10 text-gray-200 rounded-br-lg' : 'bg-[#4169E1] text-white rounded-bl-lg'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            placeholder="Describe tu negocio aquí..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-24 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            disabled
            data-testid="input-chat-preview"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0066FF] hover:bg-blue-600 transition-colors text-white font-semibold py-2 px-4 rounded-lg" disabled>
            Enviar
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">Presiona Enter para enviar tu mensaje</p>
      </div>
    </div>
  );
}

export default function TecnoAiLanding() {
  const features = [
    'Diseño profesional automático',
    'Optimizado para móviles',
    'Listo para publicar',
  ];

  const stats = [
    { value: '5min', label: 'Tiempo promedio' },
    { value: '2.8k+', label: 'Webs creadas' },
    { value: '98%', label: 'Satisfacción' },
  ];

  return (
    <div className="bg-[#0A1628] text-white min-h-screen">
      <main>
        <section className="relative bg-gradient-to-r from-[#0066FF] to-[#00D4FF] overflow-hidden">
          <header className="absolute top-0 left-1/2 -translate-x-1/2 py-6 z-10">
            <div className="flex items-center gap-3">
              <LogoIcon className="h-10 w-10" />
              <span className="text-white text-2xl font-bold tracking-wide">TecnoAi</span>
            </div>
          </header>
          
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
                  <Link href="/chat-builder">
                    <button 
                      className="bg-white text-[#0A1628] font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                      data-testid="button-create-web"
                    >
                      Crear Mi Web Ahora
                    </button>
                  </Link>
                  <p className="mt-3 text-sm text-white/80">Completamente gratis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  En línea ahora
                </div>

                <h2 className="mt-6 text-3xl md:text-4xl font-bold text-white">
                  Cuéntanos sobre tu negocio
                </h2>
                <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto lg:mx-0">
                  Nuestro sistema creará automáticamente una web profesional adaptada a tu negocio. Solo necesitamos algunos detalles.
                </p>

                <ul className="mt-8 space-y-4 inline-block text-left">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3" data-testid={`feature-${index}`}>
                      <CheckIcon className="h-6 w-6 text-cyan-400" />
                      <span className="text-gray-200 text-lg" data-testid={`text-feature-${index}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-center lg:justify-start gap-8 sm:gap-12">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center" data-testid={`stat-${stat.value.toLowerCase().replace(/[^a-z0-9]/g, '')}`}>
                      <p className="text-3xl font-bold text-white" data-testid={`text-stat-value-${index}`}>{stat.value}</p>
                      <p className="text-sm text-gray-400 mt-1" data-testid={`text-stat-label-${index}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <ChatPreview />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
