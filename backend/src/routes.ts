import express from 'express';
import multer from 'multer';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OrderController from './controllers/OrderController';
import PaymentController from './controllers/PaymentController';
import CorreiosController from './controllers/CorreiosController';
import { isAdmin, isAuth, isSellerOrAdmin } from './utils';
import PostBackController from './controllers/PostBackControler';
import UploadController from './controllers/UploadController';
import SellerController from './controllers/SellerController';
import DashboardController from './controllers/DashboardController';

const routes = express.Router();
const upload = multer();

//api seed
routes.get('/api/seedP', isAuth, isAdmin, ProductController.insert);
routes.get('/api/seedU', isAuth, isAdmin, UserController.insert);

// Products section
routes.get('/api/products', ProductController.store);
routes.post('/api/products', isAuth, isSellerOrAdmin, ProductController.create);
routes.put('/api/products/:id', isAuth, isSellerOrAdmin, ProductController.update);
routes.delete('/api/products/:id', isAuth, isAdmin, ProductController.delete);
routes.get('/api/products/search', ProductController.search);
routes.get('/api/products/admin', isAuth, isSellerOrAdmin, ProductController.admin);
routes.get('/api/products/categories', ProductController.categories);
routes.get(`/api/products/:id`, ProductController.index);
routes.post(`/api/products/:id/reviews`, isAuth, ProductController.review);
routes.get('/api/products/slug/:slug', ProductController.slug);
routes.get('/api/products/SEO/:slugSEO', ProductController.slugSEO);

// Upload section
routes.post('/api/upload/image', isAuth, isAdmin, upload.single('file'), UploadController.image)

// Users section
routes.get('/api/users', isAuth, isAdmin, UserController.store);
routes.get('/api/users/:id', isAuth, isAdmin, UserController.find);
routes.get('/api/users/:id/orders', isAuth, isAdmin, UserController.find);
routes.put('/api/users/profile', isAuth, UserController.profile);
routes.put('/api/users/:id', isAuth, isAdmin, UserController.update);
routes.delete('/api/users/:id', isAuth, isAdmin, UserController.delete);
routes.post('/api/users/admin/signin', isAuth, isAdmin, UserController.signinAdmin);
routes.post('/api/users/signin', UserController.signin);
routes.get('/api/google/url-auth', UserController.getGoogleAuthURL);
routes.get('/api/facebook/url-auth', UserController.getFacebookAuthURL);
routes.get('/api/auth_oauth/signin', UserController.signinSocial);
routes.get('/api/auth_oauth/me', UserController.me);
routes.post('/api/users/signup', UserController.signup);
routes.post('/api/users/confirm-account', UserController.confirmAccount)
routes.post('/api/users/forget-password', UserController.forgetPassword)
routes.post('/api/users/reset-password', UserController.resetPassword)

// Correios section
routes.post('/api/correios/precoprazo', CorreiosController.precoprazo)
routes.get('/api/correios/:code', CorreiosController.rastreamento)

// Orders section
routes.post('/api/orders', isAuth, OrderController.insert)
routes.get('/api/orders', isAuth, isSellerOrAdmin, OrderController.store)
routes.get('/api/orders/summary', isAuth, isAdmin, OrderController.summary)
routes.get('/api/orders/mine', isAuth, OrderController.mine)
routes.get(`/api/orders/:id`, isAuth, OrderController.find)
routes.put(`/api/orders/:id`, isAuth, OrderController.updatePrice)
routes.post(`/api/orders/:id/deliver`, isAuth, isSellerOrAdmin, OrderController.deliver)
routes.delete(`/api/orders/:id`, isAuth, isAdmin, OrderController.delete)

// Payment section
routes.get('/api/orders/:id/transaction', isAuth, PaymentController.transaction)
routes.put('/api/orders/:id/delivered', isAuth, isAdmin, PaymentController.delivered)
routes.post('/api/orders/:id/pay', isAuth, PaymentController.create)
routes.post('/api/webhook/pagarme', PostBackController.pagarme)

// Seller section
routes.get('/api/sellers/:id', SellerController.find)
routes.get('/api/sellers/:id/products', SellerController.products)

// Dashboard section
routes.get('/api/dashboard/sales-today', DashboardController.salesToday)
routes.get('/api/dashboard/sales-last-week', DashboardController.salesLastWeek)
routes.get('/api/dashboard/sales-last-month', DashboardController.salesLastMonth)
routes.get('/api/dashboard/last-transactions', DashboardController.lastTransactions)

export { routes };
