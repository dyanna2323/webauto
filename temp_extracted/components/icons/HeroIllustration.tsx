
import React from 'react';

export const HeroIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 450 350" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Globe */}
    <circle cx="225" cy="175" r="120" fill="rgba(255,255,255,0.1)" />
    <path d="M145 130 C 185 100, 265 100, 305 130" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
    <path d="M145 220 C 185 250, 265 250, 305 220" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
    <path d="M185 95 C 175 175, 275 175, 265 95" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
    <path d="M185 255 C 175 175, 275 175, 265 255" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />

    {/* Website Preview Card */}
    <g transform="translate(200, 180) rotate(-15)">
      <rect x="0" y="0" width="220" height="150" rx="15" fill="url(#grad1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.5)" />
      <circle cx="35" cy="20" r="5" fill="rgba(255,255,255,0.5)" />
      <circle cx="50" cy="20" r="5" fill="rgba(255,255,255,0.5)" />
      <rect x="20" y="40" width="180" height="10" rx="5" fill="rgba(255,255,255,0.2)" />
      <rect x="20" y="60" width="120" height="10" rx="5" fill="rgba(255,255,255,0.3)" />
      <rect x="20" y="85" width="180" height="45" rx="5" fill="rgba(0,212,255,0.3)" />
    </g>

    {/* Lock Icon */}
    <g transform="translate(80, 50)">
      <rect x="0" y="50" width="120" height="90" rx="20" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
      <path d="M30 50 V 30 C 30 13.43, 43.43 0, 60 0 C 76.57 0, 90 13.43, 90 30 V 50" stroke="rgba(255,255,255,0.8)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="95" r="10" fill="rgba(255,255,255,0.8)" />
      <rect x="57" y="95" width="6" height="20" fill="rgba(255,255,255,0.8)" />
    </g>
  </svg>
);
