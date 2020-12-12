import { VTOTAL_API as API } from '../config/apiAccess';
import { createStandardRes, StandardResPayload } from '../utils/createStandardRes';
import { getBase64Trimmed } from '../utils/getBase64';
import axios from 'axios';

export async function searchAnalysis(netTarget: string, filter?: string | undefined) {

  const requestConfig = {
    headers: {
      'x-apikey': API.key
    }
  };

  try {

    // URLs must be identified by their trimmed Base64 equivalent.
    // Trimmed means that it must not have the equal (=) symbols sometimes added to pad.
    const netTargetB64 = getBase64Trimmed(netTarget);
    const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${netTargetB64}`, requestConfig);

    if(filter) {
      // If it was passed a filter, then it will only return the content of that attribute
      // as a result
      const payload = response.data.data.attributes[<string>filter];
      return createStandardRes(true, response.status, payload);

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

    if(error.response) {
      // If response is not undefined, then it is an error emitted by the destination
      // server. Meaning, (probably) nothing specific from the host of the app.
      const payload: StandardResPayload = {
        error: error.response.statusText
      }

      throw createStandardRes(false, error.response.status, payload);

    } else {

      // Probably the server has no access to the Internet, or at least to the VirusTotal
      // endpoint
      const payload: StandardResPayload = {
        error: 'An internal error happened.'
      }

      throw createStandardRes(false, 500, payload);
    }

  }
  
}