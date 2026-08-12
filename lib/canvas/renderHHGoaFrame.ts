import type { Area } from "react-easy-crop";

export const DRAW_SIZE = 1080;

interface RenderFrameOptions {
  imageSrc: string;
  crop: Area;
  name?: string;
  stack?: string;
  builderClass?: string;
  variantIndex?: number;
}

export async function renderHHGoaFrame({
  imageSrc,
  crop,
  name = "",
  stack = "",
  builderClass = "",
  variantIndex = 0
}: RenderFrameOptions): Promise<string> {
  try {
    // Load fonts
    await document.fonts.load('bold 80px "Clash Display"');
    await document.fonts.load('500 24px "General Sans"');
    await document.fonts.load('400 16px "JetBrains Mono"');
  } catch (e) {
    console.warn("Fonts not fully loaded, using fallbacks");
  }

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
      // 1. Background Layer (Deep Technical Navy)
      ctx.fillStyle = "#0B1A2B"; 
      ctx.fillRect(0, 0, DRAW_SIZE, DRAW_SIZE);

      // 2. Photo Layer
      // We will place the photo asymmetrically: slightly indented from left and top.
      const PHOTO_X = 60;
      const PHOTO_Y = 160;
      const PHOTO_SIZE = 760; 

      ctx.save();
      ctx.beginPath();
      ctx.rect(PHOTO_X, PHOTO_Y, PHOTO_SIZE, PHOTO_SIZE); // Sharp corners for editorial feel
      ctx.clip();
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        PHOTO_X,
        PHOTO_Y,
        PHOTO_SIZE,
        PHOTO_SIZE
      );
      ctx.restore();

      // 3. Frame Graphic Layer
      // Vertical line separating photo from right metadata
      ctx.strokeStyle = "rgba(244, 232, 216, 0.1)"; // hhg-sand with low opacity
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PHOTO_X + PHOTO_SIZE + 40, 0);
      ctx.lineTo(PHOTO_X + PHOTO_SIZE + 40, DRAW_SIZE);
      ctx.stroke();

      // Horizontal line separating top header
      ctx.beginPath();
      ctx.moveTo(0, PHOTO_Y - 40);
      ctx.lineTo(DRAW_SIZE, PHOTO_Y - 40);
      ctx.stroke();

      // 4. Accent Geometry (Sunrise orange)
      ctx.fillStyle = "#FF7A45";
      ctx.fillRect(PHOTO_X, PHOTO_Y, 20, 20); // Top-left of photo
      ctx.fillRect(PHOTO_X + PHOTO_SIZE - 20, PHOTO_Y + PHOTO_SIZE - 20, 20, 20); // Bottom-right of photo

      // 5. Typography Layer
      
      // Top Left Header
      ctx.font = `bold 56px "Clash Display", sans-serif`;
      ctx.fillStyle = "#F4E8D8";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("HH GOA", PHOTO_X, 40);
      
      // Top Right Monospace Date
      ctx.font = `400 18px "JetBrains Mono", monospace`;
      ctx.fillStyle = "#2FBF9F"; // hhg-accent
      ctx.textAlign = "right";
      ctx.fillText("28—31 OCT 2026", DRAW_SIZE - 40, 52);
      ctx.fillText("GOA · INDIA", DRAW_SIZE - 40, 78);

      // Bottom Left Subtitle
      ctx.font = `500 24px "General Sans", sans-serif`;
      ctx.fillStyle = "rgba(244, 232, 216, 0.7)";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText("LESS NOISE. MORE SIGNAL.", PHOTO_X, DRAW_SIZE - 40);

      // Bottom Right Marker
      ctx.font = `400 16px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(244, 232, 216, 0.5)";
      ctx.textAlign = "right";
      ctx.fillText("2:47 PM STUDIO", DRAW_SIZE - 40, DRAW_SIZE - 40);

      // Vertical text on the right
      ctx.save();
      ctx.translate(DRAW_SIZE - 60, PHOTO_Y + PHOTO_SIZE);
      ctx.rotate(-Math.PI / 2);
      ctx.font = `bold 72px "Clash Display", sans-serif`;
      ctx.fillStyle = "rgba(244, 232, 216, 0.05)";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("BUILDER ID", 0, 0);
      ctx.restore();

      // 6. Format B Builder Info (If provided)
      if (name || stack || builderClass) {
        // Draw a solid block at bottom-right of photo
        const BLOCK_W = 380;
        const BLOCK_H = 140;
        const BLOCK_X = PHOTO_X + PHOTO_SIZE - BLOCK_W;
        const BLOCK_Y = PHOTO_Y + PHOTO_SIZE - BLOCK_H;
        
        ctx.fillStyle = "#0B1A2B"; // Match background
        ctx.fillRect(BLOCK_X, BLOCK_Y, BLOCK_W, BLOCK_H);
        
        ctx.strokeStyle = "#2FBF9F";
        ctx.lineWidth = 2;
        ctx.strokeRect(BLOCK_X, BLOCK_Y, BLOCK_W, BLOCK_H);

        // Builder Class (Hero text)
        ctx.fillStyle = "#FFC857";
        ctx.font = `bold 32px "Clash Display", sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(builderClass || "BUILDER", BLOCK_X + 24, BLOCK_Y + 24);

        // Name
        ctx.fillStyle = "#F4E8D8";
        ctx.font = `500 20px "General Sans", sans-serif`;
        ctx.fillText((name || "UNKNOWN").toUpperCase(), BLOCK_X + 24, BLOCK_Y + 70);

        // Stack
        if (stack) {
          ctx.fillStyle = "rgba(244, 232, 216, 0.6)";
          ctx.font = `400 14px "JetBrains Mono", monospace`;
          ctx.fillText(stack.toUpperCase(), BLOCK_X + 24, BLOCK_Y + 100);
        }
      } else {
        // Just the word "BUILDER" overlapping the photo if no data provided (Format A)
        ctx.fillStyle = "#F4E8D8";
        ctx.font = `bold 48px "Clash Display", sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText("BUILDER", PHOTO_X + PHOTO_SIZE - 20, PHOTO_Y + PHOTO_SIZE - 20);
      }

      resolve(canvas.toDataURL("image/png", 1.0));
    };
    
    image.onerror = () => reject(new Error("Failed to load source image"));
  });
}
