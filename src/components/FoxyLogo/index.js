import React from 'react';

const FoxyLogo = ({ width = 200, height = 200, className = '' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="95" fill="url(#logoGradient)" />
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff6b6b', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ee5a6f', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#c44569', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="foxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff9a56', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="foxWhite" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f0f0f0', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="eyeShine">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Fox Head - Main Body */}
      <ellipse cx="100" cy="110" rx="45" ry="50" fill="url(#foxGradient)" />
      
      {/* Left Ear */}
      <path
        d="M 70 75 Q 60 45 75 55 Q 80 70 70 75 Z"
        fill="url(#foxGradient)"
      />
      <path
        d="M 72 72 Q 67 55 75 60 Q 78 68 72 72 Z"
        fill="#2c2c2c"
      />
      
      {/* Right Ear */}
      <path
        d="M 130 75 Q 140 45 125 55 Q 120 70 130 75 Z"
        fill="url(#foxGradient)"
      />
      <path
        d="M 128 72 Q 133 55 125 60 Q 122 68 128 72 Z"
        fill="#2c2c2c"
      />

      {/* Face White Patch */}
      <ellipse cx="100" cy="115" rx="32" ry="35" fill="url(#foxWhite)" />
      
      {/* Left Eye */}
      <ellipse cx="88" cy="105" rx="8" ry="12" fill="#2c2c2c" />
      <ellipse cx="88" cy="103" rx="3" ry="5" fill="url(#eyeShine)" />
      
      {/* Right Eye */}
      <ellipse cx="112" cy="105" rx="8" ry="12" fill="#2c2c2c" />
      <ellipse cx="112" cy="103" rx="3" ry="5" fill="url(#eyeShine)" />

      {/* Nose */}
      <ellipse cx="100" cy="120" rx="6" ry="5" fill="#2c2c2c" />
      
      {/* Mouth */}
      <path
        d="M 100 125 Q 92 130 88 128"
        stroke="#2c2c2c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 100 125 Q 108 130 112 128"
        stroke="#2c2c2c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Whiskers - Left */}
      <line x1="65" y1="112" x2="45" y2="108" stroke="#2c2c2c" strokeWidth="1.5" opacity="0.7" />
      <line x1="65" y1="118" x2="45" y2="118" stroke="#2c2c2c" strokeWidth="1.5" opacity="0.7" />
      <line x1="65" y1="124" x2="45" y2="128" stroke="#2c2c2c" strokeWidth="1.5" opacity="0.7" />
      
      {/* Whiskers - Right */}
      <line x1="135" y1="112" x2="155" y2="108" stroke="#2c2c2c" strokeWidth="1.5" opacity="0.7" />
      <line x1="135" y1="118" x2="155" y2="118" stroke="#2c2c2c" strokeWidth="1.5" opacity="0.7" />
      <line x1="135" y1="124" x2="155" y2="128" stroke="#2c2c2c" strokeWidth="1.5" opacity="0.7" />

      {/* Chef Hat - Bottom Band */}
      <ellipse cx="100" cy="72" rx="38" ry="8" fill="white" />
      
      {/* Chef Hat - Top Puff */}
      <ellipse cx="100" cy="55" rx="35" ry="25" fill="white" />
      <ellipse cx="85" cy="50" rx="20" ry="18" fill="white" />
      <ellipse cx="115" cy="50" rx="20" ry="18" fill="white" />
      <ellipse cx="100" cy="42" rx="25" ry="20" fill="white" />
      
      {/* Chef Hat - Shadow */}
      <ellipse cx="100" cy="72" rx="35" ry="6" fill="#e0e0e0" opacity="0.5" />

      {/* Fork and Knife Icons */}
      {/* Fork - Left */}
      <g transform="translate(40, 140)">
        <rect x="0" y="0" width="2" height="25" fill="#ffd93d" />
        <rect x="-3" y="-5" width="2" height="8" fill="#ffd93d" />
        <rect x="0" y="-5" width="2" height="8" fill="#ffd93d" />
        <rect x="3" y="-5" width="2" height="8" fill="#ffd93d" />
      </g>
      
      {/* Knife - Right */}
      <g transform="translate(158, 140)">
        <rect x="0" y="0" width="2" height="25" fill="#ffd93d" />
        <polygon points="0,-8 2,-8 3,-3 -1,-3" fill="#ffd93d" />
      </g>

      {/* Text - "FC" Monogram */}
      <text
        x="100"
        y="175"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        style={{ letterSpacing: '2px' }}
      >
        FC
      </text>

      {/* Sparkles */}
      <circle cx="25" cy="30" r="2" fill="#ffd93d" opacity="0.8" />
      <circle cx="175" cy="35" r="2" fill="#ffd93d" opacity="0.8" />
      <circle cx="30" cy="170" r="2" fill="#ffd93d" opacity="0.8" />
      <circle cx="170" cy="165" r="2" fill="#ffd93d" opacity="0.8" />
    </svg>
  );
};

export default FoxyLogo;