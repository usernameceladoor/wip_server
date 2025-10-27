// Add this JavaScript to project.html for special panoramic handling

// Special handler for panoramic images
function openPanoramicViewer(imageSrc, imageTitle) {
    const viewer = document.createElement('div');
    viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 10000;
        overflow-x: auto;
        overflow-y: hidden;
        cursor: grab;
    `;
    
    const img = document.createElement('img');
    img.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: auto;
        max-width: none;
        max-height: none;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    `;
    
    img.src = imageSrc;
    
    // Info overlay
    const info = document.createElement('div');
    info.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        color: white;
        font-family: 'Fira Mono', monospace;
        font-size: 14px;
        background: rgba(0,0,0,0.7);
        padding: 10px;
        border-radius: 3px;
        z-index: 10001;
    `;
    info.innerHTML = `${imageTitle}<br><span style="opacity:0.6;font-size:12px;">← → to scroll | ESC to close</span>`;
    
    // Close button
    const closeBtn = document.createElement('div');
    closeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        color: white;
        font-family: 'Fira Mono', monospace;
        font-size: 24px;
        cursor: pointer;
        background: rgba(0,0,0,0.7);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        z-index: 10001;
    `;
    closeBtn.textContent = '×';
    closeBtn.onclick = () => viewer.remove();
    
    viewer.appendChild(img);
    viewer.appendChild(info);
    viewer.appendChild(closeBtn);
    
    // Dragging functionality
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        viewer.style.cursor = 'grabbing';
        startX = e.pageX - viewer.offsetLeft;
        scrollLeft = viewer.scrollLeft;
    });
    
    viewer.addEventListener('mouseleave', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });
    
    viewer.addEventListener('mouseup', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });
    
    viewer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - viewer.offsetLeft;
        const walk = (x - startX) * 2;
        viewer.scrollLeft = scrollLeft - walk;
    });
    
    // Keyboard navigation
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            viewer.remove();
            document.removeEventListener('keydown', handleKeydown);
        } else if (e.key === 'ArrowLeft') {
            viewer.scrollLeft -= 100;
        } else if (e.key === 'ArrowRight') {
            viewer.scrollLeft += 100;
        }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // On image load, scroll to start
    img.onload = () => {
        viewer.scrollLeft = 0;
        // Show dimensions
        info.innerHTML += `<br><span style="opacity:0.6;font-size:12px;">Dimensions: ${img.naturalWidth} × ${img.naturalHeight}px</span>`;
    };
    
    document.body.appendChild(viewer);
}

// Modified project image click handler
function handleProjectImageClick(imageSrc, imageTitle, projectSlug) {
    // Check if this is the special panoramic image
    if (imageSrc.includes('image001_the_last_frame_of_the_day.AVIF')) {
        openPanoramicViewer(imageSrc, imageTitle);
    } else {
        // Use normal viewer for other images
        openImageViewer({ src: imageSrc, title: imageTitle });
    }
}

// Add this CSS for the panoramic viewer
const panoramicStyles = document.createElement('style');
panoramicStyles.textContent = `
    /* Hide scrollbar for panoramic viewer */
    .panoramic-viewer::-webkit-scrollbar {
        height: 8px;
    }
    
    .panoramic-viewer::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
    }
    
    .panoramic-viewer::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.3);
        border-radius: 4px;
    }
    
    .panoramic-viewer::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.5);
    }
`;
document.head.appendChild(panoramicStyles);
