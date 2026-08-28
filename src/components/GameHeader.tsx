import React from 'react';
import { GameAct } from '../types';
import { Volume2, VolumeX, BookOpen, GraduationCap, Flame, Zap, Award, Sparkles, Swords, Home, FlaskConical } from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface GameHeaderProps {
  currentAct: GameAct;
  currentQuestionIndex: number;
  totalQuestionsInAct: number;
  energyScore: number;
  streak: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCheatSheet: () => void;
  onOpenTeacherGuide: () => void;
  onOpenPvP?: () => void;
  onOpenVirtualLab?: () => void;
  onGoHome?: () => void;
  onChangeAct: (act: GameAct) => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentAct,
  currentQuestionIndex,
  totalQuestionsInAct,
  energyScore,
  streak,
  isMuted,
  onToggleMute,
  onOpenCheatSheet,
  onOpenTeacherGuide,
  onOpenPvP,
  onOpenVirtualLab,
  onGoHome,
  onChangeAct,
}) => {
  return (
    <header className="w-full flex flex-col gap-3">
      {/* Top Navbar */}
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl glass-panel border border-white/15 relative overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F2FF]/60 to-[#BC13FE]/60" />

        {/* Game Title & LAB Avatar Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onGoHome && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              title="Thoát về Trang Chủ"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 hover:border-rose-500/40 border border-white/15 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <Home className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Trang Chủ</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white neon-border-cyan border shrink-0 font-black text-sm">
            <span>⚡e⁻</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-[#00F2FF] uppercase font-mono">
                HÓA HỌC 10 THPT
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 font-mono">
                OXI HÓA - KHỬ
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {currentAct === 1 ? 'Hồi 1: Bản Chất Nhường - Nhận e⁻' : currentAct === 2 ? 'Hồi 2: Cân Bằng Cơ Bản' : 'Hồi 3: Đại Chiến Quá Tải Redox'}
            </h1>
          </div>
        </div>

        {/* Status Metrics (Energy Electron Gauge, Streak, Toggles) */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Futuristic Electron Energy Bar */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center justify-between w-40 text-[9px] font-bold uppercase tracking-wider">
              <span className="text-[#BC13FE]">Năng Lượng e⁻</span>
              <span className="text-[#00F2FF] font-mono">{energyScore} MW</span>
            </div>
            <div className="w-40 h-2 bg-white/10 rounded-full mt-1 overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#00F2FF] via-cyan-400 to-[#BC13FE] rounded-full shadow-[0_0_10px_#BC13FE] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(15, (energyScore % 1000) / 10))}%` }}
              />
            </div>
          </div>

          {/* Energy Score on Mobile */}
          <div className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-cyan-500/30 text-[#00F2FF]">
            <Zap className="w-3.5 h-3.5 text-[#00F2FF] fill-[#00F2FF]" />
            <span className="text-xs font-bold font-mono">{energyScore} MW</span>
          </div>

          {/* Streak Combo Pill */}
          {streak > 1 && (
            <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#BC13FE]/20 border border-[#BC13FE]/50 text-[#BC13FE] animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-[#BC13FE]" />
              <span className="text-xs font-black font-mono">{streak}x</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Đấu trường đối kháng PvP */}
            {onOpenPvP && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenPvP();
                }}
                title="Đấu trường đối kháng 2 người (Redox PvP / Kahoot Mode)"
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F2FF]/20 to-[#BC13FE]/20 hover:from-[#00F2FF]/30 hover:to-[#BC13FE]/30 text-white border border-[#00F2FF]/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-xs font-bold shadow-[0_0_15px_rgba(0,242,255,0.2)]"
              >
                <Swords className="w-3.5 h-3.5 text-[#00F2FF]" />
                <span className="hidden sm:inline">Đấu Trường 2P</span>
              </button>
            )}

            {/* Phòng Thí Nghiệm Ảo 3D */}
            {onOpenVirtualLab && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenVirtualLab();
                }}
                title="Phòng Thí Nghiệm Ảo Thực Tế (Virtual Lab)"
                className="p-2 rounded-xl bg-[#00F2FF]/10 hover:bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/30 transition-all hover:scale-105 active:scale-95"
              >
                <FlaskConical className="w-4 h-4 text-[#00F2FF]" />
              </button>
            )}

            {/* Sổ tay Oxi Hóa Khử */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenCheatSheet();
              }}
              title="Sổ tay lý thuyết Oxi hóa - Khử"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#00F2FF] border border-white/15 transition-all hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Góc Sư Phạm / Giáo viên */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenTeacherGuide();
              }}
              title="Góc giáo viên & Tải mã nguồn HTML"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-400 border border-white/15 transition-all hover:scale-105 active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                onToggleMute();
                sound.playClick();
              }}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 border border-white/15 transition-all hover:scale-105 active:scale-95"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00F2FF]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Act Progression Tabs with Geometric Balance Styling */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Act 1 */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onChangeAct(1);
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
            currentAct === 1
              ? 'glass-panel neon-border-cyan border-[#00F2FF] bg-cyan-950/40 text-white'
              : 'glass-panel-subtle text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00F2FF]">
              HỒI 1
            </span>
            {currentAct === 1 && (
              <span className="text-[10px] font-mono text-[#00F2FF] font-bold">
                {currentQuestionIndex + 1}/{totalQuestionsInAct}
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            Bản Chất e⁻
          </div>
          <div className="text-[10px] text-white/50 truncate hidden sm:block">
            Kéo thả hạt electron e⁻
          </div>
        </button>

        {/* Act 2 */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onChangeAct(2);
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
            currentAct === 2
              ? 'glass-panel neon-border-purple border-[#BC13FE] bg-purple-950/40 text-white'
              : 'glass-panel-subtle text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BC13FE]">
              HỒI 2
            </span>
            {currentAct === 2 && (
              <span className="text-[10px] font-mono text-[#BC13FE] font-bold">
                {currentQuestionIndex + 1}/{totalQuestionsInAct}
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            Cán Cân Cơ Bản
          </div>
          <div className="text-[10px] text-white/50 truncate hidden sm:block">
            Cán cân điện tử & Hệ số
          </div>
        </button>

        {/* Act 3 */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onChangeAct(3);
          }}
          className={`p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
            currentAct === 3
              ? 'glass-panel border-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.4)] bg-pink-950/40 text-white'
              : 'glass-panel-subtle text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              HỒI 3
            </span>
            {currentAct === 3 && (
              <span className="text-[10px] font-mono text-pink-300 font-bold">
                {currentQuestionIndex + 1}/{totalQuestionsInAct}
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            Quá Tải Redox
          </div>
          <div className="text-[10px] text-white/50 truncate hidden sm:block">
            KMnO₄, HNO₃, Chất môi trường
          </div>
        </button>
      </div>
    </header>
  );
};

// SVG Atom Icon
function AtomIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}
