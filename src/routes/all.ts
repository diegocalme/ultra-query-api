import { Router } from 'express';
import { ABIPDB_API, VTOTAL_API } from '../config/apiAccess';
import { createStandardRes, PRESET_ERR_SRV_MISCONFIG } from '../utils/createStandardRes';
import { getAbuseReport } from '../services/abipdbService';
import { getRecord as getDnsReport, getHostnames as getDnsHostnames } from '../services/dnsService';
import { getGeolocation } from '../services/geoipService';
import { getAnalysis as searchVtAnalysis } from '../services/virusTotalService';

export const router = Router();

// Verifies that API key is configured
router.use((req, res, next) => {
  if(ABIPDB_API.key && VTOTAL_API.key) next();
  else res.status(500).jsonp(createStandardRes(...PRESET_ERR_SRV_MISCONFIG));
});

const availableServices: any = {
  abuse: getAbuseReport,
  ipv4: (netTarget: string) => getDnsReport(netTarget, 'A'),
  ipv6: (netTarget: string) => getDnsReport(netTarget, 'AAAA'),
  mx: (netTarget: string) => getDnsReport(netTarget, 'MX'),
  hostnames: (netTarget: string) => getDnsHostnames(netTarget),
  geolocation: getGeolocation,
  virustotal: (netTarget: string) => searchVtAnalysis(netTarget),
  harmreport: (netTarget: string) => searchVtAnalysis(netTarget, 'last_analysis_stats')
}

router.get('/', async (req, res) => {

  try {

    let requestedServices = ['abuse', 'ipv4', 'ipv6', 'mx', 'hostnames', 'geolocation', 'harmreport'];

    if(req.body.services && (Array.isArray(req.body.services))) {
      // Applies services filter specified by the end user
      requestedServices = req.body.services;
    }

    const netTarget = req.body.netTarget;

    const promisePool = requestedServices.map((serviceName: string) => {
      const requestedService = availableServices[serviceName];
      if(requestedService) return (requestedService(netTarget));
    });

    // Waits until all the promises respond
    const promisesRes: any = await Promise.allSettled(promisePool);

    let response: any = {};
    
    if(req.body.tagged) {
      // Tags each service response and stores them in response
      requestedServices.forEach((value, index) => {
        const serviceResponse = promisesRes[index].value || promisesRes[index].reason || undefined;
        response[value] = serviceResponse;
      });
    } else {
      response = promisesRes.map((serviceResponse: any) => {
        return serviceResponse.value || serviceResponse.reason || undefined;
      });
    }

    res.status(200).jsonp(response).end();

  } catch(error) {
    res.status(error.status).jsonp(error).end();
  }

});