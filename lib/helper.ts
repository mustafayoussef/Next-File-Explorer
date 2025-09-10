import { FolderNode } from "./data";

export function getPathFromRoot(
  root: FolderNode,
  id: string,
  path: Array<{ id: string; name: string }> = []
): Array<{ id: string; name: string }> {
  if (root.id === id) {
    return [...path, { id: root.id, name: root.name }];
  }

  for (const child of root.children) {
    if (child.type === "folder") {
      const result = getPathFromRoot(child, id, [...path, { id: root.id, name: root.name }]);
      if (result.length) return result;
    }
  }

  return [];
}
