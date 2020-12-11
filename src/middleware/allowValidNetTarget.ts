import { Request, Response, NextFunction } from 'express';
import CustomErrors from '../utils/CustomErrors';
import isDomain from '../utils/isDomain';
import { isIP } from 'net';

// Allows for one single network target (either IP or FQDN)
export function allowSingleNetTarget(req: Request, res: Response, next: NextFunction): void {

  if(isDomain(req.body.netTarget) || isIP(req.body.netTarget)) {
    // Passes to the next middleware
    next();
  } else {
    res.status(400).jsonp().end(CustomErrors.getInvalidNetTarget(req.body.netTarget));
  }

}

// Allows for one or multiple network targets (either IPs or FQDNs)
export function allowMultipleNetTarget(req: Request, res: Response, next: NextFunction): void {
  if(Array.isArray(req.body.netTarget)) {

    // Validates the elements of the array
    let hasBadInput = false;

    for(let i = 0; i < req.body.netTarget.length; i++) {

      let netTarget = req.body.netTarget[i];

      if(!isIP(netTarget)) {
        let errorToReturn = CustomErrors.getInvalidNetTargetArray(req.body.netTarget[i], i, 'IP address');
        res.status(400).jsonp(errorToReturn).end();
        hasBadInput = true;
        break;
      }
    }

    // Passes to the next middleware if all the elements are valid
    if(!hasBadInput) next();

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
    res.status(400).jsonp(CustomErrors.getInvalidNetTarget(req.body.netTarget, 'domain name')).end();
  }
}

// Allows for multiple domain names
export function allowMultipleDomains(req: Request, res: Response, next: NextFunction): void {
  if(Array.isArray(req.body.netTarget)) {
    let hasBadInput = false;

    for(let i = 0; i < req.body.netTarget.length; i++) {

      let netTarget = req.body.netTarget[i];

      if(!isIP(netTarget)) {
        let errorToReturn = CustomErrors.getInvalidNetTargetArray(req.body.netTarget[i], i, 'domain name');
        res.status(400).jsonp(errorToReturn).end();
        hasBadInput = true;
        break;
      }
    }

    if(!hasBadInput) next();
  } else {
    allowSingleDomain(req, res, next);
  }
}

// Allows for one single IP address
export function allowSingleIP(req: Request, res: Response, next: NextFunction): void {
  if(isIP(req.body.netTarget)) {
    next();
  } else {
    res.status(400).jsonp(CustomErrors.getInvalidNetTarget(req.body.netTarget, 'IP address')).end();
  }
}

// Allows for one or multiple IP addresses
export function allowMultipleIPs(req: Request, res: Response, next: NextFunction): void {

  if(Array.isArray(req.body.netTarget)) {
    let hasBadInput = false;

    for(let i = 0; i < req.body.netTarget.length; i++) {

      let netTarget = req.body.netTarget[i];

      if(!isIP(netTarget)) {
        let errorToReturn = CustomErrors.getInvalidNetTargetArray(req.body.netTarget[i], i, 'IP address');
        res.status(400).jsonp(errorToReturn).end();
        hasBadInput = true;
        break;
      }
    }

    if(!hasBadInput) next();

  } else {
    allowSingleIP(req, res, next);
  }
}