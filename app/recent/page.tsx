"use client";

import { FileIcon } from "@/components/ui/FileIcon";
import { FileViewer } from "@/components/ui/FileViewer";
import { FileNode } from "@/lib/data";
import { getRecentFiles } from "@/lib/recent";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecentPage() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [recentFiles, setRecentFiles] = useState<ReturnType<typeof getRecentFiles>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setRecentFiles(getRecentFiles());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock size={24} className="text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Clock size={48} className="mb-4 opacity-50" />
          <p className="text-lg">Loading recent files...</p>
        </div>
      </div>
    );
  }

  if (recentFiles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock size={24} className="text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Clock size={48} className="mb-4 opacity-50" />
          <p className="text-lg">No recent files</p>
          <p className="text-sm">Files you view will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Clock size={20} className="sm:w-6 sm:h-6 text-gray-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Files</h1>
        </div>

        <div className="space-y-1 sm:space-y-2">
          {recentFiles.map((file) => (
            <div
              key={`${file.id}-${file.accessedAt.getTime()}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors gap-2 sm:gap-0"
            >
              <button
                onClick={() => setSelectedFile(file)}
                className="flex items-center gap-2 sm:gap-3 flex-1 text-left min-w-0"
              >
                <FileIcon fileName={file.name} className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{file.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Accessed {file.accessedAt.toLocaleDateString()} at {file.accessedAt.toLocaleTimeString()}
                  </p>
                </div>
              </button>

              <Link
                href={file.folderId === "root" ? "/" : `/folder/${file.folderId}`}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors self-end sm:self-center"
              >
                <span className="hidden sm:inline">Go to folder</span>
                <span className="sm:hidden">Folder</span>
                <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {selectedFile && <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />}
    </>
  );
}
