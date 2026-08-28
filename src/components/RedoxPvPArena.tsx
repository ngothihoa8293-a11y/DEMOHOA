import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BalancedEquationQuestion, PvPRoundResult, PvPPlayer, PvPSettings } from '../types';
import { ACT2_QUESTIONS, ACT3_QUESTIONS } from '../data/chemistryData';
import { sound } from '../utils/audioSynth';
import { launchConfetti } from '../utils/confetti';
import {
  Swords,
  Trophy,
  Flame,
  Timer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Atom,
  FlaskConical,
  Bot,
  Hash,
  Play,
  Award,
  Clock,
  ArrowLeft,
  Volume2,
  VolumeX,
  Keyboard,
  Info,
  BookOpen,
  Home
} from 'lucide-react';

interface RedoxPvPArenaProps {
  onBackToCampaign: () => void;
  onGoHome?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const AVATAR_ICONS: { [key: string]: React.ElementType } = {
  atom: Atom,
  flask: FlaskConical,
  zap: Zap,
  shield: Shield,
  flame: Flame,
  bot: Bot,
};

export function RedoxPvPArena({ onBackToCampaign, onGoHome, isMuted, onToggleMute }: RedoxPvPArenaProps) {
  // Arena State Flow: 'lobby' | 'countdown' | 'active' | 'round-reveal' | 'podium'
  const [arenaState, setArenaState] = useState<'lobby' | 'countdown' | 'active' | 'round-reveal' | 'podium'>('lobby');

  // Settings
  const [settings, setSettings] = useState<PvPSettings>({
    questionCount: 5,
    timePerQuestion: 45,
    roomCode: 'REDOX-' + Math.floor(1000 + Math.random() * 9000),
    difficulty: 'all',
  });

  // Players State
  const [p1, setP1] = useState<PvPPlayer>({
    id: 'p1',
    name: 'Đặc Vụ Cyan',
    avatar: 'zap',
    color: 'cyan',
    score: 0,
    streak: 0,
    roundWins: 0,
    currentCoefficients: [],
    isLockedIn: false,
  });

  const [p2, setP2] = useState<PvPPlayer>({
    id: 'p2',
    name: 'Đặc Vụ Purple',
    avatar: 'atom',
    color: 'purple',
    score: 0,
    streak: 0,
    roundWins: 0,
    currentCoefficients: [],
    isLockedIn: false,
  });

  // Active Questions for current match
  const [matchQuestions, setMatchQuestions] = useState<BalancedEquationQuestion[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<PvPRoundResult[]>([]);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const roundStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active Question
  const activeQuestion = matchQuestions[currentRoundIndex] || ACT2_QUESTIONS[0];

  // Helper to build initial flat list of substances [reactants..., products...]
  const allSubstances = useMemo(() => {
    if (!activeQuestion) return [];
    return [...activeQuestion.reactants, ...activeQuestion.products];
  }, [activeQuestion]);

  const correctCoefficients = useMemo(() => {
    return allSubstances.map((s) => s.correctCoeff);
  }, [allSubstances]);

  // Generate question pool when starting match
  const handleStartDuel = () => {
    sound.playClick();
    let pool: BalancedEquationQuestion[] = [];
    if (settings.difficulty === 'basic') {
      pool = [...ACT2_QUESTIONS];
    } else if (settings.difficulty === 'hard') {
      pool = [...ACT3_QUESTIONS];
    } else {
      pool = [...ACT2_QUESTIONS, ...ACT3_QUESTIONS];
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, settings.questionCount);
    setMatchQuestions(selected);
    setCurrentRoundIndex(0);
    setRoundResults([]);

    // Reset scores
    setP1((prev) => ({
      ...prev,
      score: 0,
      streak: 0,
      roundWins: 0,
      isLockedIn: false,
      currentCoefficients: [],
    }));
    setP2((prev) => ({
      ...prev,
      score: 0,
      streak: 0,
      roundWins: 0,
      isLockedIn: false,
      currentCoefficients: [],
    }));

    // Start 3-2-1 Countdown
    setCountdownNum(3);
    setArenaState('countdown');
    sound.playCountdownTick(false);
  };

  // 3-2-1 Countdown effect
  useEffect(() => {
    if (arenaState !== 'countdown') return;

    const interval = setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sound.playRoundStart();
          initRound(0);
          return 0;
        }
        sound.playCountdownTick(prev - 1 === 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [arenaState]);

  // Init a new round
  const initRound = (roundIdx: number) => {
    const q = matchQuestions[roundIdx];
    if (!q) return;

    const initialCoeffs = [...q.reactants, ...q.products].map(() => 1);

    setP1((prev) => ({
      ...prev,
      currentCoefficients: [...initialCoeffs],
      isLockedIn: false,
      lockInTimeMs: undefined,
      isCorrect: undefined,
      scoreGainedInRound: 0,
    }));

    setP2((prev) => ({
      ...prev,
      currentCoefficients: [...initialCoeffs],
      isLockedIn: false,
      lockInTimeMs: undefined,
      isCorrect: undefined,
      scoreGainedInRound: 0,
    }));

    setTimeLeft(settings.timePerQuestion);
    roundStartTimeRef.current = Date.now();
    setArenaState('active');
  };

  // Round Timer effect
  useEffect(() => {
    if (arenaState !== 'active') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    if (settings.timePerQuestion <= 0) return; // Unlimited

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          sound.playBuzzer();
          evaluateRoundTimeout();
          return 0;
        }
        if (prev <= 6) {
          sound.playCountdownTick(prev === 2);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [arenaState, settings.timePerQuestion]);

  // Coefficient modifier for Player 1
  const modifyP1Coeff = (index: number, delta: number) => {
    if (p1.isLockedIn) return;
    sound.playSliderTick();
    setP1((prev) => {
      const next = [...prev.currentCoefficients];
      const currentVal = next[index] || 1;
      const newVal = Math.max(1, Math.min(20, currentVal + delta));
      next[index] = newVal;
      return { ...prev, currentCoefficients: next };
    });
  };

  // Coefficient modifier for Player 2
  const modifyP2Coeff = (index: number, delta: number) => {
    if (p2.isLockedIn) return;
    sound.playSliderTick();
    setP2((prev) => {
      const next = [...prev.currentCoefficients];
      const currentVal = next[index] || 1;
      const newVal = Math.max(1, Math.min(20, currentVal + delta));
      next[index] = newVal;
      return { ...prev, currentCoefficients: next };
    });
  };

  // Check if coefficients match correct answer
  const checkCoefficientsMatch = (userCoeffs: number[]) => {
    if (userCoeffs.length !== correctCoefficients.length) return false;
    return userCoeffs.every((val, idx) => val === correctCoefficients[idx]);
  };

  // Lock In Player 1
  const handleP1LockIn = () => {
    if (p1.isLockedIn || arenaState !== 'active') return;
    sound.playLockIn();
    const timeTaken = Date.now() - roundStartTimeRef.current;
    const isCorrect = checkCoefficientsMatch(p1.currentCoefficients);

    setP1((prev) => ({
      ...prev,
      isLockedIn: true,
      lockInTimeMs: timeTaken,
      isCorrect,
    }));

    // If P2 is also locked in, evaluate round immediately
    if (p2.isLockedIn) {
      setTimeout(() => {
        finalizeRound({
          p1Locked: true,
          p1Time: timeTaken,
          p1Correct: isCorrect,
          p2Locked: true,
          p2Time: p2.lockInTimeMs || timeTaken,
          p2Correct: !!p2.isCorrect,
        });
      }, 300);
    }
  };

  // Lock In Player 2
  const handleP2LockIn = () => {
    if (p2.isLockedIn || arenaState !== 'active') return;
    sound.playLockIn();
    const timeTaken = Date.now() - roundStartTimeRef.current;
    const isCorrect = checkCoefficientsMatch(p2.currentCoefficients);

    setP2((prev) => ({
      ...prev,
      isLockedIn: true,
      lockInTimeMs: timeTaken,
      isCorrect,
    }));

    // If P1 is also locked in, evaluate round immediately
    if (p1.isLockedIn) {
      setTimeout(() => {
        finalizeRound({
          p1Locked: true,
          p1Time: p1.lockInTimeMs || timeTaken,
          p1Correct: !!p1.isCorrect,
          p2Locked: true,
          p2Time: timeTaken,
          p2Correct: isCorrect,
        });
      }, 300);
    }
  };

  // Evaluate if round timed out
  const evaluateRoundTimeout = () => {
    const p1Correct = p1.isLockedIn ? !!p1.isCorrect : checkCoefficientsMatch(p1.currentCoefficients);
    const p2Correct = p2.isLockedIn ? !!p2.isCorrect : checkCoefficientsMatch(p2.currentCoefficients);

    finalizeRound({
      p1Locked: p1.isLockedIn,
      p1Time: p1.lockInTimeMs || settings.timePerQuestion * 1000,
      p1Correct,
      p2Locked: p2.isLockedIn,
      p2Time: p2.lockInTimeMs || settings.timePerQuestion * 1000,
      p2Correct,
    });
  };

  // Finalize Round scoring and results
  const finalizeRound = (params: {
    p1Locked: boolean;
    p1Time: number;
    p1Correct: boolean;
    p2Locked: boolean;
    p2Time: number;
    p2Correct: boolean;
  }) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const { p1Correct, p1Time, p2Correct, p2Time } = params;

    // Calculate Scores (Base 1000 + Time Bonus + Streak Multiplier + First to Lock)
    let p1Gained = 0;
    let p2Gained = 0;

    let nextP1Streak = p1.streak;
    let nextP2Streak = p2.streak;
    let nextP1Wins = p1.roundWins;
    let nextP2Wins = p2.roundWins;

    if (p1Correct) {
      nextP1Streak += 1;
      const base = 1000;
      const timeRemainingFraction = Math.max(0, 1 - p1Time / (settings.timePerQuestion * 1000));
      const speedBonus = Math.round(timeRemainingFraction * 500);
      const streakMultiplier = nextP1Streak >= 3 ? 1.5 : nextP1Streak >= 2 ? 1.2 : 1.0;
      const firstBonus = p1Time < p2Time && params.p1Locked ? 200 : 0;
      p1Gained = Math.round((base + speedBonus + firstBonus) * streakMultiplier);
    } else {
      nextP1Streak = 0;
    }

    if (p2Correct) {
      nextP2Streak += 1;
      const base = 1000;
      const timeRemainingFraction = Math.max(0, 1 - p2Time / (settings.timePerQuestion * 1000));
      const speedBonus = Math.round(timeRemainingFraction * 500);
      const streakMultiplier = nextP2Streak >= 3 ? 1.5 : nextP2Streak >= 2 ? 1.2 : 1.0;
      const firstBonus = p2Time < p1Time && params.p2Locked ? 200 : 0;
      p2Gained = Math.round((base + speedBonus + firstBonus) * streakMultiplier);
    } else {
      nextP2Streak = 0;
    }

    // Determine round winner
    let winner: 'p1' | 'p2' | 'draw' | 'none' = 'none';
    if (p1Correct && !p2Correct) {
      winner = 'p1';
      nextP1Wins += 1;
    } else if (p2Correct && !p1Correct) {
      winner = 'p2';
      nextP2Wins += 1;
    } else if (p1Correct && p2Correct) {
      if (p1Time < p2Time) {
        winner = 'p1';
        nextP1Wins += 1;
      } else if (p2Time < p1Time) {
        winner = 'p2';
        nextP2Wins += 1;
      } else {
        winner = 'draw';
      }
    }

    // Play victory / feedback sound
    if (p1Correct || p2Correct) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    // Update player states
    setP1((prev) => ({
      ...prev,
      score: prev.score + p1Gained,
      streak: nextP1Streak,
      roundWins: nextP1Wins,
      isCorrect: p1Correct,
      scoreGainedInRound: p1Gained,
    }));

    setP2((prev) => ({
      ...prev,
      score: prev.score + p2Gained,
      streak: nextP2Streak,
      roundWins: nextP2Wins,
      isCorrect: p2Correct,
      scoreGainedInRound: p2Gained,
    }));

    // Record result
    const result: PvPRoundResult = {
      roundNumber: currentRoundIndex + 1,
      questionTitle: activeQuestion.title,
      equationDisplay: activeQuestion.equationDisplay,
      p1Correct,
      p1ScoreGained: p1Gained,
      p1TimeSeconds: Number((p1Time / 1000).toFixed(1)),
      p2Correct,
      p2ScoreGained: p2Gained,
      p2TimeSeconds: Number((p2Time / 1000).toFixed(1)),
      winner,
      correctEquation: activeQuestion.equationDisplay,
    };

    setRoundResults((prev) => [...prev, result]);
    setArenaState('round-reveal');
  };

  // Next Round or Finish to Podium
  const handleNextRound = () => {
    sound.playClick();
    if (currentRoundIndex < matchQuestions.length - 1) {
      const nextIdx = currentRoundIndex + 1;
      setCurrentRoundIndex(nextIdx);
      initRound(nextIdx);
    } else {
      // Match Finished!
      sound.playVictory();
      launchConfetti();
      setArenaState('podium');
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    if (arenaState !== 'active') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Player 1 controls (Q / E or A / D to modify first/second substance, Space to lock in)
      if (e.code === 'KeyA') {
        modifyP1Coeff(0, -1);
      } else if (e.code === 'KeyD') {
        modifyP1Coeff(0, 1);
      } else if (e.code === 'KeyW') {
        modifyP1Coeff(1, 1);
      } else if (e.code === 'KeyS') {
        modifyP1Coeff(1, -1);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleP1LockIn();
      }

      // Player 2 controls (Arrow Left / Right / Up / Down, Enter to lock in)
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        modifyP2Coeff(0, -1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        modifyP2Coeff(0, 1);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        modifyP2Coeff(1, 1);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        modifyP2Coeff(1, -1);
      } else if (e.code === 'Enter') {
        e.preventDefault();
        handleP2LockIn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [arenaState, p1.isLockedIn, p2.isLockedIn, p1.currentCoefficients, p2.currentCoefficients]);

  // Overall match winner
  const overallWinner = useMemo(() => {
    if (p1.score > p2.score) return 'p1';
    if (p2.score > p1.score) return 'p2';
    return 'draw';
  }, [p1.score, p2.score]);

  const P1Avatar = AVATAR_ICONS[p1.avatar] || Zap;
  const P2Avatar = AVATAR_ICONS[p2.avatar] || Atom;

  return (
    <div className="w-full flex-1 flex flex-col gap-4">
      {/* ARENA TOP NAVIGATION */}
      <div className="glass-panel px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {onGoHome && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              title="Thoát về Trang Chủ"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 hover:border-rose-500/40 border border-white/10 flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">Trang Chủ</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBackToCampaign();
            }}
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-semibold"
            title="Quay lại chiến dịch cốt truyện 1 người"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Về Cốt Truyện</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#00F2FF]/20 to-[#BC13FE]/20 text-white border border-white/20">
              <Swords className="w-4 h-4 text-[#00F2FF]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#00F2FF] uppercase tracking-widest font-mono">
                  ĐẤU TRƯỜNG REDOX
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  KAHOOT MODE 2P
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                Đối Kháng Thăng Bằng Electron Thời Gian Thực
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-white/70 hidden sm:flex items-center gap-1">
            <Hash className="w-3 h-3 text-[#00F2FF]" />
            Mã Phòng: <strong className="text-white font-bold">{settings.roomCode}</strong>
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors border border-white/10"
            title="Bật/Tắt âm thanh"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00F2FF]" />}
          </button>
        </div>
      </div>

      {/* ======================= STATE 1: LOBBY ======================= */}
      {arenaState === 'lobby' && (
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-4xl glass-panel p-6 sm:p-8 flex flex-col gap-6">
            {/* Header Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00F2FF]/20 via-black to-[#BC13FE]/20 border border-white/20 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] uppercase tracking-wider">
                <Swords className="w-4 h-4 text-[#00F2FF]" />
                ĐẤU TRƯỜNG ĐỐI ĐẦU 2 HỌC SINH • BẢO TOÀN ELECTRON
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Cấu Hình Trận Đấu Redox PvP
              </h1>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto">
                Cùng 1 phương trình phản ứng oxi hóa - khử, 2 học sinh sẽ thi đấu cân bằng hệ số trên cùng thiết bị. Ai thăng bằng electron nhanh và chuẩn xác hơn sẽ giành trọn điểm thưởng tốc độ!
              </p>
            </div>

            {/* 2 Player Configuration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player 1 Card (Neon Cyan) */}
              <div className="p-5 rounded-2xl bg-black/50 border-2 border-[#00F2FF]/40 shadow-[0_0_20px_rgba(0,242,255,0.15)] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#00F2FF] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FF] animate-pulse" />
                    ĐẤU THỦ 1 (P1)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00F2FF]/20 text-[#00F2FF] font-bold border border-[#00F2FF]/30">
                    PHÍM: A / D / Space
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00F2FF] to-cyan-700 flex items-center justify-center text-black shadow-lg shrink-0">
                    <P1Avatar className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-white/60 font-semibold mb-1">Tên Người Chơi 1:</label>
                    <input
                      type="text"
                      value={p1.name}
                      onChange={(e) => setP1((prev) => ({ ...prev, name: e.target.value }))}
                      maxLength={18}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-[#00F2FF]/50 text-white font-bold text-sm focus:outline-none focus:border-[#00F2FF]"
                    />
                  </div>
                </div>

                {/* Avatar selection */}
                <div>
                  <label className="block text-[10px] text-white/60 font-medium mb-1.5 uppercase tracking-wider">
                    Chọn Biểu Tượng:
                  </label>
                  <div className="flex gap-2">
                    {Object.keys(AVATAR_ICONS).map((iconKey) => {
                      const IconComp = AVATAR_ICONS[iconKey];
                      const isSelected = p1.avatar === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setP1((prev) => ({ ...prev, avatar: iconKey }));
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-[#00F2FF]/20 border-[#00F2FF] text-[#00F2FF] scale-110'
                              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Player 2 Card (Neon Purple) */}
              <div className="p-5 rounded-2xl bg-black/50 border-2 border-[#BC13FE]/40 shadow-[0_0_20px_rgba(188,19,254,0.15)] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#BC13FE] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BC13FE] animate-pulse" />
                    ĐẤU THỦ 2 (P2)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BC13FE]/20 text-[#BC13FE] font-bold border border-[#BC13FE]/30">
                    PHÍM: Mũi Tên / Enter
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#BC13FE] to-purple-800 flex items-center justify-center text-white shadow-lg shrink-0">
                    <P2Avatar className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-white/60 font-semibold mb-1">Tên Người Chơi 2:</label>
                    <input
                      type="text"
                      value={p2.name}
                      onChange={(e) => setP2((prev) => ({ ...prev, name: e.target.value }))}
                      maxLength={18}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-[#BC13FE]/50 text-white font-bold text-sm focus:outline-none focus:border-[#BC13FE]"
                    />
                  </div>
                </div>

                {/* Avatar selection */}
                <div>
                  <label className="block text-[10px] text-white/60 font-medium mb-1.5 uppercase tracking-wider">
                    Chọn Biểu Tượng:
                  </label>
                  <div className="flex gap-2">
                    {Object.keys(AVATAR_ICONS).map((iconKey) => {
                      const IconComp = AVATAR_ICONS[iconKey];
                      const isSelected = p2.avatar === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setP2((prev) => ({ ...prev, avatar: iconKey }));
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-[#BC13FE]/20 border-[#BC13FE] text-[#BC13FE] scale-110'
                              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Rules & Options */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Question Count */}
              <div className="space-y-1.5">
                <label className="text-white/70 font-semibold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  Số Hiệp Đấu:
                </label>
                <div className="flex gap-2">
                  {[3, 5, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSettings((prev) => ({ ...prev, questionCount: count }));
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                        settings.questionCount === count
                          ? 'bg-amber-400 text-black border-amber-300'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {count} Hiệp
                    </button>
                  ))}
                </div>
              </div>

              {/* Time per question */}
              <div className="space-y-1.5">
                <label className="text-white/70 font-semibold flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-[#00F2FF]" />
                  Thời Gian Mỗi Hiệp:
                </label>
                <div className="flex gap-2">
                  {[30, 45, 60].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSettings((prev) => ({ ...prev, timePerQuestion: t }));
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                        settings.timePerQuestion === t
                          ? 'bg-[#00F2FF] text-black border-[#00F2FF]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {t} Giây
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-white/70 font-semibold flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-[#BC13FE]" />
                  Độ Khó Đề Bài:
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'all', label: 'Tất Cả' },
                    { id: 'basic', label: 'Cơ Bản' },
                    { id: 'hard', label: 'Nâng Cao' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSettings((prev) => ({ ...prev, difficulty: d.id as any }));
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] border transition-all ${
                        settings.difficulty === d.id
                          ? 'bg-[#BC13FE] text-white border-[#BC13FE]'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pedagogical Classroom Info Box */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/70 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#00F2FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Dành cho Giáo viên Hóa học:</strong> Mã phòng{' '}
                <span className="font-mono text-amber-300 font-bold">{settings.roomCode}</span> có thể chiếu lên màn hình máy chiếu lớp học. Hai học sinh lên bảng cùng sử dụng màn hình cảm ứng hoặc 2 bộ phím tắt để thi đấu tính điểm Kahoot trực tiếp!
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="button"
              onClick={handleStartDuel}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F2FF] via-cyan-400 to-[#BC13FE] hover:opacity-95 text-black font-black text-base uppercase tracking-wider shadow-[0_0_30px_rgba(0,242,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-black" />
              BẮT ĐẦU ĐẤU TRƯỜNG NGAY (START DUEL) ⚔
            </button>
          </div>
        </div>
      )}

      {/* ======================= STATE 2: 3-2-1 COUNTDOWN ======================= */}
      {arenaState === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-6 animate-pulse">
            <div className="text-xs font-mono uppercase tracking-widest text-[#00F2FF]">
              CHUẨN BỊ BƯỚC VÀO ĐẤU TRƯỜNG
            </div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#00F2FF] via-black to-[#BC13FE] border-4 border-white/40 flex items-center justify-center text-6xl sm:text-8xl font-black text-white shadow-[0_0_60px_rgba(0,242,255,0.6)]">
              {countdownNum}
            </div>
            <p className="text-sm font-bold text-amber-300 font-mono uppercase">
              "Khử Cho - O Nhận" • Thăng Bằng e⁻ Nhanh Nhất!
            </p>
          </div>
        </div>
      )}

      {/* ======================= STATE 3: ACTIVE DUEL ======================= */}
      {arenaState === 'active' && (
        <div className="flex-1 flex flex-col gap-4">
          {/* Central Match HUD */}
          <div className="glass-panel p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Player 1 Score & Streak Badge */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#00F2FF]/20 border border-[#00F2FF]/40 flex items-center justify-center text-[#00F2FF] font-bold shrink-0">
                  <P1Avatar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#00F2FF] truncate max-w-[120px]">{p1.name}</div>
                  <div className="text-sm sm:text-base font-black font-mono text-white">{p1.score} pts</div>
                </div>
              </div>
              {p1.streak > 1 && (
                <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  x{p1.streak >= 3 ? '1.5' : '1.2'}
                </div>
              )}
            </div>

            {/* Center: Round & Timer */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-[10px] text-white/60 uppercase font-mono tracking-wider">HIỆP ĐẤU</div>
                <div className="text-sm sm:text-base font-black text-amber-300 font-mono">
                  {currentRoundIndex + 1} / {matchQuestions.length}
                </div>
              </div>

              {/* Countdown Circular Badge */}
              <div
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-base border-2 shadow-lg transition-all ${
                  timeLeft <= 10
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-bounce'
                    : 'bg-black/60 border-white/20 text-[#00F2FF]'
                }`}
              >
                <span className="text-xs text-white/50 -mb-1">
                  <Clock className="w-3 h-3" />
                </span>
                {timeLeft}s
              </div>

              <div className="text-center">
                <div className="text-[10px] text-white/60 uppercase font-mono tracking-wider">TỈ SỐ HIỆP</div>
                <div className="text-sm sm:text-base font-black text-white font-mono">
                  <span className="text-[#00F2FF]">{p1.roundWins}</span> - <span className="text-[#BC13FE]">{p2.roundWins}</span>
                </div>
              </div>
            </div>

            {/* Player 2 Score & Streak Badge */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {p2.streak > 1 && (
                <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  x{p2.streak >= 3 ? '1.5' : '1.2'}
                </div>
              )}
              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className="text-xs font-black text-[#BC13FE] truncate max-w-[120px]">{p2.name}</div>
                  <div className="text-sm sm:text-base font-black font-mono text-white">{p2.score} pts</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#BC13FE]/20 border border-[#BC13FE]/40 flex items-center justify-center text-[#BC13FE] font-bold shrink-0">
                  <P2Avatar className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Central Target Equation Display */}
          <div className="glass-panel p-4 text-center space-y-2 border-2 border-white/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {activeQuestion.title}
            </div>

            <div className="text-base sm:text-xl md:text-2xl font-black text-white tracking-wide font-mono px-2 py-2 rounded-xl bg-black/40 border border-white/10">
              {activeQuestion.equationDisplay}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/70">
              <span className="text-[#00F2FF] font-semibold">
                • Chất khử: {activeQuestion.reducerElement}
              </span>
              <span className="text-[#BC13FE] font-semibold">
                • Chất oxi hóa: {activeQuestion.oxidizerElement}
              </span>
              <span className="text-emerald-300 font-mono font-bold">
                • e⁻ trao đổi: {activeQuestion.totalElectronsTransferred}e
              </span>
            </div>
          </div>

          {/* DUAL TOUCH DECKS (SPLIT CONTROLS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PLAYER 1 CONTROLS (Neon Cyan) */}
            <div
              className={`p-4 rounded-3xl transition-all ${
                p1.isLockedIn
                  ? 'bg-black/80 border-2 border-[#00F2FF]/60 shadow-[0_0_30px_rgba(0,242,255,0.2)]'
                  : 'glass-panel border-2 border-[#00F2FF]/40'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#00F2FF]/20 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00F2FF] animate-ping" />
                  <h3 className="font-black text-sm text-[#00F2FF] uppercase">{p1.name}</h3>
                </div>
                {p1.isLockedIn ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#00F2FF]/20 text-[#00F2FF] text-[11px] font-black uppercase border border-[#00F2FF]/50 animate-pulse">
                    ⚡ ĐÃ CHỐT ĐÁP ÁN!
                  </span>
                ) : (
                  <span className="text-[10px] text-white/50 font-mono">Phím: A/D/W • Space</span>
                )}
              </div>

              {/* Substance Coefficient Adjusters */}
              <div className="space-y-2.5 mb-4">
                {allSubstances.map((sub, idx) => {
                  const val = p1.currentCoefficients[idx] || 1;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex-1 truncate">
                        <span
                          dangerouslySetInnerHTML={{ __html: sub.subscriptFormulaHtml || sub.formula }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={p1.isLockedIn || val <= 1}
                          onClick={() => modifyP1Coeff(idx, -1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 text-white font-black text-sm transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-black text-base text-[#00F2FF]">
                          {val}
                        </span>
                        <button
                          type="button"
                          disabled={p1.isLockedIn || val >= 20}
                          onClick={() => modifyP1Coeff(idx, 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 text-white font-black text-sm transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lock-in Button P1 */}
              <button
                type="button"
                disabled={p1.isLockedIn}
                onClick={handleP1LockIn}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  p1.isLockedIn
                    ? 'bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00F2FF] to-cyan-500 hover:opacity-90 active:scale-95 text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                }`}
              >
                {p1.isLockedIn ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    ĐÃ CHỐT HỆ SỐ! (ĐANG CHỜ P2...)
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-black" />
                    CHỐT ĐÁP ÁN (P1 LOCK-IN)
                  </>
                )}
              </button>
            </div>

            {/* PLAYER 2 CONTROLS (Neon Purple) */}
            <div
              className={`p-4 rounded-3xl transition-all ${
                p2.isLockedIn
                  ? 'bg-black/80 border-2 border-[#BC13FE]/60 shadow-[0_0_30px_rgba(188,19,254,0.2)]'
                  : 'glass-panel border-2 border-[#BC13FE]/40'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#BC13FE]/20 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#BC13FE] animate-ping" />
                  <h3 className="font-black text-sm text-[#BC13FE] uppercase">{p2.name}</h3>
                </div>
                {p2.isLockedIn ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#BC13FE]/20 text-[#BC13FE] text-[11px] font-black uppercase border border-[#BC13FE]/50 animate-pulse">
                    🟣 ĐÃ CHỐT ĐÁP ÁN!
                  </span>
                ) : (
                  <span className="text-[10px] text-white/50 font-mono">Phím: Mũi tên • Enter</span>
                )}
              </div>

              {/* Substance Coefficient Adjusters */}
              <div className="space-y-2.5 mb-4">
                {allSubstances.map((sub, idx) => {
                  const val = p2.currentCoefficients[idx] || 1;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="font-mono text-xs sm:text-sm font-bold text-white flex-1 truncate">
                        <span
                          dangerouslySetInnerHTML={{ __html: sub.subscriptFormulaHtml || sub.formula }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={p2.isLockedIn || val <= 1}
                          onClick={() => modifyP2Coeff(idx, -1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 text-white font-black text-sm transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-black text-base text-[#BC13FE]">
                          {val}
                        </span>
                        <button
                          type="button"
                          disabled={p2.isLockedIn || val >= 20}
                          onClick={() => modifyP2Coeff(idx, 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 text-white font-black text-sm transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lock-in Button P2 */}
              <button
                type="button"
                disabled={p2.isLockedIn}
                onClick={handleP2LockIn}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  p2.isLockedIn
                    ? 'bg-[#BC13FE]/20 text-[#BC13FE] border border-[#BC13FE]/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#BC13FE] to-purple-600 hover:opacity-90 active:scale-95 text-white shadow-[0_0_20px_rgba(188,19,254,0.4)]'
                }`}
              >
                {p2.isLockedIn ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    ĐÃ CHỐT HỆ SỐ! (ĐANG CHỜ P1...)
                  </>
                ) : (
                  <>
                    <Atom className="w-5 h-5 fill-white" />
                    CHỐT ĐÁP ÁN (P2 LOCK-IN)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= STATE 4: ROUND REVEAL ======================= */}
      {arenaState === 'round-reveal' && (
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-3xl glass-panel p-6 sm:p-8 flex flex-col gap-6">
            {/* Round Winner Banner */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-widest">
                KẾT QUẢ HIỆP {currentRoundIndex + 1}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
                {p1.isCorrect && p2.isCorrect
                  ? (p1.lockInTimeMs || 0) < (p2.lockInTimeMs || 0)
                    ? `⚡ ${p1.name} THẮNG TỐC ĐỘ!`
                    : `🟣 ${p2.name} THẮNG TỐC ĐỘ!`
                  : p1.isCorrect
                  ? `⚡ ${p1.name} GIÀNH CHIẾN THẮNG HIỆP NÀY!`
                  : p2.isCorrect
                  ? `🟣 ${p2.name} GIÀNH CHIẾN THẮNG HIỆP NÀY!`
                  : 'CẢ 2 ĐẤU THỦ CHƯA THĂNG BẰNG ĐÚNG!'}
              </h2>
            </div>

            {/* Score Gained Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border text-center ${
                  p1.isCorrect
                    ? 'bg-[#00F2FF]/15 border-[#00F2FF] text-white'
                    : 'bg-rose-950/30 border-rose-500/40 text-white/70'
                }`}
              >
                <div className="text-xs font-bold text-[#00F2FF] uppercase">{p1.name}</div>
                <div className="text-xl sm:text-2xl font-black font-mono my-1">
                  {p1.isCorrect ? `+${p1.scoreGainedInRound} pts` : '+0 pts'}
                </div>
                <div className="text-[11px] font-mono text-white/70">
                  {p1.isCorrect ? `⚡ Chuẩn xác trong ${( (p1.lockInTimeMs || 0) / 1000).toFixed(1)}s` : '❌ Sai hệ số e⁻'}
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center ${
                  p2.isCorrect
                    ? 'bg-[#BC13FE]/15 border-[#BC13FE] text-white'
                    : 'bg-rose-950/30 border-rose-500/40 text-white/70'
                }`}
              >
                <div className="text-xs font-bold text-[#BC13FE] uppercase">{p2.name}</div>
                <div className="text-xl sm:text-2xl font-black font-mono my-1">
                  {p2.isCorrect ? `+${p2.scoreGainedInRound} pts` : '+0 pts'}
                </div>
                <div className="text-[11px] font-mono text-white/70">
                  {p2.isCorrect ? `🟣 Chuẩn xác trong ${( (p2.lockInTimeMs || 0) / 1000).toFixed(1)}s` : '❌ Sai hệ số e⁻'}
                </div>
              </div>
            </div>

            {/* Equation Explanation */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
              <div className="text-amber-300 font-bold flex items-center gap-1.5 text-sm">
                <BookOpen className="w-4 h-4" />
                Giải Thích Thăng Bằng Electron Chuẩn:
              </div>
              <p className="text-white/90 leading-relaxed font-mono text-sm font-bold text-center py-2 px-3 rounded-xl bg-white/5 border border-white/10">
                {activeQuestion.equationDisplay}
              </p>
              <div className="space-y-1 text-white/80 pl-2">
                <p>• {activeQuestion.oxStateIncrease}</p>
                <p>• {activeQuestion.oxStateDecrease}</p>
                <p className="text-[#00F2FF] mt-1 font-semibold">{activeQuestion.explanation}</p>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleNextRound}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] hover:opacity-90 active:scale-95 text-black font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {currentRoundIndex < matchQuestions.length - 1 ? (
                <>
                  HIỆP TIẾP THEO (ROUND {currentRoundIndex + 2})
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  XEM BẢNG TỔNG KẾT & VINH DANH (PODIUM)
                  <Trophy className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ======================= STATE 5: MATCH PODIUM ======================= */}
      {arenaState === 'podium' && (
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-4xl glass-panel p-6 sm:p-10 flex flex-col gap-6">
            {/* Winner Trophy Hero */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-500 flex items-center justify-center text-black shadow-[0_0_40px_rgba(251,191,36,0.5)] border-2 border-white/30 animate-bounce">
                <Trophy className="w-12 h-12 sm:w-14 sm:h-14 fill-black" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-widest">
                <Award className="w-4 h-4" />
                ĐẠI CHIẾN HOÀN TẤT • QUÁN QUÂN ĐẤU TRƯỜNG
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400 uppercase tracking-tight">
                {overallWinner === 'p1'
                  ? `⚡ ${p1.name} CHIẾN THẮNG!`
                  : overallWinner === 'p2'
                  ? `🟣 ${p2.name} CHIẾN THẮNG!`
                  : 'TRẬN ĐẤU BẤT PHÂN THẮNG BẠI (HÒA)!'}
              </h1>
            </div>

            {/* Score Comparison Podium */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-6 rounded-3xl text-center border-2 transition-all ${
                  overallWinner === 'p1'
                    ? 'bg-[#00F2FF]/20 border-[#00F2FF] shadow-[0_0_30px_rgba(0,242,255,0.3)]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="text-sm font-black text-[#00F2FF] uppercase mb-1">{p1.name}</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-2">{p1.score}</div>
                <div className="text-xs text-white/70 space-y-1 font-medium">
                  <div>🏆 Số hiệp thắng: <strong className="text-white font-mono">{p1.roundWins}</strong></div>
                  <div>⚡ Chuỗi thắng cao nhất: <strong className="text-amber-300 font-mono">{p1.streak}</strong></div>
                </div>
              </div>

              <div
                className={`p-6 rounded-3xl text-center border-2 transition-all ${
                  overallWinner === 'p2'
                    ? 'bg-[#BC13FE]/20 border-[#BC13FE] shadow-[0_0_30px_rgba(188,19,254,0.3)]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="text-sm font-black text-[#BC13FE] uppercase mb-1">{p2.name}</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white mb-2">{p2.score}</div>
                <div className="text-xs text-white/70 space-y-1 font-medium">
                  <div>🏆 Số hiệp thắng: <strong className="text-white font-mono">{p2.roundWins}</strong></div>
                  <div>⚡ Chuỗi thắng cao nhất: <strong className="text-amber-300 font-mono">{p2.streak}</strong></div>
                </div>
              </div>
            </div>

            {/* Match Rounds Breakdown Table */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto space-y-2">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                Chi Tiết Từng Hiệp Đấu:
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-[11px]">
                    <th className="pb-2">Hiệp</th>
                    <th className="pb-2">Phương Trình</th>
                    <th className="pb-2 text-[#00F2FF]">{p1.name}</th>
                    <th className="pb-2 text-[#BC13FE]">{p2.name}</th>
                    <th className="pb-2 text-right">Người Thắng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {roundResults.map((r) => (
                    <tr key={r.roundNumber} className="py-2 text-white/80">
                      <td className="py-2 font-bold text-amber-300">#{r.roundNumber}</td>
                      <td className="py-2 max-w-[200px] truncate">{r.equationDisplay}</td>
                      <td className="py-2">
                        {r.p1Correct ? (
                          <span className="text-emerald-400 font-bold">+{r.p1ScoreGained} ({r.p1TimeSeconds}s)</span>
                        ) : (
                          <span className="text-rose-400">Sai</span>
                        )}
                      </td>
                      <td className="py-2">
                        {r.p2Correct ? (
                          <span className="text-emerald-400 font-bold">+{r.p2ScoreGained} ({r.p2TimeSeconds}s)</span>
                        ) : (
                          <span className="text-rose-400">Sai</span>
                        )}
                      </td>
                      <td className="py-2 text-right font-bold">
                        {r.winner === 'p1' ? (
                          <span className="text-[#00F2FF]">P1</span>
                        ) : r.winner === 'p2' ? (
                          <span className="text-[#BC13FE]">P2</span>
                        ) : (
                          <span className="text-white/50">Hòa</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleStartDuel}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] hover:opacity-90 active:scale-95 text-black font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                TÁI ĐẤU (REMATCH)
              </button>

              <button
                type="button"
                onClick={() => setArenaState('lobby')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm uppercase tracking-wider border border-white/10 transition-all"
              >
                Cài Đặt Phòng
              </button>

              <button
                type="button"
                onClick={onBackToCampaign}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 font-bold text-sm uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Về Cốt Truyện
              </button>

              {onGoHome && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onGoHome();
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 active:scale-95 font-bold text-sm uppercase tracking-wider border border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Home className="w-4 h-4" />
                  Về Trang Chủ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
