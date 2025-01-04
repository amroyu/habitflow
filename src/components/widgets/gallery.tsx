"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, X, Upload, Trash2 } from "lucide-react";
import { WidgetBase } from "./widget-base";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ImageItem {
  id: string;
  url: string;
  path: string;
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
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"));
      const newImages: ImageItem[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random()}.${fileExt}`;

        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('habits')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('habits')
          .getPublicUrl(filePath);

        newImages.push({
          id: uploadData.path,
          url: publicUrl,
          path: uploadData.path,
        });
      }

      const updatedImages = [...imageList, ...newImages];
      setImageList(updatedImages);
      onChange?.(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (id: string, path: string) => {
    try {
      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from('habits')
        .remove([path]);

      if (error) {
        console.error('Error deleting file:', error);
        return;
      }

      const updatedImages = imageList.filter((image) => image.id !== id);
      setImageList(updatedImages);
      onChange?.(updatedImages);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
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
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Image"}
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
                    onClick={() => handleRemoveImage(image.id, image.path)}
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
