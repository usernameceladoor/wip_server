// error-handler.js - Add this to all pages to catch and report errors gracefully

(function() {
    'use strict';
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.warn('Error caught:', e.message);
        
        // Prevent generic "Script error" from breaking the page
        if (e.message === 'Script error.' || e.message === 'Script error') {
            e.preventDefault();
            return false;
        }
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.warn('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
    
    // Safely check for elements before using them
    window.safeGetElement = function(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    };
    
    // Safe query selector
    window.safeQuerySelector = function(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            console.warn(`Invalid selector: ${selector}`);
            return null;
        }
    };
})();
