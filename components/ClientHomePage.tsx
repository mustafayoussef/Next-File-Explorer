"use client";

import { SearchBar } from "@/components/navigation/SearchBar";
import { type RootState } from "@/lib/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CreateFileButton } from "./forms/CreateFileButton";
import { CreateFolderButton } from "./forms/CreateFolderButton";
import { BreadcrumbNavigation } from "./navigation/BreadcrumbNavigation";
import { FolderList } from "./navigation/FolderList";
import { ViewToggle } from "./ui/ViewToggle";
import { Toaster } from "react-hot-toast";

export function ClientHomePage() {
  const [isGrid, setIsGrid] = useState(false);
  const reduxRoot = useSelector((state: RootState) => state.fileSystem.root);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Toaster />

      <BreadcrumbNavigation currentFolderId="root" rootData={reduxRoot} />

      <div className="w-full sm:max-w-md">
        <SearchBar />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Files</h1>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <ViewToggle isGrid={isGrid} onToggle={setIsGrid} />
          <div className="flex gap-2 flex-1 sm:flex-initial">
            <CreateFileButton folderId="root" />
            <CreateFolderButton folderId="root" />
          </div>
        </div>
      </div>

      <FolderList nodes={reduxRoot.children} isGrid={isGrid} currentFolderId="root" />
    </div>
  );
}
