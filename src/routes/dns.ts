import { Router } from 'express';
import { getRecord } from '../services/dnsService';
import { allowSingleIP, allowSingleDomain } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/ipv4', allowSingleDomain, async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'A');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});

router.get('/ipv6', allowSingleDomain, async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'AAAA');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});

// router.get('/ip', allowSingleDomain, async(req, res) => {
//   try {

//     const ipv4Promise = getIpv4(req.body.netTarget);
//     const ipv6Promise = getIpv6(req.body.netTarget);

//     // Waits until both of the IP promises are settled
//     const [ipv4, ipv6] = await Promise.allSettled([ipv4Promise, ipv6Promise]);

//     res.status(200).jsonp(createExpressRes(true, 200, { data: [ipv4, ipv6] })).end();

//   } catch(error) {
//     res.status(500).jsonp(createExpressRes(false, 400, { error })).end();
//   }
// });

router.get('/mx', allowSingleDomain, async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'MX');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});

router.get('/reverse', allowSingleIP, async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'hostnames');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});