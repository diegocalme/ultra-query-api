import geoip from 'geoip-lite';
import { createStandardRes, StandardResPayload } from '../utils/createStandardRes';

export async function getGeolocation(netTarget: string) {
  const geolocation = geoip.lookup(netTarget);
  if(geolocation) {
    return createStandardRes(true, 200, geolocation);
  } else {
    const payload: StandardResPayload = {
      error: 'IP couldn\'t be geolocated. It probably isn\'t assigned or is part of a local network.'
    }
    throw createStandardRes(false, 400, payload);
  }
}