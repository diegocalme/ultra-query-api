import { getRecord } from '../services/dnsService';

export async function convertDomainToIp(domain: string) {
  const ipv4: any = await getRecord(domain, 'A');
  return ipv4[0] || undefined;
}