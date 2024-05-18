import { NextFunction, Request, Response } from 'express';

export default function ExceptionHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error(error.message);
  response.status(500).send('Something broke!');
}
