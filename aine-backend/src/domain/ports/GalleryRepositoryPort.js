/**
 * @typedef {Object} GalleryItem
 * @property {number} id
 * @property {string} imagen
 * @property {string} titulo
 */

/**
 * @typedef {Object} GalleryRepositoryPort
 * @property {() => Promise<GalleryItem[]>} findAllActive
 */

module.exports = {};
