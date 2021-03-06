import geoip from 'geoip-lite';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { TxtHttpErrors } from '../utils/httpTxtErrorsEnum';
import { getSingleIP } from '../utils/getValidNetTarget';

export async function getGeolocation(netTarget: string) {

  try {

    const processedNetTarget = await getSingleIP(netTarget, true);

    const geolocationRes = geoip.lookup(processedNetTarget);

    if(geolocationRes) {
      return createStandardRes(true, 200, geolocationRes);
    } else {
      const payload: StandardResPayload = {
        error: 'IP couldn\'t be geolocated. It probably isn\'t assigned or is part of a local network.'
      }
      throw createStandardRes(false, 400, payload, true);
    }

  } catch(error) {

    if(error.code) {

      // Since it's doing a DNS request at the start, that section can throw an error...
      const httpErrorCode = TxtHttpErrors[error.code] || 400;
      const payload: StandardResPayload = {
        error: error.code
      }

      throw createStandardRes(false, <number>httpErrorCode, payload);

    } else if(error.isApiError) {

      // Something threw an error generated with createStandardRes and marked
      // as an API error
      throw error;

    } else {

      throw createStandardRes(...PRESET_SRV_ERROR);

    }

  }

}

