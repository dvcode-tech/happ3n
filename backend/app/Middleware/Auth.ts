import { ic } from 'azle';
import { NextFunction, Request, Response } from 'express';

export default function isAuth(request: Request, response: Response, next: NextFunction) {
  if (ic.caller().isAnonymous()) {
    response.status(401);
    return response.send('You are not authorized to access this resource.');
  } else {
    next();
  }
}
