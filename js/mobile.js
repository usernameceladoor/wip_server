/* ================================================
   MOBILE.JS - Touch Interaction Handler
   Prompt 10: Mobile-specific pan/drag for images
   ================================================ */

(function() {
    'use strict';
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                    || (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
    
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Mobile image viewer state
    let touchState = {
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        imageStartX: 0,
        imageStartY: 0,
        img: null
    };
    
    /**
     * Initialize mobile enhancements
     */
    function initMobile() {
        if (!isMobile && !isTouch) {
            console.log('Desktop detected - mobile enhancements not needed');
            return;
        }
        
        console.log('Mobile/touch device detected - initializing mobile mode');
        document.body.classList.add('mobile-device');
        
        // Add mobile CSS
        loadMobileCSS();
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupMobileHandlers);
        } else {
            setupMobileHandlers();
        }
    }
    
    /**
     * Load mobile CSS dynamically
     */
    function loadMobileCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'mobile.css';
        link.media = 'all';
        document.head.appendChild(link);
    }
    
    /**
     * Setup mobile-specific handlers
     */
    function setupMobileHandlers() {
        // Override image viewer open function if it exists
        if (typeof window.openImageViewer !== 'undefined') {
            const originalOpen = window.openImageViewer;
            window.openImageViewer = function(...args) {
                originalOpen(...args);
                // Enhance viewer after it's created
                setTimeout(enhanceViewerForMobile, 100);
            };
        }
        
        // Prevent accidental zoom
        preventAccidentalZoom();
        
        // Setup viewport meta tag if missing
        setupViewport();
    }
    
    /**
     * Enhance image viewer for mobile touch
     */
    function enhanceViewerForMobile() {
        const viewer = document.querySelector('.image-viewer');
        if (!viewer) return;
        
        const img = viewer.querySelector('img');
        if (!img) return;
        
        console.log('Enhancing viewer for mobile touch');
        
        // Remove existing scroll behavior
        viewer.style.overflow = 'hidden';
        
        // Setup touch events
        img.addEventListener('touchstart', handleTouchStart, { passive: false });
        img.addEventListener('touchmove', handleTouchMove, { passive: false });
        img.addEventListener('touchend', handleTouchEnd, { passive: true });
        img.addEventListener('touchcancel', handleTouchEnd, { passive: true });
        
        // Store reference
        touchState.img = img;
        
        // Update hints
        const hint = viewer.querySelector('.viewer-hint');
        if (hint) {
            hint.textContent = 'Drag to pan image | Tap controls to navigate';
        }
    }
    
    /**
     * Handle touch start
     */
    function handleTouchStart(e) {
        // Only handle single finger
        if (e.touches.length !== 1) {
            touchState.active = false;
            return;
        }
        
        const touch = e.touches[0];
        const img = e.currentTarget;
        
        touchState.active = true;
        touchState.startX = touch.clientX;
        touchState.startY = touch.clientY;
        
        // Get current position
        const style = window.getComputedStyle(img);
        const matrix = new WebKitCSSMatrix(style.transform);
        touchState.imageStartX = matrix.m41 || parseInt(img.style.left) || 0;
        touchState.imageStartY = matrix.m42 || parseInt(img.style.top) || 0;
        
        img.style.cursor = 'grabbing';
        
        // Prevent default to stop scrolling
        e.preventDefault();
    }
    
    /**
     * Handle touch move - pan image
     */
    function handleTouchMove(e) {
        if (!touchState.active || e.touches.length !== 1) {
            return;
        }
        
        const touch = e.touches[0];
        const img = e.currentTarget;
        
        // Calculate delta
        const deltaX = touch.clientX - touchState.startX;
        const deltaY = touch.clientY - touchState.startY;
        
        // Calculate new position
        touchState.currentX = touchState.imageStartX + deltaX;
        touchState.currentY = touchState.imageStartY + deltaY;
        
        // Apply with bounds checking
        const bounds = calculateBounds(img);
        const boundedX = clamp(touchState.currentX, bounds.minX, bounds.maxX);
        const boundedY = clamp(touchState.currentY, bounds.minY, bounds.maxY);
        
        // Update position
        img.style.left = boundedX + 'px';
        img.style.top = boundedY + 'px';
        
        // Prevent scrolling
        e.preventDefault();
    }
    
    /**
     * Handle touch end
     */
    function handleTouchEnd(e) {
        if (touchState.active) {
            touchState.active = false;
            const img = touchState.img;
            if (img) {
                img.style.cursor = 'grab';
            }
        }
    }
    
    /**
     * Calculate bounds for panning
     * Image should not pan beyond edges
     */
    function calculateBounds(img) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const imageWidth = img.naturalWidth || img.width;
        const imageHeight = img.naturalHeight || img.height;
        
        // If image is smaller than viewport, center it
        if (imageWidth <= viewportWidth && imageHeight <= viewportHeight) {
            const centerX = (viewportWidth - imageWidth) / 2;
            const centerY = (viewportHeight - imageHeight) / 2;
            return {
                minX: centerX,
                maxX: centerX,
                minY: centerY,
                maxY: centerY
            };
        }
        
        // Image is larger - allow panning
        return {
            minX: viewportWidth - imageWidth,  // Left edge
            maxX: 0,                            // Right edge
            minY: viewportHeight - imageHeight, // Top edge
            maxY: 0                             // Bottom edge
        };
    }
    
    /**
     * Clamp value between min and max
     */
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    /**
     * Prevent accidental zoom on double-tap
     */
    function preventAccidentalZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    /**
     * Setup viewport meta tag
     */
    function setupViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        // Prevent zoom, allow user scaling for accessibility
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }
    
    /**
     * Disable pinch zoom on images
     */
    function disablePinchZoom() {
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
        });
    }
    
    // Initialize on load
    initMobile();
    
    // Expose some functions globally if needed
    window.mobileEnhancements = {
        isMobile: isMobile,
        isTouch: isTouch,
        enhanceViewer: enhanceViewerForMobile
    };
    
})();
