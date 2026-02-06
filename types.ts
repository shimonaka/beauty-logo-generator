export type StyleId = 'luxury' | 'natural' | 'minimal' | 'casual' | 'edgy' | 'feminine';
export type ColorId = 'gold' | 'monotone' | 'pastel' | 'earth' | 'vivid' | 'dark';

export interface StyleOption {
  id: StyleId;
  label: string;
  description: string;
  fontFamily: string; // Google Font name for Japanese fallback
}

export interface ColorOption {
  id: ColorId;
  label: string;
  hex: string;
}

export interface FormData {
  storeName: string;
  style: StyleId;
  color: ColorId;
}

export interface GeneratedImage {
  id: string;
  base64: string; // The raw image from AI (green background)
  processedBase64: string; // The processed image (transparent)
  isJapaneseFallback: boolean;
}

export enum AppStep {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  DOWNLOAD = 'DOWNLOAD',
  LIMIT_REACHED = 'LIMIT_REACHED',
}
