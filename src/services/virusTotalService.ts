import { VTOTAL_API as API } from '../config/apiAccess';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { verifyApiKeyExistance } from '../utils/verifyApiKeys';
import { getBase64Trimmed } from '../utils/getBase64';
import { getSingleNetTarget } from '../utils/getValidNetTarget';
import axios from 'axios';

const axiosBaseRequestConfig = {
  headers: {
    'x-apikey': API.key
  }
};

export async function getAnalysis(netTarget: string, filter?: string | undefined) {

  try {

    verifyApiKeyExistance(API.key);

    // URLs must be identified by their trimmed Base64 equivalent.
    // Trimmed means that it must not have the equal (=) symbols sometimes added to pad.
    const processedNetTarget = await getSingleNetTarget(netTarget);
    const netTargetB64 = getBase64Trimmed(processedNetTarget);
    const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${netTargetB64}`, axiosBaseRequestConfig);

    if(filter && typeof(filter) === 'string') {

      // If it was passed a filter, then it will only return the content of that attribute as a result
      if(response.data.data.attributes[<string>filter]) {

        const payload: StandardResPayload = response.data.data.attributes[<string>filter];
        return createStandardRes(true, response.status, payload);

      } else {

        const payload: StandardResPayload = {
          'error': 'The passed filter is not an existing attribute in the VirusTotal URLs API'
        };
        throw createStandardRes(false, 400, payload, true);

      }
      
    } else {

      // Returns all the attributes, plus the net target type and the Id.
      const payload: StandardResPayload = {
        type: response.data.data.type,
        id: response.data.data.id,
        ...response.data.data.attributes
      }

      return createStandardRes(true, response.status, payload);

    }

  } catch (error) {

    if(error.isApiError) {

      // Something threw an error generated with createStandardRes and marked
      // as an API error
      throw error;

    } else if(error.response) {

      // Request to VirusTotal API failed
      const payload: StandardResPayload = {
        error: error.response.statusText
      }
      throw createStandardRes(false, error.response.status, payload);

    } else {

      // Probably the server has no access to the Internet, or at least to the VirusTotal endpoint
      throw createStandardRes(...PRESET_SRV_ERROR);

    }

  }
  
}