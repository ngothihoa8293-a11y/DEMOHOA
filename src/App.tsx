import React, { useState, useMemo } from 'react';
import { GameAct, Badge, UserAnswerRecord } from './types';
import { ACT1_QUESTIONS, ACT2_QUESTIONS, ACT3_QUESTIONS, INITIAL_BADGES } from './data/chemistryData';
import { sound } from './utils/audioSynth';
import { launchConfetti } from './utils/confetti';
import { downloadStandaloneHtml } from './utils/standaloneHtmlExporter';
import { GameHeader } from './components/GameHeader';
import { AIAssistant } from './components/AIAssistant';
import { Act1DragDrop } from './components/Act1DragDrop';
import { Act2Act3Sliders } from './components/Act2Act3Sliders';
import { RedoxCheatSheetModal } from './components/RedoxCheatSheetModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { VictoryModal } from './components/VictoryModal';
import { RedoxPvPArena } from './components/RedoxPvPArena';
import { VirtualLabModal } from './components/VirtualLabModal';
import { Play, Sparkles, BookOpen, GraduationCap, Volume2, VolumeX, ArrowRight, RotateCcw, ShieldCheck, Flame, Atom, Swords, FlaskConical } from 'lucide-react';

export default function App() {
  // Navigation & Screen State
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'victory' | 'pvp'>('welcome');
  const [currentAct, setCurrentAct] = useState<GameAct>(1);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  // Score & Progress Metrics
  const [energyScore, setEnergyScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [reviewMistakeIds, setReviewMistakeIds] = useState<string[]>([]);

  // Sound State
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modal Dialogs
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isVirtualLabOpen, setIsVirtualLabOpen] = useState<boolean>(false);

  // Active Questions List per Act
  const currentQuestionList = useMemo(() => {
    let list = currentAct === 1 ? ACT1_QUESTIONS : currentAct === 2 ? ACT2_QUESTIONS : ACT3_QUESTIONS;
    if (isReviewMode && reviewMistakeIds.length > 0) {
      const filtered = list.filter((q) => reviewMistakeIds.includes(q.id));
      return filtered.length > 0 ? filtered : list;
    }
    return list;
  }, [currentAct, isReviewMode, reviewMistakeIds]);

  const activeQuestion = currentQuestionList[questionIndex] || currentQuestionList[0];

  // Dynamic Background styling based on Act
  const actBgStyle = useMemo(() => {
    if (currentAct === 1) {
      return 'border-[#00F2FF]/30 shadow-[0_0_30px_rgba(0,242,255,0.15)]';
    } else if (currentAct === 2) {
      return 'border-[#BC13FE]/30 shadow-[0_0_30px_rgba(188,19,254,0.15)]';
    } else {
      return 'border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.15)]';
    }
  }, [currentAct]);

  // AI Robot reactive speech
  const robotMood = useMemo(() => {
    if (gameState === 'victory') return 'cheer';
    if (streak >= 3) return 'happy';
    if (currentAct === 3) return 'alert';
    return 'normal';
  }, [gameState, streak, currentAct]);

  const robotSpeech = useMemo(() => {
    if (gameState === 'welcome') {
      return 'Xin chào Đặc vụ Hóa học! Lò phản ứng electron đang cần hiệu chuẩn. Hãy cùng tôi giải mã 3 hồi chiến dịch!';
    }
    if (currentAct === 1) {
      return `Hồi 1 (Câu ${questionIndex + 1}/${currentQuestionList.length}): Hãy kéo thả các hạt electron e⁻ từ chất khử sang chất oxi hóa theo đúng bản chất!`;
    }
    if (currentAct === 2) {
      return `Hồi 2 (Câu ${questionIndex + 1}/${currentQuestionList.length}): Sử dụng thanh trượt hệ số để Cán cân điện tử đạt trạng thái thăng bằng hoàn hảo!`;
    }
    return `Hồi 3 (Cảnh báo quá tải - Câu ${questionIndex + 1}/${currentQuestionList.length}): Các phản ứng phức tạp với chất môi trường! Hãy tính toán cẩn trọng số e nhường/nhận.`;
  }, [gameState, currentAct, questionIndex, currentQuestionList.length]);

  // Handle Sound Toggle
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start Playing Game
  const handleStartGame = () => {
    sound.playClick();
    sound.playCorrect();
    setGameState('playing');
    setCurrentAct(1);
    setQuestionIndex(0);
  };

  // Unlock Badge Helper
  const checkAndUnlockBadges = (actCompleted: number, newStreak: number) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.unlocked) return b;
        if (b.id === 'badge-act1' && actCompleted >= 1) return { ...b, unlocked: true };
        if (b.id === 'badge-act2' && actCompleted >= 2) return { ...b, unlocked: true };
        if (b.id === 'badge-act3' && actCompleted >= 3) return { ...b, unlocked: true };
        if (b.id === 'badge-streak' && newStreak >= 3) return { ...b, unlocked: true };
        return b;
      })
    );
  };

  // Handle Correct Answer
  const handleQuestionCorrect = () => {
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    if (nextStreak > maxStreak) {
      setMaxStreak(nextStreak);
    }

    // Energy points calculation with streak bonus
    const baseEnergy = currentAct === 1 ? 100 : currentAct === 2 ? 150 : 250;
    const streakBonus = Math.min(100, (nextStreak - 1) * 25);
    const addedScore = baseEnergy + streakBonus;
    setEnergyScore((prev) => prev + addedScore);

    // Save user record (prevent multiple scoring for same question in turn)
    setUserAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === activeQuestion.id);
      if (existing) return prev;
      return [
        ...prev,
        {
          questionId: activeQuestion.id,
          questionTitle: activeQuestion.title,
          act: currentAct,
          isCorrect: true,
          attempts: 1,
          explanation: activeQuestion.explanation,
        },
      ];
    });

    checkAndUnlockBadges(currentAct, nextStreak);
    launchConfetti();
  };

  // Handle Wrong Answer
  const handleQuestionWrong = () => {
    setStreak(0);
    setUserAnswers((prev) => {
      const existingIdx = prev.findIndex((a) => a.questionId === activeQuestion.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].isCorrect = false;
        copy[existingIdx].attempts += 1;
        return copy;
      }
      return [
        ...prev,
        {
          questionId: activeQuestion.id,
          questionTitle: activeQuestion.title,
          act: currentAct,
          isCorrect: false,
          attempts: 1,
          explanation: activeQuestion.explanation,
        },
      ];
    });
  };

  // Next Question or Next Act
  const handleNextQuestion = () => {
    sound.playClick();
    if (questionIndex < currentQuestionList.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      // Act Completed!
      if (currentAct === 1) {
        sound.playVictory();
        launchConfetti();
        setCurrentAct(2);
        setQuestionIndex(0);
        checkAndUnlockBadges(1, streak);
      } else if (currentAct === 2) {
        sound.playVictory();
        launchConfetti();
        setCurrentAct(3);
        setQuestionIndex(0);
        checkAndUnlockBadges(2, streak);
      } else {
        // Complete All 3 Acts!
        sound.playVictory();
        launchConfetti();
        checkAndUnlockBadges(3, streak);
        setGameState('victory');
      }
    }
  };

  // Switch Act Directly from Navbar
  const handleSwitchAct = (act: GameAct) => {
    sound.playClick();
    setCurrentAct(act);
    setQuestionIndex(0);
  };

  // Review Mistakes Mode
  const handleReviewMistakes = () => {
    const wrongIds = userAnswers.filter((a) => !a.isCorrect).map((a) => a.questionId);
    if (wrongIds.length === 0) return;
    setReviewMistakeIds(wrongIds);
    setIsReviewMode(true);
    // Find earliest act with wrong answer
    const firstWrong = userAnswers.find((a) => !a.isCorrect);
    setCurrentAct(firstWrong?.act || 1);
    setQuestionIndex(0);
    setGameState('playing');
  };

  // Shuffle Replay
  const handleReplayShuffle = () => {
    setIsReviewMode(false);
    setReviewMistakeIds([]);
    setQuestionIndex(0);
    setCurrentAct(1);
    setStreak(0);
    setEnergyScore(0);
    setUserAnswers([]);
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans relative selection:bg-[#00F2FF] selection:text-black overflow-x-hidden">
      {/* Grid Pattern and Ambient Sci-Fi Glow */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-60 z-0" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-[#00F2FF]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#BC13FE]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-[#00F2FF]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl w-full mx-auto p-3 sm:p-5 flex-1 flex flex-col gap-4 relative z-10">
        {/* WELCOME SCREEN */}
        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
            <div className="w-full max-w-3xl glass-panel p-6 sm:p-10 relative overflow-hidden flex flex-col items-center text-center">
              {/* Geometric Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F2FF] to-[#BC13FE]" />

              {/* 2.5D Animated Atomic Reactor Core */}
              <div className="relative mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#00F2FF] via-cyan-600 to-[#BC13FE] flex items-center justify-center text-white shadow-[0_0_40px_rgba(0,242,255,0.5)] border-2 border-white/30">
                  <Atom className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-spin" style={{ animationDuration: '12s' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#00F2FF] flex items-center justify-center text-black font-black text-xs shadow-md animate-bounce">
                  ⚡
                </div>
              </div>

              {/* Sub-badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F2FF]/15 text-[#00F2FF] border border-[#00F2FF]/40 text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                HÓA HỌC 10 THPT • CHUYÊN ĐỀ PHẢN ỨNG OXI HÓA - KHỬ
              </div>

              {/* Main Game Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#BC13FE] uppercase tracking-tight mb-2">
                Đại Chiến Phản Ứng Oxi Hóa - Khử
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#00F2FF] uppercase tracking-wider mb-4 font-mono">
                ⚡ Phương Pháp Thăng Bằng Electron Tương Tác ⚡
              </p>

              {/* 3-Line Sci-Fi Story Context */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white/80 max-w-xl mb-6 leading-relaxed text-left space-y-2 font-medium">
                <p className="flex items-start gap-2">
                  <span className="text-[#00F2FF] font-bold">1.</span>
                  <span><strong>Bối cảnh:</strong> Bạn là Nhà Hóa Học Trẻ được cử đến Phòng Thí Nghiệm Phản Ứng để kiểm soát sự trao đổi electron.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#BC13FE] font-bold">2.</span>
                  <span><strong>Nhiệm vụ:</strong> Cùng AI Robot ORBIT-10 chinh phục 3 hồi: Bản chất nhường/nhận e⁻ &rarr; Thăng bằng electron cơ bản &rarr; Đại chiến quá tải Redox.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <span><strong>Mục tiêu:</strong> Khắc sâu quy tắc <em className="text-amber-300 font-semibold">"Khử cho - O nhận"</em> và nghiệm đúng định luật bảo toàn electron (<span className="text-emerald-300 font-mono font-bold">Tổng e⁻ nhường = Tổng e⁻ nhận</span>).</span>
                </p>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mb-6">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 hover:opacity-95 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,242,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  CHIẾN DỊCH 1P
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setGameState('pvp');
                  }}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#BC13FE] to-purple-600 hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(188,19,254,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 relative group"
                >
                  <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black tracking-widest border border-amber-300 shadow-md">
                    HOT 2P
                  </span>
                  <Swords className="w-4 h-4 text-[#00F2FF]" />
                  ĐẤU TRƯỜNG PVP KAHOOT
                </button>
              </div>

              {/* Auxiliary Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsVirtualLabOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#00F2FF]/10 hover:bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40 flex items-center gap-1.5 font-bold transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                >
                  <FlaskConical className="w-4 h-4 text-[#00F2FF]" />
                  Phòng Thí Nghiệm Ảo 3D
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsCheatSheetOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#00F2FF] border border-[#00F2FF]/30 flex items-center gap-1.5 font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Sổ Tay Bí Thuật Hóa 10
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsTeacherGuideOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-medium transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Góc Sư Phạm & Tải HTML
                </button>

                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 border border-white/15 flex items-center gap-1.5 font-medium transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00F2FF]" />}
                  {isMuted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div className="flex flex-col gap-4">
            {/* Header with Stats and Act Navigation */}
            <GameHeader
              currentAct={currentAct}
              currentQuestionIndex={questionIndex}
              totalQuestionsInAct={currentQuestionList.length}
              energyScore={energyScore}
              streak={streak}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
              onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
              onOpenVirtualLab={() => setIsVirtualLabOpen(true)}
              onOpenPvP={() => {
                sound.playClick();
                setGameState('pvp');
              }}
              onGoHome={() => {
                sound.playClick();
                setGameState('welcome');
              }}
              onChangeAct={handleSwitchAct}
            />

            {/* AI Assistant Dialogue Bar */}
            <AIAssistant
              act={currentAct}
              mood={robotMood}
              speech={robotSpeech}
              subHint={
                currentAct === 1
                  ? 'Ghi nhớ: "Khử Cho - O Nhận". Kéo hoặc chạm vào hạt electron để truyền đi!'
                  : 'Cán cân sẽ nằm ngang tuyệt đối khi tổng số mol e nhường bằng tổng số mol e nhận.'
              }
            />

            {/* Main Interactive Mechanism Card */}
            <div className={`p-4 sm:p-6 rounded-3xl glass-panel ${actBgStyle} transition-all duration-500`}>
              {currentAct === 1 ? (
                <Act1DragDrop
                  key={`act1-q-${activeQuestion.id}`}
                  question={activeQuestion as any}
                  onCorrect={handleQuestionCorrect}
                  onWrong={handleQuestionWrong}
                />
              ) : (
                <Act2Act3Sliders
                  key={`act-sliders-${activeQuestion.id}`}
                  question={activeQuestion as any}
                  onCorrect={handleQuestionCorrect}
                  onWrong={handleQuestionWrong}
                />
              )}

              {/* Bottom Next Question Navigation Bar */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50 font-mono">
                  Tiến trình: Câu {questionIndex + 1} / {currentQuestionList.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] hover:opacity-90 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all uppercase tracking-wider"
                >
                  <span>
                    {questionIndex < currentQuestionList.length - 1
                      ? 'Câu Tiếp Theo'
                      : currentAct < 3
                      ? `Tiến Lên Hồi ${currentAct + 1} →`
                      : 'Hoàn Thành Chiến Dịch 🏆'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PVP ARENA SCREEN (2-PLAYER DUEL / KAHOOT MODE) */}
        {gameState === 'pvp' && (
          <RedoxPvPArena
            onBackToCampaign={() => setGameState('playing')}
            onGoHome={() => {
              sound.playClick();
              setGameState('welcome');
            }}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* VICTORY & ACHIEVEMENTS SCREEN */}
        {gameState === 'victory' && (
          <VictoryModal
            isOpen={true}
            score={energyScore}
            totalCorrect={userAnswers.filter((a) => a.isCorrect).length}
            totalQuestions={ACT1_QUESTIONS.length + ACT2_QUESTIONS.length + ACT3_QUESTIONS.length}
            maxStreak={maxStreak}
            badges={badges}
            userAnswers={userAnswers}
            onReplayShuffle={handleReplayShuffle}
            onReviewMistakes={handleReviewMistakes}
            onDownloadHtml={downloadStandaloneHtml}
            onGoHome={() => {
              sound.playClick();
              setGameState('welcome');
            }}
          />
        )}

        {/* Bottom Sci-Fi Telemetry Footer */}
        <footer className="mt-auto py-3 border-t border-white/5 text-[10px] text-white/40 flex flex-wrap items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-ping" />
            <span>THIẾT BỊ ĐÃ KẾT NỐI: REACTOR_X_440</span>
          </div>
          <div>
            <span>PHIÊN BẢN V2.0.4 • GEOMETRIC BALANCE LABS</span>
          </div>
        </footer>
      </div>

      {/* Sổ Tay Oxi Hóa Khử Modal */}
      <RedoxCheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      {/* Góc Sư Phạm Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        onDownloadStandaloneHtml={downloadStandaloneHtml}
      />

      {/* Phòng Thí Nghiệm Ảo Thực Tế Modal */}
      <VirtualLabModal
        isOpen={isVirtualLabOpen}
        onClose={() => setIsVirtualLabOpen(false)}
      />
    </div>
  );
}
