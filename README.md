# Book Reader

A professional desktop PDF reader application with advanced features for effective document management.

[![Platform](https://img.shields.io/badge/Platform-Windows-blue)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Download

**Executable:** `dist\win-unpacked\Book Reader.exe`

**Direct Download:** [Download Book Reader.exe](https://raw.githubusercontent.com/)

---

## Overview

Book Reader is a feature-rich desktop application designed for seamless PDF reading, annotation, and organization. Built with modern technologies, it delivers a smooth and responsive user experience with robust local data management.

## Features

| Feature | Description |
|---------|-------------|
| **PDF Rendering** | High-quality PDF viewing powered by PDF.js |
| **Text Highlighting** | Multi-color text highlighting with persistent storage |
| **Bookmarking** | Save and organize important pages with notes |
| **Search** | Full-text search across documents |
| **Dark Mode** | Eye-friendly dark and light theme toggle |
| **Local Storage** | SQLite-based local database for all data |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Desktop Framework | Electron.js |
| UI Library | React.js |
| PDF Engine | PDF.js |
| Database | SQLite |
| Runtime | Node.js |

## System Requirements

- **Operating System:** Windows 10 or later
- **RAM:** 4 GB minimum (8 GB recommended)
- **Storage:** 200 MB available space

## Installation

### Option 1: Direct Download (Recommended)
1. Click the download button above
2. Save `Book Reader.exe` to your preferred location
3. Double-click to launch the application

### Option 2: Build from Source

```bash
# Clone the repository
git clone <repository-url>
cd READER

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for Windows
npm run build:win
```

The executable will be generated in the `dist/Book Reader-win32-x64/` directory.

## Usage Guide

### Opening a PDF
1. Click **Open PDF** in the toolbar
2. Select your PDF file
3. The document loads automatically

### Highlighting Text
1. Select a highlight color from the toolbar
2. Click and drag over text in the PDF
3. Highlights are saved automatically to the database

### Managing Bookmarks
1. Navigate to the desired page
2. Click the **Bookmark** icon in the toolbar
3. Add an optional note for reference
4. Access all bookmarks from the sidebar

### Search Functionality
1. Enter search terms in the search bar
2. Press **Enter** to execute
3. Matches are highlighted on the current page

### Theme Toggle
Click the theme icon in the top-right corner to switch between light and dark modes.

## Project Structure

```
READER/
├── dist/                    # Built application
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Toolbar.js
│   │   ├── Sidebar.js
│   │   ├── PDFViewer.js
│   │   └── WelcomeScreen.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── main.js                  # Electron main process
├── preload.js               # Electron preload script
├── package.json
└── README.md
```

## Database Schema

The application uses SQLite with the following tables:

| Table | Purpose |
|-------|---------|
| `documents` | Document metadata storage |
| `highlights` | Text highlight positions and colors |
| `bookmarks` | Page bookmarks with optional notes |

## Getting Help

For issues, feature requests, or contributions, please contact the repository maintainer.

## License

MIT License

---

© 2024 Book Reader Application
