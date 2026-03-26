import type { ModelProvider } from "./types";
import { fluxProvider } from "./flux";
import { sdxlProvider } from "./sdxl";
import { klingProvider } from "./kling";

const providers: Record<string, ModelProvider> = {
  "flux-1": fluxProvider,
  sdxl: sdxlProvider,
  kling: klingProvider,
};

export function getProvider(modelId: string): ModelProvider | undefined {
  return providers[modelId];
}

export function getAllProviders(): ModelProvider[] {
  return Object.values(providers);
}

export function getImageProviders(): ModelProvider[] {
  return getAllProviders().filter((p) => p.type === "image");
}

export function getVideoProviders(): ModelProvider[] {
  return getAllProviders().filter((p) => p.type === "video");
}
