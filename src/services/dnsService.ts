import { resolve as dnsResolve, reverse as dnsReverse, DnsResponse } from '../utils/promiseDns';
import { createStandardRes, StandardResPayload, PRESET_SRV_ERROR } from '../utils/createStandardRes';
import { getSingleDomain, getSingleIP } from '../utils/getValidNetTarget';
import { TxtHttpErrors } from '../utils/httpTxtErrorsEnum';

// IMPORTANT
// The DNS calls in this file are made using a promisified version
// of the built-in dns module's methods found in utils/promiseDns

export async function getRecord(netTarget: string, dnsRecord: string) {

  try {

    const processedNetTarget = await getSingleDomain(netTarget);
    let response: DnsResponse = await dnsResolve(processedNetTarget, dnsRecord);
    return createStandardRes(true, 200, response);

  } catch(error) {

    if(error.code) {
      const httpErrorCode = TxtHttpErrors[error.code] || 400;
      const payload: StandardResPayload = {
        error: error.code
      }
      // httpErrorCode forced to be number since it comes from an enum
      throw createStandardRes(false, <number>httpErrorCode, payload);
    } else if(error.isApiError) {

      throw error;
      
    } else {
      throw createStandardRes(...PRESET_SRV_ERROR);
    }

  }
}

export async function getHostnames(netTarget: string) {

  // This function was separated from getRecords for clarity, since the
  // hostnames are not a DNS record per se. Also, because is mostly known
  // as reverse lookup.

  try {

    const processedNetTarget = await getSingleIP(netTarget, true);
    let response: DnsResponse = await dnsReverse(processedNetTarget);
    return createStandardRes(true, 200, response);

  } catch(error) {

    if(error.code) {

      const httpErrorCode = TxtHttpErrors[error.code] || 400;
      const payload: StandardResPayload = {
        error: error.code
      }
      throw createStandardRes(false, <number>httpErrorCode, payload);

    } else if(error.isApiError) {

      throw error;

    } else {

      throw createStandardRes(...PRESET_SRV_ERROR);
      
    }

  }
}