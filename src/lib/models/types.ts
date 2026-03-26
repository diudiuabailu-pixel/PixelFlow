export interface ImageGenParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  referenceImageUrl?: string;
}

export interface VideoGenParams {
  prompt: string;
  duration?: number; // seconds
  width?: number;
  height?: number;
  referenceImageUrl?: string;
}

export interface GenerationResult {
  success: boolean;
  outputUrl?: string;
  error?: string;
  creditCost: number;
}

export interface ModelProvider {
  id: string;
  name: string;
  type: "image" | "video";
  creditCost: number;
  generateImage?(params: ImageGenParams): Promise<GenerationResult>;
  generateVideo?(params: VideoGenParams): Promise<GenerationResult>;
}
