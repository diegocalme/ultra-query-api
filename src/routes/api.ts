import { Router } from 'express';
import { checkAuthHeader } from '../middleware/auth';
import { router as abuseReportRouter } from './abuseReport';
import { router as allRouter } from './all';
import { router as dnsRouter } from './dns';
import { router as geoipRouter } from './geoip';
import { router as virusTotalRouter } from './virustotal';

export const router = Router();

router.use(checkAuthHeader);

router.use('/', allRouter);
router.use('/abuse', abuseReportRouter);
router.use('/dns', dnsRouter);
router.use('/geolocation', geoipRouter);
router.use('/virustotal', virusTotalRouter);