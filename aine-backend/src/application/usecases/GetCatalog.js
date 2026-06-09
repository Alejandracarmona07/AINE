class GetCatalog {
  /**
   * @param {{
   *   listProducts: { execute: () => Promise<unknown[]> },
   *   listCourses: { execute: () => Promise<unknown[]> },
   *   listPaymentMethods: { execute: () => Promise<unknown[]> },
   *   listCategories: { execute: () => Promise<unknown[]> },
   *   listGallery: { execute: () => Promise<unknown[]> },
   *   listSiteContent: { execute: () => Promise<Record<string, string>> },
   *   listSocialNetworks: { execute: () => Promise<unknown[]> },
   * }} deps
   */
  constructor({
    listProducts,
    listCourses,
    listPaymentMethods,
    listCategories,
    listGallery,
    listSiteContent,
    listSocialNetworks,
  }) {
    this.listProducts = listProducts;
    this.listCourses = listCourses;
    this.listPaymentMethods = listPaymentMethods;
    this.listCategories = listCategories;
    this.listGallery = listGallery;
    this.listSiteContent = listSiteContent;
    this.listSocialNetworks = listSocialNetworks;
  }

  async execute() {
    const [productos, cursos, formasPago, categorias, galeria, contenido, redes] = await Promise.all([
      this.listProducts.execute(),
      this.listCourses.execute(),
      this.listPaymentMethods.execute(),
      this.listCategories.execute(),
      this.listGallery.execute(),
      this.listSiteContent.execute(),
      this.listSocialNetworks.execute(),
    ]);

    return { productos, cursos, formasPago, categorias, galeria, contenido, redes };
  }
}

module.exports = { GetCatalog };
