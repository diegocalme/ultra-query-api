import { Router } from 'express';
import { getGeolocation } from '../services/geoipService';

export const router = Router();

router.get('/', async (req, res) => {

  try {
    const serviceRes = await getGeolocation(req.body.netTarget);
    res.status(200).jsonp(serviceRes).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});