# Build Instructions for Book Reader

## Prerequisites

Before building the application, ensure you have:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Windows Build Tools** (for native modules)
   - Run in PowerShell as Administrator:
   ```powershell
   npm install --global windows-build-tools
   ```

## Step-by-Step Build Process

### 1. Install Dependencies

Open PowerShell or Command Prompt in the READER folder and run:

```bash
npm install
```

This will install all required dependencies including:
- Electron
- React
- PDF.js
- SQLite (better-sqlite3)
- React Icons
- And all other dependencies

**Note**: The `better-sqlite3` package requires native compilation. If you encounter errors:

```bash
# Try rebuilding the native module
npm rebuild better-sqlite3
```

### 2. Development Mode

To test the application in development mode:

```bash
npm run dev
```

This will:
1. Start the React development server
2. Automatically open the Electron window
3. Enable hot-reloading for React components
4. Open DevTools for debugging

### 3. Build for Production

#### Option A: Build Windows Executable Only

```bash
npm run build:win
```

#### Option B: Build React App First (Manual)

If you want to build step-by-step:

```bash
# Step 1: Build React app
npm run build:react

# Step 2: Build Electron app
npm run build
```

### 4. Find Your Executable

After building, you'll find:

```
READER/
└── dist/
    ├── Reader Setup X.X.X.exe    # Installer
    └── win-unpacked/
        └── Reader.exe             # Portable executable
```

- **Reader Setup X.X.X.exe** - Full installer (recommended for distribution)
- **Reader.exe** (in win-unpacked) - Portable version (no installation needed)

## Troubleshooting

### Issue: "better-sqlite3" build fails

**Solution 1**: Install Windows Build Tools
```bash
npm install --global windows-build-tools
```

**Solution 2**: Rebuild the module
```bash
npm rebuild better-sqlite3
```

**Solution 3**: Use Python 3.11 or lower
```bash
npm config set python python3.11
```

### Issue: "electron-builder" fails

**Solution**: Clear cache and reinstall
```bash
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: React app doesn't build

**Solution**: Increase Node.js memory
```bash
set NODE_OPTIONS=--max-old-space-size=4096
npm run build:react
```

### Issue: "EPERM: operation not permitted"

**Solution**: Run PowerShell as Administrator or disable antivirus temporarily

## Building with Custom Icon

To use a custom icon:

1. Create or download an `.ico` file (256x256 recommended)
2. Save it as `build/icon.ico`
3. Rebuild the application

## Distribution

### Option 1: NSIS Installer (Recommended)

The default build creates an NSIS installer with:
- Desktop shortcut
- Start menu entry
- Uninstaller
- Installation directory selection

### Option 2: Portable Version

Use the executable from `dist/win-unpacked/Reader.exe`:
- No installation required
- Can run from USB drive
- All data stored in app folder

## Performance Optimization

For faster startup in production:

1. **Minimize Dependencies**: Already optimized
2. **Code Splitting**: Implemented in React build
3. **Lazy Loading**: Components load on demand
4. **Asset Optimization**: Configured in package.json

## Advanced Configuration

### Custom Build Directory

Edit `package.json`:

```json
"build": {
  "directories": {
    "output": "release"  // Change output directory
  }
}
```

### Multiple Platforms

To build for Windows, Mac, and Linux:

```bash
npm run build -- --win --mac --linux
```

Note: Building for Mac requires macOS, building for Linux is possible from Windows.

## Testing the Build

Before distributing:

1. Test the installer on a clean Windows machine
2. Verify all features work:
   - PDF opening
   - Highlighting
   - Bookmarks
   - Search
   - Dark mode
3. Check database creation in `%APPDATA%/book-reader`
4. Test file storage in user data directory

## File Locations After Installation

When users install and run the app:

- **Application**: `C:\Program Files\Book Reader\`
- **User Data**: `C:\Users\[Username]\AppData\Roaming\book-reader\`
- **Database**: `C:\Users\[Username]\AppData\Roaming\book-reader\reader.db`
- **Documents**: `C:\Users\[Username]\AppData\Roaming\book-reader\documents\`

## Updating the Application

To release an update:

1. Update version in `package.json`
2. Rebuild the application
3. Distribute new installer
4. User data and documents are preserved

## Security Notes

- Database is stored locally (not encrypted)
- No external network requests
- PDF files copied to app storage
- User data never leaves the machine

## Support

For issues:
1. Check console logs in DevTools (Development mode)
2. Check main process logs (Electron)
3. Verify SQLite database integrity
4. Check file permissions

---

**Congratulations!** You now have a complete, production-ready PDF Reader application.
