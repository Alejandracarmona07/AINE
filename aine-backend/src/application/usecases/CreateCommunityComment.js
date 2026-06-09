class CreateCommunityComment {
  /**
   * @param {{
   *   communityCommentRepository: import("../../domain/ports/CommunityCommentRepositoryPort").CommunityCommentRepositoryPort,
   *   userRepository: { findById?: Function }
   * }} deps
   */
  constructor({ communityCommentRepository, userRepository }) {
    this.communityCommentRepository = communityCommentRepository;
    this.userRepository = userRepository;
  }

  async execute({ tipo, tipId, productoId, usuarioId, contenido, calificacion }) {
    const tipoNorm = tipo === "experiencia" ? "experiencia" : "tip";
    const contenidoTrim = contenido?.trim();

    if (!usuarioId) {
      const err = new Error("debes iniciar sesión para publicar");
      err.code = "auth_required";
      throw err;
    }

    if (!contenidoTrim || contenidoTrim.length < 10) {
      const err = new Error("el comentario debe tener al menos 10 caracteres");
      err.code = "validation_error";
      throw err;
    }

    if (contenidoTrim.length > 2000) {
      const err = new Error("el comentario no puede superar 2000 caracteres");
      err.code = "validation_error";
      throw err;
    }

    if (tipoNorm === "tip" && !tipId) {
      const err = new Error("tipId es obligatorio para comentar un tip");
      err.code = "validation_error";
      throw err;
    }

    if (tipoNorm === "experiencia" && !productoId) {
      const err = new Error("productoId es obligatorio para compartir una experiencia");
      err.code = "validation_error";
      throw err;
    }

    let calificacionVal = null;
    if (tipoNorm === "experiencia") {
      const n = Number(calificacion);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        const err = new Error("la calificación debe ser un número entre 1 y 5");
        err.code = "validation_error";
        throw err;
      }
      calificacionVal = n;
    }

    if (this.userRepository.findById) {
      const user = await this.userRepository.findById(usuarioId);
      if (!user || !user.activo) {
        const err = new Error("usuario no válido");
        err.code = "auth_required";
        throw err;
      }
    }

    return await this.communityCommentRepository.create({
      tipo: tipoNorm,
      tipId: tipoNorm === "tip" ? tipId : null,
      productoId: tipoNorm === "experiencia" ? productoId : null,
      usuarioId,
      contenido: contenidoTrim,
      calificacion: calificacionVal,
    });
  }
}

module.exports = { CreateCommunityComment };
