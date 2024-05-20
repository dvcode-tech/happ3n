import { Router } from 'express';

import ApisController from 'App/Controllers/Http/ApisController';
import UsersController from 'App/Controllers/Http/UsersController';

import isAuth from 'App/Middleware/Auth';
import EventsController from 'App/Controllers/Http/EventsController';

const Route = Router();

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

// USER
Route.get('/user/me', isAuth, UsersController.me);
Route.post('/user/register', isAuth, UsersController.register);
Route.post('/user/update', isAuth, UsersController.update);

// EVENT
Route.post('/event/create', isAuth, EventsController.create);
Route.post('/event/update/:eventId', isAuth, EventsController.update);
Route.get('/event/list', isAuth, EventsController.view_all_by_user);

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route.get('/health', ApisController.health);
Route.get('/config', ApisController.config);

// EVENT
Route.post('/event/slug/:slug', EventsController.view_by_slug);

// USER
Route.post('/user/:username/event/list', EventsController.view_all_of_user_by_public);
Route.post('/user/:username/info', UsersController.view_info_of_user_by_public);

export { Route as routes };
