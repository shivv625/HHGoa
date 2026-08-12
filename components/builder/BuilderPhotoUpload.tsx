import React, { useCallback } from "react";
import { Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { convertHeicToJpeg } from "@/lib/heic";

interface BuilderPhotoUploadProps {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  crop: Point;
  setCrop: (crop: Point) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  clearPhoto: () => void;
}

export function BuilderPhotoUpload({
  imageUrl, setImageUrl, crop, setCrop, zoom, setZoom, onCropComplete, clearPhoto
}: BuilderPhotoUploadProps) {
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const blob = await convertHeicToJpeg(file);
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Failed to process image.");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-sans font-semibold text-[#003F2D] text-[15px]">Builder Photo</label>
      
      {imageUrl ? (
        <div className="relative w-full h-[96px] max-w-[96px] mx-auto bg-[#FFF9ED] rounded-[16px] overflow-hidden border-[2px] border-[#F4D600] flex items-center justify-center group cursor-move shadow-sm">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { background: "transparent" },
              cropAreaStyle: { border: "none", boxShadow: "none" }
            }}
          />
          <button 
            onClick={clearPhoto}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Remove photo"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      ) : (
        <label className="w-full h-[96px] bg-[#FFF9ED] hover:bg-[#FDF4E1] transition-colors rounded-[16px] border-[2px] border-dashed border-[#C8CEC3] flex flex-col md:flex-row items-center justify-center cursor-pointer gap-4 group px-4">
          <div className="w-[40px] h-[40px] rounded-full border border-[#C8CEC3] flex items-center justify-center bg-white group-hover:scale-105 transition-transform flex-shrink-0">
            <Upload className="text-[#00432F] w-[18px] h-[18px]" />
          </div>
          <div className="flex flex-col text-center md:text-left">
            <span className="font-sans font-semibold text-[#003F2D] text-[15px] leading-tight">Drop your photo here or click to browse</span>
            <span className="font-sans text-[12px] text-[#718096] mt-0.5">JPG, PNG, WEBP or HEIC • Max 10MB</span>
          </div>
          <input type="file" accept="image/*,.heic" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}
