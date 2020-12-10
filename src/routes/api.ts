import { Router } from 'express';
import { getFullReport } from '../services/apipdbService';
import { allowOnlyIPs } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/abuse-report', allowOnlyIPs, (req, res): void => {
  getFullReport(req.body.netTarget)
    .then((report) => {
      res.status(200).jsonp(report).end();
    })
    .catch((error) => {
      console.log(error.toString());
      res.status(500).jsonp({
        success: false,
        status: error.status,
        error: error.message
      }).end();
    });
});