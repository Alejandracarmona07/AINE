/**
 * @typedef {Object} SocialNetwork
 * @property {number} id
 * @property {string} nombre
 * @property {string} url
 * @property {string|null} icono
 */

/**
 * @typedef {Object} SocialNetworkRepositoryPort
 * @property {() => Promise<SocialNetwork[]>} findAllActive
 */

module.exports = {};
