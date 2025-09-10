"use client";

import { addFolder } from "@/lib/store";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface CreateFolderButtonProps {
  folderId?: string;
}

export function CreateFolderButton({ folderId = "root" }: CreateFolderButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsCreating(true);
    try {
      const newFolderId = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      dispatch(addFolder({ parentId: folderId, name: trimmed, id: newFolderId }));

      try {
        await fetch(`/api/folders/${folderId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed }),
        });
      } catch (error) {
        console.warn("Could not sync folder creation with server:", error);
      }

      setOpen(false);
      setName("");
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base flex-1 sm:flex-initial justify-center"
      >
        <FolderPlus size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">New Folder</span>
        <span className="xs:hidden">Folder</span>
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Create New Folder</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Folder Name</label>
              <input
                autoFocus
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name..."
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setName("");
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isCreating || !name.trim()}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
