/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} nombre
 * @property {string|null} descripcion
 */

/**
 * @typedef {Object} CategoryRepositoryPort
 * @property {() => Promise<Category[]>} findAll
 */

module.exports = {};
