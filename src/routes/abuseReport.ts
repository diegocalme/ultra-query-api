import { Router } from 'express';
import { ABIPDB_API as API } from '../config/apiAccess';
import { createStandardRes, PRESET_ERR_SRV_MISCONFIG } from '../utils/createStandardRes';
import { getFullReport } from '../services/abipdbService';
import { allowSingleIP } from '../middleware/allowValidNetTarget';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(API.key) next();
  else res.status(500).jsonp(createStandardRes(...PRESET_ERR_SRV_MISCONFIG));
});

router.get('/', allowSingleIP, async (req, res) => {

  try {
    const report = await getFullReport(req.body.netTarget)
    res.status(report.status).jsonp(report).end();
  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }

});