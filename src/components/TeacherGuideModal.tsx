import React from 'react';
import { X, GraduationCap, Code2, Download, Lightbulb, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadStandaloneHtml: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
  onDownloadStandaloneHtml,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col glass-panel border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Góc Sư Phạm & Hướng Dẫn Giáo Viên
              </h3>
              <p className="text-xs text-white/60">
                Tùy biến câu hỏi, xuất mã nguồn 1 file HTML duy nhất & Ý tưởng phát triển
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-white/90 text-xs sm:text-sm">
          {/* Standalone HTML Export Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black/50 to-[#00F2FF]/20 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-300 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Tải Về File HTML Độc Lập (Chạy Offline 100%)
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Xuất toàn bộ game thành 1 file <code className="text-[#00F2FF] font-mono">.html</code> duy nhất. Giáo viên có thể chép vào USB, gửi Zalo/Google Classroom để học sinh mở trực tiếp trên điện thoại/máy tính mà không cần cài đặt hay internet!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playVictory();
                onDownloadStandaloneHtml();
              }}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 active:scale-95 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              Tải File HTML Ngay
            </button>
          </div>

          {/* Section 1: Hướng dẫn thay đổi dữ liệu câu hỏi */}
          <div className="p-4 rounded-2xl glass-panel-subtle space-y-2">
            <h4 className="font-bold text-[#00F2FF] flex items-center gap-1.5 text-sm">
              <Code2 className="w-4 h-4 text-[#00F2FF]" />
              1. Hướng Dẫn Thêm / Sửa Phương Trình (Mảng Dữ Liệu JavaScript)
            </h4>
            <p className="text-xs text-white/70">
              Dữ liệu game được tổ chức thành các mảng đối tượng rõ ràng tại <code className="text-amber-300 font-mono">chemistryData.ts</code> (hoặc biến <code className="text-amber-300 font-mono">CHEMISTRY_DATA</code> trong file HTML). Giáo viên chỉ cần sao chép một đối tượng mẫu và điền thông số mới:
            </p>

            <div className="p-3 rounded-xl bg-black/50 font-mono text-[11px] text-white/90 border border-white/10 overflow-x-auto">
              <pre>{`// Mẫu thêm phương trình mới cho Hồi 2 hoặc Hồi 3:
{
  id: 'act2-q6',
  act: 2,
  title: 'Magie tác dụng axit sunfuric loãng',
  levelLabel: 'Cơ bản 06',
  difficulty: 'Cơ bản',
  equationDisplay: 'Mg + H₂SO₄ → MgSO₄ + H₂',
  reactants: [
    { formula: 'Mg', subscriptFormulaHtml: 'Mg', correctCoeff: 1, maxCoeff: 5 },
    { formula: 'H2SO4', subscriptFormulaHtml: 'H₂SO₄', correctCoeff: 1, maxCoeff: 5 }
  ],
  products: [
    { formula: 'MgSO4', subscriptFormulaHtml: 'MgSO₄', correctCoeff: 1, maxCoeff: 5 },
    { formula: 'H2', subscriptFormulaHtml: 'H₂', correctCoeff: 1, maxCoeff: 5 }
  ],
  totalElectronsTransferred: 2,
  reducerElement: 'Mg (từ 0 lên +2)',
  oxidizerElement: 'H⁺ (từ +1 xuống 0)',
  oxStateIncrease: '1 × (Mg⁰ → Mg⁺² + 2e⁻)',
  oxStateDecrease: '1 × (2H⁺¹ + 2e⁻ → H₂⁰)',
  electronLossMultiplier: 1,
  electronGainMultiplier: 1,
  explanation: 'Mg nhường 2e cho 2H⁺ tạo thành Mg²⁺ và khí H₂ bay lên.',
  pedagogicalTip: 'Hệ số 1:1:1:1 bảo toàn e và bảo toàn nguyên tố.'
}`}</pre>
            </div>
          </div>

          {/* Section 2: 3 Ý Tưởng Nâng Cấp Game Trong Tương Lai */}
          <div className="p-4 rounded-2xl glass-panel-subtle space-y-2">
            <h4 className="font-bold text-[#BC13FE] flex items-center gap-1.5 text-sm">
              <Lightbulb className="w-4 h-4 text-[#BC13FE]" />
              2. Đề Xuất 3 Ý Tưởng Nâng Cấp Game Trong Tương Lai
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2.5">
                <div className="p-1 rounded bg-[#BC13FE]/20 text-[#BC13FE] font-bold shrink-0">1</div>
                <div>
                  <strong className="text-white">Chế độ Đấu Trường Đối Kháng 2 Người (Redox PvP / Kahoot Mode):</strong>
                  <p className="text-white/60 mt-0.5">
                    Cho phép 2 học sinh cùng thi đấu cân bằng phương trình trên cùng màn hình cảm ứng hoặc qua mã phòng lớp học thời gian thực, tính điểm theo tốc độ và độ chuẩn xác của số electron bảo toàn.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2.5">
                <div className="p-1 rounded bg-[#00F2FF]/20 text-[#00F2FF] font-bold shrink-0">2</div>
                <div>
                  <strong className="text-white">Mô Phỏng Phòng Thí Nghiệm 3D / Thử Nghiệm Ảo Thực Tế (Virtual Lab Experiment):</strong>
                  <p className="text-white/60 mt-0.5">
                    Tích hợp bình tam giác và ống nghiệm phản ứng trực quan: khi cân bằng đúng, dung dịch đổi màu (ví dụ: tím của KMnO₄ mất màu khi gặp FeSO₄, sinh bọt khí NO₂ nâu đỏ khi Cu tác dụng HNO₃ đặc).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-2.5">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">3</div>
                <div>
                  <strong className="text-white">Công Cụ Tự Tạo Đề Bài Bằng Trí Tuệ Nhân Tạo (AI Redox Equation Builder):</strong>
                  <p className="text-white/60 mt-0.5">
                    Giáo viên chỉ cần nhập công thức chất tham gia (VD: Fe3O4 + HNO3), hệ thống tự động phân tích số oxi hóa, tính toán số e trao đổi và tự sinh ra màn chơi tương tác với cán cân điện tử tương ứng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-[11px] text-white/50 hidden sm:inline">
            Ứng dụng đạt chuẩn sư phạm Chương trình GDPT 2018 (Hóa học 10)
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 active:scale-95"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
