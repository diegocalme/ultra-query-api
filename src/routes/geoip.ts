import { Router } from 'express';
import { getGeolocation } from '../services/geoipService';
import { allowSingleIP } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/', allowSingleIP, async (req, res) => {

  try {
    const result = await getGeolocation(req.body.netTarget);
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});