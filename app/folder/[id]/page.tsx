"use client";

import { ClientFolderPage } from "@/components/ClientFolderPage";

interface Props {
  params: { id: string };
}

export default function FolderPage({ params }: Props) {
  return <ClientFolderPage folderId={params.id} />;
}
