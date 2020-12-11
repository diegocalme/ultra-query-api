import { promisify } from 'util';
import dns from 'dns';

export const resolve = promisify(dns.resolve);
export const reverse = promisify(dns.reverse);