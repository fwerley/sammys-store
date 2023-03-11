import express from 'express';
import multer from 'multer';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import OrderController from './controllers/OrderController';
import PaymentController from './controllers/PaymentController';
import CorreiosController from './controllers/CorreiosController';
import { isAdmin, isAuth } from './utils';
import PostBackController from './controllers/PostBackControler';
import UploadController from './controllers/UploadController';

const routes = express.Router();
const upload = multer();

//api seed
routes.get('/api/seedP', ProductController.insert);
routes.get('/api/seedU', UserController.insert);

// Products section
routes.get('/api/products', ProductController.store);
routes.post('/api/products', isAuth, isAdmin, ProductController.create);
routes.put('/api/products/:id', isAuth, isAdmin, ProductController.update);
routes.delete('/api/products/:id', isAuth, isAdmin, ProductController.delete);
routes.get('/api/products/search', ProductController.search);
routes.get('/api/products/admin', isAuth, isAdmin, ProductController.admin);
routes.get('/api/products/categories', ProductController.categories);
routes.get(`/api/products/:id`, ProductController.index);
routes.post(`/api/products/:id/reviews`, isAuth, ProductController.review);
routes.get('/api/products/slug/:slug', ProductController.slug);

// Upload section
routes.post('/api/upload/image', isAuth, isAdmin, upload.single('file'), UploadController.image)

// Users section
routes.get('/api/users', isAuth, isAdmin, UserController.store);
routes.get('/api/users/:id', isAuth, isAdmin, UserController.find);
routes.put('/api/users/:id', isAuth, isAdmin, UserController.update);
routes.delete('/api/users/:id', isAuth, isAdmin, UserController.delete);
routes.post('/api/users/signin', UserController.signin);
routes.post('/api/users/signup', UserController.signup);
routes.put('/api/users/profile', isAuth, UserController.profile);

// Correios section
routes.post('/api/correios/precoprazo', CorreiosController.precoprazo)

// Orders section
routes.post('/api/orders', isAuth, OrderController.insert)
routes.get('/api/orders', isAuth, isAdmin, OrderController.store)
routes.get('/api/orders/summary', isAuth, isAdmin, OrderController.summary)
routes.get('/api/orders/mine', isAuth, OrderController.mine)
routes.get(`/api/orders/:id`, isAuth, OrderController.find)
routes.put(`/api/orders/:id`, isAuth, OrderController.updatePrice)
routes.delete(`/api/orders/:id`, isAuth, isAdmin, OrderController.delete)

// Payment section
routes.get('/api/orders/:id/transaction', isAuth, PaymentController.transaction)
routes.put('/api/orders/:id/deliver', isAuth, isAdmin, PaymentController.deliver)
routes.post('/api/orders/:id/pay', isAuth, PaymentController.create)
routes.post('/api/webhook/pagarme', PostBackController.pagarme)

export { routes };
