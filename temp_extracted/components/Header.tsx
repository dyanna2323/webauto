
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-1/2 -translate-x-1/2 py-6">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-10 w-10" />
        <span className="text-white text-2xl font-bold tracking-wide">TechNexo.Ai</span>
      </div>
    </header>
  );
};

export default Header;
