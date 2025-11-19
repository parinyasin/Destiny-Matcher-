export interface ZodiacSign {
  id: number;
  name: string;
  icon: string;
}

export interface PredictionResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  stars: number;
  scoreLabel: string; // 2 ดาว, 3 ดาว, etc.
  predictionText: string;
  categoryScores: CategoryScore[];
}

export interface CategoryScore {
  category: string;
  score: number;
  max: number;
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  stars: number;
  predictions: string[];
}
