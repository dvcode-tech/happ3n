import { Router } from 'express';

import ApisController from 'App/Controllers/Http/ApisController';
import UsersController from 'App/Controllers/Http/UsersController';

import isAuth from 'App/Middleware/Auth';

const Route = Router();

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

Route.get('/health', ApisController.health);
Route.get('/config', ApisController.config);

Route.get('/me', isAuth, UsersController.me);
Route.post('/register', isAuth, UsersController.register);

export { Route as routes };
