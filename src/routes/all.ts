import { Router } from 'express';
import { getAbuseReport } from '../services/abipdbService';
import { getRecord as getDnsReport, getHostnames as getDnsHostnames } from '../services/dnsService';
import { getGeolocation } from '../services/geoipService';
import { getAnalysis as searchVtAnalysis } from '../services/virusTotalService';

export const router = Router();

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

    const netTarget = req.body.netTarget;
    const isResTagged = req.body.tagged;

    let servicesToQuery = ['abuse', 'ipv4', 'ipv6', 'mx', 'hostnames', 'geolocation', 'harmreport'];

    if(req.body.services && (Array.isArray(req.body.services))) {
      // Applies services filter specified by the end user
      servicesToQuery = req.body.services;
    }

    const promisePool = servicesToQuery.map((serviceName: string) => {
      const requestedService = availableServices[serviceName];
      if(requestedService) return (requestedService(netTarget));
    });

    // Waits until all the promises respond
    const promisesRes: any = await Promise.allSettled(promisePool);

    let response: any = {};
    
    if(isResTagged) {
      // Tags each service response and stores them in response
      servicesToQuery.forEach((serviceName, index) => {
        const serviceResponse = promisesRes[index].value || promisesRes[index].reason || undefined;
        response[serviceName] = serviceResponse;
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