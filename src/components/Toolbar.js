import React, { useState } from 'react';
import {
    FiUpload,
    FiChevronLeft,
    FiChevronRight,
    FiZoomIn,
    FiZoomOut,
    FiMoon,
    FiSun,
    FiSearch,
    FiMenu,
    FiBookmark
} from 'react-icons/fi';
import './Toolbar.css';

function Toolbar({
    darkMode,
    onToggleDarkMode,
    onOpenFile,
    currentPage,
    totalPages,
    onGoToPage,
    onZoomIn,
    onZoomOut,
    zoomLevel,
    onSearch,
    onToggleSidebar,
    hasDocument,
    onAddBookmark
}) {
    const [pageInput, setPageInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
    const [bookmarkNote, setBookmarkNote] = useState('');

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

    const handlePageInputSubmit = (e) => {
        e.preventDefault();
        const pageNum = parseInt(pageInput);
        if (!isNaN(pageNum)) {
            onGoToPage(pageNum);
            setPageInput('');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchInput);
    };

    const handleAddBookmark = () => {
        onAddBookmark(bookmarkNote);
        setBookmarkNote('');
        setShowBookmarkDialog(false);
    };

    return (
        <div className="toolbar">
            <div className="toolbar-section">
                <button
                    className="toolbar-button"
                    onClick={onToggleSidebar}
                    title="Toggle Sidebar"
                >
                    <FiMenu size={20} />
                </button>

                <button
                    className="toolbar-button primary"
                    onClick={onOpenFile}
                    title="Open PDF"
                >
                    <FiUpload size={20} />
                    <span>Open PDF</span>
                </button>
            </div>

            {hasDocument && (
                <>
                    <div className="toolbar-section">
                        <button
                            className="toolbar-button"
                            onClick={() => onGoToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            title="Previous Page"
                        >
                            <FiChevronLeft size={20} />
                        </button>

                        <div className="page-info">
                            <form onSubmit={handlePageInputSubmit}>
                                <input
                                    type="text"
                                    className="page-input"
                                    placeholder={currentPage.toString()}
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                />
                            </form>
                            <span className="page-separator">/</span>
                            <span className="total-pages">{totalPages}</span>
                        </div>

                        <button
                            className="toolbar-button"
                            onClick={() => onGoToPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            title="Next Page"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>

                    <div className="toolbar-section">
                        <button
                            className="toolbar-button"
                            onClick={onZoomOut}
                            disabled={zoomLevel <= 0.5}
                            title="Zoom Out"
                        >
                            <FiZoomOut size={20} />
                        </button>

                        <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>

                        <button
                            className="toolbar-button"
                            onClick={onZoomIn}
                            disabled={zoomLevel >= 3.0}
                            title="Zoom In"
                        >
                            <FiZoomIn size={20} />
                        </button>
                    </div>

                    <div className="toolbar-section search-section">
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <FiSearch size={18} />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search in document..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className="toolbar-section">
                        <button
                            className="toolbar-button"
                            onClick={() => setShowBookmarkDialog(true)}
                            title="Add Bookmark"
                        >
                            <FiBookmark size={20} />
                        </button>
                    </div>
                </>
            )}

            <div className="toolbar-section toolbar-right">
                <button
                    className="toolbar-button"
                    onClick={onToggleDarkMode}
                    title={darkMode ? 'Light Mode' : 'Dark Mode'}
                >
                    {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
            </div>

            {showBookmarkDialog && (
                <div className="modal-overlay" onClick={() => setShowBookmarkDialog(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add Bookmark</h3>
                        <p>Page {currentPage}</p>
                        <input
                            type="text"
                            placeholder="Add a note (optional)"
                            value={bookmarkNote}
                            onChange={(e) => setBookmarkNote(e.target.value)}
                            className="bookmark-input"
                            autoFocus
                        />
                        <div className="modal-buttons">
                            <button onClick={() => setShowBookmarkDialog(false)} className="btn-cancel">
                                Cancel
                            </button>
                            <button onClick={handleAddBookmark} className="btn-save">
                                Save Bookmark
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Toolbar;
