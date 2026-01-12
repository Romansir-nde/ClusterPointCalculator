
import { GRADE_POINTS } from './constants';
import { Grade } from './types';

export const getPointsFromGrade = (grade: Grade): number => GRADE_POINTS[grade] || 0;

export const getGradeFromPoints = (points: number): Grade => {
  const rounded = Math.round(points);
  if (rounded >= 12) return 'A';
  if (rounded >= 11) return 'A-';
  if (rounded >= 10) return 'B+';
  if (rounded >= 9) return 'B';
  if (rounded >= 8) return 'B-';
  if (rounded >= 7) return 'C+';
  if (rounded >= 6) return 'C';
  if (rounded >= 5) return 'C-';
  if (rounded >= 4) return 'D+';
  if (rounded >= 3) return 'D';
  if (rounded >= 2) return 'D-';
  return 'E';
};

/**
 * Calculates Mean Grade based on 2025 KCSE Standards:
 * 1. Mathematics (Compulsory)
 * 2. Best Language (English or Kiswahili)
 * 3. 5 other best performing subjects
 */
export const calculateMeanGradeData = (selectedGrades: Record<string, Grade>) => {
  const mathPoints = selectedGrades['mat'] ? getPointsFromGrade(selectedGrades['mat']) : 0;
  const engPoints = selectedGrades['eng'] ? getPointsFromGrade(selectedGrades['eng']) : 0;
  const kisPoints = selectedGrades['kis'] ? getPointsFromGrade(selectedGrades['kis']) : 0;
  
  const bestLang = Math.max(engPoints, kisPoints);
  
  // Create a pool of remaining subjects (excluding Math and the used Language)
  const usedLangId = engPoints >= kisPoints ? 'eng' : 'kis';
  const pool = Object.entries(selectedGrades)
    .filter(([id]) => id !== 'mat' && id !== usedLangId)
    .map(([_, grade]) => getPointsFromGrade(grade))
    .sort((a, b) => b - a);

  const best5Others = pool.slice(0, 5);
  const totalPoints = mathPoints + bestLang + best5Others.reduce((a, b) => a + b, 0);
  
  // Note: if less than 7 subjects provided, we still sum what is there
  const meanPoints = totalPoints / 7;
  const meanGrade = getGradeFromPoints(meanPoints);

  return { meanGrade, totalPoints, meanPoints };
};

export const calculateClusterWeight = (r: number, t: number): number => {
  if (r === 0 || t === 0) return 0;
  const weight = Math.sqrt((r / 48) * (t / 84)) * 48;
  return Number(weight.toFixed(3));
};
