"use client";

import { CreateFileButton } from "@/components/forms/CreateFileButton";
import { CreateFolderButton } from "@/components/forms/CreateFolderButton";
import { FolderList } from "@/components/navigation/FolderList";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { FolderNode } from "@/lib/data";
import { type RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { BreadcrumbNavigation } from "./navigation/BreadcrumbNavigation";
import { SearchBar } from "./navigation/SearchBar";

interface ClientFolderPageProps {
  folderId: string;
}

export function ClientFolderPage({ folderId }: ClientFolderPageProps) {
  const [isGrid, setIsGrid] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<FolderNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reduxRoot = useSelector((state: RootState) => state.fileSystem.root);

  const findFolder = (current: FolderNode, id: string): FolderNode | null => {
    if (current.id === id) return current;
    for (const child of current.children) {
      if (child.type === "folder") {
        const result = findFolder(child, id);
        if (result) return result;
      }
    }
    return null;
  };

  useEffect(() => {
    if (reduxRoot) {
      const folder = findFolder(reduxRoot, folderId);
      setCurrentFolder(folder);
      setIsLoading(false);
    }
  }, [reduxRoot, folderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg">Loading folder...</p>
      </div>
    );
  }

  if (!currentFolder) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg">Folder not found</p>
        <p className="text-sm mt-2">This folder may have been deleted or moved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Toaster />
      <BreadcrumbNavigation currentFolderId={folderId} rootData={reduxRoot} />

      <div className="w-full sm:max-w-md">
        <SearchBar />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentFolder.name}</h1>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <ViewToggle isGrid={isGrid} onToggle={setIsGrid} />
          <div className="flex gap-2 flex-1 sm:flex-initial">
            <CreateFileButton folderId={folderId} />
            <CreateFolderButton folderId={folderId} />
          </div>
        </div>
      </div>

      <FolderList nodes={currentFolder.children} isGrid={isGrid} currentFolderId={folderId} />
    </div>
  );
}
