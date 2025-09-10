"use client";

import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  isGrid: boolean;
  onToggle: (isGrid: boolean) => void;
}

export function ViewToggle({ isGrid, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(false)}
        className={`p-2 transition-colors ${
          !isGrid ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
        title="List view"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`p-2 transition-colors ${
          isGrid ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
        title="Grid view"
      >
        <Grid size={16} />
      </button>
    </div>
  );
}
