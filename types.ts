export type BackgroundMode = 'transparent' | 'color' | 'image';

export enum AppStep {
  LANDING = 'LANDING',
  PROCESSING = 'PROCESSING',
  COMPARISON = 'COMPARISON',
  EDITOR = 'EDITOR'
}

export enum AnalysisType {
  DETAILS = 'DETAILS',
  CAPTION = 'CAPTION'
}

export interface ProcessingState {
  originalFile: File | null;
  processedImageSrc: string | null; // The URL of the PNG from Remove.bg
  originalImageSrc: string | null; // URL for the original image for comparison
  isProcessing: boolean;
  error: string | null;
}

export interface EditorState {
  mode: BackgroundMode;
  backgroundColor: string;
  backgroundImageSrc: string | null;
  scale: number;
}

// For color picker conversions
export interface RGB {
  r: number;
  g: number;
  b: number;
}