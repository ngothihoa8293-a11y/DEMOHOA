import { ElectronTransferQuestion, BalancedEquationQuestion } from '../types';

export const ACT1_QUESTIONS: ElectronTransferQuestion[] = [
  {
    id: 'act1-q1',
    act: 1,
    title: 'Phản ứng Kẽm đẩy Đồng: Pin Điện Hóa Cổ Điển',
    chemicalEquation: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
    subtitle: 'Nhiệm vụ: Chuyển hạt electron từ nguyên tử Zn sang ion Cu²⁺ để kích hoạt dòng điện phân tử.',
    reducer: {
      name: 'Nguyên tử Kẽm (Chất khử)',
      symbol: 'Zn⁰',
      initialOxState: 0,
      finalOxState: 2,
      description: 'Số oxi hóa tăng từ 0 lên +2. Zn là chất khử (chất nhường e).'
    },
    oxidizer: {
      name: 'Ion Đồng(II) (Chất oxi hóa)',
      symbol: 'Cu²⁺',
      initialOxState: 2,
      finalOxState: 0,
      description: 'Số oxi hóa giảm từ +2 xuống 0. Cu²⁺ là chất oxi hóa (chất nhận e).'
    },
    electronCount: 2,
    halfOxidation: 'Zn⁰ → Zn²⁺ + 2e⁻ (Quá trình oxi hóa Zn)',
    halfReduction: 'Cu²⁺ + 2e⁻ → Cu⁰ (Quá trình khử Cu²⁺)',
    explanation: 'Bản chất phản ứng: Nguyên tử Zn nhường 2 electron cho ion Cu²⁺. Zn đóng vai trò là chất khử (số oxi hóa tăng từ 0 lên +2), còn Cu²⁺ là chất oxi hóa (số oxi hóa giảm từ +2 xuống 0).',
    pedagogicalTip: 'Ghi nhớ câu thần chú: "Khử cho - O nhận" (Chất khử cho e, chất oxi hóa nhận e).',
    experimentData: {
      containerType: 'beaker',
      title: 'Thí Nghiệm Nhúng Lá Kẽm (Zn) Vào Dung Dịch CuSO₄',
      reagentsDescription: 'Lá kẽm kim loại nhúng trong cốc thủy tinh đựng dung dịch Đồng(II) sunfat CuSO₄ màu xanh lam',
      initialState: {
        liquidColor: '#3b82f6',
        liquidName: 'Dung dịch CuSO₄ (Xanh lam đặc trưng của Cu²⁺)',
        reagentName: 'Thanh kẽm Zn nhúng vào dung dịch',
        reagentColor: '#94a3b8',
        solidMaterial: {
          name: 'Lá Kẽm (Zn) màu trắng xám',
          color: '#94a3b8',
          shape: 'strip'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(241, 245, 249, 0.25)',
        liquidDescription: 'Dung dịch nhạt màu xanh dần đến không màu (tạo ZnSO₄ không màu)',
        solidProduced: {
          name: 'Lớp Đồng (Cu) kim loại màu đỏ bám ngoài lá kẽm',
          color: '#b45309',
          description: 'Đồng đỏ kim loại bám ngoài bề mặt thanh kẽm'
        }
      },
      phenomenonSummary: 'Kim loại Zn tan dần, lớp kim loại Cu màu đỏ bám trên bề mặt lá Zn, màu xanh lam của dung dịch CuSO₄ nhạt dần đến không màu do Cu²⁺ bị khử thành Cu⁰.'
    }
  },
  {
    id: 'act1-q2',
    act: 1,
    title: 'Kim loại Magie tác dụng Axit: Giải Phóng Khí Hydro',
    chemicalEquation: 'Mg + 2H⁺ → Mg²⁺ + H₂',
    subtitle: 'Nhiệm vụ: Kéo electron từ Mg chuyển cho 2 ion H⁺ để tạo thành phân tử khí H₂ bay lên.',
    reducer: {
      name: 'Nguyên tử Magie (Chất khử)',
      symbol: 'Mg⁰',
      initialOxState: 0,
      finalOxState: 2,
      description: 'Mg nhường 2 electron để tạo ion Mg²⁺ bền vững.'
    },
    oxidizer: {
      name: '2 Ion Hidro (Chất oxi hóa)',
      symbol: '2H⁺',
      initialOxState: 1,
      finalOxState: 0,
      description: 'Mỗi ion H⁺ nhận 1 electron (tổng 2e) để liên kết thành phân tử H₂.'
    },
    electronCount: 2,
    halfOxidation: 'Mg⁰ → Mg²⁺ + 2e⁻ (Quá trình oxi hóa)',
    halfReduction: '2H⁺ + 2e⁻ → H₂⁰ (Quá trình khử)',
    explanation: 'Mg có độ âm điện nhỏ hơn, dễ dàng nhường 2 electron cho 2 ion H⁺ từ dung dịch axit. Số e nhường (2) = Số e nhận (2).',
    pedagogicalTip: 'Trong dung dịch axit loãng thông thường, ion H⁺ luôn là tác nhân oxi hóa chủ lực.',
    experimentData: {
      containerType: 'test-tube',
      title: 'Thí Nghiệm Dải Magie (Mg) Tác Dụng Axit HCl',
      reagentsDescription: 'Dải Mg thả vào ống nghiệm chứa dung dịch axit HCl không màu',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.15)',
        liquidName: 'Dung dịch Axit HCl không màu',
        solidMaterial: {
          name: 'Dải kim loại Magie (Mg)',
          color: '#cbd5e1',
          shape: 'strip'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(255, 255, 255, 0.2)',
        liquidDescription: 'Dung dịch trong suốt chứa muối MgCl₂',
        gasProduced: {
          name: 'Khí Hiđro (H₂)',
          color: 'rgba(255, 255, 255, 0.85)',
          density: 'dense',
          description: 'Sủi bọt khí H₂ không màu mãnh liệt, ống nghiệm nóng lên'
        },
        heatReleased: true
      },
      phenomenonSummary: 'Dải Mg tan nhanh, sủi bọt khí không màu H₂ rất mạnh và tỏa nhiệt lớn. Đốt khí H₂ ở miệng ống nghiệm phát tiếng nổ "pốp" nhẹ.'
    }
  },
  {
    id: 'act1-q3',
    act: 1,
    title: 'Phản ứng Tổng hợp Muối Ăn: Natri và Khí Clo',
    chemicalEquation: '2Na + Cl₂ → 2Na⁺ + 2Cl⁻ (2NaCl)',
    subtitle: 'Nhiệm vụ: 2 nguyên tử Natri truyền 2 electron sang phân tử khí Clo Cl₂ tạo mạng tinh thể ion.',
    reducer: {
      name: '2 Nguyên tử Natri (Chất khử mạnh)',
      symbol: '2Na⁰',
      initialOxState: 0,
      finalOxState: 1,
      description: 'Mỗi nguyên tử Na nhường 1 electron (tổng cộng 2e nhường).'
    },
    oxidizer: {
      name: 'Phân tử Khí Clo (Chất oxi hóa mạnh)',
      symbol: 'Cl₂⁰',
      initialOxState: 0,
      finalOxState: -1,
      description: 'Phân tử Cl₂ gồm 2 nguyên tử Cl, mỗi nguyên tử nhận 1 electron (tổng 2e nhận).'
    },
    electronCount: 2,
    halfOxidation: '2Na⁰ → 2Na⁺ + 2e⁻',
    halfReduction: 'Cl₂⁰ + 2e⁻ → 2Cl⁻',
    explanation: 'Kim loại kiềm kiềm điển hình (Na) nhường e cho phi kim điển hình (Cl₂). Số electron nhường của chất khử đúng bằng số electron nhận của chất oxi hóa!',
    pedagogicalTip: 'Phi kim có độ âm điện lớn thường đóng vai trò chất oxi hóa mạnh khi phản ứng với kim loại.',
    experimentData: {
      containerType: 'flask',
      title: 'Thí Nghiệm Đốt Natri (Na) Nóng Chảy Trong Bình Khí Clo (Cl₂)',
      reagentsDescription: 'Mẩu Na nóng chảy đưa vào bình tam giác chứa khí Clo màu vàng lục',
      initialState: {
        liquidColor: '#ca8a04',
        liquidName: 'Khí Clo (Cl₂) màu vàng lục',
        solidMaterial: {
          name: 'Mẩu Natri (Na) hình cầu nóng chảy',
          color: '#facc15',
          shape: 'granules'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(255, 255, 255, 0.3)',
        liquidDescription: 'Màu vàng lục của Cl₂ biến mất',
        gasProduced: {
          name: 'Khói trắng tinh thể Muối ăn (NaCl)',
          color: 'rgba(255, 255, 255, 0.95)',
          density: 'extreme',
          description: 'Khói trắng NaCl dày đặc bốc lên trong bình'
        },
        lightEmission: true,
        heatReleased: true
      },
      phenomenonSummary: 'Natri bốc cháy sáng chói với ngọn lửa màu vàng rực rỡ trong khí Clo màu vàng lục, sinh ra khói trắng dày đặc gồm các vi tinh thể muối ăn NaCl lắng xuống đáy bình.'
    }
  },
  {
    id: 'act1-q4',
    act: 1,
    title: 'Nung Sắt với Lưu Huỳnh: Hợp chất Sunfua',
    chemicalEquation: 'Fe + S → FeS (ở nhiệt độ cao)',
    subtitle: 'Nhiệm vụ: Truyền electron từ kim loại Sắt sang phi kim Lưu huỳnh để tạo thành FeS.',
    reducer: {
      name: 'Nguyên tử Sắt Fe (Chất khử)',
      symbol: 'Fe⁰',
      initialOxState: 0,
      finalOxState: 2,
      description: 'Sắt nhường 2 electron tạo cation Fe²⁺.'
    },
    oxidizer: {
      name: 'Nguyên tử Lưu huỳnh S (Chất oxi hóa)',
      symbol: 'S⁰',
      initialOxState: 0,
      finalOxState: -2,
      description: 'Lưu huỳnh nhận 2 electron tạo anion S²⁻.'
    },
    electronCount: 2,
    halfOxidation: 'Fe⁰ → Fe²⁺ + 2e⁻',
    halfReduction: 'S⁰ + 2e⁻ → S²⁻',
    explanation: 'Khi đun nóng, Fe nhường 2 electron cho S. Fe là chất khử (số oxi hóa tăng 0 lên +2), S là chất oxi hóa (số oxi hóa giảm từ 0 xuống -2).',
    pedagogicalTip: 'Lưu huỳnh khi tác dụng với kim loại thì S thể hiện tính oxi hóa (về số oxi hóa -2).',
    experimentData: {
      containerType: 'crucible',
      title: 'Nung Hỗn Hợp Bột Sắt (Fe) Và Bột Lưu Huỳnh (S)',
      reagentsDescription: 'Trộn bột Fe xám đen và bột S vàng trong chén nung chịu nhiệt',
      initialState: {
        liquidColor: 'rgba(234, 179, 8, 0.3)',
        liquidName: 'Hỗn hợp bột Sắt + Lưu huỳnh',
        solidMaterial: {
          name: 'Bột Sắt (Fe) + Bột Lưu huỳnh (S)',
          color: '#eab308',
          shape: 'powder'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(30, 41, 59, 0.9)',
        liquidDescription: 'Chuyển thành khối chất rắn xám đen',
        solidProduced: {
          name: 'Sắt(II) sunfua (FeS) màu xám đen',
          color: '#1e293b',
          description: 'Khối chất rắn màu đen, không bị nam châm hút mạnh như Fe tự do'
        },
        heatReleased: true
      },
      phenomenonSummary: 'Đốt nóng hỗn hợp ở một điểm, phản ứng tự phát tỏa nhiệt đỏ rực lan truyền khắp khối bột, tạo thành chất rắn màu xám đen FeS.'
    }
  },
  {
    id: 'act1-q5',
    act: 1,
    title: 'Nhôm Khử Ion Sắt(III): Bước Chuyển 3 Electron',
    chemicalEquation: 'Al + Fe³⁺ → Al³⁺ + Fe',
    subtitle: 'Nhiệm vụ: Nhôm chuyển giao toàn bộ 3 electron lớp ngoài cùng cho ion Sắt(III).',
    reducer: {
      name: 'Nguyên tử Nhôm (Chất khử)',
      symbol: 'Al⁰',
      initialOxState: 0,
      finalOxState: 3,
      description: 'Al nhường 3 electron để đạt cấu hình khí hiếm bền vững.'
    },
    oxidizer: {
      name: 'Ion Sắt(III) (Chất oxi hóa)',
      symbol: 'Fe³⁺',
      initialOxState: 3,
      finalOxState: 0,
      description: 'Ion Fe³⁺ nhận đủ 3 electron để chuyển thành kim loại Fe tự do.'
    },
    electronCount: 3,
    halfOxidation: 'Al⁰ → Al³⁺ + 3e⁻',
    halfReduction: 'Fe³⁺ + 3e⁻ → Fe⁰',
    explanation: 'Phản ứng trao đổi 3 electron: Al là chất khử (nhường 3e), Fe³⁺ là chất oxi hóa (nhận 3e). Định luật bảo toàn electron được thỏa mãn tuyệt đối (3 = 3).',
    pedagogicalTip: 'Bảo toàn electron: Tổng số mol electron chất khử nhường luôn bằng tổng số mol electron chất oxi hóa nhận.',
    experimentData: {
      containerType: 'test-tube',
      title: 'Thí Nghiệm Nhôm (Al) Khử Ion Sắt(III) Trong FeCl₃',
      reagentsDescription: 'Mảnh nhôm Al sáng bóng ngâm trong dung dịch FeCl₃ màu vàng nâu',
      initialState: {
        liquidColor: '#d97706',
        liquidName: 'Dung dịch FeCl₃ (Màu vàng nâu đặc trưng của Fe³⁺)',
        solidMaterial: {
          name: 'Mảnh Nhôm (Al) màu trắng bạc',
          color: '#e2e8f0',
          shape: 'strip'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(241, 245, 249, 0.3)',
        liquidDescription: 'Dung dịch nhạt màu vàng nâu chuyển sang không màu của AlCl₃',
        solidProduced: {
          name: 'Kim loại Sắt (Fe) xám đen',
          color: '#334155',
          description: 'Lớp sắt xám bám trên bề mặt mảnh nhôm'
        }
      },
      phenomenonSummary: 'Mảnh nhôm tan dần, màu vàng nâu của Fe³⁺ nhạt dần và xuất hiện chất rắn màu xám đen (Fe) bám ngoài mảnh nhôm.'
    }
  }
];

export const ACT2_QUESTIONS: BalancedEquationQuestion[] = [
  {
    id: 'act2-q1',
    act: 2,
    title: 'Sắt tác dụng Axit clohiđric',
    levelLabel: 'Cơ bản 01',
    difficulty: 'Cơ bản',
    equationLatex: 'Fe + HCl -> FeCl2 + H2',
    equationDisplay: 'Fe + HCl → FeCl₂ + H₂',
    reactants: [
      {
        formula: 'Fe',
        subscriptFormulaHtml: 'Fe',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5,
        oxStateChanges: [{ element: 'Fe', from: 0, to: 2, role: 'reducer', electronsExchangedPerAtom: 2 }]
      },
      {
        formula: 'HCl',
        subscriptFormulaHtml: 'HCl',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6,
        oxStateChanges: [{ element: 'H', from: 1, to: 0, role: 'oxidizer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'FeCl2',
        subscriptFormulaHtml: 'FeCl₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      },
      {
        formula: 'H2',
        subscriptFormulaHtml: 'H₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      }
    ],
    totalElectronsTransferred: 2,
    reducerElement: 'Fe (tăng từ 0 lên +2)',
    oxidizerElement: 'H⁺ (giảm từ +1 xuống 0)',
    oxStateIncrease: '1 × (Fe⁰ → Fe⁺² + 2e⁻)',
    oxStateDecrease: '1 × (2H⁺¹ + 2e⁻ → H₂⁰)',
    electronLossMultiplier: 1,
    electronGainMultiplier: 1,
    explanation: 'Quá trình: Fe⁰ nhường 2e; 2H⁺¹ nhận 2e. Hệ số: 1 Fe + 2 HCl → 1 FeCl₂ + 1 H₂. Tổng e trao đổi = 2e.',
    pedagogicalTip: 'Đặt hệ số 1 vào Fe và 1 vào H₂, sau đó đếm số nguyên tử Cl để cân bằng HCl (2HCl).',
    experimentData: {
      containerType: 'test-tube',
      title: 'Thí Nghiệm Đinh Sắt (Fe) Tác Dụng Dung Dịch Axit HCl',
      reagentsDescription: 'Đinh sắt xám ngâm trong ống nghiệm đựng axit clohiđric HCl',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.15)',
        liquidName: 'Dung dịch HCl không màu',
        solidMaterial: {
          name: 'Đinh Sắt (Fe) màu xám sáng',
          color: '#64748b',
          shape: 'nail'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(187, 247, 208, 0.5)',
        liquidDescription: 'Dung dịch chuyển sang màu xanh lục nhạt của muối FeCl₂',
        gasProduced: {
          name: 'Khí Hiđro (H₂)',
          color: 'rgba(255, 255, 255, 0.85)',
          density: 'dense',
          description: 'Bọt khí H₂ sủi bọt liên tục bốc lên từ bề mặt đinh sắt'
        }
      },
      phenomenonSummary: 'Đinh sắt tan dần, bọt khí không màu H₂ thoát ra đều đặn, dung dịch từ không màu chuyển sang màu xanh lục nhạt của FeCl₂.'
    }
  },
  {
    id: 'act2-q2',
    act: 2,
    title: 'Đồng đẩy Bạc khỏi dung dịch Muối',
    levelLabel: 'Cơ bản 02',
    difficulty: 'Cơ bản',
    equationLatex: 'Cu + AgNO3 -> Cu(NO3)2 + Ag',
    equationDisplay: 'Cu + AgNO₃ → Cu(NO₃)₂ + Ag',
    reactants: [
      {
        formula: 'Cu',
        subscriptFormulaHtml: 'Cu',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5,
        oxStateChanges: [{ element: 'Cu', from: 0, to: 2, role: 'reducer', electronsExchangedPerAtom: 2 }]
      },
      {
        formula: 'AgNO3',
        subscriptFormulaHtml: 'AgNO₃',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6,
        oxStateChanges: [{ element: 'Ag', from: 1, to: 0, role: 'oxidizer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'Cu(NO3)2',
        subscriptFormulaHtml: 'Cu(NO₃)₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      },
      {
        formula: 'Ag',
        subscriptFormulaHtml: 'Ag',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      }
    ],
    totalElectronsTransferred: 2,
    reducerElement: 'Cu (tăng từ 0 lên +2)',
    oxidizerElement: 'Ag⁺ (giảm từ +1 xuống 0)',
    oxStateIncrease: '1 × (Cu⁰ → Cu⁺² + 2e⁻)',
    oxStateDecrease: '2 × (Ag⁺¹ + 1e⁻ → Ag⁰)',
    electronLossMultiplier: 1,
    electronGainMultiplier: 2,
    explanation: 'Cu nhường 2e, mỗi Ag⁺ chỉ nhận 1e nên cần 2 ion Ag⁺ để nhận đủ 2e. Phương trình: 1 Cu + 2 AgNO₃ → 1 Cu(NO₃)₂ + 2 Ag.',
    pedagogicalTip: 'Bội chung nhỏ nhất của số e nhường (2) và e nhận (1) là 2. Nhân hệ số 2 vào ion Ag⁺.',
    experimentData: {
      containerType: 'test-tube',
      title: 'Thí Nghiệm Dây Đồng (Cu) Nhúng Vào Dung Dịch AgNO₃',
      reagentsDescription: 'Dây đồng đỏ uốn lò xo nhúng trong dung dịch Bạc nitrat AgNO₃ không màu',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.12)',
        liquidName: 'Dung dịch AgNO₃ không màu',
        solidMaterial: {
          name: 'Dây Đồng (Cu) màu đỏ ánh kim',
          color: '#b45309',
          shape: 'wire'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(59, 130, 246, 0.65)',
        liquidDescription: 'Dung dịch chuyển từ không màu sang màu xanh lam ngọc của Cu(NO₃)₂',
        solidProduced: {
          name: 'Tinh thể Bạc (Ag) trắng lấp lánh',
          color: '#f8fafc',
          description: 'Bạc kết tinh lấp lánh dạng cành cây bao quanh dây đồng'
        }
      },
      phenomenonSummary: 'Dây đồng tan dần, dung dịch không màu chuyển sang màu xanh lam của ion Cu²⁺, xung quanh dây đồng mọc lên các tinh thể bạc Ag màu trắng xám sáng lấp lánh như cành cây ("Cây bạc Diana").'
    }
  },
  {
    id: 'act2-q3',
    act: 2,
    title: 'Nhôm tác dụng Axit clohiđric',
    levelLabel: 'Cơ bản 03',
    difficulty: 'Trung bình',
    equationLatex: 'Al + HCl -> AlCl3 + H2',
    equationDisplay: 'Al + HCl → AlCl₃ + H₂',
    reactants: [
      {
        formula: 'Al',
        subscriptFormulaHtml: 'Al',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6,
        oxStateChanges: [{ element: 'Al', from: 0, to: 3, role: 'reducer', electronsExchangedPerAtom: 3 }]
      },
      {
        formula: 'HCl',
        subscriptFormulaHtml: 'HCl',
        initialCoeff: 1,
        correctCoeff: 6,
        minCoeff: 1,
        maxCoeff: 10,
        oxStateChanges: [{ element: 'H', from: 1, to: 0, role: 'oxidizer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'AlCl3',
        subscriptFormulaHtml: 'AlCl₃',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      },
      {
        formula: 'H2',
        subscriptFormulaHtml: 'H₂',
        initialCoeff: 1,
        correctCoeff: 3,
        minCoeff: 1,
        maxCoeff: 6
      }
    ],
    totalElectronsTransferred: 6,
    reducerElement: 'Al (tăng từ 0 lên +3)',
    oxidizerElement: 'H⁺ (giảm từ +1 xuống 0)',
    oxStateIncrease: '2 × (Al⁰ → Al⁺³ + 3e⁻ = 6e nhường)',
    oxStateDecrease: '3 × (2H⁺¹ + 2e⁻ → H₂⁰ = 6e nhận)',
    electronLossMultiplier: 2,
    electronGainMultiplier: 3,
    explanation: 'Al nhường 3e, phân tử H₂ nhận 2e. Bội chung nhỏ nhất là 6. Hệ số: 2 Al và 3 H₂, kéo theo 6 HCl và 2 AlCl₃. Tổng e trao đổi = 6e.',
    pedagogicalTip: 'Khi số e nhường (3) và số e nhận (2) nguyên tố cùng nhau, nhân chéo hệ số: 2 vào chất khử và 3 vào chất oxi hóa.',
    experimentData: {
      containerType: 'test-tube',
      title: 'Thí Nghiệm Nhôm (Al) Tác Dụng Axit HCl',
      reagentsDescription: 'Lá nhôm Al thả vào ống nghiệm chứa dung dịch HCl',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.15)',
        liquidName: 'Dung dịch HCl không màu',
        solidMaterial: {
          name: 'Lá Nhôm (Al) trắng bạc',
          color: '#cbd5e1',
          shape: 'strip'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(255, 255, 255, 0.25)',
        liquidDescription: 'Dung dịch AlCl₃ trong suốt',
        gasProduced: {
          name: 'Khí Hiđro (H₂)',
          color: 'rgba(255, 255, 255, 0.9)',
          density: 'extreme',
          description: 'Bọt khí H₂ sủi bọt xối xả, ống nghiệm nóng ran'
        },
        heatReleased: true
      },
      phenomenonSummary: 'Sau khi lớp màng oxit Al₂O₃ bị hòa tan, kim loại Al phản ứng mãnh liệt với HCl, bọt khí H₂ sủi bọt cuồn cuộn và tỏa nhiệt rất mạnh.'
    }
  },
  {
    id: 'act2-q4',
    act: 2,
    title: 'Kẽm tác dụng Axit sunfuric loãng',
    levelLabel: 'Cơ bản 04',
    difficulty: 'Cơ bản',
    equationLatex: 'Zn + H2SO4 -> ZnSO4 + H2',
    equationDisplay: 'Zn + H₂SO₄ → ZnSO₄ + H₂',
    reactants: [
      {
        formula: 'Zn',
        subscriptFormulaHtml: 'Zn',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5,
        oxStateChanges: [{ element: 'Zn', from: 0, to: 2, role: 'reducer', electronsExchangedPerAtom: 2 }]
      },
      {
        formula: 'H2SO4',
        subscriptFormulaHtml: 'H₂SO₄',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5,
        oxStateChanges: [{ element: 'H', from: 1, to: 0, role: 'oxidizer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'ZnSO4',
        subscriptFormulaHtml: 'ZnSO₄',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      },
      {
        formula: 'H2',
        subscriptFormulaHtml: 'H₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      }
    ],
    totalElectronsTransferred: 2,
    reducerElement: 'Zn (tăng từ 0 lên +2)',
    oxidizerElement: 'H⁺ (giảm từ +1 xuống 0)',
    oxStateIncrease: '1 × (Zn⁰ → Zn⁺² + 2e⁻)',
    oxStateDecrease: '1 × (2H⁺¹ + 2e⁻ → H₂⁰)',
    electronLossMultiplier: 1,
    electronGainMultiplier: 1,
    explanation: 'Phản ứng có tỉ lệ 1:1:1:1. Zn nhường 2e cho 2H⁺ tạo thành Zn²⁺ và H₂ bay lên. Gốc SO₄²⁻ đóng vai trò môi trường.',
    pedagogicalTip: 'Trong H₂SO₄ loãng, ion H⁺ là chất oxi hóa, gốc sunfat SO₄²⁻ không đổi số oxi hóa (+6).',
    experimentData: {
      containerType: 'flask',
      title: 'Thí Nghiệm Kẽm Viên (Zn) Tác Dụng Axit H₂SO₄ Loãng',
      reagentsDescription: 'Kẽm hạt trong bình tam giác tác dụng axit sunfuric loãng',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.15)',
        liquidName: 'Dung dịch H₂SO₄ loãng không màu',
        solidMaterial: {
          name: 'Kẽm hạt (Zn) xám bạc',
          color: '#94a3b8',
          shape: 'granules'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(255, 255, 255, 0.2)',
        liquidDescription: 'Dung dịch ZnSO₄ không màu trong suốt',
        gasProduced: {
          name: 'Khí Hiđro (H₂)',
          color: 'rgba(255, 255, 255, 0.85)',
          density: 'dense',
          description: 'Sủi bọt khí H₂ đều đặn'
        }
      },
      phenomenonSummary: 'Hạt kẽm tan dần, bọt khí không màu H₂ thoát ra đều đặn. Thêm vài giọt dung dịch CuSO₄ sẽ tạo pin điện hóa ăn mòn điện hóa học giúp khí thoát ra nhanh gấp nhiều lần.'
    }
  },
  {
    id: 'act2-q5',
    act: 2,
    title: 'Đốt cháy Cacbon trong Khí Oxi',
    levelLabel: 'Cơ bản 05',
    difficulty: 'Cơ bản',
    equationLatex: 'C + O2 -> CO2',
    equationDisplay: 'C + O₂ → CO₂',
    reactants: [
      {
        formula: 'C',
        subscriptFormulaHtml: 'C',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 4,
        oxStateChanges: [{ element: 'C', from: 0, to: 4, role: 'reducer', electronsExchangedPerAtom: 4 }]
      },
      {
        formula: 'O2',
        subscriptFormulaHtml: 'O₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 4,
        oxStateChanges: [{ element: 'O', from: 0, to: -2, role: 'oxidizer', electronsExchangedPerAtom: 2 }]
      }
    ],
    products: [
      {
        formula: 'CO2',
        subscriptFormulaHtml: 'CO₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 4
      }
    ],
    totalElectronsTransferred: 4,
    reducerElement: 'C (tăng từ 0 lên +4)',
    oxidizerElement: 'O₂ (giảm từ 0 xuống -2)',
    oxStateIncrease: '1 × (C⁰ → C⁺⁴ + 4e⁻)',
    oxStateDecrease: '1 × (O₂⁰ + 4e⁻ → 2O⁻²)',
    electronLossMultiplier: 1,
    electronGainMultiplier: 1,
    explanation: 'Cacbon nhường 4e để tạo C⁺⁴ trong CO₂; phân tử O₂ nhận 4e để tạo 2 nguyên tử O⁻². Hệ số là 1 C + 1 O₂ → 1 CO₂.',
    pedagogicalTip: 'Phản ứng cháy của các đơn chất phi kim là phản ứng oxi hóa - khử điển hình.',
    experimentData: {
      containerType: 'flask',
      title: 'Đốt Than Cacbon (C) Trong Bình Khí Oxi (O₂)',
      reagentsDescription: 'Mẩu than gỗ nóng đỏ đưa vào bình thu khí Oxi',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.05)',
        liquidName: 'Khí Oxi (O₂) không màu',
        solidMaterial: {
          name: 'Mẩu than Cacbon (C) nóng đỏ',
          color: '#ef4444',
          shape: 'granules'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(255, 255, 255, 0.15)',
        liquidDescription: 'Khí CO₂ không màu sinh ra trong bình',
        gasProduced: {
          name: 'Khí Cacbonic (CO₂)',
          color: 'rgba(255, 255, 255, 0.5)',
          density: 'light',
          description: 'Khí CO₂ làm đục nước vôi trong Ca(OH)₂'
        },
        lightEmission: true,
        heatReleased: true
      },
      phenomenonSummary: 'Than nóng đỏ bốc cháy sáng chói trong bình O₂, tỏa nhiều nhiệt, sinh ra khí CO₂ không màu làm vẩn đục nước vôi trong.'
    }
  }
];

export const ACT3_QUESTIONS: BalancedEquationQuestion[] = [
  {
    id: 'act3-q1',
    act: 3,
    title: 'Đồng tác dụng Axit nitric đặc (Khí màu nâu đỏ NO₂)',
    levelLabel: 'Nâng cao 01',
    difficulty: 'Nâng cao',
    equationLatex: 'Cu + HNO3 -> Cu(NO3)2 + NO2 + H2O',
    equationDisplay: 'Cu + HNO₃(đặc) → Cu(NO₃)₂ + NO₂ + H₂O',
    reactants: [
      {
        formula: 'Cu',
        subscriptFormulaHtml: 'Cu',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 6,
        oxStateChanges: [{ element: 'Cu', from: 0, to: 2, role: 'reducer', electronsExchangedPerAtom: 2 }]
      },
      {
        formula: 'HNO3',
        subscriptFormulaHtml: 'HNO₃',
        initialCoeff: 1,
        correctCoeff: 4,
        minCoeff: 1,
        maxCoeff: 10,
        oxStateChanges: [{ element: 'N', from: 5, to: 4, role: 'oxidizer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'Cu(NO3)2',
        subscriptFormulaHtml: 'Cu(NO₃)₂',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      },
      {
        formula: 'NO2',
        subscriptFormulaHtml: 'NO₂',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      },
      {
        formula: 'H2O',
        subscriptFormulaHtml: 'H₂O',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      }
    ],
    totalElectronsTransferred: 2,
    reducerElement: 'Cu (tăng từ 0 lên +2)',
    oxidizerElement: 'N⁺⁵ trong HNO₃ (giảm xuống N⁺⁴ trong NO₂)',
    oxStateIncrease: '1 × (Cu⁰ → Cu⁺² + 2e⁻)',
    oxStateDecrease: '2 × (N⁺⁵ + 1e⁻ → N⁺⁴)',
    electronLossMultiplier: 1,
    electronGainMultiplier: 2,
    explanation: 'Cu nhường 2e, N⁺⁵ nhận 1e → Tỉ lệ 1 Cu : 2 NO₂. Axit HNO₃ vừa làm chất oxi hóa (tạo 2 NO₂), vừa làm môi trường (tạo 2 gốc NO₃⁻ trong muối) → Tổng hệ số HNO₃ = 2 + 2 = 4.',
    pedagogicalTip: 'Chú ý tính số phân tử HNO₃ tham gia làm môi trường: Số mol HNO₃ = Số mol NO₂ + 2 × Số mol Cu(NO₃)₂.',
    experimentData: {
      containerType: 'flask',
      title: 'Thí Nghiệm Đồng (Cu) Tác Dụng Axit Nitric Đặc (HNO₃ Đặc)',
      reagentsDescription: 'Mảnh đồng đỏ cho vào bình tam giác đựng dung dịch HNO₃ đặc',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.18)',
        liquidName: 'Dung dịch HNO₃ đặc không màu',
        solidMaterial: {
          name: 'Mảnh Đồng (Cu) màu đỏ kim loại',
          color: '#b45309',
          shape: 'strip'
        }
      },
      reactionState: {
        finalLiquidColor: '#0284c7',
        liquidDescription: 'Dung dịch chuyển sang màu xanh lam ngọc đậm của Cu(NO₃)₂',
        gasProduced: {
          name: 'Khí Nitơ đioxit (NO₂) MÀU NÂU ĐỎ ĐẬM',
          color: '#7c2d12',
          density: 'extreme',
          description: 'Sủi bọt khí sôi sùng sục, luồng khí NO₂ màu nâu đỏ đậm bốc lên cuộn trào'
        },
        heatReleased: true
      },
      phenomenonSummary: 'Mảnh đồng Cu tan nhanh, dung dịch chuyển sang màu xanh lam ngọc đậm của Cu(NO₃)₂, phản ứng tỏa nhiệt mạnh và giải phóng lượng lớn khí NO₂ màu nâu đỏ đậm, mùi hắc độc hại bốc lên mù mịt.',
      safetyTip: 'Khí NO₂ rất độc, phải làm thí nghiệm trong tủ hút khí độc hoặc đậy nút bông tẩm dung dịch kiềm NaOH.'
    }
  },
  {
    id: 'act3-q2',
    act: 3,
    title: 'Đồng tác dụng Axit nitric loãng (Khí không màu hóa nâu NO)',
    levelLabel: 'Nâng cao 02',
    difficulty: 'Nâng cao',
    equationLatex: 'Cu + HNO3 -> Cu(NO3)2 + NO + H2O',
    equationDisplay: '3Cu + 8HNO₃(loãng) → 3Cu(NO₃)₂ + 2NO + 4H₂O',
    reactants: [
      {
        formula: 'Cu',
        subscriptFormulaHtml: 'Cu',
        initialCoeff: 1,
        correctCoeff: 3,
        minCoeff: 1,
        maxCoeff: 8,
        oxStateChanges: [{ element: 'Cu', from: 0, to: 2, role: 'reducer', electronsExchangedPerAtom: 2 }]
      },
      {
        formula: 'HNO3',
        subscriptFormulaHtml: 'HNO₃',
        initialCoeff: 1,
        correctCoeff: 8,
        minCoeff: 1,
        maxCoeff: 16,
        oxStateChanges: [{ element: 'N', from: 5, to: 2, role: 'oxidizer', electronsExchangedPerAtom: 3 }]
      }
    ],
    products: [
      {
        formula: 'Cu(NO3)2',
        subscriptFormulaHtml: 'Cu(NO₃)₂',
        initialCoeff: 1,
        correctCoeff: 3,
        minCoeff: 1,
        maxCoeff: 8
      },
      {
        formula: 'NO',
        subscriptFormulaHtml: 'NO',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      },
      {
        formula: 'H2O',
        subscriptFormulaHtml: 'H₂O',
        initialCoeff: 1,
        correctCoeff: 4,
        minCoeff: 1,
        maxCoeff: 10
      }
    ],
    totalElectronsTransferred: 6,
    reducerElement: 'Cu (tăng từ 0 lên +2)',
    oxidizerElement: 'N⁺⁵ (giảm từ +5 xuống N⁺² trong NO)',
    oxStateIncrease: '3 × (Cu⁰ → Cu⁺² + 2e⁻ = 6e nhường)',
    oxStateDecrease: '2 × (N⁺⁵ + 3e⁻ → N⁺² = 6e nhận)',
    electronLossMultiplier: 3,
    electronGainMultiplier: 2,
    explanation: 'Quá trình e: Cu⁰ nhường 2e (nhân 3); N⁺⁵ nhận 3e (nhân 2). Hệ số: 3 Cu và 2 NO. Đếm Nitơ: 3 Cu(NO₃)₂ (6N) + 2 NO (2N) = 8 HNO₃. Cân bằng H: 4 H₂O. Phương trình: 3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O.',
    pedagogicalTip: 'Học sinh hay nhầm quên cộng N làm môi trường trong muối Cu(NO₃)₂!',
    experimentData: {
      containerType: 'flask',
      title: 'Thí Nghiệm Đồng (Cu) Tác Dụng Axit Nitric Loãng (HNO₃ Loãng)',
      reagentsDescription: 'Mảnh đồng ngâm trong bình chứa HNO₃ loãng',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.15)',
        liquidName: 'Dung dịch HNO₃ loãng không màu',
        solidMaterial: {
          name: 'Mảnh Đồng (Cu) đỏ',
          color: '#b45309',
          shape: 'strip'
        }
      },
      reactionState: {
        finalLiquidColor: '#38bdf8',
        liquidDescription: 'Dung dịch chuyển từ không màu sang màu xanh lam Cu(NO₃)₂',
        gasProduced: {
          name: 'Khí NO không màu hóa nâu NO₂ ngoài không khí',
          color: '#b45309',
          density: 'dense',
          description: 'Khí NO không màu thoát ra sủi bọt, gặp oxi ở miệng bình lập tức hóa nâu đỏ NO₂'
        }
      },
      phenomenonSummary: 'Mảnh Cu tan chậm hơn so với HNO₃ đặc, dung dịch chuyển dần sang màu xanh lam, sinh bọt khí không màu NO. Khi khí NO bay lên miệng bình tiếp xúc với O₂ trong không khí thì bị oxi hóa ngay thành khí NO₂ màu nâu đỏ.'
    }
  },
  {
    id: 'act3-q3',
    act: 3,
    title: 'Điều chế Khí Clo từ Thuốc tím KMnO₄ và HCl đặc',
    levelLabel: 'Chuyên sâu 01',
    difficulty: 'Chuyên sâu',
    equationLatex: 'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O',
    equationDisplay: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O',
    reactants: [
      {
        formula: 'KMnO4',
        subscriptFormulaHtml: 'KMnO₄',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6,
        oxStateChanges: [{ element: 'Mn', from: 7, to: 2, role: 'oxidizer', electronsExchangedPerAtom: 5 }]
      },
      {
        formula: 'HCl',
        subscriptFormulaHtml: 'HCl',
        initialCoeff: 1,
        correctCoeff: 16,
        minCoeff: 1,
        maxCoeff: 24,
        oxStateChanges: [{ element: 'Cl', from: -1, to: 0, role: 'reducer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'KCl',
        subscriptFormulaHtml: 'KCl',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      },
      {
        formula: 'MnCl2',
        subscriptFormulaHtml: 'MnCl₂',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      },
      {
        formula: 'Cl2',
        subscriptFormulaHtml: 'Cl₂',
        initialCoeff: 1,
        correctCoeff: 5,
        minCoeff: 1,
        maxCoeff: 10
      },
      {
        formula: 'H2O',
        subscriptFormulaHtml: 'H₂O',
        initialCoeff: 1,
        correctCoeff: 8,
        minCoeff: 1,
        maxCoeff: 16
      }
    ],
    totalElectronsTransferred: 10,
    reducerElement: 'Cl⁻¹ trong HCl (tăng lên Cl₂⁰)',
    oxidizerElement: 'Mn⁺⁷ trong KMnO₄ (giảm xuống Mn⁺² trong MnCl₂)',
    oxStateIncrease: '5 × (2Cl⁻¹ → Cl₂⁰ + 2e⁻ = 10e nhường)',
    oxStateDecrease: '2 × (Mn⁺⁷ + 5e⁻ → Mn⁺² = 10e nhận)',
    electronLossMultiplier: 5,
    electronGainMultiplier: 2,
    explanation: 'Mn⁺⁷ nhận 5e (nhân 2), 2Cl⁻ nhường 2e (nhân 5). Đặt 2 vào KMnO₄, 2 vào MnCl₂, 5 vào Cl₂. Sau đó cân bằng K: 2 KCl. Tổng nguyên tử Cl vế phải = 2(KCl) + 4(MnCl₂) + 10(Cl₂) = 16. Do đó có 16 HCl và 8 H₂O.',
    pedagogicalTip: 'HCl đóng cả 2 vai trò: chất khử (10 phân tử tạo 5 Cl₂) và môi trường tạo muối (6 phân tử tạo KCl, MnCl₂).',
    experimentData: {
      containerType: 'flask',
      title: 'Điều Chế Khí Clo (Cl₂) Từ Thuốc Tím KMnO₄ Và HCl Đặc',
      reagentsDescription: 'Nhỏ axit HCl đặc từ phễu nhỏ giọt xuống tinh thể thuốc tím KMnO₄',
      initialState: {
        liquidColor: '#581c87',
        liquidName: 'Tinh thể Thuốc tím KMnO₄ tím đen',
        reagentName: 'Axit HCl đặc (nhỏ từ phễu giọt)',
        reagentColor: 'rgba(255, 255, 255, 0.6)',
        solidMaterial: {
          name: 'Tinh thể KMnO₄ tím thẫm',
          color: '#581c87',
          shape: 'crystal'
        }
      },
      reactionState: {
        finalLiquidColor: 'rgba(254, 240, 138, 0.35)',
        liquidDescription: 'Màu tím mất hoàn toàn, dung dịch chuyển sang màu hồng rất nhạt của Mn²⁺ (MnCl₂)',
        gasProduced: {
          name: 'Khí Clo (Cl₂) MÀU VÀNG LỤC',
          color: '#ca8a04',
          density: 'extreme',
          description: 'Sủi bọt mãnh liệt, khí Clo màu vàng lục mùi hắc tích tụ trong bình'
        }
      },
      phenomenonSummary: 'Thuốc tím KMnO₄ tan ra, màu tím biến mất, sủi bọt khí cực mạnh sinh ra khí Clo (Cl₂) màu vàng lục, mùi hắc nồng đặc trưng, làm ẩm quỳ tím thì quỳ hóa đỏ rồi mất màu ngay.'
    }
  },
  {
    id: 'act3-q4',
    act: 3,
    title: 'Sắt tác dụng Axit nitric đặc nóng',
    levelLabel: 'Chuyên sâu 02',
    difficulty: 'Nâng cao',
    equationLatex: 'Fe + HNO3 -> Fe(NO3)3 + NO2 + H2O',
    equationDisplay: 'Fe + 6HNO₃(đặc, t°) → Fe(NO₃)₃ + 3NO₂ + 3H₂O',
    reactants: [
      {
        formula: 'Fe',
        subscriptFormulaHtml: 'Fe',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5,
        oxStateChanges: [{ element: 'Fe', from: 0, to: 3, role: 'reducer', electronsExchangedPerAtom: 3 }]
      },
      {
        formula: 'HNO3',
        subscriptFormulaHtml: 'HNO₃',
        initialCoeff: 1,
        correctCoeff: 6,
        minCoeff: 1,
        maxCoeff: 12,
        oxStateChanges: [{ element: 'N', from: 5, to: 4, role: 'oxidizer', electronsExchangedPerAtom: 1 }]
      }
    ],
    products: [
      {
        formula: 'Fe(NO3)3',
        subscriptFormulaHtml: 'Fe(NO₃)₃',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 5
      },
      {
        formula: 'NO2',
        subscriptFormulaHtml: 'NO₂',
        initialCoeff: 1,
        correctCoeff: 3,
        minCoeff: 1,
        maxCoeff: 8
      },
      {
        formula: 'H2O',
        subscriptFormulaHtml: 'H₂O',
        initialCoeff: 1,
        correctCoeff: 3,
        minCoeff: 1,
        maxCoeff: 8
      }
    ],
    totalElectronsTransferred: 3,
    reducerElement: 'Fe (tăng từ 0 lên +3)',
    oxidizerElement: 'N⁺⁵ (giảm từ +5 xuống +4 trong NO₂)',
    oxStateIncrease: '1 × (Fe⁰ → Fe⁺³ + 3e⁻)',
    oxStateDecrease: '3 × (N⁺⁵ + 1e⁻ → N⁺⁴)',
    electronLossMultiplier: 1,
    electronGainMultiplier: 3,
    explanation: 'Fe bị oxi hóa lên mức cao nhất (+3), nhường 3e. Mỗi N⁺⁵ nhận 1e tạo NO₂ → Cần 3 NO₂. Tổng N = 3 (muối) + 3 (khí) = 6 HNO₃ → 3 H₂O. Phương trình: Fe + 6HNO₃ → Fe(NO₃)₃ + 3NO₂ + 3H₂O.',
    pedagogicalTip: 'Fe thụ động trong HNO₃ đặc nguội, nhưng khi đun nóng (t°) phản ứng mãnh liệt tạo muối Fe(III).',
    experimentData: {
      containerType: 'test-tube',
      title: 'Thí Nghiệm Đinh Sắt (Fe) Tác Dụng HNO₃ Đặc Nóng',
      reagentsDescription: 'Đun nóng ống nghiệm chứa đinh sắt và HNO₃ đặc',
      initialState: {
        liquidColor: 'rgba(255, 255, 255, 0.2)',
        liquidName: 'Dung dịch HNO₃ đặc (đun nóng)',
        solidMaterial: {
          name: 'Đinh Sắt (Fe) xám',
          color: '#64748b',
          shape: 'nail'
        }
      },
      reactionState: {
        finalLiquidColor: '#d97706',
        liquidDescription: 'Dung dịch chuyển sang màu vàng nâu của muối Sắt(III) Fe(NO₃)₃',
        gasProduced: {
          name: 'Khí NO₂ màu nâu đỏ bốc lên cuồn cuộn',
          color: '#7c2d12',
          density: 'extreme',
          description: 'Sủi bọt sôi bùng lên, sinh lượng lớn khí NO₂ màu nâu đỏ đặc'
        },
        heatReleased: true
      },
      phenomenonSummary: 'Ở nhiệt độ thường Fe thụ động trong HNO₃ đặc nguội. Nhưng khi đun nóng, phản ứng xảy ra cực kỳ mãnh liệt, đinh sắt tan nhanh, dung dịch chuyển sang màu vàng nâu của Fe³⁺ và khí NO₂ màu nâu đỏ bốc lên cuồn cuộn.'
    }
  },
  {
    id: 'act3-q5',
    act: 3,
    title: 'Phản ứng Chuẩn độ Oxi hóa - Khử FeSO₄ bằng Thuốc tím trong Môi trường Axit',
    levelLabel: 'Chuyên sâu 03 - Trùm Cuối',
    difficulty: 'Chuyên sâu',
    equationLatex: 'FeSO4 + KMnO4 + H2SO4 -> Fe2(SO4)3 + K2SO4 + MnSO4 + H2O',
    equationDisplay: '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + K₂SO₄ + 2MnSO₄ + 8H₂O',
    reactants: [
      {
        formula: 'FeSO4',
        subscriptFormulaHtml: 'FeSO₄',
        initialCoeff: 1,
        correctCoeff: 10,
        minCoeff: 1,
        maxCoeff: 16,
        oxStateChanges: [{ element: 'Fe', from: 2, to: 3, role: 'reducer', electronsExchangedPerAtom: 1 }]
      },
      {
        formula: 'KMnO4',
        subscriptFormulaHtml: 'KMnO₄',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6,
        oxStateChanges: [{ element: 'Mn', from: 7, to: 2, role: 'oxidizer', electronsExchangedPerAtom: 5 }]
      },
      {
        formula: 'H2SO4',
        subscriptFormulaHtml: 'H₂SO₄',
        initialCoeff: 1,
        correctCoeff: 8,
        minCoeff: 1,
        maxCoeff: 16
      }
    ],
    products: [
      {
        formula: 'Fe2(SO4)3',
        subscriptFormulaHtml: 'Fe₂(SO₄)₃',
        initialCoeff: 1,
        correctCoeff: 5,
        minCoeff: 1,
        maxCoeff: 10
      },
      {
        formula: 'K2SO4',
        subscriptFormulaHtml: 'K₂SO₄',
        initialCoeff: 1,
        correctCoeff: 1,
        minCoeff: 1,
        maxCoeff: 4
      },
      {
        formula: 'MnSO4',
        subscriptFormulaHtml: 'MnSO₄',
        initialCoeff: 1,
        correctCoeff: 2,
        minCoeff: 1,
        maxCoeff: 6
      },
      {
        formula: 'H2O',
        subscriptFormulaHtml: 'H₂O',
        initialCoeff: 1,
        correctCoeff: 8,
        minCoeff: 1,
        maxCoeff: 16
      }
    ],
    totalElectronsTransferred: 10,
    reducerElement: 'Fe⁺² trong FeSO₄ (tăng lên Fe⁺³ trong Fe₂(SO₄)₃)',
    oxidizerElement: 'Mn⁺⁷ trong KMnO₄ (giảm xuống Mn⁺² trong MnSO₄)',
    oxStateIncrease: '5 × (2Fe⁺² → 2Fe⁺³ + 2e⁻ = 10e nhường)',
    oxStateDecrease: '2 × (Mn⁺⁷ + 5e⁻ → Mn⁺² = 10e nhận)',
    electronLossMultiplier: 5,
    electronGainMultiplier: 2,
    explanation: 'Quá trình: 2Fe⁺² nhường 2e (nhân 5); Mn⁺⁷ nhận 5e (nhân 2). Ta có 10 FeSO₄, 5 Fe₂(SO₄)₃, 2 KMnO₄, 2 MnSO₄, 1 K₂SO₄. Đếm gốc SO₄²⁻ vế phải: 5×3 + 1 + 2 = 18 gốc. Vế trái có 10 FeSO₄ nên cần 8 H₂SO₄ → 8 H₂O. Phương trình hoàn chỉnh: 10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + K₂SO₄ + 2MnSO₄ + 8H₂O.',
    pedagogicalTip: 'Phản ứng này là nền tảng của phương pháp chuẩn độ pemanganat trong hóa học phân tích lớp 10 & 11.',
    experimentData: {
      containerType: 'flask',
      title: 'Chuẩn Độ Oxi Hóa - Khử: Nhỏ Thuốc Tím KMnO₄ Vào FeSO₄ Trong Axit H₂SO₄',
      reagentsDescription: 'Dung dịch FeSO₄ (xanh lục nhạt) + H₂SO₄ loãng trong bình tam giác, nhỏ từng giọt dung dịch KMnO₄ (tím thẫm) từ buret chuẩn độ',
      initialState: {
        liquidColor: '#3b82f6',
        liquidName: 'Dung dịch FeSO₄ + H₂SO₄ loãng (xanh lục rất nhạt gần như không màu)',
        reagentName: 'Dung dịch Thuốc tím KMnO₄ màu tím thẫm (nhỏ từ Buret chuẩn độ)',
        reagentColor: '#7e22ce'
      },
      reactionState: {
        finalLiquidColor: 'rgba(254, 240, 138, 0.4)',
        liquidDescription: 'MÀU TÍM CỦA KMnO₄ LẬP TỨC BỊ MẤT MÀU! Dung dịch chuyển sang màu vàng rơm nhạt của Fe³⁺ (Fe₂(SO₄)₃) và Mn²⁺ không màu',
        gasProduced: undefined
      },
      phenomenonSummary: 'Khi nhỏ từng giọt dung dịch thuốc tím KMnO₄ vào bình tam giác chứa FeSO₄ và H₂SO₄ loãng, màu tím của KMnO₄ bị mất màu ngay lập tức do ion MnO₄⁻ (+7 tím) bị khử hoàn toàn thành ion Mn²⁺ (không màu), đồng thời ion Fe²⁺ bị oxi hóa thành ion Fe³⁺ (màu vàng nhạt). Khi phản ứng kết thúc hoàn toàn (điểm tương đương), 1 giọt KMnO₄ dư sẽ làm dung dịch giữ lại ánh hồng bền vững trong 30 giây.'
    }
  }
];

export const INITIAL_BADGES = [
  {
    id: 'badge-starter',
    name: 'Đặc Vụ Tập Sự',
    description: 'Bắt đầu hành trình giải mã lò phản ứng electron.',
    iconName: 'Sparkles',
    unlocked: true,
  },
  {
    id: 'badge-act1',
    name: 'Chuyên Gia Electron',
    description: 'Thấu hiểu bản chất nhường và nhận e ở Hồi 1.',
    iconName: 'Zap',
    unlocked: false,
    unlockedAtAct: 1,
  },
  {
    id: 'badge-act2',
    name: 'Bậc Thầy Thăng Bằng',
    description: 'Làm chủ Cán cân electron và cân bằng phương trình cơ bản ở Hồi 2.',
    iconName: 'Scale',
    unlocked: false,
    unlockedAtAct: 2,
  },
  {
    id: 'badge-streak',
    name: 'Combo Siêu Dẫn',
    description: 'Đạt chuỗi 3 câu trả lời đúng liên tiếp.',
    iconName: 'Flame',
    unlocked: false,
  },
  {
    id: 'badge-act3',
    name: 'Đại Sư Lò Phản Ứng',
    description: 'Vượt qua mọi phương trình quá tải phức tạp ở Hồi 3 và làm chủ định luật bảo toàn e!',
    iconName: 'Trophy',
    unlocked: false,
    unlockedAtAct: 3,
  }
];
