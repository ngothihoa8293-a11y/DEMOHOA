import React from 'react';
import { X, BookOpen, Atom, Zap, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audioSynth';

interface RedoxCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedoxCheatSheetModal: React.FC<RedoxCheatSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col glass-panel border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Sổ Tay Bí Thuật: Oxi Hóa - Khử Hóa 10
              </h3>
              <p className="text-xs text-white/60">
                Quy tắc tính số oxi hóa & Phương pháp thăng bằng electron chuẩn SGK
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

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-white/90 text-xs sm:text-sm">
          {/* Mnemonic Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#BC13FE]/20 via-black/40 to-[#00F2FF]/20 border border-[#00F2FF]/30">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
              <Zap className="w-4 h-4" />
              Câu Thần Chú Bất Hủ Của Đặc Vụ Hóa Học
            </div>
            <div className="text-sm sm:text-base font-black text-center py-2 px-4 rounded-xl bg-black/50 border border-white/10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-[#00F2FF]">
              "KHỬ CHO - O NHẬN" &bull; "TĂNG CHO (KHỬ) - GIẢM NHẬN (OXI HÓA)"
            </div>
            <p className="text-[11px] text-white/70 text-center mt-1 leading-relaxed">
              Chất khử là chất nhường (cho) electron &rarr; Số oxi hóa TĂNG sau phản ứng.<br/>
              Chất oxi hóa là chất nhận electron &rarr; Số oxi hóa GIẢM sau phản ứng.
            </p>
          </div>

          {/* Section 1: Quy tắc xác định số oxi hóa */}
          <div className="p-4 rounded-2xl glass-panel-subtle space-y-2">
            <h4 className="font-bold text-[#00F2FF] flex items-center gap-1.5 text-sm">
              <Atom className="w-4 h-4 text-[#00F2FF]" />
              4 Quy Tắc Xác Định Số Oxi Hóa (SGK Hóa 10 Mới)
            </h4>
            <ul className="space-y-1.5 text-white/80 text-xs pl-2">
              <li>
                <strong className="text-white">Quy tắc 1:</strong> Trong đơn chất, số oxi hóa của nguyên tố bằng <span className="font-mono text-[#00F2FF] font-bold">0</span> (VD: Zn⁰, Cu⁰, H₂⁰, Cl₂⁰, O₂⁰).
              </li>
              <li>
                <strong className="text-white">Quy tắc 2:</strong> Trong hợp chất:
                <div className="pl-3 space-y-0.5 mt-0.5 text-white/60">
                  • Kim loại kiềm (nhóm IA: Na, K, Li...) luôn là <span className="font-mono text-amber-300">+1</span>.<br/>
                  • Kim loại kiềm thổ (nhóm IIA: Mg, Ca, Ba...) luôn là <span className="font-mono text-amber-300">+2</span>, Nhôm (Al) là <span className="font-mono text-amber-300">+3</span>.<br/>
                  • Hiđro (H) thường là <span className="font-mono text-amber-300">+1</span> (trừ hidrua kim loại NaH: -1).<br/>
                  • Oxi (O) thường là <span className="font-mono text-[#00F2FF]">-2</span> (trừ peoxit H₂O₂: -1, OF₂: +2).
                </div>
              </li>
              <li>
                <strong className="text-white">Quy tắc 3:</strong> Trong phân tử trung hòa, tổng đại số số oxi hóa của các nguyên tố bằng <span className="font-mono text-[#00F2FF] font-bold">0</span>.
                <div className="pl-3 text-white/60 mt-0.5">
                  VD: Trong KMnO₄: (+1) + x + 4×(-2) = 0 &rArr; x = +7 (Mn⁺⁷).
                </div>
              </li>
              <li>
                <strong className="text-white">Quy tắc 4:</strong> Trong ion đơn nguyên tử, số oxi hóa bằng điện tích ion (VD: Cu²⁺ có số ox là +2, Cl⁻ là -1). Trong ion đa nguyên tử, tổng số ox bằng điện tích ion.
              </li>
            </ul>
          </div>

          {/* Section 2: 4 Bước thăng bằng electron */}
          <div className="p-4 rounded-2xl glass-panel-subtle space-y-2">
            <h4 className="font-bold text-[#BC13FE] flex items-center gap-1.5 text-sm">
              <HelpCircle className="w-4 h-4 text-[#BC13FE]" />
              4 Bước Cân Bằng Phương Trình Bằng Phương Pháp Thăng Bằng Electron
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="font-bold text-[#BC13FE]">Bước 1:</span> Xác định số oxi hóa của các nguyên tố để tìm ra <strong>chất khử</strong> và <strong>chất oxi hóa</strong>.
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="font-bold text-[#BC13FE]">Bước 2:</span> Viết quá trình oxi hóa (nhường e) và quá trình khử (nhận e).
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="font-bold text-[#BC13FE]">Bước 3:</span> Tìm hệ số thích hợp sao cho: <strong className="text-emerald-300 font-mono">Tổng số electron nhường = Tổng số electron nhận</strong> (Tìm bội chung nhỏ nhất).
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="font-bold text-[#BC13FE]">Bước 4:</span> Đặt hệ số của chất khử và chất oxi hóa vào phương trình, sau đó cân bằng các nguyên tố còn lại theo thứ tự: <strong>Kim loại &rarr; Phi kim &rarr; Môi trường &rarr; Hiđro &rarr; Oxi (để kiểm tra)</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#00F2FF] to-[#BC13FE] hover:opacity-90 text-black transition-all shadow-md active:scale-95 uppercase tracking-wider"
          >
            Đã Hiểu & Tiếp Tục Chiến Đấu!
          </button>
        </div>
      </div>
    </div>
  );
};
