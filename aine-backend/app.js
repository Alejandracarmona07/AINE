require("dotenv").config();
require("express");

const { CheckDatabaseHealth } = require("./src/application/usecases/CheckDatabaseHealth");
const { ListProducts } = require("./src/application/usecases/ListProducts");
const { ListCourses } = require("./src/application/usecases/ListCourses");
const { ListPaymentMethods } = require("./src/application/usecases/ListPaymentMethods");
const { createApp } = require("./src/infrastructure/http/app");
const { createMysqlPool } = require("./src/infrastructure/mysql/pool");
const { MysqlHealthAdapter } = require("./src/infrastructure/mysql/MysqlHealthAdapter");
const { MysqlProductRepository } = require("./src/infrastructure/mysql/MysqlProductRepository");
const { MysqlCourseRepository } = require("./src/infrastructure/mysql/MysqlCourseRepository");
const { MysqlPaymentMethodRepository } = require("./src/infrastructure/mysql/MysqlPaymentMethodRepository");

const pool = createMysqlPool(process.env);
const dbHealth = new MysqlHealthAdapter({ pool });
const checkDatabaseHealth = new CheckDatabaseHealth({ dbHealth });
const productRepository = new MysqlProductRepository({ pool });
const courseRepository = new MysqlCourseRepository({ pool });
const paymentMethodRepository = new MysqlPaymentMethodRepository({ pool });
const listProducts = new ListProducts({ productRepository });
const listCourses = new ListCourses({ courseRepository });
const listPaymentMethods = new ListPaymentMethods({ paymentMethodRepository });

const app = createApp({ checkDatabaseHealth, listProducts, listCourses, listPaymentMethods });

module.exports = app;
