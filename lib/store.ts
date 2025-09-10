import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FileNode, FolderNode } from "./data";

const STORE_KEY = "fileSystemStore";

export function loadFromLocalStorage(): FileSystemState | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const stored = localStorage.getItem(STORE_KEY);

    if (!stored) return undefined;

    const parsed = JSON.parse(stored);
    if (parsed && parsed.root && typeof parsed.root === "object") {
      return {
        root: parsed.root,
        searchQuery: parsed.searchQuery || "",
        searchResults: parsed.searchResults || [],
      };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function saveToLocalStorage(state: FileSystemState) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        root: state.root,
        searchQuery: state.searchQuery,
        searchResults: state.searchResults,
      })
    );
  } catch {}
}

export interface FileSystemState {
  root: FolderNode;
  searchQuery: string;
  searchResults: Array<FileNode | FolderNode>;
}

const defaultState: FileSystemState = {
  root: {
    id: "root",
    name: "root",
    type: "folder",
    children: [
      { id: "folder-1", name: "Folder 1", type: "folder", children: [] },
      { id: "folder-2", name: "Folder 2", type: "folder", children: [] },
    ],
  },
  searchQuery: "",
  searchResults: [],
};

const initialState: FileSystemState = defaultState;

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    setPersistedState: (state, action: PayloadAction<FileSystemState>) => {
      state.root = action.payload.root;
      state.searchQuery = action.payload.searchQuery;
      state.searchResults = action.payload.searchResults;
    },
    addFolder: (state, action: PayloadAction<{ parentId: string; name: string; id?: string }>) => {
      const { parentId, name, id } = action.payload;
      const parent = findFolderInState(state.root, parentId);
      if (parent) {
        const existingFolder = parent.children.find((child) => child.type === "folder" && child.name === name.trim());
        if (existingFolder) {
          return;
        }

        parent.children.push({
          id: id ?? `folder-${Date.now()}`,
          name: name.trim(),
          type: "folder",
          children: [],
        });

        saveToLocalStorage(state);
      }
    },
    addFile: (state, action: PayloadAction<{ parentId: string; name: string; realPath?: string }>) => {
      const { parentId, name, realPath } = action.payload;
      const parent = findFolderInState(state.root, parentId);
      if (parent) {
        const existingFile = parent.children.find((child) => child.type === "file" && child.name === name.trim());
        if (existingFile) {
          return;
        }

        parent.children.push({
          id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: name.trim(),
          type: "file",
          realPath: realPath ?? name.trim(),
        });

        saveToLocalStorage(state);
      }
    },
    deleteItem: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;
      deleteItemFromState(state.root, itemId);
      saveToLocalStorage(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (action.payload.trim()) {
        state.searchResults = searchInFolder(state.root, action.payload.toLowerCase());
      } else {
        state.searchResults = [];
      }
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.searchResults = [];
    },
    renameItem: (state, action: PayloadAction<{ itemId: string; newName: string }>) => {
      const { itemId, newName } = action.payload;
      renameItemInState(state.root, itemId, newName);
      if (state.searchQuery.trim()) {
        state.searchResults = searchInFolder(state.root, state.searchQuery.toLowerCase());
      }
      saveToLocalStorage(state);
    },
    loadFromServer: (state, action: PayloadAction<FolderNode>) => {
      state.root = action.payload;
      if (state.searchQuery.trim()) {
        state.searchResults = searchInFolder(action.payload, state.searchQuery.toLowerCase());
      }
      saveToLocalStorage(state);
    },
    rehydrateFromLocalStorage: (state) => {
      const persisted = loadFromLocalStorage();
      if (persisted) {
        state.root = persisted.root;
        state.searchQuery = persisted.searchQuery || "";
        state.searchResults = persisted.searchResults || [];
      }
    },
  },
});

function findFolderInState(current: FolderNode, id: string): FolderNode | null {
  if (current.id === id) return current;
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolderInState(child, id);
      if (result) return result;
    }
  }
  return null;
}

function deleteItemFromState(current: FolderNode, itemId: string): boolean {
  const index = current.children.findIndex((child) => child.id === itemId);
  if (index !== -1) {
    current.children.splice(index, 1);
    return true;
  }

  for (const child of current.children) {
    if (child.type === "folder") {
      if (deleteItemFromState(child, itemId)) {
        return true;
      }
    }
  }
  return false;
}

function renameItemInState(current: FolderNode, itemId: string, newName: string): boolean {
  for (const child of current.children) {
    if (child.id === itemId) {
      child.name = newName;
      return true;
    }
  }

  for (const child of current.children) {
    if (child.type === "folder") {
      if (renameItemInState(child, itemId, newName)) {
        return true;
      }
    }
  }
  return false;
}

function searchInFolder(folder: FolderNode, query: string): Array<FileNode | FolderNode> {
  const results: Array<FileNode | FolderNode> = [];

  for (const child of folder.children) {
    if (child.name.toLowerCase().includes(query)) {
      results.push(child);
    }
    if (child.type === "folder") {
      results.push(...searchInFolder(child, query));
    }
  }

  return results;
}

export const store = configureStore({
  reducer: {
    fileSystem: fileSystemSlice.reducer,
  },
});

export const {
  setPersistedState,
  addFolder,
  addFile,
  deleteItem,
  setSearchQuery,
  clearSearch,
  renameItem,
  loadFromServer,
  rehydrateFromLocalStorage,
} = fileSystemSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
