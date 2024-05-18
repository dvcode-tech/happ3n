import cors from 'cors';
import express from 'express';

import { Database } from './database';
import ExceptionHandler from './app/Exceptions/Handler';
import { routes } from './start/routes';

export type CreateServerOptions = {
  database: Database;
};

export function CreateServer({ database }: CreateServerOptions) {
  const app = express();

  app.locals.database = database;

  app.use(cors());
  app.use(express.json());
  app.use(ExceptionHandler);
  app.use(routes);

  // Guard routes
  app.use((request, response) => {
    response.status(404);
    return response.json({
      status: 0,
      message: 'Route not found!',
    });
  });

  return app.listen();
}
