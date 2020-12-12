import { Router } from 'express';
import { router as abuseReportRouter } from './abuseReport';
import { router as dnsRouter } from './dns';
import { router as geoipRouter } from './geoip';
import { router as pingRouter } from './ping';
import { router as vtotalRouter } from './virustotal';

export const router = Router();

router.use('/abuse-report', abuseReportRouter);
router.use('/dns', dnsRouter);
router.use('/geoip', geoipRouter);
router.use('/ping', pingRouter);
router.use('/vtotal', vtotalRouter);