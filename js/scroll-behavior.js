// scroll-behavior-enhanced.js - Enhanced version with banner and SYNC button hiding

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const banner = document.querySelector('.banner');
    const syncButton = document.querySelector('.sync-button');
    
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    // Function to handle scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Clear the timeout
        clearTimeout(scrollTimeout);
        
        if (scrollTop > 50) {
            // User has scrolled - hide banner and SYNC, dim logo
            if (logo) {
                logo.style.opacity = '0.5';
            }
            if (banner) {
                banner.style.opacity = '0';
                banner.style.pointerEvents = 'none';
                banner.style.transition = 'opacity 0.3s ease';
            }
            if (syncButton) {
                syncButton.style.opacity = '0';
                syncButton.style.pointerEvents = 'none';
                syncButton.style.transition = 'opacity 0.3s ease';
            }
            isScrolling = true;
        } else {
            // At top of page - show everything
            if (logo) {
                logo.style.opacity = '1';
            }
            if (banner) {
                banner.style.opacity = '0.8';
                banner.style.pointerEvents = 'auto';
            }
            if (syncButton) {
                syncButton.style.opacity = '1';
                syncButton.style.pointerEvents = 'auto';
            }
            isScrolling = false;
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Add scroll listener with throttling
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Also handle logo hover when scrolled
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            if (isScrolling) {
                logo.style.opacity = '0.7';
            }
        });
        
        logo.addEventListener('mouseleave', () => {
            if (isScrolling) {
                logo.style.opacity = '0.5';
            }
        });
    }
});
