import React, { useState, useEffect, useMemo } from 'react';
import { BalancedEquationQuestion } from '../types';
import { sound } from '../utils/audioSynth';
import { ElectronBalanceScale } from './ElectronBalanceScale';
import { VirtualLabExperiment } from './VirtualLabExperiment';
import { CheckCircle2, RotateCcw, Sparkles, Minus, Plus, HelpCircle } from 'lucide-react';

interface Act2Act3SlidersProps {
  question: BalancedEquationQuestion;
  onCorrect: () => void;
  onWrong: () => void;
}

export const Act2Act3Sliders: React.FC<Act2Act3SlidersProps> = ({
  question,
  onCorrect,
  onWrong,
}) => {
  // Coefficients state for reactants and products
  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>([]);
  const [productCoeffs, setProductCoeffs] = useState<number[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Initialize coefficients
  useEffect(() => {
    setReactantCoeffs(question.reactants.map((r) => r.initialCoeff || 1));
    setProductCoeffs(question.products.map((p) => p.initialCoeff || 1));
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setIsShaking(false);
    setShowHint(false);
  }, [question.id]);

  // Compute calculated electron loss and gain based on current user coefficients
  const { currentElectronsLost, currentElectronsGained } = useMemo(() => {
    let loss = 0;
    let gain = 0;

    // Reactants electron calculations
    question.reactants.forEach((substance, idx) => {
      const userCoeff = reactantCoeffs[idx] || 1;
      if (substance.oxStateChanges) {
        substance.oxStateChanges.forEach((change) => {
          if (change.role === 'reducer') {
            loss += userCoeff * (change.electronsExchangedPerAtom || Math.abs(change.to - change.from));
          } else if (change.role === 'oxidizer') {
            gain += userCoeff * (change.electronsExchangedPerAtom || Math.abs(change.to - change.from));
          }
        });
      }
    });

    // Fallback if not specified in oxStateChanges
    if (loss === 0) {
      loss = (reactantCoeffs[0] || 1) * question.electronLossMultiplier;
    }
    if (gain === 0) {
      gain = (reactantCoeffs[1] || 1) * question.electronGainMultiplier;
    }

    return { currentElectronsLost: loss, currentElectronsGained: gain };
  }, [reactantCoeffs, question]);

  // Check if coefficients match correct coefficients
  const isEquationCorrect = useMemo(() => {
    const reactantsMatch = reactantCoeffs.every(
      (coeff, idx) => coeff === question.reactants[idx].correctCoeff
    );
    const productsMatch = productCoeffs.every(
      (coeff, idx) => coeff === question.products[idx].correctCoeff
    );
    return reactantsMatch && productsMatch;
  }, [reactantCoeffs, productCoeffs, question]);

  const isElectronScaleBalanced = currentElectronsLost === currentElectronsGained && currentElectronsLost > 0;

  const handleReactantChange = (index: number, delta: number) => {
    if (isAnswerChecked && isCorrect) return;
    sound.playSliderTick();
    setReactantCoeffs((prev) => {
      const next = [...prev];
      const max = question.reactants[index].maxCoeff || 20;
      const min = question.reactants[index].minCoeff || 1;
      next[index] = Math.max(min, Math.min(max, next[index] + delta));
      return next;
    });
  };

  const handleProductChange = (index: number, delta: number) => {
    if (isAnswerChecked && isCorrect) return;
    sound.playSliderTick();
    setProductCoeffs((prev) => {
      const next = [...prev];
      const max = question.products[index].maxCoeff || 20;
      const min = question.products[index].minCoeff || 1;
      next[index] = Math.max(min, Math.min(max, next[index] + delta));
      return next;
    });
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked && isCorrect) return;

    if (isEquationCorrect) {
      setIsAnswerChecked(true);
      setIsCorrect(true);
      sound.playBalanceLocked();
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
    setReactantCoeffs(question.reactants.map(() => 1));
    setProductCoeffs(question.products.map(() => 1));
    setIsAnswerChecked(false);
    setIsCorrect(null);
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {/* Header Card */}
      <div className="glass-panel p-4 sm:p-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              question.act === 2
                ? 'bg-[#BC13FE]/20 text-[#BC13FE] border border-[#BC13FE]/40'
                : 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
            }`}>
              {question.act === 2 ? 'HỒI 2: CÂN BẰNG CƠ BẢN' : 'HỒI 3: ĐẠI CHIẾN QUÁ TẢI REDOX'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-white/80 font-mono border border-white/10">
              {question.levelLabel} • {question.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowHint((p) => !p);
            }}
            className="text-xs text-[#00F2FF] hover:text-cyan-300 flex items-center gap-1 font-medium underline-offset-2 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showHint ? 'Ẩn gợi ý' : 'Gợi ý phương pháp'}
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          {question.title}
        </h3>

        {/* Live Formulated Equation with Geometric Numbers */}
        <div className="p-3 sm:p-4 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-center gap-2 text-center text-sm sm:text-xl font-mono font-bold shadow-inner">
          {/* Reactants */}
          {question.reactants.map((r, idx) => (
            <React.Fragment key={`disp-react-${idx}`}>
              {idx > 0 && <span className="text-white/40 mx-0.5">+</span>}
              <span className="inline-flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-lg bg-[#BC13FE]/20 text-[#BC13FE] font-black border border-[#BC13FE]/50 text-base sm:text-2xl shadow-[0_0_10px_rgba(188,19,254,0.3)]">
                  {reactantCoeffs[idx] || 1}
                </span>
                <span className="text-white">{r.subscriptFormulaHtml}</span>
              </span>
            </React.Fragment>
          ))}

          {/* Arrow */}
          <span className="text-[#00F2FF] font-black text-xl sm:text-2xl mx-1.5 animate-pulse">→</span>

          {/* Products */}
          {question.products.map((p, idx) => (
            <React.Fragment key={`disp-prod-${idx}`}>
              {idx > 0 && <span className="text-white/40 mx-0.5">+</span>}
              <span className="inline-flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-lg bg-[#00F2FF]/20 text-[#00F2FF] font-black border border-[#00F2FF]/50 text-base sm:text-2xl shadow-[0_0_10px_rgba(0,242,255,0.3)]">
                  {productCoeffs[idx] || 1}
                </span>
                <span className="text-white">{p.subscriptFormulaHtml}</span>
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Hint Dropdown */}
        {showHint && (
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-[#00F2FF]/30 text-xs text-white/90 backdrop-blur-md">
            <p className="font-bold mb-1 text-[#00F2FF]">💡 Phương pháp thăng bằng electron (4 bước):</p>
            <ol className="list-decimal list-inside space-y-0.5 text-white/80">
              <li>Xác định số oxi hóa của các nguyên tố thay đổi: <strong className="text-[#BC13FE]">{question.reducerElement}</strong> và <strong className="text-[#00F2FF]">{question.oxidizerElement}</strong>.</li>
              <li>Viết quá trình nhường: <span className="text-[#BC13FE] font-mono">{question.oxStateIncrease}</span>.</li>
              <li>Viết quá trình nhận: <span className="text-[#00F2FF] font-mono">{question.oxStateDecrease}</span>.</li>
              <li>Tìm bội chung nhỏ nhất để: <strong className="text-emerald-300 font-mono">Tổng e⁻ nhường = Tổng e⁻ nhận</strong> rồi cân bằng nguyên tố còn lại.</li>
            </ol>
          </div>
        )}
      </div>

      {/* 2.5D Electron Balance Scale Simulation */}
      <ElectronBalanceScale
        electronsLost={currentElectronsLost}
        electronsGained={currentElectronsGained}
        isBalanced={isElectronScaleBalanced}
        reducerDesc={`e⁻ Nhường (${question.reducerElement})`}
        oxidizerDesc={`e⁻ Nhận (${question.oxidizerElement})`}
      />

      {/* 3D / Real Virtual Lab Experiment Simulation */}
      {question.experimentData && (
        <VirtualLabExperiment
          experimentData={question.experimentData}
          isReactionTriggered={isAnswerChecked && isCorrect === true}
          equationDisplay={question.equationDisplay}
        />
      )}

      {/* Interactive Sliders & Steppers Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reactants Controllers (Left Side - Purple Glow) */}
        <div className="glass-panel p-4 flex flex-col gap-3 border-t-2 border-t-[#BC13FE]">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-[#BC13FE] uppercase tracking-wider">
              Chất Tham Gia (Vế Trái)
            </span>
            <span className="text-[11px] text-white/50 font-mono">
              Điều chỉnh hệ số
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {question.reactants.map((substance, idx) => {
              const coeff = reactantCoeffs[idx] || 1;
              const max = substance.maxCoeff || 20;
              const min = substance.minCoeff || 1;

              return (
                <div
                  key={`react-ctrl-${idx}`}
                  className="glass-panel-subtle p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {substance.subscriptFormulaHtml}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReactantChange(idx, -1)}
                        disabled={coeff <= min || (isAnswerChecked && isCorrect === true)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors active:scale-95 border border-white/10"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-9 text-center font-mono font-black text-lg text-[#BC13FE]">
                        {coeff}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleReactantChange(idx, 1)}
                        disabled={coeff >= max || (isAnswerChecked && isCorrect === true)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors active:scale-95 border border-white/10"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={coeff}
                    disabled={isAnswerChecked && isCorrect === true}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setReactantCoeffs((prev) => {
                        const next = [...prev];
                        next[idx] = val;
                        return next;
                      });
                      sound.playSliderTick();
                    }}
                    className="w-full coefficient-slider-purple cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Products Controllers (Right Side - Cyan Glow) */}
        <div className="glass-panel p-4 flex flex-col gap-3 border-t-2 border-t-[#00F2FF]">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-[#00F2FF] uppercase tracking-wider">
              Sản Phẩm (Vế Phải)
            </span>
            <span className="text-[11px] text-white/50 font-mono">
              Điều chỉnh hệ số
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {question.products.map((substance, idx) => {
              const coeff = productCoeffs[idx] || 1;
              const max = substance.maxCoeff || 20;
              const min = substance.minCoeff || 1;

              return (
                <div
                  key={`prod-ctrl-${idx}`}
                  className="glass-panel-subtle p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {substance.subscriptFormulaHtml}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleProductChange(idx, -1)}
                        disabled={coeff <= min || (isAnswerChecked && isCorrect === true)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors active:scale-95 border border-white/10"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-9 text-center font-mono font-black text-lg text-[#00F2FF]">
                        {coeff}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleProductChange(idx, 1)}
                        disabled={coeff >= max || (isAnswerChecked && isCorrect === true)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors active:scale-95 border border-white/10"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={coeff}
                    disabled={isAnswerChecked && isCorrect === true}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setProductCoeffs((prev) => {
                        const next = [...prev];
                        next[idx] = val;
                        return next;
                      });
                      sound.playSliderTick();
                    }}
                    className="w-full coefficient-slider-cyan cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel border border-white/10">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/15 text-white/80 border border-white/15 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          Đặt Lại Hệ Số (1)
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
              ĐÃ CÂN BẰNG CHÍNH XÁC!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              KHÓA CÂN BẰNG & KIỂM TRA
            </>
          )}
        </button>
      </div>

      {/* Explanation Feedback Box */}
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
                <span className="text-emerald-300 font-bold">Cân Bằng Chuẩn Xác! Định luật bảo toàn electron được nghiệm đúng.</span>
              </>
            ) : (
              <>
                <span className="text-rose-400 font-bold">⚠️ Phương trình hoặc Cán cân electron chưa thăng bằng!</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm mb-2 text-white/80 leading-relaxed">
            {question.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 text-[#BC13FE] border border-[#BC13FE]/30">
              Quá trình oxi hóa: {question.oxStateIncrease}
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 text-[#00F2FF] border border-[#00F2FF]/30">
              Quá trình khử: {question.oxStateDecrease}
            </div>
          </div>

          <div className="mt-2 text-xs font-sans text-amber-300 italic flex items-center gap-1.5">
            <span>💡 Mẹo sư phạm:</span>
            <span>{question.pedagogicalTip}</span>
          </div>
        </div>
      )}
    </div>
  );
};
