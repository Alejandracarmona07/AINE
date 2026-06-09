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
    const productos = await this.listProducts.execute();
    const cursos = await this.listCourses.execute();
    const formasPago = await this.listPaymentMethods.execute();
    const categorias = await this.listCategories.execute();
    const galeria = await this.listGallery.execute();
    const contenido = await this.listSiteContent.execute();
    const redes = await this.listSocialNetworks.execute();

    return { productos, cursos, formasPago, categorias, galeria, contenido, redes };
  }
}

module.exports = { GetCatalog };
