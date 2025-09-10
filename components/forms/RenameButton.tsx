import { updateRecentFileName } from "@/lib/recent";
import { renameItem } from "@/lib/store";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface RenameButtonProps {
  itemId: string;
  itemName: string;
  itemType: "file" | "folder";
  className?: string;
}

export function RenameButton({ itemId, itemName, itemType, className = "" }: RenameButtonProps) {
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState(itemName);
  const dispatch = useDispatch();

  const handleRename = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === itemName) {
      setShowRename(false);
      return;
    }

    try {
      dispatch(renameItem({ itemId, newName: trimmedName }));
      if (itemType === "file") {
        updateRecentFileName(itemName, trimmedName);
      }
      try {
        if (itemType === "folder") {
          await fetch(`/api/folders/${itemId}/rename`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: trimmedName }),
          });
        } else {
          await fetch(`/api/files/${itemId}/rename`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: trimmedName }),
          });
        }
      } catch (error) {
        console.warn("Could not sync rename with server:", error);
      }

      setShowRename(false);
    } catch (error) {
      console.error("Failed to rename item:", error);
      alert("Failed to rename item");
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setNewName(itemName);
          setShowRename(true);
        }}
        className={`p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors ${className}`}
        title={`Rename ${itemType}`}
      >
        <Edit2 size={16} />
      </button>

      {showRename && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
            <h2 className="text-lg font-semibold text-blue-600">Rename {itemType}</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  } else if (e.key === "Escape") {
                    setShowRename(false);
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRename(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={!newName.trim() || newName.trim() === itemName}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
