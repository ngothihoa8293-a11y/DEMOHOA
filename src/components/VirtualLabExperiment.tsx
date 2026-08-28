import React, { useState, useEffect, useRef } from 'react';
import { VirtualExperimentData } from '../types';
import { sound } from '../utils/audioSynth';
import {
  FlaskConical,
  TestTube,
  Flame,
  Droplets,
  Sparkles,
  RefreshCw,
  Eye,
  Info,
  Maximize2,
  Minimize2,
  Volume2
} from 'lucide-react';

interface VirtualLabExperimentProps {
  experimentData?: VirtualExperimentData;
  isReactionTriggered: boolean;
  equationDisplay?: string;
  autoPlay?: boolean;
}

export const VirtualLabExperiment: React.FC<VirtualLabExperimentProps> = ({
  experimentData,
  isReactionTriggered,
  equationDisplay,
}) => {
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [dropsCount, setDropsCount] = useState<number>(0);
  const [reactionProgress, setReactionProgress] = useState<number>(0); // 0 to 100%
  const [activeTab, setActiveTab] = useState<'visual' | 'phenomenon'>('visual');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fallback default experiment data if none provided
  const exp: VirtualExperimentData = experimentData || {
    containerType: 'flask',
    title: 'Thử Nghiệm Ảo Phản Ứng Oxi Hóa - Khử',
    reagentsDescription: 'Quan sát hiện tượng đổi màu dung dịch và sủi bọt khí',
    initialState: {
      liquidColor: 'rgba(59, 130, 246, 0.4)',
      liquidName: 'Dung dịch chất phản ứng',
      reagentName: 'Thuốc thử oxi hóa - khử',
      reagentColor: '#a855f7',
    },
    reactionState: {
      finalLiquidColor: 'rgba(16, 185, 129, 0.5)',
      liquidDescription: 'Dung dịch chuyển màu khi cân bằng electron hoàn tất',
      gasProduced: {
        name: 'Khí giải phóng',
        color: '#38bdf8',
        density: 'light',
        description: 'Sủi bọt khí'
      }
    },
    phenomenonSummary: 'Phản ứng xảy ra khi các chất trao đổi electron hoàn tất theo định luật bảo toàn.'
  };

  // Sync reaction progress when parent triggers success
  useEffect(() => {
    if (isReactionTriggered) {
      setReactionProgress(100);
      setDropsCount((prev) => Math.max(prev, 3));
      sound.playChemicalFizz();
    }
  }, [isReactionTriggered]);

  // Reset experiment
  const handleResetLab = () => {
    sound.playClick();
    setReactionProgress(0);
    setDropsCount(0);
    setIsPouring(false);
  };

  // Add reagent drop manually (interactive dropper / buret)
  const handleAddDrop = () => {
    if (isPouring) return;
    setIsPouring(true);
    sound.playLiquidDrop();

    setTimeout(() => {
      setDropsCount((prev) => {
        const next = prev + 1;
        // Progress increases with each drop
        setReactionProgress((curr) => Math.min(100, curr + 34));
        if (next >= 3) {
          sound.playChemicalFizz();
        }
        return next;
      });
      setIsPouring(false);
    }, 450);
  };

  // Canvas-based real-time bubble & vapor particle physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      color: string;
      isGasVapor?: boolean;
    }[] = [];

    const isGas = !!exp.reactionState.gasProduced;
    const gasColor = exp.reactionState.gasProduced?.color || '#ffffff';
    const isVapor = exp.reactionState.gasProduced?.name?.includes('NO2') || exp.reactionState.gasProduced?.name?.includes('Cl2');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeRatio = reactionProgress / 100;

      // Spawn bubbles/gas if reaction is active
      if (activeRatio > 0.1 && Math.random() < 0.6 * activeRatio) {
        const spawnX = canvas.width / 2 + (Math.random() * 70 - 35);
        const spawnY = canvas.height * 0.72 + (Math.random() * 20 - 10);

        particles.push({
          x: spawnX,
          y: spawnY,
          radius: Math.random() * (isVapor ? 7 : 3.5) + 1.5,
          vx: (Math.random() - 0.5) * (isVapor ? 0.8 : 0.4),
          vy: -(Math.random() * (isVapor ? 1.5 : 2.2) + 0.8),
          opacity: Math.min(0.9, 0.4 + activeRatio * 0.5),
          color: isVapor ? gasColor : 'rgba(255, 255, 255, 0.75)',
          isGasVapor: isVapor && Math.random() > 0.4
        });
      }

      // Update and draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.isGasVapor) {
          p.radius += 0.08; // Gas clouds expand
          p.opacity -= 0.008;
        } else {
          p.opacity -= 0.012;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isGasVapor) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = p.color;
        }

        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fill();
        ctx.restore();

        // Remove dead particles
        if (p.opacity <= 0 || p.y < 20) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reactionProgress, exp]);

  // Interpolate liquid color dynamically based on reactionProgress
  const currentFluidColor = reactionProgress >= 80
    ? exp.reactionState.finalLiquidColor
    : reactionProgress >= 40
    ? `color-mix(in srgb, ${exp.reactionState.finalLiquidColor} 50%, ${exp.initialState.liquidColor} 50%)`
    : exp.initialState.liquidColor;

  return (
    <div className={`w-full glass-panel border border-cyan-500/30 overflow-hidden transition-all duration-300 ${
      isExpanded ? 'p-5 ring-2 ring-[#00F2FF]/40' : 'p-4'
    }`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300">
            {exp.containerType === 'flask' ? (
              <FlaskConical className="w-5 h-5 animate-pulse text-[#00F2FF]" />
            ) : (
              <TestTube className="w-5 h-5 text-[#BC13FE]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                🧪 MÔ PHỎNG PHÒNG THÍ NGHIỆM ẢO (VIRTUAL LAB)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                reactionProgress >= 100
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : reactionProgress > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-white/10 text-white/60 border border-white/10'
              }`}>
                {reactionProgress >= 100 ? '✓ ĐÃ PHẢN ỨNG HOÀN TOÀN' : reactionProgress > 0 ? '⚗️ ĐANG XẢY RA...' : 'SẴN SÀNG'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
              {exp.title}
            </h4>
          </div>
        </div>

        {/* Tab Controls & Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'visual'
                ? 'bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Thị Giác 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('phenomenon')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === 'phenomenon'
                ? 'bg-[#BC13FE]/20 text-[#BC13FE] border border-[#BC13FE]/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Hiện Tượng THPT</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((p) => !p)}
            title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeTab === 'visual' ? (
        <div className="mt-3 flex flex-col md:flex-row gap-4 items-center">
          {/* Virtual Glassware Viewport (Center) */}
          <div className="relative w-full md:w-3/5 h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-950 via-[#0B0F19] to-slate-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Lab Bench Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Glowing Backdrop Light */}
            <div
              className="absolute w-44 h-44 rounded-full blur-3xl opacity-30 transition-colors duration-700 pointer-events-none"
              style={{
                backgroundColor: reactionProgress >= 80 ? (exp.reactionState.gasProduced?.color || '#10b981') : exp.initialState.liquidColor
              }}
            />

            {/* Particle Canvas (Gas Bubbles & NO2 Brown / Cl2 Yellow Fumes) */}
            <canvas
              ref={canvasRef}
              width={340}
              height={280}
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />

            {/* Dropper / Buret Reagent Dispenser */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
              {/* Dropper Body */}
              <div className="w-6 h-12 rounded-t-lg bg-white/20 border border-white/40 backdrop-blur-md flex flex-col items-center justify-end p-0.5 shadow-md">
                <div
                  className="w-full rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(15, 100 - dropsCount * 25)}%`,
                    backgroundColor: exp.initialState.reagentColor || '#a855f7'
                  }}
                />
              </div>
              {/* Dropper Tip */}
              <div className="w-1.5 h-3 bg-white/40 border-x border-white/50" />

              {/* Falling Drop Animation */}
              {isPouring && (
                <div
                  className="w-2.5 h-3.5 rounded-full animate-[bounce_0.45s_ease-in_infinite] shadow-lg"
                  style={{
                    backgroundColor: exp.initialState.reagentColor || '#a855f7'
                  }}
                />
              )}
            </div>

            {/* Glassware Container Container (Flask vs Test Tube) */}
            <div className="relative z-10 flex flex-col items-center justify-end mt-6">
              {exp.containerType === 'flask' ? (
                /* 3D Erlenmeyer Flask SVG */
                <svg width="180" height="190" viewBox="0 0 180 190" className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <defs>
                    {/* Glass Reflection Gradient */}
                    <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                      <stop offset="15%" stopColor="rgba(255,255,255,0.15)" />
                      <stop offset="85%" stopColor="rgba(255,255,255,0.05)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
                    </linearGradient>

                    {/* Dynamic Liquid Gradient */}
                    <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={currentFluidColor} stopOpacity="0.85" />
                      <stop offset="100%" stopColor={currentFluidColor} stopOpacity="0.95" />
                    </linearGradient>

                    {/* Clip path for fluid inside Erlenmeyer Flask */}
                    <clipPath id="flaskClip">
                      <polygon points="76,40 104,40 162,170 18,170" />
                    </clipPath>
                  </defs>

                  {/* Liquid Inside Flask */}
                  <g clipPath="url(#flaskClip)">
                    {/* Base Fluid with Meniscus Wave */}
                    <rect
                      x="0"
                      y={170 - (50 + reactionProgress * 0.25)}
                      width="180"
                      height="120"
                      fill="url(#fluidGrad)"
                      className="transition-all duration-700"
                    />

                    {/* Solid Metal / Crystal Deposition if present */}
                    {exp.initialState.solidMaterial && (
                      <g className="transition-all duration-500">
                        {exp.initialState.solidMaterial.shape === 'strip' ? (
                          /* Metal Strip (e.g. Copper Cu or Zinc Zn) */
                          <rect
                            x="75"
                            y="110"
                            width="28"
                            height="55"
                            rx="3"
                            fill={reactionProgress >= 100 && exp.reactionState.solidProduced ? exp.reactionState.solidProduced.color : exp.initialState.solidMaterial.color}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1.5"
                            transform="rotate(-8 90 140)"
                            className="transition-colors duration-700 shadow-md"
                          />
                        ) : exp.initialState.solidMaterial.shape === 'nail' ? (
                          /* Iron nail */
                          <path
                            d="M85 105 L95 105 L93 162 L87 162 Z"
                            fill={exp.initialState.solidMaterial.color}
                            stroke="rgba(255,255,255,0.5)"
                          />
                        ) : (
                          /* Granules / Powder */
                          <ellipse
                            cx="90"
                            cy="165"
                            rx="35"
                            ry="6"
                            fill={exp.initialState.solidMaterial.color}
                          />
                        )}
                      </g>
                    )}

                    {/* Fluid Surface Meniscus highlight */}
                    <ellipse
                      cx="90"
                      cy={170 - (50 + reactionProgress * 0.25)}
                      rx="48"
                      ry="5"
                      fill="rgba(255,255,255,0.3)"
                    />
                  </g>

                  {/* Erlenmeyer Glass Outlines & Volume Graduations */}
                  <polygon
                    points="75,30 105,30 105,45 165,175 15,175 75,45"
                    fill="url(#glassReflect)"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Flask Lip */}
                  <ellipse cx="90" cy="30" rx="16" ry="3.5" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
                  {/* Flask Bottom Rim */}
                  <ellipse cx="90" cy="175" rx="75" ry="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

                  {/* Volume markings (50ml, 100ml, 150ml) */}
                  <line x1="120" y1="140" x2="135" y2="140" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                  <text x="138" y="142" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace">50ml</text>
                  <line x1="108" y1="110" x2="123" y2="110" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                  <text x="126" y="112" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace">100ml</text>
                  <line x1="96" y1="80" x2="110" y2="80" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                  <text x="113" y="82" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace">150ml</text>
                </svg>
              ) : (
                /* 3D Test Tube SVG */
                <svg width="120" height="190" viewBox="0 0 120 190" className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <defs>
                    <clipPath id="tubeClip">
                      <rect x="42" y="30" width="36" height="120" rx="18" />
                    </clipPath>
                  </defs>

                  {/* Fluid in Test Tube */}
                  <g clipPath="url(#tubeClip)">
                    <rect
                      x="40"
                      y={150 - (45 + reactionProgress * 0.35)}
                      width="40"
                      height="120"
                      fill={currentFluidColor}
                      className="transition-all duration-700"
                    />

                    {/* Solid in Test Tube */}
                    {exp.initialState.solidMaterial && (
                      <rect
                        x="55"
                        y="105"
                        width="10"
                        height="40"
                        rx="2"
                        fill={exp.initialState.solidMaterial.color}
                        stroke="rgba(255,255,255,0.3)"
                      />
                    )}
                  </g>

                  {/* Test Tube Glass Wall */}
                  <rect
                    x="42"
                    y="25"
                    width="36"
                    height="135"
                    rx="18"
                    fill="url(#glassReflect)"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2.5"
                  />
                  {/* Tube Lip */}
                  <ellipse cx="60" cy="25" rx="20" ry="4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
                </svg>
              )}
            </div>

            {/* Live Indicator Badges (Gas / Solution state) */}
            <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-1 pointer-events-none text-[11px] font-mono z-20">
              <div className="px-2.5 py-1 rounded-md bg-black/75 border border-cyan-500/30 text-cyan-300 backdrop-blur-md shadow-md max-w-full text-xs">
                <span className="text-white/60 mr-1">Trạng thái:</span>
                {reactionProgress >= 80 ? exp.reactionState.liquidDescription : exp.initialState.liquidName}
              </div>

              {exp.reactionState.gasProduced && reactionProgress > 20 && (
                <div
                  className="px-2 py-1 rounded-md bg-black/80 border border-amber-500/50 text-amber-300 backdrop-blur-md flex items-center gap-1 animate-pulse shadow-md text-xs"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{exp.reactionState.gasProduced.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Reagent Controls & Action Deck (Right) */}
          <div className="w-full md:w-2/5 flex flex-col gap-2.5">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>Bình Nhỏ Thuốc Thử (Reagent Pipette)</span>
              </span>

              <p className="text-xs text-white/80 leading-relaxed">
                {exp.initialState.reagentName || 'Nhỏ từng giọt thuốc thử hoặc hoàn tất thăng bằng hệ số để kích hoạt phản ứng đổi màu.'}
              </p>

              {/* Manual Drop Button */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleAddDrop}
                  disabled={isPouring || reactionProgress >= 100}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00F2FF]/20 to-[#BC13FE]/20 hover:from-[#00F2FF]/30 hover:to-[#BC13FE]/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#00F2FF]/40 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Droplets className={`w-4 h-4 text-cyan-300 ${isPouring ? 'animate-bounce' : ''}`} />
                  <span>{reactionProgress >= 100 ? 'Đã phản ứng hết' : 'Nhỏ 1 Giọt Thuốc Thử (+33%)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLab}
                  title="Làm mới bình thí nghiệm"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reaction Status Progress */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-medium">Tiến Trình Phản Ứng Ảo:</span>
                <span className="font-mono font-bold text-[#00F2FF]">{reactionProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                  style={{ width: `${reactionProgress}%` }}
                />
              </div>

              <div className="text-[11px] text-white/60 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Khi bạn <strong>Khóa cân bằng đúng</strong>, toàn bộ phản ứng ảo sẽ tự động kích hoạt mãnh liệt!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Phenomenon Notes (Pedagogical Observation) */
        <div className="mt-3 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2.5 text-xs sm:text-sm text-white/90">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mô Tả Hiện Tượng Thực Tế Trong Đề Thi THPT & Sách Giáo Khoa 10:</span>
          </div>

          <p className="leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10 text-white/90">
            {exp.phenomenonSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200">
              <strong className="text-purple-300 block mb-0.5">⚗️ Trạng thái ban đầu:</strong>
              {exp.initialState.liquidName}
              {exp.initialState.solidMaterial && ` • ${exp.initialState.solidMaterial.name}`}
            </div>

            <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
              <strong className="text-cyan-300 block mb-0.5">✨ Sau khi cân bằng e⁻:</strong>
              {exp.reactionState.liquidDescription}
              {exp.reactionState.gasProduced && ` • ${exp.reactionState.gasProduced.description}`}
            </div>
          </div>

          {exp.safetyTip && (
            <div className="text-[11px] text-rose-300/90 italic flex items-center gap-1.5 pt-1 border-t border-white/10">
              <span>⚠️ Lưu ý an toàn phòng thí nghiệm:</span>
              <span>{exp.safetyTip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
