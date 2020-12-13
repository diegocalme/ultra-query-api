import { Request, Response, NextFunction } from 'express';
import { createStandardRes } from '../utils/createStandardRes';
import isDomain from '../utils/isDomain';
import { isIP } from 'net';

function getInvalidNetTarget(netTargetValue: string, netTargetType: string = 'network target') {
  const payload = {
    error: `An invalid ${netTargetType} was passed! ${netTargetValue} is not an accepted value.`
  }
  return createStandardRes(false, 400, payload);
}

function getInvalidNetTargetArray(netTargetValue: string, index: number, netTargetType: string = 'network target') {
  const payload = {
    error: `An invalid ${netTargetType} was passed in index ${index}! ${netTargetValue} is not an accepted value.`
  }
  return createStandardRes(false, 400, payload);
}

// Allows for one single network target (either IP or FQDN)
export function allowSingleNetTarget(req: Request, res: Response, next: NextFunction): void {

  if(isDomain(req.body.netTarget) || isIP(req.body.netTarget)) {
    // Passes to the next middleware
    next();
  } else {
    const error = getInvalidNetTarget(req.body.netTarget);
    res.status(error.status).jsonp(error).end();
  }

}

// Allows for one or multiple network targets (either IPs or FQDNs)
export function allowMultipleNetTarget(req: Request, res: Response, next: NextFunction): void {

  if(Array.isArray(req.body.netTarget)) {

    // Validates the elements of the array
    for(let i = 0; i < req.body.netTarget.length; i++) {
      let netTarget = req.body.netTarget[i];

      if(!isIP(netTarget) && !isDomain(netTarget)) {
        const error = getInvalidNetTargetArray(req.body.netTarget[i], i);
        res.status(error.status).jsonp(error).end();
        return;
      }
    }
    
    next();

  } else {
    // A string was passed
    allowSingleNetTarget(req, res, next);
  }
}

// Allows for one single domain name
export function allowSingleDomain(req: Request, res: Response, next: NextFunction): void {
  if(isDomain(req.body.netTarget)) {
    next();
  } else {
    const error = getInvalidNetTarget(req.body.netTarget, 'domain name');
    res.status(error.status).jsonp(error).end();
  }
}

// Allows for multiple domain names
export function allowMultipleDomains(req: Request, res: Response, next: NextFunction): void {

  if(Array.isArray(req.body.netTarget)) {

    for(let i = 0; i < req.body.netTarget.length; i++) {
      let netTarget = req.body.netTarget[i];

      if(!isDomain(netTarget)) {
        const error = getInvalidNetTargetArray(req.body.netTarget[i], i, 'domain name');
        res.status(error.status).jsonp(error).end();
        return;
      }
    }

    next();

  } else {
    allowSingleDomain(req, res, next);
  }
}

// Allows for one single IP address
export function allowSingleIP(req: Request, res: Response, next: NextFunction): void {
  if(isIP(req.body.netTarget)) {
    next();
  } else {
    const error = getInvalidNetTarget(req.body.netTarget, 'IP address');
    res.status(error.status).jsonp(error).end();
  }
}

// Allows for one or multiple IP addresses
export function allowMultipleIPs(req: Request, res: Response, next: NextFunction): void {

  if(Array.isArray(req.body.netTarget)) {

    for(let i = 0; i < req.body.netTarget.length; i++) {
      let netTarget = req.body.netTarget[i];

      if(!isIP(netTarget)) {
        const error = getInvalidNetTargetArray(req.body.netTarget[i], i, 'IP address');
        res.status(error.status).jsonp(error).end();
        return;
      }
    }

    next();

  } else {
    allowSingleIP(req, res, next);
  }
}