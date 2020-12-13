import geoip from 'geoip-lite';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { getSingleIP } from '../utils/getValidNetTarget';

export async function getGeolocation(netTarget: string) {

  try {
    const processedNetTarget = await getSingleIP(netTarget, true);
    const geolocation = geoip.lookup(processedNetTarget);
    if(geolocation) {
      return createStandardRes(true, 200, geolocation);
    } else {
      const payload: StandardResPayload = {
        error: 'IP couldn\'t be geolocated. It probably isn\'t assigned or is part of a local network.'
      }
      throw createStandardRes(false, 400, payload);
    }
  } catch(error) {

    if(error.isApiError) {
      throw error;
    } else {
      throw createStandardRes(...PRESET_SRV_ERROR);
    }

  }

}

