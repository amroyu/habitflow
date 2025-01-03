"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, X, Upload, Trash2 } from "lucide-react";
import { WidgetBase } from "./widget-base";

interface ImageItem {
  id: string;
  url: string;
  caption?: string;
}

interface GalleryProps {
  images?: ImageItem[];
  onRemove?: () => void;
  onEdit?: () => void;
  onChange?: (images: ImageItem[]) => void;
}

export function Gallery({ images = [], onRemove, onEdit, onChange }: GalleryProps) {
  const [imageList, setImageList] = useState<ImageItem[]>(images);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          id: String(Date.now()) + Math.random(),
          url: URL.createObjectURL(file),
        }));

      const updatedImages = [...imageList, ...newImages];
      setImageList(updatedImages);
      onChange?.(updatedImages);
    }
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = imageList.filter((image) => image.id !== id);
    setImageList(updatedImages);
    onChange?.(updatedImages);
  };

  return (
    <WidgetBase title="Gallery" onRemove={onRemove} onEdit={onEdit}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
            multiple
          />
        </div>

        <ScrollArea className="h-[300px] w-full rounded-md border p-2">
          {imageList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">No images uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {imageList.map((image) => (
                <Card
                  key={image.id}
                  className="relative overflow-hidden group"
                >
                  <img
                    src={image.url}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </WidgetBase>
  );
}
