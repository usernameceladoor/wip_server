// =====================================================
// IMAGE MANIFEST - SIMPLE APPROACH
// =====================================================

/**
 * CELADOOR Image Registry
 * 
 * Maps image indices to actual filenames.
 * This is the EASIEST approach - just list your images here.
 * 
 * The system will look for imageXXX in the filename and use that as the index.
 */

const IMAGE_MANIFEST = {
    // Gallery images (from images/images/)
    gallery: [
        { index: 1, file: 'image001_decay_1.AVIF', title: 'Decay 1' },
        { index: 2, file: 'image002_decay_2.AVIF', title: 'Decay 2' },
        { index: 3, file: 'image003_decay_3.AVIF', title: 'Decay 3' },
        { index: 4, file: 'image004_decay_4.AVIF', title: 'Decay 4' },
        { index: 5, file: 'image005_decay_5.AVIF', title: 'Decay 5' },
        { index: 6, file: 'image006_decay_6.AVIF', title: 'Decay 6' },
        { index: 7, file: 'image007_decay_7.AVIF', title: 'Decay 7' },
        { index: 8, file: 'image008_decay_8.AVIF', title: 'Decay 8' },
        { index: 9, file: 'image009_decay_9.AVIF', title: 'Decay 9' },
        { index: 10, file: 'image010_decay_berlin.AVIF', title: 'Decay Berlin' },
        { index: 11, file: 'image011_decay_reflect.AVIF', title: 'Decay Reflect' },
        { index: 12, file: 'image012_hic_sunt_dracones.AVIF', title: 'Hic Sunt Dracones' },
        { index: 13, file: 'image013_hic_ardens.AVIF', title: 'Hic Ardens' },
        { index: 14, file: 'image014_tension_one.AVIF', title: 'Tension One' },
        { index: 15, file: 'image015_οἶνοψ_πόντος.avif', title: 'Οἶνοψ Πόντος' },
    ],

    // Project images (from images/projects/)
    projects: {
        interlocutor: 'interlocutor.AVIF',
        costanza: 'costanza.AVIF',
        nucleation: 'nucleation.AVIF',
    },

    // Home background (from images/home/)
    home: 'web_background.AVIF'
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get gallery image by index
 */
function getGalleryImage(index) {
    const basePath = 'images/images/';
    const image = IMAGE_MANIFEST.gallery.find(img => img.index === index);
    return image ? basePath + image.file : null;
}

/**
 * Get all gallery images
 */
function getAllGalleryImages() {
    const basePath = 'images/images/';
    return IMAGE_MANIFEST.gallery.map(img => ({
        index: img.index,
        url: basePath + img.file,
        title: img.title
    }));
}

/**
 * Get project image
 */
function getProjectImage(projectName) {
    const basePath = 'images/projects/';
    const file = IMAGE_MANIFEST.projects[projectName];
    return file ? basePath + file : null;
}

/**
 * Get home background
 */
function getHomeBackground() {
    return 'images/home/' + IMAGE_MANIFEST.home;
}

/**
 * AUTO-GENERATE manifest from your file naming convention
 * This assumes all files follow: imageXXX_description.AVIF pattern
 * 
 * You can generate this list automatically:
 * 1. In terminal: ls images/images/ > image-list.txt
 * 2. Parse the list and extract imageXXX numbers
 * 3. Update IMAGE_MANIFEST.gallery array
 */
function generateManifestFromList(fileList) {
    return fileList
        .filter(filename => filename.startsWith('image') && filename.endsWith('.AVIF'))
        .map(filename => {
            // Extract index from imageXXX_*.AVIF
            const match = filename.match(/image(\d{3})/);
            if (match) {
                const index = parseInt(match[1], 10);
                // Extract title from filename (remove image001_ and .AVIF)
                const title = filename
                    .replace(/image\d{3}_/, '')
                    .replace(/\.(AVIF|avif)$/, '')
                    .replace(/_/g, ' ');
                
                return { index, file: filename, title };
            }
            return null;
        })
        .filter(item => item !== null)
        .sort((a, b) => a.index - b.index);
}

// =====================================================
// EXAMPLE: Generate manifest from your actual files
// =====================================================

const YOUR_FILES = [
    'image001_decay_1.AVIF',
    'image002_decay_2.AVIF',
    'image003_decay_3.AVIF',
    'image004_decay_4.AVIF',
    'image005_decay_5.AVIF',
    'image006_decay_6.AVIF',
    'image007_decay_7.AVIF',
    'image008_decay_8.AVIF',
    'image009_decay_9.AVIF',
    'image010_decay_berlin.AVIF',
    'image011_decay_reflect.AVIF',
    'image012_hic_sunt_dracones.AVIF',
    'image013_hic_ardens.AVIF',
    'image014_tension_one.AVIF',
    'image015_οἶνοψ_πόντος.avif',
];

console.log('Auto-generated manifest:');
console.log(JSON.stringify(generateManifestFromList(YOUR_FILES), null, 2));

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IMAGE_MANIFEST,
        getGalleryImage,
        getAllGalleryImages,
        getProjectImage,
        getHomeBackground,
        generateManifestFromList
    };
}
