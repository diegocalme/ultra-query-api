import { Router } from 'express';
import { checkAuthHeader } from '../middleware/auth';
import { router as abuseReportRouter } from './abuseReport';
import { router as allRouter } from './all';
import { router as dnsRouter } from './dns';
import { router as geoipRouter } from './geoip';
import { router as pingRouter } from './ping';
import { router as virusTotalRouter } from './virustotal';

export const router = Router();

router.use(checkAuthHeader);

router.use('/', allRouter);
router.use('/abuse-report', abuseReportRouter);
router.use('/dns', dnsRouter);
router.use('/geoip', geoipRouter);
router.use('/ping', pingRouter);
router.use('/vtotal', virusTotalRouter);