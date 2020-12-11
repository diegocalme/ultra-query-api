import { Router } from 'express';
import { getFullReport } from '../services/apipdbService';
import { allowMultipleIPs } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/abuse-report', allowMultipleIPs, (req, res): void => {
  getFullReport(req.body.netTarget)
    .then((report) => {
      res.status(/*report.status || */200).jsonp(report).end();
    })
    .catch((error) => {
      res.status(/*error.status || */500).jsonp({
        success: false,
        error: error.message
      }).end();
    });
});