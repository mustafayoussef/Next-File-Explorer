import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Clock, Files, Home } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "File Explorer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="./favicon.ico" />
      </head>
      <body className="h-full bg-gray-50" suppressHydrationWarning={true}>
        <ReduxProvider>
          <div className="flex flex-col lg:flex-row h-full">
            {/* Mobile Header */}
            <header className="lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Files size={20} className="text-blue-600" />
                  File Explorer
                </h2>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex gap-2 mt-4 overflow-x-auto">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
                >
                  <Home size={16} />
                  My Files
                </Link>
                <Link
                  href="/recent"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
                >
                  <Clock size={16} />
                  Recent Files
                </Link>
              </nav>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 p-4 flex-col gap-2 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Files size={20} className="text-blue-600" />
                  File Explorer
                </h2>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Home size={18} />
                  My Files
                </Link>
                <Link
                  href="/recent"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Clock size={18} />
                  Recent Files
                </Link>
              </nav>
            </aside>

            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
