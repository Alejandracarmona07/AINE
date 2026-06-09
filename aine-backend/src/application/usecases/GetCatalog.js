class GetCatalog {
  /**
   * @param {{
   *   listProducts: { execute: () => Promise<unknown[]> },
   *   listCourses: { execute: () => Promise<unknown[]> },
   *   listPaymentMethods: { execute: () => Promise<unknown[]> },
   *   listCategories: { execute: () => Promise<unknown[]> },
   *   listGallery: { execute: () => Promise<unknown[]> },
   * }} deps
   */
  constructor({ listProducts, listCourses, listPaymentMethods, listCategories, listGallery }) {
    this.listProducts = listProducts;
    this.listCourses = listCourses;
    this.listPaymentMethods = listPaymentMethods;
    this.listCategories = listCategories;
    this.listGallery = listGallery;
  }

  async execute() {
    const [productos, cursos, formasPago, categorias, galeria] = await Promise.all([
      this.listProducts.execute(),
      this.listCourses.execute(),
      this.listPaymentMethods.execute(),
      this.listCategories.execute(),
      this.listGallery.execute(),
    ]);

    return { productos, cursos, formasPago, categorias, galeria };
  }
}

module.exports = { GetCatalog };
