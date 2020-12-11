import { Router } from 'express';
import { createExpressRes } from '../utils/createExpressRes';
import { getIpv4, getIpv6, getMx, getHostnames } from '../services/dnsService';
import { allowSingleIP, allowSingleDomain } from '../middleware/allowValidNetTarget';

export const router = Router();

router.get('/ipv4', allowSingleDomain, async(req, res) => {

  try {
    const ipv4 = await getIpv4(req.body.netTarget);
    res.status(200).jsonp(createExpressRes(true, 200, { data: ipv4 })).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, { error })).end();
  }

});

router.get('/ipv6', allowSingleDomain, async(req, res) => {
  try {
    const ipv6 = await getIpv6(req.body.netTarget);
    res.status(200).jsonp(createExpressRes(true, 200, { data: ipv6 })).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, { error })).end();
  }
});

router.get('/ip', allowSingleDomain, async(req, res) => {
  try {

    const ipv4Promise = getIpv4(req.body.netTarget);
    const ipv6Promise = getIpv6(req.body.netTarget);

    // Waits until both of the IP promises are settled
    const [ipv4, ipv6] = await Promise.allSettled([ipv4Promise, ipv6Promise]);

    res.status(200).jsonp(createExpressRes(true, 200, { data: [ipv4, ipv6] })).end();

  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, { error })).end();
  }
});

router.get('/mx', allowSingleDomain, async(req, res) => {
  try {
    const mx = await getMx(req.body.netTarget);
    res.status(200).jsonp(createExpressRes(true, 200, { data: mx })).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, error)).end();
  }
});

router.get('/hostnames', allowSingleIP, async(req, res) => {
  try {
    const hostnames = await getHostnames(req.body.netTarget);
    res.status(200).jsonp(createExpressRes(true, 200, { data: hostnames })).end();
  } catch(error) {
    res.status(500).jsonp(createExpressRes(false, 400, { error })).end();
  }
});