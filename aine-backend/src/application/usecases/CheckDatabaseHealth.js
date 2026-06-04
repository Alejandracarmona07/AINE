class CheckDatabaseHealth {
  /**
   * @param {{ dbHealth: { check: () => Promise<boolean> } }} deps
   */
  constructor({ dbHealth }) {
    this.dbHealth = dbHealth;
  }

  async execute() {
    return await this.dbHealth.check();
  }
}

module.exports = { CheckDatabaseHealth };

