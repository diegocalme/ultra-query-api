import { promisify } from 'util';
import dns from 'dns';

export enum DnsHttpErrors {
  ENODATA = 500,
  ESERVFAIL = 500,
  ENOTFOUND = 404,
  EREFUSED = 403,
  EBADQUERY = 400,
  ECONNREFUSED = 503,
  ETIMEOUT = 504,
  EBADSTR = 400
}

export interface DnsResponse {
  data?: string | string[] | object | undefined;
  code?: string | undefined;
  [propName: string]: any;
}

export const resolve = promisify(dns.resolve);
export const reverse = promisify(dns.reverse);