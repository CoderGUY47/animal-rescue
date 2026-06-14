"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { FaUpload, FaTimes, FaImage } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/lib/utils";

type UploadedImage = {
 public_id: string;
 secure_url: string;
 width: number;
 height: number;
};

type ImageUploadProps = {
 onUpload: (images: UploadedImage[]) => void;
 maxImages?: number;
 className?: string;
};

export function ImageUpload({ onUpload, maxImages = 3, className }: ImageUploadProps) {
 const [images, setImages] = useState<UploadedImage[]>([]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // If env vars not set yet, show a placeholder
  if (!cloudName || !uploadPreset) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl p-6 text-center text-sm text-amber-700">
          <FaImage className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p className="font-semibold">Cloudinary not configured yet</p>
          <p className="text-xs mt-1 opacity-80">
            Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{" "}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> to your{" "}
            <code className="bg-amber-100 px-1 rounded">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

 const handleSuccess = (result: unknown) => {
 const info = (result as { info: UploadedImage }).info;
 const newImages = [...images, info];
 setImages(newImages);
 onUpload(newImages);
 };

 const removeImage = (index: number) => {
 const updated = images.filter((_, i) => i !== index);
 setImages(updated);
 onUpload(updated);
 };

 return (
 <div className={cn("flex flex-col gap-3", className)}>
 {/* Uploaded previews */}
 {images.length > 0 && (
 <div className="grid grid-cols-3 gap-2">
 {images.map((img, i) => (
 <div key={img.public_id} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
 <Image
 src={img.secure_url}
 alt={`Uploaded photo ${i + 1}`}
 fill
 className="object-cover"
 sizes="(max-width: 768px) 33vw, 150px"
 />
 <button
 type="button"
 onClick={() => removeImage(i)}
 className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity active:opacity-100"
 >
 <FaTimes className="w-3.5 h-3.5" />
 </button>
 </div>
 ))}
 </div>
 )}

 {/* Upload trigger — only show if under limit */}
 {images.length < maxImages && (
 <CldUploadWidget
 uploadPreset={uploadPreset}
 options={{
 cloudName,
 multiple: false,
 maxFiles: 1,
 resourceType: "image",
 maxFileSize: 10_000_000, // 10 MB
 folder: "animal-rescue",
 clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
 sources: ["local", "camera"],
 styles: { palette: { window: "#ffffff", sourceBg: "#f8f9fa" } },
 }}
 onSuccess={handleSuccess}
 >
 {({ open }) => (
 <button
 type="button"
 onClick={() => open()}
 className="flex flex-col items-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center text-sm text-muted-foreground bg-muted/10 cursor-pointer hover:bg-muted/20 hover:border-primary/40 transition-all w-full"
 >
 <FaUpload className="w-6 h-6" />
 <span className="">
 {images.length === 0 ? "Upload animal photo" : "Add another photo"}
 </span>
 <span className="text-xs opacity-60">
 JPG, PNG, WEBP up to 10MB ({images.length}/{maxImages})
 </span>
 </button>
 )}
 </CldUploadWidget>
 )}
 </div>
 );
}
