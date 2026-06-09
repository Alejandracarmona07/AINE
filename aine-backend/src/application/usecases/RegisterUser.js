class RegisterUser {
  /**
   * @param {{
   *   userRepository: { findByEmail: Function, create: Function },
   *   passwordHasher: { hash: (password: string) => Promise<string> }
   * }} deps
   */
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ nombre, email, password, telefono }) {
    const nombreTrim = nombre?.trim();
    const emailTrim = email?.trim().toLowerCase();
    const telefonoTrim = telefono?.trim() || null;

    if (!nombreTrim || !emailTrim || !password) {
      const err = new Error("nombre, email y password son obligatorios");
      err.code = "validation_error";
      throw err;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      const err = new Error("email inválido");
      err.code = "validation_error";
      throw err;
    }

    if (password.length < 6) {
      const err = new Error("la contraseña debe tener al menos 6 caracteres");
      err.code = "validation_error";
      throw err;
    }

    const existing = await this.userRepository.findByEmail(emailTrim);
    if (existing) {
      const err = new Error("ya existe una cuenta con ese email");
      err.code = "email_taken";
      throw err;
    }

    const passwordHash = await this.passwordHasher.hash(password);
    return await this.userRepository.create({
      nombre: nombreTrim,
      email: emailTrim,
      passwordHash,
      telefono: telefonoTrim,
    });
  }
}

module.exports = { RegisterUser };
