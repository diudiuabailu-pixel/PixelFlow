import type {
  ModelProvider,
  ImageGenParams,
  GenerationResult,
} from "./types";

export const sdxlProvider: ModelProvider = {
  id: "sdxl",
  name: "SDXL",
  type: "image",
  creditCost: 5,

  async generateImage(params: ImageGenParams): Promise<GenerationResult> {
    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
      await new Promise((r) => setTimeout(r, 2000));
      return {
        success: true,
        outputUrl: `/api/placeholder?w=${params.width || 1024}&h=${params.height || 1024}&text=SDXL`,
        creditCost: this.creditCost,
      };
    }

    try {
      const response = await fetch(
        "https://api.siliconflow.cn/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            prompt: params.prompt,
            negative_prompt: params.negativePrompt || "",
            image_size: `${params.width || 1024}x${params.height || 1024}`,
            num_inference_steps: params.steps || 30,
            seed: params.seed,
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        return {
          success: false,
          error: `SDXL API error: ${response.status} ${errBody}`,
          creditCost: 0,
        };
      }

      const data = await response.json();
      const imageUrl = data.images?.[0]?.url;

      if (!imageUrl) {
        return {
          success: false,
          error: "SDXL API returned no image",
          creditCost: 0,
        };
      }

      return {
        success: true,
        outputUrl: imageUrl,
        creditCost: this.creditCost,
      };
    } catch (err) {
      return {
        success: false,
        error: `SDXL API error: ${err instanceof Error ? err.message : "unknown"}`,
        creditCost: 0,
      };
    }
  },
};
