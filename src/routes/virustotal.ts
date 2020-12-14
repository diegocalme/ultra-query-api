import { Router } from 'express';
import { VTOTAL_API as API } from '../config/apiAccess';
import { getAnalysis } from '../services/virusTotalService';
import { createStandardRes, PRESET_ERR_SRV_MISCONFIG } from '../utils/createStandardRes';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(API.key) next();
  else res.status(500).jsonp(createStandardRes(...PRESET_ERR_SRV_MISCONFIG));
});

router.get('/analysis', async (req, res) => {
  try {
    const serviceRes = await getAnalysis(req.body.netTarget);
    res.status(serviceRes.status).jsonp(serviceRes).end();
  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }
});

router.get('/analysis/:filter', async (req, res) => {
  try {
    const serviceRes = await getAnalysis(req.body.netTarget, req.params.filter);
    res.status(serviceRes.status).jsonp(serviceRes).end();
  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }
});