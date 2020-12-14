import { ABIPDB_API as API } from '../config/apiAccess';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { TxtHttpErrors } from '../utils/httpTxtErrorsEnum';
import { getSingleIP } from '../utils/getValidNetTarget';
import axios from 'axios';

export async function getAbuseReport(netTarget: string) {

  try {

    // Allows only for a single IP
    // getSingleIP will verify that the input is an IP, and if it's a domain then
    // it will attempt to get the first entry of its 'A' DNS record.
    const processedNetTarget = await getSingleIP(netTarget, true);

    const axiosRequestConfig = {
      headers: {
        Accept: 'application/json',
        Key: API.key
      },
      params: {
        ipAddress: processedNetTarget
      }
    };

    const apiResponse = await axios.get(API.endpoint, axiosRequestConfig);

    const payload: StandardResPayload = {
      ...apiResponse.data.data
    }

    return createStandardRes(true, apiResponse.status, payload);
    
  } catch(error) {

    if(error.response) {

      // Something went wrong in the request to the endpoint
      const payload: StandardResPayload = error.response.statusText;
      throw createStandardRes(false, error.response.status, payload);

    } else if(error.errno) {

      // The domain-to-IP conversion failed (DNS error)
      const httpErrorCode: any = TxtHttpErrors[error.errno] || 400;
      const payload: StandardResPayload = {
        error: error.errno
      }
      throw createStandardRes(false, httpErrorCode, payload);

    } else if(error.isApiError) {

      // Something threw an error generated with createStandardRes and marked
      // as an API error
      throw error;
      
    } else {
      // Probably the server has no access to the Internet, or at least to the AbuseIPDB
      // endpoint
      throw createStandardRes(...PRESET_SRV_ERROR);
    }
  }

}