
import React from 'react';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';

const MainContent: React.FC = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <LeftColumn />
          <RightColumn />
        </div>
      </div>
    </section>
  );
};

export default MainContent;
