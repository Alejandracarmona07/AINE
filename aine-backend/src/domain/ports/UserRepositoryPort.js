/**
 * @typedef {Object} UserRecord
 * @property {number} id
 * @property {string} nombre
 * @property {string} email
 * @property {string} password_hash
 * @property {string|null} telefono
 * @property {'cliente'|'admin'} rol
 * @property {number} activo
 */

/**
 * @typedef {Object} PublicUser
 * @property {number} id
 * @property {string} nombre
 * @property {string} email
 * @property {string|null} telefono
 * @property {'cliente'|'admin'} rol
 */

module.exports = {};
