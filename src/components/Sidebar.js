import React, { useState } from 'react';
import { FiTrash2, FiBookmark, FiEdit3 } from 'react-icons/fi';
import './Sidebar.css';

function Sidebar({
    highlights,
    bookmarks,
    currentPage,
    onDeleteHighlight,
    onDeleteBookmark,
    onGoToPage
}) {
    const [activeTab, setActiveTab] = useState('highlights');

    const highlightColors = {
        '#ffeb3b': 'Yellow',
        '#4caf50': 'Green',
        '#2196f3': 'Blue',
        '#e91e63': 'Pink',
        '#ff9800': 'Orange'
    };

    return (
        <div className="sidebar">
            <div className="sidebar-tabs">
                <button
                    className={`sidebar-tab ${activeTab === 'highlights' ? 'active' : ''}`}
                    onClick={() => setActiveTab('highlights')}
                >
                    <FiEdit3 size={18} />
                    Highlights ({highlights.length})
                </button>
                <button
                    className={`sidebar-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookmarks')}
                >
                    <FiBookmark size={18} />
                    Bookmarks ({bookmarks.length})
                </button>
            </div>

            <div className="sidebar-content">
                {activeTab === 'highlights' && (
                    <div className="highlights-list">
                        {highlights.length === 0 ? (
                            <div className="empty-state">
                                <FiEdit3 size={48} />
                                <p>No highlights yet</p>
                                <span>Select text in the PDF to create highlights</span>
                            </div>
                        ) : (
                            highlights.map((highlight) => (
                                <div
                                    key={highlight.id}
                                    className="highlight-item"
                                    onClick={() => onGoToPage(highlight.pageNumber)}
                                >
                                    <div className="highlight-header">
                                        <div
                                            className="highlight-color-indicator"
                                            style={{ backgroundColor: highlight.color }}
                                            title={highlightColors[highlight.color]}
                                        />
                                        <span className="highlight-page">Page {highlight.pageNumber}</span>
                                        <button
                                            className="delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteHighlight(highlight.id);
                                            }}
                                            title="Delete highlight"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="highlight-text">{highlight.text}</div>
                                    <div className="highlight-date">
                                        {new Date(highlight.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'bookmarks' && (
                    <div className="bookmarks-list">
                        {bookmarks.length === 0 ? (
                            <div className="empty-state">
                                <FiBookmark size={48} />
                                <p>No bookmarks yet</p>
                                <span>Click the bookmark button to save pages</span>
                            </div>
                        ) : (
                            bookmarks.map((bookmark) => (
                                <div
                                    key={bookmark.id}
                                    className={`bookmark-item ${bookmark.pageNumber === currentPage ? 'current' : ''
                                        }`}
                                    onClick={() => onGoToPage(bookmark.pageNumber)}
                                >
                                    <div className="bookmark-header">
                                        <FiBookmark size={16} />
                                        <span className="bookmark-page">Page {bookmark.pageNumber}</span>
                                        <button
                                            className="delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteBookmark(bookmark.id);
                                            }}
                                            title="Delete bookmark"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                    {bookmark.note && (
                                        <div className="bookmark-note">{bookmark.note}</div>
                                    )}
                                    <div className="bookmark-date">
                                        {new Date(bookmark.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
