# Book Reader Application

A modern desktop PDF reader application built with Electron.js, React, and PDF.js. Features include text highlighting, bookmarking, search functionality, and dark mode support.

## Features

- 📖 **PDF Rendering** - Smooth PDF viewing with PDF.js
- 🎨 **Text Highlighting** - Select and highlight text with multiple colors
- 🔖 **Bookmarks** - Save important pages with optional notes
- 🔍 **Search** - Find text across your document
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⚡ **Fast & Responsive** - Built with React for smooth performance
- 💾 **Local Storage** - All data stored locally with SQLite

## Tech Stack

- **Electron.js** - Desktop application framework
- **React.js** - Frontend UI library
- **PDF.js** - PDF rendering engine
- **SQLite** - Local database for highlights and bookmarks
- **Node.js** - Backend runtime

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will:
- Start the React development server on `http://localhost:3000`
- Launch the Electron app automatically

## Building

To build the application for Windows:

```bash
npm run build:win
```

The executable will be created in the `dist` folder as `Reader.exe`.

To build for all platforms:

```bash
npm run build
```

## Project Structure

```
READER/
├── public/              # Public assets
│   └── index.html       # HTML template
├── src/                 # React source code
│   ├── components/      # React components
│   │   ├── Toolbar.js
│   │   ├── Sidebar.js
│   │   ├── PDFViewer.js
│   │   └── WelcomeScreen.js
│   ├── App.js           # Main App component
│   ├── App.css
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── package.json         # Dependencies and scripts
└── README.md

## Usage

### Opening a PDF

1. Click the "Open PDF" button in the toolbar
2. Select a PDF file from your computer
3. The file will be copied to the app's storage and opened

### Highlighting Text

1. Select the highlight color from the color picker
2. Select text in the PDF by clicking and dragging
3. The highlight will be saved automatically
4. View all highlights in the sidebar

### Adding Bookmarks

1. Navigate to the page you want to bookmark
2. Click the bookmark button in the toolbar
3. Optionally add a note
4. View all bookmarks in the sidebar

### Searching

1. Enter text in the search box
2. Press Enter to search
3. Results will be highlighted on the current page

### Dark Mode

Click the moon/sun icon in the top-right corner to toggle dark mode.

## Database Schema

The application uses SQLite with three main tables:

- **documents** - Stores document metadata
- **highlights** - Stores text highlights with position and color
- **bookmarks** - Stores page bookmarks with optional notes

## License

MIT License
