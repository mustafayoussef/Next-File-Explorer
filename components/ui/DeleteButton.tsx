"use client";

import { removeFromRecent } from "@/lib/recent";
import { deleteItem } from "@/lib/store";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface DeleteButtonProps {
  itemId: string;
  itemName: string;
  itemType: "file" | "folder";
  className?: string;
}

export function DeleteButton({ itemId, itemName, itemType, className = "" }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      dispatch(deleteItem({ itemId }));

      if (itemType === "file") {
        removeFromRecent(itemName);
      }

      if (itemType === "file") {
        try {
          await fetch(`/api/files/${itemId}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.warn("Could not delete file from server:", error);
        }
      }

      setShowConfirm(false);
      toast.success("Folder deleted successfully");
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item");
      toast.error("Failed to delete item");
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className={`p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors ${className}`}
        title={`Delete ${itemType}`}
      >
        <Trash2 size={16} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
            <h2 className="text-lg font-semibold text-red-600">Confirm Delete</h2>
            <p className="text-gray-700">
              Are you sure you want to delete "{itemName}"?
              {itemType === "folder" && " This will also delete all contents inside it."}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
