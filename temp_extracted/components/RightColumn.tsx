
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';

const allMessages: Message[] = [
  { id: 1, sender: 'assistant', text: '¡Hola! 👋 Vamos a crear tu web perfecta. ¿Qué tipo de negocio tienes?' },
  { id: 2, sender: 'user', text: 'Tengo un restaurante mediterráneo.' },
  { id: 3, sender: 'assistant', text: '¡Perfecto! Un restaurante mediterráneo suena genial 😊 ¿Cuál es el nombre de tu negocio?' },
  { id: 4, sender: 'user', text: "Se llama 'Mare Nostrum'" },
];

const RightColumn: React.FC = () => {
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
        <h3 className="font-semibold text-gray-200">TechNexo Assistant</h3>
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
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0066FF] hover:bg-blue-600 transition-colors text-white font-semibold py-2 px-4 rounded-lg" disabled>
            Enviar
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">Presiona Enter para enviar tu mensaje</p>
      </div>
    </div>
  );
};

export default RightColumn;
