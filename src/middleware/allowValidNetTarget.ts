import { isIP } from 'net';
import isDomain from '../utils/isDomain';
import { Request, Response, NextFunction } from 'express';

export function allowAnyNetTargets(req: Request, res: Response, next: NextFunction): void {
  if(isDomain(req.body.netTarget)) {
    next();
  } else {
    res.status(400).jsonp({
      success: false,
      status: 400,
      error: 'A valid network target (or list of net. targets) wasn\'t passed!'
    }).end();
  }
}

export function allowOnlyDomains(req: Request, res: Response, next: NextFunction): void {
  if(isDomain(req.body.netTarget)) {
    next();
  } else {
    res.status(400).jsonp({
      success: false,
      status: 400,
      error: 'A valid domain (or list of domains) wasn\'t passed!'
    }).end();
  }
}

export function allowOnlyIPs(req: Request, res: Response, next: NextFunction): void {
  if(isIP(req.body.netTarget)) {
    next();
  } else {
    res.status(400).jsonp({
      success: false,
      status: 400,
      error: 'A valid IP address (or list of IPs) wasn\'t passed!'
    }).end();
  }
}