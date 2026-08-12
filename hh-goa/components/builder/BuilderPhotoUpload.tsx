import React, { useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
    // Reset file input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
      setError("Unsupported image. Use JPG, PNG, WEBP or HEIC.");
      return;
    }
    try {
      const blob = await convertHeicToJpeg(file);
      setImageUrl(URL.createObjectURL(blob));
      // Reset crop and zoom on new upload
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error(err);
      setError("Failed to process image.");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 1));
  const handleReset = () => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };
  const handleReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Photo Editor Workspace */}
          <div className="w-full bg-[#FFFDF5] border-2 border-[#003F2D] p-4 md:p-6 flex flex-col items-center relative overflow-hidden">
            
            <div className="w-full text-center mb-4 font-mono font-bold text-[#003F2D] text-sm uppercase tracking-widest border-b-2 border-dashed border-[#003F2D] pb-2 inline-block mx-auto">
              ✓ PHOTO READY
            </div>

            {/* The Cropper Area */}
            <div className="relative w-full aspect-square max-w-[280px] md:max-w-[320px] mx-auto overflow-hidden border-2 border-[#003F2D] shadow-[4px_4px_0_0_#003F2D] bg-[#F4F1E1] cursor-move mb-2">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: { background: "transparent" },
                  cropAreaStyle: { border: "2px dashed #003F2D", boxShadow: "0 0 0 9999px rgba(244, 241, 225, 0.7)" }
                }}
              />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                <span className="bg-[#003F2D] text-[#F4D600] text-[10px] font-mono font-bold px-2 py-1 tracking-widest uppercase">
                  Drag to position
                </span>
              </div>
            </div>
            
            <div className="text-center font-sans italic text-xs text-[#003F2D] mb-4">
              Zoom to frame.
            </div>

            {/* Custom Zoom Slider */}
            <div className="w-full max-w-[320px] mx-auto flex flex-col gap-2">
              <div className="flex justify-between items-center text-[#003F2D] font-mono font-bold text-[11px] uppercase tracking-widest">
                <span>ZOOM</span>
                <span className="text-[#003F2D]">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleZoomOut}
                  className="w-8 h-8 border-2 border-[#003F2D] bg-[#F4F1E1] flex items-center justify-center text-[#003F2D] hover:bg-[#F4D600] hover:translate-y-[1px] hover:translate-x-[1px] shadow-[2px_2px_0_0_#003F2D] hover:shadow-[1px_1px_0_0_#003F2D] transition-all font-bold"
                >
                  −
                </button>
                
                {/* Custom Range Input via CSS */}
                <input 
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-[6px] bg-[#EAE5D0] border-y-2 border-[#003F2D] appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#F4D600] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#003F2D]"
                />
                
                <button 
                  onClick={handleZoomIn}
                  className="w-8 h-8 border-2 border-[#003F2D] bg-[#F4F1E1] flex items-center justify-center text-[#003F2D] hover:bg-[#F4D600] hover:translate-y-[1px] hover:translate-x-[1px] shadow-[2px_2px_0_0_#003F2D] hover:shadow-[1px_1px_0_0_#003F2D] transition-all font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-[320px] mx-auto mt-8 flex justify-between gap-4">
              <button 
                onClick={handleReset}
                className="flex-1 py-2 border-2 border-[#003F2D] bg-[#F4F1E1] text-[#003F2D] font-mono font-bold text-[11px] uppercase tracking-widest hover:bg-[#EAE5D0] shadow-[2px_2px_0_0_#003F2D] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#003F2D] transition-all"
              >
                RESET
              </button>
              <button 
                onClick={handleReplace}
                className="flex-1 py-2 border-2 border-[#003F2D] bg-[#003F2D] text-[#F4D600] font-mono font-bold text-[11px] uppercase tracking-widest hover:bg-[#002619] shadow-[2px_2px_0_0_#003F2D] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#003F2D] transition-all"
              >
                REPLACE
              </button>
            </div>
            
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 w-full animate-in fade-in duration-300">
          <label 
            htmlFor="photo-upload-input"
            className={`w-full h-[140px] md:h-[160px] transition-all duration-250 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer gap-3 group px-4 relative overflow-hidden ${
              isDragging 
                ? "bg-[#F4D600] border-[#003F2D]" 
                : "bg-[#FFFDF5] hover:bg-[#F4F1E1] border-[#003F2D]"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className={`w-[48px] h-[48px] border-2 border-[#003F2D] flex items-center justify-center bg-white transition-all duration-250 ${
              isDragging ? "scale-110 bg-[#003F2D] text-[#F4D600]" : "group-hover:-translate-y-[2px] group-hover:shadow-[2px_2px_0_0_#003F2D] text-[#003F2D]"
            }`}>
              <Upload className={`w-[20px] h-[20px] transition-colors`} />
            </div>
            <div className="flex flex-col text-center z-10 pointer-events-none">
              <span className="font-mono font-bold text-[#003F2D] text-[13px] md:text-[14px] uppercase tracking-widest leading-tight">
                DROP YOUR BUILDER FACE HERE
              </span>
              <span className="font-sans font-medium text-[11px] text-[#003F2D] opacity-70 mt-1 uppercase tracking-widest">
                JPG · PNG · WEBP · HEIC
              </span>
            </div>
          </label>
          {error && <span className="font-sans text-[13px] text-red-600 mt-2 font-medium px-2">{error}</span>}
        </div>
      )}
      
      {/* Hidden file input used by both empty state and replace button */}
      <input ref={fileInputRef} id="photo-upload-input" type="file" accept="image/*,.heic" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
