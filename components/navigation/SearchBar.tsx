"use client";

import { clearSearch as clearSearchAction, setSearchQuery, type RootState } from "@/lib/store";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileIcon } from "../ui/FileIcon";
import { FileViewer } from "../ui/FileViewer";
import { FileNode } from "@/lib/data";

export function SearchBar() {
  const dispatch = useDispatch();
  const { searchQuery, searchResults } = useSelector((state: RootState) => state.fileSystem);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    setShowResults(query.trim().length > 0);
  };

  const handleClearSearch = () => {
    dispatch(clearSearchAction());
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(searchQuery.trim().length > 0)}
          className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 sm:max-h-96 overflow-y-auto">
          {searchResults.map((item) => (
            <div key={item.id} className="p-2 sm:p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
              {item.type === "folder" ? (
                <Link
                  href={item.id === "root" ? "/" : `/folder/${item.id}`}
                  className="flex items-center gap-2 sm:gap-3"
                  onClick={() => {
                    setShowResults(false);
                    dispatch(clearSearchAction());
                  }}
                >
                  <FileIcon fileName={item.name} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base truncate flex-1">{item.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500">Folder</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSelectedFile(item);
                    setShowResults(false);
                    dispatch(clearSearchAction());
                  }}
                  className="flex items-center gap-2 sm:gap-3 w-full text-left"
                >
                  <FileIcon fileName={item.name} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base truncate flex-1">{item.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500">File</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFile && <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />}
    </div>
  );
}
