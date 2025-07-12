interface WoodenCrossProps {
  className?: string;
  size?: number;
}

export default function WoodenCross({ className = "", size = 120 }: WoodenCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 160"
      className={className}
    >
      <defs>
        {/* Wood grain pattern */}
        <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#8B4513"/>
          <path d="M0,2 Q4,1 8,2 M0,6 Q4,5 8,6" stroke="#654321" strokeWidth="0.5" fill="none"/>
        </pattern>
        
        {/* Wood texture for cross */}
        <linearGradient id="woodTexture" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#CD853F", stopOpacity:1}} />
          <stop offset="25%" style={{stopColor:"#8B4513", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#A0522D", stopOpacity:1}} />
          <stop offset="75%" style={{stopColor:"#8B4513", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#654321", stopOpacity:1}} />
        </linearGradient>
        
        {/* Purple cloth gradient */}
        <linearGradient id="purpleCloth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#9370DB", stopOpacity:0.9}} />
          <stop offset="50%" style={{stopColor:"#8A2BE2", stopOpacity:0.8}} />
          <stop offset="100%" style={{stopColor:"#663399", stopOpacity:0.9}} />
        </linearGradient>
      </defs>
      
      {/* Wooden cross structure */}
      <g>
        {/* Vertical beam */}
        <rect
          x="52"
          y="8"
          width="16"
          height="144"
          rx="2"
          fill="url(#woodTexture)"
          stroke="#654321"
          strokeWidth="1"
        />
        
        {/* Horizontal beam */}
        <rect
          x="20"
          y="48"
          width="80"
          height="16"
          rx="2"
          fill="url(#woodTexture)"
          stroke="#654321"
          strokeWidth="1"
        />
        
        {/* Wood grain details */}
        <rect
          x="52"
          y="8"
          width="16"
          height="144"
          rx="2"
          fill="url(#woodGrain)"
          opacity="0.3"
        />
        <rect
          x="20"
          y="48"
          width="80"
          height="16"
          rx="2"
          fill="url(#woodGrain)"
          opacity="0.3"
        />
      </g>
      
      {/* Purple cloth draped like a scarf */}
      <g>
        {/* Left drape */}
        <path
          d="M 30 45 Q 25 50 20 58 Q 18 65 22 72 Q 28 78 35 75 Q 40 70 42 62 Q 38 55 35 50 Z"
          fill="url(#purpleCloth)"
          stroke="#663399"
          strokeWidth="0.5"
        />
        
        {/* Right drape */}
        <path
          d="M 90 45 Q 95 50 100 58 Q 102 65 98 72 Q 92 78 85 75 Q 80 70 78 62 Q 82 55 85 50 Z"
          fill="url(#purpleCloth)"
          stroke="#663399"
          strokeWidth="0.5"
        />
        
        {/* Center drape across horizontal beam */}
        <path
          d="M 25 48 Q 35 42 50 45 Q 70 47 95 45 Q 98 50 95 55 Q 70 58 50 55 Q 35 52 25 55 Z"
          fill="url(#purpleCloth)"
          stroke="#663399"
          strokeWidth="0.5"
        />
        
        {/* Flowing cloth details */}
        <path
          d="M 30 52 Q 35 48 40 52 M 80 52 Q 85 48 90 52"
          stroke="#9370DB"
          strokeWidth="1"
          fill="none"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}