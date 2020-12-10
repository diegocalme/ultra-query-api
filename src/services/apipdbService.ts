import { isIP } from 'net';
import { ABIPDB_KEY } from '../config/apiAccess';
import isDomain from '../utils/isDomain'
import axios from 'axios';

export async function getFullReport(netTarget: string) {

  if(!(isDomain(netTarget) || isIP(netTarget))) {
    // It wasn't passed a domain or IP as argument
    throw new Error('A valid network target was not passed!');
  }

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