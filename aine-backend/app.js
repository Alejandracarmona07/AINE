require("dotenv").config();
require("dotenv").config({ path: ".env.local", override: true });
require("express");

const { CheckDatabaseHealth } = require("./src/application/usecases/CheckDatabaseHealth");
const { ListProducts } = require("./src/application/usecases/ListProducts");
const { ListCourses } = require("./src/application/usecases/ListCourses");
const { ListPaymentMethods } = require("./src/application/usecases/ListPaymentMethods");
const { ListCategories } = require("./src/application/usecases/ListCategories");
const { ListGallery } = require("./src/application/usecases/ListGallery");
const { ListSiteContent } = require("./src/application/usecases/ListSiteContent");
const { ListSocialNetworks } = require("./src/application/usecases/ListSocialNetworks");
const { GetCatalog } = require("./src/application/usecases/GetCatalog");
const { RegisterUser } = require("./src/application/usecases/RegisterUser");
const { LoginUser } = require("./src/application/usecases/LoginUser");
const { ListBlogTips } = require("./src/application/usecases/ListBlogTips");
const { ListCommunityComments } = require("./src/application/usecases/ListCommunityComments");
const { CreateCommunityComment } = require("./src/application/usecases/CreateCommunityComment");
const { CreateStripeCheckout } = require("./src/application/usecases/CreateStripeCheckout");
const { HandleStripeWebhook } = require("./src/application/usecases/HandleStripeWebhook");
const { GetStripePaymentStatus } = require("./src/application/usecases/GetStripePaymentStatus");
const { createStripeClient } = require("./src/infrastructure/stripe/createStripeClient");
const { MysqlStripePaymentRepository } = require("./src/infrastructure/mysql/MysqlStripePaymentRepository");
const { createApp } = require("./src/infrastructure/http/app");
const { ScryptPasswordHasher } = require("./src/infrastructure/crypto/ScryptPasswordHasher");
const { createMysqlPool } = require("./src/infrastructure/mysql/pool");
const { MysqlHealthAdapter } = require("./src/infrastructure/mysql/MysqlHealthAdapter");
const { MysqlProductRepository } = require("./src/infrastructure/mysql/MysqlProductRepository");
const { MysqlCourseRepository } = require("./src/infrastructure/mysql/MysqlCourseRepository");
const { MysqlPaymentMethodRepository } = require("./src/infrastructure/mysql/MysqlPaymentMethodRepository");
const { MysqlCategoryRepository } = require("./src/infrastructure/mysql/MysqlCategoryRepository");
const { MysqlGalleryRepository } = require("./src/infrastructure/mysql/MysqlGalleryRepository");
const { MysqlSiteContentRepository } = require("./src/infrastructure/mysql/MysqlSiteContentRepository");
const { MysqlSocialNetworkRepository } = require("./src/infrastructure/mysql/MysqlSocialNetworkRepository");
const { MysqlUserRepository } = require("./src/infrastructure/mysql/MysqlUserRepository");
const { MysqlBlogTipRepository } = require("./src/infrastructure/mysql/MysqlBlogTipRepository");
const { MysqlCommunityCommentRepository } = require("./src/infrastructure/mysql/MysqlCommunityCommentRepository");

const pool = createMysqlPool(process.env);
const passwordHasher = new ScryptPasswordHasher();
const dbHealth = new MysqlHealthAdapter({ pool });
const checkDatabaseHealth = new CheckDatabaseHealth({ dbHealth });
const productRepository = new MysqlProductRepository({ pool });
const courseRepository = new MysqlCourseRepository({ pool });
const paymentMethodRepository = new MysqlPaymentMethodRepository({ pool });
const categoryRepository = new MysqlCategoryRepository({ pool });
const galleryRepository = new MysqlGalleryRepository({ pool });
const siteContentRepository = new MysqlSiteContentRepository({ pool });
const socialNetworkRepository = new MysqlSocialNetworkRepository({ pool });
const userRepository = new MysqlUserRepository({ pool });
const listProducts = new ListProducts({ productRepository });
const listCourses = new ListCourses({ courseRepository });
const listPaymentMethods = new ListPaymentMethods({ paymentMethodRepository });
const listCategories = new ListCategories({ categoryRepository });
const listGallery = new ListGallery({ galleryRepository });
const listSiteContent = new ListSiteContent({ siteContentRepository });
const listSocialNetworks = new ListSocialNetworks({ socialNetworkRepository });
const getCatalog = new GetCatalog({
  listProducts,
  listCourses,
  listPaymentMethods,
  listCategories,
  listGallery,
  listSiteContent,
  listSocialNetworks,
});
const blogTipRepository = new MysqlBlogTipRepository({ pool });
const communityCommentRepository = new MysqlCommunityCommentRepository({ pool });
const registerUser = new RegisterUser({ userRepository, passwordHasher });
const loginUser = new LoginUser({ userRepository, passwordHasher });
const listBlogTips = new ListBlogTips({ blogTipRepository });
const listCommunityComments = new ListCommunityComments({ communityCommentRepository });
const createCommunityComment = new CreateCommunityComment({ communityCommentRepository, userRepository });
const stripePaymentRepository = new MysqlStripePaymentRepository({ pool });
const stripe = createStripeClient(process.env.STRIPE_SECRET_KEY);
const createStripeCheckout = new CreateStripeCheckout({
  stripe,
  stripePaymentRepository,
  frontendUrl: process.env.FRONTEND_URL,
});
const handleStripeWebhook = new HandleStripeWebhook({
  stripe,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePaymentRepository,
});
const getStripePaymentStatus = new GetStripePaymentStatus({ stripePaymentRepository });

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
  listBlogTips,
  listCommunityComments,
  createCommunityComment,
  createStripeCheckout,
  handleStripeWebhook,
  getStripePaymentStatus,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
});

module.exports = app;
