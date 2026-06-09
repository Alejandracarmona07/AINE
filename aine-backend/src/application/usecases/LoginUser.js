class LoginUser {
  /**
   * @param {{
   *   userRepository: { findByEmail: Function },
   *   passwordHasher: { verify: (password: string, stored: string) => Promise<boolean> }
   * }} deps
   */
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ email, password }) {
    const emailTrim = email?.trim().toLowerCase();

    if (!emailTrim || !password) {
      const err = new Error("email y password son obligatorios");
      err.code = "validation_error";
      throw err;
    }

    const user = await this.userRepository.findByEmail(emailTrim);
    if (!user || !user.activo) {
      const err = new Error("credenciales incorrectas");
      err.code = "invalid_credentials";
      throw err;
    }

    const valid = await this.passwordHasher.verify(password, user.password_hash);
    if (!valid) {
      const err = new Error("credenciales incorrectas");
      err.code = "invalid_credentials";
      throw err;
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
    };
  }
}

module.exports = { LoginUser };
