
import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

const LeftColumn: React.FC = () => {
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
          <li key={index} className="flex items-center gap-3">
            <CheckIcon className="h-6 w-6 text-cyan-400" />
            <span className="text-gray-200 text-lg">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 pt-8 border-t border-white/10 flex justify-center lg:justify-start gap-8 sm:gap-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftColumn;
