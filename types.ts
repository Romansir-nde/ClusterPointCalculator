
export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E';

export interface Subject {
  id: string;
  name: string;
  category: 'compulsory' | 'humanities' | 'sciences' | 'technical' | 'languages';
}

export interface ClusterRequirement {
  id: number;
  name: string;
  subjects: string[][]; // Array of groups. Each group is a list of subject IDs. 
  // User must have at least one from each group.
}

export interface CalculationResult {
  meanPoints: number;
  meanGrade: Grade;
  totalPoints: number;
  clusterWeights: Record<number, number>;
}

export enum AppStep {
  Input = 'input',
  Payment = 'payment',
  Results = 'results'
}
