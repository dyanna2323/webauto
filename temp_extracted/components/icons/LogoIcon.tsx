
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4"/>
    <path d="M30 50C30 38.9543 38.9543 30 50 30" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 70C61.0457 70 70 61.0457 70 50" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="10" fill="white"/>
  </svg>
);
