import { ABIPDB_KEY } from '../config/apiAccess';
import axios from 'axios';

export async function getFullReport(netTarget: string | string[]) {

  const endpoint: string = 'https://api.abuseipdb.com/api/v2/check';
  const requestConfig = {
    headers: {
      Accept: 'application/json',
      Key: ABIPDB_KEY
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
      console.log(ip);
      requestConfig.params.ipAddress = ip;
      requestPool.push(axios.get(endpoint, requestConfig));
    });

    // Waits until all the promises in the requestPool are settled
    const poolResult = await Promise.allSettled(requestPool);

    const poolProcessed = poolResult.map((result) => {

      console.log(result);
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
    const { data, status } = await axios.get(endpoint, requestConfig);
  
    if(status === 422) {
      throw new Error('A valid network target was not passed!');
    } else {
      return { 
        success: true,
        status,
        data: data.data 
      };
    }
  }

}