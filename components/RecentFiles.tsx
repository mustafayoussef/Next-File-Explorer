"use client";

import { FileIcon } from "@/components/ui/FileIcon";
import type { FileNode } from "@/lib/data";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileViewer } from "./ui/FileViewer";

interface RecentFilesClientProps {
  initialFiles: Array<FileNode & { accessedAt: Date; folderId: string }>;
}

export default function RecentFiles({ initialFiles }: RecentFilesClientProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [recentFiles, setRecentFiles] = useState(initialFiles);

  useEffect(() => {
    const interval = setInterval(() => {
      import("@/lib/recent").then((mod) => {
        setRecentFiles(mod.getRecentFiles());
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (recentFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Clock size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No recent files</p>
        <p className="text-sm">Files you view or upload will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {recentFiles.map((file) => (
          <div
            key={`${file.id}-${file.accessedAt.getTime()}`}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <button onClick={() => setSelectedFile(file)} className="flex items-center gap-3 flex-1 text-left">
              <FileIcon fileName={file.name} className="w-6 h-6" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  Accessed {file.accessedAt.toLocaleDateString()} at {file.accessedAt.toLocaleTimeString()}
                </p>
              </div>
            </button>

            <Link
              href={file.folderId === "root" ? "/" : `/folder/${file.folderId}`}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Go to folder
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      {selectedFile && <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />}
    </>
  );
}
