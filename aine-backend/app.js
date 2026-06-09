require("dotenv").config();
require("dotenv").config({ path: ".env.local", override: true });
require("express");

const { CheckDatabaseHealth } = require("./src/application/usecases/CheckDatabaseHealth");
const { ListProducts } = require("./src/application/usecases/ListProducts");
const { ListCourses } = require("./src/application/usecases/ListCourses");
const { ListPaymentMethods } = require("./src/application/usecases/ListPaymentMethods");
const { ListCategories } = require("./src/application/usecases/ListCategories");
const { ListGallery } = require("./src/application/usecases/ListGallery");
const { GetCatalog } = require("./src/application/usecases/GetCatalog");
const { RegisterUser } = require("./src/application/usecases/RegisterUser");
const { LoginUser } = require("./src/application/usecases/LoginUser");
const { createApp } = require("./src/infrastructure/http/app");
const { ScryptPasswordHasher } = require("./src/infrastructure/crypto/ScryptPasswordHasher");
const { createMysqlPool } = require("./src/infrastructure/mysql/pool");
const { MysqlHealthAdapter } = require("./src/infrastructure/mysql/MysqlHealthAdapter");
const { MysqlProductRepository } = require("./src/infrastructure/mysql/MysqlProductRepository");
const { MysqlCourseRepository } = require("./src/infrastructure/mysql/MysqlCourseRepository");
const { MysqlPaymentMethodRepository } = require("./src/infrastructure/mysql/MysqlPaymentMethodRepository");
const { MysqlCategoryRepository } = require("./src/infrastructure/mysql/MysqlCategoryRepository");
const { MysqlGalleryRepository } = require("./src/infrastructure/mysql/MysqlGalleryRepository");
const { MysqlUserRepository } = require("./src/infrastructure/mysql/MysqlUserRepository");

const pool = createMysqlPool(process.env);
const passwordHasher = new ScryptPasswordHasher();
const dbHealth = new MysqlHealthAdapter({ pool });
const checkDatabaseHealth = new CheckDatabaseHealth({ dbHealth });
const productRepository = new MysqlProductRepository({ pool });
const courseRepository = new MysqlCourseRepository({ pool });
const paymentMethodRepository = new MysqlPaymentMethodRepository({ pool });
const categoryRepository = new MysqlCategoryRepository({ pool });
const galleryRepository = new MysqlGalleryRepository({ pool });
const userRepository = new MysqlUserRepository({ pool });
const listProducts = new ListProducts({ productRepository });
const listCourses = new ListCourses({ courseRepository });
const listPaymentMethods = new ListPaymentMethods({ paymentMethodRepository });
const listCategories = new ListCategories({ categoryRepository });
const listGallery = new ListGallery({ galleryRepository });
const getCatalog = new GetCatalog({
  listProducts,
  listCourses,
  listPaymentMethods,
  listCategories,
  listGallery,
});
const registerUser = new RegisterUser({ userRepository, passwordHasher });
const loginUser = new LoginUser({ userRepository, passwordHasher });

const app = createApp({
  checkDatabaseHealth,
  listProducts,
  listCourses,
  listPaymentMethods,
  listCategories,
  listGallery,
  getCatalog,
  registerUser,
  loginUser,
});

module.exports = app;
