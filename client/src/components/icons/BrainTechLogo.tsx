const BrainTechLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circuit brain design */}
      <g className="animate-pulse">
        {/* Left brain hemisphere */}
        <path
          d="M30 25C20 25 15 32 15 40C15 45 18 48 20 50C18 52 16 55 16 60C16 68 22 75 32 75C35 75 38 74 40 72L40 50L35 45"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="opacity-80"
        />
        
        {/* Right brain hemisphere (tech side) */}
        <path
          d="M70 25C80 25 85 32 85 40C85 45 82 48 80 50C82 52 84 55 84 60C84 68 78 75 68 75C65 75 62 74 60 72L60 50L65 45"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="opacity-80"
        />
        
        {/* Center connection */}
        <path
          d="M40 50 Q50 40 60 50"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Circuit nodes - left side */}
        <circle cx="25" cy="35" r="2" fill="currentColor" className="animate-ping" />
        <circle cx="30" cy="45" r="2" fill="currentColor" className="animate-ping animation-delay-200" />
        <circle cx="25" cy="55" r="2" fill="currentColor" className="animate-ping animation-delay-400" />
        
        {/* Circuit nodes - right side (tech) */}
        <rect x="73" y="33" width="4" height="4" fill="currentColor" className="animate-pulse" />
        <rect x="68" y="43" width="4" height="4" fill="currentColor" className="animate-pulse animation-delay-200" />
        <rect x="73" y="53" width="4" height="4" fill="currentColor" className="animate-pulse animation-delay-400" />
        
        {/* Connection lines */}
        <path
          d="M25 35 L30 45 M30 45 L25 55"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M75 35 L70 45 M70 45 L75 55"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
      </g>
      
      {/* Tech circuit pattern */}
      <g opacity="0.3">
        <path
          d="M20 65 L25 65 M75 65 L80 65"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <path
          d="M50 20 L50 25 M50 75 L50 80"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </g>
    </svg>
  );
};

export default BrainTechLogo;