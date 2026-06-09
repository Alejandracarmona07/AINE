/**
 * @typedef {Object} BlogTip
 * @property {number} id
 * @property {string} titulo
 * @property {string} resumen
 * @property {string} contenido
 * @property {string|null} imagen
 * @property {string|null} etiqueta
 * @property {number} comentariosCount
 */

/**
 * @typedef {Object} BlogTipRepositoryPort
 * @property {() => Promise<BlogTip[]>} findAllActive
 */

module.exports = {};
