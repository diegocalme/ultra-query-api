import geoip from 'geoip-lite';

export async function getGeolocation(netTarget: string) {
  return {... geoip.lookup(netTarget)};
}