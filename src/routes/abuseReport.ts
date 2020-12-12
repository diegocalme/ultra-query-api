import { Router } from 'express';
import { ABIPDB_API as API } from '../config/apiAccess';
import { createExpressRes } from '../utils/createExpressRes';
import { getFullReport } from '../services/apipdbService';
import { allowSingleIP } from '../middleware/allowValidNetTarget';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(API.key) {
    next();
  } else {
    res.status(500).jsonp(createExpressRes(false, 500, { error: "Server misconfiguration!" }));
  }
});

router.get('/', allowSingleIP, async (req, res) => {

  try {
    const report = await getFullReport(req.body.netTarget)
    res.status(200).jsonp(createExpressRes(true, 200, { data: report })).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, { error })).end();
  }

});