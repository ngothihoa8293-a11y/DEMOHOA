import React, { useState } from 'react';
import { ACT1_QUESTIONS, ACT2_QUESTIONS, ACT3_QUESTIONS } from '../data/chemistryData';
import { VirtualLabExperiment } from './VirtualLabExperiment';
import { sound } from '../utils/audioSynth';
import { FlaskConical, X, Sparkles, ChevronRight, Beaker, Flame, Zap } from 'lucide-react';
import { VirtualExperimentData } from '../types';

interface VirtualLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualLabModal: React.FC<VirtualLabModalProps> = ({ isOpen, onClose }) => {
  // Collect all experiments across all acts
  const allExperiments: {
    id: string;
    act: number;
    title: string;
    equation: string;
    experiment: VirtualExperimentData;
  }[] = [];

  ACT1_QUESTIONS.forEach((q) => {
    if (q.experimentData) {
      allExperiments.push({
        id: q.id,
        act: 1,
        title: q.title,
        equation: `${q.reducer.symbol} + ${q.oxidizer.symbol} → Phản ứng Redox`,
        experiment: q.experimentData,
      });
    }
  });

  ACT2_QUESTIONS.forEach((q) => {
    if (q.experimentData) {
      allExperiments.push({
        id: q.id,
        act: 2,
        title: q.title,
        equation: q.equationDisplay,
        experiment: q.experimentData,
      });
    }
  });

  ACT3_QUESTIONS.forEach((q) => {
    if (q.experimentData) {
      allExperiments.push({
        id: q.id,
        act: 3,
        title: q.title,
        equation: q.equationDisplay,
        experiment: q.experimentData,
      });
    }
  });

  const [selectedExpId, setSelectedExpId] = useState<string>(allExperiments[allExperiments.length - 1]?.id || 'act3-q5');
  const [filterAct, setFilterAct] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const currentItem = allExperiments.find((e) => e.id === selectedExpId) || allExperiments[0];

  const filteredList = filterAct === 'all' ? allExperiments : allExperiments.filter((e) => e.act === filterAct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[92vh] flex flex-col glass-panel border border-[#00F2FF]/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.25)]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F2FF] to-[#BC13FE] flex items-center justify-center text-black font-black shadow-lg">
              <FlaskConical className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Phòng Thí Nghiệm Ảo Thực Tế (Virtual Lab 3D)
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40">
                  Mô Phỏng Trực Quan
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Khám phá hiện tượng đổi màu dung dịch, sinh bọt khí & phản ứng tỏa nhiệt theo định luật bảo toàn e
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Sidebar: List of Chemical Experiments */}
          <div className="lg:col-span-4 bg-black/40 border-r border-white/10 flex flex-col p-3 overflow-y-auto max-h-[40vh] lg:max-h-full">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-3 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setFilterAct('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                  filterAct === 'all' ? 'bg-[#00F2FF] text-black shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                Tất cả ({allExperiments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterAct(1)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                  filterAct === 1 ? 'bg-[#00F2FF] text-black shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                Hồi 1
              </button>
              <button
                type="button"
                onClick={() => setFilterAct(2)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                  filterAct === 2 ? 'bg-[#BC13FE] text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                Hồi 2
              </button>
              <button
                type="button"
                onClick={() => setFilterAct(3)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                  filterAct === 3 ? 'bg-pink-500 text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                Hồi 3
              </button>
            </div>

            {/* Experiment Cards */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {filteredList.map((item) => {
                const isSelected = item.id === selectedExpId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedExpId(item.id);
                    }}
                    className={`p-3 rounded-xl text-left transition-all border flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-white/15 border-[#00F2FF] shadow-[0_0_15px_rgba(0,242,255,0.25)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.act === 1
                          ? 'bg-[#00F2FF]/20 text-[#00F2FF]'
                          : item.act === 2
                          ? 'bg-[#BC13FE]/20 text-[#BC13FE]'
                          : 'bg-pink-500/20 text-pink-300'
                      }`}>
                        Hồi {item.act}
                      </span>
                      {isSelected && <ChevronRight className="w-4 h-4 text-[#00F2FF]" />}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-mono text-white/50 truncate">
                      {item.equation}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Interactive Virtual Lab Component */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between max-h-[60vh] lg:max-h-full">
            {currentItem && (
              <VirtualLabExperiment
                key={currentItem.id}
                experimentData={currentItem.experiment}
                isReactionTriggered={false}
                equationDisplay={currentItem.equation}
              />
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/60">
          <span>💡 Nhỏ từng giọt thuốc thử từ buret hoặc nhấn "Kích Hoạt Phản Ứng Tức Thì" để quan sát biến đổi hóa học.</span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Đóng Phòng Thí Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
