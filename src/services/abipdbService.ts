import { ABIPDB_API as API } from '../config/apiAccess';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import axios from 'axios';

export async function getAbuseReport(netTarget: string) {

  try {
    // Axios request config
    const requestConfig = {
      headers: {
        Accept: 'application/json',
        Key: API.key
      },
      params: {
        ipAddress: netTarget
      }
    };

    // Only a single IP was passed
    const response = await axios.get(API.endpoint, requestConfig);
    const payload: StandardResPayload = {
      ...response.data.data
    }

    return createStandardRes(true, response.status, payload);
    
  } catch(error) {

    if(error.response) {

      const payload: StandardResPayload = {
        error: error.response.statusText
      }

      throw createStandardRes(false, error.response.status, payload);

    } else {
      // Probably the server has no access to the Internet, or at least to the VirusTotal
      // endpoint
      throw createStandardRes(...PRESET_SRV_ERROR);
    }
  }

}