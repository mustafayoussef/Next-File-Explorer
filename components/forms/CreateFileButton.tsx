"use client";

import { addToRecent } from "@/lib/recent";
import { addFile } from "@/lib/store";
import { FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

interface CreateFileButtonProps {
  folderId: string;
}

export function CreateFileButton({ folderId }: CreateFileButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const storeFileInMemory = async (file: File, fileName: string) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const fileData = {
        name: fileName,
        type: file.type,
        data: base64,
        size: file.size,
      };

      const existingFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");
      existingFiles[fileName] = fileData;
      localStorage.setItem("uploadedFiles", JSON.stringify(existingFiles));
    } catch (error) {
      console.error("Failed to store file in memory:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !name.trim()) return;

    setIsUploading(true);
    try {
      let fileName: string;

      if (file) {
        if (name.trim()) {
          const userProvidedName = name.trim();
          const originalExtension = file.name.split(".").pop();
          const userExtension = userProvidedName.split(".").pop();

          if (originalExtension && userExtension === userProvidedName) {
            fileName = `${userProvidedName}.${originalExtension}`;
          } else {
            fileName = userProvidedName;
          }
        } else {
          fileName = file.name;
        }
      } else {
        fileName = name.trim();
      }

      dispatch(addFile({ parentId: folderId, name: fileName, realPath: fileName }));

      if (file) {
        await storeFileInMemory(file, fileName);
      }

      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        formData.append("name", fileName);
        formData.append("realPath", fileName);
      } else {
        const emptyFile = new File([""], name.trim(), { type: "text/plain" });
        formData.append("file", emptyFile);
      }

      try {
        await fetch(`/api/files/${folderId}`, {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.warn("Could not sync with server:", error);
      }

      addToRecent(
        {
          id: Date.now().toString(),
          name: fileName,
          type: "file",
          realPath: fileName,
        },
        folderId
      );

      setOpen(false);
      setName("");
      setFile(null);
      toast.success("File created successfully");
    } catch (error) {
      console.error("Failed to create file:", error);
      toast.error("Failed to create file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex-1 sm:flex-initial justify-center"
      >
        <FileText size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">New File</span>
        <span className="xs:hidden">File</span>
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Create New File</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">File Name (optional if uploading)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter file name..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload File (optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">{file ? file.name : "Click to upload a file"}</p>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setName("");
                  setFile(null);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isUploading || (!file && !name.trim())}
              >
                {isUploading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
