export type GameAct = 1 | 2 | 3;

export interface VirtualExperimentData {
  containerType: 'flask' | 'test-tube' | 'beaker' | 'crucible';
  title: string;
  reagentsDescription: string;
  initialState: {
    liquidColor: string; // CSS color string
    liquidName: string;
    reagentName?: string;
    reagentColor?: string;
    solidMaterial?: {
      name: string;
      color: string;
      shape: 'strip' | 'granules' | 'powder' | 'wire' | 'nail' | 'crystal';
    };
  };
  reactionState: {
    finalLiquidColor: string;
    liquidDescription: string;
    gasProduced?: {
      name: string;
      color: string; // Hex or rgba
      density: 'light' | 'dense' | 'extreme';
      description: string;
    };
    solidProduced?: {
      name: string;
      color: string;
      description: string;
    };
    heatReleased?: boolean;
    lightEmission?: boolean;
  };
  phenomenonSummary: string;
  safetyTip?: string;
}

export interface ElectronTransferQuestion {
  id: string;
  act: 1;
  title: string;
  chemicalEquation: string; // e.g. "Zn + Cu²⁺ → Zn²⁺ + Cu"
  subtitle: string;
  reducer: {
    name: string;
    symbol: string;
    initialOxState: number;
    finalOxState: number;
    description: string;
  };
  oxidizer: {
    name: string;
    symbol: string;
    initialOxState: number;
    finalOxState: number;
    description: string;
  };
  electronCount: number; // Number of electrons to transfer
  halfReduction: string; // e.g. "Cu²⁺ + 2e⁻ → Cu"
  halfOxidation: string; // e.g. "Zn → Zn²⁺ + 2e⁻"
  explanation: string;
  pedagogicalTip: string;
  experimentData?: VirtualExperimentData;
}

export interface ReactionSubstance {
  formula: string;
  subscriptFormulaHtml: string;
  initialCoeff: number;
  correctCoeff: number;
  minCoeff?: number;
  maxCoeff?: number;
  oxStateChanges?: {
    element: string;
    from: number;
    to: number;
    role: 'reducer' | 'oxidizer' | 'spectator' | 'medium';
    electronsExchangedPerAtom?: number;
  }[];
}

export interface BalancedEquationQuestion {
  id: string;
  act: 2 | 3;
  title: string;
  levelLabel: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao' | 'Chuyên sâu';
  equationLatex: string;
  equationDisplay: string;
  reactants: ReactionSubstance[];
  products: ReactionSubstance[];
  totalElectronsTransferred: number; // e.g., 2, 6, 10...
  reducerElement: string;
  oxidizerElement: string;
  oxStateIncrease: string; // e.g. "Fe⁰ → Fe⁺² + 2e⁻"
  oxStateDecrease: string; // e.g. "2H⁺¹ + 2e⁻ → H₂⁰"
  electronLossMultiplier: number;
  electronGainMultiplier: number;
  explanation: string;
  pedagogicalTip: string;
  experimentData?: VirtualExperimentData;
}

export type Question = ElectronTransferQuestion | BalancedEquationQuestion;

export interface UserAnswerRecord {
  questionId: string;
  questionTitle: string;
  act: GameAct;
  isCorrect: boolean;
  attempts: number;
  userCoefficients?: number[];
  transferredElectrons?: number;
  correctCoefficients?: number[];
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAtAct?: number;
}

export type GameMode = 'campaign' | 'pvp';

export interface PvPPlayer {
  id: 'p1' | 'p2';
  name: string;
  avatar: string;
  color: 'cyan' | 'purple';
  score: number;
  streak: number;
  roundWins: number;
  currentCoefficients: number[];
  isLockedIn: boolean;
  lockInTimeMs?: number;
  isCorrect?: boolean;
  scoreGainedInRound?: number;
}

export interface PvPRoundResult {
  roundNumber: number;
  questionTitle: string;
  equationDisplay: string;
  p1Correct: boolean;
  p1ScoreGained: number;
  p1TimeSeconds: number;
  p2Correct: boolean;
  p2ScoreGained: number;
  p2TimeSeconds: number;
  winner: 'p1' | 'p2' | 'draw' | 'none';
  correctEquation: string;
}

export interface PvPSettings {
  questionCount: number;
  timePerQuestion: number;
  roomCode: string;
  difficulty: 'all' | 'basic' | 'hard';
}
