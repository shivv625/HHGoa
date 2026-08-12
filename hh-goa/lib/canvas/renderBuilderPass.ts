import type { Area } from "react-easy-crop";
import QRCode from 'qrcode';

export const DRAW_WIDTH = 2160;
export const DRAW_HEIGHT = 2700;

interface RenderPassOptions {
  imageSrc: string;
  crop: Area;
  name: string;
  stack: string;
  builderClass: string;
  builderId?: string;
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

// Path for a stylized palm leaf will be defined inside the render function.


export async function renderBuilderPass({
  imageSrc,
  crop,
  name,
  stack,
  builderClass,
  builderId = "HH-GOA-2026",
}: RenderPassOptions): Promise<string> {
  try {
    await document.fonts.load('bold 160px "Playfair Display"');
    await document.fonts.load('800 96px "Clash Display"');
    await document.fonts.load('700 48px "General Sans"');
    await document.fonts.load('400 32px "JetBrains Mono"');
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
    
    image.onload = async () => {
      // 1. Background (Warm Cream)
      ctx.fillStyle = "#FFFDF5";
      ctx.fillRect(0, 0, DRAW_WIDTH, DRAW_HEIGHT);
      
      // Simple paper texture overlay
      ctx.fillStyle = "rgba(0,63,45,0.03)";
      for (let i = 0; i < 15000; i++) {
        ctx.fillRect(Math.random() * DRAW_WIDTH, Math.random() * DRAW_HEIGHT, 3, 3);
      }

      // 2. Decorative Environmental Background
      // Sun
      ctx.save();
      ctx.translate(DRAW_WIDTH - 300, 500);
      ctx.fillStyle = "#F4D600";
      ctx.beginPath();
      ctx.arc(0, 0, 180, 0, Math.PI * 2);
      ctx.fill();
      // Sun Rays / Halftone dots
      ctx.fillStyle = "#FF2B83";
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        const angle = (i / 12) * Math.PI * 2;
        ctx.arc(Math.cos(angle) * 240, Math.sin(angle) * 240, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Waves (Bottom)
      ctx.save();
      ctx.translate(0, DRAW_HEIGHT - 300);
      ctx.strokeStyle = "rgba(0, 63, 45, 0.1)";
      ctx.lineWidth = 12;
      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        for (let i = 0; i < DRAW_WIDTH + 200; i += 50) {
          ctx.lineTo(i, Math.sin(i / 100 + j) * 40 + j * 30);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Palm Leaves
      const PALM_LEAF_PATH = new Path2D("M0,0 C20,-50 80,-80 150,-100 C160,-100 160,-90 140,-80 C150,-80 160,-70 130,-60 C150,-60 160,-50 120,-40 C140,-40 150,-30 110,-20 C130,-20 140,-10 90,0 C110,0 120,10 70,20 C50,20 20,10 0,0 Z");
      ctx.save();
      ctx.translate(150, 400);
      ctx.rotate(0.5);
      ctx.scale(2.5, 2.5);
      ctx.fillStyle = "#003F2D";
      ctx.fill(PALM_LEAF_PATH);
      ctx.restore();

      ctx.save();
      ctx.translate(DRAW_WIDTH - 150, 1600);
      ctx.rotate(-2.5);
      ctx.scale(2, 2);
      ctx.fillStyle = "#C8D600"; // Lime
      ctx.fill(PALM_LEAF_PATH);
      ctx.restore();

      // 3. Borders
      // Outer Dark Green
      ctx.strokeStyle = "#003F2D";
      ctx.lineWidth = 64;
      roundRect(ctx, 32, 32, DRAW_WIDTH - 64, DRAW_HEIGHT - 64, 40).stroke();
      
      // Inner Yellow Border
      ctx.strokeStyle = "#F4D600";
      ctx.lineWidth = 16;
      roundRect(ctx, 80, 80, DRAW_WIDTH - 160, DRAW_HEIGHT - 160, 16).stroke();

      // 4. Top Editorial Area
      ctx.fillStyle = "#003F2D";
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.textAlign = "left";
      ctx.fillText("HH GOA 2026", 120, 160);
      ctx.fillText("BUILD FROM GOA", 120, 200);
      
      ctx.textAlign = "right";
      ctx.fillText("28—31 OCT 2026", DRAW_WIDTH - 120, 160);
      ctx.fillText("GOA · INDIA", DRAW_WIDTH - 120, 200);

      // Registration Marks
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(DRAW_WIDTH/2, 60); ctx.lineTo(DRAW_WIDTH/2, 100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(DRAW_WIDTH/2 - 20, 80); ctx.lineTo(DRAW_WIDTH/2 + 20, 80); ctx.stroke();

      // 5. Hero Title
      ctx.textAlign = "center";
      ctx.fillStyle = "#003F2D";
      ctx.font = '900 180px "Playfair Display", serif';
      ctx.fillText("HACKER HOUSE", DRAW_WIDTH / 2, 420);
      
      // Offset GOA Typography Sticker
      ctx.save();
      ctx.translate(DRAW_WIDTH / 2 + 500, 380);
      ctx.rotate(-0.15);
      ctx.fillStyle = "#FF2B83";
      ctx.font = '900 140px "General Sans", sans-serif';
      ctx.strokeStyle = "#FFFDF5";
      ctx.lineWidth = 24;
      ctx.strokeText("GOA", 0, 0);
      ctx.fillText("GOA", 0, 0);
      // Small "गोवा" tag
      ctx.fillStyle = "#F4D600";
      ctx.font = 'bold 48px "General Sans", sans-serif';
      ctx.lineWidth = 8;
      ctx.strokeText("गोवा", 120, -80);
      ctx.fillText("गोवा", 120, -80);
      ctx.restore();

      // 6. Central Photo
      const PHOTO_CX = DRAW_WIDTH / 2;
      const PHOTO_CY = 1100;
      const PHOTO_R = 480;

      // Photo Shadow/Offset Layer
      ctx.fillStyle = "#F4D600";
      ctx.beginPath();
      ctx.arc(PHOTO_CX + 20, PHOTO_CY + 20, PHOTO_R, 0, Math.PI * 2);
      ctx.fill();

      // Mask and draw image
      ctx.save();
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2);
      ctx.clip();
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
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2);
      ctx.strokeStyle = "#003F2D"; ctx.stroke();
      
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 32, 0, Math.PI * 2);
      ctx.strokeStyle = "#FF2B83"; ctx.stroke();
      
      // 7. Builder Stickers
      const drawEditorialSticker = (txt: string, x: number, y: number, rot: number, color: string, bg: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = bg;
        // Padding
        ctx.font = 'bold 36px "Clash Display", sans-serif';
        const metrics = ctx.measureText(txt);
        const w = metrics.width + 60;
        const h = 70;
        roundRect(ctx, -w/2, -h/2, w, h, h/2).fill();
        ctx.strokeStyle = "#003F2D";
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, 0, 4);
        ctx.restore();
      };
      
      drawEditorialSticker("LET'S BUILD", PHOTO_CX - 500, PHOTO_CY - 200, -0.2, "#FFFDF5", "#003F2D");
      drawEditorialSticker("SHIP IT", PHOTO_CX + 540, PHOTO_CY + 150, 0.15, "#003F2D", "#F4D600");
      drawEditorialSticker("CREATE", PHOTO_CX - 480, PHOTO_CY + 300, -0.1, "#FFFDF5", "#FF2B83");

      // 8. Name Plate
      const PLATE_Y = PHOTO_CY + PHOTO_R + 120;
      
      ctx.fillStyle = "#003F2D";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Auto-scale name
      const targetNameWidth = 1400;
      let nameFontSize = 140;
      ctx.font = `900 ${nameFontSize}px "General Sans", sans-serif`;
      while (ctx.measureText(name || "BUILDER").width > targetNameWidth && nameFontSize > 60) {
        nameFontSize -= 5;
        ctx.font = `900 ${nameFontSize}px "General Sans", sans-serif`;
      }
      ctx.fillText((name || "BUILDER").toUpperCase(), DRAW_WIDTH / 2, PLATE_Y);

      // Builder Class Badge
      const CLASS_Y = PLATE_Y + 120;
      ctx.fillStyle = "#F4D600";
      const classText = (builderClass || "BUILDER").toUpperCase();
      ctx.font = 'bold 48px "JetBrains Mono", monospace';
      const classW = ctx.measureText(classText).width + 80;
      roundRect(ctx, (DRAW_WIDTH - classW) / 2, CLASS_Y - 40, classW, 80, 40).fill();
      ctx.strokeStyle = "#003F2D";
      ctx.lineWidth = 6;
      ctx.stroke();
      
      ctx.fillStyle = "#003F2D";
      ctx.fillText(classText, DRAW_WIDTH / 2, CLASS_Y);

      // 9. 3-Column Metadata Grid
      const GRID_Y = CLASS_Y + 220;
      
      // Line separators
      ctx.strokeStyle = "#003F2D";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(120, GRID_Y - 80); ctx.lineTo(DRAW_WIDTH - 120, GRID_Y - 80); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(DRAW_WIDTH / 3, GRID_Y - 80); ctx.lineTo(DRAW_WIDTH / 3, GRID_Y + 340); ctx.stroke();
      ctx.beginPath(); ctx.moveTo((DRAW_WIDTH / 3) * 2, GRID_Y - 80); ctx.lineTo((DRAW_WIDTH / 3) * 2, GRID_Y + 340); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(120, GRID_Y + 340); ctx.lineTo(DRAW_WIDTH - 120, GRID_Y + 340); ctx.stroke();

      // Column 1: QR Code
      const drawQR = async () => {
        try {
          const qrDataUrl = await QRCode.toDataURL("https://hacker-house-goa-frame-generator.vercel.app/", {
            errorCorrectionLevel: 'Q',
            margin: 2,
            width: 260,
            color: {
              dark: "#003F2D", // Dark Green
              light: "#FFFDF5" // Cream
            }
          });
          const qrImg = new Image();
          qrImg.src = qrDataUrl;
          await new Promise((r) => { qrImg.onload = r; });
          const qrX = DRAW_WIDTH / 6 - 130;
          const qrY = GRID_Y;
          
          // Outer border for QR
          ctx.strokeStyle = "#003F2D";
          ctx.lineWidth = 8;
          ctx.strokeRect(qrX - 4, qrY - 4, 268, 268);
          ctx.drawImage(qrImg, qrX, qrY, 260, 260);

          ctx.fillStyle = "#FF2B83";
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.textAlign = "center";
          ctx.fillText("SCAN TO BUILD", DRAW_WIDTH / 6, GRID_Y - 30);
        } catch (e) {
          console.error("QR Gen Failed", e);
        }
      };

      // Column 2: Stack / Role
      const drawStack = () => {
        ctx.fillStyle = "#FF2B83";
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText("BUILDER STACK", DRAW_WIDTH / 2, GRID_Y - 30);
        
        ctx.fillStyle = "#003F2D";
        
        // Split stack text into words and wrap
        const maxStackW = DRAW_WIDTH / 3 - 60;
        let stackFontSize = 56;
        ctx.font = `900 ${stackFontSize}px "Clash Display", sans-serif`;
        
        const text = (stack || "CREATING").toUpperCase();
        const words = text.split(/(?: · | \/ | )/g).filter(Boolean);
        
        let lines: string[] = [];
        let currentLine = "";
        
        words.forEach((word) => {
          const testLine = currentLine ? currentLine + " · " + word : word;
          const w = ctx.measureText(testLine).width;
          if (w > maxStackW && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine) lines.push(currentLine);
        
        // If still too many lines, shrink
        while (lines.length > 4 && stackFontSize > 30) {
          stackFontSize -= 4;
          ctx.font = `900 ${stackFontSize}px "Clash Display", sans-serif`;
          lines = [];
          currentLine = "";
          words.forEach((word) => {
            const testLine = currentLine ? currentLine + " · " + word : word;
            if (ctx.measureText(testLine).width > maxStackW && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine) lines.push(currentLine);
        }

        const startY = GRID_Y + 60;
        lines.forEach((line, i) => {
          ctx.fillText(line, DRAW_WIDTH / 2, startY + (i * (stackFontSize + 20)));
        });
      };

      // Column 3: Barcode & ID
      const drawBarcode = () => {
        ctx.fillStyle = "#FF2B83";
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText("VERIFICATION", (DRAW_WIDTH / 6) * 5, GRID_Y - 30);

        const bcXStart = (DRAW_WIDTH / 6) * 5 - 150;
        const bcY = GRID_Y + 20;
        ctx.fillStyle = "#003F2D";
        
        // Pseudo barcode
        for(let i=0; i<60; i++) {
          const bw = Math.random() > 0.6 ? 4 : Math.random() > 0.5 ? 8 : 2;
          ctx.fillRect(bcXStart + (i * 5), bcY, bw, 120);
        }

        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.fillText(`ID: ${builderId}`, (DRAW_WIDTH / 6) * 5, bcY + 180);
        ctx.fillText("ACCESS GRANTED", (DRAW_WIDTH / 6) * 5, bcY + 220);
      };

      // Draw grid contents
      await drawQR();
      drawStack();
      drawBarcode();

      // 10. Bottom Campaign Strip
      ctx.fillStyle = "#FF2B83";
      ctx.fillRect(80, DRAW_HEIGHT - 160 - 120, DRAW_WIDTH - 160, 120);
      ctx.fillStyle = "#FFFDF5";
      ctx.font = 'bold 56px "General Sans", sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("✦ #FRAMEINGOA ✦", DRAW_WIDTH / 2, DRAW_HEIGHT - 160 - 60);

      resolve(canvas.toDataURL("image/png", 1.0));
    };
    image.onerror = () => reject(new Error("Failed to load source image"));
  });
}
