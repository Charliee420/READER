const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let dataStore = {
    documents: [],
    highlights: [],
    bookmarks: []
};

// Initialize storage
function initStorage() {
    const userDataPath = app.getPath('userData');
    const dataPath = path.join(userDataPath, 'data.json');

    // Load existing data or create new
    if (fs.existsSync(dataPath)) {
        try {
            const data = fs.readFileSync(dataPath, 'utf8');
            dataStore = JSON.parse(data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    console.log('Storage initialized at:', dataPath);
}

function saveStorage() {
    const userDataPath = app.getPath('userData');
    const dataPath = path.join(userDataPath, 'data.json');

    try {
        fs.writeFileSync(dataPath, JSON.stringify(dataStore, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false
    });

    // Load React app
    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App lifecycle
app.whenReady().then(() => {
    initStorage();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        saveStorage();
        app.quit();
    }
});

app.on('before-quit', () => {
    saveStorage();
});

// IPC Handlers

// Open file dialog
ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileName = path.basename(filePath);

        // Create documents directory in userData
        const userDataPath = app.getPath('userData');
        const docsDir = path.join(userDataPath, 'documents');

        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }

        // Copy file to app storage
        const storedPath = path.join(docsDir, `${Date.now()}_${fileName}`);
        fs.copyFileSync(filePath, storedPath);

        // Save to dataStore
        const document = {
            id: dataStore.documents.length + 1,
            name: fileName,
            originalPath: filePath,
            storedPath: storedPath,
            lastPage: 1,
            lastOpened: new Date().toISOString()
        };

        dataStore.documents.push(document);
        saveStorage();

        // Read file as buffer
        const fileBuffer = fs.readFileSync(storedPath);

        return {
            success: true,
            fileName: fileName,
            filePath: storedPath,
            fileData: fileBuffer.toString('base64'),
            documentId: document.id
        };
    }

    return { success: false };
});

// Get document by ID
ipcMain.handle('document:getById', async (event, documentId) => {
    const document = dataStore.documents.find(d => d.id === documentId);

    if (document) {
        const fileBuffer = fs.readFileSync(document.storedPath);
        return {
            success: true,
            fileName: document.name,
            filePath: document.storedPath,
            fileData: fileBuffer.toString('base64'),
            lastPage: document.lastPage
        };
    }

    return { success: false };
});

// Update last page
ipcMain.handle('document:updateLastPage', async (event, { filePath, pageNumber }) => {
    const document = dataStore.documents.find(d => d.storedPath === filePath);

    if (document) {
        document.lastPage = pageNumber;
        document.lastOpened = new Date().toISOString();
        saveStorage();
    }

    return { success: true };
});

// Save highlight
ipcMain.handle('highlight:save', async (event, highlightData) => {
    const highlight = {
        id: dataStore.highlights.length + 1,
        documentName: highlightData.documentName,
        documentPath: highlightData.documentPath,
        pageNumber: highlightData.pageNumber,
        text: highlightData.text,
        position: highlightData.position,
        color: highlightData.color,
        createdAt: new Date().toISOString()
    };

    dataStore.highlights.push(highlight);
    saveStorage();

    return {
        success: true,
        id: highlight.id
    };
});

// Get highlights for document
ipcMain.handle('highlight:getByDocument', async (event, documentPath) => {
    return dataStore.highlights.filter(h => h.documentPath === documentPath);
});

// Delete highlight
ipcMain.handle('highlight:delete', async (event, highlightId) => {
    dataStore.highlights = dataStore.highlights.filter(h => h.id !== highlightId);
    saveStorage();
    return { success: true };
});

// Save bookmark
ipcMain.handle('bookmark:save', async (event, bookmarkData) => {
    const bookmark = {
        id: dataStore.bookmarks.length + 1,
        documentName: bookmarkData.documentName,
        documentPath: bookmarkData.documentPath,
        pageNumber: bookmarkData.pageNumber,
        note: bookmarkData.note || '',
        createdAt: new Date().toISOString()
    };

    dataStore.bookmarks.push(bookmark);
    saveStorage();

    return {
        success: true,
        id: bookmark.id
    };
});

// Get bookmarks for document
ipcMain.handle('bookmark:getByDocument', async (event, documentPath) => {
    return dataStore.bookmarks.filter(b => b.documentPath === documentPath);
});

// Delete bookmark
ipcMain.handle('bookmark:delete', async (event, bookmarkId) => {
    dataStore.bookmarks = dataStore.bookmarks.filter(b => b.id !== bookmarkId);
    saveStorage();
    return { success: true };
});

// Get recent documents
ipcMain.handle('document:getRecent', async () => {
    return dataStore.documents
        .sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened))
        .slice(0, 10);
});
