import { promisify } from 'util';
import dns from 'dns';

export interface DnsResponse {
  data?: string | string[] | object | undefined;
  code?: string | undefined;
  [propName: string]: any;
}

export const resolve = promisify(dns.resolve);
export const reverse = promisify(dns.reverse);