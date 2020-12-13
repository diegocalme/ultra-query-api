import { resolve as dnsResolve, reverse as dnsReverse } from './promiseDns';

export async function convertDomainToIp(domain: string) {
  const ipv4: any = await dnsResolve(domain, 'A');
  return ipv4[0] || undefined;
}

export async function convertIpToHostname(ip: string) {
  const hostname: any = await dnsReverse(ip);
  return hostname[0] || undefined;
}