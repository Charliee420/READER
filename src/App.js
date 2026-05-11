import React, { useState, useEffect } from 'react';
import './App.css';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import PDFViewer from './components/PDFViewer';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [highlights, setHighlights] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Toggle dark mode
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Load highlights and bookmarks when document changes
    useEffect(() => {
        if (currentDocument) {
            loadHighlights();
            loadBookmarks();
        }
    }, [currentDocument]);

    // Save current page periodically
    useEffect(() => {
        if (currentDocument && currentPage > 0) {
            const timer = setTimeout(() => {
                window.electronAPI.updateLastPage({
                    filePath: currentDocument.filePath,
                    pageNumber: currentPage
                });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [currentDocument, currentPage]);

    const handleOpenFile = async () => {
        const result = await window.electronAPI.openFile();
        if (result.success) {
            setCurrentDocument(result);
            setCurrentPage(1);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const loadHighlights = async () => {
        if (currentDocument) {
            const loadedHighlights = await window.electronAPI.getHighlightsByDocument(
                currentDocument.filePath
            );
            setHighlights(loadedHighlights);
        }
    };

    const loadBookmarks = async () => {
        if (currentDocument) {
            const loadedBookmarks = await window.electronAPI.getBookmarksByDocument(
                currentDocument.filePath
            );
            setBookmarks(loadedBookmarks);
        }
    };

    const handleSaveHighlight = async (highlightData) => {
        const result = await window.electronAPI.saveHighlight({
            documentName: currentDocument.fileName,
            documentPath: currentDocument.filePath,
            pageNumber: currentPage,
            text: highlightData.text,
            position: highlightData.position,
            color: highlightData.color
        });

        if (result.success) {
            loadHighlights();
        }
    };

    const handleDeleteHighlight = async (highlightId) => {
        await window.electronAPI.deleteHighlight(highlightId);
        loadHighlights();
    };

    const handleSaveBookmark = async (note = '') => {
        const result = await window.electronAPI.saveBookmark({
            documentName: currentDocument.fileName,
            documentPath: currentDocument.filePath,
            pageNumber: currentPage,
            note: note
        });

        if (result.success) {
            loadBookmarks();
        }
    };

    const handleDeleteBookmark = async (bookmarkId) => {
        await window.electronAPI.deleteBookmark(bookmarkId);
        loadBookmarks();
    };

    const handleGoToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.25, 3.0));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Search will be handled in PDFViewer component
    };

    return (
        <div className="app">
            <Toolbar
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onOpenFile={handleOpenFile}
                currentPage={currentPage}
                totalPages={totalPages}
                onGoToPage={handleGoToPage}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                zoomLevel={zoomLevel}
                onSearch={handleSearch}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                hasDocument={!!currentDocument}
                onAddBookmark={handleSaveBookmark}
            />

            <div className="main-content">
                {sidebarOpen && currentDocument && (
                    <Sidebar
                        highlights={highlights}
                        bookmarks={bookmarks}
                        currentPage={currentPage}
                        onDeleteHighlight={handleDeleteHighlight}
                        onDeleteBookmark={handleDeleteBookmark}
                        onGoToPage={handleGoToPage}
                    />
                )}

                <div className="viewer-container">
                    {currentDocument ? (
                        <PDFViewer
                            document={currentDocument}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onTotalPagesChange={setTotalPages}
                            zoomLevel={zoomLevel}
                            highlights={highlights}
                            onSaveHighlight={handleSaveHighlight}
                            searchQuery={searchQuery}
                            onSearchResults={setSearchResults}
                        />
                    ) : (
                        <WelcomeScreen onOpenFile={handleOpenFile} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
