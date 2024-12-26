'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  onImageChange: (file: File) => void;
}

export function AvatarUpload({ onImageChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative group cursor-pointer" onClick={handleClick}>
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || ""} />
          <AvatarFallback className="bg-secondary">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-8 w-8 text-white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      <span className="text-xs text-muted-foreground">
        Click to upload profile picture
      </span>
    </div>
  );
}
