# 🗂️ Next.js File Explorer

A modern, feature-rich file explorer built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. This application provides an intuitive interface for managing files and folders with advanced features like search, recent files tracking, and responsive design.

## ✨ Features

### 📁 File & Folder Management

- **Create Folders**: Organize your files with custom folder structures
- **Upload Files**: Support for multiple file types with drag-and-drop interface
- **File Preview**: Built-in viewer for images, videos, audio, PDFs, and more
- **Rename & Delete**: Full CRUD operations with confirmation dialogs
- **Nested Navigation**: Navigate through folder hierarchies with breadcrumb navigation

### 🔍 Advanced Search

- **Real-time Search**: Instant search across all files and folders

### 📋 Recent Files

- **Activity Tracking**: Automatically track recently accessed files
- **Persistent History**: Recent files persist across browser sessions

### 🎨 Modern UI/UX

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Grid & List Views**: Toggle between different viewing modes
- **Smooth Animations**: Polished interactions with hover effects and transitions

### 💾 Data Persistence

- **Local Storage**: All data persists across browser sessions
- **State Management**: Redux Toolkit for reliable state management
- **Hydration Handling**: Proper SSR/CSR synchronization

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### State Management

- **Redux Toolkit** - Predictable state container
- **React Redux** - React bindings for Redux

### File Handling

- **File System API** - Browser-native file operations
- **Local Storage** - Client-side data persistence

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for file operations
│   ├── folder/[id]/       # Dynamic folder pages
│   ├── recent/            # Recent files page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form-related components
│   ├── navigation/       # Navigation components
│   └── providers/        # Context providers
├── lib/                  # Utility functions and configurations
│   ├── data.ts          # Data models and types
│   ├── store.ts         # Redux store configuration
│   └── recent.ts        # Recent files management
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mustafayoussef/Next-File-Explorer.git
   cd next-file-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Creating Files & Folders

1. Click the **"New Folder"** or **"New File"** buttons
2. Enter a name for your item
3. For files, optionally upload content or create empty files

### File Operations

- **View Files**: Click on any file to open the preview modal
- **Rename**: Hover over items and click the edit icon
- **Delete**: Hover over items and click the trash icon
- **Navigate**: Click on folders to enter them

### Search & Recent Files

- Use the search bar to find files and folders instantly
- Visit the **"Recent Files"** page to see your activity history

## 🎥 Demo Video

https://github.com/user-attachments/assets/2842d1d4-6c20-4fbe-b1a0-a0dd0d9e2606

## 🔧 Configuration

### Customization

- **Colors**: Modify the color scheme in `tailwind.config.ts`
- **File Types**: Add new file type support in `components/ui/FileIcon.tsx`
- **Storage**: Extend storage options in `lib/store.ts`

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Redux Toolkit** - For simplified Redux development
