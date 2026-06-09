const { randomBytes, scrypt, timingSafeEqual } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

class ScryptPasswordHasher {
  async hash(password) {
    const salt = randomBytes(16).toString("hex");
    const derived = await scryptAsync(password, salt, 64);
    return `${salt}:${derived.toString("hex")}`;
  }

  async verify(password, stored) {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;

    const derived = await scryptAsync(password, salt, 64);
    const hashBuf = Buffer.from(hash, "hex");
    if (hashBuf.length !== derived.length) return false;

    return timingSafeEqual(derived, hashBuf);
  }
}

module.exports = { ScryptPasswordHasher };
