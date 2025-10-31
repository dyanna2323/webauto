
import React from 'react';
import Hero from './components/Hero';
import MainContent from './components/MainContent';

const App: React.FC = () => {
  return (
    <div className="bg-[#0A1628] text-white min-h-screen">
      <main>
        <Hero />
        <MainContent />
      </main>
    </div>
  );
};

export default App;
