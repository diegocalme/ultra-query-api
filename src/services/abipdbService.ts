import { ABIPDB_API as API } from '../config/apiAccess';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { TxtHttpErrors } from '../utils/httpTxtErrorsEnum';
import { getSingleIP } from '../utils/getValidNetTarget';
import axios from 'axios';

export async function getAbuseReport(netTarget: string) {

  try {

    const processedNetTarget = await getSingleIP(netTarget, true);

    // Axios request config
    const requestConfig = {
      headers: {
        Accept: 'application/json',
        Key: API.key
      },
      params: {
        ipAddress: processedNetTarget
      }
    };

    // Only a single IP was passed
    const response = await axios.get(API.endpoint, requestConfig);
    const payload: StandardResPayload = {
      ...response.data.data
    }

    return createStandardRes(true, response.status, payload);
    
  } catch(error) {

    if(error.errno) {

      const httpErrorCode: any = TxtHttpErrors[error.errno] || 400;
      const payload: StandardResPayload = {
        error: error.errno
      }

      throw createStandardRes(false, httpErrorCode, payload);

    } else if(error.isApiError) {

      throw error;
      
    } else {
      // Probably the server has no access to the Internet, or at least to the VirusTotal
      // endpoint
      throw createStandardRes(...PRESET_SRV_ERROR);
    }
  }

}