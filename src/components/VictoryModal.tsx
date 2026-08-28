import React from 'react';
import { Trophy, RotateCcw, Award, Flame, CheckCircle, RefreshCw, Download, Sparkles, BookOpen, Home } from 'lucide-react';
import { Badge, UserAnswerRecord } from '../types';
import { sound } from '../utils/audioSynth';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  maxStreak: number;
  badges: Badge[];
  userAnswers: UserAnswerRecord[];
  onReplayShuffle: () => void;
  onReviewMistakes: () => void;
  onDownloadHtml: () => void;
  onGoHome?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  totalCorrect,
  totalQuestions,
  maxStreak,
  badges,
  userAnswers,
  onReplayShuffle,
  onReviewMistakes,
  onDownloadHtml,
  onGoHome,
}) => {
  if (!isOpen) return null;

  const wrongAnswers = userAnswers.filter((a) => !a.isCorrect);
  const accuracy = Math.round((totalCorrect / Math.max(1, totalQuestions)) * 100);

  // Pedagogical evaluation
  let evaluation = {
    title: 'Đặc Vụ Huyền Thoại Redox!',
    desc: 'Xuất sắc tuyệt đối! Em đã làm chủ hoàn toàn bản chất chuyển giao electron và định luật bảo toàn e trong mọi phương trình oxi hóa - khử phức tạp.',
    grade: 'Hạng S+ (Tuyệt Đỉnh)',
    color: 'from-amber-400 to-yellow-200',
  };

  if (accuracy < 60) {
    evaluation = {
      title: 'Đặc Vụ Tập Sự Triển Vọng',
      desc: 'Em đã nắm được cấu trúc cơ bản nhưng cần chú ý hơn về số oxi hóa trong môi trường axit đặc/loãng và phương pháp nhân hệ số chéo.',
      grade: 'Hạng B (Cần Rèn Luyện Thêm)',
      color: 'from-blue-400 to-cyan-200',
    };
  } else if (accuracy < 85) {
    evaluation = {
      title: 'Chuyên Gia Cân Bằng Cấp Cao',
      desc: 'Kỹ năng thăng bằng electron rất tốt! Em xử lý mượt mà hầu hết các phản ứng, chỉ vấp phải một số chất môi trường ở Hồi 3.',
      grade: 'Hạng A (Rất Giỏi)',
      color: 'from-emerald-400 to-teal-200',
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col glass-panel border border-white/20 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#BC13FE]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00F2FF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 text-center border-b border-white/10 bg-black/40 relative z-10">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#00F2FF] to-[#BC13FE] flex items-center justify-center text-black shadow-xl shadow-cyan-500/30 animate-bounce">
            <Trophy className="w-9 h-9" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40 uppercase tracking-wider">
            {evaluation.grade}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r ${evaluation.color}`}>
            {evaluation.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto mt-1 leading-relaxed">
            {evaluation.desc}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 relative z-10">
          {/* Key Stats 3-Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl glass-panel-subtle text-center">
              <span className="text-[10px] text-white/50 font-mono uppercase">Năng Lượng</span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">{score} <span className="text-xs font-normal">MW</span></div>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel-subtle text-center">
              <span className="text-[10px] text-white/50 font-mono uppercase">Độ Chính Xác</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5">{totalCorrect}/{totalQuestions} <span className="text-xs font-normal">({accuracy}%)</span></div>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel-subtle text-center">
              <span className="text-[10px] text-white/50 font-mono uppercase">Chuỗi Max</span>
              <div className="text-xl sm:text-2xl font-black text-[#BC13FE] mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-[#BC13FE]" />
                {maxStreak}x
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="p-4 rounded-2xl glass-panel-subtle">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00F2FF] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#00F2FF]" />
              Bộ Sưu Tập Huy Hiệu Đặc Vụ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    b.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-black/40 border-white/5 text-white/30 opacity-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${b.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/30'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{b.name}</div>
                    <div className="text-[10px] text-white/50 truncate">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mistakes Summary if any */}
          {wrongAnswers.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Phát hiện {wrongAnswers.length} câu cần ôn tập củng cố:
              </h4>
              <ul className="space-y-1 text-xs text-white/80">
                {wrongAnswers.map((w, idx) => (
                  <li key={`wrong-${idx}`} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Hồi {w.act}: <strong className="text-white">{w.questionTitle}</strong></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            {onGoHome && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onGoHome();
                }}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 transition-all active:scale-95 flex items-center gap-1.5 border border-white/15 hover:border-rose-500/40"
              >
                <Home className="w-4 h-4 text-rose-400" />
                Về Trang Chủ
              </button>
            )}

            {wrongAnswers.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onReviewMistakes();
                }}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#BC13FE] hover:opacity-90 text-white transition-all active:scale-95 shadow-md flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                Ôn Lại Câu Sai ({wrongAnswers.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onReplayShuffle();
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 flex items-center gap-1.5 border border-white/15"
            >
              <RotateCcw className="w-4 h-4" />
              Chơi Lại (Xáo Trộn)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playVictory();
              onDownloadHtml();
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] hover:opacity-90 text-black transition-all active:scale-95 shadow-lg shadow-cyan-500/30 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Tải File HTML Độc Lập
          </button>
        </div>
      </div>
    </div>
  );
};
