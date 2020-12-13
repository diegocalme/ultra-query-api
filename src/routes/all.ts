import { Router } from 'express';
import { ABIPDB_API, VTOTAL_API } from '../config/apiAccess';
import { createStandardRes, PRESET_ERR_SRV_MISCONFIG } from '../utils/createStandardRes';
import { getAbuseReport } from '../services/abipdbService';
import { getRecord as getDnsReport } from '../services/dnsService';
import { getGeolocation } from '../services/geoipService';
import { searchAnalysis as searchVtAnalysis } from '../services/vtotalService';
import { allowSingleNetTarget, allowMultipleNetTarget } from '../middleware/allowValidNetTarget';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(ABIPDB_API.key && VTOTAL_API.key) next();
  else res.status(500).jsonp(createStandardRes(...PRESET_ERR_SRV_MISCONFIG));
});

router.get('/', allowSingleNetTarget, async (req, res) => {

  try {

    const netTarget = req.body.netTarget;
    
    const promiseOrder = ['abuse', 'ipv4', 'ipv6', 'mx', 'geolocation', 'virustotal'];
    const promises = [
      getAbuseReport(netTarget), 
      getDnsReport(netTarget, 'A'),
      getDnsReport(netTarget, 'AAAA'),
      getDnsReport(netTarget, 'MX'),
      getGeolocation(netTarget),
      searchVtAnalysis(netTarget, 'last_analysis_stats')
    ];

    const promisesRes = await Promise.allSettled(promises);

    const response: any = {};

    promisesRes.forEach((resp: any, index) => {
      response[promiseOrder[index]] = resp.value || resp.reason || undefined;
    });

    res.status(200).jsonp(response).end();

  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }

});