import { VTOTAL_API as API } from '../config/apiAccess';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { getBase64Trimmed } from '../utils/getBase64';
import { getSingleNetTarget } from '../utils/getValidNetTarget';
import axios from 'axios';

const baseRequestConfig = {
  headers: {
    'x-apikey': API.key
  }
};

export async function searchAnalysis(netTarget: string, filter?: string | undefined) {

  try {

    // URLs must be identified by their trimmed Base64 equivalent.
    // Trimmed means that it must not have the equal (=) symbols sometimes added to pad.
    const processedNetTarget = await getSingleNetTarget(netTarget);
    const netTargetB64 = getBase64Trimmed(processedNetTarget);
    const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${netTargetB64}`, baseRequestConfig);

    if(filter) {
      // If it was passed a filter, then it will only return the content of that attribute
      // as a result
      if(response.data.data.attributes[<string>filter]) {
        const payload: StandardResPayload = response.data.data.attributes[<string>filter];
        return createStandardRes(true, response.status, payload);
      } else {
        const payload: StandardResPayload = {
          'error': 'The passed filter is not an existing attribute in the VirusTotal URLs API'
        };
        // ! here is a bug! you can't throw this, since you are expecting an axios error
        // when passing a non existing filter you get a 500, which is wrong!
        // VTINVFILT = Virus Total Invalid Filter, just an overcome for being able to catch this
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

      throw error;

    } else if(error.response) {
      // If response is not undefined, then it is an error emitted by the destination
      // server. Meaning, (probably) nothing specific from the host of the app.
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