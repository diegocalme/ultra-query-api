import { Request, Response, NextFunction } from 'express';
import { createStandardRes, PRESET_SRV_ERROR, PRESET_RESRC_NOT_FOUND } from '../utils/createStandardRes';

export function sendResourceNotFoundError(req: Request, res: Response) {
  res.status(404).jsonp(createStandardRes(...PRESET_RESRC_NOT_FOUND)).end();
}

// Disabling ESLint since next is not used, but is necessary to include it to make an
// error handler.

// eslint-disable-next-line
export function sendInternalError(err: any, req: Request, res: Response, next: NextFunction) {
  if(err.type && err.type === 'entity.parse.failed') {
    const payload = {
      error: 'Request information is malformed!'
    }
    res.status(400).jsonp(createStandardRes(false, 400, payload)).end();
  } else {
    res.status(500).jsonp(createStandardRes(...PRESET_SRV_ERROR)).end();
  }
}