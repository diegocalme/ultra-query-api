import { Router } from 'express';
import { VTOTAL_API as API } from '../config/apiAccess';
import { searchAnalysis } from '../services/vtotalService';
import { createExpressRes } from '../utils/createExpressRes';
import { allowSingleNetTarget } from '../middleware/allowValidNetTarget';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(API.key) {
    next();
  } else {
    res.status(500).jsonp(createExpressRes(false, 500, { data: { message: "Server misconfiguration!" } }));
  }
});

router.get('/analysis', allowSingleNetTarget, async (req, res) => {
  try {
    const response = await searchAnalysis(req.body.netTarget);
    res.status(response.status).jsonp(response).end();
  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }
});

router.get('/analysis/:filter', allowSingleNetTarget, async (req, res) => {
  try {
    const response = await searchAnalysis(req.body.netTarget, req.params.filter);
    res.status(response.status).jsonp(response).end();
  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }
});