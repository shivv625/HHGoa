import heic2any from "heic2any";

export async function convertHeicToJpeg(file: File): Promise<Blob> {
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    return Array.isArray(converted) ? converted[0] : converted;
  }
  return file;
}
