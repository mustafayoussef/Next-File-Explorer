"use client";

import { FileNode } from "@/lib/data";
import { Download, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FileIcon } from "./FileIcon";

interface FileViewerProps {
  file: FileNode;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [fileData, setFileData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const extension = file.realPath.split(".").pop()?.toLowerCase() || "";

  useEffect(() => {
    const loadFileData = async () => {
      try {
        const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");
        const uploadedFile = uploadedFiles[file.realPath];

        if (uploadedFile) {
          const binaryString = atob(uploadedFile.data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: uploadedFile.type });
          const url = URL.createObjectURL(blob);
          setFileData(url);
        } else {
          setFileData(`/${file.realPath}`);
        }
      } catch (error) {
        console.error("Failed to load file data:", error);
        setFileData(`/${file.realPath}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadFileData();

    return () => {
      if (fileData && fileData.startsWith("blob:")) {
        URL.revokeObjectURL(fileData);
      }
    };
  }, [file.name]);
  const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(extension);
  const isVideo = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(extension);
  const isAudio = ["mp3", "wav", "flac", "aac", "ogg", "wma"].includes(extension);
  const isPdf = extension === "pdf";

  const handleDownload = () => {
    if (fileData) {
      const link = document.createElement("a");
      link.href = fileData;
      link.download = file.realPath;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 !mt-0 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[95vh] sm:max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <FileIcon fileName={file.name} className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold truncate">{file.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
              disabled={!fileData}
            >
              <Download size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-2 sm:p-4 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-24 sm:h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isImage && !imageError && fileData ? (
            <div className="flex justify-center">
              <img
                src={fileData}
                alt={file.realPath}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={() => setImageError(true)}
              />
            </div>
          ) : isVideo && fileData ? (
            <div className="flex justify-center">
              <video controls className="max-w-full max-h-full rounded-lg" preload="metadata">
                <source src={fileData} />
                Your browser does not support video playback.
              </video>
            </div>
          ) : isAudio && fileData ? (
            <div className="flex justify-center items-center h-24 sm:h-32">
              <audio controls className="w-full max-w-md">
                <source src={fileData} />
                Your browser does not support audio playback.
              </audio>
            </div>
          ) : isPdf && fileData ? (
            <div className="h-64 sm:h-96">
              <iframe src={fileData} className="w-full h-full border rounded-lg" title={file.name} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-gray-500 text-center">
              <Eye size={32} className="sm:w-12 sm:h-12 mb-2 sm:mb-4" />
              <p className="text-sm sm:text-base">
                {!fileData ? "File not found" : "Preview not available for this file type"}
              </p>
              <p className="text-sm">
                {!fileData ? "The file may have been deleted" : "Click download to view the file"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
