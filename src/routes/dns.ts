import { Router } from 'express';
import { getRecord, getHostnames } from '../services/dnsService';
import { StandardResPayload } from '../utils/createStandardRes';

export const router = Router();

router.get('/ipv4', async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'A');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});

router.get('/ipv6', async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'AAAA');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});

router.get('/ip', async(req, res) => {
  try {

    const ipv4Promise = getRecord(req.body.netTarget, 'A');
    const ipv6Promise = getRecord(req.body.netTarget, 'AAAA');

    // Waits until both of the IP promises are settled
    const result = await Promise.allSettled([ipv4Promise, ipv6Promise]);

    // Have to set 'any' as type because it doesn't like it
    // when requesting properties from them in payload
    const ipv4: any = result[0];
    const ipv6: any = result[1];

    const payload: StandardResPayload = {
      ipv4: ipv4.value || ipv4.reason || undefined,
      ipv6: ipv6.value || ipv6.reason || undefined
    }

    res.status(200).jsonp(payload).end();

  } catch(error) {

    res.status(500).jsonp(error).end();
    
  }
});

router.get('/mx', async(req, res) => {

  try {
    const result = await getRecord(req.body.netTarget, 'MX');
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});

router.get(['/hostnames', '/reverse'], async(req, res) => {

  try {
    const result = await getHostnames(req.body.netTarget);
    res.status(200).jsonp(result).end();
  } catch(error) {
    res.status(500).jsonp(error).end();
  }

});