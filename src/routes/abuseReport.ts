import { Router } from 'express';
import { createExpressRes } from '../utils/createExpressRes';
import { getFullReport } from '../services/apipdbService';
import { allowMultipleIPs } from '../middleware/allowValidNetTarget';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(process.env.ABIPDB_KEY) {
    next();
  } else {
    res.status(500).jsonp(createExpressRes(false, 500, { error: "Server misconfiguration!" }));
  }
});

router.get('/', allowMultipleIPs, async (req, res) => {

  try {
    const report = await getFullReport(req.body.netTarget)
    res.status(200).jsonp(createExpressRes(true, 200, report)).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, error)).end();
  }

});