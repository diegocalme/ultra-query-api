import { Router } from 'express';
import { createExpressRes } from '../utils/createExpressRes';
import { getFullReport } from '../services/apipdbService';
import { allowMultipleIPs } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/', allowMultipleIPs, async (req, res) => {

  try {
    const report = await getFullReport(req.body.netTarget)
    res.status(200).jsonp(createExpressRes(true, 200, report)).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, error)).end();
  }

});