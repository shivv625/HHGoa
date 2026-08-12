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

// Helpers
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

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSticker(ctx: CanvasRenderingContext2D, txt: string, x: number, y: number, rot: number, color: string, bg: string, fontSize: number = 44) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = bg;
  ctx.font = `900 ${fontSize}px "Clash Display", sans-serif`;
  const metrics = ctx.measureText(txt);
  const w = metrics.width + 60;
  const h = fontSize + 40;
  
  // Pink offset shadow
  ctx.fillStyle = "#FF2B83";
  roundRect(ctx, -w/2 + 8, -h/2 + 8, w, h, 20).fill();
  
  ctx.fillStyle = bg;
  roundRect(ctx, -w/2, -h/2, w, h, 20).fill();
  ctx.strokeStyle = "#003F2D";
  ctx.lineWidth = 6;
  ctx.stroke();
  
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(txt, 0, 4);
  ctx.restore();
}

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
      // COLORS
      const C_GREEN = "#003F2D";
      const C_CREAM = "#FFFDF5";
      const C_YELLOW = "#F4D600";
      const C_LIME = "#C8D600";
      const C_PINK = "#FF2B83";

      // 1. BACKGROUND & BORDERS
      // Outer shell
      ctx.fillStyle = C_GREEN;
      ctx.fillRect(0, 0, DRAW_WIDTH, DRAW_HEIGHT);
      
      // Cream artwork area
      ctx.fillStyle = C_CREAM;
      roundRect(ctx, 50, 50, DRAW_WIDTH - 100, DRAW_HEIGHT - 100, 30).fill();

      // Paper Texture
      ctx.fillStyle = "rgba(0,63,45,0.06)";
      for (let i = 0; i < 20000; i++) {
        ctx.fillRect(Math.random() * DRAW_WIDTH, Math.random() * DRAW_HEIGHT, 4, 4);
      }

      // Inner Yellow Border
      ctx.strokeStyle = C_YELLOW;
      ctx.lineWidth = 6;
      roundRect(ctx, 80, 80, DRAW_WIDTH - 160, DRAW_HEIGHT - 160, 20).stroke();

      // 2. ENVIRONMENTAL DECORATIONS (BACK LAYER)
      // Top Right Sun
      ctx.save();
      ctx.translate(1800, 350);
      ctx.fillStyle = C_YELLOW;
      ctx.beginPath();
      ctx.arc(0, 0, 220, 0, Math.PI * 2);
      ctx.fill();
      // Sun Rays
      ctx.fillStyle = C_PINK;
      for (let i = 0; i < 16; i++) {
        ctx.beginPath();
        const angle = (i / 16) * Math.PI * 2;
        ctx.arc(Math.cos(angle) * 280, Math.sin(angle) * 280, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Bottom Left Palm Frame
      const PALM_LEAF = new Path2D("M0,0 C30,-80 120,-120 220,-150 C240,-150 240,-130 210,-120 C230,-120 240,-100 190,-90 C220,-90 240,-70 170,-60 C210,-60 230,-40 150,-30 C190,-30 200,-10 130,0 C160,0 170,20 100,30 C70,30 30,15 0,0 Z");
      ctx.save();
      ctx.translate(100, 2100);
      ctx.scale(2.5, 2.5);
      ctx.rotate(-0.2);
      ctx.fillStyle = C_LIME;
      ctx.fill(PALM_LEAF);
      ctx.rotate(0.6);
      ctx.fillStyle = C_GREEN;
      ctx.fill(PALM_LEAF);
      ctx.restore();

      // Decorative scattered stars
      drawStar(ctx, 400, 600, 4, 40, 10, C_PINK);
      drawStar(ctx, 1750, 750, 4, 30, 8, C_YELLOW);
      drawStar(ctx, 160, 1100, 4, 50, 12, C_LIME);

      // 3. TOP EDITORIAL METADATA
      ctx.fillStyle = C_GREEN;
      ctx.font = 'bold 34px "JetBrains Mono", monospace';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("HH GOA 2026", 140, 140);
      ctx.fillText("BUILD FROM GOA", 140, 190);
      
      ctx.textAlign = "right";
      ctx.fillText("28—31 OCT 2026", DRAW_WIDTH - 140, 140);
      ctx.fillText("GOA · INDIA", DRAW_WIDTH - 140, 190);

      // 4. TITLE
      ctx.textAlign = "center";
      ctx.fillStyle = C_GREEN;
      ctx.font = '900 200px "Playfair Display", serif';
      ctx.fillText("HACKER HOUSE", DRAW_WIDTH / 2, 380);
      
      // GOA Sticker overlapping title
      ctx.save();
      ctx.translate(DRAW_WIDTH / 2 + 550, 360);
      ctx.rotate(-0.1);
      ctx.fillStyle = C_PINK;
      ctx.font = '900 160px "General Sans", sans-serif';
      ctx.strokeStyle = C_CREAM;
      ctx.lineWidth = 28;
      ctx.strokeText("GOA", 0, 0);
      ctx.fillText("GOA", 0, 0);
      ctx.fillStyle = C_YELLOW;
      ctx.font = 'bold 64px "General Sans", sans-serif';
      ctx.lineWidth = 12;
      ctx.strokeText("गोवा", 160, -90);
      ctx.fillText("गोवा", 160, -90);
      ctx.restore();

      // Bridge gap to photo
      ctx.fillStyle = C_GREEN;
      ctx.font = 'bold 40px "JetBrains Mono", monospace';
      ctx.fillText("✦  ✦  ✦", DRAW_WIDTH / 2, 490);

      // 5. PHOTO (HERO)
      const PHOTO_CX = DRAW_WIDTH / 2;
      const PHOTO_CY = 1000;
      const PHOTO_R = 430;

      // Outer thick decorative ring
      ctx.fillStyle = C_GREEN;
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 50, 0, Math.PI * 2);
      ctx.fill();

      // Middle yellow ring
      ctx.fillStyle = C_YELLOW;
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R + 24, 0, Math.PI * 2);
      ctx.fill();

      // Pink accent offset shadow
      ctx.fillStyle = C_PINK;
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

      // Inner stroke on photo
      ctx.lineWidth = 8;
      ctx.strokeStyle = C_GREEN;
      ctx.beginPath();
      ctx.arc(PHOTO_CX, PHOTO_CY, PHOTO_R, 0, Math.PI * 2);
      ctx.stroke();

      // 6. PHOTO STICKERS
      drawSticker(ctx, "LET'S BUILD", PHOTO_CX - 420, PHOTO_CY - 280, -0.15, C_CREAM, C_GREEN, 46);
      drawSticker(ctx, "SHIP IT", PHOTO_CX + 460, PHOTO_CY - 100, 0.2, C_GREEN, C_YELLOW, 50);
      drawSticker(ctx, "CREATE", PHOTO_CX - 400, PHOTO_CY + 280, -0.1, C_CREAM, C_PINK, 42);

      // 7. IDENTITY: NAME PLATE & BUILDER CLASS
      const PLATE_Y = PHOTO_CY + PHOTO_R + 100; // 1530

      // Name text scaling
      const targetNameW = 1500;
      let nameFontSize = 160;
      ctx.font = `900 ${nameFontSize}px "General Sans", sans-serif`;
      const nameText = (name || "BUILDER").toUpperCase();
      let nameW = ctx.measureText(nameText).width;
      while (nameW > targetNameW && nameFontSize > 60) {
        nameFontSize -= 5;
        ctx.font = `900 ${nameFontSize}px "General Sans", sans-serif`;
        nameW = ctx.measureText(nameText).width;
      }

      // Name Plate Box
      const plateW = Math.max(nameW + 160, 800);
      const plateH = nameFontSize + 80;
      ctx.fillStyle = C_GREEN;
      roundRect(ctx, DRAW_WIDTH/2 - plateW/2, PLATE_Y - plateH/2, plateW, plateH, 20).fill();
      
      // Decorative border on plate
      ctx.strokeStyle = C_LIME;
      ctx.lineWidth = 4;
      roundRect(ctx, DRAW_WIDTH/2 - plateW/2 + 12, PLATE_Y - plateH/2 + 12, plateW - 24, plateH - 24, 10).stroke();

      ctx.fillStyle = C_CREAM;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(nameText, DRAW_WIDTH / 2, PLATE_Y + 10);

      // Builder Class Pill
      const CLASS_Y = PLATE_Y + plateH/2 + 40; // ~1680
      ctx.fillStyle = C_YELLOW;
      ctx.font = 'bold 54px "JetBrains Mono", monospace';
      const classText = (builderClass || "VISIONARY BUILDER").toUpperCase();
      const classW = ctx.measureText(classText).width + 120;
      roundRect(ctx, DRAW_WIDTH/2 - classW/2, CLASS_Y - 50, classW, 100, 50).fill();
      ctx.strokeStyle = C_GREEN;
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.fillStyle = C_GREEN;
      ctx.fillText(classText, DRAW_WIDTH / 2, CLASS_Y + 4);


      // 8. 3-COLUMN INFORMATION GRID
      const GRID_Y = CLASS_Y + 140; // ~1820
      const GRID_H = 460;
      
      ctx.strokeStyle = C_GREEN;
      ctx.lineWidth = 6;
      // Top and bottom grid lines
      ctx.beginPath(); ctx.moveTo(140, GRID_Y); ctx.lineTo(DRAW_WIDTH - 140, GRID_Y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(140, GRID_Y + GRID_H); ctx.lineTo(DRAW_WIDTH - 140, GRID_Y + GRID_H); ctx.stroke();
      
      // Vertical dividers
      const COL_1_X = 760;
      const COL_2_X = 1400;
      ctx.beginPath(); ctx.moveTo(COL_1_X, GRID_Y); ctx.lineTo(COL_1_X, GRID_Y + GRID_H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(COL_2_X, GRID_Y); ctx.lineTo(COL_2_X, GRID_Y + GRID_H); ctx.stroke();

      // -- COLUMN 1: QR CODE --
      const drawQR = async () => {
        try {
          const qrDataUrl = await QRCode.toDataURL("https://hacker-house-goa-frame-generator.vercel.app/", {
            errorCorrectionLevel: 'Q',
            margin: 0,
            width: 320,
            color: { dark: C_GREEN, light: C_CREAM }
          });
          const qrImg = new Image();
          qrImg.src = qrDataUrl;
          await new Promise((r) => { qrImg.onload = r; });
          
          const qrX = 140 + (COL_1_X - 140)/2 - 160;
          const qrY = GRID_Y + 100;
          
          ctx.drawImage(qrImg, qrX, qrY, 320, 320);

          ctx.fillStyle = C_GREEN;
          ctx.font = 'bold 36px "JetBrains Mono", monospace';
          ctx.textAlign = "center";
          ctx.fillText("SCAN TO BUILD", 140 + (COL_1_X - 140)/2, GRID_Y + 60);
        } catch (e) {
          console.error("QR Gen Failed", e);
        }
      };

      // -- COLUMN 2: BUILDER STACK --
      const drawStack = () => {
        ctx.fillStyle = C_GREEN;
        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText("BUILDER STACK", COL_1_X + (COL_2_X - COL_1_X)/2, GRID_Y + 60);
        
        ctx.fillStyle = C_PINK;
        ctx.fillRect(COL_1_X + 60, GRID_Y + 90, (COL_2_X - COL_1_X) - 120, 4);

        ctx.fillStyle = C_GREEN;
        const maxStackW = (COL_2_X - COL_1_X) - 80;
        let stackFontSize = 64;
        ctx.font = `900 ${stackFontSize}px "Clash Display", sans-serif`;
        
        const text = (stack || "CREATING").toUpperCase();
        const words = text.split(/(?: · | \/ | )/g).filter(Boolean);
        
        let lines: string[] = [];
        let currentLine = "";
        
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
        
        while (lines.length > 4 && stackFontSize > 36) {
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

        const startY = GRID_Y + 160;
        lines.forEach((line, i) => {
          ctx.fillText(line, COL_1_X + (COL_2_X - COL_1_X)/2, startY + (i * (stackFontSize + 24)));
        });
      };

      // -- COLUMN 3: VERIFICATION --
      const drawBarcode = () => {
        ctx.fillStyle = C_GREEN;
        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        const center3 = COL_2_X + (DRAW_WIDTH - 140 - COL_2_X)/2;
        ctx.fillText("VERIFICATION", center3, GRID_Y + 60);

        const bcW = (DRAW_WIDTH - 140 - COL_2_X) - 160;
        const bcX = COL_2_X + 80;
        const bcY = GRID_Y + 120;
        
        // Pseudo barcode
        ctx.fillStyle = C_GREEN;
        let currX = bcX;
        while(currX < bcX + bcW) {
          const bw = Math.random() > 0.6 ? 6 : Math.random() > 0.5 ? 12 : 3;
          if (currX + bw > bcX + bcW) break;
          ctx.fillRect(currX, bcY, bw, 140);
          currX += bw + (Math.random() > 0.5 ? 6 : 10);
        }

        ctx.font = 'bold 44px "JetBrains Mono", monospace';
        ctx.fillText(`ID: ${builderId}`, center3, bcY + 200);
        ctx.fillStyle = C_PINK;
        ctx.font = 'bold 32px "JetBrains Mono", monospace';
        ctx.fillText("ACCESS GRANTED", center3, bcY + 250);
      };

      await drawQR();
      drawStack();
      drawBarcode();

      // 9. BOTTOM CAMPAIGN STRIP & WAVES
      const STRIP_Y = DRAW_HEIGHT - 220; // 2480

      // Waves behind strip
      ctx.strokeStyle = C_LIME;
      ctx.lineWidth = 8;
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        for (let i = 100; i < DRAW_WIDTH - 100; i += 40) {
          ctx.lineTo(i, STRIP_Y - 30 + Math.sin(i / 80 + j) * 20 + j * 20);
        }
        ctx.stroke();
      }

      // Hot Pink Strip
      ctx.fillStyle = C_PINK;
      roundRect(ctx, 120, STRIP_Y, DRAW_WIDTH - 240, 110, 20).fill();
      ctx.strokeStyle = C_GREEN;
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = C_CREAM;
      ctx.font = '900 64px "Clash Display", sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("✦ #FRAMEINGOA ✦", DRAW_WIDTH / 2, STRIP_Y + 58);

      resolve(canvas.toDataURL("image/png", 1.0));
    };
    image.onerror = () => reject(new Error("Failed to load source image"));
  });
}
