/**
 * @typedef {Object} CommunityComment
 * @property {number} id
 * @property {'tip'|'experiencia'} tipo
 * @property {number|null} tipId
 * @property {number|null} productoId
 * @property {string|null} productoNombre
 * @property {number} usuarioId
 * @property {string} autor
 * @property {string} contenido
 * @property {number|null} calificacion
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CommunityCommentRepositoryPort
 * @property {(filters: { tipo?: string, tipId?: number, productoId?: number }) => Promise<CommunityComment[]>} findAllActive
 * @property {(data: { tipo: string, tipId?: number|null, productoId?: number|null, usuarioId: number, contenido: string, calificacion?: number|null }) => Promise<CommunityComment>} create
 */

module.exports = {};
