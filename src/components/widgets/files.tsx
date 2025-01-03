"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, X, Upload, Trash2 } from "lucide-react";
import { WidgetBase } from "./widget-base";

interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface FilesProps {
  files?: FileItem[];
  onRemove?: () => void;
  onEdit?: () => void;
  onChange?: (files: FileItem[]) => void;
}

export function Files({ files = [], onRemove, onEdit, onChange }: FilesProps) {
  const [fileList, setFileList] = useState<FileItem[]>(files);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: String(Date.now()) + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      }));

      const updatedFiles = [...fileList, ...newFiles];
      setFileList(updatedFiles);
      onChange?.(updatedFiles);
    }
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = fileList.filter((file) => file.id !== id);
    setFileList(updatedFiles);
    onChange?.(updatedFiles);
  };

  return (
    <WidgetBase title="Files" onRemove={onRemove} onEdit={onEdit}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
        </div>

        <ScrollArea className="h-[200px] w-full rounded-md border p-2">
          {fileList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <File className="w-8 h-8 mb-2" />
              <p className="text-sm">No files uploaded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fileList.map((file) => (
                <Card
                  key={file.id}
                  className="p-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[150px]">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
