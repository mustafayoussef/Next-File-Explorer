"use client";

import { FolderNode } from "@/lib/data";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BreadcrumbNavigationProps {
  currentFolderId: string;
  rootData: FolderNode;
}

export function BreadcrumbNavigation({ currentFolderId, rootData }: BreadcrumbNavigationProps) {
  const [pathItems, setPathItems] = useState<Array<{ id: string; name: string }>>([]);

  const buildPath = (folderId: string): Array<{ id: string; name: string }> => {
    if (folderId === "root") {
      return [{ id: "root", name: "Home" }];
    }

    const findPath = (
      current: FolderNode,
      targetId: string,
      path: Array<{ id: string; name: string }> = []
    ): Array<{ id: string; name: string }> | null => {
      const currentPath = [...path, { id: current.id, name: current.name }];

      if (current.id === targetId) {
        return currentPath;
      }

      if (current.children) {
        for (const child of current.children) {
          if (child.type === "folder") {
            const result = findPath(child, targetId, currentPath);
            if (result) return result;
          }
        }
      }

      return null;
    };

    return findPath(rootData, folderId) || [{ id: "root", name: "Home" }];
  };

  useEffect(() => {
    if (rootData) {
      const path = buildPath(currentFolderId);
      setPathItems(path);
    }
  }, [currentFolderId, rootData]);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {pathItems.map((item, index) => (
        <div key={item.id} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
          {index === 0 && <Home size={16} className="mr-2" />}
          {index === pathItems.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link
              href={item.id === "root" ? "/" : `/folder/${item.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
