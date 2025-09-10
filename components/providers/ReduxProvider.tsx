"use client";

import { store, rehydrateFromLocalStorage } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { RehydrateProvider } from "./RehydrateProvider";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 100);

    store.dispatch(rehydrateFromLocalStorage());

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsHydrated(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, 200);
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isHydrated) {
    return (
      <Provider store={store}>
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6 max-w-md mx-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading File Explorer</h2>
              <p className="text-gray-600">Preparing your files and folders...</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">{Math.round(Math.min(progress, 100))}%</div>
          </div>
        </div>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <RehydrateProvider>{children}</RehydrateProvider>
    </Provider>
  );
}
