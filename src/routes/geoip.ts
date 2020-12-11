import { Router } from 'express';
import { createExpressRes } from '../utils/createExpressRes';
import { getGeolocation } from '../services/geoipService';
import { allowSingleIP } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/', allowSingleIP, async (req, res) => {

  try {
    const geoInfo = await getGeolocation(req.body.netTarget);
    if(Object.entries(geoInfo).length === 0) throw new Error('IP couldn\'t be geolocated. It probably isn\'t assigned or is part of a local network.');
    res.status(200).jsonp(createExpressRes(true, 200, { data: geoInfo })).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, { error: error.toString() })).end();
  }

});