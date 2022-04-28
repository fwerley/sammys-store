import express from 'express';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';

const routes = express.Router();

//api seed
routes.get('/api/seedP', ProductController.insert);
routes.get('/api/seedU', UserController.insert);

// Products section
routes.get('/api/products', ProductController.store);
routes.get(`/api/products/:id`, ProductController.index);
routes.get('/api/products/slug/:slug', ProductController.slug);

// Users section
routes.post('/api/users/signin', UserController.signin);

// routes.post(`/post`, ProductController.store)
// routes.put(`/post/publish/:id`, ProductController.publisher)
// routes.delete(`/post/:id`, ProductController.delete)

export { routes };
