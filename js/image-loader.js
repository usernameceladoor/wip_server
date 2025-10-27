// =====================================================
// CELADOOR IMAGE LOADER
// Loads images matching pattern: imageXXX_*.AVIF
// Where XXX is the 3-digit index (001, 002, etc.)
// =====================================================

class ImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.basePath = 'images/images/';
    }

    /**
     * Load image by index (e.g., 1 loads image001_*.AVIF)
     * @param {number} index - Image index (1, 2, 3, etc.)
     * @returns {Promise<string>} - URL of the matched image
     */
    async loadImageByIndex(index) {
        const paddedIndex = String(index).padStart(3, '0');
        const pattern = `image${paddedIndex}`;
        
        // Check cache first
        if (this.imageCache.has(pattern)) {
            return this.imageCache.get(pattern);
        }

        try {
            // Try to load the image
            // Since we can't list directory in browser, we'll try common patterns
            const attempts = [
                `${this.basePath}image${paddedIndex}.AVIF`,
                `${this.basePath}image${paddedIndex}_decay_${index}.AVIF`,
                `${this.basePath}image${paddedIndex}_*.AVIF`, // Wildcard placeholder
            ];

            for (const url of attempts) {
                try {
                    const exists = await this.checkImageExists(url);
                    if (exists) {
                        this.imageCache.set(pattern, url);
                        return url;
                    }
                } catch (e) {
                    continue;
                }
            }

            throw new Error(`No image found matching pattern: ${pattern}`);
        } catch (error) {
            console.error(`Failed to load image ${pattern}:`, error);
            return null;
        }
    }

    /**
     * Check if image exists
     */
    async checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    /**
     * Load all images in range
     * @param {number} start - Start index
     * @param {number} end - End index
     * @returns {Promise<Array>} - Array of image URLs
     */
    async loadImageRange(start, end) {
        const promises = [];
        for (let i = start; i <= end; i++) {
            promises.push(this.loadImageByIndex(i));
        }
        return Promise.all(promises);
    }

    /**
     * Get image URL pattern for manual construction
     * @param {number} index - Image index
     * @param {string} suffix - Custom suffix (e.g., 'decay_1', 'hic_sunt_dracones')
     * @returns {string} - Full image URL
     */
    getImageURL(index, suffix = '') {
        const paddedIndex = String(index).padStart(3, '0');
        if (suffix) {
            return `${this.basePath}image${paddedIndex}_${suffix}.AVIF`;
        }
        return `${this.basePath}image${paddedIndex}.AVIF`;
    }
}

// =====================================================
// USAGE EXAMPLES
// =====================================================

/*
// Initialize loader
const loader = new ImageLoader();

// Load single image by index
const img1 = await loader.loadImageByIndex(1);  // Matches image001_*.AVIF

// Load range of images
const images = await loader.loadImageRange(1, 15);

// Construct URL manually if you know the pattern
const url = loader.getImageURL(4, 'decay_4');  // images/images/image004_decay_4.AVIF

// Use in gallery
for (let i = 1; i <= 15; i++) {
    const imgElement = document.createElement('img');
    imgElement.src = await loader.loadImageByIndex(i);
    document.getElementById('gallery').appendChild(imgElement);
}
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageLoader;
}
