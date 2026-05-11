import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './PDFViewer.css';

// Set up PDF.js worker - use working CDN URL
const PDFJS_VERSION = '3.11.174';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

function PDFViewer({
    document,
    currentPage,
    onPageChange,
    onTotalPagesChange,
    zoomLevel,
    highlights,
    onSaveHighlight,
    searchQuery,
    onSearchResults
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const textLayerRef = useRef(null);
    const highlightLayerRef = useRef(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [rendering, setRendering] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#ffeb3b');

    const highlightColors = [
        { color: '#ffeb3b', name: 'Yellow' },
        { color: '#4caf50', name: 'Green' },
        { color: '#2196f3', name: 'Blue' },
        { color: '#e91e63', name: 'Pink' },
        { color: '#ff9800', name: 'Orange' }
    ];

    // Load PDF document
    useEffect(() => {
        if (document && document.fileData) {
            loadPDF(document.fileData);
        }
    }, [document]);

    // Render page when currentPage or zoomLevel changes
    useEffect(() => {
        if (pdfDocument) {
            renderPage(currentPage);
        }
    }, [pdfDocument, currentPage, zoomLevel]);

    // Render highlights when they change
    useEffect(() => {
        if (pdfDocument) {
            renderHighlights();
        }
    }, [highlights, currentPage]);

    // Handle search
    useEffect(() => {
        if (searchQuery && pdfDocument) {
            performSearch(searchQuery);
        }
    }, [searchQuery, pdfDocument, currentPage]);

    const loadPDF = async (base64Data) => {
        try {
            console.log('📄 Starting PDF load... Data length:', base64Data?.length);

            if (!base64Data) {
                console.error('❌ No PDF data provided!');
                return;
            }

            // Convert base64 to Uint8Array
            const binaryString = window.atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            console.log('✅ PDF bytes created, length:', bytes.length);

            const loadingTask = pdfjsLib.getDocument({ data: bytes });
            const pdf = await loadingTask.promise;

            console.log('✅ PDF loaded successfully! Total pages:', pdf.numPages);

            setPdfDocument(pdf);
            onTotalPagesChange(pdf.numPages);

            // Start from last page if available
            if (document.lastPage) {
                console.log('📖 Continuing from last page:', document.lastPage);
                onPageChange(document.lastPage);
            } else {
                console.log('📖 Starting at page 1');
                onPageChange(1);
            }
        } catch (error) {
            console.error('❌ Error loading PDF:', error);
            console.error('Error details:', error.message, error.stack);
            alert('Failed to load PDF. Please check the console for details.');
        }
    };

    const renderPage = async (pageNumber) => {
        if (!pdfDocument || rendering) {
            console.log('⏸️ Render skipped - pdfDoc:', !!pdfDocument, 'rendering:', rendering);
            return;
        }

        console.log('🎨 Rendering page', pageNumber, '...');
        setRendering(true);

        try {
            const page = await pdfDocument.getPage(pageNumber);
            console.log('✅ Got page object');

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Calculate viewport with zoom
            const viewport = page.getViewport({ scale: zoomLevel * 1.5 });
            console.log('✅ Viewport created:', viewport.width, 'x', viewport.height);

            // Set canvas dimensions
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            console.log('✅ Page rendered to canvas');

            // Render text layer for selection
            await renderTextLayer(page, viewport);
            console.log('✅ Text layer rendered');

            // Render highlights
            renderHighlights();

            setRendering(false);
            console.log('✅ Page fully rendered!');
        } catch (error) {
            console.error('❌ Error rendering page:', error);
            setRendering(false);
        }
    };

    const renderTextLayer = async (page, viewport) => {
        const textLayer = textLayerRef.current;
        if (!textLayer) return;

        // Clear previous text layer
        textLayer.innerHTML = '';
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.height = `${viewport.height}px`;

        const textContent = await page.getTextContent();

        // Create text layer elements
        textContent.items.forEach((item) => {
            const textDiv = document.createElement('div');
            textDiv.textContent = item.str;

            const transform = pdfjsLib.Util.transform(
                viewport.transform,
                item.transform
            );

            const style = textDiv.style;
            style.position = 'absolute';
            style.left = `${transform[4]}px`;
            style.top = `${transform[5]}px`;
            style.fontSize = `${Math.sqrt(transform[2] * transform[2] + transform[3] * transform[3])}px`;
            style.fontFamily = item.fontName;

            textLayer.appendChild(textDiv);
        });
    };

    const renderHighlights = () => {
        const highlightLayer = highlightLayerRef.current;
        if (!highlightLayer) return;

        // Clear previous highlights
        highlightLayer.innerHTML = '';

        // Get highlights for current page
        const pageHighlights = highlights.filter(h => h.pageNumber === currentPage);

        pageHighlights.forEach((highlight) => {
            const highlightDiv = document.createElement('div');
            highlightDiv.className = 'highlight-overlay';
            highlightDiv.style.position = 'absolute';
            highlightDiv.style.backgroundColor = highlight.color;
            highlightDiv.style.opacity = '0.4';
            highlightDiv.style.pointerEvents = 'none';

            // Apply position from saved data
            const pos = highlight.position;
            highlightDiv.style.left = `${pos.left}px`;
            highlightDiv.style.top = `${pos.top}px`;
            highlightDiv.style.width = `${pos.width}px`;
            highlightDiv.style.height = `${pos.height}px`;

            highlightLayer.appendChild(highlightDiv);
        });
    };

    const performSearch = async (query) => {
        if (!pdfDocument || !query) return;

        try {
            const page = await pdfDocument.getPage(currentPage);
            const textContent = await page.getTextContent();

            const text = textContent.items.map(item => item.str).join(' ');
            const matches = [];

            const regex = new RegExp(query, 'gi');
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    text: match[0],
                    index: match.index
                });
            }

            onSearchResults(matches);

            // Highlight search results
            if (matches.length > 0) {
                highlightSearchResults(matches, textContent);
            }
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const highlightSearchResults = (matches, textContent) => {
        // This is a simplified version
        // In production, you'd want more sophisticated text position matching
        console.log('Search results:', matches);
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate position relative to PDF canvas
            const position = {
                left: rect.left - containerRect.left,
                top: rect.top - containerRect.top,
                width: rect.width,
                height: rect.height
            };

            // Save highlight
            onSaveHighlight({
                text: selectedText,
                position: position,
                color: selectedColor
            });

            // Clear selection
            selection.removeAllRanges();
        }
    };

    const handleWheel = (e) => {
        if (e.deltaY < 0 && currentPage > 1) {
            // Scroll up - previous page
            if (containerRef.current.scrollTop === 0) {
                onPageChange(currentPage - 1);
            }
        } else if (e.deltaY > 0 && currentPage < pdfDocument?.numPages) {
            // Scroll down - next page
            const container = containerRef.current;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
                onPageChange(currentPage + 1);
            }
        }
    };

    return (
        <div className="pdf-viewer" ref={containerRef} onWheel={handleWheel}>
            <div className="color-picker">
                <span className="color-picker-label">Highlight Color:</span>
                {highlightColors.map((item) => (
                    <button
                        key={item.color}
                        className={`color-option ${selectedColor === item.color ? 'selected' : ''}`}
                        style={{ backgroundColor: item.color }}
                        onClick={() => setSelectedColor(item.color)}
                        title={item.name}
                    />
                ))}
            </div>

            <div className="pdf-canvas-container">
                <canvas ref={canvasRef} className="pdf-canvas" />
                <div
                    ref={textLayerRef}
                    className="text-layer"
                    onMouseUp={handleTextSelection}
                />
                <div ref={highlightLayerRef} className="highlight-layer" />
            </div>

            {rendering && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Loading page...</p>
                </div>
            )}
        </div>
    );
}

export default PDFViewer;
