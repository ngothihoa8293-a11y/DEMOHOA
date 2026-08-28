import React, { useState, useEffect } from 'react';
import { ElectronTransferQuestion } from '../types';
import { sound } from '../utils/audioSynth';
import { VirtualLabExperiment } from './VirtualLabExperiment';
import { Zap, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface Act1DragDropProps {
  question: ElectronTransferQuestion;
  onCorrect: () => void;
  onWrong: () => void;
}

export const Act1DragDrop: React.FC<Act1DragDropProps> = ({
  question,
  onCorrect,
  onWrong,
}) => {
  const [transferredCount, setTransferredCount] = useState<number>(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Reset local state when question changes
  useEffect(() => {
    setTransferredCount(0);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setIsDragging(false);
    setIsShaking(false);
  }, [question.id]);

  const remainingInReducer = question.electronCount - transferredCount;

  // Real-time calculated oxidation state for Reducer
  const currentReducerOx =
    question.reducer.initialOxState +
    transferredCount * ((question.reducer.finalOxState - question.reducer.initialOxState) / question.electronCount);

  // Real-time calculated oxidation state for Oxidizer
  const currentOxidizerOx =
    question.oxidizer.initialOxState -
    transferredCount * ((question.oxidizer.initialOxState - question.oxidizer.finalOxState) / question.electronCount);

  const formatOxNumber = (num: number) => {
    if (num > 0) return `+${num}`;
    if (num === 0) return `0`;
    return `${num}`;
  };

  const handleTransferOneElectron = () => {
    if (isAnswerChecked && isCorrect) return;
    if (remainingInReducer > 0) {
      sound.playElectronPickup();
      sound.playElectronSnap();
      setTransferredCount((prev) => prev + 1);
    }
  };

  const handleReturnOneElectron = () => {
    if (isAnswerChecked && isCorrect) return;
    if (transferredCount > 0) {
      sound.playElectronPickup();
      setTransferredCount((prev) => prev - 1);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'electron');
    setIsDragging(true);
    sound.playElectronPickup();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleTransferOneElectron();
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked && isCorrect) return;

    if (transferredCount === question.electronCount) {
      setIsAnswerChecked(true);
      setIsCorrect(true);
      sound.playCorrect();
      onCorrect();
    } else {
      setIsAnswerChecked(true);
      setIsCorrect(false);
      setIsShaking(true);
      sound.playWrong();
      onWrong();
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setTransferredCount(0);
    setIsAnswerChecked(false);
    setIsCorrect(null);
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {/* Title and Equation Card */}
      <div className="glass-panel p-4 sm:p-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40">
            HỒI 1: BẢN CHẤT NHƯỜNG - NHẬN e⁻
          </span>
          <span className="text-xs font-mono text-white/70">
            Nhu cầu chuyển giao: <strong className="text-[#00F2FF]">{question.electronCount} hạt e⁻</strong>
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
          {question.title}
        </h3>

        {/* Big Glow Chemical Equation */}
        <div className="my-3 py-3 px-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-center shadow-inner">
          <span className="text-lg sm:text-2xl font-mono font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#00F2FF] to-[#BC13FE]">
            {question.chemicalEquation}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          {question.subtitle}
        </p>
      </div>

      {/* 2.5D Electron Transfer Chambers */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 sm:gap-4 items-center">
        {/* Left Chamber: Reducing Agent (Chất Khử - Nhường e⁻) */}
        <div className="md:col-span-5 glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[260px] border-t-2 border-t-[#BC13FE]">
          {/* Chamber Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#BC13FE]/20 text-[#BC13FE] border border-[#BC13FE]/40">
                CHẤT KHỬ (NHƯỜNG e⁻)
              </span>
              <span className="text-xs font-bold text-[#BC13FE] font-mono">
                Số oxi hóa: {formatOxNumber(currentReducerOx)}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {question.reducer.name}
            </h4>
            <p className="text-xs text-white/60 mb-3">
              {question.reducer.description}
            </p>
          </div>

          {/* Electron Particles in Reducing Chamber */}
          <div className="glass-panel-subtle p-3 flex flex-col items-center justify-center my-2 min-h-[110px]">
            <div className="text-[11px] text-white/60 uppercase font-mono mb-2">
              Kho hạt Electron khả dụng: {remainingInReducer}/{question.electronCount}
            </div>

            {/* Interactive Electron Particles */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {Array.from({ length: question.electronCount }).map((_, idx) => {
                const isTransferred = idx < transferredCount;
                return (
                  <div
                    key={`electron-source-${idx}`}
                    draggable={!isTransferred && !isCorrect}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      if (!isTransferred) handleTransferOneElectron();
                    }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300 select-none ${
                      isTransferred
                        ? 'border border-white/10 bg-white/5 opacity-25 cursor-not-allowed'
                        : 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.7)] cursor-grab active:cursor-grabbing hover:scale-110 animate-pulse'
                    }`}
                    title={isTransferred ? 'Đã chuyển' : 'Kéo hoặc Chạm để chuyển electron'}
                  >
                    <span className="text-xs sm:text-sm font-black">e⁻</span>
                    <span className="text-[8px] font-mono leading-none">(-1)</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[#BC13FE] font-medium mt-3 text-center">
              💡 Chạm/Click hạt e⁻ hoặc Kéo sang phải để chuyển e!
            </p>
          </div>

          {/* Chamber Footer Status */}
          <div className="text-xs text-white/60 font-mono flex items-center justify-between pt-2 border-t border-white/10">
            <span>Trạng thái: {question.reducer.symbol}</span>
            <span className="text-[#BC13FE] font-bold">Đã nhường: {transferredCount}e⁻</span>
          </div>
        </div>

        {/* Center Transfer Bridge / Plasma Beam */}
        <div className="md:col-span-1 flex md:flex-col items-center justify-center py-2 md:py-0 gap-2">
          <div className="flex flex-col items-center justify-center">
            <div className={`p-2.5 rounded-full border transition-all duration-300 ${
              transferredCount > 0
                ? 'bg-[#00F2FF]/20 border-[#00F2FF] text-[#00F2FF] shadow-[0_0_16px_rgba(0,242,255,0.6)]'
                : 'bg-white/5 border-white/15 text-white/40'
            }`}>
              <ArrowRight className="w-5 h-5 hidden md:block" />
              <Zap className="w-5 h-5 md:hidden" />
            </div>
            <span className="text-[10px] font-mono text-[#00F2FF] font-bold mt-1">
              {transferredCount}e⁻
            </span>
          </div>
        </div>

        {/* Right Chamber: Oxidizing Agent (Chất Oxi Hóa - Nhận e⁻) */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            if (remainingInReducer > 0) handleTransferOneElectron();
          }}
          className={`md:col-span-5 glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[260px] transition-all duration-300 border-t-2 border-t-[#00F2FF] ${
            isDragging
              ? 'border-[#00F2FF] bg-cyan-950/60 shadow-[0_0_25px_rgba(0,242,255,0.4)]'
              : ''
          }`}
        >
          {/* Chamber Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40">
                CHẤT OXI HÓA (NHẬN e⁻)
              </span>
              <span className="text-xs font-bold text-[#00F2FF] font-mono">
                Số oxi hóa: {formatOxNumber(currentOxidizerOx)}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {question.oxidizer.name}
            </h4>
            <p className="text-xs text-white/60 mb-3">
              {question.oxidizer.description}
            </p>
          </div>

          {/* Electron Particles in Oxidizing Chamber (Target Dropzone) */}
          <div className="glass-panel-subtle p-3 border-2 border-dashed border-[#00F2FF]/40 flex flex-col items-center justify-center my-2 min-h-[110px] hover:border-[#00F2FF] transition-colors">
            <div className="text-[11px] text-white/60 uppercase font-mono mb-2">
              Vùng tiếp nhận Electron: {transferredCount}/{question.electronCount}
            </div>

            {/* Transferred electron slots */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {Array.from({ length: question.electronCount }).map((_, idx) => {
                const isFilled = idx < transferredCount;
                return (
                  <div
                    key={`electron-target-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFilled) handleReturnOneElectron();
                    }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300 select-none ${
                      isFilled
                        ? 'bg-gradient-to-tr from-[#00F2FF] to-sky-300 text-black font-black shadow-[0_0_15px_rgba(0,242,255,0.8)] cursor-pointer hover:scale-105 animate-pulse'
                        : 'border-2 border-dashed border-white/20 bg-white/5 text-white/30'
                    }`}
                    title={isFilled ? 'Bấm để hoàn lại' : 'Thả hạt e⁻ vào đây'}
                  >
                    {isFilled ? (
                      <>
                        <span className="text-xs sm:text-sm font-black">e⁻</span>
                        <span className="text-[8px] font-mono leading-none">(-1)</span>
                      </>
                    ) : (
                      <span className="text-xs font-mono opacity-50">+</span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[#00F2FF] font-medium mt-3 text-center">
              🎯 Thả hạt e⁻ vào đây (hoặc click để nạp e)
            </p>
          </div>

          {/* Chamber Footer Status */}
          <div className="text-xs text-white/60 font-mono flex items-center justify-between pt-2 border-t border-white/10">
            <span>Trạng thái: {question.oxidizer.symbol}</span>
            <span className="text-[#00F2FF] font-bold">Đã nhận: {transferredCount}e⁻</span>
          </div>
        </div>
      </div>

      {/* 3D / Real Virtual Lab Experiment Simulation */}
      {question.experimentData && (
        <VirtualLabExperiment
          experimentData={question.experimentData}
          isReactionTriggered={isAnswerChecked && isCorrect === true}
        />
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel border border-white/10">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/15 text-white/80 border border-white/15 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          Làm Lại
        </button>

        <button
          type="button"
          onClick={handleCheckAnswer}
          disabled={isAnswerChecked && isCorrect === true}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 tracking-wider uppercase ${
            isAnswerChecked && isCorrect
              ? 'bg-emerald-600 text-white cursor-default shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] hover:opacity-90 text-black active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.4)]'
          }`}
        >
          {isAnswerChecked && isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              ĐÃ HOÀN THÀNH XUẤT SẮC!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              XÁC NHẬN CHUYỂN ELECTRON
            </>
          )}
        </button>
      </div>

      {/* Explanation / Feedback Feedback Box */}
      {isAnswerChecked && (
        <div
          className={`p-4 rounded-2xl border glass-panel transition-all duration-300 ${
            isCorrect
              ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'border-rose-500/50 bg-rose-950/30 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Chính xác! Lò phản ứng đã kích hoạt thành công!</span>
              </>
            ) : (
              <>
                <span className="text-rose-400 font-bold">⚠️ Số electron chuyển giao chưa đúng!</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm mb-2 text-white/80 leading-relaxed">
            {question.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 text-[#BC13FE] border border-[#BC13FE]/30">
              Quá trình oxi hóa: {question.halfOxidation}
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 text-[#00F2FF] border border-[#00F2FF]/30">
              Quá trình khử: {question.halfReduction}
            </div>
          </div>

          <div className="mt-2 text-xs font-sans text-amber-300 italic flex items-center gap-1.5">
            <span>💡 Mẹo:</span>
            <span>{question.pedagogicalTip}</span>
          </div>
        </div>
      )}
    </div>
  );
};
