import type { Area } from "react-easy-crop";

export const DRAW_SIZE = 1080;

interface RenderPFPFrameOptions {
  imageSrc: string;
  crop: Area;
}

export async function renderPFPFrame({
  imageSrc,
  crop,
}: RenderPFPFrameOptions): Promise<string> {
  try {
    await document.fonts.load('900 72px "Playfair Display"');
    await document.fonts.load('bold 24px "JetBrains Mono"');
    await document.fonts.load('900 48px "General Sans"');
  } catch (e) {
    console.warn("Fonts not fully loaded");
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = DRAW_SIZE;
    canvas.height = DRAW_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("No 2d context"));

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    
    image.onload = async () => {
      // 1. Draw the user's photo filling the entire 1080x1080 canvas
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

      // 2. Add an inner border to frame the photo
      ctx.strokeStyle = "#003F2D"; // Dark Green
      ctx.lineWidth = 40;
      ctx.strokeRect(20, 20, DRAW_SIZE - 40, DRAW_SIZE - 40);
      
      ctx.strokeStyle = "#F4D600"; // Yellow inner rim
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, DRAW_SIZE - 80, DRAW_SIZE - 80);

      // 3. Bottom Banner overlay for branding
      const bannerHeight = 160;
      const bannerY = DRAW_SIZE - 40 - bannerHeight;
      
      // Banner Background
      ctx.fillStyle = "#FFFDF5"; // Cream
      ctx.fillRect(40, bannerY, DRAW_SIZE - 80, bannerHeight);

      // Banner top border
      ctx.fillStyle = "#FF2B83"; // Pink
      ctx.fillRect(40, bannerY, DRAW_SIZE - 80, 8);

      // Branding Typography inside banner
      ctx.fillStyle = "#003F2D";
      ctx.font = '900 64px "Playfair Display", serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("HACKER HOUSE", 80, bannerY + bannerHeight / 2);

      // "GOA" sticker
      ctx.save();
      ctx.translate(DRAW_SIZE - 200, bannerY + bannerHeight / 2);
      ctx.rotate(-0.1);
      ctx.fillStyle = "#FF2B83";
      ctx.font = '900 56px "General Sans", sans-serif';
      ctx.strokeStyle = "#FFFDF5";
      ctx.lineWidth = 12;
      ctx.strokeText("GOA", 0, 0);
      ctx.fillText("GOA", 0, 0);
      // Tiny hindi mark
      ctx.fillStyle = "#F4D600";
      ctx.font = 'bold 24px "General Sans", sans-serif';
      ctx.lineWidth = 4;
      ctx.strokeText("गोवा", 40, -35);
      ctx.fillText("गोवा", 40, -35);
      ctx.restore();

      // Top corner badge (optional small detail)
      ctx.fillStyle = "#FFFDF5";
      ctx.fillRect(40, 40, 300, 48);
      ctx.fillStyle = "#003F2D";
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("HH GOA 2026", 190, 64);

      resolve(canvas.toDataURL("image/png", 1.0));
    };
    image.onerror = () => reject(new Error("Failed to load source image"));
  });
}
