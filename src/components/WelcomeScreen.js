import React from 'react';
import { FiUpload, FiBook } from 'react-icons/fi';
import './WelcomeScreen.css';

function WelcomeScreen({ onOpenFile }) {
    return (
        <div className="welcome-screen">
            <div className="welcome-content">
                <div className="welcome-icon">
                    <FiBook size={80} />
                </div>
                <h1>Book Reader</h1>
                <p className="welcome-subtitle">
                    Open a PDF to start reading, highlighting, and bookmarking
                </p>

                <button className="open-file-button" onClick={onOpenFile}>
                    <FiUpload size={20} />
                    <span>Open PDF File</span>
                </button>

                <div className="features">
                    <div className="feature">
                        <h3>📖 Read PDFs</h3>
                        <p>Smooth and fast PDF rendering</p>
                    </div>
                    <div className="feature">
                        <h3>🎨 Highlight Text</h3>
                        <p>Select and highlight with custom colors</p>
                    </div>
                    <div className="feature">
                        <h3>🔖 Bookmarks</h3>
                        <p>Save important pages for quick access</p>
                    </div>
                    <div className="feature">
                        <h3>🔍 Search</h3>
                        <p>Find text across your document</p>
                    </div>
                    <div className="feature">
                        <h3>🌙 Dark Mode</h3>
                        <p>Read comfortably day or night</p>
                    </div>
                    <div className="feature">
                        <h3>💾 Auto-Save</h3>
                        <p>All highlights and bookmarks saved locally</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;
