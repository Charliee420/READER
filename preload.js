const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getDocumentById: (documentId) => ipcRenderer.invoke('document:getById', documentId),
    updateLastPage: (data) => ipcRenderer.invoke('document:updateLastPage', data),
    getRecentDocuments: () => ipcRenderer.invoke('document:getRecent'),

    // Highlight operations
    saveHighlight: (highlightData) => ipcRenderer.invoke('highlight:save', highlightData),
    getHighlightsByDocument: (documentPath) => ipcRenderer.invoke('highlight:getByDocument', documentPath),
    deleteHighlight: (highlightId) => ipcRenderer.invoke('highlight:delete', highlightId),

    // Bookmark operations
    saveBookmark: (bookmarkData) => ipcRenderer.invoke('bookmark:save', bookmarkData),
    getBookmarksByDocument: (documentPath) => ipcRenderer.invoke('bookmark:getByDocument', documentPath),
    deleteBookmark: (bookmarkId) => ipcRenderer.invoke('bookmark:delete', bookmarkId)
});
