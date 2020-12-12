import { VTOTAL_API as API } from '../config/apiAccess';
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
      return {
        success: true,
        status: response.status,
        data: response.data.data.attributes[<string>filter]
      };
    } else {
      // Returns all the attributes, plus the net target type and the Id.
      return {
        success: true,
        status: response.status,
        data: {
          type: response.data.data.type,
          id: response.data.data.id,
          ...response.data.data.attributes
        }
      };
    }

  } catch (error) {

    if(error.response) {
      // If response is not undefined, then it is an error emitted by the destination
      // server. Meaning, (probably) nothing specific from the host of the app.
      throw {
        success: false,
        status: error.response.status || 400,
        data: {
          error: error.response.statusText || 'An unknown error occured!'
        }
      }
    } else {
      // Probably the server has no access to the Internet, or at least to the VirusTotal
      // endpoint
      throw {
        success: false,
        status: 500,
        data: {
          error: 'An internal error happened.'
        }
      }
    }

  }
  
}