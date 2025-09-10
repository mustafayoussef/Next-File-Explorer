"use client";

import type { FileNode, FolderNode } from "@/lib/data";
import { Folder } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RenameButton } from "../forms/RenameButton";
import { DeleteButton } from "../ui/DeleteButton";
import { FileIcon } from "../ui/FileIcon";
import { FileViewer } from "../ui/FileViewer";

interface FolderListProps {
  nodes: Array<FolderNode | FileNode>;
  isGrid?: boolean;
  currentFolderId?: string;
}

export function FolderList({ nodes, isGrid = false, currentFolderId = "root" }: FolderListProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleFileClick = (file: FileNode) => {
    setSelectedFile(file);
  };

  if (!nodes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Folder size={48} className="mb-4 opacity-50" />
        <p>This folder is empty</p>
      </div>
    );
  }

  const containerClass = isGrid
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    : "flex flex-col gap-2";

  return (
    <>
      <div className={containerClass}>
        {nodes.map((node) =>
          node.type === "folder" ? (
            <div
              key={node.id}
              className={`group relative ${
                isGrid
                  ? "flex flex-col items-start p-2 sm:p-3 lg:p-4 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 border border-gray-200 hover:shadow-md"
                  : "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 border border-gray-200"
              }`}
              onMouseEnter={() => setHoveredItem(node.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`${isGrid ? "w-full" : "flex items-center gap-3 flex-1"}`}>
                <Link
                  href={`/folder/${node.id}`}
                  className={`${
                    isGrid ? "flex items-center gap-1 sm:gap-2 w-full" : "flex items-center gap-2 sm:gap-3 flex-1"
                  }`}
                >
                  <Folder
                    className={`${
                      isGrid ? "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" : "w-4 h-4 sm:w-5 sm:h-5"
                    } text-blue-600`}
                  />
                  <span
                    className={`${
                      isGrid ? "text-xs sm:text-sm flex-1" : "text-sm sm:text-base flex-1"
                    } font-medium text-gray-900 truncate`}
                  >
                    {node.name}
                  </span>
                </Link>
              </div>
              {hoveredItem === node.id && (
                <div className={`${isGrid ? "absolute top-1 right-1 sm:top-2 sm:right-2" : ""} flex gap-1`}>
                  <RenameButton itemId={node.id} itemName={node.name} itemType="folder" />
                  <DeleteButton itemId={node.id} itemName={node.name} itemType="folder" />
                </div>
              )}
            </div>
          ) : (
            <div
              key={node.id}
              className={`group relative text-left ${
                isGrid
                  ? "flex flex-col items-start p-2 sm:p-3 lg:p-4 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all duration-200 border border-gray-200 hover:shadow-md"
                  : "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all duration-200 border border-gray-200"
              }`}
              onMouseEnter={() => setHoveredItem(node.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`${isGrid ? "w-full" : "flex items-center gap-3 flex-1"}`}>
                <button
                  onClick={() => handleFileClick(node)}
                  className={`${
                    isGrid ? "flex items-center gap-1 sm:gap-2 w-full" : "flex items-center gap-2 sm:gap-3 "
                  }`}
                >
                  <FileIcon
                    fileName={node.name}
                    className={`${isGrid ? "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" : "w-4 h-4 sm:w-5 sm:h-5"}`}
                  />
                  <span
                    className={`${
                      isGrid ? "text-xs sm:text-sm flex-1" : "text-sm sm:text-base flex-1"
                    } font-medium text-gray-900 truncate`}
                  >
                    {node.name}
                  </span>
                </button>
              </div>
              {hoveredItem === node.id && (
                <div className={`${isGrid ? "absolute top-1 right-1 sm:top-2 sm:right-2" : ""} flex gap-1`}>
                  <RenameButton itemId={node.id} itemName={node.name} itemType="file" />
                  <DeleteButton itemId={node.id} itemName={node.name} itemType="file" />
                </div>
              )}
            </div>
          )
        )}
      </div>

      {selectedFile && <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />}
    </>
  );
}
