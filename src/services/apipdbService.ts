import { ABIPDB_API as API } from '../config/apiAccess';
import devPrint from '../utils/devPrint';
import axios from 'axios';

export async function getFullReport(netTarget: string | string[]) {

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

  if(Array.isArray(netTarget)) {
    // Several IPs were passed

    let requestPool: unknown[] = [];

    // The targets were validated by middleware/allowValidNetTarget
    netTarget.forEach((ip) => {
      devPrint(ip);
      requestConfig.params.ipAddress = ip;
      requestPool.push(axios.get(API.endpoint, requestConfig));
    });

    // Waits until all the promises in the requestPool are settled
    const poolResult = await Promise.allSettled(requestPool);

    const poolProcessed = poolResult.map((result) => {

      devPrint(result);
      if(result.status === 'fulfilled') {
        return {
          success: true,
          data: result.value
        }
      } else {
        return {
          success: false,
          error: result.reason
        }
      }
    });

    return poolProcessed;

  } else {
    // Only a single IP was passed
    const { data, status } = await axios.get(API.endpoint, requestConfig);
  
    if(status === 422) {
      // Axios usually throws a 422 HTTP response when passed unvalid input,
      // at least for this API.
      throw new Error('An invalid network target was passed!');
    } else {
      return { 
        success: true,
        status,
        data: data.data 
      };
    }
  }

}