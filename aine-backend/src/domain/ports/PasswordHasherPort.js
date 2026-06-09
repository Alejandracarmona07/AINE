/**
 * @typedef {Object} PasswordHasherPort
 * @property {(password: string) => Promise<string>} hash
 * @property {(password: string, stored: string) => Promise<boolean>} verify
 */

module.exports = {};
