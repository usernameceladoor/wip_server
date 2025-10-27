// scroll-behavior.js - Add to all pages for consistent scroll behavior

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const banner = document.querySelector('.banner');
    let lastScrollTop = 0;
    let isScrolling = false;
    
    // Function to handle scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            // User has scrolled
            if (logo) {
                logo.style.opacity = '0.5';
            }
            if (banner) {
                banner.style.opacity = '0';
                banner.style.pointerEvents = 'none';
            }
            isScrolling = true;
        } else {
            // At top of page
            if (logo) {
                logo.style.opacity = '1';
            }
            if (banner) {
                banner.style.opacity = '0.8';
                banner.style.pointerEvents = 'auto';
            }
            isScrolling = false;
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
