import React from 'react';

interface ElectronBalanceScaleProps {
  electronsLost: number;
  electronsGained: number;
  isBalanced: boolean;
  reducerDesc?: string;
  oxidizerDesc?: string;
}

export const ElectronBalanceScale: React.FC<ElectronBalanceScaleProps> = ({
  electronsLost,
  electronsGained,
  isBalanced,
  reducerDesc = 'Tổng e⁻ Nhường (Chất Khử)',
  oxidizerDesc = 'Tổng e⁻ Nhận (Chất Oxi Hóa)',
}) => {
  // Compute tilt angle: positive if left is heavier (more lost e-), negative if right is heavier
  const diff = electronsLost - electronsGained;
  // Maximum tilt limit ±12 degrees
  const tiltAngle = Math.max(-12, Math.min(12, diff * 2.5));

  // Compute pan vertical offsets
  const leftPanOffsetY = -tiltAngle * 2.2;
  const rightPanOffsetY = tiltAngle * 2.2;

  return (
    <div id="electron-balance-scale" className="w-full glass-panel p-5 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Radial Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#BC13FE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#00F2FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Equilibrium Status */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 relative z-10">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 px-3 py-1 rounded-full border border-[#00F2FF]/30">
          <div className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-emerald-400 animate-ping' : 'bg-[#00F2FF] animate-pulse'}`} />
          <span className="text-[10px] font-bold text-[#00F2FF] tracking-wider uppercase">
            CÁN CÂN ELECTRON BẢO TOÀN
          </span>
        </div>

        <div>
          {isBalanced ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
              ✓ THĂNG BẰNG TUYỆT ĐỐI ({electronsLost} e⁻ = {electronsGained} e⁻)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 text-white/70 border border-white/10">
              {diff > 0 ? `Lệch: Nhường +${diff}e⁻` : diff < 0 ? `Lệch: Nhận +${Math.abs(diff)}e⁻` : 'Chưa kích hoạt'}
            </span>
          )}
        </div>
      </div>

      {/* Geometric Balance Scale Assembly */}
      <div className="w-full max-w-2xl px-4 sm:px-8 my-2">
        <div className="relative h-44 sm:h-48 flex items-end justify-center">
          {/* Baseline Base */}
          <div className="absolute bottom-0 w-full h-[2px] bg-white/20" />
          
          {/* Fulcrum Triangle Pivot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div 
              className={`w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] transition-colors duration-300 ${
                isBalanced ? 'border-b-emerald-400 filter drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'border-b-[#00F2FF]/60 filter drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]'
              }`} 
            />
            <div className="w-10 h-2 bg-white/30 rounded-t-sm" />
          </div>

          {/* Laser Equilibrium Target Line */}
          {isBalanced && (
            <div className="absolute bottom-28 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-pulse" />
          )}

          {/* Rotating Beam Assembly with Pans */}
          <div
            className="w-full flex justify-between items-end pb-3 transition-transform duration-500 ease-out"
            style={{
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: '50% 100%',
            }}
          >
            {/* Left Pan (Chất Khử - Nhường e⁻) */}
            <div
              className="flex flex-col items-center gap-1.5 transition-transform duration-500"
              style={{
                transform: `translateY(${leftPanOffsetY}px)`,
              }}
            >
              <div className="w-28 sm:w-36 h-20 sm:h-22 glass-panel flex flex-col items-center justify-center border-t-4 border-t-[#BC13FE] shadow-[0_0_20px_rgba(188,19,254,0.25)] relative overflow-hidden">
                <span className="text-[9px] font-bold text-[#BC13FE] uppercase tracking-wider">
                  E⁻ NHƯỜNG
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-white mt-0.5">
                  {electronsLost}
                </span>
                <span className="text-[8px] text-white/50 truncate max-w-[90%] font-mono">
                  {reducerDesc}
                </span>
              </div>
              <div className="w-[2px] h-10 bg-gradient-to-b from-[#BC13FE] to-white/20" />
            </div>

            {/* Center Beam Fulcrum Dot Indicator */}
            <div className="w-4 h-4 rounded-full bg-white/20 border-2 border-white/50 -mb-2 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-[#00F2FF]'}`} />
            </div>

            {/* Right Pan (Chất Oxi Hóa - Nhận e⁻) */}
            <div
              className="flex flex-col items-center gap-1.5 transition-transform duration-500"
              style={{
                transform: `translateY(${rightPanOffsetY}px)`,
              }}
            >
              <div className="w-28 sm:w-36 h-20 sm:h-22 glass-panel flex flex-col items-center justify-center border-t-4 border-t-[#00F2FF] shadow-[0_0_20px_rgba(0,242,255,0.25)] relative overflow-hidden">
                <span className="text-[9px] font-bold text-[#00F2FF] uppercase tracking-wider">
                  E⁻ NHẬN
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-white mt-0.5">
                  {electronsGained}
                </span>
                <span className="text-[8px] text-white/50 truncate max-w-[90%] font-mono">
                  {oxidizerDesc}
                </span>
              </div>
              <div className="w-[2px] h-10 bg-gradient-to-b from-[#00F2FF] to-white/20" />
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-3 text-white/50 italic">
          Điều chỉnh hệ số để cân bằng cán cân electron bảo toàn: <strong className="text-white/80 font-mono">Tổng e⁻ nhường = Tổng e⁻ nhận</strong>
        </p>
      </div>
    </div>
  );
};
