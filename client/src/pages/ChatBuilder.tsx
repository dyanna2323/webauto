import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Send, Sparkles, Loader2, Download, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { GenerationRequest, TemplateType, User } from '@shared/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  options?: { label: string; value: string }[];
}

interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
}

interface TemplatesResponse {
  templates: TemplateInfo[];
}

type ConversationStep = 'greeting' | 'business' | 'template' | 'generating' | 'complete';

export default function ChatBuilder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [businessDescription, setBusinessDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('services');
  const [generatedWebsite, setGeneratedWebsite] = useState<GenerationRequest | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: templatesData } = useQuery<TemplatesResponse>({
    queryKey: ['/api/templates'],
  });

  const { data: userData, isLoading: isLoadingUser, error: userError } = useQuery<{ user: User }>({
    queryKey: ['/api/me'],
    retry: 1,
    retryDelay: 1000,
    staleTime: 0, // Always fetch fresh to prevent stale privileges
  });

  const isPremiumUser = userData?.user?.plan === 'premium' || userData?.user?.plan === 'pro';
  const is401Error = userError?.message?.startsWith('401');
  const isAuthenticated = !!userData?.user;

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/generate', {
        businessDescription,
        templateType: selectedTemplate,
      });
      return await res.json() as GenerationRequest;
    },
    onSuccess: (data) => {
      setGeneratedWebsite(data);
      addMessage('assistant', '¡Tu web está lista! Puedes descargarla ahora o personalizarla más desde el dashboard.');
      setCurrentStep('complete');
    },
    onError: (error: Error) => {
      addMessage('assistant', `Ups, hubo un problema: ${error.message}. ¿Quieres intentarlo de nuevo?`);
      setCurrentStep('business');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage(
        'assistant',
        '¡Hola! Soy tu asistente de TecnoAi. Voy a ayudarte a crear una web profesional en minutos. ¿Empezamos?',
        [
          { label: '¡Sí, empezar!', value: 'start' },
          { label: 'Tengo una pregunta', value: 'question' },
        ]
      );
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const addMessage = (type: 'assistant' | 'user', content: string, options?: { label: string; value: string }[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    if (currentStep === 'greeting') {
      if (option === 'start') {
        addMessage('user', '¡Sí, empezar!');
        setTimeout(() => {
          addMessage(
            'assistant',
            '¡Genial! Cuéntame sobre tu negocio. ¿Qué haces y qué necesitas en tu web?'
          );
          setCurrentStep('business');
        }, 800);
      } else {
        addMessage('user', 'Tengo una pregunta');
        setTimeout(() => {
          addMessage(
            'assistant',
            'Claro, pregúntame lo que quieras. Estoy aquí para ayudarte a crear la web perfecta para tu negocio.'
          );
        }, 800);
      }
    } else if (currentStep === 'template') {
      const template = templatesData?.templates.find(t => t.id === option);
      if (template) {
        setSelectedTemplate(option as TemplateType);
        addMessage('user', template.name);
        setTimeout(() => {
          addMessage(
            'assistant',
            `Perfecto, voy a crear una web de ${template.name.toLowerCase()} para ti. Dame un momento mientras genero tu sitio profesional...`
          );
          setCurrentStep('generating');
          generateMutation.mutate();
        }, 800);
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage('user', userMessage);
    setInputValue('');

    if (currentStep === 'business') {
      setBusinessDescription(userMessage);
      setTimeout(() => {
        const templateOptions = templatesData?.templates.map(t => ({
          label: t.name,
          value: t.id,
        })) || [
          { label: 'Restaurante / Bar', value: 'restaurant' },
          { label: 'Consultoría / Servicios', value: 'consultancy' },
          { label: 'Tienda / E-commerce', value: 'shop' },
          { label: 'Servicios Profesionales', value: 'services' },
        ];
        
        addMessage(
          'assistant',
          '¡Excelente! Ahora, ¿qué tipo de web necesitas?',
          templateOptions
        );
        setCurrentStep('template');
      }, 800);
    } else if (currentStep === 'complete') {
      addMessage('assistant', '¿Necesitas algo más? Puedes ir al dashboard para ver y gestionar todas tus webs.');
    }
  };

  const handleDownload = async () => {
    if (!generatedWebsite) return;

    try {
      const response = await fetch(`/api/download/${generatedWebsite.id}`);
      if (!response.ok) throw new Error('Error al descargar');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mi-web-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: '¡Descargado!',
        description: 'Tu web está lista para subir a tu hosting.',
      });
    } catch (error) {
      toast({
        title: 'Error al descargar',
        description: 'Hubo un problema. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-700 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">TecnoAi</h1>
            </div>
          </div>
          <p className="text-sm text-white/90 hidden sm:block">Asistente de webs perfecto</p>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-6 py-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white/95 backdrop-blur-sm text-gray-800 shadow-lg'
                    }`}
                  >
                    <p className="text-base leading-relaxed">{message.content}</p>
                  </div>

                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option) => (
                        <Button
                          key={option.value}
                          onClick={() => handleOptionClick(option.value)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                          data-testid={`button-option-${option.value}`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.type === 'assistant' && currentStep === 'complete' && generatedWebsite && index === messages.length - 1 && (
                    <div className="mt-3 space-y-2">
                      {/* Error alert for non-401 errors (shown alongside buttons) */}
                      {userError && !is401Error && (
                        <Alert className="bg-red-50/95 border-red-500/50">
                          <AlertDescription className="text-sm text-gray-700">
                            No pudimos verificar tu plan. Por favor,{' '}
                            <button 
                              onClick={() => window.location.reload()} 
                              className="underline font-medium"
                            >
                              recarga la página
                            </button>
                            {' '}para verificar tu acceso de descarga.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {/* Download buttons */}
                      {isLoadingUser ? (
                        <div className="flex items-center gap-2 text-white/80">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Verificando tu plan...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {is401Error ? (
                              <Button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                                data-testid="button-login-to-download"
                              >
                                Iniciar Sesión para Descargar
                              </Button>
                            ) : isPremiumUser ? (
                              <Button
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                                data-testid="button-download-chat"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar ZIP
                              </Button>
                            ) : userData?.user ? (
                              <Button
                                variant="outline"
                                className="bg-white/50 border-yellow-500/50 text-gray-800 cursor-not-allowed"
                                disabled
                                data-testid="button-download-locked"
                              >
                                <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                                Descargar ZIP (Premium)
                              </Button>
                            ) : (
                              <Button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                                data-testid="button-login-unknown"
                              >
                                Iniciar Sesión
                              </Button>
                            )}
                            <Button
                              onClick={() => navigate('/dashboard')}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                              data-testid="button-dashboard"
                            >
                              Ver Dashboard
                            </Button>
                          </div>
                          {userData?.user && !isPremiumUser && !userError && (
                            <Alert className="bg-yellow-50/95 border-yellow-500/50">
                              <Crown className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-sm text-gray-700">
                                Con el plan gratuito puedes ver tu web online en tu subdominio .replit.app. 
                                Actualiza a Premium para descargar el código y usar tu propio dominio.
                              </AlertDescription>
                            </Alert>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {generateMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <p className="text-gray-800">Generando tu web profesional...</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {(currentStep === 'business' || currentStep === 'complete') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  currentStep === 'business'
                    ? 'Describe tu negocio aquí...'
                    : 'Escribe tu mensaje...'
                }
                className="flex-1 bg-gray-50 border-0 rounded-2xl px-6 py-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-chat"
                autoFocus
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl px-8 min-h-14"
                data-testid="button-send"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
