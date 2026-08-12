import type { Area } from "react-easy-crop";

export const DRAW_SIZE = 2160;

export async function drawFrameSolo(
  imageSrc: string,
  crop: Area,
  variantIndex: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = DRAW_SIZE;
    canvas.height = DRAW_SIZE;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return reject(new Error("Failed to get 2d context"));
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    
    image.onload = () => {
      // 1. Fill background with a default color in case of transparency
      ctx.fillStyle = "#0B1A2B"; // hhg-navy
      ctx.fillRect(0, 0, DRAW_SIZE, DRAW_SIZE);

      // 2. Draw the cropped photo in the center
      // The crop window in the UI is 1:1. The safe zone is 80% (inner 864 radius out of 1080)
      // Actually, let's just fill the whole canvas with the cropped image and let the frame mask it
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        DRAW_SIZE,
        DRAW_SIZE
      );

      // 3. Draw the frame overlay
      const overlay = new Image();
      // Load the corresponding variant
      overlay.src = `/brand/frame-assets/variant-${variantIndex + 1}.svg`;
      overlay.onload = () => {
        ctx.drawImage(overlay, 0, 0, DRAW_SIZE, DRAW_SIZE);
        resolve(canvas.toDataURL("image/png"));
      };
      overlay.onerror = () => {
        // Fallback if overlay fails to load, just return the photo
        resolve(canvas.toDataURL("image/png"));
      };
    };
    
    image.onerror = () => reject(new Error("Failed to load source image"));
  });
}
