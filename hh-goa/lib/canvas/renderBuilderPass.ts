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
  xHandle?: string;
}

const COLORS = {
  GREEN: "#004B30", // Deep vintage green
  DARK_GREEN: "#002C1C", // Even deeper for text
  CREAM: "#F7F3E8",
  YELLOW: "#FFD700",
  PINK: "#FF007F",
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

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

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function drawZigZag(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.beginPath();
  const step = 12;
  for (let i = 0; i <= w; i += step) {
    ctx.lineTo(x + i, y + (i % 24 === 0 ? 6 : -6));
  }
  ctx.stroke();
}

function drawNoise(ctx: CanvasRenderingContext2D, width: number, height: number, opacity: number = 0.03) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 255;
    data[i] = Math.min(255, Math.max(0, data[i] + val * opacity));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + val * opacity));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + val * opacity));
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawCornerOrnament(ctx: CanvasRenderingContext2D, x: number, y: number, scaleX: number, scaleY: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleX, scaleY);
  ctx.strokeStyle = COLORS.PINK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, 60);
  ctx.stroke();
  
  ctx.fillStyle = COLORS.YELLOW;
  ctx.beginPath();
  ctx.arc(16, 16, 6, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawCircularStamp(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-15 * Math.PI / 180);
  ctx.strokeStyle = "rgba(255, 0, 127, 0.6)"; 
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 88, 0, Math.PI*2); ctx.stroke();

  ctx.fillStyle = "rgba(255, 0, 127, 0.6)";
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = "OFFICIAL BUILDER • HACKER HOUSE GOA • ";
  for(let i=0; i<text.length; i++) {
    ctx.save();
    ctx.rotate((i * 360 / text.length) * Math.PI / 180);
    ctx.translate(0, -72);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  
  ctx.font = 'bold 42px "JetBrains Mono", monospace';
  ctx.fillText("2026", 0, 4);
  ctx.restore();
}

// --------------------------------------------------------
// COMPLEX BADGE POLYGON
// --------------------------------------------------------
function drawBadgePath(ctx: CanvasRenderingContext2D, d: number) {
  const cx = DRAW_WIDTH / 2;
  const w1 = 1000 - d * 2;
  const w2 = 1500 - d * 2;
  const y1 = 440 + d;
  const yj = 1380;
  const y2 = 2000 - d;
  const c = 50; 
  
  const yjt = yj - d;
  const yjb = yj + d;

  ctx.beginPath();
  // Top
  ctx.moveTo(cx - w1/2 + c, y1);
  ctx.lineTo(cx + w1/2 - c, y1);
  ctx.lineTo(cx + w1/2, y1 + c);
  // Right
  ctx.lineTo(cx + w1/2, yjt - c);
  ctx.lineTo(cx + w1/2 - c, yjt);
  ctx.lineTo(cx + w2/2 - c, yjt); 
  ctx.lineTo(cx + w2/2, yjt + c);
  ctx.lineTo(cx + w2/2, y2 - c);
  ctx.lineTo(cx + w2/2 - c, y2);
  // Bottom
  ctx.lineTo(cx - w2/2 + c, y2);
  ctx.lineTo(cx - w2/2, y2 - c);
  // Left
  ctx.lineTo(cx - w2/2, yjb + c);
  ctx.lineTo(cx - w2/2 + c, yjb);
  ctx.lineTo(cx - w1/2 - c, yjb); 
  ctx.lineTo(cx - w1/2, yjb - c);
  ctx.lineTo(cx - w1/2, y1 + c);
  ctx.closePath();
}

function drawPhotoClip(ctx: CanvasRenderingContext2D, d: number) {
  const cx = DRAW_WIDTH / 2;
  const w1 = 1000 - d * 2;
  const y1 = 440 + d;
  const yj = 1380 - d;
  const c = 50; 

  ctx.beginPath();
  ctx.moveTo(cx - w1/2 + c, y1);
  ctx.lineTo(cx + w1/2 - c, y1);
  ctx.lineTo(cx + w1/2, y1 + c);
  ctx.lineTo(cx + w1/2, yj - c);
  ctx.lineTo(cx + w1/2 - c, yj);
  ctx.lineTo(cx - w1/2 + c, yj);
  ctx.lineTo(cx - w1/2, yj - c);
  ctx.lineTo(cx - w1/2, y1 + c);
  ctx.closePath();
}

// --------------------------------------------------------
// RENDER MODULES
// --------------------------------------------------------
export async function renderBuilderPass({
  imageSrc,
  crop,
  name,
  stack,
  builderClass,
  builderId = "HHG-26-" + Math.floor(1000 + Math.random() * 9000).toString(),
  xHandle = "",
}: RenderPassOptions): Promise<string> {
  try {
    await document.fonts.load('bold 160px "Playfair Display"');
    await document.fonts.load('900 160px "General Sans"');
    await document.fonts.load('900 96px "Clash Display"');
    await document.fonts.load('bold 48px "JetBrains Mono"');
  } catch (e) {
    console.warn("Fonts not fully loaded");
  }

  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = DRAW_WIDTH;
    canvas.height = DRAW_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("No 2d context"));
    
    const cx = DRAW_WIDTH / 2;

    try {
      const [photoImg, bgImg, headingImg] = await Promise.all([
        loadImage(imageSrc),
        loadImage("/brand/hh-goa-bg.jpg"),
        loadImage("/brand/hh-goa-heading.png"),
      ]);

      // 1. Solid Green Base
      ctx.fillStyle = COLORS.GREEN;
      ctx.fillRect(0, 0, DRAW_WIDTH, DRAW_HEIGHT);

      // 2. Beach Artwork
      const bgH = 1200;
      const bgY = 2400 - bgH;
      const imgAspect = bgImg.width / bgImg.height;
      const canvasAspect = DRAW_WIDTH / bgH;
      let drawW, drawH, drawX, drawY;
      
      if (imgAspect > canvasAspect) {
        drawH = bgH;
        drawW = drawH * imgAspect;
        drawX = (DRAW_WIDTH - drawW) / 2;
        drawY = bgY;
      } else {
        drawW = DRAW_WIDTH;
        drawH = drawW / imgAspect;
        drawX = 0;
        drawY = bgY - (drawH - bgH); 
      }
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);

      // Fade sky
      const grad = ctx.createLinearGradient(0, bgY - 100, 0, bgY + 500);
      grad.addColorStop(0, COLORS.GREEN);
      grad.addColorStop(1, "rgba(0, 75, 48, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, bgY - 100, DRAW_WIDTH, 600);

      // 3. Outer Border
      ctx.strokeStyle = COLORS.YELLOW;
      ctx.lineWidth = 6;
      ctx.setLineDash([24, 16]);
      ctx.strokeRect(40, 40, DRAW_WIDTH - 80, DRAW_HEIGHT - 80);
      ctx.setLineDash([]);

      // 4. Header
      const hw = 1700;
      const hh = hw * (headingImg.height / headingImg.width);
      ctx.drawImage(headingImg, cx - hw/2, 90, hw, hh);
      
      ctx.fillStyle = COLORS.YELLOW;
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText("GOA, INDIA", 180, 480);
      ctx.fillText("28 - 31 OCT 2026", 180, 520);
      
      ctx.textAlign = 'right';
      ctx.fillText("2:47 PM STUDIO", DRAW_WIDTH - 180, 480);

      // 5. Central Badge (Base & Borders)
      drawBadgePath(ctx, 0);
      ctx.fillStyle = COLORS.CREAM;
      ctx.fill();
      
      // Technical drafting dot grid over the cream badge
      ctx.save();
      drawBadgePath(ctx, 0);
      ctx.clip();
      ctx.fillStyle = "rgba(0, 44, 28, 0.08)"; // Faint dark green
      for(let x = 0; x < DRAW_WIDTH; x+=40) {
        for(let y = 0; y < DRAW_HEIGHT; y+=40) {
          ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
        }
      }
      ctx.restore();

      ctx.strokeStyle = COLORS.YELLOW;
      ctx.lineWidth = 6;
      ctx.stroke();

      drawBadgePath(ctx, 24);
      ctx.strokeStyle = COLORS.DARK_GREEN;
      ctx.lineWidth = 14;
      ctx.stroke();

      // 6. Photo Area
      ctx.save();
      drawPhotoClip(ctx, 40);
      ctx.clip();
      const pW = 1000 - 80;
      const pH = 1380 - 440 - 80;
      ctx.drawImage(photoImg, crop.x, crop.y, crop.width, crop.height, cx - pW/2, 480, pW, pH);
      ctx.restore();
      
      // Top Pink Notch Tab
      const tabW = 140;
      const tabH = 60;
      ctx.fillStyle = COLORS.PINK;
      roundRect(ctx, cx - tabW/2, 420, tabW, tabH, 12).fill();
      ctx.fillStyle = COLORS.GREEN; // cut out effect matching background
      ctx.beginPath(); ctx.arc(cx, 410, 16, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = COLORS.CREAM;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx - 24, 450); ctx.lineTo(cx + 24, 450); ctx.stroke();

      // Tilted Pink Sticker
      ctx.save();
      ctx.translate(cx - 360, 620);
      ctx.rotate(-8 * Math.PI / 180);
      ctx.fillStyle = COLORS.PINK;
      roundRect(ctx, -200, -45, 400, 90, 16).fill();
      ctx.fillStyle = COLORS.CREAM;
      ctx.font = 'bold 38px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(builderId, 0, 4);
      ctx.restore();

      // 7. Identity Section
      const idTopY = 1420;
      const idBotY = 1940;
      const idLeftX = cx - 680;
      const idRightX = cx + 680;
      
      // Decorative Corner Ornaments
      drawCornerOrnament(ctx, idLeftX, idTopY, 1, 1);
      drawCornerOrnament(ctx, idRightX, idTopY, -1, 1);
      drawCornerOrnament(ctx, idLeftX, idBotY, 1, -1);
      drawCornerOrnament(ctx, idRightX, idBotY, -1, -1);

      // Vintage Circular Stamp (Right Side)
      drawCircularStamp(ctx, cx + 520, 1680);
      
      // Geometric Tech Blocks (Left Side)
      ctx.fillStyle = "rgba(0, 44, 28, 0.15)";
      for(let i=0; i<8; i++) {
        const bw = Math.random() > 0.5 ? 40 : 20;
        ctx.fillRect(cx - 620, 1580 + i*28, bw, 12);
      }

      const bIdY = 1480;
      ctx.fillStyle = COLORS.DARK_GREEN;
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText("BUILDER IDENTITY", cx, bIdY);
      ctx.fillStyle = COLORS.PINK;
      drawStar(ctx, cx - 150, bIdY - 8, 12);
      drawStar(ctx, cx + 150, bIdY - 8, 12);

      const nameText = (name || "SIBSANKAR SAMAL").toUpperCase();
      let nameSize = 150;
      ctx.font = `900 ${nameSize}px "Playfair Display", serif`;
      while (ctx.measureText(nameText).width > 1200 && nameSize > 60) {
        nameSize -= 2;
        ctx.font = `900 ${nameSize}px "Playfair Display", serif`;
      }
      ctx.fillStyle = COLORS.DARK_GREEN;
      ctx.fillText(nameText, cx, 1610);

      const lineY = 1710;
      ctx.strokeStyle = COLORS.PINK;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 300, lineY); ctx.lineTo(cx - 50, lineY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 50, lineY); ctx.lineTo(cx + 300, lineY); ctx.stroke();
      ctx.fillStyle = COLORS.PINK;
      drawStar(ctx, cx, lineY, 20);
      drawStar(ctx, cx - 300, lineY, 10);
      drawStar(ctx, cx + 300, lineY, 10);

      const pillY = 1810;
      const stackText = (stack || "FULLSTACK DEVELOPER").toUpperCase();
      ctx.font = 'bold 48px "JetBrains Mono", monospace';
      const stackW = ctx.measureText(stackText).width + 140;
      ctx.fillStyle = COLORS.YELLOW;
      roundRect(ctx, cx - stackW/2, pillY - 45, stackW, 90, 45).fill();
      ctx.fillStyle = COLORS.DARK_GREEN;
      ctx.fillText(stackText, cx, pillY + 6); // adjusted baseline visually
      drawStar(ctx, cx - stackW/2 + 35, pillY - 2, 14);
      drawStar(ctx, cx + stackW/2 - 35, pillY - 2, 14);

      const xY = 1930;
      const handleText = `𝕏 ${xHandle || "@ftshivv"}`;
      ctx.fillStyle = COLORS.DARK_GREEN;
      ctx.font = 'bold 48px "JetBrains Mono", monospace';
      ctx.fillText(handleText, cx, xY);
      const hW = ctx.measureText(handleText).width;
      ctx.strokeStyle = '#888888'; 
      ctx.lineWidth = 3;
      drawZigZag(ctx, cx - hW/2 - 120, xY - 12, 80);
      drawZigZag(ctx, cx + hW/2 + 40, xY - 12, 80);

      // 8. Footer Block
      const fY = 2400;
      ctx.fillStyle = COLORS.CREAM;
      ctx.fillRect(0, fY, DRAW_WIDTH, 300);

      // Left
      ctx.fillStyle = COLORS.DARK_GREEN;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '900 48px "Clash Display", sans-serif';
      ctx.fillText("LESS NOISE.", 100, fY + 80);
      ctx.fillText("MORE SIGNAL.", 100, fY + 140);

      // Center
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px "JetBrains Mono", monospace';
      const cText = `CLASS • ${(builderClass || "SYSTEMS INTEGRATOR").toUpperCase()}`;
      ctx.fillText(cText, cx, fY + 60);
      ctx.fillStyle = COLORS.YELLOW;
      drawStar(ctx, cx - 340, fY + 74, 14);
      drawStar(ctx, cx + 340, fY + 74, 14);
      
      const bcW = 600;
      const bcX = cx - bcW/2;
      const bcY = fY + 110;
      let currX = bcX;
      ctx.fillStyle = COLORS.DARK_GREEN;
      while(currX < bcX + bcW) {
        const bw = Math.random() > 0.6 ? 8 : Math.random() > 0.5 ? 16 : 4;
        if (currX + bw > bcX + bcW) break;
        ctx.fillRect(currX, bcY, bw, 80);
        currX += bw + (Math.random() > 0.5 ? 8 : 14);
      }
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillText(`BUILDER ID: ${builderId}`, cx, bcY + 110);

      // Right
      try {
        const qrDataUrl = await QRCode.toDataURL("https://hacker-house-goa-frame-generator.vercel.app/", {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 200,
          color: { dark: COLORS.DARK_GREEN, light: COLORS.CREAM }
        });
        const qrImg = await loadImage(qrDataUrl);
        ctx.strokeStyle = COLORS.PINK;
        ctx.lineWidth = 4;
        roundRect(ctx, 1480, fY + 50, 220, 220, 8).stroke();
        ctx.drawImage(qrImg, 1490, fY + 60, 200, 200);
      } catch (e) {
        console.error("QR Gen Failed", e);
      }
      
      ctx.textAlign = 'left';
      ctx.fillStyle = COLORS.DARK_GREEN;
      ctx.font = 'bold 42px "JetBrains Mono", monospace';
      ctx.fillText("#FRAMEINGOA", 1750, fY + 60);
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillText("GOA, INDIA", 1750, fY + 120);
      ctx.fillText("OCT 2026", 1750, fY + 160);
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText("VALID EVENT CREDENTIAL", 1750, fY + 220);

      // Texture
      drawNoise(ctx, DRAW_WIDTH, DRAW_HEIGHT, 0.04);

      resolve(canvas.toDataURL("image/png", 1.0));
    } catch (err) {
      reject(err);
    }
  });
}
