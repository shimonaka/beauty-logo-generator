import { StyleId } from "../types";
import { STYLE_OPTIONS } from "../constants";

export const processImage = async (
  base64Data: string,
  storeName: string,
  styleId: StyleId,
  isJapaneseFallback: boolean
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 1. Improved Chroma Key Removal
      // settings
      const keyColor = { r: 0, g: 255, b: 0 };
      const similarity = 0.40; // Threshold (0.0 - 1.0)
      const smoothness = 0.08; // Smoothness (0.0 - 1.0)
      const spill = 0.1;       // Spill suppression (0.0 - 1.0)

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate Euclidean distance from key color in RGB space
        // Normalized to 0.0 - 1.0 range
        const dist = Math.sqrt(
          Math.pow(r - keyColor.r, 2) +
          Math.pow(g - keyColor.g, 2) +
          Math.pow(b - keyColor.b, 2)
        ) / 441.67; // 441.67 is approx sqrt(255^2 * 3)

        let alpha = 1.0;

        if (dist < similarity) {
          alpha = 0.0;
        } else if (dist < similarity + smoothness) {
          // Smooth transition for anti-aliasing
          alpha = (dist - similarity) / smoothness;
        }

        // Apply Alpha
        data[i + 3] = alpha * 255;

        // Despill: Reduce green influence on semi-transparent or edge pixels
        // If the pixel is semi-transparent or greenish, reduce green channel
        if (alpha < 1.0 || (g > r && g > b)) {
          // Simple spill removal: limit Green to average of Red and Blue if it exceeds them significantly
          // or blend it towards neutral color logic. 
          // Here we use a common technique: limit G to max(R, B) for spill areas
          // scaled by the spill intensity factor
          const maxRB = Math.max(r, b);
          if (g > maxRB) {
            data[i + 1] = applySpill(g, maxRB, spill, 1.0 - alpha);
          }
        }
      }

      function applySpill(currentG: number, targetG: number, intensity: number, alphaFactor: number) {
        // Blend between current Green and Target Green (maxRB)
        // alphaFactor increases effect on transparent edges
        const factor = Math.min(1.0, intensity + alphaFactor);
        return currentG * (1.0 - factor) + targetG * factor;
      }

      ctx.putImageData(imageData, 0, 0);

      // 2. Japanese Text Overlay (if needed)
      if (isJapaneseFallback) {
        const styleOption = STYLE_OPTIONS.find(s => s.id === styleId);
        const fontFamily = styleOption?.fontFamily || 'sans-serif';

        // Configure Text
        // We put text at the bottom
        const fontSize = canvas.height * 0.15; // 15% of height
        ctx.font = `bold ${fontSize}px "${fontFamily}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Determine text color based on style/brightness
        // Since we don't know the exact logo color, we default to a safe dark/black 
        // unless it's a dark mode request, but keeping it simple: Black or Dark Grey usually works for logos.
        // Let's use a standard dark gray for text.
        ctx.fillStyle = "#1a1a1a";

        // Add a slight white outline to ensure visibility against any remaining artifact or logo parts
        ctx.strokeStyle = "white";
        ctx.lineWidth = fontSize * 0.1;

        const x = canvas.width / 2;
        const y = canvas.height * 0.85; // Position near bottom

        ctx.strokeText(storeName, x, y);
        ctx.fillText(storeName, x, y);
      }

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (e) => reject(e);
    img.src = `data:image/png;base64,${base64Data}`;
  });
};
