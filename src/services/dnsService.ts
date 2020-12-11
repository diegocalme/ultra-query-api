import { resolve as dnsResolve, reverse as dnsReverse } from '../utils/promiseDns';

// IMPORTANT
// The DNS calls in this file are made using a promisified
// version of the built-in dns module found in utils/promiseDns

export async function getIpv4(domain: string) {
  return await dnsResolve(domain, 'A');
}

export async function getIpv6(domain: string) {
  return await dnsResolve(domain, 'AAAA');
}

export async function getHostnames(ipAddress: string) {
  return await dnsReverse(ipAddress);
}

export async function getMx(domain: string) {
  return await dnsResolve(domain, 'MX');
}