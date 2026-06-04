/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} nombre
 * @property {string|null} descripcion
 * @property {number} precio
 * @property {string|null} imagen
 * @property {string} categoria
 */

/**
 * @typedef {Object} ProductRepositoryPort
 * @property {() => Promise<Product[]>} findAllActive
 */

module.exports = {};
