import React from 'react';

interface AIAssistantProps {
  mood?: 'normal' | 'happy' | 'thinking' | 'alert' | 'cheer';
  speech: string;
  subHint?: string;
  act: 1 | 2 | 3;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  mood = 'normal',
  speech,
  subHint,
  act,
}) => {
  // Theme color accents based on Act
  const themeColors = {
    1: { primary: '#00F2FF', glow: 'rgba(0, 242, 255, 0.4)', text: 'text-[#00F2FF]', border: 'border-[#00F2FF]/40' },
    2: { primary: '#BC13FE', glow: 'rgba(188, 19, 254, 0.4)', text: 'text-[#BC13FE]', border: 'border-[#BC13FE]/40' },
    3: { primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)', text: 'text-pink-400', border: 'border-pink-500/40' },
  }[act];

  return (
    <div id="ai-robot-guide" className="flex items-start gap-3 w-full glass-panel p-3.5 sm:p-4 relative overflow-hidden transition-all duration-300">
      {/* Background ambient beam */}
      <div
        className="absolute -left-10 -top-10 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ backgroundColor: themeColors.primary }}
      />

      {/* 2.5D SVG Robot Avatar */}
      <div className="shrink-0 relative group">
        <svg
          className="w-12 h-12 sm:w-14 sm:h-14 filter drop-shadow-md"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antennas */}
          <line x1="50" y1="20" x2="50" y2="8" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="7" r="4" fill={themeColors.primary} className="animate-pulse" />
          <line x1="32" y1="26" x2="22" y2="14" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="12" r="3" fill="#38bdf8" />
          <line x1="68" y1="26" x2="78" y2="14" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="80" cy="12" r="3" fill="#38bdf8" />

          {/* Robot Head Body */}
          <rect
            x="20"
            y="20"
            width="60"
            height="52"
            rx="16"
            fill="url(#robotGrad)"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Ear Bolts */}
          <rect x="14" y="38" width="6" height="16" rx="2" fill="#334155" />
          <rect x="80" y="38" width="6" height="16" rx="2" fill="#334155" />

          {/* Visor Screen */}
          <rect
            x="26"
            y="28"
            width="48"
            height="34"
            rx="8"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Expressions / Eyes based on mood */}
          {mood === 'happy' || mood === 'cheer' ? (
            <>
              {/* Happy Arc Eyes ^^ */}
              <path d="M33 46 Q39 36 45 46" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M55 46 Q61 36 67 46" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : mood === 'alert' ? (
            <>
              {/* Alert Sharp Eyes */}
              <line x1="33" y1="42" x2="45" y2="46" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="67" y1="42" x2="55" y2="46" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Thinking dots */}
              <circle cx="39" cy="45" r="4" fill="#fbbf24" />
              <circle cx="61" cy="42" r="4" fill="#fbbf24" />
            </>
          ) : (
            <>
              {/* Standard Glowing Cyan Eyes */}
              <circle cx="38" cy="45" r="4.5" fill="#38bdf8" />
              <circle cx="62" cy="45" r="4.5" fill="#38bdf8" />
              <circle cx="40" cy="43" r="1.5" fill="#ffffff" />
              <circle cx="64" cy="43" r="1.5" fill="#ffffff" />
            </>
          )}

          {/* Visor Scanline overlay */}
          <line x1="28" y1="36" x2="72" y2="36" stroke={themeColors.primary} strokeWidth="1" opacity="0.35" />

          {/* Robot Neck & Chest */}
          <rect x="42" y="72" width="16" height="8" rx="2" fill="#334155" />
          <path d="M30 80 L70 80 L76 96 L24 96 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <circle cx="50" cy="88" r="3.5" fill={themeColors.primary} className="animate-pulse" />

          {/* Gradients */}
          <defs>
            <linearGradient id="robotGrad" x1="20" y1="20" x2="80" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e293b" />
              <stop offset="0.5" stopColor="#334155" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Status Indicator Dot */}
        <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: themeColors.primary }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: themeColors.primary }} />
        </div>
      </div>

      {/* AI Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            AI Hướng Dẫn: <strong className={themeColors.text}>ORBIT-10</strong>
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
            {act === 1 ? '● HỒI 1: BẢN CHẤT e⁻' : act === 2 ? '● HỒI 2: CÁN CÂN CƠ BẢN' : '● HỒI 3: QUÁ TẢI REDOX'}
          </span>
        </div>
        <p className="text-slate-100 text-sm sm:text-base font-medium leading-snug">
          {speech}
        </p>
        {subHint && (
          <p className="mt-1 text-xs sm:text-sm text-slate-400 font-normal italic flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            {subHint}
          </p>
        )}
      </div>
    </div>
  );
};
