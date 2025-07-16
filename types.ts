

export type Language = 'en' | 'es';

export enum GameState {
  INITIAL,
  GENERATING,
  INVESTIGATING,
  SOLVED,
  FAILED,
  ERROR,
}

export interface TableSchema {
  [key: string]: string;
}

export interface Table {
  name: string;
  description: string;
  schema: TableSchema;
  data: Record<string, any>[];
}

export interface Solution {
  killer: string;
}

export interface Case {
  title: string;
  story: string;
  resolution: string;
  tables: Table[];
  solution: Solution;
}

export interface QueryResult {
  id: string; // Unique identifier for each query
  data?: Record<string, any>[];
  translatedData?: Record<string, any>[];
  isTranslating?: boolean;
  error?: string;
  query: string;
  isSolutionAttempt?: boolean;
}

export interface SavedGame {
  id: string;
  timestamp: number;
  case: Case;
  queryHistory: QueryResult[];
}