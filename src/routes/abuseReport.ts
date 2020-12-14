import { Router } from 'express';
import { ABIPDB_API as API } from '../config/apiAccess';
import { getAbuseReport } from '../services/abipdbService';
import { createStandardRes, PRESET_ERR_SRV_MISCONFIG } from '../utils/createStandardRes';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(API.key) next();
  else res.status(500).jsonp(createStandardRes(...PRESET_ERR_SRV_MISCONFIG));
});

router.get('/', async (req, res) => {

  try {
    const serviceRes = await getAbuseReport(req.body.netTarget)
    res.status(serviceRes.status).jsonp(serviceRes).end();
  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }

});