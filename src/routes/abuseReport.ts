import { Router } from 'express';
import { getFullReport } from '../services/apipdbService';
import { allowMultipleIPs } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/', allowMultipleIPs, async (req, res) => {

  try {

    const report = await getFullReport(req.body.netTarget)
    res.status(200).jsonp(report).end();

  } catch(error) {

    res.status(500).jsonp({
      success: false,
      error: error.message
    }).end();
    
  }

});