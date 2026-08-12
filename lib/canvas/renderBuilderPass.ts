import type { Area } from "react-easy-crop";

export const DRAW_WIDTH = 1080;
export const DRAW_HEIGHT = 1440;

interface RenderPassOptions {
  imageSrc: string;
  crop: Area;
  name: string;
  stack: string;
  builderClass: string;
}

// Helper to draw rounded rectangle
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
}

export async function renderBuilderPass({
  imageSrc,
  crop,
  name,
  stack,
  builderClass
}: RenderPassOptions): Promise<string> {
  try {
    await document.fonts.load('bold 96px "Playfair Display"');
    await document.fonts.load('800 48px "Clash Display"');
    await document.fonts.load('700 24px "General Sans"');
    await document.fonts.load('400 16px "JetBrains Mono"');
  } catch (e) {
    console.warn("Fonts not fully loaded");
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = DRAW_WIDTH;
    canvas.height = DRAW_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("No 2d context"));

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    
    image.onload = () => {
      // 1. Background
      ctx.fillStyle = "#FFF8E8"; // Cream
      ctx.fillRect(0, 0, DRAW_WIDTH, DRAW_HEIGHT);
      
      // Simple noise texture overlay
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      for (let i = 0; i < 5000; i++) {
        ctx.fillRect(Math.random() * DRAW_WIDTH, Math.random() * DRAW_HEIGHT, 2, 2);
      }

      // 2. Borders
      // Outer Dark Green
      ctx.strokeStyle = "#003F29";
      ctx.lineWidth = 32;
      roundRect(ctx, 16, 16, DRAW_WIDTH - 32, DRAW_HEIGHT - 32, 40).stroke();
      
      // Inner Yellow
      ctx.strokeStyle = "#FFD600";
      ctx.lineWidth = 8;
      roundRect(ctx, 36, 36, DRAW_WIDTH - 72, DRAW_HEIGHT - 72, 24).stroke();

      // 3. Top Header Typography
      ctx.textAlign = "center";
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 96px "Playfair Display", serif';
      ctx.fillText("HACKER HOUSE", DRAW_WIDTH / 2, 240);
      
      // Pink Goa Sticker
      ctx.save();
      ctx.translate(DRAW_WIDTH / 2, 230);
      ctx.rotate(-0.1);
      ctx.fillStyle = "#FF2B83";
      ctx.font = 'bold 64px "General Sans", sans-serif';
      // Stroke for sticker border
      ctx.strokeStyle = "#FFF8E8";
      ctx.lineWidth = 12;
      ctx.strokeText("गोवा", 0, 0);
      ctx.fillText("गोवा", 0, 0);
      ctx.restore();

      // 4. Center Photo Layer
      const PHOTO_CX = DRAW_WIDTH / 2;
      const PHOTO_CY = DRAW_HEIGHT / 2 - 50;
      const PHOTO_R = 260;

      ctx.save();
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2);
      ctx.clip();
      
      // Draw image using crop
      // Easy crop gives us the pixel values in the original image coordinate space
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        PHOTO_CX - PHOTO_R,
        PHOTO_CY - PHOTO_R,
        PHOTO_R * 2,
        PHOTO_R * 2
      );
      ctx.restore();

      // Photo Rings
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#FFF8E8"; ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 18, 0, Math.PI * 2);
      ctx.strokeStyle = "#FFD600"; ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 30, 0, Math.PI * 2);
      ctx.strokeStyle = "#003F29"; ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 42, 0, Math.PI * 2);
      ctx.strokeStyle = "#FF2B83"; ctx.stroke();

      // 5. Speech Bubble Stickers
      const drawBubble = (txt: string, x: number, y: number, rot: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = "#FFD600";
        roundRect(ctx, -60, -20, 120, 40, 20).fill();
        ctx.strokeStyle = "#FF2B83";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#003F29";
        ctx.font = 'bold 20px "Clash Display", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, 0, 0);
        ctx.restore();
      };
      
      drawBubble("BUILD", PHOTO_CX - 300, PHOTO_CY - 60, -0.15);
      drawBubble("SHIP", PHOTO_CX - 320, PHOTO_CY, -0.05);
      drawBubble("REPEAT", PHOTO_CX - 290, PHOTO_CY + 60, 0.1);
      drawBubble("LET'S BUILD!", PHOTO_CX + 280, PHOTO_CY - 120, 0.2);

      // 6. Name and Stack Plates
      const PLATE_W = 500;
      const PLATE_X = DRAW_WIDTH / 2 - PLATE_W / 2;
      const PLATE_Y = PHOTO_CY + PHOTO_R + 70;
      
      // Name Plate
      ctx.fillStyle = "#003F29";
      roundRect(ctx, PLATE_X, PLATE_Y, PLATE_W, 60, 16).fill();
      ctx.fillStyle = "#FFD600";
      ctx.font = 'bold 36px "General Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((name || "BUILDER").toUpperCase(), DRAW_WIDTH / 2, PLATE_Y + 30);

      // Stack Plate
      ctx.fillStyle = "#FFD600";
      roundRect(ctx, PLATE_X, PLATE_Y + 70, PLATE_W, 40, 16).fill();
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 20px "General Sans", sans-serif';
      ctx.fillText((stack || "CREATING").toUpperCase(), DRAW_WIDTH / 2, PLATE_Y + 90);

      // 7. Three-Column Grid
      const GRID_Y = PLATE_Y + 160;
      
      // Column 1: Builder Class
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF2B83";
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText("✦ BUILDER CLASS ✦", 240, GRID_Y);
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 32px "Clash Display", sans-serif';
      const words = builderClass.split(" ");
      ctx.fillText(words[0] || "BUILDER", 240, GRID_Y + 40);
      if (words[1]) ctx.fillText(words[1], 240, GRID_Y + 80);

      // Draw faux QR Code
      ctx.fillStyle = "#003F29";
      ctx.fillRect(190, GRID_Y + 110, 100, 100);
      ctx.fillStyle = "#FFF8E8";
      for(let i=0; i<30; i++) {
        ctx.fillRect(190 + Math.random()*80, GRID_Y + 110 + Math.random()*80, 10, 10);
      }

      // Column 2: Beach Bag
      ctx.fillStyle = "#FF2B83";
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText("✦ BEACH BAG ✦", DRAW_WIDTH / 2, GRID_Y);
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText("🥥 COCONUT", DRAW_WIDTH / 2, GRID_Y + 40);
      ctx.fillText("💻 VS CODE", DRAW_WIDTH / 2, GRID_Y + 80);
      ctx.fillText("🎧 LO-FI", DRAW_WIDTH / 2, GRID_Y + 120);

      // Column 3: Currently Shipping
      ctx.fillStyle = "#FF2B83";
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText("✦ CURRENTLY SHIPPING ✦", DRAW_WIDTH - 240, GRID_Y);
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 24px "Clash Display", sans-serif';
      ctx.fillText("THE FUTURE", DRAW_WIDTH - 240, GRID_Y + 40);
      
      // Faux Barcode
      ctx.fillStyle = "#003F29";
      ctx.font = '14px "JetBrains Mono"';
      ctx.fillText("ID: #HH-GOA-2026", DRAW_WIDTH - 240, GRID_Y + 150);
      for(let i=0; i<40; i++) {
        const bw = Math.random() > 0.5 ? 2 : 4;
        ctx.fillRect(DRAW_WIDTH - 320 + i*4, GRID_Y + 170, bw, 30);
      }

      // 8. Bottom Hashtag Strip
      ctx.fillStyle = "#FF2B83";
      ctx.fillRect(60, DRAW_HEIGHT - 120, DRAW_WIDTH - 120, 60);
      ctx.fillStyle = "#FFD600";
      ctx.font = 'bold 32px "General Sans", sans-serif';
      ctx.textBaseline = "middle";
      ctx.fillText("✦ #FRAMEINGOA ✦", DRAW_WIDTH / 2, DRAW_HEIGHT - 90);

      // 9. Side Vertical Text
      ctx.save();
      ctx.translate(70, DRAW_HEIGHT / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#FF2B83";
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText("✦ 28 - 31 OCT 2026 ✦", 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(DRAW_WIDTH - 70, DRAW_HEIGHT / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "#FF2B83";
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText("✦ GOA, INDIA ✦", 0, 0);
      ctx.restore();

      // Top Stamps
      // Left Stamp
      ctx.save();
      ctx.translate(160, 100);
      ctx.rotate(-0.1);
      ctx.strokeStyle = "#003F29";
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(-60, -40, 120, 80);
      ctx.setLineDash([]);
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 20px "Clash Display"';
      ctx.fillText("GOA", 0, -10);
      ctx.fillText("INDIA", 0, 15);
      ctx.restore();

      // Right Stamp
      ctx.save();
      ctx.translate(DRAW_WIDTH - 160, 100);
      ctx.rotate(0.1);
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#003F29";
      ctx.font = 'bold 16px "Clash Display"';
      ctx.fillText("BUILD IN", 0, -10);
      ctx.fillText("GOA", 0, 10);
      ctx.restore();

      // Center Top Banner
      ctx.fillStyle = "#FF2B83";
      ctx.beginPath();
      ctx.moveTo(DRAW_WIDTH / 2 - 40, 36);
      ctx.lineTo(DRAW_WIDTH / 2 + 40, 36);
      ctx.lineTo(DRAW_WIDTH / 2 + 40, 140);
      ctx.lineTo(DRAW_WIDTH / 2, 120);
      ctx.lineTo(DRAW_WIDTH / 2 - 40, 140);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#FFD600";
      ctx.font = 'bold 24px "Clash Display"';
      ctx.fillText("HH", DRAW_WIDTH / 2, 70);
      ctx.fillText("GOA", DRAW_WIDTH / 2, 95);

      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error("Failed to load source image"));
  });
}
