// SYNC Popup Module - Add to any page that needs SYNC functionality
// Include this JavaScript and CSS on pages that need the SYNC button

// CSS for enhanced SYNC popup
const syncStyles = `
    /* Enhanced SYNC popup */
    .sync-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }

    .sync-popup.visible { opacity: 1; }
    .sync-popup.hidden { opacity: 0; }

    .sync-content-wrapper {
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .sync-image-container {
        background: #2E2E2E; /* 18% gray */
        padding: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .sync-image-container img {
        max-width: calc(90vw - 40px);
        max-height: calc(90vh - 200px);
        width: auto;
        height: auto;
        display: block;
    }

    .sync-description {
        background: #2E2E2E;
        color: white;
        padding: 20px 30px;
        font-family: 'Fira Mono', monospace;
        font-size: 14px;
        line-height: 1.6;
        max-width: 600px;
        text-align: center;
        border-radius: 4px;
        opacity: 0.9;
    }

    .sync-timer {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-family: 'Fira Mono', monospace;
        font-size: 12px;
        opacity: 0.6;
        z-index: 20001;
        pointer-events: none;
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = syncStyles;
document.head.appendChild(styleSheet);

// SYNC popup functionality
let syncPopup = null;
let syncTimer = null;

function openSyncPopup() {
    if (syncPopup) closeSyncPopup();
    const randomIndex = Math.floor(Math.random() * 10) + 1;
    const imageUrl = `images/sync/sync_${String(randomIndex).padStart(3, '0')}.AVIF`;
    
    const popup = document.createElement('div');
    popup.className = 'sync-popup';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'sync-content-wrapper';
    
    const container = document.createElement('div');
    container.className = 'sync-image-container';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    
    const description = document.createElement('div');
    description.className = 'sync-description';
    description.innerHTML = 'SYNC - Press SYNC and get a random screen cap from the early days of Hic et Nunc in 2021. Things I grabbed in the moment as notes or reminders. Many works from other artists.';
    
    const timer = document.createElement('div');
    timer.className = 'sync-timer';
    timer.textContent = 'Click to close';
    
    img.onerror = () => { 
        container.innerHTML = '<div style="color:white;text-align:center;padding:40px;font-family:\'Fira Mono\',monospace;"><div style="font-size:48px;margin-bottom:20px;">⚠</div><div>SYNC IMAGE NOT FOUND</div></div>'; 
    };
    
    container.appendChild(img);
    wrapper.appendChild(container);
    wrapper.appendChild(description);
    popup.appendChild(wrapper);
    popup.appendChild(timer);
    
    popup.onclick = () => closeSyncPopup();
    
    document.body.appendChild(popup);
    syncPopup = popup;
    
    requestAnimationFrame(() => popup.classList.add('visible'));
    syncTimer = setTimeout(() => closeSyncPopup(), 10000);
}

function closeSyncPopup() {
    if (!syncPopup) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncPopup.classList.remove('visible');
    syncPopup.classList.add('hidden');
    setTimeout(() => {
        if (syncPopup && syncPopup.parentNode) syncPopup.parentNode.removeChild(syncPopup);
        syncPopup = null;
    }, 500);
}

// Bind to existing SYNC button
document.addEventListener('DOMContentLoaded', () => {
    const syncButton = document.querySelector('.sync-button');
    if (syncButton) {
        syncButton.addEventListener('click', openSyncPopup);
    }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && syncPopup) {
        closeSyncPopup();
    }
});
