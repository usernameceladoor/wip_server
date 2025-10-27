// mobile-detect.js - Add to all desktop pages to redirect mobile users

(function() {
    'use strict';
    
    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768;
    
    if (isMobile) {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Map desktop pages to mobile equivalents
        const mobileMap = {
            'index.html': 'm-index.html',
            '': 'm-index.html',
            'images.html': 'm-images.html',
            'projects.html': 'm-images.html', // Projects are shown in mobile images
            'notes.html': 'm-words.html',
            'longform.html': 'm-words.html',
            'links.html': 'm-index.html' // Links go to mobile home for now
        };
        
        // Get mobile page
        const mobilePage = mobileMap[currentPage];
        
        if (mobilePage && currentPage !== mobilePage) {
            // Check if we're already on mobile site to prevent redirect loop
            if (!currentPage.startsWith('m-')) {
                // Show redirect notice
                const notice = document.createElement('div');
                notice.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #333;
                    color: white;
                    padding: 15px;
                    text-align: center;
                    z-index: 10000;
                    font-family: 'Fira Mono', monospace;
                `;
                notice.innerHTML = 'Redirecting to mobile site... <a href="#" style="color: white; margin-left: 20px;" onclick="event.preventDefault(); this.parentElement.remove(); localStorage.setItem(\'preferDesktop\', \'true\');">Stay on desktop</a>';
                document.body.appendChild(notice);
                
                // Check if user prefers desktop
                if (!localStorage.getItem('preferDesktop')) {
                    setTimeout(() => {
                        window.location.href = mobilePage;
                    }, 1500);
                } else {
                    notice.remove();
                }
            }
        }
    }
    
    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
    }
})();
