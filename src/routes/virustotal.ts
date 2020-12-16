import { Router } from 'express';
import { getAnalysis } from '../services/virusTotalService';

export const router = Router();

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