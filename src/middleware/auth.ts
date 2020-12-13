import { Request, Response, NextFunction } from 'express';
import { createStandardRes } from '../utils/createStandardRes';
import { API_AUTH_KEY } from '../config/globals';

// Allows for one single network target (either IP or FQDN)
export function checkAuthHeader(req: Request, res: Response, next: NextFunction): void {

  if(req.headers.authorization && req.headers.authorization === API_AUTH_KEY) {
    next();
  } else { 
    const payload = {
      error: 'Unauthorized. Authorization header is not set or is not valid.'
    }
    res.status(401).jsonp(createStandardRes(false, 401, payload)).end();
  }

}