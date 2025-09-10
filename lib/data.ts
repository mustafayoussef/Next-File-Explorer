export type FileNode = {
  id: string;
  name: string;
  realPath: string;
  type: "file";
};

export type FolderNode = {
  id: string;
  name: string;
  type: "folder";
  children: Array<FolderNode | FileNode>;
};

export const root: FolderNode = {
  id: "root",
  name: "root",
  type: "folder",
  children: [
    { id: "folder-1", name: "Folder 1", type: "folder", children: [] },
    { id: "folder-2", name: "Folder 2", type: "folder", children: [] },
  ],
};

export function findFolder(id: string, current: FolderNode = root): FolderNode | null {
  if (current.id === id) return current;
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolder(id, child);
      if (result) return result;
    }
  }
  return null;
}

export function addFolder(parentId: string, name: string): boolean {
  const parent = findFolder(parentId);
  if (!parent || parent.type !== "folder") return false;

  if (parent.children.some((child) => child.type === "folder" && child.name === name)) {
    return false;
  }

  const newFolder: FolderNode = {
    id: `folder-${Date.now()}`,
    name,
    type: "folder",
    children: [],
  };

  parent.children.push(newFolder);
  return true;
}

export function addFile(parentId: string, name: string): FileNode | null {
  const parent = findFolder(parentId);
  if (!parent) return null;

  const newFile: FileNode = {
    id: Date.now().toString(),
    name,
    type: "file",
    realPath: name,
  };

  parent.children.push(newFile);

  return newFile;
}

export function getPath(targetId: string): Array<{ id: string; name: string }> {
  const dfs = (
    node: FolderNode,
    acc: Array<{ id: string; name: string }>
  ): Array<{ id: string; name: string }> | null => {
    const next = [...acc, { id: node.id, name: node.id === "root" ? "Home" : node.name }];
    if (node.id === targetId) return next;
    for (const ch of node.children) {
      if (ch.type === "folder") {
        const r = dfs(ch as FolderNode, next);
        if (r) return r;
      }
    }
    return null;
  };
  return dfs(root, []) ?? [{ id: "root", name: "Home" }];
}
