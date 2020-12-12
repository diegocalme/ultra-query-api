import { Router } from 'express';
import { getPing } from '../services/pingService';
import { allowSingleNetTarget } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/', allowSingleNetTarget, async (req, res) => {

  try {
    const result = await getPing(req.body.netTarget);
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});