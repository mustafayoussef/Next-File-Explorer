import type { FileNode } from "./data";

let recentFiles: Array<FileNode & { accessedAt: string; folderId: string }> = [];

const RECENT_FILES_KEY = "recentFiles";

function getStoredRecentFiles(): Array<FileNode & { accessedAt: Date; folderId: string }> {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENT_FILES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((file: any) => ({
      ...file,
      accessedAt: new Date(file.accessedAt),
    }));
  } catch {
    return [];
  }
}

function saveRecentFiles(files: Array<FileNode & { accessedAt: string; folderId: string }>) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(files));
  } catch {}
}

export function addToRecent(file: FileNode, folderId: string) {
  recentFiles = recentFiles.filter((f) => f.id !== file.id);

  recentFiles.unshift({
    ...file,
    accessedAt: new Date().toISOString(),
    folderId,
  });

  recentFiles = recentFiles.slice(0, 20);

  saveRecentFiles(recentFiles);
}

export function getRecentFiles() {
  const recentFiles = getStoredRecentFiles();
  return recentFiles.sort((a, b) => b.accessedAt.getTime() - a.accessedAt.getTime());
}

export function removeFromRecent(fileName: string) {
  let recent = getStoredRecentFiles();
  recent = recent.filter((f) => f.name !== fileName);

  try {
    const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");
    delete uploadedFiles[fileName];
    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
  } catch (error) {
    console.error("Failed to remove file from uploaded files storage:", error);
  }

  saveRecentFiles(recent.map((f) => ({ ...f, accessedAt: f.accessedAt.toISOString() })));

  recentFiles = recent.map((f) => ({ ...f, accessedAt: f.accessedAt.toISOString() }));
}

export function updateRecentFileName(oldName: string, newName: string) {
  let recentFiles = getStoredRecentFiles();
  const fileIndex = recentFiles.findIndex((f) => f.name === oldName);
  if (fileIndex !== -1) {
    recentFiles[fileIndex].name = newName;

    try {
      const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "{}");
      if (uploadedFiles[oldName]) {
        uploadedFiles[newName] = { ...uploadedFiles[oldName], name: newName };
        delete uploadedFiles[oldName];
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
      }
    } catch (error) {
      console.error("Failed to update file name in uploaded files storage:", error);
    }

    saveRecentFiles(recentFiles.map((f) => ({ ...f, accessedAt: f.accessedAt.toISOString() })));
  }
}
