import { FileText, Image, Video, Music, Archive, Code, FileSpreadsheet, FileType, File } from "lucide-react";

interface FileIconProps {
  fileName: string;
  className?: string;
}

export function FileIcon({ fileName, className = "w-5 h-5" }: FileIconProps) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const getIcon = () => {
    // Images
    if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(extension)) {
      return <Image className={`${className} text-green-600`} />;
    }

    // Videos
    if (["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(extension)) {
      return <Video className={`${className} text-red-600`} />;
    }

    // Audio
    if (["mp3", "wav", "flac", "aac", "ogg", "wma"].includes(extension)) {
      return <Music className={`${className} text-purple-600`} />;
    }

    // Code files
    if (["js", "ts", "jsx", "tsx", "html", "css", "scss", "json", "xml", "yaml", "yml"].includes(extension)) {
      return <Code className={`${className} text-blue-600`} />;
    }

    // Documents
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText className={`${className} text-gray-600`} />;
    }

    // Spreadsheets
    if (["xls", "xlsx", "csv"].includes(extension)) {
      return <FileSpreadsheet className={`${className} text-green-700`} />;
    }

    // Archives
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <Archive className={`${className} text-orange-600`} />;
    }

    // Default
    return <File className={`${className} text-gray-500`} />;
  };

  return getIcon();
}
