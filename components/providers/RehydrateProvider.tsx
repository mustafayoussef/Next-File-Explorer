"use client";

import { rehydrateFromLocalStorage, type RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function RehydrateProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isRehydrated, setIsRehydrated] = useState(false);
  const root = useSelector((state: RootState) => state.fileSystem.root);

  useEffect(() => {
    if (!isRehydrated && typeof window !== "undefined") {
      dispatch(rehydrateFromLocalStorage());
      setIsRehydrated(true);
    }
  }, [dispatch]);

  if (!isRehydrated || !root) {
    return null;
  }

  return <>{children}</>;
}
