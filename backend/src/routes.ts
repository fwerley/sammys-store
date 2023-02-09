import express from 'express';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OrderController from './controllers/OrderController';
import PaymentController from './controllers/PaymentController';
import CorreiosController from './controllers/CorreiosController';
import { isAdmin, isAuth } from './utils';
import PostBackController from './controllers/PostBackControler';

const routes = express.Router();

//api seed
routes.get('/api/seedP', ProductController.insert);
routes.get('/api/seedU', UserController.insert);

// Products section
routes.get('/api/products', ProductController.store);
routes.get('/api/products/search', ProductController.search);
routes.get('/api/products/categories', ProductController.categories);
routes.get(`/api/products/:id`, ProductController.index);
routes.get('/api/products/slug/:slug', ProductController.slug);

// Users section
routes.post('/api/users/signin', UserController.signin);
routes.post('/api/users/signup', UserController.signup);
routes.put('/api/users/profile', isAuth, UserController.profile);

// Correios section
routes.post('/api/correios/precoprazo', CorreiosController.precoprazo)

// Orders section
routes.post('/api/orders', isAuth, OrderController.insert)
routes.get('/api/orders/summary', isAuth, isAdmin, OrderController.summary)
routes.get('/api/orders/mine', isAuth, OrderController.mine)
routes.get(`/api/orders/:id`, isAuth, OrderController.find)
routes.put(`/api/orders/:id`, isAuth, OrderController.updatePrice)

// Payment section
routes.get('/api/orders/:id/transaction', isAuth, PaymentController.transaction)
routes.post('/api/orders/:id/pay', isAuth, PaymentController.create)
routes.post('/api/webhook/pagarme', PostBackController.pagarme)

export { routes };
