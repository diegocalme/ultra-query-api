import { resolve as dnsResolve } from './promiseDns';

export async function convertDomainToIp(domain: string) {
  const ipv4: any = await dnsResolve(domain, 'A');
  return ipv4[0] || undefined;
}