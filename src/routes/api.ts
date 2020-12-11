import { Router } from 'express';
import { router as abuseReportRouter } from './abuseReport';
import { router as dnsRouter } from './dns';

export const router = Router();

router.use('/abuse-report', abuseReportRouter);
router.use('/dns', dnsRouter);